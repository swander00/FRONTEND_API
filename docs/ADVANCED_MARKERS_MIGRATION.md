# Advanced Markers Migration Guide

## Overview

This project has been migrated from the deprecated `google.maps.Marker` to the new `google.maps.marker.AdvancedMarkerElement` class. This migration provides better performance, improved customization options, and ensures compatibility with future Google Maps API updates.

## Changes Made

### 1. MapView Component (`components/property/MapView/MapView.tsx`)
- ✅ Removed dependency on `Marker` component from `@react-google-maps/api`
- ✅ Implemented programmatic creation of `AdvancedMarkerElement` markers
- ✅ Added dynamic loading of the marker library using `google.maps.importLibrary("marker")`
- ✅ Migrated InfoWindows to use native Google Maps API instead of React component
- ✅ Maintained all existing functionality (hover effects, click handlers, custom styling)

### 2. PropertyLocationMap Component (`components/property/PropertyDetails/shared/PropertyLocationMap.tsx`)
- ✅ Migrated to use `AdvancedMarkerElement`
- ✅ Added marker library loading
- ✅ Updated to use `PinElement` for custom marker styling

### 3. Environment Configuration
- ✅ Updated `env.example` to include `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`
- ✅ Both components now require a Map ID for advanced markers

## Setup Requirements

### 1. Create a Map ID in Google Cloud Console

Advanced markers require a Map ID. Follow these steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Navigate to **Maps** → **Map Styles** → **Create Map ID**
3. Choose a map style (e.g., "Default" or "Satellite")
4. Copy the Map ID (it will look like: `abc123def456`)

### 2. Add Map ID to Environment Variables

Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your-map-id-here
```

**Note:** For testing purposes, you can use `"DEMO_MAP_ID"` as a fallback, but it's recommended to create your own Map ID for production use.

### 3. Verify API Key Permissions

Ensure your Google Maps API key has the following APIs enabled:
- ✅ Maps JavaScript API
- ✅ Maps JavaScript API (Advanced) - Required for AdvancedMarkerElement

## Key Differences from Legacy Markers

### Before (Legacy)
```typescript
<Marker
  position={coordinates}
  icon={markerIcon}
  title="Property"
/>
```

### After (Advanced)
```typescript
const pinElement = new google.maps.marker.PinElement({
  background: "#2563eb",
  borderColor: "#ffffff",
  scale: 1,
});

const marker = new google.maps.marker.AdvancedMarkerElement({
  map,
  position: coordinates,
  title: "Property",
  content: pinElement.element,
});
```

## Troubleshooting

### Map Not Showing

1. **Check Map ID**: Ensure `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` is set in your `.env.local`
2. **Verify API Key**: Confirm your API key is valid and has the correct permissions
3. **Check Console**: Look for errors in the browser console:
   - "Failed to load marker library" - API key or permissions issue
   - "AdvancedMarkerElement not available" - Marker library not loaded
4. **Map ID Format**: Ensure your Map ID doesn't have quotes or extra spaces

### Markers Not Appearing

1. **Library Loading**: Check browser console for marker library loading errors
2. **Map ID**: Advanced markers require a valid Map ID (not just "DEMO_MAP_ID" in production)
3. **Coordinates**: Verify that properties have valid coordinates

### Common Errors

**Error: "mapId is required for AdvancedMarkerElement"**
- Solution: Add `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` to your `.env.local` file

**Error: "AdvancedMarkerElement is not a constructor"**
- Solution: Ensure the marker library is loaded. Check that `libraries: ["marker"]` is included in `useLoadScript`

**Map shows but markers don't appear**
- Solution: Check browser console for errors. Verify Map ID is correct and API key has "Maps JavaScript API (Advanced)" enabled

## Benefits of Advanced Markers

1. **Better Performance**: Advanced markers use DOM elements instead of canvas, providing better performance
2. **More Customization**: Easier to style and customize markers with CSS
3. **Future-Proof**: Legacy markers are deprecated and will be removed in future API versions
4. **Better Accessibility**: Improved support for screen readers and keyboard navigation

## Additional Resources

- [Google Maps Advanced Markers Documentation](https://developers.google.com/maps/documentation/javascript/advanced-markers)
- [Creating Map IDs](https://developers.google.com/maps/documentation/javascript/get-map-id)
- [Migration Guide](https://developers.google.com/maps/documentation/javascript/advanced-markers/migration)

