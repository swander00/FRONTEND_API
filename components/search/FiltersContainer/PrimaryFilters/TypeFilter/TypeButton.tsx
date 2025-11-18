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
        'inline-flex h-12 w-[135px] items-center justify-center rounded-none px-5 text-sm font-medium transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
        isActive
          ? 'bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-200'
          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus-visible:ring-blue-400',
        className,
      )}
    >
      <span className="truncate text-center">{label}</span>
    </button>
  );
}


