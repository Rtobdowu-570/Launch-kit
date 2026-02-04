-- Function to handle user creation from auth trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile when auth user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get user's brand count (for free tier limits)
CREATE OR REPLACE FUNCTION public.get_user_brand_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM public.brands
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get brand's service count (for free tier limits)
CREATE OR REPLACE FUNCTION public.get_brand_service_count(brand_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM public.services
    WHERE brand_id = brand_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if domain is available in our system
CREATE OR REPLACE FUNCTION public.is_domain_available(domain_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1
    FROM public.brands
    WHERE domain = domain_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get brand by domain (for public access)
CREATE OR REPLACE FUNCTION public.get_brand_by_domain(domain_name TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  tagline TEXT,
  bio TEXT,
  colors JSONB,
  template_type TEXT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    b.tagline,
    b.bio,
    b.colors,
    b.template_type,
    b.status
  FROM public.brands b
  WHERE b.domain = domain_name
  AND b.status = 'live';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get services for a brand by domain (for public access)
CREATE OR REPLACE FUNCTION public.get_services_by_domain(domain_name TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  price TEXT,
  link TEXT,
  emoji TEXT,
  position INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.price,
    s.link,
    s.emoji,
    s.position
  FROM public.services s
  JOIN public.brands b ON s.brand_id = b.id
  WHERE b.domain = domain_name
  AND b.status = 'live'
  AND s.visible = true
  ORDER BY s.position ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;