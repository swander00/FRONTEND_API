'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { BaseModal } from '@/components/search/FiltersContainer/Shared/Modals/BaseModal';
import { Input } from '@/components/ui/inputs/Input';
import { Button } from '@/components/ui/buttons/Button';
import { cn } from '@/lib/utils';
import { useSupabaseBrowserClient } from '@/hooks/useSupabaseBrowserClient';

export type AuthMode = 'sign-in' | 'sign-up';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isClosing?: boolean;
  initialMode?: AuthMode;
  onAuthSuccess?: () => void;
};

type MessageState = {
  tone: 'success' | 'error' | 'info';
  text: string;
} | null;

const TRANSITION_DURATION = 220;

export function AuthModal({
  isOpen,
  onClose,
  isClosing = false,
  initialMode = 'sign-in',
  onAuthSuccess,
}: AuthModalProps) {
  const supabase = useSupabaseBrowserClient();
  const isSupabaseReady = Boolean(supabase);

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [message, setMessage] = useState<MessageState>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setMessage(null);
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleToggleMode = () => {
    setMode((prev) => (prev === 'sign-in' ? 'sign-up' : 'sign-in'));
    setMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password || (mode === 'sign-up' && !fullName)) {
      setMessage({ tone: 'error', text: 'Please complete all required fields.' });
      return;
    }

    if (!supabase) {
      setMessage({
        tone: 'error',
        text: 'Authentication service is still initializing. Please try again in a moment.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage({ tone: 'info', text: mode === 'sign-in' ? 'Signing you in…' : 'Creating your account…' });

      if (mode === 'sign-in') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          throw error;
        }

        setMessage({ tone: 'success', text: 'Welcome back! Redirecting…' });
        if (onAuthSuccess) {
          onAuthSuccess();
        } else {
          setTimeout(onClose, TRANSITION_DURATION + 150);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
          },
        });

        if (error) {
          throw error;
        }

        if (!data.session) {
          setMessage({
            tone: 'success',
            text: 'Account created! Check your inbox to confirm your email.',
          });
        } else {
          setMessage({ tone: 'success', text: 'Account created! Redirecting…' });
          if (onAuthSuccess) {
            onAuthSuccess();
          } else {
            setTimeout(onClose, TRANSITION_DURATION + 150);
          }
        }
      }
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      setMessage({
        tone: 'error',
        text: 'Authentication service is still initializing. Please try again in a moment.',
      });
      return;
    }

    try {
      setIsGoogleLoading(true);
      setMessage({ tone: 'info', text: 'Redirecting to Google…' });

      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;
      
      // Verify environment variables are set
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error('Supabase URL is not configured. Please check your environment variables.');
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google OAuth error:', error);
        throw error;
      }

      // If we get a URL back, Supabase is redirecting (this is expected)
      if (data?.url) {
        // Redirect will happen automatically
        return;
      }

      // Note: User will be redirected, so we don't need to handle success here
    } catch (error) {
      setIsGoogleLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Google sign-in failed:', error);
      
      // Provide more helpful error messages
      let userFriendlyMessage = 'Unable to sign in with Google. ';
      if (errorMessage.includes('redirect_uri_mismatch')) {
        userFriendlyMessage += 'Redirect URI mismatch. Please check Google Cloud Console configuration.';
      } else if (errorMessage.includes('invalid_client')) {
        userFriendlyMessage += 'Invalid client configuration. Please verify Client ID matches in Google Cloud Console and Supabase.';
      } else {
        userFriendlyMessage += 'Please check the browser console for details.';
      }
      
      setMessage({
        tone: 'error',
        text: userFriendlyMessage,
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage({ tone: 'error', text: 'Please enter your email before requesting a reset link.' });
      return;
    }

    if (!supabase) {
      setMessage({
        tone: 'error',
        text: 'Authentication service is still initializing. Please try again in a moment.',
      });
      return;
    }

    try {
      setIsResettingPassword(true);
      setMessage({ tone: 'info', text: 'Sending password reset instructions…' });

      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

      if (error) {
        throw error;
      }

      setMessage({
        tone: 'success',
        text: 'Password reset email sent! Please check your inbox.',
      });
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Unable to send reset instructions. Please try again.',
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className={cn(
        'transition-all duration-200 ease-out will-change-transform',
        'max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-6rem)]',
        isClosing ? 'translate-y-6 scale-[0.98] opacity-0' : 'translate-y-0 scale-100 opacity-100'
      )}
      overlayClassName={cn(
        'transition-opacity duration-200 ease-out',
        'z-[9998]',
        isClosing ? 'opacity-0' : 'opacity-100'
      )}
      size="sm"
      contentClassName="p-0 overflow-y-auto"
    >
      <div className="flex flex-col gap-6 bg-white p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {mode === 'sign-in' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {mode === 'sign-in'
                ? 'Sign in to access your saved searches and personalize your experience.'
                : 'Join Wander Property to save listings, receive alerts, and more.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            aria-label="Close authentication modal"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l8 8M14 6l-8 8" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 rounded-full bg-gray-100 p-1 text-sm font-medium">
          <button
            type="button"
            className={cn(
              'rounded-full px-4 py-2 transition',
              mode === 'sign-in'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
            onClick={() => {
              setMode('sign-in');
              setMessage(null);
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={cn(
              'rounded-full px-4 py-2 transition',
              mode === 'sign-up'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
            onClick={() => {
              setMode('sign-up');
              setMessage(null);
            }}
          >
            Sign Up
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {mode === 'sign-up' && (
            <Input
              label="Full name"
              name="fullName"
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Taylor Jones"
          disabled={isSubmitting || !isSupabaseReady}
            />
          )}

          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            disabled={isSubmitting || !isSupabaseReady}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter a secure password"
            disabled={isSubmitting || isGoogleLoading}
          />

          <div className="flex justify-end text-sm">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="font-medium text-blue-600 transition hover:text-blue-700 disabled:text-blue-300"
              disabled={isSubmitting || isResettingPassword || !isSupabaseReady}
            >
              {isResettingPassword ? 'Sending…' : 'Forgot password?'}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="rounded-full"
            disabled={isSubmitting || isGoogleLoading || !isSupabaseReady}
          >
            {isSubmitting ? (mode === 'sign-in' ? 'Signing In…' : 'Creating Account…') : mode === 'sign-in' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="rounded-full w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting || isGoogleLoading || !isSupabaseReady}
        >
          {isGoogleLoading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
              <span>Connecting…</span>
            </>
          ) : (
            <>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </Button>

        {message && (
          <div
            className={cn(
              'rounded-2xl px-4 py-3 text-sm font-medium',
              message.tone === 'success' && 'bg-green-50 text-green-700',
              message.tone === 'error' && 'bg-red-50 text-red-600',
              message.tone === 'info' && 'bg-blue-50 text-blue-600'
            )}
          >
            {message.text}
          </div>
        )}

        <div className="flex items-center justify-center text-sm text-gray-600">
          {mode === 'sign-in' ? (
            <>
              <span className="mr-2 text-gray-500">Don&apos;t have an account?</span>
              <button
                type="button"
                onClick={handleToggleMode}
                className="font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <span className="mr-2 text-gray-500">Already have an account?</span>
              <button
                type="button"
                onClick={handleToggleMode}
                className="font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
