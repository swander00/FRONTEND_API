'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SearchInput } from '@/components/ui/inputs/SearchInput';
import { SuggestionsCard, type SearchSuggestion } from '@/components/search/FiltersContainer/PrimaryFilters/SearchBar';
import { CITY_GROUPS } from '@/lib/filters/options';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type { Property } from '@/types/property';
import { usePropertySearch } from '@/hooks/usePropertySearch';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  onSearch?: (value: string) => void;
  onListingSelect?: (property: Property) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
};

type PreparedSuggestion = {
  suggestion: SearchSuggestion;
  searchTargets: string[];
};

const TYPE_PRIORITY: Record<SearchSuggestion['type'], number> = {
  listing: 0,  // Listings first (highest priority)
  city: 1,      // Cities second
  community: 2, // Communities third
};

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

const isLooseSubsequence = (query: string, target: string) => {
  if (query.length === 0) {
    return true;
  }
  let qi = 0;
  for (let i = 0; i < target.length && qi < query.length; i += 1) {
    if (target[i] === query[qi]) {
      qi += 1;
    }
  }
  return qi === query.length;
};

const levenshtein = (a: string, b: string) => {
  const aLen = a.length;
  const bLen = b.length;

  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;

  const matrix: number[][] = Array.from({ length: aLen + 1 }, () =>
    Array(bLen + 1).fill(0)
  );

  for (let i = 0; i <= aLen; i += 1) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= bLen; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= aLen; i += 1) {
    for (let j = 1; j <= bLen; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[aLen][bLen];
};

const computeMatchScore = (query: string, target: string) => {
  if (!query || !target) {
    return Number.POSITIVE_INFINITY;
  }

  if (target === query) {
    return 0;
  }
  if (target.startsWith(query)) {
    return 0.05;
  }
  if (target.includes(query)) {
    return 0.15;
  }

  const distance = levenshtein(query, target);
  const maxLen = Math.max(query.length, target.length) || 1;
  const base = distance / maxLen;

  if (isLooseSubsequence(query, target)) {
    return base + 0.35;
  }

  return base + 0.5;
};

// Stricter matching for cities/communities - only match city names directly
const computeCityMatchScore = (query: string, cityName: string) => {
  if (!query || !cityName) {
    return Number.POSITIVE_INFINITY;
  }

  const normalizedCity = normalize(cityName);
  const normalizedQuery = normalize(query);

  // Exact match
  if (normalizedCity === normalizedQuery) {
    return 0;
  }

  // Prefix match (city name starts with query)
  if (normalizedCity.startsWith(normalizedQuery)) {
    return 0.05;
  }

  // For typos, use Levenshtein but with stricter threshold
  // Only allow fuzzy match if query is at least 3 characters and similarity is high
  if (normalizedQuery.length >= 3) {
    const distance = levenshtein(normalizedQuery, normalizedCity);
    const maxLen = Math.max(normalizedQuery.length, normalizedCity.length);
    const similarity = 1 - (distance / maxLen);
    
    // Only allow fuzzy match if similarity is > 0.7 (strict threshold for typos)
    if (similarity > 0.7) {
      return 0.3 + (1 - similarity); // Lower score = better match
    }
  }

  // No match
  return Number.POSITIVE_INFINITY;
};

const formatSquareFootageRange = (squareFootage?: Property['squareFootage']) => {
  if (!squareFootage) {
    return undefined;
  }

  const { min, max } = squareFootage;

  if (typeof min === 'number' && typeof max === 'number') {
    return `${min.toLocaleString()} – ${max.toLocaleString()} sq.ft.`;
  }

  if (typeof min === 'number') {
    return `${min.toLocaleString()}+ sq.ft.`;
  }

  if (typeof max === 'number') {
    return `Up to ${max.toLocaleString()} sq.ft.`;
  }

  return undefined;
};

const toListingSuggestion = (property: Property): PreparedSuggestion => {
  const addressLine = property.address?.street || property.address?.unparsedAddress || '';
  const locationLine = property.address?.city && property.address?.province
    ? `${property.address.city}, ${property.address.province}`
    : '';
  const suggestion: SearchSuggestion = {
    id: property.id,
    type: 'listing',
    addressLine,
    locationLine,
    price: property.price,
    priceFormatted: formatCurrency(property.price),
    mlsNumber: property.mlsNumber,
    mlsStatus: property.mlsStatus,
    status: property.status,
    originalEntryTimestamp: property.originalEntryTimestamp || undefined,
    statusDates: property.statusDates,
    beds: property.bedrooms.above || undefined,
    additionalBeds: property.bedrooms.below || undefined,
    baths: property.bathrooms || undefined,
    sqftRange: formatSquareFootageRange(property.squareFootage),
    propertySubType: property.propertySubType,
    thumbnailUrl: property.images[0],
  };

  const searchTargets = [
    addressLine,
    locationLine,
    property.address?.street,
    property.address?.city,
    property.location?.neighborhood,
    property.mlsNumber,
    property.propertySubType,
    property.architecturalStyle,
  ].filter(Boolean) as string[];

  return {
    suggestion,
    searchTargets,
  };
};

const prepareLocationSuggestions = (): PreparedSuggestion[] => {
  const citySuggestions: PreparedSuggestion[] = CITY_GROUPS.flatMap((group) =>
    group.cities.map((city) => ({
      suggestion: {
        id: `city-${toSlug(city)}`,
        type: 'city' as const,
        name: city,
        subtitle: group.region,
      },
      searchTargets: [city, group.region],
    }))
  );

  return citySuggestions;
};

// Local search for city suggestions (static data)
// Cities should ONLY match when query directly matches city name (exact, prefix, or close typo)
const findLocalSuggestions = (query: string): SearchSuggestion[] => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery || normalizedQuery.length < 2) {
    return [];
  }

  const citySuggestions = prepareLocationSuggestions();
  const scored = citySuggestions.map(({ suggestion }) => {
    // For cities, only match against the city name itself (not region)
    // Use stricter matching that only allows exact, prefix, or close typo matches
    const cityName = suggestion.type === 'city' ? suggestion.name || '' : '';
    const score = computeCityMatchScore(normalizedQuery, cityName);
    const typeWeight = TYPE_PRIORITY[suggestion.type] * 0.05;
    return {
      suggestion,
      rawScore: score,
      score: score + typeWeight,
    };
  }).filter((entry) => Number.isFinite(entry.score));

  scored.sort((a, b) => {
    if (a.score === b.score) {
      return TYPE_PRIORITY[a.suggestion.type] - TYPE_PRIORITY[b.suggestion.type];
    }
    return a.score - b.score;
  });

  // Stricter threshold: only show cities with very good matches (exact, prefix, or close typo)
  // Threshold of 0.4 ensures we only show exact matches, prefix matches, or very close typos
  const filtered = scored.filter((entry) => entry.rawScore <= 0.4);

  return filtered.slice(0, 3).map((entry) => entry.suggestion);
};

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search by MLS, address, city, or community...',
  className,
  inputClassName,
  onSearch,
  onListingSelect,
  onSuggestionSelect,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search query for API calls (only search if query is 2+ characters)
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    const trimmed = value.trim();
    if (trimmed.length >= 2) {
      debounceTimeoutRef.current = setTimeout(() => {
        setDebouncedQuery(trimmed);
      }, 300); // 300ms debounce
    } else {
      setDebouncedQuery('');
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [value]);

  // Use API search for property/listing suggestions
  const { suggestions: apiSuggestions, results: apiResults, loading: apiLoading } = usePropertySearch({
    query: debouncedQuery,
    limit: 7,
    enabled: debouncedQuery.length >= 2,
  });

  const cancelBlurTimeout = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  }, []);

  const trimmedValue = value.trim();
  
  // Combine local city suggestions with API suggestions
  const suggestions = useMemo(() => {
    const localSuggestions = findLocalSuggestions(trimmedValue);
    
    // Use API suggestions if available, otherwise convert properties to suggestions
    let apiSearchSuggestions: SearchSuggestion[] = [];
    
    console.log('[SearchBar] Combining suggestions:', {
      trimmedValue,
      apiSuggestionsCount: apiSuggestions?.length || 0,
      apiSuggestions,
      apiResultsCount: apiResults?.length || 0,
      localSuggestionsCount: localSuggestions.length,
    });
    
    if (apiSuggestions && apiSuggestions.length > 0) {
      // Suggestions from usePropertySearch are already SearchSuggestion objects
      // API only returns listing suggestions, so we can safely cast them
      apiSearchSuggestions = apiSuggestions.filter(s => s.type === 'listing') as SearchSuggestion[];
      console.log('[SearchBar] Using API suggestions directly:', apiSearchSuggestions);
    } else if (apiResults && apiResults.length > 0) {
      // Convert properties to suggestions if API returns properties instead
      apiSearchSuggestions = apiResults.map((property) => {
        const suggestion = toListingSuggestion(property);
        return suggestion.suggestion;
      });
    }
    
    // Prioritize: listings first, then cities/communities
    // Sort by type priority to ensure correct ordering
    const combined = [...apiSearchSuggestions, ...localSuggestions]
      .sort((a, b) => TYPE_PRIORITY[a.type] - TYPE_PRIORITY[b.type])
      .slice(0, 7);
    console.log('[SearchBar] Final combined suggestions:', combined);
    return combined;
  }, [trimmedValue, apiSuggestions, apiResults]);

  const shouldShowDropdown = isFocused && trimmedValue.length > 0;
  const hasSuggestions = suggestions.length > 0 || apiLoading;

  const handleFocus = () => {
    cancelBlurTimeout();
    setIsFocused(true);
  };

  const handleBlur = () => {
    cancelBlurTimeout();
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
    }, 120);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      cancelBlurTimeout();
      setIsFocused(false);
    }
  };

  const handleSuggestionSelect = useCallback(
    (suggestion: SearchSuggestion) => {
      // Call custom suggestion handler if provided
      if (onSuggestionSelect) {
        onSuggestionSelect(suggestion);
        cancelBlurTimeout();
        setIsFocused(false);
        return;
      }

      let nextValue: string;
      if (suggestion.type === 'listing') {
        // For API suggestions, we need to fetch the property if needed
        // For now, just use the suggestion data
        const location = suggestion.locationLine
          ? `, ${suggestion.locationLine}`
          : '';
        nextValue = `${suggestion.addressLine || ''}${location}`;
        
        // If we have property data from API results, pass it to parent
        if (suggestion.id && onListingSelect) {
          // Try to find property in API results or suggestions
          const apiProperty = apiResults?.find(p => p.id === suggestion.id || p.listingKey === suggestion.id);
          if (apiProperty) {
            onListingSelect(apiProperty);
          }
        }
      } else {
        nextValue = suggestion.name || '';
      }

      onChange(nextValue);
      onSearch?.(nextValue);
      cancelBlurTimeout();
      setIsFocused(false);
    },
    [cancelBlurTimeout, onChange, onListingSelect, onSearch, onSuggestionSelect, apiResults]
  );

  useEffect(() => () => cancelBlurTimeout(), [cancelBlurTimeout]);

  return (
    <div className={cn('relative w-full', className)}>
      <SearchInput
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        onSearch={onSearch}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        containerClassName="w-full"
        className={cn('w-full', inputClassName)}
      />

      {shouldShowDropdown && (
        <div
          className={cn(
            'absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 max-h-[26rem] overflow-y-auto rounded-3xl border border-slate-200 bg-white/90 p-3 text-left shadow-2xl backdrop-blur transition'
          )}
          onMouseDown={(event) => {
            event.preventDefault();
            cancelBlurTimeout();
          }}
        >
          {apiLoading && trimmedValue.length >= 2 ? (
            <div className="px-4 py-6 text-sm text-slate-500">
              Searching...
            </div>
          ) : hasSuggestions ? (
            <div className="flex flex-col gap-2">
              {suggestions.map((suggestion) => (
                <SuggestionsCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onSelect={handleSuggestionSelect}
                />
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-sm text-slate-500">
              {trimmedValue.length < 2 
                ? 'Type at least 2 characters to search...'
                : 'No matches yet—keep typing to see suggestions.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
