"use client";

import { useEffect, useState, type ReactNode } from "react";

export function AnimatedListItem({
  children,
  exiting = false,
  onExitComplete,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  exiting?: boolean;
  onExitComplete?: () => void;
  className?: string;
  delayMs?: number;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), 10);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!exiting || !onExitComplete) return;
    const t = window.setTimeout(onExitComplete, 300);
    return () => window.clearTimeout(t);
  }, [exiting, onExitComplete]);

  return (
    <li
      className={`${className} ${exiting ? "list-exit" : entered ? "list-enter" : "opacity-0"}`}
      style={!exiting ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </li>
  );
}
