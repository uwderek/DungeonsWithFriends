---
title: DungeonsWithFriends Architecture
status: active
created: 2026-03-06
updated: 2026-07-08
supersedes:
  - March 2026 hosted-sync/auth-first architecture
sources:
  - docs/architecture.md
  - docs/decisions/ADR-0059-dwf-platform-baseline-typescript-tauri-cloudflare-workos.md
  - _bmad-output/planning-artifacts/architecture-realignment-2026-07-07.md
---

# Architecture: DungeonsWithFriends

## Architecture Spine

DungeonsWithFriends is an Expo/React Native app with local-first TinyBase storage, Gluestack/Tailwind presentation, and headless TypeScript behavior. The architecture is staged: local foundations now, sync-ready contracts next, hosted/auth/native boundaries later.

## Current App Shape

- `DungeonsWithFriends/App.tsx` composes global providers and opens directly into the local dashboard shell.
- `src/shared/providers/sync-provider.tsx` owns the local TinyBase provider and local checkpoint state.
- `src/shared/store/` owns app-owned local persistence, migration, export, and import seams.
- `src/features/creator/` owns creator schemas, component definitions, workspace state, and creator UI.
- `src/features/character/` owns character library and playable-sheet domain seams.
- `src/features/campaign/`, `src/features/friends/`, and `src/features/story/` contain early UI slices that will be reconnected to local contracts over time.

## Layers

### Presentation Layer

Expo/React Native owns the app shell. Gluestack, NativeWind, Tailwind tokens, and shared UI atoms/molecules own presentation. UI components call feature hooks and domain helpers; they do not import hosted provider SDKs.

### Feature Layer

Feature slices contain their own UI, model schemas, hooks, and tests. Creator authoring, playable sheets, campaigns, stories, and tactical scenes stay separate until they meet through explicit shared contracts.

### Local Data Layer

TinyBase is the current product store. Store contents are versioned, migrated, checkpointed, exported, and imported through `src/shared/store`. The app currently uses local browser storage when available and an in-memory fallback for tests/non-browser runtimes.

### Domain Contract Layer

Headless TypeScript/Zod modules define system templates, template bindings, component definitions, character sheets, future campaign events, pending action envelopes, and tactical scene contracts. These contracts are the future sync boundary.

### Later Provider Layer

WorkOS, Cloudflare, Neon/Postgres, and Tauri/Rust are later boundaries. They attach through app-owned ports and adapters only after local contracts are stable.

## Local Store Principles

- Persist only validated, versioned snapshots.
- Treat malformed snapshots as recoverable local corruption.
- Prefer migration helpers over ad hoc shape checks.
- Keep export/import envelopes explicit and user-copyable.
- Never require network or login for current local data.

## Boundary Rules

- No now-roadmap feature may require login, hosted sync, Cloudflare, WorkOS, Neon/Postgres, or Tauri.
- Future sync consumes local contracts; it must not bypass them.
- Creator layout canvas and tactical scene model are separate concepts.
- Store schemas use `snake_case` for persisted boundary fields; TypeScript functions/hooks use `camelCase`.
- Product code remains TypeScript-first. Existing BMAD Python scripts are framework tooling only.

## Verification Architecture

Verification runs through direct repo commands: TypeScript typecheck, co-located Jest tests, Playwright E2E where relevant, Stylelint for CSS, and targeted architecture scans. Package scripts expose those commands directly.

## Later Attach Points

- `AuthPort` and `SessionPort` for WorkOS.
- `SyncPort` and migration-aware snapshot consumers for Neon/Postgres.
- Cloudflare Workers/Pages/R2/Queues selected per responsibility.
- Tauri commands only for OS-specific downloaded-app or local process needs.
