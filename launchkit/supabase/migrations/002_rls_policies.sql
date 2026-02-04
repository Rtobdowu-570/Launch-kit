-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Brands policies
CREATE POLICY "Users can view own brands" ON public.brands
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own brands" ON public.brands
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brands" ON public.brands
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brands" ON public.brands
  FOR DELETE USING (auth.uid() = user_id);

-- Public read access for live brands (for public websites)
CREATE POLICY "Public can view live brands" ON public.brands
  FOR SELECT USING (status = 'live');

-- Services policies
CREATE POLICY "Users can view services for own brands" ON public.services
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.brands 
      WHERE brands.id = services.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create services for own brands" ON public.services
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

-- Deployments policies
CREATE POLICY "Users can view deployments for own brands" ON public.deployments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.brands 
      WHERE brands.id = deployments.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create deployments for own brands" ON public.deployments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.brands 
      WHERE brands.id = deployments.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update deployments for own brands" ON public.deployments
  FOR UPDATE USING (
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