'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Show up to 7 page numbers
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 3) {
        // Near the start: show 1, 2, 3, 4, ..., last
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end: show 1, ..., last-3, last-2, last-1, last
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle: show 1, ..., current-1, current, current+1, ..., last
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className={cn('flex items-center justify-center gap-1 sm:gap-2', className)}>
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={cn(
          'flex items-center justify-center px-3 py-2 rounded-md border border-gray-300',
          'text-sm font-medium transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          currentPage === 1
            ? 'bg-gray-100 text-gray-400'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        )}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline ml-1">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-2 text-gray-500"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              className={cn(
                'min-w-[2.5rem] px-3 py-2 rounded-md border text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              )}
              aria-label={`Go to page ${pageNum}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={cn(
          'flex items-center justify-center px-3 py-2 rounded-md border border-gray-300',
          'text-sm font-medium transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        )}
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline mr-1">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

