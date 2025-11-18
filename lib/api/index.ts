/**
 * API Client
 * 
 * Main entry point for the API client. Provides a clean, typed interface
 * to all backend endpoints.
 * 
 * Usage:
 * ```typescript
 * import { api } from '@/lib/api';
 * 
 * // Get properties
 * const properties = await api.properties.list({ city: 'Toronto' }, { page: 1, pageSize: 12 });
 * 
 * // Get property details
 * const property = await api.properties.getDetails('X12391175');
 * 
 * // Search
 * const results = await api.search.suggestions('toronto', 10);
 * 
 * // Health check
 * const health = await api.health.check();
 * ```
 */

import { createHttpClient } from './httpClient';
import { PropertiesEndpoints } from './endpoints/properties';
import { SearchEndpoints } from './endpoints/search';
import { HealthEndpoints } from './endpoints/health';

// Get API URL from environment
const getApiUrl = (): string => {
  // Check for NEXT_PUBLIC_API_URL first (new standard)
  if (typeof window !== 'undefined') {
    // Client-side: use NEXT_PUBLIC_API_URL or fallback to NEXT_PUBLIC_BACKEND_URL
    return (
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      'http://localhost:8080'
    );
  }
  // Server-side: same logic
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'http://localhost:8080'
  );
};

// Create HTTP client instance
const httpClient = createHttpClient(getApiUrl());

// Create endpoint instances
const properties = new PropertiesEndpoints(httpClient);
const search = new SearchEndpoints(httpClient);
const health = new HealthEndpoints(httpClient);

// Export API client
export const api = {
  properties,
  search,
  health,
};

// Re-export types for convenience
export * from './types';

// Re-export endpoint classes if needed
export { PropertiesEndpoints, SearchEndpoints, HealthEndpoints };

// Export HTTP client for advanced usage
export { HttpClient, createHttpClient } from './httpClient';

