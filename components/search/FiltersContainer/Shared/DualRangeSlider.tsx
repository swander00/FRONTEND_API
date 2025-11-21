'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type DualRangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
};

export function DualRangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  className,
  disabled = false,
  'aria-label': ariaLabel,
}: DualRangeSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [isFocused, setIsFocused] = useState<'min' | 'max' | null>(null);

  // Clamp values to valid range
  const clampedMin = Math.max(min, Math.min(value.min, value.max));
  const clampedMax = Math.min(max, Math.max(value.min, value.max));

  // Calculate percentages
  const range = max - min;
  const minPercent = range > 0 ? ((clampedMin - min) / range) * 100 : 0;
  const maxPercent = range > 0 ? ((clampedMax - min) / range) * 100 : 100;

  // Calculate fill position
  const fillLeft = minPercent;
  const fillWidth = maxPercent - minPercent;

  // Convert pixel position to value
  const getValueFromPosition = useCallback(
    (clientX: number): number => {
      if (!containerRef.current) return min;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const rawValue = min + (percentage / 100) * range;
      // Round to nearest step
      return Math.round(rawValue / step) * step;
    },
    [min, range, step],
  );

  // Handle mouse/touch start
  const handleStart = useCallback(
    (clientX: number, target: 'min' | 'max') => {
      if (disabled) return;
      setIsDragging(target);
      const newValue = getValueFromPosition(clientX);
      
      if (target === 'min') {
        onChange({ min: Math.min(newValue, clampedMax), max: clampedMax });
      } else {
        onChange({ min: clampedMin, max: Math.max(newValue, clampedMin) });
      }
    },
    [disabled, getValueFromPosition, clampedMin, clampedMax, onChange],
  );

  // Handle mouse/touch move
  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || disabled) return;
      const newValue = getValueFromPosition(clientX);
      
      if (isDragging === 'min') {
        onChange({ min: Math.min(newValue, clampedMax), max: clampedMax });
      } else {
        onChange({ min: clampedMin, max: Math.max(newValue, clampedMin) });
      }
    },
    [isDragging, disabled, getValueFromPosition, clampedMin, clampedMax, onChange],
  );

  // Handle mouse/touch end
  const handleEnd = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Mouse events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      
      // Determine which thumb is closer
      const minThumbX = (minPercent / 100) * width;
      const maxThumbX = (maxPercent / 100) * width;
      const distanceToMin = Math.abs(x - minThumbX);
      const distanceToMax = Math.abs(x - maxThumbX);
      
      const targetThumb = distanceToMin < distanceToMax ? 'min' : 'max';
      handleStart(e.clientX, targetThumb);
    },
    [disabled, minPercent, maxPercent, handleStart],
  );

  // Touch events
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const width = rect.width;
      
      // Determine which thumb is closer
      const minThumbX = (minPercent / 100) * width;
      const maxThumbX = (maxPercent / 100) * width;
      const distanceToMin = Math.abs(x - minThumbX);
      const distanceToMax = Math.abs(x - maxThumbX);
      
      const targetThumb = distanceToMin < distanceToMax ? 'min' : 'max';
      handleStart(e.touches[0].clientX, targetThumb);
    },
    [disabled, minPercent, maxPercent, handleStart],
  );

  // Global mouse/touch move and end handlers
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      handleMove(e.touches[0].clientX);
    };

    const handleMouseUp = () => {
      handleEnd();
    };

    const handleTouchEnd = () => {
      handleEnd();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  // Keyboard handlers for accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, thumb: 'min' | 'max') => {
      if (disabled) return;
      
      let delta = 0;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        delta = -step;
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        delta = step;
      } else if (e.key === 'Home') {
        delta = min - (thumb === 'min' ? clampedMin : clampedMax);
      } else if (e.key === 'End') {
        delta = max - (thumb === 'min' ? clampedMin : clampedMax);
      } else {
        return;
      }

      e.preventDefault();
      const newValue = (thumb === 'min' ? clampedMin : clampedMax) + delta;
      
      if (thumb === 'min') {
        onChange({ min: Math.max(min, Math.min(newValue, clampedMax)), max: clampedMax });
      } else {
        onChange({ min: clampedMin, max: Math.min(max, Math.max(newValue, clampedMin)) });
      }
    },
    [disabled, step, min, max, clampedMin, clampedMax, onChange],
  );

  return (
    <div
      ref={containerRef}
      className={cn('relative flex h-6 items-center touch-none', className)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="group"
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {/* Track background */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-200 dark:bg-slate-700"
        aria-hidden="true"
      />
      
      {/* Active fill */}
      <div
        className="pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-blue-500 dark:bg-blue-400 transition-colors"
        style={{
          left: `${fillLeft}%`,
          width: `${fillWidth}%`,
        }}
        aria-hidden="true"
      />
      
      {/* Min thumb */}
      <div
        role="slider"
        aria-label={`${ariaLabel || 'Minimum'} value`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={clampedMin}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          'absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-white bg-blue-500 shadow-md transition-all duration-150',
          'hover:scale-110 hover:bg-blue-600',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'active:scale-110',
          disabled && 'cursor-not-allowed opacity-50',
          isFocused === 'min' && 'ring-2 ring-blue-500 ring-offset-2',
          isDragging === 'min' && 'scale-110',
          'dark:bg-blue-400 dark:hover:bg-blue-500',
        )}
        style={{
          left: `${minPercent}%`,
        }}
        onKeyDown={(e) => {
          setIsFocused('min');
          handleKeyDown(e, 'min');
        }}
        onBlur={() => setIsFocused(null)}
        onFocus={() => setIsFocused('min')}
      />
      
      {/* Max thumb */}
      <div
        role="slider"
        aria-label={`${ariaLabel || 'Maximum'} value`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={clampedMax}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          'absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-white bg-blue-500 shadow-md transition-all duration-150',
          'hover:scale-110 hover:bg-blue-600',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'active:scale-110',
          disabled && 'cursor-not-allowed opacity-50',
          isFocused === 'max' && 'ring-2 ring-blue-500 ring-offset-2',
          isDragging === 'max' && 'scale-110',
          'dark:bg-blue-400 dark:hover:bg-blue-500',
        )}
        style={{
          left: `${maxPercent}%`,
        }}
        onKeyDown={(e) => {
          setIsFocused('max');
          handleKeyDown(e, 'max');
        }}
        onBlur={() => setIsFocused(null)}
        onFocus={() => setIsFocused('max')}
      />
    </div>
  );
}

