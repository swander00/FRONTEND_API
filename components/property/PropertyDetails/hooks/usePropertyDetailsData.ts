import { useMemo } from "react";
import type { Property } from "@/types/property";
import { normalizeProperty } from "../normalizeProperty";
import { buildPropertySpecs } from "../shared";
import { getInterestLevel, getStatusColor, propertyImages } from "../helpers";
import { mapRoomsToRoomInfo, useRoomDetails } from "./useRoomDetails";
import { mockAgent, mockProperty, mockRooms } from "../mock/mockData";

interface UsePropertyDetailsDataOptions {
  fallbackToMock?: boolean;
}

export function usePropertyDetailsData(rawProperty?: Property, options?: UsePropertyDetailsDataOptions) {
  const resolvedRawProperty = rawProperty ?? (options?.fallbackToMock === false ? undefined : mockProperty);

  const property = useMemo(() => (resolvedRawProperty ? normalizeProperty(resolvedRawProperty) : null), [resolvedRawProperty]);

  const galleryImages = useMemo(() => {
    // First, try to extract from media array (array of media objects) - this is the primary source
    if (resolvedRawProperty?.media && Array.isArray(resolvedRawProperty.media) && resolvedRawProperty.media.length > 0) {
      const mediaImages = resolvedRawProperty.media
        .map((m: any, index: number) => {
          // Handle PropertyMediaItem structure: { id, url, alt, order, caption }
          const url = m.url || m.MediaURL || null;
          if (!url || typeof url !== 'string' || url.trim() === '') {
            return null;
          }
          // Ensure id is always a number
          let id: number;
          if (typeof m.id === 'number') {
            id = m.id;
          } else if (typeof m.MediaKey === 'number') {
            id = m.MediaKey;
          } else {
            // Use index + 1 as fallback (ensures it's always a number)
            id = index + 1;
          }
          return {
            id,
            url: url.trim(),
            alt: m.alt || m.caption || m.ShortDescription || `${property?.StreetAddress ?? "Property"} - Image ${index + 1}`,
          };
        })
        .filter((img: any): img is { id: number; url: string; alt: string } => img !== null && img.url);
      
      if (mediaImages.length > 0) {
        return mediaImages;
      }
    }

    // Second, try to use the images array (array of URLs)
    if (resolvedRawProperty?.images && Array.isArray(resolvedRawProperty.images) && resolvedRawProperty.images.length > 0) {
      const imageUrls = resolvedRawProperty.images
        .map((url: any, index: number) => {
          if (!url || typeof url !== 'string' || url.trim() === '') {
            return null;
          }
          return {
            id: index + 1,
            url: url.trim(),
            alt: `${property?.StreetAddress ?? "Property"} - Image ${index + 1}`,
          };
        })
        .filter((img: any): img is { id: number; url: string; alt: string } => img !== null);
      
      if (imageUrls.length > 0) {
        return imageUrls;
      }
    }

    // Third, fall back to primaryImageUrl
    if (resolvedRawProperty?.primaryImageUrl && typeof resolvedRawProperty.primaryImageUrl === 'string' && resolvedRawProperty.primaryImageUrl.trim() !== '') {
      return [
        {
          id: 1,
          url: resolvedRawProperty.primaryImageUrl.trim(),
          alt: `${property?.StreetAddress ?? "Property"} - Image 1`,
        },
      ];
    }

    // Last resort: return empty array instead of mock images
    return [];
  }, [resolvedRawProperty?.images, resolvedRawProperty?.media, resolvedRawProperty?.primaryImageUrl, property?.StreetAddress]);

  const specs = useMemo(() => (property ? buildPropertySpecs(property) : []), [property]);

  const {
    rooms,
    loading: roomsLoading,
    error: roomsError,
  } = useRoomDetails(property?.MLSNumber || resolvedRawProperty?.mlsNumber || "");

  const hasRooms = rooms.length > 0;

  const interest = useMemo(() => getInterestLevel(property?.ViewCount || 0, property?.SaveCount || 0), [property?.ViewCount, property?.SaveCount]);
  const statusGradient = useMemo(() => getStatusColor(property?.MlsStatus || resolvedRawProperty?.mlsStatus || "Active"), [property?.MlsStatus, resolvedRawProperty?.mlsStatus]);

  const stats = {
    views: property?.ViewCount ?? resolvedRawProperty?.stats?.views ?? 0,
    saves: property?.SaveCount ?? resolvedRawProperty?.stats?.bookmarks ?? 0,
  };

  const fallbackRooms = useMemo(() => mapRoomsToRoomInfo(mockRooms), []);

  return {
    property,
    rawProperty: resolvedRawProperty,
    galleryImages,
    specs,
    interest,
    statusGradient,
    stats,
    rooms: {
      data: hasRooms ? rooms : fallbackRooms,
      loading: roomsLoading,
      error: roomsError,
      isMock: !hasRooms,
    },
    agent: mockAgent,
  };
}


