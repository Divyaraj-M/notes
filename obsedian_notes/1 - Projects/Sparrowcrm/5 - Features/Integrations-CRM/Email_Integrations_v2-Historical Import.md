---
feature: "[[Email Integration]]"
version: 2
status: Done
priority: High
tags:
  - sparrowcrm/features/integrations/email_integration/v2
---
# PRD — Historical Email Import (SparrowCRM)

**Status:** Draft for review **Author:** Divi **Last updated:** June 4, 2026 **Scope:** Historical email import within the SparrowCRM email integration. The broader live-sync/send PRD is separate; this document covers importing a user's _past_ emails on connection and the contact-creation rules that govern it.

---

## 1. Problem Statement

When a sales rep connects their inbox to SparrowCRM, live sync only captures emails going _forward_. The customer relationships that already exist — months of proposals, negotiations, and follow-ups — stay trapped in the rep's inbox and never appear on the CRM record. Reps and managers then work with half a picture: a contact's timeline starts the day they connected, not the day the relationship began.

Every rep who migrates to SparrowCRM or connects a mature mailbox hits this on day one. The cost is a weak first impression (the CRM looks empty on real accounts), lost deal context, and a competitive gap — HubSpot, Salesforce (Einstein Activity Capture), and Attio all offer some form of historical import. The hard part isn't fetching old email; it's importing it _without_ flooding the CRM with junk contacts or pulling in sensitive/irrelevant mail.

---

## 2. Jobs To Be Done

**Primary job statement:** When I connect my inbox to SparrowCRM, I want my recent customer email history to appear on the right records automatically, so I can see the full relationship without re-creating it by hand.

- **Functional dimension:** Bring the last 3 months of relevant emails onto contact/company timelines, matching existing contacts and (optionally) creating new ones.
- **Emotional dimension:** Confident the CRM reflects reality, in control of what gets pulled in, not anxious about over-sharing private mail.
- **Social dimension:** Looks on top of their accounts to their manager and prepared in front of customers — no "let me check my inbox" gaps.

**Hiring criteria — why a rep "hires" this feature:**

- It removes the manual drudgery of logging old threads one by one.
- It makes the CRM useful _immediately_ after connecting, not weeks later.

**Firing criteria — why they'd stop using it / distrust it:**

- It creates a wall of junk contacts (newsletters, strangers, internal colleagues).
- It imports private or sensitive conversations they didn't want in the CRM.
- It duplicates emails or contacts on reconnect.

---

## 3. Goals

1. **Time to populated CRM:** Median time from inbox connection to relevant past emails appearing on records < 10 minutes. _(User goal — immediate value.)_
2. **Import adoption:** ≥ 50% of users who connect an inbox complete a historical import within 7 days. _(Business goal — feature lands.)_
3. **Clean data:** ≤ 5% of contacts created by import are deleted by the user within 14 days (proxy for "no junk"). _(User goal — trust in creation logic.)_
4. **Zero duplication:** 0 duplicate emails or contacts produced by reconnects or re-runs. _(Quality goal.)_
5. **Competitive parity removed as objection:** "No historical email" disappears from lost-deal reasons. _(Business goal.)_

---

## 4. Non-Goals

- **Unlimited history in v1.** Default import is the **last 3 months**. Deeper history is gated — "to import more, contact sales." Keeps volume bounded and creates a commercial lever.
- **Import logs / bulk undo / per-item deletion (this version).** Deliberately cut from v1 to ship the core. Contact-creation rules + private recipients are the safety mechanism instead. Revisit based on real cleanup demand (see §6 P2).
- **A separate admin on/off switch for historical import.** Removed — import is always available, gated only by the contact-creation layers. One less workspace toggle to manage.
- **Auto-detection of which emails are "important."** We use sent/replied-driven creation, not ML relevance scoring.
- **Connect-for-live-sync-only as a distinct path.** In v1, connecting runs through the import flow. A live-only entry point is out of scope unless requested.
- **Shared mailbox / alias historical import.** v1 is individual user mailboxes only.

---

## 5. User Stories

**Primary persona — Sales Rep**

1. As a sales rep, I want to choose, before I connect, whether to import only for contacts I already have or also create new contacts, so I control how much lands in the CRM.
2. As a sales rep, I want my replied-to threads to import with the contact created automatically, so conversations I actually had show up without manual work.
3. As a sales rep, I want to add private recipients (addresses/domains) before importing, so sensitive or noisy senders are excluded.
4. As a sales rep, I want to authenticate with Google only after I've decided what to import, so I'm not committing my inbox before I know what happens.
5. As a sales rep, when I reconnect a broken account, I want sync to resume without re-importing, so I don't get duplicates.

