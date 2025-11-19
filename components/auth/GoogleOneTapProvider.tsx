'use client';

/**
 * Google One Tap Provider
 * 
 * Component that initializes and manages Google One Tap sign-in
 * Add this to your root layout to enable One Tap across the app
 */

import { useGoogleOneTap } from '@/hooks/useGoogleOneTap';
import { useAuth } from '@/hooks/useAuth';

interface GoogleOneTapProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function GoogleOneTapProvider({ children, enabled = true }: GoogleOneTapProviderProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Only show One Tap when not authenticated
  useGoogleOneTap({
    enabled: enabled && !isAuthenticated && !isLoading,
    autoSelect: false, // Don't auto-select, let user choose
    cancelOnTapOutside: true, // Dismiss if user clicks outside
  });

  return <>{children}</>;
}

