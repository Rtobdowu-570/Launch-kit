'use client'

import { Check, Crown, Sparkles } from 'lucide-react'
import Link from 'next/link'
import type { SubscriptionPlan } from '@/lib/mock-subscription'

interface PricingCardProps {
  plan: SubscriptionPlan
  currentTier?: string
  onSelectPlan: (planId: string) => void
  loading?: boolean
}

export function PricingCard({ plan, currentTier, onSelectPlan, loading }: PricingCardProps) {
  const isCurrentPlan = currentTier === plan.tier
  const isFree = plan.tier === 'free'
  const isPro = plan.tier === 'pro'

  return (
    <div
      className={`relative bg-white rounded-2xl border-2 p-8 transition-all ${
        plan.popular
          ? 'border-blue-600 shadow-2xl scale-105'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold shadow-lg">
            <Sparkles className="w-4 h-4" />
            Most Popular
          </div>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            Current Plan
          </div>
        </div>
      )}

      {/* Plan Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {isPro && <Crown className="w-6 h-6 text-blue-600" />}
          <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold text-gray-900">
            ${plan.price}
          </span>
          <span className="text-gray-600">
            /{plan.interval}
          </span>
        </div>

        {plan.interval === 'year' && (
          <p className="text-sm text-green-600 font-medium mt-2">
            Save $58/year (2 months free!)
          </p>
        )}
      </div>

      {/* Features List */}
      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
              <Check className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      {isCurrentPlan ? (
        <button
          disabled
          className="w-full py-3 px-6 bg-gray-100 text-gray-500 rounded-xl font-semibold cursor-not-allowed"
        >
          Current Plan
        </button>
      ) : isFree ? (
        <Link
          href="/signup"
          className="block w-full py-3 px-6 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors text-center"
        >
          Get Started Free
        </Link>
      ) : (
        <button
          onClick={() => onSelectPlan(plan.id)}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
            plan.popular
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processing...' : 'Upgrade to Pro'}
        </button>
      )}
    </div>
  )
}
