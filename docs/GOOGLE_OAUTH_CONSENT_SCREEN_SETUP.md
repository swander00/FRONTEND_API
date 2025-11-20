# Google OAuth Consent Screen - Step-by-Step Setup Guide

## Overview

The OAuth Consent Screen is what users see when they sign in with Google. It must be properly configured for OAuth to work.

## Step-by-Step Instructions

### Step 1: Navigate to OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure you're in the **correct project** (the one with your OAuth Client ID)
3. In the left sidebar, click **"APIs & Services"**
4. Click **"OAuth consent screen"** (or go directly: https://console.cloud.google.com/apis/credentials/consent)

### Step 2: Choose User Type

You'll see a screen asking "What user type do you need?"

**Option A: External (Recommended for most apps)**
- ✅ Choose this if your app is for general public use
- ✅ Anyone with a Google account can sign in
- ✅ Requires verification if you request sensitive scopes

**Option B: Internal (Only for Google Workspace)**
- Only choose this if you're using Google Workspace (G Suite)
- Only users in your organization can sign in
- Usually not applicable for public apps

**Action:** Select **"External"** and click **"CREATE"**

### Step 3: Fill Out App Information

You'll see a form with several sections. Fill these out:

#### App Information

**App name** (Required):
- Enter: `RealEstate App Auth` (or your app name)
- This is what users see when signing in
- Example: "Sign in to RealEstate App Auth with Google"

**User support email** (Required):
- Select your email from the dropdown
- This is where Google will send important notifications
- Users can contact you at this email

**App logo** (Optional):
- You can upload a logo (128x128px recommended)
- This appears on the consent screen
- Skip for now if you don't have one ready

**Application home page** (Required):
- Enter your production URL: `https://frontend-api-pi.vercel.app`
- Or your main website URL
- This is where users can learn more about your app

**Application privacy policy link** (Required for External apps):
- If you have a privacy policy: Enter the URL
- If you don't have one yet: You can create a simple one or use a placeholder
- Example: `https://frontend-api-pi.vercel.app/privacy`
- **Note:** You can update this later, but you need to provide a URL

**Application terms of service link** (Optional but recommended):
- If you have terms of service: Enter the URL
- Example: `https://frontend-api-pi.vercel.app/terms`
- Can be skipped for now

**Authorized domains** (Important):
- Click **"+ ADD DOMAIN"**
- Add: `localhost` (for development)
- Add: `vercel.app` (for Vercel deployments)
- Add your custom domain if you have one (e.g., `yourdomain.com`)
- **Note:** Don't add `http://` or `https://`, just the domain name

**Developer contact information** (Required):
- Enter your email address
- This is where Google will contact you about your app

**Action:** Fill out all required fields and click **"SAVE AND CONTINUE"**

### Step 4: Configure Scopes

Scopes define what information your app can access from Google.

**Required Scopes for Basic Sign-In:**

1. **`.../auth/userinfo.email`**
   - Allows your app to see the user's email address
   - ✅ **Required** - Check this

2. **`.../auth/userinfo.profile`**
   - Allows your app to see the user's basic profile info (name, picture)
   - ✅ **Required** - Check this

**How to Add Scopes:**

1. Click **"+ ADD OR REMOVE SCOPES"**
2. In the filter box, search for: `userinfo.email`
3. Check the box next to: `.../auth/userinfo.email`
4. Search for: `userinfo.profile`
5. Check the box next to: `.../auth/userinfo.profile`
6. Click **"UPDATE"** at the bottom

**Action:** Add the two scopes above and click **"SAVE AND CONTINUE"**

### Step 5: Add Test Users (If in Testing Mode)

**If your app is in "Testing" mode:**

You'll see a screen asking for test users. This is important because:
- Only test users can sign in while the app is in testing mode
- You need to add at least one test user (yourself)

**How to Add Test Users:**

1. Click **"+ ADD USERS"**
2. Enter your Google email address (the one you'll use to test)
3. Click **"ADD"**
4. You can add multiple test users (one per line)
5. Click **"SAVE AND CONTINUE"**

**Important:** 
- Only emails you add here can sign in during testing
- Add all emails you'll use for testing
- You can add more later

**Action:** Add at least your email address and click **"SAVE AND CONTINUE"**

### Step 6: Review and Summary

You'll see a summary of your configuration:

**Review Checklist:**
- ✅ App name is set
- ✅ Support email is set
- ✅ Home page URL is set
- ✅ Privacy policy URL is set (even if placeholder)
- ✅ Authorized domains include `localhost` and `vercel.app`
- ✅ Scopes include email and profile
- ✅ Test users added (if in testing mode)

**Action:** Review everything and click **"BACK TO DASHBOARD"**

### Step 7: Publishing Status

After setup, you'll see the OAuth consent screen dashboard.

**Two Publishing Options:**

#### Option A: Testing Mode (Recommended for Development)

**Status:** "Testing"

**Pros:**
- ✅ Quick setup, no verification needed
- ✅ Good for development and testing
- ✅ Can add/remove test users easily

**Cons:**
- ❌ Only test users can sign in
- ❌ Limited to 100 test users
- ❌ Shows "unverified app" warning to users

**When to Use:**
- During development
- When testing with a small group
- Before going to production

**How to Stay in Testing:**
- Do nothing - it defaults to testing
- Make sure you've added test users (Step 5)

#### Option B: In Production (For Public Apps)

**Status:** "In production"

**Pros:**
- ✅ Anyone can sign in
- ✅ No user limit
- ✅ More professional appearance

**Cons:**
- ❌ Requires Google verification (can take days/weeks)
- ❌ More complex setup
- ❌ May need to provide additional documentation

**How to Publish:**
1. Click **"PUBLISH APP"** button
2. Confirm you understand the requirements
3. Submit for verification (if needed)
4. Wait for Google's review

**When to Use:**
- When your app is ready for public use
- When you have all required documentation
- After testing is complete

**Action for Now:** 
- **Stay in Testing mode** if you're still developing
- Add your email as a test user
- You can publish later when ready

### Step 8: Verify Configuration

**Final Checklist:**

Go back to the OAuth consent screen dashboard and verify:

1. **App Information:**
   - [ ] App name is set
   - [ ] Support email is set
   - [ ] Home page URL is correct
   - [ ] Privacy policy URL is set

2. **Authorized Domains:**
   - [ ] `localhost` is listed
   - [ ] `vercel.app` is listed (or your custom domain)

3. **Scopes:**
   - [ ] `.../auth/userinfo.email` is added
   - [ ] `.../auth/userinfo.profile` is added

4. **Test Users (if in Testing mode):**
   - [ ] Your email is added
   - [ ] Any other test emails are added

5. **Publishing Status:**
   - [ ] Status is "Testing" (for development) or "In production" (for public)

## Common Issues and Solutions

### Issue: "App verification required"

**Solution:**
- If you're in Testing mode, this is normal
- Add your email as a test user
- Only test users will see this warning

### Issue: "Invalid domain"

**Solution:**
- Make sure you added `localhost` (not `http://localhost`)
- Make sure you added `vercel.app` (not `https://vercel.app`)
- Domains should be just the domain name, no protocol

### Issue: "Privacy policy required"

**Solution:**
- You must provide a privacy policy URL for External apps
- Even a placeholder URL works for testing
- Create a simple privacy policy page later

### Issue: "Test users can't sign in"

**Solution:**
- Make sure you added the exact email address they use for Google
- Check that the app is in Testing mode
- Wait a few minutes after adding test users

## Quick Reference: Minimum Required Fields

For OAuth to work, you need at minimum:

✅ **App name:** Any name (e.g., "RealEstate App Auth")
✅ **User support email:** Your email
✅ **Application home page:** Your app URL
✅ **Application privacy policy link:** Any valid URL (can be placeholder)
✅ **Authorized domains:** `localhost` and `vercel.app`
✅ **Scopes:** `userinfo.email` and `userinfo.profile`
✅ **Test users:** Your email (if in Testing mode)

## Next Steps

After completing OAuth consent screen setup:

1. ✅ Go back to [Credentials](https://console.cloud.google.com/apis/credentials)
2. ✅ Verify your OAuth 2.0 Client ID is configured
3. ✅ Fix redirect URIs (see `GOOGLE_OAUTH_QUICK_FIX.md`)
4. ✅ Wait 5-15 minutes for changes to propagate
5. ✅ Test Google sign-in

## Testing Your Setup

1. **Sign out** of your app (if signed in)
2. Click **"Continue with Google"**
3. You should see the OAuth consent screen with your app name
4. After signing in, you should be redirected back to your app
5. Check browser console (F12) for any errors

If you see errors, refer to `GOOGLE_OAUTH_ERROR_TROUBLESHOOTING.md` for detailed troubleshooting.

