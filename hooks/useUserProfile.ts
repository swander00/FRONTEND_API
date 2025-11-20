/**
 * User Profile Hook
 * 
 * Manages user profile data
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getUserProfile, updateUserProfile, type UserProfile } from '@/lib/api/users';
import { useAuth } from './useAuth';

export function useUserProfile() {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fetchingRef = useRef(false); // Prevent multiple simultaneous requests

  useEffect(() => {
    if (!isAuthenticated) {
      setProfile(null);
      setIsLoading(false);
      setError(null);
      fetchingRef.current = false;
      return;
    }

    // Prevent multiple simultaneous requests
    if (fetchingRef.current) {
      return;
    }

    let cancelled = false;
    fetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    getUserProfile()
      .then((data) => {
        if (!cancelled) {
          setProfile(data);
          setIsLoading(false);
          setError(null);
          fetchingRef.current = false;
        }
      })
      .catch((err) => {
        if (!cancelled) {
          fetchingRef.current = false;
          
          // Handle 404 as "profile doesn't exist yet" - this is expected for new users
          // Don't treat it as an error, just set profile to null
          const is404 = (err as any)?.status === 404 || 
                       (err instanceof Error && err.message.includes('404')) ||
                       (err instanceof Error && err.message.includes('not found')) ||
                       (err instanceof Error && err.message.includes('Profile not found'));
          
          if (is404) {
            // Profile doesn't exist yet - this is OK, user needs to complete onboarding
            setProfile(null);
            setError(null); // Don't treat 404 as an error
          } else {
            // Real error - set error state
            setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
          }
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
      fetchingRef.current = false;
    };
  }, [isAuthenticated]);

  const refetch = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    // Prevent multiple simultaneous requests
    if (fetchingRef.current) {
      return;
    }

    let cancelled = false;
    fetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const data = await getUserProfile();
      if (!cancelled) {
        setProfile(data);
        setIsLoading(false);
        setError(null);
        fetchingRef.current = false;
      }
    } catch (err) {
      if (!cancelled) {
        fetchingRef.current = false;
        
        // Handle 404 as "profile doesn't exist yet" - this is expected for new users
        const is404 = (err as any)?.status === 404 || 
                     (err instanceof Error && err.message.includes('404')) ||
                     (err instanceof Error && err.message.includes('not found')) ||
                     (err instanceof Error && err.message.includes('Profile not found'));
        
        if (is404) {
          setProfile(null);
          setError(null);
        } else {
          setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
        }
        setIsLoading(false);
      }
    }
  }, [isAuthenticated]);

  const updateProfile = useCallback(async (updates: Parameters<typeof updateUserProfile>[0]) => {
    setIsUpdating(true);
    setError(null);

    // Optimistic update
    const previous = profile;
    if (previous) {
      setProfile({ ...previous, ...updates });
    }

    try {
      const updated = await updateUserProfile(updates);
      setProfile(updated);
    } catch (err) {
      // Rollback on error
      if (previous) {
        setProfile(previous);
      }
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
    refetch,
  };
}

