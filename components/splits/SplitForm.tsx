"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toDateKey } from "@/lib/format";
import type { CreateTransactionInput, SplitParticipant } from "@/lib/types";

export function SplitForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (input: CreateTransactionInput) => Promise<void> | void;
  submitting?: boolean;
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [people, setPeople] = useState<SplitParticipant[]>([
    { id: "me", name: "You", amount: 0, settled: true },
    { id: crypto.randomUUID(), name: "", amount: 0, settled: false },
  ]);
  const [method, setMethod] = useState<"equal" | "custom">("equal");

  const total = Number.parseFloat(amount) || 0;

  function withAmounts(list: SplitParticipant[]) {
    if (method === "custom") return list;
    if (!list.length) return list;
    const share = Math.round((total / list.length) * 100) / 100;
    return list.map((p, i) => ({
      ...p,
      amount:
        i === list.length - 1
          ? Math.round((total - share * (list.length - 1)) * 100) / 100
          : share,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const participants = withAmounts(people);
    await onSubmit({
      type: "expense",
      amount: total,
      categoryId: "exp-outings",
      note: title.trim() || "Split expense",
      date: toDateKey(),
      split: {
        method,
        participants,
        status: "pending",
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="What was this for?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        inputMode="decimal"
        placeholder="Total amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div className="flex gap-2">
        {(["equal", "custom"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMethod(m)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
              method === m
                ? "bg-[var(--color-purple)] text-white"
                : "bg-[var(--color-ivory-deep)]"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {people.map((p, i) => (
          <div key={p.id} className="flex gap-2">
            <Input
              value={p.name}
              disabled={p.id === "me"}
              onChange={(e) => {
                const next = [...people];
                next[i] = { ...p, name: e.target.value };
                setPeople(next);
              }}
              placeholder="Person name"
            />
            {method === "custom" ? (
              <Input
                inputMode="decimal"
                className="max-w-28"
                value={p.amount || ""}
                onChange={(e) => {
                  const next = [...people];
                  next[i] = {
                    ...p,
                    amount: Number.parseFloat(e.target.value) || 0,
                  };
                  setPeople(next);
                }}
                placeholder="₹"
              />
            ) : null}
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            setPeople([
              ...people,
              {
                id: crypto.randomUUID(),
                name: "",
                amount: 0,
                settled: false,
              },
            ])
          }
        >
          Add person
        </Button>
      </div>
      <Button type="submit" className="w-full" disabled={submitting || total <= 0}>
        Create split
      </Button>
    </form>
  );
}
