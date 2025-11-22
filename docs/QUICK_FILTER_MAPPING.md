# Quick Filter Mapping Documentation

This document explains how each quick filter maps to the Property View database fields and API filters.

## Quick Filter to Database Field Mapping

### 1. Property Type Filters
These filters map directly to the `PropertyType` field in `PropertyCardView`:

| Quick Filter | Database Value | API Parameter |
|-------------|---------------|---------------|
| `Detached` | `'Detached'` | `propertyType=Detached` |
| `Semi-Detached` | `'Semi-Detached'` | `propertyType=Semi-Detached` |
| `Townhouse` | `'Townhouse'` | `propertyType=Townhouse` |
| `Condo` | `'Condo Apartment'` | `propertyType=Condo Apartment` |
| `Duplex` | `'Duplex'` | `propertyType=Duplex` |
| `Cottage` | `'Cottage'` | `propertyType=Cottage` |

**Note:** The database normalizes `'Att/Row/Townhouse'` to `'Townhouse'`, so the Townhouse filter will match both.

### 2. Architectural Style Filters
These filters map to the `ArchitecturalStyle` field (stored as an array in the database):

| Quick Filter | Database Value | API Parameter |
|-------------|---------------|---------------|
| `3-Storey` | Contains `'3 Storey'` | `architecturalStyle=3 Storey` |
| `Bungalow` | Contains `'Bungalow'` | `architecturalStyle=Bungalow` |

**Implementation:** The frontend uses `HOUSE_STYLE_DISPLAY_TO_RAW` mapping to convert display names to raw database values before sending to the API.

### 3. Basement Features
These filters map to basement-related fields:

| Quick Filter | Database Field | Database Value | API Parameter |
|-------------|---------------|----------------|---------------|
| `+ Basement Apt` | `BasementKitchen` | `true` | `basementFeatures=Kitchen: Yes` |
| `Rental Basement` | `BasementRental` | `true` | `basementFeatures=Apartment` |

**Note:** The backend processes `basementFeatures` array and applies OR logic (any selected feature matches).

### 4. Property Features
These filters map to property feature fields:

| Quick Filter | Database Field | Database Value | API Parameter |
|-------------|---------------|----------------|---------------|
| `Swimming Pool` | `PoolFeatures` | `IS NOT NULL` | `hasSwimmingPool=true` |
| `Waterfront` | `WaterfrontYN` | `'Y'` | `waterfront=true` |

**Implementation:**
- Swimming Pool: Backend checks if `PoolFeatures` is not null
- Waterfront: Backend checks if `WaterfrontYN = 'Y'`

### 5. Parking
Maps to garage parking spaces:

| Quick Filter | Database Field | Database Value | API Parameter |
|-------------|---------------|----------------|---------------|
| `3+ Car Garage` | `GarageSpaces` | `>= 3` | `minGarageSpaces=3` |

### 6. Lot Size
Maps to lot dimensions:

| Quick Filter | Database Field | Database Value | API Parameter |
|-------------|---------------|----------------|---------------|
| `50ft+ Lots` | `LotWidth` | `>= 50` | `lotFrontage=50+ ft` |
| `2+ Acres` | `LotSizeAcres` | `>= 2` | ⚠️ **Not yet supported** |

**Note:** 
- `50ft+ Lots` sends `lotFrontage=50+ ft` which the backend parses to `LotWidth >= 50`
- `2+ Acres` requires backend support for `LotSizeAcres` filtering (currently not implemented)

### 7. Property Condition
Maps to property age:

| Quick Filter | Database Field | Database Value | API Parameter |
|-------------|---------------|----------------|---------------|
| `Fixer-Upper` | `PropertyAge` | `'20+'` | `propertyAge=20+` |

**Note:** This is an interpretation - "Fixer-Upper" typically means older properties (20+ years). The backend matches exact `PropertyAge` values.

## Implementation Flow

1. **User clicks quick filter** → `handleQuickToggle` in `FiltersContainer.tsx`
2. **Get filter update** → `getQuickFilterUpdate()` returns the filter state update
3. **Apply to state** → `applyQuickFilterToState()` merges with existing filters
4. **Dispatch actions** → Updates `FiltersState` via context dispatch
5. **Build query string** → `buildQueryString()` converts state to API parameters
6. **API call** → Backend receives parameters and applies filters to `PropertyCardView`

## Filter State Structure

Quick filters update the following `FiltersState` fields:

```typescript
{
  propertyTypes: string[];  // For property type filters
  advanced: {
    houseStyle: string[];           // For architectural style
    basementFeatures: string[];      // For basement features
    swimmingPool: 'Yes' | 'No' | null;
    waterfront: 'Yes' | 'No' | null;
    garageParking: { min: number | null; ... };
    lotFrontage: string | null;
    propertyAge: string | null;
  }
}
```

## Backend Filter Processing

The backend (`BACKEND_API/services/propertyQueries.js`) processes these filters:

- **Property Types**: Uses `.in('PropertyType', array)` for multi-select
- **Architectural Style**: Uses `.in('ArchitecturalStyle', array)` for multi-select
- **Basement Features**: Uses `.or()` with multiple conditions
- **Swimming Pool**: Uses `.not('PoolFeatures', 'is', null)` for true
- **Waterfront**: Uses `.eq('WaterfrontYN', 'Y')` for true
- **Garage Spaces**: Uses `.gte('GarageSpaces', min)` for minimum
- **Lot Frontage**: Parses string format (e.g., "50+ ft") and uses `.gte('LotWidth', 50)`
- **Property Age**: Uses `.eq('PropertyAge', value)` for exact match

## Notes

1. **Multiple Quick Filters**: Users can select multiple quick filters simultaneously. They are combined with AND logic (all selected filters must match).

2. **Integration with Advanced Filters**: Quick filters update the same filter state as advanced filters, so they work together seamlessly.

3. **Removing Quick Filters**: When a quick filter is removed, the corresponding filter state is cleared (set to null or removed from arrays).

4. **Lot Size Acres**: The `2+ Acres` filter is mapped but requires backend support. Currently, the backend doesn't filter by `LotSizeAcres` - this would need to be added to `propertyQueries.js`.

5. **Fixer-Upper Interpretation**: The "Fixer-Upper" filter maps to `PropertyAge = '20+'`, which is a reasonable interpretation but may not match all properties that could be considered "fixer-uppers".

