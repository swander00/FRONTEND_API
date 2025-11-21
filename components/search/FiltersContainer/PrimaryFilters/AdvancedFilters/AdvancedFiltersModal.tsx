import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  AdvancedFiltersState,
  RangeField,
  advancedFiltersReducer,
  areAdvancedFiltersEqual,
  normaliseFilters,
  BASEMENT_FEATURE_OPTIONS,
  OPEN_HOUSE_TIMING_OPTIONS,
} from "./state";
import {
  BasementFeaturesSection,
  HouseStyleSection,
  OpenHouseSection,
  PropertyDetailsSection,
  PropertyFeaturesSection,
  RangeFiltersSection,
} from "./sections";

type AdvancedFiltersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: AdvancedFiltersState) => void;
  initialFilters?: Partial<AdvancedFiltersState>;
};

export type { AdvancedFiltersModalProps, AdvancedFiltersState };

let bodyScrollLockCount = 0;

const lockBodyScroll = () => {
  if (typeof document === "undefined") {
    return () => {};
  }

  bodyScrollLockCount += 1;
  if (bodyScrollLockCount === 1) {
    document.body.classList.add("overflow-hidden");
  }

  return () => {
    if (typeof document === "undefined") {
      return;
    }
    bodyScrollLockCount = Math.max(0, bodyScrollLockCount - 1);
    if (bodyScrollLockCount === 0) {
      document.body.classList.remove("overflow-hidden");
    }
  };
};

const getFocusableElements = (root: HTMLElement | null): HTMLElement[] => {
  if (!root) {
    return [];
  }
  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([type=hidden]):not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ];
  const elements = root.querySelectorAll<HTMLElement>(focusableSelectors.join(","));
  return Array.from(elements).filter((element) => !element.hasAttribute("aria-hidden"));
};

