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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 lg:gap-6">
      {properties.map((property, index) => {
        // Prioritize first 5 images (above the fold on most screens)
        // Responsive breakpoints (adjusted for better content fit):
        // - Mobile (< 640px): 1 column, gap-4
        // - Small (≥ 640px): 2 columns, gap-4
        // - Medium (≥ 768px): 3 columns, gap-5
        // - Large (≥ 1024px): 4 columns, gap-6
        // - XL (≥ 1280px): 5 columns, gap-6 (reduced from 1536px to prevent jumbling)
        const isAboveFold = index < 5;
        
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

