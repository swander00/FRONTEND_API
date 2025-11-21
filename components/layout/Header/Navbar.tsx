'use client';

import Link from 'next/link';
import { MainTabs } from './MainTabs';
import { HeaderActions } from './HeaderActions';
import { MobileMenu } from './MobileMenu';

type NavbarProps = {
  activeTab?: 'home' | 'search' | 'home-evaluation';
};

export function Navbar({ activeTab = 'search' }: NavbarProps) {
  return (
    <header className="relative z-[9997] bg-white/95 border-b border-gray-100 shadow-sm backdrop-blur">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        {/* Mobile Layout */}
        <div className="flex items-center justify-between gap-4 py-3 md:hidden">
          <Link
            href="/"
            className="flex items-center gap-3 transition-transform duration-200 hover:scale-[1.01]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {/* Compass/Wander Icon */}
                <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" opacity="0.3" />
                <path
                  d="M12 2 L12 6 M12 18 L12 22 M2 12 L6 12 M18 12 L22 12"
                  stroke="currentColor"
                  strokeLinecap="round"
                />
                <path
                  d="M12 8 L14 12 L12 16 L10 12 Z"
                  fill="currentColor"
                  opacity="0.8"
                />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Wander Property
              </span>
              <span className="text-xs font-medium text-gray-500">
                Find Your Perfect Home
              </span>
            </span>
          </Link>
          <MobileMenu activeTab={activeTab} />
        </div>

        {/* Desktop Layout */}
        <div className="hidden grid-cols-[auto_1fr_auto] items-center gap-6 py-3 md:grid">
          <Link
            href="/"
            className="flex items-center gap-3 transition-transform duration-200 hover:scale-[1.01]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {/* Compass/Wander Icon */}
                <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" opacity="0.3" />
                <path
                  d="M12 2 L12 6 M12 18 L12 22 M2 12 L6 12 M18 12 L22 12"
                  stroke="currentColor"
                  strokeLinecap="round"
                />
                <path
                  d="M12 8 L14 12 L12 16 L10 12 Z"
                  fill="currentColor"
                  opacity="0.8"
                />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Wander Property
              </span>
              <span className="text-xs font-medium text-gray-500">
                Find Your Perfect Home
              </span>
            </span>
          </Link>

          <MainTabs activeTab={activeTab} className="justify-center" />

          <HeaderActions className="justify-end" />
        </div>
      </div>
    </header>
  );
}

