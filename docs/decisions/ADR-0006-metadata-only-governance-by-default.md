---
adrId: ADR-0006
shortName: metadata-only
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: later
source: imported-and-cleaned
---
# Metadata-Only Governance By Default

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** later.
- **Project application:** Apply metadata-only governance to future player, GM, admin, AI summary, and support surfaces using DWF-specific trust, safety, and redaction fields.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Knowledge results cross MCP and agent boundaries, so they must not leak raw source unless inside an approved workspace and model boundary.

## Decision

All knowledge results carry metadataOnly, trustClassification, redactionState, sourceDigest, freshness, and omitted-source reporting; raw source is exposed only inside approved boundaries.

## Consequences

Decision and code knowledge can be safely federated and cited without disclosing raw content; governance is auditable and fail-closed.

## Alternatives Considered

Returning raw source by default was rejected as a privacy and governance violation.

## Supersession Notes

None.

## Promotion Notes

Promoted from `proposed` to `accepted` on 2026-05-24 as part of Epic 249 ADR status hygiene backfill. The metadata-only posture is in effect across `ActionPlan/mcp/code-knowledgebase/**`: every knowledge result carries `metadataOnly`, `trustClassification`, `redactionState`, `sourceDigest`, and `freshness` fields; raw source crosses the boundary only with policy approval. The Story 249.2 `inject-governing-adrs.mjs` hook upholds the same posture for ADR citations.

## Confirmation

Confirmed by `ActionPlan/mcp/code-knowledgebase/src/queryCodebase.test.ts` and `ActionPlan/mcp/code-knowledgebase/src/traceEpic.test.ts`, which assert metadata-only result envelopes, source digests, freshness, and omitted-context reporting. The PreToolUse hook `.claude/hooks/inject-governing-adrs.mjs` confirms the same metadata-only citation posture before governed edits.
