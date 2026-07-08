---
adrId: ADR-0026
shortName: short-name-aliases
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# ADR Short-Name Aliases — Numeric Identity, Human-Readable Handle

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** New DWF ADRs may carry shortName aliases; the numeric ADR id remains canonical.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Promotion Notes

Promoted on 2026-05-26 as the policy decision. The validator
extension (`shortName` field), the linkage validator's alias
resolution, the citation hook's `[shortName]` bracket emission, and
the backfill of `shortName` on all 26 existing ADRs are all deferred
to a follow-up activation PR — this ADR records the decision so the
follow-up has clear authority. Until the validator extension lands,
ADRs continue to be referenced by their numeric `adrId` exclusively;
the new `shortName` field is not yet recognised.

## Context

Action Plan ADRs use the industry-standard numeric identity (`ADR-NNNN`)
from Nygard's original convention. The numeric format is load-bearing on
eleven mechanical surfaces today:

1. `adrId` type validator (`architectureDecisionFrontMatter.ts`).
2. The PreToolUse citation hook (`inject-governing-adrs.mjs`) filename
   regex `^ADR-\d{4}-[a-z0-9-]+\.md$`.
3. Path validator (`check-adr-path.js`).
4. Linkage validator (`check-adr-pack-linkage.js` parses `ADR-NNNN`
   tokens out of `adr:` fields in best-practice packs).
5. Index service (`ArchitectureDecisionIndexService.ts` —
   `ARCHITECTURE_DECISION_ROOT` directory walk).
6. `ADR-FORMAT.md` §Numbering — "scan for highest existing number,
   increment by one".
7. Supersession chains (`supersedes` / `superseded_by` front-matter
   arrays across 19+ ADRs).
8. Best-practice pack `adr:` fields — six packs today carry references
   like `adr: [ADR-0010, ADR-0016]`.
9. CLAUDE.md prose — ~25 references to ADR IDs.
10. ADR cross-references — `## Relationship to Other ADRs` sections
    cite by number (e.g. ADR-0019 cites 0006/0014/0015/0016/0017).
11. Exemption markers I drafted in ADR-0021/0023/0025 — `//
    adr-0021-exempt: <reason>` shape.

Numeric identity is therefore the canonical *identity* of an ADR — it
must remain stable across content evolution, supersession, and audit
history.

**But:** the numeric form is opaque on its own. "ADR-0015" requires a
table lookup ("which one was 0015 again?"), and the recognition cost
adds up where IDs appear without the title attached — CLAUDE.md prose,
in-code comments, PR descriptions, code-review citations. The PreToolUse
citation hook already attaches the title automatically when it pins an
ADR ("ADR-0015 Logging Contract — …"), so the recognition cost is
isolated to **human-authored references**, not machine-generated ones.

Three alternatives were considered (see §Alternatives Considered):
**rename to slug IDs** (high cost, breaks stable identity), **convention
only** (zero cost, no mechanical support), or **hybrid alias** (numeric
canonical + opt-in slug). The hybrid path preserves every property the
numeric form buys, adds a recognizability handle, and is additive (no
file renames, no breaking changes to validators or to historical
references).

## Decision

Every ADR MAY carry an optional **`shortName`** field in its front-matter
that provides a human-readable alias for the ADR. The numeric `adrId`
remains the canonical identity; the `shortName` is a convenience handle.

**Shape.** A new optional typed front-matter field:

```yaml
adrId: ADR-0009
shortName: solid              # NEW — optional kebab-case alias
status: accepted
date: 2026-05-25
...
```

**Validation rules** (enforced by an extended
`architectureDecisionFrontMatter.ts`):

- `shortName` is optional. ADRs that omit it are valid (status quo).
- When present, `shortName` is a non-empty kebab-case string of 2-40
  characters: `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`.
- `shortName` MUST be unique across the entire `docs/decisions/`
  directory. The linkage validator (per ADR-0018) enforces uniqueness
  at PR time.
