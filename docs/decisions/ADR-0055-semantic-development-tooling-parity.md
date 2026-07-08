---
adrId: ADR-0055
shortName: semantic-development-tooling-parity
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: now
source: imported-and-cleaned
---
# ADR-0055: Semantic Development Tooling Parity — Multi-Language Precise Index & Governed Symbol Operations

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** now.
- **Project application:** Keep semantic development tooling parity for TypeScript and Rust. Do not add Python indexers to DWF product tooling.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

- **Source status:** Proposed
- **Date:** 2026-07-02
- **Governs:** the Semantic Development Tooling Parity program (Epics 1188–1191) — the multi-language precise semantic index, the first-class governed symbol operations (rename / insert / replace / safe-delete), position-based addressing and read-surface completeness, and the end-to-end surfacing/usability gate.
- **Supersedes / relates to:** builds on the code knowledgebase substrate (Epics 99–105, 224–229), the SCIP precise cross-reference layer (Epic 226, currently off-by-default), the code-intelligence & refactoring fabric (Epics 12, 25, 29, 33, 37, 493), the requirements-traceability persist path (Epics 356–360), the deterministic relocate engine and knowledge-organization freshness ports (`knowledge-organization-and-freshness`), and the App Action governed-mutation plane (ADR-0038). Extends `docs/technical/traceability-capability-map.md` with a code-intelligence read/mutation surface.
- **Plan:** docs/technical/semantic-development-tooling-serena-parity-plan.md (source path: `../technical/semantic-development-tooling-serena-parity-plan.md`)

## Context

Serena (oraios/serena) is a widely-cited "IDE-for-your-agent" MCP toolkit. It gives an LLM agent IDE-grade semantic capability by putting a **Language Server Protocol (LSP)** layer between the agent and the code: symbol-precise, position-aware retrieval (`find_symbol`, `get_symbols_overview`, `find_referencing_symbols`, `find_implementations`, `type_hierarchy`, `find_declaration`) and symbol-level editing (`rename`, `replace_symbol_body`, `insert_before/after_symbol`, `safe_delete`) across 40+ languages, plus agent scaffolding (project memories, onboarding, shell/search utilities).

An evaluation of Action Plan against Serena found that Action Plan **already matches or exceeds Serena on semantic retrieval** (three-channel retrieval: symbol-exact + FTS5/trigram lexical + sqlite-vec embeddings; `query_codebase`, `get_file_outline`, `get_symbol_source`, `resolve_symbol`, `find_references`, `find_implementations`, `who_imports`, `analyze_call_graph`) and **exceeds it on governance, requirements traceability, ADR/decision knowledge, federated governed answers, and the agent memory ledger**. Three substantive gaps remain relative to Serena's *development* capability (the interactive-editor features — hover, live completion, editor extensions — are deliberately excluded; they serve a human-in-an-IDE, not an agent platform):

1. **Precise semantics are TypeScript-only.** Serena gets exact symbols/references for 40+ languages from LSP. Action Plan is precise only where the SCIP layer runs (TypeScript, and it is off by default per Epic 226.1 golden-byte stability); every other language falls back to AST-heuristic + embedding edges, so `find_references` / `find_implementations` are best-effort outside TypeScript.
2. **Symbol-level editing is designed but not a first-class, callable agent tool.** The mutation taxonomy (`rename-symbol`, `insert-before-symbol`, `insert-after-symbol`, `replace-symbol-body`, `safe-delete-symbol`) with governance states, reference-coverage requirements, and safe-next-actions is fully specified in `federatedCodeIntelligenceContracts.ts`, but it is routed through the host-runtime MutationService seam rather than surfaced as directly-callable, verified MCP tools the way Serena's `replace_symbol_body` is. Reliable rename in particular *depends on* precise references, which loops back to gap #1.
3. **Addressing is name/ID-based, not position-based.** Serena can act on "the symbol at `file:line:col`." Action Plan addresses symbols by name/`symbolId`, and lacks a `type_hierarchy` read surface.

We must decide *how* to close these gaps without regressing the snapshot/freshness/degradation architecture, the golden-byte SCIP stability guarantee, or the governed-mutation safety model — and how to guarantee the result is genuinely usable end-to-end, not a set of orphaned handlers.

## Decision

1. **Reach Serena-class semantic capability by extending the existing code-knowledgebase substrate — NOT by adopting a live LSP session runtime.** Precise cross-references for additional languages come from **batch SCIP indexers** (`scip-python`, `scip-java`, `rust-analyzer`→SCIP, `scip-go`, `scip-clang`, plus `scip-typescript` promoted to default-on) behind one **language-indexer plugin contract**, each feeding the *same* code-knowledge edge store with `provenance: precise`. This reuses the snapshot, freshness (`current | partial | stale | blocked | rebuild-required`), and degradation machinery unchanged. A live LSP client pool is explicitly rejected below.

