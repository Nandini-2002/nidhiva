"use client";

import { PremiumIcon } from "@/components/ui/PremiumIcon";
import {
  getNavPremiumSrc,
  PREMIUM_ASSETS,
  type PremiumAssetKey,
} from "@/lib/premium-icons";

/** Nav / generic premium 3D icon. Prefer `src` or `href`; `emoji` kept for API compat. */
export function ColorIcon({
  emoji,
  href,
  asset,
  src,
  size = "md",
  className = "",
}: {
  emoji?: string;
  href?: string;
  asset?: PremiumAssetKey;
  src?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  bg?: string;
}) {
  const resolved =
    src ??
    (asset ? PREMIUM_ASSETS[asset] : undefined) ??
    (href ? getNavPremiumSrc(href) : undefined) ??
    PREMIUM_ASSETS.activity;

  return (
    <PremiumIcon
      src={resolved}
      alt={emoji ?? ""}
      size={size === "xs" ? "sm" : size}
      className={className}
    />
  );
}
