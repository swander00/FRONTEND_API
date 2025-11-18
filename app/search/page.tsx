'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { ResultsSummary } from '@/components/results/ResultsSummary';
import { ViewOptions } from '@/components/results/ViewOptions';
import { Pagination } from '@/components/results/Pagination';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { MapView } from '@/components/property/MapView';
import { PropertyDetailsModal, PropertyDetailsModalMobile } from '@/components/property/PropertyDetails';
import { Property } from '@/types/property';
import { PageContainer, SectionCard } from '@/components/layout';
import { FiltersContainer, type FiltersState } from '@/components/search/FiltersContainer';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useProperties } from '@/hooks/useProperties';
import { useMapProperties, type MapBounds } from '@/hooks/useMapProperties';

// Default bounds for Toronto area (used when map view is first loaded)
const DEFAULT_MAP_BOUNDS: MapBounds = {
  northEast: { lat: 43.8, lng: -79.2 },
  southWest: { lat: 43.6, lng: -79.5 },
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filtersSnapshot, setFiltersSnapshot] = useState<FiltersState | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(DEFAULT_MAP_BOUNDS);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Fetch properties from Railway API with filters, sort, and search (for grid view)
  const { properties: gridProperties, loading: gridLoading, error: gridError, total: gridTotal, totalPages: gridTotalPages } = useProperties({
    page: currentPage,
    pageSize: 24,
    enabled: view === 'grid',
    filters: filtersSnapshot,
    sortBy,
    searchTerm: appliedSearchTerm,
  });

  // Fetch properties from map endpoint (for map view)
  const { properties: mapProperties, loading: mapLoading, error: mapError, total: mapTotal } = useMapProperties({
    bounds: mapBounds,
    filters: filtersSnapshot,
    enabled: view === 'map',
  });

  // Use appropriate properties based on view
  const filteredProperties = view === 'map' ? mapProperties : gridProperties;
  const loading = view === 'map' ? mapLoading : gridLoading;
  const error = view === 'map' ? mapError : gridError;
  const total = view === 'map' ? mapTotal : gridTotal;
  const totalPages = view === 'grid' ? gridTotalPages : 0;

  // Reset to page 1 when filters, sort, or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filtersSnapshot, sortBy, appliedSearchTerm]);

  // Scroll to top when page changes (for better UX)
  useEffect(() => {
    if (currentPage > 1 && view === 'grid') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, view]);

  const handleSaveSearch = () => {
    // TODO: Implement save search functionality
    console.log('Save search');
  };

  const handleSearchSubmit = useCallback((value: string) => {
    setAppliedSearchTerm(value);
    setCurrentPage(1); // Reset to page 1 when search is applied
  }, []);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleClosePropertyModal = () => {
    setSelectedProperty(null);
  };

  // Handle map bounds changes with threshold to prevent excessive refetches
  const handleMapBoundsChange = useCallback((newBounds: MapBounds) => {
    // Only update if bounds changed significantly (prevent unnecessary refetches)
    if (!mapBounds) {
      setMapBounds(newBounds);
      return;
    }
    
    const latDiff = Math.abs(mapBounds.northEast.lat - newBounds.northEast.lat) + 
                   Math.abs(mapBounds.southWest.lat - newBounds.southWest.lat);
    const lngDiff = Math.abs(mapBounds.northEast.lng - newBounds.northEast.lng) + 
                   Math.abs(mapBounds.southWest.lng - newBounds.southWest.lng);
    
    // Only update if bounds changed by more than 0.01 degrees (roughly 1km)
    if (latDiff > 0.01 || lngDiff > 0.01) {
      setMapBounds(newBounds);
    }
  }, [mapBounds]);

  // Calculate results summary
  const totalProperties = total || filteredProperties.length;
  const averagePrice = filteredProperties.length > 0
    ? Math.round(
        filteredProperties.reduce((sum, p) => sum + p.price, 0) / filteredProperties.length
      )
    : 0;
  const marketTrend = { value: 2.3, isPositive: false };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageContainer>
        {/* Search Section */}
        <SectionCard className="mb-6">
          <FiltersContainer
            onFiltersChange={setFiltersSnapshot}
            onSaveSearch={handleSaveSearch}
            className="pt-1"
            primaryHeaderSlot={
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearchSubmit}
                onListingSelect={handlePropertyClick}
                className="w-full md:w-[400px]"
                inputClassName="shadow-sm"
              />
            }
          />
        </SectionCard>

        {/* Results Summary and View Options */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <ResultsSummary
            total={totalProperties}
            averagePrice={averagePrice}
            marketTrend={marketTrend}
          />
          <ViewOptions
            view={view}
            onViewChange={setView}
            sortBy={sortBy}
            onSortChange={(newSortBy) => {
              setSortBy(newSortBy);
              setCurrentPage(1); // Reset to page 1 when sort changes
            }}
          />
        </div>

        {/* Property Grid */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-600">Loading properties...</div>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-red-600">Error loading properties: {error.message}</div>
          </div>
        )}
        {!loading && !error && (
          <>
            {view === 'grid' ? (
              <>
                <PropertyGrid
                  properties={filteredProperties}
                  onPropertyClick={handlePropertyClick}
                />
                {totalPages > 1 && (
                  <div className="mt-8 mb-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <MapView
                properties={filteredProperties}
                onPropertySelect={handlePropertyClick}
                showPropertyCards={false}
                layout="full"
                onBoundsChange={handleMapBoundsChange}
              />
            )}
          </>
        )}

        {isMobile ? (
          <PropertyDetailsModalMobile
            isOpen={!!selectedProperty}
            property={selectedProperty ?? undefined}
            onClose={handleClosePropertyModal}
          />
        ) : (
          <PropertyDetailsModal
            isOpen={!!selectedProperty}
            property={selectedProperty ?? undefined}
            onClose={handleClosePropertyModal}
          />
        )}
      </PageContainer>
    </div>
  );
}

