import { Reducer } from "react";

export type RangeField =
  | "squareFootage"
  | "maintenanceFees"
  | "propertyTax"
  | "daysOnMarket"
  | "garageParking"
  | "totalParking";

export type AdvancedFiltersState = {
  keyword: string;
  propertyClass: string;
  houseStyle: string;
  lotFrontage: string;
  lotDepth: string;
  squareFootageMin: number;
  squareFootageMax: number;
  maintenanceFeesMin: number;
  maintenanceFeesMax: number;
  propertyTaxMin: number;
  propertyTaxMax: number;
  daysOnMarketMin: number;
  daysOnMarketMax: number;
  garageParkingMin: number;
  garageParkingMax: number;
  totalParkingMin: number;
  totalParkingMax: number;
  propertyAge: string;
  hasSwimmingPool: string;
  waterfront: string;
  basementFeatures: string[];
  openHouseTiming: string;
};

export const RANGE_CONFIG: Record<
  RangeField,
  {
    min: number;
    max: number;
    step: number;
    label: string;
    unit?: string;
    unitPlacement?: "prefix" | "suffix";
  }
> = {
  squareFootage: {
    min: 500,
    max: 6000,
    step: 50,
    label: "Square Footage",
    unit: "sq ft",
    unitPlacement: "suffix",
  },
  maintenanceFees: {
    min: 0,
    max: 2000,
    step: 10,
    label: "Maintenance Fees",
    unit: "$",
    unitPlacement: "prefix",
  },
  propertyTax: {
    min: 0,
    max: 20000,
    step: 100,
    label: "Property Tax",
    unit: "$",
    unitPlacement: "prefix",
  },
  daysOnMarket: {
    min: 0,
    max: 365,
    step: 5,
    label: "Days on Market",
  },
  garageParking: {
    min: 0,
    max: 5,
    step: 1,
    label: "Garage Parking",
  },
  totalParking: {
    min: 0,
    max: 8,
    step: 1,
    label: "Total Parking",
  },
};

export const RANGE_FIELD_KEY_MAP = {
  squareFootage: { min: "squareFootageMin", max: "squareFootageMax" },
  maintenanceFees: { min: "maintenanceFeesMin", max: "maintenanceFeesMax" },
  propertyTax: { min: "propertyTaxMin", max: "propertyTaxMax" },
  daysOnMarket: { min: "daysOnMarketMin", max: "daysOnMarketMax" },
  garageParking: { min: "garageParkingMin", max: "garageParkingMax" },
  totalParking: { min: "totalParkingMin", max: "totalParkingMax" },
} as const;

export const BASEMENT_FEATURE_OPTIONS = [
  "Apartment",
  "Finished",
  "Walk-Out",
  "Separate Entrance",
  "Kitchen: Yes",
  "Kitchen: No",
  "None",
] as const;

export const OPEN_HOUSE_TIMING_OPTIONS = ["All", "Today", "Tomorrow", "Weekend"] as const;

export const DEFAULT_FILTERS: AdvancedFiltersState = {
  keyword: "",
  propertyClass: "",
  houseStyle: "",
  lotFrontage: "",
  lotDepth: "",
  squareFootageMin: RANGE_CONFIG.squareFootage.min,
  squareFootageMax: RANGE_CONFIG.squareFootage.max,
  maintenanceFeesMin: RANGE_CONFIG.maintenanceFees.min,
  maintenanceFeesMax: RANGE_CONFIG.maintenanceFees.max,
  propertyTaxMin: RANGE_CONFIG.propertyTax.min,
  propertyTaxMax: RANGE_CONFIG.propertyTax.max,
  daysOnMarketMin: RANGE_CONFIG.daysOnMarket.min,
  daysOnMarketMax: RANGE_CONFIG.daysOnMarket.max,
  garageParkingMin: RANGE_CONFIG.garageParking.min,
  garageParkingMax: RANGE_CONFIG.garageParking.max,
  totalParkingMin: RANGE_CONFIG.totalParking.min,
  totalParkingMax: RANGE_CONFIG.totalParking.max,
  propertyAge: "",
  hasSwimmingPool: "",
  waterfront: "",
  basementFeatures: [],
  openHouseTiming: "All",
};

export type AdvancedFiltersAction =
  | {
      type: "SET_FIELD";
      field: keyof AdvancedFiltersState;
      value: AdvancedFiltersState[keyof AdvancedFiltersState];
    }
  | {
      type: "SET_RANGE";
      field: RangeField;
      bound: "min" | "max";
      value: number;
    }
  | {
      type: "TOGGLE_BASEMENT_FEATURE";
      value: (typeof BASEMENT_FEATURE_OPTIONS)[number];
    }
  | {
      type: "SET_OPEN_HOUSE";
      value: (typeof OPEN_HOUSE_TIMING_OPTIONS)[number];
    }
  | {
      type: "RESET";
      payload: AdvancedFiltersState;
    };

const clampValue = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const toNumberOr = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const normaliseBasementFeatures = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const filtered = value.filter((item) => typeof item === "string") as string[];
  const unique = Array.from(new Set(filtered));
  return unique;
};

