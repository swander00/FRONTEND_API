import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { PROPERTY_CLASS_OPTIONS } from '@/lib/filters/options';

export type StatusOption = 'For Sale' | 'For Lease' | 'Sold' | 'Leased' | 'Removed';

type TimeRangeOption =
  | 'All Time'
  | 'Today'
  | 'Last 7 Days'
  | 'Last 14 Days'
  | 'Last 30 Days'
  | 'Last 90 Days'
  | 'Custom Date Range';

type OpenHouseOption = 'All' | 'Today' | 'Tomorrow' | 'Weekend';

type PropertyClassOption = (typeof PROPERTY_CLASS_OPTIONS)[number]['value'];

type YesNoOption = 'Yes' | 'No';

export type NumericRange = {
  min: number | null;
  max: number | null;
};

export type SliderRange = NumericRange & {
  preset?: string | null;
};

type BedBathState = SliderRange & {
  exact?: number | null;
};

export type FiltersState = {
  status: StatusOption;
  timeRange: TimeRangeOption;
  timeRangeCustomDate: string | null;
  cities: string[];
  propertyTypes: string[];
  price: SliderRange;
  beds: BedBathState;
  baths: BedBathState;
  advanced: {
    keywords: string[];
    propertyClasses: PropertyClassOption[];
    squareFootage: NumericRange;
    houseStyle: string[];
    lotFrontage: string | null;
    lotDepth: string | null;
    lotSizeAcres: NumericRange;
    maintenanceFee: SliderRange;
    propertyTax: SliderRange;
    daysOnMarket: SliderRange;
    garageParking: SliderRange;
    totalParking: SliderRange;
    basementFeatures: string[];
    propertyAge: string | null;
    fixerUpperKeywords: boolean | null;
    swimmingPool: YesNoOption | null;
    waterfront: YesNoOption | null;
    openHouse: OpenHouseOption;
  };
};

type FiltersAction =
  | { type: 'SET_STATUS'; payload: StatusOption }
  | { type: 'SET_TIME_RANGE'; payload: TimeRangeOption }
  | { type: 'SET_TIME_RANGE_CUSTOM_DATE'; payload: string | null }
  | { type: 'TOGGLE_CITY'; payload: string }
  | { type: 'SET_CITIES'; payload: string[] }
  | { type: 'TOGGLE_PROPERTY_TYPE'; payload: string }
  | { type: 'SET_PROPERTY_TYPES'; payload: string[] }
  | { type: 'SET_PRICE'; payload: SliderRange }
  | { type: 'SET_BEDS'; payload: BedBathState }
  | { type: 'SET_BATHS'; payload: BedBathState }
  | { type: 'ADVANCED_SET_KEYWORDS'; payload: string[] }
  | { type: 'ADVANCED_SET_PROPERTY_CLASSES'; payload: PropertyClassOption[] }
  | { type: 'ADVANCED_SET_SQUARE_FOOTAGE'; payload: NumericRange }
  | { type: 'ADVANCED_SET_HOUSE_STYLE'; payload: string[] }
  | { type: 'ADVANCED_SET_LOT_FRONTAGE'; payload: string | null }
  | { type: 'ADVANCED_SET_LOT_DEPTH'; payload: string | null }
  | { type: 'ADVANCED_SET_LOT_SIZE_ACRES'; payload: NumericRange }
  | { type: 'ADVANCED_SET_MAINTENANCE_FEE'; payload: SliderRange }
  | { type: 'ADVANCED_SET_PROPERTY_TAX'; payload: SliderRange }
  | { type: 'ADVANCED_SET_DAYS_ON_MARKET'; payload: SliderRange }
  | { type: 'ADVANCED_SET_GARAGE_PARKING'; payload: SliderRange }
  | { type: 'ADVANCED_SET_TOTAL_PARKING'; payload: SliderRange }
  | { type: 'ADVANCED_TOGGLE_BASEMENT_FEATURE'; payload: string }
  | { type: 'ADVANCED_SET_BASEMENT_FEATURES'; payload: string[] }
  | { type: 'ADVANCED_SET_PROPERTY_AGE'; payload: string | null }
  | { type: 'ADVANCED_SET_FIXER_UPPER_KEYWORDS'; payload: boolean | null }
  | { type: 'ADVANCED_SET_SWIMMING_POOL'; payload: YesNoOption | null }
  | { type: 'ADVANCED_SET_WATERFRONT'; payload: YesNoOption | null }
  | { type: 'ADVANCED_SET_OPEN_HOUSE'; payload: OpenHouseOption }
  | { type: 'ADVANCED_SET_ALL'; payload: FiltersState['advanced'] }
  | { type: 'RESET_ALL' };

