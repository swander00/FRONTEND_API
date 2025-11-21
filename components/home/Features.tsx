'use client';

import { Search, Shield, Zap, Heart, Map, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Search,
    title: 'Advanced Search',
    description: 'Filter by location, price, bedrooms, and more. Find exactly what you\'re looking for.',
    color: 'blue',
  },
  {
    icon: Map,
    title: 'Interactive Maps',
    description: 'Explore neighborhoods with our detailed map view. See properties in context.',
    color: 'green',
  },
  {
    icon: Heart,
    title: 'Save Favorites',
    description: 'Save your favorite properties and get notified when prices change.',
    color: 'pink',
  },
  {
    icon: Zap,
    title: 'Instant Updates',
    description: 'Get real-time notifications about new listings and price changes.',
    color: 'yellow',
  },
  {
    icon: Shield,
    title: 'Trusted Platform',
    description: 'Canada\'s most trusted real estate platform with verified listings.',
    color: 'indigo',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Insights',
    description: 'Get intelligent property recommendations based on your preferences.',
    color: 'purple',
  },
];

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600 border-blue-200',
  green: 'bg-green-100 text-green-600 border-green-200',
  pink: 'bg-pink-100 text-pink-600 border-pink-200',
  yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
  indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
  purple: 'bg-purple-100 text-purple-600 border-purple-200',
};

export function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose PropertyHub?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to find your perfect home, all in one place
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={cn(
                  'group relative bg-white rounded-2xl p-8 border-2 border-gray-100',
                  'hover:border-gray-200 hover:shadow-xl transition-all duration-300',
                  'transform hover:-translate-y-2'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6',
                    'border-2 transition-all duration-300',
                    colorClasses[feature.color as keyof typeof colorClasses],
                    'group-hover:scale-110 group-hover:rotate-3'
                  )}
                >
                  <Icon className="w-8 h-8" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


