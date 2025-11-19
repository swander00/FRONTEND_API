'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/buttons/Button';
import { cn } from '@/lib/utils';
import {
  FiltersProvider,
  useFiltersReset,
  useFiltersState,
  type FiltersState,
  DEFAULT_FILTERS_STATE,
  type StatusOption,
} from './FiltersContext';
import { PrimaryFilters } from './PrimaryFilters';
import { QuickFilterList } from './QuickFilterChips';
import { ActiveFiltersBar } from './ActiveFiltersBar';

export type FiltersContainerProps = {
  onFiltersChange?: (filters: FiltersState) => void;
  onSaveSearch: () => void;
  className?: string;
  primaryHeaderSlot?: ReactNode;
  initialStatus?: StatusOption;
};

export function FiltersContainer({
  onFiltersChange,
  onSaveSearch,
  className,
  primaryHeaderSlot,
  initialStatus,
}: FiltersContainerProps) {
  return (
    <FiltersProvider initialStatus={initialStatus}>
      <FiltersContainerInner
        className={className}
        onFiltersChange={onFiltersChange}
        onSaveSearch={onSaveSearch}
        primaryHeaderSlot={primaryHeaderSlot}
      />
    </FiltersProvider>
  );
}

function FiltersContainerInner({
  onFiltersChange,
  onSaveSearch,
  className,
  primaryHeaderSlot,
}: Omit<FiltersContainerProps, 'onFiltersChange'> & {
  onFiltersChange?: FiltersContainerProps['onFiltersChange'];
}) {
  const filters = useFiltersState();
  const resetAll = useFiltersReset();
  const [quickFilters, setQuickFilters] = useState<string[]>([]);

  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  const handleQuickToggle = (tag: string) => {
    setQuickFilters((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  };

  const handleQuickRemove = (tag: string) => {
    setQuickFilters((prev) => prev.filter((item) => item !== tag));
  };

  const handleClearAll = () => {
    resetAll();
    setQuickFilters([]);
  };

  const hasQuickFilters = useMemo(() => quickFilters.length > 0, [quickFilters.length]);
  const hasSelections = useMemo(() => {
    const defaults = DEFAULT_FILTERS_STATE;
    const price = filters.price;
    const beds = filters.beds;
    const baths = filters.baths;
    const advanced = filters.advanced;
    const advancedDefaults = defaults.advanced;

    const hasPrimarySelections =
      filters.status !== defaults.status ||
      filters.timeRange !== defaults.timeRange ||
      filters.cities.length > 0 ||
      filters.propertyTypes.length > 0 ||
      price.preset !== 'Any' ||
      price.min != null ||
      price.max != null ||
      beds.preset !== 'Any' ||
      beds.min != null ||
      beds.max != null ||
      beds.exact != null ||
      baths.preset !== 'Any' ||
      baths.min != null ||
      baths.max != null ||
      baths.exact != null;

    const hasAdvancedSelections =
      advanced.keywords.length > 0 ||
      advanced.propertyClasses.length > 0 ||
      advanced.squareFootage.min !== advancedDefaults.squareFootage.min ||
      advanced.squareFootage.max !== advancedDefaults.squareFootage.max ||
      advanced.houseStyle !== advancedDefaults.houseStyle ||
      advanced.lotFrontage !== advancedDefaults.lotFrontage ||
      advanced.lotDepth !== advancedDefaults.lotDepth ||
      advanced.maintenanceFee.preset !== advancedDefaults.maintenanceFee.preset ||
      advanced.maintenanceFee.min != null ||
      advanced.maintenanceFee.max != null ||
      advanced.propertyTax.preset !== advancedDefaults.propertyTax.preset ||
      advanced.propertyTax.min != null ||
      advanced.propertyTax.max != null ||
      advanced.daysOnMarket.preset !== advancedDefaults.daysOnMarket.preset ||
      advanced.daysOnMarket.min != null ||
      advanced.daysOnMarket.max != null ||
      advanced.garageParking.preset !== advancedDefaults.garageParking.preset ||
      advanced.garageParking.min != null ||
      advanced.garageParking.max != null ||
      advanced.totalParking.preset !== advancedDefaults.totalParking.preset ||
      advanced.totalParking.min != null ||
      advanced.totalParking.max != null ||
      advanced.basementFeatures.length > 0 ||
      advanced.propertyAge !== advancedDefaults.propertyAge ||
      advanced.swimmingPool !== advancedDefaults.swimmingPool ||
      advanced.waterfront !== advancedDefaults.waterfront ||
      advanced.openHouse !== advancedDefaults.openHouse;

    return hasPrimarySelections || hasAdvancedSelections || hasQuickFilters;
  }, [filters, hasQuickFilters]);

  const renderActionButtons = () =>
    !hasSelections ? null : (
      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap sm:justify-end md:ml-auto md:gap-3">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={onSaveSearch}
        >
          Save Search
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={handleClearAll}
        >
          Reset
        </Button>
      </div>
    );

  return (
    <div className={cn('space-y-5', className)}>
      {primaryHeaderSlot ? (
        <div className="flex flex-col gap-3 md:flex-row md:flex-nowrap md:items-center md:gap-4">
          <div className="w-full md:w-[400px]">{primaryHeaderSlot}</div>
          <div className="flex-1 md:flex-none">
            <PrimaryFilters />
          </div>
          {renderActionButtons()}
        </div>
      ) : (
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-4">
          <PrimaryFilters />
          {renderActionButtons()}
        </div>
      )}

      <QuickFilterList selected={quickFilters} onToggle={handleQuickToggle} />

      <ActiveFiltersBar
        quickFilters={quickFilters}
        onQuickFilterRemove={handleQuickRemove}
        onSaveSearch={onSaveSearch}
        onClearAll={handleClearAll}
      />

      {!hasQuickFilters ? null : (
        <p className="text-xs text-gray-500">
          Quick filters help you explore popular property features. These do not affect advanced filters.
        </p>
      )}
    </div>
  );
}


