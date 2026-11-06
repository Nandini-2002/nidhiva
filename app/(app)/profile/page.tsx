"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

const JUMPS = [
  {
    href: "/budgets",
    label: "Budgets",
    gradient: "linear-gradient(100deg, #1e3a8a, #312e81)",
  },
  {
    href: "/goals",
    label: "Goals",
    gradient: "linear-gradient(100deg, #312e81, #6d28d9)",
  },
  {
    href: "/calendar",
    label: "Calendar",
    gradient: "linear-gradient(100deg, #1e40af, #0369a1)",
  },
  {
    href: "/splits",
    label: "Split expenses",
    gradient: "linear-gradient(100deg, #1e3a8a, #2563eb)",
  },
];

export default function ProfilePage() {
  const { profile, isGuest, logout, updatePreferences } = useAuth();
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  return (
    <div className="stagger space-y-5">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Currency and the places you come back to.
        </p>
      </header>

      <section className="rounded-2xl bg-white p-5 ring-1 ring-[var(--color-line)]">
        <p className="text-2xl font-bold">{profile?.displayName}</p>
        <p className="text-sm text-[var(--color-muted)]">
          {isGuest ? "Guest session · data stays on this device" : profile?.email}
        </p>
      </section>

      <section className="space-y-3 rounded-2xl bg-white p-4 ring-1 ring-[var(--color-line)]">
        <h2 className="font-medium">Preferences</h2>
        <label className="block text-sm">
          <span className="text-[var(--color-muted)]">Default view</span>
          <select
            className="mt-1 w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3"
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
            className="mt-1 w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3"
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
        {JUMPS.map((item) => {
          const active = hovered === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl px-4 py-3 text-sm font-medium"
              style={{
                background: active ? item.gradient : "#e8eaee",
                color: active ? "#ffffff" : "#0f172a",
              }}
              onMouseEnter={() => setHovered(item.href)}
              onMouseLeave={() => setHovered(null)}
            >
              {item.label} →
            </Link>
          );
        })}
      </section>

      <Button variant="ghost" className="w-full" onClick={() => void handleLogout()}>
        Log out
      </Button>
    </div>
  );
}
