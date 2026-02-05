
"use server";

import { ContactData, DomainAvailability, DomainRegistration, OlaContact, OlaDomain, OlaDNSZone, DNSRecord, BrandIdentity } from '@/types';

const BASE_URL = process.env.OLA_API_BASE_URL || "https://developer.ola.cv/api/v1";
const API_TOKEN = process.env.OLA_API_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// Exponential backoff configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
};

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string | object | null;
}

interface DomainCheckResponse {
  available?: boolean;
  premium?: boolean;
  registration_fee?: number;
  renewal_fee?: number;
  currency?: string;
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}


// Exponential backoff retry utility
async function withRetry<T>(
  operation: () => Promise<T>,
  retries: number = RETRY_CONFIG.maxRetries
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    const delay = Math.min(
      RETRY_CONFIG.baseDelay * Math.pow(2, RETRY_CONFIG.maxRetries - retries),
      RETRY_CONFIG.maxDelay
    );

    console.log(`Retrying operation in ${delay}ms. Retries left: ${retries - 1}`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return withRetry(operation, retries - 1);
  }
}

async function fetchOla<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  if (!API_TOKEN) {
    return { success: false, error: "OLA_API_TOKEN not configured" };
  }

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${API_TOKEN}`,
    ...(options.headers || {}),
  } as HeadersInit;

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      cache: 'no-store' // Ensure fresh data
    });

    const data = await response.json();
    
    // Return standardized response structure
    return { 
      success: response.ok, 
      data: (data.data || data) as T, 
      message: data.message, 
      error: !response.ok ? data : null 
    };
  } catch (error) {
    console.error("Ola.CV API Error:", error);
    return { success: false, error: "Network or server error" };
  }
}

// Domain availability checking
export async function checkDomainAvailability(domains: string[]): Promise<ApiResponse<DomainAvailability[]>> {
  if (!domains || domains.length === 0) {
    return { success: false, error: "Domains array required" };
  }

  if (!API_TOKEN) {
    return { success: false, error: "OLA_API_TOKEN not configured" };
  }

  // Normalize domains to ensure .cv suffix
  const normalizedDomains = domains.map(domain => {
    const cleanDomain = domain.toLowerCase().trim();
    return cleanDomain.endsWith('.cv') ? cleanDomain : `${cleanDomain}.cv`;
  });

  return withRetry(async () => {
    const response = await fetchOla<unknown>("/domains/check?fees=all", {
      method: "POST",
      body: JSON.stringify({ domains: normalizedDomains }),
    });

    if (response.success && response.data) {
      // Transform response to match our DomainAvailability interface
      const responseData = response.data as DomainCheckResponse[];
      const availabilityData: DomainAvailability[] = normalizedDomains.map((domain, index) => {
        const domainData = responseData[index] || {};
        return {
          domain,
          available: domainData.available || false,
          premium: domainData.premium || false,
          registrationFee: domainData.registration_fee,
          renewalFee: domainData.renewal_fee,
          currency: domainData.currency || 'USD'
        };
      });

      return { success: true, data: availabilityData, message: response.message };
    }

    return { success: false, error: response.error || "Domain check failed" };
  });
}

// Single domain check for convenience
export async function checkDomain(domain: string): Promise<ApiResponse<DomainAvailability>> {
  const result = await checkDomainAvailability([domain]);
  
  if (result.success && result.data && result.data.length > 0) {
    return { ...result, data: result.data[0] };
  }
  
  return { success: false, error: result.error || "Domain check failed" };
}

// Contact management
export async function createContact(contactData: ContactData): Promise<ApiResponse<OlaContact>> {
  // TODO: Save contact to your database
  // Validate required fields (check for both missing and whitespace-only fields)
  const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'postcode', 'country'];
  const missingFields = requiredFields.filter(field => {
    const value = contactData[field as keyof ContactData];
    return !value || typeof value !== 'string' || value.trim().length === 0;
  });
  
  if (missingFields.length > 0) {
    return { 
      success: false, 
      error: `Missing required fields: ${missingFields.join(', ')}` 
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactData.email.trim())) {
    return { success: false, error: "Invalid email format" };
  }

  return withRetry(async () => {
    const response = await fetchOla<OlaContact>("/contacts", {
      method: "POST",
      body: JSON.stringify({
        name: contactData.name.trim(),
        email: contactData.email.trim(),
        phone: contactData.phone.trim(),
        organization: contactData.organization?.trim() || '',
        address: contactData.address.trim(),
        city: contactData.city.trim(),
        state: contactData.state?.trim() || '',
        postcode: contactData.postcode.trim(),
        country: contactData.country.trim(),
      }),
    });

    return response;
  });
}

// Get contact information
export async function getContact(contactId: string): Promise<ApiResponse<OlaContact>> {
  if (!contactId || contactId.trim().length === 0) {
    return { success: false, error: "Contact ID required" };
  }

  return withRetry(async () => {
    return fetchOla<OlaContact>(`/contacts/${contactId.trim()}`);
  });
}

// Domain registration
export async function registerDomain(domain: string, contactId: string): Promise<ApiResponse<DomainRegistration>> {
  // TODO: Save the domain registration to your database and associate it with the user
  if (!domain || !contactId) {
    return { success: false, error: "Domain and contact ID required" };
  }

  // Normalize domain
  const normalizedDomain = domain.toLowerCase().trim();
  const finalDomain = normalizedDomain.endsWith('.cv') ? normalizedDomain : `${normalizedDomain}.cv`;

  return withRetry(async () => {
    const response = await fetchOla<DomainRegistration>("/domains", {
      method: "POST",
      body: JSON.stringify({
        name: finalDomain,
        registrant: contactId,
        nameservers: ["ns1.ola.cv", "ns2.ola.cv"],
        auto_renew: true,
      }),
    });

    return response;
  });
}

// Get domain information
export async function getDomainInfo(domainId: string): Promise<ApiResponse<OlaDomain>> {
  if (!domainId) {
    return { success: false, error: "Domain ID required" };
  }

  return withRetry(async () => {
    return fetchOla<OlaDomain>(`/domains/${domainId}`);
  });
}

// DNS Zone management
export async function getDNSZone(domainId: string): Promise<ApiResponse<OlaDNSZone>> {
  if (!domainId) {
    return { success: false, error: "Domain ID required" };
  }

  return withRetry(async () => {
    return fetchOla<OlaDNSZone>(`/domains/${domainId}/zone`);
  });
}

// DNS Records management
export async function listDNSRecords(zoneId: string): Promise<ApiResponse<DNSRecord[]>> {
  if (!zoneId) {
    return { success: false, error: "Zone ID required" };
  }

  return withRetry(async () => {
    return fetchOla<DNSRecord[]>(`/zones/${zoneId}/records`);
  });
}

export async function createDNSRecord(zoneId: string, record: DNSRecord): Promise<ApiResponse<DNSRecord>> {
  if (!zoneId || !record) {
    return { success: false, error: "Zone ID and record data required" };
  }

  // Validate DNS record format
  if (!record.type || !record.name || !record.content) {
    return { success: false, error: "DNS record must have type, name, and content" };
  }

  const validTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'SRV'];
  if (!validTypes.includes(record.type)) {
    return { success: false, error: `Invalid DNS record type. Must be one of: ${validTypes.join(', ')}` };
  }

  return withRetry(async () => {
    return fetchOla<DNSRecord>(`/zones/${zoneId}/records`, {
      method: "POST",
      body: JSON.stringify({
        type: record.type,
        name: record.name,
        content: record.content,
        ttl: record.ttl || 3600,
        priority: record.priority,
        comment: record.comment || '',
      }),
    });
  });
}

export async function updateDNSRecord(zoneId: string, recordId: string, record: DNSRecord): Promise<ApiResponse<DNSRecord>> {
  if (!zoneId || !recordId || !record) {
    return { success: false, error: "Zone ID, record ID, and record data required" };
  }

  return withRetry(async () => {
    return fetchOla<DNSRecord>(`/zones/${zoneId}/records/${recordId}`, {
      method: "PUT",
      body: JSON.stringify({
        type: record.type,
        name: record.name,
        content: record.content,
        ttl: record.ttl || 3600,
        priority: record.priority,
        comment: record.comment || '',
      }),
    });
  });
}

export async function deleteDNSRecord(zoneId: string, recordId: string): Promise<ApiResponse<void>> {
  if (!zoneId || !recordId) {
    return { success: false, error: "Zone ID and record ID required" };
  }

  return withRetry(async () => {
    return fetchOla<void>(`/zones/${zoneId}/records/${recordId}`, {
      method: "DELETE",
    });
  });
}

// Gmail preset functionality
export async function addGmailPreset(zoneId: string): Promise<ApiResponse<DNSRecord[]>> {
  if (!zoneId) {
    return { success: false, error: "Zone ID required" };
  }

  const gmailRecords: Omit<DNSRecord, 'id'>[] = [
    {
      type: 'MX',
      name: '@',
      content: 'aspmx.l.google.com',
      ttl: 3600,
      priority: 1,
      comment: 'Gmail MX Record - Primary'
    },
    {
      type: 'MX',
      name: '@',
      content: 'alt1.aspmx.l.google.com',
      ttl: 3600,
      priority: 5,
      comment: 'Gmail MX Record - Alt 1'
    },
    {
      type: 'MX',
      name: '@',
      content: 'alt2.aspmx.l.google.com',
      ttl: 3600,
      priority: 5,
      comment: 'Gmail MX Record - Alt 2'
    },
    {
      type: 'MX',
      name: '@',
      content: 'alt3.aspmx.l.google.com',
      ttl: 3600,
      priority: 10,
      comment: 'Gmail MX Record - Alt 3'
    },
    {
      type: 'MX',
      name: '@',
      content: 'alt4.aspmx.l.google.com',
      ttl: 3600,
      priority: 10,
      comment: 'Gmail MX Record - Alt 4'
    }
  ];

  try {
    const createdRecords: DNSRecord[] = [];
    
    for (const record of gmailRecords) {
      const result = await createDNSRecord(zoneId, record as DNSRecord);
      if (result.success && result.data) {
        createdRecords.push(result.data);
      } else {
        console.warn(`Failed to create Gmail DNS record:`, result.error);
      }
    }

    return { 
      success: true, 
      data: createdRecords,
      message: `Created ${createdRecords.length} Gmail DNS records`
    };
  } catch {
    return { success: false, error: "Failed to add Gmail preset records" };
  }
}

// Legacy function for backward compatibility
export async function getDnsRecords(zoneId: string) {
  return listDNSRecords(zoneId);
}

// Gemini Brand Generation
export async function generateBrandIdentities(bio: string, name: string): Promise<ApiResponse<BrandIdentity[]>> {
    // Note: This function only generates brand identities. It does not save them.
    // The selected brand should be saved in a separate step.
    if (!GEMINI_API_KEY) {
        return { success: false, error: "GEMINI_API_KEY not configured" };
    }

    if (!bio || !name) {
        return { success: false, error: "Bio and name are required" };
    }

    const prompt = `
        You are a world-class brand strategist. Given a person's bio and name, generate 3 brand identities that are memorable, domain-friendly, and culturally aware.
        For each, provide a brand name (1-2 words, no special characters), a color palette (primary, accent, neutral hex codes), and a punchy tagline (max 10 words).
        Avoid generic tech startup vibes. Be bold and specific.

        User Bio: "${bio}"
        User Name: "${name}"

        Return as a JSON array of objects, where each object has the following structure: {brandName: string, colors: {primary: string, accent: string, neutral: string}, tagline: string}.
    `;

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error:", errorData);
            return { success: false, error: "Failed to generate brand identities from Gemini API." };
        }

        const data: GeminiResponse = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        
        // Clean the text to extract the JSON array
        const jsonText = text.substring(text.indexOf('['), text.lastIndexOf(']') + 1);
        const brandIdentities: BrandIdentity[] = JSON.parse(jsonText);

        // Validate the generated identities
        const validIdentities = brandIdentities.filter(identity =>
            isDomainFriendly(identity.brandName) && isTaglineValid(identity.tagline)
        );

        return { success: true, data: validIdentities };

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return { success: false, error: "An error occurred while generating brand identities." };
    }
}

function isDomainFriendly(name: string): boolean {
    if (!name || typeof name !== 'string') return false;
    // 1-2 words, no special characters
    const words = name.split(' ');
    if (words.length < 1 || words.length > 2) return false;
    return /^[a-zA-Z0-9\s]+$/.test(name);
}

function isTaglineValid(tagline: string): boolean {
    if (!tagline || typeof tagline !== 'string') return false;
    // max 10 words
    return tagline.split(' ').length <= 10;
}
