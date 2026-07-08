---
adrId: ADR-0001
shortName: knowledge-store
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: now
source: imported-and-cleaned
---
# Local-First On-Disk Knowledge Store

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** now.
- **Project application:** Preserve the local-first and private-data intent through TinyBase local stores, local export/import, and offline-safe TypeScript code. Do not carry over ActionPlan sqlite-vec or E5 implementation details unless a future DWF knowledge feature needs an equivalent local index.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Action Plan must answer workspace-knowledge queries with no external service on the default path so the product works offline and keeps all corpus data app-private.

## Decision

All embeddings and indices stay on disk in app-private SQLite, and the E5 embedding model runs fully offline (HF_HUB_OFFLINE). No managed service is on the default retrieval path.

## Consequences

Retrieval works with zero network dependency; corpus data never leaves the workspace boundary; operators have no external store to secure or pay for.

## Alternatives Considered

A hosted embedding/vector API was rejected for breaking the offline-default and app-private guarantees.

## Supersession Notes

None.

## Promotion Notes

Promoted from `proposed` to `accepted` on 2026-05-24 as part of Epic 249 ADR status hygiene backfill. The governed code paths (`ActionPlan/services/host-runtime/src/services/workspace/**` and `ActionPlan/mcp/code-knowledgebase/**`) ship a fully offline, on-disk knowledge store today (sqlite-vec + FTS5 + offline E5 embedder); the decision is in effect, not speculative. Mechanically enforced via `check_global_principles_coverage` (Story 249.3 wiring).
