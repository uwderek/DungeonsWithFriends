---
adrId: ADR-0025
shortName: progress-logging
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: now-later
source: imported-and-cleaned
---
# Progress, State-Mutation, and Script Logging

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** now-later.
- **Project application:** Use progress/state logging for build/test scripts and long-running local operations now; extend to Tauri commands and Cloudflare jobs later.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Promotion Notes

Promoted on 2026-05-26 in **report-only** discipline. The existing
shared script logger (`ActionPlan/scripts/log.cjs` with colocated
test) is the canonical entry-point for Discipline 3. The
`check-script-test-and-logging.js` quality script now audits
script-test pairing, shared-logger usage, and progress-event presence
for long-running ops in the ADR compliance report-only profile. The
current report remains a cleanup backlog until enough evidence exists
to promote changed-scope regressions to blocking. The proactive
review checklist remains
`Agents/_shared/best-practice-packs/progress-state-and-script-logging.yaml`
(multi-ADR linkage to both ADR-0015 and ADR-0025).

## Context

ADR-0015 establishes the **logging contract** — intent, decisions,
outcomes; one-line structured; consistent tags + levels; no success
spam. That ADR governs `services/host-runtime/**`, `mcp/**`, and
`packages/actionplan-shared/src/logging/**` only.

Three dimensions are not addressed by ADR-0015 and have produced
debugging-time costs in practice:

1. **Progress indication.** A long-running operation (an indexer
   reconciliation, an embedding build, a workflow run, a sweep) that
   emits no progress events leaves the operator unable to distinguish
   "running" from "hung". The fix-it-when-you-see-it failure mode lands
   PR after PR (PR #265, #267, #270, #277 added progress events
   reactively). The contract was never codified, so each pipeline
   relearns the lesson.

2. **State-mutation logging.** When a persisted state changes
   (workspace marker flipped, governance decision recorded, FK
   relationship promoted from `deferred` to `enforced`), the transition
   is the most useful single log event for debugging — "what changed
   between version N and version N+1" reduces to a `grep`. Without an
   explicit contract, state changes are often logged at `debug` (off by
   default) or not at all, and the post-incident reconstruction is
   harder than it needs to be.

3. **Scripts and quality utilities as first-class logging sites.**
   ADR-0015's governed scope excludes `ActionPlan/scripts/**` and
   `ActionPlan/quality/**`. The shared script logger
   (`ActionPlan/scripts/log.cjs`) exists and is well-tested, but its
   adoption is uneven: ~10 of 13 `.cjs` scripts have colocated tests,
   and the same scripts vary in their use of the shared logger.
   Operators of these scripts are precisely the audience ADR-0015 wants
   to serve — they should not be a second class.

## Decision

Three disciplines extend the ADR-0015 logging contract to address the
gaps above. All three are projections of the same intent-decisions-
outcomes shape ADR-0015 already defines; this ADR adds the dimensions,
not a separate contract.

### Discipline 1 — Progress indication for long-running operations

Any operation whose expected duration exceeds **~500 ms** under normal
conditions emits at least three progress events at `info` level:

- `progress.start` — area, operation name, expected duration class
  (short/medium/long), and any input scale signal (item count, file
  count, bytes).
- `progress.tick` — emitted on a cadence proportional to the operation
  (every 5-10% completion, OR every 2-5 seconds for operations whose
  total is unknown). Carries `progressPct` when known, or `step` (a
  monotonic counter) when not, plus a human-readable phase label.
- `progress.complete` OR `progress.failed` — terminal event with
  duration, outcome, and (on failure) the structured error envelope
  from ADR-0019 #1.

Hot-path loops are silent (per ADR-0015 no-success-spam); the tick is
the integrated progress signal, not per-item announcements.

### Discipline 2 — State-mutation logging

Every persisted state transition logs the transition at `info` level
in the shape:

`state.change area=<area> entity=<id> from=<prev> to=<next> reason=<intent>`

Scope: state that is persisted (database row, marker file, governance
decision, FK enforcement mode, workspace registration, ADR status,
feature flag flip). Scope explicitly **excludes**: in-memory cache
writes, transient request-scope state, per-frame UI state. The
no-success-spam rule still applies — a state transition is meaningful
by definition, but the cache hit on the way to that transition is not.

