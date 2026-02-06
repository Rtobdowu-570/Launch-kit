import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import * as fc from 'fast-check'

// Custom render function for testing React components
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options })

export * from '@testing-library/react'
export { customRender as render }

// Property-based testing generators for LaunchKit domain
export const generators = {
  // Bio input generators
  validBio: fc.string({ minLength: 1, maxLength: 120 }),
  invalidBio: fc.string({ minLength: 121, maxLength: 200 }),
  
  // Email generators
  validEmail: fc.emailAddress(),
  invalidEmail: fc.oneof(
    fc.string().filter(s => !s.includes('@')),
    fc.string().map(s => s + '@'),
    fc.string().map(s => '@' + s),
  ),
  
  // Name generators
  fullName: fc.string({ minLength: 2, maxLength: 50 }),
  
  // Brand name generators (domain-friendly)
  domainFriendlyName: fc.string({ minLength: 1, maxLength: 50 })
    .filter(name => /^[a-zA-Z0-9-]+$/.test(name))
    .filter(name => !name.startsWith('-') && !name.endsWith('-'))
    .filter(name => name.length > 0),
  
  // Color generators
  hexColor: fc.integer({ min: 0, max: 0xFFFFFF })
    .map(num => `#${num.toString(16).padStart(6, '0').toUpperCase()}`),
  
  // Tagline generators (max 10 words)
  tagline: fc.array(
    fc.string({ minLength: 1, maxLength: 15 }).filter(word => !word.includes(' ')), 
    { minLength: 1, maxLength: 10 }
  ).map(words => words.join(' ')),
  
  // URL generators
  validUrl: fc.webUrl(),
  
  // Phone number generators
  phoneNumber: fc.string({ minLength: 10, maxLength: 15 })
    .filter(phone => /^\+?[0-9\s\-\(\)]+$/.test(phone)),
  
  // Contact data generators
  contactData: fc.record({
    name: fc.string({ minLength: 2, maxLength: 50 }),
    email: fc.emailAddress(),
    phone: fc.string({ minLength: 10, maxLength: 15 }),
    address: fc.string({ minLength: 5, maxLength: 100 }),
    city: fc.string({ minLength: 2, maxLength: 50 }),
    postcode: fc.string({ minLength: 3, maxLength: 10 }),
    country: fc.constantFrom('US', 'CA', 'GB', 'AU', 'DE', 'FR'),
  }),
  
  // DNS record generators
  dnsRecord: fc.record({
    type: fc.constantFrom('A', 'AAAA', 'CNAME', 'MX', 'TXT', 'SRV'),
    name: fc.oneof(
      fc.constant('@'),
      fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z0-9\-_]+$/.test(s))
    ),
    content: fc.string({ minLength: 1, maxLength: 100 }),
    ttl: fc.integer({ min: 300, max: 86400 }),
  }),
  
  // Brand identity generators
  brandIdentity: fc.record({
    brandName: fc.string({ minLength: 1, maxLength: 50 })
      .filter(name => /^[a-zA-Z0-9-]+$/.test(name))
      .filter(name => !name.startsWith('-') && !name.endsWith('-'))
      .filter(name => name.length > 0),
    colors: fc.record({
      primary: fc.integer({ min: 0, max: 0xFFFFFF })
        .map(num => `#${num.toString(16).padStart(6, '0').toUpperCase()}`),
      accent: fc.integer({ min: 0, max: 0xFFFFFF })
        .map(num => `#${num.toString(16).padStart(6, '0').toUpperCase()}`),
      neutral: fc.integer({ min: 0, max: 0xFFFFFF })
        .map(num => `#${num.toString(16).padStart(6, '0').toUpperCase()}`),
    }),
    tagline: fc.array(
      fc.string({ minLength: 1, maxLength: 15 }).filter(word => !word.includes(' ')), 
      { minLength: 1, maxLength: 10 }
    ).map(words => words.join(' ')),
  }),
}

// Helper functions for property-based testing
export const testHelpers = {
  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  // Validate domain-friendly name
  isDomainFriendly: (name: string): boolean => {
    return /^[a-zA-Z0-9-]+$/.test(name) && 
           !name.startsWith('-') && 
           !name.endsWith('-') &&
           name.length > 0
  },
  
  // Count words in tagline
  countWords: (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  },
  
  // Validate hex color
  isValidHexColor: (color: string): boolean => {
    return /^#[0-9A-Fa-f]{6}$/.test(color)
  },
  
  // Validate URL format
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },
  
  // Check if string contains only whitespace
  isWhitespaceOnly: (str: string): boolean => {
    return str.trim().length === 0
  },
}

// Property-based test configuration
export const pbtConfig = {
  numRuns: 25, // Reduced for faster test execution
  verbose: false,
  seed: 42, // For reproducible tests
}

// Mock API response helpers
export const mockResponses = {
  createSuccessResponse: <T>(data: T) => ({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  }),
  
  createErrorResponse: (status: number, message: string) => ({
    ok: false,
    status,
    json: () => Promise.resolve({ error: message }),
  }),
}

// Test data factories
export const factories = {
  createBioData: (overrides = {}) => ({
    fullName: 'John Doe',
    bio: 'I am a software developer who builds amazing web applications',
    email: 'john@example.com',
    ...overrides,
  }),
  
  createBrandIdentity: (overrides = {}) => ({
    id: 'brand_123',
    brandName: 'TestBrand',
    domain: 'testbrand.cv',
    colors: {
      primary: '#FF6B6B',
      accent: '#4ECDC4',
      neutral: '#45B7D1',
    },
    tagline: 'Your success starts here',
    available: true,
    ...overrides,
  }),
  
  createContactData: (overrides = {}) => ({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    address: '123 Main St',
    city: 'New York',
    postcode: '10001',
    country: 'US',
    ...overrides,
  }),
}