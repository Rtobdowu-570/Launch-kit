import '@testing-library/jest-dom'
import * as fc from 'fast-check'

// Configure fast-check for property-based testing
fc.configureGlobal({
  numRuns: 100, // Minimum 100 iterations as specified in design
  verbose: true,
  seed: 42, // Deterministic seed for reproducible tests
})

// Mock environment variables for tests
process.env.OLA_API_BASE_URL = 'https://developer.ola.cv/api/v1/'
process.env.OLA_API_TOKEN = 'test_token'
process.env.CLAUDE_API_KEY = 'test_claude_key'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test_anon_key'

// Mock Ola.CV API responses
const mockOlaResponses = {
  domains: {
    available: { available: true, price: 15.00 },
    unavailable: { available: false, price: null },
  },
  contact: {
    success: { id: 'contact_123', status: 'active' },
  },
  registration: {
    success: { id: 'domain_123', status: 'registered' },
  },
  dns: {
    zone: { id: 'zone_123', domain: 'test.cv', status: 'active' },
    records: [
      { id: 'record_1', type: 'A', name: '@', content: '192.168.1.1', ttl: 3600 },
      { id: 'record_2', type: 'MX', name: '@', content: 'mail.test.cv', ttl: 3600, priority: 10 },
    ],
  },
}

// Mock Claude API responses
const mockClaudeResponses = {
  brandGeneration: {
    success: {
      brands: [
        {
          brandName: 'TestBrand1',
          colors: { primary: '#FF6B6B', accent: '#4ECDC4', neutral: '#45B7D1' },
          tagline: 'Your success starts here',
        },
        {
          brandName: 'TestBrand2', 
          colors: { primary: '#96CEB4', accent: '#FFEAA7', neutral: '#DDA0DD' },
          tagline: 'Innovation meets excellence',
        },
        {
          brandName: 'TestBrand3',
          colors: { primary: '#74B9FF', accent: '#FD79A8', neutral: '#FDCB6E' },
          tagline: 'Building tomorrow today',
        },
      ],
    },
  },
}

// Enhanced fetch mock with realistic API responses
global.fetch = jest.fn((url, options) => {
  const urlString = typeof url === 'string' ? url : url.toString()
  
  // Mock Ola.CV API calls
  if (urlString.includes('ola.cv')) {
    if (urlString.includes('/domains/') && urlString.includes('/availability')) {
      const domain = urlString.split('/domains/')[1].split('/')[0]
      const isAvailable = !['taken.cv', 'unavailable.cv'].includes(domain)
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(isAvailable ? mockOlaResponses.domains.available : mockOlaResponses.domains.unavailable),
      })
    }
    
    if (urlString.includes('/contacts') && options?.method === 'POST') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockOlaResponses.contact.success),
      })
    }
    
    if (urlString.includes('/domains') && options?.method === 'POST') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockOlaResponses.registration.success),
      })
    }
    
    if (urlString.includes('/dns/zones')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockOlaResponses.dns.zone),
      })
    }
    
    if (urlString.includes('/dns/records')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockOlaResponses.dns.records),
      })
    }
  }
  
  // Mock Claude API calls
  if (urlString.includes('anthropic.com') || urlString.includes('claude')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockClaudeResponses.brandGeneration.success),
    })
  }
  
  // Default mock response
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
})

// Mock localStorage with enhanced functionality
const localStorageMock = {
  store: new Map(),
  getItem: jest.fn((key) => localStorageMock.store.get(key) || null),
  setItem: jest.fn((key, value) => localStorageMock.store.set(key, value)),
  removeItem: jest.fn((key) => localStorageMock.store.delete(key)),
  clear: jest.fn(() => localStorageMock.store.clear()),
  get length() { return localStorageMock.store.size },
  key: jest.fn((index) => Array.from(localStorageMock.store.keys())[index] || null),
}
global.localStorage = localStorageMock

// Mock window.location for testing
delete window.location
window.location = {
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
}

// Mock IntersectionObserver for components that might use it
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver for responsive components
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Export mock data for use in tests
export { mockOlaResponses, mockClaudeResponses }