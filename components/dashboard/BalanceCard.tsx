"use client";

import { ColorIcon } from "@/components/ui/ColorIcon";
import { formatCurrency } from "@/lib/format";

export function BalanceCard({
  balance,
  monthLabel,
}: {
  balance: number;
  monthLabel: string;
}) {
  return (
    <section className="page-hero overflow-hidden p-6 text-white sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/75">
            {monthLabel}
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-[2.75rem]">
            {formatCurrency(balance)}
          </h2>
          <p className="mt-2 text-sm text-white/75">Available balance</p>
        </div>
        <ColorIcon asset="income" size="lg" />
      </div>
    </section>
  );
}
