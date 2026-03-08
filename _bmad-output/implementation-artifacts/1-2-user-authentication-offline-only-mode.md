# Story 1.2: User Authentication, Base Theme & App Shell

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Player,
I want to either create an account (verifying I am 17+) using SSO/email or explicitly choose "Offline-Only Mode", and then land on a visually rich adventure-themed dashboard with navigation,
so that I can immediately start using the app, see my campaigns and characters, and feel immersed in the dungeon-adventure aesthetic.

## Acceptance Criteria

1. **Given** an unauthenticated player opens the app for the first time
   **When** the welcome screen loads
   **Then** they see options to Login, Register, or "Continue Offline"
2. **Given** the user selects "Continue Offline"
   **When** the offline mode is activated
   **Then** authentication is bypassed and all data is stored locally via TinyBase
3. **Given** the user selects "Register"
   **When** the registration form is displayed
   **Then** account creation includes a 17+ age verification checkbox that must be checked to proceed
4. **Given** the user submits valid registration credentials with age verification
   **When** registration completes
   **Then** the user is authenticated via Nhost Auth and redirected to the main app
5. **Given** the user selects "Login"
   **When** they enter valid credentials
   **Then** they are authenticated via Nhost Auth and redirected to the main app
6. **Given** an authenticated or offline-mode user is on the main app
   **When** the dashboard loads
   **Then** they see the dungeon-adventure themed dashboard with a hero welcome banner, active campaigns section, characters section, and activity chronicle
7. **Given** the user is on any screen in the app
   **When** they look at the bottom of the screen (mobile) or left sidebar (desktop)
   **Then** they see persistent navigation with tabs: Home, Campaigns, Characters, Friends, Settings
8. **Given** the base platform theme is applied
   **When** any UI component renders
   **Then** it uses CSS variable tokens (`--bg-surface`, `--accent-primary`, `--accent-secondary`, etc.) that can be overridden per-campaign later
9. **Given** a campaign card, character card, or story card renders
   **When** the card is displayed
   **Then** it automatically inherits the current theme's CSS variable token values for colors, typography, and borders

## Tasks / Subtasks

- [ ] Task 1: Create Welcome Screen (AC: 1)
  - [ ] Create `src/features/auth/ui/welcome-screen.tsx` with Login, Register, and "Continue Offline" buttons
  - [ ] Apply UX design: large 48px touch targets, `--accent-primary` for primary actions, bottom-anchored layout
  - [ ] Use `lucide-react-native` for icons (`LogIn`, `UserPlus`, `WifiOff`)
  - [ ] Create `src/features/auth/ui/welcome-screen.test.tsx` co-located test
- [ ] Task 2: Implement Offline-Only Mode (AC: 2)
  - [ ] Add `offlineMode` boolean to `AuthProvider` context (`auth-provider.tsx`)
  - [ ] Create `continueOffline()` method in `AuthProvider` that sets `isAuthenticated: false`, `offlineMode: true`
  - [ ] Persist offline mode flag in TinyBase local store
  - [ ] Update `App.tsx` routing to redirect to main content when `offlineMode === true`
  - [ ] Update `auth-provider.test.tsx` to cover offline mode
- [ ] Task 3: Implement Registration Flow with Age Verification (AC: 3, 4)
  - [ ] Create `src/features/auth/ui/register-screen.tsx` with email, password, and 17+ age checkbox
  - [ ] Create Zod validation schema at `src/features/auth/model/auth-schemas.ts` using `snake_case` keys (see snippet below)
  - [ ] Wire registration to `AuthProvider.register()` → `NhostClient.auth.signUp()`
  - [ ] Block submission when age checkbox is unchecked
  - [ ] Create `src/features/auth/ui/register-screen.test.tsx` co-located test
- [ ] Task 4: Implement Login Flow (AC: 5)
  - [ ] Create `src/features/auth/ui/login-screen.tsx` with email/password fields
  - [ ] Wire login to `AuthProvider.login()` → `NhostClient.auth.signIn()`
  - [ ] Handle error states (invalid credentials, network errors)
  - [ ] Create `src/features/auth/ui/login-screen.test.tsx` co-located test
