# Auth Web implementation modules (frontend only)

**Status:** Planned. No live application code created here yet. Independent repo with React+Vite+TypeScript. No Turborepo/Nx.

| Feature module | Scope | Acceptance |
|---|---|---|
| Identity UI shell | Accessible responsive layout, language/locale, common error state | Keyboard/screen-reader, no secret exposure |
| Registration | Individual user creation only, terms, email verify | Zero-org valid; no business KYB fields |
| Login and authorization UI | IdP-hosted sign-in and redirect support | Proper code+PKCE state and return URL validation |
| Verification and account recovery | Resend verify, recover/reset, expiry, anti-enumeration | Rate limits backend enforced and replay denial |
| MFA/passkey screens | Enrollment, challenges, recovery | Backend/IdP verifies factors; accessible fallback |
| Session and device management | Active sessions, logout/revoke, safe redirects | Session revocation across clients |
| App handoff | Allowlisted Atlas Web/Portal/AI/mobile redirect | No tokens in query/hash, verified redirect origins |
| API contracts | Java auth/IdP typed frontend clients | No local duplicate credential database |

## Phase order
1. Specify IdP/Java server authority, client registration and token/session scheme.
2. Build standalone screens with mocks, shared UI and SDK contracts.
3. Implement independent user signup with null organization; server migrations/events and email verification.
4. Implement real centralized OIDC/BFF and secure redirects for two browser clients.
5. Convert Atlas Web and Storefront Portal login entry points to central auth.
6. Add MFA/passkeys, revocation, session/device/account recovery and exhaustive threat tests.

No independent business legal/KYC flow, provider setup or organization creation forms belong in this repo; those live in the business app and specific provider integrations.
