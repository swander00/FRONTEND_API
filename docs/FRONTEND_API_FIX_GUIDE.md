# Frontend API Integration Fix Guide

## 🎯 Objective

Fix the critical gaps in API integration: connect filters, sorting, search, and map endpoints to the backend API.

---

## 📋 Issues to Fix

1. ✅ **Filters not connected** - Filters stored but never sent to `/api/properties`
2. ✅ **Sorting not connected** - Sort dropdown doesn't affect API calls
3. ✅ **Search query not applied** - Search state not used in properties list API
4. ✅ **Map endpoint not used** - `/api/properties/map` never called

---

## 🔧 Fix 1: Connect Filters to API

### Problem
Filters are stored in state but not included in API request query parameters.

### Solution
Build query parameters from filter state and include them in the API call.

### Implementation

#### Step 1: Create Query Parameter Builder Function

```typescript
// utils/apiHelpers.ts or similar

/**
 * Builds query parameters from filter state for /api/properties endpoint
 */
export function buildPropertiesQueryParams(filters: FiltersState, pagination: PaginationState, sortBy: string) {
  const params = new URLSearchParams();

  // Pagination
  if (pagination.page) {
    params.append('page', pagination.page.toString());
  }
  if (pagination.pageSize) {
    params.append('pageSize', pagination.pageSize.toString());
  }

  // Sorting
  if (sortBy) {
    params.append('sortBy', sortBy);
  }

  // Array parameters (city, propertyType) - use multiple params
  if (filters.cities && filters.cities.length > 0) {
    filters.cities.forEach(city => {
      params.append('city', city);
    });
  }

  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    filters.propertyTypes.forEach(type => {
      params.append('propertyType', type);
    });
  }

  // Price range
  if (filters.minPrice) {
    params.append('minPrice', filters.minPrice.toString());
  }
  if (filters.maxPrice) {
    params.append('maxPrice', filters.maxPrice.toString());
  }

  // Bedrooms
  if (filters.minBedrooms) {
    params.append('minBedrooms', filters.minBedrooms.toString());
  }
  if (filters.maxBedrooms) {
    params.append('maxBedrooms', filters.maxBedrooms.toString());
  }

  // Bathrooms
  if (filters.minBathrooms) {
    params.append('minBathrooms', filters.minBathrooms.toString());
  }
  if (filters.maxBathrooms) {
    params.append('maxBathrooms', filters.maxBathrooms.toString());
  }

  // Square footage
  if (filters.minSquareFeet) {
    params.append('minSquareFeet', filters.minSquareFeet.toString());
  }
  if (filters.maxSquareFeet) {
    params.append('maxSquareFeet', filters.maxSquareFeet.toString());
  }

  // Status
  if (filters.status) {
    params.append('status', filters.status);
  }

  // Boolean filters
  if (filters.hasOpenHouse === true) {
    params.append('hasOpenHouse', 'true');
  }
  if (filters.hasVirtualTour === true) {
    params.append('hasVirtualTour', 'true');
  }

  // Garage/Parking
  if (filters.minGarageSpaces) {
    params.append('minGarageSpaces', filters.minGarageSpaces.toString());
  }
  if (filters.minTotalParking) {
    params.append('minTotalParking', filters.minTotalParking.toString());
  }

  // Search term
  if (filters.searchTerm && filters.searchTerm.trim()) {
    params.append('searchTerm', filters.searchTerm.trim());
  }

  return params.toString();
}
```

#### Step 2: Update API Call to Use Filters

```typescript
// hooks/useProperties.ts or similar

import { buildPropertiesQueryParams } from '@/utils/apiHelpers';

export function useProperties(filters: FiltersState, pagination: PaginationState, sortBy: string) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query string from filters
      const queryString = buildPropertiesQueryParams(filters, pagination, sortBy);
      
      // Get API base URL from environment
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://apibackend-production-696e.up.railway.app';
      
      // Make API call with all parameters
      const response = await fetch(`${apiUrl}/api/properties?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setProperties(data.properties || []);
      // Also update pagination info if needed
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination, sortBy]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, refetch: fetchProperties };
}
```

#### Step 3: Ensure Filters Trigger API Calls

```typescript
// components/PropertyList.tsx or similar

