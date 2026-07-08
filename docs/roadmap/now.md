# Roadmap Now

Last updated: 2026-07-08

## Goal

Establish a fully local, login-free Expo app foundation that can keep development moving without prematurely committing to hosted sync, auth, marketplace, or native shell complexity. Now-lane work also covers the local contracts and foundations the long-term vision needs early ([product-vision.md](../product-vision.md), ADR-0060).

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
- Local asynchronous play loop built on the campaign event ledger: play-by-post threads, turn submission, and pending-action resolution, fully local (Epic 6, ADR-0062).
- Standalone tool packaging and embedding foundation: enforced headless module boundaries and packageable tool surfaces so sheets, dice, and later maps can run standalone or embed in external VTTs (Epic 7).
- Rules-as-data and compendium contract definition: schemas for structured rules, compendium content, source corpus, and licensing metadata — contracts only, no ingestion or rules engine (Epic 8, ADR-0064).
- Dice roll resolution provenance so manual physical-dice entry is a first-class, validated resolution source (ADR-0063).

## Exit Criteria

- PRD, architecture, UX, epics, stories, sprint status, and ADR references agree on the same local-first baseline.
- A user can open the app without login and perform useful creator or sheet work locally.
- TinyBase persistence is covered by tests and does not depend on hosted services.
- Account/auth scaffolding does not gate any now-roadmap feature.
- The event ledger contract satisfies ADR-0062 (deterministic replay, actor attribution, channel visibility) before async play UX ships.
- Rules/compendium contracts exist and are export/import covered before Next-lane ingestion work begins.
