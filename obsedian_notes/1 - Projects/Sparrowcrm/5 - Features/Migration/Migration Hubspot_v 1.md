---
owner: Divyaraj Murugan
feature: "[[Migration]]"
version: 1
status: Done
priority: High
tags:
---

**Companion documents.** Design detail, competitive teardown, screen-by-screen acceptance criteria and API constraints live in [[HubSpot_Migration_v1]]. Buy-vs-build analysis lives in `Migration_Buy_vs_Build_Decision.md`. Wireframe: `HubSpot-Migration-v1-Wireframe.html`. Clickable flow: `HubSpot-Migration-Clickable-AllStates.html`. This PRD is the decision document; the spec is the build document.

**Spec age.** Written fresh 6 Aug 2026 against the current product surface. Two adjacent modules were audited before writing, not after: [[Import_v1]] (shipped CSV/Excel import — explicitly scopes connectors out) and [[Custom Objects_v1]] (in flight). The audit is what produced the dependency finding in §4.

---

## 1. Problem Statement

A company that decides to move from HubSpot to SparrowCRM cannot bring the thing that makes its CRM valuable: the accumulated history around each customer. Records themselves can be exported and re-imported by hand; the relationships between them, the years of emails, calls, notes and meetings, the contracts attached to accounts, and the pipeline structure the forecast depends on, cannot. The company is therefore asked to either abandon that history, keep paying for HubSpot to retain read access to it, or fund weeks of manual reconstruction — so most of them simply stay.

**Who experiences it, and how often.** Every prospect whose CRM is HubSpot — the majority of the mid-market segment SparrowCRM sells into — hits this exactly once, at the point of decision, which is the worst possible moment. It is a one-time problem per customer and a permanent problem for us: it recurs in every deal. **SurveySparrow itself is in this position today** — our own sales team runs on HubSpot and cannot move onto SparrowCRM, which is why G 1 (internal dogfooding) is currently blocked.

**Cost of not solving it.** Three costs, in order of confidence. First, we cannot dogfood: our own sales org stays on a competitor's product, and every internal quality signal we would get from daily use is unavailable (**confirmed, first-hand**). Second, switching cost sits in the deal as an unanswerable objection — the prospect is not comparing features, they are comparing "your product" against "your product plus six weeks of my team's evenings" (**asserted, needs lost-deal evidence — see §1 Evidence**). Third, competitive risk: Attio, Salesforce and Pipedrive all ship first-party CRM migration, so its absence reads as immaturity in an evaluation checklist (**observed in competitor teardown; not yet observed in our own losses**).

### Establishing the gap — why existing capability is not enough

We already ship [[Import_v1]], a CSV/Excel importer with field mapping, dedupe and error reporting. It is a good tool and it does not solve this. The gap is specific and countable:

|What the customer needs to move|Can Import_v 1 + HubSpot CSV export do it?|
|---|---|
|Companies, Contacts, Deals as flat records|**Yes** — this part genuinely works today|
|The links between them (contact→company, deal→company, deal→contact)|**No.** HubSpot's CSV export does not include associations. The customer gets three unrelated spreadsheets and a link graph they must rebuild by hand — ~100,000 links in a mid-size portal|
|Emails, calls, notes, meetings, tasks|**No.** Activities are first-class objects in HubSpot associated by `associationTypeId`; there is no CSV path that exports them attached to their records|
|Files attached to records (contracts, proposals)|**No.** Files require per-file signed URLs from the API; they are not in any export|
|Pipelines, stages, and Won/Lost semantics|**No.** Stage is exported as a label string with no pipeline structure and no won/lost flag|
|Record ownership|**Partially.** Owner exports as an ID or email with no user identity; deactivated owners do not export at all unless explicitly requested|
|Formula/calculated field definitions|**No.** A CSV carries the _computed value_ as a static number — which then never recomputes and silently rots|

Import_v 1 is not a weaker version of this feature; it solves a different job (get a list of leads into the CRM) and its own spec says so: _"This is NOT a CRM-to-CRM migration tool. Direct connectors to Salesforce, HubSpot, Pipedrive are a separate module."_ This is that module. **The exact thing a customer cannot do today: arrive in SparrowCRM with a customer record that still has its history attached to it.**

### Evidence

