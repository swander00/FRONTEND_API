export interface SearchFilters {
  query: string;
  saleType: string;
  timeRange: string;
  city: string;
  propertyType: string;
  priceRange: {
    min: number;
    max: number;
  };
  beds: number;
  baths: number;
  propertyTags: string[];
}

export interface ResultsSummary {
  total: number;
  averagePrice: number;
  marketTrend: {
    value: number;
    isPositive: boolean;
  };
}

