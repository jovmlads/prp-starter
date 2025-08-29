# Profile Form Feature - PRP Base

## 🎯 Goal
Implement a comprehensive Settings/Profile form page in hello-ai-agent matching the provided Figma design with full validation, API integration, and responsive layout.

## 📋 What We're Building
A complete form feature that replicates the Settings interface from the Figma design, featuring:
- Two-column layout with sidebar navigation (Profile, Account, Appearance, Notifications, Display)
- Profile form with username, email, bio, and URL fields matching exact design
- Real-time validation with shadcn/ui components
- Full API integration with backend services
- Responsive design and accessibility compliance

## 🎨 Design Specifications (From Figma Screenshot)

### Layout Structure
- **Left Sidebar**: Navigation menu with Profile, Account, Appearance, Notifications, Display
- **Main Content**: Form fields with proper spacing and typography
- **Responsive**: Two-column on desktop, stacked on mobile

### Form Components
1. **Username Field**: Text input with "shadcn" placeholder
2. **Email Dropdown**: Select with "Select a verified email to display"
3. **Bio Textarea**: Multi-line text with "I own a computer." placeholder
4. **URL Fields**: Multiple inputs for social profiles (website, twitter, etc.)
5. **Update Button**: Dark primary button for form submission

### Visual Design
- Clean typography hierarchy with section headers
- Generous whitespace between form sections
- Subtle input borders with focus states
- Descriptive help text under each field
- Dark primary action button matching design

## 🏗️ Technical Architecture

### 1. File Structure
```
src/
├── pages/
│   └── form.tsx                 # Main form page
├── components/
│   ├── forms/
│   │   ├── ProfileForm.tsx      # Profile form component
│   │   ├── FormSidebar.tsx      # Settings sidebar navigation
│   │   └── FormField.tsx        # Reusable form field wrapper
│   └── ui/
│       ├── form.tsx             # shadcn/ui form components
│       ├── input.tsx            # shadcn/ui input
│       ├── textarea.tsx         # shadcn/ui textarea
│       ├── select.tsx           # shadcn/ui select
│       └── button.tsx           # shadcn/ui button
├── services/
│   └── profileApi.ts            # API service functions
├── types/
│   └── profile.ts               # TypeScript interfaces
└── hooks/
    └── useProfile.ts            # Custom hooks for profile data
```

### 2. Data Models & API Contract

#### TypeScript Interfaces
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

#### Zod Validation Schema
```typescript
const profileFormSchema = z.object({
  username: z.string()
    .min(2, "Username must be at least 2 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Please select a valid email address"),
  bio: z.string()
    .max(160, "Bio must be less than 160 characters")
    .optional(),
  urls: z.array(z.object({
    id: z.string(),
    label: z.string().min(1, "Label is required"),
    url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    type: z.enum(['website', 'twitter', 'linkedin', 'github', 'custom'])
  })).max(5, "Maximum 5 URLs allowed")
});
```

### 3. API Endpoints
- **GET /api/profile** - Retrieve current user's profile data
- **PUT /api/profile** - Update profile information
- **GET /api/profile/verified-emails** - Get verified email list
- **POST /api/profile/check-username** - Check username availability

## 🔧 Implementation Blueprint

### Phase 1: Setup & Routing (30 min)
1. Create `/form` route in App.tsx
2. Add "Form" to sidebar navigation with FileText icon
3. Create basic FormPage component structure
4. Setup protected route authentication

### Phase 2: Layout Structure (45 min)
1. Create FormSidebar component with navigation items
2. Build responsive two-column layout
3. Add proper spacing and typography classes
4. Implement active state for sidebar navigation

### Phase 3: Form Components (90 min)
1. Setup React Hook Form with Zod validation
2. Create ProfileForm component with form context
3. Implement username text input with validation
4. Add email select dropdown with verified emails
5. Create bio textarea with character counter
6. Build dynamic URL input fields with add/remove functionality
7. Add "Update profile" button with loading states

### Phase 4: API Integration (60 min)
1. Create profileApi service with all endpoints
2. Implement useProfile custom hook with React Query
3. Add form data loading and population
4. Handle form submission with optimistic updates
5. Implement error handling and user feedback

### Phase 5: Testing & Polish (45 min)
1. Write unit tests for form validation logic
2. Create E2E tests for complete form flow
3. Test responsive behavior on all screen sizes
4. Verify accessibility compliance (ARIA labels, keyboard navigation)
5. Polish animations and loading states

## 💻 Complete Implementation

### Main Form Page Component
```typescript
// src/pages/form.tsx
import { FormSidebar } from '@/components/forms/FormSidebar';
import { ProfileForm } from '@/components/forms/ProfileForm';
import { Separator } from '@/components/ui/separator';

export default function FormPage() {
  return (
    <div className="flex h-full">
      <FormSidebar />
      <div className="flex-1 p-6">
        <div className="max-w-2xl">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and set e-mail preferences.
              </p>
            </div>
            <Separator />
            <ProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Form Sidebar Navigation
```typescript
// src/components/forms/FormSidebar.tsx
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const sidebarNavItems = [
  { title: 'Profile', href: '#profile', active: true },
  { title: 'Account', href: '#account', active: false },
  { title: 'Appearance', href: '#appearance', active: false },
  { title: 'Notifications', href: '#notifications', active: false },
  { title: 'Display', href: '#display', active: false },
];

