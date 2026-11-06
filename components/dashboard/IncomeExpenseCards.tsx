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
        className="card-lift rounded-2xl bg-[var(--color-sage)] p-5 text-left text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
            Income
          </p>
          <ColorIcon asset="income" size="sm" />
        </div>
        <p className="mt-4 text-2xl font-bold tracking-tight">
          {formatCurrency(income)}
        </p>
        <p className="mt-2 text-xs font-medium text-white/80">
          Quick add income
        </p>
      </button>
      <button
        type="button"
        onClick={() => openAddTransaction("expense")}
        className="card-lift rounded-2xl bg-[var(--color-rose)] p-5 text-left text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
            Expenses
          </p>
          <ColorIcon asset="budgets" size="sm" />
        </div>
        <p className="mt-4 text-2xl font-bold tracking-tight">
          {formatCurrency(expense)}
        </p>
        <p className="mt-2 text-xs font-medium text-white/80">
          Quick add expense
        </p>
      </button>
      <div className="flex items-center gap-3 rounded-2xl bg-[var(--color-purple)] px-4 py-3.5 text-sm text-white shadow-lg sm:col-span-2">
        <ColorIcon asset="savings" size="sm" />
        <p>
          Transfers{" "}
          <span className="font-semibold">{formatCurrency(transfer)}</span>
          <span className="text-white/80">
            {" "}
            · excluded from spending analytics
          </span>
        </p>
      </div>
    </div>
  );
}
