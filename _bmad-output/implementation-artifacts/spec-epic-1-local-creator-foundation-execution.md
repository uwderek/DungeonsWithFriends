---
title: 'Epic 1 Local Creator Foundation Execution'
type: 'feature'
created: '2026-07-08'
status: 'done'
review_loop_iteration: 0
baseline_commit: '034644816f3da75ed89c1ac0763f5b5397aa9ab8'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/docs/decisions/ADR-0059-dwf-platform-baseline-typescript-tauri-cloudflare-workos.md'
  - '{project-root}/docs/data/local-store-contracts.md'
  - '{project-root}/docs/data/template-binding-contracts.md'
  - '{project-root}/docs/data/export-import-format.md'
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** The creator workspace has component CRUD and local persistence seams, but system template selection, custom JSON import, component-to-field binding, preview, and manual export/import are not connected into the app. Without those seams, the next playable-sheet work has no usable local template contract to build from.

**Approach:** Implement the prepared Epic 1 local creator specs as one coherent workflow inside the existing creator route: built-in/custom system templates, selected-template state, validated template storage, binding helpers, local preview, and manual checkpoint/export/import controls backed by TinyBase.

## Boundaries & Constraints

**Always:** Keep all work local, login-free, Expo/React Native UI first, TinyBase-backed, TypeScript-only for product code, schema-validated before writes, co-located tests, and aligned with the current docs/data contracts.

**Ask First:** Introducing hosted sync, auth/login, WorkOS, Cloudflare, Neon/Postgres, Tauri/Rust, Python product code, new runtime dependencies, marketplace scope, or playable-sheet runtime behavior.

**Never:** Reintroduce the removed hosted-provider baseline, create a parallel creator route, mutate local store on failed import, delete stale user bindings automatically, or require network/account state for now-roadmap creator work.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Empty workspace | No selected system template | Canvas shows guided local system selection/import actions | No store mutation until valid template is chosen |
| Built-in template | User chooses a built-in template | Template validates, persists to `system_templates`, and becomes selected | Validation failure shows recoverable error |
| Custom template JSON | Valid JSON matching `systemTemplateSchema` | Template persists locally and becomes selected | Invalid JSON/schema leaves current store unchanged |
| Binding creation | Existing component and selected template field | Binding validates and writes to `template_bindings` | Missing component/field returns typed validation error |
| Stale binding check | Template field removed or renamed | Stale binding ids are reported without deleting bindings | Current creator work remains intact |
| Local import | Exported snapshot JSON | Snapshot validates/migrates, then replaces store | Malformed/future-version import returns typed error and preserves current data |

</frozen-after-approval>

## Code Map

- `DungeonsWithFriends/src/features/creator/model/system-template-store.ts` -- new local template selection/import helpers.
- `DungeonsWithFriends/src/features/creator/model/template-binding-store.ts` -- new binding validation and stale-binding helpers.
- `DungeonsWithFriends/src/features/creator/ui/CreatorToolsScreen.tsx` -- existing creator route to wire template selection, preview, checkpoint, export, and import controls.
- `DungeonsWithFriends/src/features/creator/ui/creator-workspace-empty-state.tsx` -- guided empty state entry point.
- `DungeonsWithFriends/src/features/creator/ui/creator-template-panel.tsx` -- new center-panel UI for selected template, bindings, preview, and import/export.
- `DungeonsWithFriends/src/shared/store/export-import.ts` -- existing validated snapshot import/export seam.
- `_bmad-output/implementation-artifacts/sprint-status.yaml` -- status tracking for Stories 1.2-1.4.
- `_bmad-output/implementation-artifacts/1-2-system-template-selection-and-custom-json-binding.md`, `1-3-component-registry-and-binding-contract.md`, `1-4-local-save-load-preview-export-import.md` -- story handoff/status updates.

## Tasks & Acceptance

**Execution:**
- [x] `DungeonsWithFriends/src/features/creator/model/system-template-store.ts` plus tests -- add built-in template, local import, selected-template persistence, and non-mutation failure coverage.
- [x] `DungeonsWithFriends/src/features/creator/model/template-binding-store.ts` plus tests -- add binding creation validation, stale binding reporting, and export-inclusion coverage.
- [x] `DungeonsWithFriends/src/features/creator/ui/creator-workspace-empty-state.tsx` and tests -- expose select/import actions without hosted assumptions.
- [x] `DungeonsWithFriends/src/features/creator/ui/creator-template-panel.tsx` plus tests -- render selected template fields, binding summary, stale binding warnings, local preview, checkpoint/export/import controls, and recoverable errors.
- [x] `DungeonsWithFriends/src/features/creator/ui/CreatorToolsScreen.tsx` and tests -- wire the new panel into the existing creator workspace and keep mobile desktop-required behavior intact.
- [x] `_bmad-output/implementation-artifacts/sprint-status.yaml` and Story 1.2-1.4 files -- move implemented stories to review and record verification notes.

