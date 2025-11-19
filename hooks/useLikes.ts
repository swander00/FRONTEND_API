/**
 * Likes Hook
 * 
 * Manages liked properties with optimistic updates
 */

import { useState, useEffect, useCallback } from 'react';
import { getLikedProperties, likeProperty, unlikeProperty, type getLikedProperties as GetLikedProperties } from '@/lib/api/likes';
import { useAuth } from './useAuth';

export function useLikes() {
  const { isAuthenticated } = useAuth();
  const [likes, setLikes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLikes([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getLikedProperties()
      .then((data) => {
        if (!cancelled) {
          setLikes(data);
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

  const toggleLike = useCallback(async (mlsNumber: string) => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to like properties');
    }

    const isLiked = likes.includes(mlsNumber);
    setIsToggling(mlsNumber);
    setError(null);

    // Optimistic update
    const previous = likes;
    if (isLiked) {
      setLikes(likes.filter(m => m !== mlsNumber));
    } else {
      setLikes([...likes, mlsNumber]);
    }

    try {
      if (isLiked) {
        await unlikeProperty(mlsNumber);
      } else {
        await likeProperty(mlsNumber);
      }
    } catch (err) {
      // Rollback on error
      setLikes(previous);
      setError(err instanceof Error ? err : new Error('Failed to toggle like'));
      throw err;
    } finally {
      setIsToggling(null);
    }
  }, [likes, isAuthenticated]);

  const isLiked = useCallback((mlsNumber: string) => {
    return likes.includes(mlsNumber);
  }, [likes]);

  return {
    likes,
    isLoading,
    error,
    isLiked,
    toggleLike,
    isToggling,
  };
}

