# Form Feature Implementation - PRP

## 🎯 Goal
Implement a Settings/Profile form page in hello-ai-agent matching the provided Figma design with full validation and responsive layout.

## 📋 What We're Building
A comprehensive form page that replicates the Settings interface from the Figma design, featuring:
- Two-column layout with sidebar navigation
- Profile form with username, email, bio, and URL fields
- Real-time validation with shadcn/ui components
- Responsive design and accessibility features

## 🎨 Design Specifications (From Figma Screenshot)

### Layout Structure
- **Left Sidebar**: Navigation menu with Profile, Account, Appearance, Notifications, Display
- **Main Content**: Form fields with proper spacing and typography
- **Responsive**: Two-column on desktop, stacked on mobile

### Form Components
1. **Username Field**: Text input with "shadcn" placeholder
2. **Email Dropdown**: Select with "Select a verified email to display"
3. **Bio Textarea**: Multi-line text with "I own a computer." placeholder
4. **URL Fields**: Multiple inputs for social profiles
5. **Update Button**: Dark primary button for form submission

### Visual Design
- Clean typography hierarchy
- Generous whitespace between sections
- Subtle input borders
- Descriptive help text under fields
- Dark primary action button

## 🏗️ Technical Implementation

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
```

### 2. Form Schema (Zod)
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
    url: z.string().url("Please enter a valid URL").optional().or(z.literal(""))
  }))
});
```

### 3. Component Architecture
```typescript
// ProfileForm.tsx - Main form component
interface ProfileFormData {
  username: string;
  email: string;
  bio?: string;
  urls: Array<{ id: string; url: string }>;
}

// FormSidebar.tsx - Navigation sidebar
interface SidebarItem {
  id: string;
  label: string;
  active: boolean;
}

// FormField.tsx - Reusable field wrapper
interface FormFieldProps {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}
```

## 🔧 Implementation Steps

### Phase 1: Setup & Routing (30 min)
1. Create `/form` route in App.tsx
2. Add "Form" to sidebar navigation
3. Create basic page structure
4. Setup protected route

### Phase 2: Layout Structure (45 min)
1. Create FormSidebar component with navigation items
2. Build two-column responsive layout
3. Add proper spacing and typography
4. Implement active state for sidebar

### Phase 3: Form Components (90 min)
1. Setup React Hook Form with Zod validation
2. Create ProfileForm component
3. Implement username text input
4. Add email select dropdown
5. Create bio textarea
6. Build dynamic URL input fields
7. Add "Update profile" button

### Phase 4: Validation & UX (60 min)
1. Add real-time field validation
2. Implement error state styling
3. Add loading states for form submission
4. Create success feedback
5. Handle form reset functionality

### Phase 5: Testing & Polish (45 min)
1. Write unit tests for form validation
2. Create E2E tests for form submission
3. Test responsive behavior
4. Verify accessibility compliance
5. Polish animations and transitions

## 💻 Code Implementation

### App.tsx Route Addition
```typescript
// Add to existing routes
<Route path="/form" element={<FormPage />} />
```

### Sidebar Navigation Update
```typescript
// Add to menuItems in sidebar.tsx
{
  title: 'Form',
  url: '/form',
  icon: FileText,
},
```

### Main Form Page Component
```typescript
// src/pages/form.tsx
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

### Profile Form Component
```typescript
// src/components/forms/ProfileForm.tsx
export function ProfileForm() {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      urls: [
        { id: "website", url: "" },
        { id: "twitter", url: "" }
      ]
    }
  });

  const onSubmit = (data: ProfileFormData) => {
    // Handle form submission
    console.log(data);
  };

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
              <Input placeholder="https://shadcn.com" />
              <Input placeholder="https://twitter.com/shadcn" />
              <Button variant="outline" size="sm" type="button">
                Add URL
              </Button>
            </div>
          </div>
        </div>

        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
```

## ✅ Validation Rules
- **Username**: 2-30 characters, alphanumeric + underscore only
- **Email**: Valid email format, required
- **Bio**: Max 160 characters, optional
- **URLs**: Valid URL format when provided, optional

## 🧪 Testing Strategy

### Unit Tests
- Form validation logic
- Component rendering
- Error state handling
- Form submission

### E2E Tests
```typescript
// form.spec.ts
test('should submit profile form with valid data', async ({ page }) => {
  await page.goto('/form');
  
  await page.fill('[name="username"]', 'testuser');
  await page.selectOption('[name="email"]', 'user@example.com');
  await page.fill('[name="bio"]', 'Test bio description');
  
  await page.click('button[type="submit"]');
  
  // Assert success state
});
```

## 🎯 Success Criteria
- [ ] Form matches Figma design exactly
- [ ] All validation rules work correctly
- [ ] Responsive design works on all screen sizes
- [ ] Form submission handles success/error states
- [ ] E2E tests cover all form interactions
- [ ] Accessibility compliance (ARIA labels, keyboard navigation)

## 🚀 Execution Commands

```bash
# Install any missing dependencies
npm install

# Start development server
npm run dev

# Run tests after implementation
npm run test
npx playwright test

# Build verification
npm run build
```

## 📝 Implementation Notes
- Use existing shadcn/ui components for consistency
- Follow current project patterns for component structure
- Ensure form is fully accessible
- Implement proper loading and error states
- Add smooth animations for better UX
