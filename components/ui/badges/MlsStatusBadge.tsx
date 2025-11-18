import { cn } from '@/lib/utils';
import { BADGE_BASE_STYLES } from './Badge';

type MlsStatusBadgeProps = {
  status: string;
  variant?: 'solid' | 'translucent';
  className?: string;
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-600 text-white',
  pending: 'bg-amber-500 text-white',
  sold: 'bg-rose-500 text-white',
  'for sale': 'bg-emerald-600 text-white',
  'coming soon': 'bg-blue-600 text-white',
  conditional: 'bg-indigo-500 text-white',
  default: 'bg-slate-600 text-white',
};

export function MlsStatusBadge({ status, variant = 'solid', className }: MlsStatusBadgeProps) {
  const normalizedStatus = status.trim().toLowerCase();
  const colorClasses =
    variant === 'translucent'
      ? 'bg-white/15 text-white'
      : STATUS_COLORS[normalizedStatus] ?? STATUS_COLORS.default;

  return (
    <span className={cn(BADGE_BASE_STYLES, 'uppercase tracking-wide', colorClasses, className)}>
      {status}
    </span>
  );
}

