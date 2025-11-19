/**
 * Saved Searches Hook
 * 
 * Manages saved searches
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getSavedSearches,
  createSavedSearch,
  updateSavedSearch,
  deleteSavedSearch,
  type SavedSearch,
  type CreateSavedSearchInput,
  type UpdateSavedSearchInput,
} from '@/lib/api/saved-searches';
import { useAuth } from './useAuth';

export function useSavedSearches() {
  const { isAuthenticated } = useAuth();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setSearches([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getSavedSearches()
      .then((data) => {
        if (!cancelled) {
          setSearches(data);
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
  }, [isAuthenticated]);

  const create = useCallback(async (input: CreateSavedSearchInput) => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to create saved searches');
    }

    setIsSaving(true);
    setError(null);

    try {
      const saved = await createSavedSearch(input);
      setSearches(prev => [saved, ...prev]);
      return saved;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create saved search'));
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [isAuthenticated]);

  const update = useCallback(async (id: string, updates: UpdateSavedSearchInput) => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to update saved searches');
    }

    setError(null);

    // Optimistic update
    const previous = searches;
    setSearches(prev => prev.map(search => 
      search.Id === id ? { ...search, ...updates } : search
    ));

    try {
      const updated = await updateSavedSearch(id, updates);
      setSearches(prev => prev.map(search => 
        search.Id === id ? updated : search
      ));
      return updated;
    } catch (err) {
      // Rollback on error
      setSearches(previous);
      setError(err instanceof Error ? err : new Error('Failed to update saved search'));
      throw err;
    }
  }, [isAuthenticated, searches]);

  const remove = useCallback(async (id: string) => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to delete saved searches');
    }

    setError(null);

    // Optimistic update
    const previous = searches;
    setSearches(prev => prev.filter(search => search.Id !== id));

    try {
      await deleteSavedSearch(id);
    } catch (err) {
      // Rollback on error
      setSearches(previous);
      setError(err instanceof Error ? err : new Error('Failed to delete saved search'));
      throw err;
    }
  }, [isAuthenticated, searches]);

  const refetch = useCallback(() => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    getSavedSearches()
      .then((data) => {
        setSearches(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [isAuthenticated]);

  return {
    searches,
    isLoading,
    error,
    create,
    update,
    remove,
    refetch,
    isSaving,
  };
}

