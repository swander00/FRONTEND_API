'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useId,
  type RefObject,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { TIME_RANGE_OPTIONS } from '@/lib/filters/options';
import { cn } from '@/lib/utils';
import { useFiltersDispatch, useFiltersState } from '../../FiltersContext';
import { getScrollableParents } from '../../utils/getScrollableParents';
import type { StatusOption } from '../../FiltersContext';

export type DateDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: RefObject<HTMLElement>;
};

const MIN_DROPDOWN_WIDTH = 280;
const VERTICAL_OFFSET = 8;
const VIEWPORT_PADDING = 16;

/**
 * Get the date filter label text based on status
 * Returns appropriate text like "Date Listed", "Date Sold", etc.
 */
function getDateFilterLabel(status: StatusOption): { title: string; description: string } {
  switch (status) {
    case 'For Sale':
    case 'For Lease':
      return {
        title: 'Filter by Date Listed',
        description: `Show ${status.toLowerCase()} listings from a specific time period`,
      };
    case 'Sold':
      return {
        title: 'Filter by Date Sold',
        description: 'Show sold listings from a specific time period',
      };
    case 'Leased':
      return {
        title: 'Filter by Date Leased',
        description: 'Show leased listings from a specific time period',
      };
    case 'Removed':
      return {
        title: 'Filter by Date Removed',
        description: 'Show removed listings from a specific time period',
      };
    default:
      return {
        title: 'Filter by Date Listed',
        description: 'Show listings from a specific time period',
      };
  }
}

