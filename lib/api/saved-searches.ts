/**
 * Saved Searches API Client
 * 
 * Functions for interacting with saved searches endpoints
 */

import { getAuthenticatedClient } from './authenticatedClient';

export interface SavedSearch {
  Id: string;
  UserId: string;
  Name: string;
  Filters: Record<string, any>;
  AlertsEnabled: boolean;
  AlertFrequency: 'instant' | 'daily' | 'weekly' | 'never';
  LastRunAt: string | null;
  LastNotifiedAt: string | null;
  NewResultsCount: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface CreateSavedSearchInput {
  Name: string;
  Filters: Record<string, any>;
  AlertsEnabled?: boolean;
  AlertFrequency?: 'instant' | 'daily' | 'weekly' | 'never';
}

export interface UpdateSavedSearchInput {
  Name?: string;
  Filters?: Record<string, any>;
  AlertsEnabled?: boolean;
  AlertFrequency?: 'instant' | 'daily' | 'weekly' | 'never';
}

/**
 * Get all saved searches
 */
export async function getSavedSearches(): Promise<SavedSearch[]> {
  const client = getAuthenticatedClient();
  return client.get<SavedSearch[]>('/api/saved-searches');
}

/**
 * Get a single saved search
 */
export async function getSavedSearch(id: string): Promise<SavedSearch> {
  const client = getAuthenticatedClient();
  return client.get<SavedSearch>(`/api/saved-searches/${id}`);
}

/**
 * Create a saved search
 */
export async function createSavedSearch(input: CreateSavedSearchInput): Promise<SavedSearch> {
  const client = getAuthenticatedClient();
  return client.post<SavedSearch>('/api/saved-searches', input);
}

/**
 * Update a saved search
 */
export async function updateSavedSearch(id: string, updates: UpdateSavedSearchInput): Promise<SavedSearch> {
  const client = getAuthenticatedClient();
  return client.put<SavedSearch>(`/api/saved-searches/${id}`, updates);
}

/**
 * Delete a saved search
 */
export async function deleteSavedSearch(id: string): Promise<void> {
  const client = getAuthenticatedClient();
  await client.delete(`/api/saved-searches/${id}`);
}