export const normaliseFilters = (incoming?: Partial<AdvancedFiltersState>): AdvancedFiltersState => {
  if (!incoming) {
    return { ...DEFAULT_FILTERS };
  }

  const next: AdvancedFiltersState = {
    ...DEFAULT_FILTERS,
    ...incoming,
  };

  (Object.keys(RANGE_FIELD_KEY_MAP) as RangeField[]).forEach((field) => {
    const config = RANGE_CONFIG[field];
    const keys = RANGE_FIELD_KEY_MAP[field];

    const min = clampValue(toNumberOr(next[keys.min], config.min), config.min, config.max);
    const max = clampValue(toNumberOr(next[keys.max], config.max), config.min, config.max);

    if (min > max) {
      next[keys.min] = max;
      next[keys.max] = max;
    } else {
      next[keys.min] = min;
      next[keys.max] = max;
    }
  });

  next.basementFeatures = normaliseBasementFeatures(next.basementFeatures);

  if (!OPEN_HOUSE_TIMING_OPTIONS.includes(next.openHouseTiming as typeof OPEN_HOUSE_TIMING_OPTIONS[number])) {
    next.openHouseTiming = DEFAULT_FILTERS.openHouseTiming;
  }

  return next;
};

const updateRangeState = (
  state: AdvancedFiltersState,
  field: RangeField,
  bound: "min" | "max",
  value: number,
): AdvancedFiltersState => {
  const config = RANGE_CONFIG[field];
  const keys = RANGE_FIELD_KEY_MAP[field];
  const parsed = clampValue(value, config.min, config.max);

  const minKey = keys.min;
  const maxKey = keys.max;

  const currentMin = state[minKey];
  const currentMax = state[maxKey];

  if (bound === "min") {
    const nextMin = Math.min(parsed, currentMax);
    return {
      ...state,
      [minKey]: nextMin,
      [maxKey]: currentMax < nextMin ? nextMin : currentMax,
    };
  }

  const nextMax = Math.max(parsed, currentMin);
  return {
    ...state,
    [minKey]: currentMin > nextMax ? nextMax : currentMin,
    [maxKey]: nextMax,
  };
};

const toggleBasementFeature = (state: AdvancedFiltersState, value: string): AdvancedFiltersState => {
  const current = Array.isArray(state.basementFeatures) ? [...state.basementFeatures] : [];

  if (value === "None") {
    if (current.length === 1 && current[0] === "None") {
      return {
        ...state,
        basementFeatures: [],
      };
    }

    return {
      ...state,
      basementFeatures: ["None"],
    };
  }

  const filtered = current.filter((feature) => feature !== "None");
  const exists = filtered.includes(value);
  const next = exists
    ? filtered.filter((feature) => feature !== value)
    : [...filtered, value];

  return {
    ...state,
    basementFeatures: next,
  };
};

export const advancedFiltersReducer: Reducer<AdvancedFiltersState, AdvancedFiltersAction> = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "SET_RANGE":
      return updateRangeState(state, action.field, action.bound, action.value);
    case "TOGGLE_BASEMENT_FEATURE":
      return toggleBasementFeature(state, action.value);
    case "SET_OPEN_HOUSE":
      return {
        ...state,
        openHouseTiming: action.value === "All"
          ? "All"
          : state.openHouseTiming === action.value
            ? "All"
            : action.value,
      };
    case "RESET":
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};

export const areAdvancedFiltersEqual = (
  a: AdvancedFiltersState,
  b: AdvancedFiltersState,
): boolean => {
  if (a === b) {
    return true;
  }

  const keys = Object.keys(DEFAULT_FILTERS) as (keyof AdvancedFiltersState)[];

  for (const key of keys) {
    const valueA = a[key];
    const valueB = b[key];

    if (Array.isArray(valueA) && Array.isArray(valueB)) {
      if (valueA.length !== valueB.length) {
        return false;
      }

      for (let index = 0; index < valueA.length; index += 1) {
        if (valueA[index] !== valueB[index]) {
          return false;
        }
      }
      continue;
    }

    if (valueA !== valueB) {
      return false;
    }
  }

  return true;
};

export const formatRangeValue = (
  value: number,
  config: { unit?: string; unitPlacement?: "prefix" | "suffix" },
) => {
  const formatted = Number.isFinite(value) ? value.toLocaleString() : value;
  if (!config.unit) {
    return `${formatted}`;
  }
  return config.unitPlacement === "prefix"
    ? `${config.unit}${formatted}`
    : `${formatted} ${config.unit}`;
};

export const formatRangeSummary = (
  minValue: number,
  maxValue: number,
  config: { unit?: string; unitPlacement?: "prefix" | "suffix" },
) => `${formatRangeValue(minValue, config)} – ${formatRangeValue(maxValue, config)}`;

export const getRangeFillStyle = (minValue: number, maxValue: number, config: { min: number; max: number }) => {
  const span = config.max - config.min;
  if (span <= 0) {
    return { left: "0%", width: "0%" };
  }
  const start = ((minValue - config.min) / span) * 100;
  const end = ((maxValue - config.min) / span) * 100;
  const left = Math.min(Math.max(start, 0), 100);
  const right = Math.min(Math.max(end, 0), 100);
  return {
    left: `${left}%`,
    width: `${Math.max(right - left, 0)}%`,
  };
};

