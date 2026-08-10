---
owner: Divyaraj Murugan
feature: "[[Migration]]"
version: 1
status: Done
priority: High
tags:
---
# PRD — HubSpot → SparrowCRM Migration (v 1)

_SparrowCRM · Product Requirements Document_ _Status: **v 1 final** · Scope locked · Wireframe built · Rev. 10 Aug 2026_

**What this is.** The decision document for the CRM-to-CRM migration module. Screen-level acceptance criteria live in [[HubSpot_Migration_v1]]; buy-vs-build in `Migration_Buy_vs_Build_Decision.md`. This PRD supersedes the 6 Aug 2026 draft, which is retained in the vault as `Migration Hubspot_v 1` rather than overwritten.

**Companion build.** A clickable wireframe of the full flow ships in the repo at `/settings/migrate` (`src/pages/settings/migration/`). It is a UI prototype over static data — no HubSpot connection, no writes.

---

## 0. What changed from the 6 Aug draft

Four capabilities were cut after the draft was reviewed. They are recorded here rather than deleted, because each one removed a mitigation that the draft relied on elsewhere.

|Cut|Was|Consequence, and where it is now handled|
|---|---|---|
|**Catch-up sync**|P 0-13 — one-shot delta on switch-over day|The cutover model inverts. The team must **stop working in HubSpot before the run and stay stopped until it finishes**. Stated on the pre-run screen (§6, P 0-10)|
|**Revert**|P 0-13 — scoped by run ID, 30-day window|The draft's firing criterion _"it couldn't be undone"_ loses its answer. Replaced by a weaker but honest one: migrate into a workspace you are willing to discard (§2)|
|**Pause / resume**|P 0-9 — user-controlled|A started run is committed. The circuit breaker now **stops** rather than pauses, since there would be no resume control (§6, P 0-9)|
|**CSV upload as a source**|listed alongside the API connectors|Belongs to [[Import_v1]], whose spec scopes connectors out. Having it in both modules was the error|

Two capabilities were **added**:

- **Per-object exclusion filters** (§6, P 0-7) — generalised from the draft's P 1-5 activity date cutoff, and promoted to P 0. Trimming a decade of dead activity is the difference between a 4-hour run and a 12-hour one.
- **Disconnect on completion** (§6, P 0-1) — the portal is de-authorised the moment a run ends. No source ever shows a "connected" or "completed" state.

**What did not change:** every invariant. Read-only, Excluded ≠ Failed, zero customer values rendered, source ID on every item, Validate is 100% and not sampled.

### Finalisation decisions — 10 Aug 2026

Three questions were left hanging by the cuts. All three are now decided, which is what moves this document from _scope locked_ to _final_.

| Decision                  | Ruling                                                                                                                                                                              | Where it lands                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| **Cancel run**            | **There is deliberately no cancel control in v 1.** A started run completes or is stopped by the circuit breaker. Recorded as a decision, not left as an open consideration         | P 0-9, P 0-10, §4, P 2-6, §9      |
| **HubSpot Leads (B 6)**   | **Deferred to v 2.** Not migrated in v 1, and never silently dropped — it appears in "what won't come across" with its record count                                                 | §4, P 2-5, B 6 closed             |
| **Concurrent runs (B 8)** | **Permitted.** Two admins may start a HubSpot migration in the same workspace at once. No lock, no warning. Idempotency (P 0-8) protects correctness; the cost is shared throughput | P 0-9, P 0-11, P 0-12, B 8 closed |

**Still open: I 3, the vault push.** The migration family lives under `1 - Projects/Sparrowcrm/5 - Features/Migration/` — beside [[HubSpot_Migration_v1]] and the retained 6 Aug draft — not the `Integrations-CRM/` path I 3 assumed. That is the correct home for this file.

---

## 1. Problem Statement

A company that decides to move from HubSpot to SparrowCRM cannot bring the thing that makes its CRM valuable: the accumulated history around each customer. Records themselves can be exported and re-imported by hand; the relationships between them, the years of emails, calls, notes and meetings, the contracts attached to accounts, and the pipeline structure the forecast depends on, cannot. The company is therefore asked to either abandon that history, keep paying for HubSpot to retain read access to it, or fund weeks of manual reconstruction — so most of them simply stay.

**Who experiences it, and how often.** Every prospect whose CRM is HubSpot — the majority of the mid-market segment SparrowCRM sells into — hits this exactly once, at the point of decision, which is the worst possible moment. It is a one-time problem per customer and a permanent problem for us: it recurs in every deal. **SurveySparrow itself is in this position today** — our own sales team runs on HubSpot and cannot move onto SparrowCRM, which is why G 1 (internal dogfooding) is blocked.

