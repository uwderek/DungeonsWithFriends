---
adrId: ADR-0018
shortName: adr-pack-linkage
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: later
source: imported-and-cleaned
---
# Best-Practice-Pack ↔ ADR Linkage Contract

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** later.
- **Project application:** Apply the ADR linkage intent when DWF introduces reusable quality packs, standards, or governed implementation playbooks.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

The Action Plan repository carries two governance surfaces that describe the
same policies in different shapes:

1. **ADRs at `docs/decisions/`** — the strategic surface: *why* the policy
   exists, what would happen if it were reversed, what alternatives were
   considered, and what mechanism (gate / hook / quality-script / contract-test
   / manual) confirms it.

2. **Best-practice packs at `Agents/_shared/best-practice-packs/`** — the
   tactical surface: the proactive checklist used at code review and inside
   workflow YAMLs (referenced by pack id).

Without a bidirectional linkage contract, the two surfaces drift. Engineers
find one and not the other, the prose duplicates inconsistently, and a
policy change updates one side but not the other. ADR-0009 through ADR-0017
established the linkage edges as part of Epic 250; without ADR-0018 and the
validator authored alongside it, the edges decay silently.

## Decision

Every ADR that is *motivated by* a best-practice pack and every pack that is
*governed by* an ADR carries an explicit bidirectional link:

- **ADR → pack.** An ADR motivated by one or more packs adds `motivated-by`
  to its `governs.relations` array AND names each pack id in its
  `## Confirmation` section using a `reference:` field that points at the
  pack's canonical path under `Agents/_shared/best-practice-packs/`.
- **Pack → ADR.** A best-practice pack governed by one or more ADRs adds an
  `adr:` field in its front-matter, listing every ADR id that motivates it.
  Multi-ADR linkages use a YAML array (e.g. `adr: [ADR-0010, ADR-0016]`).
- **Bidirectional validation.** The validator
  `ActionPlan/quality/check-adr-pack-linkage.js` builds the
  `ADR-N → pack-X` graph (from ADR Confirmation references) and the
  `pack-X → ADR-N` graph (from pack `adr:` fields). It fails closed when an
  edge exists in one direction but not the other; the failure names the
  missing edge and the exact repair (which file to add the field to).
- **No-linkage is valid.** A pack without an `adr:` field and an ADR
  without a pack reference is fine — the contract is symmetry, not
  presence. Standalone packs (e.g. a future pack with no ADR yet) and
  standalone ADRs (e.g. ADR-0012 MCP-first, motivated by the
  authoritative override block, not a pack) both pass.

## Consequences

- The two governance surfaces stay aligned; a future maintainer reading
  one is always one link away from the other.
- A drift-of-one (e.g. someone edits a pack but forgets to update the
  ADR Confirmation reference) fails closed at the gate with a precise
  repair instruction.
- Multi-ADR pack linkage is first-class (e.g. `extensibility-and-reuse`
  links to both ADR-0010 and ADR-0016).
- The `motivated-by` semantics live in YAML front-matter (validatable)
  plus the ADR Confirmation body section (human-readable); the validator
  reads both shapes.

If reversed, the two surfaces drift in parallel; engineers find conflicting
answers depending on which they read first, and the duplication accumulates
maintenance cost forever.

## Alternatives Considered

"Let the prose stay duplicated; periodic audits will catch drift." Rejected:
audits never happen on time. The drift-of-one window between "someone
edits one side" and "someone notices the other side is stale" is months,
and during that window the agent context surfaces the stale side as
authority.

## Confirmation

This ADR is enforced by the quality script
`ActionPlan/quality/check-adr-pack-linkage.js` (MCP-wrapped via the
existing `mcp__actionplan-verification__check_governance_audit` aggregate
gate). The validator runs on every `run_quality_gates` invocation and is
allow-listed in `.claude/settings.json` (added by Story 250.10). The
script:

1. Parses every file under `docs/decisions/*.md` and extracts each ADR's
   Confirmation references that point at a best-practice pack.
2. Parses every file under `Agents/_shared/best-practice-packs/*.yaml` and
   reads each pack's `adr:` field (string or array).
3. Builds the bidirectional graph and reports any asymmetric edge with a
   precise repair instruction (which file, which field, what to add).

The PreToolUse hook `.claude/hooks/inject-governing-adrs.mjs` pins
ADR-0018 on edits to packs and to ADRs themselves.
