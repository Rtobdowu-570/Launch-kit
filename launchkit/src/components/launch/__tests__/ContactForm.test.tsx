import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactForm } from '../ContactForm';
import { ContactData } from '@/types';

describe('ContactForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all required fields', () => {
    render(<ContactForm onSubmit={mockOnSubmit} loading={false} />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
  });

  it('renders optional fields', () => {
    render(<ContactForm onSubmit={mockOnSubmit} loading={false} />);

    expect(screen.getByLabelText(/organization/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state\/province/i)).toBeInTheDocument();
  });

  it('auto-detects country on mount', async () => {
    // Mock navigator.language
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    });

    render(<ContactForm onSubmit={mockOnSubmit} loading={false} />);

    await waitFor(() => {
      const countrySelect = screen.getByLabelText(/country/i) as HTMLSelectElement;
      expect(countrySelect.value).toBe('US');
    });
  });

  it('validates required fields on submit', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} loading={false} />);

    const submitButton = screen.getByRole('button', { name: /register domain/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/city is required/i)).toBeInTheDocument();
      expect(screen.getByText(/postal code is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates email format with custom validation', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} loading={false} />);

    // Fill in all required fields with valid data
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example' } }); // Missing TLD
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+1 555 1234' } });
    fireEvent.change(screen.getByLabelText(/street address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText(/postal code/i), { target: { value: '10001' } });
    fireEvent.change(screen.getByLabelText(/country/i), { target: { value: 'US' } });

    const submitButton = screen.getByRole('button', { name: /register domain/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates phone number format', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} loading={false} />);

    // Fill in all required fields except phone with valid data
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: 'abc123' } });
    fireEvent.change(screen.getByLabelText(/street address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText(/postal code/i), { target: { value: '10001' } });
    fireEvent.change(screen.getByLabelText(/country/i), { target: { value: 'US' } });

    const submitButton = screen.getByRole('button', { name: /register domain/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid phone number format/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} loading={false} />);

    const validData: ContactData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      organization: 'Acme Corp',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      postcode: '10001',
      country: 'US',
    };

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: validData.name } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: validData.email } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: validData.phone } });
    fireEvent.change(screen.getByLabelText(/organization/i), { target: { value: validData.organization } });
    fireEvent.change(screen.getByLabelText(/street address/i), { target: { value: validData.address } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: validData.city } });
    fireEvent.change(screen.getByLabelText(/state\/province/i), { target: { value: validData.state } });
    fireEvent.change(screen.getByLabelText(/postal code/i), { target: { value: validData.postcode } });
    fireEvent.change(screen.getByLabelText(/country/i), { target: { value: validData.country } });

    const submitButton = screen.getByRole('button', { name: /register domain/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(validData);
    });
  });

  it('clears error when user starts typing', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} loading={false} />);

    // Trigger validation error
    const submitButton = screen.getByRole('button', { name: /register domain/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });

    // Start typing
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: 'J' } });

    await waitFor(() => {
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
    });
  });

  it('shows loading state when submitting', () => {
    render(<ContactForm onSubmit={mockOnSubmit} loading={true} />);

    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/registering domain/i)).toBeInTheDocument();
  });

  it('allows optional fields to be empty', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} loading={false} />);

    const validData: ContactData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      organization: '', // Optional
      address: '123 Main St',
      city: 'New York',
      state: '', // Optional
      postcode: '10001',
      country: 'US',
    };

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: validData.name } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: validData.email } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: validData.phone } });
    fireEvent.change(screen.getByLabelText(/street address/i), { target: { value: validData.address } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: validData.city } });
    fireEvent.change(screen.getByLabelText(/postal code/i), { target: { value: validData.postcode } });
    fireEvent.change(screen.getByLabelText(/country/i), { target: { value: validData.country } });

    const submitButton = screen.getByRole('button', { name: /register domain/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(validData);
    });
  });
});
