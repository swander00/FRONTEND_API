import { Bed, Bath, Layout, Home, SquareStack, Car, MapPin, Calendar } from "lucide-react";
import type { PropertyDetailsData } from "../normalizeProperty";
import { formatTitleCase } from "../helpers";
import type { SpecItem } from "../helpers";

// Helper function to format square footage as range
function formatSquareFootageForSpecs(
  min?: number | null,
  max?: number | null,
  fallback?: number | null
): string {
  // If both min and max are available and different, show range
  if (min != null && max != null && min !== max) {
    return `${min.toLocaleString()} - ${max.toLocaleString()}`;
  }
  
  // If both are the same, show single value
  if (min != null && max != null && min === max) {
    return min.toLocaleString();
  }
  
  // If only max is available
  if (max != null) {
    return max.toLocaleString();
  }
  
  // If only min is available
  if (min != null) {
    return min.toLocaleString();
  }
  
  // Fallback to legacy SquareFootage field
  if (fallback != null) {
    return Number(fallback).toLocaleString();
  }
  
  return "N/A";
}

// Helper function to format number with commas
function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Format bedrooms: "3+2" with label "Beds" and helper text "(upstairs+basement)" when both values exist
// If one value is 0, show only the non-zero value without + sign
function formatBedrooms(property: PropertyDetailsData): { label: string; value: string; helperText?: string } {
  const above = property.BedroomsAbove;
  const below = property.BedroomsBelow;
  
  // If both values are non-null, show format with "Beds" label and helper text
  if (above != null && below != null && above >= 0 && below >= 0) {
    // If one value is 0, show only the non-zero value
    if (above === 0) {
      return {
        label: "Beds",
        value: formatNumber(below)
      };
    }
    if (below === 0) {
      return {
        label: "Beds",
        value: formatNumber(above)
      };
    }
    // Both values are non-zero, show "3+2" format
    return {
      label: "Beds",
      value: `${formatNumber(above)}+${formatNumber(below)}`,
      helperText: "(upstairs+basement)"
    };
  }
  
  // Otherwise, show total bedrooms with standard label
  return {
    label: "Beds",
    value: property.Bedrooms?.toString() || "N/A"
  };
}

// Format parking: "2+4" with label "Parking" and helper text "(garage+driveway)" when both values exist
// If one value is 0, show only the non-zero value without + sign
function formatParking(property: PropertyDetailsData): { label: string; value: string; helperText?: string } {
  const garage = property.GarageSpaces;
  const driveway = property.DriveParking;
  
  // If both values are non-null, show format with "Parking" label and helper text
  if (garage != null && driveway != null && garage >= 0 && driveway >= 0) {
    // If one value is 0, show only the non-zero value
    if (garage === 0) {
      return {
        label: "Parking",
        value: formatNumber(driveway)
      };
    }
    if (driveway === 0) {
      return {
        label: "Parking",
        value: formatNumber(garage)
      };
    }
    // Both values are non-zero, show "2+4" format
    return {
      label: "Parking",
      value: `${formatNumber(garage)}+${formatNumber(driveway)}`,
      helperText: "(garage+driveway)"
    };
  }
  
  // Otherwise, show garage spaces or total parking
  if (garage != null && garage >= 0) {
    return {
      label: "Parking",
      value: `${garage} Space${garage !== 1 ? 's' : ''}`
    };
  }
  
  if (property.TotalParking != null && property.TotalParking >= 0) {
    return {
      label: "Parking",
      value: `${property.TotalParking} Space${property.TotalParking !== 1 ? 's' : ''}`
    };
  }
  
  return {
    label: "Parking",
    value: "None"
  };
}

export function buildPropertySpecs(property: PropertyDetailsData): SpecItem[] {
  const bedrooms = formatBedrooms(property);
  const parking = formatParking(property);
  
  return [
    { icon: Bed, label: bedrooms.label, value: bedrooms.value, helperText: bedrooms.helperText, iconColor: "text-blue-600", bgColor: "bg-blue-50", primary: true },
    { icon: Bath, label: "Baths", value: property.Bathrooms?.toString() || "N/A", iconColor: "text-purple-600", bgColor: "bg-purple-50", primary: true },
    { icon: Layout, label: "Sq Ft", value: formatSquareFootageForSpecs(property.SquareFootageMin, property.SquareFootageMax, property.SquareFootage), iconColor: "text-orange-600", bgColor: "bg-orange-50", primary: true },
    { icon: Home, label: "Type", value: property.PropertyType ? formatTitleCase(property.PropertyType) : "N/A", iconColor: "text-green-600", bgColor: "bg-green-50" },
    { icon: Home, label: "Sub Type", value: property.SubType ? formatTitleCase(property.SubType) : "N/A", iconColor: "text-indigo-600", bgColor: "bg-indigo-50" },
    { icon: SquareStack, label: "Basement", value: property.Basement ? formatTitleCase(property.Basement) : "None", iconColor: "text-amber-600", bgColor: "bg-amber-50" },
    { icon: Car, label: parking.label, value: parking.value, helperText: parking.helperText, iconColor: "text-rose-600", bgColor: "bg-rose-50" },
    { icon: MapPin, label: "Lot Size", value: property.LotSize || "N/A", iconColor: "text-teal-600", bgColor: "bg-teal-50" },
    { icon: Calendar, label: "Age", value: property.PropertyAge || "N/A", iconColor: "text-violet-600", bgColor: "bg-violet-50" },
    { icon: Calendar, label: "Days on Market", value: property.DaysOnMarket?.toString() || "N/A", iconColor: "text-slate-600", bgColor: "bg-slate-50" },
  ];
}


