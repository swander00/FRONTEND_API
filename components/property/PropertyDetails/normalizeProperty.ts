import type { Property } from "@/types/property";

type Maybe<T> = T | null | undefined;

function formatLotSize(property: Property): string | undefined {
  const lot = property.lotSize;
  if (!lot) {
    return undefined;
  }

  if (lot.display) {
    return lot.display;
  }

  if (lot.width && lot.depth) {
    const units = lot.units ?? "ft";
    return `${lot.width} x ${lot.depth} ${units}`;
  }

  if (lot.acres) {
    return `${lot.acres} acres`;
  }

  if (lot.min && lot.max) {
    return `${lot.min.toLocaleString()} - ${lot.max.toLocaleString()} ${lot.units ?? "sq ft"}`;
  }

  return undefined;
}

function coerceBoolean(value: Maybe<string | boolean>): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    return normalized === "yes" || normalized === "true";
  }

  return false;
}

export type PropertyDetailsData = ReturnType<typeof normalizeProperty>;

export function normalizeProperty(property: Property) {
  const bedroomsAbove = property.bedrooms?.above ?? 0;
  const bedroomsBelow = property.bedrooms?.below ?? 0;
  const totalBedrooms =
    property.bedrooms?.total ??
    (bedroomsAbove || bedroomsBelow ? bedroomsAbove + bedroomsBelow : undefined);

  const kitchenAbove = property.kitchens?.aboveGrade ?? 0;
  const kitchenBelow = property.kitchens?.belowGrade ?? 0;
  const totalKitchens =
    property.kitchens?.total ?? (kitchenAbove || kitchenBelow ? kitchenAbove + kitchenBelow : undefined);

  // Store both min and max for range display
  const squareFootageMin = property.squareFootage?.min;
  const squareFootageMax = property.squareFootage?.max;

  // Get list date from listedAt, listDate, or modificationTimestamp
  const listDateRaw = property.listedAt ?? property.listDate ?? property.modificationTimestamp;
  const listDate =
    listDateRaw instanceof Date
      ? listDateRaw.toISOString()
      : typeof listDateRaw === "string" && listDateRaw.trim() !== ""
        ? listDateRaw
        : undefined;

  const propertyAge =
    property.age?.display ??
    (typeof property.age?.years === "number"
      ? `${property.age.years}`
      : typeof property.age?.approximate === "number"
        ? `${property.age.approximate}`
        : undefined);

  const maintenanceFee = property.association?.fee ?? property.association?.additionalMonthlyFee;

  const propertyTaxAmount = property.taxes?.annualAmount ?? property.tax?.amount;
  const propertyTaxYear = property.taxes?.year ?? property.tax?.year;

  // TotalParking is calculated as the sum of CoveredSpaces (garage) and ParkingSpaces (driveway)
  const coveredSpaces = property.parking?.garage;
  const parkingSpaces = property.parking?.driveway;
  // Calculate total only if at least one value exists
  const totalParking = 
    coveredSpaces != null || parkingSpaces != null
      ? (coveredSpaces ?? 0) + (parkingSpaces ?? 0)
      : undefined;

  const description = property.description ?? property.publicRemarks ?? "";

  return {
    StreetAddress: property.address?.street ?? "",
    City: property.address?.city ?? "",
    StateOrProvince: property.address?.province ?? "",
    PostalCode: property.address?.postalCode,
    Community: property.location?.neighborhood,
    MlsStatus: property.mlsStatus ?? property.status ?? "Active",
    PropertyType: property.propertyType ?? property.propertySubType ?? "Property",
    PropertyClass: property.propertyClass ?? property.propertyType ?? "Residential",
    SubType: property.propertySubType,
    Bedrooms: totalBedrooms,
    Bathrooms: property.bathrooms,
    SquareFootage: squareFootageMax ?? squareFootageMin, // Keep for backward compatibility
    SquareFootageMin: squareFootageMin,
    SquareFootageMax: squareFootageMax,
    LotSize: formatLotSize(property),
    PropertyAge: propertyAge,
    HasFamilyRoom: Array.isArray(property.propertyFeatures)
      ? property.propertyFeatures.includes("Family Room")
      : false,
    HasFireplace: coerceBoolean(property.utilities?.fireplace),
    Kitchens: totalKitchens,
    KitchensAbove: kitchenAbove,
    KitchensBelow: kitchenBelow,
    Basement: property.basement ?? property.basementDetails?.status,
    BasementEntrance: property.basementDetails?.entrance ?? property.basementEntrance,
    BasementKitchen: property.basementDetails?.hasKitchen ?? property.basementKitchen ?? false,
    GarageParking: property.parking?.garage,
    DriveParking: property.parking?.driveway,
    TotalParking: totalParking,
    GarageSpaces: property.parking?.garage,
    RentIncludes:
      typeof property.propertyFeatures === "string"
        ? property.propertyFeatures
        : Array.isArray(property.propertyFeatures)
          ? property.propertyFeatures.join(", ")
          : undefined,
    Furnished: property.furnished,
    LeaseTerm: undefined,
    MaintenanceFee: maintenanceFee,
    FeeIncludes: property.association?.feeIncludes,
    MaintenanceFeeSchedule: maintenanceFee ? "Monthly" : undefined,
    CondoAmenities: property.association?.amenities,
    Pets: undefined,
    Locker: property.locker,
    Balcony: property.balconyType,
    POTLFee: property.association?.additionalMonthlyFee,
    POTLSchedule: property.association?.additionalMonthlyFee ? "Monthly" : undefined,
    POTLIncludes: undefined,
    InteriorFeatures: property.interiorFeatures?.join(", "),
    ExteriorFeatures: property.exteriorFeatures?.join(", "),
    OtherFeatures:
      typeof property.propertyFeatures === "string"
        ? property.propertyFeatures
        : Array.isArray(property.propertyFeatures)
          ? property.propertyFeatures.join(", ")
          : undefined,
    SwimmingPool: property.poolFeatures,
    Waterfront: coerceBoolean(property.waterfront?.waterfrontYN),
    WaterAccess: property.waterfront?.features,
    WaterView: property.waterfront?.waterView,
    Heating: property.utilities?.heatType,
    Cooling: property.utilities?.cooling,
    WaterSource: property.utilities?.water,
    Sewer: property.utilities?.sewer,
    PropertyTaxes: propertyTaxAmount,
    TaxYear: propertyTaxYear,
    ListPrice: property.price ?? 0,
    OriginalPrice: property.originalListPrice ?? property.price ?? 0,
    ClosePrice: property.closePrice,
    ListDate: listDate,
    DaysOnMarket: property.daysOnMarket,
    Possession: property.possession,
    Description: description,
    OpenHouseDetails: property.openHouse?.display,
    OpenHouseDate: property.openHouse?.date,
    VirtualTourUrl: property.virtualTourUrl,
    VirtualTourURL: property.virtualTourUrl,
    MLSNumber: property.mlsNumber,
    BedroomsAbove: bedroomsAbove,
    BedroomsBelow: bedroomsBelow,
    PropertyTaxesLabel: propertyTaxAmount,
    ViewCount: property.stats?.views ?? 0,
    SaveCount: property.stats?.bookmarks ?? 0,
  };
}


