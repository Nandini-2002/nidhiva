"use client";

import { CalendarView } from "@/components/calendar/CalendarView";
import { useTransactions } from "@/hooks/useTransactions";

export default function CalendarPage() {
  const { transactions, loading } = useTransactions();

  return (
    <div className="animate-rise space-y-5">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Calendar</h1>
        <p className="text-sm text-[var(--color-muted)]">
          View income and expenses by date
        </p>
      </header>
      {loading ? (
        <p className="text-sm text-[var(--color-muted)]">Loading…</p>
      ) : (
        <CalendarView transactions={transactions} />
      )}
    </div>
  );
}
