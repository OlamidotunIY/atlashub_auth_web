import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SafeRedirectTarget } from '../../../shared/domain/value-objects/redirect-target.vo';
import { AuthCard } from '../../../shared/presentation/components/AuthCard';

export function ConsentPage() {
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('return_to');
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  useEffect(() => {
    if (!returnTo) return;

    const validatedUrl = new SafeRedirectTarget(returnTo).url;
    const url = new URL(validatedUrl);

    // Attach tokens via hash fragment or query callback depending on receiver format
    if (accessToken) url.searchParams.set('token', accessToken);
    if (refreshToken) url.searchParams.set('refresh_token', refreshToken);

    const timer = setTimeout(() => {
      window.location.href = url.toString();
    }, 800);

    return () => clearTimeout(timer);
  }, [returnTo, accessToken, refreshToken]);

  return (
    <AuthCard
      title="Authorizing Access"
      subtitle="Connecting your AtlasHub identity to the application..."
    >
      <div className="flex flex-col items-center justify-center py-6 gap-3 text-center">
        <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground">
          Redirecting to {returnTo ? new URL(returnTo).origin : 'application'}...
        </p>
      </div>
    </AuthCard>
  );
}
