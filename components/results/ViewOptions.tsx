import { Dropdown } from '@/components/ui/inputs/Dropdown';
import { cn } from '@/lib/utils';

type ViewOptionsProps = {
  view: 'grid' | 'map';
  onViewChange: (view: 'grid' | 'map') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
};

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Bedrooms: Most', value: 'beds-desc' },
  { label: 'Square Footage: Largest', value: 'sqft-desc' },
];

export function ViewOptions({ view, onViewChange, sortBy, onSortChange }: ViewOptionsProps) {
  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
      <div className="flex w-full items-center overflow-hidden rounded-md border border-gray-300 text-sm shadow-sm sm:w-auto">
        <button
          type="button"
          onClick={() => onViewChange('grid')}
          className={cn(
            'flex-1 px-4 py-2 font-medium transition-colors sm:flex-none',
            view === 'grid'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          )}
          aria-label="Show results in grid view"
          aria-pressed={view === 'grid'}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onViewChange('map')}
          className={cn(
            'flex-1 border-l border-gray-300 px-4 py-2 font-medium transition-colors sm:flex-none',
            view === 'map'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          )}
          aria-label="Show results on map"
          aria-pressed={view === 'map'}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </button>
      </div>
      <Dropdown
        options={sortOptions}
        value={sortBy}
        onChange={onSortChange}
        placeholder="Sort"
        className="w-full sm:w-48"
        icon={
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        }
      />
    </div>
  );
}

