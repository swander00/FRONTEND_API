# Google OAuth & One Tap Setup - Complete Guide

## ✅ What Has Been Implemented

1. **Google OAuth Button** - Added to `AuthModal` component
2. **Google One Tap** - Automatic sign-in prompt component
3. **Environment Variables** - Updated `env.example` with `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
4. **Layout Integration** - One Tap initialized in root layout

## ⚠️ Configuration Fixes Needed

### Google Cloud Console - Redirect URIs

**Current Issue:** Some redirect URIs are incorrect.

**What to Fix:**

1. **Remove incorrect redirect URIs:**
   - ❌ `http://localhost:3000/auth/v1/callback` (should be `/auth/callback`)
   - ❌ `http://localhost:3001/auth/v1/callback` (should be `/auth/callback`)
   - ❌ `http://localhost:3002/auth/v1/callback` (should be `/auth/callback`)
   - ❌ `https://frontend-api-pi.vercel.app` (missing `/auth/callback` path)

2. **Add correct redirect URIs:**
   - ✅ `http://localhost:3000/auth/callback`
   - ✅ `http://localhost:3001/auth/callback`
   - ✅ `http://localhost:3002/auth/callback`
   - ✅ `https://frontend-api-pi.vercel.app/auth/callback`

3. **Keep these Supabase redirect URIs (they're correct):**
   - ✅ `https://gyeviskmqtkskcoyyprp.supabase.co`
   - ✅ `https://gyeviskmqtkskcoyyprp.supabase.co/auth/v1/callback`

### Final Redirect URI List Should Be:

**Authorized JavaScript Origins:**
- `http://localhost:3000`
- `http://localhost:3001`
- `https://frontend-api-pi.vercel.app`

**Authorized Redirect URIs:**
- `http://localhost:3000/auth/callback`
- `http://localhost:3001/auth/callback`
- `http://localhost:3002/auth/callback`
- `https://frontend-api-pi.vercel.app/auth/callback`
- `https://gyeviskmqtkskcoyyprp.supabase.co`
- `https://gyeviskmqtkskcoyyprp.supabase.co/auth/v1/callback`

## ✅ Supabase Configuration

Your Supabase configuration looks correct:
- ✅ Client ID configured
- ✅ Client Secret configured
- ✅ Callback URL: `https://gyeviskmqtkskcoyyprp.supabase.co/auth/v1/callback`

## 📝 Environment Variables Setup

1. **Add to your `.env.local` file:**

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=171372662622-50e03jvcdshuvcvbknklea9e2kl6dltf.apps.googleusercontent.com
```

**Important:** Use the **exact same Client ID** that's configured in Supabase.

2. **Restart your dev server:**
```bash
npm run dev
```

## 🧪 Testing

### Test Google OAuth Button:
1. Open your app
2. Click "Sign In" or "Sign Up"
3. Click "Continue with Google" button
4. Should redirect to Google OAuth flow
5. After authentication, should redirect back to `/auth/callback`

### Test Google One Tap:
1. Sign out of your app (if signed in)
2. Make sure you're signed into Google in your browser
3. Visit your app homepage
4. You should see a small Google One Tap prompt (usually bottom-right)
5. Click it to sign in instantly without redirect

## 🔍 Troubleshooting

### One Tap Not Showing?
- Check that `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly
- User must be signed into Google in their browser
- Domain must be in Authorized JavaScript origins
- Check browser console for errors
- One Tap won't show if user dismissed it recently

### OAuth Redirect Not Working?
- Verify redirect URIs in Google Cloud Console match exactly
- Check that Supabase callback URL is correct
- Ensure redirect URIs don't have trailing slashes
- Wait 5 minutes after changing Google Cloud Console settings

### Sign-In Fails?
- Verify Client ID matches between Google Cloud Console and Supabase
- Check that Client Secret is correct in Supabase
- Review browser console and Supabase logs for errors

## 📚 Files Modified

- `FRONTEND_API/components/auth/AuthModal.tsx` - Added Google OAuth button
- `FRONTEND_API/components/auth/GoogleOneTap.tsx` - New One Tap component
- `FRONTEND_API/app/layout.tsx` - Added One Tap initialization
- `FRONTEND_API/env.example` - Added `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

## 🎯 Next Steps

1. ✅ Fix redirect URIs in Google Cloud Console (see above)
2. ✅ Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to `.env.local`
3. ✅ Restart dev server
4. ✅ Test both OAuth button and One Tap
5. ✅ Deploy to production and add production redirect URI

