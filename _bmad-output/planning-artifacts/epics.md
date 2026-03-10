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
FR25: GMs can upload, manage, and assign a library of 2D Battlemaps and static imagery to specific encounters.
FR26: GMs can upload or select audio tracks and trigger streaming battle music/ambience for all connected players.
FR27: GMs can toggle specific campaign mechanics between "Theater of the Mind" and "Tactical".
FR27b: GMs can apply distinct visual themes to a campaign instance, changing the global UI styling for all participating players.
FR28: Users can submit mechanical actions while entirely offline.
FR29: The system can automatically sync and chronologically resolve offline actions into the authoritative server timeline upon reconnection.
FR30: Users can receive contextual mobile push notifications framed narratively when an action dictates their mandatory input.
FR31: Users can execute an "Initiative Roll" to inject their character into a formal turn order when the GM starts tactical combat mode.
FR32: Players can view the active 2D battlemap, including the real-time or async coordinates of their character token and visible adversaries.
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
FR43: Creators can upload custom character sheet templates and rule configurations to a public marketplace.
FR44: Platform Administrators can automatically curate and publish official System Templates via API based on licensing agreements.
FR45: Users can purchase or access premium templates utilizing a platform-specific token economy.
FR46: The system can algorithmically scan all UGC marketplace uploads to flag content violating community guidelines.
FR47: Platform Administrators can view an immutable, chronological playback of all mechanical actions, chat logs, and token expenditures within a specific campaign instance.
FR49: The system can identify and restrict accounts exhibiting automated bot-like scraping behavior.

### NonFunctional Requirements

NFR1: Rendering of 2D Battlemaps (via Canvas/Three.js) must maintain a minimum of 30fps consistently on hardware representing the 80th percentile of active mobile devices.
NFR2: Offline-to-Online state synchronization (merging the local TinyBase ledger with the server ledger) must complete background resolution in under 3 seconds upon network reconnection without blocking the user interface.
NFR3: The native dice math-parser component must calculate and display results in under 200ms.
NFR4: The architecture must structurally enforce hard processing caps on LLM API token utilization per user/campaign to prevent asymmetrical financial abuse.
NFR5: All user generated content (UGC) uploaded to the community marketplace must pass through the automated two-tiered moderation filter before attaining public visibility statuses to comply with App Store review guidelines.
NFR6: The authoritative Server Event Ledger must support concurrent write actions from multiple players within the same campaign instance without queuing deadlocks or data corruption.
NFR7: The core mobile VTT application must be fully navigable and semantically parsable by native iOS (VoiceOver) and Android (TalkBack) screen readers.
NFR8: The Desktop Web application experience must support 100% keyboard-only navigation for all core gameplay actions to satisfy WCAG 2.1 AA compliance standards.
NFR9: The system must expose stable, authenticated incoming webhook endpoints capable of accepting and parsing standard JSON payloads from major 3rd-party VTT tracker tools.

### Additional Requirements

- **Starter Template:** Utilize Gluestack-UI NativeWind v4 Template. This explicitly affects Epic 1 Story 1.
- **Data Architecture:** Zod Schema Validation (Zod v3.x) matching snake_case naming conventions for database compatibility.
- **Authentication:** Formally decoupled Nhost Auth (Nhost JS SDK v4.5+) abstract `AuthProvider` interface context.
- **API Communication & State Syncing:** GraphQL Subscriptions via SyncFacade interacting synchronously with local TinyBase store.
- **Frontend Architecture:** Feature-Sliced Design (FSD) with a Global "Shared" UI Layer.
- **Infrastructure:** Deploy complex "Creator" desktop web app via Vercel (Web), mobile apps natively with Expo Application Services (Native).
- **Core Platform UI:** The "Action-Card" interface to bubble up the 3 most relevant actions based on game state.
- **Layout Approach:** "Floating HUD" over map background on mobile, contextual action drawer on the bottom ("Thumb Zone"), with full WYSIWYG sheet builder purely disabled on mobile UI.
- **Sync Protocol:** The "Rewind & Redirect" Sync Protocol.
- **Design System:** Hybrid Headless Approach (Tailwind CSS + shadcn/ui + DnD Kit). Dynamic Campaign theming via CSS variable injection.
- **General-Purpose Creator Model:** Sheet elements must be reusable, system-agnostic UI primitives bound to underlying structured game data rather than hard-coded game-specific controls.
- **System Binding Strategy:** When defining a sheet, the creator must choose a supported game system template or upload custom system JSON so layout elements can bind to that schema and generate placeholder game-specific JSON where required.

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
FR43: Epic 8 - Publish creator templates
FR44: Epic 8 - Official template publishing
FR45: Epic 8 - Template purchases/access
FR46: Epic 8 - UGC moderation
FR47: Epic 8 - Immutable playback/admin review
FR49: Epic 8 - Bot restriction and abuse control

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
GMs can prepare scenes and encounters, while players can view maps, tokens, and turn-order interactions in tactical mode.
**FRs covered:** FR25, FR27, FR31, FR32, FR35

