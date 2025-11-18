# Frontend API Fix Checklist - Quick Action Items

## 🎯 Priority Order

### ✅ Fix 1: Connect Filters to API (HIGHEST PRIORITY)

**What to do:**
1. Find where `/api/properties` is called
2. Build query parameters from filter state
3. Include all active filters in the request URL

**Code location to check:**
- [ ] Find API call function (e.g., `fetchProperties`, `useProperties` hook)
- [ ] Locate filter state management
- [ ] Add query parameter building logic

**Quick test:**
```javascript
// After fix, check Network tab:
// Should see: ?city=Toronto&minPrice=500000&maxPrice=1000000
```

**Expected result:**
- Filter changes trigger API calls
- Query parameters visible in Network tab
- Results update based on filters

---

### ✅ Fix 2: Connect Sorting to API

**What to do:**
1. Find sort dropdown component
2. Ensure `sortBy` state is passed to API call
3. Include `sortBy` in query parameters

**Code location to check:**
- [ ] Find sort dropdown component
- [ ] Locate `sortBy` state
- [ ] Verify it's included in API call

**Quick test:**
```javascript
// After fix, check Network tab:
// Should see: ?sortBy=price_desc (or newest, oldest, etc.)
```

**Expected result:**
- Changing sort dropdown updates API request
- Results are actually sorted differently
- `sortBy` parameter visible in Network tab

---

### ✅ Fix 3: Connect Search to Properties List

**What to do:**
1. Find search input component
2. Add `searchTerm` to filter state
3. Include `searchTerm` in `/api/properties` query parameters

**Code location to check:**
- [ ] Find search bar/input component
- [ ] Locate search state management
- [ ] Verify `searchTerm` is sent to `/api/properties` (not just `/api/search`)

**Quick test:**
```javascript
// After fix, check Network tab:
// Should see: ?searchTerm=toronto
```

**Expected result:**
- Typing in search and applying it updates properties list
- `searchTerm` parameter visible in Network tab
- Results filtered by search term

---

### ✅ Fix 4: Implement Map Endpoint

**What to do:**
1. Find map component (if exists)
2. Create hook/function to call `/api/properties/map`
3. Format map bounds as JSON string
4. Call endpoint when map bounds change

**Code location to check:**
- [ ] Find map view component
- [ ] Locate map bounds state/events
- [ ] Create API call function for map endpoint

**Quick test:**
```javascript
// After fix, check Network tab:
// Should see requests to: /api/properties/map?bounds={...}
```

**Expected result:**
- Map view loads properties
- Panning/zooming triggers new API calls
- Markers appear on map

---

## 🔍 Verification Steps

### Step 1: Check Current Implementation

**Open browser DevTools → Network tab:**

1. **Test Filters:**
   - Apply a filter (e.g., select city)
   - Look for `/api/properties` request
   - Check if filter appears in query string
   - ❌ **If not:** Filters not connected

2. **Test Sorting:**
   - Change sort dropdown
   - Look for `/api/properties` request
   - Check if `sortBy` parameter changes
   - ❌ **If not:** Sorting not connected

3. **Test Search:**
   - Type in search box and apply
   - Look for `/api/properties` request
   - Check if `searchTerm` parameter exists
   - ❌ **If not:** Search not connected

4. **Test Map:**
   - Switch to map view (if exists)
   - Look for `/api/properties/map` requests
   - Check if `bounds` parameter exists
   - ❌ **If not:** Map endpoint not used

---

### Step 2: Identify Code Locations

**Search your codebase for:**

```bash
# Find API calls
grep -r "/api/properties" src/
grep -r "fetch.*properties" src/
grep -r "useProperties" src/

# Find filter state
grep -r "filters" src/ | grep -i "state\|useState"
grep -r "FiltersState" src/

# Find sort state
grep -r "sortBy" src/
grep -r "sort" src/ | grep -i "state\|useState"

# Find search state
grep -r "searchTerm" src/
grep -r "search" src/ | grep -i "state\|useState"
```

---

### Step 3: Apply Fixes

**Follow the detailed guide in `FRONTEND_API_FIX_GUIDE.md`**

**Key points:**
1. Build query parameters from state
2. Include all active filters in API call
3. Reset pagination when filters change
4. Debounce search input
5. Format array parameters correctly (`?city=Toronto&city=Mississauga`)

---

## 📋 Quick Reference: Query Parameter Format

### Single Values
```
?page=1
?pageSize=12
?sortBy=newest
?minPrice=500000
?maxPrice=1000000
?status=buy
?searchTerm=toronto
```

### Array Values (Multiple Parameters)
```
?city=Toronto&city=Mississauga&city=Oakville
?propertyType=Detached&propertyType=Condo
```

### Boolean Values
```
?hasOpenHouse=true
?hasVirtualTour=true
```

### Complete Example
```
/api/properties?page=1&pageSize=12&sortBy=price_desc&city=Toronto&city=Mississauga&minPrice=500000&maxPrice=1000000&minBedrooms=3&status=buy&searchTerm=downtown
```

---

## ✅ Final Verification

**After all fixes, verify:**

1. **Network Tab Shows All Parameters:**
   - [ ] Filters appear in query string
   - [ ] `sortBy` parameter present
   - [ ] `searchTerm` parameter present (when searching)
   - [ ] Map requests include `bounds` parameter (if map exists)

2. **Functionality Works:**
   - [ ] Changing filters updates results
   - [ ] Changing sort updates results
   - [ ] Searching updates results
   - [ ] Map shows properties (if map exists)

3. **No Errors:**
   - [ ] No console errors
   - [ ] No CORS errors
   - [ ] No 404/500 errors

---

## 🚨 Red Flags

**If you see these, the fixes aren't working:**

- ❌ API calls don't include query parameters
- ❌ Changing filters doesn't trigger new API calls
- ❌ Results don't change when filters/sort/search change
- ❌ Network tab shows requests without parameters
- ❌ Map view doesn't load properties

---

## 📞 Quick Debug Commands

**Run in browser console to test:**

```javascript
// Test 1: Check if filters are being sent
// Apply a filter, then run:
console.log('Current URL:', window.location.href);
// Or check Network tab for the request URL

// Test 2: Manually test API with filters
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
fetch(`${apiUrl}/api/properties?city=Toronto&minPrice=500000&sortBy=price_desc`)
  .then(r => r.json())
  .then(data => {
    console.log('✅ API works with filters:', data.properties.length, 'properties');
  })
  .catch(err => console.error('❌ API error:', err));

// Test 3: Check environment variable
console.log('API URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
```

---

**Priority: Start with Fix 1 (Filters), then Fix 2 (Sorting), then Fix 3 (Search), then Fix 4 (Map).**

**Estimated time: 2-4 hours for all fixes**

