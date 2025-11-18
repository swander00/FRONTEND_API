'use client';

import { useEffect, useMemo, useState } from 'react';
import { BaseModal, ModalBody, ModalFooter, ModalHeader } from '../../Shared/Modals';
import { TypeGroup } from './TypeGroup';
import { useFiltersDispatch, useFiltersState } from '../../FiltersContext';

export type TypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function TypeModal({ isOpen, onClose }: TypeModalProps) {
  const { propertyTypes } = useFiltersState();
  const dispatch = useFiltersDispatch();
  const [localTypes, setLocalTypes] = useState<string[]>(propertyTypes);

  useEffect(() => {
    if (isOpen) {
      setLocalTypes(propertyTypes);
    }
  }, [isOpen, propertyTypes]);

  const isAllTypes = useMemo(() => localTypes.length === 0, [localTypes.length]);

  const toggleType = (type: string) => {
    setLocalTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type],
    );
  };

  const handleToggleAll = () => {
    setLocalTypes([]);
  };

  const handleApply = () => {
    dispatch({ type: 'SET_PROPERTY_TYPES', payload: localTypes });
    onClose();
  };

  const handleReset = () => {
    setLocalTypes([]);
    dispatch({ type: 'SET_PROPERTY_TYPES', payload: [] });
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      className="max-w-[min(100%,800px)]"
      contentClassName="h-auto max-h-none"
    >
      <ModalHeader
        title="Property Types"
        description="Tap a category below and add the property styles you’re interested in."
        onClose={onClose}
      />
      <ModalBody scrollable={false} className="flex-none space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white px-5 py-4 shadow-sm">
          <div className="max-w-xl space-y-1">
            <p className="text-sm font-semibold text-slate-900">All Property Types</p>
            <p className="text-xs text-slate-500">
              Explore every property style with a single selection.
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleAll}
            className={`rounded-full px-5 py-2 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
              isAllTypes
                ? 'bg-blue-600 text-white shadow-sm focus-visible:ring-blue-400'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900 focus-visible:ring-slate-200'
            }`}
          >
            {isAllTypes ? 'All Types Enabled' : 'Enable All Types'}
          </button>
        </div>

        <TypeGroup selected={localTypes} onToggle={toggleType} />
      </ModalBody>
      <ModalFooter
        onCancel={onClose}
        onReset={handleReset}
        onApply={handleApply}
        applyLabel="Apply Property Types"
      />
    </BaseModal>
  );
}


