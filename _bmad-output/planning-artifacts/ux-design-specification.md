---
title: DungeonsWithFriends UX Design Specification
status: active
created: 2026-03-06
updated: 2026-07-08
supersedes:
  - March 2026 auth/sync-first UX sequencing
sources:
  - docs/roadmap/index.md
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
---

# UX Design Specification: DungeonsWithFriends

## Experience Principle

The app should feel useful before it asks for anything. A user opens DungeonsWithFriends and can immediately work locally: review a dashboard, manage characters, open creator tooling, and save/export local work without login.

## Primary Now Journey

1. User opens the app.
2. Dashboard loads in local mode.
3. User chooses creator or character work.
4. Creator can define components and bind them to a system template.
5. Player can later open a playable sheet generated from local templates.
6. Local checkpoint/export confirms the data is under the user's control.

## Creator UX

- Desktop-first for high-density authoring.
- Three-region workspace: palette, sheet canvas, properties.
- Empty states guide the user to choose a system template or import custom JSON.
- Binding controls stay system-agnostic and metadata-driven.
- Pane state can persist locally as interface preference, not product content.

## Player UX

- Mobile-first and one-handed where practical.
- Character sheets should prioritize current actionable state over full spreadsheet density.
- Dice and rule interactions should provide immediate local feedback.
- Future async action flows should show pending/local state clearly without blocking.

## Game Master UX

- Local campaign records and event ledgers should make prep and review possible before hosted collaboration.
- Tactical scene planning should start as local contracts and renderer-independent previews, not hosted rooms.

## Navigation

- Current app surfaces: Dashboard, Characters, Creator, and placeholder routes for future areas.
- Account, sign-in, premium sync, marketplace, and hosted settings are not shown in now-roadmap UX.
- Settings may exist for local preferences, import/export, debug visibility, and future provider configuration stubs only when they do not imply active hosted capability.

## States

- **Empty local state:** show useful starter actions, not a signup prompt.
- **Saved locally:** communicate local checkpoint/export success.
- **Malformed import:** explain the invalid payload and keep current local state intact.
- **Unsupported version:** tell the user the file version is unsupported and avoid partial import.
- **Future pending action:** distinguish queued local intent from authoritative synced state.

## Visual Direction

The UI should stay quiet, dense enough for repeated use, and specific to tabletop work. Creator tooling can be denser and desktop-oriented; player flows should be fast and readable on mobile.

## Accessibility

- Controls use explicit accessibility roles/labels.
- Creator workspace regions have stable logical order.
- Keyboard access is required for creator pane and properties controls.
- Text must not depend on decorative imagery or color alone.

## Later UX

- WorkOS login appears only when account-backed features require it.
- Hosted sync must explain local-vs-synced state.
- Marketplace and AI surfaces need separate trust, cost, and moderation UX.
- Tauri/downloaded-app UX appears only for concrete OS-specific needs.
