// components/Property/Details/ui/CollapsibleSection.tsx
"use client";

import { useState, ReactNode } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  icon: LucideIcon;
  defaultExpanded?: boolean;
  colorScheme?: 'blue' | 'purple' | 'green' | 'orange' | 'amber' | 'cyan' | 'indigo' | 'teal' | 'pink';
  children: ReactNode;
}

const COLOR_SCHEMES = {
  blue: { hover: 'hover:bg-blue-50/50', icon: 'text-blue-600', iconBg: 'bg-blue-100', border: 'border-blue-200/60', chevron: 'text-blue-500', title: 'text-blue-900' },
  purple: { hover: 'hover:bg-purple-50/50', icon: 'text-purple-600', iconBg: 'bg-purple-100', border: 'border-purple-200/60', chevron: 'text-purple-500', title: 'text-purple-900' },
  green: { hover: 'hover:bg-green-50/50', icon: 'text-green-600', iconBg: 'bg-green-100', border: 'border-green-200/60', chevron: 'text-green-500', title: 'text-green-900' },
  orange: { hover: 'hover:bg-orange-50/50', icon: 'text-orange-600', iconBg: 'bg-orange-100', border: 'border-orange-200/60', chevron: 'text-orange-500', title: 'text-orange-900' },
  amber: { hover: 'hover:bg-amber-50/50', icon: 'text-amber-600', iconBg: 'bg-amber-100', border: 'border-amber-200/60', chevron: 'text-amber-500', title: 'text-amber-900' },
  cyan: { hover: 'hover:bg-cyan-50/50', icon: 'text-cyan-600', iconBg: 'bg-cyan-100', border: 'border-cyan-200/60', chevron: 'text-cyan-500', title: 'text-cyan-900' },
  indigo: { hover: 'hover:bg-indigo-50/50', icon: 'text-indigo-600', iconBg: 'bg-indigo-100', border: 'border-indigo-200/60', chevron: 'text-indigo-500', title: 'text-indigo-900' },
  teal: { hover: 'hover:bg-teal-50/50', icon: 'text-teal-600', iconBg: 'bg-teal-100', border: 'border-teal-200/60', chevron: 'text-teal-500', title: 'text-teal-900' },
  pink: { hover: 'hover:bg-pink-50/50', icon: 'text-pink-600', iconBg: 'bg-pink-100', border: 'border-pink-200/60', chevron: 'text-pink-500', title: 'text-pink-900' }
} as const;

export default function CollapsibleSection({
  title,
  icon: Icon,
  defaultExpanded = false,
  colorScheme = 'blue',
  children
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const colors = COLOR_SCHEMES[colorScheme];

  return (
    <div className="border border-gray-200/60 rounded-lg overflow-hidden bg-white/80 backdrop-blur-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-4 py-3 flex items-center justify-between text-left transition-all duration-200 ${colors.hover}`}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colors.iconBg} border ${colors.border}`}>
            <Icon className={`h-4 w-4 ${colors.icon}`} />
          </div>
          <span className={`text-sm font-semibold ${colors.title}`}>{title}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 ${colors.chevron} transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isExpanded && (
        <div className="border-t border-gray-200/40">
          <div className="p-4 bg-gray-50/50">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}