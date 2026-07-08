# Roadmap Priority Index

Last updated: 2026-07-08

This file owns feature priority and sequencing. The lane files describe scope boundaries and should stay stable as features are added.

## Lanes

- [Now](./now.md): local, login-free foundation.
- [Next](./next.md): local gameplay depth and sync-ready contracts.
- [Later](./later.md): hosted sync, auth, marketplace, AI, and native OS-specific capabilities.

## Priority Ledger

| Priority | Feature | Lane | Status | Notes |
| --- | --- | --- | --- | --- |
| P0 | Documentation repair and BMAD rebaseline | Now | Done | PRD, architecture, UX, epics, story templates, and sprint status now reflect the local-first baseline. |
| P1 | Login-free local app flow | Now | Done | The app opens into useful local functionality without account creation, hosted sync, or WorkOS. |
| P2 | TinyBase local data foundation | Now | In Progress | Define local stores, migrations, export/import, and test coverage for creator and playable-sheet data. |
| P3 | Creator workspace continuation | Now | Open | Continue the Expo creator shell from Story 1.1 after doc repair confirms the local-first target. |
| P4 | System template and custom JSON binding | Now | Open | Bind visible components to structured system/template JSON without hardcoded game-system assumptions. |
| P5 | Local playable sheet runtime | Next | Open | Use TinyBase-backed local character data and headless rules/dice contracts before server sync. |
| P6 | Local campaign/event ledger | Next | Open | Create local campaign actions, pending state, and conflict envelopes that later sync can consume. |
| P7 | Tactical scene local contracts | Next | Open | Define scene, token, visibility, and renderer contracts locally before hosted rooms. |
| P8 | Tauri OS-specific downloaded-app capabilities | Later | Candidate | Add only for local filesystem, native shell, local process, update, or OS integration needs Expo cannot own. |
| P9 | Neon/Postgres sync | Later | Candidate | Sync TinyBase/local stores to Postgres through explicit sync ports. |
| P10 | Cloudflare hosted platform | Later | Candidate | Add Workers, Pages, R2, Queues, and coordination services when hosted surfaces are required. |
| P11 | WorkOS auth/login | Later | Candidate | Auth and login are explicitly later-roadmap work. |
| P12 | Marketplace and governance | Later | Candidate | Requires account, entitlement, moderation, audit, and hosted storage decisions. |
| P13 | AI assistance and automation | Later | Candidate | Requires cost controls, governance, and safety boundaries; must not be architecturally hosted-only (ADR-0060). |
| P14 | Dice roll resolution provenance | Now | Done | `resolution_source` on dice rolls with validated manual entry (ADR-0063). |
| P15 | Local async play loop | Now | Open | Epic 6: play-by-post threads, turn submission, and pending-action resolution on the event ledger spine (ADR-0062). |
| P16 | Standalone tool packaging foundation | Now | Open | Epic 7: enforced headless module boundaries and packageable tool surfaces for standalone/embedded use. |
| P17 | Rules and compendium content contracts | Now | Open | Epic 8: schemas for structured rules, compendium entries, source corpus, and licensing metadata (ADR-0064). |
| P18 | AI content generation and ingestion | Next | Open | Epic 9: ingest documented game systems and generate content into rules/compendium contracts behind governed actions. |
| P19 | Voice assistant and voiced DM | Later | Candidate | Rules-aware voice/chat assistant, teaching, and fully voiced DM as clients of the governed action registry. |
| P20 | TV casting and shared displays | Later | Candidate | Scene-contract consumers for casting the battle map or narrative view to a TV. |
| P21 | LAN-hosted sessions | Later | Candidate | Local device session authority through the transport-agnostic sync port (ADR-0061). |
| P22 | External VTT integration adapters | Later | Candidate | Embed/interop adapters (for example Roll20) built on the Epic 7 packaging foundation. |

## Lane Rules

- Now work must not require login, hosted sync, Cloudflare, WorkOS, Neon/Postgres, or Tauri.
- Next work may introduce sync-ready ports and envelopes, but must remain useful fully locally.
- Later work may depend on hosted services, auth, native OS-specific capabilities, or AI infrastructure.
- The priority ledger can change without editing the lane files unless lane boundaries themselves change.

## Related Authority

- [Long-Term Product Vision](../product-vision.md) and [Vision Capability Map ADR](../decisions/ADR-0060-long-term-vision-capability-map.md)
- [DWF Platform Baseline ADR](../decisions/ADR-0059-dwf-platform-baseline-typescript-tauri-cloudflare-workos.md)
- Cleaned ADR corpus: individual files in `../decisions/` carry DWF disposition and roadmap lane metadata.
- [Documentation Repair Plan](../../_bmad-output/planning-artifacts/documentation-repair-plan-2026-07-07.md)
