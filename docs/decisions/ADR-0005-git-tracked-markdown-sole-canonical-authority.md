---
adrId: ADR-0005
shortName: git-canonical
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# Git-Tracked Markdown Is the Sole Canonical Authority

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** Git-tracked Markdown remains the canonical authority for planning docs, ADRs, and curated requirements. Generated indexes are derived, not governing.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Curated knowledge (ADRs, requirements) must have one unambiguous source of truth that is human-reviewable and version-controlled.

## Decision

Git-tracked Markdown is the sole canonical authority for curated artifacts; the index (FTS + graph edges) is always a derived, rebuildable projection, never authoritative.

## Consequences

Curated truth is reviewable and diffable in Git; the index can be rebuilt at any time without data loss; no second source of truth can drift.

## Alternatives Considered

Treating the index/database as authoritative was rejected because it makes curated truth non-reviewable and non-portable.

## Supersession Notes

None.

## Promotion Notes

Promoted from `proposed` to `accepted` on 2026-05-24 as part of Epic 249 ADR status hygiene backfill. The canonical-Markdown-as-truth posture is in effect: `architectureDecisionFrontMatter.ts` parses canonical ADR markdown as the sole authority, `ArchitectureDecisionIndexService.ts` treats its index as a rebuildable projection, and Story 249.1 added the `check-adr-path.js` quality script that mechanically rejects ADRs authored outside `docs/decisions/`.
