// components/Property/Details/ui/SpecField.tsx
"use client";

import { LucideIcon } from 'lucide-react';

interface SpecFieldProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  layout?: 'horizontal' | 'grid';
}

export default function SpecField({ 
  label, 
  value, 
  icon: Icon,
  layout = 'horizontal' 
}: SpecFieldProps) {
  if (layout === 'grid') {
    return (
      <div className="flex items-center justify-center py-3 px-3 bg-white rounded-lg border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
        <span className="text-sm font-semibold text-gray-900">{value}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="p-1.5 rounded-md bg-gray-100 border border-gray-200/60">
            <Icon className="h-3.5 w-3.5 text-gray-600" />
          </div>
        )}
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <span className="text-xs font-semibold text-gray-900">{value}</span>
    </div>
  );
}