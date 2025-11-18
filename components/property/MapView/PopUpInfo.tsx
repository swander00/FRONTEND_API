"use client";

import { Icon } from "@/components/ui/icons/Icon";
import { formatBedroomCount, formatCurrency, formatParkingSpaces, formatSquareFootageRange } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Property } from "@/types/property";
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
  const priceDisplay = formatCurrency(property.price);
  const listedDate = toISODate(property.listedAt);
  const status = property.status ?? "For Sale";
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
          {listedDate && (
            <span className="text-sm font-medium text-slate-500">
              {listedDate}
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

function toISODate(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;
  if (!(value instanceof Date) || Number.isNaN(value.valueOf())) {
    return undefined;
  }
  return value.toISOString().slice(0, 10);
}

function getStatusClasses(status: string) {
  const normalized = status.toLowerCase();
  switch (normalized) {
    case "for sale":
      return "bg-green-600 text-white";
    case "sold":
      return "bg-red-600 text-white";
    case "pending":
      return "bg-amber-500 text-white";
    case "coming soon":
      return "bg-blue-600 text-white";
    default:
      return "bg-slate-600 text-white";
  }
}