"use client";

import { useMemo, useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  Share2,
  Eye,
  Bookmark,
  MapPin,
  Ruler,
  Home,
  Calendar,
  FileText,
  Bot,
  Sparkles,
  History,
  Phone,
  Mail,
  MessageCircle,
  Star,
  Award,
  Maximize2
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Property, PropertyRoom } from '@/types/property';
import { toast } from 'sonner';
import { PropertyLikeButton, PropertySaveButton } from '@/components/shared/buttons';
import {
  BasementSection,
  CondoInfoSection,
  FeaturesSection,
  ListingInformationSection,
  ParkingSection,
  PoolWaterfrontSection,
  PropertyDetailsSection,
  UtilitiesSection,
} from '../sections';
import { PropertyLocationMap } from '../shared';
import { usePropertyDetailsData } from '../hooks/usePropertyDetailsData';
import type { SpecItem } from '../helpers';
import type { RoomInfo } from '../hooks/useRoomDetails';
import { api } from '@/lib/api';

interface PropertyDetailsModalMobileProps {
  isOpen: boolean;
  property?: Property;
  onClose?: () => void;
}

type TabType = 'about' | 'ai';

type PropertyWithDailyStats = Property & {
  stats?: Property['stats'] & {
    todayViews?: number;
    todaySaves?: number;
  };
};

