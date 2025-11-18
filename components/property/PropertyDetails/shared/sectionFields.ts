import { Calendar, DollarSign, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatDate, formatPrice, formatTitleCase } from "../helpers";
import type { PropertyDetailsData } from "../normalizeProperty";

export interface SectionField {
  label: string;
  value: string;
  highlight?: boolean;
  icon?: LucideIcon;
}

const DEFAULT_INTERIOR_FEATURES = ["Hardwood Floors", "Granite Countertops", "Stainless Steel Appliances", "Walk-In Closet", "Fireplace", "Crown Molding", "Recessed Lighting"];
const DEFAULT_EXTERIOR_FEATURES = ["Swimming Pool", "Patio", "Garden", "Two-Car Garage", "Landscaping", "Deck"];
const DEFAULT_OTHER_FEATURES = ["Smart Home Integration", "Energy Efficient Windows", "Home Office Ready"];

const formatParkingValue = (value?: string | number | null): string => {
  if (!value && value !== 0) return "N/A";
  const match = value.toString().match(/^(\d+)/);
  if (match) return match[1];
  const num = parseInt(value.toString(), 10);
  return Number.isNaN(num) ? value.toString() : num.toString();
};

const formatSquareFootageRange = (
  min?: number | null,
  max?: number | null,
  fallback?: number | null
): string => {
  // If both min and max are available and different, show range
  if (min != null && max != null && min !== max) {
    return `${min.toLocaleString()} - ${max.toLocaleString()} sq ft`;
  }
  
  // If both are the same, show single value
  if (min != null && max != null && min === max) {
    return `${min.toLocaleString()} sq ft`;
  }
  
  // If only max is available
  if (max != null) {
    return `${max.toLocaleString()} sq ft`;
  }
  
  // If only min is available
  if (min != null) {
    return `${min.toLocaleString()} sq ft`;
  }
  
  // Fallback to legacy SquareFootage field
  if (fallback != null) {
    return `${Number(fallback).toLocaleString()} sq ft`;
  }
  
  return "N/A";
};

export function getListingInformationFields(property: PropertyDetailsData): SectionField[] {
  return [
    {
      label: "Date Listed",
      value: property.ListDate ? formatDate(property.ListDate) : "N/A",
    },
    {
      label: "Status",
      value: property.MlsStatus || "Active",
      highlight: true,
    },
    {
      label: "Original Price",
      value: property.OriginalPrice && property.OriginalPrice > 0 
        ? formatPrice(property.OriginalPrice)
        : property.ListPrice && property.ListPrice > 0
          ? formatPrice(property.ListPrice)
          : "N/A",
      highlight: true,
    },
    {
      label: "MLS Number",
      value: property.MLSNumber || "N/A",
    },
    {
      label: "Days on Market",
      value: property.DaysOnMarket?.toString() || "N/A",
      highlight: Boolean(property.DaysOnMarket && property.DaysOnMarket > 30),
    },
    {
      label: "Possession",
      value: property.Possession || "N/A",
    },
  ];
}

export function getPropertyDetailFields(property: PropertyDetailsData): SectionField[] {
  const fields: SectionField[] = [
    { label: "Property Class", value: property.PropertyClass || "Residential", highlight: true },
    { label: "Property Type", value: property.PropertyType || "N/A", highlight: true },
    { label: "Bedrooms", value: property.Bedrooms?.toString() || "N/A", highlight: true },
    { label: "Bathrooms", value: property.Bathrooms?.toString() || "N/A", highlight: true },
    { label: "Kitchens", value: property.Kitchens?.toString() || "1" },
    { 
      label: "Square Footage", 
      value: formatSquareFootageRange(property.SquareFootageMin, property.SquareFootageMax, property.SquareFootage), 
      highlight: true 
    },
    { label: "Lot Size", value: property.LotSize || "N/A" },
    { label: "Property Age", value: property.PropertyAge ? `${property.PropertyAge} years` : "N/A" },
    { label: "Fireplace", value: property.HasFireplace ? "Yes" : "No" },
  ];

  // Only include POTL field if it has a value
  if (property.POTLFee != null) {
    fields.push({
      label: "POTL (Potl Fee)",
      value: formatPrice(Number(property.POTLFee)),
      highlight: true
    });
  }

  return fields;
}

