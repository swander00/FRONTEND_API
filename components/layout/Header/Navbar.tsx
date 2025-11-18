import Link from 'next/link';
import { MainTabs } from './MainTabs';
import { HeaderActions } from './HeaderActions';

type NavbarProps = {
  activeTab?: 'search' | 'home-evaluation';
};

export function Navbar({ activeTab = 'search' }: NavbarProps) {
  return (
    <header className="bg-white/95 border-b border-gray-100 shadow-sm backdrop-blur">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-4 py-4 sm:grid-cols-[auto_1fr_auto] sm:gap-6">
          <Link
            href="/"
            className="order-1 flex items-center gap-3 transition-transform duration-200 hover:scale-[1.01]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-semibold text-gray-900">
                PropertyHub&apos;s
              </span>
              <span className="text-xs font-medium text-gray-500">
                Canada&apos;s #1 Real Estate Platform
              </span>
            </span>
          </Link>

          <MainTabs
            activeTab={activeTab}
            className="order-3 justify-start sm:order-2 sm:justify-center"
          />

          <HeaderActions className="order-2 justify-start sm:order-3 sm:justify-end" />
        </div>
      </div>
    </header>
  );
}

