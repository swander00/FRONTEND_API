'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/buttons/Button';
import { cn } from '@/lib/utils';
import { useSupabaseBrowserClient } from '@/hooks/useSupabaseBrowserClient';
import { AuthModal, type AuthMode } from './AuthModal';

const MODAL_TRANSITION = 220;

type AuthTriggerButtonProps = {
  className?: string;
  initialMode?: AuthMode;
  showLabelWhenAuthenticated?: boolean;
};

export function AuthTriggerButton({
  className,
  initialMode = 'sign-in',
  showLabelWhenAuthenticated = false,
}: AuthTriggerButtonProps) {
  const supabase = useSupabaseBrowserClient();

  const [session, setSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [modalMode, setModalMode] = useState<AuthMode>(initialMode);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setSession(data.session ?? null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        setIsModalOpen(false);
        setIsModalClosing(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const openModal = useCallback(
    (mode: AuthMode) => {
      setModalMode(mode);
      setIsModalClosing(false);
      setIsModalOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setIsModalClosing(true);
    window.setTimeout(() => {
      setIsModalOpen(false);
      setIsModalClosing(false);
    }, MODAL_TRANSITION);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    window.setTimeout(() => {
      closeModal();
    }, 120);
  }, [closeModal]);

  const handleSignOut = useCallback(async () => {
    setIsMenuOpen(false);
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
  }, [supabase]);

  const user = session?.user ?? null;
  const initials = useMemo(() => getUserInitials(user), [user]);
  const displayName = useMemo(() => getDisplayName(user), [user]);
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  return (
    <div className="relative">
      {user ? (
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={cn(
              'flex items-center gap-2 rounded-full border border-transparent bg-white px-3 py-1.5 shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
              className,
              isMenuOpen && 'shadow-lg'
            )}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName ?? 'User avatar'}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                {initials}
              </span>
            )}
            {showLabelWhenAuthenticated && (
              <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                {displayName}
                <svg
                  className="h-4 w-4 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
                </svg>
              </span>
            )}
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-lg">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Signed in as
              </div>
              <div className="px-3 pb-2 text-sm font-medium text-gray-700">
                {displayName ?? user.email}
              </div>
              <div className="my-2 h-px bg-gray-100" />
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l3 3m0 0l-3 3m3-3H8m5 5a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v2"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <Button
          type="button"
          variant="primary"
          size="sm"
          className={cn(
            'rounded-full px-5 text-sm font-semibold shadow-md shadow-blue-200 transition-all duration-200 hover:shadow-lg focus-visible:ring-blue-500',
            className
          )}
          onClick={() => openModal(initialMode)}
        >
          Sign In / Sign Up
        </Button>
      )}

      <AuthModal
        isOpen={isModalOpen}
        onClose={closeModal}
        isClosing={isModalClosing}
        initialMode={modalMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

function getUserInitials(user: User | null): string {
  if (!user) {
    return 'U';
  }

  const fullName = (user.user_metadata?.full_name as string | undefined)?.trim();

  if (!fullName) {
    return user.email?.[0]?.toUpperCase() ?? 'U';
  }

  const [first, second] = fullName.split(' ').map((part) => part[0]?.toUpperCase()).filter(Boolean);

  if (first && second) {
    return `${first}${second}`;
  }

  return first ?? user.email?.[0]?.toUpperCase() ?? 'U';
}

function getDisplayName(user: User | null): string | undefined {
  if (!user) {
    return undefined;
  }

  const fullName = user.user_metadata?.full_name as string | undefined;
  if (fullName && fullName.trim().length > 0) {
    return fullName;
  }

  if (user.email) {
    return user.email;
  }

  return undefined;
}
