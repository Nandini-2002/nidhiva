"use client";

import { useMemo } from "react";
import { toMonthKey } from "@/lib/format";
import {
  previousMonthKey,
  summarizeAllTime,
  summarizeByMonth,
  summarizeMonth,
  topCategories,
} from "@/lib/summary";
import type { Transaction } from "@/lib/types";

export function useSummary(transactions: Transaction[], month?: string) {
  const currentMonth = month ?? toMonthKey();

  return useMemo(() => {
    const current = summarizeMonth(transactions, currentMonth);
    const previous = summarizeMonth(
      transactions,
      previousMonthKey(currentMonth),
    );
    const allTime = summarizeAllTime(transactions);
    const monthly = summarizeByMonth(transactions);
    const topExpense = topCategories(
      Object.fromEntries(
        Object.entries(current.byCategory).filter(([id]) =>
          transactions.some(
            (t) =>
              t.categoryId === id &&
              t.type === "expense" &&
              t.date.startsWith(currentMonth),
          ),
        ),
      ),
    );

    return { currentMonth, current, previous, allTime, monthly, topExpense };
  }, [transactions, currentMonth]);
}
