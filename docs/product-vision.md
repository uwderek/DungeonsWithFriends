# DungeonsWithFriends Long-Term Product Vision

Status: active
Last updated: 2026-07-08
Authority: [ADR-0060](decisions/ADR-0060-long-term-vision-capability-map.md) binds this capability map to roadmap and contract planning.

## Purpose

This document records the full product end-state so that near-term contract and roadmap decisions never optimize away a capability the end-state needs. The active roadmap lanes deliberately scope work down; this map records what that scoping defers, not abandons.

## End-State Vision

DungeonsWithFriends becomes a fully automated tabletop RPG gaming system:

- Character sheets, battle maps, DM tools, an automated DM, and a campaign manager.
- Each tool stands alone: a battle map usable alongside external VTTs such as Roll20, or fully offline at a gaming convention.
- Game systems imported as documented and turned into full playable re-creations, with AI generating a never-ending stream of new stories, adventures, and content for any imported game.
- Asynchronous DND-style play, similar to play-by-post but fully integrated and seamless.
- Seamless transition to live play when a group meets in person: casting the battle map to a TV, LAN-hosted sessions, and players optionally rolling physical dice.
- A voice assistant and chat assistant that fully understand the rules: answering any rules question, teaching new players, and acting as a fully voiced DM (theater-of-the-mind voice-only, on a TV screen, or through phones).

## Capability Map

| Pillar | Roadmap lane | Protecting contracts | Status 2026-07-08 |
| --- | --- | --- | --- |
| Character sheets | Now (delivered) | Template binding contracts, playable sheet runtime | Built (Epics 1-2) |
| Battle maps / tactical scenes | Next | Renderer-independent scene contracts (Epic 4) | Contracts planned |
| Campaign manager / DM tools | Next | Campaign records + event ledger (Epic 3, ADR-0062) | Planned |
| Asynchronous play-by-post | Now | Event ledger spine, pending action envelopes, Epic 6 | Epic created |
| Standalone tools / external VTT embedding | Now (foundation) | Headless module boundaries, embed contract (Epic 7) | Epic created |
| Rules-as-data / compendium content | Now (contracts) | Rules and content contracts (Epic 8, ADR-0064) | Epic created |
| Game system import / AI content generation | Next | Governed AI port, ingestion pipeline (Epic 9) | Epic created |
| Manual / physical dice | Now (delivered) | Dice roll resolution provenance (ADR-0063) | Contract implemented |
| Live play: TV casting / shared display | Later | Renderer-independent scene contracts, surface separation | Deferred, protected |
| Live play: LAN-hosted sessions | Later | Transport-agnostic sync port (ADR-0061) | Deferred, protected |
| Voice assistant / voiced DM / rules teaching | Later | Typed governed actions (ADR-0038), rules-as-data (ADR-0064) | Deferred, protected |

## Deferred, Not Abandoned

The 2026-07-07 documentation repair narrowed active scope to a local-first foundation. Capabilities from the archived roadmap (`docs/archive/productroadmap.md`, `docs/archive/product.md`) — procedural maps, AI GM, play-by-post retention mechanics, streamer views, component reuse in standalone apps — remain part of the end-state. Planning agents must not treat their absence from active epics as cancellation.

## Cross-Cutting Constraints

- Every game mutation must be expressible as a typed governed action (ADR-0038) so that human players, automated DMs, and voice assistants are interchangeable clients of one action registry.
- AI execution must not be hardwired to hosted infrastructure; the AI provider port must allow local model execution so a voiced DM can run fully offline at a convention.
- Sync and session authority must stay transport-agnostic (ADR-0061) so cloud, LAN, and manual file exchange are adapters, not rewrites.
- The campaign event ledger (ADR-0062) is the shared spine for async play, live play, AI narration, recaps, and sync.
