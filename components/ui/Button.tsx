import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const styles: Record<Variant, string> = {
  primary:
    "bg-[var(--color-ink)] text-white hover:opacity-90",
  secondary:
    "bg-[var(--color-purple-soft)] text-[var(--color-purple)] hover:bg-[var(--color-lavender)]",
  ghost:
    "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-ivory-deep)] border border-[var(--color-line)]",
  danger: "bg-[var(--color-rose)] text-white hover:opacity-90",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <button
      className={`pressable inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
