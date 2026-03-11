---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
inputDocuments: ["prd.md", "architecture.md", "ux-design-specification.md", "1-3-custom-component-definition-for-creators-desktop.md"]
---

# DungeonsWithFriends - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for DungeonsWithFriends, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Users can access the core visual character sheet builder entirely offline without creating an account.
FR2: Users can create and authenticate accounts using standard SSO or email credentials.
FR3: Authenticated users can search for, add, and manage a "Friends List" of other players on the platform.
FR4: Users with a premium cloud subscription can continuously synchronize their character data and campaign state across all authenticated devices.
FR5: Users can configure a Player Profile displaying their gaming preferences and active campaigns, with toggles for public/private visibility.
FR6: Users can manage an account-wide blocklist that prevents matchmaking or direct interaction with specified users.
FR7: The system can restrict account creation to users acknowledging they are 17+ years of age.
FR8: Users can manually trigger a one-time export of their local character data at any time.
FR9: Users can execute standard account management actions including password resets and complete account deletion (Right to be Forgotten).
FR10: Users can view, search, and sort a library of their saved characters.
FR11: Users can instantly generate a mathematically optimal character by selecting only a Class and Level, leveraging RL-trained AI data models.
FR12: The system can guide users through an interactive, step-by-step modification wizard to customize their character.
FR13: Users can partition distinct data sections within their character sheet into "Public", "Private", and "GM-Only" visibility states.
FR14: Users can interact with their generated character sheet to execute mechanical game actions.
FR15: Users can manually override system-calculated values.
FR16: Users can create and play these interactive character sheets entirely offline.
FR17: Platform Admins or authorized creators can define new component definitions and underlying structured data representations to support non-standard game systems.
FR18: Creators can export their custom character sheet JSON configurations to local device storage, and import valid JSON layouts.
FR19: GMs can create, name, and manage distinct instances of RPG campaigns.
FR20: GMs can select the game system, specific adventure path, and active rulesets via a hierarchical menu during campaign creation.
FR21: Users can join an active campaign via an invite link and seamlessly select an existing character or create a new one to bind to that campaign.
FR22: GMs can create and publish a static set of "House Rules" visible to all players within the campaign dashboard.
FR23: Users can view the names, avatars, and public character sheet data of all other active players within their joined campaign.
FR24: Users can communicate via distinct text channels and organize extended RP conversations via nested threads.
FR25: GMs can upload, manage, and assign a library of 2D battlemaps, static imagery, and compatible scene assets to specific encounters.
FR26: GMs can upload or select audio tracks and trigger streaming battle music/ambience for all connected players.
FR27: GMs can toggle specific campaign mechanics between "Theater of the Mind" and "Tactical".
FR27b: GMs can apply distinct visual themes to a campaign instance, changing the global UI styling for all participating players.
FR28: Users can submit mechanical actions while entirely offline.
FR29: The system can automatically sync and chronologically resolve offline actions into the authoritative server timeline upon reconnection.
FR30: Users can receive contextual mobile push notifications framed narratively when an action dictates their mandatory input.
FR31: Users can execute an "Initiative Roll" to inject their character into a formal turn order when the GM starts tactical combat mode.
FR32: Players can view the active tactical scene in 2D or another compatible supported projection, including the real-time or async coordinates of their character token and visible adversaries.
FR33: Players can send dice roll results from third-party VTT trackers directly to the Dungeons with Friends campaign log via webhook ingest or native extension.
FR34: The system can parse user-inputted dice notation natively (e.g., 2d6+4) and mathematically resolve the outcome.
FR35: GMs can manually build encounters by searching a Compendium database and adding pre-configured monsters to the game state.
FR36: The system can conduct headless background simulations of GM-built encounters to predict the probability of player victory and surface balance metrics.
FR37: The system can generate a succinct, NL (Natural Language) summary of missed campaign events, presented immediately upon a user re-entering an active campaign.
FR38: GMs can configure specific game-state actions to require manual GM approval before execution.
FR39: GMs can intercept, modify, or veto any AI-generated combatant action.
FR40: GMs can input plain-text hypothetical rules, which the system can map to valid underlying engine configurations.
FR41: Auto-Rollback: The system can execute a rollback of the game state if a delayed offline action mechanically conflicts with the server state.
FR42: GMs can forcefully dismiss a player from a campaign, seamlessly assigning their character to either GM or AI control.
FR48: Party leaders or GMs can present a player-safe shared display showing the active tactical scene, shared audio, and encounter state on a room display while players continue using their own devices as inputs.
FR43: Creators can upload custom character sheet templates and rule configurations to a public marketplace.
FR44: Platform Administrators can automatically curate and publish official System Templates via API based on licensing agreements.
FR45: Users can purchase or access premium templates utilizing a platform-specific token economy.
FR46: The system can algorithmically scan all UGC marketplace uploads to flag content violating community guidelines.
FR47: Platform Administrators can view an immutable, chronological playback of all mechanical actions, chat logs, and token expenditures within a specific campaign instance.
FR49: The system can identify and restrict accounts exhibiting automated bot-like scraping behavior.
FR50: Supported groups can participate in internet-backed room sessions first, with the architecture preserving a future LAN-capable synchronization mode for local play when internet connectivity is unavailable or undesirable.
FR51: Users can view compatible 3D tactical scenes in a native VR client, including tabletop room-scale presentation and supported character-perspective zoom for compatible encounters.
FR52: Single-player users can continue supported campaigns fully offline with on-device AI assistance for narrative responses, character guidance, and supported decision support.

### NonFunctional Requirements

NFR1: Rendering of supported tactical scenes in 2D or compatible 3D projections must maintain a minimum of 30fps on hardware representing the top 50th percentile of active mobile devices, with graceful degradation across the broader supported 80th percentile.
NFR2: Offline-to-Online state synchronization (merging the local TinyBase ledger with the server ledger) must complete background resolution in under 3 seconds upon network reconnection without blocking the user interface.
NFR3: The native dice math-parser component must calculate and display results in under 200ms.
NFR4: The architecture must structurally enforce hard processing caps on LLM API token utilization per user/campaign to prevent asymmetrical financial abuse.
NFR5: All user generated content (UGC) uploaded to the community marketplace must pass through the automated two-tiered moderation filter before attaining public visibility statuses to comply with App Store review guidelines.
NFR6: The authoritative Server Event Ledger must support concurrent write actions from multiple players within the same campaign instance without queuing deadlocks or data corruption.
NFR7: The core mobile VTT application must be fully navigable and semantically parsable by native iOS (VoiceOver) and Android (TalkBack) screen readers.
NFR8: The Desktop Web application experience must support 100% keyboard-only navigation for all core gameplay actions to satisfy WCAG 2.1 AA compliance standards.
NFR9: The system must expose stable, authenticated incoming webhook endpoints capable of accepting and parsing standard JSON payloads from major 3rd-party VTT tracker tools.
NFR10: Previously loaded characters, rules, tactical scenes, and required assets must remain usable offline on supported native and web clients without forcing a blocking sync before a player can review the current state and queue a supported turn decision.

### Additional Requirements

- **Starter Template:** Utilize Gluestack-UI NativeWind v4 Template. This explicitly affects Epic 1 Story 1.
- **Data Architecture:** Zod Schema Validation (Zod v3.x) matching snake_case naming conventions for database compatibility.
- **Authentication:** Formally decoupled Nhost Auth (Nhost JS SDK v4.5+) abstract `AuthProvider` interface context.
- **API Communication & State Syncing:** GraphQL Subscriptions via SyncFacade interacting synchronously with local TinyBase store.
- **Frontend Architecture:** Feature-Sliced Design (FSD) with a Global "Shared" UI Layer.
- **Simulation and Scene Core:** Separate deterministic `game_core` rules processing from renderer-agnostic `scene_core` presentation contracts so tactical scenes, shared displays, and future VR can reuse the same encounter state.
- **Infrastructure:** Deploy desktop creator, desktop web play, and shared-display surfaces via Vercel (Web), mobile apps natively with Expo Application Services (Native), and preserve a future native VR delivery path.
- **Core Platform UI:** The "Action-Card" interface to bubble up the 3 most relevant actions based on game state.
- **Layout Approach:** "Floating HUD" over map background on mobile, contextual action drawer on the bottom ("Thumb Zone"), with full WYSIWYG sheet builder purely disabled on mobile UI.
- **Sync Protocol:** The "Rewind & Redirect" Sync Protocol.
- **Creator Design System:** Use a hybrid desktop-web creator approach (Tailwind CSS + shadcn/ui + DnD Kit or equivalent targeted desktop tooling) without forcing those desktop-only assumptions into mobile play surfaces.
- **General-Purpose Creator Model:** Sheet elements must be reusable, system-agnostic UI primitives bound to underlying structured game data rather than hard-coded game-specific controls.
- **System Binding Strategy:** When defining a sheet, the creator must choose a supported game system template or upload custom system JSON so layout elements can bind to that schema and generate placeholder game-specific JSON where required.
- **Offline Everywhere:** Previously loaded characters, tactical scenes, rules, and required assets must remain available on native and web clients for offline review and deferred turn submission.

### FR Coverage Map

