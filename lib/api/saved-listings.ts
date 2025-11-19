/**
 * Saved Listings API Client
 * 
 * Functions for interacting with saved listings endpoints
 */

import { getAuthenticatedClient } from './authenticatedClient';

export interface SavedListing {
  Id: string;
  UserId: string;
  MlsNumber: string;
  SavedAt: string;
  Notes: string | null;
  Tags: string[] | null;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface SavedListingsResponse {
  listings: SavedListing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TagsResponse {
  tags: string[];
}

/**
 * Get saved listings with pagination
 */
export async function getSavedListings(options?: {
  page?: number;
  limit?: number;
  tag?: string;
}): Promise<SavedListingsResponse> {
  const client = getAuthenticatedClient();
  return client.get<SavedListingsResponse>('/api/saved-listings', options);
}

/**
 * Get a single saved listing
 */
export async function getSavedListing(id: string): Promise<SavedListing> {
  const client = getAuthenticatedClient();
  return client.get<SavedListing>(`/api/saved-listings/${id}`);
}

/**
 * Save a listing (upsert)
 */
export async function saveListing(
  mlsNumber: string,
  options?: { Notes?: string; Tags?: string[] }
): Promise<SavedListing> {
  const client = getAuthenticatedClient();
  return client.post<SavedListing>('/api/saved-listings', {
    mlsNumber,
    ...options,
  });
}

/**
 * Update a saved listing
 */
export async function updateSavedListing(
  id: string,
  updates: { Notes?: string; Tags?: string[] }
): Promise<SavedListing> {
  const client = getAuthenticatedClient();
  return client.put<SavedListing>(`/api/saved-listings/${id}`, updates);
}

/**
 * Delete a saved listing
 */
export async function deleteSavedListing(id: string): Promise<void> {
  const client = getAuthenticatedClient();
  await client.delete(`/api/saved-listings/${id}`);
}

/**
 * Get all unique tags for current user
 */
export async function getUserTags(): Promise<string[]> {
  const client = getAuthenticatedClient();
  const response = await client.get<TagsResponse>('/api/saved-listings/tags');
  return response.tags;
}

