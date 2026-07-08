# Project Documentation Index

Last updated: 2026-07-07

## Current Authority

- [Project Context](./project-context.md)
- [Product Requirements](../_bmad-output/planning-artifacts/prd.md)
- [Current Codebase Architecture](./architecture.md)
- [Technical Architecture](../_bmad-output/planning-artifacts/architecture.md)
- [UX Design Specification](../_bmad-output/planning-artifacts/ux-design-specification.md)
- [Epics and Stories](../_bmad-output/planning-artifacts/epics.md)
- [Sprint Status](../_bmad-output/implementation-artifacts/sprint-status.yaml)
- [Roadmap Priority Index](./roadmap/index.md)
- [Roadmap Now](./roadmap/now.md)
- [Roadmap Next](./roadmap/next.md)
- [Roadmap Later](./roadmap/later.md)
- [Testing Strategy](./testing/strategy.md)
- [Local Store Contracts](./data/local-store-contracts.md)
- [Template Binding Contracts](./data/template-binding-contracts.md)
- [Export and Import Format](./data/export-import-format.md)
- [DWF Platform Baseline ADR](./decisions/ADR-0059-dwf-platform-baseline-typescript-tauri-cloudflare-workos.md)
- Cleaned ADR corpus: individual files in `docs/decisions/` carry DWF disposition and roadmap lane metadata.
- [Sprint Change Proposal](../_bmad-output/planning-artifacts/sprint-change-proposal-2026-07-07.md)
- [Architecture Realignment](../_bmad-output/planning-artifacts/architecture-realignment-2026-07-07.md)
- [Documentation Repair Plan](../_bmad-output/planning-artifacts/documentation-repair-plan-2026-07-07.md)

## Legacy Planning Background

The repaired active planning artifacts above supersede the March 2026 provider assumptions. Older source material remains in archive/background files only.

## Existing Background

- [Archived Product Notes](./archive/product.md)
- [Archived Product Roadmap](./archive/productroadmap.md)
- [Archived Architecture Notes](./archive/architecture.md)

## Quick Reference

- Primary UI/app framework now: Expo and React Native.
- Primary component/styling framework now: Gluestack plus Tailwind/NativeWind, with behavior kept headless where practical.
- Product store now: TinyBase, fully local and login-free.
- Primary implementation language: TypeScript.
- Current auth posture: no login for now-roadmap work.
- OS-specific downloaded-app boundary: Tauri and Rust only when Expo cannot own the local/native concern.
- Later server sync: Neon/Postgres stores behind explicit sync ports.
- Later hosted platform: Cloudflare.
- Later auth provider: WorkOS.
- Product-code Python posture: avoid; do not add new Python product code.
- Current app path: `DungeonsWithFriends/`.
- Current planning path: `_bmad-output/planning-artifacts/`.
- Current implementation artifact path: `_bmad-output/implementation-artifacts/`.
