# Supabase Auth Setup Guide

This guide walks through setting up Supabase Auth for LaunchKit production features.

## Prerequisites

- Supabase project created at https://supabase.com
- Project URL and keys added to `.env.local`

## Step 1: Configure Auth Settings in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings**
3. Configure the following settings:

### Site URL
- Set to your production URL (e.g., `https://launchkit.com`)
- For development: `http://localhost:3000`

### Redirect URLs
Add the following URLs to the allowed list:
- `http://localhost:3000/**`
- `https://localhost:3000/**`
- `http://127.0.0.1:3000/**`
- `https://127.0.0.1:3000/**`
- Your production URL with wildcard: `https://yourdomain.com/**`

### Email Auth Settings
- ✅ Enable Email provider
- ✅ Enable Email confirmations (users must verify email before login)
- ✅ Enable Secure email change (requires confirmation on both old and new email)
- Set minimum password length to 8 characters (if available in UI)

### JWT Settings
- JWT expiry: 3600 seconds (1 hour) - default is fine
- ✅ Enable automatic token refresh

## Step 2: Apply Database Migration

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy the contents of `apply_auth_migration.sql`
4. Paste into the SQL editor
5. Click **Run** to execute the migration

This migration will:
- Add subscription fields to users table (subscription, subscription_id, subscription_status, brand_limit, stripe_customer_id)
- Add deployment fields to brands table (deployment_url, error_message, last_deployed_at)
- Update status constraints for brands and deployments
- Add performance indexes
- Update RLS policies for proper user data isolation
- Create triggers to automatically create user records when users sign up via Supabase Auth

## Step 3: Verify Migration

Run this query in the SQL Editor to verify the migration was successful:

```sql
-- Check users table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

-- Check brands table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'brands'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check triggers
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

Expected results:
- `users` table should have: subscription, subscription_id, subscription_status, brand_limit, stripe_customer_id
- `brands` table should have: deployment_url, error_message, last_deployed_at
- RLS policies should be user-specific (not "Enable read access for all users")
- Triggers should include: on_auth_user_created, on_auth_user_email_updated

## Step 4: Test Auth Flow

1. Start your Next.js development server: `npm run dev`
2. Navigate to the signup page (once implemented)
3. Create a test account
4. Check your email for verification link
5. Verify the account
6. Log in with the verified account
7. Check the database to confirm:
   - User record was created in `auth.users`
   - Corresponding record was created in `public.users` with default values:
     - subscription: 'free'
     - brand_limit: 1

## Step 5: Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the following templates:
   - **Confirm signup**: Sent when users sign up
   - **Magic Link**: For passwordless login (if enabled)
   - **Change Email Address**: Sent when users change email
   - **Reset Password**: Sent when users request password reset

Use these variables in templates:
- `{{ .ConfirmationURL }}` - Email confirmation link
- `{{ .Token }}` - Verification token
- `{{ .TokenHash }}` - Hashed token
- `{{ .SiteURL }}` - Your site URL

## Troubleshooting

### Users can't sign up
- Check that email provider is enabled in Auth settings
- Verify SMTP settings if using custom email provider
- Check browser console for errors

### Email confirmations not working
- Verify redirect URLs are correctly configured
- Check spam folder for confirmation emails
- Test with Supabase's built-in email testing (Inbucket) in local development

### RLS policies blocking access
- Verify user is authenticated: `SELECT auth.uid()` should return user ID
- Check policy conditions match your use case
- Temporarily disable RLS for debugging: `ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;` (re-enable after!)

### Trigger not creating user records
- Check trigger exists: Query information_schema.triggers
- Verify function exists: `\df public.handle_new_user` in psql
- Check function permissions: Should have SECURITY DEFINER
- Look for errors in Supabase logs

## Next Steps

After completing this setup:
1. Implement authentication pages (login, signup, password reset)
2. Create auth context provider for session management
3. Add protected route middleware
4. Update brand creation to use authenticated user IDs
5. Test user data isolation with multiple accounts

## Environment Variables

Ensure these are set in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Security Notes

- Never commit service role key to version control
- Use environment variables for all sensitive keys
- RLS policies are enforced at the database level (even if bypassed in code)
- Service role key bypasses RLS - use only for admin operations
- Always validate user input on the server side
- Use HTTPS in production
