import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {
  setupTestEnvironment,
  cleanupTestEnvironment,
} from '../testing/mocks/server';
import { AuthProvider } from '../contexts/AuthContext';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

// Test wrapper component
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
}

describe('Authentication System', () => {
  beforeEach(async () => {
    await setupTestEnvironment();
  });

  afterEach(() => {
    cleanupTestEnvironment();
  });

  describe('LoginForm', () => {
    it('renders login form correctly', () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('validates required fields', async () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const submitButton = screen.getByText('Sign In');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    it('validates email format', async () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(
          screen.getByText('Please enter a valid email address')
        ).toBeInTheDocument();
      });
    });

    it('handles successful login', async () => {
      const mockOnSuccess = vi.fn();

      render(
        <TestWrapper>
          <LoginForm onSuccess={mockOnSuccess} />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByText('Sign In');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('handles login error', async () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByText('Sign In');

      fireEvent.change(emailInput, {
        target: { value: 'nonexistent@example.com' },
      });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Invalid email or password')
        ).toBeInTheDocument();
      });
    });

    it('toggles password visibility', () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText(/password/i);
      const toggleButton = screen.getByRole('button', {
        name: /toggle password visibility/i,
      });

      expect(passwordInput).toHaveAttribute('type', 'password');

      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('RegisterForm', () => {
    it('renders register form correctly', () => {
      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByText('Create Account')).toBeInTheDocument();
    });

    it('validates required fields', async () => {
      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    it('validates password confirmation', async () => {
      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'DifferentPassword123!' },
      });
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    it('validates password strength', async () => {
      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText(/^password/i);

      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(
          screen.getByText(
            /password must contain at least one uppercase letter/i
          )
        ).toBeInTheDocument();
      });
    });

    it('handles successful registration', async () => {
      const mockOnSuccess = vi.fn();

      render(
        <TestWrapper>
          <RegisterForm onSuccess={mockOnSuccess} />
        </TestWrapper>
      );

      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByText('Create Account');

      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, {
        target: { value: 'john.doe@example.com' },
      });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'Password123!' },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('handles registration error for existing email', async () => {
      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByText('Create Account');

      // First register a user
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, {
        target: { value: 'duplicate@example.com' },
      });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'Password123!' },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Should succeed first time
      });

      // Try to register again with same email
      fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
      fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('An account with this email already exists')
        ).toBeInTheDocument();
      });
    });
  });
});
