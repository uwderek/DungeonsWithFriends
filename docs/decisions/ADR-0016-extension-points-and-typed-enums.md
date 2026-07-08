---
adrId: ADR-0016
shortName: extension-points
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# Extension Points and Stable Typed Enums Over Branch Sprawl

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** Use registries and typed strategies for systems, sheets, rules, render modes, component bindings, and integrations.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Workflows and services in this repository routinely grow by **variant**: a
new provider, a new mode, a new tool kind, a new event source. The naive
shape is "add an `if` for now — it's one branch", which becomes three
branches in a sprint, ten in a quarter, and an emergency refactor in two.

Two coupled policies live today in CLAUDE.md (§Architecture & SOLID) and the
`extensibility-and-reuse.yaml` pack, plus a worked example in
`docs/product/everything-cc-capability-strategy.md`:

1. **Extension points first.** When a workflow or service is expected to
   grow by type or variant, build a registry, strategy, or configuration
   object from day one — not a switch statement that will be refactored
   "later".
2. **Stable typed enums for externally communicated classifications.**
   Producer and consumer surfaces drift silently when classifications are
   stringly-typed. A stable, exported, typed enumeration pins both sides
   to one set of valid values.

## Decision

- When a workflow or service is expected to grow by type/variant, the
  first implementation builds the extension point (registry / strategy /
  configuration object). The branchy ladder is rejected at review.
- Externally communicated classifications (event kinds, message kinds,
  provider ids, persona roles, workflow phases, error codes that cross
  process boundaries) are exposed as **stable strongly-typed enumerations**
  (TypeScript `as const` arrays + derived types). Producer and consumer
  modules import the same enum.
- A contract test pins enum membership so adding a value is intentional
  and removing one is a typed breaking change.

## Consequences

- Adding a variant touches one file (a new entry in the registry or a new
  strategy implementation), not every consumer.
- Producer/consumer enum drift is caught at the type system rather than at
  code review or runtime.
- The "ten branches" failure mode never materializes because the registry
  was there from branch one.

If reversed, combinatorial branch explosions accumulate and force
emergency refactors; producer/consumer surfaces drift into silent
miscategorisation.

## Alternatives Considered

"Just add an if for now — it's one branch." Rejected: this repository has
the field history to disprove the assumption. Every "one branch for now"
became three branches before the cleanup ticket was scheduled, and the
cleanup ticket was the one that got bumped from the sprint when something
more visible came up.

## Relationship to ADR-0010

ADR-0010 (general-purpose / shared-component-first) is about *using* the
shared surface. ADR-0016 is about *building* the shared surface as an
extension point rather than a branchy ladder. They are sibling policies,
not duplicates. Both link the same pack
(`Agents/_shared/best-practice-packs/extensibility-and-reuse.yaml`); the
pack declares `adr: [ADR-0010, ADR-0016]` so the linkage validator
(ADR-0018) supports the multi-ADR linkage.

## Confirmation

Two mechanisms confirm this ADR:

- **`mechanism: contract-test`** — enum stability tests under the chat
  contracts package (e.g.
  `ActionPlan/packages/actionplan-shared/src/chat/agentCatalogContracts.test.ts`
  and sibling `*Contracts.test.ts` files) pin enum membership and shapes;
  adding a value is intentional, removing one is a typed breaking change
  that the contract test catches.
- **`mechanism: manual`** —
  `Agents/_shared/best-practice-packs/extensibility-and-reuse.yaml`
  carries the proactive heuristic for the registry-over-switch decision
  at code review. The pack declares `adr: [ADR-0010, ADR-0016]`.

The PreToolUse hook `.claude/hooks/inject-governing-adrs.mjs` pins
ADR-0016 on edits to registry/enum-heavy modules under
`packages/actionplan-shared/src/**` and host-runtime services.
