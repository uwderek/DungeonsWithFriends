---
adrId: ADR-0019
shortName: operator-pipelines
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: later
source: imported-and-cleaned
---
# Operator-Critical Pipelines: Self-Diagnosis, Tests, Observability, and Agent-Inspectability

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** later.
- **Project application:** Apply critical-pipeline discipline to build, verification, sync, backup, update, auth, deployment, and import/export pipelines as they become real.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Across an extended remediation window (PRs #253–#272) the standalone
code-knowledge indexer, the MCP supervisor, the offline embedding
worker, and the ADR-governed glob walker each surfaced opaque
operator-facing blockers. The recurring pattern:

1. **Diagnostic shrinkage** at a catch-and-rethrow boundary —
   structured `{ reason, field, diagnostics, repairGuidance }` payloads
   collapsed to a bare `reason` string by an upstream handler. The
   operator saw `embedding-dependency-missing` and could not tell
   which dependency or how to install it. Closed by PRs #256, #262,
   #266, #271.
2. **Config-list drift** between parallel collections — a workspace
   filter named in `CURRENT_REQUIRED_SERVER_FILTERS` but missing from
   `SERVER_BUILD_FILTERS` + `SERVER_DIR_BY_FILTER`; an npm dependency
   declared in `package.json` but absent from `onlyBuiltDependencies`
   in `pnpm-workspace.yaml`. Closed by PRs #255, #268, #270.
3. **Platform-specific bugs** invisible in the dev environment —
   Windows directory-junction cycles in the glob walker (PR #265),
   `path.join` emitting backslashes that the safety validator rejected
   (PR #272), `EPERM` on `rename` during atomic write-then-rename
   (PR #264).
4. **State-vs-reality drift** the supervisor's `healthyAt()` could
   not see — a `package.json` edit landed without a follow-up install;
   a precompiled package's `dist/` was stale relative to its `src/`
   (PRs #260, #269).

Each PR landed a forward fix AND a targeted regression test. The
backlog grew faster than the fixes shipped, and every fix taught
the same lesson: the surface that hosts an operator-critical
pipeline must be self-diagnosing, automatically tested, observable,
and inspectable by an agent — by construction, not by retrofit.

## Decision

Every operator-critical pipeline — code that an operator runs
directly OR that supervises a script-spawn chain on their behalf —
honors all five disciplines below. The set today includes:
`ActionPlan/scripts/mcp-supervisor.cjs`,
`ActionPlan/scripts/code-knowledge-index.cjs`,
`ActionPlan/services/host-runtime/src/services/workspace/*` (the
indexer + ADR + snapshot writer + embedding worker chain), and every
MCP server's launcher + tool dispatcher.

**1. Structured error envelopes survive catch-and-rethrow.** A
boundary that catches a lower-layer failure MUST preserve its
structured fields (entry-id, field-path, diagnostic, repair-guidance)
into whatever envelope it re-throws or emits. Legacy bare-reason
prefixes are preserved as the first line of the new joined message so
existing catch-and-substring-match callers continue to work
(per ADR-0017 atomic / reversible).

**2. Config-list parallelism is contract-tested.** When two or more
collections must stay in lockstep (every required-server filter has a
matching build-filter has a matching dir mapping; every npm
dependency has a matching `onlyBuiltDependencies` entry if it ships
postinstall-installed prebuilts), a single contract test asserts the
alignment. The test runs in CI; drift fails at PR time, not at the
next operator-host invocation.

**3. Integration smoke tests reproduce the deepest failure modes
the pipeline can hit.** For every operator-visible crash class fixed
by a PR, that PR's regression test exercises the FULL pipeline level
where the bug surfaced — not a stubbed contract test one layer down.
Stack-overflow in the glob walker is reproduced by a fixture repo
with the trap directory shape; backslash-vs-forward-slash relative
paths are exercised in test on the host they were authored on. This
is "Tier-3" coverage in the PR-#267 nomenclature.

**4. Logging at the call site names intent, decision, and outcome
— never success spam.** Per ADR-0015, the call-site is where the
logger knows what is genuinely interesting. Hot-path decisions
(per-frame freshness checks, per-directory cycle deduplications) are
silent; phase transitions and recoveries are loud. A blocked outcome
ships its full repair guidance as the log payload, never a bare
reason code.

**5. Pipeline state is inspectable by an agent.** Every pipeline
exposes:
- a `--doctor` / `inspect` subcommand or equivalent MCP tool that
  emits a structured (JSON or YAML) report of the current health
  state, each tracked sub-component, the most-recent build / run
  outcome, and the actionable repair guidance for any non-healthy
  state;
- a `.buildoutcome.json` / `.last-install-hash` / progress-ledger
  marker file under the pipeline's runtime root so an agent (or the
  next supervisor pass) can read the previous outcome without
  re-running the pipeline;
- redaction at the boundary (per ADR-0006 + ADR-0014) on every
  value the inspect endpoint returns, so an agent can safely render
  the report into a chat surface.

## Consequences

- Operator-visible failures are accompanied by the install command
  or file-edit they describe — operators do not bisect, grep, or
  attach debuggers to identify which dependency, directory, or
  config entry is the cause.
- Agents (Lexi, Arjun, etc.) can call the pipeline's inspect
  endpoint, see its precise state, and either propose a repair PR
  OR run the documented recovery directly.
- Future PRs that add a new MCP server, change the offline
  embedding worker, or extend the supervisor's parallel-list
  contract fail CI at PR time when they break the parallelism — the
  bug pattern that cost a multi-PR remediation in this window cannot
  recur silently.

If reversed, every new operator-critical pipeline silently re-grows
the diagnostic-shrinkage / config-drift / platform-fragility / agent-
opaque pattern. The cost of one slip is operator-hour-shaped: a
broken indexer with `embedding-dependency-missing` keeps the entire
code-knowledge layer dark, and the agents that depend on it produce
worse work or none.

## Alternatives Considered

**A. Lint-rule the patterns only.** Static rules (require structured
errors, require parallel-list constants exported for testability)
catch some — but the platform-fragility class is a runtime concern,
not lintable.

**B. Per-pipeline ADRs.** One ADR for the supervisor, one for the
indexer, one for the embedding worker. Rejected as redundant
copying; the discipline is the same across surfaces, and ADR-0009
SOLID's single-responsibility argues for one decision per concern,
not per consumer.

**C. Trust ADR-0014 + ADR-0015 + ADR-0017 to cover this implicitly.**
Each of those is a partial framing (validation + logging + atomicity
respectively). The integration discipline — test the pipeline level
the bug surfaced at, expose the pipeline to agents — is not in any
existing ADR. This ADR is the gap.

## Relationship to Other ADRs

- **ADR-0006** metadata-only governance — the inspect endpoint's
  payload, the structured error envelopes, and the progress ledger
  files are all metadata-only by construction. This ADR strengthens
  ADR-0006 by making the metadata-only surface broader and more
  consistent.
- **ADR-0014** boundary validation + fail-closed + secret redaction
  — every inspect endpoint, every catch-and-rethrow boundary, every
  ledger file routes through the safety layer's redactors. This ADR
  binds those redactors to specific call sites.
- **ADR-0015** logging contract — discipline #4 above is the
  pipeline-scope projection of ADR-0015's general logging rules. The
  call-site discipline is the same; the operator-critical-pipeline
  scope adds the explicit "ship full repair guidance, never a bare
  reason code" rule.
- **ADR-0016** stable typed enums — the structured-envelope
  discipline lives on top of ADR-0016's stable result types. Adding
  a `field?` or `diagnostics?` slot to a discriminated union is the
  expected extension shape.
- **ADR-0017** atomic / reversible — every diagnostic enrichment
  preserves the legacy bare-reason substring at the start of the
  new joined message so catch-and-substring-match callers keep
  working.

## Confirmation

Enforced through code review using CLAUDE.md plus
`Agents/_shared/best-practice-packs/operator-pipeline-discipline.yaml`,
which carries `adr: ADR-0019`. The citation hook
(`.claude/hooks/inject-governing-adrs.mjs`) pins ADR-0019 on edits to
any file under the governed paths above, so the pack and this ADR are
loaded before operator-pipeline changes proceed.

Concrete confirmation tests already shipped:

- `ActionPlan/scripts/mcp-supervisor.contract.test.ts` (PR #267) —
  parallel-list alignment (discipline #2).
- `ActionPlan/scripts/mcp-supervisor.drift.test.ts` (PR #269) —
  state-vs-reality drift detection (the supervisor's projection of
  discipline #5).
- `ActionPlan/services/host-runtime/src/services/workspace/CodeKnowledgebaseSnapshotWriter.test.ts`
  (PR #267 extension) — error-envelope round-trip (discipline #1).
- `ActionPlan/services/host-runtime/src/services/workspace/ArchitectureDecisionIndexService.test.ts`
  (Tier-3 regressions, this PR) — pipeline-level integration smoke
  reproducing PR #265 (Windows junction cycle) and PR #272 (Windows
  path-validator) failure modes (discipline #3).
- `ActionPlan/services/host-runtime/src/utils/fs-utils.test.ts`
  (PR #265) — cycle-safe glob walker (discipline #3 at the helper
  level).

**Future work.** A `quality/check-operator-pipeline-discipline.js`
gate that enumerates every governed entrypoint, asserts each ships
an inspect endpoint, structured error envelope, and at least one
contract test of each kind. Out of scope of this ADR; this ADR
encodes the discipline so the follow-up has a clear authority to
point at.
