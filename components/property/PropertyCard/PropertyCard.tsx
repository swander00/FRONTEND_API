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
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
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

