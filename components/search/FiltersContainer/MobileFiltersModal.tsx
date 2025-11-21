'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { BaseModal, ModalBody, ModalFooter, ModalHeader } from './Shared/Modals';
import { CollapsibleSection } from './Shared/CollapsibleSection';
import { STATUS_OPTIONS, TIME_RANGE_OPTIONS } from '@/lib/filters/options';
import { useFiltersDispatch, useFiltersState, DEFAULT_FILTERS_STATE } from './FiltersContext';
import { CityList } from './PrimaryFilters/CityFilter/CityList';
import { TypeGroup } from './PrimaryFilters/TypeFilter/TypeGroup';
import { RangeSlider } from './Shared/RangeSlider';
import { PRICE_PRESETS, BED_QUICK_SELECTS, EXACT_BED_OPTIONS, BATH_QUICK_SELECTS, EXACT_BATH_OPTIONS } from '@/lib/filters/options';
import {
  AdvancedFiltersState,
  DEFAULT_FILTERS as ADVANCED_MODAL_DEFAULTS,
  type RangeField,
  OPEN_HOUSE_TIMING_OPTIONS,
  BASEMENT_FEATURE_OPTIONS,
} from './PrimaryFilters/AdvancedFilters/state';
import {
  PropertyDetailsSection,
  HouseStyleSection,
  RangeFiltersSection,
  PropertyFeaturesSection,
  BasementFeaturesSection,
  OpenHouseSection,
} from './PrimaryFilters/AdvancedFilters/sections';
import { cn } from '@/lib/utils';
import type { StatusOption } from './FiltersContext';

export type MobileFiltersModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MAX_PRICE = 5_000_000;
const MAX_BEDS = 10;
const MAX_BATHS = 10;

function getDateFilterLabel(status: StatusOption): string {
  switch (status) {
    case 'For Sale':
    case 'For Lease':
      return 'Date Listed';
    case 'Sold':
      return 'Date Sold';
    case 'Leased':
      return 'Date Leased';
    case 'Removed':
      return 'Date Removed';
    default:
      return 'Date Listed';
  }
}

