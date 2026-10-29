import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { container } from '../../../app/composition/container';
import { SafeRedirectTarget } from '../../../shared/domain/value-objects/redirect-target.vo';
import { AuthErrorBanner, AuthFormHeader } from '../../../shared/presentation/widgets';
import { Button, FieldGroup } from '../../../shared/ui';

export function ConsentPage() {
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('return_to');
  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri') || returnTo;
  const codeChallenge = searchParams.get('code_challenge');
  const codeChallengeMethod = searchParams.get('code_challenge_method') || 'S256';
  const state = searchParams.get('state') || undefined;
  const scope = searchParams.get('scope') || undefined;
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function handleHandoff() {
      // 1. If OAuth 2.0 PKCE flow is requested
      if (clientId && codeChallenge && redirectUri) {
        try {
          const authResult = await container.authService.authorizeOAuth({
            clientId,
            redirectUri,
            responseType: 'code',
            codeChallenge,
            codeChallengeMethod,
            state,
            scope,
            accessToken: accessToken || undefined,
          });

          if (!isCancelled) {
            window.location.href = authResult.redirectUri;
          }
          return;
        } catch (err: unknown) {
          if (!isCancelled) {
            const message = err instanceof Error ? err.message : 'Failed to authorize OAuth client.';
            setError(message);
          }
          return;
        }
      }

      // 2. Direct return_to handoff fallback
      if (returnTo) {
        const validatedUrl = new SafeRedirectTarget(returnTo).url;
        const url = new URL(validatedUrl);

        if (accessToken) url.searchParams.set('token', accessToken);
        if (refreshToken) url.searchParams.set('refresh_token', refreshToken);

        if (url.hash) {
          const [hashPath, hashQuery] = url.hash.split('?');
          const hashParams = new URLSearchParams(hashQuery || '');
          if (accessToken) hashParams.set('token', accessToken);
          if (refreshToken) hashParams.set('refresh_token', refreshToken);
          url.hash = `${hashPath}?${hashParams.toString()}`;
        }

        const timer = setTimeout(() => {
          if (!isCancelled) {
            window.location.href = url.toString();
          }
        }, 800);

        return () => clearTimeout(timer);
      }
    }

    void handleHandoff();

    return () => {
      isCancelled = true;
    };
  }, [returnTo, clientId, redirectUri, codeChallenge, codeChallengeMethod, state, scope, accessToken, refreshToken]);

  const targetOrigin = redirectUri
    ? new URL(new SafeRedirectTarget(redirectUri).url).origin
    : returnTo
      ? new URL(new SafeRedirectTarget(returnTo).url).origin
      : 'application';

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto text-center">
      <FieldGroup>
        <AuthFormHeader
          title="Authorizing Access"
          subtitle="Connecting your AtlasHub identity to the application..."
        />

        <AuthErrorBanner error={error} />

        {error ? (
          <div className="pt-4">
            <Button
              onClick={() => {
                const query = new URLSearchParams(searchParams);
                window.location.href = `/login?${query.toString()}`;
              }}
            >
              Return to Login
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="h-10 w-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-muted-foreground">Redirecting to {targetOrigin}...</p>
          </div>
        )}
      </FieldGroup>
    </div>
  );
}
