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
    console.log('[PropertyCard] Card clicked - target:', e.target);
    console.log('[PropertyCard] Card clicked - currentTarget:', e.currentTarget);
    console.log('[PropertyCard] onClick prop exists:', !!onClick);
    
    // Check if click came from a button or interactive element (excluding the card itself)
    const target = e.target as HTMLElement;
    const cardElement = e.currentTarget;
    
    // Check if the target itself is a button or link
    const targetIsButton = target.tagName === 'BUTTON' || target.tagName === 'A';
    const targetIsRoleButton = target.getAttribute('role') === 'button' && target !== cardElement;
    
    // Check if target is inside a button/link (but not the card itself)
    let closestButton = target.closest('button');
    let closestLink = target.closest('a');
    
    // Remove card element from consideration (check if closest element is the card itself)
    if (closestButton && closestButton === (cardElement as any)) closestButton = null;
    if (closestLink && closestLink === (cardElement as any)) closestLink = null;
    
    const isButton = targetIsButton || targetIsRoleButton || !!closestButton || !!closestLink;
    
    console.log('[PropertyCard] Button detection:', {
      targetTag: target.tagName,
      targetIsButton,
      targetIsRoleButton,
      closestButton: !!closestButton,
      closestLink: !!closestLink,
      isButton,
    });
    
    if (isButton) {
      console.log('[PropertyCard] Click came from button, ignoring');
      return;
    }
    
    console.log('[PropertyCard] Card clicked - triggering onClick');
    if (onClick) {
      onClick();
      console.log('[PropertyCard] onClick called successfully');
    } else {
      console.warn('[PropertyCard] onClick prop is undefined!');
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={(e) => {
        console.log('[PropertyCard] Direct onClick fired on div');
        handleCardClick(e);
      }}
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