**Cost of not solving it**, in order of confidence:

1. **We cannot dogfood.** Our own sales org stays on a competitor's product and every internal quality signal from daily use is unavailable. _Confirmed, first-hand._
2. **Switching cost sits in the deal as an unanswerable objection.** The prospect is not comparing features; they are comparing "your product" against "your product plus six weeks of my team's evenings." _Asserted — needs lost-deal evidence._
3. **Competitive risk.** Attio, Salesforce and Pipedrive all ship first-party CRM migration, so its absence reads as immaturity on an evaluation checklist. _Observed in teardown; not yet observed in our own losses._

### Why [[Import_v1]] is not enough

We already ship a CSV/Excel importer with field mapping, dedupe and error reporting. It is a good tool and it solves a different job. The gap is specific and countable:

|What the customer needs to move|Can Import_v 1 + HubSpot CSV export do it?|
|---|---|
|Companies, Contacts, Deals as flat records|**Yes** — this genuinely works today|
|The links between them|**No.** HubSpot's CSV export omits associations. Three unrelated spreadsheets and ~88,816 links to rebuild by hand|
|Emails, calls, notes, meetings, tasks|**No.** Activities are first-class objects associated by `associationTypeId`; no CSV path exports them attached|
|Files attached to records|**No.** Files need per-file signed URLs from the API|
|Pipelines, stages, Won/Lost semantics|**No.** Stage exports as a label string with no structure and no won/lost flag|
|Record ownership|**Partially.** Owner exports as an ID or email with no identity; deactivated owners are omitted unless `archived=true` |
|Formula field definitions|**No.** CSV carries the _computed value_ as a static number, which never recomputes and silently rots|

Import_v 1's own spec says so: _"This is NOT a CRM-to-CRM migration tool. Direct connectors to Salesforce, HubSpot, Pipedrive are a separate module."_ This is that module.

**The exact thing a customer cannot do today: arrive in SparrowCRM with a customer record that still has its history attached to it.**

### Evidence

|Source|Status|What it gives us|
|---|---|---|
|**SurveySparrow's own HubSpot portal** — live, >3 object types, G 1 blocked on it|✅ Confirmed|First-hand proof plus urgency. We are customer zero|
|** [[Import_v1]] spec** — connectors explicitly out of scope|✅ Confirmed|The gap is documented in our own product, not inferred|
|**HubSpot API capability audit**|✅ Confirmed|The gap is structural in HubSpot's export surface, not a workaround we missed|
|**Competitive teardown** — Attio, Smart Transfer, Import 2, Trujay, Zoho|✅ as design input · ⚠️ as evidence of _our_ customers' pain|Tells us category table stakes; does not prove our prospects care|
|**Lost-deal notes citing migration effort**|⚠️ To validate|Converts "prospects want this" into "we lost revenue over it". **Highest-value missing evidence**|
|**Interviews with 5 HubSpot-based prospects**|⚠️ To validate|Confirms whether history or records is the blocker|
|**Sales-call recordings, verbatim search**|⚠️ To validate|Zero-prep corroboration, available today|
|**Product analytics on the migration funnel**|❌ Not available|Feature does not exist. This is why §7 gates on dogfooding, not adoption|

**Borrowed-problem check.** The strongest evidence is our own instance — first-hand. The weakest is the teardown, which tells us what Attio built, not what our customers need. Claims 2 and 3 above rest on category lore and are flagged as such. **Neither is load-bearing for the dogfooding case, which stands alone.**

### Falsifiable claims

1. **Losses actually cite this.** _If zero do_ — the deal-blocker justification collapses and this becomes dogfooding + parity only.
2. **The pain is history, not records.** _If customers will abandon history_ — v 1 is massively over-scoped; activities and files are most of the build cost and nearly all the runtime.
3. **Buy does not suffice.** Import 2 and Trujay are insert-only and cannot upsert, so re-running duplicates everything. _If any ships true upsert keyed on source ID, revisit immediately._
4. **Formula translation is needed.** _If customers will rebuild ~38 formulas by hand_ — cut translation and remove the hardest engineering risk from v 1.
5. **Custom objects can wait.** _If a target customer's blocking data lives in HubSpot custom objects_ — v 1 ships unusable for them.
6. **The advanced case is not the common case.** _If most portals are messy_ — the error-resolution UI is the product, not a side path, and should be estimated as such.

---

## 2. Jobs To Be Done

> **When** I have decided to move my company from HubSpot to SparrowCRM, **I want** every customer's full history to arrive intact and provably correct, **so I can** switch my team over on a Monday morning without anyone losing the context they sell with.

