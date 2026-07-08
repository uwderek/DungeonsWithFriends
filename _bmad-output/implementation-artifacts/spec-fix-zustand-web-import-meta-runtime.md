---
title: 'Fix Zustand web import.meta runtime failure'
type: 'bugfix'
created: '2026-07-08T00:00:00-07:00'
status: 'done'
review_loop_iteration: 0
baseline_commit: 'a54d6ca15bcf2eaed3e1911494b572f3f6aea22c'
context:
  - '{project-root}/docs/project-context.md'
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** Expo web output resolves `zustand/middleware` to `node_modules/zustand/esm/middleware.mjs`, and the emitted classic Metro script still contains raw `import.meta.env`, causing `SyntaxError: Cannot use 'import.meta' outside a module` at runtime.

**Approach:** Keep the app's Zustand usage intact and add a narrowly scoped Metro resolver override for Zustand's affected web package entries so Metro uses the CommonJS files that do not contain `import.meta`.

## Boundaries & Constraints

**Always:** Preserve Expo/React Native, NativeWind, and TypeScript project conventions. Compose with NativeWind's Metro wrapper instead of replacing it. Keep the resolver workaround limited to Zustand entries that are known to emit raw `import.meta` in this project.

**Ask First:** If the fix requires downgrading/upgrading React, Expo, Metro, or Zustand, or disabling package exports globally, stop and ask before proceeding.

**Never:** Do not edit `node_modules`, do not add product Python, do not convert the app to ESM, and do not make a broad resolver condition change that affects every dependency on web.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Web bundle parses | `npx expo export -p web` emits a classic script bundle | Bundle contains no raw `import.meta` tokens from Zustand middleware and parses as a non-module script | Command fails if Metro cannot resolve the alias or parse the bundle |
| Native/web config wrapper | NativeWind wraps Metro config after custom resolver is attached | Existing CSS/NativeWind resolution still composes through its wrapper | Unit and export verification expose broken resolver composition |

</frozen-after-approval>

## Code Map

- `DungeonsWithFriends/metro.config.js` -- Metro and NativeWind composition point; place the scoped Zustand resolver here.
- `DungeonsWithFriends/src/features/creator/model/use-creator-workspace-state.ts` -- imports `zustand/middleware`; should remain source-compatible.
- `DungeonsWithFriends/jest.config.js` -- unit test runner already resolves Zustand CommonJS successfully; no expected change.
- `DungeonsWithFriends/node_modules/zustand/package.json` -- local evidence that `react-native`/default exports point to CommonJS while `import` exports point to ESM.

## Tasks & Acceptance

**Execution:**
- [x] `DungeonsWithFriends/metro.config.js` -- add a resolver override before `withNativeWind` that maps web `zustand` and `zustand/middleware` requests to `index.js` and `middleware.js` -- prevents raw `import.meta` from entering classic web bundles.
- [x] `DungeonsWithFriends/metro.config.js` -- delegate all other requests to Metro's default resolver -- keeps dependency resolution behavior unchanged outside Zustand.
- [x] `DungeonsWithFriends/metro.config.js` -- keep the override composable with NativeWind's resolver wrapper -- preserves CSS/nativewind handling.

**Acceptance Criteria:**
- Given a web export, when the emitted JavaScript bundle is parsed as a classic script, then it succeeds without `Cannot use 'import.meta' outside a module`.
- Given a web export, when the bundle is searched for `import.meta`, then no raw `import.meta` token remains.
- Given the creator workspace Zustand tests, when Jest runs the co-located test file, then existing persisted workspace state behavior still passes.
- Given TypeScript verification, when `npm run typecheck` runs, then Metro config changes do not introduce TS errors.

## Spec Change Log

## Design Notes

The safest fix is a dependency-specific resolver shim because Expo's web package-export conditions select Zustand's ESM `import` target, but Metro emits a classic script for web export. Adding `react-native` to all web export conditions would also select Zustand CommonJS, but it could redirect unrelated dependencies away from their browser/web builds.

## Verification

**Commands:**
- `npm test -- --runInBand src/features/creator/model/use-creator-workspace-state.test.ts` -- expected: all creator workspace Zustand tests pass.
- `npm run typecheck` -- expected: TypeScript completes with no errors.
- `npx expo export -p web --output-dir dist-zustand-smoke` -- expected: export completes.
- `node -e "<parse emitted AppEntry bundle as a classic script>"` -- expected: parse succeeds.
- `rg -n "import\\.meta" dist-zustand-smoke` -- expected: no matches.

## Suggested Review Order

- Scoped aliases choose Zustand CommonJS without changing global web conditions.
  [`metro.config.js:6`](../../DungeonsWithFriends/metro.config.js#L6)

- Custom resolver applies only to web Zustand requests.
  [`metro.config.js:11`](../../DungeonsWithFriends/metro.config.js#L11)

- Default resolver delegation preserves normal Metro and NativeWind composition.
  [`metro.config.js:19`](../../DungeonsWithFriends/metro.config.js#L19)
