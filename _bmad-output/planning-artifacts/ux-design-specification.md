---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
inputDocuments: ['prd.md', 'architecture.md', 'product.md', 'productroadmap.md']
---

# UX Design Specification Dungeons With Friends

**Author:** Derek
**Date:** 2026-03-05

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision
Dungeons with Friends is a mobile-first, offline-capable Virtual Tabletop (VTT) platform engineered to solve the "scheduling boss." It shifts TTRPG gaming from synchronous, 4-hour live sessions into asynchronous, bite-sized mobile interactions, fully resolving state changes offline while reconciling with the authoritative server timeline. It pairs this Player experience with powerful, bounded AI tooling for Game Masters (to speed prep) and robust schema editors for System Creators (to monetize custom mechanics).

### Target Users
- **The Time-Starved Player (The Commuter):** Engages via mobile offline asynchronously. Requires one-handed playability, immediate context restoration ("What did I miss?"), and zero friction from complex spreadsheets.
- **The Modern Game Master (GM):** Needs reduced prep time via AI-assisted balance tools, streamlined asynchronous combat pacing, and ultimate, overrideable authority over all game states.
- **The System Tinkerer / Creator:** Demands deep, component-level control to build and monetize rule-system templates via a responsive WYSIWYG desktop editor.

### Key UX Design Challenges
- **The "Catch-Up" Burden:** Players logging in after 12 hours face a wall of mechanical chat logs and completely lose the narrative thread.
- **The Synchronous Map Paradigm:** Traditional VTTs demand 80% screen space for a grid map that is largely useless for 90% of a Commuting Player's asynchronous turn decisions.
- **Offline Sync Conflicts (The Dead Action):** High-friction errors occur when a player's offline action (e.g., attacking a goblin) becomes invalid because another player slew the target on the authoritative server timeline first.
- **The Creator vs. Player UI Tension:** Building an interface that allows complex, unconstrained layout-building for Creators without sacrificing the clean, one-handed efficiency required by the Commuting Player.

### Design Opportunities & Paradigms
- **The "Action-Card" Interface (Banish the Spreadsheet):** Player UX prioritizes contextual action buttons (e.g., [ 🗡️ Attack Orc ]) over a dense character sheet, bubbling up the 3 most relevant actions based on game state.
- **HUD (Heads-Up Display) Overlay:** Consolidate the Map and Character vital stats into a unified overlay—the map acts as the constant background while essential, semi-transparent vitals frame the edges, maximizing the limited mobile viewport.
- **"Previously On..." Narrative Digests:** Leverage AI to automatically compress 40 turns of offline mechanical logs into a stylized, 3-bullet narrative "Story Card" presented immediately upon opening the app.
- **The "Rewind & Redirect" Sync Protocol:** Instead of deleting a conflicted offline action, intercept the error with a friendly, full-screen interstitial (e.g., "While you were away... Player B slew the Goblin! Your attack rolled a 16. Who do you hit instead?"), transforming a failure state into an empowering redirect.
- **Definitive Local-First UI State:** The interface must *never* display a hanging loading spinner. Actions resolve visually and instantly on the client with a subtle "Saved Locally - Synching" stamp, ensuring the commuter can finish their turn in a dead zone and close the app securely.
## Core User Experience

### Defining Experience
The defining interaction of Dungeons with Friends is the ability to rapidly comprehend the current narrative game state and execute a meaningful mechanical turn (e.g., attacking or casting a spell) asynchronously, off a single mobile push notification, within 3 to 5 minutes of total session time.

### Platform Strategy
- **Mobile VTT (The "Play" App):** Native iOS/Android apps (or highly optimized PWA) utilizing touch. Designed strictly for one-handed operation. No complex sheet builders. Optimized for offline-first data sync.
- **Desktop Web VTT (The "Create" App):** A robust web application featuring keyboard/mouse navigation (NFR8). Reserved for GMs building complex encounters and Creators designing fully responsive, component-driven custom game sheets (FR17).

### Effortless Interactions
1. **Opening the App:** Bypasses standard Main Menus entirely, dropping the player directly into the latest "Story Card" narrative digest for their active campaign.
2. **Contextual "Action Cards":** Tapping the most statistically likely action (e.g., primary weapon attack) directly from the unified HUD overlay, saving 3-4 taps compared to hunting in a traditional character sheet.
3. **Local-First Resolution:** Pressing an action button yields an instant, satisfying dice-roll animation, registering the state changes locally regardless of cellular connection strength.