**Functional.** Get companies, contacts, deals, their link graph, their entire activity history, their attached files, the pipeline structure and the people who own the records out of one system and into another — once, completely, without hand-work, and without breaking the source.

**Emotional.** Confident rather than reckless. This admin is making an irreversible-feeling decision on behalf of a whole team, on data they are personally accountable for. Anxiety at the start, relief at the end — and never the specific dread of _"I think it worked but I can't tell."_

**Social.** To be the admin who moved the company without an incident, and to have an artifact to show for it. They will be asked "did everything come across?" and need to answer with a number rather than a feeling.

### Hiring criteria

- No manual work, no CSV shuffling, no third-party vendor to procure and security-review
- It brings the history — the part no export can carry
- It can be proven correct before committing
- It never writes to HubSpot, so the fallback position stays intact
- Configuration arrives already done; a clean portal requires zero decisions

### Firing criteria

|Firing criterion|Mitigated by|
|---|---|
|"It wrote to / changed my HubSpot"|P 0-1: read-only OAuth, zero write scopes, shown on the consent screen|
|"It silently dropped data and I found out weeks later"|P 0-11: reconciliation where Excluded ≠ Failed; 100% pre-flight; per-record error reporting|
|"I ran it twice and now everything is duplicated"|P 0-8: HubSpot ID on every item; all writes are upserts|
|"It showed my customers' data to people who shouldn't see it"|P 0-6: **no customer field values rendered anywhere** — UI or export|
|"It made me map 455 fields by hand"|P 0-3: four-tier auto-mapping; new fields pre-filled; **any field skippable**|
|"It flooded my team with 300,000 notifications"|P 0-10: workflow and notification suppression during the run|
|"My forecast changed after the move"|P 0-5: Won/Lost preserved; Won→non-won raises a value-weighted warning|
|"It ran for six hours and then died"|P 0-9: per-task checkpointing, resume-not-restart, circuit breaker|
|⚠️ **"It couldn't be undone"**|**Not mitigated, by decision.** Revert is cut from v 1. The honest answer is: migrate into a workspace you are willing to discard, and keep HubSpot read-only until you have accepted the result. This must be said in the product, not just here|
|⚠️ **"I started it and couldn't stop it"**|**Not mitigated, by decision (10 Aug).** See P 0-9. The mitigation sits upstream instead: Validate is 100% and free to re-run, so the commitment point is the Start button and nothing after it|

---

## 3. Goals

1. **A ~100 k-record portal migrates end to end, self-serve**, with no CS or SE involvement and no engineering intervention. _Success: zero support tickets and zero internal escalations on the first three migrations._
2. **The customer can prove correctness.** _Success: reconciliation balances per object (Selected = Created + Excluded + Failed) on every run, and the pre-flight error count matches the post-run failure count exactly._
3. **Switching cost stops being an unanswerable objection** in HubSpot-sourced deals. _Success: sales can demo the flow and state a duration band._
4. **SurveySparrow's own sales team is off HubSpot (G 1).** _Success: binary. It is the release gate._
5. **The connector framework is reusable.** _Success: the second connector's build cost is materially lower than the first's._

---

## 4. Non-Goals

### Deferred — wanted, not now

|Non-goal|Why out of v 1|
|---|---|
|**Catch-up sync**|Cut after review. v 1 requires a frozen source during the run. A delta pass needs conflict-resolution policy we have not designed. **P 0-8 keeps it possible later**|
|**Revert**|Cut after review. Everything it needs (source ID + run ID on every item) is still built, so it remains a later feature rather than a rewrite|
|**Pause / resume**|Cut after review. A started run goes to completion or is stopped by the circuit breaker|
|**Cancel run**|**Decided against for v 1, 10 Aug.** Not an oversight, and not a gap to be filled late in the build — see P 0-9. A stop-and-leave-in-place cancel is the natural v 2 shape, since it reuses the circuit breaker's stop path|
|**HubSpot Leads**|**Deferred to v 2, 10 Aug (B 6 closed).** Needs its own fetch path and task, and the object is newer than the history that blocks us. v 1 must surface it in "what won't come across" with its count (P 2-5)|
|**Custom objects**|Blocked on [[Custom Objects_v1]]. The dependency is **one-way** — Migration v 2 waits on them; they do not wait on us|
|**Salesforce, Pipedrive, Zoho connectors**|Same framework, different API surface. Sequenced after HubSpot so the framework is proven once before being generalised|
|**Workflows, sequences, automation**|Automation _configuration_, not customer data. v 1 provides a rebuild summary|
|**Scheduled or recurring sync**|Implies conflict-resolution policy we have not designed|
|**Two-way sync**|This is a migration, not an integration. The intended end state is that the customer _leaves_ HubSpot|

