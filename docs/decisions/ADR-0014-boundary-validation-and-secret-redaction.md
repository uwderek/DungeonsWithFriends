---
adrId: ADR-0014
shortName: boundary-validation
status: accepted
date: 2026-07-07
dwfDisposition: adopted
roadmapLane: now
source: imported-and-cleaned
---
# Boundary Validation, Fail-Closed, and Secret/PII Redaction

## DungeonsWithFriends Application

- **DWF disposition:** adopted.
- **Roadmap lane:** now.
- **Project application:** Validate all boundary inputs and redact secrets for TinyBase data, import/export, and future WorkOS callbacks, Cloudflare handlers, Tauri commands, Neon sync, and AI boundaries.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

## Source Status

accepted

## Context

Three coupled safety policies govern every transport adapter, MCP server
entrypoint, and logging call site in this repository:

1. **Validate inputs at every system boundary.** Untrusted data crossing a
   process or transport boundary is validated explicitly; the validator
   rejects invalid input with a specific error rather than silently
   defaulting.
2. **Fail closed with explicit errors.** When validation fails, the system
   refuses to proceed and surfaces a precise diagnostic — never a silent
   partial state.
3. **Never log secrets, tokens, or PII; redact at the log call site.** Logs
   leak when secrets are interpolated into messages or when bulk payloads
   are logged "for debugging". Redaction lives at the call site, not in a
   post-processing pass.

These rules already live in CLAUDE.md (§Security & Safety) and the
`security-privacy-safety.yaml` pack, but the cost of any one slipping past
review is incident-shape (silent partial state, security exposure,
compliance violation). Promoting the three coupled rules into one queryable
ADR raises the cost of slipping past review and surfaces the trio whenever
an agent edits an adapter, an MCP server, or a logging module.

## Decision

Every adapter, transport handler, MCP server entrypoint, and logging module
implements all three rules:

- Inputs at system boundaries are validated by an explicit schema or guard;
  invalid input is rejected with a precise error and a stable error code.
- Failures are explicit and surfaced — never a silent partial state or
  best-effort retry that masks the original error.
- Secrets, tokens, and PII are never logged. Redaction happens at the log
  call site (the contract is shape-based, not regex-based after the fact).

## Consequences

- The blast radius of an untrusted input is the validator, not the rest of
  the service.
- Operators see the precise failure mode in logs and surface alerts; they
  do not debug a silent partial state from telemetry archeology.
- Logs are safe to ship to operator inboxes, incident reviews, and
  third-party log sinks without a privacy-engineering audit.

If reversed, silent partial states accumulate, security exposure compounds
quietly, and a single careless `log.info("payload:", req.body)` becomes a
compliance incident.

## Alternatives Considered

"Trust internal callers and skip validation; trust developers not to log
secrets." Rejected: the first untrusted edge invalidates the trust
assumption (every adapter eventually receives data from outside the trust
boundary), and a single careless log statement leaks a secret to every log
consumer downstream.

## Relationship to Other ADRs

- **ADR-0006** (metadata-only governance by default) governs cross-MCP-boundary
  disclosure: what metadata an MCP tool may emit to its caller. ADR-0014
  governs input validation at *every* boundary and log redaction at the call
  site. The two reinforce each other (a metadata-only payload is safer to
  log) but are independently reversible.

## Confirmation

This ADR is enforced through code review using
`Agents/_shared/best-practice-packs/security-privacy-safety.yaml` (which
carries `adr: ADR-0014`) — Confirmation is `mechanism: manual` because the
three rules are judgement-coupled (Is this input from a trust boundary? Is
this log line shaped to leak?).

The PreToolUse hook `.claude/hooks/inject-governing-adrs.mjs` pins ADR-0014
on edits to host-runtime services, MCP server entrypoints, the shared
logging package, and the safety package.

**Future work.** A boundary-validation lint that flags log call sites
interpolating known secret-shaped values, and a per-package "boundary
inputs are validated" contract test, could automate parts of the check.
That work is explicitly out of scope of this ADR — this ADR encodes the
discipline so the follow-up has a clear authority to point at.
