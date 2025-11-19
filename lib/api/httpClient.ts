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
      timeout: config.timeout ?? 30000, // 30 seconds default
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
    const url = new URL(`${this.config.baseUrl}${cleanEndpoint}`);

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
          await this.handleErrorResponse(response);
        }

        // Handle 204 No Content
        if (response.status === 204) {
          return undefined as T;
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeoutId);

        // Don't retry on abort (timeout) or client errors (4xx)
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error(`Request timeout after ${this.config.timeout}ms`);
          }
        }

        lastError = error instanceof Error ? error : new Error(String(error));

        // Retry on network errors or server errors (5xx)
        if (attempt < this.config.retries) {
          const delay = this.config.retryDelay * (attempt + 1);
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

    try {
      const errorData: ApiErrorResponse = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error.message || errorMessage;
        errorDetails = errorData.error.details;
      }
    } catch {
      // If response is not JSON, use status text
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
    timeout: 30000,
    retries: 0, // Disable retries by default (can be enabled per request if needed)
    retryDelay: 1000,
  });
}

