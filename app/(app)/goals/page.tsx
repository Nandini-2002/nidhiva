"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { deleteGoal, listGoals, upsertGoal } from "@/lib/budgets";
import { formatCurrency } from "@/lib/format";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Goal } from "@/lib/types";

export default function GoalsPage() {
  const { userId } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");

  function refresh() {
    if (userId) setGoals(listGoals(userId));
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !name || !target) return;
    upsertGoal(userId, {
      name,
      targetAmount: Number.parseFloat(target),
      currentAmount: Number.parseFloat(current) || 0,
    });
    setName("");
    setTarget("");
    setCurrent("");
    refresh();
  }

  return (
    <div className="animate-rise space-y-5">
      <PageHero
        kicker="Saving"
        title="Goals"
        subtitle="Pick something worth saving for and watch the progress climb."
      />

      <form onSubmit={handleAdd} className="tint-card space-y-3 p-4">
        <Input
          placeholder="Goal name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          inputMode="decimal"
          placeholder="Target amount (₹)"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          required
        />
        <Input
          inputMode="decimal"
          placeholder="Already saved (₹)"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Add goal
        </Button>
      </form>

      <ul className="space-y-3">
        {goals.map((g) => {
          const pct = Math.min(100, (g.currentAmount / g.targetAmount) * 100);
          return (
            <li
              key={g.id}
              className="tint-card p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{g.name}</p>
                <button
                  type="button"
                  className="text-xs text-[var(--color-muted)]"
                  onClick={() => {
                    if (userId) {
                      deleteGoal(userId, g.id);
                      refresh();
                    }
                  }}
                >
                  Remove
                </button>
              </div>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                {formatCurrency(g.currentAmount)} of {formatCurrency(g.targetAmount)}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-ivory-deep)]">
                <div
                  className="h-full rounded-full bg-[var(--color-purple)] transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                className="mt-3 w-full"
                onClick={() => {
                  if (!userId) return;
                  upsertGoal(userId, {
                    id: g.id,
                    name: g.name,
                    targetAmount: g.targetAmount,
                    currentAmount: g.currentAmount + 500,
                    deadline: g.deadline,
                  });
                  refresh();
                }}
              >
                + ₹500 progress
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
