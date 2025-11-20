/**
 * Status Prefix Helper
 * 
 * Centralized helper for generating status-specific prefix text for property timestamps.
 * This is the single source of truth for status→prefix mapping across the entire frontend.
 * 
 * Based on StatusFilters.md reset plan:
 * - For Sale/For Lease → "Listed – <timestamp>"
 * - Sold → "Sold – <timestamp>"
 * - Leased → "Leased – <timestamp>"
 * - Removed sub-statuses → Use actual MLS status as prefix (Terminated, Cancelled, etc.)
 * 
 * @module lib/utils/statusPrefix
 */

import type { Property } from '@/types/property';

/**
 * Get the prefix text for a given status
 * 
 * @param status - MLS status string (e.g., "For Sale", "Sold", "Terminated")
 * @returns Prefix string (e.g., "Listed –", "Sold –", "Terminated –")
 */
export function getStatusPrefix(status: string | null | undefined): string {
  if (!status) return 'Listed –';

  const normalized = status.toLowerCase().trim();

  // For Sale and For Lease statuses
  if (
    normalized === 'for sale' ||
    normalized === 'for lease' ||
    normalized === 'for sub-lease' ||
    normalized === 'sold conditional' ||
    normalized === 'sold conditional escape' ||
    normalized === 'for lease conditional' ||
    normalized === 'for lease conditional escape' ||
    normalized === 'price reduced' ||
    normalized === 'price change' ||
    normalized === 'extension'
  ) {
    return 'Listed –';
  }

  // Sold status
  if (normalized === 'sold') {
    return 'Sold –';
  }

  // Leased status
  if (normalized === 'leased') {
    return 'Leased –';
  }

  // Removed sub-statuses - use the actual MLS status as prefix
  if (
    normalized === 'terminated' ||
    normalized === 'cancelled' ||
    normalized === 'suspended' ||
    normalized === 'unavailable' ||
    normalized === 'expired' ||
    normalized === 'withdrawn'
  ) {
    // Capitalize first letter of each word
    return status
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ') + ' –';
  }

  // Default fallback
  return 'Listed –';
}

/**
 * Get the formatted timestamp display string for a property
 * 
 * Combines status prefix with formatted timestamp according to the reset plan rules.
 * 
 * @param property - Property object with status and timestamp fields
 * @returns Formatted string like "Listed – 10th Jun, 2025" or "Sold – 15th Jun, 2025"
 */
export function getStatusTimestampDisplay(property: Property): string | null {
  const prefix = getStatusPrefix(property.mlsStatus || property.status);
  
  // Determine which timestamp to use based on status
  const normalizedStatus = (property.mlsStatus || property.status || '').toLowerCase().trim();
  
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
    const listedAtValue = property.listedAt;
    const listedAtString = listedAtValue instanceof Date 
      ? listedAtValue.toISOString() 
      : (typeof listedAtValue === 'string' ? listedAtValue : null);
    timestamp = property.originalEntryTimestamp || listedAtString || null;
  }
  // Sold and Leased: use PurchaseContractDate
  else if (normalizedStatus === 'sold' || normalizedStatus === 'leased') {
    timestamp = property.statusDates?.purchaseContractDate || null;
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
    // COALESCE logic: use first available date
    timestamp =
      property.statusDates?.suspendedDate ||
      property.statusDates?.terminatedDate ||
      property.statusDates?.expirationDate ||
      property.statusDates?.withdrawnDate ||
      property.statusDates?.unavailableDate ||
      null;
  }
  // Fallback: use OriginalEntryTimestamp
  else {
    const listedAtValue = property.listedAt;
    const listedAtString = listedAtValue instanceof Date 
      ? listedAtValue.toISOString() 
      : (typeof listedAtValue === 'string' ? listedAtValue : null);
    timestamp = property.originalEntryTimestamp || listedAtString || null;
  }

  if (!timestamp) {
    return null;
  }

  return `${prefix} ${timestamp}`;
}

/**
 * Get the raw timestamp value for a property (for filtering/comparison)
 * 
 * Returns the raw timestamp value based on status, which can be used for
 * date comparisons or filtering logic.
 * 
 * @param property - Property object with status and timestamp fields
 * @returns Raw timestamp string or null
 */
export function getStatusTimestampRaw(property: Property): string | null {
  const normalizedStatus = (property.mlsStatus || property.status || '').toLowerCase().trim();

  // For Sale and For Lease: use OriginalEntryTimestampRaw
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
    return property.originalEntryTimestampRaw || null;
  }
  // Sold and Leased: use PurchaseContractDate (already a date, not timestamptz)
  else if (normalizedStatus === 'sold' || normalizedStatus === 'leased') {
    return property.statusDates?.purchaseContractDate || null;
  }
  // Removed: use COALESCE logic
  else if (
    normalizedStatus === 'terminated' ||
    normalizedStatus === 'cancelled' ||
    normalizedStatus === 'suspended' ||
    normalizedStatus === 'unavailable' ||
    normalizedStatus === 'expired' ||
    normalizedStatus === 'withdrawn'
  ) {
    return (
      property.statusDates?.suspendedDate ||
      property.statusDates?.terminatedDate ||
      property.statusDates?.expirationDate ||
      property.statusDates?.withdrawnDate ||
      property.statusDates?.unavailableDate ||
      null
    );
  }
  // Fallback: use OriginalEntryTimestampRaw
  else {
    return property.originalEntryTimestampRaw || null;
  }
}

