import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionCardProps = {
  children: ReactNode;
  className?: string;
  padding?: 'tight' | 'normal' | 'loose';
};

const paddingMap: Record<NonNullable<SectionCardProps['padding']>, string> = {
  tight: 'p-4',
  normal: 'p-6',
  loose: 'p-8',
};

export function SectionCard({
  children,
  className,
  padding = 'normal',
}: SectionCardProps) {
  return (
    <section
      className={cn(
        'rounded-2xl bg-white shadow-sm shadow-blue-100/40',
        paddingMap[padding],
        className
      )}
    >
      {children}
    </section>
  );
}

