---
title: 'Project Baseline Readiness'
type: 'feature'
created: '2026-07-08'
status: 'done'
review_loop_iteration: 0
baseline_commit: 'd7f493b0489974b37b6e5f5440e44b4a144354c0'
context:
  - '{project-root}/docs/project-context.md'
  - '{project-root}/docs/decisions/ADR-0059-dwf-platform-baseline-typescript-tauri-cloudflare-workos.md'
  - '{project-root}/docs/roadmap/index.md'
  - '{project-root}/_bmad-output/planning-artifacts/documentation-repair-plan-2026-07-07.md'
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** The app code is now mostly aligned with the updated architecture, but the BMAD planning spine, sprint tracking, local persistence contracts, and next-story handoff are still too stale to safely add features.

**Approach:** Re-baseline the active PRD, architecture, UX, epics, sprint status, success-management docs, and local TinyBase seams so feature work can proceed from one coherent local-first, login-free baseline.

## Boundaries & Constraints

**Always:** Keep Expo as the primary UI, TinyBase as the local-first store, TypeScript as the product-code default, tests co-located, and docs/decisions git-tracked.

**Ask First:** Introducing hosted sync, auth/login, WorkOS integration, Cloudflare runtime code, Neon/Postgres code, Tauri/Rust code, Python product code, or new runtime dependencies.

**Never:** Reintroduce Nhost, make now-roadmap stories require accounts or network access, treat historical planning docs as current authority, or build visible gameplay scope beyond baseline contracts and handoff files.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Local app startup | Empty or saved local TinyBase snapshot | Store initializes locally and dashboard can render without login | Corrupt snapshots are ignored and replaced by a valid empty snapshot |
| Manual checkpoint | User or test triggers local sync action | TinyBase tables are saved to local persistence and timestamp updates | Persistence failure logs a local error and returns to idle |
| Planning handoff | Developer reads BMAD artifacts | PRD, architecture, UX, epics, sprint status, and story files agree on Now/Next/Later lanes | Historical assumptions are moved to archive/background wording |
| Export/import | Local data is exported or imported | Data uses a versioned JSON envelope with migration metadata | Invalid versions or malformed payloads fail with typed errors |

</frozen-after-approval>

## Code Map

- `_bmad-output/planning-artifacts/prd.md` -- repaired product requirements authority.
- `_bmad-output/planning-artifacts/architecture.md` -- repaired technical architecture authority.
- `_bmad-output/planning-artifacts/ux-design-specification.md` -- repaired UX journey authority.
- `_bmad-output/planning-artifacts/epics.md` -- repaired Now/Next/Later epic and story backlog.
- `_bmad-output/implementation-artifacts/sprint-status.yaml` -- implementation gate and backlog status.
- `_bmad-output/implementation-artifacts/1-1-creator-workspace-shell.md` -- Story 1.1 review handoff.
- `docs/testing/strategy.md` -- direct repository verification expectations.
- `docs/data/local-store-contracts.md` -- TinyBase table/version/migration contracts.
- `docs/data/template-binding-contracts.md` -- creator template and binding contracts.
- `docs/data/export-import-format.md` -- local backup/import envelope.
- `DungeonsWithFriends/src/shared/store/*` -- local store, persistence, migration, export/import seams.
- `DungeonsWithFriends/src/features/creator/model/*schema.ts` -- creator template/binding schema seams.
- `DungeonsWithFriends/src/features/character/model/character-sheet-schema.ts` -- playable sheet schema seam.
- `DungeonsWithFriends/src/shared/providers/sync-provider.tsx` -- provider integration for local store persistence.

## Tasks & Acceptance

**Execution:**
- [x] `_bmad-output/planning-artifacts/prd.md`, `architecture.md`, `ux-design-specification.md`, `epics.md` -- rewrite as current local-first authorities with later hosted/auth/native scope clearly separated.
- [x] `_bmad-output/implementation-artifacts/sprint-status.yaml` -- refresh backlog to the repaired epic/story set and mark `repair-current-docs` complete.
- [x] `_bmad-output/implementation-artifacts/1-1-creator-workspace-shell.md`, `1-2-system-template-selection-and-custom-json-binding.md`, `1-3-component-registry-and-binding-contract.md`, `1-4-local-save-load-preview-export-import.md` -- update Story 1.1 handoff and create next ready stories.
- [x] `docs/testing/strategy.md`, `docs/data/local-store-contracts.md`, `docs/data/template-binding-contracts.md`, `docs/data/export-import-format.md`, `docs/index.md` -- create/update success-management docs and index links.
- [x] `DungeonsWithFriends/src/shared/store/local-store.ts`, `persistence.ts`, `migrations.ts`, `export-import.ts` plus co-located tests -- add typed local TinyBase persistence/export seams.
- [x] `DungeonsWithFriends/src/features/creator/model/system-template-schema.ts`, `template-binding-schema.ts`, `DungeonsWithFriends/src/features/character/model/character-sheet-schema.ts` plus tests -- add headless schema seams for next features.
- [x] `DungeonsWithFriends/src/shared/providers/sync-provider.tsx` and test -- load, checkpoint, and expose local persistence state without hosted sync.

