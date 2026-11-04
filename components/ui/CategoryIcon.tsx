"use client";

import { PremiumIcon } from "@/components/ui/PremiumIcon";
import {
  getCategoryPremiumSrc,
  getGroupPremiumSrc,
  GROUP_COLORS,
} from "@/lib/premium-icons";

export function CategoryIcon({
  categoryId,
  size = "md",
  className = "",
}: {
  categoryId: string;
  size?: "sm" | "md" | "lg";
  tone?: string;
  className?: string;
}) {
  return (
    <PremiumIcon
      src={getCategoryPremiumSrc(categoryId)}
      alt=""
      size={size}
      className={className}
    />
  );
}

export function GroupIcon({
  groupId,
  className = "",
}: {
  groupId: string;
  className?: string;
}) {
  const colors = GROUP_COLORS[groupId] ?? GROUP_COLORS.custom;
  return (
    <span
      className={`inline-flex rounded-xl p-0.5 ${className}`}
      style={{ background: colors.tint }}
    >
      <PremiumIcon src={getGroupPremiumSrc(groupId)} size="sm" alt="" />
    </span>
  );
}
