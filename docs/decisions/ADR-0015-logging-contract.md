---
adrId: ADR-0015
shortName: logging
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# Logging Contract — Intent, Decisions, Outcomes; No Success Spam

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** Log intent, decisions, outcomes, and errors without noisy success spam. Keep logs safe for local-first use and future support workflows.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Observability investment fragments when each module logs in a different
shape: some log every successful step, some log only failures, some emit
multi-line stack traces inline with normal events, and tag/level
conventions drift between teams. The result is logs that are too noisy to
read on an incident and too inconsistent to grep across.

CLAUDE.md (§Logging) defines a four-content-category contract — log intent,
preconditions, decisions, outcomes — plus shape and noise rules
(structured one-line; consistent areas/tags and appropriate levels; do not
log successful completion unless errors are present). The contract has no
central ADR and no dedicated pack today.

## Decision

Every logging call site in the service and MCP layers follows the
logging contract:

- **Content categories.** Log intent (what is about to be attempted), the
  preconditions/decisions that shape the attempt, and the outcome (success
  with relevant key fields, or the explicit failure mode). Do not log every
  step of a successful path "just in case".
- **Shape.** One-line structured logs with key fields for traceability.
  Multi-line stack traces are attached to error records, not interleaved
  with normal events.
- **Tags and levels.** Consistent areas/tags (one area per module/feature)
  and appropriate levels (debug / info / warn / error). Use `info` for
  decisions that explain the system's behavior to an operator, `warn` for
  recoverable anomalies, `error` for failed outcomes, `debug` for trace
  detail that is off by default.
- **No success spam.** Do not log successful completion of a routine
  operation. Successful outcomes are inferred from the absence of error;
  noisy success logs mask the real signal.

## Consequences

- Logs are signal-dense; an operator can read a 30-line slice and
  understand what the system did and why.
- `grep`/structured-search across the codebase finds the relevant event
  regardless of which module emitted it.
- The "I'll filter the noise later" deferral disappears because there is
  no noise to filter.

If reversed, logs accumulate success spam, levels drift, and incidents
require log-archeology rather than direct reading.

## Alternatives Considered

"Log liberally and filter later." Rejected: filtering rarely happens.
Verbose logs become the new normal; the filter is "Ctrl-F for the word
`error`", which misses the decision context that would have explained the
error.

## Boundary

This ADR is about shape and discipline, **not** technology. It does NOT
mandate a specific logger library; it defines the contract that any
logger must satisfy.

## Relationship to Other ADRs

- **ADR-0014** (boundary validation + secret redaction) produces the
  events that ADR-0015 shapes. The two are coupled in practice (a
  no-success-spam contract is easier to honor when the boundary validator
  emits a precise rejection) but independently reversible — one could
  keep redaction while abandoning the no-success-spam rule, or vice
  versa.

## Confirmation

This ADR is confirmed via review using the contract text in CLAUDE.md
(§Logging) plus
`Agents/_shared/best-practice-packs/progress-state-and-script-logging.yaml`.
Confirmation is `mechanism: manual` because "is this log line success
spam?" and "is this the right area tag?" are judgement calls a
heuristic lint cannot reliably automate. ADR-0025 extends this contract
for progress and script surfaces through that same pack, which carries
both ADR-0015 and ADR-0025 so agents read the base logging shape and the
extended progress/state discipline together.

**Future work.** A logging-shape lint that flags multi-line interpolated
log lines, missing area tags, and `info`-level success-only events could
automate part of the contract. A dedicated
`Agents/_shared/best-practice-packs/observability-logging.yaml` pack
could capture the proactive checklist. Both are explicitly out of scope
of this ADR — this ADR encodes the discipline so the follow-up has a
clear authority to point at.

The PreToolUse hook `.claude/hooks/inject-governing-adrs.mjs` pins
ADR-0015 on edits to host-runtime services, the shared logging package,
and MCP server modules.
