'use client';

import { useEffect, useState } from 'react';
import { BaseModal } from '@/components/search/FiltersContainer/Shared/Modals/BaseModal';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { SavedSearch } from '@/lib/api/saved-searches';

type SavedSearchesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isClosing?: boolean;
};

const TRANSITION_DURATION = 220;

export function SavedSearchesModal({
  isOpen,
  onClose,
  isClosing = false,
}: SavedSearchesModalProps) {
  const router = useRouter();
  const { searches, isLoading, error, remove } = useSavedSearches();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this saved search?')) {
      return;
    }

    setDeletingId(id);
    try {
      await remove(id);
    } catch (err) {
      console.error('Failed to delete saved search:', err);
      alert('Failed to delete saved search. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearchClick = (search: SavedSearch) => {
    // Navigate to search page with filters applied
    const filters = search.Filters;
    const params = new URLSearchParams();
    
    // Map status to URL param
    if (filters.status) {
      const statusMap: Record<string, string> = {
        'For Sale': 'for-sale',
        'For Lease': 'for-lease',
        'Sold': 'sold',
        'Leased': 'leased',
        'Removed': 'removed',
      };
      const urlStatus = statusMap[filters.status as string] || 'for-sale';
      params.set('status', urlStatus);
    } else {
      params.set('status', 'for-sale');
    }

    // Store filters in sessionStorage to be picked up by search page
    sessionStorage.setItem('savedSearchFilters', JSON.stringify(filters));
    
    router.push(`/search?${params.toString()}`);
    onClose();
  };

  const formatAlertFrequency = (frequency: string) => {
    const map: Record<string, string> = {
      instant: 'Instant',
      daily: 'Daily',
      weekly: 'Weekly',
      never: 'Never',
    };
    return map[frequency] || frequency;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      isClosing={isClosing}
      transitionDuration={TRANSITION_DURATION}
      className="max-w-4xl"
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Saved Searches</h2>
          <p className="mt-1 text-sm text-gray-500">
            {searches.length > 0 
              ? `${searches.length} ${searches.length === 1 ? 'saved search' : 'saved searches'}` 
              : 'No saved searches yet'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close saved searches modal"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-4">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-600">Loading saved searches...</div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-800">
            <p className="font-medium">Error loading saved searches</p>
            <p className="mt-1 text-sm">{error.message}</p>
          </div>
        )}

        {!isLoading && !error && searches.length === 0 && (
          <div className="py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No saved searches yet</h3>
            <p className="mt-2 text-sm text-gray-600">
              Save your search filters to get notified about new properties matching your criteria.
            </p>
          </div>
        )}

        {!isLoading && !error && searches.length > 0 && (
          <div className="space-y-3">
            {searches.map((search) => (
              <div
                key={search.Id}
                onClick={() => handleSearchClick(search)}
                className={cn(
                  'group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-md',
                  deletingId === search.Id && 'opacity-50'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{search.Name}</h3>
                      {search.NewResultsCount > 0 && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          {search.NewResultsCount} new
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                      {search.Filters.status && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Status:</span>
                          {search.Filters.status}
                        </span>
                      )}
                      {search.Filters.cities && Array.isArray(search.Filters.cities) && search.Filters.cities.length > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Cities:</span>
                          {search.Filters.cities.slice(0, 2).join(', ')}
                          {search.Filters.cities.length > 2 && ` +${search.Filters.cities.length - 2} more`}
                        </span>
                      )}
                      {search.Filters.price && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Price:</span>
                          {search.Filters.price.min 
                            ? `$${search.Filters.price.min.toLocaleString()}${search.Filters.price.max ? ` - $${search.Filters.price.max.toLocaleString()}` : '+'}`
                            : search.Filters.price.max 
                            ? `Up to $${search.Filters.price.max.toLocaleString()}`
                            : 'Any'}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {search.AlertsEnabled ? formatAlertFrequency(search.AlertFrequency) : 'Alerts off'}
                      </span>
                      <span>Created {formatDate(search.CreatedAt)}</span>
                      {search.LastRunAt && (
                        <span>Last run {formatDate(search.LastRunAt)}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDelete(search.Id, e)}
                    disabled={deletingId === search.Id}
                    className={cn(
                      'ml-4 rounded-lg p-2 text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100',
                      deletingId === search.Id && 'opacity-100'
                    )}
                    aria-label="Delete saved search"
                  >
                    {deletingId === search.Id ? (
                      <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseModal>
  );
}

