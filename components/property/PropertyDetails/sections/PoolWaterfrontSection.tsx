'use client';

import { Waves } from 'lucide-react';
import type { PropertyDetailsData } from '../normalizeProperty';
import { CollapsibleSection } from '../ui';
import { getPoolWaterfrontFields } from '../shared/sectionFields';

interface PoolWaterfrontSectionProps {
  property: PropertyDetailsData;
}

export default function PoolWaterfrontSection({ property }: PoolWaterfrontSectionProps) {
  const waterFeatures = getPoolWaterfrontFields(property);

  return (
    <CollapsibleSection
      title="Pool & Waterfront"
      icon={Waves}
      colorScheme="blue"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {waterFeatures.map((feature, index) => (
          <div key={index} className="flex flex-col gap-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {feature.label}
            </p>
            <p
              className={`text-sm font-semibold truncate ${
                feature.highlight ? 'text-blue-900' : 'text-gray-900'
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