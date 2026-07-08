# Export And Import Format

Last updated: 2026-07-08

## Purpose

Manual export/import is the current portability and backup path. It must work before hosted sync and accounts exist.

## Envelope

```json
{
  "app_id": "dungeons_with_friends",
  "schema_version": 1,
  "exported_at": "2026-07-08T00:00:00.000Z",
  "tables": {}
}
```

## Export Rules

- Export includes TinyBase tables only.
- Export does not include secrets, account identifiers, hosted sync state, or device-specific paths.
- Export uses pretty JSON for user-copyable files.
- Export must include `schema_version` and `exported_at`.

## Import Rules

- Parse JSON first.
- Validate envelope fields.
- Reject unsupported future versions.
- Run migrations for supported older versions.
- Replace store tables only after validation and migration succeeds.

## Error Types

- `invalid_json`
- `invalid_envelope`
- `storage_unavailable`
- `unsupported_version`
- `migration_failed`

## Later Extensions

Future exported bundles may include assets, thumbnails, signatures, or marketplace metadata. Those extensions require explicit ADR/story coverage before they become active.
