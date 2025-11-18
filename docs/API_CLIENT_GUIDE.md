# API Client Integration Guide

## Overview

This document describes the complete API client implementation for the frontend, which provides a clean, typed interface to all backend endpoints.

## Architecture

The API client is organized into a modular structure:

```
lib/api/
├── index.ts              # Main entry point, exports `api` object
├── types.ts              # TypeScript interfaces for all request/response types
├── httpClient.ts         # Core HTTP client with error handling
└── endpoints/
    ├── properties.ts     # Property-related endpoints
    ├── search.ts         # Search/autocomplete endpoints
    └── health.ts         # Health check and metrics endpoints
```

## Quick Start

### Basic Usage

```typescript
import { api } from '@/lib/api';

// Get properties list
const result = await api.properties.list(
  { city: 'Toronto', minPrice: 500000 },
  { page: 1, pageSize: 12 },
  'newest'
);

// Get property details
const property = await api.properties.getDetails('X12391175');

// Search suggestions
const searchResults = await api.search.suggestions('toronto', 10);

// Health check
const health = await api.health.check();
```

## Environment Configuration

The API client uses the following environment variables (in order of precedence):

1. `NEXT_PUBLIC_API_URL` (recommended for new code)
2. `NEXT_PUBLIC_BACKEND_URL` (legacy, for backward compatibility)

**Local Development:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Production:**
```env
NEXT_PUBLIC_API_URL=https://your-production-backend-url.com
```

## API Endpoints Reference

### Properties Endpoints

#### `api.properties.list(filters?, pagination?, sortBy?)`

Get paginated list of properties with filters and sorting.

**Parameters:**
- `filters?: PropertyFilters` - Filter criteria (see types below)
- `pagination?: PaginationParams` - `{ page?: number, pageSize?: number }`
- `sortBy?: SortBy` - One of: `'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'sqft_asc' | 'sqft_desc'`

**Returns:** `Promise<PropertiesListResponse>`

**Example:**
```typescript
const result = await api.properties.list(
  {
    city: ['Toronto', 'Mississauga'],
    minPrice: 500000,
    maxPrice: 1000000,
    minBedrooms: 2,
    hasOpenHouse: true,
  },
  { page: 1, pageSize: 24 },
  'price_asc'
);

console.log(result.properties); // Array of PropertyCardResponse
console.log(result.pagination); // Pagination info
console.log(result.totalCount); // Total matching properties
```

#### `api.properties.getDetails(listingKey)`

Get full property details by listing key.

**Parameters:**
- `listingKey: string` - Property listing key

**Returns:** `Promise<PropertyDetailsResponse>`

**Example:**
```typescript
const property = await api.properties.getDetails('X12391175');
console.log(property.fullAddress);
console.log(property.media); // Array of media items
console.log(property.rooms); // Room details
```

#### `api.properties.getMapProperties(filters?, bounds?)`

Get properties for map display with bounds filtering.

**Parameters:**
- `filters?: PropertyFilters` - Basic filters (status, price range)
- `bounds?: MapBounds` - Map bounds `{ northEast: { lat, lng }, southWest: { lat, lng } }`

**Returns:** `Promise<MapPropertiesResponse>`

**Example:**
```typescript
const result = await api.properties.getMapProperties(
  { status: 'buy', minPrice: 500000 },
  {
    northEast: { lat: 43.7, lng: -79.3 },
    southWest: { lat: 43.6, lng: -79.5 },
  }
);
```

### Search Endpoints

#### `api.search.suggestions(query, limit?)`

Get property suggestions for autocomplete.

**Parameters:**
- `query: string` - Search query
- `limit?: number` - Max results (default: 10, max: 50)

**Returns:** `Promise<SearchResponse>`

**Example:**
```typescript
const results = await api.search.suggestions('toronto', 10);
console.log(results.listings); // Array of PropertySuggestionResponse
console.log(results.meta.query); // Sanitized query string
```

### Health Endpoints

#### `api.health.check()`

Health check with database connectivity.

**Returns:** `Promise<HealthResponse>`

**Example:**
```typescript
const health = await api.health.check();
console.log(health.status); // 'ok' | 'degraded'
console.log(health.checks.database); // 'ok' | 'error'
```

#### `api.health.metrics()`

Get Prometheus-format metrics.

**Returns:** `Promise<string>`

#### `api.health.openApi()`

Get OpenAPI specification.

