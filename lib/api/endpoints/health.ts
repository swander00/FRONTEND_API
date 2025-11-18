/**
 * Health & Metrics API Endpoints
 * 
 * System health and monitoring endpoints
 */

import { HttpClient } from '../httpClient';
import { HealthResponse } from '../types';

export class HealthEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * GET /health
   * Health check endpoint with database connectivity check
   */
  async check(): Promise<HealthResponse> {
    return this.client.get<HealthResponse>('/health');
  }

  /**
   * GET /metrics
   * Prometheus-format metrics endpoint
   */
  async metrics(): Promise<string> {
    return this.client.get<string>('/metrics');
  }

  /**
   * GET /openapi.json
   * OpenAPI specification
   */
  async openApi(): Promise<unknown> {
    return this.client.get<unknown>('/openapi.json');
  }
}

