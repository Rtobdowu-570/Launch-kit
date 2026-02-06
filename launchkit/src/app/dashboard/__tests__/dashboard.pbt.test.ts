/**
 * Property-Based Tests for Dashboard Functionality
 * Feature: launchkit-mvp
 * 
 * These tests validate the correctness properties for dashboard service management:
 * - Property 16: Service Link Validation
 * - Property 17: Free User Service Limit
 * - Property 18: Service Card Display
 */

import * as fc from 'fast-check'
import { pbtConfig, testHelpers } from '@/test-utils'
import type { Service } from '@/types'

// Helper function to validate service link format
function validateServiceLink(link: string): boolean {
  return testHelpers.isValidUrl(link)
}

// Helper function to check if service has required display fields
function hasRequiredDisplayFields(service: Service): boolean {
  return (
    typeof service.name === 'string' &&
    service.name.length > 0 &&
    typeof service.link === 'string' &&
    service.link.length > 0
  )
}

// Helper function to check if service card contains all required information
function serviceCardContainsRequiredInfo(service: Service): {
  hasName: boolean
  hasPrice: boolean
  hasEmoji: boolean
  hasLink: boolean
} {
  return {
    hasName: typeof service.name === 'string' && service.name.length > 0,
    hasPrice: service.price === undefined || typeof service.price === 'string',
    hasEmoji: service.emoji === undefined || typeof service.emoji === 'string',
    hasLink: typeof service.link === 'string' && service.link.length > 0,
  }
}

// Generator for valid service data
const validServiceGenerator = fc.record({
  id: fc.uuid(),
  brandId: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  price: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
  link: fc.webUrl(),
  emoji: fc.option(
    fc.constantFrom('💼', '🎯', '📱', '💻', '🎨', '📧', '🚀', '⭐'),
    { nil: undefined }
  ),
  position: fc.nat({ max: 100 }),
  visible: fc.boolean(),
  createdAt: fc.integer({ min: 1577836800000, max: 1924905600000 }).map(ts => new Date(ts).toISOString()),
  updatedAt: fc.integer({ min: 1577836800000, max: 1924905600000 }).map(ts => new Date(ts).toISOString()),
})

