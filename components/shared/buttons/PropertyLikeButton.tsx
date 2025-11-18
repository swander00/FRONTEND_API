"use client";

import type { ButtonHTMLAttributes, MouseEventHandler } from "react";

import { Heart } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "header" | "card" | "minimal";
type BorderRadius =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full";

type PropertyLikeButtonProps = {
  property?: unknown;
  size?: ButtonSize;
  variant?: ButtonVariant;
  borderRadius?: BorderRadius;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "property">;

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "p-1.5 text-xs",
  md: "p-2 text-sm",
  lg: "p-3 text-base",
};

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  header:
    "bg-white/90 text-rose-600 border border-white/60 hover:bg-white",
  card:
    "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100",
  minimal:
    "bg-white text-rose-600 border border-gray-200 hover:bg-rose-50",
};

const RADIUS_STYLES: Record<BorderRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export function PropertyLikeButton(props: PropertyLikeButtonProps) {
  const {
    property,
    size = "md",
    variant = "card",
    borderRadius = "full",
    className,
    onClick,
    ...rest
  } = props;
  void property;

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);
    if (!event.defaultPrevented) {
      toast.success("Added to favorites");
    }
  };

  return (
    <button
      type="button"
      aria-label="Favorite property"
      {...rest}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center transition-colors duration-200",
        SIZE_STYLES[size],
        VARIANT_STYLES[variant] ?? VARIANT_STYLES.card,
        RADIUS_STYLES[borderRadius] ?? "rounded-full",
        className,
      )}
    >
      <Heart className="h-4 w-4 fill-current" />
    </button>
  );
}


