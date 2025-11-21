'use client';

import Image from 'next/image';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { getStatusPrefix } from '@/lib/utils/statusPrefix';

type ListingSuggestion = {
  id: string;
  type: 'listing';
  addressLine: string;
  locationLine?: string;
  price?: number;
  priceFormatted?: string;
  priceChange?: number;
  priceChangeLabel?: string;
  priceChangeColor?: string;
  statusLabel?: string;
  statusVariant?: 'new' | 'conditional' | 'price-change' | 'sold';
  mlsStatus?: string;
  status?: string;
  originalEntryTimestamp?: string;
  statusDates?: {
    purchaseContractDate?: string;
    suspendedDate?: string;
    terminatedDate?: string;
    expirationDate?: string;
    withdrawnDate?: string;
    unavailableDate?: string;
  };
  mlsNumber?: string;
  beds?: number;
  baths?: number;
  additionalBeds?: number;
  sqftRange?: string;
  propertySubType?: string;
  thumbnailUrl?: string;
  isActive?: boolean;
};

type LocationSuggestion = {
  id: string;
  type: 'city' | 'community';
  name: string;
  subtitle?: string;
  badge?: string;
  isActive?: boolean;
};

export type SearchSuggestion = ListingSuggestion | LocationSuggestion;

type SuggestionsCardProps = {
  suggestion: SearchSuggestion;
  onSelect?: (suggestion: SearchSuggestion) => void;
};

const STATUS_STYLES: Record<
  NonNullable<ListingSuggestion['statusVariant']>,
  string
> = {
  new: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
  conditional: 'bg-sky-100 text-sky-700 ring-1 ring-sky-200',
  'price-change': 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
  sold: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
};

const getStatusClasses = (variant?: ListingSuggestion['statusVariant']) => {
  if (!variant) return 'bg-slate-100 text-slate-600 ring-1 ring-slate-200';
  return STATUS_STYLES[variant] ?? 'bg-slate-100 text-slate-600 ring-1 ring-slate-200';
};

const formatBedsLabel = (beds?: number, additionalBeds?: number) => {
  if (!beds) return undefined;
  const additional =
    additionalBeds && additionalBeds > 0 ? `+${additionalBeds}` : undefined;
  return `${beds}${additional ?? ''} ${beds + (additionalBeds ?? 0) === 1 ? 'Bed' : 'Beds'}`;
};

const formatBathsLabel = (baths?: number) => {
  if (!baths) return undefined;
  return `${baths} ${baths === 1 ? 'Bath' : 'Baths'}`;
};

