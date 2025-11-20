/**
 * Utility functions for date filtering
 * Converts timeRange options to ISO date strings for backend API
 */

import type { FiltersState } from '@/components/search/FiltersContainer/FiltersContext';

/**
 * Converts a timeRange option to a dateFrom ISO string
 * Returns null for "All Time" (no date filter)
 * @param timeRange - The selected time range option
 * @param timeRangeCustomDate - Custom date string (YYYY-MM-DD) if timeRange is "Custom Date Range"
 * @returns ISO date string (YYYY-MM-DD) or null
 */
export function timeRangeToDateFrom(
  timeRange: FiltersState['timeRange'],
  timeRangeCustomDate: FiltersState['timeRangeCustomDate']
): string | null {
  // "All Time" means no date filter
  if (timeRange === 'All Time') {
    return null;
  }

  // Custom date range
  if (timeRange === 'Custom Date Range' && timeRangeCustomDate) {
    // timeRangeCustomDate is already in YYYY-MM-DD format
    return timeRangeCustomDate;
  }

  // Calculate date based on timeRange option
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let dateFrom: Date;

  switch (timeRange) {
    case 'Today':
      dateFrom = today;
      break;
    case 'Last 7 Days':
      dateFrom = new Date(today);
      dateFrom.setDate(dateFrom.getDate() - 7);
      break;
    case 'Last 14 Days':
      dateFrom = new Date(today);
      dateFrom.setDate(dateFrom.getDate() - 14);
      break;
    case 'Last 30 Days':
      dateFrom = new Date(today);
      dateFrom.setDate(dateFrom.getDate() - 30);
      break;
    case 'Last 90 Days':
      dateFrom = new Date(today);
      dateFrom.setDate(dateFrom.getDate() - 90);
      break;
    default:
      return null;
  }

  // Return ISO date string (YYYY-MM-DD)
  return dateFrom.toISOString().split('T')[0];
}

