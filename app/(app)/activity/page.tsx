"use client";

import { useMemo, useState } from "react";
import { AnimatedListItem } from "@/components/motion/AnimatedListItem";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { useCategories } from "@/hooks/useCategories";
import { useToast } from "@/context/ToastContext";
import { useTransactions } from "@/hooks/useTransactions";
import { categoryLabel } from "@/lib/categories";
import { PageHero } from "@/components/ui/PageHero";
import { formatCurrency, formatDate } from "@/lib/format";
import { filterTransactions } from "@/lib/transactions";
import type { TransactionFilters as Filters } from "@/lib/types";

export default function ActivityPage() {
  const [filters, setFilters] = useState<Filters>({ type: "all" });
  const { transactions, loading, remove } = useTransactions();
  const { categories } = useCategories();
  const { toast } = useToast();
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () => filterTransactions(transactions, filters),
    [transactions, filters],
  );

  async function handleDelete(id: string) {
    setExitingIds((prev) => new Set(prev).add(id));
    window.setTimeout(async () => {
      await remove(id);
      setExitingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast({
        title: "Transaction deleted",
        tone: "info",
      });
    }, 280);
  }

  return (
    <div className="stagger space-y-5">
      <PageHero
        kicker="Ledger"
        title="Activity"
        subtitle="Search, filter and review every income, expense and transfer."
      />

      <TransactionFilters
        value={filters}
        onChange={setFilters}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-2xl bg-[var(--color-surface)] ring-1 ring-[var(--color-line)]"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl bg-[var(--color-surface)] p-5 text-sm text-[var(--color-muted)] shadow-sm ring-1 ring-[var(--color-line)]">
          No matching transactions.
        </p>
      ) : (
        <ul className="grid gap-2 lg:grid-cols-2">
          {filtered.map((tx, i) => (
            <AnimatedListItem
              key={tx.id}
              delayMs={Math.min(i, 8) * 40}
              exiting={exitingIds.has(tx.id)}
              className="card-lift tint-card flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <CategoryIcon
                  categoryId={tx.categoryId}
                  tone={
                    tx.type === "income"
                      ? "sage"
                      : tx.type === "transfer"
                        ? "purple"
                        : "rose"
                  }
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {categoryLabel(
                      tx.categoryId,
                      categories.filter((c) => c.isCustom),
                    )}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {formatDate(tx.date)}
                    {tx.note ? ` · ${tx.note}` : ""}
                    {tx.recurring ? " · Recurring" : ""}
                    {tx.split ? " · Split" : ""}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`text-sm font-bold ${
                    tx.type === "income"
                      ? "text-[var(--color-sage-deep)]"
                      : tx.type === "transfer"
                        ? "text-[var(--color-purple)]"
                        : "text-[var(--color-rose)]"
                  }`}
                >
                  {tx.type === "income" ? "+" : "−"}
                  {formatCurrency(tx.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => void handleDelete(tx.id)}
                  className="text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-rose)]"
                  aria-label="Delete"
                >
                  Delete
                </button>
              </div>
            </AnimatedListItem>
          ))}
        </ul>
      )}
    </div>
  );
}
