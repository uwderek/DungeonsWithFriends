---
adrId: ADR-0052
shortName: managed-host-fleet-control-plane
status: rejected
date: 2026-07-07
dwfDisposition: rejected
roadmapLane: none
source: imported-and-cleaned
---
# ADR-0052: Managed-Host Fleet Control Plane (Provisioning, Configuration & Day-2 Operations)

## DungeonsWithFriends Application

- **DWF disposition:** rejected.
- **Roadmap lane:** none.
- **Project application:** Do not build a managed-host fleet control plane for the DWF product baseline. Prefer Cloudflare and Neon managed services later instead of a custom fleet plane.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

- **Source status:** Proposed
- **Date:** 2026-06-29
- **Governs:** the Managed-Host Fleet Control Plane workstreams (WS-1…WS-9 in the plan;
  epic numbers assigned when the roadmap/next set is promoted to sprint)
- **Supersedes / relates to:** builds on the **Integration Pack framework** (epics
  760–775) and **verifiable integration packs** (epics 965–975: per-action read-only
  verification probes, dynamic MCP projection, `CloudflareConnectionManager`); reuses
  the **provisioning-step contract** and `WorktreeProvisioningWorkflow` (Epic 1021),
  the **run-to-boundary** workflow façade (Epic 603/606), the **encrypted secret store
  + connector registry** (`EncryptedCheckoutSecretStore`, `connectorRegistry`), the
  **cloud-agnostic platform ports** (Epic 732), and the **UpdateCoordinator**
  self-update model (epics 612–614). Complements
  `actionplan-hosting-unified-reference.md` (source path: `../technical/actionplan-hosting-unified-reference.md`)
  (which hosts *ActionPlan itself*); this decision covers hosting the **servers and
  apps ActionPlan manages on behalf of Pro users**, the explicitly out-of-scope
  "separate document" that reference defers. Wires to the **Backup / DR / update-safety**
  plan (`backup-disaster-recovery-and-update-safety-plan.md` (source path: `../technical/backup-disaster-recovery-and-update-safety-plan.md`)).
- **Plan:** managed-host-fleet-provisioning-and-operations-plan.md (source path: `../technical/managed-host-fleet-provisioning-and-operations-plan.md`)

## Context

Pro-plan users will need Action Plan to set up and run real servers for them — order
or attach a host at Hostinger (or another provider), connect to it, configure it
(packages, services, firewall, TLS, users, deployed apps), and keep it healthy over
time (patching, backups, secret rotation, incident recovery). The
zero-technical-expertise mandate means a creator cannot drop to a shell: every step
must be automatable through Action Plan itself, and diagnostics must self-heal.

Action Plan already has most of the *chassis*. Integration packs already reserve the
`compute-provisioning`, `remote-access`, and `domain-registrar` capability slots; the
provisioning-step contract is a verified, idempotent `probe → apply → re-probe`
reconciler; connection managers store credentials fail-closed in an OS/AES-256-GCM
vault and resolve them only at call time; platform ports are vendor-neutral with a
boundary test that fails if a vendor type leaks; and the UpdateCoordinator already
does staged, signature-verified, quiet-window, rollback-capable updates for the local
runtime. **What is missing is a remote-host execution + desired-state plane and the
provider packs to sit on top of it.** The risk is that "manage a server" gets built
as a new, vendor-coupled engine that bypasses the existing governance, verification,
and credential discipline.

## Decision

Build a **Managed-Host Fleet Control Plane** as a thin extension of existing
substrate, not a parallel engine. Six concrete choices:

1. **A vendor-neutral `ManagedHostPort` is the single remote-execution seam.** It
   opens a session to a host, runs a command (streaming stdout/exit), and transfers
   files — with the same redaction/fail-closed discipline as
   `CloudflareConnectionManager` (credential resolved only at call time, never logged
   or returned). Concrete transports are **adapters** behind the port: an **SSH
   adapter** for any Linux box, a **provider-API adapter** per vendor (Hostinger,
   etc.) for create/resize/reboot/snapshot/destroy. Domain code never names a vendor.

2. **Agentless (SSH push) first; pull-agent is a later, optional adapter.** v1 manages
   hosts over SSH with no software installed on the box beyond an AP service user.
   This ships value on Hostinger immediately and reuses the connection-manager and
   secret discipline unchanged. A pull-agent (host dials home, continuous reconcile,
   NAT traversal) is added only when continuous drift-correction or large-fleet
   fan-out demands it — as another `ManagedHostPort` adapter, not a rewrite.

