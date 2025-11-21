'use client';

import { useState } from 'react';
import { MapPin, Home, Search } from 'lucide-react';
import { HeroSearchBar } from '@/components/HeroSearchBar';
import { StatusToggle, type StatusValue } from './StatusToggle';

export function Hero() {
  const [status, setStatus] = useState<StatusValue>('For Sale');

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 bg-[url('/images/HomeHeroSection.jpg')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/75 to-indigo-900/80"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="space-y-10">
          {/* Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg mb-8">
              <Home className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold text-white">Canada's #1 Real Estate Platform</span>
            </div>
          </div>

          {/* Main headline */}
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-5">
              Find Your Dream
              <span className="block bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 bg-clip-text text-transparent mt-2">
                Home Today
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Discover thousands of properties across Canada
            </p>
          </div>

          {/* Status Toggle */}
          <div className="mb-6">
            <StatusToggle value={status} onChange={setStatus} />
          </div>

          {/* Search Bar */}
          <div className="mb-10">
            <HeroSearchBar selectedStatus={status} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 max-w-5xl mx-auto">
            {[
              { label: 'Properties', value: '50K+', icon: Home },
              { label: 'Cities', value: '100+', icon: MapPin },
              { label: 'Happy Clients', value: '25K+', icon: Search },
              { label: 'Years Experience', value: '10+', icon: Home },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105"
              >
                <stat.icon className="w-7 h-7 text-yellow-300 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
