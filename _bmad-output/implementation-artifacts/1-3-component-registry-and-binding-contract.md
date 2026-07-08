# Story 1.3: Component Registry And Binding Contract

Status: done

## Story

As a Creator,
I want reusable component definitions to bind to system template fields,
so that local templates can become playable sheets in later stories.

## Acceptance Criteria

1. Given a component definition and selected system template, when a binding is created, then `templateBindingSchema` validates the component, system template, and field identifiers.
2. Given a system field is removed or renamed, when bindings are validated, then stale binding identifiers are reported without deleting creator work.
3. Given bound components exist, when local export runs, then component definitions and bindings are included in the versioned local envelope.

## Implementation Notes

- Use `DungeonsWithFriends/src/features/creator/model/template-binding-schema.ts`.
- Continue using `component_definitions`; add binding behavior without replacing existing component CRUD.
- Do not implement playable sheet rendering in this story.

## Verification

- Add co-located schema and model tests for valid bindings and stale binding detection.
- Run `npx tsc --noEmit` from `DungeonsWithFriends/`.

## Implementation Notes

- Added `template-binding-store.ts` to validate component, system template, and field existence before writing bindings.
- Added stale binding reporting that leaves user work intact.
- Added creator panel binding controls and export-envelope coverage for `template_bindings`.

## Review Closeout

- Accepted on 2026-07-08 as part of the Epic 1 implementation review after patching binding-row validation.
- Review patch now safe-parses persisted binding rows and rejects invalid component rows before writing a binding.
- Final Epic 1 review verification used TypeScript, architecture-regression scans, and diff hygiene checks; Test Orchestrator remained unavailable in this session.
