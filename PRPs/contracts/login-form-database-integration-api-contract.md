# Login Form with Database Integration - API Contract

## Overview

This document defines the complete API contract for the login form with database integration system as specified in `PRPs/login-form-database-integration-planning.md`. The system provides a zero-config authentication solution using MSW (Mock Service Worker) with dual persistence (localStorage for browser, file system for Node.js) that mimics production-ready API patterns.

---

## Table of Contents

1. [Base Configuration](#base-configuration)
2. [Data Models](#data-models)
3. [Authentication Endpoints](#authentication-endpoints)
4. [User Management Endpoints](#user-management-endpoints)
5. [Session Management](#session-management)
6. [Error Handling](#error-handling)
7. [Security Specifications](#security-specifications)
8. [TypeScript Interfaces](#typescript-interfaces)
9. [MSW Implementation Details](#msw-implementation-details)
10. [Testing Contracts](#testing-contracts)

---

## Base Configuration

### Environment Setup

```typescript
// Environment configuration
interface ApiConfig {
  baseURL: string; // '/api' for MSW, production URL for real backend
  timeout: number; // Request timeout in milliseconds
  withCredentials: boolean; // Include cookies in requests
  retryAttempts: number; // Number of retry attempts for failed requests
}

// Development configuration
const devConfig: ApiConfig = {
  baseURL: "/api",
  timeout: 10000,
  withCredentials: true,
  retryAttempts: 3,
};
```

### Request/Response Headers

```typescript
// Common headers for all requests
interface CommonHeaders {
  "Content-Type": "application/json";
  Accept: "application/json";
  "X-Requested-With": "XMLHttpRequest";
}

// Authentication headers
interface AuthHeaders extends CommonHeaders {
  Authorization?: string; // 'Bearer {token}' format
}

// Security headers in responses
interface SecurityHeaders {
  "X-Content-Type-Options": "nosniff";
  "X-Frame-Options": "DENY";
  "X-XSS-Protection": "1; mode=block";
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains";
}
```

---

## Data Models

### Core Entity Schemas

#### User Model

```typescript
interface User {
  id: string; // Primary key (nanoid)
  firstName: string; // User's first name
  lastName: string; // User's last name
  email: string; // Unique email address (login identifier)
  password: string; // Hashed password (bcrypt)
  role: "USER" | "ADMIN"; // User role
  isActive: boolean; // Account status
  emailVerified: boolean; // Email verification status
  lastLoginAt: Date | null; // Last login timestamp
  createdAt: Date; // Account creation timestamp
  updatedAt: Date; // Last profile update timestamp
}

// Sanitized user (password excluded)
interface PublicUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Session Model

```typescript
interface Session {
  id: string; // Primary key (nanoid)
  userId: string; // Foreign key to User.id
  token: string; // JWT token
  expiresAt: Date; // Session expiration time
  createdAt: Date; // Session creation time
  lastActivityAt: Date; // Last activity timestamp
}
```

#### Login Attempt Model

```typescript
interface LoginAttempt {
  id: string; // Primary key (nanoid)
  email: string; // Attempted email address
  success: boolean; // Login success/failure
  ipAddress: string; // Client IP address (simulated)
  userAgent: string; // Client user agent
  attemptedAt: Date; // Attempt timestamp
}
```

### Request/Response DTOs

#### Registration DTO

```typescript
interface RegisterRequestDTO {
  firstName: string; // Min 2 characters, required
  lastName: string; // Min 2 characters, required
  email: string; // Valid email format, required
  password: string; // Min 8 chars, uppercase, lowercase, number
}

interface RegisterResponseDTO {
  data: PublicUser;
  token: string;
  message: string;
}
```

#### Login DTO

```typescript
interface LoginRequestDTO {
  email: string; // Valid email format, required
  password: string; // Required, min 1 character
}

interface LoginResponseDTO {
  data: PublicUser;
  token: string;
  message: string;
}
```

#### Profile Update DTO

```typescript
interface UpdateProfileRequestDTO {
  firstName?: string; // Optional, min 2 characters
  lastName?: string; // Optional, min 2 characters
  email?: string; // Optional, valid email format
}

interface UpdateProfileResponseDTO {
  data: PublicUser;
  message: string;
}
```

---

## Authentication Endpoints

### 1. User Registration

```http
POST /api/auth/register
```

**Request:**

```typescript
{
  body: RegisterRequestDTO;
  headers: CommonHeaders;
}
```

**Response Examples:**

**Success (201 Created):**

```typescript
{
  status: 201,
  headers: {
    'Set-Cookie': 'auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; Max-Age=604800; SameSite=Strict; HttpOnly',
    ...SecurityHeaders
  },
  body: {
    data: {
      id: "cm2x8p9q10000...",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: "USER",
      isActive: true,
      emailVerified: false,
      lastLoginAt: null,
      createdAt: "2024-01-15T10:30:00.000Z",
      updatedAt: "2024-01-15T10:30:00.000Z"
    },
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    message: "Registration successful"
  }
}
```

**Error Responses:**

**User Already Exists (400 Bad Request):**

```typescript
{
  status: 400,
  body: {
    message: "User already exists with this email",
    code: "USER_EXISTS",
    field: "email"
  }
}
```

**Validation Error (400 Bad Request):**

```typescript
{
  status: 400,
  body: {
    message: "Validation failed",
    code: "VALIDATION_ERROR",
    errors: [
      {
        field: "password",
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      }
    ]
  }
}
```

**Server Error (500 Internal Server Error):**

```typescript
{
  status: 500,
  body: {
    message: "Registration failed",
    code: "INTERNAL_SERVER_ERROR"
  }
}
```

### 2. User Login

```http
POST /api/auth/login
```

**Request:**

```typescript
{
  body: LoginRequestDTO;
  headers: CommonHeaders;
}
```

**Response Examples:**

**Success (200 OK):**

```typescript
{
  status: 200,
  headers: {
    'Set-Cookie': 'auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; Max-Age=604800; SameSite=Strict; HttpOnly',
    ...SecurityHeaders
  },
  body: {
    data: PublicUser,
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    message: "Login successful"
  }
}
```

**Invalid Credentials (401 Unauthorized):**

```typescript
{
  status: 401,
  body: {
    message: "Invalid email or password",
    code: "INVALID_CREDENTIALS"
  }
}
```

**Account Disabled (401 Unauthorized):**

```typescript
{
  status: 401,
  body: {
    message: "Account is disabled",
    code: "ACCOUNT_DISABLED"
  }
}
```

**Too Many Attempts (429 Too Many Requests):**

```typescript
{
  status: 429,
  body: {
    message: "Too many login attempts. Please try again later.",
    code: "RATE_LIMITED",
    retryAfter: 300 // seconds
  }
}
```

### 3. Get Current User

```http
GET /api/auth/me
```

**Request:**

```typescript
{
  headers: AuthHeaders;
  cookies: {
    'auth-token': string;
  };
}
```

**Response Examples:**

**Success (200 OK):**

```typescript
{
  status: 200,
  body: {
    data: PublicUser,
    message: "User data retrieved successfully"
  }
}
```

**No Token (401 Unauthorized):**

```typescript
{
  status: 401,
  body: {
    message: "No authentication token",
    code: "NO_TOKEN"
  }
}
```

**Invalid Token (401 Unauthorized):**

```typescript
{
  status: 401,
  body: {
    message: "Invalid or expired token",
    code: "INVALID_TOKEN"
  }
}
```

**User Not Found (401 Unauthorized):**

```typescript
{
  status: 401,
  body: {
    message: "User not found",
    code: "USER_NOT_FOUND"
  }
}
```

### 4. User Logout

```http
POST /api/auth/logout
```

**Request:**

```typescript
{
  headers: CommonHeaders;
  cookies: {
    'auth-token'?: string;
  };
}
```

**Response Examples:**

**Success (200 OK):**

```typescript
{
  status: 200,
  headers: {
    'Set-Cookie': 'auth-token=; Path=/; Max-Age=0',
    ...SecurityHeaders
  },
  body: {
    message: "Logged out successfully"
  }
}
```

**Server Error (500 Internal Server Error):**

```typescript
{
  status: 500,
  body: {
    message: "Logout failed",
    code: "INTERNAL_SERVER_ERROR"
  }
}
```

---

## User Management Endpoints

### 1. Update User Profile

```http
PUT /api/users/profile
```

**Request:**

```typescript
{
  body: UpdateProfileRequestDTO;
  headers: AuthHeaders;
  cookies: {
    'auth-token': string;
  };
}
```

**Response Examples:**

**Success (200 OK):**

```typescript
{
  status: 200,
  body: {
    data: PublicUser,
    message: "Profile updated successfully"
  }
}
```

**Email Already Exists (400 Bad Request):**

```typescript
{
  status: 400,
  body: {
    message: "Email already in use by another account",
    code: "EMAIL_EXISTS",
    field: "email"
  }
}
```

### 2. Change Password

```http
PUT /api/users/password
```

**Request:**

```typescript
{
  body: {
    currentPassword: string;
    newPassword: string;
  };
  headers: AuthHeaders;
  cookies: {
    'auth-token': string;
  };
}
```

**Response Examples:**

**Success (200 OK):**

```typescript
{
  status: 200,
  body: {
    message: "Password changed successfully"
  }
}
```

**Invalid Current Password (400 Bad Request):**

```typescript
{
  status: 400,
  body: {
    message: "Current password is incorrect",
    code: "INVALID_CURRENT_PASSWORD"
  }
}
```

### 3. Delete Account

```http
DELETE /api/users/account
```

**Request:**

```typescript
{
  body: {
    password: string;
  };
  headers: AuthHeaders;
  cookies: {
    'auth-token': string;
  };
}
```

**Response Examples:**

**Success (200 OK):**

```typescript
{
  status: 200,
  headers: {
    'Set-Cookie': 'auth-token=; Path=/; Max-Age=0'
  },
  body: {
    message: "Account deleted successfully"
  }
}
```

---

## Session Management

### 1. Get Active Sessions

```http
GET /api/auth/sessions
```

**Request:**

```typescript
{
  headers: AuthHeaders;
  cookies: {
    'auth-token': string;
  };
}
```

**Response:**

```typescript
{
  status: 200,
  body: {
    data: Array<{
      id: string;
      createdAt: Date;
      lastActivityAt: Date;
      expiresAt: Date;
      isCurrent: boolean;
    }>,
    message: "Sessions retrieved successfully"
  }
}
```

### 2. Revoke Session

```http
DELETE /api/auth/sessions/:sessionId
```

**Request:**

```typescript
{
  params: {
    sessionId: string;
  };
  headers: AuthHeaders;
  cookies: {
    'auth-token': string;
  };
}
```

**Response:**

```typescript
{
  status: 200,
  body: {
    message: "Session revoked successfully"
  }
}
```

### 3. Revoke All Sessions

```http
DELETE /api/auth/sessions
```

**Request:**

```typescript
{
  headers: AuthHeaders;
  cookies: {
    'auth-token': string;
  };
}
```

**Response:**

```typescript
{
  status: 200,
  headers: {
    'Set-Cookie': 'auth-token=; Path=/; Max-Age=0'
  },
  body: {
    message: "All sessions revoked successfully"
  }
}
```

---

## Error Handling

### Error Response Schema

```typescript
interface ErrorResponse {
  message: string; // Human-readable error message
  code: string; // Machine-readable error code
  field?: string; // Field that caused the error (validation)
  errors?: ValidationError[]; // Multiple validation errors
  retryAfter?: number; // Retry delay in seconds (rate limiting)
  timestamp: string; // ISO timestamp
  requestId: string; // Unique request identifier
}

interface ValidationError {
  field: string; // Field name
  message: string; // Error message
  value?: any; // Invalid value (sanitized)
}
```

### HTTP Status Codes

| Status | Code                  | Description             | Use Cases                            |
| ------ | --------------------- | ----------------------- | ------------------------------------ |
| 200    | OK                    | Success                 | Login, profile update, logout        |
| 201    | Created               | Resource created        | Registration                         |
| 400    | Bad Request           | Client error            | Validation errors, user exists       |
| 401    | Unauthorized          | Authentication required | Invalid credentials, no token        |
| 403    | Forbidden             | Access denied           | Insufficient permissions             |
| 404    | Not Found             | Resource not found      | User not found                       |
| 409    | Conflict              | Resource conflict       | Email already exists                 |
| 429    | Too Many Requests     | Rate limited            | Too many login attempts              |
| 500    | Internal Server Error | Server error            | Database errors, unexpected failures |

### Error Codes

```typescript
enum ErrorCodes {
  // Authentication errors
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  NO_TOKEN = "NO_TOKEN",
  INVALID_TOKEN = "INVALID_TOKEN",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  ACCOUNT_DISABLED = "ACCOUNT_DISABLED",

  // Validation errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_EMAIL = "INVALID_EMAIL",
  WEAK_PASSWORD = "WEAK_PASSWORD",
  INVALID_CURRENT_PASSWORD = "INVALID_CURRENT_PASSWORD",

  // Resource errors
  USER_EXISTS = "USER_EXISTS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  EMAIL_EXISTS = "EMAIL_EXISTS",
  SESSION_NOT_FOUND = "SESSION_NOT_FOUND",

  // Rate limiting
  RATE_LIMITED = "RATE_LIMITED",

  // Server errors
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
}
```

---

## Security Specifications

### JWT Token Configuration

```typescript
interface JWTConfig {
  secret: string; // 'dev-jwt-secret-key' for development
  algorithm: "HS256"; // HMAC SHA256
  expiresIn: "7d"; // 7 days expiration
  issuer: "hello-ai-agent"; // Token issuer
  audience: "hello-ai-agent"; // Token audience
}

interface JWTPayload {
  userId: string; // User identifier
  iat: number; // Issued at timestamp
  exp: number; // Expiration timestamp
  iss: string; // Issuer
  aud: string; // Audience
}
```

### Password Security

```typescript
interface PasswordConfig {
  algorithm: "bcrypt"; // Bcrypt hashing
  saltRounds: 10; // Salt rounds for bcrypt
  minLength: 8; // Minimum password length
  requirements: {
    uppercase: boolean; // At least one uppercase letter
    lowercase: boolean; // At least one lowercase letter
    number: boolean; // At least one number
    special?: boolean; // At least one special character (optional)
  };
}
```

### Cookie Security

```typescript
interface CookieConfig {
  name: "auth-token";
  httpOnly: boolean; // true in production, false in development
  secure: boolean; // true in production (HTTPS), false in development
  sameSite: "strict"; // CSRF protection
  maxAge: 604800; // 7 days in seconds
  path: "/"; // Available on all paths
  domain?: string; // Domain restriction (production only)
}
```

### Rate Limiting

```typescript
interface RateLimitConfig {
  login: {
    windowMs: 15 * 60 * 1000;  // 15 minutes
    maxAttempts: 5;            // 5 attempts per window
    blockDuration: 15 * 60;    // 15 minutes block
  };
  register: {
    windowMs: 60 * 60 * 1000;  // 1 hour
    maxAttempts: 3;            // 3 registrations per hour per IP
    blockDuration: 60 * 60;    // 1 hour block
  };
  passwordChange: {
    windowMs: 60 * 60 * 1000;  // 1 hour
    maxAttempts: 3;            // 3 attempts per hour
    blockDuration: 60 * 60;    // 1 hour block
  };
}
```

---

## TypeScript Interfaces

### API Client Configuration

```typescript
interface ApiClient {
  baseURL: string;
  timeout: number;
  withCredentials: boolean;
  interceptors: {
    request: RequestInterceptor[];
    response: ResponseInterceptor[];
  };
}

interface RequestInterceptor {
  (config: RequestConfig): RequestConfig | Promise<RequestConfig>;
}

interface ResponseInterceptor {
  onFulfilled?: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>;
  onRejected?: (error: ApiError) => Promise<ApiError>;
}
```

### Authentication API Interface

```typescript
interface AuthAPI {
  register(data: RegisterRequestDTO): Promise<RegisterResponseDTO>;
  login(data: LoginRequestDTO): Promise<LoginResponseDTO>;
  logout(): Promise<{ message: string }>;
  getCurrentUser(): Promise<{ data: PublicUser }>;
  updateProfile(
    data: UpdateProfileRequestDTO
  ): Promise<UpdateProfileResponseDTO>;
  changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }>;
  deleteAccount(data: { password: string }): Promise<{ message: string }>;
  getSessions(): Promise<{ data: Session[] }>;
  revokeSession(sessionId: string): Promise<{ message: string }>;
  revokeAllSessions(): Promise<{ message: string }>;
}
```

### React Hook Interfaces

```typescript
interface UseAuthReturn {
  user: PublicUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequestDTO) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequestDTO) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface UseLoginReturn {
  login: (data: LoginRequestDTO) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

interface UseRegisterReturn {
  register: (data: RegisterRequestDTO) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}
```

---

## MSW Implementation Details

### Handler Configuration

```typescript
interface MSWConfig {
  baseURL: string; // '/api' for local development
  delayMs: {
    min: 200; // Minimum network delay
    max: 800; // Maximum network delay
  };
  persistence: {
    browser: "localStorage"; // Browser persistence method
    node: "filesystem"; // Node.js persistence method
    key: "auth-db"; // Storage key
    file: "mocked-auth-db.json"; // File name for Node.js
  };
  security: {
    jwtSecret: "dev-jwt-secret-key";
    cookieName: "auth-token";
    bcryptRounds: 10;
  };
}
```

### Database Factory Setup

```typescript
import { factory, primaryKey } from "@mswjs/data";
import { nanoid } from "nanoid";

const db = factory({
  user: {
    id: primaryKey(nanoid),
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
    isActive: () => true,
    emailVerified: () => false,
    lastLoginAt: () => null,
    createdAt: Date.now,
    updatedAt: Date.now,
  },
  session: {
    id: primaryKey(nanoid),
    userId: String,
    token: String,
    expiresAt: Date,
    createdAt: Date.now,
    lastActivityAt: Date.now,
  },
  loginAttempt: {
    id: primaryKey(nanoid),
    email: String,
    success: Boolean,
    ipAddress: () => "127.0.0.1",
    userAgent: () => "Test User Agent",
    attemptedAt: Date.now,
  },
});
```

### Handler Utilities

```typescript
interface HandlerUtils {
  hashPassword: (password: string) => string;
  verifyPassword: (password: string, hash: string) => boolean;
  generateJWT: (userId: string) => string;
  verifyJWT: (token: string) => { userId: string } | null;
  sanitizeUser: (user: User) => PublicUser;
  networkDelay: () => Promise<void>;
  requireAuth: (
    cookies: Record<string, string>
  ) => { user: PublicUser; error?: never } | { user?: never; error: string };
  validateEmail: (email: string) => boolean;
  validatePassword: (password: string) => { valid: boolean; errors: string[] };
}
```

---

## Testing Contracts

### Test Data Setup

```typescript
interface TestData {
  users: {
    validUser: RegisterRequestDTO;
    adminUser: RegisterRequestDTO;
    inactiveUser: RegisterRequestDTO;
  };
  credentials: {
    valid: LoginRequestDTO;
    invalid: LoginRequestDTO;
    nonexistent: LoginRequestDTO;
  };
  tokens: {
    valid: string;
    expired: string;
    invalid: string;
  };
}
```

### Test Scenarios

```typescript
interface TestScenarios {
  registration: {
    successful: () => Promise<void>;
    duplicateEmail: () => Promise<void>;
    invalidData: () => Promise<void>;
    weakPassword: () => Promise<void>;
  };
  login: {
    successful: () => Promise<void>;
    invalidCredentials: () => Promise<void>;
    inactiveAccount: () => Promise<void>;
    rateLimited: () => Promise<void>;
  };
  authentication: {
    validToken: () => Promise<void>;
    expiredToken: () => Promise<void>;
    invalidToken: () => Promise<void>;
    noToken: () => Promise<void>;
  };
  logout: {
    successful: () => Promise<void>;
    noSession: () => Promise<void>;
  };
  profile: {
    updateSuccessful: () => Promise<void>;
    emailConflict: () => Promise<void>;
    unauthorized: () => Promise<void>;
  };
  sessions: {
    listSessions: () => Promise<void>;
    revokeSession: () => Promise<void>;
    revokeAllSessions: () => Promise<void>;
  };
}
```

### Mock Data Seeds

```typescript
interface SeedData {
  users: User[];
  sessions: Session[];
  loginAttempts: LoginAttempt[];
}

const seedData: SeedData = {
  users: [
    {
      id: "user-1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "$2a$10$...",
      role: "USER",
      isActive: true,
      emailVerified: true,
      lastLoginAt: new Date("2024-01-15T10:30:00.000Z"),
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-15T10:30:00.000Z"),
    },
    // Additional seed users...
  ],
  sessions: [
    {
      id: "session-1",
      userId: "user-1",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      lastActivityAt: new Date(),
    },
    // Additional seed sessions...
  ],
  loginAttempts: [
    {
      id: "attempt-1",
      email: "john@example.com",
      success: true,
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0...",
      attemptedAt: new Date(),
    },
    // Additional login attempts...
  ],
};
```

---

## Integration Examples

### Frontend API Client Usage

```typescript
// Registration example
try {
  const response = await authAPI.register({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "SecurePass123",
  });

  console.log("User registered:", response.data);
  // Token is automatically stored in httpOnly cookie
} catch (error) {
  if (error.response?.status === 400) {
    console.error("Registration failed:", error.response.data.message);
  }
}

// Login example
try {
  const response = await authAPI.login({
    email: "john@example.com",
    password: "SecurePass123",
  });

  console.log("Login successful:", response.data);
} catch (error) {
  if (error.response?.status === 401) {
    console.error("Invalid credentials");
  } else if (error.response?.status === 429) {
    console.error("Too many attempts, try again later");
  }
}

// Get current user example
try {
  const response = await authAPI.getCurrentUser();
  console.log("Current user:", response.data);
} catch (error) {
  if (error.response?.status === 401) {
    console.log("User not authenticated");
    // Redirect to login page
  }
}
```

### React Hook Usage

```typescript
function LoginForm() {
  const { login, isLoading, error } = useLogin();

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      // User is now authenticated
      navigate("/dashboard");
    } catch (err) {
      // Error is handled by the hook and available in `error`
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert>{error}</Alert>}
      {/* Form fields */}
      <Button disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
```

---

## Performance Specifications

### Response Time Targets

```typescript
interface PerformanceTargets {
  registration: {
    p50: 300; // 300ms for 50th percentile
    p95: 800; // 800ms for 95th percentile
    p99: 1500; // 1.5s for 99th percentile
  };
  login: {
    p50: 200;
    p95: 600;
    p99: 1200;
  };
  getCurrentUser: {
    p50: 100;
    p95: 300;
    p99: 600;
  };
  logout: {
    p50: 150;
    p95: 400;
    p99: 800;
  };
}
```

### Caching Strategy

```typescript
interface CacheConfig {
  userProfile: {
    duration: 300; // 5 minutes
    invalidateOn: ["profile-update", "logout"];
  };
  sessions: {
    duration: 60; // 1 minute
    invalidateOn: ["login", "logout", "session-revoke"];
  };
}
```

---

## Migration Considerations

### Development to Production Migration

```typescript
interface MigrationConfig {
  database: {
    from: "MSW + localStorage/filesystem";
    to: "PostgreSQL/MongoDB";
    migrationScript: string;
  };
  authentication: {
    jwtSecret: {
      from: "dev-jwt-secret-key";
      to: "environment-variable";
    };
    cookies: {
      secure: {
        from: false;
        to: true;
      };
      httpOnly: {
        from: false;
        to: true;
      };
    };
  };
  endpoints: {
    baseURL: {
      from: "/api";
      to: "https://api.yourdomain.com";
    };
  };
}
```

### Backward Compatibility

```typescript
interface CompatibilityMatrix {
  msw: {
    version: "^2.0.0";
    nodeSupport: ">=16.0.0";
    browserSupport: ["Chrome >=90", "Firefox >=88", "Safari >=14"];
  };
  jwt: {
    algorithm: "HS256"; // Consistent between dev and prod
    payload: "StandardClaims"; // RFC 7519 compliant
  };
}
```

---

This API contract provides a complete specification for implementing the login form with database integration as outlined in the planning document. It ensures type safety, proper error handling, security best practices, and a clear migration path to production systems while maintaining zero external dependencies during development.