2. **Promote the already-designed semantic mutation contracts to first-class, callable, governed MCP tools.** The five `SemanticMutationOperationKind` operations become `code_knowledge.rename_symbol`, `code_knowledge.insert_before_symbol`, `code_knowledge.insert_after_symbol`, `code_knowledge.replace_symbol_body`, and `code_knowledge.safe_delete_symbol`, each following a **preview → apply** protocol routed through the host MutationService and the ADR-0038 governed-mutation path. They are **fail-closed on reference precision**: a mutation whose blast radius depends on heuristic-only references for a *public* symbol returns `blocked` with `route-through-governed-mutation` / `refresh-semantic-index` guidance rather than applying an unsafe edit. Apply is atomic, re-indexes the affected slice, and is verified through the sanctioned `verify.cjs` path.

3. **Add position-based addressing and complete the read surface.** All read and mutation tools accept a `file:line:col` locator in addition to `symbolId` / `symbolName`. Two read tools close the navigation gap: `code_knowledge.type_hierarchy` (supertypes/subtypes over `implements` / `extends` edges, precise where available) and a directory/file `get_symbols_overview` parity mode plus a declaration-vs-definition `find_declaration` alignment.

4. **"Fully wired and usable" is a mechanical release gate, not a hope.** Every new tool must be (a) registered in the code-knowledgebase MCP server (`server.ts` tool definition + dispatch case + handler file), (b) added to `.claude/settings.json` `permissions.allow`, (c) declared in `.mcp.json` `ACTIONPLAN_CODE_KNOWLEDGE_GOVERNED_MUTATIONS` when it mutates, (d) given CLI parity (`ap code …`) with deterministic fixture-backed integration tests, and (e) documented as Application-Knowledge atoms and in the capability map. A **surfacing-coverage gate** fails the build if a shipped semantic tool is not registered + permissioned + documented, and an **end-to-end parity suite** proves the Serena capability matrix (overview → find → navigate → rename → verify) actually round-trips.

5. **Non-goals (explicitly out of scope).** Interactive editor integration (hover-on-cursor, live completion, VS Code / JetBrains extensions), keystroke-driven navigation, and inline diagnostics are **not** pursued: they serve a human editing in an IDE, whereas Action Plan's model is governed, async, agent-driven development. Language coverage targets a representative precise set (TypeScript, Python, Java, Rust, Go, C/C++) behind the plugin contract, not "all 40+" — additional languages are additive plugin work, not new architecture.

## Consequences

- **Positive:** cross-language precise references and safe rename land together (Decision 1 unblocks Decision 2); no new runtime architecture, session model, or foreign dependency; the golden-byte SCIP guarantee is preserved because precise edges remain additive-with-provenance; governance, audit, freshness honesty, and traceability apply to editing exactly as they already apply to retrieval; external agents (Claude Code, Kilo, Codex) can drive the same governed semantic operations through the `actionplan-platform` façade.
- **Negative / costs:** each language precise layer needs its indexer binary detected/provisioned on the host and kept ABI/version-pinned (fail-soft when absent — that language simply stays heuristic); mutation apply adds re-index + verify latency unsuitable for keystroke editing (acceptable — agent workflows, not interactive typing); the surfacing gate and parity suite add CI surface that must be maintained.
- **Open items (resolved in the epics):** exact indexer provisioning/detection policy (Epic 1188); the precise-reference-coverage threshold that flips a rename from `preview-ready` to `blocked` (Epic 1189); whether `type_hierarchy` ships heuristic-partial before precise edges exist for a language (Epic 1190); the external-platform workflow surface for semantic operations (Epic 1191).

## Alternatives considered

- **Adopt a live LSP client pool (Serena's `SolidLanguageServer` model).** Rejected as the primary mechanism: it introduces a real-time, stateful, per-language session runtime that fights Action Plan's batch/index/snapshot architecture, duplicates a second source of symbol truth alongside the code-knowledge store, and buys latency characteristics (sub-100ms hover) that an agent platform does not need. SCIP indexers deliver the same precise edges into the existing store. (A future opt-in LSP adapter for on-demand position queries is not precluded, but it is not required for parity and is not in this program.)
- **Expose mutations only through the CLI / host-runtime, not as MCP tools.** Rejected: it leaves the capability undiscoverable to agents and to external platforms, and fails the "usable" bar in Decision 4.
- **Ship rename without gating on precise references.** Rejected as unsafe: a rename driven by heuristic references silently misses or corrupts call sites in large codebases — the exact failure mode precise semantics exist to prevent.
- **Chase full 40+ language and interactive-editor parity.** Rejected as scope inflation against a non-goal: the development value is symbol-precise retrieval + safe editing across the languages Action Plan builds in, not an IDE UI.

## Confirmation

Enforcement is added mechanically by the epics: the surfacing-coverage gate (Epic 1191) fails the build when a shipped semantic tool is not registered + permissioned + documented; the end-to-end parity suite (Epic 1191) asserts each Serena-parity capability round-trips through the sanctioned `verify.cjs` path; per-language precise-layer freshness/degradation assertions (Epic 1188) and mutation preview/apply/rollback assertions (Epic 1189) run in the `code-knowledgebase` and CLI integration suites; and the feature-set overlay gate (`docs/product/feature-sets/_generate.cjs --check`) requires every epic to be homed. The program is complete only when an agent can, from a cold checkout, overview a file, find a symbol's references across a non-TypeScript language, navigate its type hierarchy, rename it safely, and see the edit applied and verified.
