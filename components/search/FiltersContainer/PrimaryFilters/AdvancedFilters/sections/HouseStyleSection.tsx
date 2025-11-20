import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  HOUSE_STYLE_CATEGORIES,
  type AdvancedFiltersState,
} from "../state";
import { cn } from "@/lib/utils";

export type HouseStyleSectionProps = {
  selected: AdvancedFiltersState["houseStyle"];
  onToggle: (displayName: string) => void;
};

function CheckIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 8.5L6.5 11L12 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const HouseStyleSection: React.FC<HouseStyleSectionProps> = React.memo(
  ({ selected, onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleSelectAll = useCallback(() => {
      // Clear all selections by toggling each selected item off
      const selectedCopy = [...selected];
      selectedCopy.forEach((style) => {
        onToggle(style);
      });
    }, [selected, onToggle]);

    const isAllSelected = useMemo(() => selected.length === 0, [selected.length]);

    const displayText = useMemo(() => {
      if (selected.length === 0) {
        return "Select house style";
      }
      if (selected.length === 1) {
        return selected[0];
      }
      return `${selected.length} selected`;
    }, [selected]);

    useEffect(() => {
      if (!isOpen) {
        return;
      }

      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node;
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(target) &&
          buttonRef.current &&
          !buttonRef.current.contains(target)
        ) {
          setIsOpen(false);
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [isOpen]);

    return (
      <div className="relative flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          House Style
        </label>
        <div className="relative">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/30",
              selected.length > 0 && "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-500/20",
              isOpen && "border-blue-500 ring-2 ring-blue-500/40 dark:border-blue-400 dark:ring-blue-400/30"
            )}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <span className={cn(
              "truncate",
              selected.length === 0 && "text-slate-400 dark:text-slate-500"
            )}>
              {displayText}
            </span>
            <ChevronDownIcon
              className={cn(
                "ml-2 h-4 w-4 flex-shrink-0 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </button>

          {isOpen && (
            <div
              ref={dropdownRef}
              className="absolute z-[100] mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
              role="listbox"
            >
              <div className="max-h-[400px] overflow-y-auto p-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2",
                    isAllSelected
                      ? "border-transparent bg-blue-600 text-white shadow-md"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  )}
                  aria-pressed={isAllSelected}
                >
                  <span className="font-medium">All Styles</span>
                  {isAllSelected && <CheckIcon className="h-4 w-4 text-white" />}
                </button>

                <div className="mt-2 space-y-4">
                  {HOUSE_STYLE_CATEGORIES.map((category) => (
                    <div key={category.categoryName} className="space-y-2">
                      <div className="px-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          {category.categoryName}
                        </h3>
                      </div>
                      <div className="space-y-1">
                        {category.options.map((option) => {
                          const isSelected = selected.includes(option.displayName);
                          return (
                            <button
                              key={option.displayName}
                              type="button"
                              onClick={() => {
                                onToggle(option.displayName);
                              }}
                              className={cn(
                                "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2",
                                isSelected
                                  ? "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200"
                                  : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                              )}
                              aria-pressed={isSelected}
                            >
                              <span className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "h-2.5 w-2.5 rounded-full border",
                                    isSelected
                                      ? "border-blue-600 bg-blue-600 dark:border-blue-400 dark:bg-blue-400"
                                      : "border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700"
                                  )}
                                />
                                {option.displayName}
                              </span>
                              {isSelected && (
                                <CheckIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);

HouseStyleSection.displayName = "HouseStyleSection";

