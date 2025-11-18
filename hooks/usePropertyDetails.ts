'use client';

import { useState, useEffect } from 'react';
import { apiGet, API_ENDPOINTS } from '@/lib/api';
import type { Property } from '@/types/property';

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

    apiGet<Property>(API_ENDPOINTS.propertyDetails(listingKey))
      .then((data) => {
        setProperty(data);
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

