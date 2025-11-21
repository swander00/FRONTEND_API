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

  const SaveSearchButton = () => (
    <button
      type="button"
      onClick={onSaveSearch}
      className="group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-100"
    >
      <svg
        className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
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
      <span>Save Search</span>
    </button>
  );

  return (
    <div className={cn('space-y-5', className)}>
      {primaryHeaderSlot ? (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <div className="w-full flex-shrink-0 md:w-[400px]">{primaryHeaderSlot}</div>
          <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-6">
            <div className="min-w-0 flex-1">
              <PrimaryFilters />
            </div>
            <div className="flex-shrink-0">
              <SaveSearchButton />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-6">
          <div className="min-w-0 flex-1">
            <PrimaryFilters />
          </div>
          <div className="flex-shrink-0 md:ml-auto">
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


