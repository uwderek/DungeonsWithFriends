---
adrId: ADR-0013
shortName: change-management
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# Change Management Discipline — Search → Change → Re-Search

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** Use search-change-research discipline for refactors, migrations, renames, and provider replacements.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Renames and refactors in a large polyglot codebase silently break references
unless the contributor searches the entire repository (code, tests, config,
scripts, docs) before, during, and after the change. Two failure modes are
endemic without this discipline:

1. **Stale references.** A rename misses callers in tests, scripts, or
   docs; the build passes locally but breaks downstream.
2. **Parallel old/new paths.** A "new" path lands next to an "old" path with
   a "deprecate later" comment; the deprecation window almost never closes,
   so the parallel paths diverge into permanent tech debt.

The discipline already lives in CLAUDE.md (§Change Management) and the
`change-management-discipline.yaml` pack, but without a queryable ADR it is
easy for an agent to start a rename without scanning, or to land a "new path,
old path stays for now" pattern that quietly accumulates.

## Decision

Every rename or refactor MUST follow the search → change → re-search loop:

- **Search first.** A repo-wide search (code, tests, config, scripts, docs)
  finds every usage of the symbol being changed.
- **Change once.** All callers move to the new name/path in the same PR — no
  temporary parallel old/new paths.
- **Re-search.** After the change, the repo-wide search finds zero remaining
  matches for the legacy name.
- **Remove deprecated functions immediately.** When a replacement is
  introduced, the deprecated function is removed in the same PR with all
  callers updated. No "deprecation window."

## Consequences

- Renames complete in one PR instead of a multi-PR migration that loses
  steam.
- Dual code paths cannot diverge because they never coexist.
- Deprecated functions do not accumulate as fossils that future agents must
  reason around.
- Reviewers can cite this ADR when a PR introduces a `// deprecated, will
  remove later` pattern.

If reversed, the codebase accumulates parallel paths and stale references;
"clean this up later" becomes the dominant technical debt category.

## Alternatives Considered

"Conventional deprecation window — ship the new path now, remove the old in
the next release." Rejected: deprecation windows almost never close on time.
The "next release" that removes the old path is the same release that ships
five new features that depend on the deprecation window being open. The
window stays open until an emergency forces closure.

## Confirmation

This ADR is enforced through code review using the proactive checklist in
`Agents/_shared/best-practice-packs/change-management-discipline.yaml` (which
carries `adr: ADR-0013`). Confirmation is `mechanism: manual` because
"did the search find every usage?" and "is this a parallel path?" are
judgement calls that lint heuristics cannot reliably automate.

The PreToolUse hook `.claude/hooks/inject-governing-adrs.mjs` may surface
ADR-0013 as a universal change-management citation since the `governs.code`
glob is narrow (the pack file itself); the 5-ADR cap with footer
semantics from Story 249.2 keep this from drowning out path-specific ADRs.

**Future work.** A contract-test that runs `git grep` for the legacy name on
the rename branch could automate part of the check. That follow-up is
explicitly out of scope of this ADR; this ADR encodes the discipline so the
follow-up has a clear authority to point at.
