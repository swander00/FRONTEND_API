# Backend API Endpoints Reference

Complete reference of all backend API endpoints, request/response formats, and usage examples.

## Base URL

- **Local Development:** `http://localhost:8080`
- **Production:** Set via `NEXT_PUBLIC_API_URL` environment variable

## Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check with database connectivity |
| GET | `/metrics` | Prometheus-format metrics |
| GET | `/openapi.json` | OpenAPI specification |
| GET | `/api/properties` | List properties with filters and pagination |
| GET | `/api/properties/:listingKey` | Get property details |
| GET | `/api/properties/map` | Get properties for map display |
| GET | `/api/search` | Property search suggestions |
| POST | `/trigger-sync` | Trigger data sync (admin) |
| POST | `/admin/cache-bust` | Clear cache (admin) |

---

## Health & System Endpoints

### GET `/health`

Health check endpoint with database connectivity verification.

**Response:**
```json
{
  "status": "ok" | "degraded",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "TRREB Sync Service",
  "checks": {
    "database": "ok" | "error" | "unknown",
    "databaseError": "optional error message"
  }
}
```

**Status Codes:**
- `200` - Service is healthy
- `503` - Service is degraded (database connection failed)

---

### GET `/metrics`

Prometheus-format metrics endpoint.

**Response:** Plain text (Prometheus format)

**Content-Type:** `text/plain; version=0.0.4`

---

### GET `/openapi.json`

OpenAPI specification endpoint.

**Response:** JSON OpenAPI 3.0 specification

---

## Properties Endpoints

### GET `/api/properties`

Get paginated list of properties with filters, sorting, and pagination.

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (min: 1, max: 10000) | `1` |
| `pageSize` | number | Items per page (min: 1, max: 100) | `12` |
| `sortBy` | string | Sort order: `newest`, `oldest`, `price_asc`, `price_desc`, `sqft_asc`, `sqft_desc` | `newest` |
| `city` | string[] | Filter by city (can be repeated) | `city=Toronto&city=Mississauga` |
| `propertyType` | string[] | Filter by property type (can be repeated) | `propertyType=House&propertyType=Condo` |
| `minPrice` | number | Minimum list price | `500000` |
| `maxPrice` | number | Maximum list price | `1000000` |
| `minBedrooms` | number | Minimum bedrooms (0-20) | `2` |
| `maxBedrooms` | number | Maximum bedrooms (0-20) | `4` |
| `minBathrooms` | number | Minimum bathrooms (0-20) | `2` |
| `maxBathrooms` | number | Maximum bathrooms (0-20) | `3` |
| `minSquareFeet` | number | Minimum square feet | `1000` |
| `maxSquareFeet` | number | Maximum square feet | `3000` |
| `status` | string | Property status | `buy`, `lease`, `sold` |
| `hasOpenHouse` | boolean | Has open house | `true` |
| `hasVirtualTour` | boolean | Has virtual tour | `true` |
| `minGarageSpaces` | number | Minimum garage spaces | `1` |
| `minTotalParking` | number | Minimum total parking | `2` |
| `searchTerm` | string | Full-text search (max 80 chars) | `toronto` |

**Response:**
```json
{
  "properties": [
    {
      "listingKey": "X12391175",
      "mlsNumber": "E123456",
      "fullAddress": "123 Main St, Toronto, ON",
      "city": "Toronto",
      "stateOrProvince": "ON",
      "status": "buy",
      "mlsStatus": "Active",
      "listPrice": 750000,
      "originalListPrice": 800000,
      "isPriceReduced": true,
      "priceReductionAmount": 50000,
      "bedroomsDisplay": "3",
      "bathroomsDisplay": "2",
      "livingAreaMin": 1500,
      "livingAreaMax": 1600,
      "propertyType": "House",
      "propertySubType": "Detached",
      "primaryImageUrl": "https://...",
      "mediaCount": 25,
      "hasVirtualTour": true,
      "hasOpenHouseToday": false,
      "hasOpenHouseTomorrow": true
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 12,
    "totalPages": 42,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "totalCount": 500
}
```

