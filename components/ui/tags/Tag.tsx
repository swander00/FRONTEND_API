import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type TagProps = {
  children: ReactNode;
  active?: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Tag = forwardRef<HTMLButtonElement, TagProps>(function Tag(
  { children, active = false, className, ...props },
  ref
) {
  return (
    <button
      type="button"
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors',
        active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

