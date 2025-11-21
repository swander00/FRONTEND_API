'use client';

import { Search } from 'lucide-react';

interface SearchButtonProps {
  onClick: () => void;
  className?: string;
}

export function SearchButton({ onClick, className = '' }: SearchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/30 hover:shadow-lg hover:shadow-blue-600/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap ${className}`}
      aria-label="Search properties"
    >
      <Search className="w-5 h-5" aria-hidden="true" />
      <span>Search</span>
    </button>
  );
}