### Epic 6: Asynchronous Turn Resolution
Players can act offline, receive narrative prompts, and have actions reconciled safely when the system reconnects.
**FRs covered:** FR28, FR29, FR30, FR41

### Epic 7: Advanced Automation and External Integrations
The platform supports third-party roll ingestion, encounter simulation, GM approvals, AI interception, and rules translation.
**FRs covered:** FR33, FR36, FR37, FR38, FR39, FR40

### Epic 8: Marketplace, Cloud Sync, and Platform Governance
Creators can publish and monetize templates, users can sync and acquire them, and admins can moderate and protect the ecosystem.
**FRs covered:** FR4, FR43, FR44, FR45, FR46, FR47, FR49

<!-- Repeat for each epic in epics_list (N = 1, 2, 3...) -->

### Epic 1: System-Agnostic Sheet Creator Foundation

Creators can define reusable layout primitives, bind them to a selected or uploaded game-system JSON schema, and build fully custom sheet templates for any TTRPG without requiring game-specific component types.

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

### Epic 2: The Campaign Hub & Social Layer

GMs can create campaigns, set rules, apply visual themes, and invite players. Players can manage their friends list, join campaigns with their created characters, and communicate via distinct chat channels.

### Story 2.1: Cloud Backend & SyncFacade Initialization
As a Developer,
I want to configure the Nhost Backend (Postgres, Hasura, Auth) and implement the SyncFacade over TinyBase,
So that local offline data can synchronize with the cloud when connected.

**Acceptance Criteria:**
**Given** the local TinyBase architecture is established
**When** the app detects an active internet connection and authenticated session
**Then** the SyncFacade correctly pushes local changes and pulls server updates via Nhost GraphQL
**And** resolves simple conflicts using the "Rewind & Redirect" protocol without data loss

### Story 2.2: Player Profile & Friends List Management
As a Player,
I want to configure a public profile, add friends, and manage a blocklist,
So that I can easily connect with people I want to play with and avoid those I don't.

**Acceptance Criteria:**
**Given** an authenticated player
**When** they navigate to their social settings
**Then** they can search for other players by username and send friend requests
**And** they can manage an account-wide blocklist

### Story 2.3: Campaign Instance Creation & Configuration
As a GM,
I want to create a new campaign, select the game system/ruleset, and generate an invite link,
So that I have a dedicated digital space for my game.

**Acceptance Criteria:**
**Given** an authenticated user
**When** they select "Create Campaign"
**Then** they can name it, pick a system from available templates, and get a shareable invite URI
**And** the campaign instance is created in the Nhost database

### Story 2.4: Campaign Joining & Character Binding
As a Player,
I want to use an invite link to join a campaign and bind one of my local character sheets to it,
So that the GM and other players can interact with my character.

**Acceptance Criteria:**
**Given** a player receives an invite link
**When** they tap the link and authenticate
**Then** they are prompted to select an existing standalone character or create a new one
**And** the selected character's data is synced to the campaign instance

### Story 2.5: Player Campaign Library
As a Player,
I want to view a centralized list of all the campaigns I am currently participating in, along with the specific character I have bound to each,
So that I can easily navigate between my active games.

