import React, { useCallback, useState, useEffect, useRef } from "react";
import type { AdvancedFiltersState, RangeField } from "../state";
import {
  RANGE_CONFIG,
  RANGE_FIELD_KEY_MAP,
  formatRangeSummary,
} from "../state";
import { DualRangeSlider } from "../../../Shared/DualRangeSlider";

type RangeValues = Pick<
  AdvancedFiltersState,
  | "squareFootageMin"
  | "squareFootageMax"
  | "maintenanceFeesMin"
  | "maintenanceFeesMax"
  | "propertyTaxMin"
  | "propertyTaxMax"
  | "daysOnMarketMin"
  | "daysOnMarketMax"
  | "garageParkingMin"
  | "garageParkingMax"
  | "totalParkingMin"
  | "totalParkingMax"
>;

export type RangeFiltersSectionProps = {
  values: RangeValues;
  onRangeChange: (field: RangeField, bound: "min" | "max", value: number) => void;
};

const RANGE_FIELDS: RangeField[] = [
  "squareFootage",
  "maintenanceFees",
  "propertyTax",
  "daysOnMarket",
  "garageParking",
  "totalParking",
];

const RANGE_VALUE_KEYS = RANGE_FIELDS.flatMap((field) => {
  const map = RANGE_FIELD_KEY_MAP[field];
  return [map.min, map.max];
}) as (keyof RangeValues)[];

const RangeFilterCard: React.FC<{
  field: RangeField;
  minValue: number;
  maxValue: number;
  onRangeChange: (value: { min: number; max: number }) => void;
  onNumberChange: (field: RangeField, bound: "min" | "max") => (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ field, minValue, maxValue, onRangeChange, onNumberChange }) => {
  const config = RANGE_CONFIG[field];
  const summary = formatRangeSummary(minValue, maxValue, config);
  
  // Local state for input values to allow typing
  const [minInputValue, setMinInputValue] = useState<string>(minValue.toString());
  const [maxInputValue, setMaxInputValue] = useState<string>(maxValue.toString());
  const [isMinFocused, setIsMinFocused] = useState<boolean>(false);
  const [isMaxFocused, setIsMaxFocused] = useState<boolean>(false);
  const prevMinValueRef = useRef<number>(minValue);
  const prevMaxValueRef = useRef<number>(maxValue);
  
  // Sync local state when props change
  // Always sync when not focused
  // When focused, only sync if value changed significantly (like a reset to defaults)
  useEffect(() => {
    const valueChangedSignificantly = Math.abs(minValue - prevMinValueRef.current) > (config.max - config.min) * 0.1;
    const isAtDefault = minValue === config.min;
    
    if (!isMinFocused || valueChangedSignificantly || isAtDefault) {
      setMinInputValue(minValue.toString());
      prevMinValueRef.current = minValue;
    }
  }, [minValue, isMinFocused, config.min, config.max]);
  
  useEffect(() => {
    const valueChangedSignificantly = Math.abs(maxValue - prevMaxValueRef.current) > (config.max - config.min) * 0.1;
    const isAtDefault = maxValue === config.max;
    
    if (!isMaxFocused || valueChangedSignificantly || isAtDefault) {
      setMaxInputValue(maxValue.toString());
      prevMaxValueRef.current = maxValue;
    }
  }, [maxValue, isMaxFocused, config.min, config.max]);

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinInputValue(value);
    // Allow empty or partial input while typing
    if (value === "") {
      return; // Don't update parent, allow empty state
    }
    const numValue = Number(value);
    if (!isNaN(numValue) && isFinite(numValue)) {
      console.log(`[RangeFilterCard] handleMinInputChange for ${field}:`, {
        inputValue: value,
        numValue,
        currentMinValue: minValue,
        willUpdate: true,
      });
      onNumberChange(field, "min")(e);
    }
  };

  const handleMinInputBlur = () => {
    setIsMinFocused(false);
    // On blur, validate and set a proper value
    if (minInputValue === "" || isNaN(Number(minInputValue))) {
      setMinInputValue(minValue.toString());
      return;
    }
    const numValue = Number(minInputValue);
    // Round to nearest step if step is defined
    let roundedValue = numValue;
    if (config.step && Number.isFinite(numValue)) {
      roundedValue = Math.round(numValue / config.step) * config.step;
    }
    // Clamp to valid range (between config.min and maxValue)
    const clampedValue = Math.max(config.min, Math.min(roundedValue, maxValue));
    
    console.log(`[RangeFilterCard] handleMinInputBlur for ${field}:`, {
      minInputValue,
      numValue,
      roundedValue,
      clampedValue,
      currentMinValue: minValue,
      maxValue,
      config: { min: config.min, max: config.max, step: config.step },
    });
    
    if (clampedValue !== minValue) {
      onNumberChange(field, "min")({
        target: { value: clampedValue.toString() },
      } as React.ChangeEvent<HTMLInputElement>);
    } else {
      setMinInputValue(minValue.toString());
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxInputValue(value);
    // Allow empty or partial input while typing
    if (value === "") {
      return; // Don't update parent, allow empty state
    }
    const numValue = Number(value);
    if (!isNaN(numValue) && isFinite(numValue)) {
      onNumberChange(field, "max")(e);
    }
  };

  const handleMaxInputBlur = () => {
    setIsMaxFocused(false);
    // On blur, validate and set a proper value
    if (maxInputValue === "" || isNaN(Number(maxInputValue))) {
      setMaxInputValue(maxValue.toString());
      return;
    }
    const numValue = Number(maxInputValue);
    // Round to nearest step if step is defined
    let roundedValue = numValue;
    if (config.step && Number.isFinite(numValue)) {
      roundedValue = Math.round(numValue / config.step) * config.step;
    }
    // Clamp to valid range (between minValue and config.max)
    const clampedValue = Math.max(minValue, Math.min(roundedValue, config.max));
    
    console.log(`[RangeFilterCard] handleMaxInputBlur for ${field}:`, {
      maxInputValue,
      numValue,
      roundedValue,
      clampedValue,
      currentMaxValue: maxValue,
      minValue,
      config: { min: config.min, max: config.max, step: config.step },
    });
    
    if (clampedValue !== maxValue) {
      onNumberChange(field, "max")({
        target: { value: clampedValue.toString() },
      } as React.ChangeEvent<HTMLInputElement>);
    } else {
      setMaxInputValue(maxValue.toString());
    }
  };

  const handleMinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const handleMaxKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {config.label}
        </span>
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-300">{summary}</span>
      </div>
      
      <DualRangeSlider
        min={config.min}
        max={config.max}
        step={config.step}
        value={{ min: minValue, max: maxValue }}
        onChange={onRangeChange}
        aria-label={config.label}
      />
      
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Min</span>
          <input
            type="number"
            min={config.min}
            max={maxValue}
            step={config.step}
            value={minInputValue}
            onChange={handleMinInputChange}
            onFocus={() => setIsMinFocused(true)}
            onBlur={handleMinInputBlur}
            onKeyDown={handleMinKeyDown}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/30"
            inputMode="numeric"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Max</span>
          <input
            type="number"
            min={minValue}
            max={config.max}
            step={config.step}
            value={maxInputValue}
            onChange={handleMaxInputChange}
            onFocus={() => setIsMaxFocused(true)}
            onBlur={handleMaxInputBlur}
            onKeyDown={handleMaxKeyDown}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/30"
            inputMode="numeric"
          />
        </label>
      </div>
    </div>
  );
};

