---
stepsCompleted: []
inputDocuments: ["prd.md", "architecture.md", "ux-design-specification.md"]
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

### FR Coverage Map

FR1: Epic 1 - Access character sheet builder and roller offline
FR2: Epic 1 - Account creation and authentication
FR3: Epic 2 - Manage friends list
FR4: Epic 6 - Premium cloud subscription sync
FR5: Epic 2 - Player profile configuration
FR6: Epic 2 - Account blocklist management
FR7: Epic 1 - 17+ age restriction for accounts
FR8: Epic 1 - Manual export of local character data
FR9: Epic 1 - Standard account management
FR10: Epic 1 - View, search, and sort saved characters
FR11: Epic 1 - Generate character from template/class
FR12: Epic 1 - Modify character from template and roll dice
FR13: Epic 1 - Character sheet visibility partitioning
FR14: Epic 1 - Execute mechanical game actions from sheet
FR15: Epic 1 - Override system-calculated values
FR16: Epic 1 - Interactive sheet play offline
FR17: Epic 1 - Custom component definitions for creators
FR18: Epic 1 - Import/export custom JSON layouts
FR19: Epic 2 - Create and manage campaigns
FR20: Epic 2 - Select game system and rulesets for campaign
FR21: Epic 2 - Join campaign and bind character
FR22: Epic 2 - Publish House Rules
FR23: Epic 2 - View other players in campaign
FR24: Epic 2 - Text channels and nested threads
FR25: Epic 3 - Upload and assign 2D battlemaps
FR26: Epic 2 - Audio tracks and battle music
FR27: Epic 3 - Toggle Theater of Mind vs Tactical
FR27b: Epic 2 - Apply visual themes to campaign
FR28: Epic 4 - Submit mechanical actions offline
FR29: Epic 4 - Auto-sync and resolve offline actions
FR30: Epic 4 - Contextual mobile push notifications
FR31: Epic 3 - Initiative Roll and turn order
FR32: Epic 3 - View active 2D battlemap and tokens
FR33: Epic 5 - Webhook ingest from third-party VTTs
FR34: Epic 1 - Parse dice notation natively
FR35: Epic 3 - Manually build encounters
FR36: Epic 6 - Headless simulations and Autobalancing
FR37: Epic 6 - NL summary of missed events
FR38: Epic 6 - Require manual GM approval (Rules Engine)
FR39: Epic 5 - Intercept/modify basic AI actions
FR40: Epic 6 - Plain-text hypothetical rules
FR41: Epic 4 - Auto-Rollback for conflicts
FR42: Epic 2 - Forcefully dismiss player
FR43: Epic 7 - Upload templates to marketplace
FR44: Epic 7 - Curate/publish official templates
FR45: Epic 7 - Purchase premium templates
FR46: Epic 7 - Algorithmically scan UGC
FR47: Epic 7 - Immutable playback of actions
FR49: Epic 7 - Identify and restrict bots

## Epic List

### Epic 1: The Standalone Character Builder & Roller (The MVP)
Players can access the platform offline, create an account, load pre-created optimal character templates based on class, update them through play, and execute dice rolls. Creators can define custom non-standard game components. 
**FRs covered:** FR1, FR2, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR34

### Epic 2: The Campaign Hub & Social Layer
GMs can create campaigns, set rules, apply visual themes, and invite players. Players can manage their friends list, join campaigns with their created characters, and communicate via distinct chat channels.
**FRs covered:** FR3, FR5, FR6, FR19, FR20, FR21, FR22, FR23, FR24, FR26, FR27b, FR42

### Epic 3: Standalone Battlemap & Encounters
GMs can assign 2D battlemaps, build encounters, and toggle tactical combat. Players can view the map, see tokens, and inject into the turn order. Functions standalone but integrates with the character sheet.
**FRs covered:** FR25, FR27, FR31, FR32, FR35

### Epic 4: Asynchronous Combat & Resolution
Players receive narrative push notifications when attacked, and execute mechanical actions that resolve offline and sync automatically with conflict resolution.
**FRs covered:** FR28, FR29, FR30, FR41