### Not applicable — permanently out

|Non-goal|Why it will never come|
|---|---|
|**Any write to HubSpot**|A design principle, not a scope decision. Zero write scopes are requested. The source system's integrity is what makes the operation safe to attempt|
|**CSV / spreadsheet import**| [[Import_v1]]'s job. Two modules offering it is a product error, not a feature|
|**Call recording audio**|HubSpot hosts and serves them; copying buys the customer nothing and costs GBs. Links are kept on each Call record|
|**Field-level change history**|HubSpot does not expose historical property values for bulk export. Keep the HubSpot account read-only if that trail is needed|
|**Cross-object rollup formulas**|**HubSpot does not expose rollup definitions via API** (confirmed). We cannot read what we would have to translate. Genuinely impossible, not merely descoped|

---

## 5. Screens

**15 screens across 5 phases.** Build status is against the wireframe in the repo.

```
HubSpot ──read-only──▶ Connect → Configure → Validate → Migrate → Results
                       └─ re-runnable, nothing written ─┘        │
                                    ▲                            ▼
                    run active? land here, not on home     disconnect + history
```

| #   | Screen                                                                   | Pri         | Built              |
| --- | ------------------------------------------------------------------------ | ----------- | ------------------ |
| 1   | Source catalogue — sources with no state; every one always startable     | P 0         | ✅                  |
| 2   | Connect — scopes shown, non-admin share-link branch, portal confirmation | P 0         | ✅                  |
| 3   | ⧉ HubSpot admin approval — external, no SparrowCRM account               | P 0         | ⬜ link target only |
| 4   | Configure · Objects — counts, dependencies, status                       | P 0         | ✅                  |
| 5   | Configure · Fields — auto-map, pre-filled create, skip                   | P 0         | ✅                  |
| 6   | Configure · Users — four-case resolution, seat accounting                | P 0         | ✅                  |
| 7   | Configure · Pipelines — Won/Lost semantics                               | P 0         | ✅                  |
| 8   | Configure · Formulas                                                     | P 1         | ⬜ gated on B 1     |
| 9   | Validate — counts + exclusion filters                                    | P 0         | ✅                  |
| 10  | Migrate — 14-task run; **the top screen while a run is active**          | P 0         | ✅                  |
| 11  | Results — reconciliation, per-object downloads, retry                    | P 0         | ✅                  |
| 12  | Record view — ID pairs, deep links both ways                             | P 1         | ⬜                  |
| 13  | Spot-check — 20 records, verdicts only                                   | P 1         | ⬜                  |
| 14  | Formula verification                                                     | P 1         | ⬜                  |
| 15  | Migration history + per-run report                                       | P 1→**P 0** | ✅                  |

Migration history was P 1 in the draft. **It is P 0 now**: with the portal disconnected on completion and no revert, it is the only durable record that a migration happened.

Modals: run confirmation (blast radius), create-all / skip-all fields, field type-conflict resolver, seat shortfall, Won→non-won acknowledgement.

---

## 6. Requirements

### P 0 — cannot ship without

**P 0-1 · Read-only OAuth, portal confirmation, disconnect on completion** Two-click OAuth via HubSpot's own account picker. Zero write scopes. Portal identity (name, Hub ID, tier) confirmed back after connecting.

- [ ] Not a single write scope appears on the consent screen. Verified against the **live authorization URL**, not by reading our code.
- [ ] A non-Super-Admin sees the requirement _before_ the OAuth jump, plus a shareable 7-day link.
- [ ] A declined scope reports its data class as **Excluded** with a count — never as Failed.
- [ ] A portal already connected elsewhere is blocked with the reason and two exits.
- [ ] **The portal is de-authorised when the run ends.** No source shows a connected or completed state; starting again means connecting again.

**P 0-2 · Objects selection with dependency enforcement**

- [ ] Deals selected without Pipelines blocks, naming the count of deals that would arrive stageless, with a one-click fix.
- [ ] Deselecting Companies marks dependents _Blocked — needs Companies_ with the number of links that would drop (~88,816 in a mid-size portal).
- [ ] Relationships and file attachments never appear as rows — they migrate with their records.
- [ ] A clean portal reads **Ready to migrate** on every row and requires no input.

**P 0-3 · Field mapping — auto-map, create, or skip** Four-tier auto-mapping: curated table → exact label → normalised → synonym.