|Source|Status|What it gives us|
|---|---|---|
|**SurveySparrow's own HubSpot portal** — our sales team's live instance; >3 object types in use; G 1 dogfooding blocked on this|✅ Confirmed|First-hand proof the problem is real and current, plus urgency. We are customer zero|
|** [[Import_v1]] spec** — connectors explicitly out of scope|✅ Confirmed|The gap is documented in our own product, not inferred|
|**HubSpot API capability audit** (associations absent from batch reads and CSV; rollup definitions not exposed; files need per-file signed URLs; activities are associated objects)|✅ Confirmed|Proves the gap is structural in HubSpot's export surface, not a workaround we haven't found|
|**Competitive teardown** — Attio, HubSpot Smart Transfer (run hands-on, 10 screens captured), Import 2, Trujay, Zoho|✅ Confirmed as design input · ⚠️ as evidence of _our_ customers' pain|Tells us what the category considers table stakes; does **not** prove our prospects care|
|**Lost-deal / stalled-deal notes citing migration effort**|⚠️ To validate|Converts "prospects would like this" into "we lost revenue over it". **Highest-value missing evidence**|
|**Interviews with 5 HubSpot-based prospects or recent wins**|⚠️ To validate|Confirms the _shape_ of the pain — specifically whether history or records is the blocker|
|**Sales-call recordings / SE escalations, verbatim search for "migrate", "import", "move our data"**|⚠️ To validate|Zero-prep corroboration, available today if someone searches|
|**Product analytics on migration funnel**|❌ Not available|Feature does not exist; zero users. This is why §7 uses a dogfooding gate rather than an adoption target|

**Borrowed-problem check.** The strongest evidence we hold is our own instance — first-hand, not borrowed. The weakest is the competitive teardown, which tells us what Attio built, not what our customers need. Two claims in §1 currently rest on category lore rather than observed behaviour and are flagged as such: that switching cost blocks deals, and that its absence loses evaluations. **Neither is load-bearing for the dogfooding case, which stands alone.** If the lost-deal search comes back empty, the business case narrows to internal dogfooding plus competitive parity — still worth building, but it should be re-scoped smaller, and §6's P 1 items would move to P 2.

### Falsifiable claims

Stated so they can be killed cheaply, before engineering starts:

1. **Losses actually cite this.** At least some lost or stalled deals in the last 4 quarters name migration effort or "we'd have to leave our history behind." _If zero do_ — the deal-blocker justification collapses and this becomes dogfooding + parity only.
2. **The pain is history, not records.** Customers are blocked by activities, links and files rather than by re-typing company names. _If they are content to move records and abandon history_ — v 1 is massively over-scoped: activities and files are the majority of build cost and the overwhelming majority of runtime.
3. **Buy does not suffice.** No third-party tool (Import 2, Trujay) covers the job. _Tested and currently rejected:_ their insert-only model cannot upsert, which makes switch-over-day catch-up sync impossible and re-running a migration duplicate everything. If any of them ships true upsert keyed on source ID, revisit immediately.
4. **Formula translation is needed.** Customers will not hand-rebuild ~38 calculated fields. _If they will_ — cut translation, ship a deep-linked list instead, and remove the hardest engineering risk from v 1.
5. **Custom objects can genuinely wait.** No target customer's blocking data lives primarily in HubSpot custom objects. _If it does_ — v 1 ships unusable for them and the sequencing against [[Custom Objects_v1]] is wrong.
6. **The advanced case is not the common case.** A "messy portal" (type conflicts, deactivated owners holding deals, unmapped stages, seat shortfalls) is the exception, not the median. _If most portals are messy_ — the error-resolution UI is the product, not a side path, and should be estimated as such.

---

## 2. Jobs To Be Done

**Primary job statement:**

> **When** I have decided to move my company from HubSpot to SparrowCRM, **I want** every customer's full history to arrive intact and provably correct, **so I can** switch my team over on a Monday morning without anyone losing the context they sell with.

**Functional dimension.** Get companies, contacts, deals, their link graph, their entire activity history, their attached files, the pipeline structure, and the people who own the records out of one system and into another — once, completely, without hand-work, and without breaking the source system in the process.

**Emotional dimension.** Confident rather than reckless. The admin doing this is making an irreversible-feeling decision on behalf of a whole team, on data they are personally accountable for. They need to feel they can _prove_ it worked before they commit, and that they can walk it back if it didn't. Anxiety at the start, relief at the end — and never the specific dread of "I think it worked but I can't tell."

**Social dimension.** To be the admin who moved the company without an incident — and to have an artifact to show for it. This person will be asked "did everything come across?" by their VP of Sales, and needs to answer with a number rather than a feeling. Reps need to not notice the change except that their records are all there; a manager needs their forecast to read the same on Tuesday as it did on Friday.

**Hiring criteria — why they choose this over their current workaround:**

- No manual work, no CSV shuffling, no third-party vendor to procure and get through security review
- It brings the history — the part no export can carry
- It can be proven correct before committing, and reversed after
- It never writes to HubSpot, so the fallback position stays intact
- Configuration arrives already done; a clean portal requires zero decisions

**Firing criteria — why they abandon or distrust it.** Each maps to a requirement or risk, per the template's rule:

