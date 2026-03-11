---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputs:
  - c:\Development\DungeonsWithFriends\_bmad-output\planning-artifacts\prd.md
  - c:\Development\DungeonsWithFriends\_bmad-output\planning-artifacts\architecture.md
  - c:\Development\DungeonsWithFriends\_bmad-output\planning-artifacts\product.md
  - c:\Development\DungeonsWithFriends\_bmad-output\planning-artifacts\productroadmap.md
workflowType: 'architecture'
project_name: 'DungeonsWithFriends'
user_name: 'Derek'
date: '2026-03-06T08:14:35-08:00'
lastStep: 8
status: 'complete'
completedAt: '2026-03-06T10:02:56-08:00'
---
# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The platform demands a robust, system-agnostic core capable of supporting complex drag-and-drop character sheet creation, asynchronous play-by-post mechanics, and AI-driven generative content (encounters, memory, rules parsing). The architecture must support isolated offline client state mutation that eventually synchronizes with a multi-tenant authoritative server logic.

**Non-Functional Requirements:**
Performance is paramount: 30fps WebGL rendering, < 200ms dice parsing, and < 3s online state reconciliation. Security demands hard caps on LLM API usage to prevent asymmetrical billing. Accessibility mandates full screen-reader compliance for mobile components.

**Scale & Complexity:**
- Primary domain: Cross-platform Application (Expo / React Native)
- Complexity level: High (Real-time sync, WebRTC, WebGL, AI integration)
- Estimated architectural components: Dozens of isolated, decoupled modules (Sheet Builder, Event Ledger, AI Proxy, Battlemap Renderer).

### Technical Constraints & Dependencies

- Must utilize Expo and React Native for Cross-Platform compatibility.
- **WebGL Main-Thread Constraint:** The architecture must mandate decoupling the React UI state (Zustand/Gluestack) from the Three.js render loop to meet the 30fps NFR.
- Relies heavily on TinyBase / SQLite for local state and Nhost (Postgres / Hasura) for Cloud Sync.
- 3D elements and rendering bound to Three.js capabilities.
- LLM parsing limited by OpenRouter API limits, latency, and costs.
- Custom test orchestration using Playwright, Jest, and an MCP test orchestrator.

### Cross-Cutting Concerns Identified

- **Data Synchronization & Resolution:** Conflict-less merging of offline actions via the Universal Event Ledger. **CRITICAL:** The architecture requires deterministic sequencing (e.g., Lamport timestamps or Vector Clocks) to support the complex UX "Conflict Pivots," ensuring graceful async conflict resolution rather than simple server-wins overrides.
- **Security Boundary for AI:** The "AI Proxy" must be elevated as an existential security/billing boundary to intercept all LLM calls and enforce token quotas before hitting OpenRouter (satisfying NFR4 and FR49).
- **Module Decoupling:** The architecture must support shipping the Phase 1 "Character Builder" completely independently of the Phase 2 "Asynchronous VTT" networking layer.
- **Strategic Decoupling (The MVP Pivot):** The architecture must enforce a strict boundary between Game Domain Logic and the Networking Sync Layer, enabling Phase 1 (Offline Builder) to ship and function perfectly without Nhost/GraphQL overhead.
- **Asynchronous UX Data Pre-computation:** Feature requirements like LLM Narrative Digests must be architected as server-side background queues that push pre-computed results to the client, ensuring zero-latency presentation upon app load.
- **Theming System:** Data-driven CSS variable injection (Tailwind) for system-agnostic visual styling via Gluestack UI.
- **Testability:** Deep integration with the MCP test orchestrator requiring specific structural patterns for CI validation.

## Starter Template Evaluation

### Primary Technology Domain

Cross-platform Mobile/Web Application (React Native / Expo) based on project requirements analysis.

### Starter Options Considered

1. **Gluestack-UI NativeWind v4 Template (`gluestack/gluestack-expo-nativewind-v4-template`)**
   - **Pros:** Provides immediate, exact alignment with the UX specification's requirement for Gluestack UI components styled via Tailwind CSS (NativeWind). Supports radical theming out of the box.
   - **Cons:** It is purely a UI/frontend boilerplate. It does not include data-layer opinions (Zustand, TinyBase, or Nhost).

