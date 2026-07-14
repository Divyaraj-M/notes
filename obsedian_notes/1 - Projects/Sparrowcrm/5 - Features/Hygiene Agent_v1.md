---
related:
  - "[[Email_v1]]"
  - "[[Agents in CRM]]"
  - "[[Zulie]]"
  - "[[Contacts_v1]]"
  - "[[2-Product Strategy]]"
  - "[[Apolloio_v1]]"
  - "[[Block Contact creation of Same Domain_v1]]"
  - "[[CRM Intelligence]]"
  - "[[Email Integration_v1.2]]"
  - "[[1-Product Vision]]"
  - "[[Apollo.io Enrichment — Field Reference]]"
  - "[[Meetings_v1]]"
  - "[[First Principle for a CRM]]"
  - "[[Ai Signals]]"
  - "[[Deal_v1]]"
---

> **One-line definition:** Contact Hygiene Agent v1 keeps rep-owned Contact records clean by detecting missing, stale, inconsistent, or poorly formatted contact fields from meeting, call, and email evidence — and verifying the contact's open tasks against that same evidence, suggesting status updates when a task is shown to be done — with every output verdictable by the contact owner (approve, reject, or expire).

---

## 1. Problem Statement

Contact records go stale because reps move fast. Titles outdate, phone numbers and LinkedIn URLs are missing, company associations drift, and updates revealed in meetings never make it back into the CRM.

The cost compounds in three directions: reps waste time on manual cleanup, managers can't trust contact-level views, and every downstream intelligence surface — AI Signals, Zulie, future agents — reasons over incomplete context.

**Contact Hygiene Agent v1 solves this by detecting field-level hygiene issues on rep-owned Contacts and suggesting fixes for the owner to verdict.** Suggestions are grounded in the workspace's own activity evidence — transcripts, calls, email context, and CRM records; nothing changes without approval. External enrichment (Apollo) is deliberately out of hygiene: it belongs to the Data Feed surface and the Research Agent. Contacts are the first controlled object — the loop expands to Companies and Deals only after it's proven here.

---

## 2. Jobs To Be Done

**Primary job statement:**

> When my contact records are incomplete or outdated after a customer interaction, I want the CRM to detect the change, verify it against available sources, and suggest the update for my approval, so I can keep contact data clean without doing manual CRM cleanup.

**Functional dimension:** Keep contact fields accurate with minimal manual effort.

**Emotional dimension:** Feel confident the CRM is helping — not creating review busywork or silently changing data.

**Social dimension:** Be seen by managers and teammates as organized and on top of relationships.

**Hiring criteria** — why a rep would hire this agent:

- Catches missing or stale fields from real meeting/call context
- Turns cleanup into quick approve/reject decisions with a clear "why" per suggestion
- Lets the rep sweep their owned contacts on demand from Agent Overview, without wasting credits
- Gets better over time from the rep's verdicts

**Firing criteria** — what would make a rep abandon it:

- Noisy, obvious, or low-value suggestions
- Suggestions with no meeting/call evidence behind them
- Fields updated without approval, or human-entered values silently overwritten
- Manual Run burning credits without producing useful suggestions, or scanning contacts the rep doesn't own
- Repeating suggestions the rep already rejected
- More time spent reviewing than the agent saves

---

## 3. Goals

**User goals**

1. **Reduce manual contact cleanup effort** — reps spend measurably less time finding and fixing missing/stale fields.
2. **Increase trust in contact data** — supported fields become more complete and accurate over time.
3. **Keep every AI change reviewable** — every rep-facing output is a specific field suggestion with approve / reject / expire verdicts.
4. **Enable controlled manual cleanup** — Manual Run from Agent Overview sweeps eligible owned contacts without per-contact selection, at low credit cost.

**Business goals**

