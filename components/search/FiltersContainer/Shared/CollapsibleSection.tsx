'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type CollapsibleSectionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
};

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  className,
  headerClassName,
  contentClassName,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('border-b border-gray-200', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-gray-50',
          headerClassName,
        )}
      >
        <span className="text-base font-semibold text-gray-900">{title}</span>
        <svg
          className={cn(
            'h-5 w-5 text-gray-500 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className={cn('px-4 pb-4', contentClassName)}>{children}</div>
      )}
    </div>
  );
}

