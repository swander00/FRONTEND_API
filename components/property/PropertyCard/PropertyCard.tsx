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
    // Check if click came from a button or interactive element
    const target = e.target as HTMLElement;
    
    // Check if target is a button or link element
    if (target.tagName === 'BUTTON' || target.tagName === 'A') {
      return;
    }
    
    // Check if target is inside a button or link (but allow clicks on the card itself)
    const closestButton = target.closest('button');
    const closestLink = target.closest('a');
    
    // Only ignore if we found a button/link that's not the card itself
    if (closestButton || closestLink) {
      return;
    }
    
    // Trigger onClick handler
    onClick?.();
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative"
      onClick={handleCardClick}
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

