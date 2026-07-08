---
adrId: ADR-0059
shortName: dwf-platform-baseline
status: accepted
date: 2026-07-07
tags: [architecture, platform, expo, gluestack, tailwind, tinybase, typescript, tauri, cloudflare, workos, neon]
---

# DWF Platform Baseline: Expo UI, TinyBase Local-First, Tauri Boundaries, Later Cloud/Auth

## Status

Accepted for DungeonsWithFriends planning as of 2026-07-07. Corrected on 2026-07-07 after user clarification.

## Context

The March 2026 planning artifacts selected Expo/React Native, Gluestack/NativeWind, and TinyBase, but also included premature Nhost/auth/cloud-sync assumptions. The project direction is now clarified:

- Product code should avoid Python.
- Expo remains the primary UI/app framework.
- Gluestack/Tailwind remain the primary component/styling framework, with behavior kept headless where practical.
- TinyBase remains the local-first store.
- Start fully local with no login.
- Tauri is used only where a downloaded app needs OS-specific functionality or where server/local process wrappers are needed.
- Later server sync targets Postgres stores on Neon.
- Later hosting targets Cloudflare where hosted app/server surfaces are needed.
- Later authentication targets WorkOS.

Official current platform docs remain useful for later work: Cloudflare Workers document TypeScript as a first-class language, Durable Objects are positioned for coordinated stateful applications, WorkOS AuthKit provides hosted authentication flows, and Tauri uses web frontends with a Rust application core.

References checked on 2026-07-07:

- Cloudflare Workers TypeScript: https://developers.cloudflare.com/workers/languages/typescript/
- Cloudflare Durable Objects: https://developers.cloudflare.com/durable-objects/
- WorkOS AuthKit: https://workos.com/docs/authkit
- Tauri start documentation: https://v2.tauri.app/start/

## Decision

DungeonsWithFriends adopts the following platform baseline:

1. Expo/React Native is the primary UI and app framework for now.
2. Gluestack plus Tailwind/NativeWind is the primary component and styling framework.
3. Shared UI behavior should stay headless where practical: state machines, hooks, schemas, and domain logic are separated from presentation skins.
4. TinyBase is the local-first product store now. Initial development is fully local and must not require login.
5. TypeScript is the default implementation language for UI, domain contracts, tests, build tooling, and later hosted/server code.
6. Tauri/Rust is a boundary tool, not the primary UI framework: use it for OS-specific downloaded-app functionality or server/local process wrappers when Expo cannot own the concern safely.
7. Nhost is no longer a target architecture decision.
8. Neon/Postgres is the planned later server persistence target for synced data.
9. Cloudflare is the planned later hosting/platform target for hosted app/server surfaces.
10. WorkOS is the planned later auth target. Auth and login are roadmap-later, not current MVP work.
11. Python is not allowed for product implementation. Existing `_bmad/scripts/*.py` files are BMAD framework helper tooling and are not product code; replacing them is a separate tooling decision.

## Consequences

- The PRD, architecture, epics, UX spec, sprint status, and prepared stories must be re-evaluated before further implementation.
- Current Expo/Gluestack/Tailwind/TinyBase code is aligned with the near-term local-first direction where it remains headless, tested, and free of premature auth/cloud coupling.
- Existing Nhost/auth/login scaffolding is legacy or future-placeholder work and should not be required by now-roadmap features.
- Cloudflare, WorkOS, Neon/Postgres, and Tauri details must stay behind ports/adapters when introduced later.
- Story 1.1 can remain in review, but following stories should be re-baselined around local-only TinyBase and login-free UX before adding sync/auth/server scope.

## Alternatives Considered

- Replace Expo with Tauri as the primary UI: rejected. Expo remains primary UI; Tauri is only for OS-specific downloaded-app or local/server process needs.
- Move local storage away from TinyBase immediately: rejected. TinyBase remains the local-first store and later sync substrate.
- Keep Nhost for auth/sync: rejected. Auth is later WorkOS; server sync is later Neon/Postgres behind ports.
- Add login now: rejected. The now roadmap is fully local and login-free.
- Keep a central imported-ADR register instead of cleaning the ADR files: rejected. Each imported ADR now carries its own DungeonsWithFriends front matter and application section.

## Applied To

- `_bmad-output/planning-artifacts/sprint-change-proposal-2026-07-07.md`
- `_bmad-output/planning-artifacts/architecture-realignment-2026-07-07.md`
- `docs/project-context.md`
- cleaned ADR files in `docs/decisions/`
