"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ColorIcon } from "@/components/ui/ColorIcon";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function ProfilePage() {
  const { profile, isGuest, logout, updatePreferences } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const theme = profile?.preferences.theme ?? "light";

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  function setTheme(next: "light" | "dark" | "system") {
    updatePreferences({ theme: next });
    toast({
      title:
        next === "dark"
          ? "Dark mode on"
          : next === "light"
            ? "Light mode on"
            : "Using system theme",
      tone: "info",
      durationMs: 1800,
    });
  }

  return (
    <div className="stagger space-y-5">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Profile</h1>
        <p className="text-sm text-[var(--color-muted)]">Account and preferences</p>
      </header>

      <section className="rounded-3xl bg-[var(--color-surface)] p-5 ring-1 ring-[var(--color-line)]">
        <p className="font-[family-name:var(--font-display)] text-2xl">
          {profile?.displayName}
        </p>
        <p className="text-sm text-[var(--color-muted)]">
          {isGuest ? "Guest session · data stays on this device" : profile?.email}
        </p>
      </section>

      <section className="space-y-4 rounded-2xl bg-[var(--color-surface)] p-4 ring-1 ring-[var(--color-line)]">
        <h2 className="font-medium">Appearance</h2>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: "light", label: "Light", asset: "home" as const },
              { id: "dark", label: "Dark", asset: "savings" as const },
              { id: "system", label: "System", asset: "activity" as const },
            ] as const
          ).map((opt) => {
            const active = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTheme(opt.id)}
                className={`pressable flex flex-col items-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium ring-1 ${
                  active
                    ? "bg-[var(--color-lavender)] ring-[var(--color-purple)] text-[var(--color-ink)]"
                    : "bg-[var(--color-ivory-deep)] ring-transparent text-[var(--color-muted)]"
                }`}
              >
                <ColorIcon asset={opt.asset} size="sm" />
                {opt.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-[var(--color-muted)]">
          Colors transition smoothly for comfortable night viewing.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl bg-[var(--color-surface)] p-4 ring-1 ring-[var(--color-line)]">
        <h2 className="font-medium">Preferences</h2>
        <label className="block text-sm">
          <span className="text-[var(--color-muted)]">Default view</span>
          <select
            className="mt-1 w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3"
            value={profile?.preferences.defaultView ?? "home"}
            onChange={(e) =>
              updatePreferences({
                defaultView: e.target.value as "home" | "activity" | "calendar",
              })
            }
          >
            <option value="home">Home</option>
            <option value="activity">Activity</option>
            <option value="calendar">Calendar</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-[var(--color-muted)]">Currency</span>
          <select
            className="mt-1 w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3"
            value={profile?.preferences.currency ?? "INR"}
            onChange={(e) => updatePreferences({ currency: e.target.value })}
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </label>
      </section>

      <section className="grid gap-2">
        {[
          ["/budgets", "Budgets"],
          ["/goals", "Goals"],
          ["/calendar", "Calendar"],
          ["/splits", "Split expenses"],
        ].map(([href, label]) => (
          <Link
            key={href}
            className="card-lift pressable rounded-2xl bg-[var(--color-ivory-deep)] px-4 py-3 text-sm font-medium"
            href={href}
          >
            {label} →
          </Link>
        ))}
      </section>

      <Button variant="ghost" className="w-full" onClick={() => void handleLogout()}>
        Log out
      </Button>
    </div>
  );
}
