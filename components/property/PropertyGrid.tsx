import { Property } from '@/types/property';
import { PropertyCard } from './PropertyCard/PropertyCard';

type PropertyGridProps = {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  onFavorite?: (property: Property) => void;
  onTour?: (property: Property) => void;
};

export function PropertyGrid({
  properties,
  onPropertyClick,
  onFavorite,
  onTour,
}: PropertyGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {properties.map((property, index) => {
        // Prioritize first 4 images (above the fold on most screens)
        // For mobile (1 col): first 2-3 images
        // For tablet (2 cols): first 4 images  
        // For desktop (4 cols): first 4 images
        const isAboveFold = index < 4;
        
        return (
          <PropertyCard
            key={property.id || property.listingKey || property.mlsNumber || `property-${index}`}
            property={property}
            onClick={() => onPropertyClick?.(property)}
            onFavorite={() => onFavorite?.(property)}
            onTour={() => onTour?.(property)}
            priority={isAboveFold}
          />
        );
      })}
    </div>
  );
}

