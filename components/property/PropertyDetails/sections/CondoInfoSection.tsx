'use client';

import { Building } from 'lucide-react';
import type { PropertyDetailsData } from '../normalizeProperty';
import CollapsibleSection from '../ui/CollapsibleSection';
import { getCondoInfoFields } from './condoInfoFields';

interface CondoInfoSectionProps {
  property: PropertyDetailsData;
  hideValueIcons?: boolean;
}

export default function CondoInfoSection({ property, hideValueIcons = false }: CondoInfoSectionProps) {
  const condoInfo = getCondoInfoFields(property);

  return (
    <CollapsibleSection
      title="Condo Information"
      icon={Building}
      colorScheme="indigo"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {condoInfo.map((field, index) => {
          const IconComponent = field.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              {!hideValueIcons && (
                <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                  field.highlight ? 'text-indigo-600' : 'text-gray-500'
                }`} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {field.label}
                </p>
                <p className={`text-sm font-semibold truncate ${
                  field.highlight ? 'text-indigo-900' : 'text-gray-900'
                }`}>
                  {field.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </CollapsibleSection>
  );
}