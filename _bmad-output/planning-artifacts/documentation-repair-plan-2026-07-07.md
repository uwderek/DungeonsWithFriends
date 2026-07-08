---
title: Documentation Repair Plan - DungeonsWithFriends
status: draft
created: 2026-07-07
updated: 2026-07-07
source: sprint-change-proposal-2026-07-07
---

# Documentation Repair Plan: DungeonsWithFriends

## Goal

Repair the current BMAD documentation so development can continue from one coherent baseline: Expo primary UI, Gluestack/Tailwind headless components, TinyBase fully local storage now, no login now, Tauri/Rust only for OS-specific downloaded-app or local/server process needs, Neon/Postgres sync later, Cloudflare hosting later, WorkOS auth later, no Python product code, and cleaned self-contained ADRs.

## Repair Sequence

1. Decision baseline
   - Treat `docs/decisions/ADR-0059-dwf-platform-baseline-typescript-tauri-cloudflare-workos.md` as the current platform baseline.
   - Treat each cleaned ADR in `docs/decisions/` as self-contained; the DWF front matter and `DungeonsWithFriends Application` section define project disposition and scope.
   - Do not recreate a central imported-ADR mapping file.
   - Add new ADRs only when a decision cannot be represented by ADR-0059 or an existing cleaned ADR.

2. Roadmap authority
   - Use `docs/roadmap/index.md` as the priority ledger.
   - Keep `docs/roadmap/now.md`, `docs/roadmap/next.md`, and `docs/roadmap/later.md` as lane boundary documents.
   - Change priorities in the index without rewriting lane files unless lane boundaries change.

3. PRD rewrite
   - Preserve the product vision: asynchronous tabletop play, creator tooling, local-first resilience, and future AI assistance.
   - Remove login-required flows, hosted sync, WorkOS, Cloudflare, Neon/Postgres, and Tauri from now-roadmap requirements.
   - Define MVP around local creator workspace, local playable sheets, TinyBase persistence, export/import, and local action/event contracts.
   - Move account/auth, hosted sync, marketplace, AI, and native OS-specific features to later roadmap sections.

4. Architecture rewrite
   - Make Expo/Gluestack/Tailwind/TinyBase the now architecture.
   - Keep behavior headless in TypeScript modules, hooks, schemas, state machines, and domain contracts.
   - Define later provider ports for Neon/Postgres sync, Cloudflare hosting, WorkOS auth, and Tauri/Rust OS-specific capabilities.
   - Remove hosted auth/sync providers as target now-roadmap architecture decisions.

5. UX rewrite
   - Make the primary now journey local and login-free.
   - Preserve one-handed async play, creator ergonomics, story cards, contextual action drawers, and definitive local state.
   - Move sign-in, hosted account onboarding, install/update, marketplace, AI, and native permission UX to later roadmap sections.

6. Epics and stories rewrite
   - Start with documentation repair, login-free app flow, TinyBase local data foundation, creator continuation, and system template/custom JSON binding.
   - Sequence local playable sheets, local campaign/event ledger, local action queues, and tactical scene contracts before sync/auth/server work.
   - Rewrite Story 1.1 follow-up guidance to continue the Expo creator shell rather than replace it with Tauri.
   - Move WorkOS, Cloudflare, Neon/Postgres, marketplace, AI, and broad Tauri work to later epics.

7. Sprint status refresh
   - Update `_bmad-output/implementation-artifacts/sprint-status.yaml` from repaired epics and stories.
   - Keep `repair-current-docs` open until the repaired PRD, architecture, UX, epics, and story templates agree.

8. Verification
   - Run Markdown link checks over `docs/index.md`, `docs/roadmap/*`, `docs/project-context.md`, `docs/architecture.md`, and repaired planning artifacts.
   - Validate sprint status for duplicate keys and story alignment.
   - Use the sanctioned test orchestrator when code changes are introduced.

## Deliverables

- Repaired PRD.
- Repaired architecture document.
- Repaired UX design specification.
- Repaired epics and story list.
- Updated Story 1.1 handoff and next-story candidate.
- Refreshed sprint status.
- Optional follow-up ADRs for decisions discovered during repair.

## Blocker

Do not create the next implementation story until `repair-current-docs` is done or Derek explicitly waives this gate.
