---
adrId: ADR-0051
shortName: otel-genai-observability-parity
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: later
source: imported-and-cleaned
---
# ADR-0051: OpenTelemetry GenAI Observability Parity & Review

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** later.
- **Project application:** Apply OTel GenAI observability when AI features ship; it is not a local-first now-roadmap concern.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

- **Source status:** Proposed
- **Date:** 2026-06-28
- **Governs:** Epics 1073–1076 (the "OTel GenAI Parity & Review UX" set)
- **Supersedes / relates to:** extends the OTel exporter program (Epic 955: run +
  tool-call spans, spend-ledger cost enrichment, fail-soft OTLP, redaction) and the
  observability CLI/read tools; completes the deferred model-invocation spans
  (Epic 1000) and the token/cost dashboard (Epic 526.1); verifies the GenAI-
  conventions claim of Story 803.1; relates to the trace-driven improvement loop
  (Epic 998).
- **Plan:** agent-loops-context-conversation-steering-otel-program-plan.md (source path: `../technical/agent-loops-context-conversation-steering-otel-program-plan.md`) §1.4, §2, §3 (FS-6)

## Context

Action Plan ships real OTel today (Epic 955): run and tool-call spans enriched with
spend-ledger cost, exported fail-soft over OTLP with secret/PII redaction, plus an
observability CLI (`topology`/`shadow-agents`/`drift`/`otel-status`) and read MCP
tools. But it is **not at GenAI parity**: spans use custom `ap.*` attributes rather
than the `gen_ai.*` semantic conventions (Story 803.1 is marked done but the
attributes were not found in the export code — must be verified/repaired);
**model-invocation spans** are deferred; there are no tool-IO, agent, or **handoff**
spans and no `gen_ai.conversation.id` run correlation; there is **no OTel Metrics
API** (traces only — token/duration/error metrics live only in the spend ledger);
and the spend/token **dashboard** is still planned. The OTel GenAI conventions
(spans + metrics, all still experimental) define a clear parity target; cost and
evals are explicitly **not** in the spec and are the platform's responsibility.

## Decision

Bring AP to OTel GenAI parity and build user-friendly review on top:

1. **Conform to GenAI semantic conventions and emit the full span tree.** Verify and
   repair `gen_ai.*` attribute conformance (Story 803.1); add **model-invocation**
   spans (model, tokens, finish reason, params), **tool** and **agent** spans, and
   **multi-agent handoff** spans as nested `invoke_agent` subtrees; propagate
   `gen_ai.conversation.id` across every span for run/session correlation. A
   conformance suite gates the convention.

2. **Emit GenAI metrics, not just traces.** Add the OTel GenAI **metrics** —
   token-usage, operation/agent/tool/workflow duration histograms, and `error.type`
   — alongside the spend ledger (which stays the canonical cost source).

3. **Cost and evals are AP's responsibility.** Compute **cost** from token-usage ×
   model price (the spec carries no cost attribute) and provide an **eval/scoring**
   surface (LLM-as-judge / rule scores attached to runs) — these are out of OTel and
   in AP.

4. **Review tooling is built for non-technical creators.** Finish the spend/token
   **dashboard** (Epic 526.1), add a **trace-waterfall** viewer, cost/session views,
   and a multi-agent/handoff visualization — presented in plain language, not raw
   OTLP, so a creator can see what their agents did, what it cost, and where it went
   wrong.

## Consequences

- **Positive:** AP traces are portable to any OTel backend (the OpenLLMetry promise);
  cost/latency/quality are visible per run and per agent; the agent-review and
  future performance-review loops have real metrics to draw on.
- **Negative / costs:** instrumenting model/agent/handoff spans touches the model
  client and orchestration paths; the GenAI conventions are still **experimental**
  (Development stability), so attributes may shift and require an opt-in flag; the
  review UX is net-new UI work.
- **Open items (resolved in the epics):** whether to capture prompts/completions
  on-span vs by external reference (opt-in, off by default — Epic 1073); the eval
  scoring model and dataset surface (Epic 1076).

## Alternatives considered

- **Keep custom `ap.*` attributes only:** rejected — breaks portability to standard
  OTel/GenAI backends (Phoenix/Langfuse/Logfire) and re-invents a vocabulary.
- **Traces only, no metrics:** rejected — dashboards and alerts (cache-hit-rate,
  error rates, cost) need metrics, not span scraping.
- **Ship raw OTLP and tell users to bring a backend:** rejected — violates the
  zero-technical-expertise mandate; a creator needs an in-app, plain-language review.
