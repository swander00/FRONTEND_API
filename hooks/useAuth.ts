/**
 * Authentication Hook
 * 
 * Manages authentication state and provides auth methods
 */

import { useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';
import { getUserProfile, type UserProfile } from '@/lib/api/users';
import { resetAuthenticatedClient } from '@/lib/api/authenticatedClient';

export type AuthState = 
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'authenticated', user: User, session: Session, profile: UserProfile | null }
  | { status: 'onboarding_required', user: User, session: Session };

export function useAuth() {
  const [state, setState] = useState<AuthState>({ status: 'loading' });
  const supabase = getSupabaseBrowserClient();

  const checkAuth = useCallback(async () => {
    if (!supabase) {
      setState({ status: 'unauthenticated' });
      return;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session || !session.user) {
        setState({ status: 'unauthenticated' });
        return;
      }

      // Try to get user profile with timeout
      try {
        // Use Promise.race to add timeout
        const profilePromise = getUserProfile();
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
        );
        
        const profile = await Promise.race([profilePromise, timeoutPromise]);
        setState({ 
          status: 'authenticated', 
          user: session.user, 
          session,
          profile 
        });
      } catch (error) {
        // Profile doesn't exist or error fetching - this is OK for new users
        // Set to onboarding_required but don't block the app
        console.log('Profile not found or error fetching (this is OK for new users):', error);
        setState({ 
          status: 'onboarding_required', 
          user: session.user, 
          session 
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setState({ status: 'unauthenticated' });
    }
  }, [supabase]);

  useEffect(() => {
    let mounted = true;
    
    // Run checkAuth asynchronously
    checkAuth().catch((error) => {
      console.error('Error in checkAuth:', error);
    });

    if (!supabase) return;

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' && session) {
          // Refresh profile after sign in with timeout
          try {
            const profilePromise = getUserProfile();
            const timeoutPromise = new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
            );
            
            const profile = await Promise.race([profilePromise, timeoutPromise]);
            if (mounted) {
              setState({ 
                status: 'authenticated', 
                user: session.user, 
                session,
                profile 
              });
            }
          } catch (error) {
            // Profile doesn't exist yet - this is OK, user needs onboarding
            console.log('Profile not found after sign in (user needs onboarding):', error);
            if (mounted) {
              setState({ 
                status: 'onboarding_required', 
                user: session.user, 
                session 
              });
            }
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            setState({ status: 'unauthenticated' });
          }
        } else if (event === 'TOKEN_REFRESHED' && session) {
          // Update session on token refresh using functional setState to access current state
          if (mounted) {
            setState((currentState) => {
              if (currentState.status === 'authenticated' || currentState.status === 'onboarding_required') {
                return { ...currentState, session };
              }
              return currentState;
            });
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, checkAuth]);

  const signOut = useCallback(async () => {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Reset authenticated client to clear any cached tokens
      resetAuthenticatedClient();
      
      setState({ status: 'unauthenticated' });
    } catch (err) {
      console.error('Sign out error:', err);
      throw err;
    }
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    setState((currentState) => {
      if (currentState.status !== 'authenticated' && currentState.status !== 'onboarding_required') {
        return currentState;
      }
      return currentState;
    });

    // Fetch profile asynchronously
    try {
      const profile = await getUserProfile();
      setState((prevState) => {
        if (prevState.status === 'authenticated') {
          return { ...prevState, profile };
        } else if (prevState.status === 'onboarding_required') {
          return {
            status: 'authenticated' as const,
            user: prevState.user,
            session: prevState.session,
            profile
          };
        }
        return prevState;
      });
    } catch (error) {
      // Profile still doesn't exist
      setState((prevState) => {
        if (prevState.status === 'authenticated') {
          return {
            status: 'onboarding_required' as const,
            user: prevState.user,
            session: prevState.session
          };
        }
        return prevState;
      });
    }
  }, []);

  return {
    state,
    isLoading: state.status === 'loading',
    isAuthenticated: state.status === 'authenticated',
    isOnboardingRequired: state.status === 'onboarding_required',
    user: state.status === 'authenticated' || state.status === 'onboarding_required' ? state.user : null,
    profile: state.status === 'authenticated' ? state.profile : null,
    signOut,
    refreshProfile,
  };
}