### Critical Success Moments
- **The "Aha!" Commuter Moment:** When a player realizes they just took a meaningful turn in their D&D campaign while waiting in line for coffee, without holding up the rest of the table.
- **The Conflict Pivot:** When a player encounters an asynchronous sync conflict (e.g., their target is already dead) and the UI elegantly pivots them to a new target without deleting their previously rolled successful attack.
- **The GM Prep Win:** When a Game Master uses the AI-assisted tool to balance an encounter in 30 seconds instead of manually computing CR ratings for 30 minutes.

### Experience Principles
1. **Narrative Over Mechanics:** Surface the story first. The numbers support the narrative; the numbers are not the primary interface.
2. **One-Handed Playability:** If a core action on the mobile app requires two hands or pinch-to-zoom navigation, the design has failed.
3. **Definitive Local State:** Never leave the user hanging on a loading screen. Actions must resolve locally and instantly to respect the commuter's fragmented time.
## Desired Emotional Response

### Primary Emotional Goals
- **For the Commuting Player:** **"Effortlessly Connected."** They should feel like they are actively participating in an epic adventure with their friends, without the crushing anxiety of holding up the group or being overwhelmed by mechanics.
- **For the Game Master:** **"Empowered and Organized."** They should feel like a brilliant director who has all the tools they need to push the narrative forward, without the exhaustion of manual math and prep.
- **For the System Creator:** **"Unconstrained and Professional."** They should feel like they are using a premium, developer-grade toolset to build something worthy of selling.

### Emotional Journey Mapping
- **Discovery/Onboarding:** *Relief.* "Wow, I just built a Level 5 Ranger by typing one sentence. I thought this was going to take an hour."
- **Receiving a Push Notification (The Trigger):** *Excitement.* "Oh! A goblin is attacking me!" (Instead of annoyance at another app notification).
- **Executing a Turn (The Core Action):** *Confidence.* The "Action-Card" UI makes them 100% certain they clicked the right thing.
- **Handling a Sync Conflict (The Error State):** *Amusement/Pivoting.* "Ah, Dave already killed it! Good for Dave. Let me hit the Orc instead." (Turning frustration into a collaborative high-five).
- **Closing the App:** *Accomplishment.* "I just took my turn in 45 seconds while waiting for the train."

### Micro-Emotions
- **Confidence > Confusion:** The HUD overlay only shows what matters right *now*.
- **Trust > Skepticism:** The "Local-First" visual stamp guarantees their action was saved, even if they hit a dead zone in the subway.
- **Belonging > Isolation:** The "Previously On..." digest connects their isolated 1-minute session back to the group's larger 24-hour narrative.

### Design Implications & Principles
- **The "Relief" of Onboarding:** UI must use conversational, wizard-based inputs with generous autocomplete and AI generation, hiding the complex backend JSON schemas entirely from the player.
- **The "Excitement" of Notifications:** Push notifications cannot be dry system alerts (e.g., "It is your turn"). They must be narrative-driven (e.g., "The Goblin readies its bow, targeting you!").
- **The "Confidence" of Action:** Buttons must be large, high-contrast, and unambiguous. We use bold iconography and hide secondary/tertiary actions behind menus.
## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis
**1. Discord (For the Narrative/Combat Feed)**
- **Why it works:** It handles high-density, rich-media asynchronous communication flawlessly. Users instantly recognize the structure of conversational threads.
- **UX Success:** Clear attribution. Every action, roll, and message is clearly anchored to a distinct User/Character Avatar, Name, and Timestamp, making it incredibly easy to parse chronologically without complex color-coding.

**2. Hearthstone / Marvel Snap (For the Player HUD)**
- **Why it works:** They condense deeply complex CCG mechanics (stats, buffs, turn orders) into a brilliantly visual, touch-native interface.
- **UX Success:** The "Action-Card" paradigm. Actions are physical, draggable/tappable objects at the bottom of the screen (where the thumb naturally rests), while the "Map" (the board) exists in the center.

### Transferable UX Patterns

**Navigation & Interaction Patterns:**
- **The "Discord-Style Timeline Feed":** Instead of a "Lobby," DWF opens directly into the active campaign's chronological feed. The feed relies on clearly grouped blocks featuring the Character Profile Picture, Character Name, and precise Timestamp. Chat, dice rolls, and "Story Card" digests all live in this single, scrollable narrative river.
- **The "Thumb Zone" Action Bar (from Marvel Snap):** All critical combat actions (Attack, Cast, Move) are anchored to the bottom 20% of the mobile screen. The user never has to reach the top of the screen to take a turn.

