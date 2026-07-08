# Roadmap Priority Index

Last updated: 2026-07-07

This file owns feature priority and sequencing. The lane files describe scope boundaries and should stay stable as features are added.

## Lanes

- [Now](./now.md): local, login-free foundation.
- [Next](./next.md): local gameplay depth and sync-ready contracts.
- [Later](./later.md): hosted sync, auth, marketplace, AI, and native OS-specific capabilities.

## Priority Ledger

| Priority | Feature | Lane | Status | Notes |
| --- | --- | --- | --- | --- |
| P0 | Documentation repair and BMAD rebaseline | Now | Open | Repair PRD, architecture, UX, epics, story templates, and sprint status before the next implementation story. |
| P1 | Login-free local app flow | Now | Open | The app must open into useful local functionality without account creation, hosted sync, or WorkOS. |
| P2 | TinyBase local data foundation | Now | Open | Define local stores, migrations, export/import, and test coverage for creator and playable-sheet data. |
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
| P13 | AI assistance and automation | Later | Candidate | Requires cost controls, governance, safety boundaries, and hosted execution. |

## Lane Rules

- Now work must not require login, hosted sync, Cloudflare, WorkOS, Neon/Postgres, or Tauri.
- Next work may introduce sync-ready ports and envelopes, but must remain useful fully locally.
- Later work may depend on hosted services, auth, native OS-specific capabilities, or AI infrastructure.
- The priority ledger can change without editing the lane files unless lane boundaries themselves change.

## Related Authority

- [DWF Platform Baseline ADR](../decisions/ADR-0059-dwf-platform-baseline-typescript-tauri-cloudflare-workos.md)
- Cleaned ADR corpus: individual files in `../decisions/` carry DWF disposition and roadmap lane metadata.
- [Documentation Repair Plan](../../_bmad-output/planning-artifacts/documentation-repair-plan-2026-07-07.md)
