'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/property/PropertyCard';
import { ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/buttons/Button';
import { cn } from '@/lib/utils';
import type { FiltersState } from '@/components/search/FiltersContainer/FiltersContext';
import { DEFAULT_FILTERS_STATE } from '@/components/search/FiltersContainer/FiltersContext';
import { PROPERTY_TYPE_GROUPS } from '@/lib/filters/options';

// Extract the most common property types from PROPERTY_TYPE_GROUPS
// These match the values used in the search filters
const PROPERTY_TYPE_TABS = [
  { label: 'All', value: null },
  { label: 'Detached', value: 'Detached' },
  { label: 'Semi-Detached', value: 'Semi-Detached' },
  { label: 'Townhouse', value: 'Townhouse (Row)' }, // From PROPERTY_TYPE_GROUPS
  { label: 'Condo', value: 'Condo Apartment' }, // From PROPERTY_TYPE_GROUPS
  { label: 'Condo Townhouse', value: 'Condo Townhouse' }, // From PROPERTY_TYPE_GROUPS
] as const;

export function FeaturedProperties() {
  const router = useRouter();
  const [selectedPropertyType, setSelectedPropertyType] = useState<string | null>(null);

  // Build filters based on selected property type - memoized to prevent unnecessary re-renders
  const filters: FiltersState = useMemo(() => ({
    ...DEFAULT_FILTERS_STATE,
    propertyTypes: selectedPropertyType ? [selectedPropertyType] : [],
  }), [selectedPropertyType]);

  const { properties, loading } = useProperties({
    page: 1,
    pageSize: 6,
    filters,
  });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
            <Home className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Featured Listings</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Your Next Home
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore handpicked properties that match your lifestyle and budget
          </p>
        </div>

        {/* Property Type Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {PROPERTY_TYPE_TABS.map((tab) => {
            const isSelected = selectedPropertyType === tab.value;
            return (
              <button
                key={tab.value || 'all'}
                onClick={() => setSelectedPropertyType(tab.value)}
                className={cn(
                  'px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
                  'hover:scale-105 active:scale-95',
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
              >
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties && properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {properties.slice(0, 6).map((property) => (
                <div
                  key={property.mlsNumber}
                  className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Button
                size="lg"
                variant="primary"
                onClick={() => router.push('/search')}
                className="group px-8 py-4 text-lg font-semibold"
              >
                View All Properties
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No properties available at the moment</p>
          </div>
        )}
      </div>
    </section>
  );
}

