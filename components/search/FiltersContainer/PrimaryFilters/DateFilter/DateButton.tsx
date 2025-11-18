'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type DateButtonProps = {
  label: string;
  onClick: () => void;
  isActive?: boolean;
};

export const DateButton = forwardRef<HTMLButtonElement, DateButtonProps>(function DateButton(
  { label, onClick, isActive = false },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-12 w-[135px] items-center justify-center gap-2 rounded-full rounded-l-none border-l px-5 text-sm font-medium transition-colors',
        isActive ? 'border-blue-400' : 'border-gray-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
        isActive
          ? 'bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-200'
          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 focus-visible:ring-blue-400',
      )}
    >
      <span className="text-center">{label}</span>
    </button>
  );
});


