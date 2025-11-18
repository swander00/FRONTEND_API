'use client';

import { FileText } from 'lucide-react';
import type { PropertyDetailsData } from '../normalizeProperty';
import CollapsibleSection from '../ui/CollapsibleSection';
import { getLeaseTermsFields } from '../shared/sectionFields';

interface LeaseTermsSectionProps {
  property: PropertyDetailsData;
}

export default function LeaseTermsSection({ property }: LeaseTermsSectionProps) {
  const leaseTerms = getLeaseTermsFields(property);

  return (
    <CollapsibleSection
      title="Lease Terms"
      icon={FileText}
      colorScheme="purple"
      defaultExpanded={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaseTerms.map((term, index) => (
          <div key={index} className="flex flex-col gap-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {term.label}
            </p>
            <p
              className={`text-sm font-semibold truncate ${
                term.highlight ? 'text-purple-900' : 'text-gray-900'
              }`}
            >
              {term.value}
            </p>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}