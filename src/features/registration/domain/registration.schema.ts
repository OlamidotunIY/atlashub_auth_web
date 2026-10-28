import { z } from 'zod';

export const RegistrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  country: z.string().min(2, 'Please select your country of residence'),
});

export type RegistrationFormValues = z.infer<typeof RegistrationSchema>;

export const COUNTRY_OPTIONS = [
  { value: 'NG', label: 'Nigeria (NG)' },
  { value: 'GH', label: 'Ghana (GH)' },
  { value: 'KE', label: 'Kenya (KE)' },
  { value: 'ZA', label: 'South Africa (ZA)' },
  { value: 'GB', label: 'United Kingdom (GB)' },
  { value: 'US', label: 'United States (US)' },
  { value: 'EG', label: 'Egypt (EG)' },
  { value: 'CI', label: "Côte d'Ivoire (CI)" },
];