**Visual Patterns:**
- **Rich Embeds (from Discord):** Mechanical actions (like a Fireball spell roll) appear in the feed styled like Discord "Rich Embeds"—a bordered card with a thumbnail icon, the mechanical breakdown (1d20 + 5), and the primary result clearly highlighted.
- **Card-Based Modularity:** Every mechanical element (a weapon, a spell, a monster) is visually contained in a "Card" with rounded corners and consistent padding, making them feel like tangible, collectible objects rather than database rows.

### Anti-Patterns to Avoid
- **The "Desktop-in-Mobile" Squeeze:** Taking a complex, 3-column desktop layout and just shrinking the font size and stacking it on mobile. (e.g., Traditional Roll20 mobile).
- **Hamburger Menu Hiding:** Hiding core gameplay actions (like rolling a standard attack) behind a hamburger menu in the top-left corner.
- **The Infinite Scroll of Death:** Forcing a player who has returned after 12 hours to scroll through 100 mechanical dice logs to find the narrative context. (This must be solved by our AI Digest feature).

### Design Inspiration Strategy
**What to Adopt:** The Discord-style timeline with distinct Avatar/Name/Timestamp blocks and Rich Embed formatting for game mechanics. The Marvel Snap "Thumb Zone" bottom-anchored action bar for immediate, 1-click combat turns.
**What to Adapt:** The CCG Card paradigm adapted to TTRPG spells and weapons to make them feel like tangible objects rather than spreadsheet data.
**What to Avoid:** Unnecessary navigational menus upon login and squeezing desktop layouts onto mobile screens.

## Design System Foundation

### 1.1 Design System Choice
**Hybrid Headless Approach (Tailwind CSS + shadcn/ui + DnD Kit)**

### Rationale for Selection
- **Extreme Customizability (Campaign-Level Theming):** A headless system using Tailwind CSS allows the platform to radically reskin the entire UI based on the active campaign. A gritty, black-and-white 'Shadowdark' theme, a vibrant 'Pathfinder' theme, or a highly-stylized 'Anime' theme can be dynamically swapped without fighting opinionated component libraries.
- **Speed & Accessibility for Creators:** shadcn/ui provides bulletproof, accessible, complex components (modals, data grids) necessary for the Desktop Web WYSIWYG editor without the overhead of building them from scratch.
- **Drag-and-Drop Primitives:** DnD Kit handles the complex visual canvas logic required for the sheet builder.
- **Avoiding the "Corporate" Look:** Avoids the sterile, non-game aesthetic of Material UI, ensuring the mobile "Action-Cards" feel like genuine game assets.

### Implementation Approach
- **The "Play" App (Mobile VTT):** Built primarily with custom Tailwind CSS utility classes to ensure buttons, feeds, and HUD overlays feel deeply thematic to the active TTRPG system.
- **The "Create" App (Desktop VTT):** Built heavily relying on shadcn/ui primitives for rapid development of structural sidebars and complex layout tools.
- **Thematic Context Provider:** A global React Context (or state manager) that injects CSS variables and Tailwind configurations at the root level based on the GM's selected Campaign aesthetics.

### Customization Strategy
- Separate the component structure from its visual style completely. Rely on CSS variable injection (CSS custom properties) to handle typography, colors, padding, and border styles. This allows a single code component (e.g., an Action Button) to seamlessly transition from a sleek cyberpunk neon aesthetic to a parchment-and-ink fantasy aesthetic purely through a data payload.

## 2. Core User Experience

### 2.1 Defining Experience
The player receives a notification that their character is in danger. Without opening a complex character sheet or a 2D battlemap, they instantly comprehend the narrative context and execute a mechanically sound dice roll to respond.

### 2.2 User Mental Model
- **The Current Solution (Frustration):** To play D&D asynchronously right now, users use Discord text channels + a dice bot (like Avrae). It requires typing complex syntax (`!attack longsword -t goblin1`) which is terrible on mobile.
- **The Expectation:** Users expect a mobile game to feel like a *game*, not a command-line interface. They expect prominent, context-sensitive buttons.

