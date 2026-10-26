# Auth Web — engineering and security rules

**Mandatory policy for future code; no code yet.**

## Framework and code
React + Vite + TypeScript strict mode, React Router, accessible forms. Prefer Zod/typed API schemas for untrusted responses with versioned Java/IdP contracts. Feature folders with inward dependencies. Disallow circular imports and application reliance on UI/framework implementation. No unnecessary global state for independent auth form state.

## Security
- Java/IdP alone validates identity, passwords, email, MFA/passkeys, sessions and token issuance; Auth Web does not generate trusted user claims.
- Code+PKCE/BFF authorization standard, state/nonce, redirect URI allowlist, strict callback origins, secure cookies/session storage, CSRF protection at appropriate layers.
- Never pass bearer tokens in URL parameters/fragment, never copy session from another app's localStorage, never embed client secrets in a Vite bundle, never log raw passwords/MFA codes/recovery tokens.
- Password reset must prevent user enumeration in public response and rate-limit on server; avoid silently accepting invalid/expired verification tokens.
- Untrusted return-to URLs must not enable open redirect. Client IDs/redirects registered by identity server.
- Register individual User **without Organization/KYB/provider**, allow no-org user to sign in and continue to creator/merchant onboarding later.
- Sensitive identity changes require strong reauthentication, revocation and user notification.
- Frontend may have public env config, but no secret material in `VITE_*` variables.
- Accessible fallback for passkey/MFA, sessions invalidated on identity suspension/logout as specified by IdP.

## Error, resilience and UI
Every auth call has pending/error/success UI driven by actual server response, cancellation on unmount, sanitized messages. No fake success screens before verification. International registration and locale support should not infer payment-provider availability.

## Review checklist
Architecture dependency, server authority, auth threat assessment, screenshot-free PII logs, a11y and keyboard flow, consent/data retention impact, API schema compatibility and tests; update docs/modules for every new feature.
