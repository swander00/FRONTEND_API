'use client';

import { useEffect, useMemo, useState } from 'react';
import { BaseModal, ModalBody, ModalFooter, ModalHeader } from '../../Shared/Modals';
import { RangeSlider } from '../../Shared/RangeSlider';
import { BATH_QUICK_SELECTS, EXACT_BATH_OPTIONS } from '@/lib/filters/options';
import { useFiltersDispatch, useFiltersState } from '../../FiltersContext';

export type BathsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type LocalBathsState = {
  min: number | null;
  max: number | null;
  preset: string | null;
  exact: number | null;
};

const MAX_BATHS = 10;

export function BathsModal({ isOpen, onClose }: BathsModalProps) {
  const { baths } = useFiltersState();
  const dispatch = useFiltersDispatch();
  const [localBaths, setLocalBaths] = useState<LocalBathsState>({
    min: baths.min,
    max: baths.max,
    preset: baths.preset ?? 'Any',
    exact: baths.exact ?? null,
  });

  useEffect(() => {
    if (isOpen) {
      setLocalBaths({
        min: baths.min,
        max: baths.max,
        preset: baths.preset ?? 'Any',
        exact: baths.exact ?? null,
      });
    }
  }, [isOpen, baths.min, baths.max, baths.preset, baths.exact]);

  const isAllBaths = useMemo(
    () => localBaths.min === null && localBaths.max === null && localBaths.exact === null,
    [localBaths.min, localBaths.max, localBaths.exact],
  );

  const handleApply = () => {
    dispatch({
      type: 'SET_BATHS',
      payload: {
        min: localBaths.min,
        max: localBaths.max,
        preset: localBaths.preset ?? undefined,
        exact: localBaths.exact ?? undefined,
      },
    });
    onClose();
  };

  const handleReset = () => {
    setLocalBaths({ min: null, max: null, preset: 'Any', exact: null });
    dispatch({
      type: 'SET_BATHS',
      payload: { min: null, max: null, preset: 'Any', exact: null },
    });
    onClose();
  };

  const handleEnableAll = () => {
    setLocalBaths({ min: null, max: null, preset: 'Any', exact: null });
  };

  const handleQuickSelect = (label: string, min: number | null, max: number | null, preset?: string | null) => {
    setLocalBaths({ min, max, preset: preset ?? label, exact: null });
  };

  const handleExactSelect = (value: number) => {
    setLocalBaths((prev) => ({
      min: prev.min,
      max: prev.max,
      preset: null,
      exact: prev.exact === value ? null : value,
    }));
  };

  const rangeValue = useMemo(
    () => ({
      min: localBaths.min ?? 0,
      max: localBaths.max ?? MAX_BATHS,
    }),
    [localBaths.min, localBaths.max],
  );

  const handleSliderChange = (value: { min: number | null; max: number | null }) => {
    setLocalBaths({
      min: value.min,
      max: value.max,
      preset: null,
      exact: null,
    });
  };

  const buildRangeLabel = (min: number | null, max: number | null) => {
    if (min === null && max === null) {
      return 'Any Bathroom Count';
    }
    if (min !== null && max === null) {
      return `${min}+ Bathrooms`;
    }
    if (min === null && max !== null) {
      return `Up to ${max} Bathrooms`;
    }
    if (min === max) {
      return `${min} Bathrooms`;
    }
    return `${min} – ${max} Bathrooms`;
  };

  const customRangeLabel = buildRangeLabel(localBaths.min, localBaths.max);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className="max-w-[min(100%,560px)]"
      contentClassName="h-auto max-h-none"
    >
      <ModalHeader
        title="Bathrooms"
        description="Use quick presets or fine-tune an exact bathroom count."
        onClose={onClose}
      />
      <ModalBody scrollable={false} className="flex-none space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white px-3.5 py-3 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Global Toggle</p>
            <p className="text-[13px] font-semibold text-slate-900">All Bathroom Counts</p>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Include every listing regardless of bathroom count.
            </p>
          </div>
          <button
            type="button"
            onClick={handleEnableAll}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
              isAllBaths
                ? 'bg-blue-600 text-white shadow-sm focus-visible:ring-blue-400'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900 focus-visible:ring-slate-200'
            }`}
          >
            {isAllBaths ? 'All Baths Enabled' : 'Enable All Baths'}
          </button>
        </div>

        <div className="flex flex-col gap-1.5 rounded-2xl border border-slate-200 bg-white/70 px-3.5 py-3 shadow-sm ring-1 ring-transparent">
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Quick Presets</span>
          <div className="flex w-full flex-wrap items-center gap-1.5">
            {BATH_QUICK_SELECTS.map((option) => {
              const isActive = localBaths.preset === option.preset;
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
            {localBaths.preset === null && localBaths.exact === null && (
              <span className="rounded-full bg-slate-900/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700">
                Custom Selected
              </span>
            )}
          </div>
          <RangeSlider
            min={0}
            max={MAX_BATHS}
            value={rangeValue}
            onChange={handleSliderChange}
            showInputs={false}
            className="space-y-3"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/70 px-3.5 py-3 shadow-sm ring-1 ring-transparent">
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Exact Match</span>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {EXACT_BATH_OPTIONS.map((option) => {
              const isActive = localBaths.exact === option;
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
        applyLabel="Apply Baths"
      />
    </BaseModal>
  );
}


