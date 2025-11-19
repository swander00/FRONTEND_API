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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
      {properties.map((property, index) => {
        // Prioritize first 5 images (above the fold on most screens)
        // Responsive breakpoints (Tailwind default):
        // - Mobile (< 640px): 1 column
        // - Small (≥ 640px): 2 columns
        // - Medium (≥ 768px): 3 columns
        // - Large (≥ 1024px): 4 columns
        // - 2XL (≥ 1536px): 5 columns (maximum - only on very wide screens)
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

