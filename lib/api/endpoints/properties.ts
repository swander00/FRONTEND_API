/**
 * Properties API Endpoints
 * 
 * All endpoints related to property listing, details, and map views
 */

import { HttpClient } from '../httpClient';
import {
  PropertyFilters,
  SortBy,
  PaginationParams,
  MapBounds,
  PropertiesListResponse,
  PropertyDetailsResponse,
  MapPropertiesResponse,
  ListingHistoryResponse,
} from '../types';

export class PropertiesEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * GET /api/properties
   * Get paginated list of properties with filters and sorting
   */
  async list(
    filters?: PropertyFilters,
    pagination?: PaginationParams,
    sortBy?: SortBy
  ): Promise<PropertiesListResponse> {
    const params: Record<string, string | number | boolean | string[] | undefined> = {};

    // Add pagination
    if (pagination?.page) params.page = pagination.page;
    if (pagination?.pageSize) params.pageSize = pagination.pageSize;

    // Add sorting
    if (sortBy) params.sortBy = sortBy;

    // Add filters
    if (filters) {
      if (filters.city) {
        params.city = Array.isArray(filters.city) ? filters.city : [filters.city];
      }
      if (filters.propertyType) {
        params.propertyType = Array.isArray(filters.propertyType)
          ? filters.propertyType
          : [filters.propertyType];
      }
      if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
      if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
      if (filters.minBedrooms !== undefined) params.minBedrooms = filters.minBedrooms;
      if (filters.maxBedrooms !== undefined) params.maxBedrooms = filters.maxBedrooms;
      if (filters.minBathrooms !== undefined) params.minBathrooms = filters.minBathrooms;
      if (filters.maxBathrooms !== undefined) params.maxBathrooms = filters.maxBathrooms;
      if (filters.minSquareFeet !== undefined) params.minSquareFeet = filters.minSquareFeet;
      if (filters.maxSquareFeet !== undefined) params.maxSquareFeet = filters.maxSquareFeet;
      if (filters.hasOpenHouse === true) params.hasOpenHouse = true;
      if (filters.hasVirtualTour === true) params.hasVirtualTour = true;
      if (filters.minGarageSpaces !== undefined) params.minGarageSpaces = filters.minGarageSpaces;
      if (filters.minTotalParking !== undefined) params.minTotalParking = filters.minTotalParking;
      if (filters.searchTerm) params.searchTerm = filters.searchTerm;
      if (filters.status) params.status = filters.status;
    }

    return this.client.get<PropertiesListResponse>('/api/properties', params);
  }

  /**
   * GET /api/properties/:listingKey
   * Get full property details by listing key
   */
  async getDetails(listingKey: string): Promise<PropertyDetailsResponse> {
    return this.client.get<PropertyDetailsResponse>(`/api/properties/${encodeURIComponent(listingKey)}`);
  }

  /**
   * GET /api/properties/map
   * Get properties for map display with bounds filtering
   */
  async getMapProperties(filters?: PropertyFilters, bounds?: MapBounds): Promise<MapPropertiesResponse> {
    const params: Record<string, string | number | boolean | undefined> = {};

    // Add filters
    if (filters) {
      if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
      if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
      if (filters.status) params.status = filters.status;
    }

    // Add map bounds (must be JSON stringified)
    if (bounds) {
      params.bounds = JSON.stringify(bounds);
    }

    return this.client.get<MapPropertiesResponse>('/api/properties/map', params);
  }

  /**
   * GET /api/properties/:listingKey/listing-history
   * Get listing history and price changes for a property
   */
  async getListingHistory(listingKey: string): Promise<ListingHistoryResponse> {
    return this.client.get<ListingHistoryResponse>(`/api/properties/${encodeURIComponent(listingKey)}/listing-history`);
  }
}

