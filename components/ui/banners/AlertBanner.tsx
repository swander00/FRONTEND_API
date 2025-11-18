import { Banner } from './Banner';

export function AlertBanner() {
  return (
    <Banner variant="alert" className="py-2">
      <div className="w-full px-4 sm:px-6 lg:px-10 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-white sm:text-sm">
        <span className="flex items-center gap-2">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l2 2m6-2a8 8 0 11-16 0 8 8 0 0116 0z"
            />
          </svg>
          New listings updated daily
        </span>
        <span className="hidden text-white/60 sm:inline">•</span>
        <span className="flex items-center gap-2">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 17h5l-1.405-4.215A2 2 0 0016.683 11H7.317a2 2 0 00-1.912 1.285L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          Get instant property alerts
        </span>
        <span className="hidden text-white/60 sm:inline">•</span>
        <span className="flex items-center gap-2">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11 12h2m-2 4h2m-2-8h2m-4 8h.01M15 8h.01M15 12h.01M15 16h.01M7 8h.01M7 12h.01M7 16h.01M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"
            />
          </svg>
          Free market reports
        </span>
      </div>
    </Banner>
  );
}

