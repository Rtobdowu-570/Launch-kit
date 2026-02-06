'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface LaunchSuccessProps {
  brandName: string
  domain: string
  brandId: string
}

interface ConfettiParticle {
  left: string
  color: string
  duration: number
  delay: number
  rotate: number
}

export function LaunchSuccess({ brandName, domain, brandId }: LaunchSuccessProps) {
  const [showConfetti, setShowConfetti] = useState(true)

  // Generate confetti particles once on mount using useState initializer
  const [confettiParticles] = useState<ConfettiParticle[]>(() => {
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981']
    return Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 0.5,
      rotate: Math.random() * 360
    }))
  })

  useEffect(() => {
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confettiParticles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: particle.left,
                top: '-10px',
                backgroundColor: particle.color
              }}
              initial={{ y: -10, opacity: 1, rotate: 0 }}
              animate={{
                y: typeof window !== 'undefined' ? window.innerHeight + 10 : 1000,
                opacity: 0,
                rotate: particle.rotate
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: 'easeIn'
              }}
            />
          ))}
        </div>
      )}

      {/* Success Content */}
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Congratulations!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your brand <span className="font-semibold text-gray-900">{brandName}</span> is live!
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Your website is now available at{' '}
            <a
              href={`https://${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              {domain}
            </a>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <Link
            href={`/dashboard?brandId=${brandId}`}
            className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Go to Dashboard
          </Link>

          <div className="flex justify-center gap-4 mt-6">
            <a
              href={`https://${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
              View Your Site
            </a>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`https://${domain}`)
                alert('Link copied to clipboard!')
              }}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              Copy Link
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What&apos;s Next?</h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🎨</div>
              <h4 className="font-semibold text-gray-900 mb-1">Customize Your Brand</h4>
              <p className="text-sm text-gray-600">
                Edit your brand colors, tagline, and template in the dashboard
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🔗</div>
              <h4 className="font-semibold text-gray-900 mb-1">Add Service Links</h4>
              <p className="text-sm text-gray-600">
                Add up to 3 service links to showcase your offerings
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">📧</div>
              <h4 className="font-semibold text-gray-900 mb-1">Set Up Email</h4>
              <p className="text-sm text-gray-600">
                Configure DNS records to use your domain for email
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
