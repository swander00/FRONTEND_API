'use client';

import { SquareStack } from 'lucide-react';
import type { PropertyDetailsData } from '../normalizeProperty';
import CollapsibleSection from '../ui/CollapsibleSection';
import { getBasementFields } from '../shared/sectionFields';

interface BasementSectionProps {
  property: PropertyDetailsData;
}

export default function BasementSection({ property }: BasementSectionProps) {
  const basementFeatures = getBasementFields(property);
  return (
    <CollapsibleSection
      title="Basement Features"
      icon={SquareStack}
      colorScheme="amber"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {basementFeatures.map((feature, index) => (
          <div key={index} className="flex flex-col gap-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {feature.label}
            </p>
            <p
              className={`text-sm font-semibold truncate ${
                feature.highlight ? 'text-amber-900' : 'text-gray-900'
              }`}
            >
              {feature.value}
            </p>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}