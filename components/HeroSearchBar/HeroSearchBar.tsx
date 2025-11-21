'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { KeywordInput } from './subcomponents/KeywordInput';
import { CityDropdown } from './subcomponents/CityDropdown';
import { PropertyTypeDropdown } from './subcomponents/PropertyTypeDropdown';
import { SearchButton } from './subcomponents/SearchButton';
import { AdvancedFiltersButton } from './subcomponents/AdvancedFiltersButton';
import { AdvancedFiltersModal } from './advanced/AdvancedFiltersModal';
import type { StatusValue } from '@/components/home/StatusToggle';
import type { Property } from '@/types/property';
import type { SearchSuggestion } from '@/components/search/FiltersContainer/PrimaryFilters/SearchBar';
import type { FiltersState } from '@/components/search/FiltersContainer/FiltersContext';
import { DEFAULT_FILTERS_STATE } from '@/components/search/FiltersContainer/FiltersContext';
import type { AdvancedFiltersState } from './advanced/useAdvancedFilters';
import { CITIES } from '@/data/cities';

// Map status values to URL-friendly strings
const STATUS_TO_URL: Record<StatusValue, string> = {
  'For Sale': 'for-sale',
  'For Lease': 'for-lease',
  'Sold': 'sold',
  'Leased': 'leased',
  'Removed': 'removed',
} as const;

interface HeroSearchBarProps {
  selectedStatus: StatusValue;
}

