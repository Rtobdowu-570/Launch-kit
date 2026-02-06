/**
 * Analytics tracking utilities for service link clicks and user interactions
 */

import { supabase } from './supabase'

export interface AnalyticsEvent {
  id?: string
  brandId: string
  serviceId?: string
  eventType: 'service_click' | 'page_view' | 'brand_view'
  metadata?: Record<string, unknown>
  timestamp: string
  userAgent?: string
  referrer?: string
}

/**
 * Track a service link click
 */
export async function trackServiceClick(
  brandId: string,
  serviceId: string,
  serviceName: string,
  serviceLink: string
): Promise<void> {
  try {
    // Track in database
    await (supabase as any).from('analytics_events').insert({
      brand_id: brandId,
      service_id: serviceId,
      event_type: 'service_click',
      metadata: {
        service_name: serviceName,
        service_link: serviceLink
      },
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      referrer: typeof document !== 'undefined' ? document.referrer : null,
      timestamp: new Date().toISOString()
    })

    // Also track in localStorage for offline support
    if (typeof localStorage !== 'undefined') {
      const key = `analytics_${brandId}_${serviceId}`
      const current = parseInt(localStorage.getItem(key) || '0', 10)
      localStorage.setItem(key, (current + 1).toString())
    }
  } catch (error) {
    console.error('Failed to track service click:', error)
    // Don't throw - analytics failures shouldn't break the app
  }
}

/**
 * Track a page view
 */
export async function trackPageView(
  brandId: string,
  page: string
): Promise<void> {
  try {
    await (supabase as any).from('analytics_events').insert({
      brand_id: brandId,
      event_type: 'page_view',
      metadata: { page },
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      referrer: typeof document !== 'undefined' ? document.referrer : null,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to track page view:', error)
  }
}

/**
 * Get analytics data for a brand
 */
export async function getBrandAnalytics(brandId: string): Promise<AnalyticsEvent[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('analytics_events')
      .select('*')
      .eq('brand_id', brandId)
      .order('timestamp', { ascending: false })
      .limit(1000)

    if (error) throw error

    return (data || []) as AnalyticsEvent[]
  } catch (error) {
    console.error('Failed to get analytics:', error)
    return []
  }
}

/**
 * Get service click counts
 */
export async function getServiceClickCounts(brandId: string): Promise<Record<string, number>> {
  try {
    const { data, error } = await (supabase as any)
      .from('analytics_events')
      .select('service_id')
      .eq('brand_id', brandId)
      .eq('event_type', 'service_click')

    if (error) throw error

    // Count clicks per service
    const counts: Record<string, number> = {}
    const events = data as Array<{ service_id?: string }>
    events?.forEach((event) => {
      if (event.service_id) {
        counts[event.service_id] = (counts[event.service_id] || 0) + 1
      }
    })

    return counts
  } catch (error) {
    console.error('Failed to get service click counts:', error)
    return {}
  }
}

/**
 * Get total clicks for a brand
 */
export async function getTotalClicks(brandId: string): Promise<number> {
  try {
    const { count, error } = await (supabase as any)
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('brand_id', brandId)
      .eq('event_type', 'service_click')

    if (error) throw error

    return count || 0
  } catch (error) {
    console.error('Failed to get total clicks:', error)
    return 0
  }
}

/**
 * Get analytics summary for dashboard
 */
export async function getAnalyticsSummary(brandId: string) {
  try {
    const [totalClicks, clickCounts, recentEvents] = await Promise.all([
      getTotalClicks(brandId),
      getServiceClickCounts(brandId),
      getBrandAnalytics(brandId)
    ])

    // Calculate unique visitors (approximate based on user agent)
    const uniqueVisitors = new Set(
      recentEvents
        .filter(e => e.userAgent)
        .map(e => e.userAgent)
    ).size

    // Get top performing service
    const topService = Object.entries(clickCounts).sort((a, b) => b[1] - a[1])[0]

    return {
      totalClicks,
      uniqueVisitors,
      clickCounts,
      topService: topService ? { id: topService[0], clicks: topService[1] } : null,
      recentEvents: recentEvents.slice(0, 10).map(e => ({
        id: e.id || '',
        event_type: e.eventType,
        timestamp: e.timestamp,
        metadata: e.metadata
      }))
    }
  } catch (error) {
    console.error('Failed to get analytics summary:', error)
    return {
      totalClicks: 0,
      uniqueVisitors: 0,
      clickCounts: {},
      topService: null,
      recentEvents: []
    }
  }
}