- `shortName` does NOT replace the filename slug. The canonical
  filename remains `ADR-NNNN-<descriptive-slug>.md` so the directory
  listing keeps a readable secondary description. The `shortName` is
  the *short* form, the filename slug is the *full* description.
- `shortName` MUST NOT change once an ADR is `accepted`. A change of
  `shortName` is itself a supersession (per ADR-0017 atomic / reversible:
  the rename lands in one PR with every reference updated, or not at
  all). The validator rejects a `shortName` change on a non-proposed
  ADR.

**Resolution rules** (where `shortName` is recognised):

- Best-practice pack `adr:` fields accept either form: `adr: [solid]`,
  `adr: [ADR-0009]`, or `adr: [solid, logging]` — all three resolve to
  the canonical numeric `adrId` via a name → number lookup the linkage
  validator owns.
- Code exemption markers accept either form:
  - `// adr-0009-exempt: <reason>` (numeric, unchanged)
  - `// adr-solid-exempt: <reason>` (slug, new)
- Both forms resolve to the same governing ADR. The lint that
  recognises exemption markers (when wired per ADR-0021/0023/0025
  activation) accepts both.
- CLAUDE.md and ADR cross-references may use either form in prose.
  The recommended citation style for human-authored prose is
  `ADR-0009 (solid)` or `solid (ADR-0009)` — both forms make the
  identity unambiguous while reading easily.

**Citation hook augmentation.** The PreToolUse hook
(`inject-governing-adrs.mjs`) is extended to include `shortName` in its
emitted citation when present:

```
- ADR-0009 [solid] SOLID Is the Default Architecture Posture (accepted) — …
```

When `shortName` is absent the citation stays in its current form (no
bracket section).

**Backward compatibility.** Every existing reference remains valid.
This decision is *additive*: no ADR is renamed, no validator rejects
a previously-valid front-matter, no exemption marker stops resolving.
The only failure mode is a `shortName` collision, which the linkage
validator catches at PR time with a precise repair message.

## Consequences

- A reader of a CLAUDE.md sentence "honor ADR-0009 (solid)" doesn't
  need to look up which ADR 0009 is — the slug carries the meaning.
- Code comments / exemption markers stay readable when the slug is
  used: `// adr-headless-exempt: rendering layer accepts theme tokens`.
- Numeric supersession chains stay stable. A future ADR superseding ADR-0009 still uses the numeric id in `superseded_by`; no
  ambiguity, no slug collision.
- The linkage validator gains a small responsibility (resolve aliases,
  detect collisions) but the surface is contained.
- The hook's citation gains one bracket section, no other shape change.
- Migration is opt-in per ADR: an ADR can adopt `shortName` whenever
  the author chooses; ADRs without it continue to work.

If reversed, the recognizability gap stays where it is: every prose
reference and every code marker carries an opaque four-digit number,
and readers pay a table-lookup cost on every encounter.

## Alternatives Considered

**A. Full rename to slug IDs** (`ADR-SOLID.md` replaces
`ADR-0009-solid-default-architecture-posture.md`). Rejected:

- Touches all 11 mechanical surfaces listed in §Context.
- Renames 25 files atomically with every reference updated in the
  same PR (per ADR-0013, ADR-0017), an extremely high-blast-radius
  change.
- Breaks the supersession-by-sequence convention. ADR-0023 supersedes
  ADR-0009 because 23 > 9; the temporal order is implicit. With
  slug-only IDs, ordering needs a separate `sequence:` field and the
  implicit ordering is lost.
- Collides on scope evolution. A future second ADR about logging
  becomes `ADR-LOGGING-2`, which violates ADR-0013's no-parallel-paths
  reasoning at the naming layer ("the v2 we'll consolidate later"
  rarely closes).
- Locks the slug in forever — a rename costs the same again, but the
  industry-standard ADR ecosystem (Nygard, MADR, AWS docs,
  joelparkerhenderson/architecture-decision-record templates) all
  use numeric. The repo would be inconsistent with every external
  reference.

