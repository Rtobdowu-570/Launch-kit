
import * as fc from 'fast-check';
import { generateBrandIdentities } from '../actions';

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

describe('Brand Generation Property-Based Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch mock
    mockFetch.mockReset();
    
    process.env = {
      ...originalEnv,
      GEMINI_API_KEY: 'test-key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  /**
   * Property 4: Brand Generation Count
   * Feature: launchkit-mvp, Property 4: Brand Generation Count
   * Validates: Requirements 2.1
   */
  it('Property 4: Brand Generation Count - should generate 3 brand identities', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 10 }),
        fc.string({ minLength: 2 }),
        async (bio, name) => {
          const mockApiResponse = {
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: JSON.stringify([
                        { brandName: 'Test Brand 1', colors: { primary: '#ffffff', accent: '#000000', neutral: '#cccccc' }, tagline: 'Tagline 1' },
                        { brandName: 'Test Brand 2', colors: { primary: '#ffffff', accent: '#000000', neutral: '#cccccc' }, tagline: 'Tagline 2' },
                        { brandName: 'Test Brand 3', colors: { primary: '#ffffff', accent: '#000000', neutral: '#cccccc' }, tagline: 'Tagline 3' },
                      ]),
                    },
                  ],
                },
              },
            ],
          };

          mockFetch.mockResolvedValueOnce(createMockResponse(mockApiResponse));

          const result = await generateBrandIdentities(bio, name);

          expect(result.success).toBe(true);
          expect(result.data).toBeDefined();
          expect(result.data?.length).toBe(3);
        }
      ),
      { numRuns: 3, verbose: false }
    );
  });

  /**
   * Property 5: Brand Identity Completeness
   * Feature: launchkit-mvp, Property 5: Brand Identity Completeness
   * Validates: Requirements 2.2, 2.3
   */
  it('Property 5: Brand Identity Completeness - should generate brand identities with all required fields', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 10 }),
        fc.string({ minLength: 2 }),
        async (bio, name) => {
          const mockApiResponse = {
            candidates: [
              {
                content: {
                  parts: [
                    {
                        text: JSON.stringify([
                            { brandName: 'Test Brand 1', colors: { primary: '#ffffff', accent: '#000000', neutral: '#cccccc' }, tagline: 'Tagline 1' },
                            { brandName: 'Test Brand 2', colors: { primary: '#ffffff', accent: '#000000', neutral: '#cccccc' }, tagline: 'Tagline 2' },
                            { brandName: 'Test Brand 3', colors: { primary: '#ffffff', accent: '#000000', neutral: '#cccccc' }, tagline: 'Tagline 3' },
                          ]),
                    },
                  ],
                },
              },
            ],
          };

          mockFetch.mockResolvedValueOnce(createMockResponse(mockApiResponse));

          const result = await generateBrandIdentities(bio, name);

          expect(result.success).toBe(true);
          result.data?.forEach(identity => {
            expect(identity.brandName).toBeDefined();
            expect(identity.colors).toBeDefined();
            expect(identity.colors.primary).toBeDefined();
            expect(identity.colors.accent).toBeDefined();
            expect(identity.colors.neutral).toBeDefined();
            expect(identity.tagline).toBeDefined();
          });
        }
      ),
      { numRuns: 3, verbose: false }
    );
  });

  /**
   * Property 6: Domain-Friendly Brand Names
   * Feature: launchkit-mvp, Property 6: Domain-Friendly Brand Names
   * Validates: Requirements 2.4
   */
  it('Property 6: Domain-Friendly Brand Names - should generate domain-friendly brand names', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 10 }),
        fc.string({ minLength: 2 }),
        async (bio, name) => {
            const mockApiResponse = {
                candidates: [
                  {
                    content: {
                      parts: [
                        {
                            text: JSON.stringify([
                                { brandName: 'Test Brand', colors: { primary: '#ffffff', accent: '#000000', neutral: '#cccccc' }, tagline: 'Tagline 1' },
                                { brandName: 'Another', colors: { primary: '#ffffff', accent: '#000000', neutral: '#cccccc' }, tagline: 'Tagline 2' },
                                { brandName: 'Invalid-Brand', colors: { primary: '#ffffff', accent: '#000000', neutral: '#cccccc' }, tagline: 'Tagline 3' },
                              ]),
                        },
                      ],
                    },
                  },
                ],
              };

          mockFetch.mockResolvedValueOnce(createMockResponse(mockApiResponse));

          const result = await generateBrandIdentities(bio, name);

          expect(result.success).toBe(true);
          // The invalid brand name should be filtered out
          expect(result.data?.length).toBe(2);
        }
      ),
      { numRuns: 3, verbose: false }
    );
  });

  /**
   * Property 7: Tagline Word Limit
   * Feature: launchkit-mvp, Property 7: Tagline Word Limit
   * Validates: Requirements 2.4
   */
  it('Property 7: Tagline Word Limit - should generate taglines with a maximum of 10 words', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 10 }),
        fc.string({ minLength: 2 }),
        async (bio, name) => {
            const mockApiResponse = {
                candidates: [
                  {
                    content: {
                      parts: [
                        {
                            text: JSON.stringify([
                                { brandName: 'Test Brand 1', colors: { primary: '#ffffff', accent: '#000000', neutral: '#cccccc' }, tagline: 'This is a valid tagline.' },
                                { brandName: 'Test Brand 2', colors: { primary: '#ffffff', accent: '#000000', neutral: '#cccccc' }, tagline: 'This is another valid tagline that has exactly ten words.' },
                                { brandName: 'Test Brand 3', colors: { primary: '#ffffff', accent: '#000000', neutral: '#cccccc' }, tagline: 'This tagline is way too long and should be filtered out completely.' },
                              ]),
                        },
                      ],
                    },
                  },
                ],
              };

          mockFetch.mockResolvedValueOnce(createMockResponse(mockApiResponse));

          const result = await generateBrandIdentities(bio, name);

          expect(result.success).toBe(true);
          // The invalid tagline should be filtered out
          expect(result.data?.length).toBe(2);
        }
      ),
      { numRuns: 3, verbose: false }
    );
  });
});
