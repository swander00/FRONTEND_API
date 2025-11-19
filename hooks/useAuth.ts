/**
 * Authentication Hook
 * 
 * Manages authentication state and provides auth methods
 */

import { useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';
import { getUserProfile, type UserProfile } from '@/lib/api/users';

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

      // Try to get user profile
      try {
        const profile = await getUserProfile();
        setState({ 
          status: 'authenticated', 
          user: session.user, 
          session,
          profile 
        });
      } catch (error) {
        // Profile doesn't exist or error fetching - check onboarding status
        // For now, assume onboarding required if profile fetch fails
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
    checkAuth();

    if (!supabase) return;

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Refresh profile after sign in
          try {
            const profile = await getUserProfile();
            setState({ 
              status: 'authenticated', 
              user: session.user, 
              session,
              profile 
            });
          } catch {
            setState({ 
              status: 'onboarding_required', 
              user: session.user, 
              session 
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setState({ status: 'unauthenticated' });
        } else if (event === 'TOKEN_REFRESHED' && session) {
          // Update session on token refresh
          if (state.status === 'authenticated' || state.status === 'onboarding_required') {
            setState({ ...state, session });
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, checkAuth, state.status]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  }, [supabase]);

  const signOut = useCallback(async () => {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    setState({ status: 'unauthenticated' });
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (state.status !== 'authenticated' && state.status !== 'onboarding_required') {
      return;
    }

    try {
      const profile = await getUserProfile();
      if (state.status === 'authenticated') {
        setState({ ...state, profile });
      } else {
        setState({ 
          status: 'authenticated', 
          user: state.user, 
          session: state.session,
          profile 
        });
      }
    } catch (error) {
      // Profile still doesn't exist
      if (state.status === 'authenticated') {
        setState({ 
          status: 'onboarding_required', 
          user: state.user, 
          session: state.session 
        });
      }
    }
  }, [state]);

  return {
    state,
    isLoading: state.status === 'loading',
    isAuthenticated: state.status === 'authenticated',
    isOnboardingRequired: state.status === 'onboarding_required',
    user: state.status === 'authenticated' || state.status === 'onboarding_required' ? state.user : null,
    profile: state.status === 'authenticated' ? state.profile : null,
    signInWithGoogle,
    signOut,
    refreshProfile,
  };
}

