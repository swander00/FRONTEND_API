'use client';

import { useMemo, type ChangeEvent } from 'react';
import { cn } from '@/lib/utils';

export type RangeSliderValue = {
  min: number | null;
  max: number | null;
};

export type RangeSliderProps = {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: RangeSliderValue;
  onChange: (value: RangeSliderValue) => void;
  formatValue?: (value: number) => string;
  className?: string;
  showInputs?: boolean;
};

export function RangeSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue,
  className,
  showInputs = true,
}: RangeSliderProps) {
  const displayMin = value.min ?? min;
  const displayMax = value.max ?? max;

  const formattedMin = useMemo(
    () => (formatValue ? formatValue(displayMin) : displayMin.toString()),
    [displayMin, formatValue],
  );

  const formattedMax = useMemo(
    () => (formatValue ? formatValue(displayMax) : displayMax.toString()),
    [displayMax, formatValue],
  );

  const handleMinRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    const boundedValue = Math.min(nextValue, displayMax);
    onChange({ min: boundedValue, max: value.max });
  };

  const handleMaxRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    const boundedValue = Math.max(nextValue, displayMin);
    onChange({ min: value.min, max: boundedValue });
  };

  const handleMinInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    onChange({ min: raw === '' ? null : Number(raw), max: value.max });
  };

  const handleMaxInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    onChange({ min: value.min, max: raw === '' ? null : Number(raw) });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {label ? <p className="text-sm font-medium text-slate-700">{label}</p> : null}
      {showInputs ? (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Min
            </label>
            <input
              type="number"
              value={value.min ?? ''}
              min={min}
              max={value.max ?? max}
              step={step}
              onChange={handleMinInputChange}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200/60"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Max
            </label>
            <input
              type="number"
              value={value.max ?? ''}
              min={value.min ?? min}
              max={max}
              step={step}
              onChange={handleMaxInputChange}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200/60"
            />
          </div>
        </div>
      ) : null}

      <div className="relative mt-2">
        <div className="absolute inset-x-3 top-1/2 h-1 translate-y-[-50%] rounded-full bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600" />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={displayMin}
          onChange={handleMinRangeChange}
          className="pointer-events-auto relative z-10 h-1 w-full appearance-none bg-transparent focus:outline-none"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={displayMax}
          onChange={handleMaxRangeChange}
          className="pointer-events-auto relative z-10 h-1 w-full appearance-none bg-transparent focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
        <span>{formattedMin}</span>
        <span>{formattedMax}</span>
      </div>
    </div>
  );
}


