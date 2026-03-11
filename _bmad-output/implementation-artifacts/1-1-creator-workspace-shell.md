# Story 1.1: Creator Workspace Shell

Status: ready-for-dev

## Story

As a Creator,
I want a desktop-only multi-pane creator workspace with a component palette, layout canvas, and properties panel,
so that I can begin building system-agnostic character sheet templates in a structured environment.

## Acceptance Criteria

1. **Given** a creator opens the sheet creator on a desktop viewport
   **When** the creator workspace loads
   **Then** the interface displays a left sidebar for reusable components and controls, a central layout canvas, and a right sidebar for selected element properties
   **And** the pane layout persists during the session without requiring page reloads to restore visibility state.

2. **Given** a creator is using a viewport below the desktop creator threshold
   **When** they navigate to the creator workspace
   **Then** the full creator workspace is not rendered
   **And** they see a clear message that the visual creator requires the desktop experience.

3. **Given** a creator has not yet selected a game system template or uploaded custom system JSON
   **When** the workspace opens
   **Then** the shell still renders in a gated empty-state form
   **And** the canvas and properties panel clearly indicate that system binding must be chosen before element binding can occur.

4. **Given** the creator selects or focuses a canvas element
   **When** the selection state changes
   **Then** the right properties panel updates to the selected element context
   **And** no game-specific editing controls appear unless they are driven by bound schema metadata.

5. **Given** the creator collapses, expands, or resizes workspace panes
   **When** the workspace state changes
   **Then** the layout updates immediately without blocking the UI
   **And** the state is stored locally for the current creator session.

6. **Given** a creator uses only keyboard navigation
   **When** they move through the creator shell
   **Then** all primary workspace regions, pane toggles, and focusable controls are reachable in a logical order
   **And** visible focus treatment is preserved for desktop accessibility requirements.

## Tasks / Subtasks

- [ ] Task 1: Reshape the creator feature into a dedicated workspace shell (AC: 1, 2)
  - [ ] Evolve `src/features/creator/ui/CreatorToolsScreen.tsx` into the authoritative creator workspace container instead of creating a parallel screen.
  - [ ] Keep the desktop gate at the existing creator density threshold of `width >= 1024` and preserve the explicit non-desktop message.
  - [ ] Keep creator routing in `App.tsx` aligned with the existing `activeTab === 'creator'` navigation path.

- [ ] Task 2: Add a three-region desktop shell with session-local pane state (AC: 1, 3, 5)
  - [ ] Introduce left palette, center canvas, and right properties regions within the creator feature slice.
  - [ ] Add creator workspace UI state for collapse, expand, and resize behavior using local-only state management.
  - [ ] Persist pane visibility and sizing for the current creator session without routing this state through the network layer.

- [ ] Task 3: Establish system-binding empty states and selection-driven properties behavior (AC: 3, 4)
  - [ ] Render a gated empty canvas state until a supported system template or custom JSON binding is chosen in a later story.
  - [ ] Add a selection model for canvas items so the properties region updates from current selection state.
  - [ ] Ensure the properties region remains system-agnostic and does not introduce game-specific editors in this story.

- [ ] Task 4: Reuse existing creator assets without absorbing later-story scope (AC: 1, 4)
  - [ ] Reuse current creator assets such as `ComponentListView` and `ComponentEditor` only where they help scaffold the shell.
  - [ ] Do not rebuild component-definition CRUD, schema binding, or drag-and-drop placement in this story.
  - [ ] Keep TinyBase-backed component-definition logic intact and avoid creating a second creator state source.

- [ ] Task 5: Add desktop accessibility and regression coverage (AC: 2, 5, 6)
  - [ ] Add or update co-located tests for desktop rendering, non-desktop gating, pane-state persistence, and selection-to-properties updates.
  - [ ] Verify keyboard-reachable controls, logical focus order, and visible focus treatment for primary workspace controls.
  - [ ] Preserve existing creator feature tests and shared navigation/provider test expectations.

## Dev Notes

### Story Foundation

