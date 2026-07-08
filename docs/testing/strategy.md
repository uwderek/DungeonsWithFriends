# Testing Strategy

Last updated: 2026-07-08

## Purpose

Testing protects the local-first baseline while the project moves from creator tooling into playable sheets, campaign records, and later hosted sync. Verification must prove that current work is useful without login, hosted services, Tauri, or network access.

## Test Layers

- **TypeScript:** `npx tsc --noEmit` from `DungeonsWithFriends/` verifies strict TypeScript.
- **Unit tests:** Co-located Jest tests validate schemas, model helpers, UI behavior, and local persistence.
- **E2E tests:** Playwright validates high-value app flows directly through the repo script.
- **Static ADR scans:** Repository scans ensure current code does not reintroduce removed auth/provider assumptions.
- **Markdown checks:** Documentation links and sprint status consistency must be checked when planning artifacts change.

## Direct Tool Rule

Use the repo's direct commands for verification:

- `npm run typecheck` from `DungeonsWithFriends/`
- `npm test -- --runInBand` from `DungeonsWithFriends/`
- `npm test -- --runInBand <test-path>` for focused Jest runs
- `npm run test:e2e` when browser-level flows are affected
- `npm run lint:css` when CSS or Tailwind/style files are touched

Run targeted `rg` scans for forbidden current-scope dependencies or docs drift when architecture-sensitive areas change.

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
- Relevant direct unit, E2E, style, or scan checks pass, or the exact blocker is documented.
- Story file and `sprint-status.yaml` agree.
- Any new ADR/doc links resolve.
