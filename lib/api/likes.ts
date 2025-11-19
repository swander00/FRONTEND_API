/**
 * Likes API Client
 * 
 * Functions for interacting with likes endpoints
 */

import { getAuthenticatedClient } from './authenticatedClient';

export interface LikesResponse {
  mlsNumbers: string[];
}

/**
 * Get all liked MLS numbers
 */
export async function getLikedProperties(): Promise<string[]> {
  const client = getAuthenticatedClient();
  const response = await client.get<LikesResponse>('/api/likes');
  return response.mlsNumbers;
}

/**
 * Like a property
 */
export async function likeProperty(mlsNumber: string): Promise<void> {
  const client = getAuthenticatedClient();
  await client.post('/api/likes', { mlsNumber });
}

/**
 * Unlike a property
 */
export async function unlikeProperty(mlsNumber: string): Promise<void> {
  const client = getAuthenticatedClient();
  await client.delete(`/api/likes/${mlsNumber}`);
}

/**
 * Bulk like properties
 */
export async function bulkLikeProperties(mlsNumbers: string[]): Promise<{ success: boolean; count: number }> {
  const client = getAuthenticatedClient();
  return client.post('/api/likes/bulk', { mlsNumbers });
}

