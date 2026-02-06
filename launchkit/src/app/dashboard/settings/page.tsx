'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import {
  getUserSubscription,
  cancelSubscription,
  reactivateSubscription,
  getBillingHistory,
  type UserSubscription,
  type BillingHistory
} from '@/lib/mock-subscription'
import { 
  Crown, 
  CreditCard, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  Download,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [canceling, setCanceling] = useState(false)
  const [reactivating, setReactivating] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  useEffect(() => {
    async function loadSubscriptionData() {
      if (!user) return

      try {
        const [subData, historyData] = await Promise.all([
          getUserSubscription(user.id),
          getBillingHistory(user.id)
        ])
        setSubscription(subData)
        setBillingHistory(historyData)
      } catch (error) {
        console.error('Error loading subscription:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSubscriptionData()
  }, [user])

  const handleCancelSubscription = async () => {
    if (!user) return

    setCanceling(true)
    try {
      const updatedSub = await cancelSubscription(user.id, false)
      setSubscription(updatedSub)
      setShowCancelModal(false)
    } catch (error) {
      console.error('Error canceling subscription:', error)
    } finally {
      setCanceling(false)
    }
  }

  const handleReactivateSubscription = async () => {
    if (!user) return

    setReactivating(true)
    try {
      const updatedSub = await reactivateSubscription(user.id)
      setSubscription(updatedSub)
    } catch (error) {
      console.error('Error reactivating subscription:', error)
    } finally {
      setReactivating(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const isPro = subscription?.tier === 'pro'
  const isCanceled = subscription?.cancelAtPeriodEnd

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Subscription Settings</h1>

        {/* Current Plan */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {isPro && <Crown className="w-6 h-6 text-blue-600" />}
                <h2 className="text-2xl font-bold text-gray-900">
                  {isPro ? 'Pro Plan' : 'Free Plan'}
                </h2>
              </div>
              <p className="text-gray-600">
                {isPro 
                  ? 'Unlimited brands and services with premium features'
                  : 'Limited to 1 brand and 3 services per brand'
                }
              </p>
            </div>
            
            {subscription && (
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                subscription.status === 'active' && !isCanceled
                  ? 'bg-green-100 text-green-700'
                  : subscription.status === 'canceled' || isCanceled
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {isCanceled ? 'Canceling' : subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </div>
            )}
          </div>

          {/* Subscription Details */}
          {subscription && (
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Current Period</p>
                  <p className="font-medium text-gray-900">
                    {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {isPro && (
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cancel Warning */}
          {isCanceled && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    Subscription Canceling
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your Pro features will remain active until {new Date(subscription.currentPeriodEnd).toLocaleDateString()}. 
                    After that, you&apos;ll be moved to the Free plan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            {!isPro ? (
              <Link
                href="/pricing"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Upgrade to Pro
              </Link>
            ) : isCanceled ? (
              <button
                onClick={handleReactivateSubscription}
                disabled={reactivating}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {reactivating ? 'Reactivating...' : 'Reactivate Subscription'}
              </button>
            ) : (
              <>
                <Link
                  href="/pricing"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Change Plan
                </Link>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
                >
                  Cancel Subscription
                </button>
              </>
            )}
          </div>
        </div>

        {/* Billing History */}
        {billingHistory.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Billing History</h2>
            
            <div className="space-y-4">
              {billingHistory.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      invoice.status === 'paid'
                        ? 'bg-green-100'
                        : invoice.status === 'pending'
                        ? 'bg-yellow-100'
                        : 'bg-red-100'
                    }`}>
                      {invoice.status === 'paid' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : invoice.status === 'pending' ? (
                        <RefreshCw className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-900">{invoice.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(invoice.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${invoice.amount.toFixed(2)}
                      </p>
                      <p className={`text-xs font-medium ${
                        invoice.status === 'paid'
                          ? 'text-green-600'
                          : invoice.status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </p>
                    </div>

                    {invoice.invoiceUrl && (
                      <button
                        onClick={() => window.open(invoice.invoiceUrl, '_blank')}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Download invoice"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Cancel Subscription?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Your Pro features will remain active until the end of your billing period. 
              After that, you&apos;ll be moved to the Free plan.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={canceling}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {canceling ? 'Canceling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
