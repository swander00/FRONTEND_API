import React, { useCallback } from "react";
import type { AdvancedFiltersState, RangeField } from "../state";
import {
  RANGE_CONFIG,
  RANGE_FIELD_KEY_MAP,
  formatRangeSummary,
  getRangeFillStyle,
} from "../state";

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
  onSliderChange: (field: RangeField, bound: "min" | "max") => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNumberChange: (field: RangeField, bound: "min" | "max") => (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ field, minValue, maxValue, onSliderChange, onNumberChange }) => {
  const config = RANGE_CONFIG[field];
  const summary = formatRangeSummary(minValue, maxValue, config);
  const fillStyle = getRangeFillStyle(minValue, maxValue, config);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {config.label}
        </span>
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-300">{summary}</span>
      </div>
      <div className="relative flex h-10 items-center">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div
          className="pointer-events-none absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-500"
          style={fillStyle}
        />
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={minValue}
          onChange={onSliderChange(field, "min")}
          aria-label={`${config.label} minimum`}
          className="absolute inset-0 z-30 cursor-pointer bg-transparent"
        />
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={maxValue}
          onChange={onSliderChange(field, "max")}
          aria-label={`${config.label} maximum`}
          className="absolute inset-0 z-20 cursor-pointer bg-transparent"
          style={{ direction: "rtl" }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Min</span>
          <input
            type="number"
            min={config.min}
            max={config.max}
            step={config.step}
            value={minValue}
            onChange={onNumberChange(field, "min")}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/30"
            inputMode="numeric"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Max</span>
          <input
            type="number"
            min={config.min}
            max={config.max}
            step={config.step}
            value={maxValue}
            onChange={onNumberChange(field, "max")}
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
    const handleSliderChange = useCallback(
      (field: RangeField, bound: "min" | "max") =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
          onRangeChange(field, bound, Number(event.target.value));
        },
      [onRangeChange],
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
          onRangeChange(field, bound, Number.isFinite(numericValue) ? numericValue : fallback);
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
              onSliderChange={handleSliderChange}
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

