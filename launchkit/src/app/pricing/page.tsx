'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { PricingCard } from '@/components/pricing/PricingCard'
import { 
  getSubscriptionPlans, 
  getUserSubscription,
  type SubscriptionPlan 
} from '@/lib/mock-subscription'
import { ArrowLeft, Check, X } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [currentTier, setCurrentTier] = useState<string>('free')
  const [loading, setLoading] = useState(false)
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')

  useEffect(() => {
    const allPlans = getSubscriptionPlans()
    setPlans(allPlans)

    // Load user's current subscription
    if (user) {
      getUserSubscription(user.id).then(subscription => {
        setCurrentTier(subscription.tier)
      })
    }
  }, [user])

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      router.push('/login?returnUrl=/pricing')
      return
    }

    setLoading(true)
    // Simulate navigation to checkout
    setTimeout(() => {
      router.push(`/checkout?plan=${planId}`)
    }, 500)
  }

  // Filter plans by billing interval
  const filteredPlans = plans.filter(plan => {
    if (plan.tier === 'free') return billingInterval === 'month'
    return plan.interval === billingInterval
  })

  // Feature comparison data
  const comparisonFeatures = [
    { name: 'Brands', free: '1 brand', pro: 'Unlimited' },
    { name: 'Services per brand', free: '3 services', pro: 'Unlimited' },
    { name: 'Templates', free: 'Basic', pro: 'All premium' },
    { name: 'Custom domain', free: true, pro: true },
    { name: 'SSL certificate', free: true, pro: true },
    { name: 'Analytics', free: false, pro: true },
    { name: 'Custom branding', free: false, pro: true },
    { name: 'API access', free: false, pro: true },
    { name: 'Team collaboration', free: false, pro: true },
    { name: 'Support', free: 'Community', pro: 'Priority' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the plan that's right for you. Upgrade or downgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white rounded-full p-1 border border-gray-200 shadow-sm">
            <button
              onClick={() => setBillingInterval('month')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingInterval === 'month'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingInterval === 'year'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {filteredPlans.map(plan => (
            <PricingCard
              key={plan.id}
              plan={plan}
              currentTier={currentTier}
              onSelectPlan={handleSelectPlan}
              loading={loading}
            />
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Compare Plans
          </h2>
          
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Free
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {feature.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-700">{feature.free}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-700">{feature.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I cancel?
              </h3>
              <p className="text-gray-600">
                You can cancel anytime. Your Pro features will remain active until the end of your billing period, then you'll be moved to the Free plan.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 14-day money-back guarantee. If you're not satisfied, contact us for a full refund within 14 days of purchase.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is my payment information secure?
              </h3>
              <p className="text-gray-600">
                Absolutely. We use Stripe for payment processing, which is PCI-DSS compliant and trusted by millions of businesses worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
