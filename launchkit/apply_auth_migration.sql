-- Run this SQL in your Supabase SQL Editor to add authentication and subscription support
-- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new

-- Migration: Add authentication and subscription support
-- This extends the existing schema with auth integration and subscription fields

-- Step 1: Extend users table with subscription fields
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS subscription TEXT NOT NULL DEFAULT 'free' CHECK (subscription IN ('free', 'pro')),
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due')),
ADD COLUMN IF NOT EXISTS brand_limit INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Step 2: Extend brands table with deployment fields
ALTER TABLE public.brands
ADD COLUMN IF NOT EXISTS deployment_url TEXT,
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS last_deployed_at TIMESTAMP WITH TIME ZONE;

-- Update status check constraint to include new statuses
ALTER TABLE public.brands DROP CONSTRAINT IF EXISTS brands_status_check;
ALTER TABLE public.brands ADD CONSTRAINT brands_status_check 
  CHECK (status IN ('draft', 'registering', 'deploying', 'configuring_dns', 'live', 'failed'));

-- Step 3: Update deployments table status constraint
ALTER TABLE public.deployments DROP CONSTRAINT IF EXISTS deployments_status_check;
ALTER TABLE public.deployments ADD CONSTRAINT deployments_status_check 
  CHECK (status IN ('pending', 'generating', 'uploading', 'configuring_dns', 'success', 'failed'));

-- Add retry_count to deployments
ALTER TABLE public.deployments
ADD COLUMN IF NOT EXISTS retry_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Step 4: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON public.users(subscription);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON public.users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_brands_created_at ON public.brands(created_at);
CREATE INDEX IF NOT EXISTS idx_brands_last_deployed_at ON public.brands(last_deployed_at);

-- Step 5: Update RLS policies for proper user isolation

-- Drop old permissive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.brands;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.brands;
DROP POLICY IF EXISTS "Enable update for all users" ON public.brands;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.services;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.services;
DROP POLICY IF EXISTS "Enable update for all users" ON public.services;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.deployments;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.deployments;

-- Users table policies (users can only see and update their own data)
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Brands table policies (users can only access their own brands)
CREATE POLICY "Users can view own brands" ON public.brands
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brands" ON public.brands
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brands" ON public.brands
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brands" ON public.brands
  FOR DELETE USING (auth.uid() = user_id);

-- Public read access for live brands (for public websites)
CREATE POLICY "Public can view live brands" ON public.brands
  FOR SELECT USING (status = 'live');

-- Services table policies (users can access services for their brands)
CREATE POLICY "Users can view services for own brands" ON public.services
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.brands 
      WHERE brands.id = services.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert services for own brands" ON public.services
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.brands 
      WHERE brands.id = services.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update services for own brands" ON public.services
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.brands 
      WHERE brands.id = services.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete services for own brands" ON public.services
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.brands 
      WHERE brands.id = services.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Public read access for services of live brands
CREATE POLICY "Public can view services for live brands" ON public.services
  FOR SELECT USING (
    visible = true AND EXISTS (
      SELECT 1 FROM public.brands 
      WHERE brands.id = services.brand_id 
      AND brands.status = 'live'
    )
  );

-- Deployments table policies (users can access deployments for their brands)
CREATE POLICY "Users can view deployments for own brands" ON public.deployments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.brands 
      WHERE brands.id = deployments.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert deployments for own brands" ON public.deployments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.brands 
      WHERE brands.id = deployments.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Public read access for deployments of live brands (for status checking)
CREATE POLICY "Public can view deployments for live brands" ON public.deployments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.brands 
      WHERE brands.id = deployments.brand_id 
      AND brands.status = 'live'
    )
  );

-- Step 6: Create function to handle new user creation from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, subscription, brand_limit, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    1,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create trigger to automatically create user record on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 8: Create function to sync user email updates
CREATE OR REPLACE FUNCTION public.handle_user_email_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET email = NEW.email, updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Create trigger to sync email updates
DROP TRIGGER IF EXISTS on_auth_user_email_updated ON auth.users;
CREATE TRIGGER on_auth_user_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_email_update();

-- Step 10: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Migration complete
-- Users will now be automatically created in public.users when they sign up via Supabase Auth
-- RLS policies ensure users can only access their own data