FR1: Epic 1 - Access the offline visual sheet creator
FR2: Epic 3 - Account creation and authentication
FR3: Epic 3 - Friends list management
FR4: Epic 8 - Premium cloud sync
FR5: Epic 3 - Player profile configuration
FR6: Epic 3 - Account-wide blocking
FR7: Epic 3 - 17+ age gating
FR8: Epic 2 - Manual export of local character data
FR9: Epic 3 - Password reset and account deletion
FR10: Epic 2 - View/search/sort saved characters
FR11: Epic 2 - Generate optimal characters
FR12: Epic 2 - Guided character customization
FR13: Epic 2 - Public/private/GM-only sheet visibility
FR14: Epic 2 - Execute mechanical actions from sheets
FR15: Epic 2 - Manual override of calculated values
FR16: Epic 2 - Play interactive sheets offline
FR17: Epic 1 - Define custom reusable creator components
FR18: Epic 1 - Import/export JSON layouts and schema bindings
FR19: Epic 4 - Create campaigns
FR20: Epic 4 - Select game systems and rulesets
FR21: Epic 4 - Join campaign and bind character
FR22: Epic 4 - Publish house rules
FR23: Epic 4 - View player roster and public sheet data
FR24: Epic 4 - Channel chat and nested threads
FR25: Epic 5 - Upload and manage battlemaps
FR26: Epic 4 - Campaign audio
FR27: Epic 5 - Theater-of-the-mind vs tactical toggle
FR27b: Epic 4 - Campaign theming
FR28: Epic 6 - Submit actions offline
FR29: Epic 6 - Sync and resolve offline actions
FR30: Epic 6 - Narrative push notifications
FR31: Epic 5 - Initiative roll and turn order
FR32: Epic 5 - View tactical map and positions
FR33: Epic 7 - Third-party VTT roll ingestion
FR34: Epic 2 - Native dice notation parsing
FR35: Epic 5 - Encounter compendium and encounter setup
FR36: Epic 7 - Encounter simulation
FR37: Epic 7 - Narrative catch-up summaries
FR38: Epic 7 - GM approval gates
FR39: Epic 7 - AI action interception
FR40: Epic 7 - Natural-language rules mapping
FR41: Epic 6 - Rollback/conflict handling
FR42: Epic 4 - Dismiss player and transfer control
FR48: Epic 9 - Shared display and room presentation
FR43: Epic 8 - Publish creator templates
FR44: Epic 8 - Official template publishing
FR45: Epic 8 - Template purchases/access
FR46: Epic 8 - UGC moderation
FR47: Epic 8 - Immutable playback/admin review
FR49: Epic 8 - Bot restriction and abuse control
FR50: Epic 9 - Internet-backed room sessions with future LAN compatibility
FR51: Epic 9 - Native immersive tactical scene presentation
FR52: Epic 7 - Offline single-player AI assistance

## Epic List

### Epic 1: System-Agnostic Sheet Creator Foundation
Creators can define reusable layout primitives, bind them to a selected or uploaded game-system JSON schema, and build fully custom sheet templates for any TTRPG without requiring game-specific component types.
**FRs covered:** FR1, FR17, FR18

### Epic 2: Offline Playable Character Sheets
Players can create, load, search, customize, and use interactive character sheets offline, including overrides, visibility settings, and dice-driven sheet actions.
**FRs covered:** FR8, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR34

### Epic 3: Identity, Access, and Connected Profiles
Users can create accounts, manage identity, use offline-only access when needed, and maintain social/account boundaries safely.
**FRs covered:** FR2, FR3, FR5, FR6, FR7, FR9

### Epic 4: Campaign Hub and Shared Play Spaces
GMs and players can create campaigns, join them, bind characters, communicate, publish house rules, and apply shared campaign presentation.
**FRs covered:** FR19, FR20, FR21, FR22, FR23, FR24, FR26, FR27b, FR42

### Epic 5: Tactical Scenes and Encounter Play
GMs can prepare scenes and encounters, while players can view maps, tokens, and turn-order interactions in compatible tactical scene modes.
**FRs covered:** FR25, FR27, FR31, FR32, FR35

### Epic 6: Asynchronous Turn Resolution
Players can act offline, receive narrative prompts, and have actions reconciled safely when the system reconnects.
**FRs covered:** FR28, FR29, FR30, FR41

### Epic 7: Advanced Automation and External Integrations
The platform supports third-party roll ingestion, encounter simulation, GM approvals, AI interception, rules translation, and offline-capable AI assistance for supported solo experiences.
**FRs covered:** FR33, FR36, FR37, FR38, FR39, FR40, FR52

### Epic 8: Marketplace, Cloud Sync, and Platform Governance
Creators can publish and monetize templates, users can sync and acquire them, and admins can moderate and protect the ecosystem.
**FRs covered:** FR4, FR43, FR44, FR45, FR46, FR47, FR49

### Epic 9: Shared Display, Room Sessions, and Immersive Surfaces
Groups can project player-safe tactical scenes to a shared room display today while the platform preserves a path toward LAN-backed room play and future native VR tactical experiences.
**FRs covered:** FR48, FR50, FR51

<!-- Repeat for each epic in epics_list (N = 1, 2, 3...) -->

### Epic 1: System-Agnostic Sheet Creator Foundation

Creators can define reusable layout primitives, bind them to a selected or uploaded game-system JSON schema, and build fully custom sheet templates for any TTRPG without requiring game-specific component types.

**Implementation Clarifications:**
- Epic 1 is a **desktop-web-first creator track**. It is not the implementation track for tactical rendering, shared display presentation, LAN session transport, or future VR clients.
- The Epic 1 "canvas" always refers to a **sheet-authoring layout canvas**. It is not the tactical encounter scene canvas and must not be treated as an early version of the battle-map renderer.
- Epic 1 stories should produce reusable template layout metadata, schema bindings, and authoring workflows that later play surfaces can consume. They should **not** define `game_core`, `scene_core`, encounter simulation state, or tactical renderer behavior.
- Shared contracts may eventually consume creator output, but creator stories must avoid introducing premature abstractions that try to unify creator editing with runtime scene rendering.
- Desktop-oriented interaction patterns, denser controls, and richer authoring ergonomics are acceptable within Epic 1 because this surface does not need to mirror the mobile play experience.

### Story 1.1: Creator Workspace Shell
As a Creator,
I want a desktop-only multi-pane creator workspace with a component palette, layout canvas, and properties panel,
So that I can begin building system-agnostic character sheet templates in a structured environment.

**Acceptance Criteria:**
**Given** a creator opens the sheet creator on a desktop viewport
**When** the creator workspace loads
**Then** the interface displays a left sidebar for reusable components and controls, a central layout canvas, and a right sidebar for selected element properties
**And** the pane layout persists during the session without requiring page reloads to restore visibility state.

**Given** a creator is using a viewport below the desktop creator threshold
**When** they navigate to the creator workspace
**Then** the full creator workspace is not rendered
**And** they see a clear message that the visual creator requires the desktop experience.

**Given** a creator has not yet selected a game system template or uploaded custom system JSON
**When** the workspace opens
**Then** the shell still renders in a gated empty-state form
**And** the canvas and properties panel clearly indicate that system binding must be chosen before element binding can occur.

**Given** the creator selects or focuses a canvas element
**When** the selection state changes
**Then** the right properties panel updates to the selected element context
**And** no game-specific editing controls appear unless they are driven by bound schema metadata.

**Given** the creator collapses, expands, or resizes workspace panes
**When** the workspace state changes
**Then** the layout updates immediately without blocking the UI
**And** the state is stored locally for the current creator session.

**Given** a creator uses only keyboard navigation
**When** they move through the creator shell
**Then** all primary workspace regions, pane toggles, and focusable controls are reachable in a logical order
**And** visible focus treatment is preserved for desktop accessibility requirements.

**Implementation Clarifications:**
- This story establishes only the **creator workspace shell**. It must not introduce battle-map rendering concepts, shared-display presentation logic, or runtime scene abstractions.
- The left palette, center canvas, and right properties panel are creator-authoring regions only. They should use creator-specific naming and state rather than tactical terms such as encounter, battle scene, public display, or simulation board.
- Placeholder seams are acceptable where later creator stories will fill in binding or drag-and-drop behavior, but Story 1.1 must remain independent from the later tactical scene stack.

### Story 1.2: System Template Selection and Custom JSON Binding
As a Creator,
I want to start a sheet by selecting a supported game system template or uploading custom system JSON,
So that every layout element can bind to a structured data model without requiring hard-coded game-specific components.

**Acceptance Criteria:**
**Given** a creator opens the workspace without an active system binding
**When** they choose to start a new sheet
**Then** they are prompted to either select a supported system template or upload custom system JSON
**And** they cannot bind layout elements to game data until one of those options is completed successfully.

**Given** a creator selects a supported system template
**When** the template is applied to the new sheet
**Then** the creator workspace loads the template’s structured data definitions and binding targets
**And** the system generates placeholder game-specific JSON for any required default sections needed by the selected ruleset.

**Given** a creator uploads custom system JSON
**When** the import is processed
**Then** the uploaded data is validated against the creator binding contract
**And** invalid files are rejected with specific validation errors that identify the failing field or structure.

**Given** a creator successfully binds a sheet to a supported system or custom JSON definition
**When** they open the properties panel for a compatible layout element
**Then** the available binding options are sourced from the active structured data model
**And** those bindings remain system-agnostic at the component level.

**Given** a creator changes the active system binding before meaningful layout work has been committed
**When** they confirm the change
**Then** the workspace updates to the new binding model
**And** any generated placeholder JSON is rebuilt to match the newly selected system context.

