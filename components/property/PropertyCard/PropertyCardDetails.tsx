import { Property } from '@/types/property';
import { LocationTag } from '@/components/ui/badges/LocationTag';
import { formatBedroomCount, formatCurrency, formatParkingSpaces, formatSquareFootageRange } from '@/lib/formatters';
import { useTimeAgo } from '@/hooks/useTimeAgo';

type Props = { property: Property };

export function PropertyCardDetails({ property }: Props) {
  // Calculate time ago from listedAt if available
  const timeAgoDisplay = useTimeAgo(property.listedAt ?? '');
  
  // Use listingAge from API if available, otherwise fall back to calculated timeAgo
  // Only show "Just listed" if both are missing or invalid
  const listedDisplay = property.listingAge || (timeAgoDisplay && timeAgoDisplay.trim() !== '' ? timeAgoDisplay : null);

  return (
    <div className="p-4 md:p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 min-w-0">
      {/* Top: Price + Neighborhood */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight truncate min-w-0 flex-1">
          {formatCurrency(property.price)}
        </h3>
        {property.location?.neighborhood && (
          <LocationTag
            neighborhood={property.location.neighborhood}
            color={property.location?.tagColor}
          />
        )}
      </div>

      {/* Address - Street on first row, City/Province on second row */}
      <div className="mt-1 min-w-0">
        <p className="text-sm md:text-base font-semibold text-gray-800 truncate">
          {property.address?.street || property.address?.unparsedAddress || 'Address not available'}
        </p>
        {(property.address?.city || property.address?.province) && (
          <p className="text-xs md:text-sm text-gray-600 mt-0.5 truncate">
            {[property.address?.city, property.address?.province].filter(Boolean).join(', ')}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="my-3 h-px bg-gray-100" />

      {/* Middle row: Metrics with vertical dividers */}
      <div className="flex items-center text-gray-800">
        <Metric label="Beds" value={formatBedroomCount(property.bedrooms)} />
        <Divider />
        <Metric label="Baths" value={property.bathrooms} />
        <Divider />
        <Metric label="Square Ft" value={formatSquareFootageRange(property.squareFootage)} />
        <Divider />
        <Metric label="Parking" value={formatParkingSpaces(property.parking)} />
      </div>

      {/* Bottom: MLS + time */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>MLS® {property.mlsNumber}</span>
        <span>{listedDisplay || (property.listedAt ? 'Just listed' : '—')}</span>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="mx-3 h-10 w-px bg-gray-200" />;
}

function Metric({ label, value }: { label: string; value?: string | number | null }) {
  const displayValue = value === undefined || value === null || value === '' ? '—' : value;

  return (
    <div className="flex flex-1 min-w-0">
      <div className="flex flex-col gap-0.5 leading-tight">
        <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
        <span className="text-sm font-semibold text-gray-900 truncate">{displayValue}</span>
      </div>
    </div>
  );
}
