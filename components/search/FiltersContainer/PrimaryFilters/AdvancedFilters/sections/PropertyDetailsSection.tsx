import React from "react";
import type { AdvancedFiltersState } from "../state";

type PropertyDetailField =
  | "keyword"
  | "propertyClass"
  | "houseStyle"
  | "lotFrontage"
  | "lotDepth";

export type PropertyDetailsSectionProps = {
  values: Pick<AdvancedFiltersState, PropertyDetailField>;
  onFieldChange: (field: PropertyDetailField, value: string) => void;
};

export const PropertyDetailsSection: React.FC<PropertyDetailsSectionProps> = React.memo(
  ({ values, onFieldChange }) => {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Keyword Search
            </span>
            <input
              type="text"
              name="keyword"
              value={values.keyword}
              onChange={(event) => onFieldChange("keyword", event.target.value)}
              placeholder="e.g., pool, corner lot"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/30"
              autoComplete="off"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Property Class
            </span>
            <select
              name="propertyClass"
              value={values.propertyClass}
              onChange={(event) => onFieldChange("propertyClass", event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/30"
            >
              <option value="">Select property class</option>
              <option value="Residential Freehold">Residential Freehold</option>
              <option value="Residential Condo">Residential Condo</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              House Style
            </span>
            <select
              name="houseStyle"
              value={values.houseStyle}
              onChange={(event) => onFieldChange("houseStyle", event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/30"
            >
              <option value="">Select house style</option>
              <option value="Bungalow">Bungalow</option>
              <option value="Two-Storey">Two-Storey</option>
              <option value="Split-Level">Split-Level</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Loft">Loft</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Lot Frontage
            </span>
            <select
              name="lotFrontage"
              value={values.lotFrontage}
              onChange={(event) => onFieldChange("lotFrontage", event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/30"
            >
              <option value="">Select lot frontage</option>
              <option value="0-30 ft">0-30 ft</option>
              <option value="31-50 ft">31-50 ft</option>
              <option value="51-80 ft">51-80 ft</option>
              <option value="81-120 ft">81-120 ft</option>
              <option value="120+ ft">120+ ft</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Lot Depth
            </span>
            <select
              name="lotDepth"
              value={values.lotDepth}
              onChange={(event) => onFieldChange("lotDepth", event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/30"
            >
              <option value="">Select lot depth</option>
              <option value="0-75 ft">0-75 ft</option>
              <option value="76-100 ft">76-100 ft</option>
              <option value="101-150 ft">101-150 ft</option>
              <option value="151-200 ft">151-200 ft</option>
              <option value="200+ ft">200+ ft</option>
            </select>
          </label>
        </div>
      </div>
    );
  },
);

PropertyDetailsSection.displayName = "PropertyDetailsSection";

