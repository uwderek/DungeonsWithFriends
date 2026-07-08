---
adrId: ADR-0045
shortName: flexible-data-fabric-records-platform
status: accepted
date: 2026-07-07
dwfDisposition: adapted
roadmapLane: next
source: imported-and-cleaned
---
# ADR-0045: Flexible Data Fabric & Records Platform

## DungeonsWithFriends Application

- **DWF disposition:** adapted.
- **Roadmap lane:** next.
- **Project application:** Use flexible records for DWF character sheets, systems, campaign records, scene views, and derived projections.
- **Source cleanup:** Source-specific epics, story IDs, paths, scripts, MCP names, and product nouns in the historical text below are non-governing for DungeonsWithFriends. Use current DWF paths, the ADR-0059 platform baseline, and any future DWF ADRs instead.

- **Source status:** Proposed
- **Date:** 2026-06-27
- **Governs:** Epics 1022–1030 (the NOW "Data Fabric MVP")
- **Supersedes / relates to:** generalizes the schema-as-data pattern of source-era
  knowledgebase-architecture (Epic 230); consumes the platform ports of Epic 732; realizes
  the unbuilt intent of Epic 1014 (Primitive Schema Authoring) for *user data* rather than
  *workflow schema*.
- **Plan:** flexible-data-fabric-and-erp-foundation-plan.md (source path: `../technical/flexible-data-fabric-and-erp-foundation-plan.md`)

## Context

Action Plan tracks customer lifecycle (Epic 69) and HR (Epic 280) as bespoke per-record
JSON files and templates. Across ~190 workflows in ~10 domains, nearly every workflow emits
structured business data — preferences, alerts, metric snapshots, approvals, run provenance,
and domain master records (Deals, Tickets, Invoices, Employees, Vendors, Products). Today
there is **no general, queryable, multi-user record store**: no Customer entity you can
filter/sort/report on, no home for order history, no Airtable-class tables/views. The
maintained "customer summary" feeding an email response is a recomputed projection, not an
editable record. The platform needs one flexible data layer that starts local and single-user
and scales toward collaborative, multi-backend, and eventually ERP — and that doubles as the
storage library for user-built ("vibe coded") apps.

## Decision

Build a **Data Fabric**: user/system-defined **Datasets → Records → Fields → Views →
Automations**, governed and queryable, under every role's workflows. The load-bearing
choices:

1. **Schema-as-data that materializes *real* columns — not EAV.** Dataset/Field definitions
   are governed registry rows (extending the Epic-230 STRICT/WAL SQLite pattern). Each
   Dataset materializes a **real physical table**; each queried/sorted field is a **real
   typed column** (native indexes, constraints, FKs, FTS preserved). A single `extras` JSONB
   column holds the sparse tail; **a JSON key is promoted to a real column the moment it is
   filtered/sorted/indexed.** This follows the Frappe DocType / Odoo `ir.model` / Twenty
   metadata-row blueprint and explicitly rejects EAV.

2. **Multi-backend = adapter-per-backend behind one `DatasetRepository` interface; "transfer
   across databases" = a migration/export capability, NOT a runtime "one schema runs on any
   DB" promise.** Cross-database portability is a leaky abstraction and is structurally
   impossible across the SQL/NoSQL boundary. The local adapter is designed against a
   **libSQL-compatible surface** so the Turso escalation (decision 4) stays drop-in.

3. **Do NOT add a separate NoSQL engine.** Postgres + JSONB + pgvector (hosted/Neon) and
   SQLite + JSONB + sqlite-vec (local) already *are* the document + vector store (Notion runs
   a document model on sharded Postgres at 200B+ rows). A second engine buys the dual-write
   problem and a second sync pipeline for no gain.

4. **The single named escalation is a local-engine swap to libSQL/Turso** if local vector
   scale outgrows sqlite-vec's brute-force KNN ceiling (~1M vectors) — same SQL dialect,
   native DiskANN, ~$4.99/mo managed tier ("Neon for SQLite"). Not a new document DB.

5. **Files stay the source of truth; a database is a rebuildable derived index — never the
   primary copy of document content.** Documents/artifacts remain markdown/JSON on disk (and
   object store for blobs) with a rebuildable FTS + vector + metadata index fed by CDC/outbox,
   never a dual write. The companion **File Fabric** (NEXT) is a uniform read/write/list/
   version/lock interface over files, not a migration of files into NoSQL.

6. **Concurrency tiers:** single-user (direct), async multi-user (record-level LWW + advisory
   file locking), and opt-in real-time co-editing (Yjs CRDT per dataset/document hosted in a
   Cloudflare Durable Object — LATER). The "scalable NoSQL with sync" need is realized by the
   CRDT-over-DO tier, not by adopting a general NoSQL database.

7. **CRUD is a governed workflow primitive and a first-class UI surface.** `db-record-*`,
   `table-query`, `view-project` join the existing handler families; the shipped DataTable/
   KanbanBoard (Epic 854) bind to fabric queries. **Automations** (on-change → enqueue a
   workflow step) let new workflows (e.g. offboarding) extend the fabric via registry rows.

## Consequences

- **Positive:** one substrate under CRM/HR/finance/legal/all domains; reuses the platform's
  biggest existing assets (Epic 230 schema-as-data, Epic 732 ports, Epic 854 grids); honest
  portability that ships; delivers the ERP prerequisite of a shared/master data model
  (full-erp later set (source path: `../product/roadmap/later/full-erp-agent-native-system-of-action.md`));
  the same library powers user-built apps.
- **Costs / risks:** runtime DDL must be serialized (a schema-change lock) and a column-drop/
  compaction path is mandatory (Frappe's dead-column trap); real-column counts must respect
  the 1,600-col / row-size ceilings; the customer-360 cutover must dual-write before retiring
  the JSON projection. CRDT collaboration and BYO-backend are deferred (LATER) to keep NOW
  shippable.

## Alternatives considered

- **EAV / pure-JSONB store** — rejected: EAV destroys query ergonomics; bare JSONB is ~160×
  slower than a real column for filtered/sorted access and bloats GIN indexes at write scale.
- **Adopt a NoSQL engine (MongoDB / SurrealDB / RavenDB / Couchbase Lite)** — rejected:
  MongoDB has no embedded mode and EOL'd Realm/Device-Sync; the others add a new engine +
  query language + license friction for no gain over Postgres/SQLite JSONB+vector here.
- **An ORM that promises portable schema across backends (Prisma "any DB")** — rejected: the
  abstraction is leaky and breaks at the SQL/NoSQL boundary; portability belongs in our
  adapter layer (Drizzle's stated stance).
- **Convert all files into a NoSQL document store** — rejected: breaks diffability,
  portability, offline, and direct-edit; Logseq's DB migration is the cautionary tale.
