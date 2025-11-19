/**
 * User Profile Hook
 * 
 * Manages user profile data
 */

import { useState, useEffect, useCallback } from 'react';
import { getUserProfile, updateUserProfile, type UserProfile } from '@/lib/api/users';
import { useAuth } from './useAuth';

export function useUserProfile() {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getUserProfile()
      .then((data) => {
        if (!cancelled) {
          setProfile(data);
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

  const updateProfile = useCallback(async (updates: Parameters<typeof updateUserProfile>[0]) => {
    if (!profile) return;

    setIsUpdating(true);
    setError(null);

    // Optimistic update
    const previous = profile;
    setProfile({ ...profile, ...updates });

    try {
      const updated = await updateUserProfile(updates);
      setProfile(updated);
    } catch (err) {
      // Rollback on error
      setProfile(previous);
      setError(err instanceof Error ? err : new Error('Failed to update profile'));
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [profile]);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    isUpdating,
  };
}

