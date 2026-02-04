import * as fc from 'fast-check';
import { checkDomainAvailability, createContact, getContact } from '../actions';
import { generators } from '@/test-utils';
import { ContactData } from '@/types';

// Mock fetch for testing
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock environment variables
const originalEnv = process.env;

// Helper to create proper mock response
const createMockResponse = (data: unknown, ok: boolean = true, status: number = 200) => ({
  ok,
  status,
  json: jest.fn().mockResolvedValue(data),
} as unknown as Response);

// Improved generators for testing
const testGenerators = {
  // Non-empty contact data (no whitespace-only fields)
  validContactData: fc.record({
    name: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length >= 2 && /^[a-zA-Z\s\-'\.]+$/.test(s.trim())),
    email: fc.emailAddress(),
    phone: fc.string({ minLength: 10, maxLength: 15 }).filter(s => /^[\d\s\-\(\)\+]+$/.test(s.trim()) && s.trim().length >= 10),
    address: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length >= 5 && /^[a-zA-Z0-9\s\.,\-#]+$/.test(s.trim())),
    city: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length >= 2 && /^[a-zA-Z\s\-'\.]+$/.test(s.trim())),
    postcode: fc.string({ minLength: 3, maxLength: 10 }).filter(s => s.trim().length >= 3 && /^[a-zA-Z0-9\s\-]+$/.test(s.trim())),
    country: fc.constantFrom('US', 'CA', 'GB', 'AU', 'DE', 'FR'),
  }),
  
  // Contact data with whitespace-only fields for negative testing
  invalidContactData: fc.record({
    name: fc.oneof(fc.constant(''), fc.constant('   '), fc.constant('\t\n')),
    email: fc.emailAddress(),
    phone: fc.oneof(fc.constant(''), fc.constant('   ')),
    address: fc.oneof(fc.constant(''), fc.constant('   ')),
    city: fc.oneof(fc.constant(''), fc.constant('   ')),
    postcode: fc.oneof(fc.constant(''), fc.constant('   ')),
    country: fc.constantFrom('US', 'CA', 'GB', 'AU', 'DE', 'FR'),
  }),
  
  // Domain names that work well with the API
  validDomainNames: fc.array(
    fc.string({ minLength: 3, maxLength: 20 })
      .filter(name => /^[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9]$/.test(name))
      .filter(name => !name.includes('--')),
    { minLength: 1, maxLength: 3 }
  ),
};

describe('Domain Management Property-Based Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch mock
    mockFetch.mockReset();
    
    process.env = {
      ...originalEnv,
      OLA_API_TOKEN: 'test-token',
      OLA_API_BASE_URL: 'https://api.test.ola.cv/v1',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  /**
   * Property 8: Domain Availability Check
   * Feature: launchkit-mvp, Property 8: Domain Availability Check
   * Validates: Requirements 3.1
   */
  it('Property 8: Domain Availability Check - should check .cv domain availability for each brand name', async () => {
    await fc.assert(
      fc.asyncProperty(
        testGenerators.validDomainNames,
        async (brandNames) => {
          // Mock successful API response with proper structure
          const mockApiResponse = {
            data: brandNames.map((_, index) => ({
              available: index % 2 === 0, // Alternate availability for testing
              premium: false,
              registration_fee: 25.00,
              renewal_fee: 25.00,
              currency: 'USD'
            }))
          };

          mockFetch.mockResolvedValueOnce(createMockResponse(mockApiResponse));

          const result = await checkDomainAvailability(brandNames);

          // Should return success
          expect(result.success).toBe(true);
          expect(result.data).toBeDefined();
          
          if (result.data) {
            // Should check availability for each domain
            expect(result.data).toHaveLength(brandNames.length);
            
            // Each result should have the correct domain format (.cv suffix)
            result.data.forEach((domainResult, index) => {
              const expectedDomain = brandNames[index].toLowerCase().endsWith('.cv') 
                ? brandNames[index].toLowerCase() 
                : `${brandNames[index].toLowerCase()}.cv`;
              
              expect(domainResult.domain).toBe(expectedDomain);
              expect(typeof domainResult.available).toBe('boolean');
              expect(domainResult.currency).toBeDefined();
            });
          }

          // Verify API was called with correct domains
          expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('/domains/check'),
            expect.objectContaining({
              method: 'POST',
              headers: expect.objectContaining({
                'Authorization': expect.stringContaining('Bearer'),
                'Content-Type': 'application/json',
              }),
              body: expect.stringContaining('.cv'),
            })
          );
        }
      ),
      { numRuns: 3, verbose: false }
    );
  });

  /**
   * Property 9: Contact Form Validation
   * Feature: launchkit-mvp, Property 9: Contact Form Validation
   * Validates: Requirements 4.2
   */
  it('Property 9: Contact Form Validation - should validate all required fields before API submission', async () => {
    await fc.assert(
      fc.asyncProperty(
        testGenerators.validContactData,
        async (contactData) => {
          // Test with complete valid contact data
          const mockApiResponse = {
            data: {
              id: 'contact_123',
              ...contactData,
            }
          };

          mockFetch.mockResolvedValueOnce(createMockResponse(mockApiResponse));

          const result = await createContact(contactData);

          // Should succeed with valid data
          expect(result.success).toBe(true);
          expect(result.data).toBeDefined();
          
          if (result.data) {
            expect(result.data.id).toBeDefined();
            expect(result.data.name).toBe(contactData.name);
            expect(result.data.email).toBe(contactData.email);
            expect(result.data.phone).toBe(contactData.phone);
            expect(result.data.address).toBe(contactData.address);
            expect(result.data.city).toBe(contactData.city);
            expect(result.data.postcode).toBe(contactData.postcode);
            expect(result.data.country).toBe(contactData.country);
          }

          // Verify API was called with correct data
          expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('/contacts'),
            expect.objectContaining({
              method: 'POST',
              headers: expect.objectContaining({
                'Authorization': expect.stringContaining('Bearer'),
                'Content-Type': 'application/json',
              }),
              body: expect.stringContaining(contactData.name.trim()),
            })
          );
        }
      ),
      { numRuns: 3, verbose: false }
    );
  });

  /**
   * Property 9b: Contact Form Validation - Missing Required Fields
   * Tests that missing required fields are properly rejected
   */
  it('Property 9b: Contact Form Validation - should reject contact data with missing required fields', async () => {
    await fc.assert(
      fc.asyncProperty(
        testGenerators.validContactData,
        fc.constantFrom('name', 'email', 'phone', 'address', 'city', 'postcode', 'country'),
        async (baseContactData, fieldToRemove) => {
          // Create contact data with one required field missing
          const incompleteContactData = { ...baseContactData };
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete incompleteContactData[fieldToRemove as keyof typeof incompleteContactData];

          const result = await createContact(incompleteContactData as ContactData);

          // Should fail validation
          expect(result.success).toBe(false);
          expect(result.error).toBeDefined();
          expect(result.error).toContain('Missing required fields');
          expect(result.error).toContain(fieldToRemove);

          // API should not be called for invalid data
          expect(mockFetch).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 3, verbose: false }
    );
  });

  /**
   * Property 9c: Contact Form Validation - Invalid Email Format
   * Tests that invalid email formats are properly rejected
   */
  it('Property 9c: Contact Form Validation - should reject invalid email formats', async () => {
    await fc.assert(
      fc.asyncProperty(
        testGenerators.validContactData,
        fc.oneof(
          fc.constant('invalid-email'),
          fc.constant('test@'),
          fc.constant('@test.com'),
          fc.constant('test.com'),
          fc.constant(''),
          fc.constant('   ')
        ),
        async (baseContactData, invalidEmail) => {
          const contactDataWithInvalidEmail = {
            ...baseContactData,
            email: invalidEmail,
          };

          const result = await createContact(contactDataWithInvalidEmail);

          // Should fail validation - either missing email or invalid format
          expect(result.success).toBe(false);
          expect(result.error).toBeDefined();
          
          // Check for either missing field or invalid format error
          const errorMessage = result.error as string;
          const isValidationError = errorMessage.includes('Invalid email format') || 
                                   errorMessage.includes('Missing required fields: email');
          expect(isValidationError).toBe(true);

          // API should not be called for invalid email
          expect(mockFetch).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 3, verbose: false }
    );
  });

  /**
   * Property 10: Contact ID Persistence
   * Feature: launchkit-mvp, Property 10: Contact ID Persistence
   * Validates: Requirements 4.5
   */
  it('Property 10: Contact ID Persistence - should store and retrieve contact ID for future domain operations', async () => {
    await fc.assert(
      fc.asyncProperty(
        testGenerators.validContactData,
        fc.string({ minLength: 8, maxLength: 32 }).filter(id => /^[a-zA-Z0-9_-]+$/.test(id)),
        async (contactData, contactId) => {
          // Mock contact creation response
          const createApiResponse = {
            data: {
              id: contactId,
              ...contactData,
            }
          };

          mockFetch.mockResolvedValueOnce(createMockResponse(createApiResponse));

          // Create contact
          const createResult = await createContact(contactData);
          expect(createResult.success).toBe(true);
          expect(createResult.data?.id).toBe(contactId);

          // Mock contact retrieval response
          const retrieveApiResponse = {
            data: {
              id: contactId,
              ...contactData,
            }
          };

          mockFetch.mockResolvedValueOnce(createMockResponse(retrieveApiResponse));

          // Retrieve contact using stored ID
          const retrieveResult = await getContact(contactId);
          
          // Should successfully retrieve the same contact
          expect(retrieveResult.success).toBe(true);
          expect(retrieveResult.data).toBeDefined();
          
          if (retrieveResult.data) {
            expect(retrieveResult.data.id).toBe(contactId);
            expect(retrieveResult.data.name).toBe(contactData.name);
            expect(retrieveResult.data.email).toBe(contactData.email);
            expect(retrieveResult.data.phone).toBe(contactData.phone);
            expect(retrieveResult.data.address).toBe(contactData.address);
            expect(retrieveResult.data.city).toBe(contactData.city);
            expect(retrieveResult.data.postcode).toBe(contactData.postcode);
            expect(retrieveResult.data.country).toBe(contactData.country);
          }

          // Verify both API calls were made
          expect(mockFetch).toHaveBeenCalledTimes(2);
          
          // First call should be contact creation
          expect(mockFetch).toHaveBeenNthCalledWith(1,
            expect.stringContaining('/contacts'),
            expect.objectContaining({ method: 'POST' })
          );
          
          // Second call should be contact retrieval
          expect(mockFetch).toHaveBeenNthCalledWith(2,
            expect.stringContaining(`/contacts/${contactId}`),
            expect.objectContaining({
              headers: expect.objectContaining({
                'Authorization': expect.stringContaining('Bearer'),
              }),
            })
          );
        }
      ),
      { numRuns: 3, verbose: false }
    );
  });

  /**
   * Property 10b: Contact ID Persistence - Invalid Contact ID
   * Tests that invalid contact IDs are properly handled
   */
  it('Property 10b: Contact ID Persistence - should handle invalid contact ID gracefully', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.constant(''), // Empty string
          fc.constant('   '), // Whitespace only
          fc.string({ minLength: 1, maxLength: 5 }).filter(s => s.trim().length === 0) // Various whitespace
        ),
        async (invalidContactId) => {
          const result = await getContact(invalidContactId);

          // Should fail validation
          expect(result.success).toBe(false);
          expect(result.error).toBeDefined();
          expect(result.error).toContain('Contact ID required');

          // API should not be called for invalid ID
          expect(mockFetch).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 3, verbose: false }
    );
  });

  /**
   * Additional Property: Domain Normalization
   * Tests that domains are properly normalized to .cv format
   */
  it('Property: Domain Normalization - should normalize domains to .cv format', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.oneof(
            testGenerators.validDomainNames.chain(names => fc.constant(names[0] || 'test')), // Without .cv
            testGenerators.validDomainNames.chain(names => fc.constant(`${names[0] || 'test'}.cv`)), // With .cv
            testGenerators.validDomainNames.chain(names => fc.constant(`${(names[0] || 'test').toUpperCase()}`)), // Uppercase
            testGenerators.validDomainNames.chain(names => fc.constant(`  ${names[0] || 'test'}  `)) // With whitespace
          ),
          { minLength: 1, maxLength: 2 }
        ),
        async (domains) => {
          // Mock API response with proper structure
          const mockApiResponse = {
            data: domains.map(() => ({
              available: true,
              premium: false,
              registration_fee: 25.00,
              renewal_fee: 25.00,
              currency: 'USD'
            }))
          };

          mockFetch.mockResolvedValueOnce(createMockResponse(mockApiResponse));

          const result = await checkDomainAvailability(domains);

          expect(result.success).toBe(true);
          
          if (result.data) {
            // All returned domains should be normalized
            result.data.forEach((domainResult) => {
              expect(domainResult.domain).toMatch(/^[a-z0-9][a-z0-9\-]*[a-z0-9]\.cv$|^[a-z0-9]\.cv$/);
              expect(domainResult.domain).not.toMatch(/\s/); // No whitespace
              expect(domainResult.domain).toBe(domainResult.domain.toLowerCase()); // Lowercase
            });
          }
        }
      ),
      { numRuns: 3, verbose: false }
    );
  });

  /**
   * Additional Property: Empty Domain Array Handling
   * Tests that empty domain arrays are properly handled
   */
  it('Property: Empty Domain Array Handling - should handle empty domain arrays gracefully', async () => {
    const result = await checkDomainAvailability([]);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('Domains array required');

    // API should not be called for empty array
    expect(mockFetch).not.toHaveBeenCalled();
  });

  /**
   * Additional Property: API Token Validation
   * Tests that missing API token is properly handled
   */
  it('Property: API Token Validation - should handle missing API token gracefully', async () => {
    // Remove API token
    delete process.env.OLA_API_TOKEN;

    const result = await checkDomainAvailability(['test']);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    
    // The error should be about missing token, not network error
    const errorMessage = result.error as string;
    expect(errorMessage).toContain('OLA_API_TOKEN not configured');

    // API should not be called without token
    expect(mockFetch).not.toHaveBeenCalled();
  });

  /**
   * Additional Property: Whitespace Field Validation
   * Tests that whitespace-only fields are properly rejected
   */
  it('Property: Whitespace Field Validation - should reject contact data with whitespace-only fields', async () => {
    await fc.assert(
      fc.asyncProperty(
        testGenerators.invalidContactData,
        async (contactDataWithWhitespace) => {
          const result = await createContact(contactDataWithWhitespace);

          // Should fail validation due to whitespace-only fields
          expect(result.success).toBe(false);
          expect(result.error).toBeDefined();
          expect(result.error).toContain('Missing required fields');

          // API should not be called for invalid data
          expect(mockFetch).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 3, verbose: false }
    );
  });
});