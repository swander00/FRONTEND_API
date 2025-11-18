/**
 * Search API Endpoints
 * 
 * Autocomplete and suggestion endpoints
 */

import { HttpClient } from '../httpClient';
import { SearchResponse } from '../types';

export class SearchEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * GET /api/search?q={query}&limit={limit}
   * Get property suggestions for autocomplete
   */
  async suggestions(query: string, limit: number = 10): Promise<SearchResponse> {
    const params: Record<string, string | number> = {
      q: query,
      limit: Math.min(Math.max(1, limit), 50), // Clamp between 1 and 50
    };

    return this.client.get<SearchResponse>('/api/search', params);
  }
}

