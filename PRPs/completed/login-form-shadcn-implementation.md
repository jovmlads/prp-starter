# Login Form with shadcn/ui - Implementation PRP

## Goal

**Feature Goal**: Implement a complete login form using shadcn/ui components that matches the login-02 authentication block design with full API integration and validation

**Deliverable**: Production-ready login form component with authentication service integration, form validation, error handling, and comprehensive test coverage

**Success Definition**: Users can authenticate through a visually polished, accessible login form that handles all authentication states (loading, success, error) with proper validation feedback

## Why

- **Business Value**: Secure, professional authentication experience increases user trust and conversion
- **User Experience**: Modern, accessible design reduces authentication friction and support requests
- **Technical Foundation**: Establishes authentication patterns for future features (registration, password reset, 2FA)
- **Integration Ready**: Provides foundation for complete authentication system with proper API integration

## What

A complete login form implementation featuring:

- **Visual Design**: Exact match to shadcn/ui login-02 block with company branding
- **Form Functionality**: Email/password inputs with React Hook Form and Zod validation
- **API Integration**: Full authentication flow with JWT token management
- **Error Handling**: Comprehensive error states with user-friendly messaging
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA attributes
- **Responsive Design**: Mobile-first approach with touch-friendly interactions

### Success Criteria

- [ ] Login form visually matches shadcn/ui login-02 design exactly
- [ ] Form validation provides real-time feedback with clear error messages
- [ ] API integration handles all authentication states (success, error, loading)
- [ ] Responsive design works flawlessly on mobile and desktop
- [ ] Accessibility score > 95% (Lighthouse audit)
- [ ] Test coverage > 80% (unit, integration, E2E)
- [ ] TypeScript strict mode compliance with no `any` types

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- file: PRPs/login-form-shadcn-planning.md
  why: Complete planning context with component architecture and design requirements
  critical: shadcn/ui component usage patterns and responsive design specifications

- file: PRPs/contracts/login-auth-api-contract.md
  why: Complete API specification with request/response schemas and error handling
  critical: Authentication flow, token management, and security requirements

- url: https://ui.shadcn.com/blocks/authentication#login-02
  why: Visual reference for exact design implementation
  critical: Layout structure, spacing, and component composition
```

### Repository Structure

```bash
app/
├── src/
│   ├── features/
│   │   └── auth/
│   │       ├── components/
│   │       │   ├── login-form.tsx          # Main login form component
│   │       │   ├── login-page.tsx          # Page wrapper with layout
│   │       │   └── __tests__/
│   │       ├── hooks/
│   │       │   └── use-login.ts            # Authentication hook
│   │       ├── schemas/
│   │       │   └── login-schema.ts         # Zod validation schema
│   │       ├── services/
│   │       │   └── auth-service.ts         # API integration service
│   │       └── types/
│   │           └── auth-types.ts           # TypeScript type definitions
│   └── shared/
│       └── components/
│           └── ui/                         # shadcn/ui components
├── package.json
└── vite.config.ts
```

## Implementation Blueprint

### Phase 1: Project Setup

```powershell
# Navigate to app directory (create if doesn't exist)
if (!(Test-Path "app")) { New-Item -ItemType Directory -Path "app" }
Set-Location app

# Initialize React project with Vite if not exists
if (!(Test-Path "package.json")) {
    npm create vite@latest . -- --template react-ts
    npm install
}

# Install required dependencies
npm install react-hook-form @hookform/resolvers zod lucide-react @tanstack/react-query

# Install shadcn/ui CLI and components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input label card

# Install testing dependencies
npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom @playwright/test
```

### Phase 2: Core Implementation

#### 1. Authentication Types

```typescript
// app/src/features/auth/types/auth-types.ts
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface LoginSuccessResponse {
  success: true;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresAt: string;
      tokenType: "Bearer";
    };
    session: {
      sessionId: string;
      expiresAt: string;
    };
  };
  message: string;
}

export interface AuthErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

export class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
```

#### 2. Validation Schema

```typescript
// app/src/features/auth/schemas/login-schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

#### 3. Authentication Service

