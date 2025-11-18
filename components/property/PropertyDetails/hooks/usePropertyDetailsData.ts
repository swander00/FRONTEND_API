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
    // First, try to use the images array (array of URLs)
    if (resolvedRawProperty?.images && resolvedRawProperty.images.length > 0) {
      return resolvedRawProperty.images.map((url, index) => ({
        id: index + 1,
        url,
        alt: `${property?.StreetAddress ?? "Property"} - Image ${index + 1}`,
      }));
    }

    // Second, try to extract from media array (array of media objects)
    if (resolvedRawProperty?.media && Array.isArray(resolvedRawProperty.media) && resolvedRawProperty.media.length > 0) {
      return resolvedRawProperty.media
        .map((m: any, index: number) => ({
          id: m.id || m.MediaKey || index + 1,
          url: m.url || m.MediaURL,
          alt: m.alt || m.ShortDescription || m.caption || `${property?.StreetAddress ?? "Property"} - Image ${index + 1}`,
        }))
        .filter((img: any) => img.url); // Filter out any items without URLs
    }

    // Third, fall back to primaryImageUrl
    if (resolvedRawProperty?.primaryImageUrl) {
      return [
        {
          id: 1,
          url: resolvedRawProperty.primaryImageUrl,
          alt: `${property?.StreetAddress ?? "Property"} - Image 1`,
        },
      ];
    }

    return propertyImages;
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


