import { TrendingUp, Eye, Bookmark, MapPin, Share2 } from "lucide-react";
import type { Property } from "@/types/property";
import { PropertyLikeButton, PropertySaveButton, CircularActionButton } from "@/components/shared/buttons";
import { OpenHouseBadge } from "@/components/shared/badges";
import type { PropertyDetailsData } from "../normalizeProperty";
import type { InterestLevel } from "../helpers";
import { getStatusTimestampDisplay } from "@/lib/utils/statusPrefix";

interface PropertyDetailsHeaderProps {
  property: PropertyDetailsData;
  rawProperty: Property;
  interest: InterestLevel;
  statusGradient: string;
  onShare: () => void;
}

export function PropertyDetailsHeader({
  property,
  rawProperty,
  interest,
  statusGradient,
  onShare,
}: PropertyDetailsHeaderProps) {
  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
      <div className="relative w-full rounded-lg overflow-hidden shadow-2xl">
        <div className={`absolute inset-0 bg-gradient-to-r ${statusGradient}`} style={{ animation: "gradient-x 15s ease infinite" }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10"></div>
        <div className="relative p-3 sm:p-4 text-white">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4 mb-3">
            <div className="flex-1 min-w-0 w-full sm:w-auto">
              <h1 className="text-lg sm:text-2xl font-bold truncate mb-2 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent drop-shadow-lg">
                {property.StreetAddress}
              </h1>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-xs sm:text-sm text-white/90 flex items-center gap-1">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {property.City}, {property.StateOrProvince}
                </span>
                {property.Community && (
                  <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-sm rounded text-[10px] sm:text-xs font-medium border border-white/40 shadow-sm">
                    {property.Community}
                  </span>
                )}
                <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-sm rounded text-[10px] sm:text-xs font-semibold border border-white/50 shadow-md">
                  {property.MlsStatus}
                </span>
                <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded text-[10px] sm:text-xs border border-white/30 shadow-sm">
                  {property.PropertyType}
                </span>
                {/* Status timestamp display - matches Property Card format */}
                {getStatusTimestampDisplay(rawProperty) && (
                  <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded text-[10px] sm:text-xs border border-white/30 shadow-sm text-white/90">
                    {getStatusTimestampDisplay(rawProperty)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-left sm:text-right flex-shrink-0 w-full sm:w-auto">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                ${(property.ListPrice || 0).toLocaleString()}
                {(rawProperty.transactionType === 'For Lease' || 
                  rawProperty.status?.toLowerCase().includes('for lease') || 
                  rawProperty.mlsStatus?.toLowerCase().includes('for lease')) && ' /month'}
              </div>
              <div className="text-[10px] sm:text-xs text-white/90 mt-0.5 font-medium">
                Tax: ${(property.PropertyTaxes ?? 0).toLocaleString()} ({property.TaxYear || "N/A"})
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 pt-3 border-t border-white/20">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {(property.OpenHouseDetails || property.OpenHouseDate) && (
                <OpenHouseBadge
                  dateTime={property.OpenHouseDetails || property.OpenHouseDate || ""}
                  size="md"
                  variant="header"
                  className="shadow-md"
                />
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-medium">{property.ViewCount || 0}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-medium">{property.SaveCount || 0}</span>
                </div>
              </div>
              <div
                className={`flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 ${interest.color} rounded-full text-[10px] sm:text-xs font-semibold shadow-lg bg-gradient-to-r whitespace-nowrap`}
              >
                <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>{interest.label}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-end">
              <PropertyLikeButton property={rawProperty} variant="header" size="sm" />
              <PropertySaveButton property={rawProperty} variant="header" size="sm" />
              <CircularActionButton icon={Share2} onClick={onShare} size="sm" visualVariant="header" aria-label="Share property" title="Share" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


