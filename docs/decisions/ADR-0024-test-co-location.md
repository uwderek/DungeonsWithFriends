---
adrId: ADR-0024
shortName: test-colocation
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# Test Co-Location

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** Keep unit tests co-located with the implementation files they verify.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Promotion Notes

Promoted to accepted on 2026-05-26 as part of the multi-ADR activation
batch. The existing `ActionPlan/scripts/audit-colocated-tests.js` script
(with its own colocated test) provides the mechanical confirmation
surface; the `test-colocation.yaml` pack carries the proactive
checklist (ADR-0018 linkage). MCP wrapping as
`mcp__actionplan-verification__audit_colocated_tests` is deferred to a
follow-up PR — it requires rebuilding `ActionPlan/mcp/test-orchestrator/dist/`
which is out of scope of an ADR-only activation. Until then the gate
runs by invoking the script directly via `node` or by the
co-located-test pattern that the repository already practices.

## Context

The Action Plan repository follows a **colocated** test layout in
practice — `Foo.ts` lives next to `Foo.test.ts`, `Foo.tsx` next to
`Foo.test.tsx`. The convention is enforced by an existing audit script
(`ActionPlan/scripts/audit-colocated-tests.js` + its colocated test).
Cross-cutting tests live in a separate top-level `ActionPlan/tests/`
tree organised by concern: `tests/e2e/**`, `tests/contracts/**`,
`tests/fixtures/**`, `tests/integration/**`.

Two failure modes are possible without an ADR codifying the convention:

1. A future maintainer drops a unit test into `ActionPlan/tests/` for
   "convenience" (the test runner finds it either way), and the auditor's
   authority becomes ambiguous — the auditor is "just a script", not a
   policy with stated reasoning.
2. The reverse: a cross-cutting test (an architecture contract, an
   integration scenario) gets colocated with one of its many subjects,
   creating an arbitrary "primary subject" that confuses readers and
   future moves.

The audit script exists; the ADR is what makes it the authoritative
expression of the policy rather than an unattributed convention.

## Decision

Test files follow a single **co-location rule**:

- **Unit tests live in the same directory as the file under test.**
  - `Foo.ts` ↔ `Foo.test.ts` (same directory).
  - `Foo.tsx` ↔ `Foo.test.tsx` (same directory).
  - A pure-logic test for a hook or controller (e.g. the headless layer
    per ADR-0020) sits next to the hook or controller it tests.
- **Cross-cutting tests live in `ActionPlan/tests/` organised by kind.**
  - `tests/e2e/**` — end-to-end browser/device flows.
  - `tests/integration/**` — multi-module integration scenarios that
    cannot be colocated because their subject is "the seam between
    modules", not a single module.
  - `tests/contracts/**` — architecture contracts, parallel-list
    invariants (per ADR-0019 #2), shared-contract type pinning (per
    ADR-0016).
  - `tests/fixtures/**` — shared fixture data, not tests themselves.
- **Component-lab scenarios live colocated with the component**
  (`Foo.lab.ts` next to `Foo.tsx`); this is already enforced and is
  captured by reference for completeness.

A unit test under `ActionPlan/tests/` whose subject lives elsewhere is
rejected. A cross-cutting test colocated with one of many subjects is
rejected.

**Subject identification.** A test's subject is the file imported under
the test's relative `./` or `../` import paths; if exactly one such
import targets a sibling source file (after resolving aliases), that
sibling is the subject and co-location is enforced. Tests with zero or
multiple sibling subjects are cross-cutting by definition and belong
under `ActionPlan/tests/`.

## Consequences

- A reader of `Foo.ts` finds `Foo.test.ts` and `Foo.lab.ts` in the same
  directory listing — no `git grep`, no IDE jump-to-test heuristic. The
  test surface is a first-class peer of the source.
- A rename or move of `Foo.ts` carries its test with it as one
  `git mv`; the test does not get orphaned in a parallel `tests/`
  tree.
- Cross-cutting tests stay discoverable by *kind* — a contract test for
  the persona enum lives next to other contract tests, not buried next
  to one of its consumers.
- The existing `scripts/audit-colocated-tests.js` becomes the policy
  enforcement point, not a convention-checker.

If reversed, tests drift into parallel `tests/` trees, renames orphan
tests, and discoverability degrades (a reader of `Foo.ts` has no
deterministic place to find its test).

## Alternatives Considered

**A. Mirror-tree layout (`src/Foo.ts` ↔ `tests/unit/src/Foo.test.ts`).**
Rejected: the mirror tree doubles the directory hierarchy without
giving the reader anything. Every test file requires an extra mental
hop ("`tests/` plus the same path as the source"). The mirror also
breaks when a source file moves: the test must move in lockstep, and
the lockstep is itself a chronic source of drift.

**B. All tests in one flat `tests/` tree, organised by name.**
Rejected: search-by-name only works when names are globally unique,
which they are not (multiple `index.test.ts`, multiple `types.test.ts`).
And the rename-orphans-the-test failure mode is identical.

**C. Leave it as a convention; trust review.** The convention has
worked so far, but the gap is documenting *why* — a future PR with a
test in `tests/unit/` has no document to point at when review pushes
back. The ADR is the document.

## Relationship to Other ADRs

- **ADR-0023** (per-file coverage floor) — independently reversible.
  Co-location is about *where* tests live; coverage floor is about
  *how much* the test exercises. A colocated test that asserts only
  one trivial path passes ADR-0024 and fails ADR-0023.
- **ADR-0019** (operator-critical pipeline discipline) — cross-cutting
  contract tests under `tests/contracts/**` are exactly the kind
  ADR-0019 §discipline #2 (parallel-list contract tests) and #3
  (Tier-3 integration smoke) call out. ADR-0024 says where they go;
  ADR-0019 says what they must test.
- **ADR-0009** (SOLID) — single-responsibility per module makes
  co-location natural: a test is *of one module*, the module is *one
  thing*, so the test belongs *next to* the module.

## Confirmation

ADR-0024 is accepted and active as governance for the frontmatter
`governs.code` scope. The current confirmation surfaces are the existing
`ActionPlan/scripts/audit-colocated-tests.js` quality script and the
`Agents/_shared/best-practice-packs/test-colocation.yaml` checklist.

Unit-test co-location is an active expectation for new and modified files.
Cross-cutting contract, integration, e2e, and fixture tests remain under the
top-level `ActionPlan/tests/` tree by kind, so review must classify the test
subject before declaring a path violation.
