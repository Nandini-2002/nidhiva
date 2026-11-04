"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  side = "bottom",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  side?: "bottom" | "right";
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setExiting(false);
      document.body.style.overflow = "hidden";
      return;
    }
    if (!visible) return;
    setExiting(true);
    const t = window.setTimeout(() => {
      setVisible(false);
      setExiting(false);
      document.body.style.overflow = "";
    }, 280);
    return () => window.clearTimeout(t);
  }, [open, visible]);

  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, onClose]);

  if (!mounted || !visible) return null;

  const panelClass =
    side === "right"
      ? `fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-[var(--color-surface)] shadow-2xl ${
          exiting ? "drawer-exit" : "drawer-enter"
        }`
      : `fixed inset-x-0 bottom-0 z-[70] mx-auto flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-2xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-2xl ${
          exiting ? "sheet-exit" : "sheet-enter"
        }`;

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close overlay"
        className={`absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-[2px] ${
          exiting ? "overlay-exit" : "overlay-enter"
        }`}
        onClick={onClose}
      />
      <div className={panelClass} role="dialog" aria-modal="true">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--color-line)] px-5 py-4">
          <div>
            {title ? (
              <h2 className="font-[family-name:var(--font-display)] text-xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pressable rounded-xl bg-[var(--color-ivory-deep)] p-2 text-[var(--color-ink)]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
