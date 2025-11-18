import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type IconButtonProps = {
  icon: ReactNode;
  ariaLabel: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ icon, ariaLabel, className, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(
          'p-2 rounded-full transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          className
        )}
        aria-label={ariaLabel}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