export const RangeFiltersSection: React.FC<RangeFiltersSectionProps> = React.memo(
  ({ values, onRangeChange }) => {
    const handleRangeChange = useCallback(
      (field: RangeField) => (value: { min: number; max: number }) => {
        console.log(`[RangeFiltersSection] handleRangeChange for ${field}:`, {
          newValue: value,
          currentValues: {
            min: values[RANGE_FIELD_KEY_MAP[field].min],
            max: values[RANGE_FIELD_KEY_MAP[field].max],
          },
        });
        onRangeChange(field, "min", value.min);
        onRangeChange(field, "max", value.max);
      },
      [onRangeChange, values],
    );

    const handleNumberChange = useCallback(
      (field: RangeField, bound: "min" | "max") =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
          const { value } = event.target;
          const config = RANGE_CONFIG[field];
          if (value === "") {
            const fallback = bound === "min" ? config.min : config.max;
            onRangeChange(field, bound, fallback);
            return;
          }
          const numericValue = Number(value);
          const fallback = bound === "min" ? config.min : config.max;
          let finalValue = Number.isFinite(numericValue) ? numericValue : fallback;
          
          // Round to nearest step if step is defined
          if (config.step && Number.isFinite(finalValue)) {
            finalValue = Math.round(finalValue / config.step) * config.step;
            // Clamp to valid range
            finalValue = Math.max(config.min, Math.min(finalValue, config.max));
          }
          
          console.log(`[RangeFiltersSection] handleNumberChange for ${field}.${bound}:`, {
            inputValue: value,
            numericValue,
            finalValue,
            rounded: config.step ? Math.round(numericValue / config.step) * config.step : numericValue,
            config: { min: config.min, max: config.max, step: config.step },
          });
          onRangeChange(field, bound, finalValue);
        },
      [onRangeChange],
    );

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {RANGE_FIELDS.map((field) => {
          const keys = RANGE_FIELD_KEY_MAP[field];
          const minValue = values[keys.min];
          const maxValue = values[keys.max];

          return (
            <RangeFilterCard
              key={field}
              field={field}
              minValue={minValue}
              maxValue={maxValue}
              onRangeChange={handleRangeChange(field)}
              onNumberChange={handleNumberChange}
            />
          );
        })}
      </div>
    );
  },
  (previous, next) => {
    for (const key of RANGE_VALUE_KEYS) {
      if (previous.values[key] !== next.values[key]) {
        return false;
      }
    }
    return previous.onRangeChange === next.onRangeChange;
  },
);

RangeFiltersSection.displayName = "RangeFiltersSection";

