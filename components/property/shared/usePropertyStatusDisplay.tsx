import { useMemo } from 'react';
import type { Property } from '@/types/property';
import { formatCurrency } from '@/lib/formatters';

export interface PropertyStatusDisplay {
  // Status flags
  isForSale: boolean;
  isForLease: boolean;
  isSold: boolean;
  isLeased: boolean;
  isRemoved: boolean;
  
  // Price display (can be string or JSX.Element for strike-through)
  priceDisplay: string | JSX.Element;
  
  // Timestamp prefix text (e.g., "Listed – Jan 12, 2025")
  timestampPrefix: string | null;
  
  // Badge text (exact MLS status for removed, formatted for others)
  badgeText: string;
}

/**
 * Shared hook for Property Card and Property Details Modal status-based display logic
 * Implements consistent status detection, price formatting, and timestamp prefix rules
 */
export function usePropertyStatusDisplay(property: Property | undefined): PropertyStatusDisplay {
  return useMemo(() => {
    if (!property) {
      return {
        isForSale: false,
        isForLease: false,
        isSold: false,
        isLeased: false,
        isRemoved: false,
        priceDisplay: formatCurrency(0),
        timestampPrefix: null,
        badgeText: 'Active',
      };
    }

    // Status detection - prioritize actual status over transactionType
    // Check Sold, Leased, and Removed FIRST (before For Sale/For Lease)
    const statusLower = (property.status?.toLowerCase() || property.mlsStatus?.toLowerCase() || '').trim();
    const removedStatuses = ['terminated', 'expired', 'suspended', 'cancelled', 'withdrawn', 'unavailable'];
    
    // Check if status starts with or equals these keywords (handles "Sold", "Sold Conditional", etc.)
    const isSold = statusLower === 'sold' || statusLower.startsWith('sold ');
    const isLeased = statusLower === 'leased' || statusLower.startsWith('leased ');
    const isRemoved = removedStatuses.some(removed => statusLower === removed || statusLower.startsWith(removed + ' '));
    
    // Only check For Sale/For Lease if NOT Sold, Leased, or Removed
    const isForSale = !isSold && !isLeased && !isRemoved && (
      statusLower === 'for sale' || 
      statusLower.startsWith('for sale ') ||
      (property.transactionType === 'For Sale' && !statusLower)
    );
    
    const isForLease = !isSold && !isLeased && !isRemoved && (
      statusLower === 'for lease' || 
      statusLower.startsWith('for lease ') ||
      (property.transactionType === 'For Lease' && !statusLower)
    );

    // Price display logic
    let priceDisplay: string | JSX.Element;
    const listPrice = property.price || 0;
    
    if (isSold || isLeased) {
      // Sold and Leased: Show ListPrice with strike-through and ClosePrice
      priceDisplay = (
        <div className="flex flex-col gap-0.5">
          {listPrice > 0 && (
            <span className="text-gray-400 line-through">
              {formatCurrency(listPrice)}
            </span>
          )}
          {property.closePrice ? (
            <span className="font-bold">
              {formatCurrency(property.closePrice)}
            </span>
          ) : listPrice > 0 ? (
            <span className="font-bold">
              {formatCurrency(listPrice)}
            </span>
          ) : null}
        </div>
      );
    } else if (isRemoved) {
      // Removed: Show ListPrice only (NO strike-through, NO ClosePrice)
      priceDisplay = formatCurrency(listPrice);
    } else if (isForLease) {
      // For Lease: Show ListPrice /month
      priceDisplay = `${formatCurrency(listPrice)} /month`;
    } else {
      // For Sale and others: Show ListPrice (normal)
      priceDisplay = formatCurrency(listPrice);
    }

    // Timestamp prefix logic
    let timestampPrefix: string | null = null;
    
    if (isForSale || isForLease) {
      // For Sale and For Lease: Use originalEntryTimestamp with "Listed –" prefix
      if (property.originalEntryTimestamp) {
        timestampPrefix = `Listed – ${property.originalEntryTimestamp}`;
      } else if (property.listedAt) {
        // Fallback to listedAt if originalEntryTimestamp is not available
        const listedAtStr = typeof property.listedAt === 'string' 
          ? property.listedAt 
          : property.listedAt.toISOString();
        timestampPrefix = `Listed – ${listedAtStr}`;
      }
    } else if (isSold) {
      // Sold: Use PurchaseContractDate with "Sold –" prefix
      if (property.statusDates?.purchaseContractDate) {
        timestampPrefix = `Sold – ${property.statusDates.purchaseContractDate}`;
      }
    } else if (isLeased) {
      // Leased: Use PurchaseContractDate with "Leased –" prefix
      if (property.statusDates?.purchaseContractDate) {
        timestampPrefix = `Leased – ${property.statusDates.purchaseContractDate}`;
      }
    } else if (isRemoved) {
      // Removed statuses: Use status-specific prefix matching actual MLS status
      // Timestamp from COALESCE(SuspendedDate, TerminatedDate, ExpirationDate, UnavailableDate)
      const unifiedRemovedTimestamp = 
        property.statusDates?.suspendedDate ||
        property.statusDates?.terminatedDate ||
        property.statusDates?.expirationDate ||
        property.statusDates?.unavailableDate;
      
      if (unifiedRemovedTimestamp) {
        // Get the actual MLS status to use as prefix (capitalize first letter)
        const actualStatus = property.mlsStatus || property.status || 'Removed';
        // Capitalize first letter, keep rest as-is
        const statusPrefix = actualStatus.charAt(0).toUpperCase() + actualStatus.slice(1);
        timestampPrefix = `${statusPrefix} – ${unifiedRemovedTimestamp}`;
      }
    }
    // Note: For other statuses, timestampPrefix remains null (no prefix display)

    // Badge text logic
    let badgeText: string;
    if (isForSale) {
      badgeText = 'For Sale';
    } else if (isForLease) {
      badgeText = 'For Lease';
    } else if (isSold) {
      badgeText = 'Sold';
    } else if (isLeased) {
      badgeText = 'Leased';
    } else if (isRemoved) {
      // Removed: Show exact MLS status (Terminated, Expired, Suspended, etc.)
      badgeText = property.mlsStatus || property.status || 'Removed';
    } else {
      // Other statuses: Use MLS status or fallback
      badgeText = property.mlsStatus || property.status || 'Active';
    }

    return {
      isForSale,
      isForLease,
      isSold,
      isLeased,
      isRemoved,
      priceDisplay,
      timestampPrefix,
      badgeText,
    };
  }, [property]);
}

