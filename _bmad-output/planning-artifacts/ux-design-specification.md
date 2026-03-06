---
stepsCompleted: [1, 2]
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
- **Platform Bifurcation (Play vs. Create):** Restrict complex WYSIWYG component-editing and layout building exclusively to the Desktop/Web app—allowing Creators to design responsive layouts spanning mobile to desktop—while keeping the native mobile app hyper-optimized for AI-guided wizard onboarding and pure gameplay.
