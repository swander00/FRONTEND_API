import type { LucideIcon } from "lucide-react";

export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
}

export interface InterestLevel {
  label: string;
  color: string;
}

export interface SpecItem {
  icon: LucideIcon;
  label: string;
  value: string;
  iconColor: string;
  bgColor: string;
  primary?: boolean;
  helperText?: string;
}

export const propertyImages: GalleryImage[] = [
  { id: 1, url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", alt: "Living Room" },
  { id: 2, url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop", alt: "Kitchen" },
  { id: 3, url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&h=600&fit=crop", alt: "Bedroom" },
  { id: 4, url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop", alt: "Bathroom" },
  { id: 5, url: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&h=600&fit=crop", alt: "Exterior" },
  { id: 6, url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop", alt: "Balcony" },
  { id: 7, url: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop", alt: "Dining Room" },
  { id: 8, url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop", alt: "Office" },
];

export const formatTitleCase = (value: string): string =>
  value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

/**
 * Parse formatted date string like "10th Jun, 2025" to Date object
 */
const parseFormattedDate = (dateString: string): Date | null => {
  // Handle formats like "10th Jun, 2025" or "1st Jan, 2024"
  const match = dateString.match(/(\d+)(?:st|nd|rd|th)?\s+(\w+),\s+(\d+)/);
  if (match) {
    const [, day, month, year] = match;
    const monthMap: Record<string, string> = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    const monthNum = monthMap[month];
    if (monthNum) {
      return new Date(`${year}-${monthNum}-${day.padStart(2, '0')}`);
    }
  }
  return null;
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString || dateString.trim() === "") {
    return "N/A";
  }
  try {
    // First try parsing as ISO string or standard date
    let date = new Date(dateString);
    
    // If that fails, try parsing formatted string like "10th Jun, 2025"
    if (isNaN(date.getTime())) {
      const parsed = parseFormattedDate(dateString);
      if (parsed && !isNaN(parsed.getTime())) {
        date = parsed;
      } else {
        return "N/A";
      }
    }
    
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
};

export const getInterestLevel = (views: number, saves: number): InterestLevel => {
  const score = views + saves * 3;
  if (score > 50) {
    return { label: "High Interest", color: "from-red-500 to-pink-600" };
  }
  if (score > 20) {
    return { label: "Moderate Interest", color: "from-orange-500 to-amber-600" };
  }
  return { label: "New Listing", color: "from-blue-500 to-cyan-600" };
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    Active: "from-blue-500 via-purple-500 to-pink-500",
    Pending: "from-amber-500 via-orange-500 to-red-500",
    Sold: "from-slate-600 via-slate-700 to-slate-800",
    Expired: "from-red-500 via-rose-600 to-pink-600",
  };

  return colors[status] ?? "from-slate-600 via-slate-700 to-slate-800";
};