**Given** a creator attempts to switch the active system binding after layout elements have already been bound
**When** the system detects the change would invalidate existing bindings
**Then** the creator is warned before the change is applied
**And** the UI identifies which existing bindings will need remapping.

**Given** a creator is working offline
**When** they choose a built-in system template or upload a local custom JSON file
**Then** the system binding flow completes without requiring a network request
**And** the selected binding context is saved locally with the sheet draft.

**Implementation Clarifications:**
- System bindings created here are for **sheet-template authoring** and downstream play-surface consumption. They are not the same as tactical encounter scene definitions.
- Validation and generated defaults should stay schema-oriented and system-agnostic. This story should not define battle scene compatibility, 3D asset metadata, or runtime visibility rules.

### Story 1.3: General-Purpose Component Registry and Binding Contract
As a Creator,
I want a registry of reusable, system-agnostic sheet components with a consistent data-binding contract,
So that I can build layouts once and bind them to different game systems without creating separate HP, attribute, or skill component types.

**Acceptance Criteria:**
**Given** a creator opens the component palette after a system binding has been established
**When** the available creator components are displayed
**Then** the palette shows only general-purpose component families such as text, value display, input field, selector, checkbox, button, separator, container, list, and table
**And** no component is hard-coded as a game-specific control such as “D&D HP,” “Pathfinder Save,” or “Skill Block.”

**Given** a creator selects a general-purpose component from the registry
**When** they place it on the canvas
**Then** the component is created from a shared registry definition that includes its supported layout options, supported binding modes, editable properties, and default presentation settings
**And** the created instance remains compatible with multiple game systems through its binding metadata.

**Given** a creator opens the properties panel for a component instance
**When** they configure data binding
**Then** the binding options follow a consistent contract for selecting a source path, display mode, interaction mode, and optional fallback/default behavior
**And** the contract supports binding to either built-in system templates or uploaded custom JSON structures.

**Given** a creator binds different component instances to different parts of the active system model
**When** those bindings are saved
**Then** each component stores only generic binding metadata plus layout and presentation settings
**And** the game-specific meaning is derived from the selected schema path rather than the component type itself.

**Given** a creator adds a component that requires structured defaults to function correctly
**When** the component is first bound
**Then** the system can generate placeholder game-specific JSON for any missing compatible data structures required by that binding
**And** the generated defaults remain editable through the creator workflow.

**Given** a creator attempts to bind a component to incompatible or unsupported schema data
**When** the binding is validated
**Then** the system blocks the invalid configuration
**And** the creator sees a clear explanation of why the selected component and target data shape do not match.

**Given** a creator duplicates or reuses a configured component in another template using the same binding contract
**When** the component is inserted into the new layout
**Then** its reusable layout and presentation configuration is preserved
**And** its binding can either be remapped to the new system context or reattached to a compatible existing schema path.

**Implementation Clarifications:**
- The registry defined here is a **creator/template component registry**, not the tactical scene entity registry used later by encounter rendering.
- Component metadata should stay centered on sheet layout, display, and interaction contracts rather than tactical map semantics such as token movement, lighting, or fog-of-war behavior.

### Story 1.4: Grid Canvas, Drag-and-Drop Placement, Snapping, and Alignment
As a Creator,
I want to drag reusable components onto a structured layout canvas with snapping and alignment assistance,
So that I can place sheet elements quickly and produce clean, readable layouts without manual pixel-perfect editing.

**Acceptance Criteria:**
**Given** a creator has an active workspace and system binding
**When** they drag a component from the left palette onto the layout canvas
**Then** the component is placed onto the sheet work area as a selectable layout item
**And** the placement happens without requiring manual JSON editing.

**Given** a creator moves an existing component around the canvas
**When** the dragged element approaches valid grid positions or alignment edges
**Then** the element snaps into place using the active layout rules
**And** the canvas provides visible feedback showing the snap target or alignment guide.

**Given** a creator positions multiple components near one another
**When** their edges, centers, or shared spacing patterns align
**Then** the canvas surfaces visual alignment guides
**And** the creator can place the components in a way that maintains consistent spacing and structure.

**Given** a creator drags a component into an occupied or constrained region of the canvas
**When** the placement would violate the current layout rules
**Then** the system prevents invalid placement or resolves it predictably according to the grid model
**And** the creator receives immediate visual feedback about why the position is not valid.

**Given** a creator repositions a component already on the canvas
**When** the drag interaction completes
**Then** the updated layout coordinates and placement metadata are saved to the local sheet draft
**And** the component remains bound to its existing generic data contract.

**Given** a creator uses keyboard-based movement or fine adjustment controls on a selected component
**When** they nudge or reposition the item through supported non-pointer controls
**Then** the component moves according to the same grid and snapping rules
**And** the layout remains accessible for desktop keyboard workflows.

**Given** a creator has multiple components on the canvas
**When** they select one or more items for layout adjustment
**Then** the canvas maintains clear selection state and visible placement boundaries
**And** the interaction model does not require later stories to understand where elements currently live on the page.

**Implementation Clarifications:**
- Drag-and-drop here is for **sheet layout composition**, not for tactical token movement or runtime scene manipulation.
- Grid, snapping, and alignment logic should optimize authoring quality for templates and must not assume reuse as the battle-map movement or positioning system.

### Story 1.5: Responsive Viewports, Zoom, and Custom Display Dimensions
As a Creator,
I want to preview and edit my sheet in mobile, tablet, desktop, and custom-size viewport modes with zoom controls,
So that I can design layouts that remain usable and readable across the actual screen sizes players will use.

**Acceptance Criteria:**
**Given** a creator is working in the visual sheet builder
**When** they open viewport controls
**Then** they can switch between predefined mobile, tablet, and desktop preview modes
**And** the canvas updates to reflect the selected display profile without losing placed components.

**Given** a creator wants to test a specific device or table size
**When** they enter custom pixel width and height values
**Then** the canvas renders using those explicit dimensions
**And** the current sheet layout is previewed within that custom display boundary.

**Given** a creator changes viewport modes between mobile, tablet, desktop, or custom
**When** the canvas re-renders in the selected mode
**Then** previously placed elements preserve their binding and layout intent
**And** the system shows the resulting layout behavior for that viewport context rather than silently falling back to a desktop-only arrangement.

**Given** a creator is inspecting a dense or large layout
**When** they use zoom-in, zoom-out, or reset zoom controls
**Then** the work area scale changes without mutating the underlying sheet dimensions
**And** the creator can continue selecting, moving, and editing components at the adjusted zoom level.

**Given** a creator has placed components that no longer fit horizontally in a smaller viewport
**When** the selected viewport causes those layout constraints to be evaluated
**Then** the canvas reflects the configured responsive wrapping or stacking behavior for compatible layout structures
**And** the creator can see when items remain side by side versus when they flow to the next line or section.

**Given** a creator is comparing layout behavior across viewport modes
**When** they switch repeatedly between display profiles
**Then** the current viewport selection, zoom level, and custom dimension settings remain understandable and visible in the workspace
**And** the creator is not forced to reconfigure the preview state after every mode change.

**Given** a creator is using keyboard-accessible creator controls
**When** they navigate viewport and zoom options without a pointer
**Then** all viewport toggles, custom dimension inputs, and zoom commands are reachable and operable
**And** the preview system remains usable under desktop accessibility expectations.

**Implementation Clarifications:**
- Viewport and zoom controls in this story preview how **sheet templates** behave across player devices. They do not define tactical scene cameras, immersive presentation modes, or shared-display framing.
- Custom display dimensions should help creators reason about play-surface consumption later without requiring this story to implement those play surfaces directly.

### Story 1.6: Card and Group Container Composition
As a Creator,
I want to create reusable card and group containers that can hold nested sheet elements and decorative frame assets,
So that I can compose visually coherent sections like saving throws, inventory blocks, spell panels, or rules summaries without hand-building every structure from scratch.

**Acceptance Criteria:**
**Given** a creator adds a card or group container to the canvas
**When** the container is placed in the layout
**Then** it behaves as a reusable parent element that can hold nested child components
**And** the container participates in the same grid, selection, and binding model as other creator elements.

**Given** a creator drags supported child components into a card or group container
**When** the drop interaction completes
**Then** the child elements become part of that container’s internal layout structure
**And** the creator can reposition or reorder them within the container without breaking their bindings.

**Given** a creator wants to build a themed section such as a saving throws panel or inventory card
**When** they configure the card or group container
**Then** they can define shared presentation settings such as padding, spacing, background styling, title treatment, and internal layout behavior
**And** those shared settings cascade to the container’s visible presentation without forcing game-specific logic into the container type.

**Given** a creator wants decorative framing around a grouped section
**When** they configure border and frame assets for the container
**Then** they can assign a full border image or separate corner and edge assets
**And** the container renders those decorative assets in a way that scales with the contained content instead of requiring a fixed-size layout.

**Given** a creator resizes a card or changes the amount of nested content within it
**When** the container layout recalculates
**Then** the grouped section expands or contracts according to its configured layout behavior
**And** decorative framing and internal spacing remain visually coherent.

**Given** a creator selects a card or group container on the canvas
**When** they open its configuration controls
**Then** they can manage both container-level settings and the structure of the nested child elements
**And** the system clearly distinguishes between editing the parent container and editing an individual nested component.