- [ ] An unmatched field's definition is **pre-filled** — name from the label, type from `type` + `fieldType`, dropdown options carried across with **unused options unticked** — and creatable one at a time, in one click.
- [ ] **Create all** and **Skip all** act on every pending new field.
- [ ] A skipped field reports as **Excluded** downstream, never as an error.
- [ ] A required SparrowCRM field with nothing mapped blocks, naming the field and object.
- [ ] Two HubSpot fields mapped to one SparrowCRM field blocks both rows. Copy identical to [[Import_v1]].
- [ ] Fields created here carry the run ID.

**P 0-4 · Users: four-case resolution with seat accounting**

- [ ] Active user with no account → default **invite** (consumes a seat); explicit skip requires choosing who inherits their records.
- [ ] Deactivated user owning records → reassign, or import as a **deactivated owner** that cannot log in and **consumes no seat**.
- [ ] Invites exceeding seats states the shortfall before commitment and offers the deactivated-owner route.
- [ ] Sorted by records owned descending, so reading only the top rows surfaces the decisions that matter.
- [ ] Deactivated owners fetched with `archived=true`, or HubSpot omits them and their records arrive ownerless.

**P 0-5 · Pipelines and stages, Won/Lost preserved**

- [ ] An unmapped stage holding deals blocks, with the deal count and a create-stage action.
- [ ] A HubSpot Won stage mapped to a non-won stage raises a **non-blocking warning** stating the deal value leaving the forecast, requiring explicit acknowledgement.

**P 0-6 · No customer values rendered, anywhere** Zero customer field values in Configure, Validate, errors, exports or verification. Records are identified by object + ID with deep links; comparisons run server-side and render verdicts.

- [ ] An error row shows object, HubSpot ID (deep link), failing field and cause — no name, email or value.
- [ ] No export column contains a field value. This includes the per-object record maps (P 0-11).
- [ ] Counts, field names, types and fill rates are permitted; anything a customer typed is not.

**P 0-7 · Validate: 100% pre-flight, with exclusion filters** Every record and activity read and run through **real SparrowCRM validation**, read-only, before Migrate unlocks. No test run, no simulation, no sample.

- [ ] The check is **complete, not sampled**.
- [ ] **No progress bar.** The check runs from the moment Configure completes; unfinished rows read "checking…". Progress bars appear only in Migrate, where they mean data is moving.
- [ ] The screen shows **record count and object count** only, and a table of object · records · filter · will-migrate.
- [ ] **Per-object exclusion filters.** Presets scoped to the object type — date windows for activities, creation windows and "has an open deal" for records; structure objects are not filterable. Plus a **custom filter**: field · operator · value conditions ANDed together.
- [ ] Filter counts are **server-side and exact**, never estimated. Validate's whole promise is that its numbers are real, and a custom filter is exactly where an estimate would break it.
- [ ] Excluded records report as **Excluded**, never as failures, and remain in HubSpot.
- [ ] The same error affecting >5% of an object **hard-locks** Migrate with one diagnosis rather than a list — thousands of identical errors are one configuration mistake.
- [ ] Nothing is written. Re-checking is free and unlimited. No downloads from this screen.
- [ ] ⚠️ **This screen now carries the whole safety guarantee.** With no pause, no cancel, no revert and no catch-up, everything reversible happens before Start. Re-running Validate must stay free, unlimited, and fast enough that nobody is tempted to skip it.

**P 0-8 · Idempotent write pipeline with source ID on every item** ⚠️ _Architecture. P 0 even though two of the features it enabled are now cut._

Every migrated record, activity, file and field stores its HubSpot ID plus the run ID. All writes are upserts keyed on that ID.

- [ ] Re-running any task creates zero duplicates.
- [ ] **Retry (P 0-11), idempotency and concurrent-run safety all depend on this**, and catch-up and revert become possible later rather than requiring a rewrite. It **cannot be retrofitted without a data migration** — so it stays P 0 regardless of what shipped around it.

**P 0-9 · Fourteen-task run in dependency order, checkpointed** Attributes → Formulas → Users → Pipelines → Companies → Contacts → Deals → **Relationships** → Notes → Calls → Emails → Meetings → Tasks → Files.

- [ ] Relationships is its own task after records, because HubSpot does not return associations on batch reads.
- [ ] Any interruption resumes from checkpoint; nothing restarts from zero.
- [ ] Runs server-side; the user may close the page and is emailed on completion.
- [ ] **The run screen is the top screen whenever a run is active** — navigating to the migration surface lands there, not on the catalogue.
- [ ] **No pause, no resume, and no cancel.** _Decided 10 Aug._ A started run completes or is stopped by the circuit breaker (P 0-11). This is an explicit decision rather than an omission: the run confirmation must therefore read as the point of commitment, and Validate (P 0-7) carries the safety guarantee that the run itself does not.
- [ ] **Concurrent runs are permitted.** _Decided 10 Aug (B 8 closed)._ Two admins may start a HubSpot migration in the same workspace at the same time. No lock and no warning in v 1 — idempotency (P 0-8) means the outcome is still correct. The consequence is throughput, not correctness: see P 0-11.

