'use client';

import { SlidersHorizontal } from 'lucide-react';

interface AdvancedFiltersButtonProps {
  onClick: () => void;
  className?: string;
}

export function AdvancedFiltersButton({
  onClick,
  className = '',
}: AdvancedFiltersButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 whitespace-nowrap ${className}`}
      aria-label="Advanced filters"
    >
      <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
      <span className="hidden lg:inline">Advanced</span>
    </button>
  );
}

