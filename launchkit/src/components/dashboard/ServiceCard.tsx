'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Service } from '@/types'
import { trackServiceClick } from '@/lib/analytics'

interface ServiceCardProps {
  service: Service
  brandId: string
  onEdit?: () => void
  onDelete?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
  showActions?: boolean
  clickCount?: number
}

export function ServiceCard({
  service,
  brandId,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  showActions = true,
  clickCount = 0
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isSoldOut = !service.visible

  const handleClick = async (e: React.MouseEvent) => {
    // Don't track if clicking action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return
    }

    // Track the click
    await trackServiceClick(brandId, service.id, service.name, service.link)

    // Open link in new tab
    if (!isSoldOut) {
      window.open(service.link, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: showActions ? 1 : 1.02 }}
      className={`relative bg-white rounded-xl border-2 transition-all ${
        isSoldOut
          ? 'border-gray-200 opacity-60'
          : 'border-gray-200 hover:border-blue-400 hover:shadow-lg cursor-pointer'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Sold Out Badge */}
      {isSoldOut && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
            SOLD OUT
          </span>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Emoji Icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center text-3xl">
              {service.emoji || '📦'}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
              {service.name}
            </h3>

            {/* Price */}
            {service.price && (
              <p className="text-2xl font-bold text-blue-600 mb-2">
                {service.price}
              </p>
            )}

            {/* Link Preview */}
            <a
              href={service.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-blue-600 truncate block"
              onClick={(e) => e.stopPropagation()}
            >
              {service.link}
            </a>

            {/* Click Count */}
            {clickCount > 0 && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>{clickCount} {clickCount === 1 ? 'click' : 'clicks'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between"
          >
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onMoveUp?.()
                }}
                disabled={!canMoveUp}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onMoveDown?.()
                }}
                disabled={!canMoveDown}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move down"
              >
                ↓
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.()
                }}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete?.()
                }}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