**Admin**

6. As an admin, I want to set how contacts are created workspace-wide (Selective / All / None), so historical and live behave consistently to our data policy.
7. As an admin, I want a workspace private-recipients list that excludes sensitive addresses from all imports automatically — and that reps cannot remove or override — so reps can't accidentally (or deliberately) pull them in.

**Edge cases**

8. As a rep without contact-creation permission, I want the "create new contacts" option clearly disabled with a reason, so I understand why and can ask my admin.
9. As a rep, when I'm only CC'd on a thread, I want it logged only to contacts that already exist (not create records from it), so being copied doesn't generate junk.
10. As a rep, when I cancel the Google auth screen, I want nothing connected or imported, so a mistaken click has no side effects.

---

## 6. Requirements

### Must-Have (P0)

**R1 — Import flow order: choose → private recipients → authenticate → import** The rep selects import options _before_ OAuth. Authentication is triggered by the "Import" action; the import runs only after a successful Google auth.

- **Acceptance criteria:**
    - Given a rep with no connected account, When they start "Connect Google account," Then the import options modal appears _before_ any Google auth.
    - Given the rep is on the options modal, When they click "Import," Then the Google OAuth screen opens.
    - Given the rep cancels the Google OAuth screen, Then no account is connected and no import occurs.
    - Given the rep completes OAuth, Then the account connects and the import runs in the background with a progress/notification state.

**R2 — Two import scopes** The rep chooses one:

- _Import for existing contacts only_ — attach past emails to contacts already in the CRM; create nothing.
- _Create new contacts & attach emails_ — also create contacts, per the creation rules in R4.
- **Acceptance criteria:**
    - Given "existing contacts only," When import runs, Then no new contacts/companies are created; emails attach only to existing records.
    - Given "create new contacts," When import runs, Then contacts are created per R4 and emails attach to them.

**R3 — 3-month window (default), sales-gated beyond** Default import covers the last 3 months per connected account. Deeper history is not self-serve; the UI surfaces a "contact sales" path.

- **Acceptance criteria:**
    - Given an import, When it runs, Then only emails from the last 3 months are imported.
    - Given the options modal, Then it shows copy: "To import more, contact sales."

**R4 — Three-layer contact-creation logic** Whether "Create new contacts" is available is governed by:

- **Layer 1 — Rep permission** (set in Users & Teams): if the rep lacks contact-creation permission, the option is disabled.
- **Layer 2 — Admin "Contact creation" mode** (Selective / All / None): if None, the option is disabled.
- **Layer 3 — Rep choice**: when both layers pass, the rep picks existing-only or create-new.
- A rep may always be _more_ restrictive than the admin, never less.
- **Acceptance criteria:**
    - Given the rep has no create permission, Then "Create new contacts" is disabled with: "You don't have permission to create contacts. Ask your admin."
    - Given admin Contact creation = None, Then "Create new contacts" is disabled with: "Contact creation is turned off for your workspace."
    - Given both layers pass, Then both options are enabled and selectable.

**R5 — Sent/replied-driven creation (thread-aware)** When creating contacts on import, a person becomes a contact only if the rep _sent them something_ in the window — including replies to their inbound. Pure inbound from never-replied strangers does not create a contact. Processing is thread-aware (two-pass): identify sent/replied counterparties first, then attach all their emails (inbound included).

- **Acceptance criteria:**
    - Given an inbound thread the rep replied to, When import runs with "create new," Then the contact is created (via the reply) and the original inbound attaches.
    - Given an inbound-only thread never replied to, Then no contact is created and it is skipped.
    - Given an existing contact, Then all their in-window emails attach regardless of direction.

**R6 — Private recipients (workspace) + per-import additions** A workspace-level private-recipients list (admin) excludes addresses/domains from all imports and live sync automatically. The import flow pre-fills this list and lets the rep add more for that import (the "Add private recipients" step, skippable). **Admin-added entries are locked at the rep level — a rep can add their own exclusions but cannot remove or edit ones the admin set.**

- **Acceptance criteria:**
    - Given an address/domain in the workspace private-recipients list, Then it is never imported or created.
    - Given the rep opens the "Add private recipients" step, Then admin-added entries are shown but read-only (no remove/edit control); only rep-added entries can be removed.
    - Given the rep adds an entry in the step, Then matching emails are excluded from that import.
    - Given the step, Then it is skippable and workspace exclusions still apply.
    - Given a rep attempts to remove an admin entry, Then the action is unavailable (no control rendered) — the admin list cannot be weakened by reps.