**Given** a creator uses a group container to collect related mechanics or reference content
**When** the grouped section is saved in the sheet draft
**Then** the container preserves its nested composition, shared visual settings, and child element relationships
**And** the grouped structure can be reused later in other templates as a composable layout pattern.

**Implementation Clarifications:**
- Card and group containers are template-layout containers, not tactical scene nodes or immersive-world containers.
- Decorative assets and nested composition should remain focused on sheet presentation rather than 3D scene composition, shared-display overlays, or encounter-space geometry.

### Story 1.7: Text Labels, Typography Presets, and Separators
As a Creator,
I want reusable text, heading, label, and separator primitives with shared typography presets and local overrides,
So that I can build readable sheets quickly without manually styling every text element for each game system.

**Acceptance Criteria:**
**Given** a creator opens the component palette
**When** they browse available presentation primitives
**Then** they can add text labels, heading variants, free text blocks, and separator elements to the sheet
**And** these primitives remain system-agnostic unless the creator explicitly binds them to structured data.

**Given** a creator adds a heading or label element to the canvas
**When** they open its configuration in the properties panel
**Then** they can choose from predefined typography roles such as heading levels, body text, caption text, or label styles
**And** the selected role applies shared default font, size, spacing, and emphasis settings.

**Given** a creator wants consistent sheet-wide text styling
**When** they configure the sheet’s typography defaults
**Then** label, heading, and text primitives inherit those global defaults automatically
**And** creators are not forced to manually restyle every individual text element to achieve a coherent presentation.

**Given** a creator needs a specific text element to differ from the shared sheet defaults
**When** they apply local typography overrides
**Then** they can adjust properties such as font choice, size, weight, alignment, spacing, or color for that specific element
**And** the override affects only the selected element rather than mutating the global typography preset.

**Given** a creator wants a text primitive to display bound game data rather than static copy
**When** they bind the text element to a valid schema path
**Then** the text primitive can render structured values or text derived from the active system model
**And** the text component remains a general-purpose display primitive instead of becoming a game-specific widget.

**Given** a creator adds a separator element between sheet sections
**When** they configure its presentation
**Then** they can control spacing, orientation, thickness, style treatment, and decorative appearance
**And** the separator improves visual grouping without introducing hidden layout behavior outside the current canvas rules.

**Given** a creator switches between viewport modes or uses zoomed canvas preview
**When** text and separator elements are re-rendered in the workspace
**Then** the typography hierarchy and spacing relationships remain understandable
**And** the creator can still assess readability and section separation across responsive contexts.

### Story 1.8: Value-Pair, Selector, Checkbox, and Interactive Field Primitives
As a Creator,
I want reusable value-pair and interactive field primitives that can be arranged in multiple patterns and bound to structured game data,
So that I can model things like saving throws, proficiencies, toggles, counters, and action controls without creating game-specific field components.

**Acceptance Criteria:**
**Given** a creator opens the component palette after establishing a system binding
**When** they browse available field primitives
**Then** they can add reusable value-pair, selector, checkbox, and action-field components to the sheet
**And** those primitives remain general-purpose rather than being pre-labeled for a specific game system.

**Given** a creator adds a value-pair style primitive to the canvas
**When** they configure its layout pattern
**Then** they can choose among supported arrangements such as label above value, label beside value, value before label, label plus selector plus value, or label above value above secondary label
**And** the primitive preserves its binding contract regardless of the chosen visual arrangement.

**Given** a creator binds a field primitive to structured game data
**When** the properties panel validates the binding
**Then** the field can display or edit compatible values from the active schema
**And** unsupported combinations are blocked with clear validation feedback.

**Given** a creator configures a selector or checkbox-style primitive
**When** they define its behavior
**Then** the field can represent binary, multi-state, or enumerated interactions supported by the active schema
**And** the control remains reusable for cases like proficiency flags, inspiration tracking, or other system-defined toggles.

**Given** a creator adds an action-oriented field such as a button or interactive control
**When** they configure its generic behavior
**Then** they can associate it with a structured action target, input value, or state transition defined by the active schema
**And** the primitive remains generic enough to support use cases such as healing, damage, reset actions, or mode switching without becoming a hard-coded system button.

**Given** a creator needs multiple related field primitives in the same section
**When** they place and configure them inside a shared layout or container
**Then** the controls can be aligned and styled consistently with shared defaults
**And** each field still preserves its own binding, arrangement, and interaction settings.

**Given** a creator previews or saves the sheet draft
**When** the configured field primitives are rendered in the current viewport context
**Then** their labels, values, states, and interaction affordances remain legible and structurally consistent
**And** the creator can verify that the same primitive can serve multiple game-system use cases through different bindings.

### Story 1.9: Repeating Lists and Configurable Data Tables
As a Creator,
I want reusable repeating-list and configurable-table primitives that can bind to structured collections in the active game schema,
So that I can represent skills, proficiencies, inventory, actions, spells, resistances, and other grouped records without creating separate table components for each game.

**Acceptance Criteria:**
**Given** a creator opens the component palette after establishing a system binding
**When** they browse collection-oriented primitives
**Then** they can add a repeating list or configurable data table to the sheet
**And** the primitive is defined generically rather than as a hard-coded “skills table,” “inventory list,” or “spellbook table.”

**Given** a creator adds a repeating list to the canvas
**When** they bind it to a structured collection in the active schema
**Then** the list renders from that collection definition
**And** each repeated row or entry follows a configurable item layout instead of requiring a game-specific list implementation.

**Given** a creator adds a configurable data table to the canvas
**When** they define the table structure
**Then** they can specify which columns are shown, the order of those columns, the label or heading for each column, and the display treatment used in each column
**And** every column remains bound through the same general-purpose binding contract.

**Given** a creator wants a list or table to support different content types
**When** they configure the collection primitive
**Then** the same primitive can be used for use cases such as languages, proficiencies, actions, spell entries, resistances, immunities, or inventory rows
**And** the difference in meaning comes from the bound schema and configured columns rather than from a unique component type.

**Given** a creator wants visual variations for a collection primitive
**When** they configure the display mode
**Then** they can choose supported presentations such as comma-separated output, stacked list rows, grouped rows, or structured table output
**And** the chosen presentation remains compatible with the bound collection data.

**Given** a creator needs richer collection content
**When** they configure row-level display behavior
**Then** a row or cell can include supporting text, icons, badges, or secondary information fields sourced from the same record
**And** the collection remains reusable for both simple and information-dense use cases.

**Given** a creator binds a collection primitive to incompatible schema data
**When** the binding is validated
**Then** the system blocks the invalid binding
**And** the creator sees clear feedback about whether the target data shape is not a collection, lacks required fields, or conflicts with the configured display model.

**Given** a creator previews the sheet in different viewport contexts
**When** lists or tables are rendered in narrower layouts
**Then** the collection primitive respects the responsive layout rules already established for the creator
**And** the creator can verify whether the configured columns remain visible, wrap, stack, or require an alternate presentation for smaller screens.

### Story 1.10: Template Backgrounds, Theme Presets, and Player Visual Overrides
As a Creator,
I want to define sheet backgrounds and shared visual theme presets while optionally allowing players to choose alternate approved backgrounds,
So that a single sheet can preserve its structure and functionality while supporting different aesthetic presentations.

**Acceptance Criteria:**
**Given** a creator is editing a sheet template
**When** they open the visual theme and background configuration controls
**Then** they can assign a default sheet background and visual theme preset to the template
**And** the configured visual treatment applies across the sheet without changing its structural layout or bound data model.

**Given** a creator wants to use curated visual options
**When** they browse available background and theme assets
**Then** they can choose from a preset list of approved backgrounds or theme presets
**And** those presets integrate with the existing sheet styling model rather than creating separate template copies.

**Given** a creator wants to allow limited player customization
**When** they enable player-selectable visual overrides for a sheet
**Then** they can define which backgrounds or theme variants are available for player choice
**And** the underlying sheet structure, data bindings, and functional elements remain unchanged regardless of the chosen visual option.

**Given** a creator wants to support custom uploaded backgrounds
**When** they add a supported image asset to the template configuration
**Then** the sheet can use that uploaded asset as a background option
**And** the asset is applied through the sheet’s visual configuration rather than by manually reauthoring layout elements.

**Given** a player or creator selects a different approved background option for the same template
**When** the sheet preview is re-rendered
**Then** only the configured visual presentation changes
**And** the component positions, bindings, and interaction behavior remain intact.

**Given** a creator configures a theme preset alongside typography, card styling, or decorative assets
**When** the template is rendered in preview mode
**Then** those visual tokens work together as one coherent presentation layer
**And** the creator can confirm that changing a visual preset does not corrupt content structure or responsive behavior.

**Given** a creator previews the sheet in different viewport modes after applying a background or theme option
**When** the template is rendered across those display contexts
**Then** the background treatment remains visually appropriate within the available screen bounds
**And** the creator can verify that readability and contrast remain acceptable for the selected presentation.

### Story 1.11: Preview Mode, Save/Load, Import/Export, and Template Sharing
As a Creator,
I want to preview, save, load, import, export, and share sheet templates,
So that I can iterate on creator work safely, reuse templates later, and distribute them without rebuilding the same layout from scratch.

**Acceptance Criteria:**
**Given** a creator has an in-progress sheet template
**When** they switch from editing into preview mode
**Then** the sheet renders using the current layout, bindings, theme configuration, and viewport context
**And** the creator can inspect the result without exposing editing controls that belong only to the builder workspace.

