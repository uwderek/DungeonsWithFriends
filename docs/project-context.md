# DungeonsWithFriends Project Context

Status: active context
Last updated: 2026-07-08

## Purpose

DungeonsWithFriends is a local-first, asynchronous tabletop role-playing platform. The product goal remains to make campaign play viable for groups that cannot coordinate long synchronous sessions, while still preserving rich character sheets, tactical scenes, campaign history, creator tooling, and future AI assistance.

The full long-term end-state (automated DM, voice assistant, standalone/embeddable tools, live-play transition, game-system import with AI content generation) is recorded in `docs/product-vision.md` and bound to planning by ADR-0060. Deferred pillars are protected by ADR-0061 (transport-agnostic sync), ADR-0062 (event ledger spine), ADR-0063 (dice provenance), and ADR-0064 (rules-as-data layer).

## Current Direction

The March 2026 planning artifacts have been repaired into a local-first baseline. Older provider assumptions remain useful background only when they do not conflict with the current roadmap and ADR-0059.

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
- `_bmad-output/planning-artifacts/` contains the repaired PRD, UX, architecture, epics, readiness reports, and course-correction artifacts.
- `_bmad-output/implementation-artifacts/` contains sprint status and prepared stories.
- `docs/archive/` contains older product/roadmap/architecture background.
- `docs/decisions/` contains imported ADRs plus DungeonsWithFriends-specific ADRs added during the 2026-07-07 re-evaluation.
- `docs/roadmap/` contains the priority ledger and Now/Next/Later roadmap lanes.

## Current Implementation Snapshot

The implementation currently includes:

- Login-free local app entry.
- Dashboard, character, campaign, friends, and story-card UI slices.
- Shared UI atoms, navigation, theme provider, local TinyBase sync provider, and local store persistence/export seams.
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

1. Read `docs/decisions/ADR-0059-dwf-platform-baseline-typescript-tauri-cloudflare-workos.md`.
2. Read `_bmad-output/planning-artifacts/prd.md`, `architecture.md`, `ux-design-specification.md`, and `epics.md`.
3. Read `docs/data/local-store-contracts.md`, `docs/data/template-binding-contracts.md`, and `docs/data/export-import-format.md`.
4. Read `_bmad-output/implementation-artifacts/sprint-status.yaml`.
5. Start with `_bmad-output/implementation-artifacts/1-2-system-template-selection-and-custom-json-binding.md`.
