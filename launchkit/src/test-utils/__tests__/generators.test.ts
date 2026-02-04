import * as fc from 'fast-check'
import { generators, testHelpers } from '../index'

/**
 * Feature: launchkit-mvp, Property-based Testing Setup Validation
 * 
 * These tests validate that our property-based testing generators
 * and helpers are working correctly.
 */

describe('Property-based Testing Generators', () => {
  describe('Bio Input Generators', () => {
    it('should generate valid bios within character limit', () => {
      fc.assert(
        fc.property(generators.validBio, (bio) => {
          expect(bio.length).toBeGreaterThan(0)
          expect(bio.length).toBeLessThanOrEqual(120)
        }),
        { numRuns: 100 }
      )
    })

    it('should generate invalid bios exceeding character limit', () => {
      fc.assert(
        fc.property(generators.invalidBio, (bio) => {
          expect(bio.length).toBeGreaterThan(120)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Email Generators', () => {
    it('should generate valid email addresses', () => {
      fc.assert(
        fc.property(generators.validEmail, (email) => {
          expect(testHelpers.isValidEmail(email)).toBe(true)
        }),
        { numRuns: 100 }
      )
    })

    it('should generate invalid email addresses', () => {
      fc.assert(
        fc.property(generators.invalidEmail, (email) => {
          expect(testHelpers.isValidEmail(email)).toBe(false)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Domain-Friendly Name Generators', () => {
    it('should generate domain-friendly names', () => {
      fc.assert(
        fc.property(generators.domainFriendlyName, (name) => {
          expect(testHelpers.isDomainFriendly(name)).toBe(true)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Color Generators', () => {
    it('should generate valid hex colors', () => {
      fc.assert(
        fc.property(generators.hexColor, (color) => {
          expect(testHelpers.isValidHexColor(color)).toBe(true)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Tagline Generators', () => {
    it('should generate taglines with 10 words or fewer', () => {
      fc.assert(
        fc.property(generators.tagline, (tagline) => {
          const wordCount = testHelpers.countWords(tagline)
          expect(wordCount).toBeGreaterThan(0)
          expect(wordCount).toBeLessThanOrEqual(10)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Brand Identity Generators', () => {
    it('should generate complete brand identities', () => {
      fc.assert(
        fc.property(generators.brandIdentity, (brand) => {
          expect(brand.brandName).toBeTruthy()
          expect(testHelpers.isDomainFriendly(brand.brandName)).toBe(true)
          expect(testHelpers.isValidHexColor(brand.colors.primary)).toBe(true)
          expect(testHelpers.isValidHexColor(brand.colors.accent)).toBe(true)
          expect(testHelpers.isValidHexColor(brand.colors.neutral)).toBe(true)
          expect(testHelpers.countWords(brand.tagline)).toBeLessThanOrEqual(10)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Contact Data Generators', () => {
    it('should generate valid contact data', () => {
      fc.assert(
        fc.property(generators.contactData, (contact) => {
          expect(contact.name.length).toBeGreaterThan(1)
          expect(testHelpers.isValidEmail(contact.email)).toBe(true)
          expect(contact.phone.length).toBeGreaterThanOrEqual(10)
          expect(contact.address.length).toBeGreaterThan(4)
          expect(contact.city.length).toBeGreaterThan(1)
          expect(['US', 'CA', 'GB', 'AU', 'DE', 'FR']).toContain(contact.country)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('DNS Record Generators', () => {
    it('should generate valid DNS records', () => {
      fc.assert(
        fc.property(generators.dnsRecord, (record) => {
          expect(['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'SRV']).toContain(record.type)
          expect(record.name).toBeTruthy()
          expect(record.content).toBeTruthy()
          expect(record.ttl).toBeGreaterThanOrEqual(300)
          expect(record.ttl).toBeLessThanOrEqual(86400)
        }),
        { numRuns: 100 }
      )
    })
  })
})

describe('Test Helpers', () => {
  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(testHelpers.isValidEmail('test@example.com')).toBe(true)
      expect(testHelpers.isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(testHelpers.isValidEmail('invalid-email')).toBe(false)
      expect(testHelpers.isValidEmail('@domain.com')).toBe(false)
      expect(testHelpers.isValidEmail('test@')).toBe(false)
    })
  })

  describe('isDomainFriendly', () => {
    it('should validate domain-friendly names', () => {
      expect(testHelpers.isDomainFriendly('validname')).toBe(true)
      expect(testHelpers.isDomainFriendly('valid-name')).toBe(true)
      expect(testHelpers.isDomainFriendly('valid123')).toBe(true)
      expect(testHelpers.isDomainFriendly('-invalid')).toBe(false)
      expect(testHelpers.isDomainFriendly('invalid-')).toBe(false)
      expect(testHelpers.isDomainFriendly('invalid@name')).toBe(false)
      expect(testHelpers.isDomainFriendly('')).toBe(false)
    })
  })

  describe('countWords', () => {
    it('should count words correctly', () => {
      expect(testHelpers.countWords('hello world')).toBe(2)
      expect(testHelpers.countWords('  hello   world  ')).toBe(2)
      expect(testHelpers.countWords('single')).toBe(1)
      expect(testHelpers.countWords('')).toBe(0)
      expect(testHelpers.countWords('   ')).toBe(0)
    })
  })

  describe('isValidHexColor', () => {
    it('should validate hex color formats', () => {
      expect(testHelpers.isValidHexColor('#FF6B6B')).toBe(true)
      expect(testHelpers.isValidHexColor('#000000')).toBe(true)
      expect(testHelpers.isValidHexColor('#ffffff')).toBe(true)
      expect(testHelpers.isValidHexColor('FF6B6B')).toBe(false)
      expect(testHelpers.isValidHexColor('#FF6B6')).toBe(false)
      expect(testHelpers.isValidHexColor('#GG6B6B')).toBe(false)
    })
  })

  describe('isWhitespaceOnly', () => {
    it('should detect whitespace-only strings', () => {
      expect(testHelpers.isWhitespaceOnly('')).toBe(true)
      expect(testHelpers.isWhitespaceOnly('   ')).toBe(true)
      expect(testHelpers.isWhitespaceOnly('\t\n  ')).toBe(true)
      expect(testHelpers.isWhitespaceOnly('hello')).toBe(false)
      expect(testHelpers.isWhitespaceOnly(' hello ')).toBe(false)
    })
  })
})