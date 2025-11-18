"use client";

import type { ButtonHTMLAttributes } from "react";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type CircularActionButtonProps = {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  visualVariant?: "header" | "default";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const SIZE_STYLES = {
  sm: "p-2 text-xs",
  md: "p-2.5 text-sm",
  lg: "p-3 text-base",
};

const VARIANT_STYLES = {
  header:
    "bg-white/90 border border-white/70 text-gray-700 hover:bg-white hover:text-gray-900",
  default:
    "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 hover:text-gray-900",
};

export function CircularActionButton({
  icon: Icon,
  size = "md",
  visualVariant = "default",
  className,
  ...rest
}: CircularActionButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all duration-200",
        SIZE_STYLES[size],
        VARIANT_STYLES[visualVariant],
        className,
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}


