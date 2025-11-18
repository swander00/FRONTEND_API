"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { useLoadScript, GoogleMap } from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import type { Property } from "@/types/property";

interface PropertyLocationMapProps {
  property: Property;
}

const libraries: ("places" | "marker")[] = ["places", "marker"];

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 43.6532,
  lng: -79.3832,
};

export function PropertyLocationMap({ property }: PropertyLocationMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [markerLibraryLoaded, setMarkerLibraryLoaded] = useState(false);

  // Check if API key is configured
  const hasApiKey = Boolean(apiKey && apiKey.trim() !== "");

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  // Load AdvancedMarkerElement library
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined' && window.google?.maps) {
      google.maps.importLibrary("marker").then(() => {
        setMarkerLibraryLoaded(true);
      }).catch((err) => {
        console.error("Failed to load marker library:", err);
      });
    }
  }, [isLoaded]);

  const center = useMemo(() => {
    if (property.coordinates?.lat && property.coordinates?.lng) {
      return {
        lat: property.coordinates.lat,
        lng: property.coordinates.lng,
      };
    }
    return defaultCenter;
  }, [property.coordinates]);

  const hasCoordinates = Boolean(property.coordinates?.lat && property.coordinates?.lng);

  // Create AdvancedMarkerElement marker
  useEffect(() => {
    if (!isLoaded || !markerLibraryLoaded || !mapRef.current || !hasCoordinates) {
      return;
    }

    const map = mapRef.current;

    // Clean up existing marker
    if (markerRef.current) {
      markerRef.current.map = null;
      markerRef.current = null;
    }

    if (!window.google?.maps?.marker?.AdvancedMarkerElement) {
      console.warn("AdvancedMarkerElement not available");
      return;
    }

    // Create PinElement for custom styling
    const pinElement = new google.maps.marker.PinElement({
      background: "#2563eb",
      borderColor: "#ffffff",
      glyphColor: "#ffffff",
      scale: 1,
    });

    // Create AdvancedMarkerElement
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: center,
      title: property.address?.street || property.address?.unparsedAddress || "Property location",
      content: pinElement.element,
    });

    markerRef.current = marker;

    // Cleanup function
    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
    };
  }, [isLoaded, markerLibraryLoaded, hasCoordinates, center, property.address]);

  // Show error if API key is missing
  if (!hasApiKey) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Location</h3>
              <p className="text-xs text-gray-500">Map configuration required</p>
            </div>
          </div>
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-xs font-medium">Google Maps API key not configured</p>
            <p className="text-gray-500 text-xs mt-1">
              Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file
            </p>
            {(property.address?.street || property.address?.unparsedAddress) && (
              <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                <p className="text-xs text-gray-700 font-medium">
                  {property.address?.street || property.address?.unparsedAddress}
                </p>
                {property.address?.city && (
                  <p className="text-xs text-gray-500 mt-1">
                    {property.address.city}, {property.address.province}
                    {property.address.postalCode && ` ${property.address.postalCode}`}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Location</h3>
              <p className="text-xs text-gray-500">Map unavailable</p>
            </div>
          </div>
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-xs font-medium">Unable to load map</p>
            <p className="text-gray-500 text-xs mt-1">
              {loadError.message || "Please check your internet connection and API key configuration"}
            </p>
            {(property.address?.street || property.address?.unparsedAddress) && (
              <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                <p className="text-xs text-gray-700 font-medium">
                  {property.address?.street || property.address?.unparsedAddress}
                </p>
                {property.address?.city && (
                  <p className="text-xs text-gray-500 mt-1">
                    {property.address.city}, {property.address.province}
                    {property.address.postalCode && ` ${property.address.postalCode}`}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Location</h3>
              <p className="text-xs text-gray-500">Loading map...</p>
            </div>
          </div>
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-2"></div>
            <p className="text-gray-600 text-xs font-medium">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasCoordinates) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Location</h3>
              <p className="text-xs text-gray-500">Coordinates not available</p>
            </div>
          </div>
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-xs font-medium">Location data unavailable</p>
            <p className="text-gray-500 text-xs mt-1">
              {property.address?.street || property.address?.unparsedAddress || "Address not available"}
            </p>
            {property.address?.city && (
              <p className="text-gray-500 text-xs mt-1">
                {property.address.city}, {property.address.province}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Location</h3>
            <p className="text-xs text-gray-500">
              {property.address?.street || property.address?.unparsedAddress || "Property location"}
            </p>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={15}
            center={center}
            onLoad={(map) => {
              mapRef.current = map;
            }}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: false,
              fullscreenControl: true,
              // mapId is required for AdvancedMarkerElement
              mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID",
              // styles removed - when mapId is present, map styles are controlled via the cloud console
            }}
          >
            {/* Marker is created programmatically via useEffect */}
          </GoogleMap>
        </div>
        {(property.address?.street || property.address?.unparsedAddress) && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-700 font-medium">
              {property.address?.street || property.address?.unparsedAddress}
            </p>
            {property.address?.city && (
              <p className="text-xs text-gray-500 mt-1">
                {property.address.city}, {property.address.province}
                {property.address.postalCode && ` ${property.address.postalCode}`}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

