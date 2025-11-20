'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type HouseVariant = 'buy' | 'sell' | 'rent';

interface AnimatedHouseProps {
  variant: HouseVariant;
  className?: string;
}

const houseConfigs = {
  buy: {
    houseColor: 'from-blue-400 via-blue-500 to-blue-600',
    roofColor: 'from-blue-700 to-blue-800',
    doorColor: 'bg-blue-600',
    windowColor: 'bg-blue-400',
    chimneyColor: 'bg-purple-400',
    accentColor: 'bg-orange-400',
  },
  sell: {
    houseColor: 'from-amber-50 via-amber-100 to-amber-200',
    roofColor: 'from-orange-500 to-orange-600',
    doorColor: 'bg-amber-700',
    windowColor: 'bg-amber-600',
    chimneyColor: 'bg-gray-400',
    accentColor: 'bg-green-600',
  },
  rent: {
    houseColor: 'from-amber-50 via-amber-100 to-amber-100',
    roofColor: 'from-yellow-400 to-yellow-500',
    doorColor: 'bg-blue-500',
    windowColor: 'bg-blue-400',
    chimneyColor: 'bg-red-500',
    accentColor: 'bg-green-500',
  },
};

export function AnimatedHouse({ variant, className }: AnimatedHouseProps) {
  const [isVisible, setIsVisible] = useState(false);
  const config = houseConfigs[variant];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={cn('relative w-56 h-56 flex items-end justify-center', className)}>

      {/* Decorative Elements */}
      <div className="absolute -bottom-2 left-4 w-4 h-4 bg-green-500 rounded-full shadow-lg bounce-gentle" style={{ animationDelay: '0s' }} />
      <div className="absolute -bottom-2 right-4 w-4 h-4 bg-green-500 rounded-full shadow-lg bounce-gentle" style={{ animationDelay: '0.2s' }} />
      {variant === 'buy' && (
        <>
          <div className="absolute -bottom-2 left-12 w-2.5 h-2.5 bg-orange-400 rounded-full shadow-md bounce-gentle" style={{ animationDelay: '0.4s' }} />
          <div className="absolute -bottom-2 right-12 w-2.5 h-2.5 bg-orange-400 rounded-full shadow-md bounce-gentle" style={{ animationDelay: '0.6s' }} />
        </>
      )}
      {variant === 'sell' && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-green-600 rounded-full shadow-md bounce-gentle" style={{ animationDelay: '0.4s' }} />
      )}
      {variant === 'rent' && (
        <>
          <div className="absolute -bottom-2 left-12 w-2.5 h-2.5 bg-green-500 rounded-full shadow-md bounce-gentle" style={{ animationDelay: '0.4s' }} />
          <div className="absolute -bottom-2 right-12 w-2.5 h-2.5 bg-green-500 rounded-full shadow-md bounce-gentle" style={{ animationDelay: '0.6s' }} />
        </>
      )}

      {/* House Container */}
      <div className={cn('relative house-float', isVisible && 'slide-in')}>
        {/* Chimney with smoke effect */}
        <div className="relative">
          <div className={cn(
            'absolute -top-12 left-1/2 transform -translate-x-1/2 w-7 h-12 rounded-t-lg shadow-lg',
            config.chimneyColor,
            'transition-all duration-500'
          )} />
          {/* Smoke particles */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-gray-300/40 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-1.5 h-1.5 bg-gray-300/30 rounded-full animate-pulse absolute -top-2 left-1" style={{ animationDelay: '0.5s' }} />
            <div className="w-1 h-1 bg-gray-300/20 rounded-full animate-pulse absolute -top-4 left-0.5" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        {/* Roof */}
        <div className="relative">
          <svg
            width="140"
            height="50"
            viewBox="0 0 140 50"
            className="house-glow"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
          >
            <defs>
              <linearGradient id={`roof-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={variant === 'buy' ? '#1e40af' : variant === 'sell' ? '#ea580c' : '#eab308'} />
                <stop offset="100%" stopColor={variant === 'buy' ? '#1e3a8a' : variant === 'sell' ? '#c2410c' : '#ca8a04'} />
              </linearGradient>
            </defs>
            <polygon
              points="70,0 0,50 140,50"
              fill={`url(#roof-${variant})`}
              className="transition-all duration-500"
            />
            {/* Roof tiles pattern */}
            <line x1="35" y1="25" x2="105" y2="25" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
            <line x1="17.5" y1="12.5" x2="52.5" y2="37.5" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
            <line x1="87.5" y1="37.5" x2="122.5" y2="12.5" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
          </svg>
        </div>

        {/* House Base */}
        <div className={cn(
          'relative w-44 h-36 rounded-t-xl shadow-xl overflow-hidden',
          `bg-gradient-to-b ${config.houseColor}`,
          'transition-all duration-500'
        )}>
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10" />

          {/* Windows */}
          <div className="absolute top-5 left-5 w-9 h-9 rounded-md border-2 border-white shadow-lg window-shimmer" style={{ animationDelay: '0s' }}>
            <div className={cn('w-full h-full rounded-md', config.windowColor, 'opacity-90')} />
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-md" />
            {/* Window cross */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-white/40" />
              <div className="absolute w-0.5 h-full bg-white/40" />
            </div>
          </div>
          <div className="absolute top-5 right-5 w-9 h-9 rounded-md border-2 border-white shadow-lg window-shimmer" style={{ animationDelay: '0.2s' }}>
            <div className={cn('w-full h-full rounded-md', config.windowColor, 'opacity-90')} />
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-md" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-white/40" />
              <div className="absolute w-0.5 h-full bg-white/40" />
            </div>
          </div>
          <div className="absolute top-20 left-5 w-9 h-9 rounded-md border-2 border-white shadow-lg window-shimmer" style={{ animationDelay: '0.4s' }}>
            <div className={cn('w-full h-full rounded-md', config.windowColor, 'opacity-90')} />
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-md" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-white/40" />
              <div className="absolute w-0.5 h-full bg-white/40" />
            </div>
          </div>
          <div className="absolute top-20 right-5 w-9 h-9 rounded-md border-2 border-white shadow-lg window-shimmer" style={{ animationDelay: '0.6s' }}>
            <div className={cn('w-full h-full rounded-md', config.windowColor, 'opacity-90')} />
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-md" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-white/40" />
              <div className="absolute w-0.5 h-full bg-white/40" />
            </div>
          </div>

          {/* Door */}
          <div className={cn(
            'absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-20 rounded-t-lg shadow-xl',
            config.doorColor,
            'transition-all duration-500 hover:scale-105'
          )}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent rounded-t-lg" />
            {/* Door handle */}
            <div className="absolute top-3 left-1/2 transform translate-x-1 w-2.5 h-2.5 bg-gray-200 rounded-full shadow-md" />
            {/* Door panel lines */}
            <div className="absolute top-4 left-2 right-2 h-0.5 bg-black/10" />
            <div className="absolute top-8 left-2 right-2 h-0.5 bg-black/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

