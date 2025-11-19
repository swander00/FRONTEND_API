/**
 * Notifications API Client
 * 
 * Functions for interacting with notifications endpoints
 */

import { getAuthenticatedClient } from './authenticatedClient';

export type NotificationType = 'saved_search' | 'price_change' | 'status_change' | 'open_house' | 'system';

export interface Notification {
  Id: string;
  UserId: string;
  Type: NotificationType;
  Title: string;
  Message: string;
  Data: Record<string, any>;
  IsRead: boolean;
  ReadAt: string | null;
  CreatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  limit: number;
  offset: number;
}

export interface UnreadCountResponse {
  count: number;
}

/**
 * Get notifications with pagination
 */
export async function getNotifications(options?: {
  unreadOnly?: boolean;
  limit?: number;
  offset?: number;
}): Promise<NotificationsResponse> {
  const client = getAuthenticatedClient();
  return client.get<NotificationsResponse>('/api/notifications', options);
}

/**
 * Get unread count only
 */
export async function getUnreadCount(): Promise<number> {
  const client = getAuthenticatedClient();
  const response = await client.get<UnreadCountResponse>('/api/notifications/unread-count');
  return response.count;
}

/**
 * Mark a notification as read
 */
export async function markAsRead(id: string): Promise<Notification> {
  const client = getAuthenticatedClient();
  return client.put<Notification>(`/api/notifications/${id}/read`, {});
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<{ success: boolean; count: number }> {
  const client = getAuthenticatedClient();
  return client.put<{ success: boolean; count: number }>('/api/notifications/read-all', {});
}

/**
 * Delete a notification
 */
export async function deleteNotification(id: string): Promise<void> {
  const client = getAuthenticatedClient();
  await client.delete(`/api/notifications/${id}`);
}

