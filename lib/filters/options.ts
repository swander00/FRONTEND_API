export const STATUS_OPTIONS = [
  {
    label: 'For Sale',
    value: 'For Sale',
    color: 'bg-blue-500',
    dotColor: '#2563eb',
    buttonClass: 'bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-200',
    buttonHex: '#2563eb',
  },
  {
    label: 'For Lease',
    value: 'For Lease',
    color: 'bg-purple-500',
    dotColor: '#7c3aed',
    buttonClass: 'bg-purple-500 text-white hover:bg-purple-600 focus-visible:ring-purple-200',
    buttonHex: '#7c3aed',
  },
  {
    label: 'Sold',
    value: 'Sold',
    color: 'bg-green-500',
    dotColor: '#16a34a',
    buttonClass: 'bg-green-500 text-white hover:bg-green-600 focus-visible:ring-green-200',
    buttonHex: '#16a34a',
  },
  {
    label: 'Leased',
    value: 'Leased',
    color: 'bg-orange-500',
    dotColor: '#ea580c',
    buttonClass: 'bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-200',
    buttonHex: '#ea580c',
  },
  {
    label: 'Removed',
    value: 'Removed',
    color: 'bg-gray-400',
    dotColor: '#94a3b8',
    buttonClass: 'bg-gray-500 text-white hover:bg-gray-600 focus-visible:ring-gray-300',
    buttonHex: '#64748b',
  },
] as const;

export const TIME_RANGE_OPTIONS = [
  { label: 'All Time', value: 'All Time' },
  { label: 'Today', value: 'Today' },
  { label: 'Last 7 Days', value: 'Last 7 Days' },
  { label: 'Last 14 Days', value: 'Last 14 Days' },
  { label: 'Last 30 Days', value: 'Last 30 Days' },
  { label: 'Last 90 Days', value: 'Last 90 Days' },
  { label: 'Custom Date Range', value: 'Custom Date Range' },
] as const;

export const CITY_GROUPS = [
  { region: 'Toronto', cities: ['Toronto'] },
  { region: 'Peel', cities: ['Mississauga', 'Brampton', 'Caledon'] },
  {
    region: 'York',
    cities: [
      'Vaughan',
      'Markham',
      'Richmond Hill',
      'Aurora',
      'Newmarket',
      'King',
      'East Gwillimbury',
      'Georgina',
      'Whitchurch-Stouffville',
    ],
  },
  { region: 'Halton', cities: ['Oakville', 'Burlington', 'Milton', 'Halton Hills'] },
  {
    region: 'Durham',
    cities: ['Pickering', 'Ajax', 'Whitby', 'Oshawa', 'Clarington', 'Uxbridge', 'Scugog', 'Brock'],
  },
] as const;

export const PROPERTY_TYPE_GROUPS = [
  {
    category: 'Freehold Houses',
    types: ['Detached', 'Semi-Detached', 'Townhouse (Row)', 'Link House', 'Rural/Farm'],
  },
  {
    category: 'Condo Living',
    types: ['Condo Apartment', 'Condo Townhouse', 'Detached Condo', 'Semi-Detached Condo', 'Specialty Condos'],
  },
  {
    category: 'Multi-Unit / Investor',
    types: ['Duplex', 'Triplex', 'Multiplex'],
  },
  {
    category: 'Recreational / Lifestyle',
    types: ['Cottage', 'Mobile/Manufactured Home'],
  },
  {
    category: 'Special Use',
    types: ['Vacant Land', 'Vacant Land Condo', 'Parking/Locker', 'Individual Units', 'Timeshare', 'Other'],
  },
] as const;

export const PRICE_PRESETS = [
  { label: 'Any', min: null, max: null },
  { label: 'Under $500K', min: null, max: 500_000 },
  { label: '$500K – $750K', min: 500_000, max: 750_000 },
  { label: '$750K – $1M', min: 750_000, max: 1_000_000 },
  { label: '$1M – $1.5M', min: 1_000_000, max: 1_500_000 },
  { label: '$1.5M – $2M', min: 1_500_000, max: 2_000_000 },
  { label: '$2M – $3M', min: 2_000_000, max: 3_000_000 },
  { label: 'Over $3M', min: 3_000_000, max: null },
] as const;

export const BED_QUICK_SELECTS = [
  { label: 'Any', min: null, max: null, preset: 'Any' },
  { label: '1+ Bed', min: 1, max: null, preset: '1+' },
  { label: '2+ Beds', min: 2, max: null, preset: '2+' },
  { label: '3+ Beds', min: 3, max: null, preset: '3+' },
  { label: '4+ Beds', min: 4, max: null, preset: '4+' },
] as const;

export const BATH_QUICK_SELECTS = [
  { label: 'Any', min: null, max: null, preset: 'Any' },
  { label: '1+ Bath', min: 1, max: null, preset: '1+' },
  { label: '2+ Baths', min: 2, max: null, preset: '2+' },
  { label: '3+ Baths', min: 3, max: null, preset: '3+' },
  { label: '4+ Baths', min: 4, max: null, preset: '4+' },
] as const;

export const EXACT_BED_OPTIONS = [1, 2, 3] as const;
export const EXACT_BATH_OPTIONS = [1, 2, 3] as const;

export const SQUARE_FOOTAGE_OPTIONS = [
  'Any Size',
  'Up to 500 sq.ft.',
  '500 – 1,000 sq.ft.',
  '1,000 – 1,500 sq.ft.',
  '1,500 – 2,000 sq.ft.',
  '2,000 – 3,000 sq.ft.',
  '3,000+ sq.ft.',
] as const;

export const SQUARE_FOOTAGE_RANGE = { min: 0, max: 10_000 };

export const HOUSE_STYLE_OPTIONS = [
  'Any Style',
  'Bungalow',
  '1 1/2 Storey',
  '2-Storey',
  '3-Storey',
  'Backsplit',
  'Sidesplit',
  'Loft',
] as const;

export const LOT_FRONTAGE_OPTIONS = ['Any', '20ft+', '30ft+', '40ft+', '50ft+', '60ft+', '80ft+'] as const;
export const LOT_DEPTH_OPTIONS = ['Any', '60ft+', '80ft+', '100ft+', '120ft+', '150ft+'] as const;

export const MAINTENANCE_FEE_RANGE = { min: 0, max: 2_000 };
export const PROPERTY_TAX_RANGE = { min: 0, max: 20_000 };
export const DAYS_ON_MARKET_RANGE = { min: 0, max: 365 };

export const GARAGE_PARKING_RANGE = { min: 0, max: 6 };
export const TOTAL_PARKING_RANGE = { min: 0, max: 100 };

export const BASEMENT_FEATURE_OPTIONS = [
  'Apartment',
  'Finished',
  'Walk-Out',
  'Kitchen: Yes',
  'Kitchen: No',
  'Separate Entrance',
  'None',
] as const;

export const PROPERTY_AGE_OPTIONS = [
  'New',
  '0-5',
  '6-10',
  '6-15',
  '11-15',
  '16-30',
  '31-50',
  '51-99',
  '100+',
] as const;

export const YES_NO_OPTIONS = ['Any', 'Yes', 'No'] as const;

export const OPEN_HOUSE_OPTIONS = [
  'All',
  'Today',
  'Tomorrow',
  'Weekend',
] as const;

export const PROPERTY_CLASS_OPTIONS = [
  { label: 'Freehold only', value: 'Freehold only' },
  { label: 'Condo only', value: 'Condo only' },
] as const;


