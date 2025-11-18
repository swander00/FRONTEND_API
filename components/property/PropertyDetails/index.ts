// components/Property/Details/index.ts

import PropertyDetailsModalDesktop from './desktop/PropertyDetailsModalDesktop';

// Main modal components - Unified versions
export { PropertyDetailsModalDesktop };
export { PropertyDetailsModalDesktop as PropertyDetailsModal };
export { default as PropertyDetailsModalMobile } from './mobile/PropertyDetailsModalMobile';

// Section components (used by mobile modal)
export { default as BasementSection } from './sections/BasementSection';
export { default as CondoInfoSection } from './sections/CondoInfoSection';
export { default as FeaturesSection } from './sections/FeaturesSection';
export { default as ListingInformationSection } from './sections/ListingInformationSection';
export { default as ParkingSection } from './sections/ParkingSection';
export { default as PoolWaterfrontSection } from './sections/PoolWaterfrontSection';
export { default as PropertyDetailsSection } from './sections/PropertyDetailsSection';
export { default as UtilitiesSection } from './sections/UtilitiesSection';

// UI components (used by sections)
export { default as CollapsibleSection } from './ui/CollapsibleSection';
export { default as SpecField } from './ui/SpecField';

// Hooks
export { usePropertyDetailsData } from './hooks/usePropertyDetailsData';
