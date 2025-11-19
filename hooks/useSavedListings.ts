/**
 * Saved Listings Hook
 * 
 * Manages saved listings with pagination and filtering
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getSavedListings,
  saveListing,
  updateSavedListing,
  deleteSavedListing,
  getUserTags,
  type SavedListing,
  type SavedListingsResponse,
} from '@/lib/api/saved-listings';
import { useAuth } from './useAuth';

interface UseSavedListingsOptions {
  page?: number;
  limit?: number;
  tag?: string;
  autoFetch?: boolean;
}

export function useSavedListings(options: UseSavedListingsOptions = {}) {
  const { isAuthenticated } = useAuth();
  const { page = 1, limit = 20, tag, autoFetch = true } = options;

  const [listings, setListings] = useState<SavedListing[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  // Fetch listings
  useEffect(() => {
    if (!isAuthenticated || !autoFetch) {
      setListings([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getSavedListings({ page, limit, tag })
      .then((data) => {
        if (!cancelled) {
          setListings(data.listings);
          setTotal(data.total);
          setTotalPages(data.totalPages);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, page, limit, tag, autoFetch]);

  // Fetch tags
  useEffect(() => {
    if (!isAuthenticated) {
      setTags([]);
      return;
    }

    getUserTags()
      .then((data) => {
        setTags(data);
      })
      .catch(() => {
        // Silently fail for tags
      });
  }, [isAuthenticated]);

  const save = useCallback(async (mlsNumber: string, options?: { Notes?: string; Tags?: string[] }) => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to save listings');
    }

    setIsSaving(true);
    setError(null);

    try {
      const saved = await saveListing(mlsNumber, options);
      // Add to current list if on first page
      if (page === 1 && !tag) {
        setListings(prev => [saved, ...prev]);
        setTotal(prev => prev + 1);
      }
      return saved;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save listing'));
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [isAuthenticated, page, tag]);

  const update = useCallback(async (id: string, updates: { Notes?: string; Tags?: string[] }) => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to update listings');
    }

    setError(null);

    // Optimistic update
    const previous = listings;
    setListings(prev => prev.map(listing => 
      listing.Id === id ? { ...listing, ...updates } : listing
    ));

    try {
      const updated = await updateSavedListing(id, updates);
      setListings(prev => prev.map(listing => 
        listing.Id === id ? updated : listing
      ));
      return updated;
    } catch (err) {
      // Rollback on error
      setListings(previous);
      setError(err instanceof Error ? err : new Error('Failed to update listing'));
      throw err;
    }
  }, [isAuthenticated, listings]);

  const remove = useCallback(async (id: string) => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to delete listings');
    }

    setError(null);

    // Optimistic update
    const previous = listings;
    setListings(prev => prev.filter(listing => listing.Id !== id));
    setTotal(prev => Math.max(0, prev - 1));

    try {
      await deleteSavedListing(id);
    } catch (err) {
      // Rollback on error
      setListings(previous);
      setTotal(prev => prev + 1);
      setError(err instanceof Error ? err : new Error('Failed to delete listing'));
      throw err;
    }
  }, [isAuthenticated, listings]);

  const refetch = useCallback(() => {
    if (!isAuthenticated || !autoFetch) return;

    setIsLoading(true);
    getSavedListings({ page, limit, tag })
      .then((data) => {
        setListings(data.listings);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [isAuthenticated, page, limit, tag, autoFetch]);

  return {
    listings,
    total,
    totalPages,
    isLoading,
    error,
    tags,
    save,
    update,
    remove,
    refetch,
    isSaving,
  };
}

