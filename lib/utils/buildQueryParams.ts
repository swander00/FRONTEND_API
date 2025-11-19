/**
 * Utility function to build query parameters from filter state for /api/properties endpoint
 */

import type { FiltersState } from '@/components/search/FiltersContainer/FiltersContext';

export interface QueryParamsOptions {
  filters?: FiltersState | null;
  pagination?: {
    page: number;
    pageSize: number;
  };
  sortBy?: string;
  searchTerm?: string;
}

/**
 * Builds query parameters from filter state for /api/properties endpoint
 */
export function buildPropertiesQueryParams(options: QueryParamsOptions): Record<string, string | number | boolean> {
  const { filters, pagination, sortBy, searchTerm } = options;
  const params: Record<string, string | number | boolean> = {};

  // Pagination
  if (pagination) {
    params.page = pagination.page;
    params.pageSize = pagination.pageSize;
  }

  // Sorting
  if (sortBy) {
    params.sortBy = sortBy;
  }

  if (!filters) {
    // If no filters, just add searchTerm if present
    if (searchTerm && searchTerm.trim()) {
      params.searchTerm = searchTerm.trim();
    }
    return params;
  }

  // Array parameters (city, propertyType) - use multiple params
  if (filters.cities && filters.cities.length > 0) {
    // Note: apiGet handles arrays by appending multiple params
    // We'll need to handle this specially in the API call
    filters.cities.forEach((city) => {
      // For now, we'll pass as comma-separated or handle in apiGet
      // The guide says to use multiple params: ?city=Toronto&city=Mississauga
      // But our apiGet only accepts Record<string, string | number | boolean>
      // So we'll need to modify apiGet or handle arrays differently
    });
  }

  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    filters.propertyTypes.forEach((type) => {
      // Same issue as cities
    });
  }

  // Price range
  if (filters.price?.min !== null && filters.price?.min !== undefined) {
    params.minPrice = filters.price.min;
  }
  if (filters.price?.max !== null && filters.price?.max !== undefined) {
    params.maxPrice = filters.price.max;
  }

  // Bedrooms
  if (filters.beds?.exact !== null && filters.beds?.exact !== undefined) {
    params.minBedrooms = filters.beds.exact;
    params.maxBedrooms = filters.beds.exact;
  } else {
    if (filters.beds?.min !== null && filters.beds?.min !== undefined) {
      params.minBedrooms = filters.beds.min;
    }
    if (filters.beds?.max !== null && filters.beds?.max !== undefined) {
      params.maxBedrooms = filters.beds.max;
    }
  }

  // Bathrooms
  if (filters.baths?.exact !== null && filters.baths?.exact !== undefined) {
    params.minBathrooms = filters.baths.exact;
    params.maxBathrooms = filters.baths.exact;
  } else {
    if (filters.baths?.min !== null && filters.baths?.min !== undefined) {
      params.minBathrooms = filters.baths.min;
    }
    if (filters.baths?.max !== null && filters.baths?.max !== undefined) {
      params.maxBathrooms = filters.baths.max;
    }
  }

  // Square footage
  if (filters.advanced?.squareFootage?.min !== null && filters.advanced?.squareFootage?.min !== undefined) {
    params.minSquareFeet = filters.advanced.squareFootage.min;
  }
  if (filters.advanced?.squareFootage?.max !== null && filters.advanced?.squareFootage?.max !== undefined) {
    params.maxSquareFeet = filters.advanced.squareFootage.max;
  }

  // Boolean filters
  if (filters.advanced?.openHouse && filters.advanced.openHouse !== 'All') {
    params.hasOpenHouse = true;
  }
  // Note: hasVirtualTour would need to be tracked in filters if needed

  // Garage/Parking
  if (filters.advanced?.garageParking?.min !== null && filters.advanced?.garageParking?.min !== undefined) {
    params.minGarageSpaces = filters.advanced.garageParking.min;
  }
  if (filters.advanced?.totalParking?.min !== null && filters.advanced?.totalParking?.min !== undefined) {
    params.minTotalParking = filters.advanced.totalParking.min;
  }

  // Search term
  if (searchTerm && searchTerm.trim()) {
    params.searchTerm = searchTerm.trim();
  } else if (filters.advanced?.keywords && filters.advanced.keywords.length > 0) {
    // Use keywords as search term if no explicit searchTerm
    params.searchTerm = filters.advanced.keywords.join(' ');
  }

  return params;
}

