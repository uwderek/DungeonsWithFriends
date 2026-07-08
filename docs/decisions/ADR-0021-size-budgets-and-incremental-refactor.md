---
adrId: ADR-0021
shortName: size-budgets
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# Size Budgets and Refactor-on-the-Way-Through

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** Use size budgets and incremental refactors; calibrate exact DWF thresholds during tooling setup rather than importing ActionPlan numbers.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Promotion Notes

Promoted on 2026-05-26 in **report-only enforcement** for the
file-length and per-function budgets. The boy-scout clause is the
active discipline: a modified file already over budget MUST move
toward the budget by ≥ one increment. The session that promoted this
ADR already demonstrates the clause: `BlockEditor.tsx` 1773 → 1043
(−41%), `RepositoryIntelligenceIndexService.ts` 3078 → 2560 (−17%),
`RecurrenceEditor.tsx` 300 → 165 (−45%). The
`check-size-budgets.js` quality script (which would mechanically
report per-file budgets at PR time) is deferred to a follow-up PR;
until then the budget discipline is enforced by review using the
`size-budgets-and-incremental-refactor.yaml` pack.

## Context

CLAUDE.md §Code Quality already states soft targets: "Functions do one
thing; aim for under 30 lines where it aids readability." The repository's
field history shows the soft target is insufficient — large files
accumulate, then a heroic refactor is required to drain them, and the
refactor rarely gets scheduled (same reasoning as ADR-0013's
no-deprecation-window argument). The failure mode is documented in the
literature: technical debt centralises in a small number of "large-active"
files that are simultaneously the largest, most-modified, and most-coupled
files in the codebase
(arxiv.org/pdf/2302.09153 — *Towards the Assisted Decomposition of
Large-Active Files*).

Three patterns from outside this repository converge on the answer:

1. **Cognitive complexity ≤ 15** is the SonarQube default and the Biome
   `noExcessiveCognitiveComplexity` default. It captures
   nesting/branch-induced reading cost better than raw cyclomatic count.
2. **Cyclomatic complexity ≤ 10** is the ESLint `complexity` rule default
   and a long-standing software-engineering norm.
3. **Boy-Scout Rule** — every modification leaves the file better than it
   was found — is the only mechanism that empirically reverses the
   large-active-file trajectory without scheduled heroic refactors.

Without a mechanically enforced budget plus a boy-scout activation rule on
edits to over-budget files, soft targets do not survive deadline pressure.

## Decision

Action Plan adopts the following enforced budgets for source files under
the eventual `governs.code` activation scope:

| Metric | Budget | Warn | Notes |
|---|---|---|---|
| File length (source lines, excluding blank/comment) | **≤ 400** | 300 | Per individual `.ts` / `.tsx` / `.js` / `.cjs` file |
| Function length (source lines) | **≤ 30** | 20 | Includes arrow functions; class methods counted independently |
| Cognitive complexity per function | **≤ 15** | 10 | Biome / SonarQube default |
| Cyclomatic complexity per function | **≤ 10** | 7 | ESLint `complexity` default |

**Boy-Scout activation clause.** A PR that modifies a file already over any
budget MUST move that file at least **one step closer** to compliance — by
Extract Method, Extract Type, Move To Helper, or similar non-behavioral
refactor — recorded in the PR description. A net-no-improvement edit to an
over-budget file is rejected at review. Full compliance is not required in
one PR; incremental drainage is.

**Exemption shape.** A file may carry an inline exemption marker
(`// adr-0021-exempt: <reason>` at the file's top) when the size is
intrinsic to the file's nature (generated code, snapshot fixtures, large
typed enums per ADR-0016). The exemption marker is reviewed at promotion
and is allow-listed; an unmarked over-budget file is treated as a budget
violation.

**Tests are in scope.** Test files carry the same budgets. A test file
over budget is a signal that the unit under test is doing too much (the
common cause of fat test files is a fat module — fix the module, not the
test).

## Consequences

- Large-active files cannot grow unboundedly; every edit drains a little.
- The "heroic refactor sprint that never gets scheduled" is replaced by
  N small refactors that happen on the calendar that already exists (the
  edit calendar). Same total work, distributed instead of clumped.
- Headless extraction (ADR-0020) and library-portability extraction
  (ADR-0022) become realistic because their target files are not
  500-line monsters by the time the work starts.
- Reviewers have an objective rejection grounds for an over-budget edit
  with no improvement — "this PR makes the over-budget file worse" is a
  one-sentence review comment.
- A `quality/check-size-budgets.js` gate runs in CI and reports the
  current top-N over-budget files at every PR, so progress is visible.

If reversed, large-active files keep accreting, the headless and
portability refactors are blocked behind size barriers, and the soft
target in CLAUDE.md remains decorative.

## Alternatives Considered

**A. Trust code review to enforce CLAUDE.md's soft targets.** Rejected:
the field history is the counter-evidence. Files exceeding the soft
target exist today, reviewed by humans operating under deadline pressure.
The soft target loses every time.

**B. Schedule periodic refactor sprints.** Rejected for the same reason
ADR-0013 rejects deprecation windows: the sprint that "cleans up the big
files" is the sprint that gets bumped when a customer-visible feature
slips. The repository's prior history confirms this.

**C. Pin complexity but not file length.** Rejected: a file can hide a
hundred 10-line functions with complexity 8 each and still be unreadable
in aggregate. File length is the integrated reading cost; function
complexity is the local reading cost. Both are needed.

**D. Apply the budget to all files retroactively.** Rejected: a big-bang
retroactive enforcement would fail every PR until a heroic refactor
landed — the exact failure mode this ADR avoids. The boy-scout clause is
the calibrated activation: an existing over-budget file is grandfathered
until it is next edited, at which point one increment of improvement
becomes mandatory.

## Relationship to Other ADRs

- **ADR-0009** (SOLID) — large files are typically single-responsibility
  violations in aggregate. Size budgets are the mechanical proxy for the
  single-responsibility principle.
- **ADR-0013** (change management discipline) — search → change →
  re-search now includes "did this edit drain the budget by one step?"
  for over-budget files.
- **ADR-0017** (atomic / reversible) — the one-step improvement lands in
  the same PR as the originating edit, not deferred to a follow-up.
- **ADR-0020** (headless components) and **ADR-0022** (library
  portability) — both will produce smaller modules by construction; this
  ADR is the gravitational pull that makes their refactors easier to
  ship in increments.

## Confirmation

ADR-0021 is accepted and active as governance for the frontmatter
`governs.code` scope. `ActionPlan/quality/check-size-budgets.js` produces the
current budget evidence in report-only mode, and
`Agents/_shared/best-practice-packs/size-budgets-and-incremental-refactor.yaml`
remains the review checklist for edits to over-budget files.

The repository still carries legacy budget debt, so this ADR does not require a
big-bang blocking gate. The active obligation is ratcheting: a PR that modifies
an over-budget file records how the file moved closer to the budget or explains
why the file is exempt. Future enforcement may fail closed only on new or
modified regressions, not on unchanged historical debt.
