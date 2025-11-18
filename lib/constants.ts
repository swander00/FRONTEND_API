export const PROPERTY_TYPES = [
  'Detached',
  'Semi-Detached',
  'Townhouse',
  'Condo',
  'Duplex',
  '3-Storey',
  'Bungalow',
  '+ Basement Apt',
  'Rental Basement',
  'Swimming Pool',
  'Waterfront',
  'Cottage',
  '3+ Car Garage',
  '50ft+ Lots',
  '2+ Acres',
  'Fixer-Upper',
] as const;

export const SALE_TYPES = ['For Sale', 'For Rent', 'Sold'] as const;

export const TIME_RANGES = ['All Time', '24 Hours', '7 Days', '30 Days'] as const;

export const CITIES = ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'] as const;

export const PRICE_RANGES = [
  { label: 'Any', min: 0, max: Infinity },
  { label: 'Under $500K', min: 0, max: 500000 },
  { label: '$500K - $750K', min: 500000, max: 750000 },
  { label: '$750K - $1M', min: 750000, max: 1000000 },
  { label: '$1M - $1.5M', min: 1000000, max: 1500000 },
  { label: 'Over $1.5M', min: 1500000, max: Infinity },
] as const;

export const BED_OPTIONS = [0, 1, 2, 3, 4, 5, 6] as const;
export const BATH_OPTIONS = [0, 1, 2, 3, 4, 5] as const;

