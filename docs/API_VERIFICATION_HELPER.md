# API Integration Verification Helper

This document helps verify that all API fixes are working correctly.

## Quick Verification Steps

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Open Browser DevTools

1. Open Chrome/Edge DevTools (F12)
2. Go to **Network** tab
3. Filter by "Fetch/XHR" to see only API requests
4. Clear the network log

### 3. Test Fix 1: Filters

**Steps:**
1. Navigate to `/search` page
2. Apply a filter (e.g., select a city from the City filter)
3. Look for a request to `/api/properties` in the Network tab
4. Click on the request to see details
5. Check the **Query String Parameters** or **Payload** tab

**Expected Result:**
- ✅ Request URL should include the filter, e.g.:
  ```
  /api/properties?page=1&pageSize=24&city=Toronto&status=buy
  ```
- ❌ If you see `/api/properties?page=1&pageSize=24` only, filters are NOT connected

**Test Multiple Filters:**
- Apply price range filter
- Apply property type filter
- Apply multiple cities
- Check that all appear in the query string

### 4. Test Fix 2: Sorting

**Steps:**
1. Change the sort dropdown (e.g., from "Newest" to "Price: High to Low")
2. Look for a new request to `/api/properties`
3. Check the query string

**Expected Result:**
- ✅ Request URL should include `sortBy`, e.g.:
  ```
  /api/properties?page=1&pageSize=24&sortBy=price_desc
  ```
- ❌ If `sortBy` is missing, sorting is NOT connected

**Test Different Sort Options:**
- Try all sort options
- Verify `sortBy` parameter changes accordingly

### 5. Test Fix 3: Search

**Steps:**
1. Type in the search box (e.g., "toronto")
2. Click the search button (magnifying glass icon) or press Enter
3. Look for a request to `/api/properties`
4. Check the query string

**Expected Result:**
- ✅ Request URL should include `searchTerm`, e.g.:
  ```
  /api/properties?page=1&pageSize=24&searchTerm=toronto
  ```
- ❌ If `searchTerm` is missing, search is NOT connected

**Note:** The search is applied when you click the search button or select a suggestion. Typing alone won't trigger the properties list update (this is correct behavior to avoid excessive API calls).

### 6. Test Fix 4: Map Endpoint

**Steps:**
1. Switch to "Map" view using the view toggle
2. Look for a request to `/api/properties/map` in the Network tab
3. Check the query string

**Expected Result:**
- ✅ Request URL should include `bounds` parameter, e.g.:
  ```
  /api/properties/map?bounds={"northEast":{"lat":43.8,"lng":-79.2},"southWest":{"lat":43.6,"lng":-79.5}}&status=buy
  ```
- ❌ If you see `/api/properties` instead of `/api/properties/map`, map endpoint is NOT being used
- ❌ If `bounds` parameter is missing, bounds are NOT being sent

**Note:** Since MapView is currently a mock, bounds are calculated from properties. When a real map library is integrated, bounds will update on pan/zoom.

## Browser Console Test Script

Run this in the browser console to test the API directly:

```javascript
// Get API URL
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://apibackend-production-696e.up.railway.app';
console.log('API URL:', apiUrl);

// Test 1: Basic request with filters
console.log('\n=== Test 1: Filters ===');
fetch(`${apiUrl}/api/properties?page=1&pageSize=12&city=Toronto&city=Mississauga&minPrice=500000&maxPrice=1000000&status=buy`)
  .then(r => r.json())
  .then(data => {
    console.log('✅ Filters work:', data.properties?.length, 'properties');
  })
  .catch(err => console.error('❌ Filters error:', err));

// Test 2: Sorting
console.log('\n=== Test 2: Sorting ===');
fetch(`${apiUrl}/api/properties?page=1&pageSize=12&sortBy=price_desc`)
  .then(r => r.json())
  .then(data => {
    console.log('✅ Sorting works:', data.properties?.length, 'properties');
    if (data.properties?.length > 0) {
      console.log('First property price:', data.properties[0].price);
    }
  })
  .catch(err => console.error('❌ Sorting error:', err));

// Test 3: Search
console.log('\n=== Test 3: Search ===');
fetch(`${apiUrl}/api/properties?page=1&pageSize=12&searchTerm=toronto`)
  .then(r => r.json())
  .then(data => {
    console.log('✅ Search works:', data.properties?.length, 'properties');
  })
  .catch(err => console.error('❌ Search error:', err));

// Test 4: Map endpoint
console.log('\n=== Test 4: Map Endpoint ===');
const bounds = JSON.stringify({
  northEast: { lat: 43.8, lng: -79.2 },
  southWest: { lat: 43.6, lng: -79.5 }
});
fetch(`${apiUrl}/api/properties/map?bounds=${encodeURIComponent(bounds)}&status=buy`)
  .then(r => r.json())
  .then(data => {
    console.log('✅ Map endpoint works:', data.properties?.length, 'properties');
  })
  .catch(err => console.error('❌ Map endpoint error:', err));

// Test 5: Combined filters
console.log('\n=== Test 5: Combined Filters ===');
fetch(`${apiUrl}/api/properties?page=1&pageSize=12&city=Toronto&minPrice=500000&maxPrice=1000000&minBedrooms=3&status=buy&sortBy=price_desc&searchTerm=downtown`)
  .then(r => r.json())
  .then(data => {
    console.log('✅ Combined filters work:', data.properties?.length, 'properties');
  })
  .catch(err => console.error('❌ Combined filters error:', err));
```