- [ ] Task 5: Wire Navigation Logic (AC: 1, 2, 4, 5)
  - [ ] Implement conditional rendering in `App.tsx` based on `AuthProvider` state
  - [ ] Welcome screen when not authenticated and not offline
  - [ ] Main app content when authenticated OR offline mode
  - [ ] Update `App.test.tsx` to validate routing logic
- [ ] Task 6: Establish Base Theme & Font Orchestration (AC: 8)
  - [ ] Create `src/shared/theme/tokens.ts` — export all CSS variable token names as constants
  - [ ] Create `src/shared/theme/default-theme.ts` — the "Dungeons With Friends" base theme values
  - [ ] Create `src/shared/theme/theme-provider.tsx` — Injects CSS variables. Use `expo-font` to load `Cinzel` and `Inter` (and handle `expo-splash-screen` hiding)
  - [ ] Integrate `ThemeProvider` into `App.tsx` provider tree
  - [ ] Update `global.css` / `tailwind.config.js` to reference CSS variable tokens
  - [ ] Create co-located tests for theme-provider
- [ ] Task 7: Build Bottom Tab Navigation Shell (AC: 7)
  - [ ] Create `src/shared/ui/navigation/bottom-tab-bar.tsx` — frosted-glass bottom nav with 5 tabs: Home (🏰), Campaigns (⚔️), Characters (🧙), Friends (👥), Settings (⚙️)
  - [ ] Active tab uses `--accent-primary` with glow indicator; outlined icons inactive, filled active
  - [ ] Responsive: converts to left sidebar on desktop (>1024px)
  - [ ] All tabs are 48px min touch targets
  - [ ] Tab content areas are placeholder screens for now (actual features in later stories)
  - [ ] Create co-located test `bottom-tab-bar.test.tsx`
- [ ] Task 8: Build Re-Themeable Shared UI Components (AC: 9)
  - [ ] Create `src/shared/ui/cards/campaign-card.tsx` — displays campaign banner, name (serif font), game system badge, bound character avatar+name, player count, turn status indicator (green/amber/gray glow), last activity timestamp. All colors via CSS variable tokens.
  - [ ] Create `src/shared/ui/cards/character-card.tsx` — displays character avatar with class-colored ring, name, class/level, game system tag, campaign binding or "Free Agent" badge, last played timestamp.
  - [ ] Create `src/shared/ui/cards/story-card.tsx` — Discord-style rich embed: character avatar, name, timestamp, narrative text, mechanical breakdown in monospace, color-coded left border (green hit / red miss / indigo narrative).
  - [ ] Create `src/shared/ui/skeleton-card.tsx` — shimmer-animated loading skeleton (NO spinners per offline-first mandate).
  - [ ] All card components accept data via props and render entirely from CSS variable tokens.
  - [ ] Create co-located tests for each card component.
- [ ] Task 9: Build Post-Login Dashboard Layout (AC: 6)
  - [ ] Create `src/features/dashboard/ui/dashboard-screen.tsx` — the Home tab content
  - [ ] Hero welcome section: atmospheric dungeon banner with gradient overlay, "Welcome back, [Name]" in serif font, contextual subtitle
  - [ ] "Your Adventures" section: horizontally scrollable row of `CampaignCard` components (use mock data)
  - [ ] "Your Heroes" section: horizontally scrollable row of `CharacterCard` components (use mock data)
  - [ ] "The Chronicle" section: vertical list of `StoryCard` entries (use mock data)
  - [ ] "Search Campaigns" (outlined) and "Start New Campaign" (primary) action buttons
  - [ ] Empty states with dungeon art and narrative CTAs when no campaigns/characters exist
  - [ ] Create co-located test `dashboard-screen.test.tsx`