### 2.3 Success Criteria
- **Time-to-Action:** The time from tapping the push notification to the dice rolling on screen must be under 15 seconds.
- **Zero-Syntax:** The user never has to type a mathematical formula or slash command.
- **Immediate Feedback:** The user receives a visually satisfying, tactile response (haptics + dice animation) instantly upon confirming their action, even if their cellular connection assigns it to background-sync.

### 2.4 Novel UX Patterns
**The Contextual Action Drawer:** Unlike traditional VTTs that show every possible weapon, spell, and item a character owns at all times, the UI dynamically bubbles up the 3 best options based on the target and range. (e.g., If the goblin is 60ft away, the UI hides the "Shortsword" and highlights the "Longbow").

### 2.5 Experience Mechanics
1. **Initiation (The Hook):** The player's locked phone lights up with a rich notification: *"The Goblin archer targets you! It is your turn."*
2. **Context Building (The Digest):** Tapping the notification opens the app directly bypassing any menus. The screen displays the "Previously On..." 3-bullet narrative digest, ending with the Goblin's action.
3. **Interaction (The Action-Card):** The bottom 30% of the screen slides up revealing the "Action Drawer." It prominently displays [ 🏹 Fire Longbow (1d20+5) ] and [ 🏃 Dash to Cover ].
4. **Feedback (The Roll):** The user taps "Fire Longbow." The screen immediately darkens, and a high-fidelity 3D D20 rolls across the screen, utilizing phone haptics. It lands on a 16.
5. **Completion (The Handoff):** The UI flashes green. The system mathematically resolves the hit offline. A bold text banner appears: *"Turn Complete. Waiting on the Game Master."* The user locks their phone and puts it back in their pocket.

## 3. Visual Design Foundation

### 3.1 Color System (Default Platform Theme)
*Note: Due to the Campaign-Level Thematic Styling requirement (FR27b), all colors are injected as CSS variables so they can be overridden by specific campaign themes. The following is the baseline "OLED Dark Mode" platform theme.*
- **Background (Surface):** True Black (`#000000`) to save battery and make the "HUD" pop.
- **Cards/Elevated Surfaces:** Deep Charcoal (`#1A1A1A`).
- **Primary Action (The "Roll" Button):** A vibrant, gaming-centric Electric Indigo (`#5E5CE6`).
- **Semantic Feedback:** Success/Hit is Emerald Green (`#30D158`); Danger/Miss is Crimson Red (`#FF453A`).

### 3.2 Typography System
- **Primary Typeface (UI & Mechanics):** *Inter* or *Roboto*. A clean, sans-serif font for all mechanical data (HP, dice results). Numbers must be tabular and scannable.
- **Secondary Typeface (Narrative):** *Merriweather* or *Playfair Display*. A sophisticated serif font used strictly for narrative digests and titles.
- **Scale:** Base size of 16px to adhere to mobile accessibility, preventing iOS auto-zoom on inputs.

### 3.3 Spacing & Layout Foundation
- **The Grid:** A standard 8px baseline grid system (8, 16, 24, 32).
- **Density:** High density for the Desktop "Creator" app. Low/Airy Density for the Mobile "Play" app.
- **Touch Targets:** Mobile Action Cards must have massive, 48px minimum touch targets to guarantee one-handed playability.

## 4. Design Direction Decision

### 4.1 Design Directions Explored
We generated three distinct structural directions for the "Play" interface:
1.  **The Pure Feed:** Discord-style chat and narrative focus with minimal action buttons.
2.  **The Floating HUD:** Marvel Snap-style layout where UI elements glassmorphically float over the battlemap, preserving spatial awareness. Action cards anchored to the bottom.
3.  **The Split View:** A strict 50/50 partition between narrative context and a rigid "Command Center" keypad.

### 4.2 Chosen Direction
**The "Floating HUD" (Direction 2) with Specific Modifications:**
The UI will prioritize the battlemap/narrative background, with core interface elements floating above it. 

### 4.3 Key Elements & User Modifications
Based on stakeholder feedback, the following refinements are applied to the Floating HUD:
- **Smaller Action Buttons:** The primary "Thumb Zone" action cards will be scaled down from their massive CCG size to increase the visible play area.
- **The "Overflow" Action Drawer:** To handle complex TTRPG characters (like an 18th level Wizard), a permanent "three-dot" (...) action button will exist. Tapping this slides up a comprehensive drawer containing *all* possible inventory, spells, and obscure actions.
- **Minimized Telemetry:** The Initiative Tracker and the Roll Log/Narrative Feed will not constantly dominate screen space. They will exist as minimized, collapsed widgets (e.g., a "Current Turn" pill or a "Last Action" single line) that expand into full-screen overlays with a single tap.

