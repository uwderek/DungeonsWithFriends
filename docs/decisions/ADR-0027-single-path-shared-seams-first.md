---
adrId: ADR-0027
shortName: single-path-shared-seams
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# Single-Path Shared Seams First

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** Auth, sync, storage, renderer, rules execution, and future provider concerns must route through shared ports instead of one-off feature paths.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

The current branch exposed a repeat failure mode: one path worked because it
reused the real on-disk knowledgebase identity and another path failed because
it reimplemented similar logic slightly differently. The result was drift
between equivalent behaviors, duplicate repair logic, inconsistent fallback
rules, and expensive debugging where the same business action behaved
differently depending on which entry point happened to run.

This is not a one-off code-knowledge issue. The same pattern appears anywhere
equivalent flows quietly fork into "special" helpers, per-file local logic, or
copy-pasted fallback branches.

## Decision

When multiple code paths perform the same logical job, Action Plan MUST expose
one shared general-purpose seam and route all equivalent call sites through it.

Concretely:

1. A bug fix in one path is not complete if sibling paths still carry copied or
   near-copied logic for the same behavior.
2. New special cases MUST extend the shared seam instead of introducing a new
   parallel helper, fallback, or local branch.
3. Refactors that discover duplicate behavior MUST migrate the existing callers
   in the same PR whenever the migration is mechanically safe.
4. Read paths and write paths may differ when governance requires it, but each
   class still gets one shared authority path of its own.
5. If a caller needs a different result, that difference must be modeled as an
   input to the shared seam, not as a second implementation beside it.

For the code-knowledge runtime specifically, read-side identity selection now
belongs to one shared helper (`runtimeReadableIdentity.ts`) and query/read tools
must reuse that helper rather than independently guessing which `(projectId,
repositoryId)` pair to trust.

## Consequences

- Equivalent behaviors converge, so fixing one bug fixes the whole class.
- Refactors touch more files up front because callers move immediately instead of
  waiting for a hypothetical cleanup pass.
- Shared seams become more explicit, more parameterized, and more testable.
- Review gets simpler: a reviewer can reject a PR that adds a second path when a
  shared seam already exists.

If reversed, the codebase accumulates "almost the same" helpers that diverge in
error handling, identity resolution, fallback posture, and logging, which is
exactly the failure mode that produced the current knowledgebase drift.

## Alternatives Considered

"Allow local fixes first, then unify later if duplication becomes painful."
Rejected: later rarely happens, because the next feature ships on the copied
path before cleanup is scheduled. By the time anyone returns, the paths are no
longer equivalent enough to merge cheaply.

## Confirmation

This ADR is enforced today by:

- Contract tests on the shared code-knowledge identity seam
  (`ActionPlan/mcp/code-knowledgebase/src/kbIdentityResolver.test.ts`).
- Contract tests on the direct query path that prove mismatched requested
  identities fall back to the real on-disk snapshot authority instead of
  spawning a parallel heal (`ActionPlan/mcp/code-knowledgebase/src/queryCodebase.test.ts`).
- Manual review using the change-management discipline pack
  (`Agents/_shared/best-practice-packs/change-management-discipline.yaml`) to
  reject new duplicate or near-duplicate authority paths.

Future work may add a dedicated quality gate that flags duplicate authority
paths automatically, but that gate is not a prerequisite for this ADR's
architectural rule.