**Given** a creator makes changes while working in the creator
**When** the local draft state is persisted
**Then** the template is saved locally with its layout structure, component bindings, theme configuration, and active system binding context
**And** the creator can later reopen that saved draft without losing previously configured work.

**Given** a creator has multiple saved templates or drafts
**When** they open the template loading workflow
**Then** they can browse and reopen existing saved templates
**And** the selected template restores its creator state in a predictable way rather than loading as a partially reconstructed layout.

**Given** a creator wants to move a template between devices or share it with another user
**When** they export the template
**Then** the system produces a portable artifact containing the layout definition, binding metadata, theme/background settings, and required structured template context
**And** the exported artifact excludes transient editor-only state that should not be part of the shared template definition.

**Given** a creator imports an exported template artifact or compatible template file
**When** the import is processed
**Then** the system validates the file before loading it into the creator
**And** invalid or incomplete imports are rejected with specific feedback describing what failed.

**Given** a creator imports a template whose required system binding is missing locally
**When** the creator attempts to open that template
**Then** the system identifies the missing template or schema dependency
**And** the creator is guided to select a compatible system template or provide the required custom JSON before continuing.

**Given** a creator wants to share a template for other players or creators to use
**When** they generate a shareable template artifact
**Then** the shared result preserves the intended visual and structural behavior of the template
**And** recipients can load it without needing the original author’s local editor state.

**Given** a creator is offline
**When** they save, load, import, export, or preview templates
**Then** the workflow remains available without a required network dependency
**And** template lifecycle actions continue to function as part of the offline-first creator experience.

### Story 1.12: Runtime Detail Panels, Drill-Down Popups, and Rich Element Configuration
As a Creator,
I want sheet elements to open configurable detail panels and popups for deeper runtime information and actions,
So that players can inspect modifiers, read rules text, view markdown descriptions, and use richer interactions without overcrowding the core sheet layout.

**Acceptance Criteria:**
**Given** a creator selects a component type that supports deeper runtime details
**When** they enable detail-panel or popup behavior for that element
**Then** the element can open a secondary panel, modal, or popup surface at runtime
**And** that deeper interaction is configured through the same general-purpose creator model rather than a game-specific hard-coded screen.

**Given** a creator configures a detail panel for a bound element
**When** they define its content sources
**Then** the panel can display structured data such as modifier breakdowns, override details, descriptive notes, rule explanations, or related supporting fields
**And** the displayed content is sourced from bound schema paths or configured static content rather than custom one-off component logic.

**Given** a creator wants rich descriptive content in a runtime detail surface
**When** they configure a text block for that panel or popup
**Then** the surface can render markdown-supported content for descriptions, spell text, feature notes, or instructional copy
**And** the markdown presentation remains consistent with the active theme and typography settings.

**Given** a creator wants an element to expose editable or actionable runtime controls from its popup
**When** they configure the interaction surface
**Then** the detail view can contain supported generic controls such as toggles, fields, buttons, lists, or secondary values
**And** those controls still obey the same schema binding and validation rules as the rest of the sheet.

**Given** a creator configures a row in a list or table to open a drill-down surface
**When** a player activates that row at runtime
**Then** the detail panel can show record-specific information such as full item details, spell descriptions, notes, or supporting actions
**And** the row-level popup remains driven by the bound collection record rather than by a separate purpose-built component type.

**Given** a creator has a sheet with multiple interactive detail surfaces
**When** they preview the sheet in builder preview mode
**Then** they can verify which elements open drill-down panels, what content appears there, and how those panels behave across supported viewport contexts
**And** the preview does not require the creator to publish or leave the editing workflow to test those interactions.

**Given** a creator configures a detail surface for a compact mobile or narrow viewport presentation
**When** that surface is rendered in preview for smaller display contexts
**Then** the popup or panel uses the appropriate presentation model for the viewport, such as a modal, sheet, or constrained overlay
**And** the underlying sheet remains readable and structurally intact when the detail surface is dismissed.

**Given** a creator saves or exports a template that includes runtime detail panels
**When** the template is reopened or imported later
**Then** the configured drill-down behavior, content bindings, and presentation settings are preserved
**And** the template remains portable without depending on unpublished editor-only logic.

### Epic 2: Offline Playable Character Sheets

Players can create, load, search, customize, and use interactive character sheets offline, including overrides, visibility settings, and dice-driven sheet actions.

### Story 2.1: Local Character Library and Manual Export
As a Player,
I want a searchable local library of my saved characters with manual export controls,
So that I can reopen, organize, and back up my offline sheets whenever I need them.

**Acceptance Criteria:**
**Given** a player has one or more locally saved characters
**When** they open the character library
**Then** they can view, search, and sort saved characters using locally available metadata
**And** opening a selected entry restores the associated character sheet without requiring authentication or network access.

**Given** a player wants to preserve or move a local character
**When** they choose the export action from the library or character detail view
**Then** the system generates a one-time local export artifact for that character
**And** the export completes without requiring premium cloud sync or an authenticated session.

### Story 2.2: Guided Character Creation and Customization Flow
As a Player,
I want a guided step-by-step character creation and customization flow,
So that I can build a valid character without manually editing every part of the sheet structure myself.

**Acceptance Criteria:**
**Given** a player starts a new character from an offline-capable template
**When** they enter the creation flow
**Then** the system presents a structured sequence of character-building steps based on the selected game template
**And** the player can move forward and backward without losing already entered information.

**Given** a player changes an earlier character-building choice
**When** the guided flow recalculates dependent sections
**Then** the affected character data is updated consistently
**And** the player receives clear feedback where a later selection must be re-evaluated because of that earlier change.

### Story 2.3: Instant Character Generation from Minimal Inputs
As a Player,
I want to generate a mechanically valid character from only a small set of key choices,
So that I can start playing quickly and refine the details later.

**Acceptance Criteria:**
**Given** a supported character template includes a fast-generation path
**When** a player selects the minimum required inputs such as class and level
**Then** the system creates a mathematically valid baseline character configuration
**And** the generated result is saved as a normal editable character rather than a temporary preview-only artifact.

**Given** a player accepts an instantly generated character
**When** they open that character in the normal sheet experience
**Then** they can continue customizing it through the same editing and runtime workflows used by manually built characters
**And** the generated character remains fully available offline.

### Story 2.4: Interactive Offline Sheet Runtime and Native Dice Resolution
As a Player,
I want to use my character sheet interactively offline and resolve dice expressions natively,
So that I can continue playing and taking mechanical actions even without connectivity.

**Acceptance Criteria:**
**Given** a player opens a playable character sheet while offline
**When** they interact with supported controls on the sheet
**Then** the sheet can execute local mechanical interactions using the configured bindings and action rules
**And** the experience remains available without requiring an account or network connection.

**Given** a player enters or triggers supported dice notation
**When** the sheet resolves the expression
**Then** the system parses standard dice formulas such as `2d6+4`
**And** returns the calculated result within the expected local performance threshold.

### Story 2.5: Visibility Partitions, Overrides, and Sheet Adjustments
As a Player,
I want to control visibility partitions and manually override calculated values where needed,
So that my sheet can support privacy boundaries, GM collaboration, and edge-case game rulings.

**Acceptance Criteria:**
**Given** a character sheet exposes supported data partitions
**When** a player configures the visibility of a sheet section or field
**Then** that content can be marked as Public, Private, or GM-Only
**And** the selected visibility state is saved with the character data.

**Given** a player needs to override a calculated value
**When** they apply a manual override through the supported sheet controls
**Then** the override is stored explicitly rather than silently replacing the underlying calculated source
**And** the sheet reflects the active override in a way the player can review later.

### Epic 3: Identity, Access, and Connected Profiles

Users can create accounts, manage identity, use offline-only access when needed, and maintain social/account boundaries safely.

### Story 3.1: Age Gate, Sign-Up, and Authentication
As a User,
I want to create an account only after acknowledging the platform age requirement and then authenticate with supported sign-in methods,
So that account access is compliant and consistent across the platform.

**Acceptance Criteria:**
**Given** a new user starts account creation
**When** they enter the sign-up flow
**Then** the system requires them to acknowledge the 17+ age restriction before completing registration
**And** account creation cannot finish until that requirement is satisfied.

**Given** a returning user wants to access their account
**When** they use a supported authentication method
**Then** the system signs them in using the configured auth provider flow
**And** successful authentication restores their connected account context without breaking offline-local data access patterns.

### Story 3.2: Player Profile and Visibility Preferences
As a User,
I want to configure my player profile and control what profile information is visible to others,
So that I can present my preferred gaming identity without exposing more information than I want to share.

**Acceptance Criteria:**
**Given** an authenticated user
**When** they open profile settings
**Then** they can configure profile details such as display information, gaming preferences, and active-campaign visibility
**And** they can control which profile elements are public or private according to the supported settings.

**Given** another user views a profile with restricted fields
**When** the platform renders that profile
**Then** only the information permitted by the configured visibility rules is shown
**And** hidden details are not exposed through the normal profile surfaces.

### Story 3.3: Friends Discovery and Relationship Management
As a User,
I want to search for other players and manage friend relationships,
So that I can build a network of people I want to play with regularly.

**Acceptance Criteria:**
**Given** an authenticated user
**When** they search for another player by supported identity fields such as username
**Then** the system returns eligible matching accounts
**And** the user can send, accept, or remove friend relationships through the social workflow.

