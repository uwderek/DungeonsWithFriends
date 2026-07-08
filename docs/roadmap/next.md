# Roadmap Next

Last updated: 2026-07-07

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
- Test coverage for local persistence, schema migration, action envelopes, and renderer-independent contracts.

## Exit Criteria

- Characters, campaigns, actions, and scenes can be modeled locally with explicit sync envelopes.
- Later Neon/Postgres sync can consume the same contracts without rewriting gameplay code.
- Later Tauri, Cloudflare, and WorkOS work can attach through ports without changing core local behavior.