export const DEFAULT_FILTERS_STATE: FiltersState = {
  status: 'For Sale',
  timeRange: 'All Time',
  timeRangeCustomDate: null,
  cities: [],
  propertyTypes: [],
  price: { min: null, max: null, preset: 'Any' },
  beds: { min: null, max: null, preset: 'Any', exact: null },
  baths: { min: null, max: null, preset: 'Any', exact: null },
  advanced: {
    keywords: [],
    propertyClasses: [],
    squareFootage: { min: null, max: null },
    houseStyle: [],
    lotFrontage: null,
    lotDepth: null,
    lotSizeAcres: { min: null, max: null },
    maintenanceFee: { min: null, max: null, preset: 'Any' },
    propertyTax: { min: null, max: null, preset: 'Any' },
    daysOnMarket: { min: null, max: null, preset: 'Any' },
    garageParking: { min: null, max: null, preset: 'Any' },
    totalParking: { min: null, max: null, preset: 'Any' },
    basementFeatures: [],
    propertyAge: null,
    fixerUpperKeywords: null,
    swimmingPool: null,
    waterfront: null,
    openHouse: 'All',
  },
};

const FiltersContext = createContext<{
  state: FiltersState;
  dispatch: (action: FiltersAction) => void;
  resetAll: () => void;
} | null>(null);

