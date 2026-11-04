"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ACCOUNT_NAV,
  MAIN_NAV,
  PLANNING_LINKS,
  type NavItem,
} from "@/lib/nav";
import { ColorIcon } from "@/components/ui/ColorIcon";
import { useAuth } from "@/context/AuthContext";
import { useOverlay } from "@/context/OverlayContext";

function NavSection({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-0.5">
      <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-sidebar-muted)]">
        {title}
      </p>
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13px] font-medium transition ${
              active
                ? "bg-[var(--color-sidebar-active)] text-white shadow-sm"
                : "text-[var(--color-sidebar-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-white"
            }`}
          >
            <ColorIcon href={item.href} size="sm" />
            {item.label}
            {active ? (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const { profile, isGuest } = useAuth();
  const { openAddTransaction } = useOverlay();

  return (
    <div className="flex h-full flex-col text-white">
      <div className="border-b border-white/10 px-3 pb-5 pt-1">
        <Link
          href="/home"
          onClick={onNavigate}
          className="flex items-center gap-2 text-[22px] font-extrabold tracking-tight text-white"
        >
          <ColorIcon asset="savings" size="md" />
          Nidhiva
        </Link>
        <p className="mt-2 truncate text-xs text-[var(--color-sidebar-muted)]">
          {profile?.displayName ?? "Guest"}
          {isGuest ? " · local session" : ""}
        </p>
      </div>

      <div className="px-1 py-4">
        <button
          type="button"
          onClick={() => {
            openAddTransaction("expense");
            onNavigate?.();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-3 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-emerald-500/25 hover:brightness-110"
        >
          <ColorIcon asset="income" size="sm" />
          New transaction
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-1 pb-4">
        <NavSection title="Overview" items={MAIN_NAV} onNavigate={onNavigate} />
        <NavSection
          title="Planning"
          items={PLANNING_LINKS}
          onNavigate={onNavigate}
        />
        <NavSection
          title="Account"
          items={ACCOUNT_NAV}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-white/5 bg-[var(--color-sidebar)] px-3 py-5 lg:flex">
      <SidebarBody />
    </aside>
  );
}

export function MobileMenuButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink)] lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[55] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-[var(--color-overlay)] overlay-enter"
            onClick={() => setOpen(false)}
          />
          <aside className="drawer-enter-left absolute inset-y-0 left-0 flex w-[min(17.5rem,86vw)] flex-col bg-[var(--color-sidebar)] px-3 py-4 shadow-2xl">
            <div className="mb-2 flex justify-end px-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-[var(--color-sidebar-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
