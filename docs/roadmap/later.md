# Roadmap Later

Last updated: 2026-07-07

## Goal

Add hosted, authenticated, native OS-specific, marketplace, and AI capabilities after the local product foundation is coherent and tested.

## Later Features

- WorkOS auth and login.
- Neon/Postgres server stores for synced TinyBase/local data.
- Cloudflare hosting and backend surfaces, including Workers, Pages, R2, Queues, and coordination services where they fit.
- Tauri/Rust downloaded-app capabilities for OS-specific needs, local filesystem workflows, native shell behavior, local processes, update safety, backup, or device integration.
- Cross-device sync and hosted campaign authority.
- Friends, profiles, organization/session mapping, and account management.
- Marketplace publishing, licensing, moderation, entitlement, and administrative audit views.
- AI assistance, narrative summaries, encounter balancing, rules mapping, automation, and cost controls.
- Immersive/VR or specialized display clients.

## Entry Criteria

- Now and Next local contracts are stable enough that hosted services attach through ports.
- Auth and account concepts are required by a user-facing feature, not only by infrastructure preference.
- Native downloaded-app work has a concrete OS-specific requirement Expo cannot satisfy cleanly.

## Guardrails

- WorkOS concepts must stay behind app-owned auth/session ports.
- Neon/Postgres sync must not bypass local data contracts.
- Cloudflare services must be selected per responsibility instead of becoming a catch-all platform abstraction.
- Tauri/Rust must not replace Expo as the primary UI framework.
