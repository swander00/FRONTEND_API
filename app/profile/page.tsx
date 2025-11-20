'use client';

import { PageContainer, SectionCard } from '@/components/layout';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageContainer>
        <SectionCard className="mt-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Profile</h1>
          <p className="text-gray-600">Your profile page is coming soon.</p>
        </SectionCard>
      </PageContainer>
    </div>
  );
}

