export interface PropertyRoom {
  type: string;
  level?: string;
  dimensions?: string;
  measurements?: string;
  description?: string;
  features?: string | string[];
}

export interface Property {
  id: string;
  listingKey?: string;
  mlsNumber: string;
  price: number;
  originalListPrice?: number;
  closePrice?: number;
  priceReductionAmount?: number;
  priceReductionPercent?: number;
  priceReductionLabel?: string;
  address: {
    street: string;
    streetNumber?: string;
    streetName?: string;
    streetSuffixShort?: string;
    streetSuffix?: string;
    unitNumber?: string;
    city: string;
    province: string;
    postalCode?: string;
    countyOrParish?: string;
    unparsedAddress?: string;
  };
  location: {
    neighborhood: string;
    tagColor: string;
    cityRegion?: string;
  };
  propertyType?: string;
  propertySubType: string;
  propertyClass?: string;
  architecturalStyle?: string;
  description?: string;
  publicRemarks?: string;
  bedrooms: {
    above: number;
    below: number;
    total?: number;
  };
  bathrooms: number;
  kitchens?: {
    aboveGrade?: number;
    belowGrade?: number;
    total?: number;
  };
  squareFootage: {
    min: number;
    max: number;
  };
  lotSize?: {
    min?: number;
    max?: number;
    display?: string;
    width?: number;
    depth?: number;
    units?: string;
    acres?: number;
  };
  parking: {
    garage: number;
    driveway: number;
    total?: number;
  };
  basement?: string;
  basementDetails?: {
    status?: string;
    entrance?: string;
    hasKitchen?: boolean;
    rentalPotential?: boolean;
  };
  age?: {
    display?: string;
    years?: number;
    approximate?: string | number;
  };
  utilities?: {
    heatType?: string;
    cooling?: string;
    sewer?: string;
    water?: string;
    fireplace?: boolean;
  };
  association?: {
    fee?: number;
    additionalMonthlyFee?: number;
    feeIncludes?: string;
    amenities?: string;
  };
  exteriorFeatures?: string[];
  interiorFeatures?: string[];
  propertyFeatures?: string | string[];
  coolingFeatures?: string[];
  poolFeatures?: string;
  possession?: string;
  waterfront?: {
    waterBodyName?: string;
    waterfrontYN?: boolean | string;
    waterView?: string;
    features?: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
    geocodedAt?: string;
    geocodingStatus?: string;
  };
  daysOnMarket?: number;
  listingAge?: string;
  isNewListing?: boolean;
  isPriceReduced?: boolean;
  mediaCount?: number;
  primaryImageUrl?: string;
  images: string[];
  media?: Array<{
    id: string;
    url: string;
    alt?: string | null;
    order?: number | null;
    caption?: string | null;
    dimensions?: null;
  }>;
  virtualTourUrl?: string;
  openHouse?: {
    day: string;
    date: string;
    time: string;
    display: string;
  };
  openHouseFlags?: {
    hasUpcomingOpenHouse?: boolean;
    hasOpenHouseToday?: boolean;
    hasOpenHouseTomorrow?: boolean;
    hasNextWeekendOpenHouse?: boolean;
  };
  hasVirtualTour: boolean;
  listedAt: Date | string;
  status?: string;
  mlsStatus?: string;
  transactionType?: 'For Sale' | 'For Lease';
  statusDates?: {
    purchaseContractDate?: string;
    suspendedDate?: string;
    terminatedDate?: string;
    expirationDate?: string;
    unavailableDate?: string;
    withdrawnDate?: string;
  };
  originalEntryTimestamp?: string; // Formatted timestamp: "10th Jun, 2025"
  originalEntryTimestampRaw?: string; // Raw timestamp for filtering/comparison
  modificationTimestamp?: string;
  tax?: {
    amount: number;
    year: number;
  };
  taxes?: {
    annualAmount?: number;
    year?: number;
  };
  stats?: {
    views: number;
    bookmarks: number;
    favorites: number;
  };
  rooms?: PropertyRoom[];
  balconyType?: string;
  locker?: string;
  furnished?: string;
}

export interface PropertyFilters {
  saleType: string;
  timeRange: string;
  city: string;
  type: string;
  price: {
    min: number;
    max: number;
  };
  beds: number;
  baths: number;
}

