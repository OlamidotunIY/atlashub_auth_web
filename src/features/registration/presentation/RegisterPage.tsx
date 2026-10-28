import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { container } from '../../../app/composition/container';
import { Alert } from '../../../shared/presentation/components/Alert';
import { AuthButton } from '../../../shared/presentation/components/AuthButton';
import { AuthCard } from '../../../shared/presentation/components/AuthCard';
import { AuthInput } from '../../../shared/presentation/components/AuthInput';
import { AuthSelect } from '../../../shared/presentation/components/AuthSelect';
import {
  COUNTRY_OPTIONS,
  RegistrationSchema,
  type RegistrationFormValues,
} from '../domain/registration.schema';

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('return_to');

  const [formValues, setFormValues] = useState<RegistrationFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: 'NG',
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
      await container.authService.registerIndividual(validation.data);
      const query = new URLSearchParams();
      query.set('email', validation.data.email);
      if (returnTo) query.set('return_to', returnTo);
      navigate(`/verify-email?${query.toString()}`);
    } catch (err: any) {
      setServerError(err?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Register an individual AtlasHub account to access our commerce & business network"
      footer={
        <div className="text-center">
          Already have an account?{' '}
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
        {serverError && <Alert type="error">{serverError}</Alert>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AuthInput
            label="First Name"
            name="firstName"
            placeholder="Ada"
            required
            value={formValues.firstName}
            error={errors.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            disabled={isLoading}
          />
          <AuthInput
            label="Last Name"
            name="lastName"
            placeholder="Lovelace"
            required
            value={formValues.lastName}
            error={errors.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            disabled={isLoading}
          />
        </div>

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

        <AuthSelect
          label="Country of residence"
          name="country"
          required
          options={COUNTRY_OPTIONS}
          value={formValues.country}
          error={errors.country}
          onChange={(e) => handleChange('country', e.target.value)}
          disabled={isLoading}
        />

        <AuthInput
          label="Password"
          name="password"
          type="password"
          placeholder="At least 8 characters with 1 capital and 1 number"
          required
          value={formValues.password}
          error={errors.password}
          onChange={(e) => handleChange('password', e.target.value)}
          disabled={isLoading}
        />

        <AuthButton type="submit" isLoading={isLoading} loadingText="Creating account...">
          Create account
        </AuthButton>
      </form>
    </AuthCard>
  );
}
