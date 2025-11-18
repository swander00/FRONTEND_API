'use client';

import React, { useState } from 'react';
import { BaseModal } from '@/components/shared/modals';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { PropertySpecsData } from './PropertySpecsModal';

interface UserInformationModalProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  onSubmit: (data: UserInformationData) => void;
  propertyData?: PropertySpecsData; // PropertySpecsData from previous modal
  address: string;
}

export interface UserInformationData {
  fullName: string;
  email: string;
  phone: string;
  preferredContact: string;
  timeline: string;
  notes?: string;
}

const timelines = [
  'Immediate (within 1 month)',
  '1-3 months',
  '3-6 months', 
  '6+ months',
  'Just exploring'
];

const contactMethods = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'text', label: 'Text Message' }
];

export function UserInformationModal({ 
  open, 
  onClose, 
  onBack, 
  onSubmit, 
  propertyData, 
  address 
}: UserInformationModalProps) {
  const [formData, setFormData] = useState<UserInformationData>({
    fullName: '',
    email: '',
    phone: '',
    preferredContact: '',
    timeline: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof UserInformationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length >= 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
    return phone;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('phone', formatted);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.preferredContact) {
      newErrors.preferredContact = 'Please select a preferred contact method';
    }
    
    if (!formData.timeline) {
      newErrors.timeline = 'Please select your timeline';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Error submitting form:', error);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Contact Information"
      description="We'll use this information to send you your personalized home valuation report"
      size="lg"
      showBackButton={true}
      onBack={onBack}
    >
      <div className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={errors.fullName ? 'border-red-500' : ''}
          />
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Preferred Contact Method */}
        <div className="space-y-3">
          <Label>Preferred Contact Method *</Label>
          <RadioGroup
            value={formData.preferredContact}
            onValueChange={(value) => handleInputChange('preferredContact', value)}
            className={errors.preferredContact ? 'border border-red-500 rounded-md p-3' : ''}
          >
            {contactMethods.map((method) => (
              <div key={method.value} className="flex items-center space-x-2">
                <RadioGroupItem value={method.value} id={method.value} />
                <Label htmlFor={method.value} className="text-sm font-normal">
                  {method.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.preferredContact && (
            <p className="text-sm text-red-500">{errors.preferredContact}</p>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <Label htmlFor="timeline">When are you planning to sell? *</Label>
          <Select 
            value={formData.timeline} 
            onValueChange={(value) => handleInputChange('timeline', value)}
          >
            <SelectTrigger className={errors.timeline ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select your timeline" />
            </SelectTrigger>
            <SelectContent>
              {timelines.map((timeline) => (
                <SelectItem key={timeline} value={timeline}>
                  {timeline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.timeline && (
            <p className="text-sm text-red-500">{errors.timeline}</p>
          )}
        </div>

        {/* Additional Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any additional information about your property or valuation needs..."
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
          />
        </div>

        {/* Property Summary */}
        {propertyData && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Property Summary</h4>
            <p className="text-sm text-gray-600">
              <strong>Address:</strong> {address}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Property:</strong> {propertyData.propertyType} • {propertyData.bedrooms} bed • {propertyData.bathrooms} bath
            </p>
            <p className="text-sm text-gray-600">
              <strong>Size:</strong> {propertyData.squareFootage}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Get My Valuation'
              )}
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
