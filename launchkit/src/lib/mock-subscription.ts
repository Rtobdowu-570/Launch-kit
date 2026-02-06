/**
 * Mock Subscription Service
 * 
 * This is a mockup implementation for demonstration purposes.
 * In production, this would integrate with Stripe API.
 */

export type SubscriptionTier = 'free' | 'pro'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing'

export interface SubscriptionPlan {
  id: string
  name: string
  tier: SubscriptionTier
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  brandLimit: number
  serviceLimit: number
  popular?: boolean
}

export interface UserSubscription {
  id: string
  userId: string
  tier: SubscriptionTier
  status: SubscriptionStatus
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}

export interface BillingHistory {
  id: string
  date: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed'
  description: string
  invoiceUrl?: string
}

// Mock subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tier: 'free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      '1 brand',
      '3 services per brand',
      'Basic templates',
      'Community support',
      'SSL certificate',
      'Custom domain'
    ],
    brandLimit: 1,
    serviceLimit: 3
  },
  {
    id: 'pro-monthly',
    name: 'Pro',
    tier: 'pro',
    price: 29,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited brands',
      'Unlimited services',
      'All premium templates',
      'Priority support',
      'Advanced analytics',
      'Custom branding',
      'API access',
      'Team collaboration'
    ],
    brandLimit: 999,
    serviceLimit: 999,
    popular: true
  },
  {
    id: 'pro-yearly',
    name: 'Pro (Annual)',
    tier: 'pro',
    price: 290,
    currency: 'USD',
    interval: 'year',
    features: [
      'Unlimited brands',
      'Unlimited services',
      'All premium templates',
      'Priority support',
      'Advanced analytics',
      'Custom branding',
      'API access',
      'Team collaboration',
      '2 months free'
    ],
    brandLimit: 999,
    serviceLimit: 999
  }
]

// Mock user subscriptions storage (in-memory for demo)
const mockSubscriptions = new Map<string, UserSubscription>()

// Mock billing history storage
const mockBillingHistory = new Map<string, BillingHistory[]>()

/**
 * Get subscription plans
 */
export function getSubscriptionPlans(): SubscriptionPlan[] {
  return SUBSCRIPTION_PLANS
}

/**
 * Get user's current subscription
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  // Check if user has a subscription in mock storage
  if (mockSubscriptions.has(userId)) {
    return mockSubscriptions.get(userId)!
  }

  // Default to free tier
  const freeSubscription: UserSubscription = {
    id: `sub_${userId}_free`,
    userId,
    tier: 'free',
    status: 'active',
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false
  }

  mockSubscriptions.set(userId, freeSubscription)
  return freeSubscription
}

/**
 * Create a checkout session (mock)
 */
export async function createCheckoutSession(
  userId: string,
  planId: string
): Promise<{ sessionId: string; url: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)
  if (!plan) {
    throw new Error('Invalid plan ID')
  }

  // Mock checkout session
  const sessionId = `cs_mock_${Date.now()}`
  const url = `/checkout/${sessionId}?plan=${planId}`

  return { sessionId, url }
}

/**
 * Upgrade user subscription (mock)
 */
export async function upgradeSubscription(
  userId: string,
  planId: string
): Promise<UserSubscription> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)
  if (!plan) {
    throw new Error('Invalid plan ID')
  }

  const now = new Date()
  const periodEnd = plan.interval === 'year' 
    ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
    : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const subscription: UserSubscription = {
    id: `sub_${userId}_${planId}`,
    userId,
    tier: plan.tier,
    status: 'active',
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
    cancelAtPeriodEnd: false,
    stripeCustomerId: `cus_mock_${userId}`,
    stripeSubscriptionId: `sub_mock_${Date.now()}`
  }

  mockSubscriptions.set(userId, subscription)

  // Add billing history entry
  const billingEntry: BillingHistory = {
    id: `inv_${Date.now()}`,
    date: now.toISOString(),
    amount: plan.price,
    currency: plan.currency,
    status: 'paid',
    description: `${plan.name} subscription - ${plan.interval}ly`,
    invoiceUrl: `/invoices/inv_${Date.now()}`
  }

  const history = mockBillingHistory.get(userId) || []
  history.unshift(billingEntry)
  mockBillingHistory.set(userId, history)

  return subscription
}

