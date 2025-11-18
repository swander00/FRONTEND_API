'use client';

import { useCallback, useEffect, useId, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { STATUS_OPTIONS } from '@/lib/filters/options';
import { cn } from '@/lib/utils';
import { DEFAULT_FILTERS_STATE, useFiltersDispatch, useFiltersState } from '../../FiltersContext';
import { getScrollableParents } from '../../utils/getScrollableParents';

const MIN_DROPDOWN_WIDTH = 256;
const VERTICAL_OFFSET = 8;
const VIEWPORT_PADDING = 16;

export type StatusDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: RefObject<HTMLElement>;
};

export function StatusDropdown({ isOpen, onClose, anchorRef }: StatusDropdownProps) {
  const { status } = useFiltersState();
  const dispatch = useFiltersDispatch();
  const currentStatus = status ?? DEFAULT_FILTERS_STATE.status;
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: MIN_DROPDOWN_WIDTH });
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<Element | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const headingId = useId();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

    setPosition((prev) => {
      if (prev.top === top && prev.left === left && prev.width === width) {
        return prev;
      }

      return { top, left, width };
    });
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
    (nextStatus: (typeof STATUS_OPTIONS)[number]['value']) => {
      dispatch({ type: 'SET_STATUS', payload: nextStatus });
      onClose();
    },
    [dispatch, onClose],
  );

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    if (isOpen) {
      restoreFocusRef.current = document.activeElement;
      const activeIndex = STATUS_OPTIONS.findIndex((option) => option.value === currentStatus);
      const defaultIndex = activeIndex === -1 ? 0 : activeIndex;
      setFocusedIndex(defaultIndex);

      requestAnimationFrame(() => {
        optionRefs.current[defaultIndex]?.focus({ preventScroll: true });
      });
      return;
    }

    setFocusedIndex(-1);
    const elementToRestore = restoreFocusRef.current;
    restoreFocusRef.current = null;
    if (elementToRestore instanceof HTMLElement) {
      requestAnimationFrame(() => {
        elementToRestore.focus({ preventScroll: true });
      });
    }
  }, [currentStatus, isMounted, isOpen]);

  useEffect(() => {
    if (!isOpen || focusedIndex === -1) {
      return;
    }

    const target = optionRefs.current[focusedIndex];
    if (!target) {
      return;
    }

    requestAnimationFrame(() => {
      target.focus({ preventScroll: true });
    });
  }, [focusedIndex, isOpen]);

  const handleOptionKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (!isOpen) {
        return;
      }

      const lastIndex = STATUS_OPTIONS.length - 1;

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight': {
          event.preventDefault();
          const nextIndex = index === lastIndex ? 0 : index + 1;
          setFocusedIndex(nextIndex);
          break;
        }
        case 'ArrowUp':
        case 'ArrowLeft': {
          event.preventDefault();
          const previousIndex = index === 0 ? lastIndex : index - 1;
          setFocusedIndex(previousIndex);
          break;
        }
        case 'Home': {
          event.preventDefault();
          setFocusedIndex(0);
          break;
        }
        case 'End': {
          event.preventDefault();
          setFocusedIndex(lastIndex);
          break;
        }
        case 'Enter':
        case ' ': // Space
        case 'Spacebar': {
          event.preventDefault();
          handleSelect(STATUS_OPTIONS[index].value);
          break;
        }
        case 'Escape': {
          event.preventDefault();
          onClose();
          break;
        }
        default:
          break;
      }
    },
    [handleSelect, isOpen, onClose],
  );

  if (!isMounted || !isOpen) {
    return null;
  }

  return createPortal(
    <div
      ref={dropdownRef}
      className="z-[121] max-w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
      style={{ position: 'absolute', top: position.top, left: position.left, width: position.width }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-white px-4 py-3">
        <div>
          <h2 id={headingId} className="text-sm font-semibold text-slate-900">
            Select Status
          </h2>
          <p className="text-xs text-slate-500">Choose property status to filter</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
          aria-label="Close status dropdown"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      <ul className="py-1" role="listbox" aria-activedescendant={focusedIndex >= 0 ? STATUS_OPTIONS[focusedIndex].value : undefined}>
        {STATUS_OPTIONS.map((option, index) => {
          const isActive = option.value === currentStatus;
          const isFocused = focusedIndex === index;

          return (
            <li key={option.value} role="presentation">
              <button
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                id={option.value}
                type="button"
                role="option"
                tabIndex={isFocused ? 0 : -1}
                aria-selected={isActive}
                onClick={() => handleSelect(option.value)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center">
                    <span
                      className={cn(
                        'h-2.5 w-2.5 rounded-full shadow-[0_0_0_2px_rgba(148,163,184,0.25)] transition',
                        option.color,
                        isActive && 'shadow-[0_0_0_3px_rgba(59,130,246,0.35)]',
                      )}
                      style={{ backgroundColor: option.dotColor }}
                    />
                  </span>
                  {option.label}
                </span>
                {isActive ? <CheckIcon className="h-4 w-4 text-blue-600" /> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>,
    document.body,
  );
}

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

function CloseIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M4.5 4.5l7 7m0-7l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