1. **Prove the learning loop on one object** — Contacts validate Suggestion → Verdict → Learning before the pattern expands.
2. **Improve downstream intelligence** — cleaner contacts improve Signals, Zulie, and future agent quality.
3. **Create measurable proof of value** — accepted suggestions, fields maintained, and time saved; accepted suggestions count as value actions feeding WAA-3V.
4. **Control AI credit spend** — eligibility scanning before reasoning keeps cost per accepted suggestion low.

---

## 4. Non-Goals

|Non-goal|Why it's out|
|---|---|
|Company / Deal hygiene|Different ownership and guardrail rules; expand only after Contacts stabilize (P2.6, P2.7)|
|Autonomous field updates|v1 earns trust through verdicts before any auto-mode|
|Apollo / external enrichment in any form|Hygiene works on workspace-internal evidence only. Deterministic enrichment belongs to the future Data Feed surface (P2.4); reasoned external verification belongs to Research Agent|
|Manual Run across all workspace contacts|Too broad, costly, and risky — Manual Run is scoped to the agent owner's contacts|
|Manual contact picker|v1 scans eligible owned contacts automatically; record-specific runs are P2.3|
|Research-style synthesis|Broader outside research belongs to Research Agent|
|Duplicate detection / merging|Data-loss risk; needs a dedicated safe merge flow (P2.5)|
|Lead scoring, buying intent|Belongs to AI Signals|
|Task creation / next-best actions|Creating tasks from conversations belongs to Follow Up Agent; recommended actions belong to Pipeline Agent. Hygiene only verifies the status of tasks that already exist|
|Outreach / email sending|Higher blast radius; not hygiene work|

---

## 5. User Stories

**P0**

1. As a sales rep, I want the agent to detect missing important fields on my contacts so that I don't have to audit every record manually.
    
2. As a sales rep, I want suggestions grounded in meeting/call transcripts so that updates reflect real customer interactions.
    
3. As a sales rep, I want my open tasks on a contact checked against new calls and emails so that tasks I've already completed get marked done without me updating them manually.
    
4. As a sales rep, I want to review every suggested change before it's applied so that I stay in control of my data.
    
5. As a sales rep, I want to see why each change was suggested so that I can trust the recommendation.
    
6. As a sales rep, I want to reject wrong suggestions so that the agent learns not to repeat similar mistakes.
    
7. As a sales rep, I want to run the agent manually from Agent Overview so that I can check my owned contacts on demand.
    
8. As a sales rep, I want Manual Run to check only contacts I own that have meeting/call transcripts or recent email evidence so that credits aren't wasted on irrelevant records.
    
9. As a sales manager, I want accepted suggestions to improve contact completeness so that CRM data becomes reliable. **P1**
    
10. As a sales rep, I want repeated low-confidence suggestions suppressed so that my queue stays clean.
    
11. As a sales rep, I want manual-run suggestions grouped by contact so that review is fast.
    
12. As a manager, I want to see acceptance rates so that I can judge whether the agent is useful or noisy.
    
13. As a manager, I want to see Manual Run usage and outcomes so that I know reps are actively maintaining contact data.**P2**
    
14. As a sales rep, I want trusted low-risk updates to auto-apply once the agent has earned enough approvals so that I only review judgment calls.
    
15. As an admin, I want to configure which fields the agent can evaluate so that it matches our CRM process.
    
16. As a sales rep, I want to run the agent on a specific contact so that I can do a record-level cleanup check.
    

---## 6. Requirements

### Must-Have — P0

**P0.1 — Contact-only, owner-scoped eligibility** Runs only on Contact records where contact owner = agent owner, within the workspace where the agent is active, with supporting evidence and at least one supported hygiene issue. Companies, Deals, unowned contacts, other reps' contacts, and duplicate clusters are excluded.

- Given a rep owns a contact with a supported hygiene issue, when the agent runs, then a suggestion is created for that rep.
- Given the record is a Company or Deal, when the agent runs, then no suggestion is created.
- Given the contact is owned by another rep, when the agent runs, then no suggestion is shown to this user.