/**
 * Cancel user subscription (mock)
 */
export async function cancelSubscription(
  userId: string,
  immediate: boolean = false
): Promise<UserSubscription> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const subscription = await getUserSubscription(userId)

  if (immediate) {
    // Downgrade to free immediately
    const freeSubscription: UserSubscription = {
      id: `sub_${userId}_free`,
      userId,
      tier: 'free',
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false
    }
    mockSubscriptions.set(userId, freeSubscription)
    return freeSubscription
  } else {
    // Cancel at period end
    subscription.cancelAtPeriodEnd = true
    subscription.status = 'canceled'
    mockSubscriptions.set(userId, subscription)
    return subscription
  }
}

/**
 * Reactivate canceled subscription (mock)
 */
export async function reactivateSubscription(userId: string): Promise<UserSubscription> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const subscription = await getUserSubscription(userId)
  subscription.cancelAtPeriodEnd = false
  subscription.status = 'active'
  mockSubscriptions.set(userId, subscription)
  return subscription
}

/**
 * Get billing history (mock)
 */
export async function getBillingHistory(userId: string): Promise<BillingHistory[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))

  if (mockBillingHistory.has(userId)) {
    return mockBillingHistory.get(userId)!
  }

  // Generate some mock history for demo
  const subscription = await getUserSubscription(userId)
  if (subscription.tier === 'pro') {
    const history: BillingHistory[] = [
      {
        id: 'inv_001',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 29,
        currency: 'USD',
        status: 'paid',
        description: 'Pro subscription - monthly',
        invoiceUrl: '/invoices/inv_001'
      },
      {
        id: 'inv_002',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 29,
        currency: 'USD',
        status: 'paid',
        description: 'Pro subscription - monthly',
        invoiceUrl: '/invoices/inv_002'
      }
    ]
    mockBillingHistory.set(userId, history)
    return history
  }

  return []
}

/**
 * Update payment method (mock)
 */
export async function updatePaymentMethod(
  userId: string,
  paymentMethodId: string
): Promise<{ success: boolean }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))

  // Mock success
  return { success: true }
}

/**
 * Get subscription limits for a tier
 */
export function getSubscriptionLimits(tier: SubscriptionTier): {
  brandLimit: number
  serviceLimit: number
} {
  const plan = SUBSCRIPTION_PLANS.find(p => p.tier === tier)
  if (!plan) {
    return { brandLimit: 1, serviceLimit: 3 }
  }
  return {
    brandLimit: plan.brandLimit,
    serviceLimit: plan.serviceLimit
  }
}

/**
 * Check if user can create more brands
 */
export async function canCreateBrand(
  userId: string,
  currentBrandCount: number
): Promise<{ allowed: boolean; reason?: string }> {
  const subscription = await getUserSubscription(userId)
  const limits = getSubscriptionLimits(subscription.tier)

  if (currentBrandCount >= limits.brandLimit) {
    return {
      allowed: false,
      reason: `You've reached the limit of ${limits.brandLimit} brand(s) for your ${subscription.tier} plan. Upgrade to Pro for unlimited brands.`
    }
  }

  return { allowed: true }
}

/**
 * Check if user can add more services to a brand
 */
export async function canAddService(
  userId: string,
  currentServiceCount: number
): Promise<{ allowed: boolean; reason?: string }> {
  const subscription = await getUserSubscription(userId)
  const limits = getSubscriptionLimits(subscription.tier)

  if (currentServiceCount >= limits.serviceLimit) {
    return {
      allowed: false,
      reason: `You've reached the limit of ${limits.serviceLimit} service(s) per brand for your ${subscription.tier} plan. Upgrade to Pro for unlimited services.`
    }
  }

  return { allowed: true }
}
