'use client';

import { useMemo } from 'react';
import { FilterTag } from '@/components/ui/tags/FilterTag';
import { DEFAULT_FILTERS_STATE, useFiltersDispatch, useFiltersState } from './FiltersContext';

export type ActiveFiltersBarProps = {
  quickFilters: string[];
  onQuickFilterRemove: (tag: string) => void;
  onClearAll: () => void;
};

export function ActiveFiltersBar({
  quickFilters,
  onQuickFilterRemove,
  onClearAll,
}: ActiveFiltersBarProps) {
  const filters = useFiltersState();
  const dispatch = useFiltersDispatch();

  const activeItems = useMemo(() => {
    const items: Array<{ label: string; onRemove: () => void }> = [];

    if (filters.status !== DEFAULT_FILTERS_STATE.status) {
      items.push({
        label: filters.status,
        onRemove: () => dispatch({ type: 'SET_STATUS', payload: DEFAULT_FILTERS_STATE.status }),
      });
    }

    if (filters.timeRange !== DEFAULT_FILTERS_STATE.timeRange) {
      const timeRangeLabel =
        filters.timeRange === 'Custom Date Range' && filters.timeRangeCustomDate
          ? (() => {
              const parsed = new Date(filters.timeRangeCustomDate);
              const isValid = !Number.isNaN(parsed.getTime());
              const formatted = isValid
                ? new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }).format(parsed)
                : filters.timeRangeCustomDate;
              return `Since ${formatted}`;
            })()
          : filters.timeRange === 'Custom Date Range'
            ? 'Custom Date'
            : filters.timeRange;

      items.push({
        label: timeRangeLabel,
        onRemove: () => {
          dispatch({ type: 'SET_TIME_RANGE_CUSTOM_DATE', payload: null });
          dispatch({ type: 'SET_TIME_RANGE', payload: DEFAULT_FILTERS_STATE.timeRange });
        },
      });
    }

    if (filters.cities.length > 0) {
      filters.cities.forEach((city) => {
        items.push({
          label: city,
          onRemove: () =>
            dispatch({
              type: 'SET_CITIES',
              payload: filters.cities.filter((selectedCity) => selectedCity !== city),
            }),
        });
      });
    }

    if (filters.propertyTypes.length > 0) {
      filters.propertyTypes.forEach((propertyType) => {
        items.push({
          label: propertyType,
          onRemove: () =>
            dispatch({
              type: 'SET_PROPERTY_TYPES',
              payload: filters.propertyTypes.filter((selectedType) => selectedType !== propertyType),
            }),
        });
      });
    }

    if (
      filters.price.preset !== 'Any' ||
      filters.price.min != null ||
      filters.price.max != null
    ) {
      items.push({
        label:
          filters.price.preset && filters.price.preset !== 'Any'
            ? filters.price.preset
            : filters.price.min != null && filters.price.max != null
              ? `$${(filters.price.min / 1000).toLocaleString()}K - $${(
                  filters.price.max / 1000
                ).toLocaleString()}K`
              : filters.price.min != null
                ? `From $${filters.price.min.toLocaleString()}`
                : filters.price.max != null
                  ? `Up to $${filters.price.max.toLocaleString()}`
                  : 'Any Price',
        onRemove: () => dispatch({ type: 'SET_PRICE', payload: { min: null, max: null, preset: 'Any' } }),
      });
    }

    if (filters.beds.preset !== 'Any' || filters.beds.min != null || filters.beds.exact != null) {
      items.push({
        label:
          filters.beds.exact != null
            ? `${filters.beds.exact} Beds`
            : filters.beds.preset && filters.beds.preset !== 'Any'
              ? `${filters.beds.preset} Beds`
              : `${filters.beds.min ?? 0}+ Beds`,
        onRemove: () =>
          dispatch({ type: 'SET_BEDS', payload: { min: null, max: null, preset: 'Any', exact: null } }),
      });
    }

    if (filters.baths.preset !== 'Any' || filters.baths.min != null || filters.baths.exact != null) {
      items.push({
        label:
          filters.baths.exact != null
            ? `${filters.baths.exact} Baths`
            : filters.baths.preset && filters.baths.preset !== 'Any'
              ? `${filters.baths.preset} Baths`
              : `${filters.baths.min ?? 0}+ Baths`,
        onRemove: () =>
          dispatch({ type: 'SET_BATHS', payload: { min: null, max: null, preset: 'Any', exact: null } }),
      });
    }

    const defaultAdvanced = DEFAULT_FILTERS_STATE.advanced;
    let advancedCount = 0;

    if (filters.advanced.keywords.length > 0) advancedCount += 1;
    if (filters.advanced.propertyClasses.length > 0) advancedCount += 1;
    if (
      filters.advanced.squareFootage.min !== defaultAdvanced.squareFootage.min ||
      filters.advanced.squareFootage.max !== defaultAdvanced.squareFootage.max
    )
      advancedCount += 1;
    if (filters.advanced.houseStyle.length > 0) advancedCount += 1;
    if (filters.advanced.lotFrontage !== defaultAdvanced.lotFrontage) advancedCount += 1;
    if (filters.advanced.lotDepth !== defaultAdvanced.lotDepth) advancedCount += 1;
    if (filters.advanced.maintenanceFee.min != null || filters.advanced.maintenanceFee.max != null)
      advancedCount += 1;
    if (filters.advanced.propertyTax.min != null || filters.advanced.propertyTax.max != null)
      advancedCount += 1;
    if (filters.advanced.daysOnMarket.min != null || filters.advanced.daysOnMarket.max != null)
      advancedCount += 1;
    if (filters.advanced.garageParking.min != null || filters.advanced.garageParking.max != null)
      advancedCount += 1;
    if (filters.advanced.totalParking.min != null || filters.advanced.totalParking.max != null)
      advancedCount += 1;
    if (filters.advanced.basementFeatures.length > 0) advancedCount += 1;
    if (filters.advanced.propertyAge !== defaultAdvanced.propertyAge) advancedCount += 1;
    if (filters.advanced.swimmingPool !== defaultAdvanced.swimmingPool) advancedCount += 1;
    if (filters.advanced.waterfront !== defaultAdvanced.waterfront) advancedCount += 1;
    if (filters.advanced.openHouse !== defaultAdvanced.openHouse) advancedCount += 1;

    if (advancedCount > 0) {
      items.push({
        label: `Advanced (${advancedCount})`,
        onRemove: () => dispatch({ type: 'ADVANCED_SET_ALL', payload: defaultAdvanced }),
      });
    }

    quickFilters.forEach((tag) => {
      items.push({
        label: tag,
        onRemove: () => onQuickFilterRemove(tag),
      });
    });

    return items;
  }, [dispatch, filters, onQuickFilterRemove, quickFilters]);

  if (activeItems.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Active filters:</span>
        {activeItems.map((item) => (
          <FilterTag key={item.label} label={item.label} onRemove={item.onRemove} />
        ))}
        <button
          type="button"
          onClick={onClearAll}
          className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-700 underline underline-offset-2 transition hover:text-gray-900 whitespace-nowrap"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}


