import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  icon?: ReactNode;
  highlight?: boolean;
  buttonClassName?: string;
};

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className,
  icon,
  highlight = false,
  buttonClassName,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const buttonClasses = cn(
    'flex h-12 w-full items-center justify-between rounded-full border px-5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
    highlight
      ? 'border-blue-600 bg-blue-600 text-white shadow-[0_6px_14px_-6px_rgba(37,99,235,0.45)] hover:bg-[#1956d7]'
      : 'border-[#d8deea] bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600',
    buttonClassName
  );

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-gray-400" aria-hidden="true">
              {icon}
            </span>
          )}
          <span>{selectedOption?.label || placeholder}</span>
        </div>
        <svg
          className={cn(
            'h-5 w-5 text-gray-400 transition-transform',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full overflow-auto rounded-2xl border border-gray-200 bg-white shadow-lg shadow-blue-100/40 ring-1 ring-black/5">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                'w-full px-4 py-2 text-left text-sm transition-colors focus:outline-none',
                value === option.value
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

