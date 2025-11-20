'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';
import { getOnboardingStatus } from '@/lib/api/users';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const isProcessingRef = useRef(true);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setError('Supabase client not initialized');
        setIsProcessing(false);
        isProcessingRef.current = false;
        return;
      }

      // Set a timeout to prevent infinite loading
      timeoutRef.current = setTimeout(() => {
        if (isProcessingRef.current) {
          setError('Authentication timeout. Please try signing in again.');
          setIsProcessing(false);
          isProcessingRef.current = false;
        }
      }, 10000); // 10 second timeout

      try {
        // Helper function to check onboarding and redirect
        const checkOnboardingAndRedirect = async (session: any) => {
          try {
            const status = await getOnboardingStatus();
            if (!status.profileComplete || !status.preferencesComplete) {
              router.push('/onboarding');
            } else {
              router.push('/');
            }
          } catch (err) {
            // If onboarding check fails (404, timeout, etc.), redirect to onboarding
            // This handles new users who don't have a profile yet
            console.log('Onboarding check failed, redirecting to onboarding:', err);
            router.push('/onboarding');
          }
        };

        // Wait for auth callback to process (Supabase handles URL hash fragments)
        // Use onAuthStateChange to wait for session to be established
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
              setIsProcessing(false);
              isProcessingRef.current = false;
              
              // Small delay to ensure session is fully established
              await new Promise(resolve => setTimeout(resolve, 100));
              
              try {
                await checkOnboardingAndRedirect(session);
              } catch (err) {
                console.error('Error checking onboarding status:', err);
                // On error, redirect to onboarding as safe default
                router.push('/onboarding');
              }
            } else if (event === 'SIGNED_OUT') {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
              setIsProcessing(false);
              isProcessingRef.current = false;
              setError('Sign in was cancelled');
            }
          }
        );

        subscriptionRef.current = subscription;

        // Also check for existing session immediately
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setError(authError.message);
          setIsProcessing(false);
          isProcessingRef.current = false;
          if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
          }
          return;
        }

        if (session) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setIsProcessing(false);
          isProcessingRef.current = false;
          if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
          }
          
          // Small delay to ensure session is fully established
          await new Promise(resolve => setTimeout(resolve, 100));
          
          try {
            await checkOnboardingAndRedirect(session);
          } catch (err) {
            console.error('Error checking onboarding status:', err);
            // On error, redirect to onboarding as safe default
            router.push('/onboarding');
          }
        }
      } catch (err) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setIsProcessing(false);
        isProcessingRef.current = false;
      }
    };

    handleCallback();

    // Cleanup function - properly returned from useEffect
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}

