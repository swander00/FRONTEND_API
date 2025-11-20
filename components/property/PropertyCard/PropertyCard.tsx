import { Property } from '@/types/property';
import { PropertyCardImage } from './PropertyCardImage';
import { PropertyCardDetails } from './PropertyCardDetails';
import { PropertyCardActions } from './PropertyCardActions';

type PropertyCardProps = {
  property: Property;
  onFavorite?: () => void;
  onTour?: () => void;
  onClick?: () => void;
  priority?: boolean;
};

export function PropertyCard({
  property,
  onFavorite,
  onTour,
  onClick,
  priority = false,
}: PropertyCardProps) {
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only trigger if click didn't come from a button or interactive element
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('[role="button"]')) {
      return;
    }
    console.log('[PropertyCard] Card clicked:', property);
    onClick?.();
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <PropertyCardImage
        property={property}
        onFavorite={onFavorite}
        onTour={onTour}
        priority={priority}
      />
      <PropertyCardDetails property={property} />
      <PropertyCardActions />
    </div>
  );
}

