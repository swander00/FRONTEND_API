'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AnimatedHouse } from './AnimatedHouse';

const services = [
  {
    id: 1,
    title: 'Buy A New Home',
    description: 'Discover your dream home effortlessly. Explore diverse properties and expert guidance for a seamless buying experience.',
    variant: 'buy' as const,
    gradient: 'from-blue-50 via-blue-100/50 to-white',
    accentColor: 'blue',
  },
  {
    id: 2,
    title: 'Sell A Home',
    description: 'Sell confidently with expert guidance and effective strategies, showcasing your property\'s best features for a successful sale.',
    variant: 'sell' as const,
    gradient: 'from-orange-50 via-amber-100/50 to-white',
    accentColor: 'orange',
  },
  {
    id: 3,
    title: 'Rent A Home',
    description: 'Discover your perfect rental effortlessly. Explore a diverse variety of listings tailored precisely to suit your unique lifestyle needs.',
    variant: 'rent' as const,
    gradient: 'from-yellow-50 via-amber-100/50 to-white',
    accentColor: 'yellow',
  },
];

export function OurServices() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleLearnMore = (serviceId: number) => {
    if (serviceId === 1) {
      router.push('/search');
    } else if (serviceId === 2) {
      router.push('/home-evaluation');
    } else {
      router.push('/search');
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 via-white to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mb-10">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-500 ease-out',
                index === activeIndex
                  ? 'bg-blue-600 w-10 shadow-lg shadow-blue-500/50'
                  : 'bg-white border-2 border-blue-300 w-2 hover:border-blue-500'
              )}
              aria-label={`Go to service ${index + 1}`}
            />
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            <p className="text-sm md:text-base font-semibold text-blue-600 uppercase tracking-widest">
              OUR SERVICES
            </p>
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            What We Do?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto rounded-full" />
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={cn(
                'relative bg-white rounded-3xl shadow-xl hover:shadow-2xl',
                'transition-all duration-500 transform hover:-translate-y-3',
                'border border-gray-200/50 overflow-hidden',
                'group backdrop-blur-sm',
                `bg-gradient-to-br ${service.gradient}`
              )}
              style={{
                animation: 'fadeInUp 0.6s ease-out forwards',
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
              }}
            >

              {/* Animated background gradient on hover */}
              <div className={cn(
                'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                `bg-gradient-to-br ${service.gradient}`
              )} />

              {/* House Illustration Container */}
              <div className="relative flex justify-center pt-16 pb-8 px-8 overflow-visible">
                <div className="relative z-10 group-hover:scale-110 transition-transform duration-500">
                  <AnimatedHouse variant={service.variant} />
                </div>
                {/* Glow effect */}
                <div className={cn(
                  'absolute inset-0 opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500',
                  service.accentColor === 'blue' && 'bg-blue-400',
                  service.accentColor === 'orange' && 'bg-orange-400',
                  service.accentColor === 'yellow' && 'bg-yellow-400',
                )} />
              </div>

              {/* Content */}
              <div className="relative z-10 px-8 pb-10 flex flex-col flex-grow">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center group-hover:text-gray-800 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-center mb-8 flex-grow leading-relaxed text-[15px] md:text-base">
                  {service.description}
                </p>

                {/* Learn More Button */}
                <button
                  onClick={() => handleLearnMore(service.id)}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl',
                    'font-semibold text-sm md:text-base',
                    'transition-all duration-300',
                    'group/btn relative overflow-hidden',
                    service.accentColor === 'blue' && 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40',
                    service.accentColor === 'orange' && 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40',
                    service.accentColor === 'yellow' && 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40',
                    'active:scale-[0.97] transform'
                  )}
                >
                  <span className="relative z-10">Learn More</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                </button>
              </div>

              {/* Corner accent */}
              <div className={cn(
                'absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity duration-500',
                service.accentColor === 'blue' && 'bg-blue-500',
                service.accentColor === 'orange' && 'bg-orange-500',
                service.accentColor === 'yellow' && 'bg-yellow-400',
                'rounded-bl-full'
              )} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

