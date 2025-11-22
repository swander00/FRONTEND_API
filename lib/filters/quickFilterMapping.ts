/**
 * Quick Filter Mapping
 * 
 * Maps quick filter labels to their corresponding filter state updates.
 * Each quick filter corresponds to specific property features that can be filtered via the API.
 */

import type { FiltersState } from '@/components/search/FiltersContainer/FiltersContext';

export type QuickFilterLabel = 
  | 'Detached'
  | 'Semi-Detached'
  | 'Townhouse'
  | 'Condo'
  | 'Duplex'
  | '3-Storey'
  | 'Bungalow'
  | '+ Basement Apt'
  | 'Rental Basement'
  | 'Swimming Pool'
  | 'Waterfront'
  | 'Cottage'
  | '3+ Car Garage'
  | '50ft+ Lots'
  | '2+ Acres'
  | 'Fixer-Upper';

/**
 * Quick Filter Mapping Documentation
 * 
 * Each quick filter maps to specific database fields in PropertyCardView/PropertyDetailsView:
 * 
 * 1. PROPERTY TYPE FILTERS (maps to PropertyType field):
 *    - 'Detached' → PropertyType = 'Detached'
 *    - 'Semi-Detached' → PropertyType = 'Semi-Detached'
 *    - 'Townhouse' → PropertyType = 'Townhouse' (database normalizes 'Att/Row/Townhouse' to 'Townhouse')
 *    - 'Condo' → PropertyType = 'Condo Apartment'
 *    - 'Duplex' → PropertyType = 'Duplex'
 *    - 'Cottage' → PropertyType = 'Cottage'
 * 
 * 2. ARCHITECTURAL STYLE FILTERS (maps to ArchitecturalStyle field):
 *    - '3-Storey' → ArchitecturalStyle contains '3 Storey'
 *    - 'Bungalow' → ArchitecturalStyle contains 'Bungalow'
 * 
 * 3. BASEMENT FEATURES (maps to BasementKitchen/BasementRental fields):
 *    - '+ Basement Apt' → BasementKitchen = true (basement has kitchen)
 *    - 'Rental Basement' → BasementRental = true (basement has rental potential)
 * 
 * 4. PROPERTY FEATURES (maps to PoolFeatures/WaterfrontYN fields):
 *    - 'Swimming Pool' → PoolFeatures IS NOT NULL
 *    - 'Waterfront' → WaterfrontYN = 'Y'
 * 
 * 5. PARKING (maps to GarageSpaces field):
 *    - '3+ Car Garage' → GarageSpaces >= 3
 * 
 * 6. LOT SIZE (maps to LotWidth/LotSizeAcres fields):
 *    - '50ft+ Lots' → LotWidth >= 50
 *    - '2+ Acres' → LotSizeAcres >= 2 (Note: Backend may need to support this filter)
 * 
 * 7. PROPERTY CONDITION (maps to PropertyAge or condition fields):
 *    - 'Fixer-Upper' → PropertyAge might indicate older properties or condition keywords
 *      (This may need special handling - could map to PropertyAge ranges or keywords)
 */

export interface QuickFilterUpdate {
  propertyTypes?: string[];
  houseStyle?: string[];
  basementFeatures?: string[];
  swimmingPool?: 'Yes' | 'No' | null;
  waterfront?: 'Yes' | 'No' | null;
  garageParking?: { min: number | null; max: number | null; preset?: string | null };
  lotFrontage?: string | null;
  lotSizeAcres?: { min: number | null; max: number | null } | null;
  propertyAge?: string | null;
}

/**
 * Get the filter state update for a quick filter label
 */
export function getQuickFilterUpdate(label: QuickFilterLabel, isActive: boolean): QuickFilterUpdate | null {
  if (!isActive) {
    // When deactivating, return null to clear the filter
    return null;
  }

  switch (label) {
    // Property Type Filters
    case 'Detached':
      return { propertyTypes: ['Detached'] };
    
    case 'Semi-Detached':
      return { propertyTypes: ['Semi-Detached'] };
    
    case 'Townhouse':
      return { propertyTypes: ['Townhouse'] };
    
    case 'Condo':
      return { propertyTypes: ['Condo Apartment'] };
    
    case 'Duplex':
      return { propertyTypes: ['Duplex'] };
    
    case 'Cottage':
      return { propertyTypes: ['Cottage'] };
    
    // Architectural Style Filters
    case '3-Storey':
      return { houseStyle: ['3 Storey'] };
    
    case 'Bungalow':
      return { houseStyle: ['Bungalow'] };
    
    // Basement Features
    case '+ Basement Apt':
      return { basementFeatures: ['Kitchen: Yes'] };
    
    case 'Rental Basement':
      return { basementFeatures: ['Apartment'] };
    
    // Property Features
    case 'Swimming Pool':
      return { swimmingPool: 'Yes' };
    
    case 'Waterfront':
      return { waterfront: 'Yes' };
    
    // Parking
    case '3+ Car Garage':
      return { garageParking: { min: 3, max: null, preset: null } };
    
    // Lot Size
    case '50ft+ Lots':
      return { lotFrontage: '50+ ft' };
    
    case '2+ Acres':
      return { lotSizeAcres: { min: 2, max: null } };
    
    // Property Condition
    case 'Fixer-Upper':
      // Map to older properties (20+ years) - this is a reasonable interpretation
      // Alternatively, could search for keywords in description
      return { propertyAge: '20+' };
    
    default:
      return null;
  }
}

