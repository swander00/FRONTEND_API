import { cn } from '@/lib/utils';
import { BADGE_BASE_STYLES } from './Badge';

type LocationTagProps = {
  neighborhood: string;
  color?: string;
};

const colorMap: Record<string, string> = {
  yellow: 'bg-yellow-200 text-yellow-800',
  blue: 'bg-blue-200 text-blue-800',
  green: 'bg-green-200 text-green-800',
  purple: 'bg-purple-200 text-purple-800',
  orange: 'bg-orange-200 text-orange-800',
  pink: 'bg-pink-200 text-pink-800',
  red: 'bg-red-200 text-red-800',
  teal: 'bg-teal-200 text-teal-800',
};

export function LocationTag({ neighborhood, color = 'yellow' }: LocationTagProps) {
  const resolvedColor = colorMap[color] ?? colorMap.yellow;
  return <span className={cn(BADGE_BASE_STYLES, resolvedColor)}>{neighborhood}</span>;
}

