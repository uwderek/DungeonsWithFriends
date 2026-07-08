---
title: Sprint Change Proposal - Platform Rebaseline
status: draft
created: 2026-07-07
updated: 2026-07-07
change_scope: major
mode: batch
---

# Sprint Change Proposal: Platform Rebaseline

## 1. Issue Summary

The existing March 2026 BMAD planning artifacts are thorough but encode platform decisions that no longer match the desired project direction. The new direction is:

- no Python in product code,
- Expo remains the primary UI/app framework,
- Gluestack/Tailwind remains the primary component and styling framework while behavior stays headless where practical,
- TinyBase remains the local-first product store,
- now-roadmap work stays fully local and login-free,
- TypeScript is used for as much implementation as practical,
- Tauri/Rust is reserved for OS-specific downloaded-app functionality or server/local process wrappers when needed,
- later server sync targets Neon/Postgres,
- later hosting targets Cloudflare,
- later auth/login targets WorkOS,
- imported ADRs in `docs/decisions` cleaned in place for DungeonsWithFriends.

This is a major course correction because it affects PRD constraints, architecture, UX assumptions, epics, prepared stories, provider seams, test tooling, and deployment strategy.

## 2. Impact Analysis

### Epic Impact

- Epic 1 remains now-roadmap work after documentation repair; keep the Expo creator shell and bind it to local TinyBase/TypeScript contracts.
- Epic 2 remains now/next work; playable sheets should start fully local with TinyBase and export/import before server sync.
- Epic 3 auth/account work moves to later roadmap and should be rewritten around WorkOS only when login is needed.
- Epic 4 should split into local campaign records now/next and hosted collaboration later.
- Epic 5 should begin with local scene/contracts and renderer-independent models before hosted rooms.
- Epic 6 should begin with local action queues and conflict envelopes, then later sync to hosted authority.
- Epic 7 AI work moves later behind governance, cost controls, and hosted execution boundaries.
- Epic 8 marketplace/cloud sync/governance moves later and depends on auth, entitlement, hosted storage, and moderation.
- Epic 9 shared display can keep local/Expo contracts early, while Tauri/native/immersive work stays later.

### Story Impact

Current Story 1.1 can remain in review as aligned Expo creator-shell evidence. The next ready-for-dev story should not be created until the documentation repair plan updates the platform foundation and story sequencing.

New or rewritten foundation stories are needed for:

- login-free local app flow,
- TinyBase local storage, migrations, export, and import,
- removal of account/login scaffolding from now-roadmap paths,
- TypeScript shared domain contracts,
- system template and custom JSON binding,
- local action/event envelopes for later sync,
- imported ADR compliance gates.

### Artifact Conflicts

- `prd.md` references hosted sync in product scope and journeys.
- `architecture.md` selects Expo/Gluestack/NativeWind plus TinyBase and hosted sync as the target foundation; preserve Expo/Gluestack/Tailwind/TinyBase while removing login/cloud-sync from now work.
- `ux-design-specification.md` assumes older auth/sync sequencing and should make local/no-login the primary now journey.
- `epics.md` includes hosted-sync/TinyBase additional requirements and story sequencing based on the old architecture.
- `sprint-status.yaml` was also incomplete relative to current `epics.md`; it has been refreshed but remains blocked by the documentation repair action item.

### Technical Impact

- Existing Expo implementation remains the primary UI direction, not merely throwaway prototype code.
- Legacy account and hosted-sync code should be removed from now-roadmap paths or isolated behind later provider adapters.
- Future Cloudflare, WorkOS, Neon/Postgres, and Tauri provider code must not leak into feature UI.
- Tauri/Rust introduces Rust tests, Tauri command tests, and local migration/update safety work only when OS-specific downloaded-app or local/server process needs are approved.
- Python helper scripts in `_bmad/scripts` are BMAD tooling, not product code; replacing them is separate.

## 3. Recommended Approach

Recommended path: Hybrid of direct adjustment plus MVP review.

Rationale:

- Direct adjustment is viable for documentation and provider boundaries.
- Full rollback is not warranted because existing code and Story 1.1 still provide useful implementation evidence.
- MVP review is necessary because hosting, auth, local-client, sync, and storage choices all changed.

Effort: High.

Risk: High if development continues against old stories; medium if rebaseline is done before the next story.

## 4. Detailed Change Proposals

### PRD

Old target:

- TinyBase synchronization and Expo-oriented app assumptions.

New target:

- Local-first product requirements centered on Expo/Gluestack/Tailwind/TinyBase, fully local operation, and no login for now-roadmap work.
- Future notes for Tauri/Rust, Neon/Postgres, Cloudflare, and WorkOS remain in later roadmap sections.

### Architecture

Old target:

- Expo/Gluestack/NativeWind starter, TinyBase local persistence, and hosted auth/sync assumptions.

New target:

- Expo/Gluestack/Tailwind primary app with headless TypeScript behavior.
- TinyBase local persistence, migrations, export, and import.
- Sync-ready ports for later Neon/Postgres.
- Later Cloudflare hosted services selected per responsibility.
- Later WorkOS AuthKit behind an auth port.
- Later Tauri/Rust boundaries for OS-specific downloaded-app or local/server process needs.
- Imported ADRs interpreted through their own cleaned DWF front matter and `DungeonsWithFriends Application` sections.

### UX

Old target:

- Mobile-first app and desktop creator assumptions tied to the older frontend stack.

New target:

- Keep the one-handed async play and desktop creator experience goals.
- Make local/no-login app entry the current primary journey.
- Keep account/auth onboarding, hosted sync, install/update, and native permission UX in later roadmap sections until needed.
- Keep creator/play/shared-display/immersive surfaces separate.

### Epics and Stories

Old target:

- Continue Epic 1 creator implementation sequence directly.

New target:

- Insert/rewrite local foundation work before the next feature story:
  - documentation repair and roadmap authority,
  - login-free local app flow,
  - TinyBase storage/export/import/migrations,
  - account/auth isolation from now paths,
  - TypeScript shared contracts,
  - system template/custom JSON binding,
  - ADR compliance.

## 5. Implementation Handoff

Change scope: Major.

Handoff recipients:

- Product Manager: update PRD and MVP scope around platform constraints.
- Architect: rewrite architecture and cite cleaned ADR files directly.
- Scrum Master: regenerate epics, stories, and sprint status.
- Developer: only implement after the documentation repair plan is approved or explicitly waived.
- QA/Test Architect: rebaseline verification for Expo/TypeScript/TinyBase now, with later coverage for Tauri, Cloudflare, Neon, and WorkOS seams.

Success criteria:

- No now-roadmap story requires login, hosted sync, WorkOS, Cloudflare, Neon/Postgres, or Tauri.
- Expo/Gluestack/Tailwind/TinyBase decisions are captured as current now-roadmap baseline.
- WorkOS/Cloudflare/Neon/Tauri decisions are captured as later or boundary decisions.
- Imported ADRs each carry their own DWF disposition, status, and roadmap lane.
- Sprint status carries an explicit documentation repair action item.
- New implementation stories can trace to updated PRD/architecture/ADR decisions.
