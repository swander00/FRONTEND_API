'use client';

import { BaseModal as FilterBaseModal } from '@/components/search/FiltersContainer/Shared/Modals/BaseModal';
import { Icon } from '@/components/ui/icons/Icon';
import { IconButton } from '@/components/ui/buttons/IconButton';
import type { ReactNode } from 'react';

export type { BaseModalProps } from '@/components/search/FiltersContainer/Shared/Modals/BaseModal';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Wrapper component that matches the HomeEvaluation component expectations
export type EnhancedBaseModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: ModalSize;
  className?: string;
  showBackButton?: boolean;
  onBack?: () => void;
};

export function BaseModal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className,
  showBackButton = false,
  onBack,
}: EnhancedBaseModalProps) {
  return (
    <FilterBaseModal
      isOpen={open}
      onClose={onClose}
      size={size}
      className={className}
      contentClassName="flex flex-col"
    >
      {(title || description || showBackButton) && (
        <div className="flex items-start justify-between border-b border-gray-100 px-6 pb-4 pt-5">
          <div className="flex items-center gap-3">
            {showBackButton && onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label="Go back"
                className="h-9 w-9 flex items-center justify-center border border-gray-200 bg-white/80 shadow-sm hover:bg-gray-50 rounded-md transition-colors"
              >
                <svg
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <div className="space-y-1">
              {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
              {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
          </div>
          <IconButton
            ariaLabel="Close modal"
            onClick={onClose}
            icon={<Icon name="close" className="h-5 w-5 text-gray-500" />}
            className="h-9 w-9 border border-gray-200 bg-white/80 shadow-sm hover:bg-gray-50"
          />
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
    </FilterBaseModal>
  );
}

