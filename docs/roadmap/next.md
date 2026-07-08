# Roadmap Next

Last updated: 2026-07-08

## Goal

Deepen the local gameplay loop and prepare clean sync boundaries while keeping the product useful without accounts or hosted infrastructure.

## Binding Decisions

- Expo remains the primary UI surface.
- Gluestack/Tailwind presentation stays separate from headless TypeScript behavior.
- TinyBase remains the local state authority until later sync work begins.
- Sync-ready contracts may be introduced, but hosted sync must not become a runtime requirement.

## Next Features

- Local playable character sheet runtime.
- Native dice notation parsing and local roll resolution.
- Local character library, manual export, and import.
- Local campaign records and event ledger.
- Pending action queue and conflict envelope contracts.
- Tactical scene contracts for maps, tokens, visibility, initiative, and renderer independence.
- Shared-display and async-play contracts that can run locally before hosted rooms.
- AI content generation and ingestion (Epic 9, per Derek 2026-07-08): ingest documented game systems into the rules/compendium contracts (ADR-0064) and generate adventures, stories, and content targeting the same contracts, behind governed actions (ADR-0038) and an AI provider port that permits local model execution (ADR-0060).
- Test coverage for local persistence, schema migration, action envelopes, and renderer-independent contracts.

## Exit Criteria

- Characters, campaigns, actions, and scenes can be modeled locally with explicit sync envelopes.
- Later Neon/Postgres sync can consume the same contracts without rewriting gameplay code, and the sync port stays transport-agnostic per ADR-0061 so LAN and file-exchange adapters remain possible.
- Later Tauri, Cloudflare, and WorkOS work can attach through ports without changing core local behavior.
- Ingested game systems and AI-generated content are stored only through the rules/compendium contracts with licensing metadata intact.
