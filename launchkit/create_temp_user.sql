-- Create a temporary user for testing
-- Run this in your Supabase SQL Editor

INSERT INTO public.users (id, email, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'temp@launchkit.test', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Verify the user was created
SELECT * FROM public.users WHERE id = '00000000-0000-0000-0000-000000000001';
