'use client';

import { Receipt } from 'lucide-react';
import type { PropertyDetailsData } from '../normalizeProperty';
import CollapsibleSection from '../ui/CollapsibleSection';
import { getPotlFields } from '../shared/sectionFields';

interface PotlSectionProps {
  property: PropertyDetailsData;
  hideValueIcons?: boolean;
}

export default function PotlSection({ property, hideValueIcons = false }: PotlSectionProps) {
  const potlInfo = getPotlFields(property);

  return (
    <CollapsibleSection
      title="POTL Information"
      icon={Receipt}
      colorScheme="teal"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {potlInfo.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              {!hideValueIcons && IconComponent && (
                <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                  item.highlight ? 'text-teal-600' : 'text-gray-500'
                }`} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {item.label}
                </p>
                <p className={`text-sm font-semibold truncate ${
                  item.highlight ? 'text-teal-900' : 'text-gray-900'
                }`}>
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </CollapsibleSection>
  );
}