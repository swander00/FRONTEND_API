'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FiltersState } from '@/components/search/FiltersContainer/FiltersContext';
import type { Property } from '@/types/property';

type StatusOption = 'For Sale' | 'For Lease' | 'Sold' | 'Leased' | 'Removed';

// Map status values to URL-friendly strings
const STATUS_TO_URL: Record<StatusOption, string> = {
  'For Sale': 'for-sale',
  'For Lease': 'for-lease',
  'Sold': 'sold',
  'Leased': 'leased',
  'Removed': 'removed',
};

// Reverse map URL strings to status values
const URL_TO_STATUS: Record<string, StatusOption> = {
  'for-sale': 'For Sale',
  'for-lease': 'For Lease',
  'sold': 'Sold',
  'leased': 'Leased',
  'removed': 'Removed',
};

/**
 * Hook to sync URL search params with filters and property modal state
 */
export function useSearchUrlSync(
  filters: FiltersState,
  onStatusChange: (status: StatusOption) => void,
  selectedProperty: Property | null,
  onPropertySelect: (property: Property | null) => void,
) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL params on mount and restore state
  useEffect(() => {
    const statusParam = searchParams.get('status');
    const mlsParam = searchParams.get('mls');

    // Restore status filter from URL
    if (statusParam && URL_TO_STATUS[statusParam] && URL_TO_STATUS[statusParam] !== filters.status) {
      onStatusChange(URL_TO_STATUS[statusParam]);
    }

    // Note: We don't restore property from URL here because we need to fetch it
    // The property modal will handle fetching based on the MLS number in the URL
  }, []); // Only run on mount

  // Update URL when status filter changes
  useEffect(() => {
    const currentStatusParam = searchParams.get('status');
    const urlStatus = STATUS_TO_URL[filters.status];
    const mlsParam = searchParams.get('mls');

    // Only update if status actually changed in URL
    if (currentStatusParam !== urlStatus) {
      const params = new URLSearchParams(searchParams.toString());
      
      if (filters.status === 'For Sale') {
        // Remove status param if it's the default
        params.delete('status');
      } else {
        params.set('status', urlStatus);
      }

      // Preserve MLS param if it exists
      if (mlsParam) {
        params.set('mls', mlsParam);
      }

      const newUrl = params.toString() ? `?${params.toString()}` : '';
      router.replace(`/search${newUrl}`, { scroll: false });
    }
  }, [filters.status, router, searchParams]);

  // Update URL when property modal opens/closes
  useEffect(() => {
    const currentMlsParam = searchParams.get('mls');
    const statusParam = searchParams.get('status');
    const mlsNumber = selectedProperty?.mlsNumber;

    // Only update if MLS param actually changed
    if (currentMlsParam !== mlsNumber) {
      const params = new URLSearchParams(searchParams.toString());

      if (mlsNumber) {
        params.set('mls', mlsNumber);
      } else {
        params.delete('mls');
      }

      // Preserve status param if it exists
      if (statusParam) {
        params.set('status', statusParam);
      }

      const newUrl = params.toString() ? `?${params.toString()}` : '';
      router.replace(`/search${newUrl}`, { scroll: false });
    }
  }, [selectedProperty?.mlsNumber, router, searchParams]);

  // Function to get initial status from URL (for FiltersProvider initialization)
  const getInitialStatusFromUrl = useCallback((): StatusOption | null => {
    const statusParam = searchParams.get('status');
    if (statusParam && URL_TO_STATUS[statusParam]) {
      return URL_TO_STATUS[statusParam];
    }
    return null;
  }, [searchParams]);

  // Function to get MLS number from URL
  const getMlsFromUrl = useCallback((): string | null => {
    return searchParams.get('mls');
  }, [searchParams]);

  return {
    getInitialStatusFromUrl,
    getMlsFromUrl,
  };
}

