'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const SelectContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedLabel: string;
  setSelectedLabel: (label: string) => void;
} | null>(null);

export type SelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
};

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState('');
  const selectRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, selectedLabel, setSelectedLabel }}>
      <div className="relative w-full" ref={selectRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export type SelectTriggerProps = {
  className?: string;
  children?: React.ReactNode;
};

export function SelectTrigger({ className, children }: SelectTriggerProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectTrigger must be used within Select');

  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
        className
      )}
    >
      {children || <span className="text-gray-500">Select...</span>}
      <ChevronDown className="h-4 w-4 text-gray-400" />
    </button>
  );
}

export type SelectValueProps = {
  placeholder?: string;
};

export function SelectValue({ placeholder }: SelectValueProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectValue must be used within Select');

  const displayValue = context.selectedLabel || context.value || placeholder || 'Select...';
  return <span>{displayValue}</span>;
}

export type SelectContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function SelectContent({ children, className }: SelectContentProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectContent must be used within Select');

  if (!context.open) return null;

  return (
    <div
      className={cn(
        'absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg',
        className
      )}
    >
      <div className="max-h-60 overflow-auto p-1">{children}</div>
    </div>
  );
}

export type SelectItemProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

export function SelectItem({ value, children, className }: SelectItemProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectItem must be used within Select');

  const isSelected = context.value === value;

  React.useEffect(() => {
    if (isSelected && typeof children === 'string') {
      context.setSelectedLabel(children);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected, children]);

  return (
    <button
      type="button"
      onClick={() => {
        context.onValueChange(value);
        context.setSelectedLabel(typeof children === 'string' ? children : value);
        context.setOpen(false);
      }}
      className={cn(
        'w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none',
        isSelected && 'bg-blue-50 text-blue-900',
        className
      )}
    >
      {children}
    </button>
  );
}

