"use client";

import { AuthProvider } from "@/context/AuthContext";
import { OverlayProvider } from "@/context/OverlayContext";
import { ToastProvider } from "@/context/ToastContext";
import { ThemeSync } from "@/components/theme/ThemeSync";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <OverlayProvider>
          <ThemeSync />
          {children}
        </OverlayProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
