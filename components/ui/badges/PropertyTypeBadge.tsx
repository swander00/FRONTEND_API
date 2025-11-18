import { cn } from '@/lib/utils';
import { BADGE_BASE_STYLES } from './Badge';

type PropertyTypeBadgeProps = {
  type: string;
};

export function PropertyTypeBadge({ type }: PropertyTypeBadgeProps) {
  return (
    <span className={cn(BADGE_BASE_STYLES, 'bg-blue-600 text-white')}>
      {type}
    </span>
  );
}