### 4.4 Design Rationale
This approach solves the "Desktop-in-Mobile Squeeze" by dedicating the maximum possible screen real estate to the actual game environment (the map/art), rather than trapping the player in spreadsheets. By utilizing collapsed layers for deep data (the 3-dot drawer, the clickable log), we maintain a clean "Combat HUD" feel while fully supporting the mechanical depth of FR10-FR16.

### 4.5 Implementation Approach
- Use `z-index` layering aggressively. Level 0: The Map/Art Canvas. Level 1: Collapsed Context Widgets (Turn Order, Last Log). Level 2: The bottom-anchored "Thumb Zone" actions. Level 3: The Expanding Drawers.
- Apply subtle `backdrop-blur` (glassmorphism) to all Level 1 and 2 elements so the game world remains visible underneath the UI.

## 5. User Journey Flows

### 5.1 Journey 1: The Commuting Player (The Async Turn)
**Goal:** Resolve a combat dependency in < 60 seconds with one hand.
1. **The Landing (1 tap):** User taps push notification. App opens directly to the "Floating HUD" combat view. The mapped is centered; a "3-bullet Digest" modal gives immediate narrative context.
2. **The Contextual Choice (1 tap):** User dismisses digest. The bottom "Action Drawer" is already open, dynamically bubbling up the most relevant mathematical options based on the target (e.g., a glowing "Dodge" or "Longbow" card).
3. **The Execution (1 tap + haptics):** User taps the glowing card. A 3D D20 rolls across the screen with haptic feedback.
4. **The Narrative Handoff (0 taps):** The math resolves offline immediately. A narrative toast appears summarizing the outcome (e.g., *"You hit the Goblin with your sword, leaving him bleeding profusely."*). The user locks their phone with the turn completed.

### 5.2 Journey 2: The System Tinkerer (Desktop Builder)
**Goal:** Create a custom Attribute that calculates a derived stat.
1. **The Canvas Setup:** User opens a "Blank Canvas" in the Desktop Dashboard. The WYSIWYG editor features a complex responsive layout:
    - **Left Sidebar:** UI Controls Library (inputs, buttons, text blocks).
    - **Middle Canvas:** The visual layout editor, featuring responsive breakpoint toggles (Mobile/Tablet/Web) at the top.
    - **Right Sidebar:** Component Details and Properties (Data binding, styling, logic).
2. **Component Placement:** User drags a "Number Input" from the Left sidebar to the Middle canvas. The Right panel auto-focuses on the new component.
3. **Data Binding:** User types "Sanity" into the Data Label field on the Right panel. The underlying schema updates.
4. **AI Logic Parsing:** User drags a "Calculated Text" block to the canvas and types in the AI prompt box on the Right panel: *"If Sanity is below 10, display 'Unstable'."* The system parses this into rigid JSON logic.

### 5.3 Flow Optimization Principles
- **Progressive Disclosure:** In mobile play, hide the 4-page character sheet entirely. Only surface the math relevant to the immediate context.
- **Narrative Framing:** Translate raw math (AC, HP) into narrative feedback instantly via LLM-generated UI toasts to keep players immersed.
- **Responsive-First Creation:** The desktop builder forces creators to consider mobile layouts by default via centralized viewport toggles, ensuring custom sheets don't break the FR1 mobile experience.

## 6. Component Strategy

### 6.1 Design System Components
**Available Out-of-the-Box (from shadcn/ui & DnD Kit):**
- **Desktop Builder UI:** Draggable canvas primitives, resizable sidebars, accordions for component properties, complex dropdown menus, standard form inputs (text, numbers, toggles).
- **Platform UI:** Modals/Dialogs for the "3-bullet Digest", Toast Notifications for the narrative handoff, Tabs for switching between Chat and Combat views.

### 6.2 Custom Components
The underlying Headless UI does not provide gaming-specific components. We must build:
1.  **The Contextual Action Drawer (The "Thumb Zone" HUD):** A bottom-sheet modal containing horizontally swiping "Action Cards." Supports Collasped, Expanded, and Overflow states.
2.  **The 3D Dice Object (WebGL/Three.js):** A physics-enabled 3D polyhedral object rendered over the DOM to provide visceral tactile feedback. Triggered programmatically by the Action Drawer.
3.  **The "Story Card" Rich Embed:** A bordered container inside the chronological feed displaying the Character Avatar, Timestamp, mechanical breakdown, and success/fail color border.

