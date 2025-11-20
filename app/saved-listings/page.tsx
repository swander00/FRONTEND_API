'use client';

import { PageContainer, SectionCard } from '@/components/layout';

export default function SavedListingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageContainer>
        <SectionCard className="mt-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Saved Listings</h1>
          <p className="text-gray-600">Your saved listings will appear here.</p>
        </SectionCard>
      </PageContainer>
    </div>
  );
}

