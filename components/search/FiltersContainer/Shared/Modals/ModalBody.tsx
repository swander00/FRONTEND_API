'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ModalBodyProps = {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  scrollable?: boolean;
};

export function ModalBody({
  children,
  className,
  padded = true,
  scrollable = true,
}: ModalBodyProps) {
  return (
    <div
      className={cn(
        scrollable ? 'flex-1 overflow-y-auto' : 'flex-1',
        padded ? 'px-6 py-5' : '',
        className,
      )}
    >
      {children}
    </div>
  );
}