- [ ] Task 10: Validation & Full Test Suite (all ACs)
  - [ ] Configure `.env` with `EXPO_PUBLIC_NHOST_SUBDOMAIN` and `EXPO_PUBLIC_NHOST_REGION`
  - [ ] Run all unit tests to ensure 0 regressions on Story 1-1 tests (24 passing)
  - [ ] Verify web export: `npx expo export -p web`
  - [ ] Visual review: theme tokens applied correctly, cards render with proper styling

## Dev Notes

### Architecture Constraints (MUST FOLLOW)

- **Feature-Sliced Design (FSD):** All auth feature code MUST go under `src/features/auth/`. Create subdirs: `ui/`, `model/`, `lib/` as needed. Do NOT put auth screens under `src/shared/` — that is only for cross-cutting infrastructure.
- **Offline-First Mandate:** NEVER display a loading spinner blocking the UI for network calls. All auth state mutations must be optimistic. Nhost calls happen in background.
- **Facade Pattern:** The existing `AuthProvider` at `src/shared/providers/auth-provider.tsx` is the ONLY interface to Nhost Auth. **No feature code may `import` from `@nhost/*` directly.** All Nhost calls go through `AuthProvider` methods.
- **Zod Schemas:** All auth data schemas MUST use `snake_case` keys (e.g., `display_name`, `is_age_verified`) per architecture rule for Postgres/Nhost mapping.
- **SSO Integration:** Use `expo-auth-session` and `expo-crypto` for Nhost SSO flows.

### Naming Conventions (MANDATORY)

| Context | Convention | Example |
|---------|-----------|---------|
| Files | `kebab-case.tsx` | `welcome-screen.tsx` |
| Components | `PascalCase` | `WelcomeScreen` |
| Variables/hooks | `camelCase` | `useAuth`, `handleLogin` |
| Zod/TinyBase keys | `snake_case` | `is_age_verified` |

### Existing Code to Extend (DO NOT RECREATE)

- **`src/shared/providers/auth-provider.tsx`**: Already has `User` type, `AuthContextType`, `AuthProvider` component, `useAuth` hook, and `NhostClient` instantiation via `useRef`. Extend this—do NOT create a second auth provider.
  - Current `login()`/`logout()` are stubs (empty bodies). Wire them to `nhostRef.current.auth.signIn()`/`signOut()`.
  - Add: `register()`, `continueOffline()`, `offlineMode` boolean state.
- **`src/shared/providers/auth-provider.test.tsx`**: Existing tests (part of 24 passing). Add new tests alongside, do not break.
- **`App.tsx`**: Current structure wraps `GluestackUIProvider > SyncProvider > AuthProvider > View`. Add navigation logic inside `AuthProvider` children.

### UX Requirements (from UX Spec)

- **No Main Menu:** The app must NOT open to a traditional menu. For first-time unauthenticated users, show the Welcome screen with clear, prominent options.
- **Touch Targets:** All buttons must be minimum 48px height (mobile accessibility requirement).
- **One-Handed Playability:** Anchor primary actions to the bottom of the screen ("Thumb Zone").
- **No Loading Spinners Ever:** Use skeleton shimmer cards for loading states. The app is offline-first.

### Base Theme Design System ("Torch-Lit Dungeon" Aesthetic)

**A Lovable design prototype will be linked from GitHub to use as the visual reference.** The prototype captures the full dashboard layout and visual identity described below. Use it to inform component styling, but implement using the CSS variable token system below so campaigns can restyle everything.