### Epic 5: Advanced GM Controls & Simulation
GMs can simulate encounters for balance, intercept basic combatant AI actions, and forcefully trigger ability checks or saves for any character or group. Players can send dice rolls from third-party tools.
**FRs covered:** FR33, FR39

### Epic 6: Full Game Automation & AI Engine
Implementation of the full rules engine mapped to the map/battlemap, autonomous simulation of battles, reinforcement learning for optimized AI, auto-balancing encounters, natural language rules parsing, and catch-up summaries.
**FRs covered:** FR36, FR37, FR38, FR40

### Epic 7: The Creator Marketplace & Administration
Creators can monetize custom sheets, users can buy them, and platform admins can moderate content, view immutable game logs, and ban malicious bots.
**FRs covered:** FR4, FR43, FR44, FR45, FR46, FR47, FR49

<!-- Repeat for each epic in epics_list (N = 1, 2, 3...) -->

### Epic 1: The Standalone Character Builder & Roller (The MVP)

Players can access the platform offline, create an account, load pre-created optimal character templates based on class, update them through play, and execute dice rolls. Creators can define custom non-standard game components. 

### Story 1.1: Project Initialization & Core Framework scaffolding
As a Developer,
I want the foundational Expo application configured with Gluestack UI, NativeWind v4, and TinyBase,
So that all subsequent features have a standardized offline-first architecture to build upon.

**Acceptance Criteria:**
**Given** a clean Expo environment
**When** the developer initializes the repository
**Then** Gluestack-UI, NativeWind v4, and TinyBase are installed and configured
**And** the app runs successfully on web and mobile simulators without errors

### Story 1.2: User Authentication & Offline-Only Mode
As a Player,
I want to either create an account (verifying I am 17+) using SSO/email or explicitly choose "Offline-Only Mode",
So that I can immediately start using the app without being forced to create an account first.

**Acceptance Criteria:**
**Given** an unauthenticated player opens the app for the first time
**When** the welcome screen loads
**Then** they see options to Login, Register, or "Continue Offline"
**And** selecting "Continue Offline" bypasses authentication and stores all data locally via TinyBase
**And** account creation includes a 17+ age verification checkbox

### Story 1.3: Custom Component Definition for Creators (Desktop)
As a Creator,
I want to define new data components and structured data representations (via JSON),
So that I can build sheets and templates for non-standard game systems.

**Acceptance Criteria:**
**Given** a Creator is using the Desktop Web version
**When** they open the Component Editor
**Then** they can define custom data attributes, types, and labels
**And** these components are saved to the local TinyBase schema for use in character sheets

### Story 1.4: Load Pre-Created Optimal Character Templates
As a Player,
I want to select a character class and instantly load a pre-configured optimal character sheet,
So that I can immediately start playing without a complex rulebook setup.

**Acceptance Criteria:**
**Given** the player is creating a new character
**When** they select a system template and a class
**Then** the system loads a complete, mathematically sound character sheet template
**And** transitions the player into a guided walkthrough to manually customize details

### Story 1.5: Interactive Character Sheet & Manual Overrides
As a Player,
I want to interact with my loaded character sheet to track changing values (like HP) and manually override system-calculated values,
So that the sheet reflects the current game state and any custom house rules.

**Acceptance Criteria:**
**Given** an active character sheet
**When** the player taps a value (e.g., maximum HP or an attribute)
**Then** they can input a manual override value that replaces the templated default
**And** all changes are saved instantly to the local TinyBase store

### Story 1.6: Import/Export JSON Layouts & Local Data Backup
As a Player or Creator,
I want to manually export my local character data and import custom JSON sheet layouts,
So that I can back up my data safely offline and share UI layouts.

**Acceptance Criteria:**
**Given** the user is in the settings or dashboard menu
**When** they select "Export Local Data"
**Then** the system generates a downloadable JSON payload of their TinyBase store
**And** when they select "Import Layout", standard Zod validation ensures the JSON is structurally sound before merging.

### Story 1.7: Native Dice Parser and Roller
As a Player,
I want to tap on a mechanical action (like a weapon) to execute a dice roll using standard notation (e.g., 2d6+4) and see the instant mathematical result,
So that I can resolve actions quickly.

