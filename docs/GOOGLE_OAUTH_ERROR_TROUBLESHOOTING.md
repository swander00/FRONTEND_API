# Google OAuth Error Troubleshooting

## Error: "Can't continue with google.com - Something went wrong"

This error typically occurs due to configuration mismatches. Follow these steps:

## 🔍 Step-by-Step Troubleshooting

### 1. Verify Redirect URIs in Google Cloud Console

**Critical:** The redirect URIs must match EXACTLY (case-sensitive, no trailing slashes).

Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → Your OAuth 2.0 Client ID

**Authorized Redirect URIs must include:**

✅ **Supabase Callback (REQUIRED):**
- `https://gyeviskmqtkskcoyyprp.supabase.co/auth/v1/callback`

✅ **Your Frontend Callbacks (for direct redirects):**
- `http://localhost:3000/auth/callback`
- `http://localhost:3001/auth/callback` (if using different port)
- `https://frontend-api-pi.vercel.app/auth/callback` (production)

**Common Mistakes:**
- ❌ Using `/auth/v1/callback` for frontend (that's Supabase's path)
- ❌ Missing `/auth/callback` path
- ❌ Trailing slashes
- ❌ Using `https://` for localhost

### 2. Verify OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials/consent)
2. Check that OAuth consent screen is configured:
   - **User Type:** External (or Internal if using Google Workspace)
   - **App name:** Set
   - **User support email:** Set
   - **Developer contact:** Set
   - **Scopes:** At minimum, `.../auth/userinfo.email` and `.../auth/userinfo.profile`

3. **Authorized domains:**
   - Add `localhost` (for development)
   - Add `vercel.app` (for Vercel deployment)
   - Add your custom domain if applicable

### 3. Verify Client ID Match

**Critical:** The Client ID must be IDENTICAL in three places:

1. **Google Cloud Console** → OAuth 2.0 Client ID
2. **Supabase Dashboard** → Authentication → Providers → Google → Client ID
3. **Your `.env.local`** → `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

**To verify:**
```bash
# Check your .env.local file
cat .env.local | grep GOOGLE_CLIENT_ID

# Should match exactly what's in Supabase and Google Cloud Console
```

### 4. Verify Client Secret in Supabase

1. Go to Supabase Dashboard → Authentication → Providers → Google
2. Ensure Client Secret is set (it should be masked with dots)
3. If missing, copy from Google Cloud Console → OAuth 2.0 Client ID → Client Secret

### 5. Check Browser Console for Detailed Errors

Open browser DevTools (F12) → Console tab, and look for:
- CORS errors
- Redirect URI mismatch errors
- Client ID errors

### 6. Wait for Changes to Propagate

After making changes in Google Cloud Console:
- ⏱️ Wait **5-15 minutes** for changes to propagate
- Clear browser cache/cookies
- Try in incognito/private mode

### 7. Verify Supabase Configuration

In Supabase Dashboard → Authentication → URL Configuration:

**Site URL:** Should be your frontend URL
- Development: `http://localhost:3000`
- Production: `https://frontend-api-pi.vercel.app`

**Redirect URLs:** Should include:
- `http://localhost:3000/auth/callback`
- `https://frontend-api-pi.vercel.app/auth/callback`

## 🔧 Quick Fix Checklist

- [ ] Redirect URIs in Google Cloud Console match exactly (no typos)
- [ ] OAuth consent screen is published (not in testing mode unless you added test users)
- [ ] Client ID matches in Google Cloud Console, Supabase, and `.env.local`
- [ ] Client Secret is set in Supabase
- [ ] Site URL and Redirect URLs are configured in Supabase
- [ ] Waited 5-15 minutes after making changes
- [ ] Cleared browser cache/cookies
- [ ] Checked browser console for specific error messages

## 🧪 Test with Minimal Configuration

Try with just these redirect URIs first:

**Authorized Redirect URIs:**
1. `https://gyeviskmqtkskcoyyprp.supabase.co/auth/v1/callback` (Supabase - REQUIRED)
2. `http://localhost:3000/auth/callback` (Your frontend)

Remove all other redirect URIs temporarily to isolate the issue.

## 📝 Common Error Messages & Solutions

| Error Message | Likely Cause | Solution |
|--------------|--------------|----------|
| "redirect_uri_mismatch" | Redirect URI not in allowed list | Add exact URI to Google Cloud Console |
| "invalid_client" | Client ID mismatch | Verify Client ID matches everywhere |
| "access_denied" | OAuth consent screen issue | Check consent screen configuration |
| "Something went wrong" | Generic error, usually redirect URI | Check all redirect URIs match exactly |

## 🆘 Still Not Working?

1. **Check Supabase Logs:**
   - Supabase Dashboard → Logs → Auth Logs
   - Look for specific error messages

2. **Test OAuth Flow Manually:**
   - Try signing in directly through Supabase Dashboard → Authentication → Users → Add User → OAuth

3. **Verify Network Tab:**
   - Open DevTools → Network tab
   - Look for failed requests to `accounts.google.com` or `supabase.co`
   - Check response bodies for error details

4. **Double-check Environment Variables:**
   ```bash
   # Make sure these are set
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   echo $NEXT_PUBLIC_GOOGLE_CLIENT_ID
   ```

## ✅ Expected Flow

When working correctly:

1. User clicks "Continue with Google"
2. Redirects to: `https://accounts.google.com/o/oauth2/v2/auth?...`
3. User signs in with Google
4. Google redirects to: `https://gyeviskmqtkskcoyyprp.supabase.co/auth/v1/callback?...`
5. Supabase processes auth and redirects to: `http://localhost:3000/auth/callback?...`
6. Your app handles the callback and creates/updates user session

If any step fails, check the configuration for that step.