|Firing criterion|Mitigated by|
|---|---|
|"It wrote to / changed my HubSpot"|P 0: read-only OAuth, zero write scopes, stated on every relevant screen|
|"It silently dropped data and I only found out weeks later"|P 0: reconciliation where Excluded ≠ Failed; 100% pre-flight validation; per-record error reporting|
|"I ran it twice and now everything is duplicated"|P 0: HubSpot ID stored on every migrated item; all writes idempotent upserts|
|"It showed my customers' data to people who shouldn't see it"|P 0: **no customer field values rendered anywhere** — UI or export; IDs and verdicts only|
|"It made me map 455 fields by hand"|P 0: four-tier auto-mapping; new fields pre-filled and bulk-creatable; **any field skippable**|
|"It couldn't be undone"|P 0: revert scoped by run ID, 30-day window, never touches team-created or team-edited records|
|"It flooded my team with 300,000 notifications and fired every workflow"|P 0: workflow and activity-notification suppression during the run|
|"My forecast changed after the move"|P 0: Won/Lost semantics preserved; Won→non-won stage mapping raises an explicit value-weighted warning|
|"It ran for six hours and then died"|P 0: per-task checkpointing, resume-not-restart, circuit breaker, throttle transparency|

---

## 3. Goals

Outcomes, not outputs. Each is stated so we can tell whether it happened.

1. **A HubSpot portal of ~100 k records migrates end to end, self-serve, with no CS or SE involvement and no engineering intervention.** Success = the admin completes it alone; measured by zero support tickets and zero internal escalations on the first three migrations.
2. **The customer can prove correctness before committing and after finishing.** Success = reconciliation balances per object (Selected = Created + Excluded + Failed) on every run, and the pre-migration error list matches the post-migration failure list exactly — no post-run surprises.
3. **Switching cost stops being an unanswerable objection in HubSpot-sourced deals.** Success = sales can demo the flow and state a duration band; measured over time by win-rate change in HubSpot-sourced opportunities (lagging, see §7).
4. **SurveySparrow's own sales team is fully off HubSpot and running on SparrowCRM (G 1).** Success = binary, and it is the release gate.
5. **The connector framework is reusable** — Salesforce, Pipedrive and Zoho v 1 reuse the pipeline, mapping UI, validation, reconciliation and revert machinery rather than reimplementing them. Success = second connector's build cost is materially lower than the first's; recorded as an estimate at the time.

---

## 4. Non-Goals

Split, per the template, into **deferred** (wanted, coming later) and **not applicable** (conceptually out, never coming). Mixing them is how stakeholders end up waiting for things that will never ship.

### Deferred — wanted, not now

| Non-goal                                   | Why out of v 1                                                                                                                                                                                                                                 |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Custom objects**                         | Blocked on [[Custom Objects_v1]] shipping. The dependency is **one-way**: Migration v 2 waits on Custom Objects; Custom Objects does not wait on this module. Their association model is owned there (R-P 0-5) and this module will consume it |
| **Salesforce, Pipedrive, Zoho connectors** | Same framework, different API surface. Sequenced after HubSpot precisely so the framework is proven once before being generalised                                                                                                              |
| **Workflows, sequences and automation**    | These are automation _configuration_, not customer data. v 1 provides a rebuild summary as a download; genuine migration is a much larger and separate problem                                                                                 |
| **Scheduled or recurring sync**            | v 1 has a one-shot catch-up sync for switch-over day. A repeating sync implies conflict-resolution policy we have not designed                                                                                                                 |
| **Two-way sync / ongoing integration**     | This is a migration, not an integration. The intended end state is that the customer _leaves_ HubSpot. A product that keeps both systems live is a different product with an opposite value proposition                                        |

### Not applicable — permanently out of scope

| Non-goal                                     | Why it will never come                                                                                                                                                                                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Any write to HubSpot**                     | Not a scope decision, a design principle. Zero write scopes are requested; the source system's integrity is what makes the whole operation safe to attempt                                                                                                   |
| **Call recording audio files**               | HubSpot hosts and serves them; copying them buys the customer nothing and costs GBs of transfer. Links are kept on each Call record instead                                                                                                                  |
| **Field-level change history / audit trail** | HubSpot does not expose historical property values for bulk export. Recommendation is to keep the HubSpot account read-only if that trail is needed — which is our advice anyway                                                                             |
| **Cross-object rollup formulas**             | **HubSpot does not expose rollup definitions via API** (confirmed). We cannot read what we would have to translate. Deep links to HubSpot's settings are provided so the customer can rebuild by hand. This one is genuinely impossible, not merely descoped |

---

## 5. User Stories

Ordered by priority. Four personas: **SparrowCRM Super Admin** (does the migration), **HubSpot Super Admin** (may be a different person and not a SparrowCRM user at all), **Sales Rep**, **Sales Manager**.

**SparrowCRM Super Admin — core path**

