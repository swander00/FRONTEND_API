/**
 * API Type Definitions
 * 
 * TypeScript interfaces matching backend API request/response shapes
 */

// ===============================================================================================
// COMMON TYPES
// ===============================================================================================

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationResponse {
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface MapBounds {
  northEast: { lat: number; lng: number };
  southWest: { lat: number; lng: number };
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// ===============================================================================================
// PROPERTY FILTERS
// ===============================================================================================

export interface PropertyFilters {
  city?: string | string[];
  propertyType?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minSquareFeet?: number;
  maxSquareFeet?: number;
  status?: string;
  hasOpenHouse?: boolean;
  hasVirtualTour?: boolean;
  minGarageSpaces?: number;
  minTotalParking?: number;
  searchTerm?: string;
}

export type SortBy = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'sqft_asc' | 'sqft_desc';

// ===============================================================================================
// PROPERTY CARD RESPONSE (List/Grid View)
// ===============================================================================================

export interface PropertyCardResponse {
  listingKey: string;
  mlsNumber: string;
  fullAddress: string;
  city: string;
  stateOrProvince: string;
  cityRegion?: string;
  status: string;
  mlsStatus: string;
  transactionType: string;
  isNewListing: boolean;
  listingAge: string; // ⚠️ DEPRECATED: Use originalEntryTimestamp with status prefix instead
  originalEntryTimestamp: string; // Formatted timestamp: "10th Jun, 2025"
  originalEntryTimestampRaw?: string; // Raw timestamp for filtering/comparison
  statusDates?: StatusDates; // Status-specific dates (Sold, Leased, Removed)
  modificationTimestamp: string;
  listPrice: number;
  originalListPrice?: number;
  isPriceReduced: boolean;
  priceReductionAmount?: number;
  priceReductionPercent?: number;
  reductionNumber?: number;
  primaryImageUrl?: string;
  media: never[]; // Empty array in card view
  mediaCount: number;
  hasVirtualTour: boolean;
  virtualTourUrl?: string;
  bedroomsDisplay: string;
  bedroomsAboveGrade?: number;
  bedroomsBelowGrade?: number;
  bathroomsDisplay: string;
  bathroomsTotalInteger?: number;
  livingAreaMin?: number;
  livingAreaMax?: number;
  parkingTotal?: number;
  coveredSpaces?: number;
  parkingSpaces?: number;
  garageSpaces?: number;
  propertyType: string;
  propertySubType: string;
  openHouseDisplay?: string;
  hasOpenHouseToday: boolean;
  hasOpenHouseTomorrow: boolean;
  hasNextWeekendOpenHouse: boolean;
  images: never[]; // Empty array in card view
}

export interface PropertiesListResponse {
  properties: PropertyCardResponse[];
  pagination: PaginationResponse;
  totalCount: number;
}

// ===============================================================================================
// PROPERTY DETAILS RESPONSE
// ===============================================================================================

export interface PropertyMediaItem {
  id: string;
  url: string;
  alt: string | null;
  order: number | null;
  caption: string | null;
  dimensions: null; // TODO: Add when stored
}

export interface PropertyRoom {
  id: string;
  roomType: string;
  level: string;
  dimensions: string;
  features: string[];
}

export interface PropertyRoomsSummary {
  totalBedrooms: number;
  totalBathrooms: number;
  squareFootage: number;
  roomCount: number;
}

export interface PropertyRoomsResponse {
  summary: PropertyRoomsSummary;
  rooms: PropertyRoom[];
}

export interface StatusDates {
  purchaseContractDate?: string;
  suspendedDate?: string;
  terminatedDate?: string;
  expirationDate?: string;
  unavailableDate?: string;
  withdrawnDate?: string;
}

export interface PropertyDetailsResponse {
  listingKey: string;
  mlsNumber: string;
  mlsStatus: string;
  transactionType: string;
  statusDates: StatusDates;
  daysOnMarket: number;
  isNewListing: boolean;
  modificationTimestamp: string;
  viewCount: number;
  saveCount: number;
  todayViews: number | null;
  todaySaves: number | null;
  fullAddress: string;
  streetNumber?: string;
  streetName?: string;
  streetSuffix?: string;
  unitNumber?: string;
  city: string;
  community?: string;
  countyOrParish?: string;
  stateOrProvince: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  listPrice: number;
  originalListPrice?: number;
  closePrice?: number;
  priceReductionAmount?: number;
  priceReductionPercent?: number;
  reductionNumber?: number;
  originalEntryTimestamp: string; // Formatted timestamp: "10th Jun, 2025"
  originalEntryTimestampRaw?: string; // Raw timestamp for filtering/comparison
  listDate: string;
  taxAnnualAmount?: number;
  taxYear?: number;
  media: PropertyMediaItem[];
  primaryImageUrl: string | null;
  mediaCount: number;
  hasVirtualTour: boolean;
  virtualTourUrl?: string;
  bedroomsAboveGrade?: number;
  bedroomsBelowGrade?: number;
  bedroomsDisplay: string;
  bathroomsDisplay: string;
  bathroomsTotalInteger?: number;
  kitchensAboveGrade?: number;
  kitchensBelowGrade?: number;
  livingAreaMin?: number;
  livingAreaMax?: number;
  lotSizeWidth?: number;
  lotSizeDepth?: number;
  lotSizeAcres?: number;
  lotSizeUnits?: string;
  approximateAge?: string;
  propertyType: string;
  propertySubType: string;
  architecturalStyle?: string;
  basementStatus?: string;
  basementEntrance?: string;
  basementKitchen?: boolean;
  basementRental?: boolean;
  coveredSpaces?: number;
  parkingSpaces?: number;
  parkingTotal?: number;
  garageSpaces?: number;
  possession?: string;
  publicRemarks?: string;
  aiSummary: {
    summary: string;
    highlights: string[];
    confidence: number;
  } | null;
  rooms: PropertyRoomsResponse;
  openHouseDisplay?: string;
  openHouseEvents: null; // TODO: Future enhancement
  agent: null; // TODO: Integrate agent CRM
  // Property information fields
  interiorFeatures?: string;
  exteriorFeatures?: string;
  propertyFeatures?: string;
  cooling?: string;
  heatType?: string;
  sewer?: string;
  waterSource: null; // TODO: Add to view if needed
  associationFee?: number;
  associationFeeIncludes?: string;
  additionalMonthlyFee?: number;
  associationAmenities?: string;
  maintenanceFee: null; // TODO: Add to view if needed
  maintenanceFeeSchedule: null; // TODO: Add to view if needed
  potl: null; // TODO: Add to view if needed
  petsAllowed?: string;
  rentIncludes?: string;
  furnished?: string;
  locker?: string;
  balconyType?: string;
  poolFeatures?: string;
  waterfrontFeatures?: string;
  waterBodyName?: string;
  waterView?: string;
  waterfrontYN?: boolean | string;
  fireplaceYN?: boolean | string;
}

// ===============================================================================================
// MAP POPUP RESPONSE
// ===============================================================================================

export interface MapPopupPropertyResponse {
  listingKey: string;
  status: string;
  propertySubType: string;
  fullAddress: string;
  city: string;
  stateOrProvince: string;
  coordinates: Coordinates;
  primaryImageUrl?: string;
  listPrice: number;
  listedAt: string;
  bedroomsDisplay: string;
  bathroomsDisplay: string;
  parkingTotal?: number;
  coveredSpaces?: number;
  parkingSpaces?: number;
  livingAreaMin?: number;
  livingAreaMax?: number;
}

export interface MapPropertiesResponse {
  properties: MapPopupPropertyResponse[];
}

// ===============================================================================================
// SEARCH SUGGESTIONS RESPONSE
// ===============================================================================================

export interface ListingHistoryEntry {
  dateStart: string;
  dateEnd: string | null;
  price: number;
  event: string;
  listingId: string;
  soldPrice?: number | null;
  closeDate?: string | null;
}

export interface PriceChangeEntry {
  date: string;
  price: number;
  change: number | null;
  previousPrice: number | null;
  event: string;
  listingId: string;
}

export interface ListingHistoryResponse {
  propertyAddress: string;
  listingHistory: ListingHistoryEntry[];
  priceChanges: PriceChangeEntry[];
}

export interface PropertySuggestionResponse {
  listingKey: string;
  mlsNumber: string;
  fullAddress: string;
  city: string;
  stateOrProvince: string;
  cityRegion?: string;
  status: string;
  mlsStatus: string;
  listingAge: string; // ⚠️ DEPRECATED: Use originalEntryTimestamp with status prefix instead
  originalEntryTimestamp?: string; // Formatted timestamp: "10th Jun, 2025"
  originalEntryTimestampRaw?: string; // Raw timestamp for filtering/comparison
  statusDates?: StatusDates; // Status-specific dates (Sold, Leased, Removed)
  listPrice: number;
  originalListPrice?: number;
  isPriceReduced: boolean;
  priceReductionAmount?: number;
  priceReductionPercent?: number;
  reductionNumber?: number;
  bedroomsAboveGrade?: number;
  bedroomsBelowGrade?: number;
  bathroomsTotalInteger?: number;
  livingAreaMin?: number;
  livingAreaMax?: number;
  propertySubType: string;
  primaryImageUrl?: string;
}

export interface SearchResponse {
  listings: PropertySuggestionResponse[];
  meta: {
    totalCount: number;
    query: string;
  };
}

// ===============================================================================================
// HEALTH & METRICS
// ===============================================================================================

export interface HealthResponse {
  status: 'ok' | 'degraded';
  timestamp: string;
  service: string;
  checks: {
    database: 'ok' | 'error' | 'unknown';
    databaseError?: string;
  };
}

// ===============================================================================================
// ERROR RESPONSE
// ===============================================================================================

export interface ApiErrorResponse {
  error: {
    code: number;
    message: string;
    timestamp: string;
    requestId?: string;
    details?: unknown;
    stack?: string[];
  };
}

