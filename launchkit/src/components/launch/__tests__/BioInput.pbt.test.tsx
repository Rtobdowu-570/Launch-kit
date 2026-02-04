import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import BioInput from '../BioInput';
import { generators, testHelpers, pbtConfig } from '@/test-utils';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('BioInput Property-Based Tests', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * Property 1: Bio Length Validation
   * Feature: launchkit-mvp, Property 1: Bio Length Validation
   * Validates: Requirements 1.2
   */
  it('Property 1: Bio Length Validation - should prevent submission and display character count for bios exceeding 120 characters', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 121, maxLength: 200 }), // Generate bios longer than 120 chars
        (longBio) => {
          cleanup(); // Clean up before each iteration
          
          const { unmount } = render(<BioInput onSubmit={mockOnSubmit} />);
          
          const bioInput = screen.getByLabelText(/one-sentence bio/i);
          const submitButton = screen.getByRole('button', { name: /generate my brand identity/i });
          
          // Fill in required fields with valid data
          fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
          fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
          
          // Input the long bio
          fireEvent.change(bioInput, { target: { value: longBio } });
          
          // Bio should be truncated to 120 characters (after sanitization and trimming)
          const sanitizedBio = longBio
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '')
            .trim();
          const truncatedBio = sanitizedBio.substring(0, 120);
          
          expect(bioInput).toHaveValue(truncatedBio);
          
          // Character count should show the actual length
          expect(screen.getByText(`${truncatedBio.length}/120`)).toBeInTheDocument();
          
          // Submit button should be enabled if bio meets minimum requirements
          if (truncatedBio.trim().length >= 10) {
            expect(submitButton).not.toBeDisabled();
          } else {
            expect(submitButton).toBeDisabled();
          }
          
          // Clean up for next iteration
          unmount();
        }
      ),
      { numRuns: pbtConfig.numRuns, verbose: pbtConfig.verbose }
    );
  });

  /**
   * Property 2: Email Format Validation  
   * Feature: launchkit-mvp, Property 2: Email Format Validation
   * Validates: Requirements 1.3
   */
  it('Property 2: Email Format Validation - should validate email format before allowing progression', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Invalid email formats
          fc.string().filter(s => !testHelpers.isValidEmail(s) && s.length > 0),
          fc.string().map(s => s + '@'),
          fc.string().map(s => '@' + s),
          fc.string().filter(s => !s.includes('@') && s.length > 0)
        ),
        (invalidEmail) => {
          cleanup(); // Clean up before each iteration
          
          const { unmount } = render(<BioInput onSubmit={mockOnSubmit} />);
          
          const submitButton = screen.getByRole('button', { name: /generate my brand identity/i });
          
          // Fill in required fields with valid data
          fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
          fireEvent.change(screen.getByLabelText(/one-sentence bio/i), { target: { value: 'I am a developer' } });
          
          // Input invalid email
          fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: invalidEmail } });
          
          // Submit button should be disabled for invalid email
          expect(submitButton).toBeDisabled();
          
          // Clean up for next iteration
          unmount();
        }
      ),
      { numRuns: pbtConfig.numRuns, verbose: pbtConfig.verbose }
    );
  });

  /**
   * Property 3: Input Sanitization
   * Feature: launchkit-mvp, Property 3: Input Sanitization  
   * Validates: Requirements 1.5
   */
  it('Property 3: Input Sanitization - should sanitize input containing special characters or emojis to prevent XSS attacks', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // XSS attack patterns
          fc.constant('<script>alert("xss")</script>'),
          fc.constant('<img src="x" onerror="alert(1)">'),
          fc.constant('javascript:alert("xss")'),
          fc.constant('<div onclick="alert(1)">test</div>'),
          fc.constant('<svg onload="alert(1)">'),
          // Combined with normal text
          fc.string({ minLength: 1, maxLength: 50 }).map(s => `<script>alert("xss")</script>${s}`),
          fc.string({ minLength: 1, maxLength: 50 }).map(s => `${s}javascript:alert("xss")`),
          fc.string({ minLength: 1, maxLength: 50 }).map(s => `${s}<img onerror="alert(1)" src="x">`)
        ),
        (maliciousInput) => {
          cleanup(); // Clean up before each iteration
          
          const { unmount } = render(<BioInput onSubmit={mockOnSubmit} />);
          
          const nameInput = screen.getByLabelText(/full name/i);
          const bioInput = screen.getByLabelText(/one-sentence bio/i);
          const emailInput = screen.getByLabelText(/email address/i);
          
          // Test sanitization on all input fields
          fireEvent.change(nameInput, { target: { value: maliciousInput } });
          fireEvent.change(bioInput, { target: { value: maliciousInput } });
          fireEvent.change(emailInput, { target: { value: maliciousInput } });
          
          // Verify that dangerous content is removed
          const nameValue = nameInput.value;
          const bioValue = bioInput.value;
          const emailValue = emailInput.value;
          
          // Should not contain script tags
          expect(nameValue).not.toMatch(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi);
          expect(bioValue).not.toMatch(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi);
          expect(emailValue).not.toMatch(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi);
          
          // Should not contain javascript: protocol
          expect(nameValue).not.toMatch(/javascript:/gi);
          expect(bioValue).not.toMatch(/javascript:/gi);
          expect(emailValue).not.toMatch(/javascript:/gi);
          
          // Should not contain event handlers
          expect(nameValue).not.toMatch(/on\w+=/gi);
          expect(bioValue).not.toMatch(/on\w+=/gi);
          expect(emailValue).not.toMatch(/on\w+=/gi);
          
          // Clean up for next iteration
          unmount();
        }
      ),
      { numRuns: pbtConfig.numRuns, verbose: pbtConfig.verbose }
    );
  });

  /**
   * Additional Property: Valid Email Acceptance
   * Ensures that valid emails are properly accepted
   */
  it('Property: Valid Email Acceptance - should accept valid email formats', () => {
    fc.assert(
      fc.property(
        generators.validEmail,
        (validEmail) => {
          cleanup(); // Clean up before each iteration
          
          const { unmount } = render(<BioInput onSubmit={mockOnSubmit} />);
          
          const submitButton = screen.getByRole('button', { name: /generate my brand identity/i });
          
          // Fill in required fields with valid data
          fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
          fireEvent.change(screen.getByLabelText(/one-sentence bio/i), { target: { value: 'I am a developer' } });
          
          // Input valid email
          fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: validEmail } });
          
          // Submit button should be enabled for valid email
          expect(submitButton).not.toBeDisabled();
          
          // Clean up for next iteration
          unmount();
        }
      ),
      { numRuns: pbtConfig.numRuns, verbose: pbtConfig.verbose }
    );
  });

  /**
   * Additional Property: Bio Length Acceptance
   * Ensures that valid bio lengths are properly accepted
   */
  it('Property: Bio Length Acceptance - should accept bios within 120 character limit', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 120 })
          .filter(s => s.trim().length >= 10) // Ensure meaningful content after trimming
          .filter(s => s.length <= 120), // Ensure within character limit
        (validBio) => {
          cleanup(); // Clean up before each iteration
          
          const { unmount } = render(<BioInput onSubmit={mockOnSubmit} />);
          
          const bioInput = screen.getByLabelText(/one-sentence bio/i);
          const submitButton = screen.getByRole('button', { name: /generate my brand identity/i });
          
          // Fill in required fields with valid data
          fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
          fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
          
          // Input valid bio
          fireEvent.change(bioInput, { target: { value: validBio } });
          
          // Bio should be accepted after sanitization and trimming
          const sanitizedBio = validBio
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '')
            .trim();
          
          expect(bioInput).toHaveValue(sanitizedBio);
          
          // Character count should show correct count
          expect(screen.getByText(`${sanitizedBio.length}/120`)).toBeInTheDocument();
          
          // Submit button should be enabled for valid bio
          expect(submitButton).not.toBeDisabled();
          
          // Clean up for next iteration
          unmount();
        }
      ),
      { numRuns: pbtConfig.numRuns, verbose: pbtConfig.verbose }
    );
  });
});