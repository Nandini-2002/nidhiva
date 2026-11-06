"use client";

import { useEffect } from "react";

export function ThemeSync() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-ready");
    root.dataset.theme = "light";
  }, []);

  return null;
}
