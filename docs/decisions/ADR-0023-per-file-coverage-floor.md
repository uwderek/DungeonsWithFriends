---
adrId: ADR-0023
shortName: coverage-floor
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: now
source: imported-and-cleaned
---
# Per-File Coverage Floor for New and Modified Files

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** now.
- **Project application:** Preserve the per-file coverage intent, with thresholds and reports gathered through direct Jest coverage output or repo-owned scripts.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Promotion Notes

Promoted on 2026-05-26 in **report-only** discipline. The existing
`ActionPlan/jest.config.js` global threshold (75% statements/branches/
functions/lines) and the `analyze-coverage.js` script provide the
parsing primitives; the per-file-delta-against-base gate
(`check-per-file-coverage.js`) is deferred to a follow-up PR. Until
then the floor is enforced by review using the
`per-file-coverage-floor.yaml` pack — every new file added in this
session ships with a colocated test that exercises its primary
behavior. The boy-scout clause applies to modified-and-under-floor
files identically to ADR-0021's size-budget clause.

## Context

`ActionPlan/jest.config.js` already enforces an **aggregate** coverage
threshold (75% global statements/branches/functions/lines, with several
scoped paths at 80-85%), and `collectCoverageFrom` uses wildcards
(`core/**`, `components/**`, `app/**`, `services/**`, `component-lab/**`)
so new files in those directories are automatically *included* in the
coverage calculation. Every exclusion in `collectCoverageFrom` carries a
mandatory rationale comment.

That foundation is necessary but not sufficient. The aggregate threshold
has a failure mode the user has named explicitly:

> A new 200-line file at 0% coverage that adds <0.5% to the weighted total
> still passes the 75% global gate.

Net effect: a low-coverage file slips into the codebase, the aggregate
slowly erodes, and by the time the global threshold is breached, the
debt has compounded across multiple files. The gate is a lagging
indicator, not a leading one.

A **per-file floor** turns the lagging indicator into a leading one:
the file's own coverage is the gate, evaluated at PR time against the
diff (new file or modified file), so the slip is caught when it happens
rather than diagnosed weeks later.

## Decision

Action Plan adopts a **per-file coverage floor** layered on top of the
existing aggregate threshold:

| Scope | Floor |
|---|---|
| New source file (under existing `collectCoverageFrom` scope) | **≥ 80% lines, ≥ 75% branches, ≥ 80% functions** |
| Modified source file already ≥ floor | **MUST NOT regress** below its base-branch coverage |
| Modified source file below floor (legacy) | **MUST improve by ≥ 5 percentage points** on lines per PR until ≥ floor (boy-scout analog from ADR-0021) |

**Exemption shape.** Mirroring ADR-0021, a file may carry an inline
exemption marker (`// adr-0023-exempt: <reason>` at the top of the file)
when coverage is intrinsically infeasible (native-bridge file, platform
shim, integration-only-tested entry point). The marker is allow-listed
at review time. Files already exempted from `collectCoverageFrom` in
`jest.config.js` are out of scope of this ADR by construction — the
existing exclusion comments are their own contract.

**Modification heuristic.** A file is "modified" if `git diff` against
the base branch shows non-comment-only changes to executable code (a
comment-only edit, a rename without behavior change, or a pure import
re-ordering does not trigger the boy-scout clause).

**Coverage definition.** Uses the same `coverage-summary.json` shape the
existing aggregate gate consumes; no new instrumentation. Per-file delta
is computed by reading the base branch's `coverage-summary.json` artifact
(or recomputing it when not cached) and diffing per-file values.

## Consequences

- A new file under floor fails CI at the PR that introduces it, with a
  message naming the file, the actual coverage, the floor, and the
  branches missing coverage (sourced from `lcov.info`).
- A modified-and-regressed file fails CI with the before/after numbers.
- The "low-coverage file slips through, aggregate erodes silently"
  failure mode disappears.
- The existing aggregate gate stays in place as a backstop — both gates
  must pass.
- Legacy under-floor files are drained incrementally (boy-scout) rather
  than via a heroic backfill sprint that never gets scheduled.

If reversed, the aggregate-only gate continues to mask per-file
regressions, and the codebase's coverage debt continues to centralise
in a small number of large-active files (mirroring the pattern ADR-0021
addresses for size).

## Alternatives Considered

**A. Raise the aggregate threshold to 90%.** Rejected: the aggregate
is still aggregate. A new 0%-coverage file still fits inside the
slack between the threshold and the current weighted average. Raising
the threshold only postpones the failure mode.

**B. Require every new file to ship with a colocated test.** Necessary
but not sufficient — a colocated `Foo.test.ts` with one trivial test
satisfies presence-checking without exercising the file. The floor
metric is the actual coverage, not the presence of a file.

**C. Defer enforcement until after the legacy under-floor files are
backfilled.** Rejected: that backfill is the same "scheduled later"
work that ADR-0021's no-deprecation-window argument shows never
happens. The boy-scout clause is the calibrated activation path: new
files hit the floor immediately, legacy files drain incrementally.

## Relationship to Other ADRs

- **ADR-0021** (size budgets and refactor-on-the-way-through) — direct
  sibling. ADR-0021 governs *how big* a file may be; ADR-0023 governs
  *how thoroughly tested* a file must be. Both use the same boy-scout
  activation pattern for legacy violators.
- **ADR-0024** (test co-location) — independently reversible. ADR-0024
  governs *where* tests live; ADR-0023 governs *how much coverage*
  exists. A file may satisfy ADR-0024 (test colocated) and still
  violate ADR-0023 (test is shallow).
- **ADR-0009** (SOLID) — single-responsibility violations correlate
  with low-coverage files (more responsibilities = more branches =
  harder to cover). The floor is a mechanical proxy for SRP at the
  test-surface level.

## Confirmation

ADR-0023 is accepted and active as governance for the frontmatter
`governs.code` scope. `ActionPlan/quality/check-per-file-coverage.js` reads the
existing coverage artifact and emits `ActionPlan/output/adr-0023-coverage-floor.json`
in report-only mode. `Agents/_shared/best-practice-packs/per-file-coverage-floor.yaml`
remains the review checklist for the ratcheting coverage floor.

Legacy under-floor files remain visible but non-blocking. New files and modified
files are the ratcheting scope: future blocking enforcement may fail closed on a
new file under floor, a modified file regression, or a modified legacy file that
does not improve, while unchanged historical debt remains report-only.
