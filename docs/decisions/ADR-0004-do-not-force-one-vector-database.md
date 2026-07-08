---
adrId: ADR-0004
shortName: vector-flexibility
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: later
source: imported-and-cleaned
---
# Do Not Force Everything Into One Vector Database

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** later.
- **Project application:** Do not force game data, audit logs, search, media, and knowledge into one database. Select stores per responsibility when those later capabilities exist.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Different knowledge artifacts have different access shapes: code semantics, exact text, reactive UI state, durable curated truth, and append-only audit.

## Decision

Keep the Epic 105 artifact-routing matrix: sqlite-vec for code semantics, FTS5 for exact text, TinyBase for reactive UI, file-first curated memory for durable truth, and append-only JSONL for audit. No single vector DB is forced.

## Consequences

Each artifact is stored in the substrate that fits it; retrieval stays accurate and the system avoids one unsafe over-generalized store.

## Alternatives Considered

A single managed vector store (ADR-0003) was rejected for the reasons above.

## Supersession Notes

Supersedes ADR-0003.

## Promotion Notes

Promoted from `proposed` to `accepted` on 2026-05-24 as part of Epic 249 ADR status hygiene backfill. The Epic 105 artifact-routing matrix is in effect across `ActionPlan/mcp/code-knowledgebase/**` and `ActionPlan/services/host-runtime/src/services/workspace/**`; sqlite-vec / FTS5 / TinyBase / file-first / JSONL each host the artifact type that fits them.

## Confirmation

Confirmed by `ActionPlan/mcp/code-knowledgebase/src/knowledgeRetrievalBackend.test.ts`, which keeps alternate retrieval substrates behind the same opt-in backend selector, and `ActionPlan/mcp/code-knowledgebase/src/queryCodebase.test.ts`, which verifies the sqlite-vec semantic path plus metadata-safe lexical recall instead of forcing all retrieval through one store.