export default function PropertyDetailsModalMobile({ 
  isOpen, 
  property: rawProperty, 
  onClose 
}: PropertyDetailsModalMobileProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreenGallery, setIsFullscreenGallery] = useState(false);
  const [descriptionTab, setDescriptionTab] = useState<TabType>('about');
  const [expandedRooms, setExpandedRooms] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [fullProperty, setFullProperty] = useState<Property | undefined>(rawProperty);
  const [isLoadingFullDetails, setIsLoadingFullDetails] = useState(false);

  // Ensure we're on the client side before rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch full property details if we don't have a complete images array
  useEffect(() => {
    if (!isOpen || !rawProperty) return;

    const listingKey = rawProperty.listingKey || rawProperty.id;
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
              .map((m: any) => m.url)
              .filter((url: any): url is string => Boolean(url && typeof url === 'string' && url.trim() !== ''));
          }
          // Fallback to images field if media array is empty
          if (images.length === 0 && (response as any).images && Array.isArray((response as any).images)) {
            images = ((response as any).images || [])
              .filter((url: any): url is string => Boolean(url && typeof url === 'string' && url.trim() !== ''));
          }
          
          // Normalize features fields: convert string to array if needed
          const normalizeFeatures = (features: string | string[] | undefined): string[] | undefined => {
            if (!features) return undefined;
            if (Array.isArray(features)) return features;
            return features.split(/[,;|]/).map(f => f.trim()).filter(f => f.length > 0);
          };
          
          // Merge the fetched property with the existing one to preserve any additional data
          // Preserve both images array and media array for maximum compatibility
          
          // Normalize transactionType to match Property type
          const normalizeTransactionType = (type: any): 'For Sale' | 'For Lease' | undefined => {
            if (!type) return undefined;
            const normalized = String(type).trim();
            if (normalized === 'For Sale' || normalized === 'For Lease') {
              return normalized as 'For Sale' | 'For Lease';
            }
            // Default to 'For Sale' if it's a sale-related value, otherwise undefined
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
          
          setFullProperty({ 
            ...rawProperty, 
            ...response, 
            images, 
            media: response.media,
            exteriorFeatures: normalizeFeatures(response.exteriorFeatures) ?? rawProperty?.exteriorFeatures,
            interiorFeatures: normalizeFeatures((response as any).interiorFeatures) ?? rawProperty?.interiorFeatures,
            // Convert null to undefined for primaryImageUrl to match Property type
            primaryImageUrl: (response as any).primaryImageUrl ?? undefined,
            // Normalize transactionType to match Property type
            transactionType: normalizeTransactionType((response as any).transactionType) ?? rawProperty?.transactionType,
            // Normalize rooms to match PropertyRoom[] type
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
  }, [isOpen, rawProperty, isLoadingFullDetails]);

  const { property: normalizedProperty, rawProperty: resolvedProperty, galleryImages, specs, stats, rooms, agent } = usePropertyDetailsData(fullProperty);
  const property = normalizedProperty;

  const quickOverviewSpecs = useMemo(() => {
    if (!specs || !Array.isArray(specs)) return [];
    const order = ["Beds", "Baths", "Sq Ft", "Type", "Sub Type", "Basement", "Parking", "Lot Size", "Age", "Days on Market"];
    return order
      .map((label) => specs.find((spec) => spec?.label === label))
      .filter((spec): spec is SpecItem => Boolean(spec));
  }, [specs]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [resolvedProperty?.mlsNumber, galleryImages.length, isOpen]);

  const totalImages = galleryImages.length || 1;
  const currentImage = galleryImages[currentImageIndex] ?? galleryImages[0];
  
  // Room details hook - ensure we're mounted and have required data
  if (!isMounted || typeof window === 'undefined') return null;
  if (!isOpen || !property || !resolvedProperty) return null;

  const extendedProperty = resolvedProperty as PropertyWithDailyStats | undefined;
  const totalViews = stats.views;
  const totalSaves = stats.saves;
  const todayViews = extendedProperty?.stats?.todayViews ?? 0;
  const todaySaves = extendedProperty?.stats?.todaySaves ?? 0;
  const roomData = rooms.data;
  const roomsLoading = rooms.loading;

  // Navigation handlers
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  // Share handler
  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${property.StreetAddress}`,
          text: `Check out this property`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  // Format helpers
  const formatPrice = (price: number) => `$${price.toLocaleString()}`;
  // Format open house info
  const formatOpenHouseInfo = () => {
    if (property.OpenHouseDetails) {
      return property.OpenHouseDetails;
    }
    if (property.OpenHouseDate) {
      const date = new Date(property.OpenHouseDate);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const day = date.getDate();
      const daySuffix = (day: number) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };
      // If there's a time component, include it
      const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      return `${dayOfWeek}, ${month} ${day}${daySuffix(day)}, ${time}`;
    }
    return 'Open House';
  };

  const handleExpand = () => {
    // Get MLS number from property (prefer MLSNumber from normalized property, fallback to mlsNumber from raw property)
    const mlsNumber = property?.MLSNumber || resolvedProperty?.mlsNumber || resolvedProperty?.listingKey || resolvedProperty?.id;
    
    if (!mlsNumber) {
      console.error('[PropertyDetailsModalMobile] Cannot expand: No MLS number or identifier found', {
        property: property,
        resolvedProperty: resolvedProperty
      });
      toast.error('Unable to open property page: Missing property identifier');
      return;
    }

    try {
      // Navigate to the property details page with MLS number in URL
      const url = `/property/${encodeURIComponent(String(mlsNumber))}`;
      console.log('[PropertyDetailsModalMobile] Expanding to:', url);
      
      // Navigate first - the route change will naturally close the modal
      // Using window.location.href for reliable full page navigation
      window.location.href = url;
    } catch (error) {
      console.error('[PropertyDetailsModalMobile] Error navigating to property page:', error);
      toast.error('Failed to open property page');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Action Buttons - Fixed Top Right */}
      <div className="fixed top-2 right-2 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={handleExpand}
          className="h-11 w-11 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Open in full page"
          title="Open in full page"
        >
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={onClose}
          className="h-11 w-11 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Content Container - Gallery on top, header directly beneath */}
      <div className="pb-6">
        {/* Media Gallery Section */}
        <div className="relative w-full h-[300px] bg-black">
          {currentImage?.url ? (
            <img
              src={currentImage.url}
              alt={currentImage?.alt || 'Property image'}
              className="w-full h-full object-cover"
              onClick={() => setIsFullscreenGallery(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
              <span className="text-6xl">🏠</span>
            </div>
          )}
          
          {/* Badges - Top Left */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 max-w-[45%]">
            <span className="px-2 py-0.5 bg-blue-600 rounded text-xs font-semibold text-white shadow-lg">
              {property.MlsStatus || 'Active'}
            </span>
            <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded text-xs font-medium text-gray-800 shadow-md">
              {property.PropertyType || 'Property'}
            </span>
          </div>

          {/* Action Buttons - Top Right (with spacing for close button) */}
          <div className="absolute top-2 right-16 flex items-center gap-2">
            <PropertySaveButton 
              property={resolvedProperty}
              variant="card"
              size="lg"
            />
            <PropertyLikeButton 
              property={resolvedProperty}
              variant="card"
              size="lg"
            />
          </div>
          
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white transition-colors hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className="absolute right-16 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white transition-colors hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs">
            {currentImageIndex + 1} / {totalImages}
          </div>

          {/* Virtual Tour Button */}
          {(property.VirtualTourUrl || property.VirtualTourURL) && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const tourUrl = property.VirtualTourUrl || property.VirtualTourURL;
                if (tourUrl) {
                  if (typeof window !== 'undefined') {
                    window.open(tourUrl, '_blank');
                  }
                }
              }}
              className="absolute bottom-2 right-2 flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-lg bg-purple-600 hover:bg-purple-700"
            >
              <Video className="w-4 h-4" />
              Virtual Tour
            </button>
          )}
        </div>
        
        {/* Header Section - Optimized Layout */}
        <div className="px-3 py-4 border-b border-gray-200">
          {/* Address and Open House Badge */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h1 className="text-xl font-bold text-gray-900 flex-1">
              {property.StreetAddress}
            </h1>
            {/* Open House Badge */}
            {(property.OpenHouseDetails || property.OpenHouseDate) && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-xs font-semibold text-white shadow-md flex items-center gap-1 flex-shrink-0 max-w-[55%] whitespace-normal text-right leading-tight">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="break-words">{formatOpenHouseInfo()}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            {property.City}, {property.StateOrProvince}
          </div>

          {/* Price Section - Reorganized for better space usage */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(property.ListPrice || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Tax: ${property.PropertyTaxes?.toLocaleString() || '0'} ({property.TaxYear || 'N/A'})</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {property.DaysOnMarket || 0} days on market
              </span>
            </div>
          </div>

          {/* Engagement Stats and Actions - Horizontal Layout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {totalViews}
              </span>
              <span className="flex items-center gap-1">
                <Bookmark className="w-4 h-4" />
                {totalSaves}
              </span>
              <span className="text-gray-400">
                Today: {todayViews}v, {todaySaves}s
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <PropertySaveButton 
                property={resolvedProperty}
                variant="minimal"
                size="sm"
                borderRadius="lg"
              />
              <PropertyLikeButton 
                property={resolvedProperty}
                variant="minimal"
                size="sm"
                borderRadius="lg"
              />
              <button onClick={handleShare} className="p-1.5 rounded-lg bg-gray-100 text-gray-600">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Highlights Grid - 2-3 columns, dense layout */}
        {quickOverviewSpecs.length > 0 && (
          <div className="px-3 py-4 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Overview</h3>
            <div className="grid grid-cols-3 gap-2">
              {quickOverviewSpecs.map((spec) => (
                <HighlightItem key={spec.label} spec={spec} />
              ))}
            </div>
          </div>
        )}

        {/* Description Section with Tabs */}
        <div className="px-3 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-900">Property Description</h3>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setDescriptionTab('about')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                descriptionTab === 'about'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <FileText className="w-3 h-3" />
                <span>About</span>
              </div>
            </button>
            <button
              onClick={() => setDescriptionTab('ai')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                descriptionTab === 'ai'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <Bot className="w-3 h-3" />
                <span>AI Summary</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="text-sm text-gray-700 leading-relaxed">
            {descriptionTab === 'about' ? (
              <p className="whitespace-pre-line">
                {property.Description || 'No description available for this property.'}
              </p>
            ) : (
              <div className="space-y-3">
                {(property as any).aiSummary ? (
                  <>
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <div className="flex items-start gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <h5 className="text-xs font-semibold text-purple-800">AI Summary</h5>
                      </div>
                      <p className="text-xs text-purple-700 leading-relaxed mb-2">
                        {(property as any).aiSummary.summary}
                      </p>
                      {(property as any).aiSummary.highlights && (property as any).aiSummary.highlights.length > 0 && (
                        <ul className="space-y-1 mt-2">
                          {(property as any).aiSummary.highlights.map((highlight: string, index: number) => (
                            <li key={index} className="text-xs text-purple-700 flex items-start gap-1.5">
                              <span className="text-purple-500 mt-0.5">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {(property as any).aiSummary.confidence && (
                        <p className="text-xs text-purple-600 mt-2 pt-2 border-t border-purple-200">
                          Confidence: {Math.round((property as any).aiSummary.confidence * 100)}%
                        </p>
                      )}
                    </div>
                    {property.Description && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">Original Description</p>
                        <p className="text-xs text-gray-700 whitespace-pre-line">
                          {property.Description}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                <p className="whitespace-pre-line">
                  {property.Description || 'No description available for this property.'}
                </p>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-700">
                    <strong>AI Summary Coming Soon</strong> - AI-powered property insights are currently in development.
                  </p>
                </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Listing History */}
        <div className="px-3 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm font-bold text-gray-900">Listing History</h3>
          </div>
          
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-semibold">MLS# {property.MLSNumber}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                property.MlsStatus === 'Active' ? 'bg-green-100 text-green-700' :
                property.MlsStatus === 'Sold' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {property.MlsStatus}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] text-gray-500 font-medium uppercase">List Date</div>
                <div className="text-sm font-semibold text-gray-900">
                  {property.ListDate ? new Date(property.ListDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 font-medium uppercase">List Price</div>
                <div className="text-sm font-semibold text-gray-900">
                  {property.ListPrice ? formatPrice(property.ListPrice) : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 font-medium uppercase">Close Price</div>
                <div className="text-sm font-semibold text-gray-900">
                  {property.ClosePrice ? formatPrice(property.ClosePrice) : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 font-medium uppercase">Days on Market</div>
                <div className="text-sm font-semibold text-gray-900">
                  {property.DaysOnMarket || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Information Sections - Collapsible */}
        <div className="px-3 py-4 space-y-2">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Property Information</h3>
          <ListingInformationSection property={property} />
          <PropertyDetailsSection property={property} hideValueIcons />
          <BasementSection property={property} />
          <CondoInfoSection property={property} hideValueIcons />
          <ParkingSection property={property} />
          <UtilitiesSection property={property} />
          <PoolWaterfrontSection property={property} />
          <FeaturesSection property={property} />
        </div>

        {/* Room Details Section - Collapsible */}
        <div className="px-3 py-4 border-t border-gray-200">
          <button
            onClick={() => setExpandedRooms(!expandedRooms)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-indigo-600" />
              <div className="text-left">
                <h3 className="text-sm font-bold text-gray-900">Room Details</h3>
                <p className="text-xs text-gray-500">
                  {roomData.length > 0 ? `${roomData.length} rooms` : 'Limited data'}
                </p>
              </div>
            </div>
            <ChevronLeft className={`w-4 h-4 text-gray-600 transition-transform ${expandedRooms ? '-rotate-90' : 'rotate-180'}`} />
          </button>

          {expandedRooms && (
            <div className="mt-3">
              {/* Room List */}
              {roomsLoading ? (
                <p className="text-center text-sm text-gray-500 py-4">Loading rooms...</p>
              ) : roomData.length > 0 ? (
                <div className="overflow-x-auto -mx-3">
                  <div className="min-w-full inline-block align-middle">
                    {/* Table Header */}
                    <div className="grid grid-cols-4 gap-3 px-3 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                      <div className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">
                        Room Type
                      </div>
                      <div className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">
                        Room Level
                      </div>
                      <div className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">
                        Dimensions
                      </div>
                      <div className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">
                        Features
                      </div>
                    </div>
                    {/* Table Rows */}
                    <div className="divide-y divide-gray-100">
                      {roomData.map((room: RoomInfo, index: number) => (
                        <div 
                          key={index} 
                          className="grid grid-cols-4 gap-3 px-3 py-2.5 bg-white hover:bg-gray-50 transition-colors duration-150"
                        >
                          {/* Room Type Column */}
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="flex-shrink-0 p-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                              <room.icon className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-semibold text-gray-900 truncate">
                              {room.roomType || "N/A"}
                            </span>
                          </div>
                          
                          {/* Room Level Column */}
                          <div className="flex items-center min-w-0">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                              <span className="text-xs text-gray-700 truncate">
                                {room.level || "N/A"}
                              </span>
                            </div>
                          </div>
                          
                          {/* Dimensions Column */}
                          <div className="flex items-center gap-1 min-w-0">
                            <Ruler className="h-3 w-3 text-gray-400 flex-shrink-0" />
                            <span className="text-xs text-gray-700 truncate">
                              {room.roomDimensions || "N/A"}
                            </span>
                          </div>
                          
                          {/* Features Column */}
                          <div className="flex flex-wrap gap-1 items-center min-w-0">
                            {room.roomFeatures && room.roomFeatures.length > 0 ? (
                              <>
                                {room.roomFeatures.slice(0, 2).map((feature, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200 whitespace-nowrap"
                                  >
                                    {feature}
                                  </span>
                                ))}
                                {room.roomFeatures.length > 2 && (
                                  <span className="text-[10px] text-gray-500 font-medium">
                                    +{room.roomFeatures.length - 2}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-[10px] text-gray-400 italic">None</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500 py-4">No room details available</p>
              )}
            </div>
          )}
        </div>

        {/* Location Map Section */}
        <div className="px-3 py-4 border-t border-gray-200">
          <PropertyLocationMap property={resolvedProperty} />
        </div>

        {/* Contact Agent Section - Full width at the end */}
        <div className="px-3 py-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-xl px-4 py-3">
            <h2 className="text-base font-bold text-white">Contact Agent</h2>
            <p className="text-green-100 text-xs mt-1">Get expert assistance</p>
          </div>
          
          <div className="bg-white rounded-b-xl border border-gray-200 border-t-0 p-4">
            {/* Agent Profile */}
            <div className="flex items-center gap-3 mb-4">
              {agent.avatar && agent.avatar.trim() ? (
                <Image
                  src={agent.avatar}
                  alt={agent.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center border-2 border-white shadow">
                  <span className="text-lg">👤</span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900">{agent.name}</h3>
                <p className="text-xs text-gray-600">{agent.title}</p>
                <p className="text-xs text-gray-500">{agent.company}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                  <span className="text-sm font-bold text-gray-900">{agent.rating}</span>
                </div>
                <p className="text-[10px] text-gray-600">{agent.reviewCount} Reviews</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <Award className="h-3 w-3 text-blue-500 mr-1" />
                  <span className="text-sm font-bold text-gray-900">{agent.propertiesSold}</span>
                </div>
                <p className="text-[10px] text-gray-600">Properties Sold</p>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-xl font-semibold text-sm">
                <Phone className="h-4 w-4" />
                Call {agent.phone}
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-medium text-xs">
                  <Mail className="h-4 w-4" />
                  Email
                </button>
                <button className="flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg font-medium text-xs">
                  <MessageCircle className="h-4 w-4" />
                  Message
                </button>
              </div>
              
              <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 px-4 rounded-xl font-semibold text-sm border border-gray-200">
                <Calendar className="h-4 w-4" />
                Schedule Viewing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {isFullscreenGallery && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreenGallery(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm z-10">
            {currentImageIndex + 1} / {totalImages}
          </div>

          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center p-4">
            {currentImage?.url ? (
              <img
                src={currentImage.url}
                alt={currentImage?.alt || 'Property image'}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                <span className="text-6xl">🏠</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image Description */}
          <div className="p-4 text-center text-white/80 text-sm">
            {currentImage?.alt}
          </div>
        </div>
      )}
    </div>
  );
}

// Highlight Item Component
interface HighlightItemProps {
  spec: SpecItem;
}

function HighlightItem({ spec }: HighlightItemProps) {
  if (!spec || !spec.icon) return null;
  
  const Icon = spec.icon;
  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${spec.bgColor || 'bg-gray-50'}`}>
        <Icon className={`w-4 h-4 ${spec.iconColor || 'text-gray-600'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-gray-500 font-medium leading-tight">{spec.label || 'N/A'}</div>
        <div className="text-xs font-bold text-gray-900 leading-tight truncate">
          {typeof spec.value === 'number' ? Number(spec.value).toLocaleString() : (spec.value || 'N/A')}
        </div>
        {spec.helperText && (
          <div className="text-[9px] text-gray-400 leading-tight mt-0.5">
            {spec.helperText}
          </div>
        )}
      </div>
    </div>
  );
}