- Epic 1 establishes the system-agnostic creator foundation for the platform. This story is the shell that later stories will fill with binding, layout, and reusable component behavior.
- The current codebase already contains a creator slice and a desktop-gated creator screen. This story should **extend that slice** instead of creating a new route tree or duplicate workspace feature.
- The current `CreatorToolsScreen` is functionally closer to a two-pane component-definition editor. Story 1.1 should turn it into a durable three-region workspace shell that later epic stories can build on.
- The revised product direction makes Epic 1 a **desktop-web-first creator foundation**, not the implementation foundation for tactical scenes, shared displays, LAN play, or VR clients.
- The "canvas" in Story 1.1 is a **sheet-authoring layout canvas** for creator tooling. It is **not** the tactical battle scene canvas, shared-display renderer, or a precursor to the 3D tactical scene stack.
- Story 1.1 should help the creator workflow eventually emit content that can be consumed by broader platform contracts, but Story 1.1 itself must **not** define or implement `game_core`, `scene_core`, tactical rendering, shared-display presentation, or VR-specific abstractions.

### Architecture Direction Clarifications

- The platform now has multiple first-class surfaces: mobile native play, mobile web play, desktop web play, desktop-web-first creator tooling, shared display clients, and future native VR clients.
- Story 1.1 belongs strictly to the **creator tooling surface**. It is allowed to lean into desktop-oriented interaction patterns and density requirements because it does not need to mirror the mobile play experience.
- Creator stories should produce system-agnostic definitions, layout metadata, and binding-friendly authoring behavior that later play/runtime surfaces can consume. They should **not** attempt to solve play-surface rendering or runtime scene orchestration.
- Avoid introducing "shared canvas" or "shared scene editor" abstractions intended to serve both creator authoring and tactical encounter rendering. That coupling would conflict with the architecture decision to keep creator layout tooling separate from the tactical renderer and shared display stack.
- Keep the implementation focused on creator workspace ergonomics, schema-oriented authoring, and reusable template composition. Runtime battle scene behavior belongs to the later tactical and immersive epics.

### Developer Context

- The app currently routes creator access from `App.tsx` using tab state and renders `CreatorToolsScreen` for the `creator` tab.
- The current creator screen already uses `useWindowDimensions()` with an explicit large-screen gate at `1024px`, plus `AppSidebar` for creator navigation shell behavior.
- The updated architecture now treats the creator as a **desktop-web-first authoring surface** that coexists with, but is separate from, the tactical runtime surfaces.
- Existing creator UI assets:
  - `src/features/creator/ui/CreatorToolsScreen.tsx`
  - `src/features/creator/ui/ComponentListView.tsx`
  - `src/features/creator/ui/ComponentEditor.tsx`
- Existing cross-cutting foundations to preserve:
  - `src/shared/providers/auth-provider.tsx`
  - `src/shared/providers/sync-provider.tsx`
  - `src/shared/theme/theme-provider.tsx`
  - `src/shared/ui/navigation/app-sidebar.tsx`
  - `src/shared/ui/navigation/bottom-tab-bar.tsx`
  - `src/shared/ui/atoms/base-card.tsx`

### Technical Requirements

- Use the existing Expo + React Native + NativeWind stack already present in `package.json`.
- Keep the creator shell offline-first and non-blocking. Pane toggles, selection changes, and canvas-shell interactions must update synchronously in local state.
- Treat workspace chrome state as ephemeral UI state. Use `zustand` for creator workspace session state if shared state is needed across subcomponents; do not push pane-layout state into TinyBase unless the state becomes creator content rather than shell UI.
- Keep the shell system-agnostic. Do not hardcode game-specific labels, fields, or editor flows.
- The center canvas in this story is a shell and selection surface, not the full drag-and-drop placement system from later stories.
- The right properties panel must be driven by selection state and empty-state guidance, not by hardcoded game-specific forms.
- Do not introduce new package dependencies. Required libraries already exist.
- Do not use this story to introduce tactical scene rendering primitives, Three.js renderer state, shared-display state, or VR-specific presentation logic.
- If shared contracts are referenced conceptually, they should be treated as downstream consumers of creator output. Story 1.1 should not try to author or own the runtime scene model.
- Desktop-web-first interaction quality matters more than mobile parity for this story. Richer desktop layout affordances are acceptable as long as they stay inside the creator surface and preserve keyboard accessibility.

### Architecture Compliance