**P 0-10 · Blast-radius suppression and the frozen-source warning**

- [ ] Workflows suppressed (~190,000 triggers otherwise) and restored after.
- [ ] Activity notifications suppressed (312,004 otherwise) and restored after.
- [ ] Both stated with their counts in the run confirmation.
- [ ] ⚠️ **The confirmation states that there is no catch-up sync** — anything changed in HubSpot after this point will not come across, so work there must stop until the run finishes. Users must read this before starting, not discover it at cutover.
- [ ] ⚠️ **The confirmation states that the run cannot be paused or cancelled once started.** This is the one screen where that fact is still actionable.

**P 0-11 · Resilience, reconciliation and error reporting**

- [ ] HubSpot's public-app cap (~110 req / 10 s, not raisable) respected; throttling shown as a state, not a hang. `423` retried after 2 s; `429` backed off.
- [ ] **Two concurrent runs share that single cap**, so both slow roughly proportionally. Throttling must therefore read as a normal, explained state and never as a stall — and any duration band quoted to the user is for a single run.
- [ ] The same error exceeding 5% or 5,000 records mid-run **stops** the run and states the cause. It does not pause, because there is no resume control.
- [ ] Results shows per object: Selected / Created / **Excluded** / Failed / variance. **Excluded and Failed are never summed** — a user who skipped 60 fields still sees a clean run, because that is the truth.
- [ ] `errors.zip` — one CSV per object: object, HubSpot ID as URL, failing field, cause. Never values.
- [ ] **Per-object record-map download** — `hubspot_id`, `sparrowcrm_id`, `outcome`, and cause where failed. Enough to reconcile against HubSpot record by record. No field values.
- [ ] Retry acts on failed records only.
- [ ] The failure count matches Validate's error count exactly; anything new is a defect.

**P 0-12 · Migration history** Promoted from P 1. With no persistent connection and no revert, this is the only durable record.

- [ ] Every run kept permanently: run ID, source, who started it, when, duration, created, excluded, failed, status.
- [ ] Per-run report with the full reconciliation table and its downloads.
- [ ] States that the source was disconnected when the run finished.
- [ ] **Concurrent runs appear as separate rows with distinct run IDs and distinct starters.** With no lock in place, history is the only way to see afterwards that two runs overlapped.

**P 0-13 · Formula-field capability spike** ⚠️ _Investigation as a requirement — its output determines scope and estimate._

- [ ] 1-day spike: does `GET /properties` return `calculationFormula` for **UI-created** calculated properties, or only API-created ones?
- [ ] **If unavailable, formula translation is cut from v 1** and replaced with a deep-linked inventory — a materially smaller build, and screens 8 and 14 disappear.
- [ ] Not in question: rollups are not exposed (§4); a computed value is never migrated as a static number.

### P 1 — core use case works without them

- **P 1-1 · Formula translation with verification.** Gated on P 0-13.
- **P 1-2 · Record view** — every item as a SparrowCRM ↔ HubSpot ID pair, deep-linked both ways.
- **P 1-3 · Spot-check** — 20 random records compared server-side, reported as verdicts.
- **P 1-4 · Fill-rate collapsing** — fields under 10% fill collapse behind one row. The fill figure itself already ships; the collapsing does not.
- **P 1-5 · Workflow rebuild summary** — a download listing what must be recreated by hand.

### P 2 — out of scope; design must not preclude

- **P 2-1 · Custom objects.** _Design constraint now:_ the object registry, mapping UI and task pipeline must be data-driven over an object list, never hard-coded to Company/Contact/Deal.
- **P 2-2 · Additional connectors.** _Design constraint now:_ validation, reconciliation and the run engine must be source-agnostic; only fetch-and-normalise is HubSpot-specific.
- **P 2-3 · Catch-up sync and revert.** Both cut from v 1 but both kept possible by P 0-8.
- **P 2-4 · Multi-company contacts** beyond primary. _Design constraint now:_ the association store must be many-to-many even though v 1 writes one.
- **P 2-5 · HubSpot Leads.** **Deferred to v 2** (decided 10 Aug). _Requirement on v 1:_ Leads appears in "what won't come across" with its record count, so nobody discovers the omission after cutover. _Design constraint now:_ it must enter as a row in the data-driven object registry (P 2-1), not as a new code path.
- **P 2-6 · Cancel run.** Deliberately absent from v 1 (P 0-9). _Design constraint now:_ the circuit breaker's stop path should be a callable operation, not a branch buried inside error handling — so a user-triggered cancel later is a new caller rather than a rewrite.