**Acceptance Criteria:**
- Given a creator opens the workspace without a selected template, when they view the canvas, then local template select/import actions are visible and no login/network prompt appears.
- Given a valid built-in or custom system template, when it is selected/imported, then it is stored in TinyBase and remains available to the creator workspace.
- Given a component and selected template field, when the creator binds them, then the binding validates against component and system field existence.
- Given a stale binding, when the selected template is previewed, then the stale binding is reported without deleting creator data.
- Given local creator data, when export/import controls run, then the versioned TinyBase envelope is used and failed imports preserve current rows.

## Verification

**Commands:**
- `npx tsc --noEmit` from `DungeonsWithFriends/` -- passed.
- Legacy provider/auth-screen `rg` scan across active code/story docs -- passed with no matches.
- `git diff --check` -- passed; Git printed Windows CRLF normalization warnings only.
- Sprint status duplicate-key check -- passed with 28 unique status keys.
- Test Orchestrator MCP lookup -- unavailable in this session; direct Jest/Playwright commands were not run because package scripts intentionally block them.

## Review Notes

- Blind Hunter and Edge Case Hunter review passes were run in-process because subagent tooling is present but disallows spawning unless the user explicitly asks for subagents.
- Patch finding fixed: malformed selected system-template rows imported through the generic snapshot path could throw during render; selected template reads now safe-parse and return empty state on invalid rows.
- Patch finding fixed: repeated binding on the same template field could accumulate duplicate binding rows; binding creation now updates the existing field binding idempotently.

## Suggested Review Order

**Creator Workflow**

- Start with the connected creator canvas entry point.
  [`creator-template-panel.tsx:38`](../../DungeonsWithFriends/src/features/creator/ui/creator-template-panel.tsx#L38)

- Check how the existing route hosts the new panel.
  [`CreatorToolsScreen.tsx:118`](../../DungeonsWithFriends/src/features/creator/ui/CreatorToolsScreen.tsx#L118)

- Review empty-state selection and custom JSON import controls.
  [`creator-workspace-empty-state.tsx:46`](../../DungeonsWithFriends/src/features/creator/ui/creator-workspace-empty-state.tsx#L46)

**Template Storage**

- Review the built-in template and serialized row contract.
  [`system-template-store.ts:18`](../../DungeonsWithFriends/src/features/creator/model/system-template-store.ts#L18)

- Check safe parsing for malformed imported snapshot rows.
  [`system-template-store.ts:72`](../../DungeonsWithFriends/src/features/creator/model/system-template-store.ts#L72)

- Confirm custom JSON validates before TinyBase writes.
  [`system-template-store.ts:146`](../../DungeonsWithFriends/src/features/creator/model/system-template-store.ts#L146)

**Binding Contract**

- Review component/template/field validation before binding writes.
  [`template-binding-store.ts:58`](../../DungeonsWithFriends/src/features/creator/model/template-binding-store.ts#L58)

- Confirm repeated field binding updates instead of duplicating rows.
  [`template-binding-store.ts:87`](../../DungeonsWithFriends/src/features/creator/model/template-binding-store.ts#L87)

- Check stale binding reporting stays non-destructive.
  [`template-binding-store.ts:122`](../../DungeonsWithFriends/src/features/creator/model/template-binding-store.ts#L122)

**Local Portability**

- Review checkpoint, export, and import actions in one place.
  [`creator-template-panel.tsx:124`](../../DungeonsWithFriends/src/features/creator/ui/creator-template-panel.tsx#L124)

- Confirm snapshot import errors remain recoverable.
  [`creator-template-panel.tsx:136`](../../DungeonsWithFriends/src/features/creator/ui/creator-template-panel.tsx#L136)

**Tracking And Contracts**

- Confirm Epic 1 stories are ready for review.
  [`sprint-status.yaml:47`](sprint-status.yaml#L47)

- Review the selected-template table contract.
  [`local-store-contracts.md:37`](../../docs/data/local-store-contracts.md#L37)

- Check the binding contract selected-system note.
  [`template-binding-contracts.md:46`](../../docs/data/template-binding-contracts.md#L46)

**Tests**

- Check system template import and invalid-row coverage.
  [`system-template-store.test.ts:24`](../../DungeonsWithFriends/src/features/creator/model/system-template-store.test.ts#L24)

- Check binding idempotency and export coverage.
  [`template-binding-store.test.ts:62`](../../DungeonsWithFriends/src/features/creator/model/template-binding-store.test.ts#L62)

- Check UI import, binding, export, and import errors.
  [`creator-template-panel.test.tsx:50`](../../DungeonsWithFriends/src/features/creator/ui/creator-template-panel.test.tsx#L50)
