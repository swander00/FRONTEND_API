'use client';

import { useRef, useEffect } from 'react';

export type StatusValue = 'For Sale' | 'For Rent' | 'Sold' | 'Leased' | 'Removed';

export interface StatusToggleProps {
  value: StatusValue;
  onChange: (status: StatusValue) => void;
}

const STATUSES: Array<{ label: string; value: StatusValue }> = [
  { label: 'For Sale', value: 'For Sale' },
  { label: 'For Rent', value: 'For Rent' },
  { label: 'Sold', value: 'Sold' },
  { label: 'Leased', value: 'Leased' },
  { label: 'Removed', value: 'Removed' },
];

export function StatusToggle({ value, onChange }: StatusToggleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to active button on mobile when value changes
  useEffect(() => {
    if (activeButtonRef.current && containerRef.current) {
      const container = containerRef.current;
      const button = activeButtonRef.current;
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      
      // Check if button is outside visible area
      const isOverflowing = 
        buttonRect.left < containerRect.left ||
        buttonRect.right > containerRect.right;
      
      if (isOverflowing) {
        // Scroll to center the active button
        const scrollLeft = 
          button.offsetLeft - 
          container.offsetWidth / 2 + 
          button.offsetWidth / 2;
        
        container.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: 'smooth',
        });
      }
    }
  }, [value]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Glassmorphism container with full width matching search bar */}
      <div
        ref={containerRef}
        className="flex gap-2 bg-white/20 backdrop-blur-xl rounded-[24px] shadow-lg shadow-black/10 px-4 py-2 border border-white/30 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        role="group"
        aria-label="Property status filter"
      >
        {STATUSES.map((status) => {
          const isActive = value === status.value;

          return (
            <button
              key={status.value}
              ref={isActive ? activeButtonRef : null}
              type="button"
              onClick={() => onChange(status.value)}
              className={`
                flex-1
                px-4 py-2.5
                text-sm font-semibold
                rounded-full
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:z-10
                whitespace-nowrap
                relative
                ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105 z-10'
                    : 'bg-transparent text-gray-300 border border-white/30 hover:text-white hover:border-white/50'
                }
              `}
              aria-pressed={isActive}
              aria-label={`Filter by ${status.label}`}
            >
              <span className="relative z-10">{status.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