export function DateDropdown({ isOpen, onClose, anchorRef }: DateDropdownProps) {
  const { timeRange, timeRangeCustomDate, status } = useFiltersState();
  const dispatch = useFiltersDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: MIN_DROPDOWN_WIDTH });
  const [customDate, setCustomDate] = useState(timeRangeCustomDate ?? '');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const quickSelectRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const customDateInputRef = useRef<HTMLInputElement>(null);
  const applyButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const quickSelectHeadingId = useId();
  const customDateHeadingId = useId();
  const customDateInputId = useId();

  const customActive = timeRange === 'Custom Date Range';

  const quickSelectOptions = useMemo(
    () => TIME_RANGE_OPTIONS.filter((option) => option.value !== 'Custom Date Range'),
    [],
  );

  quickSelectRefs.current.length = quickSelectOptions.length;

  const focusElement = useCallback((element: HTMLElement | null | undefined) => {
    if (!element || !element.isConnected) {
      return;
    }

    const focus = () => {
      element.focus({ preventScroll: true });
    };

    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(focus);
    } else {
      focus();
    }
  }, []);

  const focusQuickSelectByIndex = useCallback(
    (index: number) => {
      const items = quickSelectRefs.current;

      if (!items.length) {
        return;
      }

      const total = items.length;
      const normalizedIndex = ((index % total) + total) % total;

      focusElement(items[normalizedIndex]);
    },
    [focusElement],
  );

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      return;
    }

    if (previouslyFocusedRef.current) {
      focusElement(previouslyFocusedRef.current);
      previouslyFocusedRef.current = null;
    }
  }, [focusElement, isOpen]);

  useEffect(() => {
    if (!isOpen || !isMounted) {
      return;
    }

    const activeIndex = quickSelectOptions.findIndex((option) => option.value === timeRange);

    const initialTarget = customActive
      ? customDateInputRef.current
      : quickSelectRefs.current[activeIndex >= 0 ? activeIndex : 0] ?? quickSelectRefs.current[0];

    const fallbackTarget =
      initialTarget ?? quickSelectRefs.current[0] ?? customDateInputRef.current ?? applyButtonRef.current;

    focusElement(fallbackTarget);
  }, [customActive, focusElement, isMounted, isOpen, quickSelectOptions, timeRange]);

  const handleQuickSelectKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
      const total = quickSelectRefs.current.length;

      if (!total) {
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight': {
          event.preventDefault();

          if (index === total - 1) {
            focusElement(customDateInputRef.current);
          } else {
            focusQuickSelectByIndex(index + 1);
          }

          break;
        }
        case 'ArrowUp':
        case 'ArrowLeft': {
          event.preventDefault();

          if (index === 0) {
            focusQuickSelectByIndex(total - 1);
          } else {
            focusQuickSelectByIndex(index - 1);
          }

          break;
        }
        case 'Home': {
          event.preventDefault();
          focusQuickSelectByIndex(0);
          break;
        }
        case 'End': {
          event.preventDefault();
          focusQuickSelectByIndex(total - 1);
          break;
        }
        default:
          break;
      }
    },
    [focusElement, focusQuickSelectByIndex],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCustomDate(timeRangeCustomDate ?? '');
    }
  }, [isOpen, timeRangeCustomDate]);

  const updatePosition = useCallback(() => {
    if (typeof window === 'undefined' || !anchorRef?.current) {
      return;
    }

    const rect = anchorRef.current.getBoundingClientRect();
    const width = Math.max(rect.width, MIN_DROPDOWN_WIDTH);
    const viewportWidth = document.documentElement.clientWidth;
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    const maxLeft = scrollX + viewportWidth - width - VIEWPORT_PADDING;
    const desiredLeft = rect.left + scrollX;
    const left = Math.min(
      Math.max(desiredLeft, scrollX + VIEWPORT_PADDING),
      Math.max(maxLeft, scrollX + VIEWPORT_PADDING),
    );
    const top = rect.bottom + scrollY + VERTICAL_OFFSET;

    setPosition({ top, left, width });
  }, [anchorRef]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    updatePosition();

    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, updatePosition]);

  useEffect(() => {
    if (!isOpen || !anchorRef?.current) {
      return;
    }

    const scrollParents = getScrollableParents(anchorRef.current);

    scrollParents.forEach((parent) => {
      parent.addEventListener('scroll', updatePosition, { passive: true });
    });

    return () => {
      scrollParents.forEach((parent) => {
        parent.removeEventListener('scroll', updatePosition);
      });
    };
  }, [anchorRef, isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const dropdownEl = dropdownRef.current;
      const anchorEl = anchorRef?.current;

      if (dropdownEl?.contains(target)) {
        return;
      }

      if (anchorEl?.contains(target)) {
        return;
      }

      onClose();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [anchorRef, isOpen, onClose]);

  const handleSelect = useCallback(
    (value: (typeof TIME_RANGE_OPTIONS)[number]['value']) => {
      setCustomDate('');
      dispatch({ type: 'SET_TIME_RANGE_CUSTOM_DATE', payload: null });
      dispatch({ type: 'SET_TIME_RANGE', payload: value });
      onClose();
    },
    [dispatch, onClose, setCustomDate],
  );

  const handleCustomApply = useCallback(() => {
    if (!customDate) {
      return;
    }

    dispatch({ type: 'SET_TIME_RANGE_CUSTOM_DATE', payload: customDate });
    dispatch({ type: 'SET_TIME_RANGE', payload: 'Custom Date Range' });
    onClose();
  }, [customDate, dispatch, onClose]);

  const dateFilterLabels = useMemo(() => getDateFilterLabel(status), [status]);

  const dropdownContent = useMemo(() => {
    if (!isOpen || !isMounted) {
      return null;
    }

    return (
      <div
        ref={dropdownRef}
        className="z-[121] max-w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"
        style={{ position: 'absolute', top: position.top, left: position.left, width: position.width }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-3">
          <div>
            <p id={titleId} className="text-sm font-semibold text-slate-900">
              {dateFilterLabels.title}
            </p>
            <p id={descriptionId} className="text-xs text-slate-500">
              {dateFilterLabels.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
            aria-label="Close date dropdown"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="px-4 py-3">
          <p
            id={quickSelectHeadingId}
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400"
          >
            Quick Select
          </p>
          <div
            className="mt-1.5 space-y-1"
            role="radiogroup"
            aria-labelledby={quickSelectHeadingId}
          >
            {quickSelectOptions.map((option, index) => {
              const isActive = timeRange === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  onKeyDown={(event) => handleQuickSelectKeyDown(event, index)}
                  ref={(element) => {
                    quickSelectRefs.current[index] = element;
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-inner ring-1 ring-blue-100'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                  )}
                  role="radio"
                  aria-checked={isActive}
                >
                  <span>{option.label}</span>
                  {isActive ? <CheckIcon className="h-4 w-4 text-blue-600" /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={cn(
            'border-t border-slate-100 px-4 py-3 transition-colors',
            customActive ? 'bg-blue-50/60' : 'bg-white',
          )}
        >
          <p
            id={customDateHeadingId}
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400"
          >
            Custom Date
          </p>
          <label className="mt-2 block text-xs font-medium text-slate-600" htmlFor={customDateInputId}>
            Show listings since:
            <div className="relative mt-1">
              <input
                type="date"
                value={customDate}
                onChange={(event) => setCustomDate(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleCustomApply();
                  }
                }}
                ref={customDateInputRef}
                id={customDateInputId}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-700 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </label>
          <button
            type="button"
            onClick={handleCustomApply}
            disabled={!customDate}
            ref={applyButtonRef}
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          >
            Apply Custom Date
          </button>
        </div>
      </div>
    );
  }, [
    customActive,
    customDate,
    dateFilterLabels,
    handleCustomApply,
    handleQuickSelectKeyDown,
    handleSelect,
    isMounted,
    isOpen,
    onClose,
    position.left,
    position.top,
    position.width,
    quickSelectOptions,
    timeRange,
    titleId,
    descriptionId,
    quickSelectHeadingId,
    customDateHeadingId,
    customDateInputId,
  ]);

  if (!dropdownContent) {
    return null;
  }

  return createPortal(dropdownContent, document.body);
}

function CheckIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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

function CloseIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4.5 4.5l7 7m0-7l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M5 2.5V4.5M15 2.5V4.5M3.5 8.5H16.5M5 5H15C15.8284 5 16.5 5.67157 16.5 6.5V15C16.5 15.8284 15.8284 16.5 15 16.5H5C4.17157 16.5 3.5 15.8284 3.5 15V6.5C3.5 5.67157 4.17157 5 5 5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
