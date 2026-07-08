---
adrId: ADR-0040
shortName: tinybase-planning-store-backend
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: now-later
source: imported-and-cleaned
---
# ADR-0040 — TinyBase Is The Synchronized Planning-Store Backend

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** now-later.
- **Project application:** TinyBase is the local-first DWF store now. Later Neon/Postgres sync must bridge through explicit sync ports without making TinyBase a second server authority.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

> **Source status: proposed.** This decision MUST be ratified by a human reviewer before
> the Epic 542 pull request merges. The synchronized backend is implemented and
> passes the Epic 424 backend-swap proof suite, but the substrate choice — TinyBase
> as the index/cache/sync layer over canonical local-file git truth — is an
> architectural commitment that needs explicit human sign-off (it governs how every
> later external-DB planning sync is wired).

## Context

## Proposed Rationale

This ADR intentionally remains `proposed` while Epic 542 lands because the
implementation is the candidate embodiment of the decision, but the TinyBase
substrate choice still requires explicit human ratification before merge. Until
that review completes, the governed code exists so the backend-swap proof suite
can validate the seam without treating the architectural substrate as settled.

`projectPlanningStoreAdapters.ts` has long declared a `synchronized-db` planning
backend behind the adapter seam, with `local-file` as the canonical source of
record (Epic 411 Story 411.2). Epic 424 validated that the seam supports a backend
swap without forcing any caller to branch by adapter kind. Epic 542 Story 542.2
makes that declared backend real.

The planning model is files-first by ADR-0005 (git-tracked markdown/JSON is the
sole canonical authority). A synchronized backend must therefore **never become a
second authority**: it can index, cache, and (later) sync planning state, but git
truth stays the source of record. The open question this ADR answers is *which
substrate* the synchronized layer is built on.

## Decision

**The `synchronized-db` planning backend is built on TinyBase**, used strictly as
a **read-through / write-through index + cache + sync layer** over the canonical
local-file store. Concretely:

1. **Canonical truth first.** Every mutation lands in the canonical `local-file`
   adapter (git truth) *before* the synchronized index is refreshed. The
   synchronized adapter is a projection — it cannot accept a write that has not
   already been written to canonical truth (`rejectProjectionAuthorityMutation`).
2. **TinyBase as the index.** Reads are served from a TinyBase-shaped reactive row
   store (one table `planning_items`, flat cell rows keyed by work-item id, a row
   listener) rehydrated from canonical truth, so an indexed read can never diverge
   from the source of record. Stale index rows whose canonical record was deleted
   out-of-band are pruned on every refresh.
3. **The store contract is the seam.** The adapter depends only on the
   `SynchronizedDbPlanningRowStore` contract (a deliberate subset of the TinyBase
   `Store` table API: `setRow` / `getRow` / `delRow` / `getRowIds` / `getTable` +
   a row listener), never on a concrete store. The durable `tinybase` binding
   substitutes behind that contract with no adapter change, and a host that cannot
   build a native binding still gets the full in-process index — so the
   synchronized backend is always reachable (fail-soft, per the optional-dependency
   posture).
4. **Sync flows through TinyBase.** Any later external-DB planning sync (a hosted
   store, multi-host replication) is wired as a TinyBase synchronizer/persister
   behind this same contract — it does **not** introduce a second projection path.

## Consequences

- **No second authority, no parallel code path.** There is exactly one durable
  writer (the canonical local-file governed write path) and one projection seam.
  This satisfies ADR-0005 (git-tracked markdown is canonical) and the CLAUDE.md
  no-parallel-implementations rule.
- **Backend swap stays caller-transparent.** The Epic 424 backend-swap proof suite
  and the shared CRUD conformance suite both pass against the synchronized backend
  with no caller changes.
- **The durable TinyBase binding is a transparent upgrade.** Dropping the
  `tinybase` package in behind `SynchronizedDbPlanningRowStore` (and a TinyBase
  persister for durability) requires no change to the adapter, the backend
  selection, or any caller.
- **Human ratification gates merge.** Per this ADR's own `status: proposed`, the
  Epic 542 PR flags that ratification is required before merge.

## Alternatives considered

- **A bespoke in-memory Map projection (the pre-542 placeholder).** Rejected as the
  *durable* answer: it carries no reactive index, no listener seam, and no sync
  story, so every later external-DB sync would have to invent its own path. The
  TinyBase-shaped contract keeps one seam end to end.
- **A SQLite-backed synchronized store.** SQLite already backs measurement and
  code-knowledge stores, but it is a query store, not a reactive client-side index
  with cell-level listeners; TinyBase is the better fit for a fast planning index
  that a UI and an MCP read identically, and its synchronizer model is the
  intended multi-host sync substrate.