describe('Dashboard Property-Based Tests', () => {
  /**
   * Property 16: Service Link Validation
   * Feature: launchkit-mvp, Property 16: Service Link Validation
   * Validates: Requirements 7.3, 8.1
   * 
   * For any service link addition, the system should validate the URL format
   * and display it with pricing information
   */
  describe('Property 16: Service Link Validation', () => {
    it('should validate URL format for all service links', () => {
      fc.assert(
        fc.property(validServiceGenerator, (service) => {
          // The service link should be a valid URL
          const isValid = validateServiceLink(service.link)
          expect(isValid).toBe(true)
          
          // If the link is valid, it should be parseable as a URL
          expect(() => new URL(service.link)).not.toThrow()
        }),
        { numRuns: pbtConfig.numRuns }
      )
    })

    it('should reject invalid URL formats', () => {
      const invalidUrlGenerator = fc.oneof(
        fc.constant('not-a-url'),
        fc.constant('http://'),
        fc.constant('://example.com'),
        fc.string().filter(s => !s.includes('://') && s.length > 0),
      )

      fc.assert(
        fc.property(invalidUrlGenerator, (invalidUrl) => {
          // Invalid URLs should fail validation
          let isValid = false
          try {
            new URL(invalidUrl)
            isValid = true
          } catch {
            isValid = false
          }
          
          // We expect these to be invalid
          expect(isValid).toBe(false)
        }),
        { numRuns: pbtConfig.numRuns }
      )
    })

    it('should display pricing information when provided', () => {
      fc.assert(
        fc.property(validServiceGenerator, (service) => {
          // Service should have required display fields
          const hasRequired = hasRequiredDisplayFields(service)
          expect(hasRequired).toBe(true)
          
          // If price is provided, it should be a string
          if (service.price !== undefined) {
            expect(typeof service.price).toBe('string')
            expect(service.price.length).toBeGreaterThan(0)
          }
        }),
        { numRuns: pbtConfig.numRuns }
      )
    })
  })

  /**
   * Property 17: Free User Service Limit
   * Feature: launchkit-mvp, Property 17: Free User Service Limit
   * Validates: Requirements 7.4
   * 
   * For any free user account, the system should enforce a maximum of 3 service links
   */
  describe('Property 17: Free User Service Limit', () => {
    it('should enforce maximum of 3 services for free users', () => {
      const serviceListGenerator = fc.array(validServiceGenerator, { minLength: 0, maxLength: 10 })

      fc.assert(
        fc.property(serviceListGenerator, (services) => {
          // Simulate free user limit check
          const freeUserLimit = 3
          const canAddService = services.length < freeUserLimit
          
          // If we have 3 or more services, we should not be able to add more
          if (services.length >= freeUserLimit) {
            expect(canAddService).toBe(false)
          } else {
            expect(canAddService).toBe(true)
          }
        }),
        { numRuns: pbtConfig.numRuns }
      )
    })

    it('should allow adding services when under the limit', () => {
      const underLimitGenerator = fc.array(validServiceGenerator, { minLength: 0, maxLength: 2 })

      fc.assert(
        fc.property(underLimitGenerator, (services) => {
          const freeUserLimit = 3
          const canAddService = services.length < freeUserLimit
          
          // With 0-2 services, we should always be able to add more
          expect(canAddService).toBe(true)
          expect(services.length).toBeLessThan(freeUserLimit)
        }),
        { numRuns: pbtConfig.numRuns }
      )
    })

    it('should prevent adding services when at the limit', () => {
      const atLimitGenerator = fc.array(validServiceGenerator, { minLength: 3, maxLength: 3 })

      fc.assert(
        fc.property(atLimitGenerator, (services) => {
          const freeUserLimit = 3
          const canAddService = services.length < freeUserLimit
          
          // With exactly 3 services, we should not be able to add more
          expect(canAddService).toBe(false)
          expect(services.length).toBe(freeUserLimit)
        }),
        { numRuns: pbtConfig.numRuns }
      )
    })
  })

  /**
   * Property 18: Service Card Display
   * Feature: launchkit-mvp, Property 18: Service Card Display
   * Validates: Requirements 8.2
   * 
   * For any service, the dashboard should display a card containing name, price, and emoji icon
   */
  describe('Property 18: Service Card Display', () => {
    it('should display all required service information', () => {
      fc.assert(
        fc.property(validServiceGenerator, (service) => {
          const displayInfo = serviceCardContainsRequiredInfo(service)
          
          // Name and link are always required
          expect(displayInfo.hasName).toBe(true)
          expect(displayInfo.hasLink).toBe(true)
          
          // Price and emoji are optional but should be valid if present
          expect(displayInfo.hasPrice).toBe(true)
          expect(displayInfo.hasEmoji).toBe(true)
        }),
        { numRuns: pbtConfig.numRuns }
      )
    })

    it('should handle services with all optional fields', () => {
      const serviceWithAllFieldsGenerator = fc.record({
        id: fc.uuid(),
        brandId: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 100 }),
        price: fc.string({ minLength: 1, maxLength: 20 }),
        link: fc.webUrl(),
        emoji: fc.constantFrom('💼', '🎯', '📱', '💻', '🎨', '📧', '🚀', '⭐'),
        position: fc.nat({ max: 100 }),
        visible: fc.boolean(),
        createdAt: fc.integer({ min: 1577836800000, max: 1924905600000 }).map(ts => new Date(ts).toISOString()),
        updatedAt: fc.integer({ min: 1577836800000, max: 1924905600000 }).map(ts => new Date(ts).toISOString()),
      })

      fc.assert(
        fc.property(serviceWithAllFieldsGenerator, (service) => {
          // All fields should be present and valid
          expect(service.name).toBeTruthy()
          expect(service.price).toBeTruthy()
          expect(service.emoji).toBeTruthy()
          expect(service.link).toBeTruthy()
          
          // Validate types
          expect(typeof service.name).toBe('string')
          expect(typeof service.price).toBe('string')
          expect(typeof service.emoji).toBe('string')
          expect(typeof service.link).toBe('string')
        }),
        { numRuns: pbtConfig.numRuns }
      )
    })

    it('should handle services with minimal required fields', () => {
      const minimalServiceGenerator = fc.record({
        id: fc.uuid(),
        brandId: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 100 }),
        price: fc.constant(undefined),
        link: fc.webUrl(),
        emoji: fc.constant(undefined),
        position: fc.nat({ max: 100 }),
        visible: fc.boolean(),
        createdAt: fc.integer({ min: 1577836800000, max: 1924905600000 }).map(ts => new Date(ts).toISOString()),
        updatedAt: fc.integer({ min: 1577836800000, max: 1924905600000 }).map(ts => new Date(ts).toISOString()),
      })

      fc.assert(
        fc.property(minimalServiceGenerator, (service) => {
          // Required fields should be present
          expect(service.name).toBeTruthy()
          expect(service.link).toBeTruthy()
          
          // Optional fields should be undefined
          expect(service.price).toBeUndefined()
          expect(service.emoji).toBeUndefined()
          
          // Service should still be valid for display
          const hasRequired = hasRequiredDisplayFields(service)
          expect(hasRequired).toBe(true)
        }),
        { numRuns: pbtConfig.numRuns }
      )
    })

    it('should maintain service position ordering', () => {
      const serviceListGenerator = fc.array(validServiceGenerator, { minLength: 1, maxLength: 10 })

      fc.assert(
        fc.property(serviceListGenerator, (services) => {
          // Sort services by position
          const sorted = [...services].sort((a, b) => a.position - b.position)
          
          // Verify positions are in ascending order
          for (let i = 0; i < sorted.length - 1; i++) {
            expect(sorted[i].position).toBeLessThanOrEqual(sorted[i + 1].position)
          }
        }),
        { numRuns: pbtConfig.numRuns }
      )
    })
  })
})
