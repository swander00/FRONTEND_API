'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { HeaderActions } from './HeaderActions';
import { cn } from '@/lib/utils';

type MobileMenuProps = {
  activeTab?: 'home' | 'search' | 'home-evaluation';
};

export function MobileMenu({ activeTab = 'search' }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure we're mounted before rendering portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('[data-mobile-menu]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const tabs: Array<{ key: typeof activeTab; label: string; href: string }> = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'search', label: 'Search Homes', href: '/search' },
    {
      key: 'home-evaluation',
      label: 'Home Evaluation',
      href: '/home-evaluation',
    },
  ];

  const menuContent = (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        data-mobile-menu
        className={cn(
          'fixed inset-y-0 left-0 z-[9999] w-full max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Close menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <Link
                  key={tab.key}
                  href={tab.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block rounded-lg px-4 py-3 text-base font-medium transition-colors',
                    activeTab === tab.key
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                  )}
                  aria-current={activeTab === tab.key ? 'page' : undefined}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Actions */}
          <div className="border-t border-gray-200 px-4 py-4">
            <div className="w-full">
              <HeaderActions className="w-full justify-center" />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Burger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'group flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300',
          'bg-gradient-to-br from-white to-gray-50',
          'border-2 border-gray-200 shadow-md',
          'hover:border-blue-300 hover:shadow-lg hover:scale-105',
          'active:scale-95',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          isOpen && 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg',
        )}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        data-mobile-menu
      >
        <div className="relative h-6 w-6 flex flex-col justify-center gap-1.5">
          <span
            className={cn(
              'absolute h-[3px] w-full rounded-full transition-all duration-300 ease-out',
              'bg-gray-700 group-hover:bg-blue-600',
              isOpen ? 'top-2.5 rotate-45 bg-blue-600' : 'top-0',
            )}
          />
          <span
            className={cn(
              'absolute top-2.5 h-[3px] w-full rounded-full transition-all duration-300 ease-out',
              'bg-gray-700 group-hover:bg-blue-600',
              isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100',
            )}
          />
          <span
            className={cn(
              'absolute h-[3px] w-full rounded-full transition-all duration-300 ease-out',
              'bg-gray-700 group-hover:bg-blue-600',
              isOpen ? 'top-2.5 -rotate-45 bg-blue-600' : 'top-5',
            )}
          />
        </div>
      </button>

      {/* Render menu in portal to escape stacking context */}
      {mounted && typeof window !== 'undefined' && createPortal(
        menuContent,
        document.body
      )}
    </>
  );
}

