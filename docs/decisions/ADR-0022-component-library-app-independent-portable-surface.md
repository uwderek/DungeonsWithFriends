---
adrId: ADR-0022
shortName: portability
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# Component Library as an App-Independent, Portable Surface

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** Shared UI/headless components must stay portable across Expo surfaces and future web/downloaded-app skins.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Promotion Notes

Promoted on 2026-05-26 in **report-only** discipline. The new headless
hooks (per ADR-0020) already honor the dependency-direction rule:
`useBlockEditorSelection` has zero domain imports, the other Block
Editor hooks consume only React + `@/core/knowledge/blockDocument`
contracts + `BlockEditor.helpers`. The
`check-component-library-isolation.js` quality script (which would
mechanically assert the allowed/forbidden import lists) is deferred
to a follow-up PR; until then the dependency-direction is enforced
by review using the `component-library-portability.yaml` pack.

## Context

The shared component surface under `ActionPlan/components/**` is intended
to be the design system of the Action Plan app — but if its components
import freely from `services/host-runtime`, the planning package, the chat
package, or any feature slice, the library is **anchored to this app**.
The consequences are concrete:

- The library cannot be extracted into its own published package without a
  multi-week dependency-untangling refactor.
- A second app in the same product family (a native shell, an Electron
  variant, a future companion tool) cannot consume the library; it would
  re-implement primitives instead.
- The component lab (visual harness) gets cluttered with app-state
  scaffolding because components reach into stores instead of receiving
  props.
- Visual regressions caused by feature-tier state changes are
  indistinguishable from real visual changes, because the component depends
  on both.

ADR-0010 governs *whether to build a one-off*. ADR-0020 governs *how the
shared one is split (headless + skin)*. Neither governs *where the library
can live and what it is allowed to depend on*. That is the gap this ADR
closes.

The headless component pattern adopted by ADR-0020 is the architectural
precondition for portability; this ADR is the dependency-direction rule
that makes the portability mechanically enforceable.

## Decision

Every module under the shared component library (`ActionPlan/components/**`
plus the headless-package path established by ADR-0020) MUST satisfy the
following dependency-direction rules:

**Allowed imports:**

- Portable/headless engines: `react`, `react-dom`, `react-aria` /
  `@react-aria/*`, approved web/headless third-party primitives, pure type
  packages, and sibling portable modules.
- Expo/native skins: `react-native`, Expo UI packages, NativeWind/Tailwind
  styling helpers, icons, animation helpers, and sibling library modules. These
  imports are allowed only in files classified as platform skins; they are not
  allowed in portable/headless engines.
- Web skins: DOM/web presentation packages and web-only primitive wrappers are
  allowed only in web skin files; they are not allowed in portable/headless
  engines.
- `packages/actionplan-shared/src/ui-tokens/**` — theme tokens, design
  primitives, color/typography scales.
- `packages/actionplan-shared/src/types/**` — pure type modules with no
  runtime exports.
- Sibling library modules.

**Forbidden imports:**

- `services/host-runtime/**` (any path).
- `packages/actionplan-shared/src/{planning,chat,workflow,governance,
  safety,knowledge}/**` — domain packages that carry app-tier semantics.
- Any module under `ActionPlan/features/**`.
- Any module that itself imports a forbidden path (transitive closure
  enforcement).

**Layer-specific enforcement.** ADR-0022 does not treat every React Native skin
as a portability failure. The portability ratchet must first classify the file
layer:

| Layer | Purpose | Allowed platform imports | Forbidden coupling |
|---|---|---|---|
| Portable/headless engine | State, keyboard/focus behavior, ARIA/accessibility contract, typed presenter contract | None from React Native, Expo, DOM, theme hooks, host runtime, or feature tiers | Any presentation, host-runtime, app-tier, or feature-tier import |
| Expo/native skin | React Native rendering of a portable contract | React Native/Expo presentation, NativeWind/style helpers, icons, local skin helpers | Host runtime, project/chat/planning services, feature-tier state, or re-derived headless state |
| Web skin | DOM/web rendering of a portable contract | DOM/web presentation and approved web primitives | Host runtime, feature-tier state, or re-derived headless state |
| Component Lab fixture | Synthetic examples and visual evidence | Component Lab types/fixtures plus skin imports | Live app stores, host runtime, secrets, or production feature state |
| Feature container | App-specific data binding around a skin | Feature/app services by design | Exporting back into portable component-library modules |

