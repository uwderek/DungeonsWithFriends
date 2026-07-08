---
adrId: ADR-0056
shortName: single-governed-workflow-execution-authority
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: later
source: imported-and-cleaned
---
# ADR-0056: Single Governed Workflow Execution Authority — In-Process Factory over RPC Delegation

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** later.
- **Project application:** A single governed workflow runtime may be useful for BMAD/agent workflows later; do not import ActionPlan runtime assumptions.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

- **Source status:** Proposed
- **Date:** 2026-07-03
- **Governs:** how the `actionplan-platform` façade obtains a workflow runtime to execute an external platform's run, and where the governance wiring (durable consent backing, the Epic-998 improve-loop chokepoint, the Epic-961.2 checkpoint-commit port, the run-measurement sink) is composed. Delivered by Epic 1201.
- **Relates to:** the fleet redesign plan §4 (`docs/technical/mcp-fleet-architecture-and-resilience-redesign-plan.md`), whose M2 defect (a second, stripped in-process runtime in the façade) this decision closes; the durable-consent gate (Epic 404), the live improve loop (Epic 998), atomic checkpoint commits (Epic 961.2), and the OTel measurement spine (ADR-0053); the run-to-boundary protocol (Epic 1179 band).

## Context

Action Plan promises external platforms that driving a workflow through the `actionplan-platform` façade is governance-equivalent to running it in-app: the façade's own comment asserts "external execution can never diverge from in-app execution." At the wiring level this was untrue. The direct workflow-runtime MCP server composed the full governance set inline, but the façade constructed a **second `ActionPlanWorkflowRuntime`** with only the run-measurement sink — no durable consent backing, no improve-loop chokepoint, no checkpoint-commit port. A consent granted through the façade could evaporate with the process, an improve-loop capture that in-app execution would record was silently skipped, and a checkpoint that in-app execution would commit never landed. This is exactly the "second execution authority" divergence — the fleet redesign plan's M2 class — and the plan did not cover it.

Epic 1201 removes the second execution path. Two designs can make the façade governance-equivalent:

1. **In-process factory** — extract one composed "governed workflow runtime factory" that is the only sanctioned constructor of an `ActionPlanWorkflowRuntime`, and have BOTH the direct server and the façade construct through it in their own process.
2. **RPC delegation** — leave the governed runtime only in the workflow-runtime server process and have the façade delegate every execution to it over an inter-process transport, holding no runtime of its own.

We must choose, weighing process topology, latency, and failure isolation.

## Decision

**Adopt the in-process governed workflow runtime factory (design 1).** `composeGovernedWorkflowRuntime` in `ActionPlan/mcp/workflow-runtime/src/runtime/governedWorkflowRuntimeFactory.ts` is the single sanctioned constructor: it installs the durable consent backing and composes the improve-loop chokepoint, the checkpoint-commit port, and the measurement sink, returning a branded governed runtime. Governance is **non-optional by type** — a caller chooses environment-specific *implementations* (a bound governed mutation session's checkpoint port, a test's in-memory ports) but cannot construct a runtime with a governance component absent. Both the direct workflow-runtime server and the platform façade construct through this factory; the façade's stripped `new ActionPlanWorkflowRuntime({ runMeasurementSink })` is deleted, and `PlatformWorkflowFacade` now requires an injected runtime port (no ungoverned default), so a façade can never wrap a second, stripped runtime.

RPC delegation is rejected for this milestone.

### Why in-process, not RPC

- **Process topology.** Action Plan is local-first: the façade and the workflow-runtime server run on the same host under the same trust boundary and the same discovered store root. An in-process factory keeps one composition decision without introducing a new inter-process hop or a new transport to own, monitor, and version. RPC would add a distributed-systems seam (serialization, backpressure, reconnection) purely to reach code already importable in-process.
- **Latency.** The run-to-boundary protocol advances a workflow step-by-step; RPC delegation would put a network round-trip on every `workflow_execute_next` advance. The in-process factory adds zero per-step latency — the façade calls the same object the protocol drives.
- **Failure isolation.** The stated benefit of RPC — isolating a crashing runtime from the façade — is not worth its cost here: the façade has no useful behavior when the runtime is unreachable (its read-only contract tools already answer from an in-memory store when discovery fails), and durable session persistence under the discovered host root already lets a crashed run resume across restarts. In-process construction does not weaken this: the checkpoint-commit port on a server without a bound governed mutation session fails closed (records its unbound status) rather than silently succeeding, so governance is present and honest even where a real commit cannot land.
- **Single-authority invariant.** The whole point is *one* governed composition. An in-process factory makes that a compile-time guarantee (the type forbids omitting governance) plus a construction-guard gate; RPC would make "did the far side compose governance?" a runtime property the façade cannot check.

If a future milestone splits the fleet across process or host boundaries (e.g. the managed-host control plane, ADR-0052), RPC delegation can be revisited — the factory seam is the natural place a transport-delegating implementation would slot in, so this decision does not foreclose it.

## Consequences

- **Positive:** the façade's governance-parity claim becomes structurally true for every external platform; governance wiring is one decision made once, enforced by types and a construction-guard gate (`check-single-workflow-execution-authority`, wired into `verify.cjs lint`); no new transport, no per-step latency; a conformance test proves façade-driven and direct runs produce identical governance artifacts.
- **Negative / costs:** the façade process composes the governance stores (consent backing, improve-loop journals) it did not before — acceptable because these are the same fail-soft, metadata-only host stores the direct server already composes, rooted under the same discovered host root. The construction-guard gate and conformance suite add CI surface to maintain.
- **Invariant:** there is exactly one governed workflow execution authority. Any new `ActionPlanWorkflowRuntime` construction in production code must go through `composeGovernedWorkflowRuntime`; the gate fails closed (with a file:line citation and the factory as the remedy) otherwise, and only a reviewed `ungoverned-runtime-allowed` marker on a read-only, non-executing catalog reader is exempt.

## Alternatives considered

- **RPC delegation from the façade to the workflow-runtime server** — rejected above (adds a transport and per-step latency for a failure-isolation benefit that local-first topology does not need). Revisitable if the fleet is ever split across hosts.
- **Leave the façade's stripped runtime, add missing wiring inline** — rejected: it re-creates the per-caller governance checklist that produced M2 in the first place; a third caller would get it wrong again. The factory removes the checklist.
- **Make governance components optional on the factory with runtime assertions** — rejected: optional-with-assert defers a compile-time guarantee to a runtime failure. Non-optional types make an ungoverned governed-runtime unconstructable.
