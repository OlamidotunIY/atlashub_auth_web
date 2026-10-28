import { z } from 'zod';

export const VerifyEmailSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4, 'Enter the verification code').max(10),
});

export type VerifyEmailFormValues = z.infer<typeof VerifyEmailSchema>;
