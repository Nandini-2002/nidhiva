import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Room } from "@/lib/rooms";

const GUEST_ID = "local-guest";
const COLLECTION = "sharedRooms";

function plainRoom(room: Room): Room {
  return JSON.parse(JSON.stringify(room)) as Room;
}

export function encodeRoom(room: Room) {
  const bytes = new TextEncoder().encode(JSON.stringify(plainRoom(room)));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeRoom(token: string): Room | null {
  try {
    const base = token.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base + "=".repeat((4 - (base.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const room = JSON.parse(new TextDecoder().decode(bytes)) as Room;
    if (!room?.id || !room.name || !Array.isArray(room.members)) return null;
    return room;
  } catch {
    return null;
  }
}

export function roomInviteUrl(room: Room) {
  const params = new URLSearchParams({
    room: room.id,
    invite: encodeRoom(room),
  });
  return `${window.location.origin}/splits?${params.toString()}`;
}

export function copyTextNow(text: string) {
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.left = "0";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.focus();
    area.select();
    area.setSelectionRange(0, area.value.length);
    const ok = document.execCommand("copy");
    area.remove();
    if (ok) return true;
  } catch {
    /* clipboard below */
  }
  if (navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(text);
    return true;
  }
  return false;
}

export function withMembership(userId: string, room: Room): Room {
  const memberIds = Array.from(new Set([...(room.memberIds ?? []), userId]));
  return {
    ...room,
    ownerId: room.ownerId || userId,
    memberIds,
    updatedAt: new Date().toISOString(),
  };
}

export async function publishRoom(userId: string, room: Room): Promise<Room | null> {
  if (!db || !userId || userId === GUEST_ID) return null;
  const next = { ...withMembership(userId, room), shared: true };
  try {
    await Promise.race([
      setDoc(doc(db, COLLECTION, room.id), plainRoom(next)),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 4000)),
    ]);
    return next;
  } catch {
    return null;
  }
}

export async function joinSharedRoom(userId: string, roomId: string): Promise<Room | null> {
  if (!db || !userId || userId === GUEST_ID) return null;
  try {
    const ref = doc(db, COLLECTION, roomId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const next = { ...withMembership(userId, snap.data() as Room), shared: true };
    await setDoc(ref, plainRoom(next));
    return next;
  } catch {
    return null;
  }
}

export function subscribeSharedRooms(
  userId: string,
  onRooms: (rooms: Room[]) => void,
) {
  if (!db || !userId || userId === GUEST_ID) return () => {};
  const roomsQuery = query(
    collection(db, COLLECTION),
    where("memberIds", "array-contains", userId),
  );
  return onSnapshot(
    roomsQuery,
    (snap) => {
      onRooms(snap.docs.map((item) => item.data() as Room));
    },
    () => {},
  );
}

export async function deleteSharedRoom(roomId: string) {
  if (!db) return;
  try {
    await deleteDoc(doc(db, COLLECTION, roomId));
  } catch {
    /* local copy is already gone */
  }
}

export function mergeSharedRooms(local: Room[], remote: Room[]) {
  const remoteIds = new Set(remote.map((room) => room.id));
  const byId = new Map<string, Room>();
  for (const room of local) {
    if (room.shared && !remoteIds.has(room.id)) continue;
    byId.set(room.id, room);
  }
  for (const room of remote) {
    const current = byId.get(room.id);
    if (!current || (room.updatedAt ?? "") >= (current.updatedAt ?? "")) {
      byId.set(room.id, room);
    }
  }
  return [...byId.values()].sort((a, b) =>
    (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt),
  );
}
