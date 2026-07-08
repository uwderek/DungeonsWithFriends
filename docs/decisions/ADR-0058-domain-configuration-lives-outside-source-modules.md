---
adrId: ADR-0058
shortName: configuration-out-of-source
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# Domain Configuration Lives Outside Source Modules

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** Large game, system, template, rules, and persona/configuration data belongs in data/config artifacts, not source modules.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Action Plan needs rich domain data for personas, prompts, templates, capability
ownership, safety boundaries, and launch posture. Putting that data directly in
TypeScript source makes the shared contract module change for two unrelated
reasons: product configuration changes and contract/loader behavior changes.
That violates ADR-0009's single-responsibility posture, creates merge hotspots,
and turns content or roster edits into code changes that future epics can copy.

The current `personaContracts` split demonstrates the failure mode. The module
contains thousands of lines of persona roster, voice, relationship, safety, and
template-binding data while also defining schemas, resolution functions, and
prompt-composition behavior. A JSON prompt-template catalog already exists, so
the repository has a working precedent for data living in configuration with a
typed source module acting only as schema, loader, and validator.

## Decision

Domain configuration belongs in canonical configuration or data artifacts, not
inside source modules. Source modules own schemas, types, loaders, validators,
normalizers, and small stable enums. They do not own large product data records,
persona rosters, template/persona bindings, prompt content, visible identity
catalogs, safety-boundary catalogs, capability mappings, or launch fixtures.

For persona-related work, future epics MUST use this shape:

- Canonical persona/cast data lives in versioned config or data artifacts under
  an approved data root such as `Agents/_shared/data`, `Agents/_shared/library`,
  or `ActionPlan/config`.
- `personaContracts` and sibling source modules expose typed contracts,
  runtime loaders, validation, defaults, and repair guidance.
- Built-in personas may ship as seed configuration, but not as large
  `Readonly<Record<string, ...>>` literals in source.
- Runtime or tenant personas extend the same loader/registry path; no second
  registration or resolution path is introduced.
- A behavior-preserving migration may keep the public TypeScript import path as
  a compatibility facade, but the facade reads from the canonical config source.

Stable protocol enums remain valid in code when they define a contract rather
than product data. The test is the reason to change: a new persona, new binding,
new display copy, new safety profile, or new capability assignment is
configuration; a new contract field, parser rule, or validation invariant is
code.

## Consequences

- Persona and prompt content can change without touching contract behavior.
- Review can separate content approval from TypeScript architecture review.
- Product data becomes inspectable, diffable, and eventually editable through
  configuration workflows.
- Shared-contract modules shrink and recover a single reason to change.
- The migration needs schemas and parity tests so externalized config cannot
  silently drift from the existing public contract surface.

If reversed, future epics will keep adding persona and capability content to
source files, recreating the same merge hotspot and making SOLID review depend
on humans noticing data/code coupling after the fact.

## Current Violations To Clean Up

The following current branch changes are accepted as debt, not as a pattern to
copy:

- `ActionPlan/packages/actionplan-shared/src/chat/personaContracts/personaContractsPart1.ts` embeds `BUILT_IN_PERSONA_DEFINITIONS`, including visible persona content, voice profiles, behavior profiles, relationship metadata, signatures, and operating-discipline overrides.
- `ActionPlan/packages/actionplan-shared/src/chat/personaContracts/personaContractsPart1.ts` embeds `TEMPLATE_PERSONA_BINDINGS`, making template-to-persona ownership a source edit instead of a config edit.
- `ActionPlan/packages/actionplan-shared/src/chat/personaContracts/personaContractsPart1.ts` embeds `PERSONA_SAFETY_BOUNDARY_PROFILES`, making safety-boundary catalog changes source edits.
- `ActionPlan/packages/actionplan-shared/src/chat/personaContracts/personaContractsPart2.ts` embeds `PERSONAL_ADVISOR_PERSONA_IDS`, `LEGACY_WORKFLOW_PERSONA_ALIAS_OVERRIDES`, and `resolveCanonicalVisibleRosterTemplateId` case logic, all of which are persona/catalog configuration.
- `ActionPlan/packages/actionplan-shared/src/chat/personaContracts.ts` remains a compatibility import path, but its implementation should become a typed loader/facade over externalized persona configuration rather than a home for product data.

Cleanup should migrate these records to canonical config with schema validation
and parity tests before additional persona roster or mapping work lands.

## Alternatives Considered

**Keep seed configuration in code because it is type-safe.** Rejected. Type
safety belongs in the parser and schema; product data living in TypeScript still
forces content changes through source modules and gives one file two reasons to
change.

**Use generated TypeScript from config as the canonical source.** Rejected as
the default. Generated TypeScript may be a build artifact or cache, but the
authoritative record must remain the configuration/data artifact so product
configuration is not hidden behind generated code review.

**Allow code literals until an admin UI exists.** Rejected. A config file with a
schema is already enough to separate responsibilities; waiting for a UI repeats
the same defer-refactor failure that ADR-0021 exists to prevent.

## Confirmation

Manual review is active immediately through this ADR and the violation inventory
in `docs/technical/adr-violation-reduction-plan.md`. A future guardrail should
fail new large persona/catalog `Record<string, ...>` literals in governed source
modules unless the file is a schema or test fixture with an explicit exemption.
