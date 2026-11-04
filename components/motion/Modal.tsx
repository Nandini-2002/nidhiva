"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
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
    }, 220);
    return () => window.clearTimeout(t);
  }, [open, visible]);

  if (!mounted || !visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close overlay"
        className={`absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-[2px] ${
          exiting ? "overlay-exit" : "overlay-enter"
        }`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-[70] w-full max-w-lg rounded-3xl bg-[var(--color-surface)] p-5 shadow-2xl ring-1 ring-[var(--color-line)] ${
          exiting ? "modal-exit" : "modal-enter"
        }`}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? (
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="pressable rounded-xl bg-[var(--color-ivory-deep)] p-2"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
