"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

function resolveTheme(theme: "light" | "dark" | "system") {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

export function ThemeSync() {
  const { profile } = useAuth();
  const theme = profile?.preferences.theme ?? "light";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-ready");

    function apply() {
      root.dataset.theme = resolveTheme(theme);
    }

    apply();

    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  return null;
}