/**
 * Apply quick filter updates to the current filter state
 * This merges the quick filter with existing filters
 */
export function applyQuickFilterToState(
  currentState: FiltersState,
  update: QuickFilterUpdate | null
): Partial<FiltersState> {
  if (!update) {
    // Return empty update to clear filters
    return {};
  }

  const newState: Partial<FiltersState> = {};
  const advancedUpdates: Partial<FiltersState['advanced']> = {};

  // Property Types - add to existing array
  if (update.propertyTypes) {
    newState.propertyTypes = [...new Set([...currentState.propertyTypes, ...update.propertyTypes])];
  }

  // House Style - add to existing array
  if (update.houseStyle) {
    advancedUpdates.houseStyle = [...new Set([...currentState.advanced.houseStyle, ...update.houseStyle])];
  }

  // Basement Features - add to existing array
  if (update.basementFeatures) {
    advancedUpdates.basementFeatures = [...new Set([...currentState.advanced.basementFeatures, ...update.basementFeatures])];
  }

  // Swimming Pool
  if (update.swimmingPool !== undefined) {
    advancedUpdates.swimmingPool = update.swimmingPool;
  }

  // Waterfront
  if (update.waterfront !== undefined) {
    advancedUpdates.waterfront = update.waterfront;
  }

  // Garage Parking - merge with existing
  if (update.garageParking) {
    advancedUpdates.garageParking = {
      ...currentState.advanced.garageParking,
      ...update.garageParking,
    };
  }

  // Lot Frontage
  if (update.lotFrontage !== undefined) {
    advancedUpdates.lotFrontage = update.lotFrontage;
  }

  // Property Age
  if (update.propertyAge !== undefined) {
    advancedUpdates.propertyAge = update.propertyAge;
  }

  // Merge all advanced updates into a single object
  if (Object.keys(advancedUpdates).length > 0) {
    newState.advanced = {
      ...currentState.advanced,
      ...advancedUpdates,
    };
  }

  return newState;
}

/**
 * Remove quick filter from state
 */
export function removeQuickFilterFromState(
  currentState: FiltersState,
  label: QuickFilterLabel
): Partial<FiltersState> {
  const update = getQuickFilterUpdate(label, true);
  if (!update) return {};

  const newState: Partial<FiltersState> = {};

  // Property Types - remove from array
  if (update.propertyTypes) {
    newState.propertyTypes = currentState.propertyTypes.filter(
      (type) => !update.propertyTypes!.includes(type)
    );
  }

  // House Style - remove from array
  if (update.houseStyle) {
    newState.advanced = {
      ...currentState.advanced,
      houseStyle: currentState.advanced.houseStyle.filter(
        (style) => !update.houseStyle!.includes(style)
      ),
    };
  }

  // Basement Features - remove from array
  if (update.basementFeatures) {
    newState.advanced = {
      ...currentState.advanced,
      basementFeatures: currentState.advanced.basementFeatures.filter(
        (feature) => !update.basementFeatures!.includes(feature)
      ),
    };
  }

  // Swimming Pool - reset to null
  if (update.swimmingPool !== undefined) {
    newState.advanced = {
      ...currentState.advanced,
      swimmingPool: null,
    };
  }

  // Waterfront - reset to null
  if (update.waterfront !== undefined) {
    newState.advanced = {
      ...currentState.advanced,
      waterfront: null,
    };
  }

  // Garage Parking - reset min if it was set to 3
  if (update.garageParking?.min === 3) {
    newState.advanced = {
      ...currentState.advanced,
      garageParking: {
        ...currentState.advanced.garageParking,
        min: null,
      },
    };
  }

  // Lot Frontage - reset to null
  if (update.lotFrontage !== undefined) {
    newState.advanced = {
      ...currentState.advanced,
      lotFrontage: null,
    };
  }

  // Property Age - reset to null
  if (update.propertyAge !== undefined) {
    newState.advanced = {
      ...currentState.advanced,
      propertyAge: null,
    };
  }

  return newState;
}

