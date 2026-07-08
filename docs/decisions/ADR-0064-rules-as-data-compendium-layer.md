---
adrId: ADR-0064
shortName: rules-as-data-compendium-layer
status: accepted
date: 2026-07-08
tags: [rules, compendium, content, game-systems, ai, contracts]
---

# Rules And Compendium Content Are A Data Layer Distinct From Field Schemas

## Status

Accepted for DungeonsWithFriends planning as of 2026-07-08. Contract definition is Now-lane (Epic 8); ingestion tooling is Next-lane (Epic 9).

## Context

System templates currently capture fields (a strength score is a number with validation rules). The end-state requires capturing rules: how advantage works, what a grapple does, what a monster's stat block contains. Full re-creation of documented games, rules Q&A, teaching new players, automated DM behavior, and AI content generation all consume rules and content, not field definitions. Nothing in the active contracts reserved space for this layer, so template work risked painting it out. The 2026-07-07 ADR cleanup also rejected knowledge-graph tooling ADRs, leaving no stated home for machine-consumable rules.

## Decision

1. DungeonsWithFriends defines a rules-and-content layer with three parts, each system-scoped and versioned:
   - Structured rules: machine-consumable rule records (procedures, conditions, modifiers, resolution steps) that reference system template fields but live outside them.
   - Compendium content: monsters, items, spells, and similar entries with structured stats plus descriptive text.
   - Source corpus: the documented game text that rules and compendium entries cite, retained for grounding rules Q&A and AI generation in the actual source.
2. Licensing and source metadata (origin, license, attribution requirements) are mandatory on every rules and compendium record from the first schema version.
3. Contract definition (schemas, tables, export/import coverage) is Now-lane work in Epic 8. No runtime rules engine, no automated rule execution, and no ingestion tooling are in Epic 8 scope.
4. Ingestion of documented game systems into these contracts, and AI generation of new content targeting them, is Next-lane work in Epic 9 behind governed actions (ADR-0038) and an AI provider port that permits local execution (ADR-0060).
5. Consumers bind to the contracts, not to ingestion: rules Q&A, teaching flows, automated DM behavior, and encounter generation all read the same layer, whether a human or a pipeline authored it.
6. The existing template binding contract remains the presentation-side seam; binding `transform` metadata may later reference structured rules but stays metadata-only until a runtime story implements evaluation.

## Consequences

- Epic 8 defines the schemas and storage; Epic 9 fills them via import and AI generation.
- Character sheet and scene work must treat rules records as a referenceable layer, not embed rule logic in components.
- Marketplace, licensing, and moderation (Epic 5) gain the metadata they will need without retrofit.
- A future rules-engine ADR will govern execution semantics; this ADR governs only the data layer.

## Alternatives Considered

- Extend `field_definitions` with rule expressions: rejected; conflates presentation binding with system semantics and blocks reuse across sheets, scenes, and AI.
- Wait for AI epics to define the layer: rejected; template and ledger contracts being designed now need to know the layer exists.
- Reinstate the rejected knowledge-graph ADRs: rejected for now; a simple versioned-table contract fits the local-first baseline, and richer indexing can attach later.

## Applied To

- `_bmad-output/planning-artifacts/epics.md` (Epic 8, Epic 9)
- `docs/roadmap/now.md`, `docs/roadmap/next.md`
- `docs/product-vision.md`
