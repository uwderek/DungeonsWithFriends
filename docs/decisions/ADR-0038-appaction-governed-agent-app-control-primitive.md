---
adrId: ADR-0038
shortName: appaction-governed-app-control
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: next-later
source: imported-and-cleaned
---
# ADR-0038 — The App Action: One Governed Primitive For Agent Control Of App State

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** next-later.
- **Project application:** Model future game, admin, and agent mutations as typed governed actions, not ActionPlan manifests.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

> **Source status: accepted.** Ratified by Story 489.3 — the App Action spine (Epics
> 474–477) and the `check-app-action-coverage` coverage gate (Epic 489 Story 489.1)
> have landed, satisfying this decision's own ratification condition. The
> `confirmation` quality-script mechanism (`ActionPlan/quality/check-app-action-coverage.js`)
> is live and now gates the whole App Action surface. Reference design:
> agent-governed-app-control-plane-plan.md (source path: `../technical/agent-governed-app-control-plane-plan.md`).

## Context

Action Plan lets in-app agents change *some* app state — propose a project, create a
conversation, launch a workflow, control an agent run. Each was wired bespoke: a hardcoded
`INTENT_DEFINITIONS` keyword row, a closed `InlineProposalKind`, an ad-hoc role guard, and a
target service. The substrate is strong but **fragmented across four disjoint registries**, so
making any new feature agent-drivable means re-plumbing all four. The product goal is the
opposite posture: by default, **anything that is app state or reachable from the command line
is also changeable by an agent through conversation**, governed and reversible, and a new
feature becomes agent-controllable *by declaration*, not by bespoke wiring.

## Decision

Adopt a single declarative primitive — the **App Action** — as the *only* sanctioned way to
make a state change agent-drivable. One manifest (`Agents/_shared/app-actions/<id>.yaml`,
loaded into an `AppActionRegistry`) is a superset of, and absorbs, the four legacy registries.
Declaring one manifest derives:

1. **Discovery** — registry-driven intent + `callableById`; replaces hand-written
   `INTENT_DEFINITIONS` rows (which become *generated*, then deleted — no parallel path).
2. **Governance** — a three-tier decision (propose role/capability gate → apply role + worker
   trust → autonomy eligibility + approval posture), evaluated by the existing
   `personaIdHoldsRoleCapability` / `PolicyService` / Epic-297 autonomy policy. Default-deny,
   default-disabled autonomy, **user is always the approver of record**.
3. **Scope** — every App Action declares the scope it can target
   (organization / department / group / user-profile / repository) and whether it sets the
   **global rule** or a **scoped override**, resolved most-specific-wins. The agent proposes
   the narrowest sensible scope.
4. **Surfacing** — one `ActionProposal` renders either **inline** (an editable proposal card)
   or on an **activity** with the chat docked to a sidebar; the scope and other declared fields
   are **editable on the card** so the user re-targets without re-conversing.
5. **Execution + audit** — approval routes through the **one** governed mutation path
   (`domain.mutate` / a named host RPC / an MCP tool / a CLI verb), with dry-run, checkpoint,
   audit, and deterministic replay. No App Action introduces a second ungoverned mutation path
   (consistent with ADR-0027 single-path and ADR-0036 embedded-headless posture).

Capability administration is itself an App Action: the Orchestrator/Agent-Manager roles may
propose `app.agent.capability.grant|revoke` (scope-aware, user-approved) — self-administering
but never self-escalating.

## Consequences

- **Positive:** new features become agent-controllable by adding one manifest; a CI gate
  (`check-app-action-coverage`) fails when a host RPC mutation method or CLI mutation verb has
  no manifest and no opt-out. Governance, scope, surfacing, and audit are uniform and reviewable.
- **Constraint:** the legacy `INTENT_DEFINITIONS` array, `InlineProposalKind`, and the 6
  governed-execution kinds are migrated onto the registry and the literals retired in the same
  change; no temporary parallel path survives.
- **Deferred (out of scope, by design):** the org-hierarchy RBAC enforcement and the
  command-surface lockdown (restricting agents to an allow-listed approved-`ap` command set so
  capability admin cannot self-escalate) are the
  Organizational Security & Agent Access Controls (source path: `../product/roadmap/later/organizational-security-and-agent-access-controls.md`)
  roadmap item; the MVP keeps capability administration human-gated and single-scope.
- **Extends, does not replace:** ADR-0036 (embedded-headless) and ADR-0027 (single-path shared seams) — the
  CLI/RPC surface is projected into the registry rather than re-implemented.
