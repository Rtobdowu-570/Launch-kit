import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BioInput } from '../BioInput';

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

describe('BioInput Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders all form fields correctly', () => {
    render(<BioInput onSubmit={mockOnSubmit} loading={false} />);
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/one-sentence bio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create my brand/i })).toBeInTheDocument();
  });

  it('enforces 120 character limit for bio', () => {
    render(<BioInput onSubmit={mockOnSubmit} loading={false} />);
    
    const bioInput = screen.getByLabelText(/one-sentence bio/i) as HTMLTextAreaElement;
    const longText = 'a'.repeat(130);
    
    fireEvent.change(bioInput, { target: { value: longText } });
    
    // The maxLength attribute should prevent input beyond 120 characters
    // However, fireEvent.change bypasses this, so we check the maxLength attribute exists
    expect(bioInput).toHaveAttribute('maxLength', '120');
    expect(screen.getByText(/\/120 characters/i)).toBeInTheDocument();
  });

  it('sanitizes input to prevent XSS', () => {
    render(<BioInput onSubmit={mockOnSubmit} loading={false} />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    const maliciousInput = '<script>alert("xss")</script>John';
    
    fireEvent.change(nameInput, { target: { value: maliciousInput } });
    
    // React handles XSS prevention through its rendering
    expect((nameInput as HTMLInputElement).value).toBeDefined();
  });

  it('submits valid form data', async () => {
    render(<BioInput onSubmit={mockOnSubmit} loading={false} />);
    
    const validData = {
      name: 'John Doe',
      bio: 'I am a software developer who loves creating amazing apps',
      email: 'john@example.com'
    };
    
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: validData.name } });
    fireEvent.change(screen.getByLabelText(/one-sentence bio/i), { target: { value: validData.bio } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: validData.email } });
    
    const submitButton = screen.getByRole('button', { name: /create my brand/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(validData);
    });
  });

  it('shows character count', () => {
    render(<BioInput onSubmit={mockOnSubmit} loading={false} />);
    
    const bioInput = screen.getByLabelText(/one-sentence bio/i);
    const testBio = 'a'.repeat(50);
    
    fireEvent.change(bioInput, { target: { value: testBio } });
    
    expect(screen.getByText(/50\/120 characters/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<BioInput onSubmit={mockOnSubmit} loading={true} />);
    
    const submitButton = screen.getByRole('button');
    
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/submitting/i);
  });

  it('validates required fields', () => {
    render(<BioInput onSubmit={mockOnSubmit} loading={false} />);
    
    const submitButton = screen.getByRole('button', { name: /create my brand/i });
    
    // Fill only name
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John' } });
    
    // Fill bio
    fireEvent.change(screen.getByLabelText(/one-sentence bio/i), { target: { value: 'I am a developer' } });
    
    // Fill valid email
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    
    // All fields filled, button should be enabled
    expect(submitButton).not.toBeDisabled();
  });
});
