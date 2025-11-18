'use client';

import { Zap } from 'lucide-react';
import type { PropertyDetailsData } from '../normalizeProperty';
import CollapsibleSection from '../ui/CollapsibleSection';
import { getUtilitiesFields } from '../shared/sectionFields';

interface UtilitiesSectionProps {
  property: PropertyDetailsData;
}

export default function UtilitiesSection({ property }: UtilitiesSectionProps) {
  const utilities = getUtilitiesFields(property);
  return (
    <CollapsibleSection
      title="Utilities & Services"
      icon={Zap}
      colorScheme="cyan"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {utilities.map((utility, index) => (
          <div key={index} className="flex flex-col gap-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {utility.label}
            </p>
            <p
              className={`text-sm font-semibold truncate ${
                utility.highlight ? 'text-cyan-900' : 'text-gray-900'
              }`}
            >
              {utility.value}
            </p>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}