**Returns:** `Promise<unknown>`

## Type Definitions

### PropertyFilters

```typescript
interface PropertyFilters {
  city?: string | string[];
  propertyType?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minSquareFeet?: number;
  maxSquareFeet?: number;
  status?: string;
  hasOpenHouse?: boolean;
  hasVirtualTour?: boolean;
  minGarageSpaces?: number;
  minTotalParking?: number;
  searchTerm?: string;
}
```

### PaginationParams

```typescript
interface PaginationParams {
  page?: number;      // Default: 1
  pageSize?: number; // Default: 12, max: 100
}
```

### SortBy

```typescript
type SortBy = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'sqft_asc' | 'sqft_desc';
```

## Error Handling

The API client automatically handles errors and throws typed errors:

```typescript
try {
  const property = await api.properties.getDetails('X12391175');
} catch (error) {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
    // Error object includes:
    // - message: Human-readable error message
    // - status: HTTP status code
    // - statusText: HTTP status text
    // - details: Additional error details (in development)
  }
}
```

## Backward Compatibility

The old API functions in `lib/api.ts` are still available but deprecated. They now use the new API client under the hood:

```typescript
// Old way (still works, but deprecated)
import { apiGet, API_ENDPOINTS } from '@/lib/api';
const data = await apiGet(API_ENDPOINTS.properties, { page: 1 });

// New way (recommended)
import { api } from '@/lib/api';
const data = await api.properties.list({}, { page: 1, pageSize: 12 });
```

## Migration Guide

### Step 1: Update Imports

**Before:**
```typescript
import { apiGet, API_ENDPOINTS } from '@/lib/api';
```

**After:**
```typescript
import { api } from '@/lib/api';
```

### Step 2: Update API Calls

**Properties List:**
```typescript
// Before
const data = await apiGet(API_ENDPOINTS.properties, {
  page: 1,
  pageSize: 12,
  city: 'Toronto',
});

// After
const data = await api.properties.list(
  { city: 'Toronto' },
  { page: 1, pageSize: 12 }
);
```

**Property Details:**
```typescript
// Before
const property = await apiGet(API_ENDPOINTS.propertyDetails('X12391175'));

// After
const property = await api.properties.getDetails('X12391175');
```

**Search:**
```typescript
// Before
const results = await apiGet(API_ENDPOINTS.search, { q: 'toronto', limit: 10 });

// After
const results = await api.search.suggestions('toronto', 10);
```

## Advanced Usage

### Custom HTTP Client

For advanced use cases, you can create a custom HTTP client:

```typescript
import { createHttpClient } from '@/lib/api';

const customClient = createHttpClient('https://custom-api-url.com', {
  timeout: 60000,
  retries: 3,
  retryDelay: 2000,
});
```

### Direct Endpoint Access

You can also use endpoint classes directly:

```typescript
import { PropertiesEndpoints, createHttpClient } from '@/lib/api';

const httpClient = createHttpClient('http://localhost:8080');
const propertiesApi = new PropertiesEndpoints(httpClient);

const result = await propertiesApi.list({ city: 'Toronto' });
```

## Testing

The API client is designed to be easily testable. You can mock the HTTP client:

```typescript
import { api } from '@/lib/api';

// Mock in tests
jest.mock('@/lib/api', () => ({
  api: {
    properties: {
      list: jest.fn().mockResolvedValue({ properties: [], totalCount: 0 }),
    },
  },
}));
```

## Best Practices

1. **Always use the typed API client** - It provides better type safety and IntelliSense
2. **Handle errors appropriately** - Wrap API calls in try-catch blocks
3. **Use pagination** - Don't fetch all properties at once
4. **Cache when appropriate** - The backend provides cache headers, respect them
5. **Use filters efficiently** - Combine multiple filters to reduce result sets

## Troubleshooting

### CORS Issues

If you encounter CORS errors in development, ensure:
1. Backend CORS is configured to allow your frontend origin
2. `NEXT_PUBLIC_API_URL` points to the correct backend URL
3. Backend is running and accessible

### Type Errors

If you see TypeScript errors:
1. Ensure you're importing types from `@/lib/api`
2. Check that your request/response shapes match the type definitions
3. Use type assertions only when necessary

### Network Errors

If requests fail:
1. Check backend is running: `curl http://localhost:8080/health`
2. Verify environment variables are set correctly
3. Check browser console for detailed error messages

