---
adrId: ADR-0012
shortName: mcp-first-verification
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: now-later
source: imported-and-cleaned
---
# MCP-First Verification With Sanctioned Fallback

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** now-later.
- **Project application:** Keep sanctioned verification discipline with near-term focus on Expo, TypeScript, and TinyBase tests; expand later for Tauri, Cloudflare, Neon/Postgres, and WorkOS seams.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Verification in this repository is the most-reinforced policy in CLAUDE.md
(authoritative-override block plus full §Verification & Testing section) and
AGENTS.md. The runtime already enforces it through the PreToolUse hook
`.claude/hooks/block-banned-runners.mjs`, which rejects raw `jest`, `pnpm`,
`tsc`, and `node quality/*.js` invocations and names the MCP replacement
for every banned command. Without this rule, agents bypass coverage gating,
hit permission-prompt loops on every raw runner, and produce results that
cannot be compared against the project's gates.

The policy is paired with a **degraded-mode transport policy**: when the MCP
is unreachable (canonical `dist/` missing, surfacing race, transport error),
the sanctioned wrapper `node ActionPlan/scripts/verify.cjs <verb>` probes the
MCP out-of-process and auto-delegates to `verify-fallback.cjs`, which runs
the same gate command through `quality/verification.config.json`. The dispatcher
prints a structured JSON envelope carrying a `transport` field: `mcp` /
`fallback-cli` / `none`. Only `transport: "none"` / `status: "blocked"` is a
hard stop.

## Decision

- Every verification action — lint, unit, integration, e2e, full profile,
  coverage gaps, quality gates — flows through the `actionplan-verification`
  MCP tools when reachable.
- When the MCP is unreachable, `node ActionPlan/scripts/verify.cjs <verb>` is
  the sole sanctioned fallback path. It probes the MCP out-of-process and
  auto-delegates to `verify-fallback.cjs`; work verified this way is verified,
  not unverified.
- Raw `jest`, `npx jest`, `pnpm jest`, `pnpm exec jest`, `./node_modules/.bin/jest`,
  `pnpm run test*`, `pnpm test`, `corepack pnpm …`, `tsc --noEmit`, and `node
  quality/*.js` are NEVER acceptable substitutes. The PreToolUse hook
  `.claude/hooks/block-banned-runners.mjs` rejects them at the harness level.
- The degraded-mode transport policy is binding: `transport: "mcp"` and
  `transport: "fallback-cli"` both count as verified. `transport: "none"` /
  `status: "blocked"` (neither MCP nor fallback can run) is the only hard
  stop, and it implies a broken checkout that requires the canonical-repair
  path (`cd ActionPlan && node scripts/mcp-supervisor.cjs --ensure-canonical`
  in the main checkout — never run in a worktree).
- New quality gates are added as MCP tools (handler in
  `ActionPlan/mcp/test-orchestrator/src/handlers/`, registration in
  `index.ts`, allow-listed in `.claude/settings.json`) rather than as raw
  `node quality/*.js` invocations exposed to agents.

## Consequences

- Verification results are structured, comparable, and respect project
  policy (coverage gating, ratchet allowlists, persona-decoupling allowlists,
  etc.).
- Permission-prompt loops on raw runners disappear: the MCP tool names are
  allow-listed by exact name, the raw runners are not.
- A first-session surfacing race or a missing `dist/` does not block work:
  the dispatcher auto-falls back without aborting the wave.
- Only a truly broken checkout (no MCP, no fallback) is genuinely
  unverifiable, and that case surfaces with a precise repair hint.

If reversed, agents run raw jest/pnpm/tsc, bypass project policy, trigger
permission prompts, and produce results that cannot be ratcheted against the
gates.

## Alternatives Considered

"Let agents run raw jest because it's familiar." Rejected: each raw runner
forces a permission prompt (arbitrary code execution that cannot be safely
allow-listed by argv pattern), and the run bypasses coverage gating, ratchet
allowlists, and inline-color/inline-style gates. The MCP path is the only
form that keeps project policy enforced.

## Relationship to Other ADRs

- **ADR-0005** (git-tracked markdown is sole canonical authority) and this
  ADR cover different surfaces. ADR-0005 is *documentation* canonical (the
  *why* lives in git-tracked Markdown); ADR-0012 is *runtime* canonical (the
  PreToolUse hook is the runtime enforcer). Neither replaces the other.

## Confirmation

This ADR is enforced by the PreToolUse hook
`.claude/hooks/block-banned-runners.mjs`, which is the runtime gate. The
dispatcher `ActionPlan/scripts/verify.cjs` is the sanctioned fallback
selector. Both ship today; this ADR ratifies the existing posture and
declares the degraded-mode transport policy explicitly so a future maintainer
reads one authoritative source instead of CLAUDE.md prose.
