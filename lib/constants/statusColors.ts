/**
 * Centralized status color configuration
 * 
 * This file defines the color scheme for all property statuses across the application.
 * All components (badges, buttons, toggles, gradients) should reference these colors
 * to ensure consistency throughout the UI.
 */

export type StatusValue = 'For Sale' | 'For Lease' | 'Sold' | 'Leased' | 'Removed';

export interface StatusColorConfig {
  // Tailwind classes for badges and buttons
  badge: string; // Solid badge background + text color
  button: string; // Button background + text color
  buttonHover: string; // Button hover state
  buttonFocus: string; // Button focus ring color
  
  // Hex colors for dots and other UI elements
  hex: string;
  
  // Gradient classes for property details headers
  gradient: string;
}

/**
 * Standardized status color mappings
 * 
 * Color scheme:
 * - For Sale: Blue (primary action)
 * - For Lease: Purple (secondary action)
 * - Sold: Green (success/completed)
 * - Leased: Orange (completed alternative)
 * - Removed: Gray/Slate (inactive/removed)
 */
export const STATUS_COLORS: Record<StatusValue, StatusColorConfig> = {
  'For Sale': {
    badge: 'bg-blue-600 text-white',
    button: 'bg-blue-500 text-white',
    buttonHover: 'hover:bg-blue-600',
    buttonFocus: 'focus-visible:ring-blue-200',
    hex: '#2563eb',
    gradient: 'from-blue-500 via-blue-600 to-blue-700',
  },
  'For Lease': {
    badge: 'bg-purple-600 text-white',
    button: 'bg-purple-500 text-white',
    buttonHover: 'hover:bg-purple-600',
    buttonFocus: 'focus-visible:ring-purple-200',
    hex: '#7c3aed',
    gradient: 'from-purple-500 via-purple-600 to-purple-700',
  },
  'Sold': {
    badge: 'bg-green-600 text-white',
    button: 'bg-green-500 text-white',
    buttonHover: 'hover:bg-green-600',
    buttonFocus: 'focus-visible:ring-green-200',
    hex: '#16a34a',
    gradient: 'from-green-500 via-green-600 to-green-700',
  },
  'Leased': {
    badge: 'bg-orange-600 text-white',
    button: 'bg-orange-500 text-white',
    buttonHover: 'hover:bg-orange-600',
    buttonFocus: 'focus-visible:ring-orange-200',
    hex: '#ea580c',
    gradient: 'from-orange-500 via-orange-600 to-orange-700',
  },
  'Removed': {
    badge: 'bg-gray-600 text-white',
    button: 'bg-gray-500 text-white',
    buttonHover: 'hover:bg-gray-600',
    buttonFocus: 'focus-visible:ring-gray-300',
    hex: '#4b5563',
    gradient: 'from-gray-600 via-gray-700 to-gray-800',
  },
};

/**
 * Helper function to get status color config by status string
 * Normalizes the status string and returns the appropriate color config
 */
export function getStatusColorConfig(status: string | null | undefined): StatusColorConfig {
  if (!status) {
    return STATUS_COLORS['For Sale']; // Default to For Sale
  }

  const normalized = status.trim();
  
  // Direct match
  if (normalized in STATUS_COLORS) {
    return STATUS_COLORS[normalized as StatusValue];
  }

  // Case-insensitive match
  const lowerNormalized = normalized.toLowerCase();
  for (const [key, value] of Object.entries(STATUS_COLORS)) {
    if (key.toLowerCase() === lowerNormalized) {
      return value;
    }
  }

  // IMPORTANT: Check Removed statuses FIRST before checking for "sale" or "lease"
  // because "Terminated" contains "sale" and would incorrectly match "For Sale"
  if (
    lowerNormalized.includes('remove') || 
    lowerNormalized.includes('expired') ||
    lowerNormalized.includes('terminated') ||
    lowerNormalized.includes('suspended') ||
    lowerNormalized.includes('cancelled') ||
    lowerNormalized.includes('unavailable') ||
    lowerNormalized.includes('withdrawn')
  ) {
    return STATUS_COLORS['Removed'];
  }

  // Partial matches for common variations
  if (lowerNormalized.includes('sale') || lowerNormalized === 'active' || lowerNormalized === 'for sale') {
    return STATUS_COLORS['For Sale'];
  }
  if (lowerNormalized.includes('lease') || lowerNormalized === 'for lease') {
    return STATUS_COLORS['For Lease'];
  }
  if (lowerNormalized.includes('sold')) {
    return STATUS_COLORS['Sold'];
  }
  if (lowerNormalized.includes('lease') && lowerNormalized.includes('d')) {
    return STATUS_COLORS['Leased'];
  }

  // Default fallback
  return STATUS_COLORS['For Sale'];
}

/**
 * Get badge color classes for a given status
 */
export function getStatusBadgeColor(status: string | null | undefined): string {
  return getStatusColorConfig(status).badge;
}

/**
 * Get button color classes for a given status
 */
export function getStatusButtonColor(status: StatusValue): string {
  const config = STATUS_COLORS[status];
  return `${config.button} ${config.buttonHover} ${config.buttonFocus}`;
}

/**
 * Get gradient classes for property details header
 */
export function getStatusGradient(status: string | null | undefined): string {
  return getStatusColorConfig(status).gradient;
}

