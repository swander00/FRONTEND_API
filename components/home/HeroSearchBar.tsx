'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { PROPERTY_TYPE_GROUPS } from '@/lib/filters/options';
import { CITY_GROUPS } from '@/lib/filters/options';

// Flatten property types for dropdown
const PROPERTY_TYPES = [
  'All',
  ...PROPERTY_TYPE_GROUPS.flatMap(group => group.types),
];

// Flatten cities for autocomplete
const ALL_CITIES = CITY_GROUPS.flatMap(group => group.cities);

interface HeroSearchBarState {
  type: string;
  location: string;
  keyword: string;
}

export function HeroSearchBar() {
  const router = useRouter();
  const [state, setState] = useState<HeroSearchBarState>({
    type: 'All',
    location: '',
    keyword: '',
  });
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter location suggestions
  useEffect(() => {
    if (state.location.trim() && isLocationFocused) {
      const query = state.location.toLowerCase().trim();
      const filtered = ALL_CITIES
        .filter(city => city.toLowerCase().includes(query))
        .slice(0, 5);
      setLocationSuggestions(filtered);
    } else {
      setLocationSuggestions([]);
    }
  }, [state.location, isLocationFocused]);

  const handleTypeSelect = (type: string) => {
    setState(prev => ({ ...prev, type }));
    setIsTypeOpen(false);
  };

  const handleLocationSelect = (city: string) => {
    setState(prev => ({ ...prev, location: city }));
    setLocationSuggestions([]);
    setIsLocationFocused(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    // Set status (default to 'for-sale')
    params.set('status', 'for-sale');
    
    // Build filters object - search page will merge with defaults
    // We only set the fields that have values from the hero search
    const filters: Partial<{
      status: string;
      cities: string[];
      propertyTypes: string[];
      advanced: {
        keywords: string[];
      };
    }> = {
      status: 'For Sale',
    };
    
    // Add property types if not 'All'
    if (state.type !== 'All') {
      filters.propertyTypes = [state.type];
    }
    
    // Add cities if location is provided
    if (state.location.trim()) {
      filters.cities = [state.location.trim()];
    }
    
    // Add keywords if provided
    if (state.keyword.trim()) {
      filters.advanced = {
        keywords: [state.keyword.trim()],
      };
    }
    
    // Store in sessionStorage for search page to pick up
    // Use the same key as saved searches for consistency
    sessionStorage.setItem('savedSearchFilters', JSON.stringify(filters));
    
    router.push(`/search?${params.toString()}`);
  };

  const handleAdvancedClick = () => {
    // Navigate to search page and open advanced filters
    const params = new URLSearchParams();
    params.set('status', 'for-sale');
    router.push(`/search?${params.toString()}`);
    // Advanced filters will be opened by the search page component
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/10 p-2 border border-white/20">
        {/* Type Dropdown */}
        <div className="relative flex-shrink-0" ref={typeDropdownRef}>
          <button
            type="button"
            onClick={() => setIsTypeOpen(!isTypeOpen)}
            className="flex items-center gap-2 px-4 py-3 min-w-[140px] text-left bg-transparent hover:bg-gray-50 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Property type"
            aria-expanded={isTypeOpen}
            aria-haspopup="listbox"
          >
            <span className="text-sm font-medium text-gray-700 flex-1 truncate">
              {state.type}
            </span>
            <ChevronDown 
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isTypeOpen ? 'rotate-180' : ''}`}
            />
          </button>
          
          {isTypeOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
              <div className="p-2">
                {PROPERTY_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors duration-150 ${
                      state.type === type
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200" />

        {/* Location Input */}
        <div className="relative flex-1 min-w-0">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              ref={locationInputRef}
              type="text"
              value={state.location}
              onChange={(e) => setState(prev => ({ ...prev, location: e.target.value }))}
              onFocus={() => setIsLocationFocused(true)}
              onBlur={() => setTimeout(() => setIsLocationFocused(false), 200)}
              onKeyDown={handleKeyDown}
              placeholder="Location"
              className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-0"
              aria-label="Location"
            />
          </div>
          
          {locationSuggestions.length > 0 && isLocationFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
              <div className="p-2">
                {locationSuggestions.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleLocationSelect(city)}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200" />

        {/* Keyword Input */}
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            value={state.keyword}
            onChange={(e) => setState(prev => ({ ...prev, keyword: e.target.value }))}
            onKeyDown={handleKeyDown}
            placeholder="Keywords"
            className="w-full px-4 py-3 bg-transparent text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-0"
            aria-label="Keywords"
          />
        </div>

        {/* Advanced Button */}
        <button
          type="button"
          onClick={handleAdvancedClick}
          className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 whitespace-nowrap"
          aria-label="Advanced filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden lg:inline">Advanced</span>
        </button>

        {/* Search Button */}
        <button
          type="button"
          onClick={handleSearch}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/30 hover:shadow-lg hover:shadow-blue-600/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
          aria-label="Search properties"
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-3">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/10 p-4 border border-white/20 space-y-3">
          {/* Type Dropdown */}
          <div className="relative" ref={typeDropdownRef}>
            <button
              type="button"
              onClick={() => setIsTypeOpen(!isTypeOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label="Property type"
              aria-expanded={isTypeOpen}
            >
              <span className="text-sm font-medium text-gray-700">
                {state.type}
              </span>
              <ChevronDown 
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isTypeOpen ? 'rotate-180' : ''}`}
              />
            </button>
            
            {isTypeOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
                <div className="p-2">
                  {PROPERTY_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeSelect(type)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors duration-150 ${
                        state.type === type
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location Input */}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              ref={locationInputRef}
              type="text"
              value={state.location}
              onChange={(e) => setState(prev => ({ ...prev, location: e.target.value }))}
              onFocus={() => setIsLocationFocused(true)}
              onBlur={() => setTimeout(() => setIsLocationFocused(false), 200)}
              onKeyDown={handleKeyDown}
              placeholder="Location"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-colors"
              aria-label="Location"
            />
            
            {locationSuggestions.length > 0 && isLocationFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  {locationSuggestions.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleLocationSelect(city)}
                      className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Keyword Input */}
          <input
            type="text"
            value={state.keyword}
            onChange={(e) => setState(prev => ({ ...prev, keyword: e.target.value }))}
            onKeyDown={handleKeyDown}
            placeholder="Keywords"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-colors"
            aria-label="Keywords"
          />
        </div>

        {/* Mobile Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleAdvancedClick}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/95 backdrop-blur-sm text-gray-600 hover:text-gray-900 hover:bg-white font-medium rounded-xl shadow-md shadow-black/5 border border-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Advanced filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Advanced</span>
          </button>
          
          <button
            type="button"
            onClick={handleSearch}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/30 hover:shadow-lg hover:shadow-blue-600/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Search properties"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}