**Acceptance Criteria:**
**Given** a character sheet with defined mechanical actions
**When** the player taps an action button
**Then** the system parses the underlying dice notation and calculates a random result in under 200ms
**And** visually displays the dice result to the player

### Story 1.8: Data Privacy Partitioning (with Defaults)
As a Player,
I want my character sheet sections to have reasonable default visibility settings (Public/Private/GM-Only) that I can optionally adjust,
So that my secrets are protected by default when I eventually play online.

**Acceptance Criteria:**
**Given** a newly loaded character template
**When** the user views the component settings
**Then** standard attributes (Name, Class) default to "Public", while inventory/notes default to "Private"
**And** the user can manually toggle these privacy tags per component

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
**Then** the server rejects the invalid action and initiates an Auto-Rollback for that client
**And** the client is updated to the correct authoritative server state, notifying the user why their action was rejected.

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

### Story 5.2: GM Forced Roll Triggers
As a GM,
I want the ability to trigger ability checks, saving throws, and custom rolls to individual players, the entire party, or specific enemies,
So that I can actively manage the game state and prompt players for required interactions.

**Acceptance Criteria:**
**Given** an active campaign session
**When** the GM selects targets (individuals, group, or enemies) and chooses a specific roll type (e.g., "Dexterity Save")
**Then** a targeted prompt is sent to the selected players' devices demanding the roll
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
**Then** the rules engine calculates the exact distance and obstacles on the canvas
**And** either validates the action or rejects it with a specific mechanical reason (e.g., "Target is behind full cover").

### Story 6.2: Autonomous Battle Simulation & RL Training Pipeline
As a Developer,
I want to build a headless simulation pipeline that uses Reinforcement Learning (RL) to play encounters millions of times,
So that the system can train highly optimized AI combatants that understand optimal positioning and ability usage.

**Acceptance Criteria:**
**Given** a set of creature stat blocks and a battlemap layout
**When** the RL training pipeline is triggered
**Then** the engine simulates the battle iteratively, rewarding the AI for efficient damage and survival
**And** generates an optimized decision-making model payload for those specific creatures.

### Story 6.3: Auto-Balancing Encounters
As a GM,
I want to click a single button to auto-balance an encounter against my specific party composition,
So that I don't accidentally cause a Total Party Kill (TPK) or create an overwhelmingly boring fight.

**Acceptance Criteria:**
**Given** the GM has drafted an encounter in the Builder
**When** they select "Auto-Balance"
**Then** the system utilizes the RL models and headless simulation to predict the outcome
**And** automatically adds, removes, or scales enemies until the predicted success probability matches the GM's selected difficulty threshold (e.g., "Hard - 70% win rate").

### Story 6.4: Searchable Campaign Help System
As a Player or GM,
I want to access a searchable help system containing all official rules and custom house rules for the current campaign,
So that I can quickly resolve rules disputes during play and provide context grounding for AI engine tools.

**Acceptance Criteria:**
**Given** an active campaign
**When** a user opens the Help interface and types a query (e.g., "Grappling")
**Then** the system returns relevant excerpts from both the base system ruleset and the GM's published House Rules
**And** the rules text is formatted cleanly for mobile and desktop reading.

### Story 6.5: Rules Engine MCP Server Integration
As a Developer,
I want to expose the campaign's active ruleset and game state via the Model Context Protocol (MCP),
So that AI agents (like the Natural Language Rules Translator) have secure, context-aware access to the specific rules governing the current match.

**Acceptance Criteria:**
**Given** the App Backend is running
**When** an external LLM agent attempts to interpret a complex rule or GM request
**Then** the agent can query the Rules Engine MCP Server to receive the exact current mechanical state and active rules definitions
**And** use this context to ground its subsequent responses or JSON updates.

### Story 6.6: Natural Language Rules Translation (LLM)
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
**And** the entry includes a title, description, and preview image.

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
**When** a player clicks "Unlock" and possesses sufficient tokens
**Then** the tokens are deducted from their account ledger
**And** the template becomes permanently available for them to load in the Character Builder.

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
**And** logs the event for Administrative review.