**Given** two users have an active friend relationship
**When** they view supported connected profile surfaces
**Then** the platform can reflect that relationship consistently
**And** removing the friendship updates both sides of the relationship state.

### Story 3.4: Blocklist Safety Controls
As a User,
I want to manage an account-wide blocklist,
So that I can prevent unwanted direct interaction with specific people across the platform.

**Acceptance Criteria:**
**Given** an authenticated user
**When** they add another account to their blocklist
**Then** the platform prevents normal direct interaction paths covered by the blocklist rules
**And** the blocked account is stored in account-level safety settings rather than a single-campaign setting.

**Given** a blocked relationship exists
**When** either affected user attempts a restricted interaction path
**Then** the platform enforces the blocklist behavior consistently
**And** the blocked user does not receive misleading confirmation that the restricted interaction succeeded.

### Story 3.5: Password Reset and Account Deletion
As a User,
I want standard account recovery and deletion controls,
So that I can regain access when needed and permanently remove my platform identity when I choose.

**Acceptance Criteria:**
**Given** a user cannot access their account
**When** they initiate the password reset flow
**Then** the system provides the supported account recovery workflow
**And** a successful reset allows the user to authenticate again without requiring manual administrator intervention.

**Given** a user wants to delete their account
**When** they confirm the account deletion workflow
**Then** the platform performs the supported right-to-be-forgotten style deletion process for account-scoped identity data
**And** the user is informed about the irreversible effect before deletion completes.

### Epic 4: Campaign Hub and Shared Play Spaces

GMs and players can create campaigns, join them, bind characters, communicate, publish house rules, and apply shared campaign presentation.

### Story 4.1: Campaign Creation and Ruleset Configuration
As a GM,
I want to create a campaign and configure its system, adventure path, and active rules context,
So that the play space starts with the correct structure for the game I am running.

**Acceptance Criteria:**
**Given** an authenticated GM
**When** they create a new campaign
**Then** they can define the campaign name and select the game system, adventure path, and active ruleset from the supported campaign configuration workflow
**And** the new campaign is stored as a distinct campaign instance.

**Given** a GM finishes initial campaign setup
**When** the campaign is created
**Then** the campaign has a usable default dashboard state
**And** the GM can continue managing invitations and settings from that campaign context.

### Story 4.2: Invite Links and Character Binding
As a Player,
I want to join a campaign using an invite link and bind one of my characters to that campaign,
So that my chosen character can participate in the shared play space.

**Acceptance Criteria:**
**Given** a player receives a valid campaign invite link
**When** they authenticate and open the invite flow
**Then** they can join the target campaign and choose an existing character or create a new one to bind
**And** the selected character becomes the campaign-bound character for that membership.

**Given** a player attempts to join without a compatible character ready
**When** the join flow validates their available choices
**Then** the system guides them to create or select a valid character before finishing campaign entry
**And** the campaign join workflow does not leave them in a partially bound state.

### Story 4.3: Campaign Library and Dashboard Roster
As a Player or GM,
I want to browse my campaigns and see the active participant roster with public character information,
So that I can move between campaigns and understand who is currently part of each game.

**Acceptance Criteria:**
**Given** a user belongs to one or more campaigns
**When** they open the campaign library
**Then** they see a list of their campaigns with key context such as campaign name, GM, and their associated character where applicable
**And** selecting a campaign opens that campaign's dashboard.

**Given** a user opens a campaign dashboard
**When** the roster is shown
**Then** they can view the names, avatars, and public sheet data of active players according to visibility rules
**And** the roster reflects current membership rather than stale cached participants.

### Story 4.4: Campaign Chat and Threaded Channels
As a Player,
I want distinct chat channels and threaded conversations within a campaign,
So that in-character, out-of-character, and rules discussions stay organized.

**Acceptance Criteria:**
**Given** an active campaign
**When** a participant opens the chat experience
**Then** they can post messages into the available campaign channels
**And** those messages are visible to other authorized campaign members in the same channel context.

**Given** a participant wants to branch a conversation
**When** they open or reply to a thread on a message
**Then** the platform preserves that nested conversation structure
**And** the threaded replies remain associated with the parent message rather than cluttering the main channel log.

### Story 4.5: House Rules Publishing and Campaign Reference Content
As a GM,
I want to publish house rules as campaign reference content,
So that every participant can review campaign-specific expectations and rulings from a shared source.

**Acceptance Criteria:**
**Given** a GM is managing a campaign
**When** they create or update the house rules document
**Then** they can save markdown-formatted campaign guidance
**And** players in that campaign can access the resulting document from the shared campaign surfaces.

**Given** a campaign has published house rules
**When** a player opens the rules reference area
**Then** the system renders the latest published version for that campaign
**And** the player is not shown editing controls reserved for the GM.

### Story 4.6: Campaign Audio and Shared Theme Presentation
As a GM,
I want to set campaign-wide ambience and visual presentation,
So that the campaign has a consistent mood across its shared interfaces.

**Acceptance Criteria:**
**Given** a GM configures campaign presentation settings
**When** they select supported audio tracks or a campaign visual theme
**Then** those settings are stored as campaign-level presentation choices
**And** connected participants receive the updated shared presentation within supported client surfaces.

**Given** a GM starts playback of a campaign audio track
**When** players are in the active campaign context
**Then** the clients receive the shared audio event
**And** players retain local controls such as volume or mute without altering the GM's selected track.

### Story 4.7: Player Dismissal and Control Reassignment
As a GM,
I want to dismiss a player from a campaign and reassign that character to GM control when needed,
So that I can keep the campaign manageable when participation changes.

**Acceptance Criteria:**
**Given** a GM is viewing the campaign roster
**When** they use the dismiss action on a player membership
**Then** the platform removes that player from the active campaign membership
**And** the GM can choose the supported control reassignment behavior for the associated character.

**Given** a dismissed player attempts to access the removed campaign afterward
**When** they reopen their campaign library or direct entry path
**Then** the campaign is no longer available to them as an active membership
**And** the system does not leave duplicate or ambiguous campaign participation state behind.

### Epic 5: Tactical Scenes and Encounter Play

GMs can prepare scenes and encounters, while players can view maps, tokens, and turn-order interactions across compatible tactical scene modes.

**Implementation Clarifications:**
- Epic 5 is the first tactical runtime track. It consumes later shared runtime contracts and must remain distinct from the creator layout canvas introduced in Epic 1.
- The scene model used here represents encounter presentation and interaction state. It should not be backfilled into the creator authoring stories as though both surfaces use the same canvas abstraction.
- When Epic 5 refers to view modes, it means runtime tactical presentation modes over compatible scene data, not creator preview modes.

### Story 5.1: Battlemap and Scene Asset Management
As a GM,
I want to upload and manage 2D scene assets plus compatible scene metadata for both tactical and non-tactical play,
So that I can present the correct visual environment for exploration or combat.

**Acceptance Criteria:**
**Given** a GM is preparing encounter assets
**When** they upload or select a 2D map, scene image, or compatible scene resource
**Then** the system stores that asset as a reusable campaign scene resource
**And** the GM can mark whether it is intended for gridded tactical use, non-gridded presentation, or a future compatible 3D-capable projection path.

**Given** a scene asset is assigned to the active encounter context
**When** players open the scene view
**Then** the selected image is rendered in the supported scene surface
**And** the rendering model respects the expected performance constraints for target devices.

**Implementation Clarifications:**
- This story defines runtime scene assets for encounters, not creator-template layout assets.
- Any 3D-capable metadata introduced here should describe compatibility with runtime tactical presentation, not sheet-builder authoring behavior.

### Story 5.2: Encounter Builder and Compendium Search
As a GM,
I want to build encounters from a searchable compendium of creatures and adversaries,
So that I can assemble combat scenarios without creating every combatant from scratch.

**Acceptance Criteria:**
**Given** a GM is in the encounter builder
**When** they search the compendium for a creature or adversary
**Then** the system returns matching encounter-ready entries
**And** the GM can add those entries to the current encounter definition.

**Given** a GM has assembled encounter participants
**When** they save the encounter
**Then** the resulting encounter state preserves the selected combatants and scene association
**And** the encounter is ready for later activation in the campaign.

### Story 5.3: Tactical Map View and Token Presence
As a Player,
I want to view the active tactical scene and see my token alongside visible entities in a supported projection mode,
So that I can understand positioning during shared encounter play.

**Acceptance Criteria:**
**Given** a tactical scene is active
**When** a player opens the map view
**Then** they can see the active tactical scene along with their token and other visible entities
**And** the displayed positions reflect the current encounter state available to that player.

**Given** an encounter has not entered strict turn order yet
**When** the active mode allows free scene interaction
**Then** the token presentation remains consistent with the current campaign mode
**And** the player can clearly tell whether movement is unrestricted or being controlled by turn-based rules.

**Given** a tactical scene supports more than one compatible presentation mode
**When** a player changes between the supported 2D, isometric, or 3D view options
**Then** the scene continues to represent the same underlying encounter state
**And** the client only exposes view modes that are compatible with the active scene resources.

### Story 5.4: Initiative Entry and Turn Order Activation
As a GM or Player,
I want to activate initiative and have players inject their characters into the active turn order,
So that tactical combat can begin in a clear and shared sequence.

**Acceptance Criteria:**
**Given** a tactical encounter is ready to begin
**When** the GM starts initiative
**Then** the system prompts eligible participants to roll or submit initiative for their bound characters
**And** the resulting initiative entries create a shared turn order for the encounter.

