"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RoomBoard } from "@/components/splits/RoomBoard";
import { PageHero } from "@/components/ui/PageHero";
import { useAuth } from "@/context/AuthContext";
import { deleteRoom, listRooms, saveRoom, type Room } from "@/lib/rooms";
import {
  decodeRoom,
  deleteSharedRoom,
  joinSharedRoom,
  mergeSharedRooms,
  publishRoom,
  subscribeSharedRooms,
  withMembership,
} from "@/lib/shared-rooms";

export default function SplitsPage() {
  const { userId, isGuest } = useAuth();
  const params = useSearchParams();
  const roomParam = params.get("room");
  const inviteToken = params.get("invite");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!userId) return;
    const stored = listRooms(userId);
    setRooms(stored);
    setActiveId((current) => current ?? stored[0]?.id ?? null);
  }, [userId]);

  useEffect(() => {
    if (!userId || isGuest) return;
    return subscribeSharedRooms(userId, (remote) => {
      const merged = mergeSharedRooms(listRooms(userId), remote);
      for (const room of merged) saveRoom(userId, room);
      const remoteIds = new Set(remote.map((room) => room.id));
      for (const room of listRooms(userId)) {
        if (room.shared && !remoteIds.has(room.id)) deleteRoom(userId, room.id);
      }
      const next = listRooms(userId);
      setRooms(next);
      setActiveId((current) =>
        current && next.some((room) => room.id === current)
          ? current
          : (next[0]?.id ?? null),
      );
    });
  }, [userId, isGuest]);

  useEffect(() => {
    if (!userId || !roomParam) return;
    const fromLink = inviteToken ? decodeRoom(inviteToken) : null;
    if (fromLink && fromLink.id === roomParam) {
      saveRoom(userId, fromLink);
      setRooms(listRooms(userId));
      setActiveId(fromLink.id);
      setNotice("Shared room opened.");
      const clean = new URL(window.location.href);
      clean.searchParams.delete("invite");
      clean.hash = "";
      window.history.replaceState(null, "", `${clean.pathname}${clean.search}`);
    }
    if (isGuest) return;
    let cancelled = false;
    void joinSharedRoom(userId, roomParam).then((joined) => {
      if (cancelled || !joined) return;
      saveRoom(userId, joined);
      setRooms(listRooms(userId));
      setActiveId(joined.id);
      setNotice("Shared room opened.");
    });
    return () => {
      cancelled = true;
    };
  }, [userId, isGuest, roomParam, inviteToken]);

  function persist(next: Room) {
    if (!userId) return;
    const stamped = isGuest
      ? { ...next, updatedAt: new Date().toISOString() }
      : withMembership(userId, next);
    saveRoom(userId, stamped);
    setRooms(listRooms(userId));
    setActiveId(stamped.id);
    if (!isGuest) {
      void publishRoom(userId, stamped).then((saved) => {
        if (!saved) return;
        saveRoom(userId, saved);
        setRooms(listRooms(userId));
      });
    }
  }

  function remove(id: string) {
    if (!userId) return;
    deleteRoom(userId, id);
    void deleteSharedRoom(id);
    const stored = listRooms(userId);
    setRooms(stored);
    setActiveId(stored[0]?.id ?? null);
  }

  async function invite(room: Room) {
    if (!userId || isGuest) return;
    const saved = await publishRoom(userId, room);
    if (!saved) return;
    saveRoom(userId, saved);
    setRooms(listRooms(userId));
  }

  return (
    <div className="stagger space-y-5">
      <PageHero
        kicker="Shared living"
        title="Room splits"
        subtitle="Rent and every other bill in one place. See who paid, each share, and the shortest way to settle."
      />
      {notice ? (
        <p className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[var(--color-ink)]">
          {notice}
        </p>
      ) : null}
      <RoomBoard
        rooms={rooms}
        activeId={activeId}
        onSelect={setActiveId}
        onChange={persist}
        onCreate={persist}
        onDelete={remove}
        onInvite={(room) => {
          void invite(room);
        }}
      />
    </div>
  );
}
