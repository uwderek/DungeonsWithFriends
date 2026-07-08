# Roadmap Now

Last updated: 2026-07-07

## Goal

Establish a fully local, login-free Expo app foundation that can keep development moving without prematurely committing to hosted sync, auth, marketplace, or native shell complexity.

## Binding Decisions

- Expo and React Native remain the primary UI/app framework.
- Gluestack plus Tailwind/NativeWind remain the primary component and styling framework.
- Behavior should stay headless where practical through TypeScript state, schema, hook, and domain modules.
- TinyBase is the local-first store for now.
- No login, account creation, WorkOS, Cloudflare, Neon/Postgres, or hosted sync is required for now-roadmap features.
- Product code should remain TypeScript-first and avoid Python.

## Now Features

- Documentation repair and BMAD rebaseline.
- Login-free app entry and local-mode navigation.
- TinyBase local store contracts for creator data, playable sheet data, migrations, export, and import.
- Creator workspace continuation from the current Story 1.1 shell.
- System template selection and custom JSON binding.
- Component registry, binding contracts, and headless validation.
- Local save/load/preview flows with co-located tests.

## Exit Criteria

- PRD, architecture, UX, epics, stories, sprint status, and ADR references agree on the same local-first baseline.
- A user can open the app without login and perform useful creator or sheet work locally.
- TinyBase persistence is covered by tests and does not depend on hosted services.
- Account/auth scaffolding does not gate any now-roadmap feature.