**B. Hybrid alias (this ADR).** Chosen. Preserves every property
numeric IDs buy (stability, ordering, supersession-by-sequence,
ecosystem alignment) while adding the recognition handle. Additive
and reversible.

**C. Convention only — always cite with title.** Considered, partially
useful, insufficient on its own:

- The hook already emits citations with the title attached. The
  problem isn't the hook's output; it's human-authored references in
  prose and code comments where the title isn't carried.
- Convention-only enforcement degrades over time without mechanical
  support; a PR that writes "see ADR-0015" without expanding to "see
  ADR-0015 (logging)" passes review more often than it should.
- The `shortName` field IS the mechanical support that makes the
  citation convention sustainable.

This ADR adopts the convention-with-mechanical-support pattern: the
`shortName` provides the *short* handle that human-authored references
can carry without typing the full title each time.

## Relationship to Other ADRs

- **ADR-0017** (atomic / reversible) — the activation of this ADR is
  itself atomic. The validator extension + the `shortName` additions
  to existing ADRs + the hook augmentation land in one PR.
- **ADR-0018** (best-practice-pack ↔ ADR linkage) — the linkage
  validator gains alias-resolution responsibility. A pack's
  `adr: [solid]` resolves to `ADR-0009` and the bidirectional graph
  edge is built against the numeric canonical id.
- **ADR-0013** (change management discipline) — the rule "no
  `shortName` change on an accepted ADR without supersession" is the
  ADR-0013 search → change → re-search discipline projected onto the
  alias surface.
- **ADR-0016** (extension points + typed enums) — the `shortName`
  alias map is a registry (per ADR-0016), not a switch ladder.

## Confirmation

**Pending activation.** This ADR is authored in dormant-proposed form.
No mechanical gate runs against it today. Activation requires, in one
atomic PR (per ADR-0017):

1. Promote `status: proposed` → `accepted` with a `## Promotion Notes`
   paragraph.
2. Populate `governs.code` with the validator + hook paths:
   - `ActionPlan/packages/actionplan-shared/src/governance/architectureDecisionFrontMatter.ts`
   - `.claude/hooks/inject-governing-adrs.mjs`
   - `ActionPlan/quality/check-adr-pack-linkage.js`
   - `ActionPlan/services/host-runtime/src/services/workspace/ArchitectureDecisionIndexService.ts`
3. Extend `architectureDecisionFrontMatter.ts` to validate the optional
   `shortName` field (kebab-case, length 2-40, unique across ADRs).
4. Extend `check-adr-pack-linkage.js` to (a) resolve aliases in pack
   `adr:` fields to canonical numeric ids, and (b) detect `shortName`
   collisions across `docs/decisions/`.
5. Augment `.claude/hooks/inject-governing-adrs.mjs` to emit
   `[shortName]` in the citation when present.
6. Author `Agents/_shared/best-practice-packs/adr-short-name-aliases.yaml`
   carrying `adr: ADR-0026` (per ADR-0018 linkage contract).
7. Backfill `shortName` on the 25 existing ADRs in the same PR,
   choosing one stable slug per ADR (e.g. ADR-0001 → `knowledge-store`,
   ADR-0009 → `solid`, ADR-0010 → `shared-component-first`, ADR-0015
   → `logging`, ADR-0020 → `headless`, ADR-0021 → `size-budgets`,
   etc.). The slug list is fixed at activation; subsequent changes
   require supersession per the §Decision rules.
8. Update CLAUDE.md, ADR cross-references, and exemption marker
   conventions to cite the slug form where it reads cleaner.
9. Add the front-matter `confirmation:` entries pointing at the
   pack, the validator, the linkage gate, and the hook.

Until that PR lands, this ADR records the decision but does not
enforce it. ADRs continue to be referenced solely by their numeric
`adrId` and existing code/prose conventions stay unchanged.
