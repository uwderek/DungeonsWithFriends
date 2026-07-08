---
adrId: ADR-0047
shortName: local-first-backup-disaster-recovery-and-update-safety
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: now-later
source: imported-and-cleaned
---
# ADR-0047: Local-First Backup, Disaster Recovery & Update Safety

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** now-later.
- **Project application:** Apply local-first backup and recovery to TinyBase export/import and migrations now; Tauri can enhance downloaded-app backup/update safety later.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

- **Source status:** Proposed
- **Date:** 2026-06-27
- **Governs:** Epics 1037–1043 (the "Local-First Backup & Disaster Recovery" program)
- **Supersedes / relates to:** extends the hosted/multi-tenant backup of
  Epic 781 (source path: `../product/epics/epic-781-encrypted-backup-and-state-sync.md`)
  (Neon PITR + R2, daily, hosted) to the **local-first single-workstation** case;
  completes the migration/rollback intent of the stable-runtime program
  (Epics 611–618), in particular the `DataSchemaRegistry` (611.4) and the
  bake-rollback path (615.3); consumes the profile/instance storage model of
  Epics 467–473; honors the workspace-junction-wipe safety contract
  (CLAUDE.md "Worktree teardown MUST be junction-safe").
- **Plan:** backup-disaster-recovery-and-update-safety-plan.md (source path: `../technical/backup-disaster-recovery-and-update-safety-plan.md`)

## Context

A non-technical creator runs Action Plan locally. A disk failure, a botched
schema migration, or a buggy update can destroy work that is **not in git**: the
spend/outcome/governance ledgers, profiles/projects, the memory ledger, the
books/web/notes knowledgebases, workflow checkpoints, consents, secrets — and
in-progress code (unpushed commits + uncommitted changes) in the main checkout
and worktrees. Today that state is **split across two roots**
(`<app-local>/.actionplan/` and the per-checkout `.actionplan-runtime/`) plus
three in-checkout files, so there is no single thing to back up; the encrypted
snapshot engine (Epic 781) is not wired to a schedule, a provider, or the
migration path; there is no key-recovery story for a lost workstation; and the
auto-rollback on a failed update (615.3) is unfinished.

## Decision

Ship a **local-first backup, disaster-recovery, and update-safety** program built
from existing primitives (versioned install, `DataSchemaRegistry`, the Epic-781
`SnapshotEnginePort`) plus targeted fills. The load-bearing choices:

1. **One Backup Root.** Consolidate every non-regenerable ("primary") store under
   a single `<app-local>/ActionPlan/backup-root/` (per-`worktreeHash`
   namespaced), with regenerable artifacts pushed to a separate, never-synced
   `local-tier/`. A **single-root completeness CI gate** fails the build if any
   new primary store resolves outside the root — so coverage never regresses.

2. **Kopia is the bundled snapshot engine.** Apache-2.0 (explicit patent grant)
   over restic's BSD-2; adds built-in compression, retention policies, and a
   native S3/R2 backend. It ships as a static binary in the **immutable versioned
   install payload**, invoked behind the vendor-neutral `SnapshotEnginePort` —
   restic remains a drop-in fallback. The store holds **ciphertext only**.

3. **No app pause during backup.** Consistency comes from copy-on-read +
   atomic-write, not a global lock: SQLite stores are copied via the **Online
   Backup API / `VACUUM INTO`** into staging *while writers continue*; JSON/file
   stores rely on the existing atomic write-temp-rename; a manifest records the
   point-in-time set.

4. **Cloudflare R2, 15-minute change-triggered cadence.** R2 chosen for zero
   egress (free restores), no account floor, and no minimum retention; verified
   cheap (≈$0.30/user/mo at the chosen cadence). The product is a **$5/mo "Action
   Plan Backup"** subscription (~10 GB included, per-10-GB overage), **bundled
   into Pro**; **Free has no managed backup** (self-serve the single folder).
   Update-safety local snapshots are tier-independent and unbilled.

5. **Account-bound key escrow makes a lost workstation recoverable.** The
   repository key is generated on-device but **never lives only on the device**:
   it is KMS-wrapped, bound to the authenticated account, and escrowed in the
   control plane **separate from the backup store**. Recovery on a new machine is
   *logging in*; a one-time **offline recovery code** is the provider-independent
   fallback; an optional **zero-knowledge passphrase mode** trades recoverability
   for maximum privacy. Default is escrowed-recoverable.

6. **Worktree work is backed up as git-state deltas, not folder mirrors.**
   Unpushed commits (`git bundle` of refs-not-on-remote), the uncommitted patch,
   and untracked-non-ignored files are captured via **git plumbing, never
   filesystem recursion**, so the capture never traverses the `node_modules`
   junctions into canonical source (junction-wipe safety) and never backs up
   regenerables.

7. **Updates degrade to a non-event.** A pre-migration snapshot is taken before
   any data-transform/breaking migration; a standby preflight dry-runs schema
   compatibility without taking the lock; a bake-gate watchdog auto-flips the
   `current.json` pointer back to `previous` on a failed bake and conditionally
   restores the snapshot only when an applied migration was `breaking:true`
   (expand/contract makes most rollbacks need no restore).

## Consequences

- **Positive:** one folder to back up; every future store is covered by default
  and enforced by CI; a lost machine, a bad migration, and a buggy release are
  all recoverable; the design reuses (not re-invents) the install/migration/
  snapshot engines; every step is platform-automatable (zero-technical-expertise
  mandate).
- **Negative / costs:** the backup-root consolidation is a wide path-resolution
  change requiring a one-time data-move migration + compatibility shim; key
  escrow introduces a control-plane dependency (KMS + account identity); bundling
  Kopia adds a per-platform binary to the install payload.
- **Open items (resolved in the epics):** exact GFS-lite retention numbers for the
  15-min cadence (Epic 1040); the KMS provider pin (Epic 1039).

## Alternatives considered

- **Raw filesystem sync (Dropbox/OneDrive on the data dir):** rejected as the
  authoritative mechanism — naive mirroring of live WAL SQLite restores corrupt.
  Offered only as a clearly-labeled secondary convenience tier.
- **Cheaper object stores (Storj/iDrive e2/Wasabi/B2):** at <10 GB the per-GB
  savings are fractions of a cent and are outweighed by account floors (Storj
  $50/mo, iDrive/Wasabi), minimum retention (Wasabi 90 days), or egress on
  restore. The `SnapshotEnginePort` keeps a per-tier backend swap a config change.
- **Per-version data roots:** rejected — data is shared across the active/previous
  app versions; cross-version safety comes from the schema engine + pre-migration
  snapshots, not from copying the whole data root per version.
