---
adrId: ADR-0041
shortName: token-spend-as-declared-workflow
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: later
source: imported-and-cleaned
---
# All Model-Token Spend Executes Within a Declared Workflow

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** later.
- **Project application:** Apply declared token-spend workflow controls when DWF ships AI features; it is not a now-roadmap concern.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted — Story 597.1 completed the targeted execution-surface inventory at
`docs/technical/token-spend-execution-surface-inventory.md`, classifying the
known memory, workflow input/action, books knowledgebase, chat-turn, and
provider-adapter model-spend call sites against the three ADR-0041 tiers. The
inventory preserves Epic 598/599 migration markers and row-level evidence for
Story 597.2 to convert into fail-closed gate enforcement.

## Proposed Rationale

This ADR intentionally remains `proposed` because Epic 597.1 is the explicit
ratification step: the execution-surface inventory and gate must prove the
migration list is complete before this platform-wide rule becomes accepted.
The governed code listed here is the current migration surface and enforcement
target, not yet a ratified steady-state architecture.

## Context

Model-token spend is the platform's scarcest, most user-visible resource, yet
its governance is fragmented across four regimes today:

1. **Workflow steps** are governed: declared in the workflow library
   (`Agents/_shared/library.yaml` + per-workflow YAML), approvable, budgeted,
   inventoried via `workflowManifest.ts` entry kinds (including first-class
   `deterministic-action` steps from the shared semantics registry), and
   fixture-testable in the universal CLI harness.
2. **The memory consolidation cycle ("dreaming")** is a bespoke background
   engine: `MemoryConsolidationCycleService` registers an idle handler on the
   Epic 212 `OffCriticalPathScheduler` and dispatches steps through its own
   `MemoryConsolidationStepDispatcher` with private budget contracts
   (`memoryConsolidationCycleContracts.ts`). It is **not** in the workflow
   library, not subject to Epic 412 governance gates, and carries a policy
   budget rather than a declared, approvable workflow budget. The Epic 425
   dreaming guardrail already asserts dreaming/learning must be a *declared,
   approved, AND budgeted workflow* and that the build must fail if an
   auto-triggered dreaming path exists — the bespoke service predates and
   violates that contract.
3. **Memory model calls** carry private budget models:
   `MemoryReconciler.reconcile()` calls its inference client inline;
   `replayOverLedger()` gates on an estimated `tokensPerCandidate` budget;
   `PersonaProfileSynthesizer` regenerates profiles with **no** explicit budget.
4. **Interactive conversation turns** spend tokens as the user-facing
   conversation itself, visible by construction.

The consequences of fragmentation: background spend the user cannot see,
review, schedule, or adjust; budget enforcement that differs per code path;
no single integration-test posture; and agents that cannot propose changes to
processes that are hardcoded rather than data. This also violates the
single-path principle (ADR-0027): the consolidation dispatcher is a parallel
mini-workflow-engine beside the real one.

Two ratified directions already point the same way: Epic 425 (declared,
approved, budgeted dreaming with a fail-closed build gate) and Epic 501
(every scheduled task binds to a scheduled conversation or a project task —
no orphaned background cron).

## Decision

Model-token spend falls into exactly three tiers; each call site must belong
to one, and the tier determines its obligations.

1. **Interactive conversation turns** (a user-visible chat exchange and the
   in-turn capabilities it directly invokes, including in-session memory
   extraction at its declared cadence). Exempt from workflow registration —
   the conversation is itself the visible, user-initiated unit — but every
   such call site MUST report attributed spend through the ai-usage layer,
   and any policy that shapes its spend (extraction cadence, per-session
   atom caps) MUST be user-inspectable and user-adjustable configuration.

2. **Local-free compute** (e.g. offline-e5 embeddings via sqlite-vec). Exempt
   from token governance; MUST remain visible in diagnostics so "free because
   local" is an auditable claim, not an assumption.

3. **Everything else — all background, scheduled, idle-triggered, or
   batch model spend — MUST execute as a declared workflow** (or a registered
   step within one):
   - **Declared**: registered in the workflow library as data (YAML), never a
     bespoke service-internal engine.
   - **Approved**: subject to the standard workflow governance gates.
   - **Budgeted**: token + wall-clock budgets declared on the workflow and its
     steps; deterministic (non-model) work declared as registered
     `deterministic-action` step kinds from the shared semantics registry,
     made general-purpose wherever possible.
   - **Model-aware**: each model step declares its model tier; the package
     default applies when a step does not (Epic 600).
   - **Testable**: executable under the universal fixture harness with no live
     token spend.
   - **User-governed**: viewable and editable by the user like any workflow;
     adjustable by agents only through the existing governed proposal paths
     (workflow authoring / AppActions).
   - **Scheduled visibly**: any recurrence binds to a scheduled conversation
     or a project task per the Epic 501 no-orphan rule. Idle/quiescence
     triggers may *launch* a declared workflow but may not execute spend
     outside one.
   - **Dormant by default**: background workflows ship disabled and are
     activated through explicit user opt-in (for memory workflows: the
     Orchestrator onboarding 1:1, Epic 601). First run of the product starts
     zero background model-spending processes.

**Enforcement.** The Epic 425 dreaming guardrail generalizes into a
token-spend execution-surface gate (Epic 597): the build fails when a model
call site is reachable outside Tier 1/2 without a declaring workflow. The
gate consumes a version-controlled inventory of call sites with their tier
classification; adding a model call site without classifying it fails closed.

**Migration list (finite; this ADR is a constraint on new code plus this
list, not a big-bang rewrite):**

| Current path | Target |
|---|---|
| `MemoryConsolidationCycleService` / `Runner` / `StepDispatcher` | `consolidate-memory` declared workflow; bespoke engine retired (Epic 598) |
| `MemoryReconciler.replayOverLedger()` | `reconcile-memory-ledger` declared workflow (Epic 599) |
| `PersonaProfileSynthesizer` | `synthesize-persona-profile` declared workflow with a real budget (Epic 599) |
| `MemoryReconciler.reconcile()` (single candidate) | registered shared model-step kind composed by extraction and consolidation workflows (Epic 599) |
| In-session extraction / session-end flush | stays Tier 1; ai-usage attribution + user-adjustable policy surface (Epic 597) |

## Consequences

- Nothing model-spending runs behind the scenes unknown to the user: every
  background process is a reviewable workflow with a budget, a schedule the
  user can see and change, and run records.
- One budget regime: workflow/step budgets replace the per-service budget
  inventions (`ConsolidationBudgetCap`, `tokensPerCandidate`, none-at-all).
- One execution engine: the consolidation dispatcher's deterministic steps
  become reusable `deterministic-action` kinds available to every workflow,
  honoring ADR-0027 single-path and the extension-point posture of ADR-0016.
- Agents gain a sanctioned lever: because the dreaming/memory processes are
  workflow data, agents can propose improvements through the same governed
  authoring path as any workflow — closing the loop the Orchestrator's
  learning subsystem already models.
- Cost: migrating the five paths is real work (Epics 598–599), and workflow
  launch adds marginal overhead versus a direct service call on the idle
  path. Accepted: the idle path is by definition latency-insensitive.
- The dreaming guardrail stops being a special case: Epic 425's
  declared/approved/budgeted assertion becomes the platform-wide rule, with
  dreaming merely its first instance.
