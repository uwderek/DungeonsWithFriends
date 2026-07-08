# Story 1.4: Local Save Load Preview Export Import

Status: review

## Story

As a Creator,
I want to save, load, preview, export, and import local templates,
so that my work survives reloads and can be moved manually before hosted sync exists.

## Acceptance Criteria

1. Given local TinyBase tables exist, when checkpoint runs, then a versioned local snapshot is saved through `src/shared/store/persistence.ts`.
2. Given a valid exported JSON envelope, when import runs, then the store is replaced only after validation and migration succeeds.
3. Given malformed JSON or an unsupported future version, when import runs, then current local data remains unchanged and a typed error is returned.
4. Given a template is previewed, when the preview opens, then it consumes local schema/binding data and does not require network or login.

## Implementation Notes

- Use `DungeonsWithFriends/src/shared/store/export-import.ts`.
- Align user-facing copy with `docs/data/export-import-format.md`.
- Keep preview local and schema-driven; do not add marketplace or account concepts.

## Verification

- Add co-located tests for export envelope shape, import success, malformed import, unsupported version, and non-mutation on failure.
- Run `npx tsc --noEmit` from `DungeonsWithFriends/`.

## Implementation Notes

- Added creator workspace checkpoint, export, and import controls backed by the shared local store helpers.
- Added schema-driven local preview of selected template fields, binding summaries, and stale binding warnings.
- Failed snapshot imports surface recoverable local errors and preserve current TinyBase rows.
