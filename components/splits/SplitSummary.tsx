"use client";

import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Transaction } from "@/lib/types";

export function SplitSummary({
  transactions,
  onSettle,
}: {
  transactions: Transaction[];
  onSettle: (txId: string, participantId: string) => void;
}) {
  const splits = transactions.filter((t) => t.split);

  if (!splits.length) {
    return (
      <p className="rounded-2xl bg-white/70 p-5 text-sm text-[var(--color-muted)] ring-1 ring-[var(--color-line)]">
        No shared bills yet. Add a split to track who owes what.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {splits.map((tx) => {
        const split = tx.split!;
        const settledCount = split.participants.filter((p) => p.settled).length;
        return (
          <li
            key={tx.id}
            className="rounded-2xl bg-white/80 p-4 ring-1 ring-[var(--color-line)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{tx.note || "Split expense"}</p>
                <p className="text-xs text-[var(--color-muted)]">
                  {formatDate(tx.date)} · {formatCurrency(tx.amount)}
                </p>
              </div>
              <span className="rounded-full bg-[var(--color-lavender)] px-2.5 py-1 text-[11px] font-medium capitalize text-[var(--color-ink)]">
                {split.status}
              </span>
            </div>
            <p className="mt-2 text-xs text-[var(--color-muted)]">
              {settledCount}/{split.participants.length} settled
            </p>
            <ul className="mt-3 space-y-2">
              {split.participants.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-xl bg-[var(--color-ivory-deep)] px-3 py-2 text-sm"
                >
                  <span>
                    {p.name} · {formatCurrency(p.amount)}
                  </span>
                  {p.settled ? (
                    <span className="text-xs text-[var(--color-sage-deep)]">Settled</span>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      className="px-3 py-1 text-xs"
                      onClick={() => onSettle(tx.id, p.id)}
                    >
                      Mark settled
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
