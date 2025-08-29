# Profile Form API Contract

## 🎯 Overview
API contract definition for the Profile/Settings form feature based on the Figma design specifications. This contract defines the data structures, validation rules, and API endpoints needed for the form implementation.

## 📋 Data Models

### ProfileFormData Interface
```typescript
interface ProfileFormData {
  username: string;
  email: string;
  bio?: string;
  urls: ProfileUrl[];
  settings?: ProfileSettings;
}

interface ProfileUrl {
  id: string;
  label: string;
  url: string;
  type: 'website' | 'twitter' | 'linkedin' | 'github' | 'custom';
}

interface ProfileSettings {
  emailNotifications: boolean;
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
}
```

### Form Validation Schema (Zod)
```typescript
const profileFormSchema = z.object({
  username: z.string()
    .min(2, "Username must be at least 2 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .refine(async (username) => {
      // Check username availability
      return await isUsernameAvailable(username);
    }, "Username is already taken"),
    
  email: z.string()
    .email("Please enter a valid email address")
    .refine(async (email) => {
      // Verify email is in user's verified emails list
      return await isEmailVerified(email);
    }, "Please select a verified email address"),
    
  bio: z.string()
    .max(160, "Bio must be less than 160 characters")
    .optional(),
    
  urls: z.array(z.object({
    id: z.string(),
    label: z.string().min(1, "Label is required"),
    url: z.string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
    type: z.enum(['website', 'twitter', 'linkedin', 'github', 'custom'])
  })).max(5, "Maximum 5 URLs allowed"),
  
  settings: z.object({
    emailNotifications: z.boolean().default(true),
    profileVisibility: z.enum(['public', 'private', 'friends']).default('public'),
    showEmail: z.boolean().default(false)
  }).optional()
});
```

## 🔌 API Endpoints

### GET /api/profile
Retrieve current user's profile data

**Request:**
```typescript
// No body required - uses authentication token
```

**Response:**
```typescript
{
  success: true,
  data: {
    username: "shadcn",
    email: "user@example.com",
    bio: "I own a computer.",
    urls: [
      {
        id: "website",
        label: "Website",
        url: "https://shadcn.com",
        type: "website"
      },
      {
        id: "twitter",
        label: "Twitter",
        url: "https://twitter.com/shadcn",
        type: "twitter"
      }
    ],
    settings: {
      emailNotifications: true,
      profileVisibility: "public",
      showEmail: false
    }
  }
}
```

### PUT /api/profile
Update user's profile information

**Request:**
```typescript
{
  username: "shadcn",
  email: "user@example.com",
  bio: "I own a computer and write code.",
  urls: [
    {
      id: "website",
      label: "Website", 
      url: "https://shadcn.com",
      type: "website"
    },
    {
      id: "twitter",
      label: "Twitter",
      url: "https://twitter.com/shadcn", 
      type: "twitter"
    }
  ],
  settings: {
    emailNotifications: true,
    profileVisibility: "public",
    showEmail: false
  }
}
```

**Response:**
```typescript
{
  success: true,
  message: "Profile updated successfully",
  data: {
    // Updated profile data
    username: "shadcn",
    email: "user@example.com",
    bio: "I own a computer and write code.",
    urls: [...],
    settings: {...},
    updatedAt: "2025-08-27T13:52:15.000Z"
  }
}
```

### GET /api/profile/verified-emails
Get list of user's verified email addresses

**Response:**
```typescript
{
  success: true,
  data: [
    {
      email: "user@example.com",
      verified: true,
      primary: true,
      verifiedAt: "2025-01-15T10:30:00.000Z"
    },
    {
      email: "admin@example.com", 
      verified: true,
      primary: false,
      verifiedAt: "2025-02-01T14:20:00.000Z"
    }
  ]
}
```

### POST /api/profile/check-username
Check username availability

**Request:**
```typescript
{
  username: "newusername"
}
```

**Response:**
```typescript
{
  success: true,
  available: true,
  suggestions?: ["newusername1", "newusername2"] // If not available
}
```

## 🔒 Authentication & Authorization

