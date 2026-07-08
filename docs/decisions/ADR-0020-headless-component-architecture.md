---
adrId: ADR-0020
shortName: headless
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# Headless Component Architecture — Separate Behavior from Presentation

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** Separate behavior from presentation in Expo/Gluestack/Tailwind components. Keep TypeScript hooks, schemas, state machines, and domain logic portable.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Promotion Notes

Promoted on 2026-05-26 alongside the first wave of headless extractions:
`useRecurrenceEditor`, `useBlockEditorSelection`, `useBlockEditorTree`,
`useBlockEditorSlashCommands`, and `useBlockEditorWikiLinks` all ship
with pure-logic colocated tests that exercise the hooks without a DOM
mount. The `check-headless-purity.js` quality script (which would
mechanically assert zero presentation-layer imports in the headless
modules) is deferred to a follow-up PR; until then the linkage is
enforced by review using the `headless-component-architecture.yaml`
pack.

## Context

Reusable UX primitives in this repository today bundle three concerns into one
React component: **behavior** (state machine, keyboard handling, focus
management, ARIA semantics), **presentation** (styled markup, theme tokens,
layout), and **app glue** (data fetching, store wiring, feature-tier types).
The bundling produces four chronic costs:

1. **Logic is not unit-testable without a DOM.** The state of a calendar's
   month grid, a rich-text editor's selection model, or a command palette's
   filter ordering can only be exercised by mounting the component and
   driving DOM events. Pure-logic tests are impossible because the logic
   does not exist as a pure module.
2. **The same primitive cannot be re-skinned.** A "compact calendar" and a
   "full-size calendar" are forked components instead of one engine with two
   skins, so behavior diverges silently between them.
3. **The library cannot ship outside this app.** Because presentation
   imports app-tier types and tokens, the component cannot be lifted into a
   second app, an Electron shell, or a future native surface without
   rewriting the logic.
4. **Accessibility regressions are invisible to test.** ARIA/keyboard
   semantics live inside the styled component, so a refactor that
   accidentally drops a `role=` or a focus trap passes review.

ADR-0010 (shared-component-first) is about *consuming* the shared surface.
This ADR is about *constructing* it as a separable behavior layer plus a
swappable presentation layer — the headless pattern adopted by Radix UI,
Base UI, Headless UI, and TanStack Table as the industry-wide solution to
the same four costs.

## Decision

Every reusable UX primitive under `ActionPlan/components/**` ships as two
explicitly separated layers:

- **Headless layer** — a pure-TypeScript module (hook, state machine, or
  controller class) that owns: state shape, transitions, keyboard handling,
  focus management, ARIA attribute computation, and the typed contract it
  exposes to a presenter. The headless layer MUST NOT import: any styling
  library (styled-components, CSS modules, Tailwind class strings, theme
  tokens), any presentation primitive (a `<div>` is allowed only when it
  carries semantic meaning — modal portal root, focus trap container), or
  any feature-tier or service-tier code (host-runtime services, planning
  package, chat package).
- **Skinned layer** — the styled React component the app renders. The skin
  consumes the headless layer through its typed contract, applies theme
  tokens and layout, and forwards events back. The skin MUST NOT re-derive
  state the headless layer already owns; if the skin needs new state, the
  headless layer is extended.

The contract between the two layers is typed (linking to ADR-0016 stable
enums for any externally communicated classifications). A primitive may
have multiple skins consuming one headless engine.

App-specific data binding (loading notes from a store, persisting calendar
events) lives in the **feature tier**, never in the headless or skin layer.
The feature provides a thin container component that injects data into the
skinned component's props.

## Consequences

- Logic is unit-testable as a pure module with no DOM. Test coverage for
  primitives rises sharply with no test-harness ceremony.
- A single headless engine supports any number of skins (compact, full,
  embedded, print) without divergence.
- The component library can be lifted into another app or published as a
  package; the dependency direction supports it (further constrained by
  ADR-0022).
- ARIA/keyboard semantics are contract-tested at the headless layer, so an
  accessibility regression in a skin is detectable from the skin's own
  snapshot/story without re-asserting headless behavior.
- A reviewer can reject a PR that adds new state to the skin without
  threading it through the headless contract.

If reversed, primitives stay bundled, logic stays DOM-coupled, re-skinning
forks behavior, and the library stays anchored to this app.

## Alternatives Considered

**A. Keep components bundled; rely on shared-first (ADR-0010) for reuse.**
Rejected: ADR-0010 prevents *forking* a primitive but does not split
behavior from presentation, so the unit-testability and portability costs
above remain. ADR-0010 and this ADR are sibling policies (same relationship
ADR-0016 has to ADR-0010).

**B. Adopt a third-party headless library wholesale (Base UI, Radix).**
Considered, not rejected outright — for primitives those libraries cover
well (Dialog, Popover, Menu, Tabs), wrapping them is sanctioned. The ADR
governs the *shape* of our owned primitives (Calendar, rich-text editor,
notes editor, file tree, command palette, workflow graph nodes — none of
which a third-party library covers at the depth this app needs). When a
third-party headless primitive does fit, prefer wrapping it over rebuilding.

