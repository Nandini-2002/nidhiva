"use client";

import { CalendarView } from "@/components/calendar/CalendarView";
import { PageHero } from "@/components/ui/PageHero";
import { useTransactions } from "@/hooks/useTransactions";

export default function CalendarPage() {
  const { transactions, loading } = useTransactions();

  return (
    <div className="animate-rise space-y-5">
      <PageHero
        kicker="Dates"
        title="Calendar"
        subtitle="See income and expenses land on the days they happened."
      />
      {loading ? (
        <p className="text-sm text-[var(--color-muted)]">Loading…</p>
      ) : (
        <CalendarView transactions={transactions} />
      )}
    </div>
  );
}
