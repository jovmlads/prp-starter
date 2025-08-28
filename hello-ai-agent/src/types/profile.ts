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
  username: z.string().superRefine((val, ctx) => {
    if (!val || val.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Username is required',
      });
      return;
    }
    if (val.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Username must be at least 2 characters',
      });
      return;
    }
    if (val.length > 30) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Username must be less than 30 characters',
      });
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Username can only contain letters, numbers, and underscores',
      });
      return;
    }
  }),
  email: z.string().superRefine((val, ctx) => {
    if (!val || val.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Email is required',
      });
      return;
    }
    if (!z.string().email().safeParse(val).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a valid email address',
      });
      return;
    }
  }),
  bio: z
    .string()
    .superRefine((val, ctx) => {
      if (val && val.length > 160) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Bio must be less than 160 characters',
        });
        return;
      }
    })
    .optional()
    .or(z.literal('')),
  urls: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().min(1, 'Label is required'),
        url: z.string().superRefine((val, ctx) => {
          if (
            val &&
            val.trim().length > 0 &&
            !z.string().url().safeParse(val).success
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Please enter a valid URL',
            });
            return;
          }
        }),
        type: z.enum(['website', 'twitter', 'linkedin', 'github', 'custom']),
      })
    )
    .max(5, 'Maximum 5 URLs allowed'),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
