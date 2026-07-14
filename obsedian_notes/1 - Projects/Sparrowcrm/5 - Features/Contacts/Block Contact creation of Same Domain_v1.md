---
feature:
version: 1
status: Done
priority: Medium
tags:
  - sparrowcrm/settings/contact_creation_block/v1
---
## 1. Problem Statement

When a sales rep connects their mailbox to SparrowCRM, the CRM creates contacts from the people they email and attaches those email conversations to the contact record, where the whole team can see them. The problem: nothing stops a _colleague_ from being turned into a contact. The moment an internal coworker (e.g. `someone@surveysparrow.com`) is added, the private internal email between two employees — appraisal letters, salary discussions, HR threads — becomes shared common knowledge inside the CRM.

This affects every org that connects email, and it surfaces silently: no one notices until a confidential internal thread is already visible to the team. The cost of not solving it is severe and asymmetric — a single leaked appraisal or compensation email is an irreversible trust and compliance breach, far worse than the alternative failure mode (a customer email occasionally not logged, which is recoverable). For a CRM being sold on trust, this is also a competitive and legal (GDPR / data-handling) risk.

**Evidence:** Internal observation of the email-sync + auto-contact-creation flow; the data model attaches all synced email to contacts with team-level visibility by default.

---

## 2. Jobs To Be Done

**Primary job statement:** When I connect my work mailbox to the CRM, I want only genuine external customer conversations to be captured, so I can build my pipeline without exposing my private internal emails to my whole team.

- **Functional dimension:** Keep internal coworker emails out of the shared CRM while still capturing all customer conversations.
- **Emotional dimension:** Feel safe connecting my mailbox — confident that private internal threads won't leak.
- **Social dimension:** Be seen as someone who keeps confidential company information confidential; the admin is seen as having the org's data governance under control.

**Hiring criteria — why a user "hires" this:**

- It removes the fear of connecting a mailbox ("will my HR emails show up?").
- It's automatic and on by default — the admin doesn't have to police it.

**Firing criteria — why they'd switch off / lose trust:**

- It blocks legitimate customer contacts (false positives high enough to be annoying).
- It's confusing — people can't tell why a contact wasn't created.
- It leaks anyway because a path (import, API, a new channel) skipped the check.

---

## 3. Goals

1. **Zero internal-to-internal email exposure by default.** No coworker email conversation is visible in the CRM unless an admin or a permitted user has explicitly chosen to allow it. _Success: 0 internal threads synced in default configuration during QA + first 30 days._
2. **No impact on legitimate customer capture.** External customer contacts and conversations continue to sync exactly as today. _Success: <1% drop in external contact creation rate after launch._
3. **Single enforcement point covers every creation channel.** Forms, signups, smart routing, email, and API all inherit the block. _Success: 0 channels able to bypass the rule in QA._
4. **Informed override, not accidental.** When a permitted user manually adds a coworker, they understand the consequence before confirming. _Success: confirmation modal shown on 100% of same-domain manual creates while the setting is off._

---

## 4. Non-Goals

1. **Cleaning up coworker contacts created before this ships.** This feature is preventive going forward; remediating historical same-domain contacts and already-synced emails is a separate sweep (tracked as an open question). _Out of scope to keep v 1 shippable._
2. **Message-level filtering of internal back-channel inside external threads.** v 1 operates at the contact level, not by stripping individual internal replies on a customer thread. _Higher complexity; smaller incremental risk; revisit later._
3. **Auto-detecting that unrelated companies are "the same org."** We only treat domains as internal when they belong to the same CRM tenant / verified Workspace — we do not infer corporate ownership from the public internet. _Unreliable and risky._
4. **A full DLP / confidential-content classifier.** We are not scanning email _content_ for sensitive material; we gate on _who the participants are_. _Separate, much larger initiative._
5. **Per-user (vs. org-level) configuration of the setting.** v 1 is one org-level admin switch, not per-rep preferences. _Premature; adds governance complexity._

