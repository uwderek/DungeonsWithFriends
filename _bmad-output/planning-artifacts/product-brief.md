---
title: Product Brief - DungeonsWithFriends
status: draft
created: 2026-07-07
updated: 2026-07-07
---

# Product Brief: DungeonsWithFriends

## Executive Summary

DungeonsWithFriends is a local-first, asynchronous tabletop role-playing platform for groups whose campaigns fail because scheduling is harder than storytelling. It keeps the product promise from the earlier planning work: players should be able to understand the current fiction, make a meaningful rules-backed decision, and keep the campaign moving from short bursts of attention.

The product direction has been clarified at the platform level. Future planning should keep Expo as the primary UI/app framework, Gluestack/Tailwind as the component and styling foundation, TinyBase as the local-first store, and TypeScript as the default implementation language. The first usable product should stay fully local and login-free. Tauri/Rust, Neon/Postgres, Cloudflare, and WorkOS are later or boundary concerns, not blockers for the local MVP.

## The Problem

TTRPG groups lose momentum when play requires everyone to be online for hours, when character sheets are too hard to use on mobile, and when GMs must manually summarize, arbitrate, and prepare every interaction. Existing VTTs solve parts of the table experience but often assume desktop-first synchronous play.

The current repository also has a planning problem: March 2026 BMAD artifacts are thorough, but they encode technology decisions that no longer match the intended platform. Continuing development without a course correction would create churn and rework.

## The Solution

Build a local-first TTRPG platform in Expo/React Native with Gluestack/Tailwind presentation, headless TypeScript behavior, and TinyBase persistence. Shared TypeScript contracts should define game systems, sheets, events, scenes, and future permissions so local, hosted, and downloaded-app surfaces can stay aligned as the roadmap expands.

The MVP should re-baseline around:

- system-agnostic sheet/template creation,
- local-first playable character data,
- TinyBase migrations, export, and import,
- a durable event model for campaign actions,
- strict separation between creator tooling, runtime play, shared display, and future immersive surfaces.

Later roadmap work can add Neon/Postgres sync, Cloudflare-hosted services, WorkOS login, Tauri OS-specific downloaded-app capabilities, marketplace governance, and AI assistance after the local foundation is coherent.

## What Makes This Different

DungeonsWithFriends is not trying to clone a desktop VTT first. Its wedge is asynchronous momentum: short, context-rich turns that survive real life. The technical posture supports that wedge by making the local app useful immediately and by keeping future hosted coordination behind clean ports.

The imported ADR corpus adds a strong engineering spine: git-tracked Markdown authority, local-first defaults, shared seams, headless behavior separated from presentation, co-located tests, boundary validation, audit logging, and semantic module decomposition. Those principles are now adapted to this project rather than copied from the source project.

## Who This Serves

- Time-starved players who want meaningful turns from a phone or local client without reading a rulebook every time.
- GMs who need prep, pacing, moderation, and campaign-state tools that do not multiply their workload.
- System creators who need a desktop-quality authoring surface for system-agnostic sheets and reusable rules data.
- Platform operators who need auditability, abuse controls, and cost controls before AI-heavy features scale.

## Success Criteria

- A player can inspect local campaign/character context and queue a supported action without logging in.
- A creator can build and validate a system-agnostic sheet/template without hardcoded game-system assumptions.
- TinyBase-backed local persistence, export, import, and migrations are tested.
- Future WorkOS auth, Neon/Postgres sync, Cloudflare hosting, and Tauri OS-specific capabilities are behind app-owned ports, not scattered through feature code.
- Product code adds no Python.
- New stories cite the 2026-07-07 platform baseline and relevant cleaned ADR files directly.

## First-Version Scope

In scope:

- Re-baselined architecture and epics.
- Expo/Gluestack/Tailwind/TinyBase local product foundation.
- Login-free app flow.
- TinyBase local export/import/migration proof path.
- System-agnostic creator and local playable sheet foundations.
- Event-ledger contracts and local-first action queue direction.

Out of scope for the immediate re-baseline:

- Login/auth flows.
- Hosted sync.
- Cloudflare deployment.
- Neon/Postgres server persistence.
- Tauri OS-specific downloaded-app features unless a concrete native need is approved.
- Full AI co-GM automation.
- Marketplace monetization.
- VR/immersive runtime.
- Managed-host fleet control plane.
- Rewriting BMAD helper scripts away from Python unless a separate tooling story is approved.

## Vision

If this succeeds, DungeonsWithFriends becomes a resilient TTRPG operating layer: local-first when players are offline, coordinated when campaigns need shared authority, extensible when creators bring their own systems, and calm enough for real groups to keep playing.
