'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getAnalyticsSummary } from '@/lib/analytics'
import type { Service } from '@/types'

interface AnalyticsDashboardProps {
  brandId: string
  services: Service[]
}

interface AnalyticsSummary {
  totalClicks: number
  uniqueVisitors: number
  clickCounts: Record<string, number>
  topService: { id: string; clicks: number } | null
  recentEvents: Array<{
    id: string
    event_type: string
    timestamp: string
    metadata?: Record<string, unknown>
  }>
}

export function AnalyticsDashboard({ brandId, services }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsSummary>({
    totalClicks: 0,
    uniqueVisitors: 0,
    clickCounts: {},
    topService: null,
    recentEvents: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      await loadAnalytics()
    }
    load()
  }, [brandId])

  async function loadAnalytics() {
    try {
      const data = await getAnalyticsSummary(brandId)
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading analytics...</p>
      </div>
    )
  }

  const topServiceData = analytics.topService
    ? services.find(s => s.id === analytics.topService?.id)
    : null

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics.totalClicks}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics.uniqueVisitors}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Service</p>
              {topServiceData ? (
                <>
                  <p className="text-lg font-bold text-gray-900 mt-2 truncate">
                    {topServiceData.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {analytics.topService?.clicks} clicks
                  </p>
                </>
              ) : (
                <p className="text-lg text-gray-400 mt-2">No data yet</p>
              )}
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
              {topServiceData?.emoji || '🏆'}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Service Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Service Performance</h3>
        </div>
        <div className="p-6">
          {services.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No services yet. Add services to see their performance.
            </p>
          ) : (
            <div className="space-y-4">
              {services.map((service) => {
                const clicks = analytics.clickCounts[service.id] || 0
                const maxClicks = Math.max(...Object.values(analytics.clickCounts), 1)
                const percentage = (clicks / maxClicks) * 100

                return (
                  <div key={service.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{service.emoji || '📦'}</span>
                        <span className="font-medium text-gray-900">{service.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-600">
                        {clicks} {clicks === 1 ? 'click' : 'clicks'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-blue-600 h-2 rounded-full"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          {analytics.recentEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {analytics.recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      {event.event_type === 'service_click' && 'Service clicked'}
                      {event.event_type === 'page_view' && 'Page viewed'}
                      {event.event_type === 'brand_view' && 'Brand viewed'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
