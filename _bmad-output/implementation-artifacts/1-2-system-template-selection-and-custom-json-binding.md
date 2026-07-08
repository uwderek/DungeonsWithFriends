# Story 1.2: System Template Selection And Custom JSON Binding

Status: ready-for-dev

## Story

As a Creator,
I want to choose a built-in system template or import custom system JSON,
so that creator components can bind to structured local metadata without hardcoded game-system assumptions.

## Acceptance Criteria

1. Given no system is selected, when the creator workspace opens, then the center canvas remains in a guided empty state and prompts for template selection or custom JSON import.
2. Given valid custom system JSON, when the creator imports it, then the app validates it with `systemTemplateSchema` and saves the resulting system template locally.
3. Given invalid JSON or an invalid system template, when import runs, then the app shows a recoverable validation error and does not mutate the current TinyBase store.
4. Given a selected system template, when the creator returns to the workspace, then the selected template is available to later binding controls from local persistence.

## Implementation Notes

- Use `DungeonsWithFriends/src/features/creator/model/system-template-schema.ts`.
- Persist system templates into the `system_templates` table documented in `docs/data/local-store-contracts.md`.
- Keep the flow local-only. Do not add login, hosted sync, WorkOS, Cloudflare, Neon/Postgres, Tauri, or new runtime dependencies.
- Extend `CreatorToolsScreen` or creator workspace subcomponents rather than creating a parallel route.

## Verification

- Add co-located tests for valid template import, malformed JSON, invalid schema, and non-mutation on failure.
- Run `npx tsc --noEmit` from `DungeonsWithFriends/`.
- Use Test Orchestrator MCP if available; otherwise report the gap.
