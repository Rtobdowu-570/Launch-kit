// Core data types for LaunchKit MVP

export interface BioData {
  fullName: string;
  bio: string;
  email: string;
}

export interface BrandIdentity {
  id: string;
  brandName: string;
  domain: string;
  colors: {
    primary: string;
    accent: string;
    neutral: string;
  };
  tagline: string;
  available: boolean;
}

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  address: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
}

export interface DNSRecord {
  id?: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'SRV';
  name: string;
  content: string;
  ttl: number;
  priority?: number;
  comment?: string;
}

export interface Brand {
  id: string;
  userId: string;
  name: string;
  domain: string;
  tagline: string;
  bio: string;
  colors: {
    primary: string;
    accent: string;
    neutral: string;
  };
  templateType: 'minimal-card' | 'magazine-grid' | 'terminal-retro';
  olaDomainId?: string;
  olaContactId?: string;
  olaZoneId?: string;
  status: 'draft' | 'registering' | 'deploying' | 'configuring_dns' | 'live' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  brandId: string;
  name: string;
  price?: string;
  link: string;
  emoji?: string;
  position: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

// Ola.CV API Types
export interface OlaContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization?: string;
  address: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
}

export interface OlaDomain {
  id: string;
  domain: string;
  autoRenew: boolean;
  registeredAt: string;
  expiresAt: string;
}

export interface OlaDNSZone {
  id: string;
  domain: string;
  status: string;
}

export interface DomainAvailability {
  domain: string;
  available: boolean;
  premium?: boolean;
  registrationFee?: number;
  renewalFee?: number;
  currency?: string;
}

export interface DomainRegistration {
  id: string;
  domain: string;
  status: string;
  registeredAt: string;
  expiresAt: string;
}

export interface Deployment {
  id: string;
  brandId: string;
  deploymentUrl: string;
  status: 'building' | 'live' | 'failed';
  buildLog?: string;
  deployedAt?: string;
  createdAt: string;
}