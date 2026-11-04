"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from "@/lib/transactions";
import type {
  CreateTransactionInput,
  Transaction,
  TransactionFilters,
  UpdateTransactionInput,
} from "@/lib/types";

export function useTransactions(filters: TransactionFilters = {}) {
  const { userId } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const items = await listTransactions(userId, filters);
      setTransactions(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [userId, filters.type, filters.categoryId, filters.search, filters.from, filters.to]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = useCallback(
    async (input: CreateTransactionInput) => {
      if (!userId) throw new Error("Not signed in");
      const tx = await createTransaction(userId, input);
      await refresh();
      return tx;
    },
    [userId, refresh],
  );

  const update = useCallback(
    async (input: UpdateTransactionInput) => {
      if (!userId) throw new Error("Not signed in");
      const tx = await updateTransaction(userId, input);
      await refresh();
      return tx;
    },
    [userId, refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!userId) throw new Error("Not signed in");
      await deleteTransaction(userId, id);
      await refresh();
    },
    [userId, refresh],
  );

  return { transactions, loading, error, refresh, add, update, remove };
}
