"use client";

import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { categoryLabel } from "@/lib/categories";
import { formatCompactCurrency } from "@/lib/format";

export function SpendingChart({
  byCategory,
  title = "Spending by category",
}: {
  byCategory: Record<string, number>;
  title?: string;
}) {
  const entries = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <section className="panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-[11px] text-[var(--color-muted)]">This month</span>
      </div>
      {!entries.length ? (
        <p className="py-8 text-center text-sm text-[var(--color-muted)]">
          No spending recorded yet.
        </p>
      ) : (
        <ul className="space-y-3.5">
          {entries.map(([id, amount], i) => (
            <li key={id}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="inline-flex items-center gap-2 font-medium">
                  <CategoryIcon categoryId={id} size="sm" />
                  {categoryLabel(id)}
                </span>
                <span className="tabular-nums text-[var(--color-muted)]">
                  {formatCompactCurrency(amount)}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-ivory-deep)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(amount / max) * 100}%`,
                    background:
                      i % 2 === 0
                        ? "var(--color-sage)"
                        : "var(--color-purple)",
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
