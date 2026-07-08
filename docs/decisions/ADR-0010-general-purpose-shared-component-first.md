---
adrId: ADR-0010
shortName: shared-component-first
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# General-Purpose / Shared-Component-First

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** Prefer reusable shared/headless primitives before feature-specific UI or domain implementations.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

The "use a design-system or general-purpose reusable component first; document
a reuse decision before building a specific one" rule lives today only as
inlined YAML guidance in 25+ workflow files under `Agents/development/**` and
in the `extensibility-and-reuse.yaml` best-practice pack. With no central ADR,
parallel one-off components proliferate, the design system fragments, and the
future refactor cost compounds. The user has explicitly named this as a
top-priority governance gap.

## Decision

Every UX/UI change MUST first attempt to use an existing design-system or
general-purpose reusable component. Before building a specific-to-the-feature
component, the contributor explicitly documents (in the PR or story Dev Notes)
either:

1. which existing reusable component was reused; or
2. a reuse decision — extracted variant, new general-purpose component, or
   documented justification — that names *why* the specific path is the right
   one *and* what is being shared back into the reusable surface.

Specific-only components without that justification are rejected at review.

## Consequences

- The design system stays coherent; visual and behavioral primitives converge
  rather than fork.
- Adding a new variant touches the shared component, not a parallel local
  copy, so visual regressions are caught in one place.
- The `audit-shared-reuse.js` gate (MCP-wrapped as
  `mcp__actionplan-verification__audit_shared_reuse`) keeps an empirical eye
  on the reuse surface and surfaces drift.

If reversed, the codebase fragments into a graveyard of one-off components,
each one-line-different from a sibling, and the design system stops being a
system.

## Alternatives Considered

"Build now, extract later." Rejected: extraction rarely happens. By the time
three sibling components exist, each carries divergent behaviors and
backporting a shared base means picking a winner and breaking the other two —
work that gets scheduled but not done.

## Confirmation

This ADR is enforced through:

- The quality script `ActionPlan/quality/audit-shared-reuse.js` (MCP-wrapped
  as `mcp__actionplan-verification__audit_shared_reuse`) audits the
  shared-component reuse surface and is part of the aggregate
  `run_quality_gates` set.
- The pack `Agents/_shared/best-practice-packs/extensibility-and-reuse.yaml`
  defines the proactive review checklist; the pack carries `adr: ADR-0010`
  (and `ADR-0016`) so the linkage validator (see ADR-0018) keeps the two
  surfaces in sync.

The PreToolUse hook `.claude/hooks/inject-governing-adrs.mjs` pins this ADR on
every edit under `ActionPlan/components/**` or `ActionPlan/features/**`, so
agent UX edits surface the shared-first rule as binding context.
