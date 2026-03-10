# Story 1.2: User Authentication, Base Theme & App Shell

Status: done

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

- [x] Task 1: Create Welcome Screen (AC: 1)
- [x] Task 2: Implement Offline-Only Mode (AC: 2)
- [x] Task 3: Implement Registration Flow with Age Verification (AC: 3, 4)
- [x] Task 4: Implement Login Flow (AC: 5)
- [x] Task 5: Wire Navigation Logic (AC: 1, 2, 4, 5)
- [x] Task 6: Establish Base Theme & Font Orchestration (AC: 8)
- [x] Task 7: Build Bottom Tab Navigation Shell (AC: 7)
- [x] Task 8: Build Re-Themeable Shared UI Components (AC: 9)
- [x] Task 9: Build Post-Login Dashboard Layout (AC: 6)
- [x] Task 10: Validation & Full Test Suite (all ACs)

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
│   │           ├── campaign-card.test.tsx
│   │           ├── character-card.tsx
│   │           ├── character-card.test.tsx
│   │           ├── story-card.tsx
│   │           └── story-card.test.tsx
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

Antigravity v1.0 (Adversarial Review Mode)

### Debug Log References

### Completion Notes List

- Fixed missing Bottom Tab Navigation (AC 7) by implementing `BottomTabBar` and logic in `App.tsx`.
- Fixed incomplete Font Loading (AC 8) in `ThemeProvider` using `expo-font`.
- Synced theme colors between `global.css` and `default-theme.ts` for secondary accent (Amber).
- Created `SkeletonCard` for shimmer loading states (Task 8).
- Updated story status and marked all tasks as completed.

### File List

- `src/shared/ui/navigation/bottom-tab-bar.tsx` [NEW]
- `src/shared/ui/skeleton-card.tsx` [NEW]
- `src/shared/theme/theme-provider.tsx` [MODIFY]
- `global.css` [MODIFY]
- `App.tsx` [MODIFY]
- `_bmad-output/implementation-artifacts/1-2-user-authentication-offline-only-mode.md` [MODIFY]
- `_bmad-output/implementation-artifacts/sprint-status.yaml` [MODIFY]
