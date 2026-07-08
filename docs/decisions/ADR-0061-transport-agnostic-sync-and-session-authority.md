---
adrId: ADR-0061
shortName: transport-agnostic-sync
status: accepted
date: 2026-07-08
tags: [sync, architecture, lan, offline, ports, event-ledger]
---

# Sync Port And Session Authority Are Transport-Agnostic

## Status

Accepted for DungeonsWithFriends planning as of 2026-07-08.

## Context

Existing documents frame later sync exclusively as "Neon/Postgres through `SyncPort`". The long-term vision (ADR-0060, `docs/product-vision.md`) requires LAN-hosted sessions with no internet access, convention/offline play, manual file exchange, and seamless transition between asynchronous cloud-coordinated play and live local play. If the sync contract is defined as "talk to Postgres", each of those becomes a rewrite; if it is defined as "replicate versioned local envelopes and ledger events over an abstract transport", each becomes an adapter.

## Decision

1. `SyncPort` is defined as replication of versioned local store envelopes and campaign event-ledger entries (ADR-0062) over an abstract transport, not as a database client.
2. Session authority is a role, not a cloud service. Any conforming host may hold campaign/session authority: a hosted Cloudflare/Neon service, a device on a LAN acting as local authority, or no live authority at all (manual export/import exchange, which works today).
3. Planned adapters, each behind the same port: hosted Neon/Postgres sync (Later), LAN peer/host authority (Later), manual file exchange (delivered via export/import).
4. Gameplay and domain code must not assume network availability, cloud reachability, or a specific transport. Conflict and pending-action envelope contracts (Epic 3) must be expressible over any adapter.
5. Transport selection, discovery, and trust (for example, who may host a LAN session) are adapter concerns and require their own stories before implementation.

## Consequences

- Epic 3 envelope and ledger contracts must be reviewed against "could a LAN host or a file exchange consume this?" before being marked stable.
- Later LAN work (roadmap Later lane) becomes an adapter story rather than an architecture change.
- The Epic 5 candidate story "Neon/Postgres sync through SyncPort" is one adapter among several, not the definition of the port.

## Alternatives Considered

- Keep SyncPort Postgres-shaped and add a separate LAN mechanism later: rejected; two sync paths would violate the single-path shared-seams principle and duplicate conflict handling.
- Design full LAN discovery/trust now: rejected; only the port contract needs to be transport-agnostic now.

## Applied To

- `docs/roadmap/next.md`, `docs/roadmap/later.md`
- `_bmad-output/planning-artifacts/epics.md` (Epic 3, Epic 5)
- `docs/data/local-store-contracts.md` (later sync boundary)
