'use client';

import { useState, useRef, useEffect } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import type { Property } from '@/types/property';
import type { SearchSuggestion } from '@/components/search/FiltersContainer/PrimaryFilters/SearchBar';

interface KeywordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  onListingSelect?: (property: Property) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  className?: string;
}

export function KeywordInput({
  value,
  onChange,
  onSearch,
  onListingSelect,
  onSuggestionSelect,
  placeholder = 'Search by address, MLS#, or neighbourhood',
  className = '',
}: KeywordInputProps) {
  return (
    <div className={`flex-1 min-w-0 ${className}`}>
      <SearchBar
        value={value}
        onChange={onChange}
        onSearch={onSearch}
        onListingSelect={onListingSelect}
        onSuggestionSelect={onSuggestionSelect}
        placeholder={placeholder}
        className="w-full"
        inputClassName="bg-transparent border-0 shadow-none focus:ring-0 text-gray-700 placeholder:text-gray-400 text-sm py-3"
      />
    </div>
  );
}

