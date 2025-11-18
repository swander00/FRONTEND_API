'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BaseModal } from '@/components/shared/modals';
import { Button } from '@/components/ui/buttons/Button';
import { Label } from '@/components/ui/label';
import { ChevronDown, X } from 'lucide-react';

interface PropertySpecsModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: (data: PropertySpecsData) => void;
  address: string;
}

export interface PropertySpecsData {
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: string;
  propertyAge: string;
  basement: string[];
  garage: number;
  specialFeatures: string[];
}

const propertyTypes = [
  'Detached',
  'Semi-Detached', 
  'Townhouse',
  'Condo',
  'Condo Townhouse',
  'Link',
  'Other'
];

const basementTypes = [
  'None',
  'Unfinished',
  'Finished',
  'Partly Finished',
  'Bedroom',
  'Kitchen',
  'Separate Entrance'
];

const specialFeatures = [
  'Pool',
  'Fireplace',
  'Waterfront',
  'Walk-out Basement',
  'Hardwood Floors',
  'Updated Kitchen',
  'Updated Bathrooms',
  'Central Air',
  'Balcony/Deck',
  'Garden',
  'Parking'
];

// Chip component for single selection
interface ChipProps {
  label: string | number;
  selected: boolean;
  onClick: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      px-5 py-2.5 rounded-xl font-semibold text-sm
      transition-all duration-300 ease-out
      transform hover:scale-105 active:scale-95
      ${selected 
        ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-300 ring-offset-2' 
        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:shadow-md hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50'
      }
    `}
  >
    {label}
  </button>
);

// Chip component for multi-selection (special features)
interface ToggleChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const ToggleChip: React.FC<ToggleChipProps> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      px-4 py-2.5 rounded-full font-semibold text-sm
      transition-all duration-300 ease-out
      transform hover:scale-105 active:scale-95
      ${selected 
        ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/40 ring-2 ring-purple-300 ring-offset-2' 
        : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-purple-400 hover:shadow-lg hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50'
      }
    `}
  >
    {label}
  </button>
);

// Bedroom Dropdown Component
interface BedroomDropdownProps {
  value: number;
  onChange: (value: number) => void;
}

