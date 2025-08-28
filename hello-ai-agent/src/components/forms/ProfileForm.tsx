import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, ControllerRenderProps } from 'react-hook-form';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useProfile,
  useUpdateProfile,
  useVerifiedEmails,
} from '@/hooks/useProfile';
import { profileFormSchema, type ProfileFormData } from '@/types/profile';
import { useToast } from '@/components/ui/toast';

export function ProfileForm() {
  const { data: profileData, isLoading } = useProfile();
  const { data: verifiedEmails } = useVerifiedEmails();
  const { updateProfile, isUpdating } = useUpdateProfile();
  const { showToast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onBlur', // Change from onChange to onBlur to prevent constant validation
    reValidateMode: 'onBlur',
    shouldFocusError: true,
    criteriaMode: 'firstError', // Show only the first validation error to avoid multiple errors
    defaultValues: {
      username: 'shadcn',
      email: 'user@example.com',
      bio: 'I own a computer.',
      urls: [
        {
          id: 'website',
          label: 'Website',
          url: 'https://shadcn.com',
          type: 'website',
        },
        {
          id: 'twitter',
          label: 'Twitter',
          url: 'https://twitter.com/shadcn',
          type: 'twitter',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'urls',
  });

  // Load profile data into form when available
  useEffect(() => {
    if (profileData) {
      form.reset(profileData);
    }
  }, [profileData, form]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Clear any existing errors first
      form.clearErrors();
      await updateProfile(data);
      console.log('Profile updated successfully', data);
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update profile', error);
      showToast('Failed to update profile. Please try again.', 'error');
    }
  };

  const onInvalid = (errors: any) => {
    console.log('Form validation errors:', errors);

    // Show toast with validation errors
    const errorMessages = Object.entries(errors)
      .map(([field, error]: [string, any]) => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        return `${fieldName}: ${error.message}`;
      })
      .join(', ');

    showToast(`Please fix the following errors: ${errorMessages}`, 'error');

    // Ensure errors are displayed in form fields
    Object.entries(errors).forEach(([field, error]: [string, any]) => {
      form.setError(field as keyof ProfileFormData, {
        type: 'manual',
        message: error.message,
      });
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">Loading...</div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit, onInvalid)(e);
        }}
        className="space-y-8"
      >
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
            render={({
              field,
            }: {
              field: ControllerRenderProps<ProfileFormData, 'username'>;
            }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription className="text-blue-600 font-medium">
                  This is your public display name. It can be your real name or
                  a pseudonym. You can only change this once every 30 days.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({
              field,
            }: {
              field: ControllerRenderProps<ProfileFormData, 'email'>;
            }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {verifiedEmails?.map((email: any) => (
                      <SelectItem key={email.email} value={email.email}>
                        {email.email}
                      </SelectItem>
                    )) || (
                      <>
                        <SelectItem value="user@example.com">
                          user@example.com
                        </SelectItem>
                        <SelectItem value="admin@example.com">
                          admin@example.com
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription className="text-blue-600 font-medium">
                  You can manage verified email addresses in your email
                  settings.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bio Field */}
          <FormField
            control={form.control}
            name="bio"
            render={({
              field,
            }: {
              field: ControllerRenderProps<ProfileFormData, 'bio'>;
            }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="I own a computer."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-blue-600 font-medium">
                  You can @mention other users and organizations to link to
                  them.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* URLs Section */}
          <div className="space-y-4">
            <FormLabel>URLs</FormLabel>
            <FormDescription className="text-blue-600 font-medium">
              Add links to your website, blog, or social media profiles.
            </FormDescription>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name={`urls.${index}.url`}
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<
                        ProfileFormData,
                        `urls.${number}.url`
                      >;
                    }) => (
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
                  onClick={() =>
                    append({
                      id: `url-${Date.now()}`,
                      label: 'Custom',
                      url: '',
                      type: 'custom',
                    })
                  }
                >
                  Add URL
                </Button>
              )}
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update profile'}
        </Button>
      </form>
    </Form>
  );
}