**Acceptance Criteria:**
- Given a developer reads current BMAD artifacts, when they compare PRD, UX, architecture, epics, sprint status, and roadmap, then Now work is local, login-free, and TinyBase-first with hosted/auth/native scope later.
- Given the app starts with no local data, when the store provider initializes, then it creates a valid empty local store snapshot without network or login.
- Given a malformed saved snapshot, when local persistence loads, then the app falls back to a valid empty snapshot and records a local error state.
- Given local tables exist, when export/import helpers run, then they produce and consume a versioned JSON envelope validated by TypeScript/Zod tests.
- Given the next development story is selected, when sprint status is inspected, then Story 1.2 is ready-for-dev and traces to repaired docs.

## Verification

**Commands:**
- `npx tsc --noEmit` from `DungeonsWithFriends/` -- passed.
- Legacy provider/auth-screen `rg` scan across active code, planning, story, roadmap, data, and testing docs -- passed with no matches.
- `git diff --check` -- passed; Git printed Windows CRLF normalization warnings only.
- Sprint status duplicate-key PowerShell check -- passed with 28 unique status keys.
- TinyBase runtime probe for empty tables and first row write -- passed.
- Direct Jest/Playwright commands were not run during that session; current repo guidance now supports direct verification commands.

## Review Notes

- Blind review and edge-case review were run in-process against the diff because no separate review-agent handoff tool was exposed.
- Patch finding fixed: TinyBase does not retain empty table keys, so empty snapshots/stores now treat `tables: {}` as valid and docs clarify that table names are the write contract.
- Patch finding fixed: local persistence read failures now recover to an empty snapshot with a typed `storage_unavailable` error.

## Suggested Review Order

**Planning Authority**

- Start with current Now/Next/Later product scope.
  [`prd.md:35`](../planning-artifacts/prd.md#L35)

- Check provider boundaries before reading implementation details.
  [`architecture.md:47`](../planning-artifacts/architecture.md#L47)

- Confirm Story 1.2 is the next actionable slice.
  [`epics.md:23`](../planning-artifacts/epics.md#L23)

- Verify sprint state matches the repaired backlog.
  [`sprint-status.yaml:44`](sprint-status.yaml#L44)

**Local Store And Persistence**

- Review table constants and empty-store semantics first.
  [`local-store.ts:7`](../../DungeonsWithFriends/src/shared/store/local-store.ts#L7)

- Inspect load recovery before checkpoint writes.
  [`persistence.ts:42`](../../DungeonsWithFriends/src/shared/store/persistence.ts#L42)

- Check provider hydration and manual checkpoint wiring.
  [`sync-provider.tsx:20`](../../DungeonsWithFriends/src/shared/providers/sync-provider.tsx#L20)

- Verify versioned export/import keeps mutation after validation.
  [`export-import.ts:5`](../../DungeonsWithFriends/src/shared/store/export-import.ts#L5)

**Domain Contracts**

- Confirm system template JSON shape for Story 1.2.
  [`system-template-schema.ts:15`](../../DungeonsWithFriends/src/features/creator/model/system-template-schema.ts#L15)

- Review binding contracts for component-to-template mapping.
  [`template-binding-schema.ts:8`](../../DungeonsWithFriends/src/features/creator/model/template-binding-schema.ts#L8)

- Check playable sheet values remain local and generic.
  [`character-sheet-schema.ts:5`](../../DungeonsWithFriends/src/features/character/model/character-sheet-schema.ts#L5)

**Success Management**

- Make sure the active doc index points to current authority.
  [`index.md:5`](../../docs/index.md#L5)

- Review TinyBase table rules and empty export note.
  [`local-store-contracts.md:34`](../../docs/data/local-store-contracts.md#L34)

- Confirm the current release gate and direct repository verification posture.
  [`strategy.md:41`](../../docs/testing/strategy.md#L41)

**Tests**

- Check store tests reflect TinyBase empty-table behavior.
  [`local-store.test.ts:5`](../../DungeonsWithFriends/src/shared/store/local-store.test.ts#L5)

- Check storage failure recovery coverage.
  [`persistence.test.ts:28`](../../DungeonsWithFriends/src/shared/store/persistence.test.ts#L28)

- Check export/import validation coverage.
  [`export-import.test.ts:6`](../../DungeonsWithFriends/src/shared/store/export-import.test.ts#L6)

- Check provider context exposes persistence state.
  [`sync-provider.test.tsx:13`](../../DungeonsWithFriends/src/shared/providers/sync-provider.test.tsx#L13)
