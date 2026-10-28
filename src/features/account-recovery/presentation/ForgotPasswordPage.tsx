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
import { ForgotPasswordSchema } from '../domain/recovery.schema';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('return_to');

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = ForgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Invalid email address');
      return;
    }

    setIsLoading(true);
    try {
      await container.authService.forgotPassword(validation.data.email);
      const query = new URLSearchParams({ email: validation.data.email });
      if (returnTo) query.set('return_to', returnTo);
      navigate(`/reset-password?${query.toString()}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <FieldGroup>
        <AuthFormHeader
          title="Reset your password"
          subtitle="Enter your account email and we'll send you a password reset code"
        />

        {error && <AuthErrorBanner error={error} />}

        <AuthFieldWidget
          id="email"
          label="Email address"
          type="email"
          placeholder="ada@example.com"
          value={email}
          onChange={(val) => setEmail(val)}
          disabled={isLoading}
          required
        />

        <AuthButtonWidget
          text="Send reset code"
          loadingText="Sending code..."
          isLoading={isLoading}
          disabled={isLoading}
        />

        <Field>
          <FieldDescription className="text-center">
            Remember your password?{' '}
            <Link
              to={`/login${returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : ''}`}
              className="underline underline-offset-4 hover:text-primary"
            >
              Log in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
