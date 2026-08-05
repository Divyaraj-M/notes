---
owner: Divyaraj Murugan
feature: "[[Custom Objects]]"
version: 1
status: Active
priority: High
tags:
  - sparrowcrm/features/custom_object/v1
---

> **Note on the prior spec.** The Nov 2025 spec predates Copilot, Custom Agent Builder, Pipeline Agent, Hygiene Agent v 2.0, Activity Tracker, Smart Router, and the score configurators. It contains no mention of the AI insight page. This is not one team's oversight — it is **mutual blindness**: the insights work didn't know custom objects were coming, and the custom objects spec didn't know insights were coming. This PRD assumes there are more hardcoded surfaces than we currently know about, and treats finding them as a P 0 activity.

---

## 1. Problem Statement

Customers moving to SparrowCRM often track more than three types of data. SparrowCRM supports only Contacts, Companies, and Deals — so their other data, and the links between them, has nowhere to go. They either abandon the migration or leave part of their business behind.

**Who experiences it and how often:** Every prospect migrating from a CRM that supports custom objects (HubSpot, Salesforce, Attio). Because _all_ prospects are migrating from somewhere, this is hit at evaluation time, i.e. at 100% of migration-stage deals for that segment — not occasionally, but at the front door.

**Why existing customization doesn't cover it:**