**Acceptance Criteria:**
**Given** a player is participating in multiple campaigns
**When** they open the app's main "Campaigns" tab
**Then** they see a list of active campaigns
**And** each entry displays the campaign name, the GM, and the name/avatar of their specific bound character

### Story 2.6: The Campaign Dashboard (Player Visibility)
As a Player,
I want to view the avatars and public sheet data of other players in the campaign. As a GM, I want the ability to forcefully dismiss a player from the campaign if necessary.

**Acceptance Criteria:**
**Given** multiple players have joined a campaign
**When** a user opens the Campaign Dashboard
**Then** they can see a roster of all active players and view their "Public" partitioned sheet data
**And** the GM sees a "Dismiss" action that removes a player and optionally assigns their character to GM control

### Story 2.7: Campaign Chat & Threaded Conversations
As a Player,
I want to communicate in real-time using distinct text channels (e.g., In-Character, Out-of-Character) and use nested threads,
So that we can organize roleplay and rules discussions without cluttering the main log.

**Acceptance Criteria:**
**Given** an active campaign
**When** a player navigates to the Chat interface
**Then** they can post messages in predetermined channels and start/reply to threaded conversations
**And** messages are synced across all connected clients in real-time

### Story 2.8: Publishing House Rules
As a GM,
I want to publish a static text document of "House Rules" visible to everyone on the dashboard,
So that expectations are clear and easily referenceable.

**Acceptance Criteria:**
**Given** a GM managing a campaign
**When** they use the House Rules editor
**Then** they can save a markdown-formatted document
**And** all players in the campaign can access and read this document from their dashboard

### Story 2.9: Campaign Audio Integration
As a GM,
I want to upload audio tracks and trigger streaming battle music or ambience for all connected players,
So that I can set the mood for the session.

**Acceptance Criteria:**
**Given** a GM in an active session
**When** they upload and play an audio track
**Then** all connected players' clients begin streaming and playing the audio synchronously
**And** players can independently control their local volume or mute the audio

### Story 2.10: Dynamic Campaign Theming
As a GM,
I want to select a visual theme (via CSS variables) that applies globally to the UI for all players in my campaign,
So that the app's aesthetic matches our game's genre.

**Acceptance Criteria:**
**Given** a campaign configuration screen
**When** the GM selects a predefined theme (e.g., Fantasy, Sci-Fi)
**Then** the required CSS variables are injected into the Global Shared UI Layer
**And** all players observe the updated visual styling instantly across menus and character sheets

### Epic 3: Standalone Battlemap & Encounters

GMs can assign 2D battlemaps, build encounters, and toggle tactical combat. Players can view the map, see tokens, and inject into the turn order. Functions standalone but integrates with the character sheet.

### Story 3.1: 2D Battlemap & Scene Imagery Uploads
As a GM,
I want to upload static 2D imagery to serve as either a gridded tactical battlemap or a non-gridded atmospheric scene,
So that I can provide a visual environment for my players regardless of whether combat is occurring.

**Acceptance Criteria:**
**Given** an active campaign
**When** the GM navigates to the Encounter Builder
**Then** they can upload an image file and toggle whether it uses a strict grid (Battlemap) or free placement (Scene)
**And** the client renders this image on an interactive Canvas/Three.js layer that maintains at least 30fps on mobile.

### Story 3.2: Encounter Builder Compendium
As a GM,
I want to search a Compendium database and add pre-configured monsters/NPCs to an encounter,
So that I don't have to manually build every adversary from scratch.

**Acceptance Criteria:**
**Given** the GM is building an encounter
**When** they search for a creature (e.g., "Goblin")
**Then** the system queries a structured compendium database
**And** allows the GM to add that entity's pre-configured stats and abilities to the current encounter state

### Story 3.3: Token Placement & Free-Roam Movement
As a Player,
I want to view the active 2D scene or battlemap and freely move my character token in real-time,
So that I can explore the environment before combat starts.

**Acceptance Criteria:**
**Given** a map or scene is active but Initiative has not been rolled
**When** a player interacts with their token
**Then** they can move it freely across the canvas without turn-based restrictions
**And** the map interface heavily utilizes a read-only or thumb-driven "Action Drawer" on mobile to ensure one-handed playability.

