---
adrId: ADR-0043
shortName: output-template-separation
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# Output Templates And Checklists Are First-Class Artifacts

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** BMAD and product document templates, checklists, and generated artifact shapes should be versioned first-class artifacts.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

proposed

## Context

A workflow in the Agents catalog produces two governed things: a *deliverable*
(the document/deck/packet a user receives) and a set of *gates* (the checklists
that must pass before the deliverable ships). Today these two are governed very
unevenly:

- **Checklists are already separated.** Roughly 81% of workflows (≈448 of 554)
  reference their gates as separate checklist artifacts under
  `Agents/_shared/gates/` via `gates:`/`gateIds` rather than inlining
  pass/fail criteria in a step prompt. That separation is the norm and works.
- **Output structure is almost never separated.** Only ~2% of workflows (≈7 of
  554) render their deliverable from a separate, versioned `*.template.yaml`
  through `write-template-artifact` / `render-document`. The rest embed the
  deliverable's structure inline in step-prompt text. Inline output structure
  cannot be versioned independently, cannot be reused across workflows, is not
  reviewable as a deliverable contract, and drifts silently because nothing
  measures it.

There is no governing decision that says output structure must be a first-class
artifact the way checklists already are, and no metric that makes the gap
visible. ADR-0005 already established that git-tracked markdown is the sole
canonical authority for curated artifacts and that derived indexes are
rebuildable projections; an output template is exactly such a curated,
reviewable, git-tracked artifact, so the precedent points the same way.

## Decision

Every workflow output is a first-class, separately-versioned artifact:

1. **Deliverable output is rendered from a separate `*.template.yaml`.** A
   workflow that produces a document/deck/packet deliverable MUST render that
   deliverable from a separate, versioned `*.template.yaml` artifact through the
   governed `write-template-artifact` / `render-document` actions (or a child
   workflow that does, e.g. `generate-deliverable` bound an `outputTemplate` /
   `template`), NOT by embedding the deliverable's structure inline in
   step-prompt text. The template is the deliverable's reviewable contract.

2. **Every gate is a separate checklist artifact.** A workflow's gates MUST be
   referenced as separate checklist artifacts via `gates:`/`gateIds` (the
   existing ~81% norm under `Agents/_shared/gates/`), never inlined as
   pass/fail prose in a step prompt.

3. **Compliance is measured and ratcheted.** A template-separation compliance
   gate classifies every workflow as template-separated or inline, emits the
   separation percentage as a reported metric, and enforces a committed ratchet
   baseline that may only rise — mirroring the component-lab coverage gate and
   the CLI source-coverage ratchet. The baseline file
   (`quality/template-separation-ratchet.json`) records the floor; a change that
   regresses separation below the floor fails the build, so adoption can only
   improve.

## Consequences

- Deliverable structure becomes diffable, reviewable, and reusable: a template
  authored once can back many workflows, and a deliverable contract change is a
  reviewed template edit rather than a buried prompt rewrite.
- The ~2%→ ratchet makes the standard real instead of aspirational: the
  high-traffic product/marketing/research/release groups are backfilled to lift
  the measured percentage, and the ratchet locks in each gain.
- New Product Studio workflows ship template-first from day one, so the floor
  rises by construction rather than by remediation.
- A workflow that genuinely produces no rendered deliverable (a pure
  classification/routing/side-effect workflow) is not counted against the
  metric — the classifier only measures workflows that declare a rendered
  deliverable output, so the percentage stays honest.

## Alternatives Considered

- **Leave output structure inline and rely on review.** Rejected: inline
  structure is invisible to tooling, cannot be versioned or reused, and the ~2%
  adoption shows review alone never moved it.
- **Mandate a big-bang catalog-wide backfill.** Rejected as too risky for one
  epic: the ratchet lets adoption rise incrementally under gate pressure while
  the high-traffic groups are backfilled first, with no silent backsliding.
- **A second template authority separate from `write-template-artifact` /
  `render-document`.** Rejected: it would reintroduce exactly the dual-authority
  drift ADR-0005 forbids. The existing governed actions remain the sole render
  authority.

## Supersession Notes

None.

## Proposed Rationale

This ADR is `proposed` rather than `accepted` because it governs a ratchet that
starts well below 100%: the standard is mandated and mechanically enforced from
the recorded baseline upward, but the catalog has not yet converged on full
separation. The compliance gate and high-traffic backfill in Epic 902 establish
and enforce the floor; the ADR is promoted to `accepted` once the catalog-wide
backfill program completes and the ratchet target reaches full separation for
every workflow that declares a rendered deliverable. Until then the decision is
in force and confirmed by the `check-template-separation-ratchet.js` quality
gate, but the remaining low-traffic backfill is tracked as follow-on work, which
is precisely the "shipped and enforced but not yet fully converged" state
`proposed` is meant to capture.
