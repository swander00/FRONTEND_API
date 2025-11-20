/**
 * HTTP Client
 * 
 * Core HTTP client for making API requests with error handling and retry logic
 */

import { ApiErrorResponse } from './types';

export interface HttpClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export class HttpClient {
  private config: Required<HttpClientConfig>;

  constructor(config: HttpClientConfig) {
    this.config = {
      baseUrl: config.baseUrl.replace(/\/$/, ''), // Remove trailing slash
      timeout: config.timeout ?? 60000, // 60 seconds default
      retries: config.retries ?? 0, // No retries by default
      retryDelay: config.retryDelay ?? 1000, // 1 second default
    };
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | string[] | undefined>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    return this.request<T>(url, { method: 'GET' });
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, { method: 'DELETE' });
  }

  /**
   * Build full URL from endpoint and query parameters
   */
  protected buildUrl(endpoint: string, params?: Record<string, string | number | boolean | string[] | undefined>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Handle empty baseUrl (relative URLs) - use window.location.origin as base
    // This is needed because URL constructor requires an absolute URL
    let baseUrl = this.config.baseUrl;
    if (!baseUrl || baseUrl.trim() === '') {
      if (typeof window !== 'undefined' && window.location?.origin) {
        baseUrl = window.location.origin;
      } else {
        // SSR case or invalid origin - return relative URL for fetch to handle
        // Fetch API can handle relative URLs, so we'll construct the URL differently
        const relativeUrl = cleanEndpoint + (params ? this.buildQueryString(params) : '');
        return relativeUrl;
      }
    }
    
    // Validate baseUrl before constructing URL
    try {
      const url = new URL(`${baseUrl}${cleanEndpoint}`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value === undefined || value === null) {
            return; // Skip undefined/null values
          }

          if (Array.isArray(value)) {
            // Handle array parameters (e.g., city=Toronto&city=Mississauga)
            value.forEach((item) => {
              url.searchParams.append(key, String(item));
            });
          } else {
            url.searchParams.append(key, String(value));
          }
        });
      }

      return url.toString();
    } catch (error) {
      // If URL construction fails, fall back to relative URL
      console.warn('Failed to construct absolute URL, using relative URL:', error);
      return cleanEndpoint + (params ? this.buildQueryString(params) : '');
    }
  }

  /**
   * Build query string from params (helper for relative URLs)
   */
  private buildQueryString(params: Record<string, string | number | boolean | string[] | undefined>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Make HTTP request with retry logic
   */
  protected async request<T>(url: string, options: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Handle 429 (Too Many Requests) with retry logic
          if (response.status === 429 && attempt < this.config.retries) {
            // Check for Retry-After header
            const retryAfter = response.headers.get('Retry-After');
            let delay = this.config.retryDelay * Math.pow(2, attempt); // Exponential backoff
            
            if (retryAfter) {
              // Use Retry-After header if provided (can be seconds or HTTP date)
              const retryAfterSeconds = parseInt(retryAfter, 10);
              if (!isNaN(retryAfterSeconds)) {
                delay = retryAfterSeconds * 1000; // Convert to milliseconds
              }
            }
            
            clearTimeout(timeoutId);
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue; // Retry the request
          }
          
          await this.handleErrorResponse(response);
        }

        // Handle 204 No Content
        if (response.status === 204) {
          return undefined as T;
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeoutId);

        // Don't retry on abort (timeout)
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error(`Request timeout after ${this.config.timeout}ms`);
          }
        }

        lastError = error instanceof Error ? error : new Error(String(error));

        // Retry on network errors or server errors (5xx)
        // Note: 429 is handled above in the response.ok check
        if (attempt < this.config.retries) {
          const delay = this.config.retryDelay * Math.pow(2, attempt); // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        throw lastError;
      }
    }

    throw lastError || new Error('Request failed');
  }

  /**
   * Handle error responses
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
    let errorDetails: unknown = null;

    // Provide user-friendly error messages for common status codes
    if (response.status === 429) {
      errorMessage = 'Too many requests. Please wait a moment and try again.';
    } else if (response.status === 503) {
      errorMessage = 'Service temporarily unavailable. Please try again later.';
    } else if (response.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    }

    try {
      const errorData: ApiErrorResponse = await response.json();
      if (errorData.error) {
        // Use API error message if available, but keep user-friendly message for 429
        if (response.status !== 429) {
          errorMessage = errorData.error.message || errorMessage;
        }
        errorDetails = errorData.error.details;
      }
    } catch {
      // If response is not JSON, use status text or our friendly message
    }

    const error = new Error(errorMessage);
    (error as any).status = response.status;
    (error as any).statusText = response.statusText;
    (error as any).details = errorDetails;

    throw error;
  }
}

/**
 * Create HTTP client instance
 */
export function createHttpClient(baseUrl: string): HttpClient {
  return new HttpClient({
    baseUrl,
    timeout: 60000, // Increased to 60 seconds to handle slow database queries
    retries: 3, // Enable retries for rate limiting (429) and server errors
    retryDelay: 1000, // Base delay of 1 second, will use exponential backoff
  });
}

