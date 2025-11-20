'use client';

import { Search, Filter, Heart, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Search Properties',
    description: 'Browse thousands of properties using our powerful search filters. Find homes that match your criteria.',
    color: 'blue',
  },
  {
    number: '02',
    icon: Filter,
    title: 'Refine Your Search',
    description: 'Use advanced filters to narrow down by price, location, bedrooms, and more. Save your search for later.',
    color: 'green',
  },
  {
    number: '03',
    icon: Heart,
    title: 'Save Favorites',
    description: 'Save properties you love and get instant notifications about price changes and new similar listings.',
    color: 'pink',
  },
  {
    number: '04',
    icon: Home,
    title: 'Find Your Home',
    description: 'Schedule viewings, compare properties, and make informed decisions with detailed property information.',
    color: 'indigo',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50/30 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Finding your dream home is simple with our easy-to-use platform
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line (hidden on mobile) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-green-200 via-pink-200 to-indigo-200"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              
              return (
                <div
                  key={index}
                  className={cn(
                    'relative flex flex-col items-center text-center',
                    'lg:flex-row lg:text-left lg:items-start'
                  )}
                >
                  {/* Step Card */}
                  <div className="w-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                    {/* Number Badge */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-2xl font-bold mb-6 lg:mb-4">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className={cn(
                      'inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4',
                      step.color === 'blue' && 'bg-blue-100 text-blue-600',
                      step.color === 'green' && 'bg-green-100 text-green-600',
                      step.color === 'pink' && 'bg-pink-100 text-pink-600',
                      step.color === 'indigo' && 'bg-indigo-100 text-indigo-600',
                    )}>
                      <Icon className="w-7 h-7" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow (hidden on mobile) */}
                  {!isLast && (
                    <div className="hidden lg:block absolute top-24 -right-4 z-10">
                      <div className="w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-md">
                        <div className="w-0 h-0 border-l-8 border-l-blue-400 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

