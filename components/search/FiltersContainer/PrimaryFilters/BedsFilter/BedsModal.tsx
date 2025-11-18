'use client';

import { useEffect, useMemo, useState } from 'react';
import { BaseModal, ModalBody, ModalFooter, ModalHeader } from '../../Shared/Modals';
import { RangeSlider } from '../../Shared/RangeSlider';
import { BED_QUICK_SELECTS, EXACT_BED_OPTIONS } from '@/lib/filters/options';
import { useFiltersDispatch, useFiltersState } from '../../FiltersContext';

export type BedsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type LocalBedsState = {
  min: number | null;
  max: number | null;
  preset: string | null;
  exact: number | null;
};

const MAX_BEDS = 10;

export function BedsModal({ isOpen, onClose }: BedsModalProps) {
  const { beds } = useFiltersState();
  const dispatch = useFiltersDispatch();
  const [localBeds, setLocalBeds] = useState<LocalBedsState>({
    min: beds.min,
    max: beds.max,
    preset: beds.preset ?? 'Any',
    exact: beds.exact ?? null,
  });

  useEffect(() => {
    if (isOpen) {
      setLocalBeds({
        min: beds.min,
        max: beds.max,
        preset: beds.preset ?? 'Any',
        exact: beds.exact ?? null,
      });
    }
  }, [isOpen, beds.min, beds.max, beds.preset, beds.exact]);

  const isAllBeds = useMemo(
    () => localBeds.min === null && localBeds.max === null && localBeds.exact === null,
    [localBeds.min, localBeds.max, localBeds.exact],
  );

  const handleApply = () => {
    dispatch({
      type: 'SET_BEDS',
      payload: {
        min: localBeds.min,
        max: localBeds.max,
        preset: localBeds.preset ?? undefined,
        exact: localBeds.exact ?? undefined,
      },
    });
    onClose();
  };

  const handleReset = () => {
    setLocalBeds({ min: null, max: null, preset: 'Any', exact: null });
    dispatch({
      type: 'SET_BEDS',
      payload: { min: null, max: null, preset: 'Any', exact: null },
    });
    onClose();
  };

  const handleEnableAll = () => {
    setLocalBeds({ min: null, max: null, preset: 'Any', exact: null });
  };

  const handleQuickSelect = (label: string, min: number | null, max: number | null, preset?: string | null) => {
    setLocalBeds({ min, max, preset: preset ?? label, exact: null });
  };

  const handleExactSelect = (value: number) => {
    setLocalBeds((prev) => ({
      min: prev.min,
      max: prev.max,
      preset: null,
      exact: prev.exact === value ? null : value,
    }));
  };

  const rangeValue = useMemo(
    () => ({
      min: localBeds.min ?? 0,
      max: localBeds.max ?? MAX_BEDS,
    }),
    [localBeds.min, localBeds.max],
  );

  const handleSliderChange = (value: { min: number | null; max: number | null }) => {
    setLocalBeds({
      min: value.min,
      max: value.max,
      preset: null,
      exact: null,
    });
  };

  const buildRangeLabel = (min: number | null, max: number | null) => {
    if (min === null && max === null) {
      return 'Any Bedroom Count';
    }
    if (min !== null && max === null) {
      return `${min}+ Bedrooms`;
    }
    if (min === null && max !== null) {
      return `Up to ${max} Bedrooms`;
    }
    if (min === max) {
      return `${min} Bedrooms`;
    }
    return `${min} – ${max} Bedrooms`;
  };

  const customRangeLabel = buildRangeLabel(localBeds.min, localBeds.max);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className="max-w-[min(100%,560px)]"
      contentClassName="h-auto max-h-none"
    >
      <ModalHeader
        title="Bedrooms"
        description="Pick a quick preset or dial in an exact bedroom count."
        onClose={onClose}
      />
      <ModalBody scrollable={false} className="flex-none space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white px-3.5 py-3 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Global Toggle</p>
            <p className="text-[13px] font-semibold text-slate-900">All Bedroom Counts</p>
            <p className="text-[11px] leading-relaxed text-slate-500">
              See every listing regardless of bedroom count.
            </p>
          </div>
          <button
            type="button"
            onClick={handleEnableAll}
            className={`rounded-full px-4 py-1.5 text-[11px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
              isAllBeds
                ? 'bg-blue-600 text-white shadow-sm focus-visible:ring-blue-400'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900 focus-visible:ring-slate-200'
            }`}
          >
            {isAllBeds ? 'All Beds Enabled' : 'Enable All Beds'}
          </button>
        </div>

        <div className="flex flex-col gap-1.5 rounded-2xl border border-slate-200 bg-white/70 px-3.5 py-3 shadow-sm ring-1 ring-transparent">
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Quick Presets</span>
          <div className="flex w-full flex-wrap items-center gap-1.5">
            {BED_QUICK_SELECTS.map((option) => {
              const isActive = localBeds.preset === option.preset;
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleQuickSelect(option.label, option.min, option.max, option.preset)}
                  className={`flex h-9 min-w-[110px] shrink-0 items-center justify-center rounded-full border px-3 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                    isActive
                      ? 'border-transparent bg-blue-600 text-white shadow-md focus-visible:ring-blue-400'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-200'
                  }`}
                  aria-pressed={isActive}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/70 px-3.5 py-3.5 shadow-sm ring-1 ring-transparent">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Custom Range
              </span>
              <h3 className="text-[13px] font-semibold text-slate-800">{customRangeLabel}</h3>
            </div>
            {localBeds.preset === null && localBeds.exact === null && (
              <span className="rounded-full bg-slate-900/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700">
                Custom Selected
              </span>
            )}
          </div>
          <RangeSlider
            min={0}
            max={MAX_BEDS}
            value={rangeValue}
            onChange={handleSliderChange}
            showInputs={false}
            className="space-y-3"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/70 px-3.5 py-3 shadow-sm ring-1 ring-transparent">
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Exact Match</span>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {EXACT_BED_OPTIONS.map((option) => {
              const isActive = localBeds.exact === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleExactSelect(option)}
                  className={`flex h-9 min-w-[110px] shrink-0 items-center justify-center rounded-full border px-3 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                    isActive
                      ? 'border-transparent bg-blue-600 text-white shadow-md focus-visible:ring-blue-400'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-200'
                  }`}
                  aria-pressed={isActive}
                >
                  {`Exactly ${option}`}
                </button>
              );
            })}
          </div>
        </div>
      </ModalBody>
      <ModalFooter
        onCancel={onClose}
        onReset={handleReset}
        onApply={handleApply}
        applyLabel="Apply Beds"
      />
    </BaseModal>
  );
}


