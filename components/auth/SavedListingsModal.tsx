'use client';

import { useEffect, useState } from 'react';
import { BaseModal } from '@/components/search/FiltersContainer/Shared/Modals/BaseModal';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyDetailsModal, PropertyDetailsModalMobile } from '@/components/property/PropertyDetails';
import { Pagination } from '@/components/results/Pagination';
import { cn } from '@/lib/utils';
import { getSavedListings, deleteSavedListing, type SavedListing } from '@/lib/api/saved-listings';
import { api, type PropertyDetailsResponse } from '@/lib/api';
import { Property } from '@/types/property';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { PropertyMediaItem } from '@/lib/api';
import type { PropertyRoom } from '@/types/property';

type SavedListingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isClosing?: boolean;
};

const TRANSITION_DURATION = 220;
const ITEMS_PER_PAGE = 20;

// Helper function to convert PropertyDetailsResponse to Property
function convertPropertyDetailsToProperty(response: PropertyDetailsResponse): Property {
  const images: string[] = response.media
    ? response.media.map((m: PropertyMediaItem) => m.url).filter((url): url is string => Boolean(url && typeof url === 'string' && url.trim() !== ''))
    : [];

  const normalizeFeatures = (features: string | string[] | undefined): string[] | undefined => {
    if (!features) return undefined;
    if (Array.isArray(features)) return features;
    return features.split(/[,;|]/).map(f => f.trim()).filter(f => f.length > 0);
  };

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
    listingAge: response.modificationTimestamp,
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

export function SavedListingsModal({
  isOpen,
  onClose,
  isClosing = false,
}: SavedListingsModalProps) {
  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Fetch saved listings when modal opens or page changes
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const fetchSavedListings = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get saved listings with pagination
        const response = await getSavedListings({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });

        setSavedListings(response.listings);
        setTotal(response.total);
        setTotalPages(response.totalPages);

        if (response.listings.length === 0) {
          setProperties([]);
          setLoading(false);
          return;
        }

        // Fetch property details for each saved listing
        const propertyPromises = response.listings.map(savedListing =>
          api.properties.getDetails(savedListing.MlsNumber)
            .then(convertPropertyDetailsToProperty)
            .catch((err) => {
              console.error(`Failed to fetch property ${savedListing.MlsNumber}:`, err);
              return null;
            })
        );

        const fetchedProperties = await Promise.all(propertyPromises);
        const validProperties = fetchedProperties.filter((p): p is Property => p !== null);
        setProperties(validProperties);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load saved listings');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedListings();
  }, [isOpen, currentPage]);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleClosePropertyModal = () => {
    setSelectedProperty(null);
  };

  const handleUnsave = async (property: Property) => {
    const savedListing = savedListings.find(sl => sl.MlsNumber === property.mlsNumber);
    if (!savedListing) return;

    try {
      await deleteSavedListing(savedListing.Id);
      // Remove from local state
      setProperties(prev => prev.filter(p => p.mlsNumber !== property.mlsNumber));
      setSavedListings(prev => prev.filter(sl => sl.Id !== savedListing.Id));
      setTotal(prev => prev - 1);
    } catch (err) {
      console.error('Failed to unsave property:', err);
    }
  };

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        className={cn(
          'transition-all duration-200 ease-out will-change-transform',
          'max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-4rem)]',
          isClosing ? 'translate-y-6 scale-[0.98] opacity-0' : 'translate-y-0 scale-100 opacity-100'
        )}
        overlayClassName={cn(
          'transition-opacity duration-200 ease-out',
          'z-[120]',
          isClosing ? 'opacity-0' : 'opacity-100'
        )}
        size="xl"
        contentClassName="p-0 overflow-y-auto"
      >
        <div className="flex flex-col gap-6 bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Saved Listings</h2>
              <p className="mt-1 text-sm text-gray-500">
                {total > 0 ? `${total} ${total === 1 ? 'saved listing' : 'saved listings'}` : 'No saved listings yet'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              aria-label="Close saved listings modal"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l8 8M14 6l-8 8" />
              </svg>
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-600">Loading saved listings...</div>
            </div>
          )}

          {error && (
            <div className="rounded-2xl px-4 py-3 text-sm font-medium bg-red-50 text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && properties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg
                className="h-16 w-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved listings yet</h3>
              <p className="text-sm text-gray-500">Start saving properties to see them here.</p>
            </div>
          )}

          {!loading && !error && properties.length > 0 && (
            <>
              <div className="overflow-y-auto max-h-[calc(100vh-24rem)]">
                <PropertyGrid
                  properties={properties}
                  onPropertyClick={handlePropertyClick}
                  onFavorite={handleUnsave}
                />
              </div>
              {totalPages > 1 && (
                <div className="pt-4 border-t border-gray-200">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </BaseModal>

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
    </>
  );
}

