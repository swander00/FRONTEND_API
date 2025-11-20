'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Redirect if already authenticated
  if (isAuthenticated && !isLoading) {
    router.push('/');
    return null;
  }

  const handleClose = () => {
    setIsModalOpen(false);
    router.push('/');
  };

  const handleAuthSuccess = () => {
    setIsModalOpen(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <AuthModal
          isOpen={isModalOpen}
          onClose={handleClose}
          initialMode="sign-in"
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </div>
  );
}

