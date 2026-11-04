"use client";

import { Input } from "@/components/ui/Input";
import type { TransactionFilters as Filters, TransactionType } from "@/lib/types";

const TYPES: { value: Filters["type"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
  { value: "transfer", label: "Transfers" },
];

export function TransactionFilters({
  value,
  onChange,
  categories,
}: {
  value: Filters;
  onChange: (next: Filters) => void;
  categories: { id: string; name: string }[];
}) {
  return (
    <div className="space-y-3">
      <Input
        placeholder="Search notes…"
        value={value.search ?? ""}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
      />
      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={String(t.value)}
            type="button"
            onClick={() =>
              onChange({
                ...value,
                type: t.value as TransactionType | "all",
              })
            }
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              (value.type ?? "all") === t.value
                ? "bg-[var(--color-purple)] text-white"
                : "bg-[var(--color-ivory-deep)] text-[var(--color-muted)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="date"
          value={value.from ?? ""}
          onChange={(e) => onChange({ ...value, from: e.target.value || undefined })}
        />
        <Input
          type="date"
          value={value.to ?? ""}
          onChange={(e) => onChange({ ...value, to: e.target.value || undefined })}
        />
      </div>
      <select
        value={value.categoryId ?? ""}
        onChange={(e) =>
          onChange({
            ...value,
            categoryId: e.target.value || undefined,
          })
        }
        className="w-full rounded-2xl border border-[var(--color-line)] bg-white/80 px-4 py-3 text-sm"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
