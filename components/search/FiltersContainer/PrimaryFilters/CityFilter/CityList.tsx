'use client';

import { CITY_GROUPS } from '@/lib/filters/options';
import { cn } from '@/lib/utils';

export type CityListProps = {
  selected: string[];
  onToggle: (city: string) => void;
};

export function CityList({ selected, onToggle }: CityListProps) {
  return (
    <div className="max-h-[460px] space-y-5 overflow-y-auto pr-1">
      {CITY_GROUPS.map((group) => (
        <section key={group.region} className="space-y-2">
          <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
            {group.region}
          </div>

          <div className="space-y-1.5">
            {group.cities.map((city) => {
              const isSelected = selected.includes(city);

              return (
                <button
                  type="button"
                  key={city}
                  onClick={() => onToggle(city)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                    isSelected
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  )}
                  aria-pressed={isSelected}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        'h-2.5 w-2.5 rounded-full border',
                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-slate-200',
                      )}
                    />
                    {city}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