1. As a **Super Admin**, I want to connect my HubSpot with OAuth alone — no API keys, no third-party account, no pasting tokens — so that setup takes two clicks and nothing sensitive lives in a text field.
2. As a **Super Admin**, I want to see every object HubSpot holds with its record count in one list, so that I know exactly what is about to be imported before anything runs.
3. As a **Super Admin**, I want fields to be mapped for me where names match and created for me where they don't, so that I do not hand-map 455 properties.
4. As a **Super Admin**, I want to **skip any field I don't need** rather than being forced to bring all of them, so that I don't import a decade of dead columns into a fresh CRM.
5. As a **Super Admin**, I want every record and activity checked against real SparrowCRM validation before I commit, so that the error list I see is complete rather than a sample.
6. As a **Super Admin**, I want to start the run and close my laptop, so that a six-hour job doesn't require me to babysit it.
7. As a **Super Admin**, I want to know that Results contains no surprises relative to what I was shown beforehand, so that I can answer "did everything come across?" with a number.
8. As a **Super Admin**, I want to bring across everything that changed in HubSpot since the migration on switch-over day, without duplicating anything, so that I can pick a cutover moment rather than freezing my team.

**Edge cases, error and empty states**

9. As a **Super Admin who is not a HubSpot Super Admin**, I want a link I can send to whoever is, so that a permissions boundary doesn't stall the project for a week.
10. As a **Super Admin**, when a field exists with the same name but an incompatible type, I want to resolve it in place — create a new field, remap, or skip — so that one conflict doesn't send me back to the start.
11. As a **Super Admin**, when a HubSpot user has left the company but still owns 3,204 deals, I want to choose between reassigning their records and importing them as a non-consuming deactivated owner, so that my historical reports keep meaning what they meant.
12. As a **Super Admin**, when a HubSpot user has no SparrowCRM account, I want them invited (or explicitly skipped with their records reassigned), so that ownership survives the move.
13. As a **Super Admin**, when the same error affects nearly every record of an object, I want to be **stopped**, not warned — because that is a configuration mistake, not bad data.
14. As a **Super Admin**, when my connection drops mid-run, I want it to resume from its checkpoint rather than restart, so that four hours of transfer isn't wasted.
15. As a **Super Admin**, when the migration is finished and something is wrong, I want to revert exactly what it created — without deleting the work my team has done since — so that the decision is genuinely reversible.
16. As a **Super Admin** on my first visit, I want the migration surface to explain what will and won't come across before I connect anything, so that I can decide whether to start at all. _(Empty state.)_

**Other personas**

17. As a **HubSpot Super Admin who is not a SparrowCRM user**, I want to approve a read-only connection from a link, without creating an account or learning the tool, so that helping takes two minutes.
18. As a **Sales Rep**, I want to open any account and find its contacts, deals, and full conversation history attached, so that I can run my next call without opening HubSpot.
19. As a **Sales Manager**, I want my pipeline stage distribution and calculated fields to read the same as they did in HubSpot, so that I can trust the forecast the day after the move.
20. As a **Sales Rep**, I want to never see a migration UI I have no permission to use, so that the product doesn't advertise controls I can't touch.

---

## 6. Requirements

Full screen-level acceptance criteria live in [[HubSpot_Migration_v1]]. This section states what is required and why, at the level a scoping decision needs.

### P 0 — Must have. Cannot ship without.

**P 0-1 · Read-only OAuth connection with portal confirmation** Two-click OAuth using HubSpot's own account picker. Zero write scopes requested. Portal identity (name, Hub ID, tier) confirmed back to the user after connection.

- [ ] Given a user who is not a HubSpot Super Admin, when they reach the connect step, then they see the requirement _before_ the OAuth jump plus a shareable 7-day link.
- [ ] Given a declined scope, when the connection completes, then the affected data class is reported as **Excluded** with its count — and never as Failed.
- [ ] Given a portal already connected to another workspace, when the user connects it, then they are blocked with the reason and the two exits (choose another portal / have it disconnected).
- [ ] Not a single write scope appears in the consent screen. Verified by inspecting the live authorization URL, not by reading our code.

**P 0-2 · Objects selection with dependency enforcement** One table: object, count, dependencies, status. Any object deselectable subject to dependencies.

- [ ] Given Deals are selected and Pipelines & stages are not, when the user tries to continue, then they are blocked with the count of deals that would arrive stageless and a one-click fix.
- [ ] Given Companies are deselected, then dependent rows show _Blocked — needs Companies_ with the number of links that would drop (~88,816 in a mid-size portal).
- [ ] Relationships and file attachments never appear as rows — they migrate with their records automatically.
- [ ] Given a clean portal, then every row reads **Ready to migrate** and no input is required.

**P 0-3 · Field mapping — auto-map, create, or skip** Four-tier auto-mapping (curated HubSpot→SparrowCRM table → exact label → normalised → synonym). Missing fields default to created, pre-filled from HubSpot. **Every non-required field can be skipped.**

