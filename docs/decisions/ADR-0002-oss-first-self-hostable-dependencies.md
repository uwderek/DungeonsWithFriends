---
adrId: ADR-0002
shortName: oss-first
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: now-later
source: imported-and-cleaned
---
# OSS-First Self-Hostable Dependencies

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** now-later.
- **Project application:** Prefer open, portable dependencies while recognizing the accepted DWF stack: Expo, Gluestack/Tailwind, TinyBase, TypeScript now, with Neon/Postgres, Cloudflare, WorkOS, and Tauri only in their later or boundary roles.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Every retrieval dependency must be open and self-hostable so the product is not coupled to a proprietary or heavyweight runtime.

## Decision

The knowledge stack uses only sqlite-vec, SQLite FTS5, Tree-sitter, sentence-transformers/E5, and TinyBase — all open and self-hostable.

## Consequences

No proprietary lock-in; the entire stack can run in CI and on a developer laptop; scale-out backends remain optional behind the same contract.

## Alternatives Considered

Adopting OpenSearch as the default store was rejected because a heavyweight JVM server violates the local-first and OSS-first principles; it remains an optional power-user backend.

## Supersession Notes

None.

## Promotion Notes

Promoted from `proposed` to `accepted` on 2026-05-24 as part of Epic 249 ADR status hygiene backfill. The governed code path (`ActionPlan/mcp/code-knowledgebase/**`) ships with sqlite-vec + FTS5 + Tree-sitter + E5 + TinyBase only; no proprietary runtime is in the default retrieval path. The decision is in effect, not speculative.

## Confirmation

Confirmed by `ActionPlan/mcp/code-knowledgebase/src/knowledgeRetrievalBackend.test.ts`, which keeps optional retrieval backends explicitly opt-in, offline in tests, and self-hosted when selected so the default knowledge path remains OSS-first and laptop-runnable.
