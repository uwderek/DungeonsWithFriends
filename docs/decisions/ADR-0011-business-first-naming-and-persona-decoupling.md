---
adrId: ADR-0011
shortName: business-naming
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# Business-First Naming and Persona-Name Decoupling

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** Use DWF game and product domain names in product code. Avoid infrastructure, agent, or imported-project nouns in user-facing/domain surfaces.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Two coupled naming policies govern every code identifier, file name, type, and
string-literal id in this repository:

1. **Business-first naming.** Identifiers reflect domain/business terms, not
   technical jargon — `validateDeviceForPatientCare()`, not
   `checkConnectionState()`. Without this rule, the codebase drifts into
   generic technical vocabulary that breaks the bridge between stakeholders
   and code.

2. **Persona-name decoupling.** Agent display names (Lexi, Arjun, etc.) are
   presentation-layer configuration. Code identifiers MUST use the stable
   *role* — `Orchestrator` for the controller role that manages every agent,
   their learning, memory, dreaming, and workflows; `Architect` for the
   technical software architecture role — or the plain domain concept. The
   persona display name appears only in persona definition / configuration
   files, never in code.

Both rules already live in CLAUDE.md and AGENTS.md prose plus the
`business-first-code-design.yaml` pack. The persona-decoupling half already
has a mechanical quality gate (`check-persona-role-decoupling.js`) with an
allowlist. This ADR consolidates the two into one queryable, pinned authority.

## Decision

- Functions, variables, types, file names, and string-literal ids/version tags
  use **domain/business terms**, not technical generic terms.
- Code identifiers use the stable **role** (Orchestrator, Architect, or the
  domain concept), never an agent's display name.
- The persona display name is restricted to persona-definition and
  configuration files; the allowlist at
  `ActionPlan/quality/persona-decoupling-allowlist.txt` enumerates the only
  exceptions.
- Epic and story plans follow the same rule when naming the orchestrating
  agent — they write requirements against the Orchestrator role so a persona
  rename never forces a code-wide rename.

## Consequences

- The codebase stays aligned to stakeholder vocabulary; a non-engineer
  reviewer can trace a requirement to a function without a translation glossary.
- A persona re-skin (rename Lexi → something else) changes presentation-layer
  configuration only; code identifiers, string ids, and version tags do not
  move.
- New code that uses an agent display name fails the
  `check_persona_role_decoupling` gate; the failure points at the allowlist as
  the only legitimate exception path.

If reversed, the codebase drifts into generic technical jargon (losing
stakeholder alignment) and a future persona rename forces a code-wide rename
and breaks string-id contracts.

## Alternatives Considered

"Use the current persona name because it's friendly." Rejected: this fails the
first time the persona is renamed (already happened at least once in the
field), forcing a cascading code-wide rename and breaking external
string-literal contracts (workflow ids, persona-pack ids, audit logs).

## Confirmation

Two mechanisms confirm this ADR:

- **`mechanism: quality-script`** —
  A future DWF repo-owned audit can mechanically enforce persona-name
  decoupling against an allowlist file. Until that exists, review owns the
  check.
- **`mechanism: manual`** —
  `Agents/_shared/best-practice-packs/business-first-code-design.yaml` carries
  the proactive naming checklist used at code review; the pack declares
  `adr: ADR-0011` so the linkage validator (ADR-0018) keeps both surfaces in
  sync. Business-first naming is a judgement call confirmed at review, not a
  mechanical lint.

The PreToolUse hook `.claude/hooks/inject-governing-adrs.mjs` pins this ADR on
edits anywhere under `ActionPlan/**` or `Agents/**` because the naming policy
is universal.
