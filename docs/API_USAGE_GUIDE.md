# API Usage Guide - Current State

## ✅ Use These (Current/Recommended)

### For Property Data
```typescript
import { api } from '@/lib/api';

// Get property list
const response = await api.properties.list(filters, { page: 1, pageSize: 12 }, 'newest');

// Get property details
const property = await api.properties.getDetails(listingKey);

// Get map properties
const mapData = await api.properties.getMapProperties(filters, bounds);

// Search suggestions
const suggestions = await api.search.suggestions('toronto', 10);
```

### Using Hooks (Recommended)
```typescript
import { useProperties } from '@/hooks/useProperties';
import { usePropertyDetails } from '@/hooks/usePropertyDetails';
import { usePropertySearch } from '@/hooks/usePropertySearch';
import { useMapProperties } from '@/hooks/useMapProperties';

// All hooks are working and tested
```

## ⚠️ Legacy Functions (Still Work, But Deprecated)

These functions still work but are deprecated. New code should use the typed API client above.

```typescript
// Old way (still works, but deprecated)
import { apiGet, apiGetWithQueryString, API_ENDPOINTS } from '@/lib/api';

const data = await apiGet(API_ENDPOINTS.properties, { page: 1 });
```

**Why deprecated?**
- Less type-safe
- More error-prone
- Harder to maintain

**Migration:** Use `api.properties.list()` instead.

## 📝 Deprecated Fields

### `listingAge` Field
- **Status:** Deprecated but still present in responses
- **Reason:** Replaced with `originalEntryTimestamp` with status-specific prefixes
- **Action:** Use `originalEntryTimestamp` instead. `listingAge` is kept for backward compatibility only.

## 🎯 Best Practices

1. **Use hooks** - They handle loading states, errors, and caching
2. **Use typed API client** - Better TypeScript support and autocomplete
3. **Check types** - All types are in `@/lib/api/types`
4. **Handle errors** - All API calls can fail, always handle errors

## 📚 More Information

- **API Client Guide:** `docs/API_CLIENT_GUIDE.md`
- **API Endpoints:** `docs/API_ENDPOINTS_REFERENCE.md`
- **Integration Summary:** `docs/API_INTEGRATION_SUMMARY.md`