**P0.2 — Enable-only activation** One action: **Enable**. No setup form, guardrail configuration, or per-user flow in v1. On enable: status becomes Live, triggers activate, Manual Run becomes available, suggestions land under Pending approval.

- Given the agent is not enabled, when the user opens the agent page, then the primary action is Enable.
- Given enablement succeeds, when the user opens Agent Overview, then the agent is Live and Run Agent is available.

**P0.3 — Supported triggers** After call · After meeting · **After email received** · Manual Run from Agent Overview.

The email trigger fires on inbound emails from a contact and evaluates only what that email evidences (signature block, sender domain, stated title/role changes). Signature parsing may run as a cheap pre-step before LLM reasoning, but parsed values are still suggestions — nothing from an email is ever auto-applied. Depends on email activity being reliably present in the shared context layer.

- Given a meeting ends with new contact information, when the agent runs, then eligible fields are evaluated for missing, stale, or conflicting values.
- Given a transcript contains contact information stated by the person, when the agent runs, then it can create a suggestion citing the transcript as evidence.
- Given an inbound email is received from a contact, when the agent runs, then it evaluates fields evidenced by that email (e.g., signature title, phone, company domain) and can create a suggestion citing the email as evidence.
- Given an inbound email contains no contact-field evidence, when the agent evaluates it, then no reasoning run is triggered.

**P0.4 — Manual Run from Agent Overview** A scoped hygiene check, not a workspace scan. Evaluates only contacts where: owner = agent owner, at least one piece of activity evidence exists (meeting/call transcript or a contact-field-evidencing email), that evidence isn't already fully processed for the same issue, and at least one supported field may need an update. No contact picker in v1. Trust model unchanged: detect → suggest → verdict → write on approval.

- Given the user clicks Run Agent, when Manual Run starts, then only contacts owned by the agent owner are scanned.
- Given a contact has no transcript or email evidence, or no supported field needing update, when scanning runs, then that contact is skipped before heavy reasoning.
- Given eligible contacts with hygiene issues, when the run completes, then field-level suggestions appear under Pending approval.

**P0.5 — Manual Run credit guardrail** Two-stage execution: (1) a low-cost eligibility scan (ownership, activity-evidence presence and freshness — transcript or email, candidate fields, no duplicate pending suggestion) filters contacts; (2) AI reasoning runs only on contacts that pass. If evidence is weak, no suggestion is created — no guessing.

- Given Manual Run starts, when contacts are scanned, then the eligibility scan runs before any transcript reasoning.
- Given no eligible contacts, when the scan completes, then no heavy reasoning is triggered.
- Given weak evidence on an eligible contact, when reasoning completes, then no suggestion is created.

**P0.6 — Manual Run output states** Five explicit outcomes, each with clear user-facing messaging:

1. **Suggestions found** — run appears under Pending approval, grouped by contact ("5 contact updates suggested across 3 contacts").
2. **No eligible contacts** — no reasoning runs; "No eligible contacts found. Manual Run only checks contacts you own with meeting/call transcripts or recent email evidence."
3. **Eligible but nothing needed** — run completes to Past; "No contact hygiene updates needed."
4. **Insufficient evidence** — "Some contacts were checked, but no update was suggested because evidence was insufficient."
5. **Duplicates pending** — existing pending suggestion kept (proof statement optionally refreshed with new evidence), no copy created; "Existing pending suggestions were found and not duplicated."

- Given each state above, when Manual Run completes, then the corresponding placement and message are shown; a zero-suggestion run still renders as a run row.

**P0.7 — Supported suggestion types** Two families: field-level fixes and transcript-stated task extraction.

