
owner: Divyaraj Murugan feature: "[[Integrations-CRM]]" version: 1 status: In Review priority: High tags: custom objects — Companies, Contacts and Deals with all their field types, the relationships between them, all activities, record attachments, pipelines and stages, users, and formula-field definitions translated into SparrowCRM formulas.

**Flow in one line:** Connect → Configure (Objects · Mapping, with breadcrumbs) → Validate (replaces Review) → Migrate → Results.

Sibling module: [[Import_v1]] (CSV/Excel import), which explicitly scopes connectors out — _"This is NOT a CRM-to-CRM migration tool. Direct connectors to Salesforce, HubSpot, Pipedrive are a separate module."_ This is that module.

Related: [[Custom Objects_v1]]. See [[#Dependency on Custom Objects|Dependency on Custom Objects]] — the dependency is **one-way**: Migration v 2 waits on Custom Objects shipping; Custom Objects does not wait on this module.

Wireframe: `HubSpot-Migration-v1-Wireframe.html`

Table of Contents

- [[#Problem Statement|Problem Statement]]
- [[#Scope|Scope]]
- [[#Dependency on Custom Objects|Dependency on Custom Objects]]
- [[#Competitive Teardown|Competitive Teardown]]
- [[#Design Principles|Design Principles]]
- [[#JTBD|JTBD]]
- [[#Goals|Goals]]
- [[#Non-Goals|Non-Goals]]
- [[#Flow Architecture|Flow Architecture]]
- [[#Requirements|Requirements]]
- [[#Screen States Matrix|Screen States Matrix]]
- [[#Technical Considerations|Technical Considerations]]
- [[#Success Metrics|Success Metrics]]
- [[#Open Questions|Open Questions]]
- [[#Edge Cases|Edge Cases]]



## Problem Statement

A prospect who has decided to switch to SparrowCRM has their operational reality sitting in HubSpot: accounts, the people at those accounts, the deals in flight, the entire history of what was said and done on each one, who owns what, and the pipeline their forecast depends on.

The only way in today is CSV, which fails at three things that matter. A spreadsheet has one row per record and HubSpot's data is a graph, so **associations are lost** and the customer arrives with three disconnected lists instead of a CRM. The CSV importer supports Contacts, Companies and Deals only, so **no activity history can come across at all** — every account arrives with an empty timeline. And the customer has to run a sequence of exports and imports in dependency order, which they get wrong, producing duplicates and orphans.

The consequence is that switching cost, not product preference, decides the deal.

This module makes the move a supervised, reversible, self-serve operation. Connect HubSpot with read-only OAuth, land on a single page where everything is already configured from the customer's own HubSpot setup, run it, and get a reconciliation report. A catch-up pass handles whatever changed while it ran, and revert undoes it exactly if it went wrong.

### Why this is a wedge, not parity work

The competitive survey found that almost nobody builds this properly. Attio, Pipedrive and Close all outsource CRM-to-CRM migration to a third party called Import 2 and redirect the user off-platform — Attio's flow includes creating a _second account_ on a third-party domain mid-migration, and its documented error handling is "email support your migration ID and a screenshot". Folk markets migration and ships a CSV importer. Pipedrive has a native connector for 40+ CRMs and **not** for HubSpot, its largest competitor.

Only HubSpot's own Smart Transfer and Zoho's API migration are genuine first-party connectors, and neither translates formula fields. The bar on mapping, dedupe, resumability and error reporting is low, and HubSpot is the most common source CRM in our target segment.

---

## Scope

### In v 1 — everything except custom objects

|Category|In v 1|
|---|---|
|**Objects**|Companies, Contacts, Deals|
|**Relationships**|Contact↔Company, Deal↔Company, Deal↔Contact. Primary and additional associations. The full data model of how records connect.|
|**Properties**|All field types with all their dropdown / select / multi-select options|
|**Formula fields**|**Definitions translated** from HubSpot calculation properties into SparrowCRM formulas. Not data — the formula itself.|
|**Activities**|Emails, calls, notes, meetings, tasks|
|**Files**|Record attachments — PDFs, images, documents, contracts, attached to the record they belong to|
|**Pipelines**|Pipelines and their stages, including Closed Won / Closed Lost semantics|
|**Users**|The HubSpot user list, with per-user selection: map to an existing SparrowCRM user, invite as a new one, or skip|

### In v 2 — gated on SparrowCRM Custom Objects shipping

Custom objects, their fields, their associations, their activities, their files, and custom-object pipelines. Blocked on [[Custom Objects_v1]] — see below.

### Not migrating at all

|Not migrated|Reason|What we do instead|
|---|---|---|
|Workflows, sequences|HubSpot's action graph has no portable equivalent|Export a readable summary per workflow so the customer can rebuild them|
|Forms and form submissions|HubSpot's API does not expose historical submissions|Contact fields the forms populated still migrate|
|Marketing email, campaigns|Outside a CRM migration|—|
|Call recording **audio**|Recordings stay in HubSpot storage|Preserve `hs_call_recording_url` as a link on the Call activity|
|HubSpot proprietary scores|Not formulas — internal ML output, e.g. `hs_lead_score` |Listed in the exclusions report|
|Field change history|Not usefully exposed by the API|Keep HubSpot read-only for reference|
|Lists|Static lists are straightforward; active lists are not portable at all|v 1.1|
|Tickets, Products, Line items, Quotes|Not core to the switching decision|v 1.1|
|Association labels (Decision maker, Billing contact)|Label type IDs are account-specific; paired labels carry two names on one edge|v 1.1 — links migrate, labels don't|
|Ongoing two-way sync|Different product|Separate module|
|Salesforce, Pipedrive, Zoho as sources|Framework accommodates them; only HubSpot ships|v 2|

### What this scope costs

Restoring activities and files roughly doubles the build and returns duration to the **4–7 hour** band for a 112,000-record portal. Execution goes from 7 tasks to **13**. Attachments become the wall-clock bottleneck again — private files need a per-file signed-URL call and uploads are one file per request, so roughly two calls per attachment against a hard ceiling of about 11 requests per second.

This is a deliberate trade. A migration that lands records without history produces a skeleton CRM, and the customer notices on day one. Shipping the full picture is what makes the switch survivable, and it is what unblocks internal dogfooding.

---

## Dependency on Custom Objects

The dependency is **one-way: Migration v 2 depends on Custom Objects. Custom Objects does not depend on this module.**

Migration v 2 cannot migrate HubSpot custom objects until SparrowCRM has custom objects to land them in — the schemas, the association model (R-P 0-5) and the record pages all have to exist first. That is the entire gate on v 2, and it sits on the Custom Objects track.

The reverse dependency does not exist. Custom Objects' import requirement (**R-P 0-6**) is **file-based** — it reuses [[Import_v1]]'s CSV flow and validation engine, not this HubSpot connector. And its release gate (G 1, our own sales team off HubSpot) is reachable without Migration v 2: Migration v 1 moves the core objects, activities, files, users and pipelines, and the custom-object data comes across by file through R-P 0-6. Migration v 2 later makes that same move self-serve and API-driven for customers, but G 1 does not wait on it.

Sequencing, then: **Migration v 1 and Custom Objects v 1 proceed on independent tracks; Migration v 2 follows Custom Objects.**

One coordination point remains, and it is ownership rather than dependency: the association model — cardinalities, self-reference, labels — is defined and built by Custom Objects (R-P 0-5). This module **consumes** that model when v 2 arrives; it keeps only its internal ID map and must not invent a parallel link store. Anything Migration v 2 will need from the association model is a requirement on the Custom Objects data model and belongs in that PRD.

---

## Competitive Teardown

Research date 4 Aug 2026. Sources at the end.

|Product|Native connector?|Auth|Activities|Files|Formula fields|Dedupe / upsert|Undo|Error reporting|
|---|---|---|---|---|---|---|---|---|
|**HubSpot Smart Transfer**|Yes, 13 sources|Per-app connect|Yes|Not documented|No|Data-sync unique IDs|**Stage-scoped revert**|Downloadable error log|
|**Zoho CRM**|Yes, API, 7 sources|HubSpot private-app token|Yes — notes, calls, tasks, meetings|Not documented|No|Post-migration upsert, "untouched records only"|3 undos, bounded|Per-module counts; **pauses at >5,000 skipped**|
|**Pipedrive**|Import 2, 40+ — **not HubSpot**|Credentials + "Test connection"|Yes|Yes|No|Not documented|**Unlimited free undo/redo**|Escalate to Import 2 chat|
|**Attio**|Import 2, off-platform|**Separate Import 2 account**|Claimed, unverified|Yes|No|**Insert-only — will not update existing records**|Via Import 2|"Email support with migration ID + screenshot"|
|**Close**|Import 2|API token or credentials|**No for Salesforce — "non-transferable"**|Yes|No|Not documented|Via Import 2|Email on completion|
|**Folk**|**No — CSV only**|n/a|No|No|No|No|No|No|

**Nobody translates formula fields.** Every product in this survey either skips calculated properties or migrates their last computed value as a static number. Doing the translation is a genuine differentiator and the thing a RevOps evaluator will notice, because rebuilding forty calculated properties by hand is a week of their life.

### Attio's migration — the anti-pattern

Path: workspace settings → Migrate CRM → pick source → redirect to Import 2 → create an Import 2 account → connect both accounts → optional Configuration → sample migration → verify in Attio → adjust mappings → "Request full migration", then refresh the page to get a start button.

The instructive part is the cascade. Import 2 is **insert-only** — it will not update attribute values on records that already exist. That single constraint produces a hostile prerequisite list: every workspace member must remove their synced mailbox, and Attio tells customers to **delete all person and company records** before migrating. Schema arrives as a side effect — the sample "creates attributes in your workspace", after which the user is told to "update or archive as needed". Progress UX is a manual page refresh.

Worth noting for our own design: **it is not an audit that makes migration safe, it is idempotency and revert.** Attio needs the scorched-earth prerequisites precisely because it has neither.

### Smart Transfer, hands-on (5 Aug 2026)

We ran Smart Transfer ourselves (Pipedrive → HubSpot test portal). Findings the docs didn't show:

**Their "Configure transfer" step is schema-only.** Its CONFIGURED / CREATED / ERRORS tiles count settings — properties, pipelines, users, workflows — not records. Records move in a separate top-level step (Sync records), bridged by an "Automatically start sync (recommended)" toggle. We fuse schema + records into one Run with the verify checkpoint; theirs is two ceremonies. Deliberate fork, ours kept.

**Record view = the ID map as UI.** A per-record table of `Hubspot id ↔ Pipedrive id` with deep links into both systems. Direct validation of our `HubSpot ID` map; adopted as a proposed third view on our Report (P 1 below).

**Created properties are namespaced `migrated_*` ** (`migrated_code`, `migrated_price`). Collision-safe but permanent clutter. We map into native attributes instead; our duplicate-mapping validation carries the collision burden their prefix does.

Also observed: dependency locking as greyed forced checkboxes ("Has dependent data type"); inline validation errors in the data-type list; task statuses **OK / Loading / Needs review** (we adopt "Needs review" as our amber label); a metered credits bar (their throttle made visible — ours is the duration band plus the Throttled state); wizard sub-steps **Data types → Configure → Review** inside Configure; a Review screen with included/not-included totals (their schema diff); "Transfer more data" as the catch-up entry point; and Clean up as a one-shot, type-to-confirm operation with 90-day property restore and "cloned workflows lose event history" honesty.

### Patterns we take, and where they land

|Pattern|Source|Where it lands|
|---|---|---|
|Inventory before anything moves|Smart Transfer|**Not a screen.** Counts render inline on Configure; the report is a download|
|Free repeatable verify run|Trujay, Close, Attio|**Phase 1 of Migrate**, machine-verified, not a step|
|State what will NOT transfer|Close|Permanent panel on Configure, repeated in the run confirmation|
|Scoped revert|Smart Transfer|Revert screen, scoped by task|
|Excluded ≠ Failed|HubSpot Data Sync|Separate columns everywhere, never summed|
|Named delta / catch-up pass|Trujay|Its own screen; the actual switch-over event|
|Skip-rate circuit breaker|Zoho (>5,000 skipped)|Pauses at 5% or 5,000, names the dominant error|
|"Untouched records only" upsert|Zoho|Visible toggle on catch-up with a conflict count|
|Per-task cancel|Smart Transfer|Task table in Run|
|Schema diff _before_ the run|inverse of Attio|Sticky footer while mapping fields|
|Downloadable error log|HubSpot|Two downloads on the report|
|Connection test before configuring|Pipedrive/Import 2|Connect screen; doubles as the count pass|

---

## Design Principles

**Information is not a step.** Record counts, fill rates and exclusions are data, not decisions. They belong next to the decision they inform. An earlier draft had a dedicated audit screen; it was ceremony and it is gone.

**Open pre-resolved.** Configure arrives with objects selected, users auto-matched by email, pipelines set to recreate, fields auto-mapped, formulas auto-translated and missing attributes queued. The user is confirming, not configuring. In the happy path they answer **zero questions** and click **three** times: Connect, Run, Continue.

**Sections, not screens.** Users, pipelines, fields, formulas, activities, files, duplicates and filters are collapsible sections with a one-line status. They auto-expand only when something needs attention, so page length scales with the mess in the customer's portal rather than with our feature count.

**Exceptions, not walls.** User matching resolves most rows automatically; only the remainder is a decision. Surface the exception list, not the whole table.

**Nothing irreversible.** Read-only against HubSpot, idempotent writes keyed on a stored `HubSpot ID`, and exact revert. This is what removes the need for Attio-style prerequisites.

**Excluded is not Failed.** Excluded is expected and grey. Failed is a problem and red. They never share a column and are never added together.

**Say what you don't do.** The exclusions panel is a feature, not a disclaimer.

---

## User journey & JTBD

One journey line per step (situation → action → exit, with the emotional job it must do), then the JTBD for that step. **Connect is locked** (4 Aug 2026); the rest reflect the final flow (Objects table with status + dependencies, Validate = manifest + 100% scan + optional sample, locked 6 Aug) and are proposed to lock.

### 1 · Connect — locked

> **Journey:** "I've decided to move, and I'm nervous this could touch my HubSpot." Two clicks through HubSpot's own OAuth, portal confirmed back by name/ID/tier, counts fill in while they watch. Anxiety → relief. **Exit:** connected, read-only proven, Configure already populated.

- [ ] As a **Super Admin in SparrowCRM**, I connect my HubSpot with OAuth alone — no API key, no third-party account, no copy-pasting tokens.
- [ ] As a **Super Admin in SparrowCRM**, I pick which HubSpot portal to migrate from (HubSpot's native account picker) and see SparrowCRM confirm exactly which one it got — name, Hub ID, tier.
- [ ] As a **Super Admin in SparrowCRM**, I am certain this cannot touch my HubSpot data — read-only, zero write scopes, disconnect at any time.
- [ ] As a **Super Admin in SparrowCRM**, I know before the OAuth jump that I need HubSpot Super Admin, and if I'm not one, I get a link I can send to whoever is.

_Not JTBD, retained as R 2 system behaviour: the connection test doubling as the count pass, the sandbox-portal warning, and pause-at-checkpoint on token loss._

### 2 · Configure › Objects — proposed (to lock)

> **Journey:** "What exactly is coming across?" One flat table — every object, its count, its dependencies, and a status per row. Nothing to fill in on a clean portal; reading, not configuring. **Exit:** knows the exact shape of the import; every row Ready or an error with a jump link.

- [ ] As a **Super Admin in SparrowCRM**, I see everything I'm going to import in **one table** — records, each activity type, users, pipelines — with counts, and untick anything I don't want.
- [ ] As a **Super Admin in SparrowCRM**, each row shows its **status**: errors if present, otherwise "Ready to migrate" — a problem never waits to surprise me later, and each error links to where it's fixed.
- [ ] As a **Super Admin in SparrowCRM**, each row states its **dependencies** ("needs Companies · Contacts · Pipelines"), so I see the blast radius before I untick anything — and a broken dependency blocks with a one-click fix, never a silent re-tick.
- [ ] As a **Super Admin in SparrowCRM**, I'm never asked about relationships or file attachments — they come with their records automatically.

### 3 · Configure › Mapping — proposed (to lock)

> **Journey:** "Will my fields, people and pipelines land right?" Objects view: click an object in the rail, see all its fields — names and types, never a customer value. Auto-mapping did the work; the user only touches red badges. **Exit:** zero blocking errors; Next unlocks.

- [ ] As a **Super Admin in SparrowCRM**, I click any object and see all its fields — names and types, **never values** — with same-name fields mapped automatically, missing ones marked "New field will be created", and conflicts shown as errors I resolve in place.
- [ ] As a **Super Admin in SparrowCRM**, **new fields are created right here**: each one arrives with name, type and dropdown options **pre-filled from HubSpot**, so creating it is one click — and I can **create all of them at once** instead of one by one.
- [ ] As a **Super Admin in SparrowCRM**, **I'm never forced to bring every field** — I can skip any non-required field (singly or Skip all), and skipped fields land as Excluded, never as errors.
- [ ] As a **Super Admin in SparrowCRM**, I see every HubSpot user with how many records they own, and decide per user — map, invite, or hand their records to someone else — with the seat cost visible before I commit.
- [ ] As a **Super Admin in SparrowCRM**, I see each pipeline and every stage mapping, with Won/Lost meaning preserved, so my forecast looks the same after the move.
- [ ] As a **Super Admin in SparrowCRM**, I see each calculated field with HubSpot's formula next to ours, fix the ones that need me, and know exactly why any can't come _(formulas are just fields, inside Fields)_.

_Review was removed (6 Aug): its job — "show me the whole plan before anything runs" — lives in Validate's import manifest. Upstream errors block inside Mapping itself; there is no later screen to catch anything._

### 4 · Validate — replaces Review · proposed (to lock)

> **Journey:** "Prove it before I pull the trigger." The scan reads 100% of records and activities against real SparrowCRM rules — writing nothing, ~10–15 min — then shows the **import manifest**: everything about to be imported, all checked, plus the complete error list. Confidence is the product of this screen. **Exit:** the primary CTA — **Proceed to migrate**.

- [ ] As a **Super Admin in SparrowCRM**, I see **what all things I am going to import** — every object, relationship, file, new field, user and pipeline with its count — all of it checked, before I commit hours to the run.
- [ ] As a **Super Admin in SparrowCRM**, every record and activity was validated for real, so the error list is **complete, never sampled** — "exactly 3" means exactly 3, and nothing can surprise me mid-run.
- [ ] As a **Super Admin in SparrowCRM**, each error carries record IDs and its consequence in the real run; I either fix it in mapping or proceed knowing precisely what will fail.
- [ ] As a **Super Admin in SparrowCRM**, if the same error hits nearly everything, the system stops me — Migrate locks until the systematic cause is fixed.

### 5 · Migrate — proposed (to lock)

> **Journey:** "Now I wait — safely." Confirms with the known failures stated up front, then 14 tasks in dependency order. Close the laptop, get an email. Interruptions pause at checkpoints, never restart. **Exit:** complete, with zero surprises relative to Validate.

- [ ] As a **Super Admin in SparrowCRM**, I start the run knowing its known failures in advance ("Known from validation: 3 contacts will fail") — Results can't surprise me by construction.
- [ ] As a **Super Admin in SparrowCRM**, I can close the page: it runs server-side, emails me when done, and anything interrupted resumes from its checkpoint.
- [ ] As a **Super Admin in SparrowCRM**, my team isn't flooded — workflows and activity notifications are suppressed for the run.
- [ ] As a **Super Admin in SparrowCRM**, I watch per-task progress with created and error counts, and a task needing attention says **Needs review** rather than failing silently.
- [ ] As a **Super Admin in SparrowCRM**, if something systematic emerges mid-run, it pauses itself (circuit breaker) instead of ploughing on — and I can pause or cancel without losing completed work.

### 6 · Results — proposed (to lock)

> **Journey:** "Did everything make it?" Selected vs created reconciles per object; the only failures are the ones Validate already named. Spot-check, then decide the switch-over. **Exit:** trust established; moves to catch-up.

- [ ] As a **Super Admin in SparrowCRM**, selected = created reconciles per object, with Excluded and Failed never summed — variance is 0.0% or explained.
- [ ] As a **Super Admin in SparrowCRM**, I open any migrated record as a SparrowCRM ↔ HubSpot pair with deep links both ways _(Record view)_.
- [ ] As a **Super Admin in SparrowCRM**, my formulas compute the same numbers as HubSpot, shown side by side on the same records.
- [ ] As a **Super Admin in SparrowCRM**, I download everything that failed as ** `errors.zip` ** — one CSV per object (`contacts_errors.csv`, …), every row: object, HubSpot ID (as a URL), failing field, **error cause**, never field values — and retry just those. This download exists only here, after the migration.

### 7 · Catch-up · Finish · Revert — proposed (to lock)

> **Journey:** "The team kept working in HubSpot — expected." Catch-up on switch-over day, finish when nothing's changed, revert as the always-available escape hatch. **Exit:** fully on SparrowCRM, HubSpot kept read-only.

- [ ] As a **Super Admin in SparrowCRM**, I bring across what changed in HubSpot since the migration, without duplicating anything that already moved and without overwriting my team's SparrowCRM edits.
- [ ] As a **Super Admin in SparrowCRM**, anything irreversible is clearly warned and confirmed by typing, and I can revert the migration without losing work my team has done since — and my reports are kept permanently either way.

### [[Sales Rep]]

- [ ] Find my accounts, contacts and deals correctly linked to each other.
- [ ] Open a record and see its history — calls, emails, notes, meetings.
- [ ] Find the contract or proposal attached to the account.
- [ ] Not be shown a migration UI I have no permission to use.

### [[Sales Manager]]

- [ ] Confirm my pipeline stage distribution matches HubSpot before we switch over.
- [ ] Confirm my calculated fields still compute the same numbers.

---

## Goals

### Business

- Remove switching cost as a deal blocker for HubSpot-based prospects.
- Make migration self-serve so it doesn't consume CS or SE headcount per deal.
- **Unblock internal dogfooding** — get our own sales team off HubSpot.
- Establish a connector framework Salesforce, Pipedrive and Zoho reuse.

### Product

- **No customer values, ever.** The migration UI renders zero customer field values — not in Configure, not in Validate, not in errors, not in exports, not in verification screens. Records are identified by object + ID with deep links; comparisons run server-side and render verdicts (match / differs / N = N), never the values themselves. Counts, field names, types and fill rates are allowed.
- The default path requires no decisions.
- The user knows what will happen before it happens, and can prove it cheaply.
- Nothing is irreversible.
- Failure is attributable to a specific record and reason, and actionable without contacting support.
- It feels like the same product as [[Import_v1]].

---

## Non-Goals

Covered in [[#Scope]]. Additionally and explicitly:

- Not an audit or inventory _screen_. Counts render inline where they inform a decision.
- Not a pre-flight review _screen_. Its one necessary element — workflow suppression with a trigger count — is a confirmation modal.
- Not a separate test-migration _step_. It is phase one of Run.
- Not scheduled or recurring runs. The catch-up pass is manual.
- Not fuzzy duplicate matching. Exact match keys only, consistent with [[Import_v1]].
- Not migrating HubSpot **cross-object rollup** formulas if SparrowCRM lacks cross-object rollups — see Open Questions.

---

## Flow Architecture

```
S1  CONNECT       OAuth (read-only) · connection test · scope check · record counts
S2  CONFIGURE     One page. Fix-list · objects & relationships · users · pipelines
                  · fields · formula fields · activities · files · duplicates
                  · filters · "what won't come across"
S3  VALIDATE      Its own step, gating Migrate. Mandatory: ALL records and
                  activities read and validated against real SparrowCRM rules —
                  reading everything, writing nothing (~10-15 min). Error list
                  is complete, never sampled. Optional: import the first 50 of
                  every object as real records (disclaimer + exact undo), just
                  to see it working. Exit: fix in mapping, or proceed.
S3b MIGRATE       14 tasks, checkpointed, per-task cancel/retry. Failures the
                  validation scan found arrive as known, not surprises
S4  RESULTS       Reconciliation · relationships · activities · files · formulas
                  · failures · downloads · checklist
S5  RESULTS·CONT  Catch-up sync · finish · revert · migration history
```

Thirteen execution tasks, in dependency order:

```
1  Attributes            (field definitions → SparrowCRM attributes)
2  Formula fields        (translated definitions — after attributes, before records)
3  Users                 (map / invite)
4  Pipelines & stages
5  Companies
6  Contacts
7  Deals
8  Relationships         (needs all records to exist first)
9  Notes
10 Calls
11 Emails
12 Meetings
13 Tasks
14 Files                 (last — dominates wall-clock time)
```

Formula fields run **after** attributes because a formula references attributes that must already exist, and **before** records so that values compute as records land. Relationships run after all record tasks because every endpoint must exist. Files run last because they are the slowest and nothing depends on them.

---

## Requirements

### Must-Have (P 0)

---

#### 1. Entry point & permissions

**Location:** Settings → Imports & Migrations. Two tabs: **Imports** ([[Import_v1]]) and **Migrations**.

**Acceptance Criteria**

- [ ] Requires a new **Migrate Data** role permission, distinct from Import Data. Admin-only by default. Users without it do not see the tab.
- [ ] With no migrations, the tab shows the source picker: HubSpot live; Salesforce, Pipedrive, Zoho as **Coming soon** with **Notify me**.
- [ ] With migrations present, shows Migration History with a **New migration** button.
- [ ] Only one migration may be in a non-terminal state per workspace. If one exists, the tab shows a **Resume** card instead of the picker.
- [ ] A link to the CSV importer sits below the grid.

---

#### 2. Connect (S 1)

Native OAuth. The user never leaves SparrowCRM except for HubSpot's consent screen, and never creates a third-party account.

**Pre-consent**

- [ ] Headline promise: **we never write anything to HubSpot.** Literally true — the app requests **no write scopes at all** — and it answers the objection that actually stops deals.
- [ ] Plain-language list of what we read: companies/contacts/deals and their field values; how records link to each other; activity history; files attached to records; users, pipelines and deal stages; field and formula definitions.
- [ ] Expandable "See technical permissions" reveals the OAuth scopes.
- [ ] States the HubSpot-side requirement — **you must be a Super Admin in HubSpot** — before the OAuth jump, not after it fails.

**Post-consent**

- [ ] Runs an automatic **connection test** before offering Continue, showing each check.
- [ ] The test doubles as the **count pass**: record counts per object, activity counts per type with date ranges, file count and total size, property counts, formula-field count, user count including deactivated, pipeline and stage counts. This is why v 1 needs no separate audit screen.
- [ ] Shows portal name, Hub ID, subscription tier, connected-as user.
- [ ] **Granted-scope check** with a degradation panel where scopes were withheld or tier-gated. Each entry states the consequence in user terms — "Fields marked sensitive in HubSpot will be skipped rather than migrated blank" — never a scope string.
- [ ] Warns if the portal looks like a **sandbox** and requires an explicit tick.
- [ ] **Disconnect** available at all times.

**Error states**

- [ ] Consent denied → non-blocking message and Retry.
- [ ] Not a HubSpot Super Admin → names the required role, plus a copyable link their HubSpot admin can use.
- [ ] Portal already connected to another SparrowCRM workspace → hard block. Two workspaces on one portal would collide on `HubSpot ID` and break revert.
- [ ] Token revoked or expired later → global banner; running work **pauses at its checkpoint** and resumes on reconnect. Never fails.

---

#### 3. Configure (S 2) — the core screen

One page, opening fully pre-resolved.

**Structure — two sub-screens with breadcrumbs (1 · Objects › 2 · Mapping)**. **Review was removed (6 Aug):** its job — see the whole plan before committing — lives in Validate's import manifest, and Mapping is the last gate (Next · Validate stays disabled until every blocking error is resolved in place). Within them:

1. **Fix-list** — only when something needs attention. Each row: what's wrong, the consequence with a count, and a button to the section that fixes it. Blocking in red, warnings in amber.
2. **What comes across** — **one table of objects**, not separate cards: Companies, Contacts, Deals, Emails, Notes, Meetings, Tasks, Calls, Users, Pipelines & stages, each a checkable row with its count. **Relationships and file attachments are not shown** — they ride along with their records automatically; a one-line footnote says so.
3. **Settings** — collapsible sections: Users, Pipelines & stages, Fields, Duplicates, Filters. **Formula fields are just fields** — they live inside the Fields section as a field type with a Formulas filter, not as a separate section. Each section shows a status dot and one-line summary when collapsed.
4. **What won't come across** — permanent, non-collapsible.
5. **Sticky footer** — live counts, duration estimate, Run button.

**Acceptance Criteria — page level**

- [ ] Every section arrives resolved. Nothing requires input in the happy path.
- [ ] Sections auto-expand when they contain a blocking error or warning.
- [ ] A clean page shows one green banner with the specifics.
- [ ] Sticky footer counts update live on any change.
- [ ] Duration estimate is a **band**. 4–7 hours for a 112,000-record portal with 312,000 activities and 18,400 files; the footer breaks out which component dominates.
- [ ] Run is enabled from page load when there are no blocking errors.
- [ ] The whole page is a resumable draft, saved continuously.

**3 a. What comes across — one table**

- [ ] A **single Objects table**: Companies, Contacts, Deals, Emails, Notes, Meetings, Tasks, Calls, Users, Pipelines & stages — one checkable row each, with HubSpot count. No card grid, no grouping the user has to parse.
- [ ] **Status column on every row** — errors show here if present; no error means the row reads **"Ready to migrate"**. Mapping errors surface as "N errors — fix in Mapping →" and deep-link to that object's mapping pane; broken dependencies surface as "Blocked — needs X". The card header aggregates: "all ready" in green, or the error count in red.
- [ ] **Dependencies are spelled out on the row** — a one-line note under the object name ("needs Companies · Contacts · Pipelines & stages", "need their parent records", "required by Deals"), so a deselection's blast radius is visible before anything is unticked.
- [ ] **Relationships never appear.** Contact→Company, Deal→Company, Deal→Contact links migrate automatically with their records — there is nothing to configure, so nothing is shown beyond a one-line footnote.
- [ ] **Files never appear as a row.** Attachments ride along with their records automatically. The time cost ("18,400 files ≈ 2–3 hours, usually dominates duration") moves to the footer's duration estimate. If the files permission is missing, that surfaces as a validation banner on this screen — not a row.
- [ ] Activity rows are individually deselectable. An optional date cutoff — "only activities from the last N months" — with the excluded count shown.
- [ ] Dependencies enforce at selection time as inline error rows: activities require their parent objects; Deals require Pipelines & stages. Deselecting a parent shows the count of dependents that would be dropped, with a one-click re-include.

**3 b. Users**

Expanded from owner mapping into a full user table, because the admin needs to choose who comes across, not just where records land.

Every HubSpot user falls into one of **four cases**, crossing _exists in SparrowCRM?_ (matched by email) × _active in HubSpot?_:

||Already in SparrowCRM|Not in SparrowCRM|
|---|---|---|
|**Active**|Mapped automatically — nothing to do|**Invite as new user** (takes a seat, records held until they accept) — or untick to skip, records reassigned|
|**Deactivated**|Map to the existing account (stays deactivated)|**The Sara case:** can't be invited (they left), but their records still point at them — reassign the records, or **import as a deactivated owner** (no login, no invite, no seat)|

Why deactivated users appear at all: HubSpot never truly deletes a user because records reference them (`hubspot_owner_id`; the API only returns them with `archived=true`). Skipping them makes their records arrive ownerless — fatal for deals. Why "import as deactivated owner" exists instead of always reassigning: reassigning rewrites reporting history — the inheritor suddenly "won" thousands of deals they never touched. A deactivated owner keeps historical owner-based reports meaning what they meant. **Only invited users consume seats; deactivated owners never do.**

- [ ] Table: HubSpot user (name, email, Active/Deactivated badge) → records owned → action → status.
- [ ] Auto-matched to existing SparrowCRM users by email, exact and case-insensitive.
- [ ] **Sorted by records-owned descending**, so a user who reads only the first few rows still makes the decisions that matter.
- [ ] Per-row action dropdown, four options:
    - **Map to [existing SparrowCRM user]** — default when an email match exists
    - **Invite as a new user** — sends a SparrowCRM invite; their records are held for them until they accept
    - **Don't bring across** — requires choosing who inherits their records
    - **Leave unassigned** — records migrate ownerless
- [ ] **"Leave unassigned" is safe for companies and contacts and fatal for deals**, because SparrowCRM requires an owner on a deal. The row must say which, with the deal count.
- [ ] An unresolved user who owns deals is a **blocking error** in the fix-list with its deal count.
- [ ] **Deactivated HubSpot users must appear.** Their records still need an owner. Default action is **Don't bring across → assign records to…**, never a silent ownerless migration.
- [ ] **Seat counter, always visible**: "Inviting 12 users — uses 12 of your 38 remaining seats." Turns red and blocks when invites exceed available seats, with an **Add seats** link.
- [ ] Bulk actions: **Invite all unmatched**, **Assign all unmatched to me**, **Map all matched**, **Leave all unassigned**.
- [ ] Filter chips: All / Matched / To invite / Needs a decision / Deactivated.
- [ ] Single-user workspace collapses to a confirmation with an option to invite the HubSpot users first.
- [ ] Invited users receive a SparrowCRM invite. Records assigned to a pending invitee are owned by them immediately and visible to admins; the record page shows "Owner invited, pending acceptance".
- [ ] The mapping is stored and reused by the catch-up sync.

**3 c. Pipelines & stages**

- [ ] Collapsed summary: "2 pipelines will be recreated with 12 stages. 1 empty pipeline skipped."
- [ ] One card per HubSpot pipeline with a destination selector: **Create new pipeline** (default), map to an existing one, or **Don't migrate**.
- [ ] **Create new pipeline** pre-fills stages from HubSpot in order, each renameable inline.
- [ ] Mapping to an existing pipeline requires every stage containing deals to map. Many-to-one allowed, with a merge indicator and combined deal count.
- [ ] **Won/Lost semantics are explicit.** HubSpot encodes Closed Won as probability 1.0 and Closed Lost as 0.0, so we detect and badge them. Mapping a won stage to a non-won stage requires confirmation stating the deal count and total value, because it silently changes the forecast.
- [ ] Unmapped stages holding deals are a blocking error with the count.
- [ ] Pipelines with zero deals default to **Don't migrate**.
- [ ] A pipeline exceeding SparrowCRM's stage limit blocks, states the limit, and offers merge suggestions.
- [ ] Stage-distribution preview shows deal counts per destination stage after mapping.

**3d. Fields**

Reuses [[Import_v1]]'s mapping language exactly, and adds the two things only a connector can do: **fill rate** and **HubSpot's own type metadata**.

- [ ] Collapsed summary: "391 of 455 mapped · 64 empty fields skipped · will create 31 new attributes."
- [ ] Object tabs with mapped/total counts and a red dot on tabs with errors.
- [ ] **Objects view**: a left rail of objects (Companies · Contacts · Deals) with per-object counts (fields, mapped, new, errors); clicking an object shows all of its fields.
- [ ] Per row: HubSpot field label and internal name, HubSpot `type` + `fieldType`, **fill rate** bar, SparrowCRM field, status. **Field values are never displayed anywhere in Configure** — names, types and aggregate fill rates only. The screen says so: "Field values are never shown here."
- [ ] **Mapping rules, in order:** same name + compatible type in SparrowCRM → auto-mapped, status **"Mapped — same name"**. Field not present → default **"New field will be created"** (nothing _silently_ skipped). Same name but **incompatible type** → a blocking **error**, shown on the row and as a badge on the object rail, resolved by mapping to another field, creating a new one (e.g. "ACV (number)"), **or skipping the field**. Continue is disabled while any error remains.
- [ ] **Nothing is forced.** Any non-required field can be **skipped** instead of mapped or created — per field or **Skip all** in bulk. A skipped field's data simply doesn't migrate: it is counted as **Excluded, never Failed**, shown in Mapping as "Skipped — won't migrate", and listed with its count in Validate and Results. Only SparrowCRM-**required** fields cannot be skipped.
- [ ] Auto-mapping runs four tiers: a **curated HubSpot→SparrowCRM table** for standard properties (highest precedence), then exact label match, normalised match, synonym dictionary. Under 5 seconds for up to 1,000 properties.
- [ ] Curated table covers at minimum `email`, `firstname` / `lastname`, `phone` / `mobilephone`, `jobtitle`, `domain` / `website`, `industry`, `numberofemployees`, `annualrevenue`, `hubspot_owner_id`, `lifecyclestage`, `dealname`, `amount`, `dealstage`, `closedate`, `dealtype`.
- [ ] **Fill rate** shows the percentage of source records with a non-empty value. Fields under 10% collapse behind one row with **Show them** and **Skip all**.
- [ ] **All dropdown types are in scope**, each with its full option list: single select, multi-select, radio, checkbox, boolean checkbox, and enumeration-backed system fields such as `lifecyclestage`. The option list is shown per field, unmapped options are flagged, and **Create all missing options** is offered in bulk. Option **internal names** are what migrate, not display labels.
- [ ] Relationship-bearing fields (e.g. company domain on a contact) are labelled **Relationship** rather than a normal mapping.
- [ ] Type-incompatible mappings are blocking errors naming both types. Lossy-but-allowed mappings are amber and non-blocking.
- [ ] **HubSpot multi-selects are semicolon-delimited with no spaces.** Where a value itself contains a semicolon, splitting corrupts it. Detect, list affected values with counts, and offer three exits: skip the field, accept the split, map to a text field.
- [ ] HubSpot proprietary score properties are listed but not mappable, with the reason.
- [ ] Sensitive-flagged properties appear disabled: "Needs HubSpot Enterprise and the sensitive-data permission."
- [ ] **New fields are created here, in Mapping** — not deferred to the run. Every "New field will be created" row arrives **fully pre-filled from HubSpot**: name from the label, type translated from `type` + `fieldType`, dropdown options carried over (unused options unticked by default). Creating one is a single click; the definition is editable inline first for anyone who wants to tweak it.
- [ ] **"Create all N new fields" in one action** — a bulk control (on the mapping header and per object) creates every pending new field at once, since the definitions are already filled in. After it runs, each row flips to **"Created ✓"**; any that need a human decision are left pending with the reason.
- [ ] Fields created here are tagged with the migration run ID, so **revert removes them** along with everything else the migration created.
- [ ] `＋ Create attribute` creates a SparrowCRM attribute inline, pre-filled with a type inferred from the `type` + `fieldType` pair and pre-filled options from the HubSpot property. **Unused options are unticked by default.**
- [ ] Two fields mapped to the same attribute → inline error on both, Run disabled. Copy verbatim from [[Import_v1]].
- [ ] SparrowCRM required attributes not covered → blocking error naming them per object.
- [ ] Permission-aware, identical rules and tooltip copy to [[Import_v1]] Requirement 3.
- [ ] **Schema diff** always visible as a sticky footer while the section is open, expandable and exportable.
- [ ] **Save mapping as template.** P 0 here because the verify loop demands repeatability.

**3 e. Formula fields — just fields, inside the Fields section**

Not a separate section or step. A Formulas filter within Fields shows this field type with its extra translate column. SparrowCRM formula fields are **record-level** — they compute on the record's own fields, which is one more reason cross-object rollups are out.

HubSpot calculation properties are _definitions_, not data. We migrate the definition by translating HubSpot's formula into a SparrowCRM formula. Nothing is computed by us — SparrowCRM recomputes from the migrated field values.

HubSpot has four calculation types, and they translate very differently:

|HubSpot type|What it does|Translatable?|
|---|---|---|
|**Custom equation**|Formula over properties on the same record. Operators `+ - * /`, `< > <= >= == !=`, `and or !`, 30+ functions (`concatenate`, `abs`, `round_nearest`, `if`, `is_known`, `time_between`, `string_to_number`, `exchange_rate` …)|**Yes**, where SparrowCRM has an equivalent operator or function|
|**Time-based**|Time between two dates, time since a date, time until a date|**Yes**, if SparrowCRM has date-difference functions|
|**Rollup**|Min / Max / Count / Sum / Average / Earliest / Latest **across associated records**, with up to 50 conditions|**No — twice over.** HubSpot does not expose the rollup definition via API (only `calculation_equation` has a readable `calculationFormula`), and SparrowCRM lacks cross-object rollups. Skipped; the export lists name, output type and a deep link to the property in HubSpot settings|
|**AI-generated**|Produces a custom equation; behaves as one thereafter|Same as custom equation|

**Acceptance Criteria**

- [ ] Collapsed summary: "31 of 38 formula fields translated · 5 need review · 2 can't be translated."
- [ ] Table per row: HubSpot formula field name, its **HubSpot formula shown verbatim**, the **proposed SparrowCRM formula**, output type, and a status.
- [ ] Statuses: **Translated** (green, confident), **Needs review** (amber, translated but a construct was approximated), **Can't translate** (red, non-blocking — the field is skipped).
- [ ] Property references translate from `[properties.internalName]` to the SparrowCRM attribute the field mapper resolved. If the referenced attribute wasn't mapped, that is a **Needs review** with the reason "this formula references a field you skipped."
- [ ] **Enumeration values inside formulas use HubSpot internal names**, and must be remapped to SparrowCRM option values. Flag any that don't resolve.
- [ ] The proposed formula is **editable inline**, with SparrowCRM's own formula validator running on blur.
- [ ] Every unsupported construct names itself specifically — not "unsupported formula" but "SparrowCRM has no `exchange_rate` function" or "this is a rollup across associated deals."
- [ ] `Can't translate` fields are listed in the exclusions report. For **equation** types the original HubSpot formula is copied verbatim. For **rollups** the definition is not readable via API, so the export carries the field name, output type and a **deep link to the property in HubSpot settings** instead.
- [ ] Detection uses the property payload's `calculated: true` flag plus its `fieldType` (`calculation_equation`, `calculation_rollup`, `calculation_score`, `calculation_read_time`). Reading definitions needs no scope beyond the `crm.schemas.*.read` we already request.
- [ ] **Formula fields are HubSpot Professional/Enterprise only**, with per-tier caps on count. Free and Starter portals have none — the section renders nothing and the count pass reports zero, not an error.
- [ ] Validation carries over HubSpot's own constraints worth knowing: formulas nest up to 70 open parentheses, and a calculation won't run if a referenced number property is empty unless wrapped in `if` / `is_known`. Where we detect the latter, flag it rather than shipping a formula that silently never computes.
- [ ] Formula fields are created in the **Formula fields task, after Attributes and before records**, so values compute as records land.
- [ ] Never migrate a computed value as a static number. If a formula can't be translated the field is skipped, not frozen — a stale number that reps trust is worse than an absent field.

**3 f. Duplicates**

- [ ] Match keys identical to [[Import_v1]]: Contacts on **Email**, Companies on **Domain**, Deals on **Deal name + Stage + Deal owner**.
- [ ] **When the destination workspace is empty — the common case — this collapses to one green line.** No options shown.
- [ ] When not empty: per-object behaviour on match — **Update existing** (default) / **Skip** / **Create a second record** — with match counts.
- [ ] Global toggle **Don't overwrite values you already have**, default **on** for non-empty workspaces.
- [ ] Always-on and stated: empty source values never overwrite; multi-value fields are additive; only mapped fields are touched; public email domains never create companies. Consistent with [[Import_v1]].
- [ ] **Every migrated record and activity stores its HubSpot ID** in a system attribute — non-mappable, hidden from the field mapper. This is what makes the migration idempotent, the catch-up pass possible, and revert exact.
- [ ] **Activities are deduplicated on HubSpot ID too.** Without this a re-run duplicates 312,000 timeline entries, which is the single ugliest failure mode available in this scope.
- [ ] Intra-source duplicates detected during the count pass, reported with counts, resolved last-modified-wins, downloadable list.

**3 g. Filters**

- [ ] Optional. Default is none.
- [ ] Available: created on or after a date; changed within N months; skip HubSpot-archived records; skip records with no owner; only selected pipelines; skip deals closed before a date; activity date cutoff; skip files over a size threshold.
- [ ] **Live recount** within 3 seconds, with a skeleton while recalculating.
- [ ] Excluded count always visible alongside the included count, clickable for a breakdown by which filter excluded what. **Never rendered in red.**
- [ ] Warn where a filter would orphan activities or files — "3,400 notes belong to contacts your filters exclude and will be skipped."
- [ ] Filters excluding everything is a blocking error naming the offending filter.

**3 h. What won't come across**

- [ ] Permanent, non-collapsible, visually distinct.
- [ ] Table: item, count found in HubSpot, and what to do instead. Covers workflows, sequences, forms, marketing email, call recording audio, proprietary scores, field change history, lists, tickets/products/line items/quotes, association labels, untranslatable formulas, and custom objects with a note that they are coming once SparrowCRM Custom Objects ships.
- [ ] Workflows row offers **Download a summary of your N workflows** — name, enrolment trigger and actions in sequence, generated from the automation API.
- [ ] Untranslatable formulas row links to the Formula fields section and includes the original formulas in the export.
- [ ] Exportable as PDF for RevOps sign-off during a sales cycle.

**3 i. Run confirmation**

- [ ] Modal summarising records, relationships, activities, files, new attributes, translated formulas, users to invite, and the duration estimate broken down by component.
- [ ] **Workflow suppression**: lists SparrowCRM workflows that would fire with the total trigger count, and a **Suppress workflows during the migration** toggle defaulting **on**. Consistent with [[Import_v1]] Requirement 6.
- [ ] **Activity-notification suppression** as a separate toggle, also default on. Migrating 312,000 activities could otherwise generate task-assignment and mention notifications at scale.
- [ ] Explains the automatic verify phase in one sentence, with a **"Pause anyway after the first 100 so I can check myself"** tick defaulting to **off**. Skipping the sample entirely still requires an explicit acknowledgement.
- [ ] Record-limit and seat-limit projections where either would be approached or exceeded.

---

#### 4. Migrate (S 3)

**4 a. Validate — its own step, gating Migrate** _(renamed from "Test run"; absorbed Configure's Review; locked 6 Aug)_

One step, two old jobs: **Configure's Review** (the import manifest — everything about to be imported, before committing) and **the audit** (100% of the data checked). There is **no test run** — the scan's completeness makes a rehearsal unnecessary, and Proceed to migrate is the only forward path.

**Full validation scan, 100% of the data, read-only (~10–15 min).** Writing everything twice is impossible; _reading_ everything is cheap. HubSpot batch-reads 100 records/call, so all records is ~1,100 calls (~2 min at the rate cap) and all activities ~5 more. Every record and activity is read and run through the **actual SparrowCRM validation rules** — nothing is written. This _is_ the audit, running on everything: the error list is **complete, never sampled**. "3 contacts will fail" means exactly 3, because all 89,144 were checked. No data-shaped error can hide in an unchecked remainder, because there is no unchecked remainder. **Only this scan gates Migrate.**

- [ ] The scan validates **every record and every activity** against real SparrowCRM validation, read-only, streaming errors into a live log with record IDs as they occur ("contact hs:104882 — required field First name is empty · 1 of 3 in the whole portal"). The UI says explicitly: _reading everything, writing nothing_.
- [ ] **No loading screen at all.** The check runs **in the background**, kicked off the moment Configure completes — by the time the user reaches Validate it is normally done, and the screen opens directly as the table. If a user arrives early, unfinished rows quietly show "checking…" in the result column — the table itself, never a loader page, never a progress bar (a bar here reads as "the migration has started"; bars are reserved exclusively for Migrate).
- [ ] **The whole screen is one table — object · count · check result:** Companies, Contacts, Deals, Emails, Notes, Meetings, Tasks, Calls, Users, Pipelines & stages, New fields & formulas — each row with its count and its check verdict ("✓ Checked · 0 errors" / "3 errors" / "2 warnings"). Relationships and files appear as a footnote (they ride along, checked with their records). This table IS the import manifest and the review.
- [ ] Errors and warnings live **on their object's row** — exact portal-wide counts, never extrapolated — with the consequence stated ("these 3 will fail and be listed in Results"). Two exits: **Fix in mapping** (back to Configure › Mapping) or **Proceed to migrate**.
- [ ] **Every finding opens to its records — capped, and value-free.** Clicking a finding expands the affected records inline — **object + HubSpot ID as a deep link only, never a name, email or any field value** — plus the failing field and cause. **The inline view shows at most 5 records** ("showing 5 of 9,998"); beyond that the per-object CSV is the tool — nobody triages 10,000 errors in a web table. The fix path is stated on the spot: fix in HubSpot and re-check (free, unlimited), or proceed — they arrive in Results as known failures with a one-click retry once fixed. Data errors are fixed at the source; only mapping errors send the user back to Configure.
- [ ] **Error volume has three tiers by design:** ≤5 records → full inline list · more → capped preview + CSV download · same error above 5% of an object → the **systematic-failure gate** fires instead, collapsing thousands of identical rows into one diagnosis card with Migrate locked.
- [ ] **No downloads from Validate.** Errors are visible inline only (counts + capped drill-down). The downloadable error report exists **after the migration**, in Results.
- [ ] **Primary CTA is "Proceed to migrate."** There is no test run and no other forward action on the screen.
- [ ] A systematic failure in the scan (same error above 5% of an object) **hard-locks Migrate** — exact counts, since every record was checked.
- [ ] The circuit breaker in the real run remains the net for genuine freak events (HubSpot API anomalies on specific objects mid-run) — its job shrinks to non-data surprises, because everything data-shaped was caught at 100% coverage here.
- [ ] Failures found here reappear in Results as _known_ items — the run confirmation states them ("Known from validation: 3 contacts will fail"), so nothing in Results is a surprise. On pause, the result card also shows:
    - Per-object created / excluded / failed, plus relationship, activity and file counts.
    - **Deep links into the created SparrowCRM records**, at least 10 per object.
    - A **side-by-side field-by-field comparison** for 3 sampled records: HubSpot values against SparrowCRM values, **including linked-record counts, activity counts by type, attachment counts, and computed formula-field values on both sides.** Formula comparison is the highest-value cell in the table — it is how the customer knows the translation worked.
    - Warnings with counts, each linking back to the section that fixes it.
- [ ] Three equally-weighted exits: **Undo & change settings**, **Undo & re-check**, **Continue**.
- [ ] Verify runs are unlimited and free.
- [ ] Undo is exact — deletes only what that run created, identified by HubSpot ID plus run ID — and **reports anything it could not remove, with the reason**.

**4 b. Phase 2 — everything else**

- [ ] **Task table**, one row per task, in the 14-task dependency order above.
- [ ] Each row: task name, status, progress bar, records processed / total, created / updated / skipped / failed counters.
- [ ] Statuses: **Queued · Running · Throttled · Paused · Done · Done with errors · Failed · Cancelled · Skipped**.
- [ ] Header: overall progress, ETA, and "You can safely close this page. We'll email you when it's done." Worded identically to [[Import_v1]].
- [ ] **Relationships is its own task**, broken down by link type, and the UI explains why it runs after records.
- [ ] **Activity tasks are separate rows per type**, because they fail independently and have different volumes. Emails are typically the largest.
- [ ] **Files is its own task, last**, with its own progress and a size-transferred counter as well as a file count. The UI explains it is the slowest part and why.
- [ ] Where a contact has several HubSpot companies, v 1 links the **primary** and reports the remainder as skipped with a count.
- [ ] **Pause all / Resume all**, **Cancel migration**, and **per-task Cancel**. Cancelling a task marks dependents **Skipped — dependency cancelled**.
- [ ] **Retry** on a failed or done-with-errors task retries only the failed records.
- [ ] Cancelling never rolls back completed work.
- [ ] Live activity log, newest first, filterable to errors only.

**4 c. Resilience**

- [ ] Durable checkpointing per (task, cursor). Crash, restart, browser close or token loss **resumes** and never reprocesses a record. No more than 100 records of work lost on an unclean restart.
- [ ] Writes are idempotent, keyed on HubSpot ID → SparrowCRM ID, **including activities and files**.
- [ ] One bad record never fails a task; one failed task never rolls back the migration.
- [ ] **Throttle transparency.** A throttled task shows "Waiting for HubSpot's rate limit — resuming in 8 s" and explains we stay under the limit deliberately so the customer's other integrations keep working. **423 Locked** is handled with the required 2-second minimum inter-request delay and surfaces as Throttled, not an error.
- [ ] **Signed-URL handling for files.** Private files 404 on direct fetch and need a per-file signed URL that is time-limited, so files must be downloaded immediately rather than queued. Re-request and retry up to 3 times before reporting the file as failed.
- [ ] **Skip-rate circuit breaker.** If failures exceed **5% or 5,000 records** in a task, the migration **pauses automatically**, names the dominant error and likely cause, offers a partial error download, and presents Fix-and-resume / Skip-and-continue / Revert.
- [ ] Record-limit or seat-limit reached mid-run → **pause**, not fail, with an upgrade prompt.
- [ ] In-app notification and email on completion, pause and circuit-breaker trip.

---

#### 5. Results (S 4)

**Outcome header**

- [ ] Three distinct outcomes: **Complete**, **Completed with issues**, **Failed**. Failed leads with the cause and offers Revert as a first-class action.

**Reconciliation table**

- [ ] Columns: Object | In HubSpot | Selected | Created | Updated | Excluded | Failed | **Variance**.
- [ ] **Variance is computed against _selected_, not against the raw HubSpot count**, so filters never read as data loss.
- [ ] Within 1% green; 1–5% amber; above 5% red.
- [ ] **Excluded and Failed are separate columns and are never summed.** Hovering Excluded breaks down by cause.

**Separate tables, because these are the v 1 differentiators**

- [ ] **Relationships**: Link | Found | Created | Skipped | plain-language reason per skip.
- [ ] **Activities**: Type | Found | Created | Skipped | Failed, one row per activity type, with date range migrated.
- [ ] **Files**: Count | Total size | Migrated | Skipped (over size limit) | Failed, with the HubSpot URL preserved for anything skipped so it stays reachable.
- [ ] **Formula fields**: Translated | Needs review (translated with approximation) | Not translated, with the untranslated formulas available to download.

**Failures**

- [ ] Grouped by reason with counts, most frequent first, each expandable.
- [ ] **Two downloads**: **Download failed records** (original HubSpot data plus `Error Reason`, `Failed Field`, `HubSpot Record ID`, `HubSpot URL`) and **Download error summary** (machine-readable codes and counts).
- [ ] **Retry failed records** re-runs only those with current settings. Where the fix is a setting, the button says so.

**Next-steps checklist**

- [ ] Interactive and persistent, each item linking to where it's done:
    - Spot-check 20 records against HubSpot — fields, links, activity counts and formula values
    - Check pipeline stage distribution matches
    - **Verify your formula fields compute the same numbers as HubSpot** — with a side-by-side of the 10 highest-usage formula fields
    - Look for duplicate contacts and companies
    - Review the 31 attributes and 31 formula fields this created
    - Invite or chase the N users still pending acceptance
    - Set HubSpot read-only so nobody adds new data there
    - Run a catch-up sync on switch-over day
- [ ] Checklist state persists and is reachable from Migration History.

---

#### 6. Catch-up sync (S 5)

- [ ] Available on any migration in Complete or Completed-with-issues state.
- [ ] Explains itself with the timestamp of the last successful run.
- [ ] **Check for changes** reports new and changed counts per object, **plus new activities and new files**, which will usually be the largest category.
- [ ] Uses `hs_lastmodifieddate` / `lastmodifieddate` against the last run timestamp, and matches on stored HubSpot ID so nothing duplicates.
- [ ] Runs through the same task table and produces the same reconciliation report.
- [ ] Repeatable any number of times, each run listed with its window.
- [ ] **Records edited in SparrowCRM since the migration are protected.** Default **Don't overwrite records your team has edited in SparrowCRM**, with the conflict count and a per-record review list.
- [ ] **Finish migration** finalises: disconnects HubSpot, locks the migration record, keeps reports permanently, and reminds the user to set HubSpot read-only. Revert remains available for the rest of the window.

---

#### 7. Revert (S 5 b)

- [ ] Available while Complete, Completed with issues, Cancelled, Paused or Failed, within a **30-day** window.
- [ ] **Scoped by task.** Useful splits in this scope: drop files but keep everything; drop activities but keep records; drop everything but keep the schema and formula fields.
- [ ] Confirmation states precisely what will and will not happen, side by side. Deleted: records, activities, files and relationships created by this migration and **untouched since**; optionally the attributes, formula fields and pipelines created. Kept: records that existed before; **records edited since**; reports.
- [ ] Type-to-confirm the workspace name.
- [ ] Runs through the same task-table UI and produces its own report naming everything retained and why.
- [ ] **Revert cannot be reverted.** Stated plainly.
- [ ] Unavailable states explained, not hidden, with the manual alternative.
- [ ] **Invited users are not de-invited by revert**, and the report says so — an accepted invite is a real account and deleting it is not ours to do silently.

---

#### 8. Migration History

Mirrors [[Import_v1]] Requirement 11.

- [ ] Columns: MIGRATION | STARTED BY | STARTED | TOOK | STATUS | RECORDS.
- [ ] Statuses: Draft · Configuring · Checking · In progress · Paused · Complete · Completed with issues · Cancelled · Failed · Reverted.
- [ ] Catch-up syncs appear as their own rows with their window.
- [ ] Row actions: View report, Download error report, Run catch-up sync, Resume, Revert, Delete this record.
- [ ] **Deleting the record does not delete migrated data**, and the confirmation says so.
- [ ] Admins see all; other roles with Migrate Data see their own.
- [ ] Settings snapshot immutable once a migration starts.

---

### Should-Have (P 1)

- [ ] **Record view on the Report** _(adopted from Smart Transfer hands-on)_: a per-record table of SparrowCRM ID ↔ HubSpot ID with deep links into both systems, searchable, filterable by task. The ID map surfaced as UI.
- [ ] Comparison tool as a standing utility outside the checklist.
- [ ] Exclusions export as a branded PDF for RevOps sign-off.
- [ ] Workflow summary export.
- [ ] Formula-field bulk edit — apply the same correction across several Needs-review formulas at once.

### Future (P 2)

- [ ] **Custom objects — v 2, gated on [[Custom Objects_v1]] shipping.** Their fields, associations, activities, files and pipelines.
- [ ] Cross-object rollup formulas, gated on SparrowCRM supporting them.
- [ ] Association labels.
- [ ] Lists; tickets, products, line items, quotes.
- [ ] Salesforce, Pipedrive, Zoho connectors on the same framework.
- [ ] Ongoing bidirectional sync.
- [ ] Scheduled runs.

---

## Screen States Matrix

|Screen|States|
|---|---|
|**S 1 Connect**|Pre-consent · Scopes expanded · Redirecting · Testing connection · Connected (full) · Connected (degraded) · Sandbox detected · Consent denied · Not a Super Admin · Portal already connected · Token lost (global)|
|**S 2 Configure**|Objects (ready, one table with status + dependencies) · Objects (dependency + validation errors) · Mapping objects-view (clean, new fields created here incl. Create-all) · Mapping field errors (type conflict / duplicate / required uncovered) · Mapping Users errors (deactivated owner blocks · seat wall) · Mapping Pipelines errors (unmapped stages · Won→non-won confirm) · Mapping formula cases — _Review removed; Mapping is the last gate_|
|**S 3 Validate**|One table — object · count · check result (no loading screen; background check; capped per-record drill-down; no downloads) · Systematic failure (hard gate, Migrate locked) · Connection lost during background check (checkpointed)|
|**S 3 b Migrate**|Running (known failures stated) · Throttled · Circuit breaker (mid-run systematic) · Paused / record & seat limit walls · Task cancelled (dependents skipped)|
|**S 4 Results**|Completed with issues · Complete (clean) · Spot-check tool · **Formula verification** · Failed|
|**S 5 After**|Catch-up sync · Nothing changed · Finish · Revert scope · Revert confirm · Revert done · Revert unavailable · Migration history|

### Global states

- [ ] No Migrate Data permission — Migrations tab not rendered.
- [ ] Another migration already running — blocked with a link to it.
- [ ] HubSpot token revoked mid-flow — global banner; work pauses and resumes from checkpoint.
- [ ] Record limit reached mid-run — pause, upgrade prompt, resume.
- [ ] **Seat limit reached** while inviting users — pause the Users task, upgrade prompt, resume.
- [ ] HubSpot portal downgraded mid-run — pause, explain what's no longer available.
- [ ] Draft abandoned — resumable; counts marked stale after 7 days.

---

## Technical Considerations

### HubSpot API realities that shape the UX

**Rate limit is the binding constraint.** A publicly distributed OAuth app is capped at roughly **110 requests per 10 seconds per installed account**, and the API-limit-increase add-on **does not apply to public OAuth apps** — it cannot be bought up. About 11 requests/second. Daily limits are shared across every app in the portal, so we compete with the customer's existing integrations. Consequence: honest duration bands, a visible Throttled state, adaptive throttling with headroom.

**Files dominate wall-clock time.** Private files 404 on direct fetch and need a per-file `GET /files/v 3/files/{fileId}/signed-url` call, and uploads are **one file per request**. That is at least two calls per attachment, so 20,000 attachments is roughly an hour of pure attachment traffic at the ceiling. Signed URLs are time-limited, so download immediately rather than queueing. Upload supports duplicate validation (`ENTIRE_PORTAL` / `EXACT_FOLDER` / `NONE`) with `RETURN_EXISTING` — use it for idempotent re-runs.

**Attachments in HubSpot are notes with attachments.** Files reach records indirectly: upload file → create note with the file ID in `hs_attachment_ids` → associate the note. Since we want files **on the record** in SparrowCRM, there is a synthesis step: read the note's `hs_attachment_ids`, fetch each file, attach it to the parent record directly, and keep the note as a note. Flagged as an open question — whether the file also stays on its note in SparrowCRM.

**Activities are first-class objects, associated not parented.** Notes `0-46`, tasks `0-27`, meetings `0-47`, calls `0-48`, emails `0-49`, each at `/crm/v 3/objects/{type}`. They attach purely via associations — there is no parent pointer. `hs_timestamp` is **required** and sets timeline position. `hubspot_owner_id` is the actor. Writing one requires `associations[]` with `to.id` + `associationTypeId` + `associationCategory`.

Per-type specifics that produce visible product behaviour: **notes cap at 65,536 characters** (`hs_note_body`) — truncation must be reported, not silent. **Calls** carry `hs_call_disposition` as **opaque internal GUIDs**, not readable strings, so they need a lookup table; `hs_call_recording_url` is HTTPS-only and we keep it as a link. **Emails** have `hs_email_headers` as a JSON blob, and **sender/recipient address and name fields are read-only, auto-derived from headers** — so historical email fidelity is inherently capped and must be stated in the exclusions panel rather than discovered in a reconciliation report. Only one email can be pinned per record.

**Relationships need a second pass.** The `associations` query parameter is **not supported on `batch/read`**, so a full graph extract roughly doubles the request count. Batch association reads accept up to 1,000 input IDs but return at most **500 associations per object ID with no per-ID pagination** — extras are silently dropped, so records above 500 must fall back to the paginated single-record GET. Association type IDs must be enumerated per object pair; HubSpot-defined IDs are stable but **user-defined label IDs are account-specific**, so nothing may be hardcoded.

**Primary vs additional associations.** A contact or deal may associate with several companies, one marked primary (typeId 1 = Primary, 279 = Unlabeled for contact→company). v 1 takes the primary and reports the rest as skipped.

**Formula translation specifics.** Calculation properties are **Professional/Enterprise only** with per-tier caps, which bounds the volume — dozens per portal, not thousands — and means Free/Starter portals have none. The Properties API exposes a `calculationFormula` field for **equation-type** properties (`fieldType: calculation_equation`); it is writable and patchable, including on UI-created properties, which implies read parity — but **read of `calculationFormula` on UI-created properties must be confirmed by a spike against a real Pro portal before the feature is committed** (see Open Questions). **Rollup definitions are not exposed via API at all** — only equations carry a readable formula — so rollups are structurally unreadable, independent of whether SparrowCRM ever ships cross-object rollups. HubSpot property references are `[properties.internalName]`; enumeration values inside formulas use **internal names in quotes**, not display labels, so both need remapping through the field mapper's resolution. Formulas nest up to **70 open parentheses**. A calculation **won't run if a referenced number property is empty** unless wrapped in `if` / `is_known` — detect and flag, or we ship formulas that silently never compute. Output types are Number (Number / Currency / Percentage / Duration), Boolean, String, Date, DateTime, and the output type must survive translation.

**Users return two different IDs** — `id` (used in `hubspot_owner_id`) and `userId` (settings API only). Deactivated owners require `archived=true` and have a null `userId`, with the value moving to `userIdIncludingInactive`. The user table must include archived users or every record owned by a departed rep loses its owner.

**Multi-select values are semicolon-delimited with no spaces**, which silently corrupts any value containing a semicolon.

**Properties have both a `type` and a `fieldType`.** An `enumeration/select` maps very differently from an `enumeration/checkbox`. The mapper must key off both.

**Sensitive and highly-sensitive properties are invisible without extra scopes** and are Enterprise-only.

**Pipelines**: deal stages carry `probability` where 1.0 = Closed Won, 0.0 = Closed Lost — that's how we detect Won/Lost for free. Stage cap 100 for deal pipelines.

**Two error codes need distinct handling.** 429 is rate limiting; **423 Locked** occurs during high-volume syncing and needs a 2-second minimum inter-request delay. Both surface as Throttled.

**Batch writes return 207 Multi-Status** with a per-input `objectWriteTraceId` — the right primitive for attributing a failure to an individual record.

**Search API is a separate, smaller budget** — ~5 requests/second, 200 per page, hard 10,000-result cap. Bulk pass uses list GETs with cursor pagination; search is for the catch-up pass, windowed by `hs_object_id`.

**Pin the API version.** HubSpot has moved to date-based versions (`2026-03`) alongside legacy `/crm/v 3/`.

**Scope declaration must be tiered.** Tier-gated scopes must be declared _conditionally required_ or _optional_, or installation fails on Starter and Professional portals.

### Architecture

- Migration orchestrator separate from the CSV import worker pool.
- Task DAG per migration in the 14-task dependency order, each task independently checkpointed, cancellable and retryable.
- Durable cursor store per (migration, task), plus an ID map table `(migration_id, source_object_type, source_id) → target_id`, unique-indexed, **covering activities and files as well as records**. This table is the mechanism behind idempotency, the catch-up pass and exact revert, and it is the single most important piece of the design.
- Extract → transform → validate → match → write, per record. Transform and validate reuse [[Import_v1]]'s validation engine so error semantics are identical across both modules.
- Formula translation as a separate compiler stage: parse HubSpot formula → AST → remap property and enumeration references through the field mapper → emit SparrowCRM formula, or fail with a specific named reason.
- Relationships resolved from the ID map after all record tasks complete.
- File pipeline streams: signed URL → download → upload → attach, never buffering whole files in memory.
- Adaptive token-bucket throttle per connected portal, driven by response headers, with a configurable headroom fraction.
- Revert reads the ID map and deletes forward-only, skipping any target whose `updated_at` is later than the migration's completion.
- **The target association model belongs to [[Custom Objects_v1]] R-P 0-5.** Migration writes into it and keeps only its internal ID map — it must not build a parallel link store. Anything v 2 needs from the association model (labels, many-to-many, self-reference) is a requirement on that PRD, not on this module.
- Read-only against HubSpot. No write scopes requested.

### Performance targets

- Connection test and count pass: under 90 seconds for portals up to 200,000 records.
- Auto-mapping: under 5 seconds for up to 1,000 properties.
- Formula translation: under 10 seconds for up to 200 formula fields.
- Filter recount: under 3 seconds.
- Verify phase: under 5 minutes.
- Full migration: 4–7 hours for 112,000 records, 312,000 activities, 100,000 relationships and 18,400 files.
- Sustained throughput at 85% or more of the available HubSpot rate budget.
- Checkpoint granularity: no more than 100 records lost on an unclean restart.

### Security & permissions

- New role permission **Migrate Data**, separate from Import Data. Admin-only by default.
- OAuth tokens encrypted at rest; refresh server-side; never exposed to the client.
- Every migration, catch-up run and revert written to the workspace audit trail with actor, settings snapshot and outcome.
- **User invitations triggered by a migration are audit-logged separately**, since they create accounts and consume seats.
- Source data and files staged in object storage with a defined retention window, then purged.

---

## Success Metrics

### Leading

- Connect-to-Configure completion rate.
- Configure-to-Run rate.
- Share of migrations where the user changed **nothing** on Configure — the direct measure of whether "open pre-resolved" works. Target above 40%.
- Clicks to Run in the happy path. Target 3.
- Verify-phase usage and verify-then-adjust rate.
- User auto-match rate.
- **Formula translation rate** — translated / total, and the share needing manual review. The headline quality measure for the new capability.
- Field auto-map override rate.
- **Relationship completion rate** — created / found.
- **Activity completion rate** per type.
- **File completion rate** and average time per file.
- Reconciliation variance at completion.
- Failed-record rate.
- Revert rate.

### Lagging

- Migrations completed per quarter, and share of new customers arriving via migration.
- Median connect-to-finish time.
- CS hours per migration — target near zero.
- Deals won where HubSpot migration was cited as a blocker removed.
- **Internal cutover completed** — via Migration v 1 for core data plus file import of custom-object data ([[Custom Objects_v1]] R-P 0-6).
- 90-day retention of migrated accounts.
- Support tickets about missing data, split by category.

### Targets

- Connect-to-Configure above 90%.
- Configure-to-Run above 70%.
- User auto-match above 85%.
- **Formula translation above 80% fully translated, above 95% translated-or-reviewable.**
- Field auto-map accuracy above 75% on standard properties, above 50% on custom.
- Relationship completion above 98% excluding parent-failure cascades.
- Activity completion above 99%.
- File completion above 97%.
- Reconciliation variance within 1% on at least 95% of migrations.
- Failed-record rate under 2%.
- Revert rate under 5%.
- Zero CS involvement on at least 70% of migrations.

---

## Open Questions

### Blocking

- **Engineering — spike, 1 day, blocks the formula feature:** Confirm `GET /crm/v 3/properties/{object}` returns `calculationFormula` for **UI-created** equation properties on a real Professional portal. The write/patch path is documented and community-verified; the read path on UI-created properties is the load-bearing assumption under the whole translation capability and is not explicitly documented.
- **Engineering:** What is SparrowCRM's formula language — operators, function list, output types, nesting limit? The translation matrix cannot be written without it. Needed as a concrete list to build the compiler's coverage table.
- **Product:** **Are SparrowCRM formula fields plan-gated?** If a customer migrates into a plan without formula fields, Configure needs a gate check ("your plan doesn't include formula fields — upgrade or skip these 36") rather than a silent skip.
- **Product / Engineering:** Rollups are now doubly out — HubSpot doesn't expose their definition via API, and SparrowCRM lacks cross-object rollups. If SparrowCRM ever ships rollups, the migration path for HubSpot rollups is still manual rebuild from the deep link, not translation.
- **Product:** When a HubSpot file arrives via a note's `hs_attachment_ids`, does it attach to the **record only**, or to the record **and** stay on the note? Affects the file task and what the record page shows.
- **Product:** Do we auto-send user invitations during the migration, or queue them and let the admin send after verifying? Auto-sending means people get invited to a workspace that is still filling up.
- **Engineering:** SparrowCRM's stage-per-pipeline limit.
- **Product:** Can a SparrowCRM contact belong to more than one company? v 1 currently takes the HubSpot primary and reports the rest as skipped.
- **Product:** HubSpot **Leads** (`0-136`) — SparrowCRM has no Lead object. Map to Contacts with a lifecycle marker, or exclude and document?
- **Design:** Where does the `HubSpot ID` system attribute surface on the record page, and is "Migrated from HubSpot on [date]" a timeline entry, a badge, or both?
- **PM:** Confirm with the Custom Objects team that internal cutover of custom-object data goes via file import (their R-P 0-6) until Migration v 2, and that any association-model needs for Migration v 2 are captured in their PRD, not this one.

### Non-Blocking

- Should the exclusions export be shareable by public link as a sales asset?
- Should mapping and formula templates be shareable across workspaces, for partners and agencies?
- Is 30 days the right revert window?
- Do we flatten paired association labels or model both directions when labels arrive in v 1.1?
- How do we instrument drop-off across a flow that can span days?
- Is "Migration" the right in-product word, or "Move your data from HubSpot"?

---

## Edge Cases

|Scenario|Expected behaviour|
|---|---|
|User is not a HubSpot Super Admin|Consent fails. Name the required role and give a shareable link their admin can use.|
|HubSpot portal is Free or Starter|Connect succeeds. Tier-gated items shown disabled with the reason.|
|Portal already connected to another workspace|Hard block with the reason.|
|Sandbox portal detected|Warn and require an explicit tick.|
|Portal is empty|Configure shows the empty state with re-check and disconnect.|
|Token revoked mid-run|Pause at checkpoint. Global reconnect banner. Resume continues, never restarts.|
|900+ custom properties on one object|Empty fields collapse by default; **Skip all effectively empty** offered. Warn about the attribute-count limit.|
|Custom property with no SparrowCRM equivalent type|Offer `＋ Create attribute` with inferred type. If no compatible type exists, mark unsupported with the reason.|
|Multi-select value contains a semicolon|Flag with affected values listed. User chooses skip / accept split / map to text.|
|Dropdown option exists in HubSpot but not SparrowCRM|Flagged in the field's option list. **Create all missing options** offered in bulk. Option internal names migrate, not labels.|
|**Formula references a field the user skipped**|Formula marked **Needs review** with "this references a field you didn't map." User maps the field or edits the formula.|
|**Formula is a rollup across associated records**|**Can't translate** — HubSpot doesn't expose the rollup definition via API. Skipped; the export carries name, output type and a deep link to the property in HubSpot settings.|
|**Portal is Free or Starter**|Calculation properties can't exist on those tiers. Formula section renders nothing; count pass reports zero. Not an error.|
|**Formula uses a function SparrowCRM lacks**|Names the specific function — "SparrowCRM has no `exchange_rate` function" — not a generic failure.|
|**Formula references an enumeration value by HubSpot internal name**|Remapped through the field mapper's option resolution. Unresolvable values flagged.|
|**Formula would never compute because a referenced number field is often empty**|Flagged as Needs review, since HubSpot won't run such a calculation without `if`/`is_known`.|
|**Translated formula fails SparrowCRM's own validator**|Marked Needs review with the validator's message, editable inline. Never written in a broken state.|
|Note longer than 65,536 characters|Migrated truncated, with truncation reported per record as a warning, not a failure.|
|Call has a recording|Audio not migrated. `hs_call_recording_url` stored as a link on the Call activity. In the exclusions panel.|
|Call disposition is an opaque GUID|Translated via a lookup table. Unknown GUIDs migrate as blank with the raw value in the error report.|
|Email sender/recipient names can't be set|Expected — read-only in HubSpot, derived from headers. Stated in exclusions, not reported as failures.|
|Activity attached only to an excluded object|Skipped, counted under **Excluded → parent not migrated**, warned before the run.|
|Activity attached to two records|Migrated once, associated to both. Deduplicated on HubSpot ID.|
|Private file's signed URL expires before download|Re-request and retry up to 3 times, then report that file as failed.|
|Attachment exceeds SparrowCRM's file size limit|Skipped with the reason; HubSpot URL preserved on the record so it stays reachable.|
|Same file attached to 40 records|Uploaded once using duplicate validation with `RETURN_EXISTING`, attached 40 times.|
|Contact associated with 3 companies|Link the **primary**; report the other 2 as skipped with a reason.|
|Record with more than 500 associations|Falls back to paginated single-record association reads. Slower, not an error.|
|Two HubSpot contacts share an email|Detected in the count pass, reported on Configure, last-modified-wins, downloadable list.|
|Contact with no email|Migrates. Counted under **Excluded → no match key** for dedup purposes. Never dropped.|
|Deal in a stage left unmapped|Blocking error with the deal count.|
|Closed Won stage mapped to a non-won stage|Allowed with explicit confirmation stating deal count and total value.|
|Deal with no associated company|Migrates unlinked; counted in the relationships table.|
|Deactivated HubSpot user owns 8,204 records including 3,204 deals|Appears in Users with counts. **Blocking** — deals require an owner. Default action assigns their records to a chosen user.|
|**Invites would exceed available seats**|Seat counter turns red, Users section blocks, **Add seats** offered. Migration can still run with those users mapped or their records reassigned.|
|**Invited user never accepts**|Records stay owned by the pending invitee and are visible to admins. Record page shows "Owner invited, pending acceptance". Checklist item chases them.|
|**Revert after users accepted invitations**|Records and activities are deleted; **accounts are not**. The revert report says so explicitly.|
|Migration would exceed the record limit|Projected in the run confirmation. If hit mid-run, pause with an upgrade prompt.|
|Workflows would fire on 112,540 created records|Listed in the run confirmation with trigger count. Suppression on by default.|
|**Activity notifications would fire on 312,000 activities**|Separate suppression toggle, also on by default.|
|User skips the verify phase|Allowed with an explicit acknowledgement tick.|
|Verify phase run 6 times|Supported and free. Each run listed with its settings.|
|Undo of the verify phase leaves an attribute or formula behind because it's now in use|Retained; named in the undo report with the reason.|
|Network drops during the run|Continues server-side. Reopening resumes the live view. Email on completion.|
|**Re-run without activity dedup**|Prevented — activities carry HubSpot IDs and are matched. Without this a re-run would duplicate 312,000 timeline entries.|
|3,204 deals fail with the same error|Circuit breaker pauses at the 5% / 5,000 threshold, names the dominant error and likely cause.|
|Files task fails entirely after records succeeded|Records and activities kept. Files task retryable on its own. Report shows file variance separately.|
|Individual task cancelled mid-run|That task stops; dependents marked **Skipped — dependency cancelled**.|
|Reconciliation variance is 64% on Deals|Red. Break down by failure reason. Offer **Fix users & retry**.|
|Team keeps working in HubSpot for 3 weeks|Catch-up sync run repeatedly, each scoped by last-successful-run timestamp. Activities will dominate each delta.|
|Record edited in SparrowCRM then changed in HubSpot too|Catch-up default **Don't overwrite records changed in SparrowCRM**. Conflicts listed for review.|
|Revert requested after 844 migrated records were edited|Those 844 retained and listed. Only untouched records deleted.|
|Revert requested 45 days after completion|Unavailable. Explain the window; offer bulk delete filtered by HubSpot ID.|
|Draft abandoned for 3 weeks|Resumable. Counts marked stale with a re-check prompt; mapping and formula translations preserved.|
|User deletes the migration record|Migrated data untouched — the modal says so. Reports are lost.|
|HubSpot returns 423 Locked repeatedly|Task shows **Throttled**, honours the 2-second delay, continues. Not an error.|
|Customer's other HubSpot integration exhausts the shared daily quota|Pause with an honest explanation; resume when the quota resets.|
|**Customer's HubSpot has custom objects**|Detected in the count pass and named in the exclusions panel with counts, plus "coming once SparrowCRM Custom Objects ships". Their fields and associations are not migrated in v 1.|

---

## Sources

**SparrowCRM internal**

- [[Import_v1]] — CSV/Excel import feature spec
- [[Custom Objects_v1]] — custom objects PRD (Migration v 2 depends on it shipping; its R-P 0-6 file import reuses [[Import_v1]], not this module)
- Help Article — Import data into SparrowCRM via CSV

**HubSpot — product**

- https://knowledge.hubspot.com/properties/create-calculation-properties — calculation types, operators, functions, limits
- https://knowledge.hubspot.com/import-and-export/understand-the-import-tool
- https://knowledge.hubspot.com/import-and-export/troubleshoot-import-errors
- https://knowledge.hubspot.com/integrations/transfer-data-from-other-apps-using-hubspot-smart-transfer
- https://knowledge.hubspot.com/integrations/revert-a-transfer-in-hubspot-smart-transfer
- https://knowledge.hubspot.com/integrations/connect-and-use-hubspot-data-sync
- https://knowledge.hubspot.com/records/use-lifecycle-stages
- https://knowledge.hubspot.com/object-settings/set-limits-for-record-associations

**HubSpot — developer**

- https://developers.hubspot.com/docs/guides/api/crm/properties
- https://developers.hubspot.com/docs/api-reference/crm-associations-schema-v4/guide
- https://developers.hubspot.com/docs/api-reference/crm-crm-owners-v3/guide
- https://developers.hubspot.com/docs/api-reference/crm-pipelines-v3/guide
- https://developers.hubspot.com/docs/api-reference/crm-calls-v3/guide
- https://developers.hubspot.com/docs/api-reference/crm-emails-v3/guide
- https://developers.hubspot.com/docs/api-reference/legacy/crm/activities/notes/guide
- https://developers.hubspot.com/docs/api-reference/files-files-v3/guide
- https://developers.hubspot.com/docs/api-reference/legacy/automation/workflows/guide
- https://developers.hubspot.com/docs/developer-tooling/platform/usage-guidelines
- https://developers.hubspot.com/changelog/increasing-our-api-limits
- https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/scopes.md

**Competitors**

- https://attio.com/help/reference/imports-exports/migrate-data-from-another-crm
- https://support.pipedrive.com/en/article/importing-data-from-a-previous-crm-using-import2
- https://help.close.com/docs/migration-from-another-crm
- https://help.zoho.com/portal/en/kb/crm/data-administration/data-migration/articles/migrating-from-hubspot
- https://help.folk.app/en/articles/8373397-how-to-migrate-from-hubspot-to-folk
- https://help.import2.com/en/articles/655195-matching-to-pre-existing-data-handling-duplicates
- https://import2.github.io/ — partner API