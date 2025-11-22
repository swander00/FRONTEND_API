'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Property } from '@/types/property';
import type { SearchResponse as ApiSearchResponse, PropertySuggestionResponse } from '@/lib/api/types';
import { formatCurrency } from '@/lib/formatters';

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
    mlsStatus?: string;
    status?: string;
    originalEntryTimestamp?: string;
    statusDates?: {
      purchaseContractDate?: string;
      suspendedDate?: string;
      terminatedDate?: string;
      expirationDate?: string;
      withdrawnDate?: string;
      unavailableDate?: string;
    };
    beds?: number;
    additionalBeds?: number;
    baths?: number;
    sqftRange?: string;
    propertySubType?: string;
    thumbnailUrl?: string;
  }>;
  total?: number;
}

// Transform PropertySuggestionResponse to suggestion format
const transformListingToSuggestion = (listing: PropertySuggestionResponse) => {
  const locationLine = listing.city && listing.stateOrProvince
    ? `${listing.city}, ${listing.stateOrProvince}`
    : undefined;

  // Extract street address from fullAddress (remove city if present)
  // fullAddress might be "3331 Etude Dr, Mississauga" but we only want "3331 Etude Dr"
  // since locationLine already shows the city separately
  let addressLine = listing.fullAddress || '';
  if (listing.city && addressLine.includes(listing.city)) {
    // Remove city name from address if present
    addressLine = addressLine.replace(new RegExp(`,\\s*${listing.city}.*$`, 'i'), '').trim();
  }

  const sqftRange = listing.livingAreaMin && listing.livingAreaMax
    ? `${listing.livingAreaMin.toLocaleString()} – ${listing.livingAreaMax.toLocaleString()} sq.ft.`
    : listing.livingAreaMin
    ? `${listing.livingAreaMin.toLocaleString()}+ sq.ft.`
    : listing.livingAreaMax
    ? `Up to ${listing.livingAreaMax.toLocaleString()} sq.ft.`
    : undefined;

  return {
    id: listing.listingKey,
    type: 'listing' as const,
    addressLine,
    locationLine,
    price: listing.listPrice,
    priceFormatted: formatCurrency(listing.listPrice),
    mlsNumber: listing.mlsNumber,
    mlsStatus: listing.mlsStatus,
    status: listing.status,
    originalEntryTimestamp: listing.originalEntryTimestamp,
    statusDates: listing.statusDates,
    beds: listing.bedroomsAboveGrade,
    additionalBeds: listing.bedroomsBelowGrade,
    baths: listing.bathroomsTotalInteger,
    sqftRange,
    propertySubType: listing.propertySubType,
    thumbnailUrl: listing.primaryImageUrl,
  };
};

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
      const data = await api.search.suggestions(searchQuery, limit);

      console.log('[usePropertySearch] API response:', { 
        listingsCount: data.listings?.length || 0, 
        listings: data.listings,
        meta: data.meta 
      });

      // Transform listings from API to suggestions format
      if (data.listings && data.listings.length > 0) {
        const transformedSuggestions = data.listings.map(transformListingToSuggestion);
        console.log('[usePropertySearch] Transformed suggestions:', transformedSuggestions);
        setSuggestions(transformedSuggestions);
      } else {
        console.log('[usePropertySearch] No listings found, clearing suggestions');
        setSuggestions([]);
      }
      
      // For now, we don't set results from search endpoint (it's for suggestions only)
      // Results would come from the properties endpoint
      setResults([]);
      setTotal(data.meta?.totalCount || 0);
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

