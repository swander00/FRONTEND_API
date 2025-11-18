'use client';

import { Star } from 'lucide-react';
import type { PropertyDetailsData } from '../normalizeProperty';
import CollapsibleSection from '../ui/CollapsibleSection';
import { getFeatureLists } from '../shared/sectionFields';

interface FeaturesSectionProps {
  property: PropertyDetailsData;
}

export default function FeaturesSection({ property }: FeaturesSectionProps) {
  const { interior: interiorList, exterior: exteriorList, other: otherList } = getFeatureLists(property);

  return (
    <CollapsibleSection
      title="Property Features"
      icon={Star}
      colorScheme="pink"
      defaultExpanded={true}
    >
      <div className="space-y-6">
        {/* Interior Features */}
        {interiorList.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Interior Features</h3>
            <div className="flex flex-wrap gap-2">
              {interiorList.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Exterior Features */}
        {exteriorList.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Exterior Features</h3>
            <div className="flex flex-wrap gap-2">
              {exteriorList.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Other Features */}
        {otherList.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Other Features</h3>
            <div className="flex flex-wrap gap-2">
              {otherList.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}