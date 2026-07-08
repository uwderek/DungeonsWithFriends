---
title: DungeonsWithFriends Product Requirements
status: active
created: 2026-03-06
updated: 2026-07-08
supersedes:
  - March 2026 hosted-sync/auth-first MVP assumptions
sources:
  - docs/project-context.md
  - docs/roadmap/index.md
  - docs/decisions/ADR-0059-dwf-platform-baseline-typescript-tauri-cloudflare-workos.md
---

# Product Requirements: DungeonsWithFriends

## Product Vision

DungeonsWithFriends is a local-first, asynchronous tabletop role-playing platform for groups that cannot reliably meet for long live sessions. The product starts by making creator tooling and character play useful entirely on-device, then grows into campaign ledgers, tactical scenes, sync, marketplace, and AI once the local contracts are stable.

## MVP Scope

The MVP is a local, login-free Expo app that proves three things:

1. Creators can define system-agnostic sheet templates locally.
2. Players can use local playable sheets without account creation or hosted sync.
3. The local data model is explicit enough to support later sync to Neon/Postgres through ports without rewriting gameplay code.

## Users And Jobs

- **Creator:** Build reusable character-sheet templates for a game system without coding a whole app.
- **Player:** Open and use a character sheet locally with fast, clear state and dice interactions.
- **Game Master:** Prepare local campaign records and review player-facing state before hosted collaboration exists.
- **Future platform operator:** Add sync, auth, marketplace, moderation, and AI behind ports after the local product proves useful.

## Now Requirements

- FR1: The app opens directly into useful local functionality without login.
- FR2: Users can navigate dashboard, character, and creator surfaces locally.
- FR3: Creator tooling can define component definitions with validated TypeScript/Zod schemas.
- FR4: Creator templates can declare system metadata, component bindings, layout intent, and validation rules.
- FR5: TinyBase stores local creator and playable-sheet data in versioned tables.
- FR6: Local data can be checkpointed, exported, imported, and migrated without hosted services.
- FR7: Local import rejects malformed or unsupported versions with clear typed errors.
- FR8: The app keeps UI behavior headless where practical through hooks, schemas, and domain modules.
- FR9: Co-located tests cover schema validation, local store migration, export/import, and primary navigation.
- FR10: Product code remains TypeScript-first and does not add Python implementation code.

## Next Requirements

- FR11: Users can create and manage local playable character sheets from creator templates.
- FR12: Users can resolve local dice notation and persist roll results into local records.
- FR13: Users can create local campaign records and append local event-ledger entries.
- FR14: The app can create pending action envelopes that later hosted sync can consume.
- FR15: Tactical scene contracts can model maps, tokens, visibility, initiative, and renderer-independent state locally.

## Later Requirements

- FR16: WorkOS-backed login and account management can attach through app-owned auth/session ports.
- FR17: TinyBase/local stores can sync to Neon/Postgres through explicit sync ports.
- FR18: Cloudflare surfaces can host APIs, pages, queues, R2-backed assets, and coordination responsibilities when needed.
- FR19: Tauri/Rust can be introduced only for downloaded-app OS-specific functionality, local filesystem workflows, or local/server process wrappers Expo cannot safely own.
- FR20: Marketplace, licensing, moderation, AI assistance, and immersive clients remain later roadmap work.

## Non-Functional Requirements

- NFR1: Local actions must not block on hosted services.
- NFR2: Store snapshots and import/export files must carry a schema version.
- NFR3: Boundary data must be validated before entering TinyBase tables.
- NFR4: Secrets must not be logged; future provider errors must be redacted.
- NFR5: Current work must run without accounts, hosted sync, WorkOS, Cloudflare, Neon/Postgres, or Tauri.
- NFR6: Tests stay co-located with source files.
- NFR7: Feature UI must not import future provider SDKs directly.

## Success Metrics

- A user can open the app locally and reach dashboard, character, and creator surfaces without login.
- Creator component and template schemas have passing tests.
- Local store migration and export/import helpers have passing tests.
- Sprint status points to local-first next stories instead of historical hosted/auth stories.
- New stories trace to this PRD, the active architecture, roadmap, and ADR-0059.

## Out Of Scope For Now

- Login, registration, profiles, friends, and account management.
- Hosted sync, authoritative multiplayer, or premium cloud features.
- Marketplace publishing, entitlements, and moderation.
- AI automation or hosted AI proxies.
- Tauri/Rust downloaded-app behavior.
