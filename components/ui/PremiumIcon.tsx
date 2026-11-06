"use client";

const sizes = {
  xs: "h-6 w-6",
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-14 w-14",
} as const;

/** Colorful 3D icon tile — light frame, no black box */
export function PremiumIcon({
  src,
  alt = "",
  size = "md",
  className = "",
}: {
  src: string;
  alt?: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_6px_16px_rgba(15,23,42,0.12)] ring-1 ring-black/5 ${sizes[size]} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        draggable={false}
      />
    </span>
  );
}