export function MobileFiltersModal({ isOpen, onClose }: MobileFiltersModalProps) {
  const filters = useFiltersState();
  const dispatch = useFiltersDispatch();

  // Status state
  const [localStatus, setLocalStatus] = useState<StatusOption>(filters.status);

  // Date state
  const [localTimeRange, setLocalTimeRange] = useState(filters.timeRange);
  const [localCustomDate, setLocalCustomDate] = useState(filters.timeRangeCustomDate ?? '');

  // City state
  const [localCities, setLocalCities] = useState<string[]>(filters.cities);

  // Type state
  const [localTypes, setLocalTypes] = useState<string[]>(filters.propertyTypes);

  // Price state
  const [localPrice, setLocalPrice] = useState<{
    min: number | null;
    max: number | null;
    preset: string | null;
  }>({
    min: filters.price.min,
    max: filters.price.max,
    preset: filters.price.preset ?? 'Any',
  });

  // Beds state
  const [localBeds, setLocalBeds] = useState<{
    min: number | null;
    max: number | null;
    preset: string | null;
    exact: number | null;
  }>({
    min: filters.beds.min,
    max: filters.beds.max,
    preset: filters.beds.preset ?? 'Any',
    exact: filters.beds.exact ?? null,
  });

  // Baths state
  const [localBaths, setLocalBaths] = useState<{
    min: number | null;
    max: number | null;
    preset: string | null;
    exact: number | null;
  }>({
    min: filters.baths.min,
    max: filters.baths.max,
    preset: filters.baths.preset ?? 'Any',
    exact: filters.baths.exact ?? null,
  });

  // Advanced filters state
  const mapContextAdvancedToModal = (advanced: typeof filters.advanced): AdvancedFiltersState => ({
    keyword: advanced.keywords.join(', '),
    propertyClass: advanced.propertyClasses[0] ?? '',
    houseStyle: advanced.houseStyle ?? [],
    lotFrontage: advanced.lotFrontage ?? '',
    lotDepth: advanced.lotDepth ?? '',
    squareFootageMin: advanced.squareFootage.min ?? ADVANCED_MODAL_DEFAULTS.squareFootageMin,
    squareFootageMax: advanced.squareFootage.max ?? ADVANCED_MODAL_DEFAULTS.squareFootageMax,
    maintenanceFeesMin: advanced.maintenanceFee.min ?? ADVANCED_MODAL_DEFAULTS.maintenanceFeesMin,
    maintenanceFeesMax: advanced.maintenanceFee.max ?? ADVANCED_MODAL_DEFAULTS.maintenanceFeesMax,
    propertyTaxMin: advanced.propertyTax.min ?? ADVANCED_MODAL_DEFAULTS.propertyTaxMin,
    propertyTaxMax: advanced.propertyTax.max ?? ADVANCED_MODAL_DEFAULTS.propertyTaxMax,
    daysOnMarketMin: advanced.daysOnMarket.min ?? ADVANCED_MODAL_DEFAULTS.daysOnMarketMin,
    daysOnMarketMax: advanced.daysOnMarket.max ?? ADVANCED_MODAL_DEFAULTS.daysOnMarketMax,
    garageParkingMin: advanced.garageParking.min ?? ADVANCED_MODAL_DEFAULTS.garageParkingMin,
    garageParkingMax: advanced.garageParking.max ?? ADVANCED_MODAL_DEFAULTS.garageParkingMax,
    totalParkingMin: advanced.totalParking.min ?? ADVANCED_MODAL_DEFAULTS.totalParkingMin,
    totalParkingMax: advanced.totalParking.max ?? ADVANCED_MODAL_DEFAULTS.totalParkingMax,
    propertyAge: advanced.propertyAge ?? '',
    hasSwimmingPool: advanced.swimmingPool ?? '',
    waterfront: advanced.waterfront ?? '',
    basementFeatures: [...advanced.basementFeatures],
    openHouseTiming: advanced.openHouse,
  });

  const [localAdvanced, setLocalAdvanced] = useState<AdvancedFiltersState>(() =>
    mapContextAdvancedToModal(filters.advanced),
  );

  // Reset local state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setLocalStatus(filters.status);
      setLocalTimeRange(filters.timeRange);
      setLocalCustomDate(filters.timeRangeCustomDate ?? '');
      setLocalCities(filters.cities);
      setLocalTypes(filters.propertyTypes);
      setLocalPrice({
        min: filters.price.min,
        max: filters.price.max,
        preset: filters.price.preset ?? 'Any',
      });
      setLocalBeds({
        min: filters.beds.min,
        max: filters.beds.max,
        preset: filters.beds.preset ?? 'Any',
        exact: filters.beds.exact ?? null,
      });
      setLocalBaths({
        min: filters.baths.min,
        max: filters.baths.max,
        preset: filters.baths.preset ?? 'Any',
        exact: filters.baths.exact ?? null,
      });
      setLocalAdvanced(mapContextAdvancedToModal(filters.advanced));
    } else {
      // Reset dropdown states when modal closes
      setStatusDropdownOpen(false);
      setDateDropdownOpen(false);
    }
  }, [isOpen, filters]);

  const handleApply = useCallback(() => {
    // Apply Status
    dispatch({ type: 'SET_STATUS', payload: localStatus });

    // Apply Date
    dispatch({ type: 'SET_TIME_RANGE', payload: localTimeRange });
    if (localTimeRange === 'Custom Date Range' && localCustomDate) {
      dispatch({ type: 'SET_TIME_RANGE_CUSTOM_DATE', payload: localCustomDate });
    } else {
      dispatch({ type: 'SET_TIME_RANGE_CUSTOM_DATE', payload: null });
    }

    // Apply Cities
    dispatch({ type: 'SET_CITIES', payload: localCities });

    // Apply Types
    dispatch({ type: 'SET_PROPERTY_TYPES', payload: localTypes });

    // Apply Price
    dispatch({
      type: 'SET_PRICE',
      payload: {
        min: localPrice.min,
        max: localPrice.max,
        preset: localPrice.preset === 'Any' ? undefined : localPrice.preset,
      },
    });

    // Apply Beds
    dispatch({
      type: 'SET_BEDS',
      payload: {
        min: localBeds.min,
        max: localBeds.max,
        preset: localBeds.preset === 'Any' ? undefined : localBeds.preset,
        exact: localBeds.exact ?? undefined,
      },
    });

    // Apply Baths
    dispatch({
      type: 'SET_BATHS',
      payload: {
        min: localBaths.min,
        max: localBaths.max,
        preset: localBaths.preset === 'Any' ? undefined : localBaths.preset,
        exact: localBaths.exact ?? undefined,
      },
    });

    // Apply Advanced Filters
    const splitKeywords = (value: string): string[] =>
      value
        .split(/[,;\n]/)
        .map((keyword) => keyword.trim())
        .filter(Boolean);

    const toNullable = (value: number, defaultValue: number): number | null =>
      value === defaultValue ? null : value;

    const buildSliderRange = (
      minValue: number,
      maxValue: number,
      defaults: { min: number; max: number },
    ) => {
      const bothAtDefaults = minValue === defaults.min && maxValue === defaults.max;
      return {
        preset: 'Any' as const,
        min: bothAtDefaults ? null : minValue,
        max: bothAtDefaults ? null : maxValue,
      };
    };

    const propertyClasses = localAdvanced.propertyClass
      ? [localAdvanced.propertyClass as 'Freehold only' | 'Condo only']
      : [];

    dispatch({
      type: 'ADVANCED_SET_ALL',
      payload: {
        keywords: splitKeywords(localAdvanced.keyword),
        propertyClasses,
        squareFootage: {
          min: toNullable(localAdvanced.squareFootageMin, ADVANCED_MODAL_DEFAULTS.squareFootageMin),
          max: toNullable(localAdvanced.squareFootageMax, ADVANCED_MODAL_DEFAULTS.squareFootageMax),
        },
        houseStyle: localAdvanced.houseStyle.length > 0 ? localAdvanced.houseStyle : [],
        lotFrontage: localAdvanced.lotFrontage || null,
        lotDepth: localAdvanced.lotDepth || null,
        maintenanceFee: buildSliderRange(
          localAdvanced.maintenanceFeesMin,
          localAdvanced.maintenanceFeesMax,
          {
            min: ADVANCED_MODAL_DEFAULTS.maintenanceFeesMin,
            max: ADVANCED_MODAL_DEFAULTS.maintenanceFeesMax,
          },
        ),
        propertyTax: {
          min: toNullable(localAdvanced.propertyTaxMin, ADVANCED_MODAL_DEFAULTS.propertyTaxMin),
          max: toNullable(localAdvanced.propertyTaxMax, ADVANCED_MODAL_DEFAULTS.propertyTaxMax),
          preset: 'Any' as const,
        },
        daysOnMarket: buildSliderRange(
          localAdvanced.daysOnMarketMin,
          localAdvanced.daysOnMarketMax,
          {
            min: ADVANCED_MODAL_DEFAULTS.daysOnMarketMin,
            max: ADVANCED_MODAL_DEFAULTS.daysOnMarketMax,
          },
        ),
        garageParking: buildSliderRange(
          localAdvanced.garageParkingMin,
          localAdvanced.garageParkingMax,
          {
            min: ADVANCED_MODAL_DEFAULTS.garageParkingMin,
            max: ADVANCED_MODAL_DEFAULTS.garageParkingMax,
          },
        ),
        totalParking: buildSliderRange(
          localAdvanced.totalParkingMin,
          localAdvanced.totalParkingMax,
          {
            min: ADVANCED_MODAL_DEFAULTS.totalParkingMin,
            max: ADVANCED_MODAL_DEFAULTS.totalParkingMax,
          },
        ),
        basementFeatures: [...localAdvanced.basementFeatures],
        propertyAge: localAdvanced.propertyAge || null,
        swimmingPool: localAdvanced.hasSwimmingPool ? (localAdvanced.hasSwimmingPool as 'Yes' | 'No') : null,
        waterfront: localAdvanced.waterfront ? (localAdvanced.waterfront as 'Yes' | 'No') : null,
        openHouse: localAdvanced.openHouseTiming as typeof filters.advanced.openHouse,
      },
    });

    onClose();
  }, [
    localStatus,
    localTimeRange,
    localCustomDate,
    localCities,
    localTypes,
    localPrice,
    localBeds,
    localBaths,
    localAdvanced,
    dispatch,
    onClose,
    filters.advanced.openHouse,
  ]);

  const handleReset = useCallback(() => {
    setLocalStatus(DEFAULT_FILTERS_STATE.status);
    setLocalTimeRange(DEFAULT_FILTERS_STATE.timeRange);
    setLocalCustomDate('');
    setLocalCities([]);
    setLocalTypes([]);
    setLocalPrice({ min: null, max: null, preset: 'Any' });
    setLocalBeds({ min: null, max: null, preset: 'Any', exact: null });
    setLocalBaths({ min: null, max: null, preset: 'Any', exact: null });
    setLocalAdvanced(mapContextAdvancedToModal(DEFAULT_FILTERS_STATE.advanced));
  }, []);

  const formatCurrency = (amount: number) =>
    amount >= 1_000_000 ? `$${(amount / 1_000_000).toFixed(1)}M` : `$${Math.round(amount / 1_000)}K`;

  const priceRangeValue = useMemo(
    () => ({
      min: localPrice.min ?? 0,
      max: localPrice.max ?? MAX_PRICE,
    }),
    [localPrice.min, localPrice.max],
  );

  const bedsRangeValue = useMemo(
    () => ({
      min: localBeds.min ?? 0,
      max: localBeds.max ?? MAX_BEDS,
    }),
    [localBeds.min, localBeds.max],
  );

  const bathsRangeValue = useMemo(
    () => ({
      min: localBaths.min ?? 0,
      max: localBaths.max ?? MAX_BATHS,
    }),
    [localBaths.min, localBaths.max],
  );

  const handleAdvancedRangeChange = useCallback(
    (field: RangeField, bound: 'min' | 'max', value: number) => {
      setLocalAdvanced((prev) => {
        const keyMap: Record<RangeField, { min: keyof AdvancedFiltersState; max: keyof AdvancedFiltersState }> = {
          squareFootage: { min: 'squareFootageMin', max: 'squareFootageMax' },
          maintenanceFees: { min: 'maintenanceFeesMin', max: 'maintenanceFeesMax' },
          propertyTax: { min: 'propertyTaxMin', max: 'propertyTaxMax' },
          daysOnMarket: { min: 'daysOnMarketMin', max: 'daysOnMarketMax' },
          garageParking: { min: 'garageParkingMin', max: 'garageParkingMax' },
          totalParking: { min: 'totalParkingMin', max: 'totalParkingMax' },
        };
        const keys = keyMap[field];
        if (!keys) return prev;
        return { ...prev, [keys[bound]]: value };
      });
    },
    [],
  );

  const handleAdvancedFieldChange = useCallback((field: keyof AdvancedFiltersState, value: string) => {
    setLocalAdvanced((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAdvancedBasementToggle = useCallback(
    (value: (typeof BASEMENT_FEATURE_OPTIONS)[number]) => {
      setLocalAdvanced((prev) => ({
        ...prev,
        basementFeatures: prev.basementFeatures.includes(value)
          ? prev.basementFeatures.filter((item) => item !== value)
          : [...prev.basementFeatures, value],
      }));
    },
    [],
  );

  const handleAdvancedHouseStyleToggle = useCallback((displayName: string) => {
    setLocalAdvanced((prev) => ({
      ...prev,
      houseStyle: prev.houseStyle.includes(displayName)
        ? prev.houseStyle.filter((item) => item !== displayName)
        : [...prev.houseStyle, displayName],
    }));
  }, []);

  const handleAdvancedOpenHouseChange = useCallback(
    (value: (typeof OPEN_HOUSE_TIMING_OPTIONS)[number]) => {
      setLocalAdvanced((prev) => ({ ...prev, openHouseTiming: value }));
    },
    [],
  );

  // State for dropdowns
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  // Get current status option
  const currentStatusOption = STATUS_OPTIONS.find((opt) => opt.value === localStatus) ?? STATUS_OPTIONS[0];
  
  // Get current date option label
  const currentDateLabel = useMemo(() => {
    if (localTimeRange === 'Custom Date Range' && localCustomDate) {
      const parsed = new Date(localCustomDate);
      const isValid = !Number.isNaN(parsed.getTime());
      const formatted = isValid
        ? new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).format(parsed)
        : localCustomDate;
      return `Since ${formatted}`;
    }
    return localTimeRange;
  }, [localTimeRange, localCustomDate]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!isOpen || (!statusDropdownOpen && !dateDropdownOpen)) {
      return;
    }
    
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const dropdownContainer = target.closest('[data-dropdown-container]');
      if (!dropdownContainer) {
        setStatusDropdownOpen(false);
        setDateDropdownOpen(false);
      }
    };

    // Use capture phase to catch events before they bubble
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [isOpen, statusDropdownOpen, dateDropdownOpen]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      className="max-w-[min(100%,600px)]"
      contentClassName="h-[90vh] flex flex-col"
    >
      <ModalHeader title="Filters" description="Refine your search" onClose={onClose} />
      <ModalBody scrollable className="flex-1 overflow-y-auto">
        <div className="space-y-0">
          {/* Status and Date Dropdowns - Side by Side */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            {/* Status Dropdown */}
            <div className="relative" data-dropdown-container>
              <button
                type="button"
                onClick={() => {
                  setStatusDropdownOpen(!statusDropdownOpen);
                  setDateDropdownOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-colors',
                  'bg-white border-slate-200 text-slate-700 hover:bg-slate-50',
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: currentStatusOption.dotColor }}
                  />
                  <span className="truncate">{currentStatusOption.label}</span>
                </span>
                <svg
                  className={cn(
                    'h-4 w-4 text-slate-500 transition-transform',
                    statusDropdownOpen && 'rotate-180',
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {statusDropdownOpen && (
                <div className="absolute z-[10000] mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="max-h-[300px] overflow-y-auto py-2">
                    {STATUS_OPTIONS.map((option) => {
                      const isActive = option.value === localStatus;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setLocalStatus(option.value);
                            setStatusDropdownOpen(false);
                          }}
                          className={cn(
                            'flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-slate-700 hover:bg-slate-50',
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: option.dotColor }}
                            />
                            {option.label}
                          </span>
                          {isActive && (
                            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 16 16">
                              <path
                                d="M4 8.5L6.5 11L12 5"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Date Dropdown */}
            <div className="relative" data-dropdown-container>
              <button
                type="button"
                onClick={() => {
                  setDateDropdownOpen(!dateDropdownOpen);
                  setStatusDropdownOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-colors',
                  'bg-white border-slate-200 text-slate-700 hover:bg-slate-50',
                  localTimeRange !== DEFAULT_FILTERS_STATE.timeRange && 'border-blue-300 bg-blue-50',
                )}
              >
                <span className="truncate">{currentDateLabel}</span>
                <svg
                  className={cn(
                    'h-4 w-4 text-slate-500 transition-transform',
                    dateDropdownOpen && 'rotate-180',
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dateDropdownOpen && (
                <div className="absolute z-[10000] mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="max-h-[300px] overflow-y-auto py-2">
                    {TIME_RANGE_OPTIONS.filter((opt) => opt.value !== 'Custom Date Range').map((option) => {
                      const isActive = localTimeRange === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setLocalTimeRange(option.value);
                            setLocalCustomDate('');
                            setDateDropdownOpen(false);
                          }}
                          className={cn(
                            'w-full px-4 py-2.5 text-left text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-slate-700 hover:bg-slate-50',
                          )}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                    <div className="border-t border-slate-100 px-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLocalTimeRange('Custom Date Range');
                          // Keep dropdown open when Custom Date Range is selected
                        }}
                        className={cn(
                          'w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors',
                          localTimeRange === 'Custom Date Range'
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-700 hover:bg-slate-50',
                        )}
                      >
                        Custom Date Range
                      </button>
                      {localTimeRange === 'Custom Date Range' && (
                        <div className="mt-2 px-2 pb-2">
                          <input
                            type="date"
                            value={localCustomDate}
                            onChange={(e) => setLocalCustomDate(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* Show date input below dropdown when Custom Date Range is selected and dropdown is closed */}
              {!dateDropdownOpen && localTimeRange === 'Custom Date Range' && (
                <div className="mt-2">
                  <input
                    type="date"
                    value={localCustomDate}
                    onChange={(e) => setLocalCustomDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Primary Filters Section */}
          <CollapsibleSection title="Primary Filters" defaultOpen={true}>
            <div className="space-y-4">

              {/* City Filter */}
              <CollapsibleSection title="City" defaultOpen={false}>
                <div className="max-h-[300px] overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => setLocalCities([])}
                    className={cn(
                      'mb-3 w-full rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                      localCities.length === 0
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                    )}
                  >
                    All Cities
                  </button>
                  <CityList selected={localCities} onToggle={(city) => {
                    setLocalCities((prev) =>
                      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city],
                    );
                  }} />
                </div>
              </CollapsibleSection>

              {/* Type Filter */}
              <CollapsibleSection title="Property Type" defaultOpen={false}>
                <div className="max-h-[300px] overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => setLocalTypes([])}
                    className={cn(
                      'mb-3 w-full rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                      localTypes.length === 0
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                    )}
                  >
                    All Types
                  </button>
                  <TypeGroup selected={localTypes} onToggle={(type) => {
                    setLocalTypes((prev) =>
                      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
                    );
                  }} />
                </div>
              </CollapsibleSection>

              {/* Price Filter */}
              <CollapsibleSection title="Price" defaultOpen={false}>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {PRICE_PRESETS.map((preset) => {
                      const isActive = localPrice.preset === preset.label;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() =>
                            setLocalPrice({ min: preset.min, max: preset.max, preset: preset.label })
                          }
                          className={cn(
                            'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                            isActive
                              ? 'border-transparent bg-blue-600 text-white'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                          )}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                  <RangeSlider
                    min={0}
                    max={MAX_PRICE}
                    step={50_000}
                    value={priceRangeValue}
                    onChange={(value) => setLocalPrice({ ...value, preset: null })}
                    formatValue={formatCurrency}
                    showInputs={false}
                  />
                </div>
              </CollapsibleSection>

              {/* Beds Filter */}
              <CollapsibleSection title="Bedrooms" defaultOpen={false}>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {BED_QUICK_SELECTS.map((option) => {
                      const isActive = localBeds.preset === option.preset;
                      return (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() =>
                            setLocalBeds({
                              min: option.min,
                              max: option.max,
                              preset: option.preset,
                              exact: null,
                            })
                          }
                          className={cn(
                            'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                            isActive
                              ? 'border-transparent bg-blue-600 text-white'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                          )}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {EXACT_BED_OPTIONS.map((option) => {
                      const isActive = localBeds.exact === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setLocalBeds((prev) => ({
                              ...prev,
                              exact: prev.exact === option ? null : option,
                              preset: null,
                            }))
                          }
                          className={cn(
                            'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                            isActive
                              ? 'border-transparent bg-blue-600 text-white'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                          )}
                        >
                          Exactly {option}
                        </button>
                      );
                    })}
                  </div>
                  <RangeSlider
                    min={0}
                    max={MAX_BEDS}
                    value={bedsRangeValue}
                    onChange={(value) => setLocalBeds({ ...value, preset: null, exact: null })}
                    showInputs={false}
                  />
                </div>
              </CollapsibleSection>

              {/* Baths Filter */}
              <CollapsibleSection title="Bathrooms" defaultOpen={false}>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {BATH_QUICK_SELECTS.map((option) => {
                      const isActive = localBaths.preset === option.preset;
                      return (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() =>
                            setLocalBaths({
                              min: option.min,
                              max: option.max,
                              preset: option.preset,
                              exact: null,
                            })
                          }
                          className={cn(
                            'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                            isActive
                              ? 'border-transparent bg-blue-600 text-white'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                          )}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {EXACT_BATH_OPTIONS.map((option) => {
                      const isActive = localBaths.exact === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setLocalBaths((prev) => ({
                              ...prev,
                              exact: prev.exact === option ? null : option,
                              preset: null,
                            }))
                          }
                          className={cn(
                            'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                            isActive
                              ? 'border-transparent bg-blue-600 text-white'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                          )}
                        >
                          Exactly {option}
                        </button>
                      );
                    })}
                  </div>
                  <RangeSlider
                    min={0}
                    max={MAX_BATHS}
                    value={bathsRangeValue}
                    onChange={(value) => setLocalBaths({ ...value, preset: null, exact: null })}
                    showInputs={false}
                  />
                </div>
              </CollapsibleSection>
            </div>
          </CollapsibleSection>

          {/* Advanced Filters Section */}
          <CollapsibleSection title="Advanced Filters">
            <div className="space-y-4">
              <PropertyDetailsSection
                values={{
                  keyword: localAdvanced.keyword,
                  propertyClass: localAdvanced.propertyClass,
                  lotFrontage: localAdvanced.lotFrontage,
                  lotDepth: localAdvanced.lotDepth,
                }}
                onFieldChange={handleAdvancedFieldChange}
              />
              <HouseStyleSection
                selected={localAdvanced.houseStyle}
                onToggle={handleAdvancedHouseStyleToggle}
              />
              <RangeFiltersSection
                values={{
                  squareFootageMin: localAdvanced.squareFootageMin,
                  squareFootageMax: localAdvanced.squareFootageMax,
                  maintenanceFeesMin: localAdvanced.maintenanceFeesMin,
                  maintenanceFeesMax: localAdvanced.maintenanceFeesMax,
                  propertyTaxMin: localAdvanced.propertyTaxMin,
                  propertyTaxMax: localAdvanced.propertyTaxMax,
                  daysOnMarketMin: localAdvanced.daysOnMarketMin,
                  daysOnMarketMax: localAdvanced.daysOnMarketMax,
                  garageParkingMin: localAdvanced.garageParkingMin,
                  garageParkingMax: localAdvanced.garageParkingMax,
                  totalParkingMin: localAdvanced.totalParkingMin,
                  totalParkingMax: localAdvanced.totalParkingMax,
                }}
                onRangeChange={handleAdvancedRangeChange}
              />
              <PropertyFeaturesSection
                values={{
                  propertyAge: localAdvanced.propertyAge,
                  hasSwimmingPool: localAdvanced.hasSwimmingPool,
                  waterfront: localAdvanced.waterfront,
                }}
                onFieldChange={handleAdvancedFieldChange}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <BasementFeaturesSection
                  selected={localAdvanced.basementFeatures}
                  onToggle={handleAdvancedBasementToggle}
                />
                <OpenHouseSection
                  value={localAdvanced.openHouseTiming}
                  onChange={handleAdvancedOpenHouseChange}
                />
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </ModalBody>
      <ModalFooter
        onCancel={onClose}
        onReset={handleReset}
        onApply={handleApply}
        applyLabel="Apply Filters"
      />
    </BaseModal>
  );
}