- [ ] Given a field absent in SparrowCRM, then its new-field definition is pre-filled (name from label, type from `type` + `fieldType`, dropdown options carried, unused options unticked) and creatable in one click.
- [ ] Given 64 pending new fields, then a single **Create all** action creates them, and a single **Skip all** excludes them.
- [ ] Given a skipped field, then it is reported as **Excluded** everywhere downstream and never as an error.
- [ ] Given a SparrowCRM-required field with nothing mapped to it, then continue is blocked naming the field and object.
- [ ] Given two HubSpot fields mapped to one SparrowCRM field, then both rows show a duplicate-mapping error and continue is blocked. Copy identical to [[Import_v1]].
- [ ] Fields created here carry the run ID, so revert removes them.

**P 0-4 · Users: four-case resolution with seat accounting** Every HubSpot user resolves across _exists in SparrowCRM_ × _active in HubSpot_.

- [ ] Given an active user with no SparrowCRM account, then the default is **invite** (consuming a seat), with an explicit skip that requires choosing who inherits their records.
- [ ] Given a deactivated user who owns records, then two exits exist: reassign the records, or import as a **deactivated owner** that cannot log in and **consumes no seat**.
- [ ] Given invites exceeding available seats, then the shortfall is stated before commitment, with the deactivated-user count offered as the resolution.
- [ ] Users sorted by records-owned descending, so reading only the first rows still surfaces the decisions that matter.
- [ ] Deactivated owners are fetched with `archived=true` — otherwise HubSpot omits them and their records arrive ownerless.

**P 0-5 · Pipelines and stages with Won/Lost semantics preserved**

- [ ] Given an unmapped stage holding deals, then it blocks with the deal count and a create-stage action.
- [ ] Given a HubSpot Won stage mapped to a non-won SparrowCRM stage, then a **non-blocking warning** states the total deal value leaving the forecast and requires explicit acknowledgement.

**P 0-6 · Validate: 100% pre-flight check, gating Migrate** Every record and activity read and run through **real SparrowCRM validation**, read-only, before Migrate unlocks. This replaces Configure's Review step and there is **no test run, no simulation, and no sample import**.

- [ ] The error list is **complete, not sampled** — "exactly 3" means all N were checked.
- [ ] The screen is a single table (object · count · check result) plus per-record drill-down **capped at 5 records**; beyond that the count stands alone until Results.
- [ ] **No loading screen and no progress bar.** The check runs in the background from the moment Configure completes; unfinished rows read "checking…" in the result column. Progress bars appear only in Migrate, where they truthfully mean data is moving.
- [ ] Given the same error affecting more than 5% of an object, then Migrate is **hard-locked** with one diagnosis card rather than a list — thousands of identical errors are one configuration mistake.
- [ ] Nothing is written. Re-checking is free and unlimited.
- [ ] No downloads from this screen.

**P 0-7 · No customer values rendered, anywhere** The migration UI displays **zero customer field values** — not in Configure, not in Validate, not in errors, not in exports, not in verification. Records are identified by object + ID with deep links; comparisons run server-side and render verdicts (`match` / `differs` / `N = N`).

- [ ] Given an error on a record, then the row shows object, HubSpot ID (deep link), failing field and cause — no name, email, or value.
- [ ] Given the formula and spot-check verification screens, then they render verdicts only, never computed values.
- [ ] Given `errors.zip`, then no CSV column contains a field value.
- [ ] Counts, field names, types and fill rates are permitted; anything a customer typed is not.

**P 0-8 · Idempotent write pipeline with source ID on every item** ⚠️ _architecture — P 0 even though the features it enables ship later_ Every migrated record, activity, file and field stores its HubSpot ID plus the run ID. All writes are upserts keyed on that ID.

- [ ] Re-running any task creates zero duplicates.
- [ ] This is the single foundation under catch-up sync (P 0-12), revert (P 0-13), retry (P 0-11) and delta detection. **Skipping it makes all four impossible and cannot be retrofitted without a data migration** — hence P 0 regardless of feature phasing.

**P 0-9 · Fourteen-task run in dependency order, checkpointed** Attributes → Formulas → Users → Pipelines → Companies → Contacts → Deals → Relationships → Notes → Calls → Emails → Meetings → Tasks → Files.

- [ ] Per-task status, counts and retry. Relationships is its own task and runs after records, because HubSpot does not return associations on batch reads.
- [ ] Any interruption resumes from checkpoint; nothing restarts from zero.
- [ ] Pause, resume, cancel-all and per-task cancel. Cancelling marks dependents **Skipped — dependency cancelled** and never rolls back completed work.
- [ ] Runs server-side; the user may close the page and is emailed on completion.

**P 0-10 · Blast-radius suppression during the run**

- [ ] Workflows suppressed (a 100 k-record migration would otherwise fire ~190,000 triggers).
- [ ] Activity notifications suppressed (312,004 alerts otherwise).
- [ ] Both stated in the run confirmation with their counts, and both restored after.

