'use client';

import { PROPERTY_TYPE_GROUPS } from '@/lib/filters/options';

export type TypeGroupProps = {
  selected: string[];
  onToggle: (type: string) => void;
};

const CATEGORY_ACCENTS: Record<string, string> = {
  'Freehold Houses': 'from-rose-500 to-rose-600',
  'Condo Living': 'from-blue-500 to-indigo-600',
  'Multi-Unit / Investor': 'from-emerald-500 to-teal-600',
  'Recreational / Lifestyle': 'from-amber-500 to-orange-500',
  'Special Use': 'from-slate-900 to-slate-700',
};

export function TypeGroup({ selected, onToggle }: TypeGroupProps) {
  return (
    <div className="flex flex-col gap-3">
      {PROPERTY_TYPE_GROUPS.map((group) => (
        <div
          key={group.category}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-4 shadow-sm ring-1 ring-transparent transition hover:shadow-md hover:ring-slate-100 md:flex-row md:items-center md:gap-4 md:px-5"
        >
          <div className="flex items-center gap-3 md:min-w-[12rem] md:shrink-0">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-[9px] font-semibold uppercase tracking-wide text-white ${
                CATEGORY_ACCENTS[group.category] ?? 'from-slate-900 to-slate-600'
              }`}
            >
              {group.category.substring(0, 3)}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Category</span>
              <h3 className="text-sm font-semibold text-slate-800">{group.category}</h3>
            </div>
          </div>

          <div className="flex w-full flex-1 flex-wrap items-center gap-2">
            {group.types.map((type) => {
              const isSelected = selected.includes(type);
              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => onToggle(type)}
                  className={`flex h-10 min-w-[150px] shrink-0 items-center justify-center rounded-full border px-4 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    isSelected
                      ? 'border-transparent bg-blue-600 text-white shadow-md focus-visible:ring-blue-400 focus-visible:ring-offset-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-200 focus-visible:ring-offset-white'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}


