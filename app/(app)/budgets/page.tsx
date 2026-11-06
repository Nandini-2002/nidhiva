"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";
import { deleteBudget, listBudgets, upsertBudget } from "@/lib/budgets";
import { categoryLabel } from "@/lib/categories";
import { formatCurrency, toMonthKey } from "@/lib/format";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Budget } from "@/lib/types";

export default function BudgetsPage() {
  const { userId } = useAuth();
  const { transactions } = useTransactions();
  const { byKind } = useCategories();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [limit, setLimit] = useState("");
  const month = toMonthKey();
  const expenseCats = byKind("expense");

  useEffect(() => {
    if (userId) setBudgets(listBudgets(userId));
  }, [userId]);

  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const tx of transactions) {
      if (tx.type !== "expense" || !tx.date.startsWith(month)) continue;
      map[tx.categoryId] = (map[tx.categoryId] ?? 0) + tx.amount;
    }
    return map;
  }, [transactions, month]);

  function refresh() {
    if (userId) setBudgets(listBudgets(userId));
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !categoryId || !limit) return;
    upsertBudget(userId, {
      categoryId,
      limit: Number.parseFloat(limit),
      month,
    });
    setCategoryId("");
    setLimit("");
    refresh();
  }

  return (
    <div className="animate-rise space-y-5">
      <PageHero
        kicker="Limits"
        title="Budgets"
        subtitle="Set a spending limit for each category and watch it fill up."
      />

      <form onSubmit={handleAdd} className="tint-card space-y-3 p-4">
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-2xl border border-[var(--color-line)] bg-white/80 px-4 py-3 text-sm"
          required
        >
          <option value="">Choose category</option>
          {expenseCats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Input
          inputMode="decimal"
          placeholder="Monthly limit (₹)"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          Save budget
        </Button>
      </form>

      <ul className="space-y-3">
        {budgets
          .filter((b) => b.month === month)
          .map((b) => {
            const spent = spentByCategory[b.categoryId] ?? 0;
            const pct = Math.min(100, (spent / b.limit) * 100);
            const over = spent > b.limit;
            return (
              <li
                key={b.id}
                className="tint-card p-4"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{categoryLabel(b.categoryId)}</span>
                  <button
                    type="button"
                    className="text-xs text-[var(--color-muted)]"
                    onClick={() => {
                      if (userId) {
                        deleteBudget(userId, b.id);
                        refresh();
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  {formatCurrency(spent)} of {formatCurrency(b.limit)}
                  {over ? " · Over budget" : ""}
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-ivory-deep)]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: over
                        ? "var(--color-rose)"
                        : "var(--color-sage)",
                    }}
                  />
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