const BedroomDropdown: React.FC<BedroomDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const bedroomOptions = [
    { label: 'Any', value: 0 },
    { label: '1 Bedroom', value: 1 },
    { label: '2 Bedrooms', value: 2 },
    { label: '3 Bedrooms', value: 3 },
    { label: '4 Bedrooms', value: 4 },
    { label: '5 Bedrooms', value: 5 },
    { label: '6+ Bedrooms', value: 6 }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (bedValue: number) => {
    onChange(bedValue);
    setIsOpen(false);
  };

  const selectedLabel = bedroomOptions.find(opt => opt.value === value)?.label || 'Select';

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 flex items-center justify-between bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:from-blue-600 hover:via-blue-700 hover:to-purple-700"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2.5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Bedrooms</h3>
                <p className="text-xs text-gray-600 mt-0.5">Select bedroom count</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/60 rounded-full transition-colors"
              >
                <X className="h-3 w-3 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="py-1 max-h-64 overflow-y-auto">
            {bedroomOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 flex items-center ${
                  value === option.value
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full mr-3 ${value === option.value ? 'bg-white' : 'bg-gray-400'}`}></div>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Bathroom Dropdown Component
interface BathroomDropdownProps {
  value: number;
  onChange: (value: number) => void;
}

const BathroomDropdown: React.FC<BathroomDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const bathroomOptions = [
    { label: 'Any', value: 0 },
    { label: '1 Bathroom', value: 1 },
    { label: '1.5 Bathrooms', value: 1.5 },
    { label: '2 Bathrooms', value: 2 },
    { label: '2.5 Bathrooms', value: 2.5 },
    { label: '3 Bathrooms', value: 3 },
    { label: '3.5 Bathrooms', value: 3.5 },
    { label: '4 Bathrooms', value: 4 },
    { label: '4.5 Bathrooms', value: 4.5 },
    { label: '5+ Bathrooms', value: 5 }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (bathValue: number) => {
    onChange(bathValue);
    setIsOpen(false);
  };

  const selectedLabel = bathroomOptions.find(opt => opt.value === value)?.label || 'Select';

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 flex items-center justify-between bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:from-blue-600 hover:via-blue-700 hover:to-purple-700"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2.5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Bathrooms</h3>
                <p className="text-xs text-gray-600 mt-0.5">Select bathroom count</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/60 rounded-full transition-colors"
              >
                <X className="h-3 w-3 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="py-1 max-h-64 overflow-y-auto">
            {bathroomOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 flex items-center ${
                  value === option.value
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full mr-3 ${value === option.value ? 'bg-white' : 'bg-gray-400'}`}></div>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Property Age Dropdown Component
interface PropertyAgeDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const PropertyAgeDropdown: React.FC<PropertyAgeDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ageOptions = [
    { label: 'New', value: 'New' },
    { label: '1-5 years', value: '1-5 years' },
    { label: '6-10 years', value: '6-10 years' },
    { label: '11-20 years', value: '11-20 years' },
    { label: '20+ years', value: '20+ years' },
    { label: 'Unknown', value: 'Unknown' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (ageValue: string) => {
    onChange(ageValue);
    setIsOpen(false);
  };

  const selectedLabel = ageOptions.find(opt => opt.value === value)?.label || 'Select property age';

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 flex items-center justify-between bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:from-blue-600 hover:via-blue-700 hover:to-purple-700"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2.5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Property Age</h3>
                <p className="text-xs text-gray-600 mt-0.5">Select property age</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/60 rounded-full transition-colors"
              >
                <X className="h-3 w-3 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="py-1 max-h-64 overflow-y-auto">
            {ageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 flex items-center ${
                  value === option.value
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full mr-3 ${value === option.value ? 'bg-white' : 'bg-gray-400'}`}></div>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Garage Dropdown Component
interface GarageDropdownProps {
  value: number;
  onChange: (value: number) => void;
}

const GarageDropdown: React.FC<GarageDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const garageOptionsData = [
    { label: 'None', value: 0 },
    { label: '1 Space', value: 1 },
    { label: '2 Spaces', value: 2 },
    { label: '3 Spaces', value: 3 },
    { label: '4+ Spaces', value: 4 }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (garageValue: number) => {
    onChange(garageValue);
    setIsOpen(false);
  };

  const selectedLabel = garageOptionsData.find(opt => opt.value === value)?.label || 'Select garage spaces';

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 flex items-center justify-between bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:from-blue-600 hover:via-blue-700 hover:to-purple-700"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2.5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Garage Spaces</h3>
                <p className="text-xs text-gray-600 mt-0.5">Select number of garage spaces</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/60 rounded-full transition-colors"
              >
                <X className="h-3 w-3 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="py-1 max-h-64 overflow-y-auto">
            {garageOptionsData.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 flex items-center ${
                  value === option.value
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full mr-3 ${value === option.value ? 'bg-white' : 'bg-gray-400'}`}></div>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Square Footage Dropdown Component
interface SquareFootageDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const SquareFootageDropdown: React.FC<SquareFootageDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sqftOptions = [
    { label: 'Under 500 sq ft', value: 'Under 500 sq ft' },
    { label: '500-1,000 sq ft', value: '500-1,000 sq ft' },
    { label: '1,000-1,500 sq ft', value: '1,000-1,500 sq ft' },
    { label: '1,500-2,000 sq ft', value: '1,500-2,000 sq ft' },
    { label: '2,000-2,500 sq ft', value: '2,000-2,500 sq ft' },
    { label: '2,500-3,000 sq ft', value: '2,500-3,000 sq ft' },
    { label: '3,000-4,000 sq ft', value: '3,000-4,000 sq ft' },
    { label: '4,000-5,000 sq ft', value: '4,000-5,000 sq ft' },
    { label: '5,000+ sq ft', value: '5,000+ sq ft' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (sqftValue: string) => {
    onChange(sqftValue);
    setIsOpen(false);
  };

  const selectedLabel = sqftOptions.find(opt => opt.value === value)?.label || 'Select square footage';

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 flex items-center justify-between bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:from-blue-600 hover:via-blue-700 hover:to-purple-700"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2.5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Square Footage</h3>
                <p className="text-xs text-gray-600 mt-0.5">Select size range</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/60 rounded-full transition-colors"
              >
                <X className="h-3 w-3 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="py-1 max-h-64 overflow-y-auto">
            {sqftOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 flex items-center ${
                  value === option.value
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full mr-3 ${value === option.value ? 'bg-white' : 'bg-gray-400'}`}></div>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export function PropertySpecsModal({ open, onClose, onContinue, address }: PropertySpecsModalProps) {
  const [formData, setFormData] = useState<PropertySpecsData>({
    propertyType: '',
    bedrooms: 0,
    bathrooms: 0,
    squareFootage: '',
    propertyAge: '',
    basement: [],
    garage: 0,
    specialFeatures: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof PropertySpecsData, value: string | number | string[]) => {
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

  const handleSpecialFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      specialFeatures: prev.specialFeatures.includes(feature)
        ? prev.specialFeatures.filter(f => f !== feature)
        : [...prev.specialFeatures, feature]
    }));
  };

  const handleBasementToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      basement: prev.basement.includes(type)
        ? prev.basement.filter(b => b !== type)
        : [...prev.basement, type]
    }));
    
    // Clear error when user selects
    if (errors.basement) {
      setErrors(prev => ({
        ...prev,
        basement: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
    if (!formData.bedrooms || formData.bedrooms < 1) newErrors.bedrooms = 'Please select number of bedrooms';
    if (!formData.bathrooms || formData.bathrooms < 1) newErrors.bathrooms = 'Please select number of bathrooms';
    if (!formData.squareFootage) newErrors.squareFootage = 'Square footage is required';
    if (!formData.propertyAge) newErrors.propertyAge = 'Property age is required';
    if (!formData.basement || formData.basement.length === 0) newErrors.basement = 'Please select at least one basement type';
    // Garage can be 0 (None), so only check for undefined/null
    if (formData.garage === undefined || formData.garage === null) newErrors.garage = 'Please select garage spaces';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      onContinue(formData);
    }
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Property Details"
      description={`Tell us about your property at ${address}`}
      size="lg"
      className="max-h-[90vh] flex flex-col"
    >
      <div className="space-y-4 py-1">
        {/* Basic Information Card */}
        <div className="bg-gradient-to-br from-gray-50/80 to-blue-50/30 rounded-xl p-3 space-y-3 border border-gray-100">
          {/* Property Type - Full Width */}
          <div className="space-y-3">
            <Label className="text-base font-bold text-gray-800">Property Type <span className="text-red-500">*</span></Label>
            <div className="flex flex-wrap gap-2.5">
              {propertyTypes.map((type) => (
                <Chip
                  key={type}
                  label={type}
                  selected={formData.propertyType === type}
                  onClick={() => handleInputChange('propertyType', type)}
                />
              ))}
            </div>
            {errors.propertyType && (
              <p className="text-sm text-red-500 font-medium">{errors.propertyType}</p>
            )}
          </div>

          {/* Bedrooms & Bathrooms - 2 Column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bedrooms */}
            <div className="space-y-3">
              <Label className="text-base font-bold text-gray-800">Bedrooms <span className="text-red-500">*</span></Label>
              <BedroomDropdown
                value={formData.bedrooms}
                onChange={(value) => handleInputChange('bedrooms', value)}
              />
              {errors.bedrooms && (
                <p className="text-sm text-red-500 font-medium">{errors.bedrooms}</p>
              )}
            </div>

            {/* Bathrooms */}
            <div className="space-y-3">
              <Label className="text-base font-bold text-gray-800">Bathrooms <span className="text-red-500">*</span></Label>
              <BathroomDropdown
                value={formData.bathrooms}
                onChange={(value) => handleInputChange('bathrooms', value)}
              />
              {errors.bathrooms && (
                <p className="text-sm text-red-500 font-medium">{errors.bathrooms}</p>
              )}
            </div>
          </div>

          {/* Square Footage - Full Width */}
          <div className="space-y-3">
            <Label className="text-base font-bold text-gray-800">Square Footage <span className="text-red-500">*</span></Label>
            <SquareFootageDropdown
              value={formData.squareFootage}
              onChange={(value) => handleInputChange('squareFootage', value)}
            />
            {errors.squareFootage && (
              <p className="text-sm text-red-500 font-medium">{errors.squareFootage}</p>
            )}
          </div>
        </div>

        {/* Property Details Card */}
        <div className="bg-gradient-to-br from-gray-50/80 to-purple-50/30 rounded-xl p-3 space-y-3 border border-gray-100">
          {/* Property Age & Garage - 2 Column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Property Age */}
            <div className="space-y-3">
              <Label className="text-base font-bold text-gray-800">Property Age <span className="text-red-500">*</span></Label>
              <PropertyAgeDropdown
                value={formData.propertyAge}
                onChange={(value) => handleInputChange('propertyAge', value)}
              />
              {errors.propertyAge && (
                <p className="text-sm text-red-500 font-medium">{errors.propertyAge}</p>
              )}
            </div>

            {/* Garage */}
            <div className="space-y-3">
              <Label className="text-base font-bold text-gray-800">Garage Spaces <span className="text-red-500">*</span></Label>
              <GarageDropdown
                value={formData.garage}
                onChange={(value) => handleInputChange('garage', value)}
              />
              {errors.garage && (
                <p className="text-sm text-red-500 font-medium">{errors.garage}</p>
              )}
            </div>
          </div>

          {/* Basement Features - Full Width */}
          <div className="space-y-3">
            <Label className="text-base font-bold text-gray-800">Basement Features <span className="text-red-500">*</span> <span className="text-gray-400 font-normal text-sm">(select all that apply)</span></Label>
            <div className="flex flex-wrap gap-2.5">
              {basementTypes.map((type) => (
                <ToggleChip
                  key={type}
                  label={type}
                  selected={formData.basement.includes(type)}
                  onClick={() => handleBasementToggle(type)}
                />
              ))}
            </div>
            {errors.basement && (
              <p className="text-sm text-red-500 font-medium">{errors.basement}</p>
            )}
          </div>
        </div>

        {/* Special Features Card */}
        <div className="bg-gradient-to-br from-gray-50/80 to-indigo-50/30 rounded-xl p-3 space-y-2 border border-gray-100">
          <Label className="text-base font-bold text-gray-800">Special Features <span className="text-gray-400 font-normal text-sm">(optional)</span></Label>
          <div className="flex flex-wrap gap-2.5">
            {specialFeatures.map((feature) => (
              <ToggleChip
                key={feature}
                label={feature}
                selected={formData.specialFeatures.includes(feature)}
                onClick={() => handleSpecialFeatureToggle(feature)}
              />
            ))}
          </div>
        </div>
      </div>
        
      {/* Footer - Fixed at bottom */}
      <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 mt-3 bg-white">
        <Button 
          variant="outline" 
          onClick={onClose}
          className="px-6 py-2.5 border-2 hover:bg-gray-50 transition-all duration-200"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleContinue} 
          className="px-8 py-2.5 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Continue
        </Button>
      </div>
    </BaseModal>
  );
}
