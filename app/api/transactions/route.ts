import { NextResponse } from "next/server";
import {
  getAdminDb,
  getAdminInitError,
  verifyBearerToken,
} from "@/lib/firebase/admin";
import { toDateKey } from "@/lib/format";
import { validateTransactionInput } from "@/lib/validations/transaction";
import type { CreateTransactionInput, Transaction } from "@/lib/types";

async function requireUser(request: Request) {
  try {
    const decoded = await verifyBearerToken(
      request.headers.get("authorization"),
    );
    return { uid: decoded.uid, email: decoded.email };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    const status = message.includes("not configured") ? 501 : 401;
    return { error: NextResponse.json({ error: message }, { status }) };
  }
}

export async function GET(request: Request) {
  const user = await requireUser(request);
  if ("error" in user) return user.error;

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json(
      { error: getAdminInitError() ?? "Firestore unavailable" },
      { status: 501 },
    );
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const categoryId = searchParams.get("categoryId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const snap = await db
    .collection("transactions")
    .where("userId", "==", user.uid)
    .orderBy("date", "desc")
    .get();

  let transactions = snap.docs.map((d) => d.data() as Transaction);

  if (type && type !== "all") {
    transactions = transactions.filter((t) => t.type === type);
  }
  if (categoryId) {
    transactions = transactions.filter((t) => t.categoryId === categoryId);
  }
  if (from) transactions = transactions.filter((t) => t.date >= from);
  if (to) transactions = transactions.filter((t) => t.date <= to);

  return NextResponse.json({ ok: true, transactions });
}

export async function POST(request: Request) {
  const user = await requireUser(request);
  if ("error" in user) return user.error;

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json(
      { error: getAdminInitError() ?? "Firestore unavailable" },
      { status: 501 },
    );
  }

  const body = (await request.json()) as CreateTransactionInput;
  const result = validateTransactionInput(body);
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  const now = new Date().toISOString();
  const ref = db.collection("transactions").doc();
  const tx: Transaction = {
    id: ref.id,
    userId: user.uid,
    type: body.type,
    amount: body.amount,
    categoryId: body.categoryId,
    subcategoryId: body.subcategoryId,
    note: body.note?.trim() || undefined,
    date: toDateKey(body.date),
    createdAt: now,
    updatedAt: now,
    recurring: body.recurring,
    split: body.split,
  };

  await ref.set(tx);
  return NextResponse.json({ ok: true, transaction: tx }, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await requireUser(request);
  if ("error" in user) return user.error;

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json(
      { error: getAdminInitError() ?? "Firestore unavailable" },
      { status: 501 },
    );
  }

  const body = await request.json();
  const id = body?.id as string | undefined;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const ref = db.collection("transactions").doc(id);
  const snap = await ref.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existing = snap.data() as Transaction;
  if (existing.userId !== user.uid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: _id, userId: _userId, createdAt: _createdAt, ...rest } = body;
  const next: Transaction = {
    ...existing,
    ...rest,
    date: rest.date ? toDateKey(rest.date) : existing.date,
    updatedAt: new Date().toISOString(),
  };

  await ref.set(next);
  return NextResponse.json({ ok: true, transaction: next });
}

export async function DELETE(request: Request) {
  const user = await requireUser(request);
  if ("error" in user) return user.error;

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json(
      { error: getAdminInitError() ?? "Firestore unavailable" },
      { status: 501 },
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const ref = db.collection("transactions").doc(id);
  const snap = await ref.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existing = snap.data() as Transaction;
  if (existing.userId !== user.uid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await ref.delete();
  return NextResponse.json({ ok: true });
}
