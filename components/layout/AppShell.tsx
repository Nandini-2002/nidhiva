"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileMenuButton, Sidebar } from "@/components/layout/Sidebar";
import { PageTransition } from "@/components/motion/PageTransition";
import { useAuth } from "@/context/AuthContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { userId, loading, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !userId) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, userId, router, pathname]);

  return (
    <div className="min-h-screen w-full bg-[var(--color-ivory)] text-[var(--color-ink)]">
      {(loading || !userId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ivory)]">
          <div className="h-9 w-9 animate-pulse rounded-full bg-[var(--color-purple)]/30" />
        </div>
      )}

      {userId ? <Sidebar /> : null}

      <div className="min-h-screen lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-surface)] px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {userId ? <MobileMenuButton /> : null}
            <div className="lg:hidden">
              <p className="text-sm font-bold tracking-tight">Nidhiva</p>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                {pathname === "/home"
                  ? "Dashboard"
                  : pathname.slice(1).charAt(0).toUpperCase() +
                    pathname.slice(2)}
              </p>
              <p className="text-xs text-[var(--color-muted)]">
                Track income, expenses and transfers accurately
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{profile?.displayName ?? "Guest"}</p>
              <p className="text-[11px] text-[var(--color-muted)]">
                {profile?.preferences.currency ?? "INR"} wallet
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-purple-soft)] text-xs font-bold text-[var(--color-purple)]">
              {(profile?.displayName ?? "G").slice(0, 1).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="px-4 py-5 pb-28 sm:px-6 sm:py-6 lg:pb-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      {userId ? <BottomNav /> : null}
    </div>
  );
}
