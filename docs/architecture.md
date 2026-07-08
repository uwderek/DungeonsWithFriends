# Current Codebase Architecture

Last updated: 2026-07-07

## Scope

This document describes what is currently in the repository and how it should be interpreted after the 2026-07-07 course correction. It does not replace the product architecture realignment in `_bmad-output/planning-artifacts/architecture-realignment-2026-07-07.md`; it gives implementation agents a repo-level map.

## Current App

The app under `DungeonsWithFriends/` is the primary Expo/React Native UI app with Feature-Sliced Design tendencies:

- `App.tsx` composes providers and opens directly into the local dashboard shell with in-app navigation state.
- `src/features/dashboard` owns the current landing/dashboard view.
- `src/features/character` owns character library UI.
- `src/features/creator` owns creator tooling, component schemas, TinyBase-backed component storage, and the Story 1.1 workspace shell.
- `src/features/campaign`, `src/features/friends`, and `src/features/story` contain early UI slices.
- `src/shared` contains the local TinyBase sync provider, local store persistence/export seams, theme, navigation, UI atoms, and Gluestack provider scaffolding.

## Superseded Assumptions

The current app has been aligned away from older assumptions:

- No login gate blocks the local product foundation.
- Hosted sync waits until TinyBase local persistence, export, import, and migration contracts are stable.
- Future provider code must remain behind ports instead of feature UI imports.

The older assumptions remain excluded from now-roadmap work. Expo/React Native, Gluestack/Tailwind, and TinyBase remain current baseline decisions.

## Target Direction

The target architecture is staged:

- Now: Expo/React Native UI, Gluestack/Tailwind presentation, headless TypeScript behavior, TinyBase local-first storage, local export/import, and no login requirement.
- Next: local playable sheets, campaign/event ledger contracts, pending action envelopes, tactical scene contracts, and sync-ready ports that still run locally.
- Later: Neon/Postgres server persistence, Cloudflare hosted app/server surfaces, WorkOS auth/login, and Tauri/Rust only for OS-specific downloaded-app capabilities or local/server process wrappers.

This direction is grounded in official platform documentation for later work: Cloudflare Workers support TypeScript as a first-class language, Durable Objects are built for coordinated stateful applications, WorkOS AuthKit provides hosted auth flows, and Tauri combines a web frontend with a Rust application core.

Reference links:

- https://developers.cloudflare.com/workers/languages/typescript/
- https://developers.cloudflare.com/durable-objects/
- https://workos.com/docs/authkit
- https://v2.tauri.app/start/

## Boundary Rules

- Now-roadmap product/domain code must not require login, WorkOS, Cloudflare, Neon/Postgres, hosted sync, or Tauri.
- Future provider code must not be imported directly from feature UI. Use provider facades and ports.
- Tauri/Rust capabilities belong behind commands or plugins only when OS-specific downloaded-app behavior or local/server process wrappers are required.
- TinyBase is the current local store. Later Neon/Postgres sync must attach through explicit sync ports rather than bypass local contracts.
- Python is not a product implementation language for this project.
- Existing BMAD Python helper scripts are framework tooling, not product code; migrating them requires a separate tooling story.
- Tests remain co-located.
- Imported ADRs govern only through their own `DungeonsWithFriends Application` sections and cleaned DWF front matter.
