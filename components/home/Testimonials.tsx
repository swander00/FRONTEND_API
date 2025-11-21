'use client';

import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'Toronto, ON',
    image: '👩‍💼',
    rating: 5,
    text: 'PropertyHub made finding our dream home so easy! The search filters are incredible and we found exactly what we were looking for in just a few days.',
  },
  {
    name: 'Michael Chen',
    location: 'Vancouver, BC',
    image: '👨‍💻',
    rating: 5,
    text: 'The map view feature is amazing. Being able to see properties in context of the neighborhood helped us make the perfect choice. Highly recommend!',
  },
  {
    name: 'Emily Rodriguez',
    location: 'Montreal, QC',
    image: '👩‍🎨',
    rating: 5,
    text: 'I love how I can save my favorite properties and get notified about price changes. The platform is intuitive and the property details are comprehensive.',
  },
  {
    name: 'David Thompson',
    location: 'Calgary, AB',
    image: '👨‍🔧',
    rating: 5,
    text: 'As a first-time homebuyer, PropertyHub was incredibly helpful. The detailed property information and easy-to-use interface made the whole process smooth.',
  },
];

export function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied users who found their perfect home
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={cn(
                'relative bg-white rounded-2xl p-8 shadow-lg',
                'hover:shadow-xl transition-all duration-300',
                'transform hover:-translate-y-2 border border-gray-100'
              )}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-16 h-16 text-blue-600" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 text-lg leading-relaxed mb-6 relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.location}
                  </div>
                </div>
              </div>

              {/* Decorative gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-green-400 to-pink-400 rounded-b-2xl"></div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '25K+', label: 'Happy Users' },
            { value: '50K+', label: 'Properties Listed' },
            { value: '4.9/5', label: 'Average Rating' },
            { value: '100+', label: 'Cities Covered' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100"
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


