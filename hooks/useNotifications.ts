/**
 * Notifications Hook
 * 
 * Manages notifications with real-time subscriptions
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  type Notification,
} from '@/lib/api/notifications';
import { useAuth } from './useAuth';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';

interface UseNotificationsOptions {
  unreadOnly?: boolean;
  limit?: number;
  offset?: number;
  autoFetch?: boolean;
  enableRealtime?: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { isAuthenticated, user } = useAuth();
  const {
    unreadOnly = false,
    limit = 20,
    offset = 0,
    autoFetch = true,
    enableRealtime = true,
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch notifications
  useEffect(() => {
    if (!isAuthenticated || !autoFetch) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getNotifications({ unreadOnly, limit, offset })
      .then((data) => {
        if (!cancelled) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
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
  }, [isAuthenticated, unreadOnly, limit, offset, autoFetch]);

  // Fetch unread count separately (for badge updates)
  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    const interval = setInterval(() => {
      getUnreadCount()
        .then((count) => {
          setUnreadCount(count);
        })
        .catch(() => {
          // Silently fail for unread count
        });
    }, 30000); // Update every 30 seconds

    // Initial fetch
    getUnreadCount()
      .then((count) => {
        setUnreadCount(count);
      })
      .catch(() => {
        // Silently fail
      });

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Real-time subscription
  useEffect(() => {
    if (!isAuthenticated || !enableRealtime || !user) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'UserNotifications',
          filter: `UserId=eq.${user.id}`,
        },
        (payload) => {
          // New notification received
          const newNotification = payload.new as Notification;
          
          // Add to list if it matches current filters
          if (!unreadOnly || !newNotification.IsRead) {
            setNotifications((prev) => [newNotification, ...prev]);
          }
          
          // Update unread count
          if (!newNotification.IsRead) {
            setUnreadCount((prev) => prev + 1);
            setTotal((prev) => prev + 1);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'UserNotifications',
          filter: `UserId=eq.${user.id}`,
        },
        (payload) => {
          // Notification updated (e.g., marked as read)
          const updated = payload.new as Notification;
          
          setNotifications((prev) =>
            prev.map((n) => (n.Id === updated.Id ? updated : n))
          );

          // Update unread count
          if (updated.IsRead) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, enableRealtime, user, unreadOnly]);

  const markRead = useCallback(async (id: string) => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to mark notifications as read');
    }

    setError(null);

    // Optimistic update
    const previous = notifications;
    setNotifications((prev) =>
      prev.map((n) =>
        n.Id === id ? { ...n, IsRead: true, ReadAt: new Date().toISOString() } : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markAsRead(id);
    } catch (err) {
      // Rollback on error
      setNotifications(previous);
      setUnreadCount((prev) => prev + 1);
      setError(err instanceof Error ? err : new Error('Failed to mark notification as read'));
      throw err;
    }
  }, [isAuthenticated, notifications]);

  const markAllRead = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to mark notifications as read');
    }

    setError(null);

    // Optimistic update
    const previous = notifications;
    const previousUnreadCount = unreadCount;
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        IsRead: true,
        ReadAt: n.ReadAt || new Date().toISOString(),
      }))
    );
    setUnreadCount(0);

    try {
      await markAllAsRead();
    } catch (err) {
      // Rollback on error
      setNotifications(previous);
      setUnreadCount(previousUnreadCount);
      setError(err instanceof Error ? err : new Error('Failed to mark all as read'));
      throw err;
    }
  }, [isAuthenticated, notifications, unreadCount]);

  const remove = useCallback(async (id: string) => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to delete notifications');
    }

    setError(null);

    // Optimistic update
    const previous = notifications;
    const notification = notifications.find((n) => n.Id === id);
    setNotifications((prev) => prev.filter((n) => n.Id !== id));
    setTotal((prev) => Math.max(0, prev - 1));
    if (notification && !notification.IsRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      await deleteNotification(id);
    } catch (err) {
      // Rollback on error
      setNotifications(previous);
      setTotal((prev) => prev + 1);
      if (notification && !notification.IsRead) {
        setUnreadCount((prev) => prev + 1);
      }
      setError(err instanceof Error ? err : new Error('Failed to delete notification'));
      throw err;
    }
  }, [isAuthenticated, notifications]);

  const refetch = useCallback(() => {
    if (!isAuthenticated || !autoFetch) return;

    setIsLoading(true);
    getNotifications({ unreadOnly, limit, offset })
      .then((data) => {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
        setTotal(data.total);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [isAuthenticated, unreadOnly, limit, offset, autoFetch]);

  return {
    notifications,
    unreadCount,
    total,
    isLoading,
    error,
    markAsRead: markRead,
    markAllAsRead: markAllRead,
    deleteNotification: remove,
    refetch,
  };
}

