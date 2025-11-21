'use client';

import { useState, useEffect, useRef } from 'react';
import { apiGetWithQueryString, API_ENDPOINTS } from '@/lib/api';
import { buildQueryString } from '@/lib/utils/buildQueryParams';
import type { Property } from '@/types/property';
import type { FiltersState } from '@/components/search/FiltersContainer/FiltersContext';

interface PropertiesResponse {
  properties: Property[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UsePropertiesOptions {
  page?: number;
  pageSize?: number;
  enabled?: boolean;
  filters?: FiltersState | null;
  sortBy?: string;
  searchTerm?: string;
}

export function useProperties(options: UsePropertiesOptions = {}) {
  const { page = 1, pageSize = 12, enabled = true, filters, sortBy, searchTerm } = options;
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Track abort controller for request cancellation
  const abortControllerRef = useRef<AbortController | null>(null);
  // Track the current request signature to prevent duplicate requests
  const currentRequestRef = useRef<string>('');

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Create a unique request signature to detect duplicate requests
    const requestSignature = JSON.stringify({ page, pageSize, filters, sortBy, searchTerm });
    
    // Skip if this is the same request as the current one
    if (currentRequestRef.current === requestSignature) {
      return;
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    currentRequestRef.current = requestSignature;

    // Debounce requests to prevent rate limiting (429 errors)
    const timeoutId = setTimeout(() => {
      // Check if request was cancelled during debounce
      if (abortController.signal.aborted) {
        return;
      }

      setLoading(true);
      setError(null);

      // Build query string with all parameters
      console.log('[useProperties] Before buildQueryString:', {
        hasFilters: !!filters,
        hasAdvanced: !!filters?.advanced,
        propertyClasses: filters?.advanced?.propertyClasses,
        filtersString: filters ? JSON.stringify(filters, null, 2) : 'null'
      });
      
      const queryString = buildQueryString({
        filters,
        pagination: { page, pageSize },
        sortBy,
        searchTerm,
      });

      console.log('[useProperties] Query string:', queryString);
      console.log('[useProperties] Full URL:', `${API_ENDPOINTS.properties}?${queryString}`);

      apiGetWithQueryString<PropertiesResponse>(API_ENDPOINTS.properties, queryString)
      .then((data) => {
        // Check if request was cancelled
        if (abortController.signal.aborted) {
          return;
        }

        // Log the raw response for debugging
        console.log('API Response:', data);
        console.log('API Response type:', typeof data);
        console.log('API Response keys:', data ? Object.keys(data) : 'null');
        
        // Handle both response formats:
        // New format: { properties, pagination: { page, pageSize, totalPages }, totalCount }
        // Old format: { properties, total, page, pageSize, totalPages }
        let propertiesArray: any[] = [];
        let totalCount = 0;
        let pageNum = page;
        let pageSizeNum = pageSize;
        let totalPagesNum = 0;

        if (data) {
          // Check for new format (with pagination object)
          if ('pagination' in data && data.pagination) {
            const typedData = data as { properties?: any[]; totalCount?: number; pagination?: { page?: number; pageSize?: number; totalPages?: number } };
            propertiesArray = typedData.properties || [];
            totalCount = typedData.totalCount || 0;
            pageNum = typedData.pagination?.page || page;
            pageSizeNum = typedData.pagination?.pageSize || pageSize;
            totalPagesNum = typedData.pagination?.totalPages || 0;
          } 
          // Check for old format (flat structure)
          else if ('total' in data) {
            const typedData = data as { properties?: any[]; total?: number; page?: number; pageSize?: number; totalPages?: number };
            propertiesArray = typedData.properties || [];
            totalCount = typedData.total || 0;
            pageNum = typedData.page || page;
            pageSizeNum = typedData.pageSize || pageSize;
            totalPagesNum = typedData.totalPages || 0;
          }
          // Fallback: try to extract properties directly
          else if (Array.isArray(data)) {
            propertiesArray = data;
          } else if ((data as any).properties && Array.isArray((data as any).properties)) {
            const typedData = data as { properties?: any[]; totalCount?: number; total?: number };
            propertiesArray = typedData.properties || [];
            totalCount = typedData.totalCount || typedData.total || propertiesArray.length;
          }
        }

        console.log(`Parsed: ${propertiesArray.length} properties, total: ${totalCount}`);
        if (propertiesArray.length > 0) {
          console.log('First property sample:', propertiesArray[0]);
        } else {
          console.warn('No properties found in response. Full response:', JSON.stringify(data, null, 2));
        }
        
        // Transform and validate properties
        const transformedProperties = propertiesArray.map((property: any) => {
          // Helper to safely get nested value
          const getNested = (obj: any, ...paths: string[]) => {
            for (const path of paths) {
              const keys = path.split('.');
              let value = obj;
              for (const key of keys) {
                if (value && typeof value === 'object' && key in value) {
                  value = value[key];
                } else {
                  value = undefined;
                  break;
                }
              }
              if (value !== undefined && value !== null) return value;
            }
            return undefined;
          };

          // Transform backend response to frontend Property type
          const transformed: any = {
            ...property,
            // Price - check multiple possible field names
            price: (() => {
              const price = getNested(property, 'price', 'listPrice', 'ListPrice', 'List_Price');
              if (typeof price === 'number' && !isNaN(price)) return price;
              const priceStr = String(price || '').replace(/[^0-9.]/g, '');
              const parsed = parseFloat(priceStr);
              return !isNaN(parsed) ? parsed : 0;
            })(),
            
            // Address - handle nested and flat structures
            address: (() => {
              if (property.address && typeof property.address === 'object') {
                return {
                  street: property.address.street || property.address.StreetAddress || property.address.streetAddress || '',
                  city: property.address.city || property.address.City || '',
                  province: property.address.province || property.address.StateOrProvince || property.address.stateOrProvince || '',
                  postalCode: property.address.postalCode || property.address.PostalCode || '',
                  unparsedAddress: property.address.unparsedAddress || property.address.UnparsedAddress || property.address.fullAddress || '',
                };
              }
              return {
                street: property.streetAddress || property.StreetAddress || property.street || property.FullAddress?.split(',')[0] || '',
                city: property.city || property.City || property.FullAddress?.split(',')[1]?.trim() || '',
                province: property.province || property.StateOrProvince || property.stateOrProvince || '',
                postalCode: property.postalCode || property.PostalCode || '',
                unparsedAddress: property.unparsedAddress || property.UnparsedAddress || property.fullAddress || property.FullAddress || '',
              };
            })(),
            
            // Location
            location: (() => {
              if (property.location && typeof property.location === 'object') {
                return {
                  neighborhood: property.location.neighborhood || property.location.Community || property.location.community || '',
                  tagColor: property.location.tagColor || 'yellow',
                };
              }
              return {
                neighborhood: property.neighborhood || property.Community || property.community || '',
                tagColor: property.tagColor || 'yellow',
              };
            })(),
            
            // Bedrooms - handle nested and flat structures
            bedrooms: (() => {
              if (property.bedrooms && typeof property.bedrooms === 'object') {
                return {
                  above: typeof property.bedrooms.above === 'number' ? property.bedrooms.above : 
                         typeof property.bedrooms.aboveGrade === 'number' ? property.bedrooms.aboveGrade : 0,
                  below: typeof property.bedrooms.below === 'number' ? property.bedrooms.below : 
                         typeof property.bedrooms.belowGrade === 'number' ? property.bedrooms.belowGrade : 0,
                  total: property.bedrooms.total || property.bedrooms.Total,
                };
              }
              const total = typeof property.bedrooms === 'number' ? property.bedrooms : 
                           typeof property.Bedrooms === 'number' ? property.Bedrooms :
                           typeof property.bedroomsTotal === 'number' ? property.bedroomsTotal : undefined;
              return {
                above: property.bedroomsAbove || property.BedroomsAbove || total || 0,
                below: property.bedroomsBelow || property.BedroomsBelow || 0,
                total: total,
              };
            })(),
            
            // Bathrooms
            bathrooms: (() => {
              const baths = getNested(property, 'bathrooms', 'Bathrooms', 'bathroomsTotal', 'BathroomsTotal');
              if (typeof baths === 'number' && !isNaN(baths)) return baths;
              return 0;
            })(),
            
            // Square Footage
            squareFootage: (() => {
              if (property.squareFootage && typeof property.squareFootage === 'object') {
                return {
                  min: typeof property.squareFootage.min === 'number' ? property.squareFootage.min : 
                       typeof property.squareFootage.Min === 'number' ? property.squareFootage.Min : 0,
                  max: typeof property.squareFootage.max === 'number' ? property.squareFootage.max : 
                       typeof property.squareFootage.Max === 'number' ? property.squareFootage.Max : 
                       typeof property.squareFootage.min === 'number' ? property.squareFootage.min : 0,
                };
              }
              const sqft = property.squareFootage || property.SquareFootage || property.sqft || property.Sqft;
              const numSqft = typeof sqft === 'number' ? sqft : parseFloat(String(sqft || '0'));
              return {
                min: numSqft || 0,
                max: numSqft || 0,
              };
            })(),
            
            // Parking
            parking: (() => {
              if (property.parking && typeof property.parking === 'object') {
                return {
                  garage: typeof property.parking.garage === 'number' ? property.parking.garage : 
                          typeof property.parking.Garage === 'number' ? property.parking.Garage : 0,
                  driveway: typeof property.parking.driveway === 'number' ? property.parking.driveway : 
                           typeof property.parking.Driveway === 'number' ? property.parking.Driveway : 0,
                  total: property.parking.total || property.parking.Total,
                };
              }
              return {
                garage: property.garageParking || property.GarageParking || property.garageSpaces || 0,
                driveway: property.driveParking || property.DriveParking || property.drivewaySpaces || 0,
                total: property.totalParking || property.TotalParking,
              };
            })(),
            
            // Images
            images: (() => {
              if (Array.isArray(property.images)) return property.images;
              if (Array.isArray(property.imageUrls)) return property.imageUrls;
              if (Array.isArray(property.Images)) return property.Images;
              if (property.primaryImageUrl) return [property.primaryImageUrl];
              if (property.PrimaryImageUrl) return [property.PrimaryImageUrl];
              if (property.imageUrl) return [property.imageUrl];
              return [];
            })(),
            
            // Coordinates - map from API response to frontend format
            coordinates: (() => {
              // If coordinates already exist in correct format, use them
              if (property.coordinates && typeof property.coordinates === 'object' && 
                  typeof property.coordinates.lat === 'number' && 
                  typeof property.coordinates.lng === 'number') {
                return {
                  lat: property.coordinates.lat,
                  lng: property.coordinates.lng,
                };
              }
              
              // Try to map from latitude/longitude fields
              const lat = property.latitude ?? property.Latitude;
              const lng = property.longitude ?? property.Longitude;
              
              if (typeof lat === 'number' && !isNaN(lat) && 
                  typeof lng === 'number' && !isNaN(lng)) {
                return {
                  lat: lat,
                  lng: lng,
                };
              }
              
              // Debug: Log when coordinates are missing
              if (propertiesArray.indexOf(property) < 3) {
                console.log(`[useProperties] Property ${property.id || property.listingKey} missing coordinates:`, {
                  hasCoordinates: !!property.coordinates,
                  latitude: lat,
                  longitude: lng,
                  Latitude: property.Latitude,
                  Longitude: property.Longitude,
                });
              }
              
              // No valid coordinates found
              return undefined;
            })(),
          };
          
          return transformed;
        });
        
        setProperties(transformedProperties);
        setTotal(totalCount);
        setTotalPages(totalPagesNum || Math.ceil(totalCount / pageSizeNum));
      })
      .catch((err) => {
        // Ignore errors from cancelled requests
        if (abortController.signal.aborted) {
          return;
        }

        // Enhanced error logging
        const errorMessage = err instanceof Error ? err.message : String(err);
        const errorDetails = err instanceof Error ? {
          message: err.message,
          stack: err.stack,
          name: err.name,
          ...(err as any).status && { status: (err as any).status },
          ...(err as any).statusText && { statusText: (err as any).statusText },
          ...(err as any).details && { details: (err as any).details },
        } : err;
        
        console.error('Error fetching properties:', {
          error: errorMessage,
          details: errorDetails,
          url: `${API_ENDPOINTS.properties}?${queryString}`,
          filters: filters ? JSON.stringify(filters, null, 2) : 'null',
        });
        
        setError(err instanceof Error ? err : new Error(`Failed to fetch properties: ${errorMessage}`));
        setProperties([]);
      })
      .finally(() => {
        // Only update loading state if request wasn't cancelled
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      });
    }, 300); // 300ms debounce to prevent rapid successive requests

    // Cleanup: cancel pending request if dependencies change
    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      currentRequestRef.current = '';
    };
  }, [page, pageSize, enabled, filters, sortBy, searchTerm]);

  return {
    properties,
    loading,
    error,
    total,
    totalPages,
  };
}

