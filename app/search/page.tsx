'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
import { useResponsivePageSize } from '@/hooks/useResponsivePageSize';
import { useProperties } from '@/hooks/useProperties';
import { useMapProperties, type MapBounds } from '@/hooks/useMapProperties';
import { api, type PropertyDetailsResponse, type PropertyMediaItem } from '@/lib/api';
import type { PropertyRoom } from '@/types/property';
import { DEFAULT_FILTERS_STATE } from '@/components/search/FiltersContainer/FiltersContext';
import { SaveSearchModal } from '@/components/search/SaveSearchModal';
import { useAuth } from '@/hooks/useAuth';

// Default bounds for Toronto area (used when map view is first loaded)
const DEFAULT_MAP_BOUNDS: MapBounds = {
  northEast: { lat: 43.8, lng: -79.2 },
  southWest: { lat: 43.6, lng: -79.5 },
};

// Helper function to convert PropertyDetailsResponse to Property
function convertPropertyDetailsToProperty(response: PropertyDetailsResponse): Property {
  // Extract images from media array
  const images: string[] = response.media
    ? response.media.map((m: PropertyMediaItem) => m.url).filter((url): url is string => Boolean(url && typeof url === 'string' && url.trim() !== ''))
    : [];

  // Normalize features fields
  const normalizeFeatures = (features: string | string[] | undefined): string[] | undefined => {
    if (!features) return undefined;
    if (Array.isArray(features)) return features;
    return features.split(/[,;|]/).map(f => f.trim()).filter(f => f.length > 0);
  };

  // Normalize transactionType
  const normalizeTransactionType = (type: any): 'For Sale' | 'For Lease' | undefined => {
    if (!type) return undefined;
    const normalized = String(type).trim();
    if (normalized === 'For Sale' || normalized === 'For Lease') {
      return normalized as 'For Sale' | 'For Lease';
    }
    if (normalized.toLowerCase().includes('sale') || normalized.toLowerCase().includes('sell')) {
      return 'For Sale';
    }
    if (normalized.toLowerCase().includes('lease') || normalized.toLowerCase().includes('rent')) {
      return 'For Lease';
    }
    return undefined;
  };

  // Normalize rooms
  const normalizeRooms = (rooms: any): PropertyRoom[] | undefined => {
    if (!rooms || !rooms.rooms) return undefined;
    if (!Array.isArray(rooms.rooms)) return undefined;
    return rooms.rooms.map((room: any) => ({
      type: String(room.roomType || room.type || ''),
      level: room.level || undefined,
      dimensions: room.dimensions || undefined,
      measurements: room.measurements || undefined,
      description: room.description || undefined,
      features: Array.isArray(room.features) ? room.features : room.features ? [room.features] : undefined,
    })).filter((room: PropertyRoom) => room.type);
  };

  return {
    id: response.listingKey,
    listingKey: response.listingKey,
    mlsNumber: response.mlsNumber,
    price: response.listPrice,
    originalListPrice: response.originalListPrice,
    closePrice: response.closePrice,
    priceReductionAmount: response.priceReductionAmount,
    priceReductionPercent: response.priceReductionPercent,
    address: {
      street: response.fullAddress,
      streetNumber: response.streetNumber,
      streetName: response.streetName,
      streetSuffix: response.streetSuffix,
      unitNumber: response.unitNumber,
      city: response.city,
      province: response.stateOrProvince,
      postalCode: response.postalCode,
      countyOrParish: response.countyOrParish,
    },
    location: {
      neighborhood: response.community || response.city,
      tagColor: '#2563eb',
      cityRegion: response.community,
    },
    propertyType: response.propertyType,
    propertySubType: response.propertySubType,
    propertyClass: undefined,
    architecturalStyle: response.architecturalStyle,
    description: response.publicRemarks,
    publicRemarks: response.publicRemarks,
    bedrooms: {
      above: response.bedroomsAboveGrade || 0,
      below: response.bedroomsBelowGrade || 0,
      total: (response.bedroomsAboveGrade || 0) + (response.bedroomsBelowGrade || 0),
    },
    bathrooms: response.bathroomsTotalInteger || 0,
    kitchens: {
      aboveGrade: response.kitchensAboveGrade,
      belowGrade: response.kitchensBelowGrade,
      total: (response.kitchensAboveGrade || 0) + (response.kitchensBelowGrade || 0),
    },
    squareFootage: {
      min: response.livingAreaMin || 0,
      max: response.livingAreaMax || 0,
    },
    lotSize: {
      width: response.lotSizeWidth,
      depth: response.lotSizeDepth,
      acres: response.lotSizeAcres,
      units: response.lotSizeUnits,
    },
    parking: {
      garage: response.garageSpaces || 0,
      driveway: (response.parkingTotal || 0) - (response.garageSpaces || 0),
      total: response.parkingTotal,
    },
    basement: response.basementStatus,
    basementDetails: {
      status: response.basementStatus,
      entrance: response.basementEntrance,
      hasKitchen: response.basementKitchen,
      rentalPotential: response.basementRental,
    },
    age: {
      display: response.approximateAge,
    },
    utilities: {
      heatType: response.heatType,
      cooling: response.cooling,
      sewer: response.sewer,
      fireplace: response.fireplaceYN === true || response.fireplaceYN === 'Y',
    },
    association: {
      fee: response.associationFee,
      additionalMonthlyFee: response.additionalMonthlyFee,
      feeIncludes: response.associationFeeIncludes,
      amenities: response.associationAmenities,
    },
    exteriorFeatures: normalizeFeatures(response.exteriorFeatures),
    interiorFeatures: normalizeFeatures(response.interiorFeatures),
    propertyFeatures: response.propertyFeatures,
    coolingFeatures: response.cooling ? [response.cooling] : undefined,
    poolFeatures: response.poolFeatures,
    possession: response.possession,
    waterfront: {
      waterBodyName: response.waterBodyName,
      waterfrontYN: response.waterfrontYN,
      waterView: response.waterView,
      features: response.waterfrontFeatures,
    },
    coordinates: response.latitude && response.longitude ? {
      lat: response.latitude,
      lng: response.longitude,
    } : undefined,
    daysOnMarket: response.daysOnMarket,
    // ⚠️ DEPRECATED: listingAge is no longer used for For Sale, For Lease, Sold, Leased, or Removed statuses.
    // Use originalEntryTimestamp with status prefix instead via getStatusTimestampDisplay()
    listingAge: response.modificationTimestamp, // Kept for backward compatibility only
    originalEntryTimestamp: response.originalEntryTimestamp,
    originalEntryTimestampRaw: response.originalEntryTimestampRaw,
    isNewListing: response.isNewListing,
    isPriceReduced: response.priceReductionAmount ? true : false,
    mediaCount: response.mediaCount,
    primaryImageUrl: response.primaryImageUrl || undefined,
    images,
    media: response.media.map(m => ({
      id: m.id,
      url: m.url,
      alt: m.alt,
      order: m.order,
      caption: m.caption,
      dimensions: m.dimensions,
    })),
    virtualTourUrl: response.virtualTourUrl,
    openHouse: response.openHouseDisplay ? {
      display: response.openHouseDisplay,
      day: '',
      date: '',
      time: '',
    } : undefined,
    openHouseFlags: {
      hasUpcomingOpenHouse: !!response.openHouseDisplay,
      hasOpenHouseToday: false,
      hasOpenHouseTomorrow: false,
      hasNextWeekendOpenHouse: false,
    },
    hasVirtualTour: response.hasVirtualTour,
    listedAt: response.listDate || response.originalEntryTimestamp,
    status: response.mlsStatus,
    mlsStatus: response.mlsStatus,
    transactionType: normalizeTransactionType(response.transactionType),
    statusDates: response.statusDates,
    modificationTimestamp: response.modificationTimestamp,
    tax: response.taxAnnualAmount && response.taxYear ? {
      amount: response.taxAnnualAmount,
      year: response.taxYear,
    } : undefined,
    taxes: response.taxAnnualAmount && response.taxYear ? {
      annualAmount: response.taxAnnualAmount,
      year: response.taxYear,
    } : undefined,
    stats: {
      views: response.viewCount,
      bookmarks: response.saveCount,
      favorites: 0,
    },
    rooms: normalizeRooms(response.rooms),
    balconyType: response.balconyType,
    locker: response.locker,
    furnished: response.furnished,
  };
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filtersSnapshot, setFiltersSnapshot] = useState<FiltersState | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(DEFAULT_MAP_BOUNDS);
  const [isSaveSearchModalOpen, setIsSaveSearchModalOpen] = useState(false);
  const [isSaveSearchModalClosing, setIsSaveSearchModalClosing] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const responsivePageSize = useResponsivePageSize();
  const { isAuthenticated } = useAuth();
  
  // Get initial status from URL
  const urlStatusParam = searchParams.get('status');
  const urlToStatusMap: Record<string, 'For Sale' | 'For Lease' | 'Sold' | 'Leased' | 'Removed'> = {
    'for-sale': 'For Sale',
    'for-lease': 'For Lease',
    'sold': 'Sold',
    'leased': 'Leased',
    'removed': 'Removed',
  };
  const initialStatus = urlStatusParam && urlToStatusMap[urlStatusParam] ? urlToStatusMap[urlStatusParam] : undefined;
  
  // Ensure URL always has status parameter (set to 'for-sale' if missing)
  useEffect(() => {
    const currentStatusParam = searchParams.get('status');
    if (!currentStatusParam) {
      const params = new URLSearchParams(searchParams.toString());
      const mlsParam = searchParams.get('mls');
      params.set('status', 'for-sale');
      if (mlsParam) {
        params.set('mls', mlsParam);
      }
      const newUrl = params.toString() ? `?${params.toString()}` : '';
      router.replace(`/search${newUrl}`, { scroll: false });
    }
  }, [searchParams, router]);
  
  // Handle filters change with URL sync
  const handleFiltersChange = useCallback((filters: FiltersState) => {
    setFiltersSnapshot(filters);
    
    // Update URL when status changes
    const currentUrlStatusParam = searchParams.get('status');
    const statusToUrlMap: Record<string, string> = {
      'For Sale': 'for-sale',
      'For Lease': 'for-lease',
      'Sold': 'sold',
      'Leased': 'leased',
      'Removed': 'removed',
    };
    const urlStatus = statusToUrlMap[filters.status];
    
    if (currentUrlStatusParam !== urlStatus) {
      const params = new URLSearchParams(searchParams.toString());
      const mlsParam = searchParams.get('mls');
      
      // Always set status in URL, including "For Sale"
      params.set('status', urlStatus);
      
      if (mlsParam) {
        params.set('mls', mlsParam);
      }
      
      const newUrl = params.toString() ? `?${params.toString()}` : '';
      router.replace(`/search${newUrl}`, { scroll: false });
    }
  }, [searchParams, router]);
  
  // Track if we're setting property programmatically (not from URL)
  const settingPropertyRef = React.useRef(false);
  
  // Sync URL when property modal opens/closes
  useEffect(() => {
    const currentMlsParam = searchParams.get('mls');
    const statusParam = searchParams.get('status');
    const mlsNumber = selectedProperty?.mlsNumber;
    
    // Only sync if MLS number actually changed
    if (currentMlsParam !== mlsNumber) {
      // Mark that we're setting property programmatically
      if (mlsNumber) {
        settingPropertyRef.current = true;
      }
      
      const params = new URLSearchParams(searchParams.toString());
      
      if (mlsNumber) {
        params.set('mls', mlsNumber);
      } else {
        params.delete('mls');
      }
      
      if (statusParam) {
        params.set('status', statusParam);
      }
      
      const newUrl = params.toString() ? `?${params.toString()}` : '';
      router.replace(`/search${newUrl}`, { scroll: false });
      
      // Reset flag after URL update (increased timeout to allow router.replace to complete)
      // Only reset if we're not in the middle of a programmatic set
      if (mlsNumber) {
        setTimeout(() => {
          settingPropertyRef.current = false;
        }, 500);
      }
    }
  }, [selectedProperty?.mlsNumber, searchParams, router]);
  
  // Fetch property from URL if MLS param exists
  useEffect(() => {
    const mlsParam = searchParams.get('mls');
    
    if (mlsParam) {
      // Only fetch if we don't have a property selected or if the MLS number is different
      // Also check if we're currently setting it programmatically to avoid race conditions
      if (!selectedProperty || (selectedProperty.mlsNumber !== mlsParam && !settingPropertyRef.current)) {
        // Fetch property details by MLS number
        api.properties.getDetails(mlsParam)
          .then((response) => {
            const property = convertPropertyDetailsToProperty(response);
            setSelectedProperty(property);
          })
          .catch((error) => {
            console.error('Failed to fetch property from URL:', error);
            // Clear property if fetch fails
            setSelectedProperty(null);
          });
      }
    } else {
      // Only clear if we're NOT programmatically setting it AND we have a selected property
      // If selectedProperty has an mlsNumber but URL doesn't have it, we're syncing - don't clear
      const hasMlsNumber = selectedProperty?.mlsNumber;
      const shouldClear = selectedProperty && 
                         !settingPropertyRef.current && 
                         !hasMlsNumber; // Only clear if property doesn't have MLS number (not syncing)
      
      if (shouldClear) {
        // This handles the case when user navigates back/forward or manually changes URL
        // Use a delay to ensure settingPropertyRef is checked after URL sync completes
        const timeoutId = setTimeout(() => {
          // Double-check that we're still not setting property programmatically
          // and that URL still doesn't have mls param
          const currentMlsParam = searchParams.get('mls');
          if (!currentMlsParam && !settingPropertyRef.current) {
            setSelectedProperty(null);
          }
        }, 400);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [searchParams]); // Removed selectedProperty from deps to prevent flickering - only react to URL changes

  // Fetch properties from Railway API with filters, sort, and search (for grid view)
  // Use responsive pageSize that matches the grid column layout
  const { properties: gridProperties, loading: gridLoading, error: gridError, total: gridTotal, totalPages: gridTotalPages } = useProperties({
    page: currentPage,
    pageSize: responsivePageSize,
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
    if (!isAuthenticated) {
      // Could show auth modal here if needed
      return;
    }
    setIsSaveSearchModalClosing(false);
    setIsSaveSearchModalOpen(true);
  };

  const closeSaveSearchModal = useCallback(() => {
    setIsSaveSearchModalClosing(true);
    window.setTimeout(() => {
      setIsSaveSearchModalOpen(false);
      setIsSaveSearchModalClosing(false);
    }, 220);
  }, []);

  // Restore filters from saved search if present in sessionStorage
  useEffect(() => {
    const savedFilters = sessionStorage.getItem('savedSearchFilters');
    if (savedFilters) {
      try {
        const partialFilters = JSON.parse(savedFilters) as Partial<FiltersState>;
        // Merge with defaults to ensure complete FiltersState
        const filters: FiltersState = {
          ...DEFAULT_FILTERS_STATE,
          ...partialFilters,
          // Deep merge advanced filters
          advanced: {
            ...DEFAULT_FILTERS_STATE.advanced,
            ...(partialFilters.advanced || {}),
          },
        };
        setFiltersSnapshot(filters);
        sessionStorage.removeItem('savedSearchFilters');
        // Update URL status if needed
        if (filters.status) {
          const statusToUrlMap: Record<string, string> = {
            'For Sale': 'for-sale',
            'For Lease': 'for-lease',
            'Sold': 'sold',
            'Leased': 'leased',
            'Removed': 'removed',
          };
          const urlStatus = statusToUrlMap[filters.status];
          if (urlStatus) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('status', urlStatus);
            router.replace(`/search?${params.toString()}`, { scroll: false });
          }
        }
      } catch (err) {
        console.error('Failed to parse saved search filters:', err);
      }
    }
  }, [searchParams, router]);

  const handleSearchSubmit = useCallback((value: string) => {
    setAppliedSearchTerm(value);
    setCurrentPage(1); // Reset to page 1 when search is applied
  }, []);

  const handlePropertyClick = useCallback((property: Property) => {
    // Mark that we're setting property programmatically
    settingPropertyRef.current = true;
    setSelectedProperty(property);
    
    // Reset flag after a delay to allow URL sync to complete
    setTimeout(() => {
      settingPropertyRef.current = false;
    }, 500);
  }, []);

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
            onFiltersChange={handleFiltersChange}
            onSaveSearch={handleSaveSearch}
            className="pt-1"
            initialStatus={initialStatus}
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

        {selectedProperty && (
          isMobile ? (
            <PropertyDetailsModalMobile
              key={selectedProperty.id || selectedProperty.listingKey || selectedProperty.mlsNumber}
              isOpen={!!selectedProperty}
              property={selectedProperty}
              onClose={handleClosePropertyModal}
            />
          ) : (
            <PropertyDetailsModal
              key={selectedProperty.id || selectedProperty.listingKey || selectedProperty.mlsNumber}
              isOpen={!!selectedProperty}
              property={selectedProperty}
              onClose={handleClosePropertyModal}
            />
          )
        )}

        {isAuthenticated && (
          <SaveSearchModal
            isOpen={isSaveSearchModalOpen}
            onClose={closeSaveSearchModal}
            isClosing={isSaveSearchModalClosing}
            filters={filtersSnapshot || DEFAULT_FILTERS_STATE}
            searchTerm={appliedSearchTerm}
          />
        )}
      </PageContainer>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}

