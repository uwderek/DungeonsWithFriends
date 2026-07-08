---
adrId: ADR-0036
shortName: cli-embedded-headless
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: now-later
source: imported-and-cleaned
---
# CLI as an Embedded Headless App Client — Host-Runtime Shared Authority, Per-Client Cache, and the CLI Core Daemon

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** now-later.
- **Project application:** Map the headless-client intent to shared Expo/headless TypeScript behavior now. Tauri may host OS-specific capabilities later, but is not the primary UI.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Epic 452 (the CLI end-to-end keystone) set out to make every Tier-A CLI command
operate on real workspace state. Its first implementation made the CLI a **thin
client** of a **host-side-only** durable store (`HostDomainStore`) reached through
the governed `domain.read | domain.plan | domain.mutate` seam. That implementation
is sound as far as it goes — real ids, durable audit, governed mutations — but it
exposed two architectural facts we must decide on, because **every later epic
(453–459) inherits the answer**:

1. **The host cannot run the GUI's domain services.** The `core/services/*`
   (`ProjectService`, `TaskService`, `NotesService`, …) are **app-layer**: they
   bind TinyBase + `expo-sqlite` + `react-native` through `core/db/DatabaseService`.
   The loopback **host-runtime** imports **zero** `@/core` modules by design (its
   tsconfig does not even resolve `@/`), so the epic's literal instruction —
   "delegate to the existing `core/services/*`" wired into `HostRuntime` — is
   infeasible. The host-side store was the correct host-side resolution.

2. **A thin CLI client does not test the real app.** Because the CLI talked only
   to the host store, CLI integration tests **never exercised** the GUI's
   `core/services/*`, the TinyBase store, or the ADR-0020 headless logic. "CLI
   parity" proved the host seam, not the stack a user actually runs — and CLI
   writes and GUI writes landed in **separate stores**, so cross-surface data
   unity was unproven.

The intended end state is the opposite: the CLI should run **as close to the GUI
client as possible** so that exercising a command exercises the real headless
stack. the source CLI-parity constraint and
its rejected alternative ("let the CLI call `core/services/*` directly for speed")
were written to forbid a **second, ungoverned** business-logic path — but read
literally they also forbid the *legitimate* model where the CLI runs the **same
governed core** the GUI runs with the host as the single authority. This ADR
resolves that tension.

Two facts make the target tractable. The Jest harness (e.g.
`tests/integration/ProjectCreation.test.ts`) already runs `core/services/*` +
TinyBase **in Node** by mocking the native edges (`expo-crypto`, `HostRpcClient`,
…); the `react-native`/`expo-*` binding in `core/` is small and concentrated in
edge modules (db persistence, id, logging, secrets, UI hooks), not in the domain
services themselves. And Epic 380 already built a **CLI daemon seam**: a transport
resolver with managed local auto-start (`packages/cli/src/localRuntime.ts` +
`services/host-runtime/src/utils/daemonLauncher.ts`), per-worktree `runtime.json`
discovery, `/_health` + `/_ready` probes, warm-runtime reuse, and
`host-runtime status/ensure/restart`.

## Decision

1. **The CLI is an embedded headless client of the same portable app core the GUI
   runs** — `core/services/*` + the TinyBase data layer + the ADR-0020 headless
   logic — executed in-process behind Node platform adapters. It is **not** a thin
   alternate path. CLI integration tests therefore exercise the **real** TinyBase
   store, the real domain services, and the headless view-model logic, so CLI
   coverage proves the stack a user runs.

2. **The host-runtime is the single shared authority.** The source of truth for
   workspace state is the host-runtime durable store (the Epic-452
   `HostDomainStore`) plus its governance, durable audit, and event stream. Every
   client — GUI and CLI alike — holds a **TinyBase cache** hydrated from, and
   reconciled through, the host; **no client owns a parallel authority store.**
   Governed mutations route through the host `CapabilityRouter` via `HostRpcClient`
   (the same path `core/services/*` already use for governed runs/approvals). The
   embedded core is therefore **never a second ungoverned write path** — this is
   the precise reconciliation of the source CLI-parity constraint and its rejected alternative:
   *reuse the governed core, do not fork it, and keep one authority* (ADR-0027,
   applied to data stores).

3. **A Node platform profile makes the portable core runnable outside the UI.**
   The native edges are promoted from test-time mocks to **real, supported Node
   adapters** behind their interfaces — the TinyBase persister
   (`node:sqlite`/`better-sqlite3` instead of `expo-sqlite`), id/crypto, logging,
   and secrets — selected at runtime by platform. Headless purity (ADR-0020 /
   ADR-0022) **extends to the core subgraph the CLI loads**: no `react-native` or
   presentation import is permitted on that path, enforced by a quality gate.

4. **A CLI core daemon keeps the embedded core warm.** The booted core + TinyBase
   cache live in a long-lived **CLI-side daemon**, discovered, auto-started, and
   reused through the **same** resolver + per-worktree discovery record +
   `/_health`/`/_ready` + lifecycle seams Epic 380 built for the host-runtime
   daemon (ADR-0027: **extend the one resolver, never fork a second**).
   `--no-auto-start` and read-only no-spawn semantics carry over. This keeps
   per-command latency acceptable despite booting the full app core.