**Cache Headers:**
- `Cache-Control: public, max-age=30, s-maxage=30`

---

### GET `/api/properties/:listingKey`

Get full property details by listing key.

**Path Parameters:**
- `listingKey` (string, required) - Property listing key (alphanumeric, hyphens, underscores only)

**Response:**
```json
{
  "listingKey": "X12391175",
  "mlsNumber": "E123456",
  "mlsStatus": "Active",
  "transactionType": "For Sale",
  "fullAddress": "123 Main St, Toronto, ON M5H 2N2",
  "streetNumber": "123",
  "streetName": "Main",
  "streetSuffix": "St",
  "city": "Toronto",
  "stateOrProvince": "ON",
  "postalCode": "M5H 2N2",
  "latitude": 43.6532,
  "longitude": -79.3832,
  "listPrice": 750000,
  "originalListPrice": 800000,
  "priceReductionAmount": 50000,
  "priceReductionPercent": 6.25,
  "daysOnMarket": 45,
  "isNewListing": false,
  "modificationTimestamp": "2024-01-15T10:30:00.000Z",
  "viewCount": 1250,
  "saveCount": 45,
  "media": [
    {
      "id": "M123",
      "url": "https://...",
      "alt": "Front exterior",
      "order": 1,
      "caption": "Front exterior view"
    }
  ],
  "primaryImageUrl": "https://...",
  "mediaCount": 25,
  "hasVirtualTour": true,
  "virtualTourUrl": "https://...",
  "bedroomsAboveGrade": 3,
  "bedroomsBelowGrade": 1,
  "bedroomsDisplay": "3+1",
  "bathroomsDisplay": "2",
  "bathroomsTotalInteger": 2,
  "livingAreaMin": 1500,
  "livingAreaMax": 1600,
  "propertyType": "House",
  "propertySubType": "Detached",
  "publicRemarks": "Beautiful home in prime location...",
  "rooms": {
    "summary": {
      "totalBedrooms": 4,
      "totalBathrooms": 2,
      "squareFootage": 1600,
      "roomCount": 8
    },
    "rooms": [
      {
        "id": "R123",
        "roomType": "Living Room",
        "level": "Main",
        "dimensions": "15x12",
        "features": ["Fireplace", "Hardwood"]
      }
    ]
  },
  "interiorFeatures": "Hardwood, Granite Countertops",
  "exteriorFeatures": "Deck, Patio, Garden",
  "cooling": "Central Air",
  "heatType": "Forced Air",
  "sewer": "Public",
  "associationFee": 0,
  "parkingTotal": 2,
  "garageSpaces": 2,
  "openHouseDisplay": "Sat, Jan 20, 2:00 PM - 4:00 PM"
}
```

**Cache Headers:**
- `Cache-Control: public, max-age=60, must-revalidate`
- `ETag: W/"base64-encoded-hash"`
- `Last-Modified: <timestamp>`

**Conditional Requests:**
- Supports `If-None-Match` (ETag) and `If-Modified-Since` headers
- Returns `304 Not Modified` if content unchanged

---

### GET `/api/properties/map`

Get properties for map display with bounds filtering.

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `bounds` | JSON string | Map bounds `{northEast: {lat, lng}, southWest: {lat, lng}}` | `{"northEast":{"lat":43.7,"lng":-79.3},"southWest":{"lat":43.6,"lng":-79.5}}` |
| `status` | string | Property status filter | `buy` |
| `minPrice` | number | Minimum price | `500000` |
| `maxPrice` | number | Maximum price | `1000000` |