## Common Issues and Solutions

### Issue: Filters not appearing in query string

**Possible Causes:**
1. `filtersSnapshot` is null or not updating
2. `buildQueryString` function not being called
3. Filters state not being passed to `useProperties`

**Check:**
- Open React DevTools
- Check if `filtersSnapshot` state updates when filters change
- Check if `useProperties` hook receives the filters

### Issue: SortBy not appearing

**Possible Causes:**
1. `sortBy` state not updating
2. `sortBy` not passed to `useProperties`

**Check:**
- Verify `sortBy` state changes when dropdown changes
- Check `useProperties` hook receives `sortBy` parameter

### Issue: SearchTerm not appearing

**Possible Causes:**
1. `appliedSearchTerm` not updating when search is submitted
2. Search button not calling `onSearch` callback

**Check:**
- Verify `handleSearchSubmit` is called when search button is clicked
- Check if `appliedSearchTerm` state updates

### Issue: Map endpoint not called

**Possible Causes:**
1. `view` state not set to 'map'
2. `useMapProperties` hook not enabled
3. `mapBounds` is null

**Check:**
- Verify `view === 'map'` when in map view
- Check `useMapProperties` has `enabled: true`
- Verify `mapBounds` is set (defaults to Toronto area)

## Expected Network Request Patterns

### Grid View (Initial Load)
```
GET /api/properties?page=1&pageSize=24&sortBy=newest&status=buy
```

### Grid View (After Filter Applied)
```
GET /api/properties?page=1&pageSize=24&sortBy=newest&status=buy&city=Toronto&minPrice=500000&maxPrice=1000000
```

### Grid View (After Sort Change)
```
GET /api/properties?page=1&pageSize=24&sortBy=price_desc&status=buy&city=Toronto&minPrice=500000&maxPrice=1000000
```

### Grid View (After Search)
```
GET /api/properties?page=1&pageSize=24&sortBy=price_desc&status=buy&city=Toronto&minPrice=500000&maxPrice=1000000&searchTerm=toronto
```

### Map View
```
GET /api/properties/map?bounds={"northEast":{"lat":43.8,"lng":-79.2},"southWest":{"lat":43.6,"lng":-79.5}}&status=buy
```

## Verification Checklist

Use this checklist to verify all fixes:

- [ ] **Fix 1 (Filters):** Filters appear in `/api/properties` query string
- [ ] **Fix 2 (Sorting):** `sortBy` parameter appears and changes with sort selection
- [ ] **Fix 3 (Search):** `searchTerm` parameter appears in `/api/properties` when searching
- [ ] **Fix 4 (Map):** `/api/properties/map` is called with `bounds` parameter when in map view
- [ ] **Results Update:** Results actually change when filters/sort/search change
- [ ] **No Console Errors:** No JavaScript errors in console
- [ ] **No CORS Errors:** No CORS errors in Network tab
- [ ] **Pagination Resets:** Page resets to 1 when filters/sort/search change

## Status Report Template

```
Fix 1 (Filters): [PASS / FAIL]
Fix 2 (Sorting): [PASS / FAIL]
Fix 3 (Search): [PASS / FAIL]
Fix 4 (Map): [PASS / FAIL / N/A]

Overall: [COMPLETE / IN PROGRESS / BLOCKED]

Issues: [List any issues found]

Notes: [Any additional observations]
```