**P 0-11 · Resilience: throttle transparency and circuit breaker**

- [ ] HubSpot's public-app cap (~110 requests / 10 s, not raisable) is respected; throttling is shown as a state, not a hang.
- [ ] Given the same error exceeding 5% or 5,000 records mid-run, then the run **pauses itself**, states the cause, and offers resume-after-fix rather than continuing.
- [ ] `423 Locked` retried after 2 s; 429 s backed off.

**P 0-12 · Reconciliation and error reporting in Results**

- [ ] Per object: Selected / Created / **Excluded** / Failed / variance. **Excluded and Failed are never summed** — a user who skipped 60 fields still sees a clean run, because that is the truth.
- [ ] `errors.zip` — one CSV per object, every row: object, HubSpot ID (as URL), failing field, error cause. Never values. **This download exists only here, after the migration.**
- [ ] Retry acts on failed records only.
- [ ] The failure list matches Validate's error list exactly; anything new is a defect.

**P 0-13 · Catch-up sync and revert**

- [ ] One-shot catch-up brings new and changed HubSpot items across without duplicating, with an on-by-default toggle protecting records edited in SparrowCRM since.
- [ ] Revert removes exactly what the run created, identified by HubSpot ID + run ID, within 30 days; requires typed confirmation; **never deletes user accounts** (deactivates) and never touches team-created or team-edited records; reports anything it could not remove, with the reason.

**P 0-14 · Formula-field capability spike** ⚠️ _investigation as a P 0 requirement — its output determines scope and estimate_

- [ ] 1-day spike answering: does `GET /properties` return `calculationFormula` for UI-created calculated properties, or only for API-created ones?
- [ ] Deliverable: a written answer plus the resulting scope decision. **If unavailable, formula translation is cut from v 1** and replaced with a deep-linked inventory — a materially smaller build.
- [ ] Known already and not in question: rollups are not exposed (permanently out, §4); time-based and AI-generated calculations behave as equations; **a computed value is never migrated as a static number.**

### P 1 — Nice to have. Core use case works without them.

- **P 1-1 · Formula translation with a verification screen.** Translate readable HubSpot equations into SparrowCRM formulas; verify by recomputing on the same records and reporting verdicts. Gated on P 0-14. Reason for P 1: the customer can rebuild ~38 formulas by hand; painful, not blocking.
- **P 1-2 · Record view** — every migrated item as a SparrowCRM ↔ HubSpot ID pair with deep links both ways. Adopted from Smart Transfer; strong trust artifact, not required to succeed.
- **P 1-3 · Spot-check tool** — 20 random records compared server-side across fields, links, activity counts, attachments and formulas, reported as verdicts.
- **P 1-4 · Fill-rate display and low-fill collapsing** — fields under 10% fill collapse behind one row with _Show them_ / _Skip all_. Makes skipping dead columns fast; the skip capability itself is P 0.
- **P 1-5 · Activity date cutoff** — "only activities from the last N months," with the excluded count shown. Meaningfully shortens the longest phase of the run.
- **P 1-6 · Workflow rebuild summary** — a download listing what the customer will need to recreate.
- **P 1-7 · Migration history** with per-run reports, kept permanently.

### P 2 — Out of scope for v 1; design must not preclude them.

- **P 2-1 · Custom objects** — consumes [[Custom Objects_v1]]'s association model. _Design constraint now:_ the object registry, mapping UI and task pipeline must be data-driven over an object list, never hard-coded to Company/Contact/Deal.
- **P 2-2 · Additional connectors** (Salesforce, Pipedrive, Zoho). _Design constraint now:_ validation, reconciliation, revert and the run engine must be source-agnostic; only the fetch-and-normalise layer is HubSpot-specific.
- **P 2-3 · Import 2 or similar as a long-tail fallback** for objects we don't cover. Recommended in the buy-vs-build memo as Option C; revisit if a customer needs an object outside our roadmap.
- **P 2-4 · Multi-company contacts** beyond primary. v 1 links the primary company and reports the remainder as skipped with a count. _Design constraint now:_ the association store must be many-to-many even though v 1 writes one.
- **P 2-5 · HubSpot Leads object.** Newer object; treatment undecided (see §8). Must not be silently dropped — if excluded, it appears in "what won't come across" with its count.

---

## 7. Success Metrics

**This feature launches with zero users.** Adoption metrics are meaningless on day one, so per the template the release condition is a concrete first-use gate, not a percentage.

### Release gates — pass/fail, not targets

We do not ship until all of these are true. Expressing them as percentages would imply that missing them is acceptable.

