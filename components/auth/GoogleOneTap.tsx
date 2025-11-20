'use client';

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
          }) => void;
          prompt: (momentNotification?: (notification: { getNotDisplayedReason: () => string; getSkippedReason: () => string; getDismissedReason: () => string }) => void) => void;
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

  useEffect(() => {
    // Don't show One Tap if user is already authenticated
    if (user) {
      return;
    }

    // Don't initialize if already initialized
    if (initializedRef.current) {
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Google One Tap will not be available.');
      return;
    }

    if (!supabase) {
      return;
    }

    // Load Google Identity Services script
    const loadGoogleScript = () => {
      if (scriptLoadedRef.current) {
        initializeOneTap();
        return;
      }

      // Check if script is already loaded
      if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        scriptLoadedRef.current = true;
        // Wait a bit for the script to initialize
        setTimeout(initializeOneTap, 100);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        initializeOneTap();
      };
      script.onerror = () => {
        console.error('Failed to load Google Identity Services script');
      };
      document.head.appendChild(script);
    };

    const initializeOneTap = () => {
      if (!window.google?.accounts?.id) {
        console.warn('Google Identity Services not available');
        return;
      }

      if (initializedRef.current) {
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (oneTapResponse) => {
            if (!supabase) {
              console.error('Supabase client not available');
              return;
            }

            try {
              // Exchange the Google ID token for a Supabase session
              // Supabase supports ID token exchange through their REST API
              const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
              const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
              
              if (!supabaseUrl || !supabaseAnonKey) {
                throw new Error('Supabase configuration missing');
              }

              // Make a POST request to Supabase's token exchange endpoint
              const tokenResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=id_token`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': supabaseAnonKey,
                },
                body: JSON.stringify({
                  provider: 'google',
                  id_token: oneTapResponse.credential,
                }),
              });

              if (!tokenResponse.ok) {
                const errorData = await tokenResponse.json().catch(() => ({}));
                throw new Error(errorData.error_description || 'Failed to exchange ID token');
              }

              const tokenData = await tokenResponse.json();
              
              // Set the session in Supabase client
              if (tokenData.access_token && tokenData.refresh_token) {
                const { error: setSessionError } = await supabase.auth.setSession({
                  access_token: tokenData.access_token,
                  refresh_token: tokenData.refresh_token,
                });

                if (setSessionError) {
                  throw setSessionError;
                }

                console.log('Successfully signed in with Google One Tap');
              } else {
                throw new Error('Invalid token response from Supabase');
              }
            } catch (err) {
              console.error('Error processing Google One Tap credential:', err);
              // Fallback to OAuth flow if ID token exchange fails
              // This provides a seamless fallback experience
              try {
                await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
                  },
                });
              } catch (oauthError) {
                console.error('Fallback OAuth also failed:', oauthError);
              }
            }
          },
          cancel_on_tap_outside: false,
          itp_support: true, // Support Intelligent Tracking Prevention
        });

        initializedRef.current = true;

        // Prompt One Tap after a short delay
        setTimeout(() => {
          if (window.google?.accounts?.id && !user) {
            window.google.accounts.id.prompt((notification) => {
              // Handle notification if needed (for debugging)
              if (process.env.NODE_ENV === 'development') {
                if (notification.getNotDisplayedReason()) {
                  console.log('One Tap not displayed:', notification.getNotDisplayedReason());
                }
                if (notification.getSkippedReason()) {
                  console.log('One Tap skipped:', notification.getSkippedReason());
                }
                if (notification.getDismissedReason()) {
                  console.log('One Tap dismissed:', notification.getDismissedReason());
                }
              }
            });
          }
        }, 500);
      } catch (error) {
        console.error('Error initializing Google One Tap:', error);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      loadGoogleScript();
    }, 1000);

    return () => {
      clearTimeout(timer);
      // Disable One Tap when component unmounts or user signs in
      if (window.google?.accounts?.id && initializedRef.current) {
        try {
          window.google.accounts.id.disableAutoSelect();
        } catch (error) {
          // Ignore errors during cleanup
        }
      }
    };
  }, [supabase, user]);

  // This component doesn't render anything visible
  return null;
}

