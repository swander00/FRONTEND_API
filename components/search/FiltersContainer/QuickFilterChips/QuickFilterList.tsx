'use client';

import { PROPERTY_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { QuickFilterChip } from './QuickFilterChip';

export type QuickFilterListProps = {
  selected: string[];
  onToggle: (label: string) => void;
  className?: string;
};

export function QuickFilterList({ selected, onToggle, className }: QuickFilterListProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-12 bg-gradient-to-r from-white via-white to-transparent md:block" />
      <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-12 bg-gradient-to-l from-white via-white to-transparent md:block" />

      <div className="overflow-x-auto pb-1">
        <div className="flex w-max items-center gap-1.5 px-1 py-2 sm:gap-2">
          {PROPERTY_TYPES.map((type) => (
            <QuickFilterChip
              key={type}
              label={type}
              active={selected.includes(type)}
              onToggle={() => onToggle(type)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