**Color Tokens (CSS Variables):**
| Token | Default Value | Usage |
|-------|--------------|-------|
| `--bg-base` | `#000000` | Page background (OLED black) |
| `--bg-surface` | `#1A1A1A` | Card/elevated surfaces (charcoal) |
| `--bg-surface-border` | `rgba(255,255,255,0.06)` | Subtle card borders |
| `--accent-primary` | `#5E5CE6` | Primary CTAs, active states (Electric Indigo) |
| `--accent-primary-glow` | `rgba(94,92,230,0.3)` | Hover/active glow shadow |
| `--accent-secondary` | `#FFD700` | XP bars, notifications, torch highlights (Amber) |
| `--accent-success` | `#30D158` | Hit/success states (Emerald) |
| `--accent-danger` | `#FF453A` | Miss/fail/destructive (Crimson) |
| `--text-primary` | `#F5F5F7` | Primary text |
| `--text-muted` | `#8E8E93` | Secondary/muted text |
| `--font-ui` | `'Inter', sans-serif` | UI & mechanical text |
| `--font-narrative` | `'Cinzel', 'Merriweather', serif` | Titles, campaign names, narrative |
| `--radius-card` | `12px` | Card border radius |
| `--radius-button` | `8px` | Button border radius |

**Visual Effects:**
- Frosted glassmorphism (`backdrop-blur: 12px`) on navigation bar and floating elements
- Subtle `translateY(-2px)` hover lift on cards with `0.2s ease` transition
- Glow `box-shadow` using `--accent-primary-glow` on primary buttons and active campaign cards
- Skeleton shimmer animation for loading states (charcoal gradient sweep)

**Typography:**
- `--font-ui` (Inter) for all mechanical/UI text. Base 16px.
- `--font-narrative` (Cinzel) for campaign names, section headings, story titles, the "Dungeons With Friends" brand.

**Responsive Breakpoints:**
- Mobile (<768px): single column, bottom tab nav, horizontal scroll cards
- Tablet (768-1024px): 2-column grid, bottom tab nav
- Desktop (>1024px): left sidebar nav, 3-column grid, activity feed in right column

### Technical Stack (EXACT VERSIONS)

- **Nhost Auth:** `@nhost/nhost-js` (already installed). Use `nhostRef.current.auth.signUp()` / `nhostRef.current.auth.signIn()`.
- **SSO Libraries:** `expo-auth-session`, `expo-crypto` (install if missing).
- **Icons:** `lucide-react-native` (Standardized for DWF).
- **Zod:** `zod` v3.x for form validation schemas.
- **TinyBase:** Already installed. Use for `offlineMode` persistence.
- **NativeWind v4:** Already configured. Use Tailwind classes for styling.
- **Gluestack UI:** Use primitives from `src/shared/ui/gluestack-ui-provider/`.

### Testing Standards (MUST FOLLOW)

- **Co-located Tests:** Every new `.tsx` file gets a sibling `.test.tsx` file in the same directory.
- **Test Runner:** Jest (already configured in `jest.config.js` with CSS mocking via `jest-style-mock.js`).
- **Regression Guard:** All 24 existing Story 1-1 tests MUST continue to pass.
- **Coverage:** Auth feature should have tests for: successful login, successful registration, offline mode, age verification blocking, error states.

### Previous Story 1-1 Learnings (CRITICAL)

- **Windows ENOENT Bug:** Encountered Expo `node_modules/.cache` mkdir bug on Windows. If you see this, run `expo@latest` upgrade.
- **NhostClient Side Effects:** `NhostClient` MUST be instantiated inside `useRef` to prevent repeated side effects on re-renders. This is already implemented correctly—do not change it.
- **Style Injection:** `GluestackUIProvider.web` had unbounded `<style>` tag injection; deduplication was added. Do not reintroduce this.
- **FSD Violations:** Story 1-1 review found components in `src/components/ui/` instead of `src/shared/ui/`. Those were moved and deleted. All new code MUST follow FSD paths.
- **TypeScript Strictness:** `any` types were flagged in review and fixed to `User | null` and `React.ReactNode`. Maintain strict typing.

### Re-Themeable Component Architecture

All shared UI components MUST:
1. Read colors/fonts from CSS variable tokens (not hardcoded hex values)
2. Accept data via typed props — no internal data fetching
3. Render identically regardless of which campaign theme is active
4. Support the skeleton loading state variant

### Implementation Snippets

#### Zod Registration Schema
```typescript
const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  is_age_verified: z.boolean().refine(val => val === true, "Must be 17+"),
});
```

