---
title: 'ADR Compliance Local App Cleanup'
type: 'refactor'
created: '2026-07-07'
status: 'done'
review_loop_iteration: 0
baseline_commit: '4a44072d84e3b93d47783dce63166357576c76ec'
context:
  - '{project-root}/docs/project-context.md'
  - '{project-root}/docs/decisions/ADR-0059-dwf-platform-baseline-typescript-tauri-cloudflare-workos.md'
  - '{project-root}/docs/roadmap/now.md'
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** The current Expo app still carries Nhost packages, Nhost client scaffolding, login/register UI paths, and account-session controls even though ADR-0059 makes the now-roadmap fully local, TinyBase-backed, and login-free.

**Approach:** Remove active Nhost/auth/login code paths, make the app open directly into the local Expo experience, and update architecture/project docs and tests so they no longer describe Nhost as current implementation architecture.

## Boundaries & Constraints

**Always:** Keep Expo as primary UI, preserve TinyBase local store initialization, keep tests co-located, and avoid adding Python product code.

**Ask First:** Introducing a new auth provider, hosted sync provider, account model, external persistence service, or native/Tauri process boundary.

**Never:** Keep Nhost as an active dependency, require login for app entry, leave feature UI importing provider SDKs, or rewrite unrelated creator/domain code while doing the compliance cleanup.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Local launch | App starts with empty TinyBase store | Dashboard renders without login, registration, or continue-offline gate | Show existing global crash boundary if app render fails |
| Manual local sync | User triggers sync provider action in tests | Local-only sync state toggles and returns to idle | No hosted sync/network call is attempted |
| Provider scan | Repo search for active Nhost/auth imports | No product code references Nhost, login/register screens, or auth-provider | Remaining historical mentions must be in archived or superseded docs only |

</frozen-after-approval>

## Code Map

- `DungeonsWithFriends/App.tsx` -- app entry/routing currently gated by auth/offline mode.
- `DungeonsWithFriends/src/shared/providers/sync-provider.tsx` -- TinyBase provider with stale Nhost sync comments.
- `DungeonsWithFriends/src/features/*/ui/*screen*.tsx` -- top-level app screens with account/logout controls.
- `DungeonsWithFriends/src/features/auth/**` -- now-roadmap login/register/welcome code to remove from active product.
- `DungeonsWithFriends/src/shared/services/nhost-client.*` -- active Nhost client seam to remove.
- `DungeonsWithFriends/package.json` and `package-lock.json` -- dependency authority for Nhost/auth packages.
- `docs/architecture.md`, `docs/project-context.md`, `_bmad-output/planning-artifacts/*` -- docs that must describe local-first architecture accurately.

## Tasks & Acceptance

**Execution:**
- [x] `DungeonsWithFriends/App.tsx` -- remove auth stack and render local app shell directly.
- [x] `DungeonsWithFriends/src/shared/providers/sync-provider.tsx` -- remove Nhost terminology and make local-only semantics explicit.
- [x] `DungeonsWithFriends/src/features/dashboard/ui/dashboard-screen.tsx`, `DungeonsWithFriends/src/features/character/ui/characters-screen.tsx`, `DungeonsWithFriends/src/features/creator/ui/CreatorToolsScreen.tsx` -- remove logout/account controls.
- [x] `DungeonsWithFriends/src/features/auth/**`, `DungeonsWithFriends/src/shared/providers/auth-provider.*`, `DungeonsWithFriends/src/shared/services/nhost-client.*`, `DungeonsWithFriends/debug-nhost.js` -- delete now-roadmap auth/Nhost scaffolding.
- [x] `DungeonsWithFriends/package.json` and lockfile -- remove unused Nhost/auth direct dependencies.
- [x] Co-located tests and E2E smoke -- update expectations for local dashboard-first launch.
- [x] Project docs -- remove current-architecture Nhost references and describe removed auth scaffolding as historical only where necessary.

**Acceptance Criteria:**
- Given a fresh app launch, when `App` renders, then it shows the local dashboard without requiring login or offline-mode selection.
- Given repo product-code search, when scanning `DungeonsWithFriends/src`, then no Nhost, auth-provider, login-screen, register-screen, or welcome-screen code remains.
- Given docs/code search, when scanning active docs and product code, then Nhost appears only in historical/superseded planning/archive context or as an explicit rejected old assumption.

## Verification

