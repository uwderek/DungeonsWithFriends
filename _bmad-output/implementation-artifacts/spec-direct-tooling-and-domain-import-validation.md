---
title: 'Direct Tooling And Domain Import Validation'
type: 'chore'
created: '2026-07-08'
status: 'done'
review_loop_iteration: 0
baseline_commit: '490a975309d0ca7f5c6c4f915c56e3b6a1bdf5bf'
context:
  - '{project-root}/docs/project-context.md'
  - '{project-root}/docs/data/local-store-contracts.md'
  - '{project-root}/docs/data/export-import-format.md'
  - '{project-root}/docs/testing/strategy.md'
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** The repository still tells agents to use an external agent testing path, and the local export/import pipeline validates only the generic snapshot envelope before replacing TinyBase tables. This conflicts with the current instruction to use direct repo tools and leaves Epic 2 exposed to malformed creator rows imported through JSON.

**Approach:** Remove external test-runner guidance from active workflow/docs/code guidance, make direct TypeScript/Jest/Playwright/stylelint commands the repo testing path, keep manual JSON text-area import/export as the current UX, and validate known TinyBase domain rows before import replacement.

## Boundaries & Constraints

**Always:** Stay TypeScript-first, local-first, login-free, and TinyBase-backed. Use existing Zod schemas where possible. Failed imports must leave the current store unchanged. Documentation must point to direct repo commands.

**Ask First:** Adding file picker/native filesystem behavior, hosted sync, WorkOS auth, Cloudflare/Neon integration, new runtime dependencies, or broad testing infrastructure.

**Never:** Reintroduce an external agent-only test dependency, block direct repo test commands through package scripts, mutate the store before validation succeeds, or expand manual import beyond JSON text-area controls in this pass.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Direct verification | Developer runs repo checks | README/testing docs and package scripts support direct TypeScript, Jest, Playwright, and stylelint commands | No external test-runner fallback language remains |
| Valid creator snapshot | Snapshot contains valid component, system template, and binding rows | Import validates domain rows, then replaces TinyBase tables | N/A |
| Invalid creator row | Snapshot contains malformed serialized JSON or schema-invalid creator row | Import fails before store replacement | Throws a typed local-store error and preserves current rows |
| Broken binding reference | Snapshot binding references a missing component/template/field | Import fails before store replacement | Throws a typed local-store error and preserves current rows |
| Import UX scope | Creator import remains manual JSON | Text-area import/export remains documented and implemented | File picker remains out of scope |

</frozen-after-approval>

## Code Map

- `DungeonsWithFriends/package.json` -- direct test and E2E scripts.
- `DungeonsWithFriends/README.md` -- developer command guidance.
- `docs/testing/strategy.md` -- verification gate guidance.
- `docs/decisions/ADR-0012-direct-repository-verification.md` -- accepted verification ADR for direct repo tools.
- `DungeonsWithFriends/src/shared/store/export-import.ts` -- import pipeline entry point.
- `DungeonsWithFriends/src/shared/store/persistence.ts` -- local persistence hydration path.
- `DungeonsWithFriends/src/shared/store/migrations.ts` -- local-store error codes.
- `DungeonsWithFriends/src/shared/store/domain-validation.ts` -- new domain row validation before import replacement.
- `DungeonsWithFriends/src/shared/store/export-import.test.ts` -- import validation regression coverage.
- `_bmad-output/implementation-artifacts/sprint-status.yaml` -- action-item closeout.

## Tasks & Acceptance

