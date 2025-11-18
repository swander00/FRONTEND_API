import { Property } from '@/types/property';
import { LocationTag } from '@/components/ui/badges/LocationTag';
import { formatBedroomCount, formatCurrency, formatParkingSpaces, formatSquareFootageRange } from '@/lib/formatters';
import { useTimeAgo } from '@/hooks/useTimeAgo';

type Props = { property: Property };

export function PropertyCardDetails({ property }: Props) {
  const timeAgoDisplay = useTimeAgo(property.listedAt ?? '');
  const listedDisplay = property.listingAge ?? timeAgoDisplay;

  return (
    <div className="p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
      {/* Top: Price + Neighborhood */}
      <div className="flex items-start justify-between">
        <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">
          {formatCurrency(property.price)}
        </h3>
        {property.location?.neighborhood && (
          <LocationTag
            neighborhood={property.location.neighborhood}
            color={property.location?.tagColor}
          />
        )}
      </div>

      {/* Address (more prominent) */}
      <p className="mt-1 text-base font-semibold text-gray-800">
        {property.address?.street || property.address?.unparsedAddress || 'Address not available'}
        {property.address?.city && property.address?.province && 
          `, ${property.address.city}, ${property.address.province}`
        }
      </p>

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
        <span>{listedDisplay || 'Just listed'}</span>
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