export function FormSidebar() {
  return (
    <aside className="w-64 border-r bg-background p-6">
      <nav className="space-y-2">
        {sidebarNavItems.map((item) => (
          <Button
            key={item.href}
            variant={item.active ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start',
              item.active && 'bg-muted font-medium'
            )}
          >
            {item.title}
          </Button>
        ))}
      </nav>
    </aside>
  );
}
```

### Profile Form Component
```typescript
// src/components/forms/ProfileForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfile } from '@/hooks/useProfile';
import { profileFormSchema, type ProfileFormData } from '@/types/profile';

export function ProfileForm() {
  const { data: profileData, isLoading } = useProfile();
  const { updateProfile, isUpdating } = useUpdateProfile();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      urls: [
        { id: "website", label: "Website", url: "", type: "website" },
        { id: "twitter", label: "Twitter", url: "", type: "twitter" }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "urls"
  });

  // Load profile data into form when available
  useEffect(() => {
    if (profileData) {
      form.reset(profileData);
    }
  }, [profileData, form]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium">Profile</h2>
            <p className="text-sm text-muted-foreground">
              This is how others will see you on the site.
            </p>
          </div>
          
          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or a pseudonym.
                  You can only change this once every 30 days.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="user@example.com">user@example.com</SelectItem>
                    <SelectItem value="admin@example.com">admin@example.com</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  You can manage verified email addresses in your email settings.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bio Field */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="I own a computer."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can @mention other users and organizations to link to them.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* URLs Section */}
          <div className="space-y-4">
            <FormLabel>URLs</FormLabel>
            <FormDescription>
              Add links to your website, blog, or social media profiles.
            </FormDescription>
            
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name={`urls.${index}.url`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder={`https://${fields[index].type === 'website' ? 'shadcn.com' : 'twitter.com/shadcn'}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              
              {fields.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ 
                    id: `url-${Date.now()}`, 
                    label: 'Custom', 
                    url: '', 
                    type: 'custom' 
                  })}
                >
                  Add URL
                </Button>
              )}
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update profile"}
        </Button>
      </form>
    </Form>
  );
}
```

### API Service Implementation
```typescript
// src/services/profileApi.ts
import { ProfileFormData } from '@/types/profile';

const API_BASE = '/api';

export const profileApi = {
  getProfile: async (): Promise<ProfileFormData> => {
    const response = await fetch(`${API_BASE}/profile`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  },

  updateProfile: async (data: ProfileFormData): Promise<ProfileFormData> => {
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  },

  getVerifiedEmails: async () => {
    const response = await fetch(`${API_BASE}/profile/verified-emails`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  }
};
```

### Custom Hooks
```typescript
// src/hooks/useProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/services/profileApi';
import { ProfileFormData } from '@/types/profile';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      queryClient.invalidateQueries(['profile']);
    },
  });

  return {
    updateProfile: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}
```

### Route Integration
```typescript
// Add to App.tsx routes
import FormPage from '@/pages/form';

// In your routes configuration:
<Route path="/form" element={<FormPage />} />
```

### Sidebar Navigation Update
```typescript
// Add to sidebar menu items
{
  title: 'Form',
  url: '/form',
  icon: FileText,
}
```

## ✅ Validation Rules
- **Username**: 2-30 characters, alphanumeric + underscore only, availability check
- **Email**: Valid email format, must be from verified emails list
- **Bio**: Max 160 characters with live counter, optional
- **URLs**: Valid URL format when provided, max 5 URLs, optional

## 🧪 Testing Strategy

### Unit Tests
```typescript
// ProfileForm.test.tsx
describe('ProfileForm', () => {
  test('validates username correctly', () => {
    const result = profileFormSchema.safeParse({
      username: 'a', // Too short
      email: 'test@example.com'
    });
    expect(result.success).toBe(false);
  });

  test('submits form with valid data', async () => {
    // Test form submission logic
  });
});
```

### E2E Tests
```typescript
// e2e/profile-form.spec.ts
test('should update profile successfully', async ({ page }) => {
  await page.goto('/form');
  
  // Fill form fields
  await page.fill('[name="username"]', 'testuser');
  await page.selectOption('[name="email"]', 'user@example.com');
  await page.fill('[name="bio"]', 'Test bio description');
  await page.fill('[data-testid="url-input-0"]', 'https://example.com');
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Verify success
  await expect(page.locator('text=Profile updated successfully')).toBeVisible();
});
```

## 🎯 Success Criteria
- [ ] Form matches Figma design exactly
- [ ] All validation rules work correctly
- [ ] Responsive design works on all screen sizes
- [ ] Form submission handles success/error states properly
- [ ] E2E tests cover all form interactions
- [ ] Accessibility compliance (ARIA labels, keyboard navigation)
- [ ] API integration works with proper error handling
- [ ] Loading states and optimistic updates implemented

## 🚀 Execution Commands

```bash
# Navigate to project directory
cd hello-ai-agent

# Install any missing dependencies
npm install

# Start development server
npm run dev

# Run tests after implementation
npm run test
npx playwright test e2e/profile-form.spec.ts

# Build verification
npm run build
```

## 📊 Performance Requirements
- Form renders in < 100ms
- API responses < 500ms
- Smooth animations and transitions
- Optimistic UI updates
- Proper loading states

## 🔄 Implementation Notes
1. Use existing shadcn/ui components for consistency
2. Follow current project patterns for component structure
3. Ensure form is fully accessible with proper ARIA labels
4. Implement proper loading and error states
5. Add smooth animations for better UX
6. Use React Query for efficient data fetching and caching
7. Implement optimistic updates for better perceived performance
8. Add proper TypeScript types for all components and functions