**Given** a player resolves their initiative participation
**When** the turn order is displayed
**Then** the player can see where their character sits in the sequence
**And** the campaign can transition from preparation state into active tactical play.

### Story 5.5: Theater-of-the-Mind and Tactical Mode Switching
As a GM,
I want to toggle between theater-of-the-mind and tactical play for a campaign encounter,
So that the group can move between narrative and position-sensitive play styles without rebuilding encounter context.

**Acceptance Criteria:**
**Given** a campaign supports both play styles
**When** the GM changes the encounter mode between Theater of the Mind and Tactical
**Then** the campaign updates the active mode without requiring a new campaign instance
**And** the user interface surfaces the correct play model for participants.

**Given** a tactical encounter is returned to a non-tactical state
**When** participants reopen the shared play surface
**Then** the experience no longer presents strict initiative-driven interaction as the active model
**And** the campaign remains usable for continued narrative play.

### Story 5.6: Compatible 2D and 3D Tactical Scene Presentation
As a Player,
I want supported encounters to switch between compatible tactical scene presentation modes,
So that I can use a view that fits my device and play context without changing the encounter rules.

**Acceptance Criteria:**
**Given** a tactical scene has a compatible 3D representation
**When** a supported client switches from a 2D view into a compatible 3D view
**Then** the client reuses the same encounter and visibility state
**And** the scene camera, lighting, and fog presentation adapt without forking the underlying rules state.

**Given** a tactical scene does not have a compatible 3D representation
**When** a user attempts to select an unsupported presentation mode
**Then** the platform blocks that mode switch gracefully
**And** the user is clearly informed which scene representations are currently available.

**Implementation Clarifications:**
- This story assumes a shared runtime scene contract and must not require pixel-perfect parity across clients.
- Mode switching here applies to runtime tactical views only. It does not change creator preview behavior or retroactively redefine Epic 1 viewport stories.

### Epic 6: Asynchronous Turn Resolution

Players can act offline, receive narrative prompts, and have actions reconciled safely when the system reconnects.

### Story 6.1: Offline Action Ledger and Pending State
As a Player,
I want to submit supported mechanical actions while offline,
So that I can continue participating even when my device cannot reach the network.

**Acceptance Criteria:**
**Given** a player has no active network connection
**When** they take a supported mechanical action from a playable character or encounter surface
**Then** the action is recorded in the local action ledger with the information needed for later reconciliation
**And** the player can see that the action is pending synchronization rather than already authoritative.

**Given** multiple offline actions are created before reconnection
**When** the player returns to the app later
**Then** those actions remain locally available in the correct pending order
**And** they are not silently discarded because the device was offline.

### Story 6.2: Reconnection Sync and Chronological Resolution
As a Developer,
I want locally queued actions to synchronize and resolve in chronological order after reconnection,
So that all clients converge on a consistent authoritative campaign state.

**Acceptance Criteria:**
**Given** a device reconnects with pending local actions
**When** the synchronization workflow runs
**Then** the system submits those actions into the authoritative timeline in chronological order
**And** the resulting resolved state is propagated back to the reconnecting client and other affected clients.

**Given** synchronization completes successfully
**When** the local client refreshes from the authoritative state
**Then** previously pending actions move into their resolved state
**And** the user no longer sees them represented as unresolved local-only events.

### Story 6.3: Narrative Push Notifications for Required Input
As a Player,
I want narrative push prompts when the game needs my input,
So that I can re-enter the campaign at the right moment without monitoring it constantly.

**Acceptance Criteria:**
**Given** a player's input becomes required because of a resolved campaign event
**When** that player is not actively in the foreground app experience
**Then** the system sends a contextual push notification using narrative language appropriate to the triggered event
**And** the notification helps the player understand what kind of response is needed.

**Given** a player opens the app from that notification
**When** the relevant campaign context loads
**Then** the app takes them toward the pending decision or required interaction surface
**And** the prompt is tied to the correct campaign state rather than a generic notification destination.

### Story 6.4: Conflict Rollback and Authoritative State Recovery
As a Developer,
I want invalid delayed actions to be rolled back against the authoritative campaign state,
So that late offline activity cannot permanently corrupt the game state.

**Acceptance Criteria:**
**Given** a delayed offline action conflicts with an earlier authoritative event
**When** the resolution workflow detects that conflict
**Then** the server-authoritative result takes precedence over the stale local action
**And** the affected client is updated to the corrected state with a clear explanation that the delayed action could not stand.

**Given** the invalidated action affected tactical or positional state
**When** the client receives the authoritative correction
**Then** the visible campaign state snaps back to the correct server-approved version
**And** the user is not left with a misleading local representation of what actually occurred.

### Story 6.5: Offline Re-entry with Cached Scene and Character Data
As a Player,
I want previously loaded characters, rules context, and tactical scenes to remain available while offline,
So that I can review the current state and decide my turn even if connectivity drops after I receive a prompt to act.

**Acceptance Criteria:**
**Given** a player previously loaded a character, campaign state, and required scene assets
**When** they lose connectivity before reopening the app
**Then** the client restores the cached character and encounter context without requiring a blocking sync
**And** the player can inspect the current battle scene and available decisions from local data.

**Given** a player makes a supported turn decision while offline after re-entering from a cached state
**When** the action is submitted locally
**Then** the client records it as pending synchronization
**And** the eventual network reconnection is not required before the player can complete that local decision flow.

**Implementation Clarifications:**
- Cached scene data here refers to runtime play data needed to continue or review a turn, not creator workspace state.
- This story should use the shared offline/runtime storage strategy and must not couple player re-entry behavior to creator-template editing flows.

### Epic 7: Advanced Automation and External Integrations

The platform supports third-party roll ingestion, encounter simulation, GM approvals, AI interception, rules translation, and offline-capable AI assistance for supported solo experiences.

**Implementation Clarifications:**
- Epic 7 consumes the shared rules/runtime foundation and should not reshape creator story contracts to fit automation needs.
- Simulation, AI assistance, and rules translation must operate on the canonical rules/runtime model rather than on tactical renderer objects or creator-layout state.

### Story 7.1: Third-Party VTT Roll Ingestion
As a Player,
I want to send dice roll results from supported third-party tools into the campaign log,
So that I can use external play surfaces without losing a unified record of my actions.

**Acceptance Criteria:**
**Given** a campaign supports external roll ingestion
**When** a supported third-party tool submits a valid roll payload through the configured integration path
**Then** the platform authenticates and parses that payload
**And** the resulting roll is recorded in the campaign log using the expected structured format.

**Given** an ingested roll represents a mechanical action
**When** the platform processes it successfully
**Then** the campaign can treat it as part of the shared action history
**And** participants can see the result from within the normal campaign activity surfaces.

### Story 7.2: Encounter Simulation and Balance Forecasting
As a GM,
I want to simulate an encounter before play,
So that I can understand likely difficulty and adjust the encounter before the session starts.

**Acceptance Criteria:**
**Given** a GM has assembled an encounter
**When** they run the supported simulation workflow
**Then** the system produces balance-oriented output such as likely victory odds or projected resource strain
**And** the GM can use that output without having to start the real encounter.

**Given** a simulation completes
**When** the GM reviews the results
**Then** the output is understandable enough to inform encounter tuning decisions
**And** it is clearly separated from the live campaign state so simulated outcomes do not overwrite real play data.

### Story 7.3: Narrative Catch-Up Summaries
As a Player,
I want a concise natural-language summary of what I missed in an active campaign,
So that I can catch up quickly after being away from the game.

**Acceptance Criteria:**
**Given** a player returns to a campaign after meaningful activity occurred while they were away
**When** the catch-up workflow is requested
**Then** the platform summarizes the relevant event history into a readable narrative recap
**And** the player does not need to manually reconstruct the entire timeline from raw event records.

**Given** a generated summary is shown to the user
**When** they review it
**Then** the summary is clearly tied to the specific campaign context it describes
**And** the player can still navigate into the underlying detailed history if they need more precision.

### Story 7.4: GM Approval Gates for High-Stakes Outcomes
As a GM,
I want specific automated outcomes to require my approval before they finalize,
So that I can preserve narrative control over especially important consequences.

**Acceptance Criteria:**
**Given** the platform reaches an outcome type configured for manual review
**When** that outcome would normally resolve automatically
**Then** the action is paused in a pending approval state for the GM
**And** the game does not finalize that specific consequence until the GM approves, rejects, or modifies it.

**Given** a GM reviews a pending outcome
**When** they act on the approval request
**Then** the resulting state change follows the GM's decision
**And** the campaign records that manual intervention as part of the event history.

### Story 7.5: AI Action Interception and Override
As a GM,
I want to intercept AI-suggested combatant actions before they resolve,
So that I can redirect behavior that does not fit the tactical or narrative situation.

**Acceptance Criteria:**
**Given** an AI-managed combatant has a proposed action
**When** interception is enabled for that situation
**Then** the GM can inspect the proposed action before it resolves
**And** they can allow, modify, or veto it using the supported intervention controls.

**Given** the GM changes or rejects the proposal
**When** the action is finalized
**Then** the resulting combat resolution follows the GM-approved version
**And** the original AI suggestion does not execute in parallel with the override.

