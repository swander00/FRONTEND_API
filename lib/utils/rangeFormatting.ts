/**
 * Range Formatting Utilities
 * 
 * Pure functions for formatting range values with units and labels
 */

type RangeConfig = {
  label: string;
  unit?: string;
  unitPlacement?: 'prefix' | 'suffix';
};

/**
 * Format a single value with unit (e.g., "$1,500" or "2,000 sq ft")
 */
export function formatRangeValue(
  value: number,
  config: { unit?: string; unitPlacement?: 'prefix' | 'suffix' }
): string {
  // Handle non-finite numbers
  if (!Number.isFinite(value)) {
    return '--';
  }

  const formatted = value.toLocaleString();

  if (!config.unit) {
    return formatted;
  }

  return config.unitPlacement === 'prefix'
    ? `${config.unit}${formatted}`
    : `${formatted} ${config.unit}`;
}

/**
 * Format a range as "min – max" (e.g., "$1,000 – $5,000")
 */
export function formatRangeSummary(
  minValue: number,
  maxValue: number,
  config: { unit?: string; unitPlacement?: 'prefix' | 'suffix' }
): string {
  const minFormatted = formatRangeValue(minValue, config);
  const maxFormatted = formatRangeValue(maxValue, config);
  return `${minFormatted} – ${maxFormatted}`;
}

/**
 * Format a range label with current values
 * e.g., "Square Footage: 1,000 – 5,000 sq ft"
 */
export function formatRangeLabel(
  minValue: number,
  maxValue: number,
  config: RangeConfig
): string {
  const range = formatRangeSummary(minValue, maxValue, config);
  return `${config.label}: ${range}`;
}

/**
 * Get compact value for display (e.g., "1.5K" instead of "1,500")
 */
export function formatCompactValue(value: number): string {
  if (!Number.isFinite(value)) {
    return '--';
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  
  return value.toString();
}

/**
 * Format a range for display in a button or chip
 * Uses compact notation for large numbers
 */
export function formatRangeButtonLabel(
  minValue: number,
  maxValue: number,
  bounds: { min: number; max: number }
): string {
  // If at default, show label only
  if (minValue === bounds.min && maxValue === bounds.max) {
    return 'Any';
  }

  // If only min is set
  if (minValue > bounds.min && maxValue === bounds.max) {
    return `${formatCompactValue(minValue)}+`;
  }

  // If only max is set
  if (minValue === bounds.min && maxValue < bounds.max) {
    return `< ${formatCompactValue(maxValue)}`;
  }

  // Both set
  const minCompact = formatCompactValue(minValue);
  const maxCompact = formatCompactValue(maxValue);
  return `${minCompact} – ${maxCompact}`;
}
