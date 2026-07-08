# Testing Strategy

Last updated: 2026-07-08

## Purpose

Testing protects the local-first baseline while the project moves from creator tooling into playable sheets, campaign records, and later hosted sync. Verification must prove that current work is useful without login, hosted services, Tauri, or network access.

## Test Layers

- **TypeScript:** `npx tsc --noEmit` from `DungeonsWithFriends/` verifies strict TypeScript.
- **Unit tests:** Co-located Jest tests validate schemas, model helpers, UI behavior, and local persistence.
- **E2E tests:** Playwright validates high-value app flows through the sanctioned orchestrator.
- **Static ADR scans:** Repository scans ensure current code does not reintroduce removed auth/provider assumptions.
- **Markdown checks:** Documentation links and sprint status consistency must be checked when planning artifacts change.

## Orchestrator Rule

The preferred path is the Test Orchestrator MCP documented in `DungeonsWithFriends/README.md`. When it is available, use it for unit, E2E, style, and coverage checks.

When the orchestrator is not available in a session:

- Do not run direct `npm test`, `jest`, or `playwright` commands because package scripts intentionally block them.
- Run `npx tsc --noEmit` as the nearest local code check.
- Run targeted `rg` scans for forbidden current-scope dependencies or docs drift.
- Report the orchestrator gap explicitly in the closeout.

## Coverage Expectations

- Keep tests co-located with source files.
- Add tests with every new schema, migration, store helper, import/export helper, or non-trivial hook.
- Prefer focused tests over broad snapshot tests.
- Cover malformed import payloads, unsupported versions, empty local stores, and migration paths.

## Current Required Scans

Run the legacy-provider scan maintained by the active implementation spec or review checklist.

Expected current-scope result: no product-code matches and no active planning artifact should instruct implementation against the superseded hosted/account baseline.

## Release Gate For Now Work

A story is not done until:

- TypeScript passes or the exact blocker is documented.
- Test Orchestrator checks pass, or the orchestrator is unavailable and the degraded verification is reported.
- Story file and `sprint-status.yaml` agree.
- Any new ADR/doc links resolve.
