"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { TransactionType } from "@/lib/types";

interface OverlayContextValue {
  openAddTransaction: (type?: TransactionType) => void;
  closeAddTransaction: () => void;
  addOpen: boolean;
}

const OverlayContext = createContext<OverlayContextValue | null>(null);

/** Opens Add as a full page (not a modal/card). */
export function OverlayProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const openAddTransaction = useCallback(
    (type: TransactionType = "expense") => {
      const q = type === "expense" ? "" : `?type=${type}`;
      router.push(`/add${q}`);
    },
    [router],
  );

  const closeAddTransaction = useCallback(() => {
    router.push("/home");
  }, [router]);

  const value = useMemo(
    () => ({
      openAddTransaction,
      closeAddTransaction,
      addOpen: false,
    }),
    [openAddTransaction, closeAddTransaction],
  );

  return (
    <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>
  );
}

export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlay must be used within OverlayProvider");
  return ctx;
}