---

## 7. Success Metrics

**This feature launches with zero users.** The release condition is a first-use gate, not a percentage.

### Release gates — pass/fail

Five, down from six: the revert gate goes with the feature.

|Gate|Condition|
|---|---|
|**G 1 dogfooding**|SurveySparrow's own sales team fully migrated and working in SparrowCRM, HubSpot read-only|
|**Zero writes to HubSpot**|Verified against live authorization scopes **and** a request audit of a full run|
|**Reconciliation balances**|Selected = Created + Excluded + Failed, per object, no unexplained variance|
|**No post-run surprises**|Post-run failure count identical to the pre-flight error count|
|**Zero customer values rendered**|Audit of every screen and every export column, including the per-object record maps|

### Leading indicators — first 30–90 days

|Metric|Success|Stretch|
|---|---|---|
|Migration completion rate|80% of started runs reach Results|95%|
|Self-serve rate|90% complete with zero tickets and zero escalations|100%|
|Decisions required on a clean portal|Zero|—|
|Failure rate per run|<0.1% of selected records|0%|
|Time to first migration|Connect → Proceed in under 30 min of human time|15 min|
|**Created vs used**|Migrated records **opened and edited** by reps within 14 days of cutover|—|

The last one is the only leading metric that distinguishes output from outcome. Records that arrive and are never touched did not solve the problem.

### Lagging indicators

Win-rate change in HubSpot-sourced opportunities · migration named in won-deal notes · retention of migrated vs non-migrated accounts at 90 days.

> The draft tracked **revert rate** as "the strongest possible signal that Validate is lying." With revert cut, that signal is gone. The nearest replacement is **retry volume** and **support tickets within 14 days of a completed run** — weaker, and worth naming as a monitoring gap rather than pretending it is covered.

**Added by the no-cancel decision:** track **runs stopped by the circuit breaker** as a share of started runs. With no user-initiated cancel, the breaker is the only abort path in the product, which makes its firing rate a primary signal rather than an edge-case counter. A breaker rate above the failure-rate target means Validate let something through.

### Counter-metrics — what must not get worse

- **Tenant performance during a migration.** p 95 API latency and UI responsiveness for other tenants while a 100 k-record run executes. **Concurrent runs make this sharper, not softer** — the worst case is now two simultaneous runs, and that is the case to measure.
- ** [[Import_v1]] unaffected.** We reuse its mapping surface and must not regress it.
- **No billing or seat surprises.** Zero cases of a migration silently consuming seats.
- **Support load overall.** Must not displace effort into a new ticket category.

---

## 8. Open Questions

### Blocking — answer before build

|#|Question|Owner|
|---|---|---|
|B 1|Does `GET /properties` return `calculationFormula` for **UI-created** calculated properties?|Engineering (P 0-13 spike)|
|B 2|What is SparrowCRM's formula language — functions, operators, coercion rules?|Platform|
|B 3|Are formula fields plan-gated, and how does migration behave without them?|Product + Billing|
|B 4|Exact storage shape for HubSpot ID + run ID (column, index, uniqueness constraint)|Engineering + platform|
|B 5|Does the association model support many-to-many now, or does v 1 write primary-only?|Platform + [[Custom Objects_v1]] |
|B 7|Per-pipeline stage limit, and what happens to a pipeline that exceeds it?|Platform|
|B 9|**How are exclusion-filter counts computed server-side** for a custom multi-condition filter, within Validate's latency budget? P 0-7 requires exact, not estimated|Engineering|

**Seven blockers, and none of them are Product's.** B 1 and B 9 are engineering; B 2, B 5 and B 7 are platform; B 3 is platform plus billing; B 4 is both. Numbering keeps its gaps so that existing references stay valid.

### Closed — 10 Aug 2026

|#|Question|Ruling|
|---|---|---|
|B 6|HubSpot **Leads**: in v 1, deferred, or not applicable?|**Deferred to v 2.** Surfaced in "what won't come across" with its count. §4, P 2-5|
|B 8|What stops two admins starting a HubSpot migration at once?|**Nothing, by decision.** Concurrent runs permitted; correctness held by P 0-8; the cost is shared throughput. P 0-9, P 0-11, P 0-12|
|—|Is there a Cancel run control?|**No, by decision.** Recorded in P 0-9 rather than left as a §9 consideration. §4, P 2-6|

### Non-blocking

