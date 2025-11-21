'use client';

import { useState, useCallback } from 'react';

export interface AdvancedFiltersState {
  beds: { min: number | null; max: number | null };
  baths: { min: number | null; max: number | null };
  parking: { min: number | null; max: number | null };
  price: { min: number | null; max: number | null };
  basement: string[];
  squareFootage: { min: number | null; max: number | null };
  propertyAge: string | null;
  swimmingPool: boolean | null;
  waterfront: boolean | null;
}

const DEFAULT_STATE: AdvancedFiltersState = {
  beds: { min: null, max: null },
  baths: { min: null, max: null },
  parking: { min: null, max: null },
  price: { min: null, max: null },
  basement: [],
  squareFootage: { min: null, max: null },
  propertyAge: null,
  swimmingPool: null,
  waterfront: null,
};

export function useAdvancedFilters() {
  const [filters, setFilters] = useState<AdvancedFiltersState>(DEFAULT_STATE);

  const updateBeds = useCallback((min: number | null, max: number | null) => {
    setFilters((prev) => ({ ...prev, beds: { min, max } }));
  }, []);

  const updateBaths = useCallback((min: number | null, max: number | null) => {
    setFilters((prev) => ({ ...prev, baths: { min, max } }));
  }, []);

  const updateParking = useCallback((min: number | null, max: number | null) => {
    setFilters((prev) => ({ ...prev, parking: { min, max } }));
  }, []);

  const updatePrice = useCallback((min: number | null, max: number | null) => {
    setFilters((prev) => ({ ...prev, price: { min, max } }));
  }, []);

  const toggleBasement = useCallback((feature: string) => {
    setFilters((prev) => ({
      ...prev,
      basement: prev.basement.includes(feature)
        ? prev.basement.filter((f) => f !== feature)
        : [...prev.basement, feature],
    }));
  }, []);

  const updateSquareFootage = useCallback((min: number | null, max: number | null) => {
    setFilters((prev) => ({ ...prev, squareFootage: { min, max } }));
  }, []);

  const updatePropertyAge = useCallback((age: string | null) => {
    setFilters((prev) => ({ ...prev, propertyAge: age }));
  }, []);

  const updateSwimmingPool = useCallback((value: boolean | null) => {
    setFilters((prev) => ({ ...prev, swimmingPool: value }));
  }, []);

  const updateWaterfront = useCallback((value: boolean | null) => {
    setFilters((prev) => ({ ...prev, waterfront: value }));
  }, []);

  const reset = useCallback(() => {
    setFilters(DEFAULT_STATE);
  }, []);

  return {
    filters,
    updateBeds,
    updateBaths,
    updateParking,
    updatePrice,
    toggleBasement,
    updateSquareFootage,
    updatePropertyAge,
    updateSwimmingPool,
    updateWaterfront,
    reset,
  };
}

