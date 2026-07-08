---
title: Architecture Realignment - DungeonsWithFriends
status: draft
created: 2026-07-07
updated: 2026-07-07
supersedes:
  - architecture.md platform assumptions from 2026-03-06
  - Nhost as target auth/sync provider
  - login-required MVP assumptions
  - hosted sync before local persistence is stable
---

# Architecture Realignment: DungeonsWithFriends

## Binding Decisions

1. Expo/React Native remains the primary UI/app framework.
2. Gluestack plus Tailwind/NativeWind remains the primary component and styling framework.
3. Behavior should stay headless where practical through TypeScript state, schema, hook, and domain modules.
4. TinyBase remains the local-first product store for now.
5. Now-roadmap work is fully local and must not require login.
6. TypeScript is the default product implementation language.
7. Tauri/Rust is reserved for OS-specific downloaded-app functionality or server/local process wrappers when needed.
8. Later server sync targets Neon/Postgres stores.
9. Later hosting targets Cloudflare.
10. Later authentication targets WorkOS.
11. Product code should not add Python.
12. Imported ADRs in `docs/decisions` have been cleaned in place; each file's DWF front matter and `DungeonsWithFriends Application` section govern its project use.

## Target Platform

### Now Layer

- Expo/React Native owns the primary app shell.
- Gluestack plus Tailwind/NativeWind owns presentation primitives.
- Headless TypeScript modules own schema validation, local state rules, migrations, bindings, dice/contracts, and domain behavior.
- TinyBase owns the current local-first store.
- Local export/import and migrations protect user data before hosted sync exists.
- No login, WorkOS, Cloudflare, Neon/Postgres, Nhost, or Tauri dependency is required for now-roadmap features.

### Later Hosted Layer

- Cloudflare Pages or Workers can serve hosted surfaces when needed.
- Cloudflare Workers can implement API, webhook, sync, moderation, and AI proxy boundaries in TypeScript.
- Cloudflare Durable Objects can coordinate stateful campaign/session rooms where single-object authority is useful.
- Cloudflare R2 can store maps, media, templates, exports, and other large objects.
- Cloudflare Queues or workflow-style Workers can handle background work such as notifications, moderation, AI generation, and import/export jobs.
- Neon/Postgres is the later relational persistence target for synced product data.

### Later Auth Layer

- WorkOS/AuthKit is the later login and identity front door.
- App-owned `AuthPort` and `SessionPort` isolate product code from WorkOS SDK details.
- WorkOS organization and role concepts should be mapped to DungeonsWithFriends domain permissions, not leaked into gameplay code.
- Auth and login belong in the later roadmap until the local product requires accounts.

### Tauri/Rust Boundary Layer

- Tauri does not replace Expo as the primary UI framework.
- Tauri/Rust is introduced only for downloaded-app OS integration, local filesystem workflows, local process wrappers, backup/update safety, or server/local runtime needs Expo cannot own cleanly.
- TypeScript owns UI, shared domain contracts, and typed calls into Rust commands when this boundary is needed.

### Shared Domain Layer

Shared TypeScript packages should define:

- game system schema contracts,
- character sheet/template contracts,
- campaign event and action contracts,
- scene and visibility contracts,
- future auth/session domain types,
- sync envelopes and conflict records,
- audit and redaction contracts.

## Superseded Decisions

- Nhost auth and sync are no longer target architecture.
- Login/auth is not now-roadmap work.
- Hosted sync is not now-roadmap work.
- Cloudflare, WorkOS, Neon/Postgres, and Tauri are future or boundary concerns rather than requirements for local MVP work.
- Existing March architecture readiness is no longer sufficient for implementation until re-baselined.

## Cleaned ADR Application

Directly adopted:

- git-tracked Markdown as canonical authority,
- SOLID posture,
- shared-component-first,
- business-first naming,
- search-change-research discipline,
- boundary validation and redaction,
- logging contract,
- extension points and typed enums,
- atomic reversible changes,
- headless component architecture,
- portable component library,
- test co-location,
- ADR aliases,
- single-path shared seams,
- output templates/checklists as artifacts,
- semantic module decomposition,
- domain configuration outside source modules.

Adapted:

- local-first storage,
- OSS-first dependency posture,
- metadata-only governance,
- dual-sink audit logging,
- MCP/test verification,
- critical pipeline discipline,
- coverage floors,
- CLI/headless-client concepts,
- governed actions,
- data fabric,
- backup/update safety,
- AI token spend and OTel measurement.

Rejected or removed from ADR corpus:

- single managed vector store,
- managed host fleet control plane,
- future-scope imported ADRs for optional search, CLI parity, content licensing, knowledge graphs, MCP/tooling, application knowledge, agent automation, conversation lifecycle, multi-agent taxonomy, and outbound CLI adapters were removed to avoid roadmap confusion.

## Required Re-Baseline Work

1. Update PRD requirements to remove Nhost/login/cloud-sync requirements from the now roadmap while preserving Expo/Gluestack/Tailwind/TinyBase local-first decisions.
2. Update UX spec so the primary journey is local and login-free; move account, auth, and hosted onboarding to later roadmap sections.
3. Rewrite architecture.md around Expo/Gluestack/Tailwind/TinyBase now, sync-ready TypeScript ports next, and Cloudflare/Neon/WorkOS/Tauri later boundaries.
4. Regenerate epics and stories so local TinyBase foundation, export/import, migrations, and login-free UX happen before sync/auth/server scope.
5. Add later roadmap stories for Neon/Postgres sync, Cloudflare hosting, WorkOS auth, and Tauri OS-specific downloaded-app capabilities.
6. Re-baseline test orchestration for Expo/TypeScript/TinyBase now, then expand later for Tauri, Cloudflare, Neon, and WorkOS seams.

## Source Checks

The current direction was checked against official documentation on 2026-07-07:

- Cloudflare Workers TypeScript documentation says TypeScript is first-class on Workers: https://developers.cloudflare.com/workers/languages/typescript/
- Cloudflare Durable Objects documentation describes stateful coordination for collaborative and real-time applications: https://developers.cloudflare.com/durable-objects/
- WorkOS AuthKit documentation describes hosted authentication flows and API-backed integration: https://workos.com/docs/authkit
- Tauri v2 documentation describes web frontends combined with a Rust application core: https://v2.tauri.app/start/
