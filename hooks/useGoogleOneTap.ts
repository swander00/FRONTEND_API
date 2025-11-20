/**
 * Google One Tap Hook
 * 
 * Manages Google One Tap sign-in prompt
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useAuth } from './useAuth';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            itp_support?: boolean;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          prompt: (momentNotification?: (notification: { getNotDisplayedReason: () => string; getSkippedReason: () => string; getDismissedReason: () => string }) => void) => void;
          disableAutoSelect: () => void;
          cancel: () => void;
          storeCredential: (credentials: { id: string; password: string }, callback: () => void) => void;
        };
      };
    };
  }
}

interface UseGoogleOneTapOptions {
  enabled?: boolean;
  autoSelect?: boolean;
  cancelOnTapOutside?: boolean;
}

export function useGoogleOneTap(options: UseGoogleOneTapOptions = {}) {
  const { enabled = true, autoSelect = false, cancelOnTapOutside = true } = options;
  const { isAuthenticated, isLoading } = useAuth();
  const initializedRef = useRef(false);
  const scriptLoadedRef = useRef(false);
  const [scriptReady, setScriptReady] = useState(false);

  const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      console.error('Supabase client not available');
      return;
    }

    // Disable One Tap to prevent conflicts during OAuth flow
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (err) {
        // Ignore errors
      }
    }

    try {
      // Try signInWithIdToken first if available (Supabase v2.38+)
      if (typeof supabase.auth.signInWithIdToken === 'function') {
        try {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: response.credential,
          });

          if (!error && data?.session) {
            // Success - auth state change will be handled by useAuth hook
            console.log('Google One Tap sign-in successful via signInWithIdToken');
            return;
          }

          // If error, log and fall through to OAuth
          console.warn('signInWithIdToken failed, using OAuth flow:', error?.message);
        } catch (idTokenErr) {
          console.warn('signInWithIdToken error, using OAuth flow:', idTokenErr);
        }
      }

      // Use standard OAuth flow (most reliable method)
      // This will redirect to Google OAuth and then back to /auth/callback
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false, // Ensure redirect happens
        },
      });

      if (oauthError) {
        console.error('OAuth sign-in failed:', oauthError);
        // Don't show alert here as OAuth will redirect
        // If we reach here, something is wrong with the configuration
      }
    } catch (err) {
      console.error('Failed to process Google One Tap credential:', err);
      // Try OAuth as final fallback
      try {
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (oauthError) {
          console.error('OAuth fallback also failed:', oauthError);
        }
      } catch (fallbackErr) {
        console.error('All authentication methods failed:', fallbackErr);
      }
    }
  }, []);

  // Load Google Identity Services script
  useEffect(() => {
    if (!enabled || isAuthenticated || isLoading) {
      return;
    }

    // Check if script is already loaded
    if (window.google?.accounts?.id) {
      scriptLoadedRef.current = true;
      setScriptReady(true);
      return;
    }

    // Check if script is already in the DOM
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      // Script exists, wait for it to load
      const checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          scriptLoadedRef.current = true;
          setScriptReady(true);
          clearInterval(checkInterval);
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      setScriptReady(true);
    };
    script.onerror = () => {
      console.error('Failed to load Google Identity Services script');
    };
    document.head.appendChild(script);

    return () => {
      // Don't remove script on cleanup - it's shared
    };
  }, [enabled, isAuthenticated, isLoading]);

  // Initialize One Tap
  useEffect(() => {
    if (!enabled || isAuthenticated || isLoading || !scriptReady || initializedRef.current) {
      return;
    }

    // Wait a bit for script to fully initialize
    const timer = setTimeout(() => {
      if (!window.google?.accounts?.id) {
        console.warn('Google Identity Services not available after script load');
        return;
      }

      // Get Google Client ID from environment
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      if (!clientId || clientId === 'your-google-oauth-client-id.apps.googleusercontent.com') {
        console.warn('Google Client ID not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable.');
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: autoSelect,
          cancel_on_tap_outside: cancelOnTapOutside,
          itp_support: true, // Intelligent Tracking Prevention support
          use_fedcm_for_prompt: true, // Use FedCM API for better compatibility
        });

        // Prompt One Tap
        window.google.accounts.id.prompt((notification) => {
          // Handle notification if needed
          if (notification) {
            try {
              const notDisplayedReason = notification.getNotDisplayedReason();
              const skippedReason = notification.getSkippedReason();
              const dismissedReason = notification.getDismissedReason();
              
              if (notDisplayedReason) {
                if (notDisplayedReason !== 'browser_not_supported' && notDisplayedReason !== 'invalid_client') {
                  console.debug('Google One Tap not displayed:', notDisplayedReason);
                }
              }
              if (skippedReason) {
                console.debug('Google One Tap skipped:', skippedReason);
              }
              if (dismissedReason) {
                console.debug('Google One Tap dismissed:', dismissedReason);
              }
            } catch (err) {
              // Ignore notification errors
              console.debug('One Tap notification error:', err);
            }
          }
        });

        initializedRef.current = true;
        console.log('Google One Tap initialized successfully');
      } catch (err) {
        console.error('Failed to initialize Google One Tap:', err);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [enabled, isAuthenticated, isLoading, scriptReady, autoSelect, cancelOnTapOutside, handleCredentialResponse]);

  // Cleanup on unmount or when authenticated
  useEffect(() => {
    if (isAuthenticated && initializedRef.current && window.google?.accounts?.id) {
      // Disable One Tap when user is authenticated
      try {
        window.google.accounts.id.disableAutoSelect();
        window.google.accounts.id.cancel();
      } catch (err) {
        // Ignore errors
      }
    } else if (!isAuthenticated && initializedRef.current && window.google?.accounts?.id) {
      // Re-enable One Tap when user signs out (reset initialization state)
      // This allows One Tap to show again after sign out
      initializedRef.current = false;
    }
  }, [isAuthenticated]);
}

