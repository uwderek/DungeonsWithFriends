# Story 1.3: Custom Component Definition for Creators (Desktop)

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Creator,
I want to define new data components and structured data representations (via JSON),
so that I can build sheets and templates for non-standard game systems.

## Acceptance Criteria

1. **Given** a Creator is using the Desktop Web version (viewport ≥ 1024px)
   **When** they navigate to the Creator Tools section
   **Then** they see a Component Editor interface with a list of existing component definitions and an option to create new ones

2. **Given** a Creator opens the Component Editor
   **When** they initiate a new component definition
   **Then** they can define custom data attributes including: component name, data type (text, number, boolean, select, calculated), label, default value, and validation rules

3. **Given** a Creator is editing a component definition
   **When** they type an invalid value (e.g., invalid JSON key, empty required field)
   **Then** inline validation highlights the error immediately with descriptive helper text (no "submit to see errors" pattern)

4. **Given** a Creator makes any change to a component definition
   **When** the onChange event fires
   **Then** the change is debounce-saved to the local TinyBase store automatically (no "Save" button)
   **And** a subtle "Saved" indicator confirms persistence

5. **Given** component definitions are stored in TinyBase
   **When** the Creator returns to the Component Editor later
   **Then** all previously defined components are loaded and displayed for editing or deletion

6. **Given** a user is on a mobile device (viewport < 1024px)
   **When** they attempt to access Creator Tools
   **Then** the WYSIWYG/Component Editor features are not rendered and a message indicates desktop is required for creation tools

7. **Given** the Creator has defined component definitions
   **When** these definitions are persisted in TinyBase
   **Then** the data uses strict Zod-validated `snake_case` schemas compatible with the existing data architecture

## Tasks / Subtasks

- [ ] Task 1: Define Zod Schemas for Component Definitions (AC: 7)
  - [ ] Create `src/features/creator/model/component-schemas.ts` with Zod schemas for `component_definition` table
  - [ ] Define supported data types enum: `text`, `number`, `boolean`, `select`, `calculated`
  - [ ] Define validation rule schemas (min, max, required, pattern, options for select)
  - [ ] Create `component-schemas.test.ts` with full validation coverage
- [ ] Task 2: Create TinyBase Component Store Integration (AC: 4, 5)
  - [ ] Create `src/features/creator/model/component-store.ts` — hooks and helpers for component CRUD against TinyBase
  - [ ] Implement `useComponentDefinitions()` hook to list all definitions
  - [ ] Implement `useComponentDefinition(id)` hook for single definition
  - [ ] Implement `createComponentDefinition()`, `updateComponentDefinition()`, `deleteComponentDefinition()` mutations
  - [ ] Implement debounced auto-save logic (300ms debounce)
  - [ ] Create `component-store.test.ts` with full CRUD test coverage
- [ ] Task 3: Build Component List View (AC: 1, 5)
  - [ ] Create `src/features/creator/ui/component-list.tsx` — displays all existing component definitions as cards
  - [ ] Include "Create New Component" action button
  - [ ] Each card shows: name, type badge, label, edit/delete actions
  - [ ] Empty state with guidance text for first-time creators
  - [ ] Create `component-list.test.tsx`
- [ ] Task 4: Build Component Editor Form (AC: 2, 3, 4)
  - [ ] Create `src/features/creator/ui/component-editor.tsx` — form for creating/editing a single component definition
  - [ ] Fields: component_name, data_type (dropdown), label, description, default_value (type-aware input), required toggle, validation rules
  - [ ] Implement inline validation using Zod `.safeParse()` with real-time field-level error display
  - [ ] Implement onChange auto-save with debounce and "Saved" indicator
  - [ ] Desktop layout: properties panel styling with high-density form layout
  - [ ] Create `component-editor.test.tsx`
- [ ] Task 5: Build Creator Tools Screen & Desktop Gate (AC: 1, 6)
  - [ ] Create `src/features/creator/ui/creator-tools-screen.tsx` — container for creator functionality
  - [ ] Implement responsive gate: render full editor on desktop (≥1024px), show "Desktop Required" message on mobile
  - [ ] Route integration: wire into App.tsx navigation (accessible via "Settings" tab or dedicated creator route on desktop sidebar)
  - [ ] Create `creator-tools-screen.test.tsx`
