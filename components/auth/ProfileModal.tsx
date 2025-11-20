'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { BaseModal } from '@/components/search/FiltersContainer/Shared/Modals/BaseModal';
import { Input } from '@/components/ui/inputs/Input';
import { Button } from '@/components/ui/buttons/Button';
import { cn } from '@/lib/utils';
import { useSupabaseBrowserClient } from '@/hooks/useSupabaseBrowserClient';
import { useUserProfile } from '@/hooks/useUserProfile';
import type { User } from '@supabase/supabase-js';

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isClosing?: boolean;
  user: User | null;
};

type MessageState = {
  tone: 'success' | 'error' | 'info';
  text: string;
} | null;

const TRANSITION_DURATION = 220;

export function ProfileModal({
  isOpen,
  onClose,
  isClosing = false,
  user,
}: ProfileModalProps) {
  const supabase = useSupabaseBrowserClient();
  const { profile, updateProfile, isUpdating } = useUserProfile();
  const isSupabaseReady = Boolean(supabase);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [message, setMessage] = useState<MessageState>(null);

  // Initialize form data from profile
  useEffect(() => {
    if (profile) {
      setFirstName(profile.FirstName || '');
      setLastName(profile.LastName || '');
      setPhone(profile.Phone || '');
      setAvatarUrl(profile.AvatarUrl || '');
    }
  }, [profile, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setMessage(null);
      setShowPasswordSection(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isOpen]);

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase || !profile) {
      setMessage({
        tone: 'error',
        text: 'Profile service is still initializing. Please try again in a moment.',
      });
      return;
    }

    try {
      setIsChangingPassword(false);
      setMessage({ tone: 'info', text: 'Updating profile…' });

      await updateProfile({
        FirstName: firstName.trim() || null,
        LastName: lastName.trim() || null,
        Phone: phone.trim() || null,
        AvatarUrl: avatarUrl.trim() || null,
      });

      setMessage({ tone: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Failed to update profile. Please try again.',
      });
    }
  };

  const handlePasswordChange = async () => {
    if (!supabase) {
      setMessage({
        tone: 'error',
        text: 'Authentication service is still initializing. Please try again in a moment.',
      });
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ tone: 'error', text: 'Please fill in all password fields.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ tone: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ tone: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    try {
      setIsChangingPassword(true);
      setMessage({ tone: 'info', text: 'Updating password…' });

      // First verify current password by attempting to sign in
      if (!user?.email) {
        throw new Error('Email not found');
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('Current password is incorrect.');
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setMessage({ tone: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Failed to update password. Please try again.',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getUserInitials = (): string => {
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
    return user?.email?.[0]?.toUpperCase() ?? 'U';
  };

  const getDisplayName = (): string => {
    if (profile?.FirstName || profile?.LastName) {
      return [profile.FirstName, profile.LastName].filter(Boolean).join(' ') || user?.email || 'User';
    }
    return user?.email || 'User';
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
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
      size="md"
      contentClassName="p-0 overflow-y-auto"
    >
      <div className="flex flex-col gap-6 bg-white p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Profile Settings</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your account information and preferences.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            aria-label="Close profile modal"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l8 8M14 6l-8 8" />
            </svg>
          </button>
        </div>

        {/* Avatar Section */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          <div className="flex-shrink-0">
            {profile?.AvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.AvatarUrl}
                alt={getDisplayName()}
                className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-semibold text-blue-700 border-2 border-gray-200">
                {getUserInitials()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{getDisplayName()}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Profile Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Profile Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="John"
                disabled={isUpdating || !isSupabaseReady}
              />

              <Input
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Doe"
                disabled={isUpdating || !isSupabaseReady}
              />
            </div>

            <Input
              label="Email"
              name="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-gray-50"
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+1 (555) 123-4567"
              disabled={isUpdating || !isSupabaseReady}
            />

            <Input
              label="Avatar URL"
              name="avatarUrl"
              type="url"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://example.com/avatar.jpg"
              disabled={isUpdating || !isSupabaseReady}
            />
          </div>

          {/* Account Information */}
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Account Information</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Member since:</span>
                <span className="font-medium">{formatDate(profile?.CreatedAt)}</span>
              </div>
              {profile?.LastLoginAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Last login:</span>
                  <span className="font-medium">{formatDate(profile.LastLoginAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Password</h3>
              <button
                type="button"
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
              >
                {showPasswordSection ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {showPasswordSection && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="Enter current password"
                  disabled={isChangingPassword || !isSupabaseReady}
                />

                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Enter new password"
                  disabled={isChangingPassword || !isSupabaseReady}
                />

                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm new password"
                  disabled={isChangingPassword || !isSupabaseReady}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword || !isSupabaseReady}
                  className="w-full"
                >
                  {isChangingPassword ? 'Updating Password…' : 'Update Password'}
                </Button>
              </div>
            )}
          </div>

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

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="flex-1 rounded-full"
              disabled={isUpdating || !isSupabaseReady}
            >
              {isUpdating ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
}

