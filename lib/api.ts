/**
 * Legacy API Functions (Compatibility Layer)
 * 
 * @deprecated Use the new API client from '@/lib/api' instead:
 * ```typescript
 * import { api } from '@/lib/api';
 * 
 * // Instead of: apiGet(API_ENDPOINTS.properties, { page: 1 })
 * // Use: api.properties.list({}, { page: 1, pageSize: 12 })
 * ```
 * 
 * This file is kept for backward compatibility. New code should use
 * the typed API client in lib/api/index.ts
 */

// Use HTTP client directly to avoid circular dependency issues
import type {
  PropertiesListResponse,
} from './api/types';

/**
 * Get API base URL
 */
function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
}

/**
 * @deprecated Use api.properties.list() instead
 */
export async function apiGet<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
  // Use HTTP client directly to avoid circular dependencies
  const { createHttpClient } = await import('./api/httpClient');
  const client = createHttpClient(getApiBaseUrl());
  
  // For properties endpoint, transform response to match old format
  if (endpoint === '/api/properties' || endpoint === '/api/properties/') {
    const result = await client.get<PropertiesListResponse>(endpoint, params);
    // Transform to old response format for backward compatibility
    return {
      properties: result.properties,
      total: result.totalCount,
      page: result.pagination.page,
      pageSize: result.pagination.pageSize,
      totalPages: result.pagination.totalPages,
    } as T;
  }
  
  // For all other endpoints, use HTTP client directly
  return client.get<T>(endpoint, params);
}

/**
 * @deprecated Use api.properties.list() with filters instead
 */
export async function apiGetWithQueryString<T>(endpoint: string, queryString: string): Promise<T> {
  // Parse query string to params object
  const params: Record<string, string | number | boolean> = {};
  const searchParams = new URLSearchParams(queryString);
  searchParams.forEach((value, key) => {
    // Try to parse as number or boolean
    if (value === 'true') params[key] = true;
    else if (value === 'false') params[key] = false;
    else if (!isNaN(Number(value))) params[key] = Number(value);
    else params[key] = value;
  });

  return apiGet<T>(endpoint, params);
}

/**
 * @deprecated Use api client POST methods when available
 */
export async function apiPost<T>(endpoint: string, data?: unknown): Promise<T> {
  const { createHttpClient } = await import('./api/httpClient');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  const client = createHttpClient(apiUrl);
  return client.post<T>(endpoint, data);
}

/**
 * @deprecated Use api client methods directly
 */
export const API_ENDPOINTS = {
  health: '/health',
  metrics: '/metrics',
  properties: '/api/properties',
  propertyDetails: (listingKey: string) => `/api/properties/${listingKey}`,
  search: '/api/search',
  mapProperties: '/api/properties/map',
  openapi: '/openapi.json',
} as const;

/**
 * @deprecated Use api client methods directly
 */
export { getApiBaseUrl };

// Re-export the new API client and types for compatibility
// This allows imports like: import { api } from '@/lib/api'
export { api, type PropertyDetailsResponse, type PropertyMediaItem } from './api/index';
export * from './api/types';