- [ ] Task 6: Wire Navigation to Creator Tools (AC: 1)
  - [ ] Add "Creator Tools" entry point accessible from the dashboard or settings on desktop
  - [ ] Ensure navigation respects current auth/offline state
- [ ] Task 7: Validation & Full Test Suite (all ACs)
  - [ ] Verify all existing tests still pass (regression guard)
  - [ ] Verify component definitions round-trip through TinyBase correctly
  - [ ] Verify mobile gate prevents editor rendering on small viewports
  - [ ] Verify inline validation fires on invalid input

## Dev Notes

### Architecture Constraints (MUST FOLLOW)

- **Feature-Sliced Design (FSD):** All creator feature code MUST go under `src/features/creator/`. Create subdirs: `ui/`, `model/`, `lib/` as needed. Do NOT put creator screens under `src/shared/` — that is only for cross-cutting infrastructure.
- **Offline-First Mandate:** All component CRUD operates against local TinyBase store ONLY. No network calls. No loading spinners. Changes are instant.
- **Zod Schemas:** All component definition data schemas MUST use `snake_case` keys (e.g., `component_name`, `data_type`, `default_value`) per architecture rule for Postgres/Nhost mapping.
- **Desktop-Only Feature:** The Component Editor MUST only render on desktop viewports (≥1024px). On mobile, show a clear message that creation tools require the desktop web app. Reference UX Spec: "Mobile (< 768px): The WYSIWYG sheet builder is fully disabled at this resolution."
- **Auto-Save Pattern:** Per UX spec Section 7.2: "There is no 'Save' button in the Desktop Builder. Every drag-and-drop or text input onChange event debounces and auto-saves to local state immediately."
- **Inline Validation:** Per UX Spec Section 7.2: "If a creator types an invalid JSON key, the input highlights red immediately with helper text."

### Naming Conventions (MANDATORY)

| Context | Convention | Example |
|---------|-----------|---------|
| Files | `kebab-case.tsx` | `component-editor.tsx` |
| Components | `PascalCase` | `ComponentEditor` |
| Variables/hooks | `camelCase` | `useComponentDefinitions`, `handleSave` |
| Zod/TinyBase keys | `snake_case` | `component_name`, `data_type` |

### Existing Code to Extend (DO NOT RECREATE)

- **`src/shared/providers/sync-provider.tsx`**: Contains `SyncProvider` with TinyBase `Provider` and `useCreateStore()`. The TinyBase store is created here — all features access it via `useStore()` from `tinybase/ui-react`. Do NOT create a second TinyBase store.
- **`src/shared/providers/auth-provider.tsx`**: Has `useAuth()` hook with `isAuthenticated`, `offlineMode`, `user`. Use to determine if creator tools should be accessible.
- **`src/shared/theme/theme-provider.tsx`**: Theme system with CSS variable tokens. All UI must read from CSS variables, not hardcoded values.
- **`src/shared/ui/atoms/base-card.tsx`**: Re-themeable base card component. Extend for component definition cards.
- **`src/shared/ui/skeleton-card.tsx`**: Skeleton loading component. Use for loading states if needed.
- **`App.tsx`**: Current routing logic uses `useState` for screen navigation. Creator tools route needs to integrate here.
- **`global.css`**: CSS variable definitions for the theme system.
- **`tailwind.config.js`**: Tailwind config referencing CSS variables. Use existing color tokens.

### UX Requirements (from UX Design Specification)

- **Desktop "Creator" Paradigm (≥1024px):** Maximum information density. Multi-column layouts. High density forms.
- **Journey 2 (System Tinkerer):** UX spec describes the Desktop Builder with Left Sidebar (UI Controls Library), Middle Canvas (visual layout editor), Right Sidebar (Component Details and Properties). For THIS story, we're building the Component Properties/Data Definition layer — the Right Sidebar equivalent as a standalone editor. The full drag-and-drop canvas comes in a later story.
- **Auto-Save:** No "Save" button. onChange debounce → TinyBase persist.
- **Inline Validation:** Invalid input → immediate red highlight + helper text.
- **Form Density:** High density for desktop. Use compact form fields with labels above inputs.
- **No Loading Spinners:** Use skeleton shimmer if loading states are needed.
- **Touch Targets:** Not critical for this desktop-only feature, but maintain 48px min for any buttons.

