'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useAdvancedFilters, type AdvancedFiltersState } from './useAdvancedFilters';
import { BASEMENT_FEATURE_OPTIONS } from '@/lib/filters/options';
import { cn } from '@/lib/utils';

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: AdvancedFiltersState) => void;
  initialFilters?: Partial<AdvancedFiltersState>;
}

export function AdvancedFiltersModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}: AdvancedFiltersModalProps) {
  const {
    filters,
    updateBeds,
    updateBaths,
    updateParking,
    updatePrice,
    toggleBasement,
    updateSquareFootage,
    updatePropertyAge,
    updateSwimmingPool,
    updateWaterfront,
    reset,
  } = useAdvancedFilters();

  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize filters from props when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialFilters) {
        // Apply initial filters
        if (initialFilters.beds) {
          updateBeds(initialFilters.beds.min, initialFilters.beds.max);
        }
        if (initialFilters.baths) {
          updateBaths(initialFilters.baths.min, initialFilters.baths.max);
        }
        if (initialFilters.parking) {
          updateParking(initialFilters.parking.min, initialFilters.parking.max);
        }
        if (initialFilters.price) {
          updatePrice(initialFilters.price.min, initialFilters.price.max);
        }
        if (initialFilters.squareFootage) {
          updateSquareFootage(initialFilters.squareFootage.min, initialFilters.squareFootage.max);
        }
        if (initialFilters.propertyAge !== undefined) {
          updatePropertyAge(initialFilters.propertyAge);
        }
        if (initialFilters.swimmingPool !== undefined) {
          updateSwimmingPool(initialFilters.swimmingPool);
        }
        if (initialFilters.waterfront !== undefined) {
          updateWaterfront(initialFilters.waterfront);
        }
        // Handle basement features - need to clear and set
        if (initialFilters.basement) {
          // Reset first to clear any existing basement selections
          reset();
          // Then apply all filters including basement
          if (initialFilters.beds) updateBeds(initialFilters.beds.min, initialFilters.beds.max);
          if (initialFilters.baths) updateBaths(initialFilters.baths.min, initialFilters.baths.max);
          if (initialFilters.parking) updateParking(initialFilters.parking.min, initialFilters.parking.max);
          if (initialFilters.price) updatePrice(initialFilters.price.min, initialFilters.price.max);
          if (initialFilters.squareFootage) updateSquareFootage(initialFilters.squareFootage.min, initialFilters.squareFootage.max);
          if (initialFilters.propertyAge !== undefined) updatePropertyAge(initialFilters.propertyAge);
          if (initialFilters.swimmingPool !== undefined) updateSwimmingPool(initialFilters.swimmingPool);
          if (initialFilters.waterfront !== undefined) updateWaterfront(initialFilters.waterfront);
          initialFilters.basement.forEach((f) => toggleBasement(f));
        }
      } else {
        // Reset when opening without initial filters
        reset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="advanced-filters-title"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div
        ref={modalRef}
        className="relative z-10 flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 id="advanced-filters-title" className="text-lg font-semibold text-gray-900">
              Advanced Filters
            </h2>
            <p className="text-sm text-gray-500">Refine your search with detailed filters</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-sm font-medium text-gray-500 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close advanced filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Beds */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.beds.min || ''}
                  onChange={(e) => updateBeds(e.target.value ? parseInt(e.target.value) : null, filters.beds.max)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.beds.max || ''}
                  onChange={(e) => updateBeds(filters.beds.min, e.target.value ? parseInt(e.target.value) : null)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Baths */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.baths.min || ''}
                  onChange={(e) => updateBaths(e.target.value ? parseInt(e.target.value) : null, filters.baths.max)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.baths.max || ''}
                  onChange={(e) => updateBaths(filters.baths.min, e.target.value ? parseInt(e.target.value) : null)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={filters.price.min || ''}
                  onChange={(e) => updatePrice(e.target.value ? parseInt(e.target.value) : null, filters.price.max)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max $"
                  value={filters.price.max || ''}
                  onChange={(e) => updatePrice(filters.price.min, e.target.value ? parseInt(e.target.value) : null)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Parking */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parking Spaces</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.parking.min || ''}
                  onChange={(e) => updateParking(e.target.value ? parseInt(e.target.value) : null, filters.parking.max)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.parking.max || ''}
                  onChange={(e) => updateParking(filters.parking.min, e.target.value ? parseInt(e.target.value) : null)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Square Footage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Square Footage</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min sq.ft"
                  value={filters.squareFootage.min || ''}
                  onChange={(e) => updateSquareFootage(e.target.value ? parseInt(e.target.value) : null, filters.squareFootage.max)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max sq.ft"
                  value={filters.squareFootage.max || ''}
                  onChange={(e) => updateSquareFootage(filters.squareFootage.min, e.target.value ? parseInt(e.target.value) : null)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Basement Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Basement Features</label>
              <div className="flex flex-wrap gap-2">
                {BASEMENT_FEATURE_OPTIONS.map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleBasement(feature)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      filters.basement.includes(feature)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Age</label>
              <select
                value={filters.propertyAge || ''}
                onChange={(e) => updatePropertyAge(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Age</option>
                <option value="New">New</option>
                <option value="0-5">0-5 years</option>
                <option value="6-15">6-15 years</option>
                <option value="16-30">16-30 years</option>
                <option value="31-50">31-50 years</option>
                <option value="51+">51+ years</option>
              </select>
            </div>

            {/* Swimming Pool */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Swimming Pool</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateSwimmingPool(null)}
                  className={cn(
                    'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    filters.swimmingPool === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  Any
                </button>
                <button
                  type="button"
                  onClick={() => updateSwimmingPool(true)}
                  className={cn(
                    'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    filters.swimmingPool === true
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => updateSwimmingPool(false)}
                  className={cn(
                    'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    filters.swimmingPool === false
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  No
                </button>
              </div>
            </div>

            {/* Waterfront */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Waterfront</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateWaterfront(null)}
                  className={cn(
                    'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    filters.waterfront === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  Any
                </button>
                <button
                  type="button"
                  onClick={() => updateWaterfront(true)}
                  className={cn(
                    'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    filters.waterfront === true
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => updateWaterfront(false)}
                  className={cn(
                    'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    filters.waterfront === false
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-gray-500">Refine your search with advanced filters</div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-lg border border-transparent bg-gray-200 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