|Gate|Condition|Why a gate and not a metric|
|---|---|---|
|**G 1 dogfooding**|SurveySparrow's own sales team is fully migrated and working in SparrowCRM, with HubSpot read-only|The only honest substitute for adoption data on a zero-user feature|
|**Zero writes to HubSpot**|Verified against the live authorization scopes and a request audit of a full run|Irreversible if wrong: we would have altered a customer's system of record|
|**Reconciliation balances**|On every test run: Selected = Created + Excluded + Failed, per object, no unexplained variance|Silent partial success is the failure mode that gets trusted and built upon|
|**No post-run surprises**|Post-migration failure list is identical to the pre-migration error list|The core promise of Validate. A discrepancy means the validation is not what we claimed|
|**Revert restores**|A full migration reverts to the pre-migration state, provably, leaving team-created and team-edited records untouched|Reversibility is what makes the whole operation safe to attempt|
|**Zero customer values rendered**|Audit of every screen and every export column|Irreversible: data shown cannot be unshown. Also a claim we will make in sales|

### Leading indicators — first 30–90 days, once external customers exist

|Metric|Success|Stretch|Method / window|
|---|---|---|---|
|Migration completion rate|80% of started migrations reach Results|95%|Run records; per migration|
|Self-serve rate|90% complete with zero support tickets and zero internal escalations|100%|Support tickets tagged `migration`; first 10 migrations|
|Decisions required on a clean portal|Zero — the default path is read-not-filled|—|Instrumented input events in Configure; per migration|
|Failure rate per run|<0.1% of selected records fail|0%|Reconciliation table; per migration|
|Time to first migration|Connect → Proceed to migrate in under 30 min of human time|15 min|Timestamps between step transitions|
|**Created vs used**|Migrated records are _opened and edited_ by reps within 14 days of cutover, not merely present|—|Record activity on migrated IDs. Distinguishes output from outcome|

### Lagging indicators — one to two quarters

|Metric|Method|
|---|---|
|Win-rate change in HubSpot-sourced opportunities|CRM opportunity source vs outcome, cohort-compared pre/post launch|
|Migration named in won-deal notes|Verbatim search, quarterly|
|Retention of migrated accounts vs non-migrated|Cohort retention at 90 days|
|Revert rate|Reverts ÷ completed migrations. **A rising revert rate is the strongest possible signal that Validate is lying**|

### Counter-metrics — what must not get worse

- **SparrowCRM performance for everyone else during a migration.** p 95 API latency and UI responsiveness for tenants while a 100 k-record migration runs. A migration must not degrade the product for other users.
- ** [[Import_v1]] unaffected.** Its completion and error rates must not move; we are reusing its mapping surface and must not regress it.
- **No billing or seat surprises.** Zero cases of a migration silently consuming seats or crossing a plan limit without the user having been told beforehand.
- **Support load overall.** Migration must not displace effort into a new category of ticket ("where did my formula go?").

---

## 8. Open Questions

**The blocker rule applied:** it blocks if getting it wrong forces a data migration or another team's rework. It does not block if getting it wrong forces only a UI change.

### Blocking — answer before build

|#|Question|Owner|Why it blocks|
|---|---|---|---|
|B 1|Does HubSpot's `GET /properties` return `calculationFormula` for **UI-created** calculated properties, or only API-created ones?|Engineering (P 0-14 spike)|Determines whether formula translation exists in v 1 at all. Changes scope and estimate materially|
|B 2|What is SparrowCRM's formula language — exact function list, operators, type coercion rules?|SparrowCRM platform team|Without it, "translate their formulas into ours" is unestimatable. Cannot be discovered by inspection|
|B 3|Are SparrowCRM formula fields plan-gated, and if so how does migration behave on a plan without them?|Product + Billing|Provisioning behaviour; getting it wrong strands data or over-grants entitlement|
|B 4|Exact storage shape for the HubSpot ID + run ID on every migrated item (column, index, uniqueness constraint)|Engineering + platform|Schema. Retrofitting is a data migration, and every reversibility feature depends on it|
|B 5|Multi-company contacts: does SparrowCRM's association model support many-to-many now, or does v 1 write primary-only into a one-to-many store?|Platform + [[Custom Objects_v1]] owner (R-P 0-5)|Cross-team dependency on a data model owned elsewhere. Choosing wrong forces rework in both modules|
|B 6|HubSpot **Leads**: in v 1, deferred, or not applicable?|Product (Divi)|Object-level scope. If included it needs a fetch path and a task; if not, it needs a line in "what won't come across" and a count|
|B 7|Is there a per-pipeline stage limit in SparrowCRM, and what happens to a HubSpot pipeline that exceeds it?|Platform|A hard limit discovered during a run is a mid-migration failure with no good exit|

### Non-blocking — resolve during implementation

