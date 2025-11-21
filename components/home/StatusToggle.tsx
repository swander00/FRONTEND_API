'use client';

import { useRef, useEffect } from 'react';
import { STATUS_OPTIONS } from '@/lib/filters/options';

export type StatusValue = 'For Sale' | 'For Lease' | 'Sold' | 'Leased' | 'Removed';

export interface StatusToggleProps {
  value: StatusValue;
  onChange: (status: StatusValue) => void;
}

// Enhanced status configuration with solid colors
const STATUSES: Array<{ 
  label: string; 
  value: StatusValue; 
  activeBg: string;
  activeText: string;
}> = [
  { 
    label: 'For Sale', 
    value: 'For Sale', 
    activeBg: 'bg-blue-600',
    activeText: 'text-white',
  },
  { 
    label: 'For Lease', 
    value: 'For Lease', 
    activeBg: 'bg-purple-600',
    activeText: 'text-white',
  },
  { 
    label: 'Sold', 
    value: 'Sold', 
    activeBg: 'bg-green-600',
    activeText: 'text-white',
  },
  { 
    label: 'Leased', 
    value: 'Leased', 
    activeBg: 'bg-orange-600',
    activeText: 'text-white',
  },
  { 
    label: 'Removed', 
    value: 'Removed', 
    activeBg: 'bg-slate-600',
    activeText: 'text-white',
  },
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
      {/* Solid container with minimal transparency */}
      <div
        ref={containerRef}
        className="flex gap-2 overflow-x-auto p-1 rounded-xl bg-slate-900/70 border border-slate-700/50 shadow-lg justify-between [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
                px-4 py-3
                text-sm font-semibold
                rounded-lg
                transition-all duration-200 ease-out
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-400
                whitespace-nowrap
                relative
                text-center
                ${
                  isActive
                    ? `${status.activeBg} ${status.activeText} shadow-md`
                    : `bg-slate-800/60 text-gray-300 hover:bg-slate-700/70 hover:text-white`
                }
              `}
              aria-pressed={isActive}
              aria-label={`Filter by ${status.label}`}
            >
              {/* Text with better contrast */}
              <span className="relative z-10">
                {status.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
