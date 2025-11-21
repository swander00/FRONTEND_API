import { PROPERTY_TYPE_GROUPS } from '@/lib/filters/options';

/**
 * Flattened list of all property types for dropdown selection
 */
export const PROPERTY_TYPES = PROPERTY_TYPE_GROUPS.flatMap(group => group.types);

/**
 * Property type groups organized by category
 */
export { PROPERTY_TYPE_GROUPS };

