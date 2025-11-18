'use client';

import { Car } from 'lucide-react';
import type { PropertyDetailsData } from '../normalizeProperty';
import { CollapsibleSection } from '../ui';
import { getParkingFields } from '../shared/sectionFields';

interface ParkingSectionProps {
  property: PropertyDetailsData;
}

export default function ParkingSection({ property }: ParkingSectionProps) {
  const parkingInfo = getParkingFields(property);
  return (
    <CollapsibleSection
      title="Parking & Garage"
      icon={Car}
      colorScheme="orange"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {parkingInfo.map((parking, index) => (
          <div key={index} className="flex flex-col gap-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {parking.label}
            </p>
            <p
              className={`text-sm font-semibold truncate ${
                parking.highlight ? 'text-orange-900' : 'text-gray-900'
              }`}
            >
              {parking.value}
            </p>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}