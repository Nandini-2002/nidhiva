import { toMonthKey } from "@/lib/format";
import type {
  AllTimeSummary,
  MonthSummary,
  Transaction,
  TransactionType,
} from "@/lib/types";

function emptyMonth(month: string): MonthSummary {
  return {
    month,
    income: 0,
    expense: 0,
    transfer: 0,
    balance: 0,
    net: 0,
    byCategory: {},
  };
}

export function summarizeMonth(
  transactions: Transaction[],
  month: string,
): MonthSummary {
  const summary = emptyMonth(month);

  for (const tx of transactions) {
    if (toMonthKey(tx.date) !== month) continue;
    summary[tx.type] += tx.amount;
    summary.byCategory[tx.categoryId] =
      (summary.byCategory[tx.categoryId] ?? 0) + tx.amount;
  }

  summary.net = summary.income - summary.expense;
  summary.balance = summary.income - summary.expense - summary.transfer;
  return summary;
}

export function summarizeAllTime(transactions: Transaction[]): AllTimeSummary {
  const result: AllTimeSummary = {
    income: 0,
    expense: 0,
    transfer: 0,
    savings: 0,
    byCategory: {},
  };

  for (const tx of transactions) {
    result[tx.type] += tx.amount;
    result.byCategory[tx.categoryId] =
      (result.byCategory[tx.categoryId] ?? 0) + tx.amount;
    if (tx.type === "transfer" && tx.categoryId === "trf-savings") {
      result.savings += tx.amount;
    }
  }

  return result;
}

export function summarizeByMonth(
  transactions: Transaction[],
): MonthSummary[] {
  const months = new Set(transactions.map((t) => toMonthKey(t.date)));
  return [...months]
    .sort()
    .map((month) => summarizeMonth(transactions, month));
}

export function groupByDate(
  transactions: Transaction[],
): Record<string, Transaction[]> {
  return transactions.reduce<Record<string, Transaction[]>>((acc, tx) => {
    const key = tx.date.slice(0, 10);
    (acc[key] ??= []).push(tx);
    return acc;
  }, {});
}

export function totalsByType(
  transactions: Transaction[],
): Record<TransactionType, number> {
  return transactions.reduce(
    (acc, tx) => {
      acc[tx.type] += tx.amount;
      return acc;
    },
    { income: 0, expense: 0, transfer: 0 } as Record<TransactionType, number>,
  );
}

export function topCategories(
  byCategory: Record<string, number>,
  limit = 5,
): { categoryId: string; amount: number }[] {
  return Object.entries(byCategory)
    .map(([categoryId, amount]) => ({ categoryId, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

export function previousMonthKey(month: string): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 2, 1);
  return toMonthKey(d);
}
