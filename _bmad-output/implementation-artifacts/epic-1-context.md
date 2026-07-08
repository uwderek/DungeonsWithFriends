# Epic 1 Context: Local Creator Foundation

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Epic 1 makes creator tooling useful locally in the Expo app before accounts, hosted sync, marketplace, or playable sheet runtime work. A creator should be able to define system-agnostic sheet components, select or import system metadata, bind components to system fields, and keep that work recoverable through the local TinyBase snapshot/export path.

## Stories

- Story 1.1: Creator Workspace Shell
- Story 1.2: System Template Selection And Custom JSON Binding
- Story 1.3: Component Registry And Binding Contract
- Story 1.4: Local Save Load Preview Export Import

## Requirements & Constraints

Now-roadmap work is local, login-free, TinyBase-first, and TypeScript-first. Creator tooling must validate component definitions, system templates, template bindings, layout intent, and import/export boundaries before data enters local tables. Local snapshots and exported files must carry a schema version, reject malformed payloads, reject unsupported future versions, and avoid mutating existing local data on failed import. Product code must not add Python, login requirements, hosted sync, WorkOS, Cloudflare, Neon/Postgres, Tauri, marketplace, or AI scope.

## Technical Decisions

Expo/React Native remains the app framework, with Gluestack/Tailwind/NativeWind presentation and headless TypeScript behavior where practical. TinyBase is the current product store. The app-owned `SyncProvider` owns the active TinyBase store, while `src/shared/store/` owns local persistence, migration, export, and import helpers. Persisted fields use `snake_case`; TypeScript hooks, functions, and props use `camelCase`. Feature slices own domain schemas and write validated rows into TinyBase. Future provider work attaches through ports/adapters and must not be imported by now-roadmap creator features.

## UX & Interaction Patterns

Creator tooling is desktop-first and dense enough for authoring. The workspace uses palette, canvas, and properties regions. Empty states should guide the creator to choose a system template or import custom JSON rather than requiring signup. Binding controls are metadata-driven and system-agnostic. Saved/exported local work should clearly communicate user control, while malformed imports and unsupported versions must be recoverable without losing current state.

## Cross-Story Dependencies

Story 1.2 establishes selected/imported system templates. Story 1.3 uses those template fields to validate component bindings and report stale bindings. Story 1.4 depends on the local store, template, and binding contracts to save, preview, export, and import creator work without hosted services.
