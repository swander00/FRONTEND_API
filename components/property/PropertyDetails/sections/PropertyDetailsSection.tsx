'use client';

import { Home, Building, Bed, Bath, ChefHat, Square, TreePine, Calendar, Flame, DollarSign } from 'lucide-react';
import type { PropertyDetailsData } from '../normalizeProperty';
import CollapsibleSection from '../ui/CollapsibleSection';
import { getPropertyDetailFields } from '../shared/sectionFields';

interface PropertyDetailsSectionProps {
  property: PropertyDetailsData;
  hideValueIcons?: boolean;
}

export default function PropertyDetailsSection({ property, hideValueIcons = false }: PropertyDetailsSectionProps) {
  type IconComponent = typeof Home;
  const iconMap: Record<string, IconComponent> = {
    'Property Class': Building,
    'Property Type': Home,
    'Bedrooms': Bed,
    'Bathrooms': Bath,
    'Kitchens': ChefHat,
    'Square Footage': Square,
    'Lot Size': TreePine,
    'Property Age': Calendar,
    'Fireplace': Flame,
    'POTL (Potl Fee)': DollarSign,
  };

  const propertyDetails = getPropertyDetailFields(property).map((field) => ({
    ...field,
    icon: iconMap[field.label] ?? Home
  }));

  return (
    <CollapsibleSection
      title="Property Details"
      icon={Home}
      colorScheme="green"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {propertyDetails.map((detail, index) => {
          const IconComponent = detail.icon;
          return (
            <div key={index} className="flex items-center gap-2 sm:gap-3">
              {!hideValueIcons && (
                <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
                  detail.highlight ? 'text-green-600' : 'text-gray-500'
                }`} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5 sm:mb-1">
                  {detail.label}
                </p>
                <p className={`text-xs sm:text-sm font-semibold truncate ${
                  detail.highlight ? 'text-green-900' : 'text-gray-900'
                }`}>
                  {detail.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </CollapsibleSection>
  );
}