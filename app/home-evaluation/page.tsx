'use client';

import { useState } from 'react';
import { PropertySpecsModal, UserInformationModal } from '@/components/HomeEvaluation';
import type { PropertySpecsData, UserInformationData } from '@/components/HomeEvaluation';
import { PageContainer } from '@/components/layout';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';

export default function HomeEvaluationPage() {
  const [address, setAddress] = useState('');
  const [showPropertySpecs, setShowPropertySpecs] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [propertyData, setPropertyData] = useState<PropertySpecsData | null>(null);

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

  return (
    <PageContainer>
      <div className="mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get Your Home Evaluation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get an accurate estimate of your home&apos;s value. Our expert team will analyze
            your property and provide you with a comprehensive valuation report.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Property Address <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
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
                  className="flex-1"
                />
                <Button
                  onClick={handleStartEvaluation}
                  disabled={!address.trim()}
                  className="px-8"
                >
                  Get Started
                </Button>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What to Expect
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Comprehensive property analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Market comparison with similar properties</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Personalized valuation report</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Expert consultation from our team</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

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
    </PageContainer>
  );
}

