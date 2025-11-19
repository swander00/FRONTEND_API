'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserPreferences } from '@/hooks/useUserPreferences';

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { profile, updateProfile, isUpdating: profileUpdating } = useUserProfile();
  const { preferences, updatePreferences, isUpdating: prefsUpdating } = useUserPreferences();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    firstTimeBuyer: null as boolean | null,
    preApproved: null as boolean | null,
    hasHouseToSell: null as boolean | null,
    purchaseTimeframe: '' as '' | '0-3' | '3-6' | '6-12' | '12+',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  // Initialize form data from existing profile/preferences
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        firstName: profile.FirstName || '',
        lastName: profile.LastName || '',
        phone: profile.Phone || '',
      }));
    }
    if (preferences) {
      setFormData(prev => ({
        ...prev,
        firstTimeBuyer: preferences.FirstTimeBuyer,
        preApproved: preferences.PreApproved,
        hasHouseToSell: preferences.HasHouseToSell,
        purchaseTimeframe: preferences.PurchaseTimeframe || '',
      }));
    }
  }, [profile, preferences]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    // Step 2 is optional, no validation needed
    return true;
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!validateStep1()) return;

      try {
        await updateProfile({
          FirstName: formData.firstName,
          LastName: formData.lastName || null,
          Phone: formData.phone,
        });
        setStep(2);
      } catch (err) {
        setErrors({ submit: err instanceof Error ? err.message : 'Failed to save profile' });
      }
    } else if (step === 2) {
      if (!validateStep2()) return;

      try {
        await updatePreferences({
          FirstTimeBuyer: formData.firstTimeBuyer,
          PreApproved: formData.preApproved,
          HasHouseToSell: formData.hasHouseToSell,
          PurchaseTimeframe: formData.purchaseTimeframe || null,
        });
        router.push('/');
      } catch (err) {
        setErrors({ submit: err instanceof Error ? err.message : 'Failed to save preferences' });
      }
    }
  };

  const handleSkip = () => {
    if (step === 1) {
      setStep(2);
    } else {
      router.push('/');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-gray-600 mb-8">Help us personalize your experience</p>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex-1 h-2 rounded ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex-1 h-2 rounded mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Profile</span>
              <span>Preferences</span>
            </div>
          </div>

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {errors.submit}
            </div>
          )}

          {/* Step 1: Profile */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Are you a first-time buyer?
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, firstTimeBuyer: true })}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 ${
                      formData.firstTimeBuyer === true
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, firstTimeBuyer: false })}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 ${
                      formData.firstTimeBuyer === false
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Are you pre-approved for a mortgage?
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, preApproved: true })}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 ${
                      formData.preApproved === true
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, preApproved: false })}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 ${
                      formData.preApproved === false
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do you have a house to sell?
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasHouseToSell: true })}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 ${
                      formData.hasHouseToSell === true
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasHouseToSell: false })}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 ${
                      formData.hasHouseToSell === false
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Timeframe
                </label>
                <select
                  value={formData.purchaseTimeframe}
                  onChange={(e) => setFormData({ ...formData, purchaseTimeframe: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select timeframe</option>
                  <option value="0-3">0-3 months</option>
                  <option value="3-6">3-6 months</option>
                  <option value="6-12">6-12 months</option>
                  <option value="12+">12+ months</option>
                </select>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {step === 1 ? 'Skip' : 'Skip for now'}
            </button>
            <button
              onClick={handleNext}
              disabled={profileUpdating || prefsUpdating}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {profileUpdating || prefsUpdating ? 'Saving...' : step === 1 ? 'Continue' : 'Complete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

