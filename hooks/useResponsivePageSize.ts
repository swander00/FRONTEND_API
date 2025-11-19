import { useMediaQuery } from './useMediaQuery';

/**
 * Calculates responsive pageSize based on screen breakpoints
 * Matches PropertyGrid column layout (adjusted breakpoints for better content fit):
 * - Mobile (< 640px): 1 column → 5 properties per page
 * - Small (≥ 640px): 2 columns → 10 properties per page
 * - Medium (≥ 768px): 3 columns → 15 properties per page
 * - Large (≥ 1024px): 4 columns → 20 properties per page
 * - XL (≥ 1280px): 5 columns → 25 properties per page (reduced from 1536px)
 */
export function useResponsivePageSize(): number {
  // Check breakpoints from largest to smallest (most specific first)
  // Using xl (1280px) instead of 2xl (1536px) for 5 columns to prevent content jumbling
  const isXL = useMediaQuery('(min-width: 1280px)'); // xl: 5 columns
  const isLG = useMediaQuery('(min-width: 1024px)'); // lg: 4 columns
  const isMD = useMediaQuery('(min-width: 768px)'); // md: 3 columns
  const isSM = useMediaQuery('(min-width: 640px)'); // sm: 2 columns
  // Mobile (< 640px): 1 column

  // Return pageSize based on largest matching breakpoint
  if (isXL) return 25; // 5 columns × 5 rows
  if (isLG) return 20; // 4 columns × 5 rows
  if (isMD) return 15; // 3 columns × 5 rows
  if (isSM) return 10; // 2 columns × 5 rows
  return 5; // 1 column × 5 rows (mobile)
}

