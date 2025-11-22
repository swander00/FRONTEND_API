"use client";

import { Icon } from "@/components/ui/icons/Icon";
import { formatBedroomCount, formatCurrency, formatParkingSpaces, formatSquareFootageRange } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Property } from "@/types/property";
import { getStatusTimestampDisplay } from "@/lib/utils/statusPrefix";
import { getStatusBadgeColor } from "@/lib/constants/statusColors";
import Image from "next/image";
import { KeyboardEvent } from "react";

type IconName = Parameters<typeof Icon>[0]["name"];

interface PopUpInfoProps {
  property: Property;
  address: {
    street: string;
    cityLine: string;
  };
  onViewDetails?: () => void;
}

export function PopUpInfo({ property, address, onViewDetails }: PopUpInfoProps) {
  // Check if property is For Lease
  const isForLease = 
    property.transactionType === 'For Lease' || 
    property.status?.toLowerCase().includes('for lease') || 
    property.mlsStatus?.toLowerCase().includes('for lease');
  
  const basePriceDisplay = formatCurrency(property.price);
  const priceDisplay = isForLease ? `${basePriceDisplay} /month` : basePriceDisplay;
  // Use new status prefix + timestamp display logic
  const listedDisplay = getStatusTimestampDisplay(property);
  const status = property.status ?? property.mlsStatus ?? "For Sale";
  const statusClasses = getStatusClasses(status);
  const primaryImage = property.images[0];
  const bedroomsDisplay = formatBedroomCount(property.bedrooms) ?? "—";
  const parkingDisplay = formatParkingSpaces(property.parking) ?? "—";
  const squareFootageDisplay = formatSquareFootageRange(property.squareFootage);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onViewDetails) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onViewDetails();
    }
  };

  return (
    <div
      role={onViewDetails ? "button" : undefined}
      tabIndex={onViewDetails ? 0 : undefined}
      onClick={onViewDetails}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex w-[560px] gap-6 rounded-2xl border border-slate-200 bg-white pl-4 pr-6 pt-3 pb-3 shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
        onViewDetails ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-xl" : ""
      )}
    >
      {/* Image Section */}
      <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={`${property.address.street} property`}
            fill
            className="object-cover"
            sizes="144px"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium uppercase text-slate-400">
            No Photo
          </div>
        )}
        {/* Status Badge on Image */}
        <span
          className={cn(
            "absolute bottom-2 left-2 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-md",
            statusClasses
          )}
        >
          {status}
        </span>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between py-1">
        {/* Price */}
        <div>
          <p className="text-3xl font-bold text-slate-900">{priceDisplay}</p>
        </div>

        {/* Address */}
        <div className="mt-1">
          <p className="text-base font-medium leading-snug text-slate-700">
            {address.street}, {address.cityLine}
          </p>
        </div>

        {/* Property Features */}
        <div className="mt-4 flex items-center gap-5 text-slate-600">
          <FeatureItem icon="bed" value={bedroomsDisplay} />
          <FeatureItem icon="bath" value={property.bathrooms} />
          <FeatureItem icon="car" value={parkingDisplay} />
          <FeatureItem 
            icon="square" 
            value={squareFootageDisplay ? `${squareFootageDisplay} sqft` : "—"} 
          />
        </div>

        {/* Bottom Info */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            {property.propertySubType}
          </span>
          {listedDisplay && (
            <span className="text-sm font-medium text-slate-500">
              {listedDisplay}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface FeatureItemProps {
  icon: IconName;
  value: string | number;
}

function FeatureItem({ icon, value }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon name={icon} className="h-5 w-5 text-slate-500" />
      <span className="text-base font-medium text-slate-700">{value}</span>
    </div>
  );
}

function getStatusClasses(status: string) {
  // Use centralized status colors for consistency
  return getStatusBadgeColor(status);
}