export function PropertyList() {
  const [filters, setFilters] = useState<FiltersState>({
    cities: [],
    propertyTypes: [],
    minPrice: null,
    maxPrice: null,
    // ... other filters
  });
  
  const [pagination, setPagination] = useState({ page: 1, pageSize: 12 });
  const [sortBy, setSortBy] = useState('newest');

  // This hook should automatically refetch when filters change
  const { properties, loading, error } = useProperties(filters, pagination, sortBy);

  const handleFilterChange = (newFilters: Partial<FiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reset to page 1 when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div>
      <Filters 
        filters={filters} 
        onChange={handleFilterChange} 
      />
      {/* Rest of component */}
    </div>
  );
}
```

---

## 🔧 Fix 2: Connect Sorting to API

### Problem
Sort dropdown exists but `sortBy` parameter is not sent to API.

### Solution
Include `sortBy` in the query parameters and update API call when sort changes.

### Implementation

```typescript
// components/SortDropdown.tsx

export function SortDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'sqft_asc', label: 'Square Feet: Low to High' },
    { value: 'sqft_desc', label: 'Square Feet: High to Low' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value;
    onChange(newSortBy); // This should trigger API refetch
  };

  return (
    <select value={value} onChange={handleChange}>
      {sortOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
```

```typescript
// In your PropertyList component

const [sortBy, setSortBy] = useState('newest');

// When sortBy changes, it should trigger useProperties to refetch
// Make sure useProperties has sortBy in its dependency array
const { properties, loading } = useProperties(filters, pagination, sortBy);

const handleSortChange = (newSortBy: string) => {
  setSortBy(newSortBy);
  // Optionally reset to page 1 when sorting changes
  setPagination(prev => ({ ...prev, page: 1 }));
};

return (
  <div>
    <SortDropdown value={sortBy} onChange={handleSortChange} />
    {/* Rest of component */}
  </div>
);
```

**Verify:** Check Network tab - when you change sort dropdown, you should see `sortBy` parameter in the API request URL.

---

## 🔧 Fix 3: Connect Search to Properties List

### Problem
Search state exists but `searchTerm` is not included in properties list API call.

### Solution
Include `searchTerm` in query parameters when user performs a search.

### Implementation

#### Option A: Search triggers properties list update

```typescript
// components/SearchBar.tsx

export function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Trigger search when debounced term changes
  useEffect(() => {
    if (debouncedTerm.trim()) {
      onSearch(debouncedTerm.trim());
    } else {
      onSearch(''); // Clear search
    }
  }, [debouncedTerm, onSearch]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search properties..."
    />
  );
}
```

```typescript
// In PropertyList component

const [filters, setFilters] = useState<FiltersState>({
  searchTerm: '', // Add searchTerm to filters
  // ... other filters
});

const handleSearch = (term: string) => {
  setFilters(prev => ({ ...prev, searchTerm: term }));
  setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
};

return (
  <div>
    <SearchBar onSearch={handleSearch} />
    {/* Rest of component */}
  </div>
);
```

#### Option B: Separate search endpoint (for autocomplete) + apply to filters

```typescript
// If you're using /api/search for autocomplete, also apply to main list

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { onSearchApply } = usePropertyList(); // Your main list hook

  // Debounced autocomplete
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${apiUrl}/api/search?q=${encodeURIComponent(searchTerm)}&limit=10`);
      const data = await response.json();
      setSuggestions(data.listings || []);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchSubmit = () => {
    // Apply search term to main properties list
    onSearchApply(searchTerm);
  };

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
      />
      {/* Show suggestions dropdown */}
      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map(property => (
            <div key={property.listingKey}>{property.fullAddress}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Verify:** When you type in search and submit/apply, check Network tab - you should see `searchTerm` parameter in the `/api/properties` request.

---

## 🔧 Fix 4: Implement Map Endpoint

### Problem
`/api/properties/map` endpoint exists but is never called.

### Solution
Call the map endpoint when map view is active and bounds change.

### Implementation

```typescript
// hooks/useMapProperties.ts

export function useMapProperties(
  bounds: MapBounds | null,
  filters: Partial<FiltersState>
) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMapProperties = useCallback(async () => {
    if (!bounds) {
      setProperties([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://apibackend-production-696e.up.railway.app';
      const params = new URLSearchParams();

      // Format bounds as JSON string
      const boundsJson = JSON.stringify({
        northEast: {
          lat: bounds.northEast.lat,
          lng: bounds.northEast.lng
        },
        southWest: {
          lat: bounds.southWest.lat,
          lng: bounds.southWest.lng
        }
      });
      params.append('bounds', boundsJson);

      // Add optional filters
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.minPrice) {
        params.append('minPrice', filters.minPrice.toString());
      }
      if (filters.maxPrice) {
        params.append('maxPrice', filters.maxPrice.toString());
      }

      const response = await fetch(`${apiUrl}/api/properties/map?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Map API error: ${response.status}`);
      }

      const data = await response.json();
      setProperties(data.properties || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching map properties:', err);
    } finally {
      setLoading(false);
    }
  }, [bounds, filters]);

  useEffect(() => {
    fetchMapProperties();
  }, [fetchMapProperties]);

  return { properties, loading, error, refetch: fetchMapProperties };
}
```

```typescript
// components/PropertyMap.tsx (example with Google Maps)

import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { useMapProperties } from '@/hooks/useMapProperties';

export function PropertyMap({ filters }: { filters: Partial<FiltersState> }) {
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const { properties, loading } = useMapProperties(mapBounds, filters);

  const handleBoundsChanged = () => {
    const map = mapRef.current;
    if (!map) return;

    const bounds = map.getBounds();
    if (!bounds) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    setMapBounds({
      northEast: { lat: ne.lat(), lng: ne.lng() },
      southWest: { lat: sw.lat(), lng: sw.lng() }
    });
  };

  return (
    <GoogleMap
      onBoundsChanged={handleBoundsChanged}
      onDragEnd={handleBoundsChanged}
      onZoomChanged={handleBoundsChanged}
    >
      {properties.map(property => (
        <Marker
          key={property.listingKey}
          position={{
            lat: property.coordinates.latitude,
            lng: property.coordinates.longitude
          }}
          title={property.fullAddress}
        />
      ))}
    </GoogleMap>
  );
}
```

**Verify:** When map view is active and you pan/zoom, check Network tab - you should see requests to `/api/properties/map` with `bounds` parameter.

---

## ✅ Complete Integration Example

Here's a complete example showing all fixes together:

```typescript
// hooks/usePropertyList.ts

import { useState, useEffect, useCallback } from 'react';

interface FiltersState {
  cities?: string[];
  propertyTypes?: string[];
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  status?: string;
  hasOpenHouse?: boolean;
  hasVirtualTour?: boolean;
  minSquareFeet?: number;
  maxSquareFeet?: number;
  minGarageSpaces?: number;
  minTotalParking?: number;
  searchTerm?: string;
}

interface PaginationState {
  page: number;
  pageSize: number;
}

export function usePropertyList() {
  const [filters, setFilters] = useState<FiltersState>({});
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 12 });
  const [sortBy, setSortBy] = useState('newest');
  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://apibackend-production-696e.up.railway.app';
      const params = new URLSearchParams();

      // Pagination
      params.append('page', pagination.page.toString());
      params.append('pageSize', pagination.pageSize.toString());

      // Sorting
      params.append('sortBy', sortBy);

      // Array parameters
      filters.cities?.forEach(city => params.append('city', city));
      filters.propertyTypes?.forEach(type => params.append('propertyType', type));

      // Price
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

      // Bedrooms
      if (filters.minBedrooms) params.append('minBedrooms', filters.minBedrooms.toString());
      if (filters.maxBedrooms) params.append('maxBedrooms', filters.maxBedrooms.toString());

      // Bathrooms
      if (filters.minBathrooms) params.append('minBathrooms', filters.minBathrooms.toString());
      if (filters.maxBathrooms) params.append('maxBathrooms', filters.maxBathrooms.toString());

      // Square feet
      if (filters.minSquareFeet) params.append('minSquareFeet', filters.minSquareFeet.toString());
      if (filters.maxSquareFeet) params.append('maxSquareFeet', filters.maxSquareFeet.toString());

      // Status
      if (filters.status) params.append('status', filters.status);

      // Boolean filters
      if (filters.hasOpenHouse === true) params.append('hasOpenHouse', 'true');
      if (filters.hasVirtualTour === true) params.append('hasVirtualTour', 'true');

      // Parking
      if (filters.minGarageSpaces) params.append('minGarageSpaces', filters.minGarageSpaces.toString());
      if (filters.minTotalParking) params.append('minTotalParking', filters.minTotalParking.toString());

      // Search term - CRITICAL FIX
      if (filters.searchTerm && filters.searchTerm.trim()) {
        params.append('searchTerm', filters.searchTerm.trim());
      }

      const response = await fetch(`${apiUrl}/api/properties?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setProperties(data.properties || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination, sortBy]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    totalCount,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    setPagination,
    sortBy,
    setSortBy,
    refetch: fetchProperties
  };
}
```

```typescript
// components/PropertyListPage.tsx

import { usePropertyList } from '@/hooks/usePropertyList';

export function PropertyListPage() {
  const {
    properties,
    totalCount,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    setPagination,
    sortBy,
    setSortBy
  } = usePropertyList();

  const handleFilterChange = (newFilters: Partial<FiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
  };

  const handleSearch = (searchTerm: string) => {
    handleFilterChange({ searchTerm });
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <Filters filters={filters} onChange={handleFilterChange} />
      <SortDropdown value={sortBy} onChange={handleSortChange} />
      
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      
      <div>
        <p>Found {totalCount} properties</p>
        {properties.map(property => (
          <PropertyCard key={property.listingKey} property={property} />
        ))}
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={Math.ceil(totalCount / pagination.pageSize)}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      />
    </div>
  );
}
```

---

## 🧪 Testing Checklist

After implementing fixes, verify:

### Filters
- [ ] Select city filter → Check Network tab → See `city` parameter in URL
- [ ] Set price range → Check Network tab → See `minPrice` and `maxPrice` parameters
- [ ] Select property type → Check Network tab → See `propertyType` parameter
- [ ] Apply multiple filters → All appear in API request URL

### Sorting
- [ ] Change sort dropdown → Check Network tab → See `sortBy` parameter changes
- [ ] Verify results actually change based on sort selection

### Search
- [ ] Type in search box → Check Network tab → See `searchTerm` parameter
- [ ] Verify search results match the search term
- [ ] Clear search → `searchTerm` parameter removed from URL

### Map
- [ ] Switch to map view → Check Network tab → See requests to `/api/properties/map`
- [ ] Pan map → New requests with updated `bounds` parameter
- [ ] Zoom map → New requests with updated `bounds` parameter
- [ ] Verify markers appear on map

---

## 🚨 Common Pitfalls

1. **Array parameters not formatted correctly**
   - ❌ Wrong: `?city=Toronto,Mississauga`
   - ✅ Correct: `?city=Toronto&city=Mississauga`

2. **Not resetting pagination when filters change**
   - Always reset to page 1 when filters/sort/search changes

3. **Not debouncing search**
   - Search should be debounced (300-500ms) to avoid excessive API calls

4. **Not handling empty/null values**
   - Don't include parameters with null/undefined/empty values

5. **Map bounds not updating on pan/zoom**
   - Ensure map library events trigger bounds updates

---

## 📞 Need Help?

If you encounter issues:

1. **Check Network Tab:**
   - Verify query parameters are in the request URL
   - Check response status codes
   - Inspect response data

2. **Check Console:**
   - Look for JavaScript errors
   - Verify API URL is correct
   - Check for CORS errors

3. **Test API Directly:**
   - Test endpoints in browser or Postman
   - Verify backend is returning expected data

4. **Review Backend Logs:**
   - Check Railway logs for API errors
   - Verify parameters are being received correctly

---

**After implementing these fixes, all four critical issues should be resolved! 🎉**

