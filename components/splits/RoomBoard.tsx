"use client";

import { useMemo, useState } from "react";
import { formatCurrency, toDateKey } from "@/lib/format";
import {
  ROOM_CATEGORIES,
  categoryTotals,
  createRoom,
  expenseShares,
  roomLedger,
  suggestSettlements,
  type Room,
  type RoomCategory,
  type RoomExpense,
} from "@/lib/rooms";

const emptyFriends = ["", ""];

export function RoomBoard({
  rooms,
  activeId,
  onSelect,
  onChange,
  onCreate,
  onDelete,
}: {
  rooms: Room[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onChange: (room: Room) => void;
  onCreate: (room: Room) => void;
  onDelete: (id: string) => void;
}) {
  const room = rooms.find((item) => item.id === activeId) ?? null;

  if (!room) {
    return (
      <CreateRoom
        onCreate={(name, members) => onCreate(createRoom(name, members))}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {rooms.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              item.id === room.id
                ? "bg-white text-[var(--color-purple)] shadow-md"
                : "bg-white/35 text-white hover:bg-white/50"
            }`}
          >
            {item.name}
          </button>
        ))}
        <CreateRoom
          compact
          onCreate={(name, members) => onCreate(createRoom(name, members))}
        />
      </div>

      <RoomView room={room} onChange={onChange} onDelete={onDelete} />
    </div>
  );
}

function CreateRoom({
  onCreate,
  compact,
}: {
  onCreate: (name: string, members: string[]) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(!compact);
  const [name, setName] = useState("");
  const [members, setMembers] = useState(emptyFriends);
  const [error, setError] = useState("");

  function submit(event?: React.FormEvent) {
    event?.preventDefault();
    const named = members.map((member) => member.trim()).filter(Boolean);
    if (name.trim().length < 2) {
      setError("Give the room a name.");
      return;
    }
    if (named.length < 2) {
      setError("Add at least two people, including you.");
      return;
    }
    onCreate(name, named);
    setName("");
    setMembers(emptyFriends);
    setError("");
    setOpen(false);
  }

  if (compact && !open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white"
      >
        + New room
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="tint-card space-y-3 p-5">
      <div>
        <h2 className="text-lg font-bold">
          {compact ? "New room" : "Start a shared room"}
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Rent, food, groceries and every other bill. Add who paid, and Nidhiva
          works out each person’s share.
        </p>
      </div>
      <input
        className="field"
        placeholder="Room name, e.g. Hyderabad flat"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <div className="space-y-2">
        {members.map((member, index) => (
          <div key={index} className="flex gap-2">
            <input
              className="field"
              placeholder={index === 0 ? "Your name" : `Friend ${index}`}
              value={member}
              onChange={(event) => {
                const next = [...members];
                next[index] = event.target.value;
                setMembers(next);
              }}
            />
            {index > 0 ? (
              <button
                type="button"
                className="shrink-0 rounded-xl px-3 text-sm font-semibold text-rose-600"
                onClick={() =>
                  setMembers(members.filter((_, itemIndex) => itemIndex !== index))
                }
              >
                Remove
              </button>
            ) : null}
          </div>
        ))}
        <button
          type="button"
          className="text-sm font-semibold text-[var(--color-purple)]"
          onClick={() => setMembers([...members, ""])}
        >
          + Add another person
        </button>
      </div>
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      <div className="flex gap-2">
        <button type="button" className="hero-btn" onClick={submit}>
          Create room
        </button>
        {compact ? (
          <button
            type="button"
            className="rounded-xl px-4 py-2 text-sm font-semibold"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

function RoomView({
  room,
  onChange,
  onDelete,
}: {
  room: Room;
  onChange: (room: Room) => void;
  onDelete: (id: string) => void;
}) {
  const [memberError, setMemberError] = useState("");
  const ledger = useMemo(() => roomLedger(room), [room]);
  const plan = useMemo(() => suggestSettlements(room), [room]);
  const totals = useMemo(() => categoryTotals(room), [room]);
  const spent = room.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const maxCategory = Math.max(...Object.values(totals), 1);

  function addExpense(expense: RoomExpense) {
    onChange({ ...room, expenses: [expense, ...room.expenses] });
  }

  function removeExpense(id: string) {
    onChange({
      ...room,
      expenses: room.expenses.filter((expense) => expense.id !== id),
    });
  }

  function removeMember(id: string) {
    if (room.members.length <= 2) {
      setMemberError("Keep at least two people in the room.");
      return;
    }
    const paidSomething = room.expenses.some((expense) => expense.paidBy === id);
    const inASettlement = room.settlements.some(
      (payment) => payment.fromId === id || payment.toId === id,
    );
    if (paidSomething || inASettlement) {
      setMemberError("This person paid a bill or a settlement. Clear that first.");
      return;
    }
    setMemberError("");
    onChange({
      ...room,
      members: room.members.filter((member) => member.id !== id),
      expenses: room.expenses.map((expense) => {
        const splitAmong = expense.splitAmong.filter((personId) => personId !== id);
        return {
          ...expense,
          splitAmong: splitAmong.length ? splitAmong : expense.splitAmong,
          method: "equal" as const,
          shares: undefined,
        };
      }),
    });
  }

  function markPaid(fromId: string, toId: string, amount: number) {
    onChange({
      ...room,
      settlements: [
        {
          id: crypto.randomUUID(),
          fromId,
          toId,
          amount,
          createdAt: new Date().toISOString(),
        },
        ...room.settlements,
      ],
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Room total" value={formatCurrency(spent)} tone="bg-[var(--color-sage)]" />
        <Stat
          label="People"
          value={String(room.members.length)}
          tone="bg-[var(--color-purple)]"
        />
        <Stat
          label="Open payments"
          value={String(plan.length)}
          tone="bg-[var(--color-sage-deep)]"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <ExpenseForm key={room.id} room={room} onAdd={addExpense} />
        <section className="tint-card p-5">
          <h2 className="text-lg font-bold">Who settles with whom</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Fewest transfers so the room comes out even. Positive means the
            room owes that person.
          </p>
          <ul className="mt-4 space-y-2">
            {ledger.map((row) => (
              <li key={row.id} className="rounded-2xl bg-white/70 px-3 py-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 font-semibold">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: row.color }}
                    />
                    {row.name}
                  </span>
                  <span
                    className={`font-bold ${
                      row.net > 0.009
                        ? "text-[var(--color-sage)]"
                        : row.net < -0.009
                          ? "text-rose-600"
                          : "text-[var(--color-muted)]"
                    }`}
                  >
                    {row.net > 0.009 ? "+" : ""}
                    {formatCurrency(row.net)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="text-xs text-[var(--color-muted)]">
                    Paid {formatCurrency(row.paid)} · share {formatCurrency(row.share)}
                  </p>
                  <button
                    type="button"
                    className="text-xs font-semibold text-rose-600"
                    onClick={() => removeMember(row.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {memberError ? (
            <p className="mt-3 text-sm font-medium text-rose-600">{memberError}</p>
          ) : null}
          <div className="mt-4 space-y-2">
            {plan.length === 0 ? (
              <p className="rounded-2xl bg-[var(--color-sage-soft)] px-3 py-3 text-sm font-medium text-[var(--color-sage-deep)]">
                Everyone is settled. No one owes anyone.
              </p>
            ) : (
              plan.map((payment) => (
                <div
                  key={`${payment.fromId}-${payment.toId}-${payment.amount}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[var(--color-purple)] px-3 py-3 text-white"
                >
                  <p className="text-sm font-semibold">
                    {payment.fromName} pays {payment.toName}{" "}
                    {formatCurrency(payment.amount)}
                  </p>
                  <button
                    type="button"
                    className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[var(--color-purple)]"
                    onClick={() =>
                      markPaid(payment.fromId, payment.toId, payment.amount)
                    }
                  >
                    Mark paid
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="tint-card p-5">
        <h2 className="text-lg font-bold">Where the money went</h2>
        <ul className="mt-4 space-y-3">
          {ROOM_CATEGORIES.map((category) => {
            const amount = totals[category.id];
            if (!amount) return null;
            return (
              <li key={category.id}>
                <div className="mb-1 flex justify-between text-sm font-medium">
                  <span>{category.label}</span>
                  <span>{formatCurrency(amount)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/70">
                  <div
                    className="h-full rounded-full bg-[var(--color-purple)]"
                    style={{ width: `${(amount / maxCategory) * 100}%` }}
                  />
                </div>
              </li>
            );
          })}
          {spent === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">
              Add rent or any shared bill to see the breakdown.
            </p>
          ) : null}
        </ul>
      </section>

      <section className="space-y-2">
        {room.expenses.map((expense) => {
          const payer = room.members.find((member) => member.id === expense.paidBy);
          const shares = expenseShares(expense);
          return (
            <article key={expense.id} className="tint-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{expense.title}</p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {expense.date} ·{" "}
                    {ROOM_CATEGORIES.find((item) => item.id === expense.category)?.label}{" "}
                    · paid by {payer?.name ?? "Unknown"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold">{formatCurrency(expense.amount)}</p>
                  <button
                    type="button"
                    className="text-xs font-medium text-rose-600"
                    onClick={() => removeExpense(expense.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {expense.splitAmong.map((id) => {
                  const member = room.members.find((item) => item.id === id);
                  return (
                    <span
                      key={id}
                      className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold"
                    >
                      {member?.name} {formatCurrency(shares[id] ?? 0)}
                    </span>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>

      <button
        type="button"
        className="text-xs font-semibold text-rose-600"
        onClick={() => onDelete(room.id)}
      >
        Delete this room
      </button>
    </div>
  );
}

function ExpenseForm({
  room,
  onAdd,
}: {
  room: Room;
  onAdd: (expense: RoomExpense) => void;
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<RoomCategory>("rent");
  const [paidBy, setPaidBy] = useState(room.members[0]?.id ?? "");
  const [splitAmong, setSplitAmong] = useState(room.members.map((member) => member.id));
  const [method, setMethod] = useState<"equal" | "custom">("equal");
  const [custom, setCustom] = useState<Record<string, string>>({});
  const [date, setDate] = useState(toDateKey());
  const [error, setError] = useState("");

  function togglePerson(id: string) {
    setSplitAmong((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function submit(event?: React.FormEvent) {
    event?.preventDefault();
    const value = Number.parseFloat(amount);
    if (!title.trim()) {
      setError("Say what this bill was for.");
      return;
    }
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }
    if (!splitAmong.length) {
      setError("Choose at least one person to split with.");
      return;
    }
    let shares: Record<string, number> | undefined;
    if (method === "custom") {
      shares = {};
      let sum = 0;
      for (const id of splitAmong) {
        const part = Number.parseFloat(custom[id] || "0");
        shares[id] = Number.isFinite(part) ? part : 0;
        sum += shares[id];
      }
      if (Math.abs(sum - value) > 0.05) {
        setError("Custom shares must add up to the total.");
        return;
      }
    }
    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      amount: value,
      category,
      date,
      paidBy,
      splitAmong,
      method,
      shares,
    });
    setTitle("");
    setAmount("");
    setError("");
    setCustom({});
  }

  return (
    <form onSubmit={submit} className="tint-card space-y-3 p-5">
      <h2 className="text-lg font-bold">Add a shared bill</h2>
      <input
        className="field"
        placeholder="Room rent, Swiggy, electricity…"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          className="field"
          inputMode="decimal"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <input
          className="field"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {ROOM_CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCategory(item.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              category === item.id
                ? "bg-[var(--color-purple)] text-white"
                : "bg-white/80 text-[var(--color-ink)]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <label className="block text-sm font-medium">
        Who paid?
        <select
          className="field mt-1"
          value={paidBy}
          onChange={(event) => setPaidBy(event.target.value)}
        >
          {room.members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </label>
      <div>
        <p className="text-sm font-medium">Split between</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {room.members.map((member) => {
            const on = splitAmong.includes(member.id);
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => togglePerson(member.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  on ? "text-white" : "bg-white/70 text-[var(--color-ink)]"
                }`}
                style={on ? { background: member.color } : undefined}
              >
                {member.name}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex gap-2">
        {(["equal", "custom"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMethod(item)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
              method === item ? "bg-slate-900 text-white" : "bg-white/80"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {method === "custom" ? (
        <div className="space-y-2">
          {splitAmong.map((id) => {
            const member = room.members.find((item) => item.id === id);
            return (
              <label key={id} className="flex items-center gap-2 text-sm">
                <span className="w-24 truncate font-medium">{member?.name}</span>
                <input
                  className="field"
                  inputMode="decimal"
                  placeholder="₹"
                  value={custom[id] ?? ""}
                  onChange={(event) =>
                    setCustom({ ...custom, [id]: event.target.value })
                  }
                />
              </label>
            );
          })}
        </div>
      ) : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      <button type="button" className="hero-btn w-full" onClick={submit}>
        Add to room
      </button>
    </form>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className={`rounded-2xl p-4 text-white shadow-lg ${tone}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
        {label}
      </p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
    </div>
  );
}
