import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { container } from '../../../app/composition/container';
import { Alert } from '../../../shared/presentation/components/Alert';
import { AuthButton } from '../../../shared/presentation/components/AuthButton';
import { AuthCard } from '../../../shared/presentation/components/AuthCard';
import { AuthInput } from '../../../shared/presentation/components/AuthInput';

export function DeviceVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const returnTo = searchParams.get('return_to');

  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the device verification code sent to your email.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const fingerprint = container.tokenStorage.getDeviceFingerprint();
      await container.authService.verifyDevice({
        email,
        otp: otp.trim(),
        deviceFingerprint: fingerprint,
      });

      setSuccess('Device verified successfully! Please sign in.');
      setTimeout(() => {
        const query = new URLSearchParams({ email });
        if (returnTo) query.set('return_to', returnTo);
        navigate(`/login?${query.toString()}`);
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired device verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Verify new device"
      subtitle={`We noticed a login from an unrecognized device. A security code was sent to ${email || 'your email'}.`}
      footer={
        <div className="text-center">
          <Link
            to={`/login${returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : ''}`}
            className="text-primary font-semibold hover:underline"
          >
            Cancel and return to sign in
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        <AuthInput
          label="Device Authorization Code"
          name="otp"
          placeholder="e.g. 123456"
          required
          autoFocus
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={isLoading}
        />

        <AuthButton type="submit" isLoading={isLoading} loadingText="Verifying device...">
          Authorize device
        </AuthButton>
      </form>
    </AuthCard>
  );
}
