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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <FieldGroup>
        <AuthFormHeader
          title="Verify new device"
          subtitle={`We noticed a login from an unrecognized device. A security code was sent to ${email || 'your email'}.`}
        />

        {error && <AuthErrorBanner error={error} />}
        {success && (
          <div className="bg-primary/10 text-primary text-sm p-3 rounded-md text-center">
            {success}
          </div>
        )}

        <AuthFieldWidget
          id="otp"
          label="Device Authorization Code"
          placeholder="e.g. 123456"
          value={otp}
          onChange={(val) => setOtp(val)}
          disabled={isLoading}
          required
        />

        <AuthButtonWidget
          text="Authorize device"
          loadingText="Verifying device..."
          isLoading={isLoading}
          disabled={isLoading}
        />

        <Field>
          <FieldDescription className="text-center">
            <Link
              to={`/login${returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : ''}`}
              className="underline underline-offset-4 hover:text-primary"
            >
              Cancel and return to sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
