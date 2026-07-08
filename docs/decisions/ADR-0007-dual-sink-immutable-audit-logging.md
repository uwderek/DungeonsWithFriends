---
adrId: ADR-0007
shortName: audit-dual-sink
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: next-later
source: imported-and-cleaned
---
# Dual-Sink Immutable Audit Logging

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** next-later.
- **Project application:** Start with local TinyBase event-log evidence and add hosted immutable audit projection only when sync/server work begins.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Indexing and refresh actions must be auditable with tamper-evident evidence that survives even if the queryable store is rebuilt.

## Decision

Every indexing/refresh action emits synchronized SQLite span evidence plus immutable append-only JSONL records (the Epic 102 dual-sink posture).

## Consequences

Audit evidence is queryable and durable independently of the rebuildable index; refresh behavior is provable across success, partial, and blocked states.

## Alternatives Considered

A single mutable log was rejected because rebuilding the index would erase audit history.

## Supersession Notes

None.

## Promotion Notes

Promoted from `proposed` to `accepted` on 2026-05-24 as part of Epic 249 ADR status hygiene backfill. The Epic 102 dual-sink posture is in effect across `ActionPlan/services/host-runtime/src/services/workspace/**`: every indexing/refresh action writes synchronized SQLite span evidence plus an immutable JSONL record. `CodeKnowledgeTraceAuditService` and the `ArchitectureDecisionIndexService` both ride this pattern today.

## Confirmation

Confirmed by `ActionPlan/services/host-runtime/src/services/workspace/codeKnowledgebaseActivation.e2e.test.ts`, which asserts ADR refresh writes graph rows and dual-sink audit evidence, and `ActionPlan/services/host-runtime/src/services/workspace/RepositoryIntelligenceIndexService.test.ts`, which verifies blocked audit persistence does not report a healthy sink pair.