|#|Question|Owner|
|---|---|---|
|N 1|Where the HubSpot ID surfaces on a record page for end users (or whether it does at all)|Design|
|N 2|Exact drill-down cap (currently 5 records) and CSV row limits|Design + Engineering|
|N 3|Spot-check sample size (currently 20) and whether it is stratified or random|Product|
|N 4|Copy for every "what won't come across" line, and whether it ships as a downloadable PDF|Design + Content|
|N 5|Whether `errors.zip` is emailed alongside the completion notification or download-only|Engineering|
|N 6|Migration-history retention and report format|Product|

### Inherited, still open

Preserved rather than deleted, per the template — these record what we were uncertain about earlier and may already be answerable:

|#|Question|Status|
|---|---|---|
|I 1|What "8 formula fields" referred to in the 5 Aug review — the portal's formula count, or SparrowCRM's supported function list?|Still unanswered; asked twice. Relates to B 2|
|I 2|Whether JTBD for Configure, Validate, Migrate, Results are locked or still proposals|Connect is **locked** (4 Aug). The rest are drafted against the final flow and awaiting Divi's trim, the way Connect's four were trimmed|
|I 3|Whether the spec is pushed into the vault at `1 - Projects/Sparrowcrm/5 - Features/Integrations-CRM/` |Offered several times, never confirmed|

---

## 9. Timeline Considerations

**Sequence is the deliverable here, not the dates.** Two plans with the same contents and different orderings have different risk profiles.

### Before estimation

1. **B 1 spike** (1 day) — the `calculationFormula` question. Its answer moves formula translation in or out of v 1.
2. **B 2 + B 4** — SparrowCRM's formula language and the source-ID schema. Both are inputs from other owners, both block build.
3. **Evidence pass on falsifiable claim 1** — the lost-deal search. Cheap, and it can re-scope everything downstream. **Should start immediately; it is a search, not a study.**

### Before build

4. **Own-portal audit.** SurveySparrow's HubSpot instance is the reference portal for G 1 _and_ the cheapest requirements source we have. Count what is actually in it — objects, property types, formula types, activity volumes, file sizes, deactivated owners. **This audit's output is a requirements document.** It also prevents the parity trap: "migrate everything HubSpot has" is unbounded, "migrate everything _our_ portal has" is a finite list.
5. **Lock the object registry as data, not code** (P 2-1/P 2-2 design constraints) — before the first task is written, since it is the difference between adding a connector and rewriting one.

### Build sequence — foundations first, by dependency

6. **Idempotency + source-ID layer (P 0-8)** — before any task writes anything. Everything reversible depends on it.
7. **Attributes → Formulas → Users → Pipelines** — schema and identity before data. Nothing can be owned or staged until these exist.
8. **Companies → Contacts → Deals** — the records themselves.
9. **Relationships** — second pass, because HubSpot does not return associations on batch reads.
10. **Activities**, per type — the highest-volume phase.
11. **Files** — last and slowest; one file per upload, per-file signed URLs.
12. **Validate, Results, catch-up, revert** — these span the whole pipeline and cannot be finished before it exists, but their _contracts_ (what counts as Excluded vs Failed) must be fixed at step 6.

### Before launch

13. **G 1 migration of our own portal** — the release gate, not a test.
14. **Gate audit** (§7) — write-scope verification, reconciliation balance, no-values audit, revert proof.

### Notes on risk and cost

- **Keep reuse separate from redesign.** We are reusing [[Import_v1]]'s mapping language and error copy deliberately, so the two modules feel like one product. **Do not bundle improvements to Import_v 1's UI into this project** — if a shared component changes behaviour, any bug becomes unattributable across two features. Ship parity, file the improvements separately.
- **The cost curve is real on P 0-8.** Every sprint that ships a write path without the source ID on it is a sprint of code that has to be revisited, and the retrofit gets riskier as soon as any real customer data exists. This is the "bill grows every sprint" item.
- **No hard external deadline** is known. The internal one is G 1, which is currently blocked and has been for some time — that is the argument for sequencing this ahead of the second connector, not the reverse.
- **Cross-team dependencies:** B 2/B 3 on the platform team, B 5 on [[Custom Objects_v1]] (one-way — we consume their association model; they are not waiting on us).

---

## 10. Parking Lot

Good ideas, deliberately not in scope. Revisit at the next planning cycle, not during implementation.

- Migration dry-run against a HubSpot sandbox portal as a first-class rehearsal mode
- Bring HubSpot list membership across as SparrowCRM segments
- Migrate HubSpot email templates and snippets
- Import HubSpot's marketing-email engagement history onto contacts
- Deduplicate against records that already exist in SparrowCRM before the migration, not only within it
- Scheduled migrations — start the run at 2 am on the customer's timezone automatically
- Multi-portal merge: two HubSpot portals into one SparrowCRM workspace
- A shareable, read-only migration report link for the customer's stakeholders
- Migration cost/time estimator on the marketing site, driven by record counts the prospect types in
- Reverse migration (SparrowCRM → HubSpot) as an exit-guarantee talking point