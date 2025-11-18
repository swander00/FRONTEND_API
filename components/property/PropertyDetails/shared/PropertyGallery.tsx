import Image from "next/image";
import { Maximize2, Video } from "lucide-react";
import type { GalleryImage } from "../helpers";

interface PropertyGalleryProps {
  images: GalleryImage[];
  propertyType?: string | null;
  propertyStatus?: string | null;
  virtualTourUrl?: string | null;
  onSelectImage: (index: number) => void;
}

export function PropertyGallery({ images, propertyType, propertyStatus, virtualTourUrl, onSelectImage }: PropertyGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  const visibleThumbnails = images.slice(0, 6);
  const hasMoreImages = images.length > visibleThumbnails.length;

  const handleHeroClick = () => onSelectImage(0);

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-3 sm:pb-4 md:pb-6 border-b border-gray-200/60">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 h-[400px] sm:h-[450px] md:h-[500px]">
        <button
          type="button"
          className="relative rounded-xl overflow-hidden shadow-xl group h-full cursor-pointer"
          onClick={handleHeroClick}
        >
          {images[0]?.url ? (
            <Image
              src={images[0].url}
              alt={images[0]?.alt ?? "Property image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1024px) 50vw, 100vw"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 text-gray-500">
              <span className="text-4xl">🏠</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-2">
            {propertyStatus && (
              <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 backdrop-blur-sm rounded-lg text-white text-xs sm:text-sm font-semibold shadow-lg border border-white/30">
                {propertyStatus}
              </span>
            )}
            {propertyType && (
              <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-gray-800 text-xs sm:text-sm font-medium shadow-md">
                {propertyType}
              </span>
            )}
          </div>
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex flex-col gap-2">
            {virtualTourUrl && (
              <div
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  window.open(virtualTourUrl, "_blank");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    window.open(virtualTourUrl, "_blank");
                  }
                }}
                className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-4 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 border border-white/30 text-xs sm:text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Virtual Tour</span>
              </div>
            )}
            {visibleThumbnails.length > 0 && (
              <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-full">{images.length} photos</span>
            )}
          </div>
        </button>
        <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-2 sm:grid-rows-2 gap-2 sm:gap-3 h-full">
          {visibleThumbnails.map((image, index) => (
            <button
              type="button"
              key={image.id}
              className="relative rounded-lg overflow-hidden shadow-md cursor-pointer group h-full"
              onClick={() => onSelectImage(index)}
            >
              {image.url ? (
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className={`object-cover transition-all duration-300 group-hover:scale-110 ${
                    hasMoreImages && index === visibleThumbnails.length - 1 ? "blur-sm" : ""
                  }`}
                  sizes="150px"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 text-gray-500">
                  <span className="text-2xl">🏠</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200"></div>
              {hasMoreImages && index === visibleThumbnails.length - 1 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                  <Maximize2 className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
                  <span className="text-xl sm:text-2xl font-bold">+{images.length - visibleThumbnails.length}</span>
                  <span className="text-xs sm:text-sm font-medium">More Photos</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


