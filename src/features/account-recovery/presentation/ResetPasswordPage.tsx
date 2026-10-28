import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { container } from '../../../app/composition/container';
import {
  AuthButtonWidget,
  AuthErrorBanner,
  AuthFieldWidget,
  AuthFormHeader,
} from '../../../shared/presentation/widgets';
import { Field, FieldDescription, FieldGroup } from '../../../shared/ui';
import { ResetPasswordSchema } from '../domain/recovery.schema';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const returnTo = searchParams.get('return_to');

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = ResetPasswordSchema.safeParse({ email, otp, newPassword });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Invalid input');
      return;
    }

    setIsLoading(true);
    try {
      await container.authService.resetPassword({ email, otp, newPassword });
      setSuccess('Password reset successfully! Redirecting to sign in...');
      setTimeout(() => {
        const query = new URLSearchParams({ email });
        if (returnTo) query.set('return_to', returnTo);
        navigate(`/login?${query.toString()}`);
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password. Please verify the code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <FieldGroup>
        <AuthFormHeader
          title="Create new password"
          subtitle={`Enter the reset code sent to ${email} along with your new password.`}
        />

        {error && <AuthErrorBanner error={error} />}
        {success && (
          <div className="bg-primary/10 text-primary text-sm p-3 rounded-md text-center">
            {success}
          </div>
        )}

        <AuthFieldWidget
          id="otp"
          label="Reset Code"
          placeholder="e.g. 123456"
          value={otp}
          onChange={(val) => setOtp(val)}
          disabled={isLoading}
          required
        />

        <AuthFieldWidget
          id="newPassword"
          label="New Password"
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(val) => setNewPassword(val)}
          disabled={isLoading}
          required
        />

        <AuthButtonWidget
          text="Reset password"
          loadingText="Resetting..."
          isLoading={isLoading}
          disabled={isLoading}
        />

        <Field>
          <FieldDescription className="text-center">
            <Link
              to={`/login${returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : ''}`}
              className="underline underline-offset-4 hover:text-primary"
            >
              Return to sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
