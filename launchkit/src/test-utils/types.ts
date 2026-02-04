// Test-specific type definitions for LaunchKit MVP

export interface MockApiResponse<T = any> {
  ok: boolean
  status: number
  json: () => Promise<T>
}

export interface BioData {
  fullName: string
  bio: string
  email: string
}

export interface BrandIdentity {
  id: string
  brandName: string
  domain: string
  colors: {
    primary: string
    accent: string
    neutral: string
  }
  tagline: string
  available: boolean
}

export interface ContactData {
  name: string
  email: string
  phone: string
  organization?: string
  address: string
  city: string
  state?: string
  postcode: string
  country: string
}

export interface DNSRecord {
  id?: string
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'SRV'
  name: string
  content: string
  ttl: number
  priority?: number
  comment?: string
}

export interface ServiceLink {
  id: string
  name: string
  price?: string
  link: string
  emoji?: string
  position: number
  visible: boolean
}

export interface Brand {
  id: string
  userId: string
  name: string
  domain: string
  tagline: string
  bio: string
  colors: {
    primary: string
    accent: string
    neutral: string
  }
  templateType: 'minimal-card' | 'magazine-grid' | 'terminal-retro'
  olaDomainId?: string
  olaContactId?: string
  olaZoneId?: string
  status: 'draft' | 'registering' | 'live' | 'failed'
  createdAt: string
  updatedAt: string
}

// Property-based testing specific types
export interface PropertyTestConfig {
  numRuns: number
  verbose: boolean
  seed?: number
}

export interface TestGenerators {
  validBio: any
  invalidBio: any
  validEmail: any
  invalidEmail: any
  fullName: any
  domainFriendlyName: any
  hexColor: any
  tagline: any
  validUrl: any
  phoneNumber: any
  contactData: any
  dnsRecord: any
  brandIdentity: any
}

export interface TestHelpers {
  isValidEmail: (email: string) => boolean
  isDomainFriendly: (name: string) => boolean
  countWords: (text: string) => number
  isValidHexColor: (color: string) => boolean
  isValidUrl: (url: string) => boolean
  isWhitespaceOnly: (str: string) => boolean
}

// Mock API response types
export interface OlaDomainAvailability {
  available: boolean
  price: number | null
}

export interface OlaContactResponse {
  id: string
  status: string
}

export interface OlaDomainRegistration {
  id: string
  status: string
}

export interface OlaDNSZone {
  id: string
  domain: string
  status: string
}

export interface ClaudeBrandResponse {
  brands: Array<{
    brandName: string
    colors: {
      primary: string
      accent: string
      neutral: string
    }
    tagline: string
  }>
}