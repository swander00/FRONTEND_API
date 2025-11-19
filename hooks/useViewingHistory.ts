/**
 * Viewing History Hook
 * 
 * Manages viewing history tracking and retrieval
 */

import { useState, useEffect, useCallback } from 'react';
import {
  trackView,
  getViewingHistory,
  deleteViewingHistory,
  clearViewingHistory,
  type ViewingHistoryEntry,
} from '@/lib/api/viewing-history';
import { useAuth } from './useAuth';

interface UseViewingHistoryOptions {
  limit?: number;
  offset?: number;
  autoFetch?: boolean;
}

export function useViewingHistory(options: UseViewingHistoryOptions = {}) {
  const { isAuthenticated } = useAuth();
  const { limit = 20, offset = 0, autoFetch = true } = options;

  const [history, setHistory] = useState<ViewingHistoryEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isTracking, setIsTracking] = useState<string | null>(null);

  // Fetch history
  useEffect(() => {
    if (!isAuthenticated || !autoFetch) {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getViewingHistory({ limit, offset })
      .then((data) => {
        if (!cancelled) {
          setHistory(data.history);
          setTotal(data.total);
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
  }, [isAuthenticated, limit, offset, autoFetch]);

  const track = useCallback(async (mlsNumber: string) => {
    if (!isAuthenticated) {
      // Silently fail if not authenticated
      return;
    }

    setIsTracking(mlsNumber);
    setError(null);

    try {
      await trackView(mlsNumber);
      // Optionally refresh history if this property isn't in current view
      // For now, we'll just track without updating the list
    } catch (err) {
      // Silently fail for tracking - it's non-critical
      console.error('Failed to track view:', err);
    } finally {
      setIsTracking(null);
    }
  }, [isAuthenticated]);

  const remove = useCallback(async (id: string) => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to delete viewing history');
    }

    setError(null);

    // Optimistic update
    const previous = history;
    setHistory(prev => prev.filter(entry => entry.Id !== id));
    setTotal(prev => Math.max(0, prev - 1));

    try {
      await deleteViewingHistory(id);
    } catch (err) {
      // Rollback on error
      setHistory(previous);
      setTotal(prev => prev + 1);
      setError(err instanceof Error ? err : new Error('Failed to delete viewing history'));
      throw err;
    }
  }, [isAuthenticated, history]);

  const clear = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to clear viewing history');
    }

    setError(null);

    // Optimistic update
    const previous = history;
    setHistory([]);
    setTotal(0);

    try {
      await clearViewingHistory();
    } catch (err) {
      // Rollback on error
      setHistory(previous);
      setTotal(previous.length);
      setError(err instanceof Error ? err : new Error('Failed to clear viewing history'));
      throw err;
    }
  }, [isAuthenticated, history]);

  const refetch = useCallback(() => {
    if (!isAuthenticated || !autoFetch) return;

    setIsLoading(true);
    getViewingHistory({ limit, offset })
      .then((data) => {
        setHistory(data.history);
        setTotal(data.total);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [isAuthenticated, limit, offset, autoFetch]);

  return {
    history,
    total,
    isLoading,
    error,
    track,
    remove,
    clear,
    refetch,
    isTracking,
  };
}

