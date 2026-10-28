import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { container } from '../../../app/composition/container';
import { Alert } from '../../../shared/presentation/components/Alert';
import { AuthButton } from '../../../shared/presentation/components/AuthButton';
import { AuthCard } from '../../../shared/presentation/components/AuthCard';
import { AuthInput } from '../../../shared/presentation/components/AuthInput';
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
    <AuthCard
      title="Create new password"
      subtitle={`Enter the reset code sent to ${email} along with your new password.`}
      footer={
        <div className="text-center">
          <Link
            to={`/login${returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : ''}`}
            className="text-primary font-semibold hover:underline"
          >
            Return to sign in
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        <AuthInput
          label="Reset Code"
          name="otp"
          placeholder="e.g. 123456"
          required
          autoFocus
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={isLoading}
        />

        <AuthInput
          label="New Password"
          name="newPassword"
          type="password"
          placeholder="At least 8 characters with 1 capital and 1 number"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isLoading}
        />

        <AuthButton type="submit" isLoading={isLoading} loadingText="Resetting...">
          Reset password
        </AuthButton>
      </form>
    </AuthCard>
  );
}
