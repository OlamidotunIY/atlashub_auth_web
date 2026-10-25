# Central identity UI, registration and SSO

**Status:** Target spec; Java auth/IdP must be upgraded/integrated before SSO works. Frontend must not implement token issuance/verify or store passwords.

## Workflow: register a person (not an organization)

1. Open central registration UI, collect minimum identity fields (email, name/locale, password or passkey where supported), consent/terms applicable to **user** identity. Do **not** require organization name, industry, Nigerian registration type, Anchor banking/KYB data, merchant provider choice.
2. Java Identity creates unique global `User` and `AuthAccount` in a transaction or coordinated idempotent flow; email verification token sent. Handle duplicate identities and replayed tokens safely.
3. User verifies email and signs in. A user with zero organizations is a **first-class valid state**. Active organization field can be null; organization selection not required for base identity/profile or creator onboarding.
4. The app that initiated registration selects continuation: Atlas Web -> create or join organization; Storefront Portal -> creator profile/marketplace; other apps -> their own onboarding. Avoid hidden forced organization creation.
5. Creating organization is an explicit IAM-protected backend command, with OWNER membership, optional entitlements, and no mandatory bank account/KYB/provisioning; invited users may join an existing org.
6. Log out and account recovery invalidate/revoke appropriate sessions. Separate global logout from portal session logout policy.

## Login/SSO architecture
- Central Atlas Hub Java identity or integrated production-grade OIDC IdP owns credentials, sessions, tokens, MFA, passkeys, authorization server and consent/security policies.
- Auth Web supplies UI for auth challenges, enrollment and self-service identity only. Recommended OAuth/OIDC Authorization Code+PKCE with BFF where feasible; central IdP login session can support seamless redirects to all frontends.
- Each Atlas Web/Portal/mobile client has registered client ID, redirect URL allowlist and app-specific session. No implicit grant, no bearer token in redirect URI, no shared localStorage/cookie across unrelated domains, no universal client-secret in SPA.
- Anti-CSRF state, nonce, PKCE verifier, token audience/scopes, issuer/keys/rotation and logout revocation must be enforced on server side; never trust route query to authenticate.
- Organization/creator roles are **authorization** governed by Java IAM + storefront creator policies, not attributes that create a new account/password.
- Business compliance/provider onboarding is a capability-specific workflow in Integration UI/provider; it is not identity verification prerequisite.

## Routes (illustrative)
`/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password`, `/mfa`, `/passkeys`, `/sessions`, `/authorize/consent` where applicable; exact authorize endpoints belong to IdP backend, not arbitrary SPA routes.

## Data/security
Rate limiting, generic forgot-password responses, password hashing/MFA in backend, email proof, verified origin/redirect, session rotation, recovery and audit; never log raw secrets or biometrics. Keep identity data retention and breach response policies separate from merchant/provider compliance. Test region/locale independent of provider coverage.

## Migration from Atlas Web
Existing Atlas Web login and registration screens redirect to central auth UI after new SSO is operational; preserve auth guards, per-app session and organization selector. Keep old path compatibility until migration complete; no sudden cutover breaking current users.

## Acceptance
- Identity registered and verified without organization/KYB.
- Same identity signs into business dashboard and independent creator portal through real SSO, but each verifies own session.
- Creator requires no business; merchant can create/join multiple orgs; role switch cannot leak data.
- No direct access to org-owned resources when no org selected.
- Revoked session/disabled account respected by all clients.
- Security testing includes open redirect, CSRF, PKCE, replay, fixation, cross-client token substitution and org spoofing.