**C. Extract logic to hooks "when it grows too big".** The repository's
field history (and ADR-0009/0013's reasoning) shows extraction-later rarely
happens. By the time the bundled component is painful, three other
components have copied its shape. Splitting from day one is the cheaper path.

## Relationship to Other ADRs

- **ADR-0010** (shared-component-first) governs *whether* a one-off can be
  built. ADR-0020 governs *how* the shared one is built. Sibling policies.
- **ADR-0022** (library portability) constrains the dependency direction
  this ADR creates: the headless layer's "no presentation, no app glue"
  rule is what makes ADR-0022 enforceable.
- **ADR-0016** (extension points + typed enums) — the contract between
  headless and skin layers uses ADR-0016's stable enums for any externally
  communicated classification (state-kind, action-kind, role).
- **ADR-0009** (SOLID) — single-responsibility per layer; dependency
  inversion via the typed contract.

## Adoption Status and Cleanup Backlog

The accepted Decision above is the standard. This section records how far the
codebase has actually adopted it, and the backlog to close the gap. It is
descriptive, not a change to the Decision.

### The adoption gap

The original activation gate (`check-headless-purity.js`) only verifies that
files *already classified headless* stay pure. Because only the four promoted
hooks are classified headless, that gate reports zero violations while the
standard is, in practice, almost entirely unadopted — it has no mechanical
signal for "this component bundles behavior and presentation and should have a
headless layer but doesn't."

A new report-only audit, `ActionPlan/quality/audit-headless-adoption.js`,
supplies that missing signal. It shares the base role classifier with the
purity gate (`classifyHeadlessRole` in `adr-compliance-utils.js`) and refines
every `components/**` file into one of three ADR-0020 states. The authoritative,
machine-readable enumeration — every file, its area, and its classification —
is regenerated into **`ActionPlan/output/adr-0020-headless-adoption.json`**;
that artifact, not this prose, is the source of truth. Do not inline the file
list here.

Current snapshot (363 component files scanned):

| State | Count | Meaning |
|---|---|---|
| headless-compliant | 10 | 4 pure `use*` engines + 6 skins that delegate to a colocated engine |
| skinned-without-headless | 95 | a skin that owns non-trivial behavior (state hooks, effects, real event handlers) with no backing engine — the ADR-0020 gap to close |
| presentation-only | 206 | genuinely dumb skins with no owned behavior — legitimately exempt, NOT violations |
| support | 52 | non-hook `.ts` helpers (layout math, pure mappers) |

The 95 `skinned-without-headless` files are the cleanup backlog. They are
concentrated by area (largest first): project 26, chat 18, shared 11, ui 9,
agent-activity 6, calendar 6, dashboard 5, task 4, notes 3, operations 3,
navigation 2, knowledgebase/layouts 1 each. The per-area rollup in the artifact
is authoritative.

### Consolidation map

ADR-0020 also drives de-duplication: two skins that should share one engine are
both a purity gap *and* a consolidation opportunity. The audit emits a heuristic
`consolidationMap` (near-duplicate name stems clustered across areas) into the
same artifact. Current clusters worth folding onto one canonical engine:

- **activeaiwork** (project, 3 members) — Active-AI-work surfaces duplicated.
- **project** (dashboard + project, 3 members, cross-area) — project group/card/panel skins.
- **followedagent** (agent-activity, 2 members).
- **task** (task, 2 members).
- **slashcommand** (chat + shared, 2 members, cross-area) — slash-command menu forked between chat and shared.
- **workflowstep** (agent-activity + project, 2 members, cross-area).
- **projectaction** (project, 2 members).

The cross-area clusters (project, slashcommand, workflowstep) are the highest
leverage: consolidating them removes a fork *and* creates the first reusable
engine for that primitive.

### Cleanup backlog and gate promotion

The ranked, waved execution plan that decomposes this backlog into bounded,
independently-shippable units lives in
[`adr-0020-headless-cleanup-plan.md`](./adr-0020-headless-cleanup-plan.md). Each
unit is one cohesive directory or consolidation cluster, the same shape a
`/batch` wave consumes. No component is refactored by recording this backlog;
the units are executed by later PRs.

Promoting `audit-headless-adoption.js` from a report-only artifact to a blocking
CI gate (e.g. ratcheting the `skinned-without-headless` count down and failing
on regressions) is a deliberate **follow-up**, gated on the backlog burning down
far enough that a non-zero baseline is defensible. This PR does not change the
pass/fail behavior of any existing gate.

### Relationship to consolidation ADRs

- **ADR-0010** (general-purpose / shared-component-first) governs *whether* a
  component should be shared; this audit's consolidation map operationalizes
  ADR-0010 by naming the forks that violated shared-first and should be folded
  back together. The two audits are complementary: `audit-shared-reuse.js`
  classifies placement by reuse count; `audit-headless-adoption.js` classifies
  by behavior/presentation separation.
- **ADR-0027** (single-path / shared-seams-first) is the architectural principle
  the consolidation map serves at the component tier: two skins of one primitive
  are two paths to one behavior, and ADR-0027 wants a single seam. Folding a
  cluster onto one headless engine is exactly the single-path collapse ADR-0027
  mandates for shared seams.

## Confirmation

ADR-0020 is accepted and active as governance for the frontmatter
`governs.code` scope. The current enforcement posture is deliberately split:

- `ActionPlan/quality/check-headless-purity.js` is report-only confirmation
  that files already classified as headless stay free of presentation and
  feature-tier coupling.
- `ActionPlan/quality/audit-headless-adoption.js` regenerates
  `ActionPlan/output/adr-0020-headless-adoption.json`, which is the
  machine-readable backlog for skins that still own behavior without a
  headless engine.
- `Agents/_shared/best-practice-packs/headless-component-architecture.yaml`
  remains the planning/review checklist authority until the ratchet has enough
  burn-down history to become a blocking gate.

Legacy adoption debt is not a blocking failure in this epic. New or modified UX
component work must not increase the report counts for `skinned-without-headless`
or introduce impure headless engines; the ratcheting report supplies the PR
evidence and repair target.
