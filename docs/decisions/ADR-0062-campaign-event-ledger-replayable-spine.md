---
adrId: ADR-0062
shortName: event-ledger-replayable-spine
status: accepted
date: 2026-07-08
tags: [event-ledger, campaign, async-play, architecture, contracts]
---

# The Campaign Event Ledger Is The Replayable Spine Of The Product

## Status

Accepted for DungeonsWithFriends planning as of 2026-07-08. Governs Epic 3 and Epic 6 design.

## Context

Story 3.2 planned a "local event ledger and pending action envelopes" as a persistence feature. The long-term vision makes the ledger far more load-bearing: asynchronous play-by-post threads, live table play, AI DM narration, session recaps, rules-teaching context, audit, and every sync adapter (ADR-0061) all consume the same event history. Designing it as a simple local log and retrofitting replay, attribution, and channel semantics later would force a painful migration of the product's most central data.

## Decision

The campaign event ledger contract must provide, from its first version:

1. Append-only, typed events. Corrections append new events; history is never rewritten.
2. Deterministic replay: replaying a campaign's events reproduces campaign state. Dice results, AI outputs, and other nondeterminism are recorded as event data, never recomputed on replay.
3. Actor attribution on every event, with an actor model that already distinguishes human player, GM, system automation, and AI agent actors, even though AI actors arrive later.
4. Ordering and causality metadata that works at both asynchronous cadence (days between turns) and live cadence (seconds), so the same ledger serves play-by-post and at-the-table play.
5. Channel semantics: in-character, out-of-character, GM-private/whisper, and system channels, with visibility rules attached to events rather than to rendering surfaces.
6. Pending action envelopes reference ledger positions, so submitted-but-unresolved intent and conflict resolution are expressible in ledger terms.
7. Compatibility with audit/redaction contracts and with sync envelopes over any transport (ADR-0061).

Rendering surfaces (chat thread UI, recap views, voice narration, shared displays) are consumers of the ledger and hold no authoritative state.

## Consequences

- Story 3.2 acceptance criteria expand to cover replay determinism, actor attribution, and channel visibility.
- Epic 6 (async play loop) builds its play-by-post thread directly on ledger events instead of introducing a separate chat store.
- Later AI DM, recap generation, and voice narration consume the ledger without new authoritative stores.
- The ledger schema deserves the same versioned envelope and migration discipline as existing tables.

## Alternatives Considered

- Separate chat/message store beside a thin event log: rejected; two histories would immediately diverge on visibility and replay.
- Mutable campaign state with snapshots only: rejected; deterministic replay and audit both require event sourcing.

## Applied To

- `_bmad-output/planning-artifacts/epics.md` (Epic 3, Epic 6)
- `docs/roadmap/now.md`, `docs/roadmap/next.md`
