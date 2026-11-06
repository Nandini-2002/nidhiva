"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV } from "@/lib/nav";
import { ColorIcon } from "@/components/ui/ColorIcon";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-line)] bg-[var(--color-surface)] lg:hidden">
      <ul className="mx-auto flex max-w-lg items-center justify-around px-2 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-2">
        {BOTTOM_NAV.slice(0, 2).map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex min-w-[3.75rem] flex-col items-center gap-1 px-2 py-1 text-[10px] font-semibold ${
                  active
                    ? "text-[var(--color-purple)]"
                    : "text-[var(--color-muted)]"
                }`}
              >
                <ColorIcon href={item.href} size="sm" />
                {item.label}
              </Link>
            </li>
          );
        })}

        <li className="-mt-4">
          <Link
            href="/add"
            prefetch
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full p-1 shadow-xl"
            style={{
              background: "linear-gradient(135deg, var(--stage-a), var(--stage-b))",
            }}
            aria-label="Add transaction"
          >
            <ColorIcon asset="income" size="md" />
          </Link>
        </li>

        {BOTTOM_NAV.slice(2).map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex min-w-[3.75rem] flex-col items-center gap-1 px-2 py-1 text-[10px] font-semibold ${
                  active
                    ? "text-[var(--color-purple)]"
                    : "text-[var(--color-muted)]"
                }`}
              >
                <ColorIcon href={item.href} size="sm" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
