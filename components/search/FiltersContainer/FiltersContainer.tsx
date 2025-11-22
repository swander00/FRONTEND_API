'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/buttons/Button';
import { cn } from '@/lib/utils';
import {
  FiltersProvider,
  useFiltersReset,
  useFiltersState,
  useFiltersDispatch,
  type FiltersState,
  DEFAULT_FILTERS_STATE,
  type StatusOption,
} from './FiltersContext';
import { PrimaryFilters } from './PrimaryFilters';
import { QuickFilterList } from './QuickFilterChips';
import { ActiveFiltersBar } from './ActiveFiltersBar';
import {
  getQuickFilterUpdate,
  applyQuickFilterToState,
  removeQuickFilterFromState,
  type QuickFilterLabel,
} from '@/lib/filters/quickFilterMapping';

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
  const dispatch = useFiltersDispatch();
  const resetAll = useFiltersReset();
  const [quickFilters, setQuickFilters] = useState<string[]>([]);

  useEffect(() => {
    console.log('[FiltersContainer] Filters changed, calling onFiltersChange:', filters);
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  const handleQuickToggle = (tag: string) => {
    const isCurrentlyActive = quickFilters.includes(tag);
    const label = tag as QuickFilterLabel;

    console.log('[FiltersContainer] Quick filter toggle:', { tag, isCurrentlyActive, currentFilters: filters });

    if (isCurrentlyActive) {
      // Remove the quick filter
      setQuickFilters((prev) => prev.filter((item) => item !== tag));
      
      // Remove from filter state
      const stateUpdate = removeQuickFilterFromState(filters, label);
      console.log('[FiltersContainer] Removing quick filter, state update:', stateUpdate);
      applyStateUpdate(stateUpdate);
    } else {
      // Add the quick filter
      setQuickFilters((prev) => [...prev, tag]);
      
      // Apply to filter state
      const update = getQuickFilterUpdate(label, true);
      console.log('[FiltersContainer] Adding quick filter, update:', update);
      if (update) {
        const stateUpdate = applyQuickFilterToState(filters, update);
        console.log('[FiltersContainer] State update to apply:', stateUpdate);
        applyStateUpdate(stateUpdate);
      }
    }
  };

  const applyStateUpdate = (stateUpdate: Partial<FiltersState>) => {
    console.log('[FiltersContainer] applyStateUpdate called with:', stateUpdate);
    
    // Apply property types
    if (stateUpdate.propertyTypes !== undefined) {
      console.log('[FiltersContainer] Dispatching SET_PROPERTY_TYPES:', stateUpdate.propertyTypes);
      dispatch({ type: 'SET_PROPERTY_TYPES', payload: stateUpdate.propertyTypes });
    }

    // Apply advanced filters - use ADVANCED_SET_ALL to update all at once
    // This ensures all updates are applied together and prevents state inconsistencies
    if (stateUpdate.advanced) {
      // Get current advanced state and merge with updates
      const currentAdvanced = filters.advanced;
      const mergedAdvanced = {
        ...currentAdvanced,
        ...stateUpdate.advanced,
      };
      console.log('[FiltersContainer] Merging advanced filters:', {
        current: currentAdvanced,
        updates: stateUpdate.advanced,
        merged: mergedAdvanced,
      });
      dispatch({ type: 'ADVANCED_SET_ALL', payload: mergedAdvanced });
    }
  };

  const handleQuickRemove = (tag: string) => {
    const label = tag as QuickFilterLabel;
    setQuickFilters((prev) => prev.filter((item) => item !== tag));
    
    // Remove from filter state
    const stateUpdate = removeQuickFilterFromState(filters, label);
    applyStateUpdate(stateUpdate);
  };

  const handleClearAll = () => {
    resetAll();
    setQuickFilters([]);
  };

  const hasQuickFilters = useMemo(() => quickFilters.length > 0, [quickFilters.length]);

  const SaveSearchButton = () => (
    <button
      type="button"
      onClick={onSaveSearch}
      className="group inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-100"
    >
      <svg
        className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
        />
      </svg>
      <span className="whitespace-nowrap">Save Search</span>
    </button>
  );

  return (
    <div className={cn('space-y-4 sm:space-y-5', className)}>
      {primaryHeaderSlot ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:gap-6">
          <div className="w-full flex-shrink-0 sm:w-auto sm:min-w-0 sm:max-w-[100%] md:max-w-[420px] lg:max-w-[480px] xl:max-w-[520px]">
            {primaryHeaderSlot}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:gap-6">
            <div className="min-w-0 flex-1">
              <PrimaryFilters />
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <SaveSearchButton />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:gap-6">
          <div className="min-w-0 flex-1">
            <PrimaryFilters />
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto sm:ml-auto">
            <SaveSearchButton />
          </div>
        </div>
      )}

      <QuickFilterList selected={quickFilters} onToggle={handleQuickToggle} />

      <ActiveFiltersBar
        quickFilters={quickFilters}
        onQuickFilterRemove={handleQuickRemove}
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