### Theme Design System (Use Existing Tokens)

All UI in this feature MUST use the existing CSS variable tokens from `global.css` and `tailwind.config.js`:
- Background: `bg-background-primary` (OLED black), `bg-background-secondary` (charcoal surface)
- Accent: `accent-primary` (Electric Indigo for CTAs), `accent-secondary` (Amber for highlights)
- Text: `typography-primary` (light text), `typography-secondary` (muted text)
- Fonts: `font-heading` (Cinzel serif for section titles), `font-body` (Inter sans-serif for form labels/inputs)
- Cards: Use `bg-background-secondary` surface with subtle borders
- Error states: Use `error-500` for inline validation highlights
- Success states: Use `success-500` for "Saved" indicator

### Component Definition Data Model

```typescript
// Zod schema for component_definition TinyBase table
const componentDefinitionSchema = z.object({
  component_id: z.string().uuid(),
  component_name: z.string().min(1).max(64).regex(/^[a-z][a-z0-9_]*$/, 
    "Must start with lowercase letter, only lowercase letters, numbers, underscores"),
  display_label: z.string().min(1).max(128),
  description: z.string().max(512).optional(),
  data_type: z.enum(["text", "number", "boolean", "select", "calculated"]),
  default_value: z.string().optional(), // Stored as string, parsed by type
  is_required: z.boolean().default(false),
  validation_rules: z.object({
    min: z.number().optional(),           // For number type
    max: z.number().optional(),           // For number type
    min_length: z.number().optional(),    // For text type
    max_length: z.number().optional(),    // For text type
    pattern: z.string().optional(),       // Regex for text type
    options: z.array(z.string()).optional(), // For select type
    formula: z.string().optional(),       // For calculated type (e.g., "strength_mod + proficiency")
  }).optional(),
  sort_order: z.number().int().default(0),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
```

### TinyBase Table Structure

```
Table: "component_definitions"
Row ID: component_id (UUID)
Cells: component_name, display_label, description, data_type, default_value,
       is_required, validation_rules (JSON string), sort_order, created_at, updated_at
```

**Note:** `validation_rules` is a JSON-serialized string in TinyBase (TinyBase cells are scalar — strings, numbers, booleans). Parse/stringify on read/write.

### Technical Stack (EXACT VERSIONS — Already Installed)

- **TinyBase:** `tinybase` v8.0.0 — Use `useStore()` from `tinybase/ui-react`
- **Zod:** `zod` v4.3.6 — For schema validation
- **NativeWind v4:** `nativewind` v4.2.2 — Tailwind classes for styling
- **React Native:** 0.83.2 with React 19.2.0
- **Lucide Icons:** `lucide-react-native` v0.577.0 — For editor icons (Plus, Trash2, Edit, Save, etc.)

**DO NOT install new dependencies.** Everything needed is already in `package.json`.

### Testing Standards (MUST FOLLOW)

- **Co-located Tests:** Every new `.tsx`/`.ts` file gets a sibling `.test.tsx`/`.test.ts` file in the same directory.
- **Test Runner:** Jest (configured in `jest.config.js` with CSS mocking via `jest-style-mock.js`).
- **Test Orchestrator:** Run tests via the `test-orchestrator` MCP server, NOT directly via `jest` command.
- **Regression Guard:** All existing Story 1-1 and 1-2 tests MUST continue to pass.
- **Coverage:** Creator feature should have tests for:
  - Zod schema validation (valid/invalid component definitions)
  - TinyBase CRUD operations (create, read, update, delete)
  - Component list rendering and interaction
  - Component editor form validation and auto-save
  - Desktop gate (renders on desktop, shows message on mobile)
  - Empty states

### Previous Story Learnings (CRITICAL)

