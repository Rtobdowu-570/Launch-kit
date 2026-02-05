
import * as fc from 'fast-check';
import {
  createDNSRecord,
  getDNSZone,
  listDNSRecords,
} from '../actions';
import { generators } from '@/test-utils';
import { DNSRecord } from '@/types';

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

describe('DNS Management Property-Based Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
   * Property 11: DNS Record Validation
   * Validates: Requirements 5.3, 5.5
   */
  it('Property 11: DNS Record Validation - should validate DNS records before creation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 5 }),
        generators.dnsRecord(),
        async (zoneId, record) => {
          // Test with a valid record
          mockFetch.mockResolvedValueOnce(createMockResponse({ data: record }));
          const result = await createDNSRecord(zoneId, record);
          expect(result.success).toBe(true);

          // Test with an invalid record (missing type)
          const invalidRecord = { ...record };
          delete (invalidRecord as Partial<DNSRecord>).type;
          const invalidResult = await createDNSRecord(zoneId, invalidRecord as DNSRecord);
          expect(invalidResult.success).toBe(false);
          expect(invalidResult.error).toContain('must have type, name, and content');
        }
      )
    );
  });

  /**
   * Property 12: DNS Zone Retrieval
   * Validates: Requirements 5.1
   */
  it('Property 12: DNS Zone Retrieval - should retrieve DNS zone information for a given domain', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string({ minLength: 5 }), async (domainId) => {
        const mockZone = { id: 'zone_123', domain_id: domainId, records: [] };
        mockFetch.mockResolvedValueOnce(createMockResponse({ data: mockZone }));

        const result = await getDNSZone(domainId);

        expect(result.success).toBe(true);
        expect(result.data?.domain_id).toBe(domainId);
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining(`/domains/${domainId}/zone`),
          expect.any(Object)
        );
      })
    );
  });
});
