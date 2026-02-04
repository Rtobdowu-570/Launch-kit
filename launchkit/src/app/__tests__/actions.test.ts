import { 
  checkDomainAvailability, 
  checkDomain, 
  createContact, 
  getContact,
  registerDomain,
  getDomainInfo,
  getDNSZone,
  listDNSRecords,
  createDNSRecord,
  updateDNSRecord,
  deleteDNSRecord,
  addGmailPreset
} from '../actions';
import { ContactData } from '@/types';

// Mock fetch globally
global.fetch = jest.fn();

describe('Ola.CV API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up environment variable
    process.env.OLA_API_TOKEN = 'test-token';
    // Suppress console.error for cleaner test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    delete process.env.OLA_API_TOKEN;
    // Restore console.error
    (console.error as jest.Mock).mockRestore();
  });

  describe('Domain Availability', () => {
    it('should check domain availability for multiple domains', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: [
            { available: true, premium: false, registration_fee: 10, currency: 'USD' },
            { available: false, premium: false }
          ]
        })
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await checkDomainAvailability(['test1', 'test2.cv']);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data![0].domain).toBe('test1.cv');
      expect(result.data![0].available).toBe(true);
      expect(result.data![1].domain).toBe('test2.cv');
      expect(result.data![1].available).toBe(false);
    });

    it('should handle empty domains array', async () => {
      const result = await checkDomainAvailability([]);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Domains array required');
    });

    it('should check single domain availability', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: [{ available: true, premium: false, registration_fee: 10, currency: 'USD' }]
        })
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await checkDomain('test.cv');
      
      expect(result.success).toBe(true);
      expect(result.data?.domain).toBe('test.cv');
      expect(result.data?.available).toBe(true);
    });
  });

  describe('Contact Management', () => {
    const validContactData: ContactData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      postcode: '10001',
      country: 'US'
    };

    it('should create contact with valid data', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: { id: 'contact-123', ...validContactData }
        })
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await createContact(validContactData);
      
      expect(result.success).toBe(true);
      expect(result.data?.id).toBe('contact-123');
    });

    it('should validate required fields', async () => {
      const invalidContactData = {
        name: 'John Doe',
        email: 'invalid-email',
        phone: '',
        address: '',
        city: '',
        postcode: '',
        country: ''
      } as ContactData;

      const result = await createContact(invalidContactData);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Missing required fields');
    });

    it('should validate email format', async () => {
      const invalidEmailData = {
        ...validContactData,
        email: 'invalid-email'
      };

      const result = await createContact(invalidEmailData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should get contact by ID', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: { id: 'contact-123', ...validContactData }
        })
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await getContact('contact-123');
      
      expect(result.success).toBe(true);
      expect(result.data?.id).toBe('contact-123');
    });
  });

  describe('Domain Registration', () => {
    it('should register domain with valid data', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: { 
            id: 'domain-123', 
            domain: 'test.cv',
            status: 'registered',
            registeredAt: '2024-01-01T00:00:00Z',
            expiresAt: '2025-01-01T00:00:00Z'
          }
        })
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await registerDomain('test.cv', 'contact-123');
      
      expect(result.success).toBe(true);
      expect(result.data?.domain).toBe('test.cv');
    });

    it('should handle missing parameters', async () => {
      const result = await registerDomain('', 'contact-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Domain and contact ID required');
    });
  });

  describe('DNS Management', () => {
    it('should list DNS records', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: [
            { id: 'record-1', type: 'A', name: '@', content: '1.2.3.4', ttl: 3600 }
          ]
        })
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await listDNSRecords('zone-123');
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data![0].type).toBe('A');
    });

    it('should create DNS record', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: { id: 'record-123', type: 'A', name: '@', content: '1.2.3.4', ttl: 3600 }
        })
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const record = {
        type: 'A' as const,
        name: '@',
        content: '1.2.3.4',
        ttl: 3600
      };

      const result = await createDNSRecord('zone-123', record);
      
      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('A');
    });

    it('should validate DNS record format', async () => {
      const invalidRecord = {
        type: 'INVALID' as any,
        name: '@',
        content: '1.2.3.4',
        ttl: 3600
      };

      const result = await createDNSRecord('zone-123', invalidRecord);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid DNS record type');
    });

    it('should add Gmail preset records', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: { id: 'record-123', type: 'MX', name: '@', content: 'aspmx.l.google.com', ttl: 3600, priority: 1 }
        })
      };
      
      // Mock multiple successful responses for Gmail records
      (fetch as jest.Mock)
        .mockResolvedValueOnce(mockResponse)
        .mockResolvedValueOnce(mockResponse)
        .mockResolvedValueOnce(mockResponse)
        .mockResolvedValueOnce(mockResponse)
        .mockResolvedValueOnce(mockResponse);

      const result = await addGmailPreset('zone-123');
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(5); // 5 Gmail MX records
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      // Mock all retry attempts to fail
      (fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'));

      const result = await checkDomain('test.cv');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network or server error');
    });

    it('should handle API errors', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({
          error: 'API Error',
          message: 'Invalid request'
        })
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await checkDomain('test.cv');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});