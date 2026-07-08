---
adrId: ADR-0060
shortName: long-term-vision-capability-map
status: accepted
date: 2026-07-08
tags: [vision, roadmap, capability-map, planning]
---

# Long-Term Vision Capability Map Governs Roadmap Completeness

## Status

Accepted for DungeonsWithFriends planning as of 2026-07-08, per Derek's direction.

## Context

The 2026-07-07 documentation repair correctly narrowed active scope to a local-first foundation, but it left roughly half of the product end-state invisible to the active planning corpus. Voice assistant, voiced DM, rules Q&A and teaching, external VTT integration, LAN hosting, TV casting, and manual dice entry appeared in no active artifact; asynchronous play-by-post was vision-central but had no active build story. Capabilities that survive only in `docs/archive/` risk being optimized away by future planning passes that read only active documents.

Derek assigned lanes on 2026-07-08:

- Later: voice assistant/voiced DM, TV casting/shared display, LAN access.
- Next: AI content generation and ingestion of documented game systems.
- Now: all remaining vision pillars, transformed into epics (with additional planning stories where an epic is too large).

## Decision

1. `docs/product-vision.md` is the authoritative long-term capability map. Roadmap lanes and epic planning must account for every pillar it lists; a pillar may be deferred but never silently dropped.
2. Archived-roadmap capabilities (procedural maps, AI GM, play-by-post retention mechanics, streamer views, standalone component reuse) are deferred, not abandoned.
3. Lane assignments per Derek 2026-07-08: voice/TV-casting/LAN are Later; AI content generation and ingestion are Next; async play loop, standalone tool packaging foundation, rules-and-content contracts, and dice roll provenance are Now.
4. AI execution attaches through a provider port that must permit local model execution; AI capability must not be architecturally hosted-only.
5. Voice, chat, automated DM, and human input are all clients of the typed governed action registry (ADR-0038); no capability may introduce a second ungoverned mutation path.
6. The Epic 5 sequencing gate is amended: AI content ingestion and generation is Next-lane work by explicit direction, and must still run behind governed actions and provider ports while remaining useful locally.

## Consequences

- New epics 6-9 enter the active backlog (async play loop, standalone tool packaging, rules and content contracts, AI content ingestion and generation).
- `docs/roadmap/` lane files and the priority ledger list every vision pillar with an explicit lane.
- ADR-0061 (transport-agnostic sync), ADR-0062 (event ledger spine), ADR-0063 (dice provenance), and ADR-0064 (rules-as-data) protect the deferred pillars' contract needs.
- Future planning repairs must reconcile against `docs/product-vision.md`, not only the active PRD and epics.

## Alternatives Considered

- Leave deferred capabilities in `docs/archive/` only: rejected; archive is explicitly non-governing and invisible to active planning.
- Pull all vision pillars into the active PRD now: rejected; the local-first sequencing discipline is working and should not be diluted.

## Applied To

- `docs/product-vision.md`
- `docs/roadmap/now.md`, `docs/roadmap/next.md`, `docs/roadmap/later.md`, `docs/roadmap/index.md`
- `_bmad-output/planning-artifacts/epics.md`