Only portable/headless engines are blocked from platform skin imports. Skin
files are instead checked for app-tier and host-runtime coupling, and feature
containers must remain outside the portable library surface.

**Container pattern for app integration.** When a feature needs to render
a library component bound to app state, the feature provides a thin
**container** under `ActionPlan/features/**` that reads from stores /
services and passes plain typed props to the library component. The
library component never reaches outward; the feature reaches inward.

**Per-property exception.** A library module may declare an explicit
extension point (per ADR-0016 — registry / strategy / configuration
object) that the feature tier supplies. The extension point is a typed
interface, not an import. This is how the library accepts app-specific
behavior without taking an app-specific dependency.

## Consequences

- The library can be extracted into its own package or published. The
  extraction is a `git mv` and a `package.json` author, not a refactor.
- A second app could consume the library by depending on the new package.
- The component lab can host every library component with synthetic
  props, no app-state scaffolding required, which makes visual regression
  testing tractable.
- Visual regressions are isolated from feature-tier state regressions —
  the library has no path to depend on feature state.
- A reviewer can reject a PR that adds a forbidden import with a
  one-line citation to this ADR.

If reversed, the library stays anchored to this app, the component lab
keeps growing app-state scaffolding, and any future "extract the
component library" effort becomes a multi-week refactor before it can
start.

## Alternatives Considered

**A. Allow library → planning/chat imports for "convenience".** Rejected:
this is precisely how the anchoring happens. Every convenience import
costs a week of untangling at extraction time. The container pattern
makes the boundary explicit at the small cost of one extra file per
integration point.

**B. Defer until extraction is actually requested.** Rejected on the same
grounds as ADR-0013 (no deprecation window) and ADR-0010 (no
extract-later for components). The extraction request, when it arrives,
will arrive on a deadline that does not permit a multi-week refactor.
The dependency-direction rule has to land first.

**C. Use only the runtime convention (CLAUDE.md "Architecture & SOLID:
no cross-module cycles") and leave it to review.** Rejected: the SOLID
rule is necessary but not sufficient. A library module importing from
`services/host-runtime` is not a cycle — it is a unidirectional
dependency that anchors the library, and SOLID's acyclicity rule does
not catch it. A direction-specific rule is required.

## Relationship to Other ADRs

- **ADR-0009** (SOLID) — depend on abstractions; this ADR is the
  concrete dependency-direction projection for the component library.
- **ADR-0010** (shared-component-first) — governs *whether* the library
  is used. This ADR governs *what the library can depend on*. Sibling
  policies.
- **ADR-0020** (headless components) — the architectural precondition.
  Without the headless split, the dependency-direction rule has nowhere
  to land because logic and presentation are entangled with app glue.
- **ADR-0016** (extension points) — the typed extension-point interface
  is how the library accepts app-specific behavior without an
  app-specific dependency.
- **ADR-0017** (atomic / reversible) — the activation of this ADR is
  itself atomic: forbidden imports either all land at zero or the
  activation is rolled back.

## Confirmation

ADR-0022 is accepted and active as governance for the frontmatter
`governs.code` scope. `ActionPlan/quality/check-component-library-isolation.js`
regenerates `ActionPlan/output/adr-0022-portability.json` in report-only mode.
That artifact and
`Agents/_shared/best-practice-packs/component-library-portability.yaml` remain
the cleanup and review surfaces until enough layer classification and burn-down
evidence exists to promote changed-scope regressions to blocking.

The current policy is not a big-bang ban on React Native or Expo presentation
code. It is a layer boundary: portable/headless engines must stay platform-free,
skins may import their rendering platform, and neither engines nor skins may
import app-tier or host-runtime authority.
