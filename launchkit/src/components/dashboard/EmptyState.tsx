'use client'

import Link from 'next/link'
import { Rocket, Sparkles, Zap, ArrowRight } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  showTips?: boolean
}

export function EmptyState({
  title = 'No brands yet',
  description = 'Get started by creating your first brand. It only takes 60 seconds!',
  actionLabel = 'Start Now',
  actionHref = '/launch',
  showTips = true
}: EmptyStateProps) {
  const tips = [
    {
      icon: Sparkles,
      text: 'AI generates your brand identity in seconds',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: Zap,
      text: 'Your website goes live automatically',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Rocket,
      text: 'Start building your online presence today',
      color: 'text-orange-600 bg-orange-100'
    }
  ]

  return (
    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
      {/* Illustration */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute inset-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Rocket className="w-12 h-12 text-blue-600" />
        </div>
      </div>

      {/* Title and Description */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {description}
      </p>

      {/* Onboarding Tips */}
      {showTips && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
          {tips.map((tip, index) => {
            const Icon = tip.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
              >
                <div className={`w-10 h-10 ${tip.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-sm text-gray-700 font-medium text-center">
                  {tip.text}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Call-to-Action Button */}
      <Link
        href={actionHref}
        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        {actionLabel}
        <ArrowRight className="w-5 h-5" />
      </Link>

      {/* Additional Help Text */}
      <p className="text-sm text-gray-500 mt-6">
        Need help? Check out our{' '}
        <Link href="/templates" className="text-blue-600 hover:text-blue-700 font-medium">
          templates
        </Link>
        {' '}or{' '}
        <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
          contact support
        </Link>
      </p>
    </div>
  )
}