const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const releaseScrollRef = useRef<() => void>();
  const baseState = useMemo(() => normaliseFilters(initialFilters), [initialFilters]);
  const [state, dispatch] = useReducer(advancedFiltersReducer, baseState);
  const [isDirty, setIsDirty] = useState(false);
  const initialRef = useRef(baseState);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    initialRef.current = baseState;
    dispatch({ type: "RESET", payload: baseState });
    setIsDirty(false);
  }, [baseState, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    releaseScrollRef.current = lockBodyScroll();

    const container = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusFirst = () => {
      const focusable = getFocusableElements(container);
      const first = focusable[0] ?? container;
      if (first && typeof first.focus === "function") {
        first.focus();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !container) {
        return;
      }

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    };

    focusFirst();
    container?.addEventListener("keydown", handleKeyDown);

    return () => {
      container?.removeEventListener("keydown", handleKeyDown);
      if (releaseScrollRef.current) {
        releaseScrollRef.current();
        releaseScrollRef.current = undefined;
      }
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setIsDirty(!areAdvancedFiltersEqual(state, initialRef.current));
  }, [state]);

  const handleRangeChange = useCallback(
    (field: RangeField, bound: "min" | "max", value: number) => {
      console.log(`[AdvancedFiltersModal] handleRangeChange for ${field}.${bound}:`, {
        value,
        type: typeof value,
        currentState: state[field === 'propertyTax' ? 'propertyTaxMin' : field === 'maintenanceFees' ? 'maintenanceFeesMin' : 'squareFootageMin'],
      });
      dispatch({ type: "SET_RANGE", field, bound, value });
    },
    [state],
  );

  const handleFieldChange = useCallback(
    (field: keyof AdvancedFiltersState, value: string) => {
      console.log('[AdvancedFiltersModal] handleFieldChange:', { field, value });
      dispatch({ type: "SET_FIELD", field, value });
    },
    [],
  );

  const handleBasementToggle = useCallback(
    (value: (typeof BASEMENT_FEATURE_OPTIONS)[number]) => {
      dispatch({ type: "TOGGLE_BASEMENT_FEATURE", value });
    },
    [],
  );

  const handleHouseStyleToggle = useCallback(
    (displayName: string) => {
      dispatch({ type: "TOGGLE_HOUSE_STYLE", value: displayName });
    },
    [],
  );

  const handleOpenHouseChange = useCallback(
    (value: (typeof OPEN_HOUSE_TIMING_OPTIONS)[number]) => {
      dispatch({ type: "SET_OPEN_HOUSE", value });
    },
    [],
  );

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET", payload: initialRef.current });
    setIsDirty(false);
  }, []);

  const propertyDetailsValues = useMemo(
    () => ({
      keyword: state.keyword,
      propertyClass: state.propertyClass,
      lotFrontage: state.lotFrontage,
      lotDepth: state.lotDepth,
    }),
    [state.keyword, state.propertyClass, state.lotFrontage, state.lotDepth],
  );

  const propertyFeatureValues = useMemo(
    () => ({
      propertyAge: state.propertyAge,
      hasSwimmingPool: state.hasSwimmingPool,
      waterfront: state.waterfront,
    }),
    [state.propertyAge, state.hasSwimmingPool, state.waterfront],
  );

  const handleApply = useCallback(() => {
    console.log('[AdvancedFiltersModal] handleApply - state before onApply:', {
      propertyClass: state.propertyClass,
      fullState: state
    });
    onApply(state);
    console.log('[AdvancedFiltersModal] handleApply - after onApply called');
    initialRef.current = state;
    setIsDirty(false);
    onClose();
  }, [onApply, onClose, state]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10 dark:bg-slate-900 dark:ring-white/10"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-slate-900 dark:text-white">
                  Advanced Filters
                </h2>
            <p id={descriptionId} className="text-sm text-slate-500 dark:text-slate-400">
              Refine results with granular controls.
                </p>
              </div>
              <button
                type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-sm font-medium text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                aria-label="Close advanced filters"
              >
            <span className="text-xl leading-none">&times;</span>
              </button>
            </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
            <PropertyDetailsSection values={propertyDetailsValues} onFieldChange={handleFieldChange} />
            <HouseStyleSection selected={state.houseStyle} onToggle={handleHouseStyleToggle} />
            <RangeFiltersSection values={state} onRangeChange={handleRangeChange} />
            <PropertyFeaturesSection values={propertyFeatureValues} onFieldChange={handleFieldChange} />
            <div className="grid gap-4 sm:grid-cols-2">
              <BasementFeaturesSection selected={state.basementFeatures} onToggle={handleBasementToggle} />
              <OpenHouseSection value={state.openHouseTiming} onChange={handleOpenHouseChange} />
            </div>
          </form>
                    </div>

        <div className="border-t border-slate-200 bg-slate-50/80 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {isDirty ? "Unsaved changes" : "No filters applied yet"}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                Reset
                  </button>
                <button
                  type="button"
                  onClick={handleApply}
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AdvancedFiltersModal;

type AdvancedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
  label?: string;
  badgeCount?: number;
};

export const AdvancedButton = forwardRef<HTMLButtonElement, AdvancedButtonProps>(
  ({ isActive = false, label = "Advanced", badgeCount, className, ...props }, ref) => {
    const showBadge = typeof badgeCount === "number" && badgeCount > 0;

    const baseClasses =
      "group inline-flex h-12 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 shadow-md shadow-gray-200/50 ring-1 ring-gray-100/50 hover:shadow-lg hover:shadow-gray-200/60 hover:ring-gray-200/60 active:scale-[0.98]";
    const states = [
      "border-slate-200/80 bg-gradient-to-r from-white via-slate-50/50 to-white text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:from-blue-50/50 hover:via-blue-50/30 hover:to-blue-50/50",
      isActive && "border-blue-500 bg-gradient-to-r from-blue-50 via-blue-100/50 to-blue-50 text-blue-600 hover:border-blue-500 hover:text-blue-600",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type="button"
        className={[baseClasses, states].filter(Boolean).join(" ")}
        aria-pressed={isActive}
        {...props}
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-xs font-semibold text-white shadow-md shadow-blue-500/40 transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/50">
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
            />
          </svg>
        </span>
        <span className="leading-tight">{label}</span>
        {showBadge ? (
          <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-2 text-xs font-semibold text-white shadow-md shadow-blue-500/40">
            {badgeCount}
          </span>
        ) : null}
      </button>
    );
  },
);

AdvancedButton.displayName = "AdvancedButton";
