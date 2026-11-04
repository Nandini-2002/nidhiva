"use client";

import { ColorIcon } from "@/components/ui/ColorIcon";
import { useOverlay } from "@/context/OverlayContext";
import { formatCurrency } from "@/lib/format";

export function IncomeExpenseCards({
  income,
  expense,
  transfer,
}: {
  income: number;
  expense: number;
  transfer: number;
}) {
  const { openAddTransaction } = useOverlay();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => openAddTransaction("income")}
        className="card-lift panel p-5 text-left"
      >
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-sage)]">
            Income
          </p>
          <ColorIcon asset="income" size="sm" />
        </div>
        <p className="mt-4 text-2xl font-bold tracking-tight text-[var(--color-ink)]">
          {formatCurrency(income)}
        </p>
        <p className="mt-2 text-xs font-medium text-[var(--color-muted)]">
          Quick add income
        </p>
      </button>
      <button
        type="button"
        onClick={() => openAddTransaction("expense")}
        className="card-lift panel p-5 text-left"
      >
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-rose)]">
            Expenses
          </p>
          <ColorIcon asset="budgets" size="sm" />
        </div>
        <p className="mt-4 text-2xl font-bold tracking-tight text-[var(--color-ink)]">
          {formatCurrency(expense)}
        </p>
        <p className="mt-2 text-xs font-medium text-[var(--color-muted)]">
          Quick add expense
        </p>
      </button>
      <div className="panel flex items-center gap-3 px-4 py-3.5 text-sm sm:col-span-2">
        <ColorIcon asset="savings" size="sm" />
        <p className="text-[var(--color-ink)]">
          Transfers{" "}
          <span className="font-semibold">{formatCurrency(transfer)}</span>
          <span className="text-[var(--color-muted)]">
            {" "}
            · excluded from spending analytics
          </span>
        </p>
      </div>
    </div>
  );
}
