import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BioInput from '../BioInput';
import { BioData } from '@/types';

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
    render(<BioInput onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/one-sentence bio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate my brand identity/i })).toBeInTheDocument();
  });

  it('enforces 120 character limit for bio', () => {
    render(<BioInput onSubmit={mockOnSubmit} />);
    
    const bioInput = screen.getByLabelText(/one-sentence bio/i);
    const longText = 'a'.repeat(130);
    
    fireEvent.change(bioInput, { target: { value: longText } });
    
    // Should be truncated to 120 characters
    expect(bioInput).toHaveValue('a'.repeat(120));
    expect(screen.getByText('120/120')).toBeInTheDocument();
  });

  it('sanitizes input to prevent XSS', () => {
    render(<BioInput onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    const maliciousInput = '<script>alert("xss")</script>John';
    
    fireEvent.change(nameInput, { target: { value: maliciousInput } });
    
    // Should remove script tags
    expect(nameInput).toHaveValue('John');
  });

  it('auto-saves to localStorage', async () => {
    render(<BioInput onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    // Wait for debounced save
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'launchkit-bio-data',
        expect.stringContaining('"fullName":"John Doe"')
      );
    }, { timeout: 1000 });
  });

  it('loads data from localStorage on mount', () => {
    const savedData = {
      fullName: 'Saved Name',
      bio: 'Saved bio',
      email: 'saved@example.com'
    };
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData));
    
    render(<BioInput onSubmit={mockOnSubmit} />);
    
    expect(screen.getByDisplayValue('Saved Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Saved bio')).toBeInTheDocument();
    expect(screen.getByDisplayValue('saved@example.com')).toBeInTheDocument();
  });

  it('submits valid form data', async () => {
    render(<BioInput onSubmit={mockOnSubmit} />);
    
    const validData = {
      fullName: 'John Doe',
      bio: 'I am a software developer who loves creating amazing apps',
      email: 'john@example.com'
    };
    
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: validData.fullName } });
    fireEvent.change(screen.getByLabelText(/one-sentence bio/i), { target: { value: validData.bio } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: validData.email } });
    
    const submitButton = screen.getByRole('button', { name: /generate my brand identity/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(validData);
    });
    
    // Should clear localStorage on successful submission
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('launchkit-bio-data');
  });

  it('shows character count warning when approaching limit', () => {
    render(<BioInput onSubmit={mockOnSubmit} />);
    
    const bioInput = screen.getByLabelText(/one-sentence bio/i);
    const longBio = 'a'.repeat(110);
    
    fireEvent.change(bioInput, { target: { value: longBio } });
    
    const charCount = screen.getByText('110/120');
    expect(charCount).toHaveClass('text-orange-500');
  });

  it('disables submit button when form is invalid', () => {
    render(<BioInput onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /generate my brand identity/i });
    
    // Button should be disabled initially
    expect(submitButton).toBeDisabled();
    
    // Fill only name
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John' } });
    expect(submitButton).toBeDisabled();
    
    // Fill bio
    fireEvent.change(screen.getByLabelText(/one-sentence bio/i), { target: { value: 'I am a developer' } });
    expect(submitButton).toBeDisabled();
    
    // Fill valid email
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    expect(submitButton).not.toBeDisabled();
  });

  it('validates email format in real-time', () => {
    render(<BioInput onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /generate my brand identity/i });
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/one-sentence bio/i), { target: { value: 'I am a developer' } });
    
    // Invalid email should keep button disabled
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'invalid-email' } });
    expect(submitButton).toBeDisabled();
    
    // Valid email should enable button
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    expect(submitButton).not.toBeDisabled();
  });
});