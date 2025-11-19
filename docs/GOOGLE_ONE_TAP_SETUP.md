# Google One Tap Setup Guide

## Overview

Google One Tap is now integrated into your app! It will automatically show a small sign-in prompt when users visit your site (if they're signed into Google in their browser).

## Setup Instructions

### 1. Get Your Google OAuth Client ID

You need the **same Google OAuth Client ID** that you configured in Supabase.

**Option A: From Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers** → **Google**
3. Copy the **Client ID** (it looks like: `123456789-abc...xyz.apps.googleusercontent.com`)

**Option B: From Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your project (or the one used by Supabase)
3. Find your OAuth 2.0 Client ID
4. Copy the Client ID

### 2. Add to Environment Variables

Add the Client ID to your `.env.local` file:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**Important:** This must be the **same Client ID** configured in Supabase for Google OAuth.

### 3. Configure Authorized JavaScript Origins

In Google Cloud Console, make sure your domain is added to **Authorized JavaScript origins**:

- For local development: `http://localhost:3000`
- For production: `https://your-domain.com`

### 4. Restart Your Dev Server

After adding the environment variable, restart your Next.js dev server:

```bash
npm run dev
```

## How It Works

1. **Automatic Display**: One Tap automatically appears when:
   - User is not authenticated
   - User is signed into Google in their browser
   - User hasn't dismissed it recently

2. **User Experience**: 
   - Small banner appears (usually bottom-right)
   - User clicks to sign in instantly
   - No redirect to Google's OAuth page
   - Seamless sign-in experience

3. **Fallback**: If One Tap fails or isn't available, it automatically falls back to the regular Google OAuth flow.

## Features

- ✅ Automatic prompt when user visits site
- ✅ One-click sign-in (no redirect)
- ✅ Respects user's privacy (can be dismissed)
- ✅ Works alongside existing login button
- ✅ Automatically hides when user is authenticated
- ✅ Fallback to OAuth if One Tap unavailable

## Troubleshooting

### One Tap Not Showing?

1. **Check Client ID**: Make sure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly
2. **Check Browser**: User must be signed into Google in their browser
3. **Check Domain**: Your domain must be in Authorized JavaScript origins
4. **Check Console**: Look for any errors in browser console
5. **User Dismissed**: If user dismissed it, it won't show again for a while

### One Tap Shows But Sign-In Fails?

- This usually means the Client ID doesn't match Supabase's configuration
- Make sure you're using the **exact same Client ID** in both places
- Check Supabase logs for authentication errors

## Testing

1. Sign out of your app (if signed in)
2. Make sure you're signed into Google in your browser
3. Visit your app - you should see the One Tap prompt
4. Click it to sign in instantly

## Notes

- One Tap respects user privacy and won't show if:
  - User dismissed it recently
  - Browser doesn't support it
  - User is in incognito/private mode
  - User has disabled third-party cookies

- The prompt automatically disappears when:
  - User is authenticated
  - User clicks outside the prompt
  - User navigates away

