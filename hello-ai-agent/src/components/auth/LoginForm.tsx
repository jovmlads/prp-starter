import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from '@/hooks/useForm';
import type { LoginFormData, LoginFormProps } from '@/types/auth';

// Validation rules
const validateEmail = (email: string): string | null => {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return 'Please enter a valid email address';
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  return null;
};

// Form field configurations (for potential future use)
// const formFields = [
//   {
//     name: "email" as keyof LoginFormData,
//     label: "Email",
//     type: "email",
//     placeholder: "Enter your email",
//     validation: validateEmail,
//   },
//   {
//     name: "password" as keyof LoginFormData,
//     label: "Password",
//     type: "password",
//     placeholder: "Enter your password",
//     validation: validatePassword,
//   },
// ];

export function LoginForm({
  onSuccess,
  redirectTo = '/home',
  showRegisterLink = true,
  className = '',
}: LoginFormProps) {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: LoginFormData = {
    email: '',
    password: '',
    rememberMe: false,
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
  } = useForm<LoginFormData>({
    initialValues,
    validationRules: {
      email: validateEmail,
      password: validatePassword,
    },
  });

  const onSubmit = async (formData: LoginFormData) => {
    try {
      clearError();

      const response = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
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
        setFieldError(error.field as keyof LoginFormData, error.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`pl-10 pr-10 ${
                  touched.password && errors.password
                    ? 'border-destructive'
                    : ''
                }`}
                disabled={isSubmitting || isLoading}
                autoComplete="current-password"
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

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={values.rememberMe}
                onCheckedChange={(checked: boolean) =>
                  handleChange('rememberMe', checked)
                }
                disabled={isSubmitting || isLoading}
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </Label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
              tabIndex={isSubmitting || isLoading ? -1 : 0}
            >
              Forgot password?
            </Link>
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
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </CardContent>

      {showRegisterLink && (
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
              tabIndex={isSubmitting || isLoading ? -1 : 0}
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
