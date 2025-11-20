'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type StatusButtonProps = {
  label: string;
  onClick: () => void;
  dotColor?: string;
  activeClassName?: string;
  activeBackgroundColor?: string;
  isActive?: boolean;
};

export const StatusButton = forwardRef<HTMLButtonElement, StatusButtonProps>(function StatusButton(
  {
    label,
    onClick,
    dotColor = '#2563eb',
    activeClassName = 'bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-200',
    activeBackgroundColor = '#2563eb',
    isActive = false,
  },
  ref,
) {
  const style = isActive
    ? {
        backgroundColor: activeBackgroundColor,
        color: 'white',
      }
    : undefined;

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-12 w-[135px] items-center justify-center gap-2 rounded-full rounded-r-none px-5 text-sm font-semibold transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
        isActive
          ? activeClassName
          : 'text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 focus-visible:ring-blue-400 active:scale-[0.98]',
      )}
      style={style}
    >
      <span
        className={cn(
          'inline-flex h-2.5 w-2.5 rounded-full border transition-all duration-200',
          isActive ? 'border-white/70 shadow-sm' : 'border-gray-300/60',
        )}
        style={{ backgroundColor: dotColor }}
      />
      <span className="text-center leading-tight">{label}</span>
    </button>
  );
});
