---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
inputDocuments:
  - architecture.md
  - product.md
  - productroadmap.md
workflowType: prd
documentCounts:
  briefCount: 0
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 3
classification:
  projectType: web_app
  domain: gaming
  complexity: high
  projectContext: brownfield
---

# Product Requirements Document - DungeonsWithFriends

**Author:** Derek
**Date:** 2026-03-05T08:43:44-08:00

## 1. Executive Summary
Dungeons with Friends is an offline-friendly, mobile-first virtual tabletop (VTT) and digital storytelling platform designed to make tabletop role-playing games (TTRPGs) universally accessible. It solves the profound friction of scheduling, complex rulesets, and GM prep-burnout. By offering flexible asynchronous play-by-post mechanics side-by-side with real-time synchronous tracking, the platform adapts to the schedule of the modern player. Underpinned by a system-agnostic data core and heavily integrated generative AI, the platform acts as an intelligent co-GM—dynamically balancing encounters, managing narrative context memory, and automating complex mechanical interactions. The ultimate goal is to create a frictionless ecosystem where players can participate in multiple high-quality, persistent adventures simultaneously straight from their phones.

### What Makes This Special
Unlike legacy VTTs (e.g., Roll20, Foundry) which act as passive, PC-first digital maps requiring heavy GM prep, Dungeons with Friends is a proactive, AI-assisted gaming ecosystem built for mobile asynchronous engagement. 
- **Automated Accessibility:** AI-driven optimal character generation and contextual UI rendering allow new players to immediately play without reading rulebooks.
- **Asynchronous Momentum:** Frictionless, context-rich push notifications and flexible auto-resolve timers ensure campaigns survive scheduling conflicts.
- **Intelligent Creation:** Headless simulation engines predictive-balance encounters, while LLMs maintain long-term campaign memory and parse natural language into rigid game-state rules.
- **Decoupled Architecture:** Bootstrapped via standalone, system-agnostic tools (e.g., the visual character sheet builder) before monetizing the heavy AI narrative generation.

## 2. Success Criteria
### User Success
Users can easily join, understand, and play a tabletop RPG campaign on their mobile devices despite restrictive real-life schedules. The "aha!" moment occurs when a player successfully resolves a combat turn directly from a push notification in under 30 seconds while commuting, keeping the game moving for their friends.

### Business Success
The platform successfully bootstraps an initial user base by offering highly usable, free standalone tools (like an agnostic character sheet builder) that capture the market share of players frustrated by complex legacy VTTs. Once established, revenue is generated through usage-based tokens for advanced AI generation and premium marketplace interactions.

### Technical Success
The architecture successfully supports true offline-first capability and real-time state synchronization without conflict. The Universal Event Ledger securely logs all discrete actions, enabling both deterministic game mechanics and serving as a pristine dataset for eventual LLM ingestion.

### Measurable Outcomes
- **MVP Validation:** 500 active users utilizing the standalone character sheet builder or basic async play-by-post engine within 3 months of alpha launch.
- **Engagement:** Turn-resolution latency (time between receiving a notification and submitting an action) averages under 2 hours for active campaigns.

## 3. Product Scope
**Strategy:** The "Tooling" MVP (Fastest to Market/Platform Foundation). Launch focuses on value-creation through utility via a best-in-class, offline-capable visual character sheet builder and dice roller to bootstrap a user base. This validates the core React/Expo UI architecture, establishes data models, and tests early monetization (cloud syncing) before investing in complex VTT multiplayer networking or AI generation.

### Phase 1: MVP (The Builder)
**Must-Have Capabilities:**
- **Visual Character Sheet Builder:** Powered by a customized GrapesJS WYSIWYG editor allowing manual drag-and-drop of game-specific controls, strictly mapped to underlying JSON structures.
- **Tiered Storage:** Universal Event Ledger utilizing TinyBase for local-only saving, exportable backups to Google Drive, and premium cloud-syncing across devices via Nhost subscriptions.
- **Internal System Templates:** Pre-built, platform-curated templates for major systems (D&D 5e, Pathfinder, Shadowdark) to instantly onboard users.

### Phase 2: Growth (The Asynchronous VTT & Marketplace)
- **Asynchronous Engine:** "Play-by-Post" notification engine, campaign chat interface, and multiplayer synchronization utilizing the authoritative server Event Ledger.
- **Community Marketplace:** A separate SEO-optimized web platform for discovering, sharing, and monetizing custom sheet templates and homebrew content. Official SRD templates published automatically based on licensing.

