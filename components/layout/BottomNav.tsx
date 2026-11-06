"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV } from "@/lib/nav";
import { ColorIcon } from "@/components/ui/ColorIcon";

function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`flex min-w-0 flex-col items-center gap-1 px-1 py-1 text-[10px] font-semibold ${
        active ? "text-[var(--color-purple)]" : "text-[var(--color-muted)]"
      }`}
    >
      <ColorIcon href={href} size="sm" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function BottomNav() {
  const left = BOTTOM_NAV.slice(0, 3);
  const right = BOTTOM_NAV.slice(3);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-line)] bg-[var(--color-surface)] lg:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-6 items-end px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-2">
        {left.map((item) => (
          <li key={item.href}>
            <NavLink href={item.href} label={item.label} />
          </li>
        ))}
        <li className="-mt-4">
          <Link
            href="/add"
            prefetch
            className="mx-auto flex h-14 w-14 cursor-pointer items-center justify-center rounded-full p-1 shadow-xl"
            style={{
              background: "linear-gradient(135deg, var(--stage-a), var(--stage-b))",
            }}
            aria-label="Add transaction"
          >
            <ColorIcon asset="income" size="md" />
          </Link>
        </li>
        {right.map((item) => (
          <li key={item.href}>
            <NavLink href={item.href} label={item.label} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