function filtersReducer(state: FiltersState, action: FiltersAction): FiltersState {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_TIME_RANGE': {
      const nextTimeRange = action.payload;
      return {
        ...state,
        timeRange: nextTimeRange,
        timeRangeCustomDate: nextTimeRange === 'Custom Date Range' ? state.timeRangeCustomDate : null,
      };
    }
    case 'SET_TIME_RANGE_CUSTOM_DATE':
      return { ...state, timeRangeCustomDate: action.payload };
    case 'TOGGLE_CITY': {
      const exists = state.cities.includes(action.payload);
      return {
        ...state,
        cities: exists
          ? state.cities.filter((city) => city !== action.payload)
          : [...state.cities, action.payload],
      };
    }
    case 'SET_CITIES':
      return { ...state, cities: action.payload };
    case 'TOGGLE_PROPERTY_TYPE': {
      const exists = state.propertyTypes.includes(action.payload);
      return {
        ...state,
        propertyTypes: exists
          ? state.propertyTypes.filter((type) => type !== action.payload)
          : [...state.propertyTypes, action.payload],
      };
    }
    case 'SET_PROPERTY_TYPES':
      return { ...state, propertyTypes: action.payload };
    case 'SET_PRICE':
      return { ...state, price: { ...state.price, ...action.payload } };
    case 'SET_BEDS':
      return { ...state, beds: { ...state.beds, ...action.payload } };
    case 'SET_BATHS':
      return { ...state, baths: { ...state.baths, ...action.payload } };
    case 'ADVANCED_SET_KEYWORDS':
      return { ...state, advanced: { ...state.advanced, keywords: action.payload } };
    case 'ADVANCED_SET_PROPERTY_CLASSES':
      return { ...state, advanced: { ...state.advanced, propertyClasses: action.payload } };
    case 'ADVANCED_SET_SQUARE_FOOTAGE':
      return { ...state, advanced: { ...state.advanced, squareFootage: { ...action.payload } } };
    case 'ADVANCED_SET_HOUSE_STYLE':
      return { ...state, advanced: { ...state.advanced, houseStyle: action.payload } };
    case 'ADVANCED_SET_LOT_FRONTAGE':
      return { ...state, advanced: { ...state.advanced, lotFrontage: action.payload } };
    case 'ADVANCED_SET_LOT_DEPTH':
      return { ...state, advanced: { ...state.advanced, lotDepth: action.payload } };
    case 'ADVANCED_SET_LOT_SIZE_ACRES':
      return { ...state, advanced: { ...state.advanced, lotSizeAcres: { ...action.payload } } };
    case 'ADVANCED_SET_MAINTENANCE_FEE':
      return { ...state, advanced: { ...state.advanced, maintenanceFee: { ...state.advanced.maintenanceFee, ...action.payload } } };
    case 'ADVANCED_SET_PROPERTY_TAX':
      return { ...state, advanced: { ...state.advanced, propertyTax: { ...state.advanced.propertyTax, ...action.payload } } };
    case 'ADVANCED_SET_DAYS_ON_MARKET':
      return { ...state, advanced: { ...state.advanced, daysOnMarket: { ...state.advanced.daysOnMarket, ...action.payload } } };
    case 'ADVANCED_SET_GARAGE_PARKING':
      return { ...state, advanced: { ...state.advanced, garageParking: { ...state.advanced.garageParking, ...action.payload } } };
    case 'ADVANCED_SET_TOTAL_PARKING':
      return { ...state, advanced: { ...state.advanced, totalParking: { ...state.advanced.totalParking, ...action.payload } } };
    case 'ADVANCED_TOGGLE_BASEMENT_FEATURE': {
      const exists = state.advanced.basementFeatures.includes(action.payload);
      return {
        ...state,
        advanced: {
          ...state.advanced,
          basementFeatures: exists
            ? state.advanced.basementFeatures.filter((feature) => feature !== action.payload)
            : [...state.advanced.basementFeatures, action.payload],
        },
      };
    }
    case 'ADVANCED_SET_BASEMENT_FEATURES':
      return { ...state, advanced: { ...state.advanced, basementFeatures: action.payload } };
    case 'ADVANCED_SET_PROPERTY_AGE':
      return { ...state, advanced: { ...state.advanced, propertyAge: action.payload } };
    case 'ADVANCED_SET_FIXER_UPPER_KEYWORDS':
      return { ...state, advanced: { ...state.advanced, fixerUpperKeywords: action.payload } };
    case 'ADVANCED_SET_SWIMMING_POOL':
      return { ...state, advanced: { ...state.advanced, swimmingPool: action.payload } };
    case 'ADVANCED_SET_WATERFRONT':
      return { ...state, advanced: { ...state.advanced, waterfront: action.payload } };
    case 'ADVANCED_SET_OPEN_HOUSE':
      return { ...state, advanced: { ...state.advanced, openHouse: action.payload } };
    case 'ADVANCED_SET_ALL':
      console.log('[FiltersContext] ADVANCED_SET_ALL reducer:', {
        propertyClasses: action.payload.propertyClasses,
        fullPayload: action.payload
      });
      return { ...state, advanced: action.payload };
    case 'RESET_ALL':
      return DEFAULT_FILTERS_STATE;
    default:
      return state;
  }
}

export function FiltersProvider({ 
  children, 
  initialStatus 
}: { 
  children: ReactNode;
  initialStatus?: StatusOption;
}) {
  const initialState = initialStatus 
    ? { ...DEFAULT_FILTERS_STATE, status: initialStatus }
    : DEFAULT_FILTERS_STATE;
  const [state, dispatch] = useReducer(filtersReducer, initialState);

  const resetAll = useCallback(() => {
    dispatch({ type: 'RESET_ALL' });
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      resetAll,
    }),
    [state, resetAll],
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFiltersContext() {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useFiltersContext must be used within a FiltersProvider');
  }
  return context;
}

export function useFiltersState() {
  return useFiltersContext().state;
}

export function useFiltersDispatch() {
  return useFiltersContext().dispatch;
}

export function useFiltersReset() {
  return useFiltersContext().resetAll;
}