### Story 3.4: Dynamic Initiative Tracking & Turn-Based Movement
As a GM,
I want to initiate, conclude, or restart an Initiative sequence on an active map at any time, restricting player movement to turn order,
So that we can cleanly transition between free-roam exploration and structured combat.

**Acceptance Criteria:**
**Given** an active map with placed tokens
**When** the GM clicks "Start Initiative"
**Then** all connected players receive a prominent UI prompt to roll Initiative
**And** movement rules instantly transition from "Free Roam" to "Turn Restricted", where only the active token can be moved
**And** the GM can arbitrarily end the initiative sequence, returning everyone to free-roam mode on the exact same map

### Story 3.5: Character Sheet & Battlemap Integration HUD
As a Player,
I want the battlemap to integrate with my character sheet as a "Floating HUD",
So that I can view the map while still executing mechanical actions from my character sheet underneath.

**Acceptance Criteria:**
**Given** the player is viewing the active Battlemap
**When** they need to take an action
**Then** they can access a "Floating HUD" or "Action Card" drawer to quickly access their core attacks/spells
**And** tapping an action rolls the dice and visually executes the action without leaving the map screen.

### Epic 4: Asynchronous Combat & Resolution

Players receive narrative push notifications when attacked, and execute mechanical actions that resolve offline and sync automatically with conflict resolution.

### Story 4.1: Offline Mechanical Action Submission
As a Player,
I want to submit mechanical actions (like an attack or spell) even when my device is entirely offline,
So that I can take my turn while commuting or without a stable internet connection.

**Acceptance Criteria:**
**Given** the device has no network connection
**When** the player executes a mechanical action targeting a visible entity
**Then** the action is immediately recorded in the local TinyBase ledger with a precise timestamp and local resolution state
**And** the UI reflects the action as "Pending Sync" to the user.

### Story 4.2: Asynchronous Auto-Sync & Resolution
As a Developer,
I want the system to automatically sync and chronologically resolve offline actions into the authoritative server timeline upon reconnection,
So that the game state remains consistent across all clients without manual intervention.

**Acceptance Criteria:**
**Given** a player reconnects to the network with pending offline actions
**When** the SyncFacade pushes the local ledger to Nhost
**Then** the server orders all actions chronologically based on timestamps
**And** automatically calculates the resulting game state (e.g., deducting HP) and broadcasts the updated state to all clients.

### Story 4.3: Contextual Narrative Push Notifications
As a Player,
I want to receive contextual mobile push notifications framed narratively when an action dictates my mandatory input (e.g., a saving throw),
So that I am drawn back into the game organically when it's my turn.

**Acceptance Criteria:**
**Given** the player is not actively viewing the app
**When** the server resolves an action that targets their character and requires a reaction (like a Dex Save)
**Then** Expo Application Services (EAS) triggers a push notification to their device
**And** the notification uses narrative phrasing (e.g., "A fireball erupts! Roll Dexterity to dodge!") rather than dry mechanical text.

### Story 4.4: Auto-Rollback for State Conflicts
As a Developer,
I want the system to execute a rollback of the game state if a delayed offline action mechanically conflicts with the newly synced server state,
So that invalid actions (like exploring a room while dead) do not permanently corrupt the campaign.

**Acceptance Criteria:**
**Given** the server receives an offline action that is rendered invalid by a chronologically prior action (e.g., the acting character was killed before they took the action)
**When** the SyncFacade attempts resolution
**Then** the Authoritative Server Rules Engine explicitly overrides the Local Rules Engine
**And** the client is updated to the correct authoritative server state
**And** any invalid "Ghost Tokens" are visually snapped back to their true server coordinates on the battlemap, notifying the user why their action was rejected.

### Epic 5: Advanced GM Controls & Simulation

GMs can simulate encounters for balance, intercept basic combatant AI actions, and forcefully trigger ability checks or saves for any character or group. Players can send dice rolls from third-party tools.

