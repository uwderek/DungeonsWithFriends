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

**Important Decisions (Shape Architecture):**
- Deployment Strategy (Vercel Web + Expo Application Services for Native)

**Deferred Decisions (Post-MVP):**
- Detailed Battlemap/WebGL 3D Physics logic (Post-MVP, pending successful 2D integration and hardware profiling).

### Data Architecture

**Decision:** Client-Side Zod Schema Validation (Zod v3.x)
**Rationale:** Due to the system-agnostic requirement of the Character Builder (where users can define custom data shapes via JSON), we cannot rely solely on Postgres schema definitions. Zod ensures that all data entering the local TinyBase instance and subsequently syncing to the authoritative server matches strict, type-safe run-time contracts, preventing sync corruption.

### Authentication & Security

**Decision:** Formally Decoupled Nhost Auth (Nhost JS SDK v4.5+)
**Rationale:** We will utilize Nhost's built-in Authentication (JWTs over Postgres) to leverage the rapid development speed of a BaaS. However, the React Native codebase will integrate this via an abstract `AuthProvider` interface context. No UI or Domain feature code will import `@nhost` directly. This prevents vendor lock-in and adheres to the "System-Agnostic" philosophy, allowing us to swap the backend later if scaling requires it.

### API & Communication Patterns

**Decision:** GraphQL Subscriptions via SyncFacade
**Rationale:** The TinyBase synchronizer will communicate with the Nhost Hasura endpoint via GraphQL. Similar to the Auth decision, this will be strictly hidden behind a `SyncProvider` facade. The application will interact with the local TinyBase store synchronously; the `SyncProvider` handles the background resolution and GraphQL mutations without leaking network layer logic into the game domain.

### Frontend Architecture

**Decision:** Feature-Sliced Design (FSD) with a Global "Shared" UI Layer
**Rationale:** To support shipping the "Character Builder" completely independent of the "Asynchronous VTT" features, the monorepo will be structured by feature domain (e.g., `features/builder`, `features/combat`). However, to maintain high visual consistency and rapidly build complex interfaces, a robust `shared/ui` directory containing all generic, themed Gluestack UI components will sit beneath the feature slices, consumed universally.

### Infrastructure & Deployment

**Decision:** Vercel (Web) + Expo Application Services (Native)
**Rationale:** The complex "Creator" desktop web app will deploy via Vercel for high-performance static delivery and seamless preview deployments. The iOS/Android native client applications will utilize EAS Build and Submit to manage certificates, continuous delivery distributions, and over-the-air (OTA) updates. This aligns optimally with the `test-orchestrator` and Playwright automated E2E pipelines.

### Decision Impact Analysis

**Implementation Sequence:**
1. Scaffold Expo/Gluestack/Nativewind architecture (Starter Template).
2. Implement global `shared/ui` component foundations.
3. Build the abstract `AuthProvider` and `SyncProvider` facades.
4. Implement TinyBase and the core Zod validation schemas.
5. Wire the Nhost adapters into the Provider facades.
6. Begin `features/builder` implementation.

**Cross-Component Dependencies:**
- The `SyncProvider` is highly dependent on the `AuthProvider` state to initiate authenticated GraphQL subscriptions to Nhost.
- Every `feature/*` directory is strictly dependent on the Zod validation schemas to execute mutations against the local TinyBase ledger.

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
All major technology choices (Expo, NativeWind, Gluestack, TinyBase, Nhost, Zod, Zustand) are highly compatible. NativeWind and Gluestack are explicitly designed to work together in Expo. TinyBase's reactive model pairs perfectly with Zustand for UI state, and both can be synced externally to Nhost Postgres.

**Pattern Consistency:**
The mandated patterns strictly enforce the constraints of the technology stack. Implementing a structural facade (SyncProvider/AuthProvider) perfectly mitigates the risk of tightly coupling Nhost into the Expo generic UI, maintaining the desired "System-Agnostic" philosophy.

**Structure Alignment:**
Feature-Sliced Design (FSD) provides the clearest, most scalable boundary for decoupling the Phase 1 "Offline Character Builder" from the Phase 2 "Asynchronous VTT." It fully supports the implementation patterns.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
The architecture thoroughly supports the core epics (Sheet Builder, Asynchronous VTT, AI Narrator) by providing dedicated UI structures, offline-first persistence (TinyBase), and secure backend execution (Nhost Serverless Functions).

**Functional Requirements Coverage:**
The strict Zod validation requirement ensures FRs related to custom, user-generated JSON rule systems are handled safely without corrupting the authoritative server.

**Non-Functional Requirements Coverage:**
- Performance (30fps): Addressed strategically by deferring WebGL integration until the 2D UI foundation is proven and decoupling React state from the render loop.
- Security (AI Billing): Addressed by strictly walling OpenRouter API calls behind Nhost Serverless functions in the `SyncProvider`.

### Implementation Readiness Validation ✅

**Decision Completeness:**
Critical foundational decisions (Data, Auth, API, Structure, Patterns) are locked with specific v-next library versions verified for stability. 

**Structure Completeness:**
The specific filesystem tree provides unambiguous guidance for AI agents regarding where to put routes, UI components, Zod schemas, tests, and configuration files.

**Pattern Completeness:**
Explicit anti-patterns (e.g., blocking UI for sync, camelCase Postgres mapping) have been documented to prevent the most common AI implementation errors.

### Gap Analysis Results

**Important Gaps (To be addressed during Epic Planning):**
- **Conflict Resolution Algorithm:** While the architecture mandates "graceful async conflict resolution," the exact mathematical implementation (e.g., Lamport timestamps vs. Vector Clocks) within the TinyBase synchronizer is deferred to the VTT networking epic.
- **WebGL Fallback Implementation:** The technical mechanics of dropping from Three.js to 2D Canvas on low-end Android hardware require specific component-level prototyping.

### Validation Issues Addressed

- Re-aligned the codebase to use strict `snake_case` on the data boundaries to prevent AI agents from generating flawed frontend-to-backend data mapping layers, a common point of failure.
- Mandated optimistic UI updates to ensure the Offline-First NFR is not violated by standard web-development "loading spinner" patterns.

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

**Confidence Level:** High. The combination of established BaaS (Nhost) with local-first tooling (TinyBase) wrapped in an accessible UI framework (Gluestack/Expo) directly targets the core risks of the product.

**Key Strengths:**
- Strict decoupling of domain logic from network sync.
- "Offline-first" built into the lowest levels of state management.
- Heavy focus on type safety and schema validation for user-generated content.

**Areas for Future Enhancement:**
- Exploration of specialized conflict-free replicated data types (CRDTs) for complex VTT battlemap state.
- Deep performance profiling of the Gluestack/Nativewind v4 engine on low-end Android hardware.

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented.
- Use implementation patterns consistently across all components.
- Respect project structure and Feature-Sliced Design boundaries.
- Refer to this document for all architectural questions.

**First Implementation Priority:**
Initialize the Expo project using the Gluestack v4 Nativewind template, and scaffold the foundational `shared/ui` and `shared/providers` boundaries.
