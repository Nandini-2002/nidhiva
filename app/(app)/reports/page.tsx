"use client";

import { useMemo, useState } from "react";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { useSummary } from "@/hooks/useSummary";
import { useTransactions } from "@/hooks/useTransactions";
import { PageHero } from "@/components/ui/PageHero";
import {
  formatCurrency,
  formatMonth,
  percentChange,
  toMonthKey,
} from "@/lib/format";

export default function ReportsPage() {
  const { transactions, loading } = useTransactions();
  const [month, setMonth] = useState(toMonthKey());
  const { current, previous, allTime, monthly } = useSummary(transactions, month);

  const expenseCats = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(current.byCategory).filter(([id]) =>
          transactions.some(
            (t) =>
              t.categoryId === id &&
              t.type === "expense" &&
              t.date.startsWith(month),
          ),
        ),
      ),
    [current.byCategory, transactions, month],
  );

  const incomeCats = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(current.byCategory).filter(([id]) =>
          transactions.some(
            (t) =>
              t.categoryId === id &&
              t.type === "income" &&
              t.date.startsWith(month),
          ),
        ),
      ),
    [current.byCategory, transactions, month],
  );

  const expenseDelta = percentChange(current.expense, previous.expense);
  const incomeDelta = percentChange(current.income, previous.income);
  const maxBar = Math.max(...monthly.map((m) => Math.max(m.income, m.expense)), 1);

  return (
    <div className="animate-rise space-y-5">
      <PageHero
        kicker="Insights"
        title="Reports"
        subtitle="Monthly charts, comparisons and all-time summaries."
      />

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="w-full rounded-2xl border border-[var(--color-line)] bg-white/80 px-4 py-3"
      />

      {loading ? (
        <p className="text-sm text-[var(--color-muted)]">Loading…</p>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3">
            <Stat
              label="Income"
              value={formatCurrency(current.income)}
              delta={incomeDelta}
            />
            <Stat
              label="Expenses"
              value={formatCurrency(current.expense)}
              delta={expenseDelta}
              invert
            />
            <Stat label="Transfers" value={formatCurrency(current.transfer)} />
            <Stat label="Net (excl. transfers)" value={formatCurrency(current.net)} />
          </section>

          <section className="tint-card p-4">
            <h3 className="font-medium">vs {formatMonth(previous.month)}</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Spending {expenseDelta == null ? "—" : `${expenseDelta > 0 ? "up" : "down"} ${Math.abs(expenseDelta).toFixed(0)}%`}
              {" · "}
              Income {incomeDelta == null ? "—" : `${incomeDelta > 0 ? "up" : "down"} ${Math.abs(incomeDelta).toFixed(0)}%`}
            </p>
          </section>

          <SpendingChart byCategory={expenseCats} title="Category-wise spending" />
          <SpendingChart byCategory={incomeCats} title="Category-wise income" />

          <section className="tint-card p-4">
            <h3 className="font-medium">Month-to-month</h3>
            <div className="mt-4 flex h-40 items-end gap-2">
              {monthly.slice(-6).map((m) => (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex h-32 w-full items-end justify-center gap-0.5">
                    <div
                      className="w-2 rounded-t bg-[var(--color-sage)] transition-all duration-700"
                      style={{ height: `${(m.income / maxBar) * 100}%` }}
                      title={`Income ${m.income}`}
                    />
                    <div
                      className="w-2 rounded-t bg-[var(--color-purple)] transition-all duration-700"
                      style={{ height: `${(m.expense / maxBar) * 100}%` }}
                      title={`Expense ${m.expense}`}
                    />
                  </div>
                  <span className="text-[10px] text-[var(--color-muted)]">
                    {m.month.slice(5)}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-[var(--color-muted)]">
              Green = income · Purple = expenses
            </p>
          </section>

          <section className="rounded-2xl bg-gradient-to-br from-[var(--color-lavender)] to-[var(--color-ivory-deep)] p-5">
            <h3 className="font-[family-name:var(--font-display)] text-xl">
              All-time
            </h3>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[var(--color-muted)]">Income</dt>
                <dd className="text-lg font-medium">{formatCurrency(allTime.income)}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-muted)]">Expenses</dt>
                <dd className="text-lg font-medium">{formatCurrency(allTime.expense)}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-muted)]">Savings transfers</dt>
                <dd className="text-lg font-medium">{formatCurrency(allTime.savings)}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-muted)]">True savings</dt>
                <dd className="text-lg font-medium">
                  {formatCurrency(allTime.income - allTime.expense)}
                </dd>
              </div>
            </dl>
          </section>
        </>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  delta,
  invert,
}: {
  label: string;
  value: string;
  delta?: number | null;
  invert?: boolean;
}) {
  return (
    <div className="tint-card p-4">
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-xl">{value}</p>
      {delta != null ? (
        <p
          className={`mt-1 text-xs ${
            (invert ? delta < 0 : delta > 0)
              ? "text-[var(--color-sage-deep)]"
              : "text-[var(--color-rose)]"
          }`}
        >
          {delta > 0 ? "+" : ""}
          {delta.toFixed(0)}% vs last month
        </p>
      ) : null}
    </div>
  );
}
