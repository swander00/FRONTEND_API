import type { Property } from "@/types/property";
import type { PropertyRoomDetails } from "@/hooks/usePropertyRooms";

export const mockProperty: Property = {
  id: "mock-property-001",
  mlsNumber: "MOCK-MLS-123456",
  price: 1250000,
  originalListPrice: 1290000,
  closePrice: 1185000,
  address: {
    street: "1234 Mockingbird Lane",
    streetNumber: "1234",
    streetName: "Mockingbird",
    streetSuffixShort: "Ln",
    city: "Toronto",
    province: "ON",
    postalCode: "M5V 2T6",
  },
  location: {
    neighborhood: "King West",
    tagColor: "#6366f1",
  },
  propertyType: "Detached",
  propertySubType: "Single Family",
  description:
    "Stunning contemporary residence featuring floor-to-ceiling windows, designer finishes, and a fully landscaped backyard oasis perfect for entertaining.",
  bedrooms: {
    above: 3,
    below: 1,
    total: 4,
  },
  bathrooms: 4,
  kitchens: {
    aboveGrade: 1,
    belowGrade: 1,
    total: 2,
  },
  squareFootage: {
    min: 2300,
    max: 2600,
  },
  lotSize: {
    width: 40,
    depth: 110,
    units: "ft",
  },
  parking: {
    garage: 2,
    driveway: 2,
    total: 4,
  },
  basement: "Finished, Separate Entrance, Kitchen",
  basementDetails: {
    status: "Finished",
    entrance: "Separate",
    hasKitchen: true,
    rentalPotential: true,
  },
  age: {
    years: 5,
  },
  utilities: {
    heatType: "Forced Air",
    cooling: "Central Air",
    sewer: "Municipal",
    water: "Municipal",
    fireplace: true,
  },
  association: {
    fee: 685,
    additionalMonthlyFee: 210,
    feeIncludes: "Water, Heat, Building Insurance, Common Elements",
    amenities: "Concierge, Gym, Rooftop Deck/Garden",
  },
  propertyFeatures: ["Family Room", "Smart Home Integration", "Energy Efficient Windows", "Home Office Ready"],
  interiorFeatures: ["Hardwood Floors", "Granite Countertops", "Stainless Steel Appliances", "Walk-In Closet", "Fireplace"],
  exteriorFeatures: ["Swimming Pool", "Patio", "Garden", "Two-Car Garage", "Landscaping", "Deck"],
  poolFeatures: "Inground",
  possession: "30-60 Days/TBA",
  waterfront: {
    waterfrontYN: false,
    waterView: "None",
    features: "None",
  },
  daysOnMarket: 18,
  images: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600607687633-c1c9a4856f89?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600607687920-4e2a3c4a1d75?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600607687922-d49330a1bb59?w=1200&h=800&fit=crop",
  ],
  primaryImageUrl: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&h=800&fit=crop",
  virtualTourUrl: "https://example.com/virtual-tour",
  openHouse: {
    day: "Saturday",
    date: new Date().toISOString(),
    time: "1:00 PM - 4:00 PM",
    display: "Saturday 1-4 PM",
  },
  hasVirtualTour: true,
  listedAt: new Date().toISOString(),
  status: "Active",
  mlsStatus: "Active",
  transactionType: "For Sale",
  modificationTimestamp: new Date().toISOString(),
  taxes: {
    annualAmount: 6789,
    year: 2024,
  },
  stats: {
    views: 87,
    bookmarks: 18,
    favorites: 12,
  },
  balconyType: "Open",
  locker: "Owned",
};

export const mockRooms: PropertyRoomDetails[] = [
  {
    RoomType: "Living Room",
    RoomLevel: "Main",
    RoomDimensions: "18 x 16",
    RoomFeatures: "Hardwood Floor, Large Window, Pot Lights",
  },
  {
    RoomType: "Kitchen",
    RoomLevel: "Main",
    RoomDimensions: "16 x 14",
    RoomFeatures: "Centre Island, Stainless Steel Appl, Quartz Counter",
  },
  {
    RoomType: "Primary Bedroom",
    RoomLevel: "Second",
    RoomDimensions: "20 x 14",
    RoomFeatures: "5 Pc Ensuite, W/I Closet, Balcony",
  },
  {
    RoomType: "Family Room",
    RoomLevel: "Lower",
    RoomDimensions: "19 x 15",
    RoomFeatures: "Gas Fireplace, Above Grade Window, Wet Bar",
  },
];

export const mockAgent = {
  name: "Sarah Johnson",
  title: "Senior Real Estate Agent",
  company: "PropertyHub Realty",
  phone: "(555) 123-4567",
  email: "sarah.johnson@propertyhub.com",
  avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
  rating: 4.9,
  reviewCount: 127,
  specialties: ["Luxury Homes", "Investment Properties", "First-Time Buyers"],
  yearsExperience: 8,
  propertiesSold: 245,
};


