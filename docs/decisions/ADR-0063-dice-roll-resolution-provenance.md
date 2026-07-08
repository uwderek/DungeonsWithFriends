---
adrId: ADR-0063
shortName: dice-roll-resolution-provenance
status: accepted
date: 2026-07-08
tags: [dice, schema, provenance, manual-play, contracts]
---

# Dice Rolls Record Their Resolution Source

## Status

Accepted and implemented for DungeonsWithFriends as of 2026-07-08.

## Context

The vision requires that players at a live table may roll physical dice and enter results manually, while asynchronous and automated play uses local RNG. The `dice_rolls` contract recorded results without provenance, so trust, display ("rolled at the table"), and future physical-dice-reader integrations could not distinguish how a result was produced. Retrofitting provenance onto thousands of persisted rolls later would be painful; adding it now is one additive field.

## Decision

1. The dice roll contract separates the roll request (notation) from the resolution source. Each `dice_rolls` row carries `resolution_source`.
2. Initial values: `local_rng` (digital roll resolved by the app) and `manual_entry` (player-entered results from physical dice). The enum is extensible (for example, a future `physical_reader`).
3. `resolution_source` defaults to `local_rng`, so existing persisted rows and version-1 exports remain valid; `schema_version` stays 1 because the change is additive.
4. Manually entered rolls validate against the notation exactly like digital rolls (die count, per-die range, modifier, total), so provenance never weakens integrity.
5. A `createManualDiceRoll` store function is the sanctioned path for manual results; invalid manual results are rejected with the existing `invalid_roll` error code and never persisted.
6. Manual-entry UI is a separate future story; this ADR covers the contract and domain layer only.

## Consequences

- `dice-roll-store.ts` gains `resolution_source` and `createManualDiceRoll`; domain validation and export/import accept the field automatically via the shared schema.
- Future trust features (GM verification of table rolls, roll provenance display) have the data they need from day one.
- Any future roll-producing surface (voice assistant, AI DM, physical reader) must declare its resolution source.

## Alternatives Considered

- Defer until a manual-dice story exists: rejected; the field is additive now and a migration later.
- Free-text source field: rejected; a typed enum keeps validation and display logic sound.

## Applied To

- `DungeonsWithFriends/src/features/character/model/dice-roll-store.ts`
- `docs/data/local-store-contracts.md`
