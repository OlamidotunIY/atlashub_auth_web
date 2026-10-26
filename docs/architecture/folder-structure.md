# Auth Web — proposed folder structure and import rules

**Blueprint only; app not created.** Standalone React + Vite + TypeScript project, **no monorepo or Turborepo/Nx**.

```text
atlashub_auth_web/
├── docs/
│   ├── architecture/
│   ├── modules/
│   └── guidelines/
├── src/
│   ├── app/
│   │   ├── bootstrap/               # providers, entry point
│   │   ├── router/                  # central login/recovery/consent routes
│   │   ├── composition/             # inject gateway implementations
│   │   └── styles/
│   ├── shared/
│   │   ├── domain/                  # e.g. safe redirect target VO
│   │   ├── application/             # common error/result/policy abstractions
│   │   ├── infrastructure/          # HTTP client, runtime config, telemetry
│   │   └── presentation/            # buttons, input, layouts, a11y primitives
│   └── features/
│       ├── registration/
│       │   ├── domain/              # journey/rules, no React imports
│       │   ├── application/         # ports + RegisterIndividual use case
│       │   ├── infrastructure/      # Java/IdP adapters
│       │   └── presentation/        # page/form/hook
│       ├── login/
│       ├── email-verification/
│       ├── account-recovery/
│       ├── mfa-passkeys/
│       ├── sessions/
│       └── authorization-consent/
├── tests/
│   ├── contract/
│   ├── e2e/
│   └── security/
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Import direction
- Domain imports no React, router, network, browser APIs or application code. Pure typed policies/value objects.
- Application imports domain and ports (defined inward); never JSX or fetch implementation.
- Infrastructure imports inward interfaces and implements adapters. Presentation calls application use cases/view-model hooks.
- `app/composition` instantiates actual adapters. Features must not import other features' infrastructure or presentation directly; share public application ports or shared contracts.
- Keep React components lean, pages compose flows, state machines/use cases decide navigation conditions; server always determines real auth success.
- No duplicate `LoginService` in Atlas Web or Storefront Portal; those frontends need guards/SSO redirect handling only.

## Suggested routes
`/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password`, `/mfa`, `/passkeys`, `/sessions`, optional `/consent`. Precise routes and callback scheme require IdP integration decision.