### Story 7.6: Natural-Language Rules Mapping
As a GM,
I want to describe hypothetical or custom rules in plain language and get a structured rules proposal,
So that I can adapt a campaign without hand-authoring every engine configuration detail myself.

**Acceptance Criteria:**
**Given** a GM enters a natural-language rules request
**When** the translation workflow runs
**Then** the platform proposes a structured configuration representing that request in the platform's rules model
**And** the GM must review the proposal before it becomes an active campaign rule.

**Given** a rules proposal is approved
**When** the campaign uses the affected rules area later
**Then** the approved structured rule is applied as part of the active rules context
**And** the platform can distinguish approved rules from unapproved suggestions.

### Story 7.7: Offline Single-Player AI Assistance
As a Single-Player User,
I want supported campaigns to provide on-device AI assistance while offline,
So that I can continue solo play with narrative responses and decision support even when no network connection is available.

**Acceptance Criteria:**
**Given** a supported single-player mode is active and the required local model assets are available
**When** the user is offline
**Then** the platform can generate supported AI responses or guidance without contacting the remote AI service
**And** the user is not blocked from continuing solo play because the network is unavailable.

**Given** a user returns to connectivity after an offline single-player session
**When** the app syncs any supported deferred state
**Then** the local single-player progression remains consistent with the saved campaign history
**And** the offline AI assistance workflow does not corrupt the authoritative data contracts used elsewhere in the product.

**Implementation Clarifications:**
- On-device AI assistance here belongs to single-player runtime behavior only. It should not leak into creator authoring workflows or redefine the creator data model.
- Any model inputs or outputs must remain compatible with the shared rules/runtime contracts so later multiplayer, shared-display, and immersive clients can trust the same state shape.

### Epic 8: Marketplace, Cloud Sync, and Platform Governance

Creators can publish and monetize templates, users can sync and acquire them, and admins can moderate and protect the ecosystem.

### Story 8.1: Premium Cloud Sync and Cross-Device Availability
As a User,
I want premium cloud sync to keep my eligible data available across authenticated devices,
So that I can move between devices without manually exporting and importing everything each time.

**Acceptance Criteria:**
**Given** a user has an active premium sync entitlement
**When** they authenticate on another supported device
**Then** eligible synced data becomes available through the connected account experience
**And** continuous syncing is not offered as the full experience for users without that entitlement.

**Given** a user does not have premium sync
**When** they use the product across devices
**Then** the platform does not present premium background sync as active
**And** the user can still rely on the manual local-first workflows supported elsewhere in the product.

### Story 8.2: Creator Template Publishing and Marketplace Listings
As a Creator,
I want to publish custom templates and rule configurations to the marketplace,
So that other users can discover and use the systems and layouts I create.

**Acceptance Criteria:**
**Given** a creator has a completed publishable template
**When** they use the marketplace publishing workflow
**Then** the platform creates a marketplace listing with the template payload and the required listing metadata
**And** the published entry is stored as marketplace content rather than only local creator data.

**Given** a published listing is visible in the marketplace
**When** users browse it
**Then** they can review marketplace-facing details such as title, description, and preview context
**And** the listing clearly represents the published template artifact it delivers.

### Story 8.3: Official System Template Curation
As a Platform Administrator,
I want to publish official curated templates through an administrative pipeline,
So that licensed or platform-maintained systems are clearly available as trusted marketplace options.

**Acceptance Criteria:**
**Given** an administrator has an approved official template payload
**When** they publish it through the administrative curation path
**Then** the template enters the marketplace with the expected official status treatment
**And** it does not rely on the same authoring flow used for normal community submissions.

**Given** a user browses an official curated template
**When** the marketplace displays the listing
**Then** the listing is distinguishable from community-created content
**And** users can identify it as an officially curated system option.

### Story 8.4: Template Purchasing, Unlocking, and Campaign Licensing
As a User or GM,
I want to unlock premium marketplace templates and optionally grant campaign-wide access,
So that I can use paid creator content in the way that best fits my play group.

**Acceptance Criteria:**
**Given** a premium marketplace template has a platform-defined access cost
**When** an eligible user unlocks it with the required marketplace currency or entitlement
**Then** the template becomes available in that user's accessible template library
**And** the unlock is recorded in a way that prevents duplicate charging for the same entitlement.

**Given** a GM purchases a supported campaign-level access option
**When** the campaign license is activated
**Then** the players in that campaign receive the intended access scope for that template during the licensed campaign context
**And** the campaign license does not permanently rewrite each player's separate marketplace ownership history.

### Story 8.5: Automated Marketplace Moderation
As a Developer,
I want marketplace submissions to pass through automated moderation before public release,
So that unsafe or policy-violating community content is filtered before it spreads across the platform.

**Acceptance Criteria:**
**Given** a creator submits content to the marketplace
**When** the submission reaches the moderation workflow
**Then** the platform evaluates it against the automated moderation rules for the supported content types
**And** the submission is either rejected, held for review, or cleared for publication according to the moderation result.

**Given** a submission is flagged
**When** the moderation result is returned
**Then** the platform preserves the moderation decision state for administrator follow-up
**And** content that fails moderation does not quietly appear as public marketplace content.

### Story 8.6: Administrative Audit Playback and Abuse Restriction
As a Platform Administrator,
I want an audit playback of campaign and marketplace activity plus abuse restriction controls,
So that I can investigate reports and protect the platform from misuse.

**Acceptance Criteria:**
**Given** an administrator investigates a reported campaign, transaction, or user
**When** they open the administrative audit view
**Then** they can review an immutable chronological record of relevant activity such as mechanical actions, chat events, and token-related marketplace events
**And** the audit data is suitable for moderation and support decisions.

**Given** the platform detects scraping-like or bot-like behavior
**When** that behavior crosses configured restriction thresholds
**Then** the system can rate-limit, restrict, or temporarily ban the offending account or source
**And** the restriction event is recorded for later administrative review.

### Epic 9: Shared Display, Room Sessions, and Immersive Surfaces

Groups can project player-safe tactical scenes to a shared room display today while the platform preserves a path toward LAN-backed room play and future native VR tactical experiences.

**Implementation Clarifications:**
- Epic 9 is a runtime presentation track layered on top of the shared tactical/runtime model. It must not be implemented by stretching the creator desktop surface into a pseudo-display client.
- Shared-display and immersive clients are allowed to reuse shared contracts and selective UI primitives, but they should remain separate surfaces with their own presentation responsibilities and privacy rules.

### Story 9.1: Shared Display and Party-Leader Presentation Mode
As a Party Leader or GM,
I want to present a player-safe tactical scene on a shared room display,
So that the group can follow the battle together while still using personal devices as their input surfaces.

**Acceptance Criteria:**
**Given** a campaign is in a supported tactical scene
**When** the party leader or GM opens the shared display mode
**Then** the room display shows the active public-facing battle scene, shared audio context, and encounter state
**And** private or GM-only information is excluded from that display.

**Given** players continue interacting from their own devices while the shared display is active
**When** the encounter state changes
**Then** the shared display updates to reflect the latest public scene state
**And** the personal device controls remain the primary input mechanism for supported actions.

**Implementation Clarifications:**
- The shared display is a player-safe runtime presentation surface, not a mirror of the creator workspace or an authoring mode.
- Reuse should focus on shared contracts and safe presentation primitives, not on forcing the creator shell to double as the shared display client.

### Story 9.2: Internet-Backed Room Sessions with Future LAN Compatibility
As a Developer,
I want shared-room sessions to work through the internet-backed sync model first while preserving a future LAN-compatible transport seam,
So that in-room play can ship early without locking the platform out of local-first room sessions later.

**Acceptance Criteria:**
**Given** a supported room session is active under the standard connected experience
**When** participant devices and the shared display join the same campaign session
**Then** they synchronize through the authoritative online model
**And** the client/session architecture keeps transport-specific assumptions behind a replaceable boundary.

**Given** the long-term roadmap introduces local room transport
**When** a LAN-capable mode is later implemented
**Then** the existing gameplay, scene, and visibility contracts remain reusable
**And** the platform does not require a separate tactical rules implementation for local-room play.

**Implementation Clarifications:**
- The transport seam preserved here is for runtime play/session coordination. It should not change creator-story storage or workspace assumptions.
- Internet-backed first remains the implementation path; LAN compatibility is an architectural seam to preserve, not an MVP requirement for unrelated earlier stories.

### Story 9.3: Native VR Tactical Tabletop Presentation
As a VR User,
I want compatible tactical scenes to appear as an immersive tabletop experience,
So that I can view the encounter spatially and optionally zoom toward a supported character-perspective view.

**Acceptance Criteria:**
**Given** a tactical scene is flagged as compatible with immersive presentation
**When** a supported native VR client opens that encounter
**Then** the scene renders as a room-scale tabletop or other supported immersive presentation
**And** the client uses the same underlying game and scene state as the non-VR clients.

**Given** a user is viewing a compatible immersive tactical scene
**When** they switch between tabletop overview and a supported character-perspective zoom
**Then** the immersive client updates the camera or presentation mode without changing the canonical encounter state
**And** unsupported scenes do not expose immersive-only controls they cannot satisfy.

**Implementation Clarifications:**
- VR here is a future runtime client consuming shared tactical contracts. It should not cause Epic 1 creator stories to introduce immersive or 3D-editing responsibilities.
- Scene compatibility and camera behavior for VR must remain downstream of the runtime scene model rather than being authored as one-off logic in creator shell stories.
