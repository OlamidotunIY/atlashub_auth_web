# Auth Web — DDD, Clean Architecture and Hexagonal Architecture

**Normative target design.** This repo is only the **shared identity user interface**. It is **not** a credentials database, OAuth authorization server or independent auth backend. Java Atlas Hub identity/IdP remains identity authority. No auth web application code implemented yet.

## Architectural boundaries
- **Domain:** UI-facing identity concepts and pure policies: `AuthenticationJourney`, `RegistrationIntent`, `RecoveryFlow`, `MfaChallenge`, `RedirectDestination`, `UserOnboardingChoice`. Domain must NOT store password hashes, create auth tokens, verify MFA cryptography, check global organization rights, or import React/network packages.
- **Application:** use cases `StartLogin`, `RegisterIndividual`, `RequestEmailVerification`, `CompleteEmailVerification`, `InitiateRecovery`, `CompleteRecovery`, `BeginMfaEnrollment`, `AuthorizeReturnToClient`, `Logout`, `GetSessionView`. Depend on ports, manage UX state, never claim credentials validated before IdP response.
- **Ports:** `IdentityGateway`, `AuthorizationFlowPort`, `RedirectPolicyPort`, `ClockPort`, `SessionViewPort`, `TelemetryPort`. Auth flow state/nonce/PKCE must follow standards, be validated in IdP/BFF, not invented by a form.
- **Infrastructure adapters:** HTTP/IdP client, secure BFF interaction, redirect navigation, environment configuration, telemetry, browser-specific APIs. Convert external errors into stable application errors; never leak token payloads to UI.
- **Presentation:** React pages/forms/router, accessible labels, error/loading UI and localized copy; calls application use cases/hooks. Presentation may import application types, not infrastructure implementation details except composition root.
- **Composition:** create adapters and wire ports in `src/app/composition` or equivalent. Dependencies flow Presentation/Infrastructure → Application → Domain.

## Independent global User registration
Creating a global `User` with email verification is **not** creating an Organization. Zero-organization accounts are allowed. Organization creation, merchant KYB/provider connections, CreatorProfile, licensing and billing happen in their respective applications. No compulsory Anchor bank/KYB is permitted in identity signup. Provider-specific onboarding may apply later to payment operations, not basic registration.

## Shared sign-in/SSO
This UI can be hosted at a central auth origin. Atlas Web, Storefront Portal, mobile/AI clients use registered OIDC or appropriate secure BFF flows with IdP session to avoid repeated passwords. Login UI alone is not SSO. Independent clients own app-specific sessions; OAuth Authorization Code + PKCE, validated state/nonce, exact registered redirect URIs and logout propagation handled by IdP/BFF. Never use query-string bearer tokens or cross-origin `localStorage` copies.

## DDD/CQRS boundaries
UI auth screens are not a financial business domain. Use DDD vocabulary for pure state machines and use cases; **do not** introduce full command/event buses for every input field, form submit or HTTP request. Separation of read-only session view from actions is sufficient CQRS where beneficial.

## Cross-repository contracts
This frontend consumes Java/IdP identity contracts and exposes no private DB. Atlas Web/Storefront Portal must not import its source components; they redirect to central UI. Version externally visible auth routes and errors deliberately; document client registration/recovery flows and backwards-compatible redirects.

See [folder structure](folder-structure.md), [rules](../guidelines/engineering-rules.md), and [test plan](../guidelines/testing-release.md).