- **Feature-Sliced Design**: Keep creator-specific code under `src/features/creator/`. Extend `ui/`, `model/`, and `lib/` inside the feature slice instead of moving creator concerns into `src/shared/`.
- **Shared layer boundaries**: `src/shared/` remains for reusable infrastructure and generic presentation only.
- **Offline-first rule**: Do not block the UI while saving or preparing creator workspace state. Workspace updates must feel instantaneous.
- **Creator/runtime boundary**: Do not collapse creator layout concerns into tactical runtime concerns. The creator shell edits template-layout intent; tactical epics later render encounter scenes from separate runtime contracts.
- **No renderer leakage**: Do not introduce abstractions that assume the creator canvas and tactical scene renderer should share the same state shape, view components, or rendering engine.
- **Naming**:
  - Files: `kebab-case` for new filenames.
  - Components: `PascalCase`.
  - Variables/hooks/functions: `camelCase`.
  - Data boundary schemas: `snake_case` if this story touches Zod or TinyBase-backed creator content.
- **No duplicate stores**: The active TinyBase store is already provided by `SyncProvider`. Do not create a second TinyBase instance for creator features.

### Library / Framework Requirements

- `expo` `^55.0.5`
- `react-native` `0.83.2`
- `react` `19.2.0`
- `react-native-web` `^0.21.0`
- `nativewind` `^4.2.2`
- `zustand` `^5.0.11`
- `tinybase` `^8.0.0`
- `zod` `^4.3.6`
- `lucide-react-native` `^0.577.0`

Implementation guardrails:

- Expo’s current documentation notes Expo SDK packages support the React Native New Architecture path, so avoid adding libraries or patterns that assume legacy-only behavior.
- Use `useWindowDimensions()` for responsive gating and layout adaptation because React Native documents it as the live source for current window width and height.
- For accessibility, use stable `View` accessibility props such as `accessible`, `accessibilityRole`, `accessibilityState`, `nativeID`, and logical render order. Do **not** rely on `experimental_accessibilityOrder` in production because React Native documents it as experimental.

### File Structure Requirements

Authoritative files to modify first:

- `DungeonsWithFriends/App.tsx`
- `DungeonsWithFriends/src/features/creator/ui/CreatorToolsScreen.tsx`
- `DungeonsWithFriends/src/features/creator/ui/CreatorToolsScreen.test.tsx`

Likely feature additions inside the existing creator slice:

- `DungeonsWithFriends/src/features/creator/ui/creator-workspace-shell.tsx`
- `DungeonsWithFriends/src/features/creator/ui/creator-workspace-pane.tsx`
- `DungeonsWithFriends/src/features/creator/ui/creator-workspace-empty-state.tsx`
- `DungeonsWithFriends/src/features/creator/model/use-creator-workspace-state.ts`
- `DungeonsWithFriends/src/features/creator/model/use-creator-workspace-state.test.ts`

Reusable code that may be consumed but should not be relocated:

- `DungeonsWithFriends/src/features/creator/ui/ComponentListView.tsx`
- `DungeonsWithFriends/src/features/creator/ui/ComponentEditor.tsx`
- `DungeonsWithFriends/src/shared/ui/navigation/app-sidebar.tsx`
- `DungeonsWithFriends/src/shared/providers/sync-provider.tsx`
- `DungeonsWithFriends/src/shared/providers/auth-provider.tsx`

### Testing Requirements

- Keep tests co-located with the source files they validate.
- Update creator screen tests to cover:
  - desktop shell render at `>= 1024px`
  - non-desktop gating message below `1024px`
  - three-pane region presence
  - selection state updating the properties region
  - pane collapse/expand behavior
  - session-local persistence behavior for workspace chrome
  - keyboard/focus affordances for primary controls
- Preserve existing creator feature tests for component-definition behavior unless the shell refactor intentionally changes their surface area.
- Preserve provider and navigation regressions in shared test suites.
- Use the project’s orchestrated testing workflow rather than direct Jest or Playwright commands.

### Scope Boundaries

This story is complete when the creator shell exists and is stable for later stories. It is **not** the story for:

- full system-template selection and custom JSON binding flows
- general-purpose component registry redesign
- drag-and-drop placement and snapping
- runtime gameplay editing
- cloud synchronization behavior
- `game_core` or `scene_core` implementation
- battlemap or tactical-scene rendering
- shared-display presentation behavior
- LAN session handling
- VR-specific interaction or display behavior

