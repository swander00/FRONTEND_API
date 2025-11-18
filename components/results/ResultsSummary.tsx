import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';

type ResultsSummaryProps = {
  total: number;
  averagePrice: number;
  marketTrend: {
    value: number;
    isPositive: boolean;
  };
};

export function ResultsSummary({ total, averagePrice, marketTrend }: ResultsSummaryProps) {
  return (
    <div className="flex w-full flex-col gap-3 text-sm sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
      <div className="flex items-center justify-between gap-2 text-gray-900 sm:flex-col sm:items-start sm:justify-start">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Properties</span>
        <span className="text-lg font-semibold">{total}</span>
      </div>
      <div className="flex items-center justify-between gap-2 text-gray-700 sm:flex-col sm:items-start sm:justify-start">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Average</span>
        <span className="text-lg font-semibold">{formatCurrency(averagePrice)}</span>
      </div>
      <div className="flex items-center justify-between gap-2 text-gray-700 sm:flex-col sm:items-start sm:justify-start">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Market Trend</span>
        <div className="flex items-center gap-1">
          <span
            className={cn(
              'text-base font-semibold',
              marketTrend.isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {marketTrend.isPositive ? '+' : ''}
            {marketTrend.value}%
          </span>
          {marketTrend.isPositive ? (
            <svg
              className="h-4 w-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : (
            <svg
              className="h-4 w-4 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

