import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const BADGE_BASE_STYLES =
  'inline-flex h-7 min-w-[3rem] items-center justify-center rounded-full px-3 text-xs font-semibold leading-none whitespace-nowrap';

type BadgeProps = {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
};

const VARIANT_STYLES: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-blue-600 text-white',
  secondary: 'bg-green-600 text-white',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return <span className={cn(BADGE_BASE_STYLES, VARIANT_STYLES[variant], className)}>{children}</span>;
}

