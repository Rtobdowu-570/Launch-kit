# LaunchKit Database Setup

This directory contains the database schema, migrations, and configuration for the LaunchKit MVP.

## Database Schema

The LaunchKit database consists of four main tables:

### Tables

1. **users** - User profiles (extends Supabase auth.users)
   - Stores basic user information
   - Automatically created when users sign up via Supabase Auth

2. **brands** - Brand identities created by users
   - Contains brand information, colors, domain, and status
   - Links to Ola.CV domain registration data
   - Supports multiple templates (minimal-card, magazine-grid, terminal-retro)

3. **services** - Service links for each brand (link-in-bio functionality)
   - Stores service information with pricing and external payment links
   - Supports drag-and-drop ordering via position field
   - Free users limited to 3 services per brand

4. **deployments** - Deployment history and status
   - Tracks website deployments for each brand
   - Stores deployment URLs and build logs
   - Supports multiple deployment statuses

## Migrations

Run migrations in order:

1. `001_initial_schema.sql` - Creates tables, indexes, and triggers
2. `002_rls_policies.sql` - Sets up Row Level Security policies
3. `003_utility_functions.sql` - Creates utility functions and triggers

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **Users can only access their own data**
- **Public read access for live brands and services** (for public websites)
- **Automatic user profile creation** via auth trigger

## Local Development

1. Install Supabase CLI: `npm install -g supabase`
2. Start local Supabase: `supabase start`
3. Run migrations: `supabase db reset`
4. Seed test data: `supabase db seed`

## Environment Variables

Required environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## Utility Functions

The database includes several utility functions:

- `handle_new_user()` - Automatically creates user profile on signup
- `get_user_brand_count()` - Returns brand count for free tier limits
- `get_brand_service_count()` - Returns service count for free tier limits
- `is_domain_available()` - Checks if domain is available in our system
- `get_brand_by_domain()` - Public function to retrieve brand by domain
- `get_services_by_domain()` - Public function to retrieve services by domain

## Free Tier Limits

- Users can create unlimited brands
- Each brand can have up to 3 services (enforced in application logic)
- All features available in free tier for MVP

## Production Deployment

For production deployment:

1. Create Supabase project at https://supabase.com
2. Run migrations via Supabase dashboard or CLI
3. Configure environment variables in deployment platform
4. Enable RLS policies and configure auth providers as needed