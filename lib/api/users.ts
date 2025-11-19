/**
 * User API Client
 * 
 * Functions for interacting with user-related endpoints
 */

import { getAuthenticatedClient } from './authenticatedClient';

export interface UserProfile {
  Id: string;
  Email: string;
  FirstName: string | null;
  LastName: string | null;
  Phone: string | null;
  AvatarUrl: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  LastLoginAt: string | null;
}

export interface UserBuyerPreferences {
  Id: string;
  UserId: string;
  FirstTimeBuyer: boolean | null;
  PreApproved: boolean | null;
  HasHouseToSell: boolean | null;
  PurchaseTimeframe: '0-3' | '3-6' | '6-12' | '12+' | null;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface OnboardingStatus {
  profileComplete: boolean;
  preferencesComplete: boolean;
  completedAt: string | null;
}

/**
 * Get current user's profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  const client = getAuthenticatedClient();
  return client.get<UserProfile>('/api/users/profile');
}

/**
 * Update current user's profile
 */
export async function updateUserProfile(updates: Partial<Pick<UserProfile, 'FirstName' | 'LastName' | 'Phone' | 'AvatarUrl'>>): Promise<UserProfile> {
  const client = getAuthenticatedClient();
  return client.put<UserProfile>('/api/users/profile', updates);
}

/**
 * Get current user's buyer preferences
 */
export async function getUserPreferences(): Promise<UserBuyerPreferences | null> {
  const client = getAuthenticatedClient();
  return client.get<UserBuyerPreferences | null>('/api/users/preferences');
}

/**
 * Update current user's buyer preferences
 */
export async function updateUserPreferences(
  preferences: Partial<Pick<UserBuyerPreferences, 'FirstTimeBuyer' | 'PreApproved' | 'HasHouseToSell' | 'PurchaseTimeframe'>>
): Promise<UserBuyerPreferences> {
  const client = getAuthenticatedClient();
  return client.put<UserBuyerPreferences>('/api/users/preferences', preferences);
}

/**
 * Get onboarding status
 */
export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  const client = getAuthenticatedClient();
  return client.get<OnboardingStatus>('/api/users/onboarding-status');
}

