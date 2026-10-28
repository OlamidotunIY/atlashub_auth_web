import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { container } from '../../../app/composition/container';
import { SafeRedirectTarget } from '../../../shared/domain/value-objects/redirect-target.vo';
import { Alert } from '../../../shared/presentation/components/Alert';
import { AuthButton } from '../../../shared/presentation/components/AuthButton';
import { AuthCard } from '../../../shared/presentation/components/AuthCard';
import { AuthInput } from '../../../shared/presentation/components/AuthInput';
import { LoginSchema, type LoginFormValues } from '../domain/login.schema';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('return_to');

  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: searchParams.get('email') || '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof LoginFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validation = LoginSchema.safeParse(formValues);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof LoginFormValues, string>> = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as keyof LoginFormValues;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const fingerprint = container.tokenStorage.getDeviceFingerprint();
      const result = await container.authService.login({
        email: validation.data.email,
        password: validation.data.password,
        deviceFingerprint: fingerprint,
      });

      if (result.status === 'EMAIL_VERIFICATION_REQUIRED') {
        const query = new URLSearchParams({ email: validation.data.email });
        if (returnTo) query.set('return_to', returnTo);
        navigate(`/verify-email?${query.toString()}`);
        return;
      }

      if (result.status === 'DEVICE_VERIFICATION_REQUIRED') {
        const query = new URLSearchParams({ email: validation.data.email });
        if (returnTo) query.set('return_to', returnTo);
        navigate(`/mfa?${query.toString()}`);
        return;
      }

      // User is fully authenticated
      if (returnTo && result.tokens) {
        const target = new SafeRedirectTarget(returnTo).url;
        // Direct the user to the consent/handoff page to complete seamless transition to target app
        const handoffParams = new URLSearchParams({
          return_to: target,
          access_token: result.tokens.accessToken,
          refresh_token: result.tokens.refreshToken,
        });
        window.location.href = `/consent?${handoffParams.toString()}`;
        return;
      }

      navigate('/sessions');
    } catch (err: any) {
      setServerError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your AtlasHub account to access your workspace"
      footer={
        <div className="text-center">
          Don't have an account yet?{' '}
          <Link
            to={`/register${returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : ''}`}
            className="text-primary font-semibold hover:underline"
          >
            Create one
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {serverError && <Alert type="error">{serverError}</Alert>}

        <AuthInput
          label="Email address"
          name="email"
          type="email"
          placeholder="ada@example.com"
          required
          value={formValues.email}
          error={errors.email}
          onChange={(e) => handleChange('email', e.target.value)}
          disabled={isLoading}
        />

        <div className="flex flex-col gap-1">
          <AuthInput
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            value={formValues.password}
            error={errors.password}
            onChange={(e) => handleChange('password', e.target.value)}
            disabled={isLoading}
          />
          <div className="text-right">
            <Link
              to={`/forgot-password${returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : ''}`}
              className="text-xs text-primary font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <AuthButton type="submit" isLoading={isLoading} loadingText="Signing in...">
          Sign in
        </AuthButton>
      </form>
    </AuthCard>
  );
}
