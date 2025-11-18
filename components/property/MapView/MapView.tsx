"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useLoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Property } from "@/types/property";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Icon } from "@/components/ui/icons/Icon";
import { PopUpInfo } from "./PopUpInfo";

export interface MapBounds {
  northEast: { lat: number; lng: number };
  southWest: { lat: number; lng: number };
}

export interface MapViewProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
  showPropertyCards?: boolean;
  layout?: "split" | "full";
  onBoundsChange?: (bounds: MapBounds) => void;
}

const DEFAULT_CENTER = { lat: 43.6532, lng: -79.3832 };
const DEFAULT_BOUNDS_PADDING = 0.0125;
const DEFAULT_ZOOM = 12;

const libraries: ("places" | "marker")[] = ["places", "marker"];

const priceFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

const formatPrice = (price?: number) => {
  if (typeof price !== "number") return "N/A";
  return priceFormatter.format(price);
};

const formatAddress = (property: Property) => {
  const street = property.address?.street || 
                 property.address?.unparsedAddress || 
                 'Address not available';
  const cityLine = [
    property.address?.city, 
    property.address?.province, 
    property.address?.postalCode
  ]
    .filter(Boolean)
    .join(", ");
  return { street, cityLine };
};

const computeDaysOnMarket = (property: Property) => {
  if (typeof property.daysOnMarket === "number") {
    return property.daysOnMarket;
  }

  const listedAt = property.listedAt instanceof Date ? property.listedAt : new Date(property.listedAt);
  if (Number.isNaN(listedAt.valueOf())) {
    return undefined;
  }

  const diffMs = Date.now() - listedAt.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
};

