'use client';

import React, { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const SIZE_CLASSNAMES: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
  full: 'max-w-[min(100%,100rem)] h-[92vh]',
};

export type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: ModalSize;
  className?: string;
  contentClassName?: string;
  overlayClassName?: string;
};

export function BaseModal({
  isOpen,
  onClose,
  children,
  size = 'md',
  className,
  contentClassName,
  overlayClassName = 'z-[9998]',
}: BaseModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Also check if window is available (client-side only)
  const isClient = typeof window !== 'undefined';

  if (!isOpen) {
    return null;
  }

  // Only check isMounted if we're on the client
  // This prevents SSR issues while allowing the modal to render on client
  if (!isClient) {
    return null;
  }

  // If not mounted yet, wait for mount (but this should be very brief)
  if (!isMounted) {
    return null;
  }

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6',
        overlayClassName,
      )}
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          'relative flex w-full flex-col overflow-hidden rounded-3xl bg-white shadow-2xl',
          SIZE_CLASSNAMES[size],
          className,
        )}
        role="document"
      >
        <div className={cn('flex h-full flex-col overflow-hidden', contentClassName)}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}


