'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { CITIES } from '@/data/cities';
import { cn } from '@/lib/utils';

interface CityDropdownProps {
  value: string | null;
  onChange: (city: string | null) => void;
  className?: string;
}

export function CityDropdown({ value, onChange, className = '' }: CityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSelect = (city: string) => {
    if (city === 'All Cities') {
      onChange(null);
    } else {
      onChange(city === value ? null : city);
    }
    setIsOpen(false);
  };

  return (
    <div className={cn('relative flex-shrink-0', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 min-w-[140px] text-left bg-transparent hover:bg-gray-50 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        aria-label="Select city"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-sm font-medium text-gray-700 flex-1 truncate">
          {value || 'City'}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-500 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto"
          role="listbox"
        >
          <div className="p-2">
            <button
              type="button"
              onClick={() => handleSelect('All Cities')}
              className={cn(
                'w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors duration-150',
                !value || value === 'All Cities'
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
              role="option"
              aria-selected={!value || value === 'All Cities'}
            >
              All Cities
            </button>
            {CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => handleSelect(city)}
                className={cn(
                  'w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors duration-150',
                  value === city
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
                role="option"
                aria-selected={value === city}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

