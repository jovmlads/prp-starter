# Authentication API Contract - Login Form Integration

## Overview

This API contract defines the authentication endpoints and data structures required for the shadcn/ui login form implementation. Based on the planning PRP `PRPs/login-form-shadcn-planning.md`, this contract ensures seamless integration between the frontend login form and backend authentication services.

## Base Configuration

```yaml
api_base_url: "/api/auth"
content_type: "application/json"
cors_enabled: true
rate_limiting: true
security_headers: required
```

## Authentication Endpoints

### 1. User Login

**Endpoint:** `POST /api/auth/login`

**Purpose:** Authenticate user credentials and return access token

**Request Schema:**
```typescript
interface LoginRequest {
  email: string;        // Valid email format, required
  password: string;     // Minimum 8 characters, required
  rememberMe?: boolean; // Optional, extends token expiry
}
```

**Request Validation:**
```typescript
const loginRequestSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(254, "Email too long"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long"),
  rememberMe: z.boolean().optional()
});
```

**Success Response (200):**
```typescript
interface LoginSuccessResponse {
  success: true;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      avatar?: string;
      emailVerified: boolean;
      createdAt: string;
      lastLoginAt: string;
    };
    tokens: {
      accessToken: string;    // JWT, expires in 15 minutes
      refreshToken: string;   // Secure, expires in 7 days (30 days if rememberMe)
      expiresAt: string;      // ISO 8601 timestamp
      tokenType: "Bearer";
    };
    session: {
      sessionId: string;
      expiresAt: string;
    };
  };
  message: "Login successful";
}
```

**Error Responses:**

**400 Bad Request:**
```typescript
interface ValidationErrorResponse {
  success: false;
  error: {
    code: "VALIDATION_ERROR";
    message: "Invalid request data";
    details: Array<{
      field: string;
      message: string;
      code: string;
    }>;
  };
}
```

**401 Unauthorized:**
```typescript
interface AuthErrorResponse {
  success: false;
  error: {
    code: "INVALID_CREDENTIALS" | "ACCOUNT_LOCKED" | "EMAIL_NOT_VERIFIED";
    message: string;
    details?: {
      attemptsRemaining?: number;
      lockoutExpiresAt?: string;
      verificationRequired?: boolean;
    };
  };
}
```

**429 Too Many Requests:**
```typescript
interface RateLimitErrorResponse {
  success: false;
  error: {
    code: "RATE_LIMIT_EXCEEDED";
    message: "Too many login attempts";
    details: {
      retryAfter: number;        // Seconds until next attempt allowed
      maxAttempts: number;       // Maximum attempts per window
      windowMs: number;          // Rate limit window in milliseconds
    };
  };
}
```

**Example Request:**
```bash
curl -X POST /api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "rememberMe": true
  }'
```

### 2. Token Refresh

**Endpoint:** `POST /api/auth/refresh`

**Purpose:** Refresh expired access token using refresh token

**Request Schema:**
```typescript
interface RefreshRequest {
  refreshToken: string;
}
```

**Success Response (200):**
```typescript
interface RefreshSuccessResponse {
  success: true;
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;    // New refresh token (rotation)
      expiresAt: string;
      tokenType: "Bearer";
    };
  };
  message: "Token refreshed successfully";
}
```

### 3. User Logout

**Endpoint:** `POST /api/auth/logout`

**Purpose:** Invalidate user session and tokens

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Request Schema:**
```typescript
interface LogoutRequest {
  refreshToken: string;
  logoutAllDevices?: boolean;  // Optional, default false
}
```

**Success Response (200):**
```typescript
interface LogoutSuccessResponse {
  success: true;
  message: "Logged out successfully";
}
```

### 4. Password Reset Request

**Endpoint:** `POST /api/auth/forgot-password`

**Purpose:** Initiate password reset process

**Request Schema:**
```typescript
interface ForgotPasswordRequest {
  email: string;
}
```

**Success Response (200):**
```typescript
interface ForgotPasswordResponse {
  success: true;
  message: "Password reset instructions sent to your email";
}
```

## Security Requirements

### Authentication Headers
```typescript
interface SecurityHeaders {
  "Authorization": "Bearer <access_token>";
  "X-CSRF-Token"?: string;           // For state-changing operations
  "X-Request-ID": string;            // For request tracing
}
```

### Rate Limiting
```yaml
login_endpoint:
  max_attempts: 5
  window_minutes: 15
  lockout_duration_minutes: 30

refresh_endpoint:
  max_attempts: 10
  window_minutes: 1

password_reset:
  max_attempts: 3
  window_minutes: 60
```

### Token Security
```yaml
access_token:
  algorithm: "RS256"
  expiry: "15m"
  issuer: "your-app"
  audience: "your-app-users"

refresh_token:
  algorithm: "HS256"
  expiry: "7d"          # 30d if rememberMe
  rotation: true        # New token on each refresh
  secure_storage: true  # HttpOnly cookie recommended
```

