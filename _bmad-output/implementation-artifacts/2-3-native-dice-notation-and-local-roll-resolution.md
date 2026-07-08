---
baseline_commit: b396be34c57d86e1e8d687eaeb5cb45e72a9701e
---

# Story 2.3: Native Dice Notation And Local Roll Resolution

Status: done

## Story

As a player,
I want local dice notation parsing and roll records,
so that turns can resolve without network access.

## Acceptance Criteria

1. Given common dice notation such as `d20`, `2d6+3`, or `4d8 - 2`, when parsing runs, then the result captures dice count, sides, modifier, and normalized notation.
2. Given invalid notation, zero dice, zero sides, or excessive dice limits, when parsing runs, then a typed dice error is raised without creating a roll record.
3. Given valid notation and an injectable random source, when roll resolution runs, then deterministic tests can assert individual dice, modifier, total, and notation.
4. Given a character sheet exists, when a local roll is resolved for that sheet, then a validated `dice_rolls` row is saved locally with character reference, notation, total, detail JSON, and timestamp.
5. Given the Characters screen shows a playable sheet, when the player enters and rolls notation, then the result appears immediately and no network, login, or hosted service is required.
6. Given exported local data includes roll records, when import validation runs, then malformed roll rows are rejected before mutating the target store.

## Tasks / Subtasks

- [x] Add dice notation parser and resolver (AC: 1, 2, 3)
  - [x] Support `dN`, `NdN`, and optional signed modifiers with whitespace.
  - [x] Normalize notation and cap dice count/sides to explicit local limits.
  - [x] Use injectable randomness for deterministic tests.
- [x] Add local dice roll store helpers (AC: 4, 6)
  - [x] Add a `dice_rolls` table constant.
  - [x] Save roll details as JSON text in TinyBase rows.
  - [x] Validate roll rows during import without mutating invalid targets.
- [x] Add dice UI to the playable sheet panel (AC: 5)
  - [x] Provide local notation input and roll action.
  - [x] Render the latest local roll result for the selected character.
  - [x] Show invalid notation feedback without throwing through the UI.
- [x] Add focused tests (AC: 1-6)
  - [x] Cover parser valid/invalid cases.
  - [x] Cover deterministic resolver totals.
  - [x] Cover roll persistence and export/import validation.
  - [x] Cover UI roll success and invalid notation feedback.
- [x] Update data contract docs if a new persisted table is introduced (AC: 4, 6)

### Review Findings

- [x] [Review][Patch] Validate imported dice roll totals and detail against notation [DungeonsWithFriends/src/features/character/model/dice-roll-store.ts] -- fixed by adding schema refinement for roll count, modifier, die bounds, and total consistency plus import regression coverage.

## Dev Notes

- Keep dice logic local and deterministic. Do not add third-party dice parser dependencies.
- The initial grammar is intentionally small: `dN`, `NdN`, and optional `+/-M` modifiers.
- Suggested limits: at least reject zero/negative dice or sides and cap count/sides to prevent local UI abuse.
- Persisted TinyBase fields stay `snake_case`; roll details should be JSON text.
- If adding `dice_rolls` to `TABLES`, update domain validation and local store docs together.
- Do not add hosted sync, accounts, AI, marketplace, or provider SDKs.
- Tests stay co-located with source files.

### Project Structure Notes

- Expected new or updated files:
  - `DungeonsWithFriends/src/features/character/model/dice-notation.ts`
  - `DungeonsWithFriends/src/features/character/model/dice-notation.test.ts`
  - `DungeonsWithFriends/src/features/character/model/dice-roll-store.ts`
  - `DungeonsWithFriends/src/features/character/model/dice-roll-store.test.ts`
  - `DungeonsWithFriends/src/features/character/ui/playable-sheet-panel.tsx`
  - `DungeonsWithFriends/src/features/character/ui/playable-sheet-panel.test.tsx`
  - `DungeonsWithFriends/src/shared/store/local-store.ts`
  - `DungeonsWithFriends/src/shared/store/domain-validation.ts`
  - `DungeonsWithFriends/src/shared/store/export-import.test.ts`
  - `docs/data/local-store-contracts.md`
- Avoid new dependencies.

### References

- `_bmad-output/planning-artifacts/prd.md#Next Requirements`
- `_bmad-output/planning-artifacts/architecture.md#Local Store Principles`
- `_bmad-output/planning-artifacts/ux-design-specification.md#Player UX`
- `docs/data/local-store-contracts.md#Current Tables`
- `docs/data/export-import-format.md#Import Rules`
- `_bmad-output/implementation-artifacts/2-2-playable-sheet-data-binding.md#Dev Notes`

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm test -- --runInBand src/features/character/model/dice-notation.test.ts src/features/character/model/dice-roll-store.test.ts src/features/character/ui/playable-sheet-panel.test.tsx src/shared/store/export-import.test.ts src/shared/store/local-store.test.ts`
- `npm run typecheck`
- `npm test -- --runInBand`
- `npm run lint:css`

### Completion Notes List

- Added local dice notation parsing for `dN`, `NdN`, and signed modifiers with explicit count/sides limits.
- Added deterministic roll resolution with injectable randomness for tests.
- Added `dice_rolls` TinyBase table support, roll persistence helpers, export coverage, and import validation.
- Extended the playable sheet panel with local dice notation input, roll action, latest result display, and invalid notation feedback.
- Updated local store contract docs to include `dice_rolls`.
- Code review fix added to reject schema-valid but internally inconsistent imported dice roll rows.

### File List

- DungeonsWithFriends/src/features/character/model/dice-notation.ts
- DungeonsWithFriends/src/features/character/model/dice-notation.test.ts
- DungeonsWithFriends/src/features/character/model/dice-roll-store.ts
- DungeonsWithFriends/src/features/character/model/dice-roll-store.test.ts
- DungeonsWithFriends/src/features/character/ui/playable-sheet-panel.tsx
- DungeonsWithFriends/src/features/character/ui/playable-sheet-panel.test.tsx
- DungeonsWithFriends/src/shared/store/local-store.ts
- DungeonsWithFriends/src/shared/store/local-store.test.ts
- DungeonsWithFriends/src/shared/store/domain-validation.ts
- DungeonsWithFriends/src/shared/store/export-import.test.ts
- docs/data/local-store-contracts.md

### Change Log

- 2026-07-08: Implemented local dice notation parsing, deterministic roll resolution, persisted roll records, import validation, and panel UI.
- 2026-07-08: Addressed code review finding for inconsistent dice roll import validation.
