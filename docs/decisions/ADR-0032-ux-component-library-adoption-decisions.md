---
adrId: ADR-0032
shortName: ux-library-adoption-decisions
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: now
source: imported-and-cleaned
---
# UX Component Library Adoption Decisions

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** now.
- **Project application:** Expo plus Gluestack/Tailwind is the current UI stack. Preserve the headless behavior/presentation split and re-evaluate added component libraries separately.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Epics 365-369 need one authority for third-party component-library choices so teams do not introduce overlapping primitive owners while expanding the headless and Expo/native UX component system. ADR-0020 allows wrapping a third-party primitive when it fits. ADR-0022 requires the wrapper to preserve the portable-engine versus platform-skin boundary.

Authoritative references reviewed for this decision include rn-primitives, React Aria, React Stately, Radix Primitives, Base UI, TanStack Table, WAI-ARIA APG, and React Native accessibility documentation. The review posture is dependency governance only; this ADR does not install any package.

## Decision

Third-party libraries are classified as `adopt`, `wrap`, `reference-only`, or `reject` for each primitive family. A future PR that adds a component-library dependency must point to one row below or add a new ADR that changes the posture.

| Library | Posture | Owning Primitive Family | Rationale |
|---|---|---|---|
| `rn-primitives` | wrap | Expo/native overlays, menus, tabs, switches, radio/checkbox, select, tooltip, toast | rn-primitives provides unstyled universal React Native components with accessibility focus and can support Expo skins without becoming the portable engine authority. Wrap per primitive, do not wholesale adopt. |
| `react-native-aria` | reference-only | Expo/native accessibility behavior | Useful as an accessibility behavior reference for React Native. Do not adopt as a second primitive authority unless a follow-up ADR proves maintenance fit and package health. |
| React Aria | wrap | Web skins and accessibility contracts | React Aria provides style-free accessible behavior and hooks/components for web. Use for web skins or as behavior reference; do not import it into Expo/native engines. |
| React Stately | wrap | Portable state machines where package shape fits web/headless needs | React Stately is acceptable for state behavior that remains platform-free. Wrap behind Action Plan contracts so app components do not depend directly on library-specific state shapes. |
| Radix Primitives | wrap | Web overlays, dialogs, menus, popovers, tabs, tooltips | Radix is unstyled, accessible, and composable for web. It is not an Expo/native dependency and must stay behind web skin wrappers. |
| Base UI | wrap | Web overlays, combobox/autocomplete, menus, dialogs | Base UI is an unstyled accessible React web library with strong edge-case support. It can be wrapped for web skins where it is stronger than Radix or React Aria. |
| TanStack Table | wrap | Data-table headless engine | TanStack Table is the preferred headless table engine when table complexity exceeds local primitives. Wrap behind Action Plan table contracts and keep skins separate. |
| gluestack-ui | reference-only | Expo/native visual patterns | Useful for design/API comparison, but it should not own Action Plan primitive behavior because it overlaps broad UI authority. |
| Tamagui | reference-only | Cross-platform styling/system patterns | Reference for cross-platform design-system tradeoffs only. Do not adopt as a primitive authority without a larger styling-system ADR. |
| NativeWindUI | reference-only | NativeWind Expo visual patterns | Reference for NativeWind-compatible skins; not a behavior owner. |
| React Native Reusables | reference-only | Copy/reference examples for Expo skins | Useful for shadcn-style React Native patterns, but copy/reference only unless a specific wrapper ADR is approved. |
| React Native Paper | reject | None | Opinionated Material Design component authority conflicts with Action Plan's canonical primitive ownership. |
| React Native Elements | reject | None | Broad opinionated component suite would duplicate primitive ownership and styling authority. |
| React Native UI Lib | reject | None | Broad UI kit overlaps design-system authority and is not a headless primitive source. |

## Adoption Rules

- Prefer local headless engines for Action Plan-specific behavior such as workflow steps, task orchestration, review surfaces, and project planning panels.
- Wrap third-party primitives only at the boundary of one owning primitive family; do not expose vendor APIs through feature surfaces.
- Keep Expo/native skins, web skins, and portable engines in separate files so ADR-0022 can classify allowed imports correctly.
- Do not add a component-library dependency for styling convenience alone.
- A dependency PR must include the ADR checklist evidence: owning primitive family, wrapper seam, portability layer, accessibility obligations, tests, lab coverage, and ratchet impact.

## Consequences

- Teams can select a reference or wrapper without creating a second primitive authority.
- Expo/native and web skins can use different rendering packages while preserving one portable contract.
- Future dependency changes have a deterministic review path: cite this ADR or replace it with a new accepted decision.
