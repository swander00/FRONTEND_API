import type { LucideIcon } from "lucide-react";
import { DollarSign, FileText, Home, PawPrint, Package } from "lucide-react";
import type { PropertyDetailsData } from "../normalizeProperty";

export interface CondoInfoField {
  label: string;
  value: string;
  icon: LucideIcon;
  highlight: boolean;
}

function formatTitleCase(value?: string | null) {
  if (!value || value === "?" || value === "N/A") return "N/A";
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function formatCurrency(value?: number | string | null) {
  if (value === undefined || value === null || value === "" || value === "N/A") return "N/A";
  const numericValue = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(numericValue)) return "N/A";
  return `$${numericValue.toLocaleString()}`;
}

export function getCondoInfoFields(property: PropertyDetailsData): CondoInfoField[] {
  return [
    {
      label: "Condo Fee",
      value: formatCurrency(property.MaintenanceFee),
      icon: DollarSign,
      highlight: Boolean(property.MaintenanceFee),
    },
    {
      label: "Fee Includes",
      value: formatTitleCase(property.FeeIncludes),
      icon: FileText,
      highlight: Boolean(property.FeeIncludes),
    },
    {
      label: "Balcony",
      value: formatTitleCase(property.Balcony),
      icon: Home,
      highlight: Boolean(property.Balcony),
    },
    {
      label: "Pets",
      value: formatTitleCase(property.Pets),
      icon: PawPrint,
      highlight: Boolean(property.Pets),
    },
    {
      label: "Locker",
      value: formatTitleCase(property.Locker),
      icon: Package,
      highlight: Boolean(property.Locker),
    },
  ];
}

