import React from "react";
import type { AdvancedFiltersState } from "../state";

type FeatureField = "propertyAge" | "hasSwimmingPool" | "waterfront";

export type PropertyFeaturesSectionProps = {
  values: Pick<AdvancedFiltersState, FeatureField>;
  onFieldChange: (field: FeatureField, value: string) => void;
};

export const PropertyFeaturesSection: React.FC<PropertyFeaturesSectionProps> = React.memo(
  ({ values, onFieldChange }) => {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Property Age
          </span>
          <select
            name="propertyAge"
            value={values.propertyAge}
            onChange={(event) => onFieldChange("propertyAge", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/30"
          >
            <option value="">Select property age</option>
            <option value="New">New</option>
            <option value="0-5">0-5</option>
            <option value="6-15">6-15</option>
            <option value="15-25">15-25</option>
            <option value="25-50">25-50</option>
            <option value="50+">50+</option>
            <option value="100+">100+</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Swimming Pool
          </span>
          <select
            name="hasSwimmingPool"
            value={values.hasSwimmingPool}
            onChange={(event) => onFieldChange("hasSwimmingPool", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/30"
          >
            <option value="">Select option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Waterfront
          </span>
          <select
            name="waterfront"
            value={values.waterfront}
            onChange={(event) => onFieldChange("waterfront", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/30"
          >
            <option value="">Select option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
      </div>
    );
  },
);

PropertyFeaturesSection.displayName = "PropertyFeaturesSection";

