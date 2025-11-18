'use client';

import { Button } from '@/components/ui/buttons/Button';
import { cn } from '@/lib/utils';

export type ModalFooterProps = {
  onCancel: () => void;
  onReset?: () => void;
  onApply?: () => void;
  cancelLabel?: string;
  resetLabel?: string;
  applyLabel?: string;
  disableApply?: boolean;
  className?: string;
};

export function ModalFooter({
  onCancel,
  onReset,
  onApply,
  cancelLabel = 'Cancel',
  resetLabel = 'Reset All',
  applyLabel = 'Apply Filters',
  disableApply = false,
  className,
}: ModalFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="rounded-full px-4 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          {cancelLabel}
        </Button>
        {onReset ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="rounded-full border-gray-200 px-4 text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600"
          >
            {resetLabel}
          </Button>
        ) : null}
      </div>
      {onApply ? (
        <Button
          type="button"
          size="sm"
          onClick={onApply}
          disabled={disableApply}
          className="rounded-full px-5 text-sm font-semibold shadow-sm shadow-blue-100/60"
        >
          {applyLabel}
        </Button>
      ) : null}
    </div>
  );
}