5. **The daemon exposes a governed local-state reset.** A `clear-all-local-state`
   lifecycle verb wipes the client cache + local persisted state for deterministic
   test isolation, **distinct** from clearing the host authority. Tests obtain a
   fresh state through this verb, never by manual file surgery.

6. **One authority, one core, two transports.** Reads may serve from the client
   cache; writes and the source of truth are the host. The model is **symmetric**
   for GUI and CLI — the CLI is a headless instance of the same client — which is
   exactly what makes the CLI-driven integration tests a real test of the app.

## Consequences

- CLI-driven integration tests now exercise the real TinyBase store, domain
  services, and headless logic — closing the gap where "CLI parity" proved only a
  host-only store, and giving us the cross-surface data-unity proof (a GUI write
  and a CLI write land in the same authority and each sees the other).
- **Cost: per-command startup.** Booting the full core + hydrating a cache on every
  short-lived `ap` call is expensive; the CLI core daemon (Decision 4) is the
  required mitigation, not optional.
- The CLI inherits the app's dependency graph and the platform-adapter maintenance
  burden; the "standalone CLI package, no `@/*`" property is traded for fidelity
  (the portable core is shared through `actionplan-shared`-style packaging or a
  platform-aliased build).
- **Headless purity becomes load-bearing:** a stray `react-native`/presentation
  import on the CLI's core path breaks the CLI build, so the purity gate must
  cover that subgraph. This is a forcing function, not a regression.
- Multi-process cache coherence is handled by the host-as-authority model +
  event-stream reconciliation — **never** by two authority stores.
- Epic 452's `HostDomainStore` is **not** wasted: it is the host authority of
  Decision 2. Epics 453–459 re-scope from "add a host-side adapter per domain" to
  "make the GUI's core service for this domain run in the embedded-headless client
  and reconcile through the host authority," and the Epic-459 parity gate asserts
  the embedded-headless path, not a CLI-only store.

If reversed, the CLI decays back into a thin client whose tests never touch the
real app stack, CLI↔GUI data divergence goes unproven, and the terminal surface
stops being a faithful integration driver — the exact gap this ADR closes.

## Alternatives Considered

- **Thin CLI client over a host-side-only store (the pre-amendment Epic-452
  model).** Rejected as the *end state*: CLI tests never touch TinyBase/core, so
  CLI parity does not prove the real app stack, and CLI↔GUI data unity is unproven.
  (Its host-side store survives as the Decision-2 authority.)
- **CLI opens the GUI's SQLite file directly.** Rejected: fails on the mobile
  sandbox, and two direct writers would each re-enforce governance — violating
  ADR-0027 (one authority) and ADR-0007 (single audit path).
- **Two stores plus bidirectional sync.** Rejected: two sources of truth + a sync
  engine = drift and conflict resolution, the parallel-implementation anti-pattern
  ADR-0027 forbids.
- **Boot the full core per command with no daemon.** Rejected on performance:
  short-lived `ap` invocations would each pay full app-boot + hydration cost.

## Relationship to existing ADRs and epics

- **Amends the source CLI-parity decision:** the "MUST NOT instantiate
  `core/services/*`" and the rejected "call `core/services/*` directly for speed"
  alternative are refined — the prohibition is against a **second ungoverned path
  or a parallel client authority**, not against the CLI running the **shared
  governed core** with the host as the single authority. The source parity
  intent is preserved and strengthened (the CLI now tests the real stack).
- **Applies ADR-0027** (`single-path-shared-seams`) to data stores: one shared
  authority, client caches are not parallel authorities, and the daemon reuses the
  Epic-380 resolver rather than forking a second.
- **Extends ADR-0020 / ADR-0022** (headless component architecture / portable
  surface): the portable surface must be **Node-runnable**, and purity is enforced
  on the CLI's core subgraph.
- **Builds on** Epic 380 (CLI transport resolver + managed daemon seam),
  Epic 251/252 (CLI binary + headless-safe integration), and Epic 402 (the
  live-runtime harness the round-trip proofs run on).
- **Implemented by Epic 452** (the keystone); inherited by Epics 453–459.

## Confirmation

This ADR is confirmed by:

- Contract tests proving a GUI write and a CLI write land in the **same** host
  authority and each surface sees the other (the CLI↔GUI data-unity proof).
- An embedded-headless transport-mode test that exercises the **real** TinyBase
  store + `core/services/*` through a CLI command (not the seed double).
- The headless-purity gate extended to the CLI's core subgraph (a `react-native`
  import on that path fails the gate).
- The CLI core daemon's warm-reuse performance budget test and the
  `clear-all-local-state` reset test (fresh state without file surgery).
- Manual review against ADR-0027 (single authority),
  using the change-management discipline pack. All verification runs through the
  `actionplan-verification` MCP, degrading via `node ActionPlan/scripts/verify.cjs
  <verb>`, never raw `jest` / `pnpm` / `tsc`.