2. **Expo "with-tinybase" Official Example (`npx create-expo-app --example with-tinybase`)**
   - **Pros:** Perfectly implements the local-first reactive data store requirement (TinyBase over SQLite). Demonstrates the exact persistence pattern needed for offline VTT play.
   - **Cons:** Extremely barebones UI. Requires massive manual setup of the complex Gluestack/Tailwind configuration afterwards. No Nhost synchronization logic included.

### Selected Starter Strategy: Custom Integration atop Gluestack Template

There is no single "turnkey" starter that handles all three highly specific infrastructural pillars of Dungeons With Friends (Gluestack UI + TinyBase offline + Nhost cloud). 

**Rationale for Selection:**
We will use the **Gluestack-UI NativeWind v4 Template** as the foundation. The UI and styling architecture (dynamic campaign themes) represents the largest volume of boilerplate code and configuration complexity. By starting with the Gluestack template, we secure the rigid, accessible component system required for both mobile "Action Cards" and the complex desktop "Sheet Builder." We will then custom-integrate TinyBase and Zustand into this shell as the persistent and ephemeral data layers.

**Initialization Command:**

```bash
npx create-expo-app@latest DungeonsWithFriends --template gluestack-ui-nativewind-template
```
*(Note: Exact template name may vary based on Gluestack's latest registry; we will verify the exact command during Phase 1 init).*

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript strictly enforced within an Expo React Native environment.

**Styling Solution:**
NativeWind v4 (Tailwind CSS for React Native) fully configured with Gluestack's unstyled primitives, enabling the data-driven CSS variable injection required for system-agnostic visual styling (FR27b).

**Build Tooling:**
Expo CLI and Metro Bundler.

**Code Organization:**
Standard Expo file-based routing (`expo-router`) or standard App entry point, with pre-configured component library folders.

**Note:** Project initialization using this command alongside manually integrating `tinybase`, `zustand`, and `@nhost/nhost-js` should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Data Validation Strategy (Zod Schema Validation)
- Authentication/API Provider Abstraction (Facade Pattern over Nhost)
- Frontend Component Architecture (Feature-Sliced Design with Shared UI)
- Simulation and Scene Architecture (`game_core` + `scene_core`)
- Tactical Rendering and Display Architecture (Path A)

**Important Decisions (Shape Architecture):**
- Deployment Strategy (Vercel Web + Expo Application Services for Native)
- Transport Strategy (Internet-backed first with future LAN-compatible adapters)

**Deferred Decisions (Post-MVP):**
- LAN/local-room session topology specifics after the internet-backed experience stabilizes
- Native VR interaction patterns and target-device-specific control schemes

### Data Architecture

**Decision:** Client-Side Zod Schema Validation (Zod v3.x)
**Rationale:** Due to the system-agnostic requirement of the Character Builder (where users can define custom data shapes via JSON), we cannot rely solely on Postgres schema definitions. Zod ensures that all data entering the local TinyBase instance and subsequently syncing to the authoritative server matches strict, type-safe run-time contracts, preventing sync corruption.

### Simulation and Scene Architecture

**Decision:** Deterministic `game_core` plus renderer-agnostic `scene_core`
**Rationale:** The platform must support thousands of encounter simulations, offline turn decisions, 2D/isometric/3D tactical projections, shared-display presentation, and future native VR clients. A small deterministic `game_core` keeps rules processing fast and portable, while a separate `scene_core` describes cameras, geometry, lighting, fog, and visual compatibility without turning renderer objects into the source of truth.

### Authentication & Security

**Decision:** Formally Decoupled Nhost Auth (Nhost JS SDK v4.5+)
**Rationale:** We will utilize Nhost's built-in Authentication (JWTs over Postgres) to leverage the rapid development speed of a BaaS. However, the React Native codebase will integrate this via an abstract `AuthProvider` interface context. No UI or Domain feature code will import `@nhost` directly. This prevents vendor lock-in and adheres to the "System-Agnostic" philosophy, allowing us to swap the backend later if scaling requires it.

### API & Communication Patterns

**Decision:** GraphQL Subscriptions via SyncFacade
**Rationale:** The TinyBase synchronizer will communicate with the Nhost Hasura endpoint via GraphQL. Similar to the Auth decision, this will be strictly hidden behind a `SyncProvider` facade. The application will interact with the local TinyBase store synchronously; the `SyncProvider` handles the background resolution and GraphQL mutations without leaking network layer logic into the game domain. This same facade boundary preserves room for future LAN/local-room transport adapters without rewriting feature-level gameplay logic.

### Rendering and Display Architecture

**Decision:** Path A web-capable 3D-first tactical renderer
**Rationale:** Tactical scenes, shared TV displays, desktop web play, and future VR all benefit from a Three.js-compatible rendering ecosystem. The battlemap/display subsystem will therefore be treated as a specialized rendering product with shared scene contracts, while the broader application shell remains Expo/React Native-first for notifications, accessibility, account flows, and offline shell behavior.

### Frontend Architecture

**Decision:** Feature-Sliced Design (FSD) with shared platform contracts and multiple client surfaces
**Rationale:** To support shipping the "Character Builder," play clients, shared display surfaces, and future immersive clients independently, the product must separate shared contracts (`game_core`, `scene_core`, sync/content models) from surface-specific interaction shells. Within each client surface, Feature-Sliced Design remains the organizing principle, while `shared/ui` continues to provide generic themed components for non-renderer interfaces.

### Infrastructure & Deployment

**Decision:** Vercel (Web play, creator, shared display) + Expo Application Services (Native mobile) + future native VR distribution
**Rationale:** The desktop creator, desktop web play client, and shared-display web surfaces will deploy via Vercel for high-performance delivery and preview environments. The iOS/Android native client applications will utilize EAS Build and Submit to manage certificates, continuous delivery distributions, and over-the-air (OTA) updates. Future VR clients will consume the same shared contracts but ship through their native platform distribution path when that roadmap phase begins.

### Decision Impact Analysis

**Implementation Sequence:**
1. Scaffold Expo/Gluestack/Nativewind architecture (Starter Template).
2. Establish `game_core` and `scene_core` contracts before feature-level battlemap work begins.
3. Implement global `shared/ui` component foundations and storage abstractions for native/web offline support.
4. Build the abstract `AuthProvider` and `SyncProvider` facades.
5. Implement TinyBase-backed persistence, offline asset manifests, and the core Zod validation schemas.
6. Wire the Nhost adapters into the Provider facades and preserve future LAN transport seams.
7. Begin `features/builder`, play-client, and tactical-scene implementation.

**Cross-Component Dependencies:**
- The `SyncProvider` is highly dependent on the `AuthProvider` state to initiate authenticated GraphQL subscriptions to Nhost.
- Every `feature/*` directory is strictly dependent on the Zod validation schemas to execute mutations against the local TinyBase ledger.
- Tactical renderers, shared displays, and future immersive clients must consume `scene_core` and may not directly mutate `game_core`.
- Offline asset availability depends on shared content manifests and storage adapters that work across native and web surfaces.

## Application Boundary Model

### Why These Boundaries Exist

The product now spans multiple first-class surfaces with different interaction models, performance characteristics, and privacy needs. These boundaries exist to keep future sprint work from collapsing creator tooling, runtime play, rendering, synchronization, and immersive presentation into a single brittle code path.

The separation is intentional for five reasons:

1. **Creator authoring and runtime play solve different problems.**
   The creator surface optimizes for dense desktop authoring, template composition, and schema binding. Runtime play surfaces optimize for turn resolution, tactical scene interaction, and player-safe presentation.

2. **Canonical game rules must remain independent from rendering.**
   Thousands of simulations, offline turn decisions, server reconciliation, and future AI workflows all require a deterministic rules model that does not depend on UI trees or renderer objects.

3. **Scene presentation must remain independent from any single client shell.**
   Tactical scenes must support mobile native, mobile web, desktop web, shared-display, and future VR clients without requiring pixel-perfect parity or separate gameplay implementations.

4. **Offline behavior varies by platform even when the user experience is aligned.**
   Native and web clients share offline-first expectations, but storage adapters, caching mechanics, and transport details differ enough that those responsibilities must stay abstracted.

5. **Future LAN and VR support require preserved seams now.**
   Even before those features ship, architecture must prevent sprint work from hardcoding cloud-only assumptions or screen-flat rendering assumptions into the product core.

### Surface Responsibilities

#### Creator Surface

**Primary role:** Desktop-web-first authoring of system-agnostic sheet templates, bindings, and reusable layout primitives.

**Owns:**
- creator workspace shell
- template layout metadata
- component registry for sheet authoring
- system-template selection and custom JSON binding
- creator preview behavior for sheet consumption across device sizes

**Does not own:**
- tactical encounter rendering
- battle-map scene state
- shared-display presentation
- immersive/VR presentation
- multiplayer session transport

#### Play Surfaces

**Primary role:** Interactive campaign participation across native mobile, mobile web, and desktop web.

**Owns:**
- player-facing campaign flows
- character usage during play
- runtime action submission
- runtime tactical-scene consumption
- offline review and deferred turn decisions

**Does not own:**
- creator authoring workflows
- marketplace administration
- direct mutation of canonical renderer-independent contracts outside approved facades

#### Shared Display Surface

**Primary role:** Player-safe room presentation of runtime tactical scenes and shared audio context.

**Owns:**
- public display presentation
- room-safe scene framing
- display-specific camera/layout behavior

**Does not own:**
- private player controls
- GM-only data exposure
- creator authoring behavior
- separate tactical rules logic

#### Immersive Surface

**Primary role:** Future native VR client for compatible tactical scenes.

**Owns:**
- immersive scene presentation
- supported spatial camera modes
- tabletop and character-perspective viewing for compatible encounters

**Does not own:**
- creator editing
- a separate gameplay rules model
- one-off scene data contracts that bypass shared runtime state

### Shared Core Responsibilities

#### `game_core`

**Primary role:** Canonical deterministic rules and simulation state.

**Owns:**
- encounter state
- action resolution
- turn order
- player/actor state
- simulation inputs and outputs
- authoritative rule-driven outcomes

**Does not own:**
- UI layout state
- renderer object graphs
- scene-specific camera presentation
- platform shell concerns

#### `scene_core`

**Primary role:** Canonical renderer-agnostic presentation model for runtime tactical scenes.

**Owns:**
- scene geometry metadata
- tactical presentation metadata
- visibility/fog/light descriptors
- compatible 2D/isometric/3D view information
- scene compatibility for shared display and future immersive clients

**Does not own:**
- creator template layout authoring
- game rule resolution
- network transport logic
- client-specific HUD chrome

#### Sync, Storage, and Content Layers

**Primary role:** Keep the product local-first, synchronized, and content-driven across surfaces.

**Owns:**
- offline persistence abstractions
- sync queues and reconciliation workflows
- content manifests and asset availability
- account-linked cloud synchronization through provider facades

**Does not own:**
- creator workspace UX
- tactical renderer behavior
- direct business-rule mutation outside approved state flows

### Allowed Dependency Directions

- Creator stories may produce template metadata and schema-aligned content that later play surfaces consume.
- Play surfaces may consume `game_core`, `scene_core`, sync abstractions, and shared presentation primitives.
- Shared-display and immersive clients may consume `game_core`, `scene_core`, and selective shared UI primitives where privacy and presentation rules allow.
- Automation, simulation, and AI layers may consume canonical rules/runtime data, but they must not depend on renderer objects or creator-only UI state.

### Forbidden Couplings

- Do not treat the creator layout canvas as an early tactical scene canvas.
- Do not make renderer objects the source of truth for gameplay or synchronization.
- Do not make shared-display presentation a variation of the creator desktop shell.
- Do not force creator interaction models onto mobile/native play surfaces.
- Do not allow tactical epics to redefine creator data contracts without updating the creator track explicitly.
- Do not hardcode cloud-only transport assumptions into gameplay flows that must later support local-room compatibility seams.

### Data Flow Across Layers

1. **Creator authoring flow**
   Creator stories define template metadata, bindings, and presentation intent for sheet consumption.

2. **Shared content flow**
   Validated creator output and platform-curated content become inputs to runtime-capable content models.

3. **Runtime rules flow**
   `game_core` resolves encounter state, actions, and simulation outcomes without depending on rendering.

4. **Runtime scene flow**
   `scene_core` expresses runtime tactical presentation derived from canonical runtime state and scene assets.

5. **Client presentation flow**
   Play, shared-display, and future immersive surfaces render or present the runtime scene according to their own responsibilities without rewriting gameplay rules.

6. **Sync and offline flow**
   Local-first persistence and sync adapters store, cache, replay, and reconcile state across native and web surfaces without blocking the active user experience.

### Sprint Implementation Rules

Future sprint work should follow these rules:

- If a story seems to touch both creator authoring and runtime tactical behavior, stop and confirm whether the work belongs in shared contracts or in only one surface.
- If a change seems to require a new shared abstraction, prefer shared contracts such as `game_core`, `scene_core`, sync/storage interfaces, or content manifests over ad hoc UI-level sharing.
- If a story can be completed entirely inside one surface, keep it there and do not generalize prematurely.
- If a runtime story needs data produced by the creator track, consume the creator output through validated content contracts rather than by importing creator UI code or creator-local state.
- If a future feature mentions LAN, shared display, or VR, preserve the seam now but do not drag those responsibilities into unrelated earlier stories.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
4 core areas where AI agents could make different choices relating to file routing, Nhost schema mapping, testing orchestration, and offline-first state mutations.

### Naming Patterns

**API & Data Naming Conventions (The Zod/Nhost Boundary):**
- **Rule:** Strict `snake_case` for all JSON payloads, TinyBase schemas, and Zod definitions representing Domain Models (e.g., `character_id`, `max_hp`).
- **Rationale:** This maps 1:1 with standard PostgreSQL naming conventions in Nhost. By forcing `snake_case` in the data layer, we eliminate the need for error-prone AI-generated GraphQL alias mapping layers.

**Code Naming Conventions (React & Expo):**
- **Rule:** File route names and component files must use `kebab-case.tsx` (e.g., `character-card.tsx`).
- **Rule:** Exported React Components must use `PascalCase` (e.g., `export const CharacterCard`).
- **Rule:** Internal variables, hooks, and functions must use `camelCase` (e.g., `useCharacterState`, `handleSync`).

### Structure Patterns

**Project Organization:**
- **Rule:** Strict Feature Co-location (Feature-Sliced Design).
- **Rationale:** Every feature (e.g., `src/features/builder/`) must contain its own specific `ui/`, `api/`, `model/` (Zod/TinyBase), and `lib/` folders. Global folders are strictly reserved for abstract infrastructural facades (`src/shared/providers/`) or universally shared presentation components (`src/shared/ui/`).

**File Structure Patterns (Testing):**
- **Rule:** Tests MUST be co-located directly next to the file they are testing (e.g., `character-card.tsx` and `character-card.test.tsx` live in the same directory).
- **Rationale:** The MCP `test-orchestrator` and Playwright pipelines perform better with localized context boundaries, and it prevents AI agents from getting lost in massive global `__tests__` directories.

### Format Patterns

**API Response Formats:**
- **Rule:** All requests traversing the `SyncProvider` facade must return either a successful `Data` object or an explicitly typed `{ error: string, code: number }` object. 

### Communication Patterns

**State Management Patterns (The Offline-First Mandate):**
- **Rule:** Optimistic Global UI Updates.
- **Rationale:** **Never block the UI thread waiting for an Nhost sync.** All user actions perform mutations against the local TinyBase store synchronously via Zustand actions. The UI updates instantly. The `SyncProvider` handles the background network resolution to Nhost asynchronously. If an AI agent writes a feature that puts up a blocking "Saving to cloud..." spinner, it is violating the offline-first architecture.

### Enforcement Guidelines

**All AI Agents MUST:**
- Write Zod schemas using `snake_case` keys.
- Write files using `kebab-case.ts`.
- Mutate local variables before awaiting network responses.
- Keep tests strictly co-located within feature directories.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All major technology choices (Expo, NativeWind, Gluestack, TinyBase-style offline storage, Nhost, Zod, Zustand, and a Three.js-compatible scene stack) are compatible when they are kept in their proper architectural lanes. NativeWind and Gluestack are explicitly designed to work together in Expo, while the tactical renderer remains isolated behind `scene_core` contracts rather than leaking renderer concerns into the app shell.

**Pattern Consistency:**
The mandated patterns strictly enforce the constraints of the technology stack. Implementing structural facades (`SyncProvider`, `AuthProvider`, storage adapters, and scene adapters) mitigates the risk of tightly coupling Nhost, renderer details, or platform-specific transport logic into generic UI and domain code.

**Structure Alignment:**
Feature-Sliced Design (FSD) plus explicit shared-core boundaries provides the clearest, most scalable model for decoupling the Phase 1 creator/tooling investment from the later asynchronous VTT, shared display, and immersive surfaces. It fully supports the implementation patterns.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
The architecture thoroughly supports the core epics (Sheet Builder, Asynchronous VTT, Tactical Scenes, Shared Display, AI Narrator, and future immersive clients) by providing dedicated UI structures, offline-first persistence, shared simulation/scene contracts, and secure backend execution boundaries.

**Functional Requirements Coverage:**
The strict Zod validation requirement ensures FRs related to custom, user-generated JSON rule systems are handled safely without corrupting the authoritative server, while the `game_core`/`scene_core` split supports shared-display, offline-web, and future VR-oriented requirements without forking the domain model.

**Non-Functional Requirements Coverage:**
- Performance (30fps): Addressed by adopting a decoupled Three.js-compatible rendering subsystem from the start, preserving projection-mode compatibility while allowing graceful degradation on weaker devices.
- Security (AI Billing): Addressed by strictly walling OpenRouter API calls behind Nhost Serverless functions in the `SyncProvider`.

### Implementation Readiness Validation ✅

**Decision Completeness:**
Critical foundational decisions (Data, Auth, API, Structure, Simulation/Scene separation, Rendering, and Patterns) are locked with specific v-next library versions verified for stability. 

**Structure Completeness:**
The specific filesystem tree provides unambiguous guidance for AI agents regarding where to put routes, UI components, Zod schemas, tests, and configuration files.

**Pattern Completeness:**
Explicit anti-patterns (e.g., blocking UI for sync, camelCase Postgres mapping, mutating game state from renderer objects) have been documented to prevent the most common AI implementation errors.

### Gap Analysis Results

**Important Gaps (To be addressed during Epic Planning):**
- **Conflict Resolution Algorithm:** While the architecture mandates "graceful async conflict resolution," the exact mathematical implementation (e.g., Lamport timestamps vs. Vector Clocks) within the TinyBase synchronizer is deferred to the VTT networking epic.
- **Offline Web Storage Adapter:** The exact persistence adapter and asset prefetch policy for full offline web support require implementation-level validation.
- **Room Session Transport:** Internet-backed play is defined first, but the future LAN/local-room mode still requires a specific transport and discovery design.
- **Native VR Delivery Path:** The target VR runtime and its native distribution strategy require a later implementation decision once immersive work begins.

### Validation Issues Addressed

- Re-aligned the codebase to use strict `snake_case` on the data boundaries to prevent AI agents from generating flawed frontend-to-backend data mapping layers, a common point of failure.
- Mandated optimistic UI updates to ensure the Offline-First NFR is not violated by standard web-development "loading spinner" patterns.
- Separated canonical simulation and scene models so tactical rendering, shared displays, and future immersive clients can evolve without rewriting the game rules core.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High. The combination of established BaaS (Nhost), local-first tooling, a shared simulation/scene model, and an explicit multi-surface client strategy directly targets the core risks of the product.

**Key Strengths:**
- Strict decoupling of domain logic from network sync.
- "Offline-first" built into the lowest levels of state management.
- Heavy focus on type safety and schema validation for user-generated content.
- Tactical scenes, shared display, and future immersive clients are now accounted for without forcing pixel-perfect parity across surfaces.

**Areas for Future Enhancement:**
- Exploration of specialized conflict-free replicated data types (CRDTs) for complex VTT battlemap state and future LAN modes.
- Deep performance profiling of the tactical renderer across low-end Android hardware, mobile web browsers, and shared-display scenarios.

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented.
- Use implementation patterns consistently across all components.
- Respect project structure and Feature-Sliced Design boundaries.
- Refer to this document for all architectural questions.

**First Implementation Priority:**
Initialize the Expo project using the Gluestack v4 Nativewind template, then scaffold the foundational `shared/ui`, `shared/providers`, `game_core`, and `scene_core` boundaries before feature-level tactical rendering begins.