**Commands:**
- `rg -n -i "nhost|auth-provider|login-screen|register-screen|welcome-screen|@nhost" DungeonsWithFriends/src DungeonsWithFriends/App.tsx DungeonsWithFriends/package.json` -- expected: no matches.
- `npm run lint -- --noEmit` or nearest available typecheck command from the app -- expected: TypeScript success if available.
- Targeted Jest through direct repository commands where relevant.

**Results:**
- `rg -n -i "nhost|@nhost|auth-provider|login-screen|register-screen|welcome-screen|debug-nhost" DungeonsWithFriends/src DungeonsWithFriends/App.tsx DungeonsWithFriends/App.test.tsx DungeonsWithFriends/package.json DungeonsWithFriends/package-lock.json DungeonsWithFriends/README.md docs/architecture.md docs/project-context.md docs/roadmap _bmad-output/planning-artifacts/architecture-realignment-2026-07-07.md _bmad-output/planning-artifacts/documentation-repair-plan-2026-07-07.md _bmad-output/planning-artifacts/sprint-change-proposal-2026-07-07.md _bmad-output/implementation-artifacts/1-1-creator-workspace-shell.md` -- no matches.
- `rg -n -i "useAuth|AuthProvider|logout-button|offlineMode|Pro Account" DungeonsWithFriends/src DungeonsWithFriends/App.tsx DungeonsWithFriends/App.test.tsx _bmad-output/implementation-artifacts/1-1-creator-workspace-shell.md` -- no matches.
- `npx tsc --noEmit` from `DungeonsWithFriends/` -- passed.
- `npm ls @nhost/nhost-js @nhost/react expo-auth-session expo-crypto graphql --depth=0` from `DungeonsWithFriends/` -- returned an empty dependency tree.
- `git diff --check` -- passed with Git CRLF normalization warnings only.
- Direct Jest/Playwright was not run during that session because package scripts previously blocked them; this has since been superseded by direct repository verification commands.

## Suggested Review Order

**Local App Entry**

- Start here to see the login-free app shell.
  [`App.tsx:41`](../../DungeonsWithFriends/App.tsx#L41)

- Provider composition now omits the removed auth layer.
  [`App.tsx:100`](../../DungeonsWithFriends/App.tsx#L100)

**Local Store Semantics**

- Manual checkpoint state is local-only and timer-safe.
  [`sync-provider.tsx:18`](../../DungeonsWithFriends/src/shared/providers/sync-provider.tsx#L18)

- Sync context exposes the local checkpoint timestamp.
  [`sync-provider.tsx:50`](../../DungeonsWithFriends/src/shared/providers/sync-provider.tsx#L50)

**Account UI Removal**

- Dashboard header keeps settings without logout controls.
  [`dashboard-screen.tsx:55`](../../DungeonsWithFriends/src/features/dashboard/ui/dashboard-screen.tsx#L55)

- Character header keeps settings without account controls.
  [`characters-screen.tsx:60`](../../DungeonsWithFriends/src/features/character/ui/characters-screen.tsx#L60)

- Creator header keeps settings without account controls.
  [`CreatorToolsScreen.tsx:57`](../../DungeonsWithFriends/src/features/creator/ui/CreatorToolsScreen.tsx#L57)

- Shared navigation now labels the local mode.
  [`bottom-tab-bar.tsx:96`](../../DungeonsWithFriends/src/shared/ui/navigation/bottom-tab-bar.tsx#L96)

**Architecture And Roadmap**

- Current architecture now describes dashboard-first local entry.
  [`architecture.md:13`](../../docs/architecture.md#L13)

- Project context records the login-free current snapshot.
  [`project-context.md:42`](../../docs/project-context.md#L42)

- Roadmap priority ledger keeps auth out of now work.
  [`index.md:18`](../../docs/roadmap/index.md#L18)

**Verification Surfaces**

- App routing tests assert dashboard-first behavior.
  [`App.test.tsx:75`](../../DungeonsWithFriends/App.test.tsx#L75)

- Sync provider test asserts local checkpoint timestamp.
  [`sync-provider.test.tsx:74`](../../DungeonsWithFriends/src/shared/providers/sync-provider.test.tsx#L74)

- E2E smoke now expects local dashboard visibility.
  [`app.spec.ts:12`](../../DungeonsWithFriends/e2e/app.spec.ts#L12)