### Story 5.1: Webhook Integration for Third-Party VTTs
As a Player,
I want to send dice roll results from third-party VTT trackers (like Roll20 or Foundry) directly to the Dungeons with Friends campaign log,
So that I can use my preferred virtual tabletop while maintaining an accurate character sheet here.

**Acceptance Criteria:**
**Given** an active campaign
**When** the player triggers a webhook from a supported 3rd-party tool containing a JSON payload of a dice roll
**Then** the Nhost backend receives, authenticates, and parses the payload
**And** the result is injected into the campaign's unified event log, updating the game state if it was a mechanical action.

### Story 5.2: GM Forced Roll Triggers & Timeouts
As a GM,
I want the ability to trigger ability checks, saving throws, and custom rolls to individual players, the entire party, or specific enemies, and set an optional temporal limit,
So that I can actively manage the game state and prevent the game from soft-locking if a player is offline.

**Acceptance Criteria:**
**Given** an active campaign session
**When** the GM selects targets (individuals, group, or enemies) and chooses a specific roll type (e.g., "Dexterity Save")
**Then** a targeted prompt is sent to the selected players' devices demanding the roll
**And** if the GM applies a Time Limit (e.g., 5 minutes), the system will automatically roll on the player's behalf using their base stats if they fail to respond in time
**And** the GM can see who has successfully rolled and what their results are in real-time.

### Story 5.3: Headless Encounter Simulation
As a GM,
I want the system to conduct headless background simulations of my custom encounters using basic engine math,
So that I can predict the probability of player victory and adjust the difficulty before the session starts.

**Acceptance Criteria:**
**Given** a fully built encounter in the Encounter Builder
**When** the GM clicks "Simulate Balance"
**Then** the server runs a headless simulation of the combatants using their statistical averages
**And** the GM is presented with a success probability percentage and estimated resource drain (e.g., "Expected HP loss: 40%").

### Story 5.4: Basic AI Action Interception
As a GM,
I want to intercept, modify, or veto any basic system-generated combatant action before it resolves,
So that I can ensure the monsters behave logically or narratively appropriately during tactical mode.

**Acceptance Criteria:**
**Given** it is a system-controlled monster's turn in Tactical Mode
**When** the basic AI proposes a mechanical action (e.g., "Goblin attacks Player 1")
**Then** the GM receives a prompt showing the intended action
**And** the GM can choose to "Enable Auto-Resolve" or manually change the target/action before continuing.

### Epic 6: Full Game Automation & AI Engine

Implementation of the full rules engine mapped to the map/battlemap, autonomous simulation of battles, reinforcement learning for optimized AI, auto-balancing encounters, natural language rules parsing, and catch-up summaries.

### Story 6.1: Full Rules Engine & Map Integration
As a Developer,
I want to implement a comprehensive rules engine that understands spatial properties on the battlemap (distance, cover, line of sight),
So that the system can automatically validate actions and apply correct mechanical outcomes during combat.

**Acceptance Criteria:**
**Given** the game is in Tactical Mode with a gridded battlemap
**When** a player attempts an action with specific range/line-of-sight requirements
**Then** the rules engine must provide proactive UI highlighting for valid targets *before* execution to prevent client/server spatial disagreements
**And** either validates the action or rejects it with a specific mechanical reason (e.g., "Target is behind full cover").

### Story 6.2: Local Autonomous Battle Simulation & RL Training Pipeline
As a Developer,
I want to build a headless simulation pipeline that uses Reinforcement Learning (RL) to play encounters millions of times locally on the user's device,
So that the system can train highly optimized AI combatants without spinning up expensive server compute resources.

**Acceptance Criteria:**
**Given** a set of creature stat blocks and a battlemap layout
**When** the RL training pipeline is triggered
**Then** the engine simulates the battle iteratively using local device compute resources
**And** generates an optimized decision-making model payload for those specific creatures
**And** includes a strict compute timeout limit (e.g., 5 seconds max simulation time on mobile) with a fallback to basic CR math if RL fails to converge.

