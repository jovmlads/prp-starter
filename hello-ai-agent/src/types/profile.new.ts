import { z } from 'zod';

export interface ProfileFormData {
  username: string;
  email: string;
  bio?: string;
  urls: ProfileUrl[];
  settings?: ProfileSettings;
}

export interface ProfileUrl {
  id: string;
  label: string;
  url: string;
  type: 'website' | 'twitter' | 'linkedin' | 'github' | 'custom';
}

export interface ProfileSettings {
  emailNotifications: boolean;
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
}

// Create a validation schema with proper error handling
export const profileFormSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(2, 'Username must be at least 2 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    ),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please select a valid email address'),
  bio: z
    .string()
    .max(160, 'Bio must be less than 160 characters')
    .optional()
    .or(z.literal('')),
  urls: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().min(1, 'Label is required'),
        url: z
          .string()
          .refine(
            (val) => val === '' || z.string().url().safeParse(val).success,
            {
              message: 'Please enter a valid URL',
            }
          ),
        type: z.enum(['website', 'twitter', 'linkedin', 'github', 'custom']),
      })
    )
    .max(5, 'Maximum 5 URLs allowed'),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