### Headers Required
```typescript
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

### Permissions
- User can only update their own profile
- Admin users can view/update any profile
- Public profiles are viewable by all authenticated users

## ⚠️ Error Responses

### Validation Errors (400)
```typescript
{
  success: false,
  error: "VALIDATION_ERROR",
  message: "Invalid input data",
  details: {
    username: ["Username must be at least 2 characters"],
    email: ["Please enter a valid email address"],
    urls: {
      0: {
        url: ["Please enter a valid URL"]
      }
    }
  }
}
```

### Authentication Errors (401)
```typescript
{
  success: false,
  error: "UNAUTHORIZED",
  message: "Authentication required"
}
```

### Not Found Errors (404)
```typescript
{
  success: false,
  error: "NOT_FOUND", 
  message: "Profile not found"
}
```

### Rate Limit Errors (429)
```typescript
{
  success: false,
  error: "RATE_LIMIT_EXCEEDED",
  message: "Too many requests. Please try again later.",
  retryAfter: 60
}
```

## 🎨 Frontend Integration

### React Hook Form Integration
```typescript
const ProfileForm = () => {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      urls: [],
      settings: {
        emailNotifications: true,
        profileVisibility: "public",
        showEmail: false
      }
    }
  });

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(['profile']);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  // Load profile data into form
  useEffect(() => {
    if (profileData) {
      form.reset(profileData);
    }
  }, [profileData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
};
```

### API Service Functions
```typescript
// services/profileApi.ts
export const profileApi = {
  getProfile: async (): Promise<ProfileFormData> => {
    const response = await fetch('/api/profile', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  },

  updateProfile: async (data: ProfileFormData): Promise<ProfileFormData> => {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  },

  getVerifiedEmails: async (): Promise<VerifiedEmail[]> => {
    const response = await fetch('/api/profile/verified-emails', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  },

  checkUsername: async (username: string): Promise<{ available: boolean; suggestions?: string[] }> => {
    const response = await fetch('/api/profile/check-username', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return { available: result.available, suggestions: result.suggestions };
  }
};
```

## 🧪 Testing Contracts

### Unit Test Examples
```typescript
describe('Profile API Contract', () => {
  test('should validate profile form data correctly', () => {
    const validData = {
      username: 'testuser',
      email: 'test@example.com',
      bio: 'Test bio',
      urls: [
        { id: '1', label: 'Website', url: 'https://example.com', type: 'website' }
      ]
    };
    
    const result = profileFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test('should reject invalid username', () => {
    const invalidData = {
      username: 'a', // Too short
      email: 'test@example.com'
    };
    
    const result = profileFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain('at least 2 characters');
  });
});
```

### E2E Test Scenarios
```typescript
// profile-form.spec.ts
test('should update profile successfully', async ({ page }) => {
  await page.goto('/form');
  
  // Fill form fields
  await page.fill('[name="username"]', 'newusername');
  await page.selectOption('[name="email"]', 'user@example.com');
  await page.fill('[name="bio"]', 'Updated bio description');
  
  // Add URL
  await page.fill('[data-testid="url-input-0"]', 'https://example.com');
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Verify success message
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  
  // Verify API call was made
  const requests = page.locator('[data-testid="api-requests"]');
  await expect(requests).toContainText('PUT /api/profile');
});
```

## 📊 Performance Requirements

### Response Times
- GET /api/profile: < 200ms
- PUT /api/profile: < 500ms
- GET /api/profile/verified-emails: < 150ms
- POST /api/profile/check-username: < 100ms

### Rate Limits
- Profile updates: 5 per minute per user
- Username checks: 10 per minute per user
- Profile views: 100 per minute per user

## 🔄 State Management

### Form State
```typescript
interface FormState {
  data: ProfileFormData;
  isLoading: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
  isDirty: boolean;
  isValid: boolean;
}
```

### Cache Strategy
- Profile data: Cache for 5 minutes
- Verified emails: Cache for 1 hour
- Username availability: No cache (always fresh)

## 📝 Implementation Notes

1. **Username Changes**: Limited to once every 30 days
2. **Email Verification**: Only verified emails can be selected
3. **URL Validation**: Must be valid HTTP/HTTPS URLs
4. **Bio Length**: 160 character limit with live counter
5. **Auto-save**: Consider implementing draft saves for long forms
6. **Optimistic Updates**: Update UI immediately, rollback on error
7. **Accessibility**: All form fields must have proper ARIA labels
8. **Mobile**: Form must be fully responsive and touch-friendly
