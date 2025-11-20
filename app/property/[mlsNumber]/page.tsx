'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ArrowLeft } from 'lucide-react';
import type { Property } from '@/types/property';
import { PropertyDetailsHeader } from '@/components/property/PropertyDetails/desktop/PropertyDetailsHeader';
import {
  PropertyGallery,
  PropertyHighlightsGrid,
  PropertyDescriptionCard,
  ListingHistoryCard,
  PropertyInformationCard,
  RoomDetailsCard,
  PropertyLocationMap,
  AgentContactCard,
} from '@/components/property/PropertyDetails/shared';
import { usePropertyDetailsData } from '@/components/property/PropertyDetails/hooks/usePropertyDetailsData';
import { api, type PropertyDetailsResponse, type PropertyMediaItem } from '@/lib/api';
import type { PropertyDetailsData } from '@/components/property/PropertyDetails/normalizeProperty';
import { PageContainer } from '@/components/layout';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const mlsNumber = params?.mlsNumber as string;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [descTab, setDescTab] = useState<"about" | "ai">("about");
  const [historyExpanded, setHistoryExpanded] = useState(true);
  const [roomsExpanded, setRoomsExpanded] = useState(true);
  const [property, setProperty] = useState<Property | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch property details by MLS number (or listingKey if they're the same)
  useEffect(() => {
    if (!mlsNumber) {
      setError('MLS number is required');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Try to fetch by MLS number (backend accepts listingKey, which may be the same as MLS number)
    // If MLS number and listingKey are different, we may need backend support for MLS number lookup
    api.properties.getDetails(mlsNumber)
      .then((response: PropertyDetailsResponse) => {
        // Extract images from media array or use images field
        const images = (response as PropertyDetailsResponse & { images?: string[] }).images || 
          (response.media || []).map((m: PropertyMediaItem) => m.url || (m as PropertyMediaItem & { MediaURL?: string }).MediaURL).filter(Boolean) as string[];
        // Store the response as Property (usePropertyDetailsData will handle normalization)
        setProperty({ ...response, images, media: response.media } as unknown as Property);
      })
      .catch((err) => {
        console.error('Failed to fetch property details:', err);
        setError('Property not found');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [mlsNumber]);

  const { property: normalizedProperty, rawProperty: resolvedProperty, galleryImages, specs, interest, statusGradient, rooms, agent } = usePropertyDetailsData(property || undefined);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-slate-600">Loading property details...</div>
        </div>
      </PageContainer>
    );
  }

  if (error || !property || !normalizedProperty || !resolvedProperty) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested property could not be found.'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </PageContainer>
    );
  }

  const propertyData = normalizedProperty;
  const description = propertyData.Description?.trim() || null;
  const hasDescription = description !== null;

  const handleShare = async () => {
    const shareData = {
      title: `${propertyData.StreetAddress} - ${propertyData.City}, ${propertyData.StateOrProvince}`,
      text: `Check out this ${propertyData.PropertyType} listed at $${(propertyData.ListPrice || 0).toLocaleString()}`,
      url: window.location.href,
    };
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(window.location.href);
        } catch {
          // Share failed
        }
      }
    }
  };

  const handleSelectImage = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with back button */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Back</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Property Details</h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        <PropertyDetailsHeader 
          property={propertyData} 
          rawProperty={resolvedProperty} 
          interest={interest} 
          statusGradient={statusGradient} 
          onShare={handleShare} 
        />
        <PropertyGallery 
          images={galleryImages} 
          propertyStatus={propertyData.MlsStatus} 
          propertyType={propertyData.PropertyType} 
          virtualTourUrl={propertyData.VirtualTourUrl || propertyData.VirtualTourURL} 
          onSelectImage={handleSelectImage} 
        />

        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <PropertyHighlightsGrid specs={specs} />
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
              <div className="w-full lg:w-3/4">
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                  <PropertyDescriptionCard 
                    description={description} 
                    hasDescription={hasDescription} 
                    tab={descTab} 
                    onTabChange={setDescTab}
                    aiSummary={(propertyData as PropertyDetailsData & { aiSummary?: { summary: string; highlights: string[]; confidence: number } | null }).aiSummary || null}
                  />
                  <ListingHistoryCard 
                    property={propertyData} 
                    expanded={historyExpanded} 
                    onToggle={() => setHistoryExpanded((prev) => !prev)} 
                  />
                  <PropertyInformationCard property={propertyData} />
                  <RoomDetailsCard 
                    property={propertyData as { Bedrooms?: number | null; Bathrooms?: number | null; SquareFootage?: number | null }} 
                    rooms={rooms.data} 
                    expanded={roomsExpanded} 
                    onToggle={() => setRoomsExpanded((prev) => !prev)} 
                    loading={rooms.loading} 
                    error={rooms.error ? String(rooms.error) : null} 
                  />
                  <PropertyLocationMap property={resolvedProperty} />
                </div>
              </div>
              <div className="w-full lg:w-1/4">
                <AgentContactCard agent={agent} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-2 right-2 sm:top-6 sm:right-6 p-2 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-200 z-10 border border-white/20"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="absolute top-2 left-2 sm:top-6 sm:left-6 px-2 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm sm:text-base font-medium border border-white/20">
            {currentImageIndex + 1} / {galleryImages.length}
          </div>
          <button
            onClick={() => setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
            className="absolute left-2 sm:left-6 p-2 sm:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-200 border border-white/20"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <div className="w-full h-full flex flex-col items-center justify-center px-2 sm:px-4 py-16 sm:py-20">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative h-full w-full max-h-[calc(100vh-10rem)] max-w-[calc(100vw-4rem)]">
                <Image
                  src={galleryImages[currentImageIndex]?.url ?? ""}
                  alt={galleryImages[currentImageIndex]?.alt ?? "Property image"}
                  fill
                  className="object-contain rounded-lg shadow-2xl"
                  sizes="100vw"
                  unoptimized
                />
              </div>
            </div>
            <p className="text-center text-white/80 mt-2 sm:mt-4 text-sm sm:text-lg font-medium px-4">
              {galleryImages[currentImageIndex]?.alt}
            </p>
          </div>
          <button
            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)}
            className="absolute right-2 sm:right-6 p-2 sm:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-200 border border-white/20"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 max-w-4xl overflow-x-auto z-10">
            {galleryImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                  currentImageIndex === index ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={image.url} alt={image.alt} fill className="object-cover" sizes="64px" unoptimized />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

