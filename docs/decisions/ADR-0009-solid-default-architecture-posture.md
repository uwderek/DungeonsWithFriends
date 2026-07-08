---
adrId: ADR-0009
shortName: solid
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# SOLID Is the Default Architecture Posture

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** Use SOLID as the default posture for Expo/TypeScript modules now and for Rust/Tauri, Cloudflare, Neon/Postgres, and WorkOS adapters later.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Action Plan composes services across host-runtime, shared contracts, and feature
slices. Without an explicit SOLID posture, monolithic services and untestable
code accumulate quickly: a single class accretes responsibilities, dependencies
get hard-wired, fat interfaces force consumers to implement unused methods, and
cross-module cycles emerge that block re-layering. The cost of treating SOLID
as optional is paid weeks later as emergency refactors. CLAUDE.md and AGENTS.md
already encode the four rules in prose, and `solid-design-principles.yaml`
captures the pack-level tactical checklist, but neither is queryable as a
supersession-tracked decision the agent context can pin.

## Decision

SOLID is the default architecture posture for every service, shared contract,
and feature layer in this repository. **All five principles are analysed
individually — not as a single "is this SOLID?" gut-check.** Earlier this ADR
enumerated only four rules and silently omitted Open/Closed; a central registry
that had to be edited for every new variant (an Open/Closed violation) then
shipped because no rule named OCP and no gate watched for it. The per-principle
checklist below exists so every governed change answers each principle in
particular:

- **Single Responsibility (SRP)** — each type has one reason to change.
- **Open/Closed (OCP)** — a thing expected to grow by type/variant is extended
  by *adding* a registration / strategy / co-located config, never by editing a
  central enumeration or a switch ladder. See **ADR-0016** (extension points)
  for the canonical rule.
- **Liskov Substitution (LSP)** — every implementation of an abstraction is
  substitutable for it without weakening the contract callers rely on.
- **Interface Segregation (ISP)** — small, focused interfaces over monolithic
  ones; no consumer is forced to depend on methods it does not use.
- **Dependency Inversion (DIP)** — depend on abstractions; inject concrete
  implementations. One shared seam per job (see **ADR-0027**), not parallel
  paths.
- **No cross-module cyclic dependencies** — keep the layer graph acyclic; do
  not leak app-layer concerns into foundational modules.

### Per-principle review checklist

Every governed change (and its review) answers each line individually — a "yes,
N/A, or here is why" per principle, never a single lumped verdict:

1. **SRP** — does any type I touched gain a second reason to change? If so,
   extract.
2. **OCP** — will the next variant of this thing require editing a central
   list/map/switch? If so, invert it to self-registration / co-located config
   (ADR-0016). *This is the line the central-registry miss failed.*
3. **LSP** — can every implementation stand in for its abstraction without a
   caller special-casing it?
4. **ISP** — does any consumer depend on an interface wider than it uses?
5. **DIP** — does this depend on a concretion it should receive through an
   abstraction, or duplicate a job that already has a shared seam (ADR-0027)?

A new cross-module dependency requires a brief layering analysis recorded in
the PR.

## Consequences

- Code stays testable: small focused types accept fakes or stubs through
  abstractions.
- The layer graph stays acyclic, so re-layering remains possible without an
  archeological dig.
- Adding a feature touches a bounded set of types; ripple changes shrink.
- Reviewers can cite this ADR when a PR consolidates unrelated responsibilities
  into one class or hard-wires a concrete dependency.

If reversed, monolithic services and untestable code accumulate; every later
refactor pays interest on the deferred cost.

## Alternatives Considered

"Ship fast, refactor later." Rejected: the field history of this repository
shows refactor windows rarely close. Once a monolithic service is shipped,
splitting it later requires coordinated migrations across consumers that the
"later" calendar never schedules.

## Confirmation

This ADR is enforced through review against the **per-principle checklist**
above and the `solid-design-principles.yaml` best-practice pack. The
Confirmation is `manual` for the principles that are genuine judgement calls
(SRP/LSP/ISP), but individual principles are pushed to automated gates wherever
a concrete, checkable rule exists rather than left to "is this SOLID?" review:

- **OCP** now has its first automated instance — `check-mcp-self-documentation`
  (registered in `QualityHandler`, see **ADR-0016** and **ADR-0031**) fails the
  build when MCP server documentation is centrally enumerated instead of
  co-located. New OCP-shaped surfaces should add their own such gate rather than
  rely on review alone.
- **DIP / single-path** is gated by the shared-seam contract tests under
  **ADR-0027**.

Pack reference: `Agents/_shared/best-practice-packs/solid-design-principles.yaml`
declares the proactive checklist (single-responsibility per type, dependency
injection through abstractions, small focused interfaces, no cross-module
cycles); the pack carries `adr: ADR-0009` so the linkage validator
(`check-adr-pack-linkage.js`, see ADR-0018) keeps the two surfaces aligned.

The PreToolUse hook `.claude/hooks/inject-governing-adrs.mjs` (Story 249.2)
pins this ADR onto edits under the governed code globs, so every agent edit to
a service or shared-contract module surfaces the SOLID rules as binding
context, not advisory hints.
