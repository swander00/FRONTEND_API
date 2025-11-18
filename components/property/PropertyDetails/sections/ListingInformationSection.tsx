'use client';

import { Info } from 'lucide-react';
import type { PropertyDetailsData } from '../normalizeProperty';
import CollapsibleSection from '../ui/CollapsibleSection';
import { getListingInformationFields } from '../shared/sectionFields';

interface ListingInformationSectionProps {
  property: PropertyDetailsData;
}

export default function ListingInformationSection({ property }: ListingInformationSectionProps) {
  const listingInfo = getListingInformationFields(property);

  return (
    <CollapsibleSection
      title="Listing Information"
      icon={Info}
      colorScheme="blue"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {listingInfo.map((item, index) => (
          <div key={index} className="flex flex-col gap-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {item.label}
            </p>
            <p
              className={`text-sm font-semibold truncate ${
                item.highlight ? 'text-blue-900' : 'text-gray-900'
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}