---

## 5. User Stories

1. As a **CRM admin**, I want coworkers from my own company to be excluded from contacts by default, so that internal emails never sync into the shared CRM without my decision.
2. As a **CRM admin**, I want to turn "Allow contacts from your own domains" on or off with a clear confirmation of what changes, so that I make the choice intentionally.
3. As a **sales rep**, I want the system to recognise my own company's domains (including sister-brand domains like `thrivesparrow.com`, `sparrowgenie.com`) as internal, so that cross-brand internal email is also protected.
4. As a **sales rep with create permission**, I want to manually add a coworker as a contact only after an explicit warning, so that I don't accidentally expose our internal emails.
5. As a **sales rep filling the Create Contact form**, I want an inline warning the moment I type a coworker's email, so that I see the consequence before I submit.
6. As a **CRM admin importing a contact list**, I want internal addresses skipped with a clear notice, so that a bulk import doesn't quietly pull in coworkers.
7. As a **sales rep**, I want a normal customer thread that also CCs a colleague to still sync, so that real sales conversations aren't lost.

---

## 6. Requirements

### Must-Have (P 0)

**P 0-1 — Org "owned-domain set."** The system maintains a set of domains considered internal for the tenant, sourced from: (a) domains of connected user mailboxes, (b) Workspace/M 365 verified domains where org-level OAuth is used, and (c) an admin-editable list. Supports multiple domains per org.

- _Acceptance:_
    - Given a tenant with `surveysparrow.com`, `thrivesparrow.com`, `sparrowgenie.com`, When any one of those is a connected user's domain or a verified Workspace domain, Then it is present in the owned-domain set.
    - Given the owned-domain set is empty/unknown, When a same-domain check runs, Then the address is treated as internal (fail-safe toward privacy).

**P 0-2 — Single contact-creation chokepoint.** The same-domain check is enforced at the one point where any contact is created, so every channel (email sync, web forms, signup, smart routing, API) inherits it.

- _Acceptance:_
    - Given the setting is off, When a contact creation is attempted from _any_ channel with an email in the owned-domain set, Then no contact is created and (because email only attaches to contacts) no conversation is stored.
    - Negative: Given the setting is off, When the email is external, Then the contact is created normally.

**P 0-3 — Admin setting + confirmation modals.** A toggle under Contact object settings: **"Allow contacts from your own domains," default OFF.** Toggling shows a confirmation modal (copy in §Appendix).

- _Acceptance:_
    - Given default state, When no admin has changed it, Then the toggle is OFF and same-domain contacts are blocked.
    - When toggled ON or OFF, Then the corresponding confirmation modal appears and the change applies only on confirm.

**P 0-4 — "All participants internal" semantics.** Only block when the contact's email is internal. A conversation that includes at least one external party still syncs (it produces an external contact).

- _Acceptance:_
    - Given a customer thread that CCs an internal colleague, When sync runs, Then the external customer contact is created and the thread syncs to them.
    - Given an internal-only thread (all participants in owned-domain set), When sync runs, Then no contact is created.

**P 0-5 — Manual override with consequence warning.** A user _with create permission_ may manually add a same-domain contact while the setting is off, but only after a confirmation modal that states the consequence. The Create Contact form also shows an inline error-style warning when an internal email is entered.

- _Acceptance:_
    - Given the setting is off and a user has create permission, When they enter an internal email on the Create Contact form, Then an inline warning appears below the Email field.
    - When they submit, Then a confirmation modal appears; on "Add anyway" the contact is created, on "Cancel" it is not.
    - Negative: Given a user _without_ create permission, When they attempt the same, Then creation is blocked with no bypass.

### Should-Have (P 1)

**P 1-1 — Bulk import / API filtering.** Import and API creation skip same-domain rows (no per-row modal) and surface a summary notice of how many were skipped.

- _Acceptance:_ Given an import containing internal addresses while the setting is off, When it runs, Then those rows are skipped and a notice reports the count.

