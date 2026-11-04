"use client";

import { useState } from "react";
import { Drawer } from "@/components/motion/Drawer";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { useToast } from "@/context/ToastContext";
import { useTransactions } from "@/hooks/useTransactions";
import type { CreateTransactionInput, TransactionType } from "@/lib/types";

export function AddTransactionDrawer({
  open,
  onClose,
  initialType = "expense",
}: {
  open: boolean;
  onClose: () => void;
  initialType?: TransactionType;
}) {
  const { add } = useTransactions();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);

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
        tone: "success",
      });
      setFormKey((k) => k + 1);
      onClose();
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
    <Drawer
      open={open}
      onClose={onClose}
      title="Add Transaction"
      description="Record income, spending, or a transfer"
      side="bottom"
    >
      <TransactionForm
        key={`${formKey}-${initialType}-${open}`}
        initialType={initialType}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </Drawer>
  );
}