Where the HubSpot ID surfaces on a record page · CSV row limits · spot-check sample size and whether it is stratified · copy for every "what won't come across" line, Leads included · whether `errors.zip` is emailed or download-only · history retention and report format · how two overlapping runs are labelled in history so they stay legible after the fact.

### Inherited, still open

|#|Question|Status|
|---|---|---|
|I 1|What "8 formula fields" referred to in the 5 Aug review|Unanswered; asked twice. Relates to B 2|
|I 2|Whether JTBD for Configure, Validate, Migrate, Results are locked|Connect locked 4 Aug; the rest await a trim|
|I 3|Whether this PRD is pushed to the vault|Correct home identified: `1 - Projects/Sparrowcrm/5 - Features/Migration/`, beside [[HubSpot_Migration_v1]] and the retained 6 Aug draft. Push pending|

---

## 9. Timeline Considerations

**Sequence is the deliverable, not dates.** Two plans with the same contents and different orderings have different risk profiles.

### Before estimation

1. **B 1 spike** (1 day). Moves formula translation in or out of v 1.
2. **B 2 + B 4.** Both are inputs from other owners; both block build.
3. **Lost-deal search** (falsifiable claim 1). Cheap, and it can re-scope everything downstream. **Start immediately — it is a search, not a study.**

### Before build

4. **Own-portal audit.** Count what is actually in SurveySparrow's HubSpot — objects, property types, formula types, activity volumes, file sizes, deactivated owners, **and the Leads count, so v 1's "won't come across" line carries a real number**. **This audit's output is a requirements document**, and it prevents the parity trap: "migrate everything HubSpot has" is unbounded; "migrate everything _our_ portal has" is a finite list.
5. **Lock the object registry as data, not code** (P 2-1 / P 2-2) before the first task is written. It is the difference between adding a connector and rewriting one — and it is what makes Leads a v 2 row rather than a v 2 project.

### Build sequence — foundations first

6. **Idempotency + source-ID layer (P 0-8)** — before any task writes anything.
7. **Attributes → Formulas → Users → Pipelines** — schema and identity before data.
8. **Companies → Contacts → Deals.**
9. **Relationships** — second pass; HubSpot omits associations on batch reads.
10. **Activities** per type — the highest-volume phase.
11. **Files** — last and slowest; per-file signed URLs.
12. **Validate, Results, history** — these span the pipeline, but their _contracts_ (what counts as Excluded vs Failed) must be fixed at step 6.

### Before launch

13. **G 1 migration of our own portal** — the release gate, not a test.
14. **Gate audit** (§7) — write-scope verification, reconciliation balance, no-values audit.

### Notes on risk and cost

- **Keep reuse separate from redesign.** We reuse [[Import_v1]]'s mapping language and error copy deliberately. **Do not bundle improvements to Import_v 1's UI into this project** — if a shared component changes behaviour, any bug becomes unattributable across two features.
- **The cost curve is real on P 0-8.** Every sprint that ships a write path without the source ID is a sprint that has to be revisited, and the retrofit gets riskier the moment real customer data exists.
- **The v 1 cuts concentrate risk on Validate — and that is now a decision, not a side-effect.** With no pause, no cancel, no revert and no catch-up, a started run is fully committed; the only exits are completion and the circuit breaker. **Validate's correctness is the single load-bearing guarantee in the product.** Two consequences for the plan: the breaker is not an edge case and must be tested as a first-class path, and Validate is the last thing that should be compressed if the schedule tightens.
- **Concurrency is permitted, so it has to be exercised at least once.** Two overlapping runs against the same portal share one rate cap. This needs no feature work, but it does need a test — the failure mode is not corruption, it is a throttled run that looks hung.
- **No hard external deadline.** The internal one is G 1, which is blocked and has been for some time — that is the argument for sequencing this ahead of the second connector.

---

## 10. Parking Lot

Revisit at the next planning cycle, not during implementation.

- Dry-run against a HubSpot sandbox portal as a first-class rehearsal mode
- HubSpot list membership → SparrowCRM segments
- Email templates and snippets
- Marketing-email engagement history onto contacts
- Deduplicate against records that already exist in SparrowCRM, not only within the import
- Scheduled migrations — start at 2 am in the customer's timezone
- Multi-portal merge: two HubSpot portals into one workspace
- A shareable read-only migration report for the customer's stakeholders
- Migration cost/time estimator on the marketing site, driven by typed-in record counts
- Reverse migration (SparrowCRM → HubSpot) as an exit-guarantee talking point

---

_Code reference (wireframe): `src/pages/settings/MigrateCrm.tsx`, `src/pages/settings/migration/`._ _Supersedes: `Migration Hubspot_v 1` (6 Aug 2026 draft), retained._ _Build document: [[HubSpot_Migration_v1]]._