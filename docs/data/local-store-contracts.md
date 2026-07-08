# Local Store Contracts

Last updated: 2026-07-08

## Purpose

TinyBase is the current local product store. Local data must be versioned and validated before future sync, hosted persistence, or downloaded-app storage is added.

## Store Authority

- The active app owns a single TinyBase store through `SyncProvider`.
- `DungeonsWithFriends/src/shared/store/` owns persistence, migrations, export, and import helpers.
- Feature slices own their domain schemas and write validated rows into TinyBase.

## Snapshot Envelope

Local snapshots use this shape:

```ts
{
  app_id: "dungeons_with_friends",
  schema_version: 1,
  exported_at: string,
  tables: Tables
}
```

## Versioning

- `schema_version` increments when a persisted table shape changes incompatibly.
- Migrations convert older supported versions into the current version.
- Unsupported future versions fail without mutating the current store.

## Current Tables

- `component_definitions`: creator component definitions.
- `system_templates`: local game-system metadata. Rows store `field_definitions` as JSON text and may mark the active creator system with `is_selected`.
- `template_bindings`: mapping between creator components and system fields.
- `character_sheets`: local playable sheet records.
- `dice_rolls`: local roll records for character sheets. Rows store roll detail as JSON text and carry `resolution_source` (`local_rng` or `manual_entry`, defaulting to `local_rng` for older rows) per ADR-0063. Manual results validate against notation exactly like digital rolls.

TinyBase omits empty tables from `getTables()`. An empty store or export therefore uses `"tables": {}` until rows are written; the table names above are the allowed contract, not required empty keys.

## Rules

- Persisted field names use `snake_case`.
- Hooks, functions, variables, and React props use `camelCase`.
- Local actions must not require network or login.
- Import must validate the envelope, known domain table rows, and creator binding references before replacing current local data.
- Manual creator portability stays JSON text-area based for now; file picker or native filesystem support needs explicit future story coverage.
- Corrupt local persistence must fall back to an empty valid snapshot.

## Later Sync Boundary

Later sync must consume this versioned local envelope or explicit derivatives from it, over any transport adapter (hosted Neon/Postgres, LAN host, or manual file exchange) per ADR-0061. No sync adapter may bypass local migrations or validation.
