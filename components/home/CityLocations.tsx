'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { CITY_GROUPS } from '@/lib/filters/options';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

// Get all cities from CITY_GROUPS
const ALL_CITIES = CITY_GROUPS.flatMap(group => group.cities);

// City images mapping - using Unsplash images for Canadian cities
const CITY_IMAGES: Record<string, string> = {
  'Toronto': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&h=600&fit=crop',
  'Mississauga': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
  'Brampton': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop',
  'Caledon': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'Vaughan': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
  'Markham': 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop',
  'Richmond Hill': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop',
  'Aurora': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'Newmarket': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
  'King': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'East Gwillimbury': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop',
  'Georgina': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'Whitchurch-Stouffville': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
  'Oakville': 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop',
  'Burlington': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop',
  'Milton': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'Halton Hills': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
  'Pickering': 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop',
  'Ajax': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop',
  'Whitby': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'Oshawa': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
  'Clarington': 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop',
  'Uxbridge': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'Scugog': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop',
  'Brock': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
};

// Default image if city not found
const DEFAULT_CITY_IMAGE = 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop';

const CARDS_PER_PAGE = 6;
const CARD_WIDTH = 320;
const CARD_GAP = 24;

interface CityCardProps {
  city: string;
  propertyCount: number;
  imageUrl: string;
  onClick: () => void;
}

function CityCard({ city, propertyCount, imageUrl, onClick }: CityCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex-shrink-0 w-[320px] h-[400px] rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      {/* City Image */}
      <div className="relative h-[70%] overflow-hidden">
        <img
          src={imageUrl}
          alt={city}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            // Fallback to default image on error
            (e.target as HTMLImageElement).src = DEFAULT_CITY_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Text Box */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <p className="text-sm text-gray-500 mb-1">{propertyCount.toLocaleString()} Property</p>
            <p className="text-xl font-bold text-gray-900">{city}</p>
          </div>
          <div className="flex-shrink-0 ml-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white group-hover:bg-blue-700 transition-colors">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export function CityLocations() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [propertyCounts, setPropertyCounts] = useState<Record<string, number>>({});
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);

  // Duplicate cities array for seamless infinite loop (3 copies for smooth scrolling)
  const DUPLICATED_CITIES = [...ALL_CITIES, ...ALL_CITIES, ...ALL_CITIES];

  // Fetch property counts for all cities
  useEffect(() => {
    let isMounted = true;

    const fetchCounts = async () => {
      setLoadingCounts(true);
      const counts: Record<string, number> = {};
      
      // Fetch counts for cities in batches to avoid overwhelming the API
      // Reduced batch size and increased delay to prevent 429 errors
      const batchSize = 2;
      for (let i = 0; i < ALL_CITIES.length; i += batchSize) {
        if (!isMounted) break;
        
        const batch = ALL_CITIES.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async (city) => {
            try {
              const response = await api.properties.list(
                { city: [city] },
                { page: 1, pageSize: 1 }
              );
              
              // Extract total count from response
              const total = response.totalCount || 0;
              if (isMounted) {
                counts[city] = total;
              }
            } catch (error: any) {
              // Handle 429 rate limit errors gracefully
              if (error?.status === 429 || error?.message?.includes('429')) {
                console.warn(`Rate limited for ${city}, using default count`);
                if (isMounted) {
                  counts[city] = 0;
                }
                // Wait longer before next request if rate limited
                await new Promise(resolve => setTimeout(resolve, 2000));
              } else {
                console.error(`Error fetching count for ${city}:`, error);
                if (isMounted) {
                  counts[city] = 0;
                }
              }
            }
          })
        );
        
        // Increased delay between batches to avoid rate limiting (500ms instead of 100ms)
        if (i + batchSize < ALL_CITIES.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      if (isMounted) {
        setPropertyCounts(counts);
        setLoadingCounts(false);
      }
    };

    fetchCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (isPaused || isTransitioningRef.current) return;

    const rotate = () => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        // When we reach the end of the first set, jump back seamlessly
        if (next >= ALL_CITIES.length) {
          // Use setTimeout to reset without transition for seamless loop
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition = 'none';
              setCurrentIndex(0);
              // Re-enable transition after reset
              setTimeout(() => {
                if (carouselRef.current) {
                  carouselRef.current.style.transition = 'transform 500ms ease-in-out';
                }
              }, 50);
            }
          }, 500);
          return next;
        }
        return next;
      });
    };

    const interval = setInterval(rotate, 3000); // Rotate every 3 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  // Reset position seamlessly when reaching the end
  useEffect(() => {
    if (carouselRef.current && currentIndex >= ALL_CITIES.length) {
      // Reset to beginning without transition
      carouselRef.current.style.transition = 'none';
      setCurrentIndex(0);
      // Force reflow
      carouselRef.current.offsetHeight;
      // Re-enable transition
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = 'transform 500ms ease-in-out';
        }
      }, 50);
    }
  }, [currentIndex]);

  const handleCityClick = (city: string) => {
    // Navigate to search page with city filter
    const params = new URLSearchParams();
    params.append('city', city);
    router.push(`/search?${params.toString()}`);
  };

  const handlePrev = () => {
    isTransitioningRef.current = true;
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return ALL_CITIES.length - 1; // Loop to end
      }
      return prev - 1;
    });
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 500);
  };

  const handleNext = () => {
    isTransitioningRef.current = true;
    setCurrentIndex((prev) => {
      const next = prev + 1;
      if (next >= ALL_CITIES.length) {
        return 0; // Loop to beginning
      }
      return next;
    });
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 500);
  };

  return (
    <section className="py-20 bg-white">
      {/* Header - Centered */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-[0.3em] mb-2">
            EXPLORE CITIES
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Our Location For You
          </h2>
        </div>
      </div>

      {/* Full Width Rotating Carousel Container */}
      <div 
        className="relative w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Carousel */}
        <div className="overflow-hidden w-full pb-6">
          <div
            ref={carouselRef}
            className="flex gap-6 transition-transform duration-500 ease-in-out px-4 sm:px-6 lg:px-8"
            style={{
              transform: `translateX(-${currentIndex * (CARD_WIDTH + CARD_GAP)}px)`,
            }}
          >
            {DUPLICATED_CITIES.map((city, index) => (
              <CityCard
                key={`${city}-${index}`}
                city={city}
                propertyCount={loadingCounts ? 0 : (propertyCounts[city] ?? 0)}
                imageUrl={CITY_IMAGES[city] || DEFAULT_CITY_IMAGE}
                onClick={() => handleCityClick(city)}
              />
            ))}
          </div>
        </div>

        {/* Navigation Arrows - Always visible for infinite carousel */}
        <button
          onClick={handlePrev}
          className="absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all z-10"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all z-10"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}

