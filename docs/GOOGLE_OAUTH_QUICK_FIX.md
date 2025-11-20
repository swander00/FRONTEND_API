# Google OAuth Quick Fix Guide

## 🚨 Immediate Fix for "Something went wrong" Error

### Step 1: Fix Redirect URIs in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Click on your OAuth 2.0 Client ID (the one with Client ID ending in `.apps.googleusercontent.com`)
3. Scroll to **"Authorized redirect URIs"**
4. **Remove these incorrect URIs:**
   - `http://localhost:3000/auth/v1/callback` ❌
   - `http://localhost:3001/auth/v1/callback` ❌
   - `http://localhost:3002/auth/v1/callback` ❌
   - `https://frontend-api-pi.vercel.app` ❌ (missing path)

5. **Add these correct URIs:**
   - `http://localhost:3000/auth/callback` ✅
   - `http://localhost:3001/auth/callback` ✅ (if you use this port)
   - `https://frontend-api-pi.vercel.app/auth/callback` ✅

6. **Keep these Supabase URIs (they're correct):**
   - `https://gyeviskmqtkskcoyyprp.supabase.co` ✅
   - `https://gyeviskmqtkskcoyyprp.supabase.co/auth/v1/callback` ✅

7. Click **"Save"**

### Step 2: Verify OAuth Consent Screen

The OAuth Consent Screen is what users see when signing in with Google. It must be properly configured.

#### Step 2.1: Navigate to OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure you're in the **correct project** (the one with your OAuth Client ID)
3. In the left sidebar, click **"APIs & Services"**
4. Click **"OAuth consent screen"** (or go directly: https://console.cloud.google.com/apis/credentials/consent)

#### Step 2.2: Check/Configure App Information

If you haven't set this up yet, you'll need to fill out the form:

**Required Fields:**

1. **App name** (Required):
   - Enter: `RealEstate App Auth` (or your app name)
   - This is what users see: "Sign in to [App Name] with Google"

2. **User support email** (Required):
   - Select your email from the dropdown
   - This is where Google sends important notifications

3. **Application home page** (Required):
   - Enter: `https://frontend-api-pi.vercel.app` (your production URL)

4. **Application privacy policy link** (Required for External apps):
   - Enter a URL (even a placeholder works for testing)
   - Example: `https://frontend-api-pi.vercel.app/privacy`
   - **Note:** You can create this page later, but you need a URL now

5. **Authorized domains** (Important):
   - Click **"+ ADD DOMAIN"**
   - Add: `localhost` (for development - no http://)
   - Add: `vercel.app` (for Vercel deployments - no https://)
   - Add your custom domain if you have one

6. **Developer contact information** (Required):
   - Enter your email address

Click **"SAVE AND CONTINUE"** after filling out required fields.

#### Step 2.3: Configure Scopes

Scopes define what information your app can access from Google.

**Required Scopes for Basic Sign-In:**

1. Click **"+ ADD OR REMOVE SCOPES"**
2. Search for: `userinfo.email` and check `.../auth/userinfo.email`
3. Search for: `userinfo.profile` and check `.../auth/userinfo.profile`
4. Click **"UPDATE"**

**Minimum Required Scopes:**
- ✅ `.../auth/userinfo.email` - To get user's email
- ✅ `.../auth/userinfo.profile` - To get user's name and picture

Click **"SAVE AND CONTINUE"** after adding scopes.

#### Step 2.4: Add Test Users (If in Testing Mode)

**Important:** If your app is in "Testing" mode, only test users can sign in.

1. Click **"+ ADD USERS"**
2. Enter your Google email address (the one you'll use to test)
3. Click **"ADD"**
4. You can add multiple test users (one per line)
5. Click **"SAVE AND CONTINUE"**

**Note:** Add ALL email addresses you'll use for testing. Only these emails can sign in while in Testing mode.

#### Step 2.5: Verify Publishing Status

After setup, check the OAuth consent screen dashboard:

**Two Options:**

**Option A: Testing Mode (Recommended for Development)**
- ✅ Status shows: **"Testing"**
- ✅ Good for development and testing
- ✅ Only test users can sign in
- ✅ No verification needed

**Option B: In Production**
- ✅ Status shows: **"In production"**
- ✅ Anyone can sign in
- ⚠️ Requires Google verification (can take days)

**For Now:** Stay in **Testing mode** and make sure you've added your email as a test user.

#### Step 2.6: Final Verification Checklist

Go through this checklist:

- [ ] **App name** is set
- [ ] **User support email** is set
- [ ] **Application home page** URL is correct
- [ ] **Privacy policy** URL is set (even if placeholder)
- [ ] **Authorized domains** include:
  - [ ] `localhost`
  - [ ] `vercel.app` (or your custom domain)
- [ ] **Scopes** include:
  - [ ] `.../auth/userinfo.email`
  - [ ] `.../auth/userinfo.profile`
- [ ] **Test users** include your email (if in Testing mode)
- [ ] **Publishing status** is "Testing" or "In production"

#### Common Issues:

**"App verification required" warning:**
- ✅ This is normal in Testing mode
- ✅ Only test users will see this
- ✅ Add your email as a test user

**"Invalid domain" error:**
- ❌ Don't include `http://` or `https://`
- ✅ Just use: `localhost`, `vercel.app`, `yourdomain.com`

**"Privacy policy required":**
- ✅ You must provide a URL (even placeholder works)
- ✅ Create the actual page later

**📚 For detailed step-by-step instructions with screenshots, see: `GOOGLE_OAUTH_CONSENT_SCREEN_SETUP.md`**

### Step 3: Verify Client ID Match

**Check these three places have the SAME Client ID:**

1. **Google Cloud Console:** Your OAuth 2.0 Client ID
2. **Supabase Dashboard:** Authentication → Providers → Google → Client ID
3. **Your `.env.local`:** `NEXT_PUBLIC_GOOGLE_CLIENT_ID=...`

**Your Client ID should be:**
```
171372662622-50e03jvcdshuvcvbknklea9e2kl6dltf.apps.googleusercontent.com
```

### Step 4: Wait and Test

1. ⏱️ **Wait 5-15 minutes** for Google Cloud Console changes to propagate
2. **Clear browser cache/cookies** or use incognito mode
3. **Restart your dev server:**
   ```bash
   npm run dev
   ```
4. **Try signing in again**

## ✅ Expected Result

After clicking "Continue with Google":
1. You should be redirected to Google's sign-in page
2. After signing in, you'll be redirected back to your app
3. You'll be automatically signed in

## 🔍 Still Not Working?

Check the browser console (F12 → Console) for specific error messages:
- `redirect_uri_mismatch` → Redirect URIs don't match
- `invalid_client` → Client ID mismatch
- `access_denied` → OAuth consent screen issue

See `GOOGLE_OAUTH_ERROR_TROUBLESHOOTING.md` for detailed troubleshooting.

