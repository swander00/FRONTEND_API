import React from "react";
import { BASEMENT_FEATURE_OPTIONS, type AdvancedFiltersState } from "../state";

export type BasementFeaturesSectionProps = {
  selected: AdvancedFiltersState["basementFeatures"];
  onToggle: (value: (typeof BASEMENT_FEATURE_OPTIONS)[number]) => void;
};

const buildChipClasses = (isActive: boolean) =>
  [
    "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    isActive
      ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm dark:border-blue-400 dark:bg-blue-500/20 dark:text-blue-200"
      : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-400",
  ].join(" ");

export const BasementFeaturesSection: React.FC<BasementFeaturesSectionProps> = React.memo(
  ({ selected, onToggle }) => {
    return (
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Basement Features
        </span>
        <div className="flex flex-wrap gap-2">
          {BASEMENT_FEATURE_OPTIONS.map((option) => {
            const isActive =
              option === "None"
                ? selected.length === 1 && selected[0] === "None"
                : selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  onToggle(option);
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

BasementFeaturesSection.displayName = "BasementFeaturesSection";

