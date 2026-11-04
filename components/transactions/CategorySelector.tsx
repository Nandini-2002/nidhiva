"use client";

import { useMemo, useState } from "react";
import { CategoryIcon, GroupIcon } from "@/components/ui/CategoryIcon";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCategories } from "@/hooks/useCategories";
import { GROUP_COLORS } from "@/lib/premium-icons";
import type { CategoryKind } from "@/lib/types";

export function CategorySelector({
  kind,
  value,
  onChange,
}: {
  kind: CategoryKind;
  value?: string;
  onChange: (categoryId: string) => void;
}) {
  const { byKind, expenseGroups, addCustom } = useCategories();
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customGroup, setCustomGroup] = useState(
    expenseGroups[0]?.name ?? "Custom",
  );

  const flat = useMemo(() => byKind(kind), [byKind, kind]);
  const selected = flat.find((c) => c.id === value);

  if (kind === "expense") {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[var(--color-ink)]">
            Choose category
          </p>
          {selected ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              <CategoryIcon categoryId={selected.id} size="sm" />
              {selected.name}
            </span>
          ) : null}
        </div>

        <div className="space-y-5">
          {expenseGroups.map((group) => {
            const colors = GROUP_COLORS[group.id] ?? GROUP_COLORS.custom;
            return (
              <section
                key={group.id}
                className="rounded-2xl border p-3 sm:p-4"
                style={{
                  background: colors.bg,
                  borderColor: colors.border,
                }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <GroupIcon groupId={group.id} />
                  <h3
                    className="text-sm font-bold"
                    style={{ color: colors.text }}
                  >
                    {group.name}
                  </h3>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      background: colors.tint,
                      color: colors.text,
                    }}
                  >
                    {group.categories.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                  {group.categories.map((cat) => {
                    const active = value === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => onChange(cat.id)}
                        className={`flex items-center gap-2 rounded-xl border px-2.5 py-2.5 text-left text-sm transition hover:-translate-y-0.5 ${
                          active
                            ? "border-violet-500 bg-white font-bold shadow-md shadow-violet-200"
                            : "border-white/80 bg-white/90 hover:border-violet-300"
                        }`}
                      >
                        <CategoryIcon categoryId={cat.id} size="sm" />
                        <span className="leading-tight">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <CustomCategoryForm
          show={showCustom}
          name={customName}
          group={customGroup}
          groups={expenseGroups.map((g) => g.name)}
          onToggle={() => setShowCustom((s) => !s)}
          onName={setCustomName}
          onGroup={setCustomGroup}
          onAdd={() => {
            const created = addCustom(customName, "expense", customGroup);
            if (created) {
              onChange(created.id);
              setCustomName("");
              setShowCustom(false);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold">Choose category</p>
        {selected ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-700">
            <CategoryIcon categoryId={selected.id} size="sm" />
            {selected.name}
          </span>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-teal-200 bg-teal-50/70 p-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {flat.map((cat) => {
          const active = value === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange(cat.id)}
              className={`flex items-center gap-2 rounded-xl border px-2.5 py-2.5 text-left text-sm transition hover:-translate-y-0.5 ${
                active
                  ? "border-teal-500 bg-white font-bold shadow-md shadow-teal-200"
                  : "border-white bg-white/90 hover:border-teal-300"
              }`}
            >
              <CategoryIcon categoryId={cat.id} size="sm" />
              {cat.name}
            </button>
          );
        })}
      </div>
      <CustomCategoryForm
        show={showCustom}
        name={customName}
        onToggle={() => setShowCustom((s) => !s)}
        onName={setCustomName}
        onAdd={() => {
          const created = addCustom(customName, kind);
          if (created) {
            onChange(created.id);
            setCustomName("");
            setShowCustom(false);
          }
        }}
      />
    </div>
  );
}

function CustomCategoryForm({
  show,
  name,
  group,
  groups,
  onToggle,
  onName,
  onGroup,
  onAdd,
}: {
  show: boolean;
  name: string;
  group?: string;
  groups?: string[];
  onToggle: () => void;
  onName: (v: string) => void;
  onGroup?: (v: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="border-t border-[var(--color-line)] pt-3">
      <button
        type="button"
        onClick={onToggle}
        className="text-sm font-semibold text-violet-600"
      >
        {show ? "Cancel" : "+ Add custom category"}
      </button>
      {show ? (
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Input
            value={name}
            onChange={(e) => onName(e.target.value)}
            placeholder="Category name"
          />
          {groups && onGroup ? (
            <select
              value={group}
              onChange={(e) => onGroup(e.target.value)}
              className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-3 text-sm"
            >
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          ) : null}
          <Button type="button" onClick={onAdd} disabled={!name.trim()}>
            Add
          </Button>
        </div>
      ) : null}
    </div>
  );
}