### Story 6.3: Standalone Workstation Simulation Tool
As a Creator or Power User,
I want to run the headless encounter simulation pipeline as a standalone executable on a high-powered workstation,
So that I can rapidly optimize characters or complex monster behaviors without being constrained by mobile device hardware.

**Acceptance Criteria:**
**Given** a desktop environment
**When** the user runs the standalone simulator with a defined JSON encounter payload
**Then** the simulator runs all imported JSON payloads through a strict baseline heuristic sanity check (Zod limits) *before* the first RL epoch begins
**And** executes the RL pipeline iteratively using available CPU/GPU resources, outputting an optimized decision-making model.

### Story 6.4: Auto-Balancing Encounters (Local)
As a GM,
I want to click a single button to auto-balance an encounter against my specific party composition using local compute,
So that I don't accidentally cause a Total Party Kill (TPK) or create an overwhelmingly boring fight.

**Acceptance Criteria:**
**Given** the GM has drafted an encounter in the Builder
**When** they select "Auto-Balance"
**Then** the system utilizes the local RL models and headless simulation to predict the outcome
**And** automatically adds, removes, or scales enemies until the predicted success probability matches the GM's selected difficulty threshold.

### Story 6.5: Searchable Campaign Help System
As a Player or GM,
I want to access a searchable help system containing all official rules and custom house rules for the current campaign,
So that I can quickly resolve rules disputes during play and provide context grounding for AI engine tools.

**Acceptance Criteria:**
**Given** an active campaign
**When** a user opens the Help interface and types a query (e.g., "Grappling")
**Then** the system returns relevant excerpts from both the base system ruleset and the GM's published House Rules
**And** the rules text is formatted cleanly for mobile and desktop reading.

### Story 6.6: Rules Engine MCP Server Integration
As a Developer,
I want to expose the campaign's active ruleset and specific, restricted game state actions via the Model Context Protocol (MCP),
So that AI agents have secure, context-aware access to rules without direct state manipulation access.

**Acceptance Criteria:**
**Given** the App Backend is running
**When** an external LLM agent attempts to interpret a rule
**Then** the MCP Server explicitly restricts raw state variable access, forcing use of strictly typed endpoints
**And** the MCP Server issues temporary "State Lock Tokens". If the game state ledger updates (due to async combat) before the LLM returns its payload, the MCP server rejects the payload with a `STATE_STALE` error.

### Story 6.7: Natural Language Rules Translation (LLM)
As a GM,
I want to input plain-text hypothetical rules (e.g., "Fire magic is twice as effective here"),
So that the system can translate my intent into the strict JSON schema required by the new Full Rules Engine.

**Acceptance Criteria:**
**Given** the GM is configuring Campaign Rules
**When** they type a Natural Language rule and submit it
**Then** an LLM uses the Rules Engine MCP Server to process the text against the existing rules schema and proposes a structured JSON modification
**And** upon GM approval, the engine enforces this new spatial/mechanical rule globally.

### Story 6.7: Natural Language Catch-up Summaries (LLM)
As a Player,
I want the system to generate a succinct, Natural Language summary of missed campaign events presented immediately upon re-entering an active campaign,
So that I don't have to decipher hundreds of raw mechanical log entries to understand what happened.

**Acceptance Criteria:**
**Given** a player has been offline while the campaign progressed significantly
**When** they open the campaign dashboard
**Then** the system aggregates the raw JSON event logs and passes them to an LLM
**And** the UI displays a short narrative paragraph summarizing the key events.

### Story 6.8: Deep Rules GM Approval Gate
As a GM,
I want to configure the Rules Engine to pause and require my manual approval for high-stakes automated decisions (like a character dying),
So that I can veto or alter the engine's strict mathematical outcome for narrative purposes.

**Acceptance Criteria:**
**Given** the Full Rules Engine calculates an outcome resulting in character death
**When** the server attempts to resolve this calculation
**Then** the action is placed in a "Pending GM Review" queue, pausing that specific interaction
**And** the game state resolves only after the GM explicitly Approves or Rejects/Modifies the outcome.

### Epic 7: The Creator Marketplace & Administration

Creators can monetize custom sheets, users can buy them, and platform admins can moderate content, view immutable game logs, and ban malicious bots.

