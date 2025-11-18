# PropertyHub's - Real Estate Frontend Template

A modern, high-performance Next.js frontend template for real estate property search and listings.

## Features

- 🏠 Property search with advanced filtering
- 📱 Responsive design
- ⚡ High performance with Next.js 14 App Router
- 🎨 Modern UI with Tailwind CSS
- 📦 Modular, well-organized component structure
- 🔍 Search by MLS, address, city, or community
- 🏷️ Property type tags and filters
- 📊 Results summary with market trends
- 🖼️ Property cards with image carousels
- 🎯 Open house banners
- ⭐ Bookmark and favorite functionality

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with header
│   ├── page.tsx            # Homepage (redirects to search)
│   └── search/
│       └── page.tsx        # Search results page
│
├── components/
│   ├── layout/              # Layout components
│   │   └── Header/          # Header, navbar, tabs
│   │
│   ├── search/              # Search-related components
│   │   ├── SearchBar.tsx
│   │   ├── FilterDropdowns.tsx
│   │   ├── QuickFilters.tsx
│   │   └── ActiveFilters.tsx
│   │
│   ├── results/             # Results display components
│   │   ├── ResultsSummary.tsx
│   │   └── ViewOptions.tsx
│   │
│   ├── property/            # Property-related components
│   │   ├── PropertyCard/    # Property card folder
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyCardImage.tsx
│   │   │   ├── PropertyCardDetails.tsx
│   │   │   └── index.ts
│   │   └── PropertyGrid.tsx
│   │
│   └── ui/                  # Shared UI components
│       ├── badges/          # Badge components
│       ├── banners/         # Banner components
│       ├── buttons/         # Button components
│       ├── inputs/          # Input components
│       ├── icons/           # Icon components
│       └── tags/            # Tag components
│
├── types/                   # TypeScript type definitions
│   ├── property.ts
│   └── search.ts
│
├── lib/                     # Utility functions
│   ├── formatters.ts        # Currency, date formatters
│   └── constants.ts         # App constants
│
└── data/                    # Mock data
    └── mockProperties.ts
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Component Organization

### Shared UI Components (`components/ui/`)

All reusable UI components are organized by category:
- **badges/**: Badge, LocationTag, PropertyTypeBadge
- **banners/**: Banner, AlertBanner, OpenHouseBanner
- **buttons/**: Button, IconButton, VirtualTourButton
- **inputs/**: Input, SearchInput, Dropdown
- **icons/**: Icon component with various icon types
- **tags/**: Tag, FilterTag, PropertyTag

### Feature Components

- **layout/**: Header, navigation, and layout components
- **search/**: Search bar, filters, and property tags
- **results/**: Results summary and view options
- **property/**: Property cards and grids

## Adding Real Data

When ready to connect real data:

1. Update `types/property.ts` to match your data structure
2. Replace `data/mockProperties.ts` with API calls
3. Update `app/search/page.tsx` to fetch from your API
4. Configure API endpoints in `lib/` or create an `api/` folder

## Customization

- **Colors**: Update `tailwind.config.ts` for theme colors
- **Constants**: Modify `lib/constants.ts` for filter options
- **Styling**: All components use Tailwind CSS classes

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **React 18** - UI library

## License

This is a template project. Customize as needed for your use case.

