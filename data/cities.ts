import { CITY_GROUPS } from '@/lib/filters/options';

/**
 * Flattened list of all cities for dropdown selection
 */
export const CITIES = CITY_GROUPS.flatMap(group => group.cities);

/**
 * City groups organized by region
 */
export { CITY_GROUPS };

