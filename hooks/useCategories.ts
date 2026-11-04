"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  DEFAULT_CATEGORIES,
  getCategoriesByKind,
  getExpenseGroups,
} from "@/lib/categories";
import type { Category, CategoryKind } from "@/lib/types";

const CUSTOM_KEY = "nidhiva:categories:";

function readCustom(userId: string): Category[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_KEY + userId);
    return raw ? (JSON.parse(raw) as Category[]) : [];
  } catch {
    return [];
  }
}

function writeCustom(userId: string, items: Category[]) {
  localStorage.setItem(CUSTOM_KEY + userId, JSON.stringify(items));
}

export function useCategories() {
  const { userId } = useAuth();
  const [custom, setCustom] = useState<Category[]>([]);

  useEffect(() => {
    if (!userId) {
      setCustom([]);
      return;
    }
    setCustom(readCustom(userId));
  }, [userId]);

  const categories = useMemo(
    () => [...DEFAULT_CATEGORIES, ...custom],
    [custom],
  );

  const expenseGroups = useMemo(() => getExpenseGroups(custom), [custom]);

  const byKind = useCallback(
    (kind: CategoryKind) => getCategoriesByKind(kind, custom),
    [custom],
  );

  const addCustom = useCallback(
    (name: string, kind: CategoryKind, group?: string, icon?: string) => {
      if (!userId) return null;
      const item: Category = {
        id: `custom-${crypto.randomUUID()}`,
        name: name.trim(),
        kind,
        group,
        icon,
        isCustom: true,
        userId,
      };
      const next = [...custom, item];
      setCustom(next);
      writeCustom(userId, next);
      return item;
    },
    [userId, custom],
  );

  const removeCustom = useCallback(
    (id: string) => {
      if (!userId) return;
      const next = custom.filter((c) => c.id !== id);
      setCustom(next);
      writeCustom(userId, next);
    },
    [userId, custom],
  );

  return {
    categories,
    custom,
    expenseGroups,
    byKind,
    addCustom,
    removeCustom,
  };
}
