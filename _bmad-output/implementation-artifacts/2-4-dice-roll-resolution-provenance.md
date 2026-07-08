---
baseline_commit: 2d54d3d8ea8c718c0ff24ff33432929ac83ddc48
---

# Story 2.4: Dice Roll Resolution Provenance

Status: done

## Story

As a player,
I want roll records to state whether they came from the app's RNG or manual physical-dice entry,
so that live-table play is a first-class, validated resolution source.

Authority: ADR-0063 (dice roll resolution provenance), ADR-0060 (vision capability map).

## Acceptance Criteria

1. Given any dice roll, when it is persisted, then it carries `resolution_source` with value `local_rng` or `manual_entry`.
2. Given rows persisted or exported before this field existed, when they are parsed or imported, then `resolution_source` defaults to `local_rng` and `schema_version` stays 1.
3. Given manually entered die results, when they are saved through `createManualDiceRoll`, then they validate against the notation (die count, per-die range, modifier, total) exactly like digital rolls.
4. Given invalid manual results, when creation runs, then a typed `invalid_roll` error is raised and no row is persisted.

## Tasks / Subtasks

- [x] Add `resolution_source` enum field to `diceRollSchema` with `local_rng` default (AC: 1, 2)
- [x] Persist and parse `resolution_source` in row serialization helpers (AC: 1, 2)
- [x] Add `createManualDiceRoll` validating manual results via the existing schema refinement (AC: 3, 4)
- [x] Add co-located tests: digital provenance, manual provenance, invalid manual rejection, pre-ADR row default (AC: 1-4)
- [x] Update `docs/data/local-store-contracts.md` for the new field

## Dev Notes

- Additive optional-with-default field; no migration required, existing exports remain valid at `schema_version` 1.
- Domain validation (`src/shared/store/domain-validation.ts`) picks up the field automatically because it parses with the shared `diceRollSchema`.
- Manual-entry UI is future story scope; this story covers the contract and domain layer only.
- Verified 2026-07-08: full Jest suite (44 suites, 224 tests) and `tsc --noEmit` pass.