1. **Missing field** — title empty; transcript says "VP Sales"
2. **Stale field** — CRM says "Sales Manager"; recent context says "Head of Revenue"
3. **Format cleanup** — phone, email casing, country, LinkedIn URL format
4. **Conflict flag with replacement** — CRM company vs. activity/domain evidence pointing elsewhere
5. **Association** — contact has no company; email domain and transcript point clearly to one
6. **Task status verification** — the agent checks the contact's existing open tasks against new activity evidence (call/meeting transcript, email). When the evidence shows a task was completed — an open task says "send pricing doc" and the email thread shows it was sent, or the transcript confirms it was delivered and discussed — the agent suggests marking that task done, citing the evidence. **Verification only, never creation**: the agent updates the status of tasks that already exist; creating new tasks from conversations belongs to Follow Up Agent. Verdict: approve → task marked complete · reject → task stays open · expire.

Excluded: Company/Deal field updates, stage changes, forecast categories, lead scores, merges, bulk direct writes, prospect-facing actions, task creation.

- Given a supported issue with sufficient evidence, when the agent runs, then a suggestion is created; given an issue on a Company/Deal field, then none is.
- Given a contact has an open task and new activity evidence shows it was completed, when the agent runs, then a task-completion suggestion is created citing that evidence.
- Given the rep approves a task-completion suggestion, when the verdict logs, then the task is marked done; given rejection, the task stays open.
- Given the evidence is ambiguous about whether the task was completed, when the agent runs, then no task suggestion is created.
- Given a conversation implies a new action item but no matching task exists, when the agent runs, then no task is created.

**P0.8 — Supported contact fields (lock before implementation)** Proposed v1 list: first name, last name, full-name formatting, job title, email, phone, LinkedIn URL, location, department/function, seniority, associated company. Avoid in v1 unless confidence is very high: persona, buying role, lead status, lifecycle stage, owner, and any field driving automation, routing, or scoring.

- Given a field is on the supported list, when a hygiene issue with evidence is found, then a suggestion may be created; given it is not, then no rep-facing suggestion is created.

**P0.9 — Suggestion object** Every suggestion carries: contact ID and name, proof statement, evidence/source, categorical confidence (Very High / High / Medium / Low), agent run ID, trigger type, and status (pending / approved / rejected / expired). Field suggestions add: field name, current value, suggested value. Task-status suggestions add: task ID and title, current status, proposed status (done), and the evidence excerpt showing completion. Low-confidence suggestions are not shown unless the team explicitly opts them in.

- Given a suggestion is opened for review, when the rep views it, then current value, suggested value, proof, evidence, and confidence are all visible.

**P0.10 — Verdict flow** Verdicts: **approve / reject / expire.** No inline editing in v1 (P2.2).

- Given approval, when the verdict logs, then the suggested value is written to the record.
- Given rejection, when the verdict logs, then the record is unchanged.
- Given no action within the expiry window, when the window passes, then status becomes expired.

**P0.11 — No silent overwrite** Human-entered values are never silently changed. Corrections to human-entered values are allowed only as evidenced suggestions requiring approval. A rejected correction is not re-suggested without new evidence.

- Given a field has a human-entered value and the agent detects a correction, when it acts, then it creates a suggestion — never a direct change.
- Given the rep rejected a correction, when the same evidence reappears, then the suggestion is not repeated.

**P0.12 — Evidence hierarchy** Priority order: (1) recent human-entered value → (2) explicit transcript mention → (3) email signature/context → (4) older CRM value.

- Given two evidence sources conflict, when the agent acts, then the proof statement explains the conflict or no suggestion is created.
- Given evidence conflicts with a recent human-entered value, when the agent runs, then no suggestion is created unless stronger transcript evidence supports it.

**P0.13 — Verdict logging (learning-loop foundation)** Every verdict is logged with its dimensions so the learning loop can be computed later without data loss: workspace, agent, contact field, action type, evidence type (transcript-only / email-assisted / format-only / CRM-conflict), suggestion family (field / task), trigger type (manual-run / trigger-generated), agent version, and verdict method (individual / group / run-bulk). No rate computation, thresholds, or flagging in v1 — logging only.

