'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Property } from '@/types/property';
// Import conversion function from search page (TODO: extract to shared utility)
import type { PropertyDetailsResponse, PropertyMediaItem } from '@/lib/api/types';
import type { Property } from '@/types/property';
import type { PropertyRoom } from '@/types/property';

function convertPropertyDetailsToProperty(response: PropertyDetailsResponse): Property {
  const images: string[] = response.media
    ? response.media.map((m: PropertyMediaItem) => m.url).filter((url): url is string => Boolean(url && typeof url === 'string' && url.trim() !== ''))
    : [];

  const normalizeTransactionType = (type: any): 'For Sale' | 'For Lease' | undefined => {
    if (!type) return undefined;
    const normalized = String(type).trim();
    if (normalized === 'For Sale' || normalized === 'For Lease') {
      return normalized as 'For Sale' | 'For Lease';
    }
    if (normalized.toLowerCase().includes('sale') || normalized.toLowerCase().includes('sell')) {
      return 'For Sale';
    }
    if (normalized.toLowerCase().includes('lease') || normalized.toLowerCase().includes('rent')) {
      return 'For Lease';
    }
    return undefined;
  };

  return {
    id: response.listingKey,
    listingKey: response.listingKey,
    mlsNumber: response.mlsNumber,
    price: response.listPrice,
    originalListPrice: response.originalListPrice,
    closePrice: response.closePrice,
    address: {
      street: response.fullAddress,
      city: response.city,
      province: response.stateOrProvince,
    },
    location: {
      neighborhood: response.community || response.city,
      tagColor: '#2563eb',
    },
    propertyType: response.propertyType,
    propertySubType: response.propertySubType,
    bedrooms: {
      above: response.bedroomsAboveGrade || 0,
      below: response.bedroomsBelowGrade || 0,
    },
    bathrooms: response.bathroomsTotalInteger || 0,
    squareFootage: {
      min: response.livingAreaMin || 0,
      max: response.livingAreaMax || 0,
    },
    parking: {
      garage: response.garageSpaces || 0,
      total: response.parkingTotal,
    },
    coordinates: response.latitude && response.longitude ? {
      lat: response.latitude,
      lng: response.longitude,
    } : undefined,
    images,
    primaryImageUrl: response.primaryImageUrl,
    hasVirtualTour: response.hasVirtualTour,
    status: response.mlsStatus,
    transactionType: normalizeTransactionType(response.transactionType),
  } as Property;
}

interface UsePropertyDetailsOptions {
  listingKey: string;
  enabled?: boolean;
}

export function usePropertyDetails(options: UsePropertyDetailsOptions) {
  const { listingKey, enabled = true } = options;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !listingKey) {
      return;
    }

    setLoading(true);
    setError(null);

    api.properties.getDetails(listingKey)
      .then((response) => {
        // Convert API response to Property type
        const convertedProperty = convertPropertyDetailsToProperty(response);
        setProperty(convertedProperty);
      })
      .catch((err) => {
        console.error('Error fetching property details:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch property details'));
        setProperty(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [listingKey, enabled]);

  return {
    property,
    loading,
    error,
  };
}

