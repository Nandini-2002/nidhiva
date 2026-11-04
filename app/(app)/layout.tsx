import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--color-lavender-deep)]" />
          </div>
        }
      >
        {children}
      </Suspense>
    </AppShell>
  );
}
