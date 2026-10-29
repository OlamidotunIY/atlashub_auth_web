import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { container } from '../../../app/composition/container';
import {
  AuthButtonWidget,
  AuthErrorBanner,
  AuthFieldWidget,
  AuthFormHeader,
  AuthSelectWidget,
} from '../../../shared/presentation/widgets';
import { Field, FieldDescription, FieldGroup } from '../../../shared/ui';
import { RegistrationSchema, type RegistrationFormValues } from '../domain/registration.schema';

const COUNTRY_OPTIONS = [
  { value: 'NG', label: 'Nigeria (NG)' },
  { value: 'GH', label: 'Ghana (GH)' },
  { value: 'KE', label: 'Kenya (KE)' },
  { value: 'ZA', label: 'South Africa (ZA)' },
  { value: 'US', label: 'United States (US)' },
  { value: 'GB', label: 'United Kingdom (GB)' },
  { value: 'CA', label: 'Canada (CA)' },
];

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('return_to');

  const [formValues, setFormValues] = useState<RegistrationFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    country: 'NG',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationFormValues, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof RegistrationFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validation = RegistrationSchema.safeParse(formValues);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof RegistrationFormValues, string>> = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as keyof RegistrationFormValues;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await container.authService.registerIndividual({
        firstName: validation.data.firstName.trim(),
        lastName: validation.data.lastName.trim(),
        email: validation.data.email.trim(),
        country: validation.data.country,
        password: validation.data.password,
      });

      const forwardParams = new URLSearchParams(searchParams);
      forwardParams.set('email', validation.data.email);
      navigate(`/verify-email?${forwardParams.toString()}`);
    } catch (err: any) {
      setServerError(err?.message || 'Failed to create your account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-lg mx-auto">
      <FieldGroup className="gap-y-5">
        <AuthFormHeader
          title="Create an account"
          subtitle="Enter your details below to get started"
        />

        {serverError && <AuthErrorBanner error={serverError} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AuthFieldWidget
            id="firstName"
            label="First Name"
            placeholder="Ada"
            value={formValues.firstName}
            onChange={(val) => handleChange('firstName', val)}
            errors={errors.firstName ? [errors.firstName] : undefined}
            disabled={isLoading}
            required
          />

          <AuthFieldWidget
            id="lastName"
            label="Last Name"
            placeholder="Lovelace"
            value={formValues.lastName}
            onChange={(val) => handleChange('lastName', val)}
            errors={errors.lastName ? [errors.lastName] : undefined}
            disabled={isLoading}
            required
          />
        </div>

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

        <AuthSelectWidget
          id="country"
          label="Country"
          placeholder="Select country"
          value={formValues.country}
          onChange={(val) => handleChange('country', val)}
          errors={errors.country ? [errors.country] : undefined}
          options={COUNTRY_OPTIONS}
          disabled={isLoading}
          required
        />

        <AuthFieldWidget
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formValues.password}
          onChange={(val) => handleChange('password', val)}
          errors={errors.password ? [errors.password] : undefined}
          disabled={isLoading}
          required
        />

        <AuthButtonWidget
          text="Create account"
          loadingText="Creating account..."
          isLoading={isLoading}
          disabled={isLoading}
        />

        <Field>
          <FieldDescription className="text-center mt-2">
            Already have an account?{' '}
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
