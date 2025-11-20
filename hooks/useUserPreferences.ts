/**
 * User Preferences Hook
 * 
 * Manages buyer preferences
 */

import { useState, useEffect, useCallback } from 'react';
import { getUserPreferences, updateUserPreferences, type UserBuyerPreferences } from '@/lib/api/users';
import { useAuth } from './useAuth';

export function useUserPreferences() {
  const { isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState<UserBuyerPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setPreferences(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getUserPreferences()
      .then((data) => {
        if (!cancelled) {
          setPreferences(data);
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

  const refetch = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    try {
      const data = await getUserPreferences();
      if (!cancelled) {
        setPreferences(data);
        setIsLoading(false);
      }
    } catch (err) {
      if (!cancelled) {
        setError(err instanceof Error ? err : new Error('Failed to fetch preferences'));
        setIsLoading(false);
      }
    }
  }, [isAuthenticated]);

  const updatePreferences = useCallback(async (updates: Parameters<typeof updateUserPreferences>[0]) => {
    setIsUpdating(true);
    setError(null);

    // Optimistic update
    const previous = preferences;
    if (previous) {
      setPreferences({ ...previous, ...updates });
    }

    try {
      const updated = await updateUserPreferences(updates);
      setPreferences(updated);
    } catch (err) {
      // Rollback on error
      if (previous) {
        setPreferences(previous);
      }
      setError(err instanceof Error ? err : new Error('Failed to update preferences'));
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [preferences]);

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    isUpdating,
    refetch,
  };
}

