# Auth Web — testing and delivery guidelines

**Planned CI gates.** Repo independent: npm scripts + GitHub Actions; no Turborepo/Nx.

- Unit tests: RedirectDestination VO, email/registration form schema, flow transitions, validation of non-secret error messages, null-org logic, cancel and timeout.
- Application tests: mock IdentityGateway/AuthorizationFlowPort; assert no auth claimed until signed IdP/BFF result. Test error, expired links, resend, race and MFA challenge.
- Contract tests: Java/IdP schema, OIDC client/callback, reset/verify/error structures, backwards compatibility.
- Component tests: responsive keyboard/screenreader flows, disabled/loading/invalid states, localized error copy.
- E2E: register individual without organization, verify email, login, creator redirect, create-org later, SSO across Atlas Web + Portal without password prompt where central IdP session exists, logout/revocation.
- Security E2E: open redirect, tampered callback/state/nonce, PKCE replay, XSS, CSRF, session fixation, malformed query, leaked secrets/tokens, cross-client audience mismatch.
- CI: lint, typecheck, unit/component/contract/e2e tests on preview with mock IdP; secret/dependency scanning, SCA; deploy only after human reviewed auth threat changes.
- Deployment: separate staging/prod registered IdP clients, allowlisted origins, secure cookies/TLS; rollback route compatibility and logout.
- Observability: redacted correlation IDs and failure reason categories; no raw credentials, full recovery tokens or biometric content in logs.

**Release gate:** Java/IdP must actually support central OIDC/BFF. UI cannot claim SSO just because form exists.
