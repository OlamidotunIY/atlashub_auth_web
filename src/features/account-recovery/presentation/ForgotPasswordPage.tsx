import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { container } from '../../../app/composition/container';
import { Alert } from '../../../shared/presentation/components/Alert';
import { AuthButton } from '../../../shared/presentation/components/AuthButton';
import { AuthCard } from '../../../shared/presentation/components/AuthCard';
import { AuthInput } from '../../../shared/presentation/components/AuthInput';
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
    <AuthCard
      title="Reset your password"
      subtitle="Enter your account email and we'll send you a password reset code"
      footer={
        <div className="text-center">
          Remember your password?{' '}
          <Link
            to={`/login${returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : ''}`}
            className="text-primary font-semibold hover:underline"
          >
            Sign in
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <Alert type="error">{error}</Alert>}

        <AuthInput
          label="Email address"
          name="email"
          type="email"
          placeholder="ada@example.com"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <AuthButton type="submit" isLoading={isLoading} loadingText="Sending code...">
          Send reset code
        </AuthButton>
      </form>
    </AuthCard>
  );
}