export function getBasementFields(property: PropertyDetailsData): SectionField[] {
  const basementValueRaw = property.Basement || "";
  const basementValue = basementValueRaw.toLowerCase();
  const basementStatus = basementValueRaw ? formatTitleCase(basementValueRaw) : "Not specified";

  // Use dedicated BasementEntrance field if available, otherwise fall back to parsing Basement string
  // Valid values from database: "Separate Entrance", "Walk-Out", "Walk-Up", or NULL
  const basementEntrance = property.BasementEntrance 
    ? formatTitleCase(property.BasementEntrance)
    : (basementValue.includes("separate") ? "Separate Entrance" : null);
  
  const hasSeparateEntrance = property.BasementEntrance 
    ? property.BasementEntrance.toLowerCase().includes("separate")
    : basementValue.includes("separate");

  // Use dedicated BasementKitchen field if explicitly set, otherwise fall back to checking KitchensBelow or parsing Basement string
  const hasBasementKitchen = property.BasementKitchen !== undefined && property.BasementKitchen !== null
    ? property.BasementKitchen
    : (property.KitchensBelow && property.KitchensBelow > 0) || basementValue.includes("kitchen");

  return [
    {
      label: "Basement Status",
      value: basementStatus,
      highlight: basementValue.includes("finished"),
    },
    {
      label: "Basement Bedroom",
      value: property.BedroomsBelow?.toString() || "N/A",
      highlight: Boolean(property.BedroomsBelow && property.BedroomsBelow > 0),
    },
    {
      label: "Basement Entrance",
      value: basementEntrance || "N/A",
      highlight: hasSeparateEntrance,
    },
    {
      label: "Basement Kitchen",
      value: hasBasementKitchen ? "Yes" : "No",
      highlight: Boolean(hasBasementKitchen),
    },
  ];
}

export function getParkingFields(property: PropertyDetailsData): SectionField[] {
  return [
    { label: "Garage Spaces", value: formatParkingValue(property.GarageParking), highlight: true },
    { label: "Driveway Spaces", value: formatParkingValue(property.DriveParking) },
    { label: "Total Parking", value: formatParkingValue(property.TotalParking), highlight: true },
  ];
}

export function getUtilitiesFields(property: PropertyDetailsData): SectionField[] {
  return [
    { label: "Heating", value: property.Heating || "Forced Air", highlight: true },
    { label: "Cooling", value: property.Cooling || "Central Air", highlight: true },
    { label: "Water", value: property.WaterSource || "Municipal" },
    { label: "Sewer", value: property.Sewer || "Municipal" },
  ];
}

export function getLeaseTermsFields(property: PropertyDetailsData): SectionField[] {
  return [
    { label: "Rent Includes", value: property.RentIncludes || "N/A", highlight: Boolean(property.RentIncludes) },
    { label: "Furnished", value: property.Furnished || "N/A", highlight: property.Furnished?.toLowerCase() === "yes" },
    { label: "Lease Term", value: property.LeaseTerm || "N/A" },
  ];
}

export function getPotlFields(property: PropertyDetailsData): SectionField[] {
  return [
    { label: "POTL Fee", value: property.POTLFee ? formatPrice(Number(property.POTLFee)) : "N/A", highlight: true, icon: DollarSign },
    { label: "Fee Schedule", value: property.POTLSchedule || "Monthly", icon: Calendar },
    { label: "Fee Includes", value: property.POTLIncludes || "Standard Services", icon: FileText },
  ];
}

export function getPoolWaterfrontFields(property: PropertyDetailsData): SectionField[] {
  return [
    {
      label: "Swimming Pool",
      value: property.SwimmingPool || "None",
      highlight: Boolean(property.SwimmingPool && property.SwimmingPool !== "None"),
    },
    {
      label: "Waterfront",
      value: property.Waterfront ? "Yes" : "No",
      highlight: Boolean(property.Waterfront),
    },
    {
      label: "Water Access",
      value: property.WaterAccess || "None",
    },
    {
      label: "Water View",
      value: property.WaterView ? "Yes" : "No",
    },
  ];
}

const parseFeatures = (featuresString?: string | null): string[] => {
  if (!featuresString) return [];
  return featuresString
    .split(/[,;|]/)
    .map((feature) => feature.trim())
    .filter((feature) => feature.length > 0)
    .map((feature) =>
      feature
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" "),
    );
};

export function getFeatureLists(property: PropertyDetailsData) {
  const interiorFeatures = parseFeatures(property.InteriorFeatures);
  const exteriorFeatures = parseFeatures(property.ExteriorFeatures);
  const otherFeatures = parseFeatures(property.OtherFeatures);

  return {
    interior: interiorFeatures.length > 0 ? interiorFeatures : DEFAULT_INTERIOR_FEATURES,
    exterior: exteriorFeatures.length > 0 ? exteriorFeatures : DEFAULT_EXTERIOR_FEATURES,
    other: otherFeatures.length > 0 ? otherFeatures : DEFAULT_OTHER_FEATURES,
  };
}