```typescript
// app/src/features/auth/services/auth-service.ts
import type { LoginFormData, LoginSuccessResponse } from '../types/auth-types';
import { AuthError } from '../types/auth-types';

class AuthService {
  private static instance: AuthService;
  private baseUrl = '/api/auth';

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginFormData): Promise<LoginSuccessResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': crypto.randomUUID(),
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new AuthError(
          result.error.code,
          result.error.message,
          result.error.details
        );
      }

      this.storeTokens(result.data.tokens);
      return result as LoginSuccessResponse;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      
      throw new AuthError(
        'NETWORK_ERROR',
        'Unable to connect to the server. Please check your internet connection.',
        { originalError: error }
      );
    }
  }

  private storeTokens(tokens: any): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('tokenExpiresAt', tokens.expiresAt);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const expiresAt = localStorage.getItem('tokenExpiresAt');
    
    if (!token || !expiresAt) {
      return false;
    }

    return new Date(expiresAt) > new Date();
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresAt');
  }
}

export const authService = AuthService.getInstance();
```

#### 4. Authentication Hook

```typescript
// app/src/features/auth/hooks/use-login.ts
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import type { LoginFormData, LoginSuccessResponse } from '../types/auth-types';
import { AuthError } from '../types/auth-types';

interface UseLoginOptions {
  onSuccess?: (response: LoginSuccessResponse) => void;
  onError?: (error: AuthError) => void;
}

export const useLogin = (options?: UseLoginOptions) => {
  return useMutation({
    mutationFn: async (data: LoginFormData): Promise<LoginSuccessResponse> => {
      return authService.login(data);
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error: AuthError) => {
      options?.onError?.(error);
    },
  });
};
```

#### 5. Login Form Component

```typescript
// app/src/features/auth/components/login-form.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogin } from '../hooks/use-login';
import { loginSchema, type LoginFormData } from '../schemas/login-schema';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const loginMutation = useLogin({
    onSuccess: (response) => {
      console.log('Login successful:', response.data.user);
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Login failed:', error);
      setError('root', { message: error.message });
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      // Error handling is done in the mutation callbacks
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {errors.root && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {errors.root.message}
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              autoComplete="email"
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || loginMutation.isPending}
          >
            {isSubmitting || loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

#### 6. Login Page Component

```typescript
// app/src/features/auth/components/login-page.tsx
import React from 'react';
import { GalleryVerticalEnd } from 'lucide-react';
import { LoginForm } from './login-form';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const handleLoginSuccess = () => {
    console.log('User successfully logged in');
    onLoginSuccess?.();
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a 
          href="#" 
          className="flex items-center gap-2 self-center font-medium"
          aria-label="Acme Inc. Home"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" aria-hidden="true" />
          </div>
          Acme Inc.
        </a>
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}
```

### Phase 3: App Integration

```typescript
// app/src/App.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './features/auth/components/login-page';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <LoginPage />
      </div>
    </QueryClientProvider>
  );
}

export default App;
```

## Validation Loop

### Level 1: Syntax & Style
```powershell
npm run type-check
npm run lint
npm run format
```

### Level 2: Unit Tests
```powershell
npm run test -- --coverage
npm run test:coverage
```

### Level 3: Integration Tests
```powershell
npm run test:e2e
npm run test:e2e:ui
```

### Level 4: Build & Performance
```powershell
npm run build
npm run preview
```

## Success Validation Commands

```powershell
# Complete validation pipeline
npm run validate

# Individual validations
npm run type-check && npm run lint && npm run test:coverage && npm run build

# E2E validation
npm run test:e2e
```

## Completion Checklist

- [ ] All dependencies installed and configured
- [ ] shadcn/ui components properly integrated
- [ ] Login form matches design specification exactly
- [ ] Form validation works with proper error messages
- [ ] API integration handles all response states
- [ ] Authentication service manages tokens securely
- [ ] Unit tests achieve >80% coverage
- [ ] E2E tests cover complete login flow
- [ ] Accessibility audit passes (>95% score)
- [ ] TypeScript strict mode compliance
- [ ] Performance budget met (<100kb impact)
- [ ] Mobile responsiveness verified
- [ ] Error handling covers all edge cases

## Post-Implementation Steps

1. **Move completed PRP**: `mv PRPs/login-form-shadcn-implementation.md PRPs/completed/`
2. **Update documentation**: Add login form to component library docs
3. **Integration planning**: Plan authentication context and route protection
4. **Security review**: Validate token handling and security practices

**DONE** - Login form implementation ready for production use.
