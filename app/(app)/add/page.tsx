"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { ColorIcon } from "@/components/ui/ColorIcon";
import { useToast } from "@/context/ToastContext";
import { useTransactions } from "@/hooks/useTransactions";
import type { CreateTransactionInput, TransactionType } from "@/lib/types";

function AddTransactionPage() {
  const params = useSearchParams();
  const typeParam = params.get("type");
  const initialType: TransactionType =
    typeParam === "income" || typeParam === "transfer" ? typeParam : "expense";
  const { add } = useTransactions();
  const { toast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(input: CreateTransactionInput) {
    setSubmitting(true);
    try {
      await add(input);
      toast({
        title: "Transaction saved",
        description:
          input.type === "income"
            ? "Income added to your ledger"
            : input.type === "transfer"
              ? "Transfer recorded (not counted as spending)"
              : "Expense added to your ledger",
      });
      router.push("/home");
    } catch (e) {
      toast({
        title: "Couldn’t save",
        description: e instanceof Error ? e.message : "Please try again",
        tone: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="stagger w-full space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-fuchsia-50 to-amber-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <ColorIcon asset="finance" size="lg" />
          <div>
            <Link
              href="/home"
              className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600"
            >
              ← Back to dashboard
            </Link>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Add transaction
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Pick any category below — everything is visible under each heading.
            </p>
          </div>
        </div>
      </div>

      <TransactionForm
        key={initialType}
        initialType={initialType}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}

export default function AddPage() {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-[var(--color-muted)]">Loading…</div>
      }
    >
      <AddTransactionPage />
    </Suspense>
  );
}
