export type RoomCategory =
  | "rent"
  | "food"
  | "groceries"
  | "utilities"
  | "travel"
  | "other";

export interface RoomMember {
  id: string;
  name: string;
  color: string;
}

export interface RoomExpense {
  id: string;
  title: string;
  amount: number;
  category: RoomCategory;
  date: string;
  paidBy: string;
  splitAmong: string[];
  method: "equal" | "custom";
  shares?: Record<string, number>;
}

export interface RoomSettlement {
  id: string;
  fromId: string;
  toId: string;
  amount: number;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  members: RoomMember[];
  expenses: RoomExpense[];
  settlements: RoomSettlement[];
  createdAt: string;
  updatedAt?: string;
  ownerId?: string;
  /** Signed-in accounts that can open this room from the invite link. */
  memberIds?: string[];
  shared?: boolean;
}

export const ROOM_CATEGORIES: { id: RoomCategory; label: string }[] = [
  { id: "rent", label: "Rent" },
  { id: "food", label: "Food" },
  { id: "groceries", label: "Groceries" },
  { id: "utilities", label: "Utilities" },
  { id: "travel", label: "Travel" },
  { id: "other", label: "Other" },
];

export const MEMBER_COLORS = [
  "#4f46e5",
  "#0f766e",
  "#7c6bb5",
  "#e11d48",
  "#4338ca",
  "#0d5c56",
  "#a78bfa",
  "#be123c",
];

const KEY = "nidhiva:rooms:";

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function read(userId: string): Room[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY + userId);
    return raw ? (JSON.parse(raw) as Room[]) : [];
  } catch {
    return [];
  }
}

function write(userId: string, rooms: Room[]) {
  localStorage.setItem(KEY + userId, JSON.stringify(rooms));
}

export function listRooms(userId: string) {
  return read(userId);
}

export function saveRoom(userId: string, room: Room) {
  const rooms = read(userId);
  const index = rooms.findIndex((item) => item.id === room.id);
  if (index >= 0) rooms[index] = room;
  else rooms.unshift(room);
  write(userId, rooms);
  return room;
}

export function deleteRoom(userId: string, roomId: string) {
  write(
    userId,
    read(userId).filter((room) => room.id !== roomId),
  );
}

export function expenseShares(expense: RoomExpense) {
  const people = expense.splitAmong;
  const shares: Record<string, number> = {};
  if (!people.length) return shares;
  if (expense.method === "custom" && expense.shares) {
    for (const id of people) shares[id] = roundMoney(expense.shares[id] ?? 0);
    return shares;
  }
  const each = roundMoney(expense.amount / people.length);
  let assigned = 0;
  people.forEach((id, index) => {
    const value =
      index === people.length - 1
        ? roundMoney(expense.amount - assigned)
        : each;
    assigned = roundMoney(assigned + value);
    shares[id] = value;
  });
  return shares;
}

export interface MemberLedger {
  id: string;
  name: string;
  color: string;
  paid: number;
  share: number;
  net: number;
}

export function roomLedger(room: Room): MemberLedger[] {
  return room.members.map((member) => {
    let paid = 0;
    let share = 0;
    for (const expense of room.expenses) {
      if (expense.paidBy === member.id) paid += expense.amount;
      share += expenseShares(expense)[member.id] ?? 0;
    }
    let settledPaid = 0;
    let settledReceived = 0;
    for (const payment of room.settlements) {
      if (payment.fromId === member.id) settledPaid += payment.amount;
      if (payment.toId === member.id) settledReceived += payment.amount;
    }
    return {
      id: member.id,
      name: member.name,
      color: member.color,
      paid: roundMoney(paid),
      share: roundMoney(share),
      net: roundMoney(paid - share + settledPaid - settledReceived),
    };
  });
}

export interface SettlementSuggestion {
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  amount: number;
}

export function suggestSettlements(room: Room): SettlementSuggestion[] {
  const ledger = roomLedger(room);
  const names = Object.fromEntries(room.members.map((member) => [member.id, member.name]));
  const creditors = ledger
    .filter((row) => row.net > 0.009)
    .map((row) => ({ id: row.id, left: row.net }))
    .sort((a, b) => b.left - a.left);
  const debtors = ledger
    .filter((row) => row.net < -0.009)
    .map((row) => ({ id: row.id, left: -row.net }))
    .sort((a, b) => b.left - a.left);

  const payments: SettlementSuggestion[] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;
  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const amount = roundMoney(
      Math.min(debtors[debtorIndex].left, creditors[creditorIndex].left),
    );
    if (amount > 0) {
      payments.push({
        fromId: debtors[debtorIndex].id,
        toId: creditors[creditorIndex].id,
        fromName: names[debtors[debtorIndex].id] ?? "Someone",
        toName: names[creditors[creditorIndex].id] ?? "Someone",
        amount,
      });
    }
    debtors[debtorIndex].left = roundMoney(debtors[debtorIndex].left - amount);
    creditors[creditorIndex].left = roundMoney(
      creditors[creditorIndex].left - amount,
    );
    if (debtors[debtorIndex].left <= 0.009) debtorIndex += 1;
    if (creditors[creditorIndex].left <= 0.009) creditorIndex += 1;
  }
  return payments;
}

export function categoryTotals(room: Room) {
  const totals: Record<RoomCategory, number> = {
    rent: 0,
    food: 0,
    groceries: 0,
    utilities: 0,
    travel: 0,
    other: 0,
  };
  for (const expense of room.expenses) totals[expense.category] += expense.amount;
  return totals;
}

export function createRoom(name: string, memberNames: string[]): Room {
  const members = memberNames
    .map((memberName) => memberName.trim())
    .filter(Boolean)
    .map((memberName, index) => ({
      id: crypto.randomUUID(),
      name: memberName,
      color: MEMBER_COLORS[index % MEMBER_COLORS.length],
    }));
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    members,
    expenses: [],
    settlements: [],
    createdAt: now,
    updatedAt: now,
  };
}