export function SuggestionsCard({ suggestion, onSelect }: SuggestionsCardProps) {
  const handleSelect = () => {
    onSelect?.(suggestion);
  };

  if (suggestion.type !== 'listing') {
    const icon = suggestion.type === 'city' ? '🏙️' : '🏘️';
    return (
      <button
        type="button"
        onClick={handleSelect}
        className={cn(
          'group flex w-full min-w-0 sm:min-w-[380px] items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-left transition hover:border-emerald-200 hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
          suggestion.isActive && 'border-emerald-300 bg-white shadow-md'
        )}
      >
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-lg shadow-sm text-white">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
            {suggestion.name}
          </p>
          {(suggestion.subtitle || suggestion.badge) && (
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              {suggestion.subtitle && <span>{suggestion.subtitle}</span>}
              {suggestion.badge && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-600">
                  {suggestion.badge}
                </span>
              )}
            </div>
          )}
        </div>
        <span className="text-slate-300 transition group-hover:text-emerald-400">
          <svg
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </span>
      </button>
    );
  }

  const listing = suggestion;

  const {
    addressLine,
    locationLine,
    price,
    priceFormatted,
    priceChange,
    priceChangeLabel,
    priceChangeColor,
    statusLabel,
    statusVariant,
    mlsStatus,
    status,
    originalEntryTimestamp,
    statusDates,
    mlsNumber,
    beds,
    baths,
    additionalBeds,
    sqftRange,
    thumbnailUrl,
    isActive,
  } = listing;

  const detailParts = [
    formatBedsLabel(beds, additionalBeds),
    formatBathsLabel(baths),
    sqftRange
  ].filter(Boolean);

  const formattedPrice =
    priceFormatted ??
    (typeof price === 'number' ? formatCurrency(price) : undefined) ??
    '';

  // Get status timestamp display using status prefix helper
  // Determine which timestamp to use based on status
  const normalizedStatus = (mlsStatus || status || '').toLowerCase().trim();
  let timestamp: string | null | undefined = null;

  // For Sale and For Lease: use OriginalEntryTimestamp
  if (
    normalizedStatus === 'for sale' ||
    normalizedStatus === 'for lease' ||
    normalizedStatus === 'for sub-lease' ||
    normalizedStatus === 'sold conditional' ||
    normalizedStatus === 'sold conditional escape' ||
    normalizedStatus === 'for lease conditional' ||
    normalizedStatus === 'for lease conditional escape' ||
    normalizedStatus === 'price reduced' ||
    normalizedStatus === 'price change' ||
    normalizedStatus === 'extension'
  ) {
    timestamp = originalEntryTimestamp || null;
  }
  // Sold and Leased: use PurchaseContractDate
  else if (normalizedStatus === 'sold' || normalizedStatus === 'leased') {
    timestamp = statusDates?.purchaseContractDate || null;
  }
  // Removed: use COALESCE logic (first available from statusDates)
  else if (
    normalizedStatus === 'terminated' ||
    normalizedStatus === 'cancelled' ||
    normalizedStatus === 'suspended' ||
    normalizedStatus === 'unavailable' ||
    normalizedStatus === 'expired' ||
    normalizedStatus === 'withdrawn'
  ) {
    timestamp =
      statusDates?.suspendedDate ||
      statusDates?.terminatedDate ||
      statusDates?.expirationDate ||
      statusDates?.withdrawnDate ||
      statusDates?.unavailableDate ||
      null;
  }
  // Fallback: use OriginalEntryTimestamp
  else {
    timestamp = originalEntryTimestamp || null;
  }

  const statusPrefix = getStatusPrefix(mlsStatus || status);
  const statusTimestampLabel = timestamp ? `${statusPrefix} ${timestamp}` : null;

  const resolvedPriceChangeLabel =
    priceChangeLabel ??
    (typeof priceChange === 'number'
      ? `${priceChange >= 0 ? '▲' : '▼'} ${formatCurrency(Math.abs(priceChange))}`
      : undefined);

  const resolvedPriceChangeClass =
    priceChangeColor ??
    (typeof priceChange === 'number'
      ? priceChange >= 0
        ? 'text-rose-500'
        : 'text-emerald-600'
      : 'text-emerald-600');
  const mlsStatusBadge = statusLabel
    ? {
        label: statusLabel,
        variant: statusVariant,
      }
    : undefined;

  return (
    <button
      type="button"
      onClick={handleSelect}
      className={cn(
        'group flex w-full min-w-0 sm:min-w-[420px] items-stretch gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-1',
        'dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-emerald-500/60 dark:hover:bg-slate-900',
        isActive && 'border-emerald-300 bg-white shadow-md'
      )}
    >
      <div className="relative flex-shrink-0">
        <div className="relative h-28 w-28 overflow-hidden rounded-xl bg-slate-100 shadow-inner ring-1 ring-inset ring-slate-200/60 transition duration-300 group-hover:ring-emerald-200/80 dark:bg-slate-800 dark:ring-slate-700">
          {thumbnailUrl && thumbnailUrl.trim() ? (
            <Image
              src={thumbnailUrl}
              alt={addressLine}
              fill
              sizes="112px"
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-slate-300 dark:text-slate-600">
              🏠
            </div>
          )}
        </div>
        {mlsStatusBadge && (
          <span
            className={cn(
              'absolute left-2.5 top-2.5 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide shadow-sm backdrop-blur-sm',
              getStatusClasses(mlsStatusBadge.variant)
            )}
          >
            {mlsStatusBadge.label}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 py-0.5">
        {(resolvedPriceChangeLabel || locationLine) && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {resolvedPriceChangeLabel && (
              <span
                className={cn(
                  'font-semibold transition group-hover:opacity-80',
                  resolvedPriceChangeClass
                )}
              >
                {resolvedPriceChangeLabel}
              </span>
            )}
            {locationLine && (
              <span className="text-slate-500 dark:text-slate-400">{locationLine}</span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 truncate text-base font-semibold text-slate-900 transition group-hover:text-emerald-700 dark:text-slate-100">
              {addressLine}
            </p>
            <div className="flex min-w-0 flex-col items-end">
              <span className="text-lg font-bold text-emerald-600 transition group-hover:text-emerald-700 dark:text-emerald-400 dark:group-hover:text-emerald-300">
                {formattedPrice}
              </span>
            </div>
          </div>

          {detailParts.length > 0 && (
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {detailParts.join(' • ')}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="truncate uppercase tracking-wide">
            {mlsNumber ?? 'MLS Pending'}
          </span>
          <span className="text-right">{statusTimestampLabel ?? '—'}</span>
        </div>
      </div>
    </button>
  );
}