### Phase 3: Vision/Expansion (The AI Co-GM & Tactical Flow)
- **Intelligent Adversaries & Optimization:** Reinforcement Learning drives highly intelligent, adaptive enemy behavior during combat, and powers optimal mechanical character configurations for players.
- **AI Encounter Builder:** Headless Monte Carlo simulations for predictive encounter balancing.
- **Componentized AI Rules Translation:** Natural Language Logic Parser tied to valid JSON engine configurations.
- **Tactical Maps:** Procedural grid generation and high-performance tactical 2D battle maps (WebGL/Three.js).

### Risk Mitigation
- **Technical Risks:** Mobile builder UI clutter. *Mitigation:* Enforce smart defaults and standardized "Weight Classifications" for touch-friendly snapping.
- **Market Risks:** Legal issues with copyrighted game templates. *Mitigation:* Internally built templates strip copyrighted flavor text and adhere to Open Gaming Licenses (OGL) or Creative Commons. Negotiate official partnerships for protected IP.
- **Resource Risks:** VTT development draining bootstrapping funds. *Mitigation:* Phase 1 acts as a self-contained product with clear monetization (Nhost cloud-sync) and negligible server costs to sustainably fund Phase 2.

## 4. User Journeys
### The Time-Starved "Forever GM" (Primary Success Path)
**Persona:** David (35, Professional) loves TTRPGs but his group hasn't met in six months.
**Journey:** David creates a *Dungeons with Friends* campaign and uses the AI Encounter Builder to generate a balanced goblin ambush. Over the week, he manages the battle asynchronously during lunch breaks. When the rogue attempts a complex stealth maneuver, David receives a push notification and uses the app's intuitive interface to apply a custom DC check. 
**Resolution:** David successfully runs a satisfying, multi-week combat encounter without coordinating a 4-hour synchronous block.

### The Commuting Player (Primary Edge Case)
**Persona:** Sarah (24) is completely new to RPGs and intimidated by the math.
**Journey:** Sarah receives an invite link on her phone. She selects "Wizard" and the AI automatically generates an optimal character sheet. Days later, she receives a notification: "It is your turn. The Goblin is 10ft away." Sarah swipes to her spellbook. Her train hits a dead zone right as she clicks "Cast Fireball". The app logs the intent locally via the TinyBase offline-first architecture. 
**Resolution:** When Sarah's phone regains signal, the Universal Event Ledger syncs her action perfectly into the turn order.

### The System Tinkerer (Secondary Creator)
**Persona:** Alex (29) loves obscure, niche TTRPGs and hates being restricted to standard D&D 5e mechanics on legacy VTTs.
**Journey:** Alex downloads the standalone *Dungeons with Friends Visual Sheet Builder*. He imports custom attributes via JSON and uses the drag-and-drop UI to build a sci-fi themed interface. He uses the free-text AI logic parser to create a custom rule: "If a player rolls double 6s, their blaster overheats." He publishes this system template to the Community Marketplace.
**Resolution:** Alex successfully ports his hyper-niche game to a mobile VTT and shares it with others.

### The Platform Admin/Support Ops (Internal User)
**Persona:** Riley (Internal Platform Moderator) handles user disputes and monitors server resource costs.
**Journey:** A player reports a GM for locking them out of a campaign after paying premium tokens. Riley opens the Admin Dashboard console. Using the centralized Universal Event Ledger, Riley replays the exact sequence of events, chat logs, and token expenditures safely without altering the game state. 
**Resolution:** Riley verifies the transaction and GM actions, issues a token refund seamlessly, and flags the GM's marketplace account.

## 5. Domain Requirements
### Compliance & Regulatory
- **Age Gating:** The platform is strictly designed for users 17+ due to mature themes inherent in TTRPG rulebooks and user-generated narratives. COPPA compliance is not targeted.
- **Content Moderation (UGC):** To comply with App Store guidelines, public templates and marketplace uploads must pass through a two-tiered moderation system. Initial algorithmic flagging filters obvious violations, escalating flagged content to specialized AI analysis for final disposition.

