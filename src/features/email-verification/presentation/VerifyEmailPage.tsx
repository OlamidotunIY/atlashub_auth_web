import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import { container } from '../../../app/composition/container';
import {
  Button,
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '../../../shared/ui';
import {
  AuthFormHeader,
  AuthErrorBanner,
} from '../../../shared/presentation/widgets';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const returnTo = searchParams.get('return_to');

  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (!email || isResending || countdown > 0) return;
    setIsResending(true);
    setError(null);
    try {
      await container.authService.resendVerificationEmail(email);
      setCountdown(60);
      setSuccessMessage(`We've sent a new 6-digit verification code to ${email}.`);
    } catch (err: any) {
      setError(err?.message || 'Could not resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || code.length < 6 || isVerifying) return;

    setIsVerifying(true);
    setError(null);
    try {
      await container.authService.verifyEmail({ email, otp: code });
      const query = new URLSearchParams(searchParams);
      query.set('email', email);
      navigate(`/login?${query.toString()}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to verify email. Please check the code and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      <FieldGroup>
        <AuthFormHeader
          title="Verify your email"
          subtitle={`We sent a 6-digit code to ${email}`}
        />

        {error && <AuthErrorBanner error={error} />}
        {successMessage && (
          <div className="bg-primary/10 text-primary text-sm p-3 rounded-md text-center">
            {successMessage}
          </div>
        )}

        <Field className="items-center w-full">
          <FieldLabel htmlFor="code" className="sr-only">
            Verification Code
          </FieldLabel>
          <div className="flex w-full justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(val: string) => setCode(val)}
              disabled={isVerifying}
            >
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-2" />
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-2" />
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </Field>

        <Field>
          <Button type="submit" disabled={code.length < 6 || isVerifying}>
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center mt-2">
            Didn't receive a code?{' '}
            <button
              type="button"
              disabled={isResending || countdown > 0}
              className="underline underline-offset-4 hover:text-primary font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
              onClick={handleResend}
            >
              {isResending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend'}
            </button>
          </FieldDescription>
          <FieldDescription className="text-center mt-1">
            <button
              type="button"
              className="underline underline-offset-4 hover:text-primary text-xs"
              onClick={() => {
                const query = returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : '';
                navigate(`/login${query}`);
              }}
            >
              Back to login
            </button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
