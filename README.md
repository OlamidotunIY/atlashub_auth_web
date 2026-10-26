# Atlas Hub Auth Web — Shared Identity Frontend

**Status: documentation only.** Centralized React/Vite/TypeScript authentication UI for all Atlas Hub applications. Authentication **backend/authority remains** the Java `atlashub_backend` identity/authentication and IAM modules (or a standards-compliant identity provider integrated with them). This is **not** an authentication backend or credential database.

## Product decisions
- One user account, one centralized sign-in/registration UI for Atlas Web, Storefront Portal, Atlas Intelligence/mobile and future clients.
- **User registration creates only user identity and verification**, not an Organization, bank account, payment provider profile or KYB case.
- After registration, someone can create/join a business, register independently as a template developer, or use other authorized Atlas Hub capabilities. Creating a business is an explicitly separate authenticated workflow.
- Global identity signup must not be gated on Nigerian country codes, Anchor banking, KYB or merchant payment provider eligibility.
- Business storefront/payment capabilities require org membership/roles/permissions and activated provider connections where necessary; independent business creation and operations stay available without them.
- Redirect-based central SSO via **OIDC Authorization Code + PKCE** / secured BFF, with provider-managed identity sessions and separate application sessions. Browser identity UI alone **does not implement OIDC**.
- No bearer token in URL redirects, no cross-app localStorage copying, no merchant management credentials on untrusted storefront domains.
- Identity screens: login, register, email verification, recovery/reset, MFA/passkeys (when supported), consent and device/session management. Business onboarding, creator profiles, theme store and merchant integrations do **not** belong in Auth Web.

## Connected repositories

| Repository | Role |
|---|---|
| [atlashub_backend](https://github.com/OlamidotunIY/atlashub_backend) | Java authentication, IAM, user identity, organization separate creation, platform billing and public business APIs |
| [atlashub_auth_web](https://github.com/OlamidotunIY/atlashub_auth_web) | Shared Auth UI (this repo) |
| [atlashub_web](https://github.com/OlamidotunIY/atlashub_web) | Merchant operating dashboard, authenticated organization creation and provider setup |
| [atlashub_storefront_portal](https://github.com/OlamidotunIY/atlashub_storefront_portal) | Dedicated portal for merchant themes and independent creators |
| [atlashub_storefront](https://github.com/OlamidotunIY/atlashub_storefront) | Storefront management API, themed website hosting, builds and publishing |
| [atlashub_intelligence](https://github.com/OlamidotunIY/atlashub_intelligence) | Python AI, auth delegated by Java |

A separate [atlashub_theme_sdk](https://github.com/OlamidotunIY) repository for SDK, CLI, Vite scaffold and public contracts is **proposed, not yet verified as created**.

## Specification and scope
- [Login, registration, SSO, redirects, privacy and session contract](docs/architecture/identity-and-sso.md)
- [Implementation modules, route flows and test backlog](docs/modules/index.md)

No user registration flow, OIDC endpoint or login UI in this repository is yet implemented.


## Engineering architecture and source layout

Use **feature-oriented DDD + Clean Architecture + Hexagonal ports/adapters** for the identity UI. Domain policies and application use cases are framework-independent; React forms, navigation and Java/IdP HTTP are adapters. This repository contains no authentication server/credential database. CQRS is selective, not required for every form event.

- [Clean/Hexagonal architecture and allowed dependencies](docs/architecture/clean-hexagonal.md)
- [Proposed folder structure](docs/architecture/folder-structure.md)
- [Engineering/security rules](docs/guidelines/engineering-rules.md)
- [Testing and deployment requirements](docs/guidelines/testing-release.md)
- [Module-by-module implementation backlog](docs/modules/index.md)

No Turborepo/Nx. These are **design rules**; implementation, IdP-backed SSO and migrations remain pending.
