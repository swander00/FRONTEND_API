'use client';

/**
 * Google One Tap Component
 * 
 * NOTE: Currently disabled because Supabase doesn't support direct ID token exchange
 * for Google One Tap. When users click One Tap, it tries to exchange the ID token
 * but Supabase requires OAuth flow, causing Google to show an error.
 * 
 * The regular "Continue with Google" button works perfectly via OAuth flow.
 * 
 * To enable One Tap in the future, we would need to:
 * 1. Create a backend endpoint that exchanges Google ID tokens for Supabase sessions
 * 2. Or wait for Supabase to add native One Tap support
 */

import { useEffect, useRef } from 'react';
import { useSupabaseBrowserClient } from '@/hooks/useSupabaseBrowserClient';
import { useAuth } from '@/hooks/useAuth';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            cancel_on_tap_outside?: boolean;
            itp_support?: boolean;
            auto_select?: boolean;
          }) => void;
          prompt: (momentNotification?: (notification: { 
            getNotDisplayedReason: () => string; 
            getSkippedReason: () => string; 
            getDismissedReason: () => string;
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
            isDismissedMoment: () => boolean;
          }) => void) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

export function GoogleOneTap() {
  const supabase = useSupabaseBrowserClient();
  const { user } = useAuth();
  const initializedRef = useRef(false);
  const scriptLoadedRef = useRef(false);
  const promptShownRef = useRef(false);

  useEffect(() => {
    // Don't show One Tap if user is already authenticated
    if (user) {
      // Clean up if user signs in
      if (initializedRef.current && window.google?.accounts?.id) {
        try {
          window.google.accounts.id.disableAutoSelect();
        } catch (error) {
          // Ignore cleanup errors
        }
      }
      initializedRef.current = false;
      promptShownRef.current = false;
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Google One Tap will not be available.');
      }
      return;
    }

    if (!supabase) {
      return;
    }

    // Load Google Identity Services script
    const loadGoogleScript = () => {
      // Check if script is already loaded
      const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      if (existingScript) {
        scriptLoadedRef.current = true;
        // Wait for the script to be ready
        const checkGoogle = setInterval(() => {
          if (window.google?.accounts?.id) {
            clearInterval(checkGoogle);
            initializeOneTap();
          }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkGoogle);
          if (window.google?.accounts?.id) {
            initializeOneTap();
          }
        }, 5000);
        return;
      }

      // Script not loaded, load it
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        // Wait a bit for Google API to initialize
        setTimeout(() => {
          if (window.google?.accounts?.id) {
            initializeOneTap();
          }
        }, 100);
      };
      script.onerror = () => {
        console.error('Failed to load Google Identity Services script');
        scriptLoadedRef.current = false;
      };
      document.head.appendChild(script);
    };

    const initializeOneTap = () => {
      if (!window.google?.accounts?.id) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Google Identity Services not available');
        }
        return;
      }

      // Reset initialization if user signed out
      if (user) {
        initializedRef.current = false;
        return;
      }

      // Don't re-initialize if already initialized
      if (initializedRef.current) {
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (oneTapResponse) => {
            // Supabase doesn't support direct ID token exchange for Google One Tap
            // We need to trigger OAuth flow instead
            // Use setTimeout to defer OAuth trigger and prevent Google's error detection
            setTimeout(() => {
              if (!supabase || user || !oneTapResponse?.credential) {
                return;
              }

              // Trigger OAuth flow - this will redirect user to complete sign-in
              // The redirect happens quickly, so user experience is still good
              supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
                },
              }).catch((error) => {
                console.error('OAuth sign-in error:', error);
              });
            }, 0);
          },
          cancel_on_tap_outside: false,
          itp_support: true,
          auto_select: false,
        });

        initializedRef.current = true;

        // Prompt One Tap after initialization
        // Use a longer delay to ensure everything is ready
        setTimeout(() => {
          if (window.google?.accounts?.id && !user && !promptShownRef.current) {
            try {
              window.google.accounts.id.prompt((notification) => {
                promptShownRef.current = true;
                
                if (process.env.NODE_ENV === 'development') {
                  if (notification.isNotDisplayed()) {
                    const reason = notification.getNotDisplayedReason();
                    console.log('One Tap not displayed:', reason);
                  }
                  if (notification.isSkippedMoment()) {
                    const reason = notification.getSkippedReason();
                    console.log('One Tap skipped:', reason);
                  }
                  if (notification.isDismissedMoment()) {
                    const reason = notification.getDismissedReason();
                    console.log('One Tap dismissed:', reason);
                  }
                }
              });
            } catch (error) {
              console.error('Error prompting One Tap:', error);
            }
          }
        }, 1000);
      } catch (error) {
        console.error('Error initializing Google One Tap:', error);
        initializedRef.current = false;
      }
    };

    // Delay to ensure DOM and auth state are ready
    const timer = setTimeout(() => {
      if (!user) {
        loadGoogleScript();
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
      // Don't disable on cleanup - let it persist across navigation
      // Only disable when user signs in (handled above)
    };
  }, [supabase, user]);

  // This component doesn't render anything visible
  return null;
}

