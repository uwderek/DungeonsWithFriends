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
  - docs/product-vision.md
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

### Story 2.4: Dice Roll Resolution Provenance

As a player, I want roll records to state whether they came from the app's RNG or manual physical-dice entry, so that live-table play is a first-class, validated resolution source (ADR-0063).

Acceptance:
- Given any dice roll, when it is persisted, then it carries `resolution_source` (`local_rng` or `manual_entry`), defaulting to `local_rng` for existing rows and version-1 exports.
- Given manually entered die results, when they are saved, then they validate against the notation (count, per-die range, modifier, total) and invalid results are rejected without persisting.

## Epic 3: Local Campaign And Event Ledger

Game Masters can model campaigns and local event history before hosted collaboration.

### Story 3.1: Local Campaign Records

As a GM, I want local campaign records, so that I can organize characters and notes without hosted rooms.

### Story 3.2: Local Event Ledger And Pending Action Envelopes

As a GM, I want local events and pending action envelopes, so that later sync can consume deterministic local intent.

The ledger is the replayable spine of the product (ADR-0062) and must satisfy its contract from the first version.

Acceptance:
- Given a campaign's event history, when events are replayed in order, then campaign state is reproduced deterministically with recorded (not recomputed) dice and AI outputs.
- Given any event, when it is written, then it carries typed event kind, actor attribution (human player, GM, system, or AI agent), ordering/causality metadata, and a channel (in-character, out-of-character, GM-private, system) with visibility attached to the event.
- Given a pending action envelope, when it is created or resolved, then it references ledger positions so conflict resolution is expressible in ledger terms.
- Given any transport adapter per ADR-0061 (hosted, LAN, or file exchange), when envelopes and events are exchanged, then no contract field assumes a specific transport.

## Epic 4: Tactical Scene Contracts

The product defines renderer-independent scene contracts before building hosted rooms or native displays.

### Story 4.1: Local Scene Contract

As a GM, I want maps, tokens, visibility, and initiative modeled locally, so that tactical rendering can attach later.

## Epic 5: Later Hosted, Auth, Marketplace, AI, And Native Boundaries

Later features attach only after local contracts are stable.

Candidate stories:
- WorkOS auth/login through `AuthPort` and `SessionPort`.
- Neon/Postgres sync as one adapter of the transport-agnostic `SyncPort` (ADR-0061).
- LAN-hosted session authority as another `SyncPort` adapter for internet-free live play.
- Cloudflare hosted surfaces selected per responsibility.
- Tauri/Rust OS-specific downloaded-app capabilities.
- Marketplace publishing, licensing, moderation, and audit.
- AI assistance with cost controls and approval gates.
- Voice assistant and voiced DM: rules-aware voice/chat that answers rules questions, teaches play, and narrates as DM (voice-only, TV, or phones), consuming the rules/compendium layer (ADR-0064) and mutating state only through governed typed actions (ADR-0038).
- TV casting and shared-display surfaces as renderer-independent consumers of Epic 4 scene contracts.
- External VTT integration adapters (for example Roll20) built on the Epic 7 packaging foundation.

## Epic 6: Local Async Play Loop

Groups can play asynchronously, play-by-post style, fully locally on the campaign event ledger (ADR-0062). This epic is larger than one story and needs story-level planning before development.

Candidate stories:

### Story 6.1: Local Play-By-Post Thread

As a player, I want campaign events rendered as a readable in-character/out-of-character thread, so that I can catch up on the fiction in short bursts.

Acceptance:
- Given ledger events with channels, when the thread renders, then channel visibility rules decide what each participant role sees.
- Given the thread view, when it renders, then it holds no authoritative state outside the ledger.

### Story 6.2: Turn Submission And Pending Action Resolution

As a player, I want to submit an action as a pending envelope and see it resolve into ledger events, so that turns advance without a live session.

### Story 6.3: Async Pacing Metadata

As a GM, I want turn-order, waiting-on, and pacing metadata on the ledger, so that later notification and auto-skip features have the data they need without contract changes.

## Epic 7: Standalone Tool Packaging And Embedding Foundation

Each tool (character sheet, dice, later battle map) can run standalone or embed in another host, per the component-based pillar in `docs/product-vision.md`.

Candidate stories:

### Story 7.1: Headless Module Boundary Enforcement

As a developer, I want model layers verified free of React and UI imports (including fixing the `component-store.ts` `tinybase/ui-react` leak), so that domain modules stay portable to web, server, CLI, and embed targets.

### Story 7.2: Standalone Sheet And Dice Packaging Spike

As a developer, I want the playable sheet and dice domain packaged and exercised outside the Expo app shell, so that standalone convention use is proven, not assumed.

### Story 7.3: Embed Contract Definition

As a developer, I want a defined contract for hosting a DWF tool inside another surface (inputs, persistence, theming, events), so that later external VTT adapters have a stable seam.

## Epic 8: System Rules And Content Contracts

The product defines the rules-as-data and compendium layer (ADR-0064): structured rules, compendium entries, source corpus, and licensing metadata. Contracts and storage only; no rules engine, no ingestion tooling.

Candidate stories:

### Story 8.1: Rules And Compendium Schema Contracts

As a creator, I want versioned local tables for structured rules, compendium entries, and source text, so that imported and authored game content has a system-scoped home.

### Story 8.2: Licensing And Source Metadata Contract

As a creator, I want mandatory origin/license/attribution metadata on every rules and compendium record, so that later marketplace and import work never has to retrofit provenance.

## Epic 9: AI Content Ingestion And Generation (Next Lane)

Documented game systems are ingested into the Epic 8 contracts and AI generates adventures, stories, and content targeting the same contracts. Next-lane by Derek's 2026-07-08 direction; runs behind governed actions (ADR-0038) and an AI provider port that permits local model execution (ADR-0060).

Candidate stories:
- Ingestion pipeline from documented game text into rules/compendium/source-corpus records with licensing metadata.
- Governed AI generation of compendium content (monsters, items, NPCs) as editable proposals.
- Governed AI generation of adventures and story content bound to an imported system.
- AI provider port with local-model and hosted-model adapters plus cost controls.

## Sequencing Rule

Do not create hosted, auth, marketplace, or Tauri stories until Now and Next local contracts are stable or Derek explicitly waives the gate. Exception per ADR-0060: Epic 9 (AI content ingestion and generation) is Next-lane by Derek's 2026-07-08 direction, contingent on Epic 8 contracts existing first, and must remain locally useful behind governed actions and provider ports.