export function HeroSearchBar({ selectedStatus }: HeroSearchBarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string | null>(null);
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFiltersState | null>(null);

  // Check if search term matches a known city
  const isKnownCity = useCallback((term: string): string | null => {
    const normalizedTerm = term.trim();
    if (!normalizedTerm) return null;

    const exactMatch = CITIES.find(
      (city) => city.toLowerCase() === normalizedTerm.toLowerCase()
    );
    if (exactMatch) return exactMatch;

    const partialMatch = CITIES.find((city) =>
      city.toLowerCase().startsWith(normalizedTerm.toLowerCase())
    );
    if (partialMatch) return partialMatch;

    return null;
  }, []);

  // Build filters state for navigation
  const buildFiltersState = useCallback(
    (searchValue?: string, city?: string | null, propertyType?: string | null): FiltersState => {
      const filters: FiltersState = {
        ...DEFAULT_FILTERS_STATE,
        status: selectedStatus,
      };

      // Add property type if selected
      if (propertyType !== null && propertyType !== undefined) {
        filters.propertyTypes = [propertyType];
      }

      // Add city if provided
      if (city) {
        filters.cities = [city];
      }

      // Add search term as keywords
      const keywords: string[] = [];
      if (searchValue && searchValue.trim()) {
        keywords.push(searchValue.trim());
      }

      if (keywords.length > 0) {
        filters.advanced = {
          ...filters.advanced,
          keywords,
        };
      }

      // Merge advanced filters if present
      if (advancedFilters) {
        filters.beds = {
          min: advancedFilters.beds.min,
          max: advancedFilters.beds.max,
        };
        filters.baths = {
          min: advancedFilters.baths.min,
          max: advancedFilters.baths.max,
        };
        filters.price = {
          min: advancedFilters.price.min,
          max: advancedFilters.price.max,
        };
        filters.advanced = {
          ...filters.advanced,
          garageParking: {
            min: advancedFilters.parking.min,
            max: advancedFilters.parking.max,
          },
          squareFootage: {
            min: advancedFilters.squareFootage.min,
            max: advancedFilters.squareFootage.max,
          },
          basementFeatures: advancedFilters.basement,
          propertyAge: advancedFilters.propertyAge,
          swimmingPool: advancedFilters.swimmingPool === true ? 'Yes' : advancedFilters.swimmingPool === false ? 'No' : null,
          waterfront: advancedFilters.waterfront === true ? 'Yes' : advancedFilters.waterfront === false ? 'No' : null,
        };
      }

      return filters;
    },
    [selectedStatus, advancedFilters]
  );

  // Handle search submission
  const handleSearch = useCallback(
    (searchValue?: string) => {
      const params = new URLSearchParams();
      const urlStatus = STATUS_TO_URL[selectedStatus];
      params.set('status', urlStatus);

      const term = searchValue || searchTerm;
      const trimmedTerm = term.trim();

      // Check if search term matches a known city
      const matchedCity = trimmedTerm ? isKnownCity(trimmedTerm) : null;
      const cityToUse = selectedCity || matchedCity;

      // Build filters
      const filters = buildFiltersState(trimmedTerm || undefined, cityToUse, selectedPropertyType);

      // Store filters in sessionStorage for search page to pick up
      sessionStorage.setItem('savedSearchFilters', JSON.stringify(filters));

      router.push(`/search?${params.toString()}`);
    },
    [selectedStatus, searchTerm, selectedCity, selectedPropertyType, buildFiltersState, isKnownCity, router]
  );

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback(
    (suggestion: SearchSuggestion) => {
      const params = new URLSearchParams();
      const urlStatus = STATUS_TO_URL[selectedStatus];
      params.set('status', urlStatus);

      // Handle different suggestion types
      if (suggestion.type === 'listing' && suggestion.mlsNumber) {
        router.push(`/property/${suggestion.mlsNumber}`);
        return;
      }

      let cities: string[] | undefined;
      let searchTermValue: string | undefined;

      if (suggestion.type === 'city' || suggestion.type === 'community') {
        if (suggestion.name) {
          cities = [suggestion.name];
          searchTermValue = suggestion.name;
        }
      } else if (suggestion.type === 'listing') {
        if (suggestion.locationLine) {
          const city = suggestion.locationLine.split(',')[0]?.trim();
          if (city) {
            cities = [city];
          }
        }
        if (suggestion.addressLine) {
          searchTermValue = suggestion.addressLine;
        }
      }

      const filters = buildFiltersState(searchTermValue, cities?.[0], selectedPropertyType);
      sessionStorage.setItem('savedSearchFilters', JSON.stringify(filters));
      router.push(`/search?${params.toString()}`);
    },
    [selectedStatus, selectedPropertyType, buildFiltersState, router]
  );

  // Handle property listing selection
  const handleListingSelect = useCallback(
    (property: Property) => {
      if (property.mlsNumber) {
        router.push(`/property/${property.mlsNumber}`);
      }
    },
    [router]
  );

  // Handle advanced filters apply
  const handleAdvancedFiltersApply = useCallback((filters: AdvancedFiltersState) => {
    setAdvancedFilters(filters);
    setIsAdvancedModalOpen(false);
    // Optionally trigger search with new filters
    // handleSearch();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/10 p-2 border border-white/20">
        {/* Keyword Input */}
        <KeywordInput
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          onListingSelect={handleListingSelect}
          onSuggestionSelect={handleSuggestionSelect}
          className="flex-1"
        />

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200" aria-hidden="true" />

        {/* City Dropdown */}
        <CityDropdown value={selectedCity} onChange={setSelectedCity} />

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200" aria-hidden="true" />

        {/* Property Type Dropdown */}
        <PropertyTypeDropdown value={selectedPropertyType} onChange={setSelectedPropertyType} />

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200" aria-hidden="true" />

        {/* Advanced Filters Button */}
        <AdvancedFiltersButton onClick={() => setIsAdvancedModalOpen(true)} />

        {/* Search Button */}
        <SearchButton onClick={() => handleSearch()} />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-3">
        {/* Row 1: Keyword */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/10 p-4 border border-white/20">
          <KeywordInput
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            onListingSelect={handleListingSelect}
            onSuggestionSelect={handleSuggestionSelect}
            className="w-full"
          />
        </div>

        {/* Row 2: City | Type | Filters */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/10 p-4 border border-white/20">
          <div className="grid grid-cols-3 gap-3">
            <CityDropdown value={selectedCity} onChange={setSelectedCity} />
            <PropertyTypeDropdown value={selectedPropertyType} onChange={setSelectedPropertyType} />
            <AdvancedFiltersButton onClick={() => setIsAdvancedModalOpen(true)} />
          </div>
        </div>

        {/* Search Button */}
        <div className="w-full">
          <SearchButton onClick={() => handleSearch()} className="w-full" />
        </div>
      </div>

      {/* Advanced Filters Modal */}
      <AdvancedFiltersModal
        isOpen={isAdvancedModalOpen}
        onClose={() => setIsAdvancedModalOpen(false)}
        onApply={handleAdvancedFiltersApply}
        initialFilters={advancedFilters || undefined}
      />
    </div>
  );
}