**R7 — CC / BCC handling**

- CC'd participants: log to them only if they're already a contact; never create from CC.
- BCC participants: never log to them, never create (BCC is hidden by design).
- **Acceptance criteria:**
    - Given an existing contact CC'd on an imported email, Then it logs to their timeline.
    - Given a non-contact CC'd, Then no contact is created from the CC.
    - Given a BCC'd participant, Then nothing is logged to or created for them.

**R8 — Reconnect is non-destructive, no re-import** Reconnecting refreshes the OAuth token and resumes live sync. It does not re-run historical import and produces no duplicates (idempotent by message-ID).

- **Acceptance criteria:**
    - Given a reconnect, Then live sync resumes and no historical re-import occurs.
    - Given overlapping messages, Then no email or contact is duplicated.

### Nice-to-Have (P1)

**R9 — Post-import summary toast/notification** with counts (emails imported, contacts created). Shown after completion; non-blocking.

**R10 — Background-job resilience:** closing the tab after auth does not stop the import; it completes server-side.

### Future Considerations (P2)

**R11 — Import logs + bulk undo + per-item deletion.** A logged history of imports with a 24h all-or-nothing undo and an Emails/Contacts-created review view for deleting individual items. Cut from v1; design the import job so each run is identifiable (import_id on records) to enable this later.

**R12 — Deeper history tiers.** The "contact sales" path productized into self-serve paid tiers (e.g., 12 months / all history). Keep the window a parameter, not a hardcoded 3.

**R13 — Live-sync-only connection path** for users who want forward sync without importing history.

**R14 — Admin "backfill all connected accounts"** explicit action for retroactive org-wide import (confirmed, never automatic).

---

## 7. Success Metrics

**Leading indicators (0–30 days):**

|Metric|Definition|Target|Method|
|---|---|---|---|
|Import adoption|% of inbox-connectors who complete an import within 7 days|50%|Product analytics|
|Time to populated CRM|Median connect → first imported emails visible|< 10 min|System metrics|
|Created-contact deletion|% of import-created contacts deleted within 14 days|< 5%|CRM data|
|Import success rate|% of started imports that complete without error|97%+|Job monitoring|
|Duplicate rate|Duplicate emails/contacts from reconnect or re-run|0|Data integrity check|

**Lagging indicators (60–90 days):**

|Metric|Definition|Target|Method|
|---|---|---|---|
|CRM daily active usage|Change in DAU among users who imported|+25% vs baseline|Product analytics|
|Loss-reason elimination|"No email history" as a lost-deal reason|Removed from top 5|Sales loss tracking|
|Sales-gated history interest|# of "contact sales" clicks on the import modal|Track for tiering decision|Event tracking|

**Evaluation cadence:** Day 7 (adoption + success rate), Day 30 (leading set), Day 90 (lagging + tiering decision).

---

## 8. Open Questions

- **(Engineering, blocking)** Does the Gmail/Microsoft OAuth scope set used for live sync also cover the historical fetch, or does the import require an additional scope (which would change the consent screen)?
- **(Product/Sales, non-blocking)** What exactly does "contact sales" unlock — 12 months, all history, or a meeting? Affects modal copy and the P2 tiering plan.
- **(Data, non-blocking)** Confirm idempotency key (message-ID) is stable across Gmail and Microsoft for dedupe on reconnect.
- **(Design, non-blocking)** Final copy for the two disabled-state reasons (no permission / creation off) and the "Add private recipients" step.
- **(Legal, non-blocking)** Is the in-flow consent ("we'll import your last 3 months") sufficient lawful basis, given creation is sent/replied-driven and private recipients are excluded?

---

## 9. Timeline Considerations

**Hard deadlines:** None identified.

**Dependencies:**

- OAuth scope confirmation (blocks build if a new scope is needed — triggers re-auth for existing users).
- Workspace private-recipients list and admin Contact-creation setting must exist (shared with the live-sync PRD).
- Background job infrastructure for the import (resumable, idempotent).

**Suggested phasing:**

| Phase   | Scope                                                                               | Notes                      |
| ------- | ----------------------------------------------------------------------------------- | -------------------------- |
| Phase 1 | R1–R8 (core flow, 3-month window, 3-layer creation, sent-driven, CC/BCC, reconnect) | The shippable v1           |
| Phase 2 | R9–R10 (summary + background resilience)                                            | Fast follow                |
| Phase 3 | R11+ (import logs, undo, deletion, history tiers)                                   | Post-launch, demand-driven |