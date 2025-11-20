'use client';

import { cn } from '@/lib/utils';

export type TypeButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
  isActive?: boolean;
  title?: string;
};

export function TypeButton({
  label,
  onClick,
  className,
  isActive = false,
  title,
}: TypeButtonProps) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title ?? label}
        className={cn(
          'inline-flex h-12 w-[135px] items-center justify-center rounded-none px-5 text-sm font-semibold transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
          isActive
            ? 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-200 active:scale-[0.98]'
            : 'bg-white text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 focus-visible:ring-blue-400 active:scale-[0.98]',
          className,
        )}
      >
        <span className="truncate text-center leading-tight">{label}</span>
      </button>
    );
}


