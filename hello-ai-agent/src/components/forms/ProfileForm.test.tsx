import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProfileForm } from './ProfileForm';

// Mock the hooks
vi.mock('@/hooks/useProfile', () => ({
  useProfile: () => ({
    data: {
      username: 'testuser',
      email: 'test@example.com',
      bio: 'Test bio',
      urls: [],
    },
    isLoading: false,
  }),
  useUpdateProfile: () => ({
    updateProfile: vi.fn(),
    isUpdating: false,
  }),
  useVerifiedEmails: () => ({
    data: [{ email: 'test@example.com' }, { email: 'admin@example.com' }],
  }),
}));

// Mock the toast hook
vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

describe('ProfileForm', () => {
  // Spy on console.error to catch any Zod errors thrown to console
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should not throw Zod errors to console when clearing username field', async () => {
    render(<ProfileForm />);

    // Find the username input
    const usernameInput = screen.getByPlaceholderText('shadcn');

    // Clear the username field
    fireEvent.change(usernameInput, { target: { value: '' } });

    // Wait for any async validation
    await waitFor(() => {
      // Check that no console errors were logged
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    // The form should still show validation messages in the UI
    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
    });
  });

  it('should show validation message when username is too short', async () => {
    render(<ProfileForm />);

    const usernameInput = screen.getByPlaceholderText('shadcn');

    // Enter a username that's too short
    fireEvent.change(usernameInput, { target: { value: 'a' } });
    fireEvent.blur(usernameInput);

    await waitFor(() => {
      expect(
        screen.getByText('Username must be at least 2 characters')
      ).toBeInTheDocument();
    });

    // Should not have thrown to console
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should show validation message when username contains invalid characters', async () => {
    render(<ProfileForm />);

    const usernameInput = screen.getByPlaceholderText('shadcn');

    // Enter a username with invalid characters
    fireEvent.change(usernameInput, { target: { value: 'test@user' } });
    fireEvent.blur(usernameInput);

    await waitFor(() => {
      expect(
        screen.getByText(
          'Username can only contain letters, numbers, and underscores'
        )
      ).toBeInTheDocument();
    });

    // Should not have thrown to console
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should not show validation errors for valid username', async () => {
    render(<ProfileForm />);

    const usernameInput = screen.getByPlaceholderText('shadcn');

    // Enter a valid username
    fireEvent.change(usernameInput, { target: { value: 'validuser123' } });
    fireEvent.blur(usernameInput);

    await waitFor(() => {
      // Should not show any validation errors
      expect(screen.queryByText(/Username/)).not.toBeInTheDocument();
    });

    // Should not have thrown to console
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
