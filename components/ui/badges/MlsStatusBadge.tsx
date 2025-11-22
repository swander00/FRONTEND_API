import { cn } from '@/lib/utils';
import { getStatusBadgeColor, getStatusColorConfig } from '@/lib/constants/statusColors';
import { BADGE_BASE_STYLES } from './Badge';

type MlsStatusBadgeProps = {
  status: string;
  variant?: 'solid' | 'translucent';
  className?: string;
};

export function MlsStatusBadge({ status, variant = 'solid', className }: MlsStatusBadgeProps) {
  const colorClasses =
    variant === 'translucent'
      ? 'bg-white/15 text-white'
      : getStatusBadgeColor(status);

  // Get the hex color for inline style fallback (especially for removed statuses)
  const colorConfig = getStatusColorConfig(status);
  const inlineStyle = variant === 'solid' ? { backgroundColor: colorConfig.hex, color: '#ffffff' } : undefined;

  return (
    <span 
      className={cn(BADGE_BASE_STYLES, 'uppercase tracking-wide', colorClasses, className)}
      style={inlineStyle}
    >
      {status}
    </span>
  );
}

