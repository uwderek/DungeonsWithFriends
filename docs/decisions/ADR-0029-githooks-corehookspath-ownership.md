---
adrId: ADR-0029
shortName: githooks-hookspath-ownership
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: now
source: imported-and-cleaned
---
# Git Hooks: `core.hooksPath` Is an Owned Setting

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** now.
- **Project application:** Do not mutate git hook ownership ad hoc. Define a DWF hook/tooling owner before adding enforcement.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

The Epic-229 continuous-freshness trigger mesh (auto code-knowledge refresh and
auto canonical rebuild on `git pull` / checkout / rebase) lives in the tracked
`.githooks/` directory. Activating it requires git to consult that directory,
which is controlled by the `core.hooksPath` setting — a value that is **not** a
tracked file.

The repository carried two eras of design at once. Early tooling/docs framed the
hook as "already installed into the repo's active hooks directory (the
**absolute** path)" and treated `core.hooksPath .githooks` as an optional
opt-in, while Story 229.1 made `.githooks` the *required* active location. The
two kept fighting: legacy/harness tooling reasserted an absolute `.git/hooks`,
the installer reasserted `.githooks`, and `extensions.worktreeConfig=true` made
it worse by allowing per-worktree `config.worktree` entries to *shadow* the
shared value. The observed result was months of "hooks silently not firing,"
inconsistent per-worktree state, and operators running `--ensure-canonical` by
hand after every pull.

A separate, external fact compounds this: the Claude Code / Kilo worktree
harness writes `core.hooksPath` (back to the default `.git/hooks`) on its own
schedule, into the *common* config, so a flip from any worktree can be reverted
— observed mid-session, not only between sessions.

## Decision

`core.hooksPath` is an **owned setting** with exactly one correct value, set by
exactly one owner. Agents and tooling MUST NOT set it by hand.

1. **The one correct value:** `core.hooksPath = .githooks` — a **relative**
   value at **`--local`** (shared `.git/config`) scope. Git resolves a relative
   `core.hooksPath` against each working tree's own top level, so this single
   shared value activates the main checkout's `.githooks/` *and* every linked
   worktree's own committed copy.
2. **Sole owner:** `ActionPlan/scripts/install-code-knowledge-hooks.cjs`. It
   validates the `.githooks/` tree (composes-not-clobbers the MCP-surfacing
   seed), sets the value at `--local`, and **heals** any `--worktree` shadow by
   re-asserting `.githooks` at `--worktree` scope (decision `worktree-healed`).
   It runs on every SessionStart via the tracked `.claude/settings.json` hook,
   so a fresh clone / new worktree self-activates and a value reset by external
   tooling is re-healed at the next session.
3. **Never** set `core.hooksPath` to an absolute path (pins all worktrees to one
   checkout — the legacy drift), nor via `--global` / `--system` (leaks to
   unrelated repos), nor as a `--worktree` entry (shadows `--local`).
4. **The default `.git/hooks` MUST stay empty of project hooks.** A copy there
   goes stale and silently becomes active the instant the setting resets to its
   default. The single source of truth for hook *logic* is `.githooks/`; the
   config value is *derived*, never hand-authored.
5. **When the hooks are not firing, the fix is to re-run the installer** (or
   start a fresh session so the supervisor does) — not to hand-edit git config,
   copy hooks into `.git/hooks`, or modify the indexing code.

## Consequences

- One activation mechanism, one owner: drift between "absolute `.git/hooks`" and
  "`.githooks`" can no longer recur from inside the repo.
- A relative `--local` value means zero per-worktree config; `--worktree`
  shadows are actively healed.
- `mcp-supervisor.cjs --doctor` reports `git hooks active : YES/NO` under
  `code_knowledgebase` and flags a stale `.git/hooks` shadow, so drift is
  visible immediately instead of failing silently (ADR-0019 inspectability).
- The one thing this ADR cannot fix is an *external* (non-repo) process that
  rewrites `core.hooksPath` between or during sessions. The SessionStart
  re-heal and `--doctor` visibility are the mitigations; the durable fix is to
  identify that harness/worktree-creation step and stop it from writing the
  setting. Tracked as follow-up.

## Alternatives Considered

**Delegating shims installed into `.git/hooks`** (so the mesh fires regardless of
`core.hooksPath`). Immune to the external resetter, but rejected: it violates
"keep `.git/hooks` empty," reintroduces a second activation mechanism that can
drift from the tracked source, and obscures the single owned setting. The owned-
`core.hooksPath` model with SessionStart re-heal + `--doctor` visibility is the
canonical approach.

**Absolute `core.hooksPath` shared by all worktrees.** Rejected — it pins every
worktree to one checkout's hooks; this was the original drift.

## Confirmation

This ADR is enforced today by:

- Unit/contract tests on the installer asserting the value is the relative
  `.githooks` (never absolute), idempotency, and `--worktree` shadow healing
  (`ActionPlan/scripts/install-code-knowledge-hooks.test.ts`).
- Content + fail-isolation tests on the committed `.githooks/` mesh
  (`ActionPlan/scripts/codeKnowledgeHookScripts.test.ts`).
- Self-diagnosis: `mcp-supervisor.cjs --doctor` surfaces the live activation
  state and flags shadows / stale default hooks.
