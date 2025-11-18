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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          scopes: 'email profile',
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Google sign-in failed. Please try again.',
      });
      setIsGoogleLoading(false);
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
        'z-[120]',
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
                : 'Join PropertyHub to save listings, receive alerts, and more.'}
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
          disabled={isSubmitting || isGoogleLoading || !isSupabaseReady}
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
            disabled={isSubmitting || isGoogleLoading || !isSupabaseReady}
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
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-400">or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="rounded-full border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isSubmitting || !isSupabaseReady}
        >
          <span className="mr-2 flex h-5 w-5 items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M21.35 11.1h-9.17v2.96h5.27c-.22 1.26-.92 2.33-1.96 3.04v2.53h3.17c1.86-1.72 2.93-4.26 2.93-7.24 0-.7-.06-1.23-.14-1.82z"
                fill="#4285F4"
              />
              <path
                d="M12.18 22c2.7 0 4.96-.9 6.61-2.37l-3.17-2.53c-.9.6-2.06.96-3.44.96-2.64 0-4.87-1.78-5.66-4.16H3.22v2.6C4.86 19.92 8.27 22 12.18 22z"
                fill="#34A853"
              />
              <path
                d="M6.52 13.9c-.2-.6-.32-1.24-.32-1.9s.12-1.3.32-1.9V7.5H3.22A9.78 9.78 0 002.36 12c0 1.56.36 3.03.86 4.5l3.3-2.6z"
                fill="#FBBC05"
              />
              <path
                d="M12.18 5.5c1.47 0 2.79.5 3.84 1.48l2.87-2.87C17.13 2.94 14.87 2 12.18 2 8.27 2 4.86 4.08 3.22 7.5l3.3 2.6c.79-2.38 3.02-4.6 5.66-4.6z"
                fill="#EA4335"
              />
              <path d="M2 2h20v20H2z" fill="none" />
            </svg>
          </span>
          {isGoogleLoading ? 'Redirecting…' : 'Continue with Google'}
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
