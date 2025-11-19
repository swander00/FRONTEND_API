"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { PropertyDetailsModal as SharedModal } from "@/components/shared";
import type { Property, PropertyRoom } from "@/types/property";
import { toast } from "sonner";
import { PropertyDetailsHeader } from "./PropertyDetailsHeader";
import {
  PropertyGallery,
  PropertyHighlightsGrid,
  PropertyDescriptionCard,
  ListingHistoryCard,
  PropertyInformationCard,
  RoomDetailsCard,
  PropertyLocationMap,
  AgentContactCard,
} from "../shared";
import { usePropertyDetailsData } from "../hooks/usePropertyDetailsData";
import { api, type PropertyDetailsResponse, type PropertyMediaItem } from "@/lib/api/index";

interface PropertyDetailsModalDesktopProps {
  isOpen: boolean;
  property?: Property;
  propertyId?: string;
  onClose?: () => void;
}

export default function PropertyDetailsModalDesktop({ isOpen, property: rawProperty, propertyId, onClose }: PropertyDetailsModalDesktopProps) {
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [descTab, setDescTab] = useState<"about" | "ai">("about");
  const [historyExpanded, setHistoryExpanded] = useState(true);
  const [roomsExpanded, setRoomsExpanded] = useState(true);
  const [fullProperty, setFullProperty] = useState<Property | undefined>(rawProperty);
  const [isLoadingFullDetails, setIsLoadingFullDetails] = useState(false);

  // Fetch full property details if we don't have a complete images array
  useEffect(() => {
    if (!isOpen || !rawProperty) return;

    const listingKey = rawProperty.listingKey || rawProperty.id || propertyId;
    // Check if we have multiple images OR a media array (indicating full details were fetched)
    // Properties from list endpoint only have 1 image (primary), so we need to fetch full details
    const hasFullImages = (rawProperty.images && rawProperty.images.length > 1) || 
                          (rawProperty.media && Array.isArray(rawProperty.media) && rawProperty.media.length > 0);
    
    // If we have full images array or media array, use the property as-is
    if (hasFullImages) {
      setFullProperty(rawProperty);
      return;
    }

    // Otherwise, fetch full details
    if (listingKey && !isLoadingFullDetails) {
      setIsLoadingFullDetails(true);
      api.properties.getDetails(listingKey)
        .then((response) => {
          // Extract images from media array or use images field
          // Prioritize media array as it's the primary source
          let images: string[] = [];
          if (response.media && Array.isArray(response.media) && response.media.length > 0) {
            images = response.media
              .map((m: PropertyMediaItem) => m.url)
              .filter((url): url is string => Boolean(url && typeof url === 'string' && url.trim() !== ''));
          }
          // Fallback to images field if media array is empty
          if (images.length === 0 && (response as PropertyDetailsResponse & { images?: string[] }).images) {
            images = ((response as PropertyDetailsResponse & { images?: string[] }).images || [])
              .filter((url): url is string => Boolean(url && typeof url === 'string' && url.trim() !== ''));
          }
          // Normalize features fields: convert string to array if needed
          const normalizeFeatures = (features: string | string[] | undefined): string[] | undefined => {
            if (!features) return undefined;
            if (Array.isArray(features)) return features;
            return features.split(/[,;|]/).map(f => f.trim()).filter(f => f.length > 0);
          };
          
          // Normalize transactionType to match Property type
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
          
          // Normalize rooms array to match PropertyRoom[] type
          const normalizeRooms = (rooms: any): PropertyRoom[] | undefined => {
            if (!rooms) return undefined;
            if (!Array.isArray(rooms)) return undefined;
            return rooms.map((room: any) => ({
              type: String(room.type || room.Type || ''),
              level: room.level || room.Level || undefined,
              dimensions: room.dimensions || room.Dimensions || undefined,
              measurements: room.measurements || room.Measurements || undefined,
              description: room.description || room.Description || undefined,
              features: room.features || room.Features || undefined,
            })).filter((room: PropertyRoom) => room.type);
          };
          
          // Merge the fetched property with the existing one to preserve any additional data
          // Preserve both images array and media array for maximum compatibility
          setFullProperty({ 
            ...rawProperty, 
            ...response, 
            images, 
            media: response.media,
            exteriorFeatures: normalizeFeatures((response as any).exteriorFeatures) ?? rawProperty?.exteriorFeatures,
            interiorFeatures: normalizeFeatures((response as any).interiorFeatures) ?? rawProperty?.interiorFeatures,
            primaryImageUrl: (response as any).primaryImageUrl ?? undefined,
            transactionType: normalizeTransactionType((response as any).transactionType) ?? rawProperty?.transactionType,
            rooms: normalizeRooms((response as any).rooms) ?? rawProperty?.rooms,
          } as Property);
        })
        .catch((error) => {
          console.error('Failed to fetch full property details:', error);
          // Fall back to the original property data
          setFullProperty(rawProperty);
        })
        .finally(() => {
          setIsLoadingFullDetails(false);
        });
    }
  }, [isOpen, rawProperty, propertyId, isLoadingFullDetails]);

  const { property, rawProperty: resolvedProperty, galleryImages, specs, interest, statusGradient, rooms, agent } = usePropertyDetailsData(fullProperty);

  if (!isOpen) return null;

  if (!resolvedProperty || !property) {
    return (
      <SharedModal
        open={isOpen}
        onClose={() => onClose?.()}
        title="Property not found"
        description="The requested property could not be found in our database."
      >
        <div className="text-center p-8">{propertyId && <p className="text-sm text-gray-400">Property ID: {propertyId}</p>}</div>
      </SharedModal>
    );
  }

  const description = property.Description?.trim() || null;
  const hasDescription = description !== null;

  const handleShare = async () => {
    const shareData = {
      title: `${property.StreetAddress} - ${property.City}, ${property.StateOrProvince}`,
      text: `Check out this ${property.PropertyType} listed at $${(property.ListPrice || 0).toLocaleString()}`,
      url: window.location.href,
    };
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied!");
        } catch {
          toast.error("Share failed");
        }
      }
    }
  };

  const handleSelectImage = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleExpand = () => {
    // Get MLS number from property (prefer MLSNumber from normalized property, fallback to mlsNumber from raw property)
    const mlsNumber = property?.MLSNumber || resolvedProperty?.mlsNumber || resolvedProperty?.listingKey;
    if (mlsNumber) {
      // Navigate to the property details page with MLS number in URL
      router.push(`/property/${encodeURIComponent(mlsNumber)}`);
      // Close the modal
      onClose?.();
    }
  };

  return (
    <SharedModal open={isOpen} onClose={() => onClose?.()} title="" showCloseButton={false}>
      <div className="flex flex-col h-full max-h-[80vh]">
        <div className="flex items-center justify-between p-2 sm:p-4 border-b border-gray-200/60 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
          <h2 className="text-sm sm:text-lg font-semibold text-gray-900">Property Details</h2>
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={handleExpand} className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200" title="Open in full page">
              <Maximize2 className="w-4 h-4 text-gray-600" />
            </button>
            <button onClick={onClose} className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <PropertyDetailsHeader property={property} rawProperty={resolvedProperty} interest={interest} statusGradient={statusGradient} onShare={handleShare} />
          <PropertyGallery images={galleryImages} propertyStatus={property.MlsStatus} propertyType={property.PropertyType} virtualTourUrl={property.VirtualTourUrl || property.VirtualTourURL} onSelectImage={handleSelectImage} />

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
                      aiSummary={(property as any).aiSummary || null}
                    />
                    <ListingHistoryCard property={property} expanded={historyExpanded} onToggle={() => setHistoryExpanded((prev) => !prev)} />
                    <PropertyInformationCard property={property} />
                    <RoomDetailsCard property={property} rooms={rooms.data} expanded={roomsExpanded} onToggle={() => setRoomsExpanded((prev) => !prev)} loading={rooms.loading} error={rooms.error ? String(rooms.error) : null} />
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
      </div>

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

      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
      `}</style>
    </SharedModal>
  );
}


