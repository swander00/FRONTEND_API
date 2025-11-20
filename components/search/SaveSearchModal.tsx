'use client';

import { useState, useEffect } from 'react';
import { BaseModal } from '@/components/search/FiltersContainer/Shared/Modals/BaseModal';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { cn } from '@/lib/utils';
import type { FiltersState } from '@/components/search/FiltersContainer/FiltersContext';

type SaveSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isClosing?: boolean;
  filters: FiltersState;
  searchTerm?: string;
};

const TRANSITION_DURATION = 220;

export function SaveSearchModal({
  isOpen,
  onClose,
  isClosing = false,
  filters,
  searchTerm = '',
}: SaveSearchModalProps) {
  const { create, isSaving } = useSavedSearches();
  const [name, setName] = useState('');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [alertFrequency, setAlertFrequency] = useState<'instant' | 'daily' | 'weekly' | 'never'>('daily');
  const [error, setError] = useState<string | null>(null);

  // Generate default name from filters
  const generateDefaultName = () => {
    const parts: string[] = [];
    
    if (searchTerm) {
      parts.push(searchTerm);
    }
    
    if (filters.status && filters.status !== 'For Sale') {
      parts.push(filters.status);
    }
    
    if (filters.cities.length > 0) {
      if (filters.cities.length === 1) {
        parts.push(filters.cities[0]);
      } else {
        parts.push(`${filters.cities.length} cities`);
      }
    }
    
    if (filters.price.min || filters.price.max) {
      if (filters.price.min && filters.price.max) {
        parts.push(`$${filters.price.min.toLocaleString()}-$${filters.price.max.toLocaleString()}`);
      } else if (filters.price.min) {
        parts.push(`$${filters.price.min.toLocaleString()}+`);
      } else if (filters.price.max) {
        parts.push(`Up to $${filters.price.max.toLocaleString()}`);
      }
    }

    return parts.length > 0 ? parts.join(' • ') : 'My Search';
  };

  // Set default name when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(generateDefaultName());
    }
  }, [isOpen, filters, searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter a name for your saved search');
      return;
    }

    try {
      // Convert filters to the format expected by the API
      const filtersToSave: Record<string, any> = {
        status: filters.status,
        timeRange: filters.timeRange,
        timeRangeCustomDate: filters.timeRangeCustomDate,
        cities: filters.cities,
        propertyTypes: filters.propertyTypes,
        price: filters.price,
        beds: filters.beds,
        baths: filters.baths,
        advanced: filters.advanced,
      };

      if (searchTerm) {
        filtersToSave.searchTerm = searchTerm;
      }

      await create({
        Name: name.trim(),
        Filters: filtersToSave,
        AlertsEnabled: alertsEnabled,
        AlertFrequency: alertFrequency,
      });

      // Reset form
      setName('');
      setAlertsEnabled(true);
      setAlertFrequency('daily');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save search. Please try again.');
    }
  };

  const handleClose = () => {
    setError(null);
    setName('');
    setAlertsEnabled(true);
    setAlertFrequency('daily');
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-md"
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="text-2xl font-semibold text-gray-900">Save Search</h2>
        <button
          onClick={handleClose}
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close save search modal"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-4">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="search-name" className="block text-sm font-medium text-gray-700">
              Search Name
            </label>
            <input
              id="search-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={generateDefaultName()}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
              autoFocus
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="alerts-enabled"
              type="checkbox"
              checked={alertsEnabled}
              onChange={(e) => setAlertsEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="alerts-enabled" className="text-sm font-medium text-gray-700">
              Enable email alerts for new properties
            </label>
          </div>

          {alertsEnabled && (
            <div>
              <label htmlFor="alert-frequency" className="block text-sm font-medium text-gray-700 mb-2">
                Alert Frequency
              </label>
              <select
                id="alert-frequency"
                value={alertFrequency}
                onChange={(e) => setAlertFrequency(e.target.value as typeof alertFrequency)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="instant">Instant</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="never">Never</option>
              </select>
            </div>
          )}

          <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-1">Search Summary:</p>
            <ul className="space-y-1">
              {searchTerm && <li>• Search: "{searchTerm}"</li>}
              <li>• Status: {filters.status}</li>
              {filters.cities.length > 0 && (
                <li>• Cities: {filters.cities.join(', ')}</li>
              )}
              {filters.propertyTypes.length > 0 && (
                <li>• Types: {filters.propertyTypes.join(', ')}</li>
              )}
              {(filters.price.min || filters.price.max) && (
                <li>
                  • Price: {filters.price.min ? `$${filters.price.min.toLocaleString()}` : 'Any'} - {filters.price.max ? `$${filters.price.max.toLocaleString()}` : 'Any'}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || !name.trim()}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium text-white transition',
              isSaving || !name.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            )}
          >
            {isSaving ? 'Saving...' : 'Save Search'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

