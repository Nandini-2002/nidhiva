"use client";

import { useMemo, useState } from "react";
import { CategorySelector } from "@/components/transactions/CategorySelector";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { toDateKey } from "@/lib/format";
import { validateTransactionInput } from "@/lib/validations/transaction";
import type {
  CreateTransactionInput,
  RecurrenceFrequency,
  SplitParticipant,
  TransactionType,
} from "@/lib/types";

const typeOptions: { value: TransactionType; label: string }[] = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
];

export function TransactionForm({
  initialType = "expense",
  onSubmit,
  submitting,
}: {
  initialType?: TransactionType;
  onSubmit: (input: CreateTransactionInput) => Promise<void> | void;
  submitting?: boolean;
}) {
  const [type, setType] = useState<TransactionType>(
    initialType === "transfer" ? "expense" : initialType,
  );
  const [isTransfer, setIsTransfer] = useState(initialType === "transfer");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string>();
  const [note, setNote] = useState("");
  const [date, setDate] = useState(toDateKey());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState<RecurrenceFrequency>("monthly");
  const [splitOn, setSplitOn] = useState(false);
  const [people, setPeople] = useState<SplitParticipant[]>([
    { id: "me", name: "You", amount: 0, settled: true },
    { id: crypto.randomUUID(), name: "", amount: 0, settled: false },
  ]);

  const effectiveType: TransactionType = isTransfer ? "transfer" : type;

  const parsedAmount = useMemo(
    () => Number.parseFloat(amount.replace(/[^\d.]/g, "")) || 0,
    [amount],
  );

  function redistribute(nextPeople: SplitParticipant[], total: number) {
    if (!nextPeople.length) return nextPeople;
    const share = Math.round((total / nextPeople.length) * 100) / 100;
    return nextPeople.map((p, i) => ({
      ...p,
      amount:
        i === nextPeople.length - 1
          ? Math.round((total - share * (nextPeople.length - 1)) * 100) / 100
          : share,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: CreateTransactionInput = {
      type: effectiveType,
      amount: parsedAmount,
      categoryId: categoryId ?? "",
      note: note.trim() || undefined,
      date,
      recurring: recurring
        ? {
            frequency,
            interval: 1,
            nextDate: date,
          }
        : undefined,
      split:
        splitOn && effectiveType === "expense"
          ? {
              method: "equal",
              participants: redistribute(people, parsedAmount),
              status: "pending",
            }
          : undefined,
    };

    const result = validateTransactionInput(input);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    await onSubmit(input);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
          <div className="space-y-2">
            <SegmentedControl
              value={type}
              options={typeOptions}
              onChange={(v) => {
                setType(v);
                setIsTransfer(false);
                setCategoryId(undefined);
                setSplitOn(false);
              }}
            />
            <label className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
              <input
                type="checkbox"
                checked={isTransfer}
                onChange={(e) => {
                  setIsTransfer(e.target.checked);
                  setCategoryId(undefined);
                  setSplitOn(false);
                }}
                className="accent-[var(--color-purple)]"
              />
              Savings / loan transfer
            </label>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-muted)]">
              Amount (₹)
            </label>
            <Input
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-3xl font-bold tracking-tight"
            />
            {errors.amount ? (
              <p className="mt-1 text-xs text-[var(--color-rose)]">
                {errors.amount}
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-muted)]">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-muted)]">
              Note (optional)
            </label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              className="accent-[var(--color-purple)]"
            />
            Recurring (salary, rent, EMIs)
          </label>
          {recurring ? (
            <select
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value as RecurrenceFrequency)
              }
              className="w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          ) : null}

          {effectiveType === "expense" ? (
            <div className="space-y-3 rounded-lg border border-[var(--color-line)] bg-[var(--color-ivory)] p-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={splitOn}
                  onChange={(e) => setSplitOn(e.target.checked)}
                  className="accent-[var(--color-purple)]"
                />
                Split with people
              </label>
              {splitOn ? (
                <div className="space-y-2">
                  {people.map((p, i) => (
                    <div key={p.id} className="flex gap-2">
                      <Input
                        value={p.name}
                        disabled={p.id === "me"}
                        onChange={(e) => {
                          const next = [...people];
                          next[i] = { ...p, name: e.target.value };
                          setPeople(next);
                        }}
                        placeholder="Name"
                      />
                      {p.id !== "me" ? (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            setPeople(people.filter((x) => x.id !== p.id))
                          }
                        >
                          ✕
                        </Button>
                      ) : null}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setPeople([
                        ...people,
                        {
                          id: crypto.randomUUID(),
                          name: "",
                          amount: 0,
                          settled: false,
                        },
                      ])
                    }
                  >
                    Add person
                  </Button>
                  {errors.split ? (
                    <p className="text-xs text-[var(--color-rose)]">
                      {errors.split}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          <Button
            type="submit"
            className="hidden w-full py-3 xl:inline-flex"
            disabled={submitting}
          >
            {submitting ? "Saving…" : "Save transaction"}
          </Button>
        </aside>

        <div>
          <CategorySelector
            kind={effectiveType}
            value={categoryId}
            onChange={setCategoryId}
          />
          {errors.categoryId ? (
            <p className="mt-2 text-xs text-[var(--color-rose)]">
              {errors.categoryId}
            </p>
          ) : null}
        </div>
      </div>

      <div className="sticky bottom-20 z-10 border-t border-[var(--color-line)] bg-[var(--color-surface)]/95 py-3 backdrop-blur xl:hidden">
        <Button type="submit" className="w-full py-3.5" disabled={submitting}>
          {submitting ? "Saving…" : "Save transaction"}
        </Button>
      </div>
    </form>
  );
}
