/**
 * Convert FiltersState to PropertyFilters format for API client
 */

import type { FiltersState } from '@/components/search/FiltersContainer/FiltersContext';
import type { PropertyFilters } from '@/lib/api/types';

/**
 * Convert FiltersState to PropertyFilters for API client
 */
export function convertFiltersStateToPropertyFilters(
  filters: FiltersState | null | undefined
): PropertyFilters | undefined {
  if (!filters) return undefined;

  const apiFilters: PropertyFilters = {};

  // Status
  if (filters.status) {
    // Convert frontend format to backend format
    const statusMap: Record<string, string> = {
      'For Sale': 'for_sale',
      'For Lease': 'for_lease',
      'Sold': 'sold',
      'Leased': 'leased',
      'Removed': 'removed',
    };
    apiFilters.status = statusMap[filters.status] || filters.status.toLowerCase().replace(' ', '_');
  }

  // Cities (array)
  if (filters.cities && filters.cities.length > 0) {
    apiFilters.city = filters.cities;
  }

  // Property Types (array)
  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    apiFilters.propertyType = filters.propertyTypes;
  }

  // Price range
  if (filters.price?.min !== null && filters.price?.min !== undefined) {
    apiFilters.minPrice = filters.price.min;
  }
  if (filters.price?.max !== null && filters.price?.max !== undefined) {
    apiFilters.maxPrice = filters.price.max;
  }

  // Bedrooms
  if (filters.beds?.exact !== null && filters.beds?.exact !== undefined) {
    apiFilters.minBedrooms = filters.beds.exact;
    apiFilters.maxBedrooms = filters.beds.exact;
  } else {
    if (filters.beds?.min !== null && filters.beds?.min !== undefined) {
      apiFilters.minBedrooms = filters.beds.min;
    }
    if (filters.beds?.max !== null && filters.beds?.max !== undefined) {
      apiFilters.maxBedrooms = filters.beds.max;
    }
  }

  // Bathrooms
  if (filters.baths?.exact !== null && filters.baths?.exact !== undefined) {
    apiFilters.minBathrooms = filters.baths.exact;
    apiFilters.maxBathrooms = filters.baths.exact;
  } else {
    if (filters.baths?.min !== null && filters.baths?.min !== undefined) {
      apiFilters.minBathrooms = filters.baths.min;
    }
    if (filters.baths?.max !== null && filters.baths?.max !== undefined) {
      apiFilters.maxBathrooms = filters.baths.max;
    }
  }

  // Square footage
  if (filters.advanced?.squareFootage?.min !== null && filters.advanced?.squareFootage?.min !== undefined) {
    apiFilters.minSquareFeet = filters.advanced.squareFootage.min;
  }
  if (filters.advanced?.squareFootage?.max !== null && filters.advanced?.squareFootage?.max !== undefined) {
    apiFilters.maxSquareFeet = filters.advanced.squareFootage.max;
  }

  // Open house
  if (filters.advanced?.openHouse && filters.advanced.openHouse !== 'All') {
    apiFilters.hasOpenHouse = true;
  }

  // Virtual tour - not currently in filters
  // if (filters.advanced?.hasVirtualTour === true) {
  //   apiFilters.hasVirtualTour = true;
  // }

  // Garage spaces
  if (filters.advanced?.garageParking?.min !== null && filters.advanced?.garageParking?.min !== undefined) {
    apiFilters.minGarageSpaces = filters.advanced.garageParking.min;
  }

  // Total parking - not currently in filters structure
  // if (filters.advanced?.totalParking?.min !== null && filters.advanced?.totalParking?.min !== undefined) {
  //   apiFilters.minTotalParking = filters.advanced.totalParking.min;
  // }

  // Architectural Style (House Style) - for quick filters like '3-Storey', 'Bungalow'
  if (filters.advanced?.houseStyle && filters.advanced.houseStyle.length > 0) {
    apiFilters.architecturalStyle = filters.advanced.houseStyle;
  }

  // Basement Features - for quick filters like '+ Basement Apt', 'Rental Basement'
  if (filters.advanced?.basementFeatures && filters.advanced.basementFeatures.length > 0) {
    apiFilters.basementFeatures = filters.advanced.basementFeatures;
  }

  // Swimming Pool
  if (filters.advanced?.swimmingPool === 'Yes') {
    apiFilters.hasSwimmingPool = true;
  } else if (filters.advanced?.swimmingPool === 'No') {
    apiFilters.hasSwimmingPool = false;
  }

  // Waterfront
  if (filters.advanced?.waterfront === 'Yes') {
    apiFilters.waterfront = true;
  } else if (filters.advanced?.waterfront === 'No') {
    apiFilters.waterfront = false;
  }

  // Lot Frontage - format for backend (e.g., "50+" becomes "50+ ft")
  if (filters.advanced?.lotFrontage) {
    // Backend expects formats like "50+ ft" or "50+"
    // If we have "50+", convert to "50+ ft" for consistency
    let lotFrontage = filters.advanced.lotFrontage.trim();
    if (lotFrontage.endsWith('+') && !lotFrontage.includes('ft')) {
      lotFrontage = `${lotFrontage} ft`;
    }
    apiFilters.lotFrontage = lotFrontage;
  }

  // Property Age - for quick filters like 'Fixer-Upper'
  if (filters.advanced?.propertyAge) {
    apiFilters.propertyAge = filters.advanced.propertyAge;
  }

  // Lot Size Acres - for quick filters like '2+ Acres'
  if (filters.advanced?.lotSizeAcres?.min !== null && filters.advanced?.lotSizeAcres?.min !== undefined) {
    apiFilters.minLotSizeAcres = filters.advanced.lotSizeAcres.min;
  }

  return Object.keys(apiFilters).length > 0 ? apiFilters : undefined;
}