/**
 * Builds query string with support for array parameters
 * This handles the case where we need multiple params with the same name
 */
export function buildQueryString(options: QueryParamsOptions): string {
  const { filters, pagination, sortBy, searchTerm } = options;
  const params = new URLSearchParams();

  // Pagination
  if (pagination) {
    params.append('page', pagination.page.toString());
    params.append('pageSize', pagination.pageSize.toString());
  }

  // Sorting
  if (sortBy) {
    params.append('sortBy', sortBy);
  }

  if (!filters) {
    // If no filters, just add searchTerm if present
    if (searchTerm && searchTerm.trim()) {
      params.append('searchTerm', searchTerm.trim());
    }
    return params.toString();
  }

  // Array parameters (city, propertyType) - use multiple params
  if (filters.cities && filters.cities.length > 0) {
    filters.cities.forEach((city) => {
      params.append('city', city);
    });
  }

  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    filters.propertyTypes.forEach((type) => {
      params.append('propertyType', type);
    });
  }

  // Price range
  if (filters.price?.min !== null && filters.price?.min !== undefined) {
    params.append('minPrice', filters.price.min.toString());
  }
  if (filters.price?.max !== null && filters.price?.max !== undefined) {
    params.append('maxPrice', filters.price.max.toString());
  }

  // Bedrooms
  if (filters.beds?.exact !== null && filters.beds?.exact !== undefined) {
    params.append('minBedrooms', filters.beds.exact.toString());
    params.append('maxBedrooms', filters.beds.exact.toString());
  } else {
    if (filters.beds?.min !== null && filters.beds?.min !== undefined) {
      params.append('minBedrooms', filters.beds.min.toString());
    }
    if (filters.beds?.max !== null && filters.beds?.max !== undefined) {
      params.append('maxBedrooms', filters.beds.max.toString());
    }
  }

  // Bathrooms
  if (filters.baths?.exact !== null && filters.baths?.exact !== undefined) {
    params.append('minBathrooms', filters.baths.exact.toString());
    params.append('maxBathrooms', filters.baths.exact.toString());
  } else {
    if (filters.baths?.min !== null && filters.baths?.min !== undefined) {
      params.append('minBathrooms', filters.baths.min.toString());
    }
    if (filters.baths?.max !== null && filters.baths?.max !== undefined) {
      params.append('maxBathrooms', filters.baths.max.toString());
    }
  }

  // Square footage
  if (filters.advanced?.squareFootage?.min !== null && filters.advanced?.squareFootage?.min !== undefined) {
    params.append('minSquareFeet', filters.advanced.squareFootage.min.toString());
  }
  if (filters.advanced?.squareFootage?.max !== null && filters.advanced?.squareFootage?.max !== undefined) {
    params.append('maxSquareFeet', filters.advanced.squareFootage.max.toString());
  }

  // Boolean filters
  if (filters.advanced?.openHouse && filters.advanced.openHouse !== 'All') {
    params.append('hasOpenHouse', 'true');
  }

  // Garage/Parking
  if (filters.advanced?.garageParking?.min !== null && filters.advanced?.garageParking?.min !== undefined) {
    params.append('minGarageSpaces', filters.advanced.garageParking.min.toString());
  }
  if (filters.advanced?.totalParking?.min !== null && filters.advanced?.totalParking?.min !== undefined) {
    params.append('minTotalParking', filters.advanced.totalParking.min.toString());
  }

  // Status filter
  if (filters.status) {
    params.append('status', filters.status);
  }

  // Search term
  if (searchTerm && searchTerm.trim()) {
    params.append('searchTerm', searchTerm.trim());
  } else if (filters.advanced?.keywords && filters.advanced.keywords.length > 0) {
    // Use keywords as search term if no explicit searchTerm
    params.append('searchTerm', filters.advanced.keywords.join(' '));
  }

  return params.toString();
}

