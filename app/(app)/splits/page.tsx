"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { SplitForm } from "@/components/splits/SplitForm";
import { SplitSummary } from "@/components/splits/SplitSummary";
import { useTransactions } from "@/hooks/useTransactions";
import type { CreateTransactionInput, SettlementStatus } from "@/lib/types";

export default function SplitsPage() {
  const { transactions, add, update, loading } = useTransactions();
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(true);

  async function handleCreate(input: CreateTransactionInput) {
    setSubmitting(true);
    try {
      await add(input);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSettle(txId: string, participantId: string) {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx?.split) return;
    const participants = tx.split.participants.map((p) =>
      p.id === participantId ? { ...p, settled: true } : p,
    );
    const allSettled = participants.every((p) => p.settled);
    const someSettled = participants.some((p) => p.settled);
    const status: SettlementStatus = allSettled
      ? "settled"
      : someSettled
        ? "partial"
        : "pending";
    await update({
      id: txId,
      split: { ...tx.split, participants, status },
    });
  }

  return (
    <div className="stagger space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-lavender)] text-[var(--color-purple)]">
              <Users size={22} />
            </span>
            Splits
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            People, shared bills and settlements
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          className="pressable rounded-full bg-[var(--color-sage)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[var(--color-sage)]/30"
        >
          {showForm ? "Close" : "+ New"}
        </button>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        {showForm ? (
          <div className="animate-pop rounded-3xl bg-white p-5 shadow-md ring-1 ring-[var(--color-line)] sm:p-6">
            <SplitForm onSubmit={handleCreate} submitting={submitting} />
          </div>
        ) : null}

        <div>
          {loading ? (
            <div className="h-40 animate-pulse rounded-2xl bg-white ring-1 ring-[var(--color-line)]" />
          ) : (
            <SplitSummary transactions={transactions} onSettle={handleSettle} />
          )}
        </div>
      </div>
    </div>
  );
}