### Story 7.1: Cloud Syncing & Premium Subscription Tier
As a Developer,
I want to restrict continuous background cloud syncing to users with an active premium subscription,
So that free users rely strictly on local TinyBase data and manual JSON exports, and the platform can fund its infrastructure.

**Acceptance Criteria:**
**Given** the SyncFacade architecture
**When** a user's Nhost Auth token indicates they are on a "Free" tier
**Then** automated background syncing to the Postgres backend is disabled, and only manual exports are permitted
**And** when they have a Premium token, data synchronizes continuously across all their authenticated devices.

### Story 7.2: UGC Template Publishing & Marketplace
As a Creator,
I want to upload my custom character sheet templates and rule configurations to a public marketplace,
So that other players can discover and use my structured game systems.

**Acceptance Criteria:**
**Given** a Creator has built a template locally
**When** they select "Publish to Marketplace"
**Then** the JSON payload is uploaded to Nhost storage and a public marketplace entry is created
**And** the entry includes a title, description, and preview image
**And** the system automatically generates a "Read-Only Interactive Sandbox" version of the template for the marketplace.

### Story 7.3: Official System Curation (API)
As a Platform Administrator,
I want to use an internal API to automate the publishing of official, curated System Templates based on licensing agreements,
So that players have high-quality, authentic templates for major RPG systems immediately available.

**Acceptance Criteria:**
**Given** the admin server environment
**When** an administrator executes a script pointing to an official JSON schema
**Then** the API bypasses standard UGC moderation and publishes the template directly to the marketplace with an "Official" badge.

### Story 7.4: Premium Template Purchasing (Token Economy)
As a Player,
I want to purchase or unlock premium templates utilizing a platform-specific token economy,
So that I can access high-quality creator content and compensate the designers.

**Acceptance Criteria:**
**Given** a marketplace entry with a set token price
**When** a player clicks "Test Sandbox"
**Then** they can load the interactive template into a secure, offline, read-only state to verify its functionality before purchase
**And** when they click "Unlock" and possess sufficient tokens, the tokens are deducted from their account ledger
**And** the full template becomes permanently available for them to load in the Character Builder
**And** GMs have the option to purchase a "Campaign License" tier, which temporarily grants all players currently in their specific campaign access to the required templates for the duration of the campaign without spending individual tokens.

### Story 7.5: Automated UGC Moderation
As a Developer,
I want the system to algorithmically scan all UGC marketplace uploads (text and images) against a two-tiered filter,
So that content violating community guidelines is flagged before it reaches public visibility, complying with App Store safety guidelines.

**Acceptance Criteria:**
**Given** a Creator attempts to publish a new template
**When** the upload reaches the server
**Then** it is processed through an automated content filter
**And** if flagged for severe violations (e.g., hate speech), it is immediately rejected; if flagged for minor issues, it is placed in a queue for manual Admin review.

### Story 7.6: Immutable Action Ledger for Moderation
As a Platform Administrator,
I want to view an immutable, chronological playback of all mechanical actions, chat logs, and token expenditures within a specific campaign instance,
So that I can accurately investigate player reports of harassment, cheating, or marketplace fraud.

**Acceptance Criteria:**
**Given** a user report targeting a specific campaign or player
**When** an Administrator views that campaign via the admin dashboard
**Then** they see a strict, un-editable timeline of every event generated by the SyncFacade
**And** they can use this ledger to verify the claims before issuing a ban or refund.

### Story 7.7: Automated Bot Detection & Restriction
As a Developer,
I want the system to analyze connection patterns to identify and restrict accounts exhibiting automated bot-like scraping behavior,
So that the platform's API and marketplace are protected from unauthorized bulk downloading.

**Acceptance Criteria:**
**Given** standard platform API traffic
**When** an account or IP address exhibits rapid, non-human request patterns (e.g., attempting to download every marketplace template sequentially in milliseconds)
**Then** the server automatically rate-limits or temporarily bans the offending IP/Token
**And** logs the event for Administrative review
**And** free-tier accounts have a strict hard cap on daily marketplace downloads to ensure scraping is economically unviable.
