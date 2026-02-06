'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { BioInput } from './BioInput'
import { BrandGenerator } from './BrandGenerator'
import { ContactForm } from './ContactForm'
import { LaunchSuccess } from './LaunchSuccess'
import type { BrandIdentity, ContactData, BioData } from '@/types'
import { createBrand } from '@/lib/database'
import { registerDomain, createContact } from '@/app/actions'
import { useAuth } from '@/contexts/AuthContext'

type LaunchStep = 'bio' | 'brand' | 'contact' | 'launching' | 'success'

export function LaunchFlow() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState<LaunchStep>('bio')
  const [bioData, setBioData] = useState<BioData | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<BrandIdentity | null>(null)
  const [brandId, setBrandId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const steps: LaunchStep[] = ['bio', 'brand', 'contact', 'launching', 'success']
  const currentStepIndex = steps.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  // Check authentication before allowing brand creation
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white/20 mx-auto mb-6"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Authentication Required
            </h2>
            <p className="text-white/60 mb-6">
              You need to be signed in to create a brand. Please log in or create an account to continue.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/login?returnUrl=/launch')}
                className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  async function handleBioSubmit(data: { name: string; email: string; bio: string }) {
    const bioData: BioData = {
      fullName: data.name,
      email: data.email,
      bio: data.bio
    }
    setBioData(bioData)
    setCurrentStep('brand')
  }

  async function handleBrandSelect(brand: BrandIdentity) {
    setSelectedBrand(brand)
    setCurrentStep('contact')
  }

  async function handleContactSubmit(data: ContactData) {
    if (!bioData || !selectedBrand || !user) return

    setCurrentStep('launching')
    setError(null)

    try {
      // Step 1: Create contact in Ola.CV
      console.log('Creating contact with data:', data)
      const contactResult = await createContact(data)
      console.log('Contact result:', contactResult)
      
      if (!contactResult.success || !contactResult.data) {
        console.error('Contact creation failed:', contactResult.error)
        throw new Error('Unable to create contact. Please check your information and try again.')
      }
      
      const contactId = typeof contactResult.data === 'string' 
        ? contactResult.data 
        : contactResult.data.id

      // Step 2: Register domain
      console.log('Registering domain:', selectedBrand.domain, 'for contact:', contactId)
      const domainResult = await registerDomain(selectedBrand.domain, contactId)
      console.log('Domain result:', domainResult)
      
      if (!domainResult.success || !domainResult.data) {
        console.error('Domain registration failed:', domainResult.error)
        throw new Error('Unable to register domain. The domain may already be taken or there was a service error.')
      }
      
      const domainRegistration = domainResult.data

      // Step 3: Create brand in database
      console.log('Creating brand in database for user:', user.id)
      
      try {
        const brand = await createBrand({
          userId: user.id, // Use authenticated user ID
          name: selectedBrand.brandName,
          domain: selectedBrand.domain,
          tagline: selectedBrand.tagline,
          bio: bioData.bio,
          colors: selectedBrand.colors,
          templateType: 'minimal-card',
          olaDomainId: domainRegistration.id,
          olaContactId: contactId,
          status: 'registering'
        })

        setBrandId(brand.id)
      } catch (dbError) {
        console.error('Database error:', dbError)
        // Log the full error details
        if (dbError && typeof dbError === 'object') {
          console.error('Error details:', JSON.stringify(dbError, null, 2))
        }
        throw new Error('Unable to save your brand. Please try again or contact support.')
      }

      // Step 4: Send email notification (TODO: Implement)
      // await sendLaunchNotification(bioData.email, brand)

      setCurrentStep('success')
    } catch (err) {
      console.error('Launch error:', err)
      // Show user-friendly error message
      const userMessage = err instanceof Error 
        ? err.message 
        : 'Something went wrong while launching your brand. Please try again.'
      setError(userMessage)
      setCurrentStep('contact')
    }
  }

  function handleBack() {
    if (currentStep === 'brand') setCurrentStep('bio')
    else if (currentStep === 'contact') setCurrentStep('brand')
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        {currentStep !== 'success' && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold text-white/70">
                {currentStep === 'bio' && 'Step 1: Tell us about yourself'}
                {currentStep === 'brand' && 'Step 2: Choose your brand'}
                {currentStep === 'contact' && 'Step 3: Contact information'}
                {currentStep === 'launching' && 'Launching your brand...'}
              </h2>
              <span className="text-sm text-white/50 font-medium">
                {currentStepIndex + 1} / {steps.length}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <motion.div
                className="bg-gradient-to-r from-brand-primary to-brand-secondary h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 'bio' && (
            <motion.div
              key="bio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-black rounded-2xl border border-white/10 shadow-2xl p-8">
                <h1 className="text-4xl font-bold text-white mb-3">
                  Create Your Brand
                </h1>
                <p className="text-white/60 text-lg mb-8">
                  Tell us about yourself and we&apos;ll generate a unique brand identity for you.
                </p>
                <BioInput onSubmit={handleBioSubmit} loading={false} />
              </div>
            </motion.div>
          )}

          {currentStep === 'brand' && bioData && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Choose Your Brand
                    </h1>
                    <p className="text-gray-600">
                      Select one of these AI-generated brand identities
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    ← Back
                  </button>
                </div>
                <BrandGenerator
                  bio={bioData.bio}
                  name={bioData.fullName}
                  onBrandSelected={handleBrandSelect}
                />
              </div>
            </motion.div>
          )}

          {currentStep === 'contact' && selectedBrand && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-black rounded-2xl border border-white/10 shadow-2xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      Contact Information
                    </h1>
                    <p className="text-white/60">
                      Required for domain registration: {selectedBrand.domain}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                </div>
                <ContactForm onSubmit={handleContactSubmit} loading={false} />
              </div>
            </motion.div>
          )}

          {currentStep === 'launching' && (
            <motion.div
              key="launching"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Launching Your Brand...
                </h2>
                <p className="text-gray-600">
                  We&apos;re registering your domain and setting up your website. This may take a moment.
                </p>
                <div className="mt-8 space-y-2 text-sm text-gray-500">
                  <p>✓ Creating brand identity</p>
                  <p>✓ Registering domain</p>
                  <p className="animate-pulse">⏳ Setting up website...</p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'success' && brandId && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <LaunchSuccess
                brandName={selectedBrand?.brandName || ''}
                domain={selectedBrand?.domain || ''}
                brandId={brandId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
