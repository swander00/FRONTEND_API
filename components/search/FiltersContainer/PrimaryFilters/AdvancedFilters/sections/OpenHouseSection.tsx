import React from "react";
import { OPEN_HOUSE_TIMING_OPTIONS } from "../state";

export type OpenHouseSectionProps = {
  value: string;
  onChange: (value: (typeof OPEN_HOUSE_TIMING_OPTIONS)[number]) => void;
};

const buildChipClasses = (isActive: boolean) =>
  [
    "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    isActive
      ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm dark:border-blue-400 dark:bg-blue-500/20 dark:text-blue-200"
      : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-400",
  ].join(" ");

export const OpenHouseSection: React.FC<OpenHouseSectionProps> = React.memo(
  ({ value, onChange }) => {
    return (
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Open House Timing
        </span>
        <div className="flex flex-wrap gap-2">
          {OPEN_HOUSE_TIMING_OPTIONS.map((option) => {
            const isActive = value === option;
            return (
              <button
                key={option}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  onChange(option);
                }}
                className={buildChipClasses(isActive)}
                aria-pressed={isActive}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);

OpenHouseSection.displayName = "OpenHouseSection";

