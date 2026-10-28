import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase(),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4, 'Enter the reset code sent to your email'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});