#### TinyBase Offline Persistence
```typescript
// Inside AuthProvider
const [offlineMode, setOfflineMode] = useState(false);
useEffect(() => {
  // Persistence logic using TinyBase store
  const savedMode = store.getCell('settings', 'auth', 'offline_mode');
  if (savedMode) setOfflineMode(true);
}, [store]);
```

### Project Structure Notes

```
DungeonsWithFriends/
├── App.tsx                         # Root - modify for auth routing + ThemeProvider
├── App.test.tsx                    # Root test - extend
├── global.css                      # [MODIFY] Add CSS variable token references
├── tailwind.config.js              # [MODIFY] Reference CSS variable tokens
├── src/
│   ├── features/
│   │   ├── auth/                   # [NEW] Auth feature slice
│   │   │   ├── ui/
│   │   │   │   ├── welcome-screen.tsx
│   │   │   │   ├── welcome-screen.test.tsx
│   │   │   │   ├── login-screen.tsx
│   │   │   │   ├── login-screen.test.tsx
│   │   │   │   ├── register-screen.tsx
│   │   │   │   └── register-screen.test.tsx
│   │   │   └── model/
│   │   │       ├── auth-schemas.ts
│   │   │       └── auth-schemas.test.ts
│   │   └── dashboard/              # [NEW] Dashboard feature slice
│   │       └── ui/
│   │           ├── dashboard-screen.tsx
│   │           └── dashboard-screen.test.tsx
│   └── shared/
│       ├── providers/
│       │   ├── auth-provider.tsx            # [MODIFY] Extend with register/offline
│       │   ├── auth-provider.test.tsx       # [MODIFY] Add new test cases
│       │   ├── sync-provider.tsx
│       │   └── sync-provider.test.tsx
│       ├── theme/                          # [NEW] Theme system
│       │   ├── tokens.ts                   # CSS variable token name constants
│       │   ├── default-theme.ts            # Base DWF theme values
│       │   ├── theme-provider.tsx          # ThemeProvider context + CSS var injection
│       │   └── theme-provider.test.tsx
│       └── ui/
│           ├── gluestack-ui-provider/      # Existing, DO NOT modify
│           ├── navigation/                 # [NEW] App navigation
│           │   ├── bottom-tab-bar.tsx
│           │   └── bottom-tab-bar.test.tsx
│           ├── cards/                      # [NEW] Re-themeable card components
│           │   ├── campaign-card.tsx
│           │   ├── campaign-card.test.tsx
│           │   ├── character-card.tsx
│           │   ├── character-card.test.tsx
│           │   ├── story-card.tsx
│           │   └── story-card.test.tsx
│           └── skeleton-card.tsx           # [NEW] Shimmer loading skeleton
```

### References

- [Architecture](file:///c:/Development/DungeonsWithFriends/_bmad-output/planning-artifacts/architecture.md) – Auth/Security, Data Architecture, FSD, Naming Patterns, CSS Variable Theming
- [Epics](file:///c:/Development/DungeonsWithFriends/_bmad-output/planning-artifacts/epics.md) – Epic 1, Story 1.2
- [UX Design](file:///c:/Development/DungeonsWithFriends/_bmad-output/planning-artifacts/ux-design-specification.md) – Color System, Typography, Touch Targets, Onboarding Flow, Floating HUD, Action Drawer
- [PRD](file:///c:/Development/DungeonsWithFriends/_bmad-output/planning-artifacts/prd.md) – FR1, FR2, FR7, FR9, FR27b (Campaign Theming)
- [Previous Story 1-1](file:///c:/Development/DungeonsWithFriends/_bmad-output/implementation-artifacts/1-1-project-initialization-core-framework-scaffolding.md) – Learnings, Patterns, File List
- **[Lovable Design Prototype]** – (https://github.com/uwderek/dungeons-friends-hub). Use as visual reference for dashboard layout, card styling, and the "torch-lit dungeon" aesthetic. Implement using CSS variable tokens so campaigns can restyle.

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
