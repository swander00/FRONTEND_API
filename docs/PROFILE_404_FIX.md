# Profile 404 Error Fix

## Problem

After signing in with Google, the app was making repeated requests to `/api/users/profile` and getting 404 errors. This happened because:

1. **New users don't have profiles yet** - When a user signs in with Google for the first time, the profile might not exist immediately
2. **Multiple components calling the hook** - Several components use `useUserProfile()` hook, each making requests
3. **404 treated as error** - The hook was treating 404 as an error and potentially retrying

## Solution

### 1. Updated `useUserProfile` Hook

**File:** `FRONTEND_API/hooks/useUserProfile.ts`

**Changes:**
- ✅ Handle 404 gracefully - Treat 404 as "profile doesn't exist yet" (expected for new users)
- ✅ Don't set error state for 404 - Set `profile` to `null` and `error` to `null`
- ✅ Prevent multiple simultaneous requests - Added `fetchingRef` to prevent duplicate calls
- ✅ Better error detection - Check for 404 status code and error messages

**Result:**
- 404 responses are now handled gracefully
- No error state for expected 404s (new users)
- Prevents multiple simultaneous requests
- Components can check `profile === null` to determine if onboarding is needed

### 2. Expected Behavior

**For New Users (No Profile Yet):**
- `profile` = `null`
- `isLoading` = `false`
- `error` = `null`
- User should be redirected to onboarding

**For Existing Users (Profile Exists):**
- `profile` = `UserProfile` object
- `isLoading` = `false`
- `error` = `null`

**For Real Errors:**
- `profile` = `null` or previous value
- `isLoading` = `false`
- `error` = `Error` object

## Backend Profile Creation

According to the database schema, profiles should be automatically created via a trigger:

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**If profiles aren't being created automatically:**

1. **Check if trigger exists:**
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

2. **Check if function exists:**
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
   ```

3. **Re-run the trigger setup script:**
   - See: `BACKEND_API/docs/Database scripts/UserProfileTrigger.sql`

## Testing

### Test New User Flow:
1. Sign out completely
2. Sign in with Google (new account)
3. Check browser console - should see:
   - ✅ No repeated 404 errors
   - ✅ Profile fetch happens once
   - ✅ Redirect to onboarding page

### Test Existing User Flow:
1. Sign in with Google (existing account)
2. Check browser console - should see:
   - ✅ Profile fetched successfully
   - ✅ No 404 errors
   - ✅ User sees their profile data

## Related Files

- `FRONTEND_API/hooks/useUserProfile.ts` - Updated hook
- `FRONTEND_API/hooks/useAuth.ts` - Uses profile for auth state
- `FRONTEND_API/components/auth/AuthTriggerButton.tsx` - Uses profile for display
- `FRONTEND_API/app/onboarding/page.tsx` - Uses profile for onboarding
- `BACKEND_API/routes/users.js` - Profile API endpoint
- `BACKEND_API/services/userService.js` - Profile service logic

## Notes

- The backend returns 404 when profile doesn't exist (this is correct behavior)
- The frontend now handles this gracefully
- Onboarding flow should create the profile
- Profile should be created automatically by database trigger (if configured)

