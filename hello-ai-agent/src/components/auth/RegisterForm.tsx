import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from '@/hooks/useForm';
import type { RegisterFormData, RegisterFormProps } from '@/types/auth';

// Validation rules
const validateFirstName = (firstName: string): string | null => {
  if (!firstName.trim()) return 'First name is required';
  if (firstName.trim().length < 2)
    return 'First name must be at least 2 characters long';
  return null;
};

const validateLastName = (lastName: string): string | null => {
  if (!lastName.trim()) return 'Last name is required';
  if (lastName.trim().length < 2)
    return 'Last name must be at least 2 characters long';
  return null;
};

const validateEmail = (email: string): string | null => {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return 'Please enter a valid email address';
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (!/(?=.*[a-z])/.test(password))
    return 'Password must contain at least one lowercase letter';
  if (!/(?=.*[A-Z])/.test(password))
    return 'Password must contain at least one uppercase letter';
  if (!/(?=.*\d)/.test(password))
    return 'Password must contain at least one number';
  return null;
};

export function RegisterForm({
  onSuccess,
  redirectTo = '/home',
  showLoginLink = true,
  className = '',
}: RegisterFormProps) {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues: RegisterFormData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError,
  } = useForm<RegisterFormData>({
    initialValues,
    validationRules: {
      firstName: validateFirstName,
      lastName: validateLastName,
      email: validateEmail,
      password: validatePassword,
      // Don't include confirmPassword in initial rules to avoid circular dependency
    },
  });

  // Custom validation for confirm password that has access to current form values
  const validateConfirmPassword = () => {
    const { password, confirmPassword } = values;
    if (!confirmPassword) {
      setFieldError('confirmPassword', 'Please confirm your password');
      return false;
    }
    if (confirmPassword !== password) {
      setFieldError('confirmPassword', 'Passwords do not match');
      return false;
    }
    // Clear error if validation passes
    setFieldError('confirmPassword', '');
    return true;
  };

  const onSubmit = async (formData: RegisterFormData) => {
    try {
      clearError();

      // Final validation check for password confirmation
      if (!validateConfirmPassword()) {
        return; // Stop submission if passwords don't match
      }

      const response = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(redirectTo);
        }
      }
    } catch (error: any) {
      // Handle field-specific errors
      if (error.field) {
        setFieldError(error.field as keyof RegisterFormData, error.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Create Account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your information to create your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name Field */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter your first name"
                value={values.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                onBlur={() => handleBlur('firstName')}
                className={`pl-10 ${
                  touched.firstName && errors.firstName
                    ? 'border-destructive'
                    : ''
                }`}
                disabled={isSubmitting || isLoading}
                autoComplete="given-name"
                required
              />
            </div>
            {touched.firstName && errors.firstName && (
              <p className="text-sm text-destructive mt-1">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name Field */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter your last name"
                value={values.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                onBlur={() => handleBlur('lastName')}
                className={`pl-10 ${
                  touched.lastName && errors.lastName
                    ? 'border-destructive'
                    : ''
                }`}
                disabled={isSubmitting || isLoading}
                autoComplete="family-name"
                required
              />
            </div>
            {touched.lastName && errors.lastName && (
              <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`pl-10 ${
                  touched.email && errors.email ? 'border-destructive' : ''
                }`}
                disabled={isSubmitting || isLoading}
                autoComplete="email"
                required
              />
            </div>
            {touched.email && errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={values.password}
                onChange={(e) => {
                  handleChange('password', e.target.value);
                  // Also validate confirm password if it has a value
                  if (values.confirmPassword) {
                    setTimeout(validateConfirmPassword, 0);
                  }
                }}
                onBlur={() => handleBlur('password')}
                className={`pl-10 pr-10 ${
                  touched.password && errors.password
                    ? 'border-destructive'
                    : ''
                }`}
                disabled={isSubmitting || isLoading}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={values.confirmPassword}
                onChange={(e) => {
                  handleChange('confirmPassword', e.target.value);
                  // Validate after a brief delay to allow the state to update
                  setTimeout(validateConfirmPassword, 0);
                }}
                onBlur={() => {
                  handleBlur('confirmPassword');
                  validateConfirmPassword();
                }}
                className={`pl-10 pr-10 ${
                  touched.confirmPassword && errors.confirmPassword
                    ? 'border-destructive'
                    : ''
                }`}
                disabled={isSubmitting || isLoading}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-sm text-destructive mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </CardContent>

      {showLoginLink && (
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
              tabIndex={isSubmitting || isLoading ? -1 : 0}
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
