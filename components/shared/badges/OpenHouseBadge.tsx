"use client";

type OpenHouseBadgeProps = {
  dateTime: string;
  size?: "sm" | "md";
  variant?: "header" | "default";
  className?: string;
};

const SIZE_STYLES = {
  sm: "text-[10px] px-2 py-0.5",
  md: "text-xs px-3 py-1",
};

const VARIANT_STYLES = {
  header:
    "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border border-white/40 shadow-md",
  default:
    "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm",
};

export function OpenHouseBadge({
  dateTime,
  size = "sm",
  variant = "default",
  className,
}: OpenHouseBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full font-semibold uppercase tracking-wide",
        SIZE_STYLES[size],
        VARIANT_STYLES[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {dateTime}
    </span>
  );
}


