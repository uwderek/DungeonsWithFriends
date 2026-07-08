---
adrId: ADR-0057
shortName: semantic-decomposition
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# Semantic Module Decomposition, Not Part Files

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** Do not create semantic-free part/chunk source modules. Split by domain responsibility.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Large files are real delivery bottlenecks in this repository. ADR-0021 already
requires size-budget drainage, and Epic 1212 correctly identified several god
type barrels as merge-conflict hotspots. The first attempted fix split those
files into `Part1`, `Part2`, and similar modules. That reduces file length but
does not decompose responsibility. It also hides domain ownership, creates
cross-import tangles between arbitrary chunks, and gives future agents an
attractive but wrong precedent for satisfying size budgets mechanically.

A module name is an architecture claim. `hostRpcTypesPart4` tells a reader only
where a splitter stopped, not which business capability owns the contracts
inside it.

## Decision

Source modules are decomposed by cohesive domain responsibility, not by ordinal
or mechanical chunk. `Part1`, `Part2`, `chunk`, `segment`, `slice`, or similar
numbered names are prohibited for committed source decomposition unless the file
is a generated artifact with a reviewed exemption and is not intended for human
maintenance.

When a large source file is split:

- The original public import path may remain as a compatibility index.
- Every implementation module under that index uses a business/domain name that
  states why it changes.
- The dependency direction between new modules is intentional and acyclic.
- Cross-module imports must reflect contract dependencies, not arbitrary chunk
  order.
- The split must improve at least one SOLID dimension, usually SRP and ISP, not
  only line count.
- New tests or export-surface checks preserve behavior while proving the
  semantic modules remain complete.

For contract barrels, acceptable module names describe contract families, such
as workspace bootstrap, repository intelligence, semantic mutation, harness
approval, harness telemetry, persona prompt composition, persona resolution, or
persona registry loading. A large `index.ts` that only re-exports semantic
modules is acceptable; a large `index.ts` that owns behavior or configuration is
not.

## Consequences

- File-size cleanup becomes real architecture cleanup instead of a cosmetic
  line-count move.
- Future epics can add a capability by touching the semantic module that owns
  it, or by adding a new named module, rather than editing arbitrary chunks.
- Code review can reason about ownership and dependency direction from file
  names before opening every file.
- Mechanical split scripts remain useful as temporary analysis aids, but their
  output is not accepted as the final committed shape.

If reversed, numbered chunks will satisfy size gates while preserving the same
god-module coupling, making later cleanup harder because the domain boundaries
are now obscured across more files.

## Current Violations To Clean Up

The current branch contains these source decomposition violations:

- `ActionPlan/packages/actionplan-shared/src/chat/personaContracts/personaContractsPart1.ts`
- `ActionPlan/packages/actionplan-shared/src/chat/personaContracts/personaContractsPart2.ts`
- `ActionPlan/packages/actionplan-shared/src/runtime/federatedCodeIntelligenceContracts/federatedCodeIntelligenceContractsPart1.ts`
- `ActionPlan/packages/actionplan-shared/src/runtime/federatedCodeIntelligenceContracts/federatedCodeIntelligenceContractsPart2.ts`
- `ActionPlan/packages/actionplan-shared/src/runtime/federatedCodeIntelligenceContracts/federatedCodeIntelligenceContractsPart3.ts`
- `ActionPlan/packages/actionplan-shared/src/runtime/hostRpcTypes/hostRpcTypesPart1.ts`
- `ActionPlan/packages/actionplan-shared/src/runtime/hostRpcTypes/hostRpcTypesPart2.ts`
- `ActionPlan/packages/actionplan-shared/src/runtime/hostRpcTypes/hostRpcTypesPart3.ts`
- `ActionPlan/packages/actionplan-shared/src/runtime/hostRpcTypes/hostRpcTypesPart4.ts`
- `ActionPlan/packages/actionplan-shared/src/runtime/hostRpcTypes/hostRpcTypesPart5.ts`
- `ActionPlan/packages/actionplan-shared/src/runtime/hostRpcTypes/hostRpcTypesPart6.ts`
- `ActionPlan/packages/actionplan-shared/src/runtime/workspaceTypes/workspaceTypesPart1.ts`
- `ActionPlan/packages/actionplan-shared/src/runtime/workspaceTypes/workspaceTypesPart2.ts`
- `ActionPlan/packages/actionplan-shared/src/runtime/workspaceTypes/workspaceTypesPart3.ts`
- `ActionPlan/packages/actionplan-shared/src/runtime/workspaceTypes/workspaceTypesPart4.ts`
- `ActionPlan/packages/actionplan-shared/src/runtime/workspaceTypes/workspaceTypesPart5.ts`
- `ActionPlan/packages/actionplan-shared/src/workflow/harnessTypes/harnessTypesPart1.ts`
- `ActionPlan/packages/actionplan-shared/src/workflow/harnessTypes/harnessTypesPart2.ts`
- `ActionPlan/packages/actionplan-shared/src/workflow/harnessTypes/harnessTypesPart3.ts`
- `ActionPlan/packages/actionplan-shared/src/workflow/harnessTypes/harnessTypesPart4.ts`

Cleanup should replace these with semantic modules while preserving the original
barrel import paths. Suggested target families are recorded in
`docs/technical/adr-violation-reduction-plan.md`.

## Alternatives Considered

**Mechanical split first, semantic cleanup later.** Rejected. The current branch
shows that the temporary shape quickly becomes the visible architecture, and
future agents are likely to copy it before the semantic cleanup is scheduled.

**Allow `PartN` files only for type barrels.** Rejected. Type barrels are where
the domain names matter most because they define public contract ownership.

**Use a generated splitter and hide generated output from review.** Rejected for
human-maintained source. Generated artifacts can be exempt only when the source
of truth is elsewhere and the generated files are not edited by humans.

## Confirmation

Manual review is active immediately through this ADR and the violation inventory
in `docs/technical/adr-violation-reduction-plan.md`. A future architecture
guardrail should fail new committed source paths matching `*Part[0-9]*` under
governed source roots unless an allow-listed generated-artifact exemption exists.
