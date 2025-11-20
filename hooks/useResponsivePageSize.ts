import { useMediaQuery } from './useMediaQuery';

/**
 * Calculates responsive pageSize based on screen breakpoints
 * Matches PropertyGrid column layout (adjusted breakpoints to prevent text overflow/wrapping):
 * - Mobile (< 640px): 1 column → 5 properties per page
 * - Small (≥ 640px): 2 columns → 10 properties per page
 * - Medium (≥ 768px): 3 columns → 15 properties per page
 * - Large (≥ 1024px): 4 columns → 20 properties per page
 * - 2XL (≥ 1536px): 5 columns → 25 properties per page (only when there's enough space to prevent text wrapping)
 */
export function useResponsivePageSize(): number {
  // Check breakpoints from largest to smallest (most specific first)
  // Using 2xl (1536px) for 5 columns to ensure enough space per card and prevent text wrapping
  const is2XL = useMediaQuery('(min-width: 1536px)'); // 2xl: 5 columns
  const isLG = useMediaQuery('(min-width: 1024px)'); // lg: 4 columns
  const isMD = useMediaQuery('(min-width: 768px)'); // md: 3 columns
  const isSM = useMediaQuery('(min-width: 640px)'); // sm: 2 columns
  // Mobile (< 640px): 1 column

  // Return pageSize based on largest matching breakpoint
  if (is2XL) return 25; // 5 columns × 5 rows
  if (isLG) return 20; // 4 columns × 5 rows
  if (isMD) return 15; // 3 columns × 5 rows
  if (isSM) return 10; // 2 columns × 5 rows
  return 5; // 1 column × 5 rows (mobile)
}