### Reuse and Regression Guardrails

- `CreatorToolsScreen` already has a desktop-required message and screen-width gating. Keep that behavior aligned with Story 1.3’s existing creator density assumptions unless the whole creator experience is intentionally re-baselined across stories.
- The current creator feature already includes TinyBase-backed component-definition CRUD. Do not reimplement those stores or schemas for Story 1.1.
- If you extract shell subcomponents, keep `CreatorToolsScreen` as the screen-level orchestrator so `App.tsx` changes stay small and routing remains stable.
- Prefer placeholder canvas and placeholder properties content over prematurely implementing binding logic from Stories 1.2 and 1.3.
- Prefer creator-specific names such as workspace, template layout, element selection, and properties panel over names that imply tactical runtime concepts such as battle scene, public display, encounter view, or simulation board.
- If future runtime contracts are mentioned in code or tests, keep them behind placeholders or typed seams only. Do not make Story 1.1 depend on a runtime battle-scene implementation existing first.

### Latest Technical Information

Verified on 2026-03-10 against official Expo and React Native documentation:

- Expo documents that Expo SDK packages support the React Native New Architecture path and recommends checking third-party compatibility when building on current SDKs.
- React Native documents `useWindowDimensions()` as the live source of `width` and `height` for the window the app occupies, which makes it the correct primitive for the creator desktop gate.
- React Native documents `accessible` as making a view discoverable to assistive technologies and hardware keyboards.
- React Native documents `accessibilityRole` as the correct way to communicate the purpose of controls such as buttons, headers, tabs, toolbars, and grids.
- React Native marks `experimental_accessibilityOrder` as experimental and warns against production use.

Planning alignment verified against the current platform direction:

- Epic 1 remains the creator foundation, but the broader product now separates creator tooling from tactical runtime, shared display, and future immersive surfaces.
- The tactical rendering stack is intentionally handled by later tactical and immersive epics, not by Story 1.1.
- Full offline support across play surfaces does not expand Story 1.1 scope beyond local creator workspace behavior.

### Project Context Reference

- No `project-context.md` file was found in the repository search paths configured by the workflow.
- The authoritative planning context for this story comes from `epics.md`, `architecture.md`, the archived implementation artifacts, and the current codebase.

### References

- `_bmad-output/planning-artifacts/epics.md` - Epic 1, Story 1.1, Story 1.2, Story 1.3
- `_bmad-output/planning-artifacts/architecture.md` - Starter Template Evaluation; Core Architectural Decisions; Frontend Architecture; Implementation Patterns & Consistency Rules
- `DungeonsWithFriends/package.json` - current dependency versions
- `DungeonsWithFriends/App.tsx` - current app entry and creator route handling
- `DungeonsWithFriends/src/features/creator/ui/CreatorToolsScreen.tsx` - current creator shell and desktop gate
- `DungeonsWithFriends/src/features/creator/ui/CreatorToolsScreen.test.tsx` - current desktop/mobile creator tests
- `DungeonsWithFriends/src/features/creator/ui/ComponentListView.tsx` - reusable creator palette candidate
- `DungeonsWithFriends/src/features/creator/ui/ComponentEditor.tsx` - reusable creator properties candidate
- `DungeonsWithFriends/src/shared/ui/navigation/app-sidebar.tsx` - creator shell navigation wrapper
- `_bmad-output/implementation-artifacts/archive/1-1-project-initialization-core-framework-scaffolding.md` - initial framework and provider guardrails
- `_bmad-output/implementation-artifacts/archive/1-3-custom-component-definition-for-creators-desktop.md` - existing creator feature reuse and prior creator-specific guardrails

## Dev Agent Record

### Agent Model Used

Cascade

### Debug Log References

- Create-story analysis: located the active creator entry in `App.tsx` and confirmed `CreatorToolsScreen` is the current creator route target.
- Create-story analysis: confirmed existing creator implementation already enforces a `1024px` desktop gate and includes tests for that gate.
- Create-story analysis: confirmed the repository already contains creator component-definition building blocks that should be reused, not recreated.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Story prepared for implementation against the current creator feature slice and current Expo/React Native stack.

### File List

- `_bmad-output/implementation-artifacts/1-1-creator-workspace-shell.md`
