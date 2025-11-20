'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Session, User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/buttons/Button';
import { cn } from '@/lib/utils';
import { useSupabaseBrowserClient } from '@/hooks/useSupabaseBrowserClient';
import { useUserProfile } from '@/hooks/useUserProfile';
import { AuthModal, type AuthMode } from './AuthModal';
import { ProfileModal } from './ProfileModal';
import { LikedListingsModal } from './LikedListingsModal';
import { SavedListingsModal } from './SavedListingsModal';
import { SavedSearchesModal } from './SavedSearchesModal';

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
  const { profile } = useUserProfile();
  const pathname = usePathname();

  const [session, setSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [modalMode, setModalMode] = useState<AuthMode>(initialMode);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileModalClosing, setIsProfileModalClosing] = useState(false);
  const [isLikedListingsModalOpen, setIsLikedListingsModalOpen] = useState(false);
  const [isLikedListingsModalClosing, setIsLikedListingsModalClosing] = useState(false);
  const [isSavedListingsModalOpen, setIsSavedListingsModalOpen] = useState(false);
  const [isSavedListingsModalClosing, setIsSavedListingsModalClosing] = useState(false);
  const [isSavedSearchesModalOpen, setIsSavedSearchesModalOpen] = useState(false);
  const [isSavedSearchesModalClosing, setIsSavedSearchesModalClosing] = useState(false);
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

    // Use a small delay to ensure click events on buttons fire first
    const timeoutId = setTimeout(() => {
      window.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('click', handleClickOutside);
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

  const openProfileModal = useCallback(() => {
    setIsProfileModalClosing(false);
    setIsProfileModalOpen(true);
    setIsMenuOpen(false);
  }, []);

  const closeProfileModal = useCallback(() => {
    setIsProfileModalClosing(true);
    window.setTimeout(() => {
      setIsProfileModalOpen(false);
      setIsProfileModalClosing(false);
    }, MODAL_TRANSITION);
  }, []);

  const openLikedListingsModal = useCallback(() => {
    console.log('Opening LikedListingsModal');
    setIsLikedListingsModalClosing(false);
    setIsLikedListingsModalOpen(true);
    setIsMenuOpen(false);
  }, []);

  const closeLikedListingsModal = useCallback(() => {
    setIsLikedListingsModalClosing(true);
    window.setTimeout(() => {
      setIsLikedListingsModalOpen(false);
      setIsLikedListingsModalClosing(false);
    }, MODAL_TRANSITION);
  }, []);

  const openSavedListingsModal = useCallback(() => {
    console.log('Opening SavedListingsModal');
    setIsSavedListingsModalClosing(false);
    setIsSavedListingsModalOpen(true);
    setIsMenuOpen(false);
  }, []);

  const closeSavedListingsModal = useCallback(() => {
    setIsSavedListingsModalClosing(true);
    window.setTimeout(() => {
      setIsSavedListingsModalOpen(false);
      setIsSavedListingsModalClosing(false);
    }, MODAL_TRANSITION);
  }, []);

  const openSavedSearchesModal = useCallback(() => {
    console.log('Opening SavedSearchesModal');
    setIsSavedSearchesModalClosing(false);
    setIsSavedSearchesModalOpen(true);
    setIsMenuOpen(false);
  }, []);

  const closeSavedSearchesModal = useCallback(() => {
    setIsSavedSearchesModalClosing(true);
    window.setTimeout(() => {
      setIsSavedSearchesModalOpen(false);
      setIsSavedSearchesModalClosing(false);
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
    
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        // Still continue with cleanup even if there's an error
      }
      
      // Redirect to home page after sign out
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  }, [supabase]);

  const user = session?.user ?? null;
  const initials = useMemo(() => getUserInitials(user, profile), [user, profile]);
  const displayName = useMemo(() => getDisplayName(user, profile), [user, profile]);
  const avatarUrl = useMemo(() => {
    // Check profile first (most reliable), then fallback to auth metadata
    if (profile?.AvatarUrl) {
      return profile.AvatarUrl;
    }
    // Check multiple possible avatar fields from OAuth providers
    const metadata = user?.user_metadata;
    return metadata?.avatar_url || metadata?.picture || metadata?.image || undefined;
  }, [user, profile]);

  return (
    <div className="relative">
      {user ? (
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={cn(
              'flex items-center gap-2 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
              className
            )}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName ?? 'User avatar'}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
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
            <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-lg">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Signed in as
              </div>
              <div className="px-3 pb-2 text-sm font-medium text-gray-700">
                {displayName ?? user.email}
              </div>
              <div className="my-2 h-px bg-gray-100" />
              
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openProfileModal();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Liked Listings button clicked');
                  openLikedListingsModal();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Liked Listings
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openSavedListingsModal();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
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
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                Saved Listings
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Saved Searches button clicked');
                  openSavedSearchesModal();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Saved Searches
              </button>

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

      {user && (
        <>
          <ProfileModal
            isOpen={isProfileModalOpen}
            onClose={closeProfileModal}
            isClosing={isProfileModalClosing}
            user={user}
          />
          <LikedListingsModal
            isOpen={isLikedListingsModalOpen}
            onClose={closeLikedListingsModal}
            isClosing={isLikedListingsModalClosing}
          />
          <SavedListingsModal
            isOpen={isSavedListingsModalOpen}
            onClose={closeSavedListingsModal}
            isClosing={isSavedListingsModalClosing}
          />
          <SavedSearchesModal
            isOpen={isSavedSearchesModalOpen}
            onClose={closeSavedSearchesModal}
            isClosing={isSavedSearchesModalClosing}
          />
        </>
      )}
    </div>
  );
}

function getUserInitials(user: User | null, profile?: { FirstName?: string | null; LastName?: string | null } | null): string {
  if (!user) {
    return 'U';
  }

  // Try profile first
  if (profile?.FirstName || profile?.LastName) {
    const first = profile.FirstName?.[0]?.toUpperCase() || '';
    const last = profile.LastName?.[0]?.toUpperCase() || '';
    if (first && last) {
      return `${first}${last}`;
    }
    if (first) {
      return first;
    }
  }

  // Fallback to auth metadata
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

function getDisplayName(user: User | null, profile?: { FirstName?: string | null; LastName?: string | null } | null): string | undefined {
  if (!user) {
    return undefined;
  }

  // Try profile first
  if (profile?.FirstName || profile?.LastName) {
    const name = [profile.FirstName, profile.LastName].filter(Boolean).join(' ');
    if (name.trim()) {
      return name;
    }
  }

  // Fallback to auth metadata
  const fullName = user.user_metadata?.full_name as string | undefined;
  if (fullName && fullName.trim().length > 0) {
    return fullName;
  }

  if (user.email) {
    return user.email;
  }

  return undefined;
}