**From Story 1-1:**
- **Windows ENOENT Bug:** Encountered Expo `node_modules/.cache` mkdir bug on Windows. Fixed by upgrading to latest Expo. Already resolved.
- **NhostClient Side Effects:** `NhostClient` MUST be instantiated inside `useRef`. Already implemented correctly in `auth-provider.tsx`.
- **Style Injection:** `GluestackUIProvider.web` had unbounded `<style>` tag injection; dedup was added. Do not reintroduce.
- **FSD Violations:** Story 1-1 review found components in `src/components/ui/` instead of `src/shared/ui/`. All new code MUST follow FSD paths — creator code under `src/features/creator/` ONLY.
- **TypeScript Strictness:** `any` types were flagged in review. Maintain strict typing — no `any`.

**From Story 1-2:**
- Established the theme system with CSS variables in `global.css` and `ThemeProvider`.
- Created `BottomTabBar` component with tab navigation.
- Created `SkeletonCard` for shimmer loading states.
- Synced theme colors between `global.css` and `default-theme.ts`.
- Fixed font loading in ThemeProvider using `expo-font`.
- **Pattern:** All shared UI components read colors from CSS variable tokens (not hardcoded hex).
- **Pattern:** Components accept data via typed props — no internal data fetching.

### Project Structure Notes

```
DungeonsWithFriends/
├── App.tsx                                    # [MODIFY] Add creator tools navigation route
├── src/
│   ├── features/
│   │   ├── auth/                              # Existing — DO NOT modify
│   │   ├── campaign/                          # Existing — DO NOT modify
│   │   ├── character/                         # Existing — DO NOT modify
│   │   ├── creator/                           # [NEW] Creator feature slice
│   │   │   ├── model/
│   │   │   │   ├── component-schemas.ts       # [NEW] Zod schemas for component definitions
│   │   │   │   ├── component-schemas.test.ts  # [NEW] Schema validation tests
│   │   │   │   ├── component-store.ts         # [NEW] TinyBase hooks for component CRUD
│   │   │   │   └── component-store.test.ts    # [NEW] Store operation tests
│   │   │   └── ui/
│   │   │       ├── component-list.tsx         # [NEW] List of component definitions
│   │   │       ├── component-list.test.tsx    # [NEW] List tests
│   │   │       ├── component-editor.tsx       # [NEW] Create/edit component form
│   │   │       ├── component-editor.test.tsx  # [NEW] Editor tests
│   │   │       ├── creator-tools-screen.tsx   # [NEW] Container screen with desktop gate
│   │   │       └── creator-tools-screen.test.tsx # [NEW] Screen tests
│   │   ├── dashboard/                         # Existing — DO NOT modify
│   │   └── story/                             # Existing — DO NOT modify
│   └── shared/                                # Existing shared layer — extend if needed
│       ├── providers/
│       │   ├── auth-provider.tsx               # Existing — use useAuth()
│       │   └── sync-provider.tsx               # Existing — provides TinyBase store
│       ├── theme/                              # Existing — use tokens
│       └── ui/
│           ├── atoms/base-card.tsx             # Existing — reuse for component cards
│           └── skeleton-card.tsx               # Existing — reuse for loading states
```

### References

- [Architecture](file:///c:/Development/DungeonsWithFriends/_bmad-output/planning-artifacts/architecture.md) – FSD, Zod Validation, Naming Patterns, Offline-First Mandate, TinyBase
- [Epics](file:///c:/Development/DungeonsWithFriends/_bmad-output/planning-artifacts/epics.md) – Epic 1, Story 1.3 (FR17)
- [UX Design](file:///c:/Development/DungeonsWithFriends/_bmad-output/planning-artifacts/ux-design-specification.md) – Desktop Creator Paradigm, Journey 2, Auto-Save, Inline Validation, Component Strategy (Sections 5.2, 6.x, 7.2, 8.1)
- [PRD](file:///c:/Development/DungeonsWithFriends/_bmad-output/planning-artifacts/prd.md) – FR17 (Custom Game Components), FR18 (Import/Export JSON)
- [Previous Story 1-1](file:///c:/Development/DungeonsWithFriends/_bmad-output/implementation-artifacts/1-1-project-initialization-core-framework-scaffolding.md) – Foundation, Debug Learnings, FSD Patterns
- [Previous Story 1-2](file:///c:/Development/DungeonsWithFriends/_bmad-output/implementation-artifacts/1-2-user-authentication-offline-only-mode.md) – Theme System, Navigation, Auth Flow, Testing Patterns

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
