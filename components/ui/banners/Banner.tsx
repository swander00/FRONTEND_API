import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BannerProps = {
  children: ReactNode;
  variant?: 'default' | 'alert' | 'info';
  className?: string;
};

const VARIANT_STYLES: Record<NonNullable<BannerProps['variant']>, string> = {
  default: 'bg-gray-100 text-gray-800',
  alert: 'bg-blue-600 text-white',
  info: 'bg-blue-50 text-blue-800',
};

export function Banner({ children, variant = 'default', className }: BannerProps) {
  return (
    <div className={cn('w-full px-4 py-2', VARIANT_STYLES[variant], className)}>
      {children}
    </div>
  );
}