- **Custom fields** attach _one value to one record_. They break the moment the relationship is one-to-many — a borrower with a second loan either overwrites the first (data loss) or forces `loan_2_amount`, `loan_3_amount` … (schema explosion). They also cannot express what a relationship _means_ (this contact is the _guarantor_, not just "related").
- **Lists** group _existing_ records. They cannot create a new record type, so there is no Loan or Property to put in the list in the first place.
- **Spreadsheets** (today's real workaround) put the data outside the CRM, where workflows, reporting, and AI cannot reach it.

The common failure across all three: **the entity has no home.** Its data gets smeared across other objects, and the structure — cardinality and relationship meaning — is what gets destroyed.

**Cost of not solving it (pre-launch context — no live users yet):**

1. We cannot migrate our own sales team off HubSpot → **we cannot dogfood our own CRM**.
2. We launch without internal usage, internal confidence, or a reference story.
3. Prospects hit the same wall at evaluation → **lost before onboarding** (worse than churn — they never became customers).
4. **The debt compounds monthly.** Every sprint shipping against three hardcoded objects adds another surface to retrofit later. This fix is at its cheapest today and never gets cheaper.

### Evidence

|Source|Status|What it gives us|
|---|---|---|
|**Our own HubSpot instance** (>3 objects in use; blocks internal migration)|✅ Confirmed|First-hand proof + urgency. We are customer zero with a deadline.|
|Prospect / lost-deal analysis: how many prospects use custom objects, how many objects, record volumes, and whether "no custom objects" appears in lost-deal notes|⚠️ To validate|Converts "they have them" into "we lost revenue over it"; sizes migration volume|
|User interviews — _"walk me through the last time you tracked something that didn't fit Contacts/Companies/Deals; where does it live today?"_|⚠️ To validate|Confirms the pain is relational, not merely tabular|
|Support tickets + sales call recordings, searched for "custom object"|⚠️ To validate|Zero-prep corroboration|

**Falsifiable claims to test before build:** (a) migration losses actually cite this; (b) the pain is relational — if customers only need a flat table, Lists suffice and this is over-scoped; (c) many-to-many and typed relations are genuinely needed, or one-to-many covers ~90% of cases (this materially changes data-model cost).

---

## 2. Jobs To Be Done

**Primary job statement:**

> When I'm evaluating or executing a migration to a new CRM and my business runs on record types beyond contacts, companies, and deals, I want to recreate my existing data model — entities _and_ the relationships between them — inside the new CRM, so I can move my whole operation without losing structure or leaving data behind.

**Functional dimension:** Define new record types with their own fields and identity, and connect them to existing records with the correct cardinality (one-to-many, many-to-many) and the correct meaning (borrower vs. guarantor).

**Emotional dimension:** Confident that nothing was silently lost. Migration is the single scariest moment in a CRM purchase — the user wants to feel _safe_, not clever.

**Social dimension:** The admin/ops lead who championed the switch wants to be seen as having made a sound call — not as the person who broke the company's data.

**Hiring criteria — why they choose this over the workaround:**

- It's the only path that lets them migrate at all; the alternative is not switching.
- Their data becomes reachable by workflows, filters, reporting, and AI — spreadsheets don't do that.
- The structure survives, so their team's existing mental model of the business still works on day one.

**Firing criteria — why they'd abandon it (design stress-test):**

- **Silent data loss.** Records import but associations vanish; they discover it weeks later. Fatal.
- **Second-class objects.** They create the object and find no filters, no reporting, no AI — it reads as broken rather than incomplete.
- **Configuration burden.** Creating an object requires a 40-field setup wizard before anything is usable.
- **A permissions accident.** Sensitive data exposed to the wrong team; trust does not recover.

---

## 3. Goals

|#|Goal|Type|How we know it succeeded|
|---|---|---|---|
|G 1|**Our own sales team runs on SparrowCRM, off HubSpot**|Business|Internal migration completed with zero structural loss; sales team's daily workflow is in SparrowCRM|
|G 2|A migrating customer can recreate their data model without losing entities or relationships|User|Import completes with 100% association integrity, verified by reconciliation report|
|G 3|Custom objects reach Tier 1 parity — they behave like native objects everywhere that is schema-driven|User|Views, filters, search, CRUD, bulk ops, import/export, permissions, audit, restore, workflows all work on a custom object with no per-object engineering|
|G 4|"No custom objects" stops appearing as a disqualifier in migration-stage deals|Business|Lost-deal reason tracking shows zero losses attributed to this after launch|
|G 5|The architecture stops the hardcoding pattern — new insight/AI surfaces are registered, not hand-authored per object|Business|Adding a 5 th object type requires zero changes to the insight/record-page layer|

---

## 4. Non-Goals

|Non-goal|Why out of scope|
|---|---|
|**Email, calls, and enrichment on custom objects**|Identity-driven, not object-driven. A Loan has no inbox; enrichment providers resolve people and domains, not financial instruments. This is not deferred — it is **not applicable**.|
|**Sales-semantic insights on custom objects** (best time to contact, buying intent, competitor mentions, engagement/response rate)|Conceptually meaningless outside a human sales cycle. Scoped out permanently, not phased.|
|**Full widget configurator for insight pages**|v 1 ships the registry plus a schema-driven Summary. Admin-authored widget layouts are a later phase; building it now blocks launch.|
|**Replicating HubSpot's complete association model** (labels, limits, every cardinality)|Unbounded. v 1 scopes to _what our own HubSpot actually uses_ — a finite, auditable list.|
|**Migrating native objects (Contacts/Companies/Deals) onto the registry**|Architecturally desirable and cheapest right now (see Open Question B 1), but a separate workstream. If approved, it must be scoped and sequenced separately — never bundled with a redesign.|
|**Reports, dashboards, agents, and Copilot coverage for custom objects**|Tier 3 surfaces requiring individual retrofit. Phased after v 1 on the basis of the audit (R-P 0-1).|

---

## 5. User Stories

**Admin — creating and configuring** (highest priority)

1. As a **CRM admin**, I want to create a new object type with its own name, fields, and identity, so that my business's core entities live in the CRM instead of a spreadsheet.
2. As a **CRM admin**, I want to define how my new object relates to Contacts, Companies, and Deals — including one-to-many and many-to-many — so that my existing data model survives the move.
3. As a **CRM admin**, I want to label what a relationship _means_ (borrower, guarantor, listing agent), so that my team can tell relationships apart rather than seeing a generic "related" list.
4. As a **CRM admin**, I want a new object to be invisible to everyone but me until I've set its access rules, so that I never expose sensitive data during the minutes I'm configuring it.
5. As a **CRM admin**, I want to control which teams and roles can read, edit, and export each object, so that finance or HR data isn't visible company-wide.

**Admin — migrating** 
6. As a **migrating admin**, I want to import my existing records _and their relationships_ from a file, so that I don't have to rebuild thousands of links by hand. 
7. As a **migrating admin**, I want a reconciliation report showing how many records **and how many relationships** were created, skipped, or failed, so that I can verify nothing was silently dropped before I decommission my old CRM. 
8. As a **migrating admin**, I want to re-run a failed or partial import safely, so that a mistake doesn't leave me with duplicates.

**End user — daily work** 
9. As a **sales rep**, I want to open a custom object and see a table of records with the columns my admin defined, so that I can work the way I do with Contacts. 
10. As a **sales rep**, I want to filter, sort, and search custom object records, so that I can find what I need without scrolling. 
11. As a **sales rep**, I want to see a custom object's related records from a Contact or Deal page (and vice versa), so that I understand the full context of an account. 
12. As a **sales rep**, I want to create a new record through a form containing the fields my admin marked required, so that I capture complete data without guessing.
13. As a **sales rep**, I want to view custom records on a Kanban board grouped by a status field, so that I can track them through stages.

**End user — associations and context** 
14. As a **sales rep**, I want to link a custom record to a Contact, Company, Deal, or another custom record from either side, so that I can build context as I learn it without going to an admin. 
15. As a **sales rep**, I want to see _which role_ a related record plays (borrower vs. guarantor), so that a list of related contacts is actually meaningful.

**End user — working the record (generic attachments, Tier 1)** 
16. As a **sales rep**, I want to create and complete **Tasks** on a custom record, so that follow-ups live with the thing they concern instead of in my head. 
17. As a **sales rep**, I want to add **Notes** and **meeting notes** to a custom record, so that context is captured where my team will look for it. 
18. As a **sales rep**, I want to attach **Files** to a custom record, so that supporting documents aren't scattered across drives. 
19. As a **sales rep**, I want to add custom records to a **List**, so that I can work a subset the same way I work contact lists. 
20. As a **sales rep**, I want to **favorite** an object or a record, so that I can get back to what I use daily. 
21. As a **team lead**, I want to see an **audit trail** of changes to a custom record, so that I can answer "who changed this and when."

**Admin — automation and reporting (Tier 3 — phased, see R-P 0-1)** 
22. As a **CRM admin**, I want to trigger a **workflow** when a custom record is created, updated, or reaches a status, so that my process runs on my own data and not just on deals. 
23. As a **CRM admin**, I want to reference custom object fields inside workflow conditions and actions, so that automation can actually read the data it's routing. 
24. As a **RevOps analyst**, I want to build **reports and dashboards** over custom object data, including across its associations, so that this data isn't a reporting blind spot. 
25. As a **sales rep**, I want to **ask Zulie/Copilot questions** about custom object data in natural language, so that the AI reflects my whole business, not just three-quarters of it. 
26. As a **CRM admin**, I want to configure the **record page layout** for a custom object, so that reps see the fields that matter in the order that matters.

**Edge cases and empty/error states** 
27. As a **sales rep** opening a custom object record with no activity yet, I want a useful default view rather than an empty AI insights panel, so that the page doesn't look broken. 
28. As a **sales rep** on my first visit to a new object, I want a sensible default view without configuring anything, so that I'm not blocked by setup. 
29. As a **CRM admin** who has hit my plan's object limit, I want a clear message explaining the limit and my options, so that I'm not left guessing why creation failed. 
30. As a **CRM admin**, I want to be warned before renaming anything that other parts of the system reference, so that I don't silently break workflows and imports. 
31. As a **user without edit access**, I want export to be blocked with a clear explanation, so that data governance is enforced predictably. 
32. As a **CRM admin**, I want to be told what happens to associated records before I delete a parent record, so that I don't orphan or destroy data unintentionally. 
33. As a **CRM admin** building a hierarchy (parent company, refinanced-from loan), I want circular references prevented, so that I can't create a loop that breaks the system.

**Deliberately NOT written as stories (Tier 2 — see Non-Goals)** Enrolling a custom record in a **Sequence**, sending **email** or logging **calls** directly against a custom record, and **enrichment** of custom records. These require an inbox, a phone number, or a resolvable person/company identity. See "inherited activity" (R-P 2) for the version of this that _is_ meaningful.

---

## 6. Requirements

### Must-Have (P 0)

**R-P 0-1 — Tier 3 audit of the current product surface** _Not a code change; a prerequisite deliverable._ Audit everything shipped since Nov 2025 for hardcoded three-object assumptions.

Classification tests:

- **Test 1:** Does the capability need to know _what the record is_, or only _what fields it has_?
- **Test 2:** Would the customer _want_ this on their Loans?

|Tier|Test 1|Test 2|Action|
|---|---|---|---|
|**Tier 1**|fields only|yes|Full parity — build once|
|**Tier 2**|needs identity|no, conceptually nonsense|Scope out explicitly|
|**Tier 3**|_claims_ fields only, secretly assumes native semantics|yes, but broken today|Retrofit list, phased|

Known Tier 3 candidates to assess: 
- AI insight page  
- Copilot (Ask Sparrow) retrieval index and prompt scaffolding 
- Hygiene Agent (dedupe likely matches on email/domain)
- Custom Agent Builder · Pipeline Agent · Activity Tracker 
- Smart Router
- AI Score and Multi-Score Fit configurators 
- Reports & Dashboards 
- mobile rendering 
- plan gating.

_Acceptance:_ Every candidate is classified Tier 1/2/3 with a one-line rationale; Tier 3 items are sized and sequenced. **Mis-tiering is costly both ways** — Tier 3 labelled Tier 2 ships a silent gap customers expected; Tier 2 labelled Tier 3 burns engineering on nonsense.

**R-P 0-2 — Our-HubSpot audit → v 1 data-model requirements** Inventory our own HubSpot instance: which custom objects, which association types, which cardinalities, record volumes per object.

_Acceptance:_ A finite list of required association types and volumes, which becomes the v 1 data-model requirement. This converts an unbounded scoping debate ("same as HubSpot") into an audit ("same as _our_ HubSpot").

**R-P 0-3 — Object creation** Settings → Objects → Create. Modal captures **singular and plural name** (both needed for UI copy: "Create new Loan" / "All Loans"), auto-generated editable slug, and description. Description is stored as **AI context** for later insight/Copilot use.

_Acceptance criteria:_

- Given I'm an admin, when I submit the creation modal with valid name/slug/description, then the object is created and I land on its configuration page.
- System fields are provisioned automatically: `id`, `created_at`, `created_by`, `owner_id`.
- Duplicate object names and duplicate slugs are rejected with a clear message.
- Slug is auto-derived from the singular name and remains editable **only before publish** (see R-P 0-8).

**R-P 0-4 — Fields** Admin sets a **primary display property** (the record's identifying column) and adds custom fields of supported types. System fields are present and non-deletable.

_Acceptance criteria:_

- A primary display property must be chosen before publish; it must be a unique-value-capable field.
- Admin can add, reorder, rename, and delete custom fields; deleting a field in use requires explicit confirmation.
- Field types match those available on native objects (parity requirement, Tier 1).

**R-P 0-5 — Associations (the core of the feature)** Support relationships between a custom object and Contacts, Companies, Deals, and other custom objects, **scoped to the cardinalities identified in R-P 0-2**.

_Cardinality reference — decide each required relation with this test:_ "Can one A have many B?" × "Can one B have many A?"

|A→many B|B→many A|Type|Design consequence|
|---|---|---|---|
|No|No|**One-to-one**|Challenge it: if truly 1:1, this may belong as _fields_ on the existing record. Only justify a separate object if it needs its own permissions, lifecycle, or record page.|
|Yes|No|**One-to-many**|Child holds the reference. **Must define delete semantics** (cascade / orphan / block). The workhorse case.|
|No|Yes|**Many-to-one**|Not a distinct type — same relation from the other side. Affects rendering only (one parent shown vs. a list).|
|Yes|Yes|**Many-to-many**|Requires a join table; the join may carry its own attributes. Most expensive, and the hardest to import.|
|—|—|**Self-referencing**|Object relates to itself (parent company, reports-to, refinanced-from). **Requires cycle detection.** Commonly forgotten.|
|—|—|**Labeled / typed**|_Orthogonal to cardinality._ The link carries a role (borrower / guarantor / listing agent). Enables **two distinct relations between the same object pair**, distinguished by role. Without it, all links collapse into one undifferentiated "Related" list and meaning is lost.|

_Acceptance criteria:_

- One-to-many is supported (one Contact → many Loans) with no field duplication and no schema explosion.
- Many-to-many is supported where R-P 0-2 shows we need it, via a join that can later carry attributes.
- Self-referencing associations are supported with **circular reference prevention**.
- A relationship can carry an admin-defined **label/role**; the same object pair can have multiple labeled relations.
- **Delete semantics are explicit and surfaced to the user before deletion** (cascade, orphan, or block — decided per relation).
- Associations render bidirectionally: from the custom record, and on the related native record, with the role visible on both sides.
- Deleting a record removes its association rows without leaving orphans.

_Technical note — import format constraint._ Source CRMs typically export associations as **separate files**, not as a column on the record. A single flat CSV with one "related contact" column can only express **1:N with one unnamed label**. Many-to-many and labeled relations require either multiple typed columns or a dedicated association-import file. This is a v 1 scoping decision answered by R-P 0-2.

**R-P 0-5 b — Filtering on own fields (Tier 1) vs. through associations (flagged)** Filters, sort, and search on the custom object's **own** fields are P 0 parity.

_Constraint to flag explicitly:_ **cross-object filtering** ("Loans where the borrower's Company is in California") requires the filter engine to **join across the association**. This is materially harder than filtering own fields and must not be assumed free under "filters are Tier 1." Scope decision required: is cross-object filtering in v 1, or P 1?

**R-P 0-6 — Import with relationship integrity reporting** File-based import that creates records **and their associations**, reusing the existing CRM-migration flow.

_Acceptance criteria:_

- Given an import file with records and relationship columns, when the import runs, then a reconciliation report shows counts **created / skipped / failed for records AND for associations separately.**
- **A partial import must fail loudly, never silently.** "2,000 Loans imported ✅" while 2,000 borrower links vanished is the specific failure this requirement exists to prevent.
- Given a partially failed import, when I re-run it, then existing records are matched rather than duplicated.
- Import is blocked (with explanation) for users without edit access on the object.

> **Rationale — irreversibility.** A failed import is loud and recoverable: the customer retries. A "successful" import that dropped associations produces data that _looks_ complete, gets trusted, gets built on — and may be discovered only after the customer has decommissioned their old CRM. There is no undo on their side. This is the highest-severity risk in the project.

**R-P 0-7 — Permissions with a safe default** Object-level access control: allow-all or custom by team/role, with read-only vs. edit, plus export restriction for users without edit access.

_Acceptance criteria:_

- **On creation, a new object is visible to its creating admin only, until access is explicitly configured.** (Prevents the exposure window: object created 2:00 pm, permissions finished 2:20 pm, sensitive structure visible company-wide in between.)
- Roles created _after_ the object exists can be granted access without re-creating the object (RBAC must handle objects that didn't exist at role-configuration time).
- Users without edit access cannot export, and see a clear reason.

> **Rationale — irreversibility.** Every other failure mode in this project is fixable by shipping a patch. Exposed data cannot be un-seen. This is the one requirement whose failure is a security/compliance incident rather than a bug.

**R-P 0-8 — Publish as an explicit commitment point** An object transitions from draft (admin-only) to published (visible per access rules).

_Acceptance criteria:_

- Publish is blocked until required configuration is complete (primary display property, access rules).
- On publish, a confirmation modal offers to notify assigned users.
- **After publish, the slug becomes immutable** (or a redirect/alias is maintained) because workflows, imports, and API calls reference it. Display name remains editable.
- Published objects appear in the sidebar/navigation for users with access.

**R-P 0-9 — Table and Kanban views** Default views on first open, following the Attio pattern.

_Acceptance criteria:_

- On first open, the user chooses Table or Kanban (or lands on Table with the option to switch).
- **Kanban grouping is offered only for stage/select/multi-select fields** — a number or free-text field has unbounded values and cannot produce a finite set of board columns. Attempting it is prevented with an explanatory message, not an error.
- Admin-defined columns display; users can add/remove columns.
- Filter, sort, and search work on all field types (Tier 1 parity).

**R-P 0-10 — Record creation and record page** _Acceptance criteria:_

- `+ New record` opens a form containing the admin-defined fields, enforcing fields marked required.
- On save, the record is created and auto-opens.
- A default record-page layout renders when the admin hasn't customized one.
- **The default landing tab must not be an empty AI insights panel.** Custom objects land on Details (or Activity), decided in design.

**R-P 0-11 — Insight registry seed (architectural)** Whatever renders on a custom object's record page in v 1 must be driven by a **per-object registry entry**, not hand-authored page code.

_Acceptance criteria:_

- Adding a new object type requires a registry entry, not new page components.
- v 1's Summary (see R-P 1-1) is implemented as the **first registered widget** with a declared data contract, not as an inline section.

> **Rationale.** The three native insight pages were hand-authored, which is _why_ this problem exists. Hardcoding a fourth page — even "just for v 1, we'll refactor later" — repeats the original sin and guarantees the work is thrown away. The 2-day saving is not worth it: architecture decisions are the irreversible ones; feature phases are reversible.

**R-P 0-12 — Plan gating** Enforce a per-plan limit on the number of custom objects. _Acceptance criteria:_ Limit is configurable per plan; hitting it shows a clear message and upgrade path, not a generic failure. _Dependency: Pricing & Plan Feature Gating PRD v 1.0._

**R-P 0-13 — Tier 1 parity set** Custom objects must support, with no per-object engineering: CRUD, bulk edit/delete, filters and search on own fields, import/export, audit log, record restore, notifications on create/delete, and API access.

**R-P 0-14 — Generic record attachments** Capabilities that attach to _any_ record and require no knowledge of what the record represents must work on custom objects at parity: **Tasks, Notes, meeting notes, Files, Lists membership, and Favorites.**

_Acceptance criteria:_

- A task created on a custom record appears in the assignee's task list with a working link back.
- Notes and meeting notes save, display, and are searchable.
- Custom records can be added to and removed from Lists.
- Objects and individual records can be favorited and appear in the favorites surface.
- Verified against a newly created custom object as part of release testing.

> These are Tier 1 by the classification test — a task does not need to know whether it's attached to a person or a loan. If any of them turns out to be hardcoded to native objects during R-P 0-1, it moves to the Tier 3 retrofit list and this requirement is re-scoped.

**R-P 0-15 — Workflow support** A custom object can be selected as a workflow **trigger** (record created / updated / field changed / status reached) and its fields readable in workflow conditions and actions.

_Acceptance criteria:_

- Custom objects appear in the workflow trigger picker.
- Custom object fields are selectable in conditions and action payloads.
- Associated records are reachable from a workflow context (at minimum one hop).
- _Dependency: Workflows module. Flagged as a likely Tier 3 surface pending R-P 0-1._

### Nice-to-Have (P 1)

**R-P 1-1 — Schema-driven Summary, honestly labelled** A generated narrative summary built from the object's fields, associations, and description — **labelled "Summary", not "Insights".** A summary restates what's on the record; an insight tells you something you didn't know. Do not over-claim. _Acceptance:_ Renders for any object with no configuration; degrades gracefully when data is thin. Note that even native Contacts frequently show "Not enough data" today — custom objects will have less activity, so expectations must be set accordingly.

**R-P 1-2 — Create-with-AI** — describe the object in natural language, generate a proposed field/association schema for admin review. Faster setup; reduces the configuration-burden firing criterion.

**R-P 1-3 — Create-from-file** — infer schema from an uploaded CSV, then confirm. Natural companion to migration.

**R-P 1-4 — Form/template customization** — admin controls which fields appear in the manual-create form, integrated with templates.

**R-P 1-5 — Workflow and notification depth** — per-object notification rules, list of related workflows on the object with deep links.

**R-P 1-6 — Agentic recommendations toggle** — per-object on/off, surfaced _inside_ the object settings (not only in a separate agentic settings page), with a deep link to global settings.

**R-P 1-7 — Cross-object filtering** — filter a custom object by properties of an associated record ("Loans where the borrower's Company is in California"). Requires join support in the filter engine; P 1 unless R-P 0-2 shows our own migration depends on it.

**R-P 1-8 — Reports and dashboards over custom objects** — including aggregation across associations. Tier 3 retrofit; sequence from R-P 0-1.

**R-P 1-9 — Copilot / Ask Zulie coverage** — custom objects and their descriptions included in the retrieval index so natural-language questions cover the whole business. Tier 3 retrofit. _Open question N 7: automatic or explicit opt-in?_

**R-P 1-10 — Record page layout configuration** — admin controls field order, grouping, and which panels appear. Built as registry configuration (R-P 0-11), not per-object page code.

### Future Considerations (P 2)

Design must not preclude these:

- **Inherited activity through associations.** You cannot email a Loan — but you _do_ want to see the emails and calls with the **borrower** that concern that Loan. Activity is surfaced on the custom record by inheriting it through the association, without the custom object needing an inbox or phone number of its own. This is the meaningful version of "attach emails and calls to custom objects," and it resolves what would otherwise look like a Tier 2 gap. **Requires that associations be first-class (R-P 0-5) and that activity records can be filtered by related-record context — do not design either in a way that blocks this.**
- **Association attributes.** A many-to-many join that carries its own fields (ownership %, date added, allocation). Keep the join model capable of holding attributes even if v 1 exposes none.
- **Smart Routing over custom objects** — routing logic currently assumes a lead/contact; Tier 3 retrofit, sequence from R-P 0-1.
- **Admin-authored insight widgets** — the registry (R-P 0-11) is the enabling architecture; the configurator UI comes later, following the existing AI Score / Multi-Score Fit configurator pattern.
- **Native objects migrated onto the registry** — see Open Question B 1. Cheapest to do now; if deferred, we permanently maintain two systems and build every insight improvement twice.
- **Custom-object pipelines** — spec'd as disabled-by-default; keep the data model pipeline-capable.
- **Reports, dashboards, and agent coverage** — sequence from the R-P 0-1 audit.
- **Per-object page layout customization** — including who may edit layout (admin-only vs. delegated).
- **History/activity tab** — the prior spec flagged this "needed?????"; leave the data model able to support it.
- **Mobile rendering** of custom objects.

---

## 7. Success Metrics

### Gate metric (binary, pre-launch)

**G 1 — Internal migration.** We migrate our own sales team off HubSpot with zero structural loss. _Measurement:_ reconciliation report shows 100% of records and 100% of associations created; sales team's daily workflow runs in SparrowCRM for 2 consecutive weeks with no fallback to HubSpot. _Evaluate:_ at internal cutover. **This is the release gate — not a metric we hope to hit, a condition for shipping.**

### Leading indicators (days → weeks post-launch)

|Metric|Success|Stretch|Method|Window|
|---|---|---|---|---|
|Migration completion rate for customers with >3 object types|80% complete import without support intervention|95%|Import telemetry: started vs. completed|30 days|
|**Association integrity rate**|100% (any shortfall is a P 0 bug, not a metric miss)|—|Reconciliation reports|Every import|
|Objects created per new workspace (admins who need them)|≥1 within first week|≥2|Product analytics|7 days|
|Record creation in custom objects (are they _used_, not just created?)|60% of created objects have >10 records within 14 days|80%|Product analytics|14 days|
|Time to create and publish a first object|< 10 minutes median|< 5 min|Instrumented flow timing|30 days|
|Import error/abandon rate|< 10%|< 5%|Import telemetry|30 days|
|Permission misconfiguration incidents|**0**|—|Security review + audit log|Ongoing|

### Lagging indicators (weeks → months)

|Metric|Success|Method|Window|
|---|---|---|---|
|Migration-stage deals lost citing "no custom objects"|0|Lost-deal reason tracking|1 quarter|
|Competitive win rate vs. HubSpot/Attio in custom-object-dependent deals|Measurable improvement over pre-launch baseline|CRM deal analysis|2 quarters|
|Custom-object data reachable by AI/workflows (is it a first-class citizen or a silo?)|>50% of custom objects referenced by ≥1 workflow or AI surface|Product analytics|1 quarter|
|Support tickets about unsupported data types|Trending to 0|Support tagging|1 quarter|

**Counter-metric (watch for harm):** native object performance and error rates must not regress if any shared code path changes.

---

## 8. Open Questions

### Blocking — must answer before engineering starts

_Rule applied: if getting it wrong forces a data migration or another team's rework, it blocks. If it only forces a UI change, it can wait._

|#|Question|Owner|
|---|---|---|
|**B 1**|**Do we migrate native objects onto the registry now?** Pre-launch is the cheapest this will ever be — no users, no blast radius, and the Tier 3 list is at its shortest. Every month of delay adds users to protect and features built twice. _Note: Option "leave hardcoded" is never actually chosen — it's what happens when the migration keeps getting deprioritized._|Eng leadership + PM|
|**B 2**|**Which association cardinalities does v 1 support?** One-to-many only, or also many-to-many, self-referencing, and typed/labelled relations? Answered by R-P 0-2. Schema-level — retrofitting means data migration.|PM + Eng|
|**B 2 a**|**What are the delete semantics per relation type** — cascade, orphan, or block? Data-integrity decision; cannot be changed silently once customers have data.|Eng + PM|
|**B 2 b**|**Does the import accept a separate association file, or only columns on the record file?** Determines whether M:N and labelled relations are importable at all in v 1.|Eng + PM|
|**B 7**|**Is cross-object filtering (joining through an association) in v 1?** Materially harder than own-field filtering; do not let it hide inside "filters are Tier 1."|Eng + PM|
|**B 3**|**Is the slug immutable after publish, or do we maintain aliases/redirects?** Workflows, imports, and API calls reference it; silent breakage otherwise.|Eng|
|**B 4**|**How does RBAC handle objects created after roles were configured?** Runtime permission surfaces are new behavior for the roles system.|Eng + Security|
|**B 5**|**What are the per-plan object limits?** Blocks billing plumbing.|PM + Billing|
|**B 6**|**How many Tier 3 surfaces exist?** (R-P 0-1.) Blocks the estimate itself — this is the answer most likely to change the project's size.|PM + Eng|

### Non-blocking — resolve during implementation

|#|Question|Owner|
|---|---|---|
|N 1|Do we need a History/activity tab on custom objects at all?|PM + Design|
|N 2|AI-create and/or CSV-create — which lands first?|PM|
|N 3|Table-vs-Kanban prompt on first open, or default to Table with a switcher?|Design|
|N 4|Where does page-layout customization live, and who may edit it?|Design|
|N 5|Is the publish notification opt-in or opt-out by default?|PM|
|N 6|Which widget(s) beyond Summary ship in the first registry release?|PM + Design|
|N 7|Does the object description feed Copilot's index automatically, or require explicit opt-in?|PM + AI team|

---

## 9. Timeline Considerations

**Hard driver:** internal sales-team onboarding onto SparrowCRM. This is both the deadline and the acceptance test — we cannot dogfood, build internal confidence, or generate a reference story until it's done.

**Sequencing — order matters more than any individual item:**

1. **Audits first (R-P 0-2, then R-P 0-1).** Our-HubSpot audit is cheapest and highest-leverage: it produces the v 1 data-model requirements as a byproduct. The Tier 3 audit protects the estimate. **Neither is a code change and both must precede estimation.**
2. **Resolve B 1–B 5** (architecture and data model). These are the irreversible decisions.
3. **Build P 0** — creation → fields → associations → import with integrity reporting → permissions → publish → views → record page on the registry seed.
4. **Internal migration = the release gate.** Cut over our own sales team before external launch.
5. **P 1 and the phased Tier 3 retrofit** post-launch, ordered by the audit.

> **Explicitly not in this project's sequence:** rewriting the old spec before the audits are done. Rewriting first reproduces the same blind spots in nicer formatting — nothing in the act of rewriting reveals that Copilot or the agents hardcode three objects. Also: **keep replatforming separate from redesign.** Bundling them makes bugs unattributable and invites scope explosion.

**Dependencies:** Pricing & Plan Feature Gating (limits) · Users, Teams & Roles (runtime RBAC) · Data Import Feature Spec (migration flow reuse) · Workflows (object as trigger/target) · Copilot / agents teams (Tier 3 retrofit sequencing).

**Scope-explosion guard:** the R-P 0-1 audit may return ten hardcoded surfaces, at which point "add custom objects" quietly becomes "replatform the product" — two quarters, launch blocked. Defense: fix architecture only for the blockers, phase every Tier 3 surface explicitly, and require that any scope addition comes with a removal or a timeline extension.

---

## Parking Lot

Good ideas, not in scope: 
- cross-object rollup/formula fields  
- object templates by industry (lending, real estate, agency) 
- public/portal-facing custom object records  
- custom object webhooks beyond standard API  
- bulk association editing UI 
- object-level data retention policies.