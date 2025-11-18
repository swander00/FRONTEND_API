'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, API_ENDPOINTS } from '@/lib/api';
import type { Property } from '@/types/property';

interface SearchResponse {
  properties?: Property[];
  suggestions?: Array<{
    id: string;
    type: 'listing' | 'city' | 'community';
    addressLine?: string;
    locationLine?: string;
    name?: string;
    subtitle?: string;
    badge?: string;
    price?: number;
    priceFormatted?: string;
    mlsNumber?: string;
    beds?: number;
    additionalBeds?: number;
    baths?: number;
    sqftRange?: string;
    propertySubType?: string;
    thumbnailUrl?: string;
  }>;
  total?: number;
}

interface UsePropertySearchOptions {
  query?: string;
  limit?: number;
  enabled?: boolean;
}

export function usePropertySearch(options: UsePropertySearchOptions = {}) {
  const { query = '', limit = 10, enabled = true } = options;
  const [results, setResults] = useState<Property[]>([]);
  const [suggestions, setSuggestions] = useState<SearchResponse['suggestions']>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const search = useCallback(async (searchQuery: string) => {
    if (!enabled || !searchQuery.trim()) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiGet<SearchResponse>(API_ENDPOINTS.search, {
        q: searchQuery,
        limit,
      });

      if (data.properties) {
        setResults(data.properties);
      }
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error searching properties:', err);
      setError(err instanceof Error ? err : new Error('Failed to search properties'));
      setResults([]);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, limit]);

  useEffect(() => {
    if (query) {
      search(query);
    } else {
      setResults([]);
      setSuggestions([]);
    }
  }, [query, search]);

  return {
    results,
    suggestions,
    loading,
    error,
    total,
    search,
  };
}

