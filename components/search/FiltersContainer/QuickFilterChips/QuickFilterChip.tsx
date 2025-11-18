'use client';

import { cn } from '@/lib/utils';

export type QuickFilterChipProps = {
  label: string;
  active: boolean;
  onToggle: () => void;
};

export function QuickFilterChip({ label, active, onToggle }: QuickFilterChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'group relative inline-flex items-center gap-1.5 rounded-full border bg-white/90 px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 transition-all duration-300 hover:-translate-y-0.5 hover:text-blue-600 hover:ring-blue-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2',
        active
          ? 'border-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-500 text-white ring-blue-500 shadow-lg shadow-blue-200/70'
          : 'border-transparent text-gray-600 ring-gray-200/70',
      )}
      aria-pressed={active}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full transition-colors duration-300',
          active ? 'bg-white/90' : 'bg-blue-400/70 group-hover:bg-blue-500',
        )}
      />
      <span className="whitespace-nowrap">{label}</span>
      {active ? (
        <span className="rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/90">
          Active
        </span>
      ) : null}
    </button>
  );
}


