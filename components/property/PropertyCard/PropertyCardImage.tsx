import { useState } from 'react';
import Image from 'next/image';
import { PropertyTypeBadge } from '@/components/ui/badges/PropertyTypeBadge';
import { MlsStatusBadge } from '@/components/ui/badges/MlsStatusBadge';
import { OpenHouseBanner } from '@/components/ui/banners/OpenHouseBanner';
import { VirtualTourButton } from '@/components/ui/buttons/VirtualTourButton';
import { Icon } from '@/components/ui/icons/Icon';
import { Property } from '@/types/property';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/buttons/IconButton';

type PropertyCardImageProps = {
  property: Property;
  onFavorite?: () => void;
  onTour?: () => void;
  priority?: boolean;
};

export function PropertyCardImage({
  property,
  onFavorite,
  onTour,
  priority = false,
}: PropertyCardImageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking favorite button
    setIsFavorited(!isFavorited);
    onFavorite?.();
  };

  // Safe address access with fallback
  const addressText = property.address?.street || 
                      property.address?.unparsedAddress || 
                      `${property.address?.city || ''} property`.trim() || 
                      'Property';

  // Safe image URL with fallback
  const imageUrl = property.images?.[currentImageIndex] || 
                   property.images?.[0] || 
                   property.primaryImageUrl;

  // Don't render Image if no valid URL
  const hasValidImage = imageUrl && imageUrl.trim() && 
                       property.images && property.images.length > 0;

  return (
    <div className="relative w-full h-64 bg-gray-200 rounded-t-lg overflow-hidden group">
      {hasValidImage ? (
        <Image
          src={imageUrl}
          alt={`${addressText} property`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
          <Icon name="home" className="h-16 w-16 text-gray-500" />
        </div>
      )}

      {/* Top Left - Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        <MlsStatusBadge status={property.status ?? 'Active'} />
        <PropertyTypeBadge type={property.propertyType ?? 'Property'} />
      </div>

      {/* Top Right - Favorite */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <IconButton
          icon={
            <Icon
              name="heart"
              className={cn('h-5 w-5', isFavorited && 'text-red-500')}
            />
          }
          ariaLabel="Favorite property"
          onClick={handleFavorite}
          className="bg-white/90 hover:bg-white"
        />
      </div>

      {/* Open House Banner */}
      {property.openHouse && (
        <OpenHouseBanner
          day={property.openHouse.day}
          date={property.openHouse.date}
          time={property.openHouse.time}
        />
      )}

      {/* Bottom Center - Image Carousel Dots */}
      {property.images && property.images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 flex gap-1">
          {property.images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click when clicking carousel dots
                setCurrentImageIndex(index);
              }}
              className={cn(
                'h-1.5 w-1.5 rounded-full transition-colors',
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Bottom Right - Virtual Tour Button */}
      {property.hasVirtualTour && (
        <div onClick={(e) => e.stopPropagation()}>
          <VirtualTourButton
            imageCount={property.images.length}
            onClick={onTour}
          />
        </div>
      )}
    </div>
  );
}

