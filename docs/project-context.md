# DungeonsWithFriends Project Context

Status: active context
Last updated: 2026-07-07

## Purpose

DungeonsWithFriends is a local-first, asynchronous tabletop role-playing platform. The product goal remains to make campaign play viable for groups that cannot coordinate long synchronous sessions, while still preserving rich character sheets, tactical scenes, campaign history, creator tooling, and future AI assistance.

## Current Direction

The March 2026 planning artifacts are no longer fully authoritative. They are useful product background, but their implementation sequencing and provider assumptions must be repaired before new development stories are executed.

Current binding constraints:

- Expo/React Native remains the primary UI/app framework.
- Gluestack plus Tailwind/NativeWind remains the primary component and styling framework.
- Behavior should stay headless where practical through TypeScript state, schema, hook, and domain modules.
- TinyBase remains the local-first product store for now.
- Now-roadmap work is fully local and must not require login, hosted sync, WorkOS, Cloudflare, Neon/Postgres, or Tauri.
- TypeScript is the default implementation language for UI, domain contracts, tests, tooling, and later hosted/server code.
- Tauri/Rust is reserved for OS-specific downloaded-app functionality or local/server process wrappers when Expo cannot own the concern safely.
- Later server sync targets Neon/Postgres stores behind explicit sync ports.
- Later hosting targets Cloudflare.
- Later authentication targets WorkOS; auth and login are not current MVP work.
- Product implementation should avoid Python. Existing Python files are BMAD helper scripts under `_bmad/scripts`; do not add Python product code.
- Imported ADRs in `docs/decisions` have been cleaned in place. Each ADR's front matter and `DungeonsWithFriends Application` section define its DWF disposition, roadmap lane, and project-specific use.

## Repository Shape

- `DungeonsWithFriends/` contains the current Expo/React Native app and remains the primary UI surface.
- `_bmad-output/planning-artifacts/` contains PRD, UX, architecture, epics, readiness reports, and new course-correction artifacts.
- `_bmad-output/implementation-artifacts/` contains sprint status and prepared stories.
- `docs/archive/` contains older product/roadmap/architecture background.
- `docs/decisions/` contains imported ADRs plus DungeonsWithFriends-specific ADRs added during the 2026-07-07 re-evaluation.
- `docs/roadmap/` contains the priority ledger and Now/Next/Later roadmap lanes.

## Current Implementation Snapshot

The implementation currently includes:

- Login-free local app entry.
- Dashboard, character, campaign, friends, and story-card UI slices.
- Shared UI atoms, navigation, theme provider, and local TinyBase sync provider.
- Creator tooling with component schemas, component store, component editor/list views, and Story 1.1 workspace shell files.
- Co-located tests for most implemented files.

This implementation is useful product evidence. The Expo/Gluestack/Tailwind/TinyBase direction is current; login-gated flows and hosted sync assumptions are later roadmap concerns.

## Development Guardrails

- Keep requirements and decisions in git-tracked Markdown.
- Keep tests co-located with implementation files.
- Prefer shared contracts and headless logic over surface-specific duplication.
- Keep local-first behavior non-blocking: local actions should not wait on cloud sync.
- Validate boundary inputs explicitly and redact secrets from logs.
- Do not require login or hosted sync for now-roadmap functionality.
- Route future Cloudflare, WorkOS, Neon/Postgres, and Tauri details behind provider/adapters so game/domain features do not import vendor SDKs directly.
- Preserve the current Expo app as the primary UI while keeping behavior headless enough to reuse in future hosted or downloaded-app surfaces.

## BMAD Handoff

Before the next development story:

1. Read `_bmad-output/planning-artifacts/sprint-change-proposal-2026-07-07.md`.
2. Read `_bmad-output/planning-artifacts/architecture-realignment-2026-07-07.md`.
3. Read `docs/decisions/ADR-0059-dwf-platform-baseline-typescript-tauri-cloudflare-workos.md`.
4. Read relevant cleaned ADRs in `docs/decisions/`; each file carries its own DWF application block.
5. Read `docs/roadmap/index.md`.
6. Read `_bmad-output/planning-artifacts/documentation-repair-plan-2026-07-07.md`.
7. Regenerate or update PRD, UX, architecture, epics, and sprint stories against the accepted course correction.
