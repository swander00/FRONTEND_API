'use client';

import { useState } from 'react';
import { PropertySpecsModal, UserInformationModal } from '@/components/HomeEvaluation';
import type { PropertySpecsData, UserInformationData } from '@/components/HomeEvaluation';
import { PageContainer } from '@/components/layout';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import { 
  BarChart3, 
  TrendingUp, 
  FileText,
  ArrowRight,
  MapPin,
  Search,
  Calculator,
  Mail,
  Home,
  Building2,
  Key
} from 'lucide-react';

export default function HomeEvaluationPage() {
  const [address, setAddress] = useState('');
  const [showPropertySpecs, setShowPropertySpecs] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [propertyData, setPropertyData] = useState<PropertySpecsData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleStartEvaluation = () => {
    if (address.trim()) {
      setShowPropertySpecs(true);
    }
  };

  const handlePropertySpecsContinue = (data: PropertySpecsData) => {
    setPropertyData(data);
    setShowPropertySpecs(false);
    setShowUserInfo(true);
  };

  const handleUserInfoBack = () => {
    setShowUserInfo(false);
    setShowPropertySpecs(true);
  };

  const handleUserInfoSubmit = async (data: UserInformationData) => {
    // TODO: Submit to API
    console.log('Submitting evaluation:', {
      address,
      propertyData,
      userData: data,
    });
    
    // For now, just show success message
    alert('Thank you! Your home evaluation request has been submitted. We will contact you soon.');
    
    // Reset form
    setAddress('');
    setPropertyData(null);
    setShowUserInfo(false);
  };

  const handleClose = () => {
    setShowPropertySpecs(false);
    setShowUserInfo(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const features = [
    {
      icon: BarChart3,
      title: 'Market Analysis',
      description: 'Comprehensive analysis of market trends and comparable properties',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Property Comparison',
      description: 'Compare your property with similar listings and recent sales',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      icon: Home,
      title: 'Detailed Valuation',
      description: 'Thorough property evaluation based on current market data',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      icon: FileText,
      title: 'Comprehensive Report',
      description: 'Receive a detailed report with property insights and recommendations',
      gradient: 'from-slate-500 to-gray-600'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Enter Address',
      description: 'Start by providing your property address',
      icon: MapPin,
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-cyan-500',
      bgGradientFrom: 'from-blue-100',
      bgGradientTo: 'to-cyan-100',
      textColor: 'text-blue-600'
    },
    {
      number: '02',
      title: 'Property Details',
      description: 'Tell us about your home specifications',
      icon: Search,
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-pink-500',
      bgGradientFrom: 'from-purple-100',
      bgGradientTo: 'to-pink-100',
      textColor: 'text-purple-600'
    },
    {
      number: '03',
      title: 'Get Valuation',
      description: 'Receive your comprehensive evaluation report',
      icon: Calculator,
      gradientFrom: 'from-cyan-500',
      gradientTo: 'to-blue-500',
      bgGradientFrom: 'from-cyan-100',
      bgGradientTo: 'to-blue-100',
      textColor: 'text-cyan-600'
    }
  ];

  return (
    <PageContainer className="overflow-hidden">
      {/* Section 1: Real Estate + Tech Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Background - Real Estate Warmth + Tech Cool */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Base Gradient - Warmer real estate tones with tech accents */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-blue-800"></div>
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] opacity-40"></div>
          
          {/* Subtle Mouse Tracking Light */}
          <div 
            className="absolute inset-0 opacity-20 transition-opacity duration-1000"
            style={{
              background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 50%)`,
            }}
          ></div>
          
          {/* Softer Animated Orbs - Real Estate Colors */}
          <div className="absolute top-20 left-10 w-80 h-80 bg-amber-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
          <div className="absolute top-40 right-10 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-80 h-80 bg-slate-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main Content - Centered Layout */}
        <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
          {/* Top Section - Heading */}
          <div className="text-center mb-12">
            {/* Simple Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-md">
              <Home className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-white/80">Professional Property Valuation</span>
            </div>

            {/* Main Heading - Real Estate Focus */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight">
                <span className="block text-white animate-fade-in">
                  Discover Your Home&apos;s
                </span>
                <span className="block mt-2 bg-gradient-to-r from-amber-400 via-blue-400 to-blue-500 bg-clip-text text-transparent animate-fade-in-delay">
                  Market Value
                </span>
              </h1>
              {/* Simple underline */}
              <div className="mt-4 h-1 w-24 bg-gradient-to-r from-amber-400 to-blue-400 mx-auto rounded-full animate-expand"></div>
            </div>

            {/* Description - Real Estate Focused */}
            <p className="text-xl md:text-2xl text-gray-200 mb-3 max-w-3xl mx-auto leading-relaxed">
              Get a comprehensive property evaluation based on current market data and comparable sales
            </p>
            <p className="text-base text-gray-400 max-w-2xl mx-auto">
              Professional analysis • Market insights • Detailed report
            </p>
          </div>

          {/* Centered Address Input Card - Main Focal Point */}
          <div className="w-full max-w-4xl mx-auto mb-8">
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-gray-200/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="relative">
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-4 text-center flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Property Address <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <Input
                      id="address"
                      type="text"
                      placeholder="Enter your property address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleStartEvaluation();
                        }
                      }}
                      className="pl-12 h-16 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-300 shadow-sm"
                    />
                  </div>
                  <Button
                    onClick={handleStartEvaluation}
                    disabled={!address.trim()}
                    className="px-10 h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Real Estate Benefits - Below Input */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
            <div className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-400/30 mb-3">
                <Building2 className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Market Analysis</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Compare your property with recent sales and market trends
              </p>
            </div>

            <div className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 mb-3">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Detailed Report</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Receive a comprehensive valuation report with property insights
              </p>
            </div>

            <div className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-slate-500/20 to-slate-600/20 border border-slate-400/30 mb-3">
                <Key className="w-5 h-5 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Expert Review</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Our team reviews your submission and provides professional insights
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/50 font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center relative">
              <div className="w-1 h-3 bg-white/40 rounded-full mt-2 animate-scroll"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Features Grid */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-blue-100 to-amber-100">
              <Home className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">Property Valuation Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Our
              <span className="bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent"> Service</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional property evaluation with comprehensive market analysis and detailed insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                  
                  {/* Icon */}
                  <div className={`relative mb-6 inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect Border */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl`}></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-purple-100 to-pink-100">
              <FileText className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your property evaluation in three simple steps
            </p>
          </div>

          <div className="relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-cyan-200 transform -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === steps.length - 1;
                return (
                  <div key={index} className="relative">
                    {/* Step Card */}
                    <div className="relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-transparent transition-all duration-300 hover:shadow-2xl group">
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                      
                      {/* Step Number */}
                      <div className="absolute -top-6 left-8">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                          {step.number}
                        </div>
                      </div>

                      {/* Icon */}
                      <div className={`mb-6 mt-4 inline-flex p-4 rounded-xl bg-gradient-to-br ${step.bgGradientFrom} ${step.bgGradientTo} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${step.textColor}`} />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Arrow (Desktop, not last) */}
                      {!isLast && (
                        <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                          <ArrowRight className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <Mail className="w-5 h-5" />
              <span>Ready to get started?</span>
            </div>
          </div>
        </div>
      </section>

      {/* Property Specs Modal */}
      <PropertySpecsModal
        open={showPropertySpecs}
        onClose={handleClose}
        onContinue={handlePropertySpecsContinue}
        address={address}
      />

      {/* User Information Modal */}
      <UserInformationModal
        open={showUserInfo}
        onClose={handleClose}
        onBack={handleUserInfoBack}
        onSubmit={handleUserInfoSubmit}
        propertyData={propertyData || undefined}
        address={address}
      />

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes expand {
          from {
            width: 0;
          }
          to {
            width: 8rem;
          }
        }
        @keyframes scroll {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(12px);
            opacity: 0.5;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s both;
        }
        .animate-expand {
          animation: expand 1s ease-out 0.5s both;
        }
        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </PageContainer>
  );
}

