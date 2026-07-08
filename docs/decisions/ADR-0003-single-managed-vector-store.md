---
adrId: ADR-0003
shortName: vector-store
status: superseded
date: 2026-07-07
dwfDisposition: superseded
roadmapLane: none
source: imported-and-cleaned
---
# Single Managed Vector Store For All Knowledge

## DungeonsWithFriends Application

- **DWF disposition:** superseded.
- **Roadmap lane:** none.
- **Project application:** Do not use a single managed vector store as a DWF baseline. Preserve the source supersession and route future storage/search choices through feature-specific ADRs.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

superseded

## Context

An early option considered consolidating every knowledge artifact (code, text, memory, audit) into one managed vector database for simplicity.

## Decision

Route all artifacts through a single managed vector store. (This decision was later rejected and superseded.)

## Consequences

Would have forced lossy embedding of exact-text and reactive-UI data and introduced an always-on managed dependency.

## Alternatives Considered

The artifact-routing matrix (sqlite-vec + FTS5 + TinyBase + file-first + JSONL) was preferred.

## Supersession Notes

None.