export default function MapView({
  properties,
  onPropertySelect,
  showPropertyCards = true,
  layout = "split",
  onBoundsChange,
}: MapViewProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const infoWindowsRef = useRef<Map<string, google.maps.InfoWindow>>(new Map());
  const [markerLibraryLoaded, setMarkerLibraryLoaded] = useState(false);
  const isFittingBoundsRef = useRef(false);
  const boundsChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasFittedInitialBounds = useRef(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const hasApiKey = Boolean(apiKey && apiKey.trim() !== "");
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;
  const hasValidMapId = Boolean(mapId && mapId.trim() !== "" && mapId !== "DEMO_MAP_ID");

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  // Debug logging
  useEffect(() => {
    if (loadError) {
      console.error("Google Maps load error:", loadError);
    }
    if (isLoaded) {
      console.log("Google Maps loaded successfully");
      if (hasValidMapId) {
        console.log("✅ Map ID configured:", mapId);
        console.log("✅ Advanced Markers will be used");
      } else {
        console.warn("⚠️ No valid Map ID found - using regular markers");
        console.log("Map ID value:", mapId || "not set");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, hasValidMapId, mapId]);

  // Load AdvancedMarkerElement library (only if we have a valid Map ID)
  useEffect(() => {
    // Advanced Markers require a valid Map ID, so don't try to load if we don't have one
    if (!hasValidMapId) {
      setMarkerLibraryLoaded(false);
      return;
    }

    if (isLoaded && typeof window !== 'undefined' && window.google?.maps) {
      // Check if marker library is already available
      if (window.google.maps.marker?.AdvancedMarkerElement) {
        setMarkerLibraryLoaded(true);
        return;
      }
      
      // Try to import the marker library dynamically
      if (typeof google.maps.importLibrary === 'function') {
        google.maps.importLibrary("marker")
          .then(() => {
            setMarkerLibraryLoaded(true);
          })
          .catch((err) => {
            console.error("Failed to load marker library:", err);
            // Fallback: try to use the library if it's available anyway
            if (window.google.maps.marker?.AdvancedMarkerElement) {
              setMarkerLibraryLoaded(true);
            }
          });
      } else {
        // Fallback: check if library is available without import
        setTimeout(() => {
          if (window.google.maps.marker?.AdvancedMarkerElement) {
            setMarkerLibraryLoaded(true);
          }
        }, 100);
      }
    }
  }, [isLoaded, hasValidMapId]);

  const propertiesWithCoordinates = useMemo(
    () => {
      const result = properties.map((property, index) => {
        // Validate coordinates - must be an object with valid lat/lng numbers
        if (property.coordinates && 
            typeof property.coordinates === 'object' &&
            typeof property.coordinates.lat === 'number' && 
            !isNaN(property.coordinates.lat) &&
            typeof property.coordinates.lng === 'number' && 
            !isNaN(property.coordinates.lng) &&
            property.coordinates.lat >= -90 && property.coordinates.lat <= 90 &&
            property.coordinates.lng >= -180 && property.coordinates.lng <= 180) {
          return { property, coordinates: property.coordinates };
        }

        // Fallback: create offset grid for properties without valid coordinates
        const latOffset = ((index % 4) - 1.5) * 0.012;
        const lngOffset = (Math.floor(index / 4) - 1.5) * 0.018;

        return {
          property,
          coordinates: {
            lat: DEFAULT_CENTER.lat + latOffset,
            lng: DEFAULT_CENTER.lng + lngOffset,
          },
        };
      });

      // Debug logging
      if (result.length > 0) {
        const validCoords = result.filter(r => 
          r.coordinates.lat !== DEFAULT_CENTER.lat || 
          r.coordinates.lng !== DEFAULT_CENTER.lng
        );
        const sampleCoords = result.slice(0, 5).map(r => ({ 
          lat: r.coordinates.lat, 
          lng: r.coordinates.lng,
          propertyId: r.property.id || r.property.listingKey || r.property.mlsNumber
        }));
        
        console.log(`[MapView] ${result.length} properties, ${validCoords.length} with non-default coordinates`);
        console.log(`[MapView] Sample coordinates:`, sampleCoords);
        
        // Check if all coordinates have the same latitude (horizontal line issue)
        const uniqueLats = new Set(result.map(r => r.coordinates.lat.toFixed(6)));
        const uniqueLngs = new Set(result.map(r => r.coordinates.lng.toFixed(6)));
        
        console.log(`[MapView] Unique latitudes: ${uniqueLats.size}, Unique longitudes: ${uniqueLngs.size}`);
        
        if (uniqueLats.size === 1 && result.length > 1) {
          console.error(`[MapView] ❌ CRITICAL: All ${result.length} properties have the same latitude: ${result[0].coordinates.lat}`);
          console.error(`[MapView] This will cause markers to appear in a horizontal line!`);
          console.error(`[MapView] Sample property coordinates:`, result.slice(0, 3).map(r => ({
            id: r.property.id || r.property.listingKey,
            lat: r.coordinates.lat,
            lng: r.coordinates.lng,
            rawCoordinates: r.property.coordinates
          })));
        }
        if (uniqueLngs.size === 1 && result.length > 1) {
          console.error(`[MapView] ❌ CRITICAL: All ${result.length} properties have the same longitude: ${result[0].coordinates.lng}`);
          console.error(`[MapView] This will cause markers to appear in a vertical line!`);
        }
        
        // Show coordinate range
        const lats = result.map(r => r.coordinates.lat);
        const lngs = result.map(r => r.coordinates.lng);
        console.log(`[MapView] Latitude range: ${Math.min(...lats).toFixed(6)} to ${Math.max(...lats).toFixed(6)}`);
        console.log(`[MapView] Longitude range: ${Math.min(...lngs).toFixed(6)} to ${Math.max(...lngs).toFixed(6)}`);
      }

      return result;
    },
    [properties]
  );

  // Calculate map center and bounds
  const mapCenter = useMemo(() => {
    if (propertiesWithCoordinates.length === 0) {
      return DEFAULT_CENTER;
    }

    const lats = propertiesWithCoordinates.map((entry) => entry.coordinates.lat);
    const lngs = propertiesWithCoordinates.map((entry) => entry.coordinates.lng);

    return {
      lat: (Math.min(...lats) + Math.max(...lats)) / 2,
      lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
    };
  }, [propertiesWithCoordinates]);

  // Fit bounds to show all properties
  const bounds = useMemo(() => {
    if (!isLoaded || propertiesWithCoordinates.length === 0 || typeof window === 'undefined' || !window.google?.maps) {
      return null;
    }

    const lats = propertiesWithCoordinates.map((entry) => entry.coordinates.lat);
    const lngs = propertiesWithCoordinates.map((entry) => entry.coordinates.lng);

    return new window.google.maps.LatLngBounds(
      { lat: Math.min(...lats), lng: Math.min(...lngs) },
      { lat: Math.max(...lats), lng: Math.max(...lngs) }
    );
  }, [propertiesWithCoordinates, isLoaded]);

  // Handle map bounds changes (debounced to prevent infinite loops)
  const handleBoundsChanged = useCallback(() => {
    // Don't trigger if we're programmatically fitting bounds
    if (isFittingBoundsRef.current || !mapRef.current || !onBoundsChange) return;

    // Clear existing timeout
    if (boundsChangeTimeoutRef.current) {
      clearTimeout(boundsChangeTimeoutRef.current);
    }

    // Debounce bounds changes to prevent excessive API calls
    boundsChangeTimeoutRef.current = setTimeout(() => {
      const mapBounds = mapRef.current?.getBounds();
      if (!mapBounds) return;

      const ne = mapBounds.getNorthEast();
      const sw = mapBounds.getSouthWest();

      const newBounds: MapBounds = {
        northEast: { lat: ne.lat(), lng: ne.lng() },
        southWest: { lat: sw.lat(), lng: sw.lng() },
      };

      setMapBounds(newBounds);
      onBoundsChange(newBounds);
    }, 500); // 500ms debounce
  }, [onBoundsChange]);

  // Fit bounds when properties change (only on initial load or when properties significantly change)
  useEffect(() => {
    if (isLoaded && bounds && mapRef.current && !hasFittedInitialBounds.current) {
      hasFittedInitialBounds.current = true;
      isFittingBoundsRef.current = true;
      mapRef.current.fitBounds(bounds);
      // Reset flag after a short delay to allow fitBounds to complete
      setTimeout(() => {
        isFittingBoundsRef.current = false;
      }, 1000);
    }
  }, [bounds, isLoaded]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (boundsChangeTimeoutRef.current) {
        clearTimeout(boundsChangeTimeoutRef.current);
      }
    };
  }, []);

  // Create and manage markers (AdvancedMarkerElement if available, otherwise fallback to Marker)
  useEffect(() => {
    if (!isLoaded || !mapRef.current || propertiesWithCoordinates.length === 0) {
      return;
    }

    const map = mapRef.current;
    const currentMarkers = markersRef.current;
    const currentInfoWindows = infoWindowsRef.current;

    // Only proceed if AdvancedMarkerElement is available, loaded, AND we have a valid Map ID
    const useAdvancedMarkers = hasValidMapId && markerLibraryLoaded && window.google?.maps?.marker?.AdvancedMarkerElement;

    // Clean up existing markers
    if (useAdvancedMarkers) {
      currentMarkers.forEach((marker) => {
        marker.map = null;
      });
      currentMarkers.clear();
    }

    currentInfoWindows.forEach((infoWindow) => {
      infoWindow.close();
    });
    currentInfoWindows.clear();

    // If AdvancedMarkerElement is not available, use regular Marker components instead
    // (they will be rendered via JSX below)
    if (!useAdvancedMarkers) {
      return;
    }

    // Create new AdvancedMarkerElement markers
    propertiesWithCoordinates.forEach(({ property, coordinates }) => {

      const days = computeDaysOnMarket(property);
      const isNewListing = property.isNewListing ?? (typeof days === "number" ? days <= 7 : false);
      const address = formatAddress(property);

      // Create PinElement for custom styling
      const pinElement = new google.maps.marker.PinElement({
        background: isNewListing ? "#ef4444" : "#2563eb",
        borderColor: "#ffffff",
        glyphColor: "#ffffff",
        scale: 1,
      });

      // Ensure pinElement.element exists before using it
      if (!pinElement.element) {
        console.warn("PinElement.element is not available");
        return;
      }

      // Create AdvancedMarkerElement
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: coordinates,
        title: address.street,
        content: pinElement.element,
      });

      // Create InfoWindow for this marker
      const infoWindow = new google.maps.InfoWindow({
        content: document.createElement("div"), // Will be populated when opened
      });

      // Combined click handler for marker selection and info window
      marker.addListener("click", () => {
        setSelectedId(property.id);
        onPropertySelect?.(property);

        // Close all other info windows
        currentInfoWindows.forEach((iw) => {
          if (iw !== infoWindow) {
            iw.close();
          }
        });

        // Create content for this info window
        const contentDiv = document.createElement("div");
        contentDiv.className = "max-w-[560px]";
        
        // Create popup content structure
        const popupContent = document.createElement("div");
        popupContent.className = "flex w-[560px] gap-6 rounded-2xl border border-slate-200 bg-white pl-4 pr-6 pt-3 pb-3 shadow-lg";
        
        const priceDisplay = formatPrice(property.price);
        const addressText = `${address.street}, ${address.cityLine}`;
        const bedroomsDisplay = property.bedrooms ? `${property.bedrooms} beds` : "—";
        const bathroomsDisplay = property.bathrooms ? `${property.bathrooms} baths` : "—";
        
        popupContent.innerHTML = `
          <div class="flex flex-1 flex-col justify-between py-1">
            <div>
              <p class="text-3xl font-bold text-slate-900">${priceDisplay}</p>
            </div>
            <div class="mt-1">
              <p class="text-base font-medium leading-snug text-slate-700">${addressText}</p>
            </div>
            <div class="mt-4 flex items-center gap-5 text-slate-600">
              <div class="flex items-center gap-2">
                <span class="text-base font-medium text-slate-700">${bedroomsDisplay}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-base font-medium text-slate-700">${bathroomsDisplay}</span>
              </div>
            </div>
          </div>
        `;
        
        contentDiv.appendChild(popupContent);
        infoWindow.setContent(contentDiv);
        infoWindow.open(map, marker);
        currentInfoWindows.set(property.id, infoWindow);
      });

      // Note: AdvancedMarkerElement uses <gmp-pin> custom elements that don't support
      // direct addEventListener calls. We'll handle hover through the marker's event system
      // or rely on click interactions and InfoWindow for user feedback.
      // Hover effects are handled via the useEffect hook that updates marker styles based on hoveredId state.

      currentMarkers.set(property.id, marker);
      currentInfoWindows.set(property.id, infoWindow);
    });

    // Cleanup function
    return () => {
      currentMarkers.forEach((marker) => {
        marker.map = null;
      });
      currentMarkers.clear();
      currentInfoWindows.forEach((infoWindow) => {
        infoWindow.close();
      });
      currentInfoWindows.clear();
    };
  }, [isLoaded, markerLibraryLoaded, propertiesWithCoordinates, onPropertySelect, hasValidMapId]);

  // Update marker visibility based on hover/selection
  useEffect(() => {
    if (!hasValidMapId || !markerLibraryLoaded) return;

    markersRef.current.forEach((marker, propertyId) => {
      const property = properties.find((p) => p.id === propertyId);
      if (!property) return;

      const days = computeDaysOnMarket(property);
      const isNewListing = property.isNewListing ?? (typeof days === "number" ? days <= 7 : false);
      const isHovered = hoveredId === propertyId;
      const isSelected = selectedId === propertyId;

      // Update marker scale on hover
      if (marker.content && marker.content instanceof HTMLElement) {
        const pinElement = marker.content;
        if (isHovered || isSelected) {
          pinElement.style.transform = "scale(1.2)";
        } else {
          pinElement.style.transform = "scale(1)";
        }
      }
    });
  }, [hoveredId, selectedId, properties, markerLibraryLoaded, hasValidMapId]);

  // Notify parent of initial bounds (only once when map first loads with properties)
  const hasNotifiedInitialBounds = useRef(false);
  useEffect(() => {
    if (onBoundsChange && propertiesWithCoordinates.length > 0 && bounds && isLoaded && !hasNotifiedInitialBounds.current) {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      hasNotifiedInitialBounds.current = true;
      onBoundsChange({
        northEast: { lat: ne.lat(), lng: ne.lng() },
        southWest: { lat: sw.lat(), lng: sw.lng() },
      });
    }
  }, [bounds, onBoundsChange, propertiesWithCoordinates.length, isLoaded]);

  const containerClassName =
    layout === "full"
      ? "relative h-screen w-full"
      : "flex flex-col gap-6 lg:flex-row lg:items-stretch";

  const mapSectionClassNameBase =
    "relative bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 shadow-inner overflow-hidden";
  const mapSectionClassName =
    layout === "full"
      ? `${mapSectionClassNameBase} h-full w-full min-h-screen rounded-none`
      : `${mapSectionClassNameBase} flex-1 min-h-[420px] rounded-3xl`;

  return (
    <div
      className={containerClassName}
      role="main"
      aria-label="Property map view"
    >
      {showPropertyCards ? (
        <section className="lg:w-[42%] space-y-4 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto pr-1">
          {properties.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => onPropertySelect?.(property)}
              priority={index === 0}
            />
          ))}
        </section>
      ) : null}

      <section className={mapSectionClassName}>
        {!hasApiKey ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-gray-600 bg-gray-50">
            <Icon name="map" className="h-8 w-8 text-gray-400" />
            <p className="font-medium">Google Maps API key not configured</p>
            <p className="text-sm text-gray-500">Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file</p>
          </div>
        ) : loadError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-gray-600 bg-gray-50">
            <Icon name="map" className="h-8 w-8 text-gray-400" />
            <p className="font-medium">Unable to load map</p>
            <p className="text-sm text-gray-500">{loadError.message || "Please check your internet connection"}</p>
          </div>
        ) : !isLoaded ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-gray-600 bg-gray-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="font-medium">Loading map...</p>
          </div>
        ) : (
          <>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={mapCenter}
              zoom={DEFAULT_ZOOM}
              onLoad={(map) => {
                mapRef.current = map;
                if (bounds && propertiesWithCoordinates.length > 0 && !hasFittedInitialBounds.current) {
                  hasFittedInitialBounds.current = true;
                  isFittingBoundsRef.current = true;
                  map.fitBounds(bounds);
                  setTimeout(() => {
                    isFittingBoundsRef.current = false;
                  }, 1000);
                }
              }}
              onBoundsChanged={handleBoundsChanged}
              onDragEnd={handleBoundsChanged}
              onZoomChanged={handleBoundsChanged}
              options={{
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: true,
                mapTypeControl: false,
                fullscreenControl: true,
                // mapId is required for AdvancedMarkerElement
                // You can create a Map ID in Google Cloud Console: https://console.cloud.google.com/google/maps-apis
                // When mapId is present, styles are controlled via the cloud console, not here
                // Only set mapId if it's valid to avoid errors
                ...(hasValidMapId ? { mapId } : {}),
                // styles removed - when mapId is present, map styles are controlled via the cloud console
                // See: https://developers.google.com/maps/documentation/javascript/styling#cloud_tooling
              }}
            >
              {/* Render markers: Use AdvancedMarkerElement if available and Map ID is valid, otherwise fallback to Marker component */}
              {!hasValidMapId || !markerLibraryLoaded || !window.google?.maps?.marker?.AdvancedMarkerElement ? (
                // Fallback to regular Marker components
                propertiesWithCoordinates.map(({ property, coordinates }) => {
                  const days = computeDaysOnMarket(property);
                  const isNewListing = property.isNewListing ?? (typeof days === "number" ? days <= 7 : false);
                  const address = formatAddress(property);
                  const isSelected = selectedId === property.id;
                  const isHovered = hoveredId === property.id;

                  const markerIcon = typeof window !== 'undefined' && window.google?.maps ? {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: isHovered ? 13 : 11,
                    fillColor: isNewListing ? "#ef4444" : "#2563eb",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                  } : undefined;

                  return (
                    <Marker
                      key={property.id}
                      position={coordinates}
                      icon={markerIcon}
                      title={address.street}
                      onMouseOver={() => setHoveredId(property.id)}
                      onMouseOut={() => setHoveredId(null)}
                      onClick={() => {
                        setSelectedId(property.id);
                        onPropertySelect?.(property);
                      }}
                    />
                  );
                })
              ) : null}
              
              {/* Render InfoWindows for fallback markers */}
              {(!hasValidMapId || !markerLibraryLoaded || !window.google?.maps?.marker?.AdvancedMarkerElement) && 
               propertiesWithCoordinates.map(({ property, coordinates }) => {
                const isSelected = selectedId === property.id;
                const isHovered = hoveredId === property.id;
                const address = formatAddress(property);

                if (!(isSelected || isHovered) || typeof window === 'undefined' || !window.google?.maps) {
                  return null;
                }

                return (
                  <InfoWindow
                    key={`info-${property.id}`}
                    position={coordinates}
                    onCloseClick={() => setSelectedId(null)}
                    options={{
                      pixelOffset: new window.google.maps.Size(0, -10),
                    }}
                  >
                    <div className="max-w-[560px]">
                      <PopUpInfo
                        property={property}
                        address={address}
                        onViewDetails={() => {
                          setSelectedId(property.id);
                          onPropertySelect?.(property);
                        }}
                      />
                    </div>
                  </InfoWindow>
                );
              })}
            </GoogleMap>

            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-xs text-gray-600 z-10">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-3 w-3 rounded-full bg-blue-600" />
                <span>Active listing</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex h-3 w-3 rounded-full bg-red-500" />
                <span>New listing</span>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg px-4 py-2 text-xs text-gray-600 z-10">
              Showing <span className="font-semibold text-gray-900">{propertiesWithCoordinates.length}</span> of {" "}
              <span className="font-semibold text-gray-900">{properties.length}</span> properties
            </div>
          </>
        )}
      </section>
    </div>
  );
}