## Error Handling Patterns

### Frontend Integration
```typescript
// Login form error handling
interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

// API error mapping for form
const mapApiErrorToForm = (error: AuthErrorResponse): LoginFormErrors => {
  switch (error.error.code) {
    case "VALIDATION_ERROR":
      return error.error.details.reduce((acc, detail) => ({
        ...acc,
        [detail.field]: detail.message
      }), {});
    
    case "INVALID_CREDENTIALS":
      return { general: "Invalid email or password" };
    
    case "ACCOUNT_LOCKED":
      return { 
        general: `Account locked. Try again in ${error.error.details?.lockoutExpiresAt}` 
      };
    
    case "RATE_LIMIT_EXCEEDED":
      return { 
        general: `Too many attempts. Try again in ${error.error.details.retryAfter} seconds` 
      };
    
    default:
      return { general: "An unexpected error occurred" };
  }
};
```

## Frontend Integration Hooks

### React Hook Implementation
```typescript
// app/src/features/auth/hooks/use-login.ts
import { useMutation } from '@tanstack/react-query';
import { loginSchema, type LoginFormData } from '../schemas/login-schema';

interface UseLoginOptions {
  onSuccess?: (response: LoginSuccessResponse) => void;
  onError?: (error: AuthErrorResponse) => void;
}

export const useLogin = (options?: UseLoginOptions) => {
  return useMutation({
    mutationFn: async (data: LoginFormData): Promise<LoginSuccessResponse> => {
      // Validate data before sending
      const validatedData = loginSchema.parse(data);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': crypto.randomUUID(),
        },
        body: JSON.stringify(validatedData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw result as AuthErrorResponse;
      }
      
      return result as LoginSuccessResponse;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
```

### Auth Service Integration
```typescript
// app/src/features/auth/services/auth-service.ts
class AuthService {
  private static instance: AuthService;
  
  async login(credentials: LoginFormData): Promise<LoginSuccessResponse> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': crypto.randomUUID(),
      },
      body: JSON.stringify(credentials),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new AuthError(result.error.code, result.error.message, result.error.details);
    }
    
    // Store tokens securely
    this.storeTokens(result.data.tokens);
    
    return result;
  }
  
  private storeTokens(tokens: TokenData): void {
    // Store access token in memory or secure storage
    localStorage.setItem('accessToken', tokens.accessToken);
    
    // Refresh token should be stored in HttpOnly cookie by backend
    // or in secure storage if handling client-side
  }
}
```

## Testing Requirements

### API Contract Testing
```typescript
// Test cases for login endpoint
describe('POST /api/auth/login', () => {
  it('should authenticate valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'validpassword123'
      })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.tokens.accessToken).toBeDefined();
    expect(response.body.data.user.email).toBe('test@example.com');
  });
  
  it('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
      .expect(401);
    
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
  });
  
  it('should enforce rate limiting', async () => {
    // Make 5 failed attempts
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);
    }
    
    // 6th attempt should be rate limited
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
      .expect(429);
    
    expect(response.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
  });
});
```

## Environment Configuration

### Development
```env
# API Configuration
API_BASE_URL=http://localhost:3001/api
JWT_SECRET=your-development-secret-key
JWT_REFRESH_SECRET=your-development-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_LOGIN_MAX=5
RATE_LIMIT_LOGIN_WINDOW=15
RATE_LIMIT_LOCKOUT_DURATION=30

# Security
CORS_ORIGIN=http://localhost:3000
CSRF_PROTECTION=false
```

### Production
```env
# API Configuration
API_BASE_URL=https://api.yourapp.com/api
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_LOGIN_MAX=5
RATE_LIMIT_LOGIN_WINDOW=15
RATE_LIMIT_LOCKOUT_DURATION=30

# Security
CORS_ORIGIN=https://yourapp.com
CSRF_PROTECTION=true
SECURE_COOKIES=true
```

## Validation Commands

```powershell
# API contract validation
npm run test:api-contract

# Schema validation
npm run validate:schemas

# Security audit
npm run audit:security

# Rate limiting test
npm run test:rate-limits

# Integration test with frontend
npm run test:integration
```

## Implementation Checklist

- [ ] Login endpoint with proper validation
- [ ] Token refresh mechanism
- [ ] Logout functionality
- [ ] Rate limiting implementation
- [ ] Error handling patterns
- [ ] Security headers configuration
- [ ] CORS setup for frontend integration
- [ ] API contract tests
- [ ] Frontend integration hooks
- [ ] Environment configuration
- [ ] Documentation and examples

## Next Steps

After API implementation:
1. **Frontend Integration**: Update login form to use API hooks
2. **Authentication Context**: Implement React context for auth state
3. **Route Protection**: Add authentication guards to protected routes
4. **Token Management**: Implement automatic token refresh
5. **Error Boundaries**: Add global error handling for auth failures

This contract provides the complete API specification needed for the shadcn/ui login form implementation and ensures secure, robust authentication functionality.
