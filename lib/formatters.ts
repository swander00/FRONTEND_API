export function formatCurrency(amount: number | string | null | undefined): string {
  // Handle invalid inputs
  if (amount === null || amount === undefined) {
    return 'Price not available';
  }
  
  // Convert string to number if needed
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if it's a valid number
  if (isNaN(numAmount) || !isFinite(numAmount)) {
    return 'Price not available';
  }
  
  if (numAmount < 1000) {
    return `$${numAmount.toLocaleString()}`;
  }
  if (numAmount < 1000000) {
    return `$${(numAmount / 1000).toFixed(0)}K`;
  }
  return `$${(numAmount / 1000000).toFixed(2)}M`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

type Bedrooms = {
  above?: number;
  below?: number;
};

type SquareFootage = {
  min?: number;
  max?: number;
};

type Parking = {
  garage?: number;
  driveway?: number;
};

export function formatBedroomCount(bedrooms?: Bedrooms): string | undefined {
  if (!bedrooms) {
    return undefined;
  }

  const above = typeof bedrooms.above === 'number' ? bedrooms.above : undefined;
  const below = typeof bedrooms.below === 'number' ? bedrooms.below : undefined;

  if (above === undefined && below === undefined) {
    return undefined;
  }

  const safeAbove = above ?? 0;
  const safeBelow = below ?? 0;

  if (safeBelow <= 0) {
    return formatNumber(safeAbove);
  }

  return `${formatNumber(safeAbove)}+${formatNumber(safeBelow)}`;
}

export function formatSquareFootageRange(squareFootage?: SquareFootage): string | undefined {
  if (!squareFootage) {
    return undefined;
  }

  const min = typeof squareFootage.min === 'number' ? squareFootage.min : undefined;
  const max = typeof squareFootage.max === 'number' ? squareFootage.max : undefined;

  if (min === undefined && max === undefined) {
    return undefined;
  }

  if (min !== undefined && max !== undefined) {
    if (min === max) {
      return formatNumber(min);
    }

    return `${formatNumber(min)}–${formatNumber(max)}`;
  }

  if (min !== undefined) {
    return formatNumber(min);
  }

  return formatNumber(max!);
}

export function formatParkingSpaces(parking?: Parking): string | undefined {
  if (!parking) {
    return undefined;
  }

  const garage = typeof parking.garage === 'number' ? parking.garage : undefined;
  const driveway = typeof parking.driveway === 'number' ? parking.driveway : undefined;

  if (garage === undefined && driveway === undefined) {
    return undefined;
  }

  const safeGarage = garage ?? 0;
  const safeDriveway = driveway ?? 0;

  if (safeDriveway <= 0) {
    return formatNumber(safeGarage);
  }

  if (safeGarage <= 0) {
    return formatNumber(safeDriveway);
  }

  return `${formatNumber(safeGarage)}+${formatNumber(safeDriveway)}`;
}

export function formatTimeAgo(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(targetDate.getTime())) {
    return '';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} minute${diffInSeconds !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
}