- Given a verdict, when it is recorded, then all dimensions above are captured on the verdict record.
- Given a group or run-bulk approve, when verdicts are recorded, then each field-level verdict carries the correct verdict method.

**P0.14 — Review surface** Suggestions appear in the existing agent review flow: agent detail page, run history, and (if available) a contact-record entry point. Within a run, suggestions are **grouped by contact** (per the review panel design): each contact group shows its field-level old → new values with per-group Approve (n) and reject controls, plus a run-level Approve all. Group and run-level verdicts fan out into individual field-suggestion verdicts in telemetry. Fully-verdicted runs move to Past.

- Given suggestions exist, when the rep opens the run, then they are visible under Pending approval, grouped by contact.
- Given a group approve (n), when the verdict logs, then n field-level approve verdicts are recorded.
- Given all suggestions are verdicted, when the run is viewed later, then it appears under Past.

### Nice-to-Have — P1

- **P1.1 Per-field deselect in group review** — deselect individual field rows before a group approve, so rejecting one wrong field doesn't cost the correct ones. (Grouping itself is P0.14 per the review panel design.)
- **P1.2 Field-level suppression** — repeated rejections on a field type reduce its future suggestion frequency.
- **P1.3 Admin field configuration** — admins define which fields the agent evaluates.
- **P1.4 Quality dashboard** — suggestions, approval/rejection/expiry rates, fields maintained, time-to-verdict, Manual Run count/suggestions/no-update rate.
- **P1.5 Manual Run progress states** — scanning → checking transcripts → evaluating → preparing suggestions → complete.
- **P1.6 All-caught-up state** — "All caught up. No pending contact updates."
- **P1.7 Learning-loop analytics** — rolling accept/reject/expiry rates computed over the P0.13 logs per field, evidence type, trigger type, and agent version; threshold flags for noisy evidence/trigger types; regression flags on accept-rate drops after version changes. Bulk-approve verdicts separable from individual ones before any trust conclusion. Prerequisite for P2.1 auto-mode.

### Future Considerations — P2

- **P2.1 Auto-mode for trusted field types** — graduate per field/action type after sustained approval (e.g., phone formatting).
- **P2.2 Inline edit verdict** — approve-with-edit as a fourth verdict, the "right idea, wrong answer" signal.
- **P2.3 Manual Run on a selected contact** — record-level runs from the contact page.
- **P2.4 Apollo data feed** — standalone attributed auto-fill surface (Data Feeds, AI Signals division), separate from this agent.
- **P2.5 Duplicate detection and merge suggestions** — requires a dedicated safe merge flow.
- **P2.6 Company Hygiene Agent** — identity, firmographics, domain hygiene, association quality.
- **P2.7 Deal Hygiene Agent** — completeness, stale close dates, missing stakeholders, stage-vs-activity consistency. Boundary: deal hygiene fixes CRM quality; Pipeline Agent recommends actions; forecasting stays out.

---

## 7. Success Metrics

**Primary metric: accepted contact hygiene suggestions per weekly active agent user** — captures usage and trust in one number, and each accepted suggestion counts as a value action feeding WAA-3V.

**Leading indicators**

|Metric|What it tells us|
|---|---|
|Suggestions issued|Is the agent finding enough hygiene issues|
|Approval rate|Are suggestions useful|
|Manual Run usage / suggestions created / no-update rate|Is Manual Run used, useful, and well-filtered|
|Heavy reasoning rate|Is the eligibility scan protecting credits|
|Rejection rate|Are suggestions noisy or wrong|
|Expiry rate|Do reps care enough to review|
|Time-to-verdict|Are suggestions easy to decide on|

**Lagging indicators**

|Metric|What it tells us|
|---|---|
|Contact field completeness|Are records getting cleaner|
|Repeated missing-field rate|Are hygiene issues shrinking over time|
|Downstream signal quality|Do Signals and Zulie benefit|
|Rep time saved|Is manual CRM work reduced|
|Auto-mode-eligible field types|Is the trust loop working|
|Credit efficiency per accepted suggestion|Is value created without waste|

