"use client";

import { useMemo, useState } from "react";
import { categoryLabel } from "@/lib/categories";
import { formatCurrency, toDateKey, toMonthKey } from "@/lib/format";
import { groupByDate } from "@/lib/summary";
import type { Transaction } from "@/lib/types";

export function CalendarView({ transactions }: { transactions: Transaction[] }) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selected, setSelected] = useState(toDateKey());

  const monthKey = toMonthKey(cursor);
  const byDate = useMemo(() => groupByDate(transactions), [transactions]);

  const days = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (number | null)[] = [
      ...Array.from({ length: firstDow }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const selectedTx = byDate[selected] ?? [];

  function dayKey(day: number) {
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${cursor.getFullYear()}-${m}-${d}`;
  }

  function dayTotals(key: string) {
    const list = byDate[key] ?? [];
    return list.reduce(
      (acc, tx) => {
        if (tx.type === "income") acc.income += tx.amount;
        if (tx.type === "expense") acc.expense += tx.amount;
        return acc;
      },
      { income: 0, expense: 0 },
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="rounded-xl px-3 py-2 text-sm hover:bg-white/70"
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
          }
        >
          ←
        </button>
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          {cursor.toLocaleString("en-IN", { month: "long", year: "numeric" })}
        </h2>
        <button
          type="button"
          className="rounded-xl px-3 py-2 text-sm hover:bg-white/70"
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
          }
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-[var(--color-muted)]">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={`${d}-${i}`} className="py-1">
            {d}
          </div>
        ))}
        {days.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const key = dayKey(day);
          const totals = dayTotals(key);
          const has = totals.income > 0 || totals.expense > 0;
          const active = selected === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className={`aspect-square rounded-xl p-1 text-sm font-semibold transition ${
                active
                  ? "bg-[var(--color-purple)] text-white shadow-md"
                  : totals.income > 0 && totals.expense > 0
                    ? "bg-[var(--color-lavender)]"
                    : totals.income > 0
                      ? "bg-[var(--color-sage-soft)]"
                      : totals.expense > 0
                        ? "bg-[var(--color-rose-soft)]"
                        : "bg-white/70 hover:bg-[var(--color-lavender)]"
              }`}
            >
              <div>{day}</div>
              {has ? (
                <div className="mt-0.5 flex justify-center gap-0.5">
                  {totals.income > 0 ? (
                    <span className={`h-1 w-1 rounded-full ${active ? "bg-white" : "bg-[var(--color-sage)]"}`} />
                  ) : null}
                  {totals.expense > 0 ? (
                    <span className={`h-1 w-1 rounded-full ${active ? "bg-white/80" : "bg-[var(--color-rose)]"}`} />
                  ) : null}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      <section className="tint-card p-4">
        <h3 className="text-sm font-medium text-[var(--color-muted)]">
          {selected} · {monthKey}
        </h3>
        {selectedTx.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--color-muted)]">No transactions</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {selectedTx.map((tx) => (
              <li
                key={tx.id}
                className="flex items-center justify-between rounded-xl bg-[var(--color-ivory-deep)] px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{categoryLabel(tx.categoryId)}</p>
                  {tx.note ? (
                    <p className="text-xs text-[var(--color-muted)]">{tx.note}</p>
                  ) : null}
                </div>
                <span
                  className={
                    tx.type === "income"
                      ? "text-[var(--color-sage-deep)]"
                      : tx.type === "transfer"
                        ? "text-[var(--color-purple)]"
                        : "text-[var(--color-rose)]"
                  }
                >
                  {tx.type === "income" ? "+" : "−"}
                  {formatCurrency(tx.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
