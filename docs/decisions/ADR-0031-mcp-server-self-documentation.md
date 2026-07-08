---
adrId: ADR-0031
shortName: mcp-self-documentation
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: now-later
source: imported-and-cleaned
---
# MCP Servers Are Self-Documenting via Co-located Help, Not a Central Registry

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** now-later.
- **Project application:** Apply self-documentation to retained local dev MCP/test tooling and any future DWF tool servers.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

When an agent calls an MCP tool and receives an empty, degraded, or blocked
envelope, the envelope alone rarely tells it whether it called the tool wrong,
whether a backend is transiently degraded (e.g. an index mid-rebuild or an
optional dependency unavailable), or whether the tool is genuinely broken. A
concrete failure: `code_knowledge_query_codebase` returned `results: []` with
`embeddingBackend: "unavailable"`; nothing in the response explained that the
query-time embedder simply had not started, so the result read as "broken".

The first fix attempt added a single shared file holding a
`Record<serverId, documentation>` map of every MCP server. That is an
Open/Closed violation (ADR-0016): adding a server forces editing shared code,
and the central enumeration is exactly the "branch sprawl" ADR-0016 rejects. It
would have shipped because ADR-0009's confirmation was manual review with no
gate, and no rule named Open/Closed (now fixed in ADR-0009).

## Decision

Every MCP server is **self-documenting through co-located help**, and the shared
layer holds only generic plumbing:

- The shared module
  (`actionplan-shared/src/logging/mcpServerDocumentation.ts`) provides ONLY the
  generic shape, a generic base layer (cross-cutting pitfalls + degraded-state
  guidance every server inherits), and the merge/render helpers
  (`composeServerDocumentation`, `buildServerInstructions`,
  `documentationReference`, `attachDocumentationOnDegraded`). It **must not
  enumerate servers** — no `MCP_SERVER_DOCUMENTATION` map, no literal `serverId`
  entries.
- Each server **co-locates its own** `src/serverDocumentation.ts` (composing its
  specifics over the generic base) and a human/agent-readable `USAGE.md`.
- Each server passes `instructions: buildServerInstructions(<its doc>)` to its
  MCP `Server` (loaded by the client on connect) and
  `documentation: documentationReference(<its doc>)` to the shared
  `wrapMcpToolHandler`, which stamps a help pointer onto any
  degraded/blocked/empty envelope.

Adding a new MCP server therefore touches **only that server** — never the
shared module. This is ADR-0016 applied to MCP self-description.

## Consequences

- An agent that hits an empty/degraded result gets a `documentation.helpUri`
  pointing at the server's `USAGE.md`, and the server's `instructions` are
  loaded on connect — so transient/degraded states are distinguishable from
  usage errors and real faults.
- Server help lives next to the server it describes and cannot drift from a
  distant central file.
- A new server cannot silently ship without help: the gate fails the build.

If reversed, MCP responses become opaque again and a central registry re-accrues
the Open/Closed debt this ADR removes.

## Alternatives Considered

**Central registry of all servers' documentation.** Rejected — the Open/Closed
violation described in Context; it does not scale to new servers without editing
shared code.

**Server `instructions` only (no per-response link).** Rejected — connect-time
instructions help, but an agent reasoning about a specific empty result needs
the pointer *on that result*; the degraded-response `documentation` field is
what closes the loop.

## Confirmation

Enforced by the `check-mcp-self-documentation` quality gate
(`ActionPlan/quality/check-mcp-self-documentation.js`, registered in
`QualityHandler` and run in the aggregate `run_quality_gates` set), with the
co-located test `ActionPlan/quality/check-mcp-self-documentation.test.ts`. The
gate fails the build when any `ActionPlan/mcp/*` server lacks its co-located
`USAGE.md` or `serverDocumentation.ts`, or when the shared module reintroduces a
central server registry.

Pack reference:
`Agents/_shared/best-practice-packs/extensibility-and-reuse.yaml` carries this
ADR id in its `adr:` list so the linkage validator (`check-adr-pack-linkage.js`,
see ADR-0018) keeps the strategic decision and the tactical extensibility
checklist aligned. This ADR is a concrete application of **ADR-0016**.
