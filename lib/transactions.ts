import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getIdToken } from "@/lib/auth-token";
import { db } from "@/lib/firebase/client";
import { toDateKey } from "@/lib/format";
import type {
  CreateTransactionInput,
  Transaction,
  TransactionFilters,
  UpdateTransactionInput,
} from "@/lib/types";

const LOCAL_PREFIX = "nidhiva:transactions:";
const GUEST_ID = "local-guest";

function localKey(userId: string) {
  return `${LOCAL_PREFIX}${userId}`;
}

function readLocal(userId: string): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(localKey(userId));
    return raw ? (JSON.parse(raw) as Transaction[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(userId: string, items: Transaction[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(localKey(userId), JSON.stringify(items));
}

function newId() {
  return crypto.randomUUID();
}

function withTimeout<T>(promise: Promise<T>, ms = 4000): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

export function filterTransactions(
  items: Transaction[],
  filters: TransactionFilters = {},
): Transaction[] {
  return items
    .filter((tx) => {
      if (filters.type && filters.type !== "all" && tx.type !== filters.type) {
        return false;
      }
      if (filters.categoryId && tx.categoryId !== filters.categoryId) {
        return false;
      }
      if (filters.from && tx.date < filters.from) return false;
      if (filters.to && tx.date > filters.to) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const hay = `${tx.note ?? ""} ${tx.categoryId}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    })
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
    );
}

async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response | null> {
  const token = await getIdToken();
  if (!token) return null;
  try {
    const res = await withTimeout(
      fetch(path, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(init.headers ?? {}),
        },
      }),
      5000,
    );
    return res;
  } catch {
    return null;
  }
}

async function listViaAdminApi(
  filters: TransactionFilters,
): Promise<Transaction[] | null> {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);

  const res = await apiFetch(`/api/transactions?${params.toString()}`);
  if (!res || !res.ok) return null;
  const data = await res.json();
  return (data.transactions as Transaction[]) ?? [];
}

async function syncFromFirestore(userId: string): Promise<Transaction[] | null> {
  if (!db || userId === GUEST_ID) return null;
  try {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
      orderBy("date", "desc"),
    );
    const snap = await withTimeout(getDocs(q), 4000);
    if (!snap) return null;
    const items = snap.docs.map((d) => d.data() as Transaction);
    writeLocal(userId, items);
    return items;
  } catch {
    return null;
  }
}

async function persistRemote(tx: Transaction) {
  if (!db || tx.userId === GUEST_ID) return;
  try {
    await withTimeout(setDoc(doc(db, "transactions", tx.id), tx), 3000);
  } catch {
    /* local-only fallback */
  }
}

async function deleteRemote(userId: string, id: string) {
  if (!db || userId === GUEST_ID) return;
  try {
    await withTimeout(deleteDoc(doc(db, "transactions", id)), 3000);
  } catch {
    /* local-only fallback */
  }
}

export async function listTransactions(
  userId: string,
  filters: TransactionFilters = {},
): Promise<Transaction[]> {
  if (userId !== GUEST_ID) {
    const viaApi = await listViaAdminApi(filters);
    if (viaApi) {
      writeLocal(userId, viaApi);
      return filterTransactions(viaApi, { search: filters.search });
    }

    const remote = await syncFromFirestore(userId);
    if (remote) return filterTransactions(remote, filters);
  }

  return filterTransactions(readLocal(userId), filters);
}

export async function createTransaction(
  userId: string,
  input: CreateTransactionInput,
): Promise<Transaction> {
  if (userId !== GUEST_ID) {
    const res = await apiFetch("/api/transactions", {
      method: "POST",
      body: JSON.stringify(input),
    });

    if (res?.ok) {
      const data = await res.json();
      const tx = data.transaction as Transaction;
      const items = readLocal(userId);
      items.unshift(tx);
      writeLocal(userId, items);
      return tx;
    }
  }

  const now = new Date().toISOString();
  const tx: Transaction = {
    id: newId(),
    userId,
    type: input.type,
    amount: input.amount,
    categoryId: input.categoryId,
    subcategoryId: input.subcategoryId,
    note: input.note?.trim() || undefined,
    date: toDateKey(input.date),
    createdAt: now,
    updatedAt: now,
    recurring: input.recurring,
    split: input.split,
  };

  const items = readLocal(userId);
  items.unshift(tx);
  writeLocal(userId, items);
  await persistRemote(tx);
  return tx;
}

export async function updateTransaction(
  userId: string,
  input: UpdateTransactionInput,
): Promise<Transaction | null> {
  if (userId !== GUEST_ID) {
    const res = await apiFetch("/api/transactions", {
      method: "PATCH",
      body: JSON.stringify(input),
    });

    if (res?.ok) {
      const data = await res.json();
      const next = data.transaction as Transaction;
      const items = readLocal(userId);
      const idx = items.findIndex((t) => t.id === next.id);
      if (idx >= 0) items[idx] = next;
      else items.unshift(next);
      writeLocal(userId, items);
      return next;
    }
  }

  const items = readLocal(userId);
  const idx = items.findIndex((t) => t.id === input.id);
  if (idx < 0) return null;

  const next: Transaction = {
    ...items[idx],
    ...input,
    date: input.date ? toDateKey(input.date) : items[idx].date,
    updatedAt: new Date().toISOString(),
  };
  items[idx] = next;
  writeLocal(userId, items);
  await persistRemote(next);
  return next;
}

export async function deleteTransaction(
  userId: string,
  id: string,
): Promise<boolean> {
  if (userId !== GUEST_ID) {
    const res = await apiFetch(`/api/transactions?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (res?.ok) {
      writeLocal(
        userId,
        readLocal(userId).filter((t) => t.id !== id),
      );
      return true;
    }
  }

  const items = readLocal(userId);
  const next = items.filter((t) => t.id !== id);
  if (next.length === items.length) return false;
  writeLocal(userId, next);
  await deleteRemote(userId, id);
  return true;
}
