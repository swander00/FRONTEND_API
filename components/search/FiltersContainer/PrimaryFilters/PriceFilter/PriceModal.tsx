'use client';

import { useEffect, useMemo, useState } from 'react';
import { BaseModal, ModalBody, ModalFooter, ModalHeader } from '../../Shared/Modals';
import { RangeSlider } from '../../Shared/RangeSlider';
import { PRICE_PRESETS } from '@/lib/filters/options';
import { useFiltersDispatch, useFiltersState } from '../../FiltersContext';

type LocalPriceState = {
  min: number | null;
  max: number | null;
  preset: string | null;
};

export type PriceModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MAX_PRICE = 5_000_000;

export function PriceModal({ isOpen, onClose }: PriceModalProps) {
  const { price } = useFiltersState();
  const dispatch = useFiltersDispatch();
  const [localPrice, setLocalPrice] = useState<LocalPriceState>({
    min: price.min,
    max: price.max,
    preset: price.preset ?? 'Any',
  });

  useEffect(() => {
    if (isOpen) {
      setLocalPrice({
        min: price.min,
        max: price.max,
        preset: price.preset ?? 'Any',
      });
    }
  }, [isOpen, price.min, price.max, price.preset]);

  const isAllPrices = useMemo(
    () => localPrice.min === null && localPrice.max === null,
    [localPrice.min, localPrice.max],
  );

  const handleApply = () => {
    dispatch({
      type: 'SET_PRICE',
      payload: { min: localPrice.min, max: localPrice.max, preset: localPrice.preset ?? undefined },
    });
    onClose();
  };

  const handleReset = () => {
    setLocalPrice({ min: null, max: null, preset: 'Any' });
    dispatch({ type: 'SET_PRICE', payload: { min: null, max: null, preset: 'Any' } });
    onClose();
  };

  const handleEnableAll = () => {
    setLocalPrice({ min: null, max: null, preset: 'Any' });
  };

  const handleQuickSelect = (label: string, min: number | null, max: number | null) => {
    setLocalPrice({ min, max, preset: label });
  };

  const rangeValue = useMemo(
    () => ({
      min: localPrice.min ?? 0,
      max: localPrice.max ?? MAX_PRICE,
    }),
    [localPrice.min, localPrice.max],
  );

  const handleSliderChange = (value: { min: number | null; max: number | null }) => {
    setLocalPrice({ min: value.min, max: value.max, preset: null });
  };

  const formatCurrency = (amount: number) =>
    amount >= 1_000_000
      ? `$${(amount / 1_000_000).toFixed(1)}M`
      : `$${Math.round(amount / 1_000)}K`;

  const minLabel = localPrice.min === null ? 'Any' : formatCurrency(localPrice.min);
  const maxLabel = localPrice.max === null ? 'Any' : formatCurrency(localPrice.max);
  const customRangeLabel = isAllPrices ? 'Any Price Range' : `${minLabel} – ${maxLabel}`;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className="max-w-[min(100%,640px)]"
      contentClassName="h-auto max-h-none"
    >
      <ModalHeader
        title="Price Range"
        description="Dial in a budget with quick presets or fine-tune it with a custom range."
        onClose={onClose}
      />
      <ModalBody scrollable={false} className="flex-none space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white px-3.5 py-3 shadow-sm">
          <div className="max-w-xl space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Global Toggle
            </p>
            <p className="text-[13px] font-semibold text-slate-900">All Price Ranges</p>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Browse every listing regardless of price with a single tap.
            </p>
          </div>
          <button
            type="button"
            onClick={handleEnableAll}
            className={`rounded-full px-4 py-1.5 text-[11px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
              isAllPrices
                ? 'bg-blue-600 text-white shadow-sm focus-visible:ring-blue-400'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900 focus-visible:ring-slate-200'
            }`}
          >
            {isAllPrices ? 'All Prices Enabled' : 'Enable All Prices'}
          </button>
        </div>

        <div className="flex flex-col gap-1.5 rounded-2xl border border-slate-200 bg-white/70 px-3.5 py-3 shadow-sm ring-1 ring-transparent">
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Quick Presets</span>
          <div className="flex w-full flex-1 flex-wrap items-center gap-1.5">
            {PRICE_PRESETS.map((preset) => {
              const isActive = localPrice.preset === preset.label;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleQuickSelect(preset.label, preset.min, preset.max)}
                  className={`flex h-9 min-w-[130px] shrink-0 items-center justify-center rounded-full border px-3 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                    isActive
                      ? 'border-transparent bg-blue-600 text-white shadow-md focus-visible:ring-blue-400'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-200'
                  }`}
                  aria-pressed={isActive}
                >
                  {preset.label}
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
            {localPrice.preset === null && (
              <span className="rounded-full bg-slate-900/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700">
                Custom Selected
              </span>
            )}
          </div>
          <RangeSlider
            min={0}
            max={MAX_PRICE}
            step={50_000}
            value={rangeValue}
            onChange={handleSliderChange}
            formatValue={formatCurrency}
            showInputs={false}
            className="space-y-3"
          />
        </div>
      </ModalBody>
      <ModalFooter
        onCancel={onClose}
        onReset={handleReset}
        onApply={handleApply}
        applyLabel="Apply Price"
      />
    </BaseModal>
  );
}


