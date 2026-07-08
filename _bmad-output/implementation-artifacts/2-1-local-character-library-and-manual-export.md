---
baseline_commit: b396be34c57d86e1e8d687eaeb5cb45e72a9701e
---

# Story 2.1: Local Character Library And Manual Export

Status: done

## Story

As a player,
I want a local character library with manual export,
so that I can manage characters without accounts.

## Acceptance Criteria

1. Given a selected or built-in local system template, when a player creates a character, then a validated `character_sheets` row is saved locally with a UUID, name, template reference, template version, default field values, and timestamps.
2. Given the Characters screen opens, when local character sheets exist, then the screen reads from TinyBase and renders local records instead of dashboard mock data.
3. Given no character sheets exist, when the Characters screen opens, then the player sees a useful local empty state and can create a starter character without login or network access.
4. Given the player triggers manual export, when local data is valid, then the JSON export includes the `character_sheets` table inside the existing versioned DWF envelope.
5. Given imported local data contains malformed character sheet rows, when import validation runs, then the import is rejected before mutating the target store.

## Tasks / Subtasks

- [x] Build character sheet store helpers (AC: 1, 4, 5)
  - [x] Add create/read/update/delete helpers around `TABLES.characterSheets`.
  - [x] Serialize `field_values` as JSON in TinyBase rows and parse it at the domain boundary.
  - [x] Populate field defaults from the selected system template without hardcoding game rules.
- [x] Extend local store domain validation for character sheets (AC: 4, 5)
  - [x] Validate `character_sheets` rows during import.
  - [x] Reject malformed serialized `field_values` without mutating the target store.
  - [x] Preserve existing creator table validation behavior.
- [x] Connect the Characters screen to local TinyBase data (AC: 2, 3)
  - [x] Replace dashboard mock character usage with local character records.
  - [x] Add a local create action that installs or uses the selected system template.
  - [x] Keep the screen login-free and network-free.
- [x] Add manual export surface on the Characters screen (AC: 4)
  - [x] Use the existing `exportStoreToJson` envelope.
  - [x] Expose a copyable/readable export preview or status without adding file-picker/native dependencies.
- [x] Add focused tests (AC: 1-5)
  - [x] Cover character store defaults, row parsing, updates, deletion, and export contents.
  - [x] Cover import rejection for malformed character rows.
  - [x] Cover Characters screen empty, create, render, and export behavior.

## Dev Notes

- Use TypeScript only. Do not add Python product code.
- Do not add login, account, hosted sync, WorkOS, Cloudflare, Neon/Postgres, Tauri, or file-picker scope.
- Reuse `src/shared/store/local-store.ts`, `src/shared/store/export-import.ts`, and `src/shared/store/domain-validation.ts`.
- Reuse `src/features/creator/model/system-template-store.ts` for the built-in Fantasy d20 template and selected template handling.
- Persisted TinyBase field names stay `snake_case`; TypeScript APIs stay `camelCase`.
- Keep rich fields flat in TinyBase rows by serializing `field_values` as JSON text.
- TinyBase omits empty tables, so empty state logic must not require a pre-existing empty `character_sheets` table.
- Current Characters UI reads dashboard mock data. This story should make it local-data driven.
- Manual export remains JSON text/preview based. File picker support is out of scope.
- Tests stay co-located with source files.

### Project Structure Notes

- Expected new or updated files:
  - `DungeonsWithFriends/src/features/character/model/character-sheet-store.ts`
  - `DungeonsWithFriends/src/features/character/model/character-sheet-store.test.ts`
  - `DungeonsWithFriends/src/features/character/model/character-sheet-schema.ts`
  - `DungeonsWithFriends/src/features/character/model/character-sheet-schema.test.ts`
  - `DungeonsWithFriends/src/features/character/ui/characters-screen.tsx`
  - `DungeonsWithFriends/src/features/character/ui/characters-screen.test.tsx`
  - `DungeonsWithFriends/src/features/character/ui/character-grid.tsx`
  - `DungeonsWithFriends/src/features/character/ui/character-grid.test.tsx`
  - `DungeonsWithFriends/src/features/character/ui/character-card.tsx`
  - `DungeonsWithFriends/src/features/character/ui/character-card.test.tsx`
  - `DungeonsWithFriends/src/shared/store/domain-validation.ts`
  - `DungeonsWithFriends/src/shared/store/export-import.test.ts`
- Avoid adding new dependencies.
- Existing app-level TinyBase provider is `SyncProvider`; UI can use `useStore` from `tinybase/ui-react`.

### References

- `_bmad-output/planning-artifacts/prd.md#Now Requirements`
- `_bmad-output/planning-artifacts/prd.md#Next Requirements`
- `_bmad-output/planning-artifacts/architecture.md#Current App Shape`
- `_bmad-output/planning-artifacts/ux-design-specification.md#Player UX`
- `docs/project-context.md#Development Guardrails`
- `docs/data/local-store-contracts.md#Current Tables`
- `docs/data/export-import-format.md#Export Rules`
- `docs/data/export-import-format.md#Import Rules`

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm test -- --runInBand src/features/character/model/character-sheet-store.test.ts src/shared/store/export-import.test.ts`
- `npm test -- --runInBand src/features/character/ui/characters-screen.test.tsx src/features/character/ui/character-grid.test.tsx src/features/character/ui/character-card.test.tsx`
- `npm run typecheck`
- `npm test -- --runInBand`
- `npm run lint:css`

### Completion Notes List

- Added local character sheet store helpers for create/read/update/delete, default field seeding from the selected or built-in system template, and JSON serialization of `field_values`.
- Extended local import validation to reject malformed character sheet rows and missing system template references before mutating the target TinyBase store.
- Reworked the Characters screen to render local TinyBase character sheets, create starter local characters, and show manual JSON exports through the existing DWF envelope.
- Updated character card/grid components to support local sheet summaries while preserving existing mock-data-compatible rendering.
- Updated persistence/export fixtures to use valid character sheet rows under the stricter domain contract.
- Code review completed with no Story 2.1-specific findings.

### File List

- DungeonsWithFriends/src/features/character/model/character-sheet-store.ts
- DungeonsWithFriends/src/features/character/model/character-sheet-store.test.ts
- DungeonsWithFriends/src/features/character/ui/character-card.tsx
- DungeonsWithFriends/src/features/character/ui/character-grid.tsx
- DungeonsWithFriends/src/features/character/ui/character-grid.test.tsx
- DungeonsWithFriends/src/features/character/ui/characters-screen.tsx
- DungeonsWithFriends/src/features/character/ui/characters-screen.test.tsx
- DungeonsWithFriends/src/shared/store/domain-validation.ts
- DungeonsWithFriends/src/shared/store/export-import.test.ts
- DungeonsWithFriends/src/shared/store/persistence.test.ts

### Change Log

- 2026-07-08: Implemented local character library, manual JSON export surface, and character sheet import validation.
- 2026-07-08: Code review completed; no Story 2.1-specific fixes required.
