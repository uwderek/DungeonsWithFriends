---
adrId: ADR-0053
shortName: measurement-emission-from-the-otel-span-spine
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: later
source: imported-and-cleaned
---
# ADR-0053: Measurement Emission from the OTel Span Spine

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** later.
- **Project application:** Use the measurement intent for future AI spend and performance tracking when AI features exist.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

- **Source status:** Proposed
- **Date:** 2026-06-29
- **Governs:** Epic 1109 (Predictive Measurement Wiring — Run-Time & Review-Time)
- **Supersedes / relates to:** consumes the OTel run-event spine (Epic 955: run +
  tool-call spans, spend-ledger cost enrichment) and the OTel GenAI parity set
  (ADR-0051); feeds the planning measurement/forecast engine
  (`mcp/planning/src/measurement/measurementStore.ts`, Epics 414/421/544); keeps
  cost owned by `actionplan-ai-usage` (copied, never recomputed).
- **Plan:** agent-observability-verification-and-measurement-wiring-design.md (source path: `../technical/agent-observability-verification-and-measurement-wiring-design.md`) §4, §9

## Context

Action Plan's run-time and review-time measurement engine is fully built and
tested — idempotent `recordRun` with a per-step breakdown, `estimateRun`
(histograms + Welford + PERT cold-start), sMAPE estimator-accuracy, reference-class
forecasting, and a Monte-Carlo risk forecast, plus a `UserReviewSession` review
timer and review-budget tooling. But **nothing feeds it**: a grep of the live tree
shows `record_run` and `record_user_review_time` have no production callers (only
definitions, unit tests, and one CLI integration test), the risk forecaster reads a
hardcoded `RISK_FIXTURE_MEASUREMENT_HISTORY`, and the reference-class corpus
write-on-risk-closure path is never invoked. Predictions therefore cannot learn
from actuals. The question is *how* to feed the engine without coupling it to the
executor or duplicating instrumentation.

## Decision

Feed the measurement engine from the existing event spine, fail-closed:

1. **Run durations come from a span sink, not a direct executor call.** A
   `RunMeasurementSink` subscribes to the run-complete OTel span (Epic 955) and
   calls `record_run` with `runId, shapeKey, started/endedAtMs, tokens, costUnits
   (copied from ai-usage), per-step observations, outcome, wasUnplanned`. The
   executor gains no planning-client dependency; idempotency by `runId` makes
   re-delivery safe. This honors the "one event spine, many sinks" rule shared with
   the live-observability work (Epic 1107).

2. **Review time is captured at the review boundary.** `UserReviewSession` is
   instantiated when a `user-review` / `option-proposal` / approval boundary opens
   (boundary resolver, Agents-screen review items, and CLI review) and closed on the
   terminal decision, emitting `record_user_review_time(runId, sessionId, reviewMs)`.
   Reconciliation by `(runId, sessionId)` counts a re-opened surface once. A sweep
   reclaims orphaned sessions.

3. **The forecaster reads live history; the fixture is test-only.** Live
   measurement history replaces `RISK_FIXTURE_MEASUREMENT_HISTORY` on the production
   path. With no live history the forecaster uses explicit PERT cold-start — never a
   silent fixture. The fixture is reachable only behind a test-only flag (the App
   Incomplete Wiring fail-closed rule).

4. **The reference-class corpus accumulates on risk closure.** Closing a risk writes
   the actual/estimate ratio to the corpus so uplift calibrates from history.

5. **Cost and human-review turnaround stay first-class but separate.** Cost is
   copied from `actionplan-ai-usage`, never recomputed. Human-review turnaround is
   modeled as its own distribution distinct from agent-step duration so the
   critical-path forecast can plan around humans in the loop.

## Consequences

- **Positive:** predictions learn from real run + review times; the executor stays
  decoupled (sink subscribes to spans); idempotency tolerates redelivery; fail-closed
  cold-start removes the silent-fixture honesty gap; turnaround planning gains real
  human-review data.
- **Negative / costs:** depends on run-complete spans being emitted reliably (a
  missed span = a missed measurement — mitigated by idempotent replay and a
  reconciliation sweep); review-time capture touches every review surface; a sink and
  the engine must agree on the single emission site to avoid double counting.
- **Open items (resolved in the epics):** orphaned-review-session sweep cadence
  (Epic 1109.2); exact per-step-type turnaround surface (Epic 1109.5).

## Alternatives considered

- **Direct `record_run` call from the executor:** rejected — couples the executor to
  the planning client and re-instruments what the span spine already carries.
- **Keep the fixture as a production default until live data exists:** rejected —
  violates the fail-closed rule; a fixture masquerading as actuals is the exact
  honesty defect the APWI inventory targets.
- **Recompute cost in measurement:** rejected — `actionplan-ai-usage` is the single
  source of truth; measurement copies observed units.
