"use client";

import { useEffect, useState } from "react";
import { RoomBoard } from "@/components/splits/RoomBoard";
import { PageHero } from "@/components/ui/PageHero";
import { useAuth } from "@/context/AuthContext";
import { deleteRoom, listRooms, saveRoom, type Room } from "@/lib/rooms";

export default function SplitsPage() {
  const { userId } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const stored = listRooms(userId);
    setRooms(stored);
    setActiveId(stored[0]?.id ?? null);
  }, [userId]);

  function persist(next: Room) {
    if (!userId) return;
    saveRoom(userId, next);
    setRooms(listRooms(userId));
    setActiveId(next.id);
  }

  function remove(id: string) {
    if (!userId) return;
    deleteRoom(userId, id);
    const stored = listRooms(userId);
    setRooms(stored);
    setActiveId(stored[0]?.id ?? null);
  }

  return (
    <div className="stagger space-y-5">
      <PageHero
        kicker="Shared living"
        title="Room splits"
        subtitle="Rent and every other bill in one place. See who paid, each share, and the shortest way to settle."
      />
      <RoomBoard
        rooms={rooms}
        activeId={activeId}
        onSelect={setActiveId}
        onChange={persist}
        onCreate={persist}
        onDelete={remove}
      />
    </div>
  );
}
