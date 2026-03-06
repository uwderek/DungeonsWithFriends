Dungeons with Friends
Dungeons with Friends is a web-based, mobile-first virtual tabletop (VTT) application for playing tabletop role-playing games (TTRPGs) online either synchronously or asynchronously. It is designed to be a modern, intuitive, and powerful tool for both Game Masters (GMs) and players.

Core Tabletop Features:

Map Management: Simple upload functionality for static map images (JPG, PNG, WebP).

Grid System: Support for square grids with user-configurable opacity and color. An innovative, fast grid alignment tool inspired by Owlbear Rodeo's praised implementation.  

Token Management: Ability to upload custom tokens, place them on the map, move and resize them, and lock them in place. A simple set of status effect markers will be included.

Drawing Tools: A basic suite of drawing tools, including a freehand pen, simple shapes (circle, square), and a measurement tool for distances.

Basic Fog of War: A simple, manual tool for the GM to paint over and reveal areas of the map.  

Dice Roller: A text-based dice roller integrated into the chat log, supporting standard notation (e.g., /roll 2d20+5).

Core Session Features:

Integrated Text Chat: A real-time chat log with channels for public messages and GM-only ("whisper") messages.

Journal/Handouts: A simple journal system where GMs can create text and image-based handouts and share them with players.

Basic Initiative Tracker: A simple list for the GM to input and reorder character and monster names for tracking turn order.

Onboarding: The onboarding process will be radically simple, mirroring the "one-click" flow of Owlbear Rodeo. The GM creates a game, receives a unique URL, and shares it with players. Players will not be required to create an account to join, removing a significant barrier to entry.  

Milestone 2: Enhancing the Core — "The Seamless Session" Goal: To achieve feature parity with the premium offerings of Roll20 and the core feature set of Foundry VTT. This milestone will establish the one-time purchase as a compelling value proposition and the definitive platform for "Ambitious GMs."

Advanced Tabletop Features:

Dynamic Lighting: This is a critical feature for the modern VTT user. The implementation will include tools for drawing walls that block vision, placing configurable light sources, and calculating player line-of-sight in real-time.  

Animated Maps: Support for using video files (e.g., WebM, MP4) as map backgrounds, a feature GMs use to increase immersion.  

Advanced Grids: Introduction of hexagonal grid support for games that require it.

Multi-Layered Maps: A layer system allowing GMs to place objects on a map layer, a token layer, a GM-only information layer, and an "above token" layer for elements like weather effects or tree canopies.  

Character & Game Management:

Interactive Character Sheets: A flexible, system-agnostic character sheet builder will be introduced, allowing GMs to create sheets for any game system. This will be accompanied by a pre-built, fully functional sheet for a popular system like D&D 5e (using the SRD).  

Click-to-Roll: Functionality on character sheets to allow players to click a skill, ability, or attack to automatically perform the corresponding dice roll in the chat log.

Compendium System: A powerful library feature for GMs to create and organize their own content (monsters, items, spells). This content will support drag-and-drop functionality, allowing a GM to drag a monster from the compendium directly onto the map to create a token with its stats pre-populated.  

Integrated Communication:

Implementation of integrated voice and video chat using WebRTC, providing an all-in-one communication solution within the platform.  

Milestone 3: Building the Ecosystem — "Platform and Community" Goal: To construct a long-term, defensible moat by fostering a vibrant ecosystem of creators and users, directly challenging the network effects of Foundry VTT and Roll20.

Extensibility:

Module API: The release of a stable, well-documented JavaScript API that allows community developers to create and share add-on modules that extend the VTT's functionality.  

Custom Sheet Sharing: An enhancement to the character sheet builder that allows community members to publish and share their custom sheets for any game system, making the platform more attractive for a wider variety of TTRPGs.

Marketplace & Content:

Launch of the official marketplace for selling and distributing official content packs (adventures, rulebooks) and high-quality community-created content.

Content Importers: To reduce the friction of switching platforms, tools will be developed to help users import their purchased content from other major services (e.g., D&D Beyond) or their self-created content from other VTTs. This directly addresses the "sunk cost" problem that keeps users locked into platforms like Fantasy Grounds.  

Community Features:

Game Finder (LFG): A robust "Looking for Group" system where GMs can list upcoming games and players can apply to join, a key community feature of Roll20.  

User Profiles & Campaign History: Features allowing users to create public profiles, showcase their gaming history, and connect with other players.

Character Vault: A feature, similar to Roll20's paid tier, allowing players to create and store their characters independently of a specific campaign and move them between games.  

Milestone 4: The Cutting Edge — "Next-Generation Immersion" Goal: To innovate beyond the current market standards by integrating next-generation features that deepen immersion, cater to new playstyles, and empower content creators.

Immersive Features:

"Narrative Mode": A dedicated UI mode inspired by Alchemy RPG that hides the tactical interface elements (grids, toolbars) to focus on full-screen artwork, ambient music, and descriptive text, allowing for a more cinematic storytelling experience.  

Advanced Audio Engine: Introduction of spatially-aware audio, where sounds can be placed on the map and their volume changes based on player proximity. This will include a built-in soundboard and potential integrations with dedicated audio services like Syrinscape.  

3D Elements: The introduction of 3D dice with physics-based rolling. The architecture will be expanded to support the import and use of 3D models for tokens and terrain pieces, laying the technical groundwork for an eventual full 3D mode.  

Creator & Streamer Tools:

Streamer View: A dedicated output view for streaming software like OBS. This view will provide a clean player-facing interface, support for custom overlays, and features for audience interaction, taking inspiration from Alchemy's "Watcher Mode".  

Adventure Authoring Tools: A comprehensive suite of tools for content creators to easily package their adventures for the marketplace. This will allow them to bundle maps with pre-configured walls and dynamic lighting, link journal entries, and place monster tokens, streamlining the creation process for premium content.

Core Pillars
Intuitive by Default, Powerful when Needed: A clean, modern UI that is easy for new users to learn, with advanced features accessible but not intrusive.
Component-based: The application is built around a component-based architecture, allowing for a modular and maintainable codebase.  The mapping tool used, the character sheet builder, etc. are all components that can be used and reused in separate applications (such as a standalone offline character sheet for playing at conventions).
Performance First: A fast, responsive experience built on a modern tech stack, avoiding the lag common in older VTTs.
Aesthetic Excellence: A beautiful and visually appealing interface that enhances immersion and user enjoyment. Overall, it is much simpler and hides the complexity of all the functionality.
Seamless Flow: Effortless transitions between "Narrative Mode" (artwork, music, text) and "Tactical Mode" (grids, tokens, lighting).