---
adrId: ADR-0017
shortName: atomic-changes
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# Atomic and Reversible Changes; No Partial Migrations

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** Platform and data migrations must be atomic, reversible where practical, and staged so DWF avoids partial provider moves.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

A change that lands in a partial state — half a schema migration, half a
contract rename, half a feature flip — leaves the system in a mixed-state
intermediate that is harder to reason about than either endpoint. The
canonical failure shape is "we shipped the schema change yesterday; we'll
backfill the data tomorrow" — and tomorrow's calendar fills with other
work. Rollback becomes ambiguous (do we roll back the schema and lose data?
keep it and accept the partial state?), and the next change pays
compounded cost.

CLAUDE.md (§Security & Safety) encodes the rule today: "Keep changes atomic
and reversible. Avoid partial migrations that leave the system in a mixed
state." With no canonical ADR, agents and humans rationalize partial-state
landings under deadline pressure.

## Decision

Changes land **atomically**: a change either lands fully or leaves no
trace. No mixed-state intermediate is acceptable.

- Schema changes ship paired with the data backfill, or with an explicit
  feature-flag boundary that makes the partial state observable and time-
  bounded.
- Contract renames land in one PR with every caller updated (see
  ADR-0013); partial caller migrations are rejected.
- Feature flips ship behind a flag with both sides functional; the flip
  is a separate atomic change.
- Rollback is a designed-in path, not a hope: every change documents its
  reverse in the PR (revert the migration, flip the flag back, restore
  the old contract).

## Consequences

- A change can be rolled back without archaeology.
- The system is always in a known, reasoned-about state — never a
  "we shipped half" intermediate.
- Operators can audit a deployment by reading the PR; they do not have
  to discover the partial state from telemetry.

If reversed, partial states accumulate, rollbacks become ambiguous, and
"finish later" entries pile up in the technical debt backlog.

## Alternatives Considered

"Ship the schema change now, backfill data tomorrow." Rejected: the
tomorrow rarely arrives on the planned calendar. By the time the
backfill ticket is scheduled, the partial state has been treated as
normal for long enough that the backfill is itself risky.

## Relationship to Other ADRs

- **ADR-0013** (change-management discipline: search → change → re-search,
  no parallel paths) and ADR-0017 are coupled but independently
  reversible. ADR-0013 governs *how* a rename is executed across files;
  ADR-0017 governs *whether* a partial-state landing is acceptable. One
  could keep "search → change → re-search" while abandoning atomicity, or
  vice versa.
- **ADR-0005** (git-tracked markdown is sole canonical authority)
  provides the atomic-commit substrate that makes ADR-0017 enforceable
  for documentation: a markdown change is atomic at the git layer. For
  runtime data (databases, caches), the atomicity guarantee depends on
  the store; that case is out of scope of this ADR — the decision here
  is about authorship/process discipline, not storage transactional
  semantics.

## Confirmation

This ADR is confirmed via review using the CLAUDE.md §Security & Safety
text as the source of truth. Confirmation is `mechanism: manual`
because "is this a partial state?" and "is the rollback path designed
in?" are judgement calls a heuristic lint cannot reliably automate.

**Future work.** A migration-PR-review checklist and a
`Agents/_shared/best-practice-packs/atomic-reversible-changes.yaml` pack
could capture the proactive heuristic. Both are out of scope of this
ADR — this ADR encodes the discipline so the follow-ups have a clear
authority to point at.

The PreToolUse hook `.claude/hooks/inject-governing-adrs.mjs` pins
ADR-0017 on edits to host-runtime services and the planning package,
where migrations and contract evolutions live.
