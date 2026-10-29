import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { container } from '../../../app/composition/container';
import { getDeviceFingerprint } from '../../../shared/lib/utils';
import { SafeRedirectTarget } from '../../../shared/domain/value-objects/redirect-target.vo';
import {
  AuthButtonWidget,
  AuthErrorBanner,
  AuthFieldWidget,
  AuthFormHeader,
} from '../../../shared/presentation/widgets';
import { Field, FieldDescription, FieldGroup } from '../../../shared/ui';
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
      const fingerprint = getDeviceFingerprint();
      const result = await container.authService.login({
        email: validation.data.email,
        password: validation.data.password,
        deviceFingerprint: fingerprint,
      });

      const forwardParams = new URLSearchParams(searchParams);
      forwardParams.set('email', validation.data.email);

      if (result.status === 'EMAIL_VERIFICATION_REQUIRED') {
        navigate(`/verify-email?${forwardParams.toString()}`);
        return;
      }

      if (result.status === 'DEVICE_VERIFICATION_REQUIRED') {
        navigate(`/mfa?${forwardParams.toString()}`);
        return;
      }

      const clientId = searchParams.get('client_id');
      const redirectUri = searchParams.get('redirect_uri');
      const codeChallenge = searchParams.get('code_challenge');
      const codeChallengeMethod = searchParams.get('code_challenge_method');
      const state = searchParams.get('state');
      const scope = searchParams.get('scope');

      if ((returnTo || clientId) && result.tokens) {
        const handoffParams = new URLSearchParams({
          access_token: result.tokens.accessToken,
          refresh_token: result.tokens.refreshToken,
        });
        if (returnTo) handoffParams.set('return_to', new SafeRedirectTarget(returnTo).url);
        if (clientId) handoffParams.set('client_id', clientId);
        if (redirectUri) handoffParams.set('redirect_uri', redirectUri);
        if (codeChallenge) handoffParams.set('code_challenge', codeChallenge);
        if (codeChallengeMethod) handoffParams.set('code_challenge_method', codeChallengeMethod);
        if (state) handoffParams.set('state', state);
        if (scope) handoffParams.set('scope', scope);

        navigate(`/consent?${handoffParams.toString()}`);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <FieldGroup>
        <AuthFormHeader
          title="Login to your account"
          subtitle="Enter your email below to login to your account"
        />

        {serverError && <AuthErrorBanner error={serverError} />}

        <AuthFieldWidget
          id="email"
          label="Email"
          type="email"
          placeholder="m@example.com"
          value={formValues.email}
          onChange={(val) => handleChange('email', val)}
          errors={errors.email ? [errors.email] : undefined}
          disabled={isLoading}
          required
        />

        <AuthFieldWidget
          id="password"
          label="Password"
          type="password"
          value={formValues.password}
          onChange={(val) => handleChange('password', val)}
          errors={errors.password ? [errors.password] : undefined}
          disabled={isLoading}
          required
          labelAction={
            <Link
              to={`/forgot-password${returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : ''}`}
              className="text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          }
        />

        <AuthButtonWidget
          text="Login"
          loadingText="Logging in..."
          isLoading={isLoading}
          disabled={isLoading}
        />

        <Field>
          <FieldDescription className="text-center">
            Don't have an account?{' '}
            <Link
              to={`/register${returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : ''}`}
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