**Targets — 30 days post-launch**

- 40%+ of eligible reps receive ≥1 suggestion
- 50%+ approval rate on supported field suggestions
- <25% expiry rate · median time-to-verdict <24h
- Accept-rate trends computable from logged verdicts (formal delta tracking starts with P1.7)
- Manual Run triggers no heavy reasoning when zero contacts are eligible

**Targets — 90 days post-launch**

- 65%+ approval rate on mature suggestion types
- 20%+ reduction in missing supported fields on active contacts
- ≥1 low-risk field/action type eligible for auto-mode review
- Manual Run produces accepted suggestions often enough to justify its placement

---

## 8. Open Questions

**Blocking**

|#|Question|Owner|Note|
|---|---|---|---|
|1|Which contact fields are supported in v1?|Product + Engineering|Lock the list before implementation (P0.8 proposal)|
|2|Confidence threshold for creating a suggestion?|Data/AI + Product|Needed to avoid noise|
|3|Expiry window for pending suggestions?|Product|Suggested default: 7 days|
|4|Which sources can the agent read in v1?|Engineering|CRM record, meeting summary, call transcript, email activity|
|5|Can the agent suggest changes to human-entered values?|Product + Design|Recommended: yes, as evidenced suggestions only — never silent|
|6|Is associated company in Contact v1?|Product + Engineering|Touches the Company object; include only with strong association evidence|
|7|How far back does Manual Run scan activity evidence?|Product + Engineering|Suggested start: unprocessed transcripts and emails, last 30 days|
|8|What marks a transcript/email/contact/field as "already processed"?|Engineering|Needed to prevent duplicate reasoning; also the mechanism that keeps long email threads from re-triggering reasoning|
|9|Max contacts per Manual Run?|Product + Engineering|Suggested start: cap on eligible contacts after the low-cost scan|
|10|Review panel design shows Contact Owner as a suggestible field — conflicts with P0.8 (owner excluded) and P0.1 (owner-scoped review). Reconcile design vs. PRD|Product + Design|Recommendation: owner stays out of v1; treat the mock value as placeholder|

**Non-blocking**

- Rejection-reason capture (optional one-tap, never mandatory)
- Manual Run scan summary ("42 scanned · 8 eligible · 3 suggestions")
- Admin field configuration in v1 vs. P1
- Suggestions on the contact page vs. agent review flow only (design)

---

## 9. Timeline Considerations

**Phase 1 — Contact Hygiene Agent v1 (prove the loop on one object)** Enable-only activation · contact-only, owner-scoped runs · after-call / after-meeting / after-email-received triggers · Manual Run with eligibility scan · missing/stale/format/conflict/association suggestions · task status verification · approve/reject/expire verdicts · Run → Suggestion → Verdict telemetry. Success: meaningful approval share, manageable rejection/expiry, Manual Run finds useful work at low credit cost, supported fields grow more complete, and the team learns which fields are safe, noisy, or valuable.

**Phase 2 — Quality improvements** Grouping, progress states, scan summary, field-level suppression, all-caught-up state, quality dashboard, credit-efficiency analytics.

**Phase 3 — Company Hygiene Agent** — only after Contact acceptance rates stabilize.

**Phase 4 — Deal Hygiene Agent** — only after Contact and Company rules mature.

---

## Appendix — Scope test

Every proposed piece of v1 work must pass:

> **Does it produce a specific suggestion on a rep-owned Contact record — a field-level fix or a status update to an existing task — grounded in contact activity evidence, that the contact owner can verdict?**

If no, route it: Company field → Company Hygiene (later) · Deal field → Deal Hygiene (later) · external enrichment (Apollo) → future Data Feed · intent/risk/competitor insight → AI Signals · outside research synthesis → Research Agent · task creation from conversations → Follow Up Agent · next-step recommendation → Pipeline Agent · rep-asked update → Zulie.