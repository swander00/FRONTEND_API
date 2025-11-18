import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './Input';

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void;
  containerClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    { onSearch, containerClassName, className, ...props },
    ref
  ) {
  const getCurrentValue = () => {
    const value = props.value;

    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.join(' ');
    }

    if (typeof value === 'number') {
      return value.toString();
    }

    return '';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch?.(getCurrentValue());
    }
    // Call original onKeyDown if provided
    props.onKeyDown?.(e);
  };

  return (
    <div className={cn('relative w-full', containerClassName)}>
      <Input
        ref={ref}
        type="text"
        className={cn('pr-20', className)}
        {...props}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        onClick={() => onSearch?.(getCurrentValue())}
        className="absolute top-1/2 right-1 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="Submit search"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
}
);