**Response:**
```json
{
  "properties": [
    {
      "listingKey": "X12391175",
      "status": "buy",
      "propertySubType": "Detached",
      "fullAddress": "123 Main St, Toronto, ON",
      "city": "Toronto",
      "stateOrProvince": "ON",
      "coordinates": {
        "latitude": 43.6532,
        "longitude": -79.3832
      },
      "primaryImageUrl": "https://...",
      "listPrice": 750000,
      "listedAt": "2024-01-01T00:00:00.000Z",
      "bedroomsDisplay": "3",
      "bathroomsDisplay": "2",
      "parkingTotal": 2,
      "livingAreaMin": 1500,
      "livingAreaMax": 1600
    }
  ]
}
```

**Cache Headers:**
- `Cache-Control: public, max-age=30, s-maxage=30`

**Note:** Map bounds are required for meaningful results. Without bounds, returns all properties (up to 500 limit).

---

## Search Endpoints

### GET `/api/search`

Get property suggestions for autocomplete/search.

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `q` | string | Search query (max 100 chars, sanitized) | `toronto` |
| `limit` | number | Max results (min: 1, max: 50, default: 10) | `10` |

**Response:**
```json
{
  "listings": [
    {
      "listingKey": "X12391175",
      "mlsNumber": "E123456",
      "fullAddress": "123 Main St, Toronto, ON",
      "city": "Toronto",
      "stateOrProvince": "ON",
      "status": "buy",
      "mlsStatus": "Active",
      "listPrice": 750000,
      "isPriceReduced": true,
      "bedroomsAboveGrade": 3,
      "bathroomsTotalInteger": 2,
      "livingAreaMin": 1500,
      "propertySubType": "Detached",
      "primaryImageUrl": "https://..."
    }
  ],
  "meta": {
    "totalCount": 10,
    "query": "toronto"
  }
}
```

**Empty Query:**
If `q` is empty or missing, returns:
```json
{
  "listings": [],
  "meta": {
    "totalCount": 0,
    "query": ""
  }
}
```

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "error": {
    "code": 400,
    "message": "Invalid listing key format",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req-123456",
    "details": {
      "field": "listingKey",
      "value": "invalid-key!"
    }
  }
}
```

**Common Status Codes:**
- `400` - Bad Request (validation error)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error
- `503` - Service Unavailable (database connection failed)

---

## Rate Limiting

- Global rate limit: 120 requests per minute per IP
- Configured via `RATE_LIMIT_*` environment variables
- Rate limit headers included in responses (if configured)

---

## CORS

CORS is configured via `ALLOWED_ORIGINS` environment variable (comma-separated).

**Allowed Methods:** `GET`, `POST`, `OPTIONS`

**Allowed Headers:** `Content-Type`, `Authorization`

---

## Admin Endpoints

### POST `/trigger-sync`

Trigger data sync operation (admin only).

**Request Body:**
```json
{
  "type": "IDX" | "VOW" | "ALL",
  "reset": false,
  "limit": null
}
```

**Response:**
```json
{
  "success": true,
  "message": "IDX sync triggered",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### POST `/admin/cache-bust`

Clear in-memory caches (admin only).

**Headers:**
- `x-admin-token` or `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "In-memory caches cleared"
}
```

---

## Best Practices

1. **Use pagination** - Don't fetch all properties at once
2. **Respect cache headers** - Cache responses appropriately
3. **Use filters efficiently** - Combine filters to reduce result sets
4. **Handle errors gracefully** - Check status codes and error responses
5. **Use conditional requests** - Include ETag/If-Modified-Since for property details
6. **Rate limiting** - Implement client-side rate limiting if needed

---

## Testing

### Health Check
```bash
curl http://localhost:8080/health
```

### Get Properties
```bash
curl "http://localhost:8080/api/properties?city=Toronto&minPrice=500000&page=1&pageSize=12"
```

### Get Property Details
```bash
curl http://localhost:8080/api/properties/X12391175
```

### Search
```bash
curl "http://localhost:8080/api/search?q=toronto&limit=10"
```