3. **Configuration is desired-state, reconciled by the generalized provisioning-step
   contract.** The Epic-1021 step contract (`probe()` → `apply()` → re-`probe()`,
   idempotent, `setup-required`/`in-progress` boundaries) is generalized from "the
   local worktree" to an arbitrary **`HostContext`** (local *or* a remote
   `ManagedHostPort` session). "Install package", "enable service", "open firewall
   port", "render config template", "renew TLS" become ordinary verified steps. No
   second reconciler is written.

4. **A `ManagedHostInventory` is the governed source of truth for the fleet.** A
   durable, auditable, bi-temporal record per host: connection refs, **declared
   desired configuration**, last-observed state, and drift. Drift detection is the
   existing read-only `doctor()` probe sweep diffed against desired state. Provider
   packs and day-2 ops act on the inventory, never on ad-hoc state.

5. **Every host mutation is an `irreversible-mutation` App Action with snapshot-backed
   rollback.** Server changes route through the existing App Action admission gate
   (role-gating, approval posture, audit stamped with host identity). Destructive
   tools (`destroy-server`, `wipe-volume`) carry a **non-overridable floor**; risky
   changes render a **dry-run plan** and take a **snapshot before apply** so rollback
   is real; fleet-wide actions enforce a **blast-radius cap** (never patch the whole
   fleet at once).

6. **Provider coverage is delivered as verifiable integration packs.** Each provider
   is an Epic-965 pack: mutating tools paired with read-only verification probes,
   `validModes` gating, connector facet declaring credential refs + scopes. Hostinger
   is the reference `compute-provisioning` pack; a generic `remote-access.ssh` pack
   onboards already-existing boxes. New providers are new packs, not new code paths.

## Consequences

- **Positive:** one governance, verification, credential, and audit path for both
  AP's own hosting and user-managed servers; a creator provisions and operates real
  infrastructure without a shell; new providers are additive packs; the desired-state
  reconciler makes configuration idempotent and drift-correcting; rollback and
  blast-radius caps make irreversible server ops safe by construction.
- **Negative / costs:** the `ManagedHostPort` + SSH adapter is net-new and security-
  sensitive (key custody, host-key verification, command injection surface); the
  provisioning step contract must be carefully decoupled from `LocalServicePortManager`
  without regressing worktree provisioning; remote patching inherits all the
  partial-failure and mixed-state hazards the local UpdateCoordinator avoids only
  because it controls one machine.
- **Open items (resolved in the workstreams):** host-key trust-on-first-use vs pinned
  fingerprints (WS-1); whether the inventory's desired-state is authored as YAML packs
  or assembled by workflow (WS-3/WS-4); the pull-agent protocol and whether it reuses
  the host-runtime (deferred past WS-9).

## Alternatives considered

- **A vendor-specific server manager (e.g. a Hostinger module) wired directly to
  SSH/API:** rejected — couples domain code to a vendor, bypasses pack verification
  and the App Action governance gate, and forces a rewrite for the second provider.
- **Adopt a third-party config-management engine (Ansible/Salt/Terraform) and shell
  out to it:** rejected — violates the zero-technical-expertise mandate (the creator
  would own playbooks/state files), duplicates the idempotent probe/apply reconciler
  AP already has, and puts un-governed mutation outside the audit/approval plane. AP
  may *generate* such artifacts later, but the control plane stays AP-owned.
- **Agent-first (install a daemon on every host before managing it):** rejected for
  v1 — adds an agent to build, ship, secure, and self-update before any value lands,
  and is unnecessary for the push-over-SSH happy path. Kept as a later adapter.
- **A new desired-state reconciler purpose-built for remote hosts:** rejected —
  duplicates the Epic-1021 contract and its boundary model; generalizing the existing
  one to a `HostContext` is strictly less code and inherits the verification discipline.

## Confirmation

Mechanical enforcement to be added by the epics: the cloud-agnostic boundary test
(Story 732.2 pattern) extended to assert no vendor type leaks into `ManagedHostPort`;
a pack-verification gate (Epic 965) requiring every mutating host tool to declare a
paired read-only probe; an App-Action-class gate asserting host mutations are
`irreversible-mutation` and that floored tools cannot be lowered by approval policy.
Until those land, this ADR is **proposed** and reviewed manually.
