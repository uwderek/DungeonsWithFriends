---
baseline_commit: b396be34c57d86e1e8d687eaeb5cb45e72a9701e
---

# Story 2.2: Playable Sheet Data Binding

Status: done

## Story

As a player,
I want template-bound sheet fields to render as playable controls,
so that local sheets are useful during play.

## Acceptance Criteria

1. Given a character sheet and its system template, when playable fields are resolved, then each system field appears with its label, data type, current value, and default value fallback.
2. Given template bindings exist for a sheet's system template, when playable fields are resolved, then bound component labels and sort order shape the playable field list.
3. Given a player edits a playable field, when the value matches the field data type, then `field_values` is updated locally and the sheet `updated_at` timestamp changes.
4. Given a player edits a playable field with an incompatible value, when validation runs, then the row is not mutated and a typed validation error is raised.
5. Given a binding references a stale or missing field, when runtime resolution runs, then the stale binding is reported without deleting the binding or sheet data.

## Tasks / Subtasks

- [x] Add playable sheet runtime resolver (AC: 1, 2, 5)
  - [x] Resolve fields from `character_sheets`, `system_templates`, `template_bindings`, and component definitions.
  - [x] Apply component display labels and sort order when bindings exist.
  - [x] Report stale bindings without deleting user work.
- [x] Add value update validation (AC: 3, 4)
  - [x] Validate string, number, and boolean values against system field data types.
  - [x] Reject incompatible values before mutating TinyBase rows.
  - [x] Preserve untouched `field_values` keys.
- [x] Add playable sheet UI section (AC: 1-4)
  - [x] Render local playable fields on the Characters screen for the selected or first character.
  - [x] Use appropriate controls for text, number, and boolean fields.
  - [x] Keep controls local-first and usable without network access.
- [x] Add focused tests (AC: 1-5)
  - [x] Cover unbound system fields with default fallback.
  - [x] Cover bound label/sort behavior.
  - [x] Cover valid and invalid updates.
  - [x] Cover stale binding reporting and non-destructive behavior.
  - [x] Cover UI rendering and field edit behavior.

### Review Findings

- [x] [Review][Patch] Reject blank numeric field edits before mutation [DungeonsWithFriends/src/features/character/model/playable-sheet-runtime.ts] -- fixed by treating empty numeric strings as invalid values and adding regression coverage.

## Dev Notes

- Build on Story 2.1 character sheet store helpers.
- Do not evaluate binding transforms beyond metadata. `transform` remains metadata until a later story.
- Reuse `getBindingsForTemplate` and stale binding patterns from creator binding code.
- Runtime fields should be headless TypeScript data first, UI second.
- Keep persisted rows flat. Mutating a field means parse `field_values`, update one key, reserialize it, and write the row.
- Avoid hardcoded D&D logic. The built-in Fantasy d20 template is allowed as seed data only.
- Tests stay co-located with source files.

### Project Structure Notes

- Expected new or updated files:
  - `DungeonsWithFriends/src/features/character/model/playable-sheet-runtime.ts`
  - `DungeonsWithFriends/src/features/character/model/playable-sheet-runtime.test.ts`
  - `DungeonsWithFriends/src/features/character/model/character-sheet-store.ts`
  - `DungeonsWithFriends/src/features/character/ui/playable-sheet-panel.tsx`
  - `DungeonsWithFriends/src/features/character/ui/playable-sheet-panel.test.tsx`
  - `DungeonsWithFriends/src/features/character/ui/characters-screen.tsx`
  - `DungeonsWithFriends/src/features/character/ui/characters-screen.test.tsx`
- Avoid new dependencies.

### References

- `_bmad-output/planning-artifacts/prd.md#Next Requirements`
- `_bmad-output/planning-artifacts/architecture.md#Domain Contract Layer`
- `_bmad-output/planning-artifacts/ux-design-specification.md#Player UX`
- `docs/data/template-binding-contracts.md#Future Consumers`
- `_bmad-output/implementation-artifacts/2-1-local-character-library-and-manual-export.md#Dev Notes`

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm test -- --runInBand src/features/character/model/playable-sheet-runtime.test.ts src/features/character/ui/playable-sheet-panel.test.tsx src/features/character/ui/characters-screen.test.tsx`
- `npm run typecheck`
- `npm test -- --runInBand`
- `npm run lint:css`

### Completion Notes List

- Added a headless playable sheet runtime that resolves character sheet fields from system templates, template bindings, and component definitions.
- Added typed local field updates with non-mutating validation failures for incompatible values.
- Added stale binding reporting that leaves creator bindings and character sheet data intact.
- Added a playable sheet panel to the Characters screen with editable local fields and validation feedback.
- Covered runtime resolution, binding sort/label behavior, local edits, stale bindings, and UI edit flows with co-located tests.
- Code review fix added to prevent blank numeric input from mutating a playable field to zero.

### File List

- DungeonsWithFriends/src/features/character/model/playable-sheet-runtime.ts
- DungeonsWithFriends/src/features/character/model/playable-sheet-runtime.test.ts
- DungeonsWithFriends/src/features/character/ui/playable-sheet-panel.tsx
- DungeonsWithFriends/src/features/character/ui/playable-sheet-panel.test.tsx
- DungeonsWithFriends/src/features/character/ui/characters-screen.tsx
- DungeonsWithFriends/src/features/character/ui/characters-screen.test.tsx

### Change Log

- 2026-07-08: Implemented playable sheet runtime resolution, typed local field editing, stale binding reporting, and Characters screen playable sheet UI.
- 2026-07-08: Addressed code review finding for blank numeric field mutation.
