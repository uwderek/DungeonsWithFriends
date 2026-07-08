---
title: DungeonsWithFriends Epics And Stories
status: active
created: 2026-03-06
updated: 2026-07-08
sources:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - docs/roadmap/index.md
---

# Epics And Stories: DungeonsWithFriends

## Epic 1: Local Creator Foundation

Creators can build system-agnostic character sheet templates locally in the Expo app.

### Story 1.1: Creator Workspace Shell

Status: review. Preserve the existing desktop creator shell and complete review against the repaired architecture.

### Story 1.2: System Template Selection And Custom JSON Binding

As a creator, I want to choose a system template or import custom system JSON, so that component definitions can bind to structured local metadata.

Acceptance:
- Given no system is selected, when the creator opens the workspace, then the canvas stays in a guided empty state.
- Given valid custom JSON, when the creator imports it, then system metadata is validated and saved locally.
- Given invalid JSON, when import runs, then current local state remains unchanged.

### Story 1.3: Component Registry And Binding Contract

As a creator, I want reusable component definitions to bind to system fields, so that templates can become playable sheets later.

Acceptance:
- Given a component definition, when it is saved, then persisted fields validate against component and binding schemas.
- Given a system field is removed, when bindings are validated, then stale bindings are reported without deleting data.

### Story 1.4: Local Save Load Preview Export Import

As a creator, I want to save, preview, export, and import local templates, so that my work survives reloads and can be moved manually.

Acceptance:
- Given a local template, when checkpoint runs, then a versioned TinyBase snapshot is saved.
- Given an exported template file, when import runs, then version and schema are validated before replacing local data.

## Epic 2: Local Playable Sheet Runtime

Players can create and use character sheets locally from creator templates.

### Story 2.1: Local Character Library And Manual Export

As a player, I want a local character library with manual export, so that I can manage characters without accounts.

### Story 2.2: Playable Sheet Data Binding

As a player, I want template-bound sheet fields to render as playable controls, so that local sheets are useful during play.

### Story 2.3: Native Dice Notation And Local Roll Resolution

As a player, I want local dice notation parsing and roll records, so that turns can resolve without network access.

## Epic 3: Local Campaign And Event Ledger

Game Masters can model campaigns and local event history before hosted collaboration.

### Story 3.1: Local Campaign Records

As a GM, I want local campaign records, so that I can organize characters and notes without hosted rooms.

### Story 3.2: Local Event Ledger And Pending Action Envelopes

As a GM, I want local events and pending action envelopes, so that later sync can consume deterministic local intent.

## Epic 4: Tactical Scene Contracts

The product defines renderer-independent scene contracts before building hosted rooms or native displays.

### Story 4.1: Local Scene Contract

As a GM, I want maps, tokens, visibility, and initiative modeled locally, so that tactical rendering can attach later.

## Epic 5: Later Hosted, Auth, Marketplace, AI, And Native Boundaries

Later features attach only after local contracts are stable.

Candidate stories:
- WorkOS auth/login through `AuthPort` and `SessionPort`.
- Neon/Postgres sync through `SyncPort`.
- Cloudflare hosted surfaces selected per responsibility.
- Tauri/Rust OS-specific downloaded-app capabilities.
- Marketplace publishing, licensing, moderation, and audit.
- AI assistance with cost controls and approval gates.

## Sequencing Rule

Do not create hosted, auth, marketplace, AI, or Tauri stories until Now and Next local contracts are stable or Derek explicitly waives the gate.