**P 1-2 — Admin domain management UI.** Admin can view the auto-detected owned domains and add/remove entries (covers acquisitions and sister-brand-as-customer overrides).

### Future Considerations (P 2)

**P 2-1 — Message-level back-channel filtering** for internal replies appended to external threads (see Non-Goal 2). Design the sync pipeline so this can be added without re-architecting. **P 2-2 — Historical cleanup sweep** to quarantine/remove pre-existing same-domain contacts and their synced emails. **P 2-3 — Sister-brand "treat as customer" override** as a first-class, audited exception rather than a manual add.

---

## 7. Success Metrics

**Leading (days–weeks):**

- Internal threads synced in default config: **target 0** (QA + production audit, first 30 days).
- External contact creation rate change post-launch: **target within ±1%** of pre-launch baseline.
- % of same-domain manual creates that showed the confirmation modal: **target 100%**.
- Import runs that correctly skipped internal rows: **target 100%**.

**Lagging (weeks–months):**

- Reduction in support/escalation tickets about "internal email visible in CRM": **target → 0**.
- Mailbox-connection rate among new reps (trust proxy): **stretch +5%** vs. baseline.
- No data-handling/privacy incidents attributable to internal email exposure.

**Measurement:** instrumentation on contact-creation events tagged by channel + internal/external classification; periodic audit query over synced threads for all-internal participant sets; settings-state telemetry.

---

## 8. Open Questions

- **(Blocking — Eng/Product)** Confirm there is genuinely no other store (activity timeline, company record, search index) where an email can persist without a contact. The whole guarantee rests on "no contact = nothing stored."
- **(Blocking — Product)** Final call: does the _manual bypass_ stay for v 1, or does OFF block everyone including permitted users? (Current draft: bypass stays, gated by permission + modal.)
- **(Non-blocking — Data/Eng)** How is the owned-domain set refreshed as new mailboxes connect — real-time on connect, or periodic?
- **(Non-blocking — Product)** Handling of sister-brand-as-customer (sparrowgenie ↔ thrivesparrow): manual add for v 1, or a dedicated override?
- **(Non-blocking — Eng)** Bulk import: hard skip vs. allow-with-summary-confirm.
- **(Non-blocking — Legal)** Do we need a one-time historical cleanup for compliance, or is forward-only acceptable?

---

## 9. Timeline Considerations

- **Dependency:** owned-domain set (P 0-1) must land before the chokepoint check (P 0-2) is meaningful.
- **Suggested phasing:**
    - **Phase 1 (v 1):** owned-domain set + single chokepoint + setting & modals + manual override + inline form warning (P 0-1…P 0-5).
    - **Phase 2 (fast follow):** import/API filtering + admin domain-management UI (P 1).
    - **Phase 3 (later):** historical cleanup + message-level filtering + first-class override (P 2).
- No external hard deadline identified; prioritised by trust/compliance risk.

---

## Appendix — Final UX Copy

**Setting toggle**

- Label: _Allow contacts from your own domains_ (default OFF)

**Enable modal (turning ON)**

- Title: _Allow contacts from your own domains?_
- Body: _Lets users add coworkers as contacts. Your emails with them will sync into the CRM for your team to see._
- Buttons: _Cancel_ · _Allow_

**Disable modal (turning OFF)**

- Title: _Block contacts from your own domains?_
- Body: _Stops coworkers being added as contacts — your emails with them stay out of the CRM._
- Buttons: _Cancel_ · _Turn off_

**Create Contact form — inline warning (error style, shows when setting is OFF and an internal email is entered)**

- _This is a coworker. Your emails with them will sync into the CRM and be visible to your team._

**Manual create — confirmation modal (bypass)**

- Title: _Add someone from your own company?_
- Body: _Adding them will sync your emails with them into the CRM for your team to see._
- Buttons: _Cancel_ · _Add anyway_

**Bulk import notice**

- _Skipped 4 internal addresses — contacts from your own domains aren't added while this is off._