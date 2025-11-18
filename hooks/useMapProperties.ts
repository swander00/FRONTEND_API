'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGetWithQueryString, API_ENDPOINTS } from '@/lib/api';
import type { Property } from '@/types/property';
import type { FiltersState } from '@/components/search/FiltersContainer/FiltersContext';

interface MapPropertiesResponse {
  properties: Property[];
  total?: number;
}

export interface MapBounds {
  northEast: {
    lat: number;
    lng: number;
  };
  southWest: {
    lat: number;
    lng: number;
  };
}

interface UseMapPropertiesOptions {
  bounds: MapBounds | null;
  filters?: FiltersState | null;
  enabled?: boolean;
}

export function useMapProperties(options: UseMapPropertiesOptions) {
  const { bounds, filters, enabled = true } = options;
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const fetchMapProperties = useCallback(async () => {
    if (!enabled || !bounds) {
      setProperties([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      // Format bounds as JSON string
      const boundsJson = JSON.stringify({
        northEast: {
          lat: bounds.northEast.lat,
          lng: bounds.northEast.lng,
        },
        southWest: {
          lat: bounds.southWest.lat,
          lng: bounds.southWest.lng,
        },
      });
      params.append('bounds', boundsJson);

      // Add optional filters
      if (filters) {
        // Price range
        if (filters.price?.min !== null && filters.price?.min !== undefined) {
          params.append('minPrice', filters.price.min.toString());
        }
        if (filters.price?.max !== null && filters.price?.max !== undefined) {
          params.append('maxPrice', filters.price.max.toString());
        }

        // Property types
        if (filters.propertyTypes && filters.propertyTypes.length > 0) {
          filters.propertyTypes.forEach((type) => {
            params.append('propertyType', type);
          });
        }

        // Cities
        if (filters.cities && filters.cities.length > 0) {
          filters.cities.forEach((city) => {
            params.append('city', city);
          });
        }
      }

      const queryString = params.toString();
      const data = await apiGetWithQueryString<MapPropertiesResponse>(
        API_ENDPOINTS.mapProperties,
        queryString
      );

      // Transform properties to ensure coordinates are in correct format
      const transformedProperties = (data.properties || []).map((property: any, index: number) => {
        // Ensure coordinates are properly formatted
        if (!property.coordinates) {
          const lat = property.latitude ?? property.Latitude;
          const lng = property.longitude ?? property.Longitude;
          
          if (typeof lat === 'number' && !isNaN(lat) && 
              typeof lng === 'number' && !isNaN(lng)) {
            return {
              ...property,
              coordinates: { lat, lng },
            };
          }
        }
        
        // Debug: Log first few properties to check coordinate values
        if (index < 3 && property.coordinates) {
          console.log(`[useMapProperties] Property ${property.id || property.listingKey} coordinates:`, {
            coordinates: property.coordinates,
            latitude: property.latitude,
            longitude: property.longitude,
          });
        }
        
        return property;
      });
      
      // Check for coordinate issues
      if (transformedProperties.length > 0) {
        const coordsWithSameLat = transformedProperties.filter((p: any) => {
          if (!p.coordinates) return false;
          return transformedProperties[0].coordinates?.lat === p.coordinates.lat;
        });
        
        if (coordsWithSameLat.length === transformedProperties.length && transformedProperties.length > 1) {
          console.error(`[useMapProperties] ⚠️ WARNING: All ${transformedProperties.length} properties have the same latitude!`);
          console.error(`[useMapProperties] Latitude: ${transformedProperties[0].coordinates?.lat}`);
        }
      }

      setProperties(transformedProperties);
      setTotal(data.total || transformedProperties.length || 0);
    } catch (err) {
      console.error('Error fetching map properties:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch map properties'));
      setProperties([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [bounds, filters, enabled]);

  useEffect(() => {
    fetchMapProperties();
  }, [fetchMapProperties]);

  return {
    properties,
    loading,
    error,
    total,
    refetch: fetchMapProperties,
  };
}

