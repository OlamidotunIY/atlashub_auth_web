import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { container } from '../../../app/composition/container';
import { Alert } from '../../../shared/presentation/components/Alert';
import { AuthButton } from '../../../shared/presentation/components/AuthButton';
import { AuthCard } from '../../../shared/presentation/components/AuthCard';
import { AuthInput } from '../../../shared/presentation/components/AuthInput';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const returnTo = searchParams.get('return_to');

  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the verification code sent to your email.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await container.authService.verifyEmail({ email, otp: otp.trim() });
      setSuccess('Email verified successfully! Redirecting to sign in...');
      setTimeout(() => {
        const query = new URLSearchParams({ email });
        if (returnTo) query.set('return_to', returnTo);
        navigate(`/login?${query.toString()}`);
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    setError(null);
    setSuccess(null);
    try {
      await container.authService.resendVerificationEmail(email);
      setSuccess('A fresh verification code was sent to your email.');
      setCooldown(60);
    } catch (err: any) {
      setError(err?.message || 'Failed to resend verification code. Please wait.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthCard
      title="Verify your email"
      subtitle={`We've sent a one-time verification code to ${email || 'your email address'}.`}
      footer={
        <div className="text-center">
          Wrong email address?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Register again
          </Link>
        </div>
      }
    >
      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        <AuthInput
          label="Verification Code"
          name="otp"
          placeholder="e.g. 123456"
          required
          autoFocus
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={isLoading}
        />

        <AuthButton type="submit" isLoading={isLoading} loadingText="Verifying...">
          Verify email
        </AuthButton>

        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-muted-foreground">Didn't receive the code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || isResending}
            className="text-primary font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isResending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
          </button>
        </div>
      </form>
    </AuthCard>
  );
}
