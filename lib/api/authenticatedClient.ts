/**
 * Authenticated HTTP Client
 * 
 * HTTP client that automatically includes Supabase JWT token in requests
 */

import { HttpClient } from './httpClient';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';

/**
 * Create authenticated HTTP client that includes JWT token
 * Extends HttpClient and adds authentication headers
 */
export function createAuthenticatedClient(baseUrl: string): HttpClient {
  // Create a wrapper class that extends HttpClient
  class AuthenticatedHttpClient extends HttpClient {
    constructor(baseUrl: string) {
      super({ baseUrl });
    }

    // Override get method to add auth headers
    async get<T>(endpoint: string, params?: Record<string, string | number | boolean | string[] | undefined>): Promise<T> {
      const headers = await getAuthHeaders();
      const url = this.buildUrl(endpoint, params);
      return this.request<T>(url, { method: 'GET', headers });
    }

    // Override post method to add auth headers
    async post<T>(endpoint: string, data?: unknown): Promise<T> {
      const headers = await getAuthHeaders();
      const url = this.buildUrl(endpoint);
      return this.request<T>(url, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined,
      });
    }

    // Override put method to add auth headers
    async put<T>(endpoint: string, data?: unknown): Promise<T> {
      const headers = await getAuthHeaders();
      const url = this.buildUrl(endpoint);
      return this.request<T>(url, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined,
      });
    }

    // Override delete method to add auth headers
    async delete<T>(endpoint: string): Promise<T> {
      const headers = await getAuthHeaders();
      const url = this.buildUrl(endpoint);
      return this.request<T>(url, { method: 'DELETE', headers });
    }
  }

  return new AuthenticatedHttpClient(baseUrl);
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = getSupabaseBrowserClient();
  const headers: Record<string, string> = {};
  
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
  }
  
  return headers;
}

function buildUrl(baseUrl: string, endpoint: string, params?: Record<string, string | number | boolean | string[] | undefined>): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${baseUrl.replace(/\/$/, '')}${cleanEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        value.forEach((item) => url.searchParams.append(key, String(item)));
      } else {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

async function makeRequest<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error.message || errorData.message || errorMessage;
      }
    } catch {
      // If response is not JSON, use status text
    }
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * Get authenticated client instance (singleton)
 */
let authenticatedClient: HttpClient | null = null;

export function getAuthenticatedClient(): HttpClient {
  if (!authenticatedClient) {
    // In development, use Next.js proxy (relative URLs) to avoid CORS issues
    // In production, use direct backend URL
    const isDevelopment = process.env.NODE_ENV === 'development' || typeof window !== 'undefined' && window.location.hostname === 'localhost';
    
    let baseUrl: string;
    if (isDevelopment) {
      // Use relative URL to go through Next.js API proxy
      baseUrl = '';
    } else {
      // Use direct backend URL in production
      baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    }
    
    authenticatedClient = createAuthenticatedClient(baseUrl);
  }
  return authenticatedClient;
}

/**
 * Reset authenticated client instance (useful on logout)
 */
export function resetAuthenticatedClient(): void {
  authenticatedClient = null;
}

