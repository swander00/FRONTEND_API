/**
 * Viewing History API Client
 * 
 * Functions for interacting with viewing history endpoints
 */

import { getAuthenticatedClient } from './authenticatedClient';

export interface ViewingHistoryEntry {
  Id: string;
  UserId: string;
  MlsNumber: string;
  ViewCount: number;
  FirstViewedAt: string;
  LastViewedAt: string;
}

export interface ViewingHistoryResponse {
  history: ViewingHistoryEntry[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Track a property view
 */
export async function trackView(mlsNumber: string): Promise<void> {
  const client = getAuthenticatedClient();
  await client.post('/api/viewing-history/track', { mlsNumber });
}

/**
 * Get viewing history with pagination
 */
export async function getViewingHistory(options?: {
  limit?: number;
  offset?: number;
}): Promise<ViewingHistoryResponse> {
  const client = getAuthenticatedClient();
  return client.get<ViewingHistoryResponse>('/api/viewing-history', options);
}

/**
 * Delete a viewing history entry
 */
export async function deleteViewingHistory(id: string): Promise<void> {
  const client = getAuthenticatedClient();
  await client.delete(`/api/viewing-history/${id}`);
}

/**
 * Clear all viewing history
 */
export async function clearViewingHistory(): Promise<void> {
  const client = getAuthenticatedClient();
  await client.delete('/api/viewing-history/clear');
}

