'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { useFiltersDispatch, useFiltersState } from '../../FiltersContext';
import { cn } from '@/lib/utils';
import { getScrollableParents } from '../../utils/getScrollableParents';
import { CityList } from './CityList';

export type CityModalProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: RefObject<HTMLElement>;
};

const MIN_DROPDOWN_WIDTH = 280;
const VIEWPORT_PADDING = 16;
const VERTICAL_OFFSET = 8;

export function CityModal({ isOpen, onClose, anchorRef }: CityModalProps) {
  const { cities } = useFiltersState();
  const dispatch = useFiltersDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: MIN_DROPDOWN_WIDTH });

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
    const left = Math.min(Math.max(desiredLeft, scrollX + VIEWPORT_PADDING), Math.max(maxLeft, scrollX + VIEWPORT_PADDING));
    const top = rect.bottom + VERTICAL_OFFSET + scrollY;

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

  const handleToggleCity = useCallback(
    (city: string) => {
      dispatch({
        type: 'SET_CITIES',
        payload: cities.includes(city)
          ? cities.filter((item) => item !== city)
          : [...cities, city],
      });
    },
    [cities, dispatch],
  );

  const handleSelectAll = useCallback(() => {
    dispatch({ type: 'SET_CITIES', payload: [] });
  }, [dispatch]);

  const isAllCities = useMemo(() => cities.length === 0, [cities.length]);

  const dropdownContent = useMemo(() => {
    if (!isMounted || !isOpen) {
      return null;
    }

    return (
      <div
        ref={dropdownRef}
        className="z-[121] max-h-[min(720px,calc(100vh-2rem))] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"
        style={{ position: 'absolute', top: position.top, left: position.left, width: position.width }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-base font-semibold text-slate-900">Select City</p>
            <p className="text-xs text-slate-500">Choose one or multiple locations</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Close city dropdown"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 pb-5 pt-4">
          <button
            type="button"
            onClick={handleSelectAll}
            className={cn(
              'flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
              isAllCities
                ? 'border-transparent bg-blue-600 text-white shadow-md'
                : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/60',
            )}
            aria-pressed={isAllCities}
          >
            <div>
              <p className="text-sm font-semibold">All Cities</p>
            </div>
            {isAllCities ? <CheckIcon className="h-4 w-4 text-white" /> : null}
          </button>

          <CityList selected={cities} onToggle={handleToggleCity} />
        </div>
      </div>
    );
  }, [cities, handleSelectAll, handleToggleCity, isAllCities, isMounted, isOpen, onClose, position.left, position.top, position.width]);

  if (!dropdownContent) {
    return null;
  }

  return createPortal(dropdownContent, document.body);
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