### Technical Constraints & Security
- **Authoritative Resolution:** The multiplayer server is the final source of truth. Client-side local state edits are strictly validated against the server timeline upon synchronization to prevent cheating.
- **AI Cost Mitigation:** The architecture mandates strict cost-monitoring telemetry. The platform must structurally prevent asymmetrical token usage (where API costs exceed a user's subscription or token balance) through hard operational stopgaps.

### Trust & Safety (Community)
- **Robust Player Management:** The system requires an account-wide blocking system preventing matched encounters/interactions with blocked players across all campaigns.
- **Anti-Bot Defenses:** Tiered restriction levels identify and quarantine malicious bot traffic attempting to scrape game rules or abuse LLM integration.
- **Campaign Continuation Tooling:** GMs can seamlessly dismiss toxic players mid-campaign and immediately assume manual control of the character or delegate it to the AI.

## 6. Innovation Analysis
- **Latency-Masked Asynchronous Combat:** Challenges synchronous combat assumptions. Local-first caching combined with an authoritative server "Event Ledger" creates near real-time responsiveness while queueing actions for conflict-free background syncing.
- **Componentized Rules Translation:** GMs type plain-text hypothetical rules which the LLM maps against a strict library of valid game configurations. This guarantees 100% parsing accuracy and enables highly efficient, low-cost AI models.
- **Predictive Balancing Engine:** Runs headless simulations of encounters *before* they happen, offering the GM a predictive win-rate percentage and dynamic adjustment suggestions.

**Competitive Differentiator:** By hybridizing play-by-post momentum with VTT mechanical rigidity, the platform serves the "Schedule-Starved Player," competing against casual mobile games rather than just other VTTs.

## 7. Project-Type Requirements
- **Unified SPA Strategy:** Built as a React-based Single Page Application (SPA) deployed cross-platform utilizing Expo. Ensures maximum code-reuse between web, iOS, and Android clients without sacrificing native-feeling mobile UX.
- **Decoupled SEO Strategy:** The core VTT app is an authenticated, non-indexable SPA. The Community Marketplace will be built as a separate, fully SEO-optimized platform. The core app integrates via API for content ingestion.

## 8. Functional Requirements

### 1. User Account & Profile Management
**Primary Path (Core Usage)**
- **FR1:** Users can access the core visual character sheet builder entirely offline without creating an account.
- **FR2:** Users can create and authenticate accounts using standard SSO or email credentials.
- **FR3:** Authenticated users can search for, add, and manage a "Friends List" of other players on the platform.
- **FR4:** Users with a premium cloud subscription can continuously synchronize their character data and campaign state across all authenticated devices.
- **FR5:** Users can configure a Player Profile displaying their gaming preferences and active campaigns, with toggles for public/private visibility.

**Edge Cases & Administrative**
- **FR6:** Users can manage an account-wide blocklist that prevents matchmaking or direct interaction with specified users.
- **FR7:** The system can restrict account creation to users acknowledging they are 17+ years of age.
- **FR8:** Users can manually trigger a one-time export of their local character data at any time.
- **FR9:** Users can execute standard account management actions including password resets and complete account deletion (Right to be Forgotten).

### 2. Character Generation & Playable Sheets
**Primary Path (Core Usage - The Player)**
- **FR10:** Users can view, search, and sort a library of their saved characters (e.g., sort by 'Last Accessed', filter by 'Game System', or manually rearrange into groups).
- **FR11:** Users can instantly generate a mathematically optimal character by selecting only a Class and Level, leveraging RL-trained AI data models.
- **FR12:** The system can guide users through an interactive, step-by-step modification wizard to customize their AI-generated (or manually built) character.
- **FR13:** Users can partition distinct data sections within their character sheet into "Public" (viewable by other players), "Private" (viewable only by the player), and "GM-Only" visibility states.
- **FR14:** Users can interact with their generated character sheet to execute mechanical game actions (e.g., rolling dice for attacks, logging inventory).
- **FR15:** Users can manually override system-calculated values (e.g., forcing a derived Armor Class value).
- **FR16:** Users can create and play these interactive character sheets entirely offline.

**Edge Cases & Administrative (Secondary Creator Tooling)**
- **FR17: Custom Game Components**
Platform Admins or authorized creators can define new component definitions (attributes, derived stats) and underlying structured data representations to support non-standard game systems.
- **FR18:** Creators can export their custom character sheet JSON configurations to local device storage, and import valid JSON layouts.

### 3. Campaign Setup & Social Hub
**Primary Path (Core Usage)**
- **FR19:** GMs can create, name, and manage distinct instances of RPG campaigns.
- **FR20:** GMs can select the game system, specific adventure path, and active rulesets via a hierarchical menu during campaign creation.
- **FR21:** Users can join an active campaign via an invite link and seamlessly select an existing character or create a new one to bind to that campaign.
- **FR22:** GMs can create and publish a static set of "House Rules" visible to all players within the campaign dashboard.
- **FR23:** Users can view the names, avatars, and public character sheet data of all other active players within their joined campaign.
- **FR24:** Users can communicate via distinct text channels (e.g., Out-of-Character, In-Character) and organize extended RP conversations via nested threads (e.g., a "Long Rest" dialogue).
- **FR25:** GMs can upload, manage, and assign a library of 2D Battlemaps and static imagery (e.g., NPC portraits, scenic vistas) to specific encounters.
- **FR26:** GMs can upload or select audio tracks and trigger streaming battle music/ambience for all connected players.
- **FR27:** GMs can toggle specific campaign mechanics between "Theater of the Mind" (narrative/image-based) and "Tactical" (Battlemap/Grid-based).
- **FR27b:** GMs can apply distinct visual themes (e.g., Gritty B&W for Shadowdark, Vibrant for Pathfinder, Anime-styled) to a campaign instance, changing the global UI styling for all participating players.

### 4. Asynchronous Gameplay & Encounter Resolution
**Primary Path (Core Usage)**
- **FR28:** Users can submit mechanical actions (rolling dice, moving on a grid) while entirely offline.
- **FR29:** The system can automatically sync and chronologically resolve offline actions into the authoritative server timeline upon reconnection.
- **FR30:** Users can receive contextual mobile push notifications framed narratively (e.g., "The Goblin lunges at you, what do you do?") when an action dictates their mandatory input.
- **FR31:** Users can execute an "Initiative Roll" to inject their character into a formal turn order when the GM starts tactical combat mode.
- **FR32:** Players can view the active 2D battlemap, including the real-time or async coordinates of their character token and visible adversaries.
- **FR33:** Players can send dice roll results from third-party VTT trackers (e.g., Beyond20) directly to the Dungeons with Friends campaign log via webhook ingest or native extension.
- **FR34:** The system can parse user-inputted dice notation natively (e.g., 2d6+4) and mathematically resolve the outcome.
- **FR35:** GMs can manually build encounters by searching a Compendium database and adding pre-configured monsters to the game state.
- **FR36:** The system can conduct headless background simulations of GM-built encounters to predict the probability of player victory and surface balance metrics.
- **FR37:** The system can generate a succinct, NL (Natural Language) summary of missed campaign events, presented immediately upon a user re-entering an active campaign.

**Edge Cases & AI Overrides**
- **FR38:** GMs can configure specific game-state actions to require manual GM approval before execution (e.g., halting the AI from executing a killing blow).
- **FR39:** GMs can intercept, modify, or veto any AI-generated combatant action.
- **FR40:** GMs can input plain-text hypothetical rules, which the system can map to valid underlying engine configurations.
- **FR41:** Auto-Rollback: The system can execute a rollback of the game state if a delayed offline action mechanically conflicts with the server state, presenting a differential conflict report to the user.
- **FR42:** GMs can forcefully dismiss a player from a campaign, seamlessly assigning their character to either GM or AI control.

### 5. Marketplace & Community Content
- **FR43:** Creators can upload custom character sheet templates and rule configurations to a public marketplace.
- **FR44:** Platform Administrators can automatically curate and publish official System Templates via API based on licensing agreements.
- **FR45:** Users can purchase or access premium templates utilizing a platform-specific token economy.
- **FR46:** The system can algorithmically scan all UGC marketplace uploads to flag content violating community guidelines.

### 6. Administration & Platform Telemetry
- **FR47:** Platform Administrators can view an immutable, chronological playback of all mechanical actions, chat logs, and token expenditures within a specific campaign instance.
- **FR49:** The system can identify and restrict accounts exhibiting automated bot-like scraping behavior.

## 9. Non-Functional Requirements

### Performance & Reliability
- **NFR1:** Rendering of 2D Battlemaps (via Canvas/Three.js) must maintain a minimum of 30fps consistently on hardware representing the 80th percentile of active mobile devices.
- **NFR2:** Offline-to-Online state synchronization (merging the local TinyBase ledger with the server ledger) must complete background resolution in under 3 seconds upon network reconnection without blocking the user interface.
- **NFR3:** The native dice math-parser component must calculate and display results in under 200ms.

### Security
- **NFR4:** The architecture must structurally enforce hard processing caps on LLM API token utilization per user/campaign to prevent asymmetrical financial abuse.
- **NFR5:** All user generated content (UGC) uploaded to the community marketplace must pass through the automated two-tiered moderation filter before attaining public visibility statuses to comply with App Store review guidelines.

### Scalability
- **NFR6:** The authoritative Server Event Ledger must support concurrent write actions from multiple players within the same campaign instance (e.g., three players rolling initiative simultaneously) without queuing deadlocks or data corruption.

### Accessibility
- **NFR7:** The core mobile VTT application—specifically Character Sheets, Chat Interfaces, and Push Notifications—must be fully navigable and semantically parsable by native iOS (VoiceOver) and Android (TalkBack) screen readers.
- **NFR8:** The Desktop Web application experience must support 100% keyboard-only navigation for all core gameplay actions to satisfy WCAG 2.1 AA compliance standards.

### Integration
- **NFR9:** The system must expose stable, authenticated incoming webhook endpoints capable of accepting and parsing standard JSON payloads from major 3rd-party VTT tracker tools (e.g., D&D Beyond).
