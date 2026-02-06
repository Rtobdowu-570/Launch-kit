-- Create analytics_events table for tracking service clicks and user interactions
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('service_click', 'page_view', 'brand_view')),
  metadata JSONB,
  user_agent TEXT,
  referrer TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_analytics_brand_id ON analytics_events(brand_id);
CREATE INDEX idx_analytics_service_id ON analytics_events(service_id);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_timestamp ON analytics_events(timestamp DESC);

-- Create a function to get click counts for a brand
CREATE OR REPLACE FUNCTION get_brand_click_count(brand_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM analytics_events
  WHERE brand_id = brand_uuid
    AND event_type = 'service_click';
$$ LANGUAGE SQL STABLE;

-- Create a function to get service click counts
CREATE OR REPLACE FUNCTION get_service_click_count(service_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM analytics_events
  WHERE service_id = service_uuid
    AND event_type = 'service_click';
$$ LANGUAGE SQL STABLE;

-- Add RLS policies
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow users to read analytics for their own brands
CREATE POLICY "Users can view analytics for their brands"
  ON analytics_events
  FOR SELECT
  USING (
    brand_id IN (
      SELECT id FROM brands WHERE user_id = auth.uid()
    )
  );

-- Allow anyone to insert analytics events (for tracking)
CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events
  FOR INSERT
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE analytics_events IS 'Tracks user interactions with services and brands for analytics';
