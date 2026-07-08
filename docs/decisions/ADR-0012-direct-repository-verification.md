---
adrId: ADR-0012
shortName: direct-repository-verification
status: accepted
date: 2026-07-08
dwfDisposition: adapted
roadmapLane: now-later
source: imported-and-cleaned
---
# Direct Repository Verification

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** now-later.
- **Project application:** Verification runs through direct repository commands for Expo, TypeScript, TinyBase, Jest, Playwright, and Stylelint. Future Cloudflare, Neon/Postgres, WorkOS, or Tauri/Rust checks should be added as repo-owned scripts or CI jobs rather than as an external agent-only requirement.
- **Source cleanup:** Source-specific epics, story IDs, product nouns, and non-DWF tool paths from the imported ADR are non-governing for DungeonsWithFriends. The DWF decision below is authoritative.

## Context

DungeonsWithFriends needs repeatable verification that works for human developers and AI agents in the same checkout. The previous imported policy pointed at an external agent testing path and blocked direct Jest/Playwright scripts. That made local verification harder and created confusing closeout language whenever the external path was unavailable.

The current project baseline is local-first Expo/React Native with TinyBase and TypeScript. The practical verification surface is therefore:

- TypeScript typechecking.
- Co-located Jest tests.
- Playwright E2E tests for browser-level flows.
- Stylelint for CSS/Tailwind/style files.
- Targeted repository scans for architecture constraints such as no current auth/hosted-provider leakage.

## Decision

- Use direct repo commands for local verification.
- `DungeonsWithFriends/package.json` owns the primary scripts:
  - `npm run typecheck`
  - `npm test -- --runInBand`
  - `npm test -- --runInBand <test-path>`
  - `npm run test:e2e`
  - `npm run lint:css`
  - `npm run check`
- Feature work should run the narrowest useful test first, then broaden when the blast radius warrants it.
- If a command cannot run, report the exact blocker and continue only when the remaining evidence is enough for the risk of the change.
- New verification surfaces for later hosted/native work should enter the repo as scripts, tests, or CI configuration that a developer can run directly from the checkout.

## Consequences

- The verification path is available to humans and agents without a special external test service.
- Package scripts no longer block direct Jest or Playwright use.
- Story closeouts can cite concrete commands and outputs instead of a missing external tool.
- CI can reuse the same commands that developers run locally.
- The team still keeps disciplined verification, but the discipline is enforced by repository scripts, tests, reviews, and CI rather than by an agent-only wrapper.

If reversed, the project would again depend on a non-local test path and future agents could mistake missing external tooling for an acceptable reason to skip unit or E2E checks.

## Alternatives Considered

**External agent-only verification path.** Rejected for DWF now-roadmap work because it makes local development and AI development diverge. Direct repo commands are easier to document, easier to run, and easier to wire into CI later.

**No prescribed verification scripts.** Rejected because stories still need consistent closeout evidence. Direct scripts preserve consistency without creating an external dependency.

## Relationship to Other ADRs

- **ADR-0005** keeps git-tracked Markdown as canonical documentation. This ADR defines the verification path those docs should point to.
- **ADR-0023** defines coverage expectations. Coverage should be gathered through direct Jest coverage output or future repo scripts.
- **ADR-0024** defines test co-location. Co-located tests are run through direct Jest commands.

## Confirmation

This ADR is confirmed by `DungeonsWithFriends/package.json`, `DungeonsWithFriends/README.md`, and `docs/testing/strategy.md`. Verification guidance should stay aligned across those files.
