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
        'flex h-12 w-[135px] items-center justify-center gap-2 rounded-full rounded-l-none border-l px-5 text-sm font-semibold transition-all duration-200',
        isActive ? 'border-blue-600' : 'border-gray-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
        isActive
          ? 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-200 active:scale-[0.98]'
          : 'text-gray-600 hover:bg-blue-50/80 hover:text-blue-600 focus-visible:ring-blue-400 active:scale-[0.98]',
      )}
    >
      <span className="text-center leading-tight">{label}</span>
    </button>
  );
});


