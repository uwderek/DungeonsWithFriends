# Template Binding Contracts

Last updated: 2026-07-08

## Purpose

Creator templates connect visual component definitions to system metadata. Bindings must stay system-agnostic so DungeonsWithFriends can support D&D-like games, custom systems, and later marketplace templates without hardcoded game rules.

## System Template

A system template describes the fields and metadata a sheet can bind to:

- `system_template_id`
- `system_name`
- `system_version`
- `field_definitions`
- `created_at`
- `updated_at`

Field definitions include:

- `field_id`
- `field_label`
- `data_type`
- optional `default_value`
- optional `validation_rules`

## Template Binding

A template binding maps a creator component to a system field:

- `binding_id`
- `component_id`
- `system_template_id`
- `field_id`
- optional `transform`
- `created_at`
- `updated_at`

## Rules

- Components do not hardcode game systems.
- Bindings must validate that the referenced component and system field exist.
- Removing a system field reports stale bindings instead of deleting user work.
- Binding transforms are metadata only until a later story implements runtime evaluation.
- The selected creator system is stored locally on the `system_templates` row with `is_selected`; this is local workspace state, not account or hosted sync state.

## Future Consumers

- Playable sheet runtime.
- Local character library.
- Export/import.
- Later marketplace validation.
- Later sync conflict detection.
