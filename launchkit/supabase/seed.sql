-- Seed data for LaunchKit MVP development

-- Insert test users (these would normally be created via Supabase Auth)
INSERT INTO public.users (id, email) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'test@example.com'),
  ('550e8400-e29b-41d4-a716-446655440001', 'demo@launchkit.dev')
ON CONFLICT (id) DO NOTHING;

-- Insert test brands
INSERT INTO public.brands (
  id, user_id, name, domain, tagline, bio, colors, template_type, status
) VALUES 
  (
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440000',
    'TechConsult Pro',
    'techconsult.cv',
    'Expert technology consulting for modern businesses',
    'I help startups and enterprises navigate complex technology decisions with 10+ years of experience.',
    '{"primary": "#2563eb", "accent": "#7c3aed", "neutral": "#f8fafc"}',
    'minimal-card',
    'live'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'Creative Studio',
    'creativestudio.cv',
    'Beautiful designs that tell your story',
    'I create stunning visual identities and digital experiences for brands that want to stand out.',
    '{"primary": "#dc2626", "accent": "#f59e0b", "neutral": "#fef7ed"}',
    'magazine-grid',
    'draft'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    'DevOps Master',
    'devopsmaster.cv',
    'Scaling infrastructure for the cloud era',
    'I build and maintain robust, scalable infrastructure that powers modern applications.',
    '{"primary": "#059669", "accent": "#0891b2", "neutral": "#f0fdf4"}',
    'terminal-retro',
    'registering'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert test services
INSERT INTO public.services (
  id, brand_id, name, price, link, emoji, position, visible
) VALUES 
  (
    '770e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440000',
    'Strategy Consultation',
    '$200/hour',
    'https://calendly.com/techconsult/strategy',
    '🎯',
    0,
    true
  ),
  (
    '770e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440000',
    'Architecture Review',
    '$500',
    'https://buy.stripe.com/architecture-review',
    '🏗️',
    1,
    true
  ),
  (
    '770e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440000',
    'Team Training',
    '$2000',
    'https://buy.stripe.com/team-training',
    '👥',
    2,
    true
  ),
  (
    '770e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440001',
    'Brand Identity Package',
    '$1500',
    'https://paystack.com/pay/brand-identity',
    '🎨',
    0,
    true
  ),
  (
    '770e8400-e29b-41d4-a716-446655440004',
    '660e8400-e29b-41d4-a716-446655440001',
    'Website Design',
    '$3000',
    'https://paystack.com/pay/website-design',
    '💻',
    1,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Insert test deployments
INSERT INTO public.deployments (
  id, brand_id, deployment_url, status, deployed_at
) VALUES 
  (
    '880e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440000',
    'https://techconsult.cv',
    'live',
    NOW() - INTERVAL '2 days'
  ),
  (
    '880e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440002',
    'https://devopsmaster.cv',
    'building',
    NULL
  )
ON CONFLICT (id) DO NOTHING;