Reversal of a state change is itself a state change (`from=<X>
to=<X-prior>` with `reason=<rollback>`); rollback paths log too.

### Discipline 3 — Scripts and quality utilities are first-class logging sites

Every script under `ActionPlan/scripts/**` and every quality utility
under `ActionPlan/quality/**`:

- Uses the shared `ActionPlan/scripts/log.cjs` logger (or its TypeScript
  equivalent for `.ts` quality scripts); never `console.log` directly.
- Follows the ADR-0015 contract (intent, decisions, outcomes; one-line
  structured; appropriate level).
- Ships with at least one colocated automated test (per ADR-0024) that
  exercises the script's primary code path. A script that wraps an
  inherently-side-effectful operation (a `git` invocation, a file
  install) tests its argument parsing, branch logic, and error
  envelope — not the inherent side effect.
- Long-running scripts honor Discipline 1 (progress events) and
  Discipline 2 (state-change events).

## Consequences

- An operator running a long script sees progress, not silence — "still
  going" vs. "hung" is unambiguous.
- A post-incident reconstruction of "what changed between two snapshots
  of state" is a `grep` for `state.change` against the log archive.
- Scripts and quality utilities are debugged using the same log shape
  as services; the operator's mental model is unified.
- The `~10/13 scripts have tests` ratio becomes 13/13 (or each gap
  carries an explicit exemption marker per ADR-0023's pattern).
- The progress contract makes the operator-critical-pipeline discipline
  from ADR-0019 #5 (inspect endpoints) cheaper to satisfy — the same
  progress ledger feeds the inspect endpoint.

If reversed, the long-running-without-progress, silent-state-mutation,
and console-log-in-scripts failure modes continue to land PR after PR
as reactive fixes (the field history documents the cost).

## Alternatives Considered

**A. Extend ADR-0015's `governs.code` to include scripts and
quality.** Necessary but not sufficient — ADR-0015 says nothing about
progress events or state-change events, both of which need their own
language. Scope expansion alone would leave the two new disciplines
unwritten.

**B. One ADR per discipline (three new ADRs).** Rejected as redundant
copying (ADR-0019 alternative B argued the same way): the three
disciplines share one motivation (operator/debugger experience), one
shape (the ADR-0015 contract), and one set of consumers (anyone reading
logs). They are reversible together as one decision.

**C. Treat the disciplines as best-practice-pack-only.** Rejected: the
pack expresses *the proactive checklist*, not *the binding policy*. The
ADR-0015 + ADR-0025 pair is the policy; the pack is the read-side
artifact.

## Relationship to Other ADRs

- **ADR-0015** (logging contract) — direct sibling. ADR-0025 is the
  scope and dimension expansion; ADR-0015 is the shape and
  no-success-spam contract. Both must be honored.
- **ADR-0019** (operator-critical pipeline discipline) — Discipline 1
  (progress) and Discipline 2 (state-change) feed ADR-0019 §discipline
  #5 (inspect endpoints) directly. The progress ledger and the
  state-change log are the data the inspect endpoint summarises.
- **ADR-0014** (boundary validation + secret redaction) — every log
  payload from these disciplines routes through the same redactors.
  State transitions carrying credential-shaped values are redacted at
  the boundary, not at the call site.
- **ADR-0024** (test co-location) — Discipline 3's test requirement
  uses ADR-0024's co-location rule.
- **ADR-0023** (per-file coverage floor) — Discipline 3's test
  requirement complements but does not subsume ADR-0023; a script
  with a colocated test still has a coverage number that ADR-0023
  evaluates.

## Confirmation

ADR-0025 is accepted and active as report-only governance for the
frontmatter `governs.code` scope. The current confirmation surfaces are
`Agents/_shared/best-practice-packs/progress-state-and-script-logging.yaml` and
`ActionPlan/quality/check-script-test-and-logging.js`, which regenerates
`ActionPlan/output/adr-0025-script-discipline.json` in the ADR compliance
profile.

Legacy script/logging debt remains visible but non-blocking. New and modified
scripts should not add raw console calls, skip the shared script logger, omit
colocated tests, or leave long-running operations without progress events. Future
blocking promotion may fail closed on new or modified regressions after the
report-only backlog is drained enough to set a defensible baseline.
