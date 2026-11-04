"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { IncomeExpenseCards } from "@/components/dashboard/IncomeExpenseCards";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { AnimatedListItem } from "@/components/motion/AnimatedListItem";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { useAuth } from "@/context/AuthContext";
import { useOverlay } from "@/context/OverlayContext";
import { useSummary } from "@/hooks/useSummary";
import { useTransactions } from "@/hooks/useTransactions";
import { categoryLabel } from "@/lib/categories";
import { formatCurrency, formatMonth } from "@/lib/format";

export default function HomePage() {
  const { profile } = useAuth();
  const { openAddTransaction } = useOverlay();
  const { transactions, loading } = useTransactions();
  const { current, currentMonth, topExpense } = useSummary(transactions);

  const expenseByCategory = Object.fromEntries(
    Object.entries(current.byCategory).filter(([id]) =>
      transactions.some(
        (t) =>
          t.categoryId === id &&
          t.type === "expense" &&
          t.date.startsWith(currentMonth),
      ),
    ),
  );

  const recent = transactions.slice(0, 6);

  return (
    <div className="stagger space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--color-muted)]">Welcome back</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {profile?.displayName ?? "there"}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openAddTransaction("income")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-xs font-semibold"
          >
            <Plus size={14} />
            Income
          </button>
          <button
            type="button"
            onClick={() => openAddTransaction("expense")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-ink)] px-3 py-2 text-xs font-semibold text-white"
          >
            <Plus size={14} />
            Expense
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <div className="space-y-4">
          <BalanceCard
            balance={current.balance}
            monthLabel={formatMonth(currentMonth)}
          />
          <IncomeExpenseCards
            income={current.income}
            expense={current.expense}
            transfer={current.transfer}
          />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="panel h-48 animate-pulse bg-[var(--color-ivory-deep)]" />
          ) : (
            <SpendingChart byCategory={expenseByCategory} />
          )}

          <section className="panel p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Recent activity</h3>
              <Link
                href="/activity"
                className="text-xs font-semibold text-[var(--color-purple)]"
              >
                View all
              </Link>
            </div>
            {recent.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--color-muted)]">
                No transactions yet. Add your first entry to begin.
              </p>
            ) : (
              <ul className="divide-y divide-[var(--color-line)]">
                {recent.map((tx, i) => (
                  <AnimatedListItem
                    key={tx.id}
                    delayMs={i * 35}
                    className="flex items-center justify-between gap-3 py-3 text-sm"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <CategoryIcon
                        categoryId={tx.categoryId}
                        size="sm"
                        tone={
                          tx.type === "income"
                            ? "sage"
                            : tx.type === "transfer"
                              ? "purple"
                              : "rose"
                        }
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {categoryLabel(tx.categoryId)}
                        </p>
                        <p className="text-xs text-[var(--color-muted)]">
                          {tx.date}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 tabular-nums font-semibold ${
                        tx.type === "income"
                          ? "text-[var(--color-sage)]"
                          : "text-[var(--color-ink)]"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "−"}
                      {formatCurrency(tx.amount)}
                    </span>
                  </AnimatedListItem>
                ))}
              </ul>
            )}
            {topExpense.length > 0 ? (
              <p className="mt-3 border-t border-[var(--color-line)] pt-3 text-xs text-[var(--color-muted)]">
                Top category: {categoryLabel(topExpense[0].categoryId)}
              </p>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