### 6.3 Component Implementation Strategy
- Build custom components using the Tailwind CSS utility classes defined by our Campaign-Level theming strategy.
- Ensure the Action Drawer buttons have massive, 48px minimal touch targets.
- Abstract the 3D Dice Object so it can be called programmatically via a simple React hook (`useDiceRoll(1d20+5)`).

### 6.4 Implementation Roadmap
- **Phase 1 (Core):** Build the "Story Card" and the "Action Drawer". These are required for the MVP play-by-post asynchronous loop (Journeys 1 & 2). We will use simple math generation initially.
- **Phase 2 (Enhancement):** Integrate the 3D Dice Object. Once the logic holds, we add the WebGL physics layer for polish.
- **Phase 3 (Expansion):** Build custom Desktop Wizard components for mapping AI logic to the visual sheet builder canvas.

## 7. UX Consistency Patterns

### 7.1 Button Hierarchy & Interaction
- **Primary Actions:** Reserved *only* for advancing the game state (e.g., "Roll Attack", "End Turn"). These are massive (min 48px height), use the `--accent-primary` color, and are always anchored to the bottom edge of the screen on mobile ("Thumb Zone").
- **Secondary Actions:** Used for navigation or non-destructive choices. Styled as outlined buttons or subdued `--bg-elevated` surface colors.
- **Destructive Actions:** (e.g., "Delete Campaign"). Always use the `--accent-danger` color, and *always* require a confirmation modal to prevent accidental data loss.

### 7.2 Form & Data Entry Patterns (Desktop Creator)
- **Auto-Save by Default:** There is no "Save" button in the Desktop Builder. Every drag-and-drop or text input `onChange` event debounces and auto-saves to local state immediately.
- **Inline Validation:** If a creator types an invalid JSON key, the input highlights red immediately with helper text. The system does not wait for submission to flag errors.

### 7.3 Feedback & Telemetry Patterns
- **Haptic Affirmation:** Every time mathematical data changes the game state, a distinct haptic vibration triggers on mobile.
- **The "Narrative Toast":** Brief feedback uses a top-down sliding toast notification lasting 4 seconds. It translates mechanical math into narrative flavor (e.g., *"Nat 20! You critically strike the Ogre."*).

### 7.4 Modal & Overlay Patterns
- **The Bottom Sheet (Mobile):** Complex interactions (spellbook, overflow menus) NEVER navigate to a new page. They slide up as a "Bottom Sheet" overlay covering 80% of the screen, swipeable to dismiss.
- **The Center Dialog (Desktop):** Deep configuration (like setting up API webhooks) opens as a standard centered modal dialog to focus attention away from the complex builder canvas.

## 8. Responsive Design & Accessibility

### 8.1 Breakpoint Strategy & Paradigms
- **Mobile (< 768px): The "Play" Paradigm:** Single-column focus. The WYSIWYG sheet builder is fully disabled at this resolution. Bottom-anchored navigation and action drawers.
- **Tablet (768px - 1024px): The "Hybrid" Paradigm:** Combat map and narrative feed side-by-side. Sheet Builder operates in a simplified preview mode. Touch targets remain large.
- **Desktop (1024px+): The "Creator" Paradigm:** Maximum information density. Multi-column layouts (3-column Sheet Builder). The combat map, initiative tracker, and full sheets are open simultaneously.

### 8.2 Accessibility Strategy (WCAG 2.1 AA Target)
- **Color Contrast:** All tokenized themes (including user-generated CSS overrides) will trigger programmatic warnings in the builder if text contrast falls below 4.5:1.
- **Screen Readers:** The "Action Drawer" and "Narrative Feed" must be fully navigable via iOS VoiceOver and Android TalkBack. Mathematical tables must have literal ARIA labels (`aria-label="Strength Score: 18"`).
- **Motion:** A global "Reduce Motion" toggle will disable 3D WebGL dice rolls and sliding overlay animations, instantly snapping states instead.

### 8.3 Implementation & Testing Guidelines
- **Mobile-First CSS:** UI development will utilize Tailwind `min-width` media queries, writing mobile base styles first.
- **Automated A11y:** The CI/CD pipeline will include `axe-core` to catch structural accessibility violations (missing ARIA, bad heading hierarchy) before code merges.
