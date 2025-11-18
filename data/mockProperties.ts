import { Property } from '@/types/property';

export const mockProperties: Property[] = [
  {
    id: '1',
    mlsNumber: 'W1234567',
    price: 750000,
    address: {
      street: '123 Main Street',
      city: 'Toronto',
      province: 'ON',
    },
    location: {
      neighborhood: 'Downtown',
      tagColor: 'yellow',
    },
    propertySubType: 'house',
    bedrooms: {
      above: 3,
      below: 1,
    },
    bathrooms: 2,
    squareFootage: {
      min: 1700,
      max: 1900,
    },
    parking: {
      garage: 2,
      driveway: 2,
    },
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1568605117032-4f78c98968f0?w=800',
      'https://images.unsplash.com/photo-1568605116820-2b84cbbf0ef4?w=800',
    ],
    openHouse: {
      day: 'Sat',
      date: 'Jan 15',
      time: '2:00-4:00 PM',
      display: 'Open House - Sat, Jan 15, 2:00-4:00 PM',
    },
    hasVirtualTour: true,
    listedAt: new Date(),
  },
  {
    id: '2',
    mlsNumber: 'W2345678',
    price: 550000,
    address: {
      street: '456 Queen Street West',
      city: 'Toronto',
      province: 'ON',
    },
    location: {
      neighborhood: 'Queen West',
      tagColor: 'blue',
    },
    propertySubType: 'condo',
    bedrooms: {
      above: 2,
      below: 0,
    },
    bathrooms: 1,
    squareFootage: {
      min: 950,
      max: 950,
    },
    parking: {
      garage: 1,
      driveway: 0,
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    hasVirtualTour: false,
    listedAt: new Date(),
  },
  {
    id: '3',
    mlsNumber: 'W3456789',
    price: 3200,
    address: {
      street: '789 College Street',
      city: 'Toronto',
      province: 'ON',
    },
    location: {
      neighborhood: 'Little Italy',
      tagColor: 'green',
    },
    propertySubType: 'house',
    bedrooms: {
      above: 3,
      below: 0,
    },
    bathrooms: 2,
    squareFootage: {
      min: 1500,
      max: 1700,
    },
    parking: {
      garage: 1,
      driveway: 0,
    },
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1568605117032-4f78c98968f0?w=800',
    ],
    hasVirtualTour: false,
    listedAt: new Date(),
  },
  {
    id: '4',
    mlsNumber: 'W4567890',
    price: 1200000,
    address: {
      street: '321 Bay Street',
      city: 'Toronto',
      province: 'ON',
    },
    location: {
      neighborhood: 'Financial District',
      tagColor: 'purple',
    },
    propertySubType: 'house',
    bedrooms: {
      above: 3,
      below: 1,
    },
    bathrooms: 3,
    squareFootage: {
      min: 2000,
      max: 2400,
    },
    parking: {
      garage: 2,
      driveway: 2,
    },
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1568605117032-4f78c98968f0?w=800',
      'https://images.unsplash.com/photo-1568605116820-2b84cbbf0ef4?w=800',
      'https://images.unsplash.com/photo-1568605117032-4f78c98968f0?w=800',
    ],
    openHouse: {
      day: 'Sat',
      date: 'Jan 20',
      time: '1:00-3:00 PM',
      display: 'Open House - Sat, Jan 20, 1:00-3:00 PM',
    },
    hasVirtualTour: true,
    listedAt: new Date(),
  },
  {
    id: '5',
    mlsNumber: 'W5678901',
    price: 650000,
    address: {
      street: '789 Yonge Street',
      city: 'Toronto',
      province: 'ON',
    },
    location: {
      neighborhood: 'Midtown',
      tagColor: 'orange',
    },
    propertySubType: 'condo',
    bedrooms: {
      above: 1,
      below: 0,
    },
    bathrooms: 1,
    squareFootage: {
      min: 650,
      max: 650,
    },
    parking: {
      garage: 0,
      driveway: 0,
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    ],
    openHouse: {
      day: 'Sun',
      date: 'Jan 18',
      time: '2:00-4:00 PM',
      display: 'Open House - Sun, Jan 18, 2:00-4:00 PM',
    },
    hasVirtualTour: false,
    listedAt: new Date(),
  },
  {
    id: '6',
    mlsNumber: 'W6789012',
    price: 890000,
    address: {
      street: '234 Bloor Street West',
      city: 'Toronto',
      province: 'ON',
    },
    location: {
      neighborhood: 'Annex',
      tagColor: 'pink',
    },
    propertySubType: 'townhouse',
    bedrooms: {
      above: 2,
      below: 1,
    },
    bathrooms: 2,
    squareFootage: {
      min: 1200,
      max: 1400,
    },
    parking: {
      garage: 1,
      driveway: 1,
    },
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1568605117032-4f78c98968f0?w=800',
    ],
    hasVirtualTour: true,
    listedAt: new Date(),
  },
  {
    id: '7',
    mlsNumber: 'W7890123',
    price: 425000,
    address: {
      street: '567 King Street West',
      city: 'Toronto',
      province: 'ON',
    },
    location: {
      neighborhood: 'Entertainment District',
      tagColor: 'red',
    },
    propertySubType: 'condo',
    bedrooms: {
      above: 1,
      below: 0,
    },
    bathrooms: 1,
    squareFootage: {
      min: 550,
      max: 550,
    },
    parking: {
      garage: 0,
      driveway: 0,
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    ],
    hasVirtualTour: false,
    listedAt: new Date(),
  },
  {
    id: '8',
    mlsNumber: 'W8901234',
    price: 1100000,
    address: {
      street: '890 Avenue Road',
      city: 'Toronto',
      province: 'ON',
    },
    location: {
      neighborhood: 'Forest Hill',
      tagColor: 'teal',
    },
    propertySubType: 'house',
    bedrooms: {
      above: 4,
      below: 1,
    },
    bathrooms: 3,
    squareFootage: {
      min: 2500,
      max: 2800,
    },
    parking: {
      garage: 2,
      driveway: 2,
    },
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1568605117032-4f78c98968f0?w=800',
      'https://images.unsplash.com/photo-1568605116820-2b84cbbf0ef4?w=800',
    ],
    hasVirtualTour: true,
    listedAt: new Date(),
  },
  {
    id: '9',
    mlsNumber: 'W9012345',
    price: 725000,
    address: {
      street: '123 Spadina Avenue',
      city: 'Toronto',
      province: 'ON',
    },
    location: {
      neighborhood: 'Chinatown',
      tagColor: 'yellow',
    },
    propertySubType: 'semi-detached',
    bedrooms: {
      above: 3,
      below: 0,
    },
    bathrooms: 2,
    squareFootage: {
      min: 1600,
      max: 1800,
    },
    parking: {
      garage: 1,
      driveway: 1,
    },
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1568605117032-4f78c98968f0?w=800',
    ],
    hasVirtualTour: false,
    listedAt: new Date(),
  },
  {
    id: '10',
    mlsNumber: 'W0123456',
    price: 980000,
    address: {
      street: '456 Danforth Avenue',
      city: 'Toronto',
      province: 'ON',
    },
    location: {
      neighborhood: 'Greektown',
      tagColor: 'blue',
    },
    propertySubType: 'house',
    bedrooms: {
      above: 3,
      below: 1,
    },
    bathrooms: 2,
    squareFootage: {
      min: 1800,
      max: 2000,
    },
    parking: {
      garage: 2,
      driveway: 1,
    },
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1568605117032-4f78c98968f0?w=800',
      'https://images.unsplash.com/photo-1568605116820-2b84cbbf0ef4?w=800',
    ],
    hasVirtualTour: true,
    listedAt: new Date(),
  },
];