**Execution:**
- [x] `DungeonsWithFriends/package.json`, `DungeonsWithFriends/README.md`, `docs/testing/strategy.md`, and active BMAD docs -- remove external test-runner guidance and document direct repo commands.
- [x] `docs/decisions/ADR-0012-direct-repository-verification.md`, `docs/decisions/ADR-0023-per-file-coverage-floor.md`, and `docs/decisions/ADR-0024-test-co-location.md` -- align verification ADR text with direct repo tooling.
- [x] `DungeonsWithFriends/src/shared/store/domain-validation.ts`, `export-import.ts`, `persistence.ts`, and `migrations.ts` -- validate known domain tables before replacing or hydrating TinyBase tables.
- [x] `DungeonsWithFriends/src/shared/store/export-import.test.ts` -- cover valid creator imports, invalid domain rows, invalid binding references, and non-mutation on failure.
- [x] `_bmad-output/implementation-artifacts/sprint-status.yaml` and Epic 1 retrospective/spec notes -- mark domain validation done, remove external test-runner restoration as an action, and record JSON text-area import as the current decision.

**Acceptance Criteria:**
- Given a repository search for legacy external test-runner terms, when active docs/code/workflow artifacts are scanned, then no current guidance instructs agents to use that path.
- Given a malformed creator row in imported JSON, when `importStoreFromJson` runs, then it throws `LocalStoreError` before replacing existing tables.
- Given a binding references a missing component/template/field, when import runs, then it fails before replacing existing tables.
- Given valid creator rows, when import runs, then those rows are accepted and installed.
- Given creator import/export UI scope is reviewed, when docs/status are read, then JSON text-area import remains the current path and file picker work is not planned now.

## Verification

**Commands:**
- `npx tsc --noEmit` from `DungeonsWithFriends/` -- expected: no TypeScript errors.
- `npm test -- --runInBand src/shared/store/export-import.test.ts` from `DungeonsWithFriends/` -- expected: export/import tests pass directly through Jest.
- Targeted legacy test-runner scan across `DungeonsWithFriends`, `docs`, and `_bmad-output` -- expected: no current guidance matches after historical references are removed or rewritten.
- `git diff --check` -- expected: no whitespace errors.
- `npm run check` from `DungeonsWithFriends/` -- passed with TypeScript, 39 Jest suites / 193 tests, and Stylelint.

## Suggested Review Order

**Domain Validation**

- Start at the central validator for known TinyBase domain tables.
  [`domain-validation.ts:48`](../../DungeonsWithFriends/src/shared/store/domain-validation.ts#L48)

- Manual JSON imports validate domain data before replacing tables.
  [`export-import.ts:10`](../../DungeonsWithFriends/src/shared/store/export-import.ts#L10)

- Persisted snapshots use the same validation before hydration.
  [`persistence.ts:68`](../../DungeonsWithFriends/src/shared/store/persistence.ts#L68)

- Typed error code distinguishes domain-data failures from envelope failures.
  [`migrations.ts:25`](../../DungeonsWithFriends/src/shared/store/migrations.ts#L25)

**Direct Tooling**

- Package scripts now expose direct local verification commands.
  [`package.json:10`](../../DungeonsWithFriends/package.json#L10)

- Jest transforms TinyBase so direct tests can run.
  [`jest.config.js:9`](../../DungeonsWithFriends/jest.config.js#L9)

- README documents direct TypeScript, Jest, Playwright, and style checks.
  [`README.md:29`](../../DungeonsWithFriends/README.md#L29)

- The testing strategy now makes direct repo tools authoritative.
  [`strategy.md:17`](../../docs/testing/strategy.md#L17)

- ADR-0012 now codifies direct repository verification.
  [`ADR-0012-direct-repository-verification.md:10`](../../docs/decisions/ADR-0012-direct-repository-verification.md#L10)

**Tests And Status**

- Export/import tests cover valid, malformed, and broken-reference snapshots.
  [`export-import.test.ts:88`](../../DungeonsWithFriends/src/shared/store/export-import.test.ts#L88)

- Persistence tests cover invalid domain rows in saved snapshots.
  [`persistence.test.ts:28`](../../DungeonsWithFriends/src/shared/store/persistence.test.ts#L28)

- App tests mock the store methods needed by direct Jest runs.
  [`App.test.tsx:4`](../../DungeonsWithFriends/App.test.tsx#L4)

- Sprint action items mark domain validation and JSON text-area decisions done.
  [`sprint-status.yaml:85`](sprint-status.yaml#L85)
