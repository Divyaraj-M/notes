---
owner: Divyaraj Murugan
feature: "[[Agents in CRM]]"
version: 2
status: Done
priority: High
tags:
  - sparrowcrm/features/crm_intelligence/aiagents/hygiene_agent_v2
---


---

## 1. Problem Statement

Deal records drift out of sync with reality because the information that should update them lives in conversations, not in the CRM. A deal owner drives a deal through meetings, calls, and emails with the associated contacts — and in those conversations the real state of the deal surfaces: a shifted close date, a budget figure, an agreed next step, a new decision-maker. But the rep is selling, not doing data entry, so that information is spoken and then lost; it never reaches the deal's fields.

This happens on effectively every active B 2 B deal, continuously — worst on fast-moving or multi-threaded deals where the record decays fastest. The cost of not solving it: managers' pipeline views and forecasts run on stale data, the next rep inherits a half-empty record, reps waste time on manual cleanup, and the intelligence layer itself reasons over incomplete deal context. Evidence: this is the same class of problem the Contact Hygiene Agent was built for (validated against customer transcripts), applied to the higher-stakes Deal object.

---

## 2. Jobs To Be Done

**Primary job statement:**

> When my deal changes during a conversation I'm part of, I want the deal's fields updated from what was actually said, so I can keep the record accurate without stopping to do data entry.

**Functional dimension:** Keep a deal's fields (stage, close date, amount, next step, stakeholders) accurate and current with minimal manual effort.

**Emotional dimension:** Confident the pipeline reflects reality — not anxious that the record is quietly rotting or that a review will expose stale deals.

**Social dimension:** Seen by managers as a rep whose pipeline is trustworthy and whose deals are well-maintained.

**Hiring criteria — why a rep would "hire" this:**

- Catches field changes revealed in real conversations they were part of, so nothing is silently lost.
- Flags stage-vs-activity mismatches against the team's _own_ stage rules — defensible, not a generic opinion.
- Turns pipeline cleanup into quick approve/reject decisions instead of manual editing.
- Pulls a newly-created deal's context from the contacts' prior conversations automatically.

**Firing criteria — why they'd abandon it:**

- Second-guesses their stage judgment with suggestions that feel presumptuous or wrong.
- Fills a field with the wrong deal's information (multi-deal contamination) and they lose trust.
- Surfaces suggestions from conversations they weren't part of — feels like it came from nowhere.
- More review effort than the manual cleanup it replaces.

---

## 3. Goals

|#|Goal|How we know it succeeded|Type|
|---|---|---|---|
|G 1|Deal records stay accurate with less manual effort|Reduction in mis-staged / stale-close-date / no-next-step deals on active pipeline over time|User|
|G 2|Stage consistency is trusted, not resented (the star feature)|Stage-consistency suggestion accept rate clears a healthy bar; rejection/expiry stay low|User|
|G 3|The AI reasons with the workspace's own rules|Stage suggestions cite the workspace's stated stage-entry criteria; grounded suggestions accepted at higher rate than ungrounded|Business|
|G 4|Pipeline data managers can trust|Managers report higher confidence in pipeline views; fewer "this deal isn't really at that stage" corrections in review|Business|

_Outputs like "# deal suggestions created" are activity, not goals — leading indicators of G 1, not what success is judged on._

---

## 4. Non-Goals

|Non-goal|Why it's out|
|---|---|
|**Deal strategy / advice** ("discount to close," "this will slip," "escalate to CFO")|Predictive/advisory work belongs to the Pipeline Agent. Deal hygiene fixes _quality_, never recommends _strategy_ — this boundary is the core scope line (§6).|
|**Stage-consistency check before the Knowledge Hub exists**|Stage-consistency needs the stage-movement rules, which live in an attached Knowledge Hub (not yet built). Until the hub ships and a rules-hub is attached, the stage check is dark — non-stage field checks (close date, amount, next step, associations, task state) can still ship.|
|**Per-object enable toggle**|Enabling the Hygiene Agent is wholesale (covers contacts + deals). A per-object switch is added complexity not needed for v 1.|
|**Scheduled pipeline sweep (time-staleness)**|v 1 triggers are activity/association-driven; a deal stale purely by time isn't caught. The periodic sweep is a P 1 fast-follow, not v 1.|
|**Detach/re-attach idempotency**|Solving the re-attach replay case (markers surviving disassociation) is real work not needed for the core flow — explicitly deferred.|
|**Backfilling a new deal from prior conversations (association trigger)**|Deferred this version. v 1 is **forward-only** — it acts only on conversations that happen after the deal exists and the contact is associated; it does not reach back into a contact's pre-deal history. The association trigger and born-stale fix are explicitly out.|
|**Evidence from conversations the owner wasn't in**|Team-selling relaxation (a colleague's meeting filling the owner's deal) is out in v 1 — owner-participation is required. Flagged for later.|
|**Forecast category, lead score, predictive fields**|Not hygiene; belongs to Signals/Pipeline.|

---

## 5. User Stories

**P 0 — v 1**

1. As a deal owner, I want fields updated from a meeting/call/email I was part of with an associated contact, so my deal reflects what was actually said without manual entry.
2. As a deal owner, I want to be told when my stage contradicts the activity — per my team's own stage rules — so my pipeline is honest and I'm not caught out in review.
3. As a deal owner, I want to review and approve every suggested change, so I stay in control of high-stakes deal fields.
4. As a deal owner, I want suggestions only from conversations I participated in, so nothing appears from a meeting I wasn't in.
5. As a deal owner working a multi-threaded deal, I want a shared meeting's content attributed to the right deal, so Deal A isn't filled with Deal B's numbers.
6. As an admin, I want the Hygiene Agent's deal coverage to respect deal ownership and access, so reps only get suggestions on their own deals and never see activity they lack access to.
7. As a consumer of pipeline data (manager), I want accepted suggestions to keep deals accurate, so the pipeline view I rely on is trustworthy.

**P 1 — next**

8. As a deal owner, I want a newly-created deal to pull context from its contacts' prior conversations (association-triggered backfill), so the deal isn't born stale. _(Deferred from v 1; forward-only for now.)_
9. As a deal owner, I want dormant deals (stale by time, no activity) flagged, so silently-rotting deals don't escape the agent. _(Scheduled pipeline sweep.)_
10. As a rep on a team-sold deal, I want a colleague's conversation with an associated contact to update the deal (with me still approving), so team-selling context isn't lost.

**P 2 — future**

11. As a rep, I want detach/re-attach of a contact to not replay already-processed suggestions, so association changes are idempotent.

---

## 6. Requirements

_Everything about **how** the agent works is inherited from the Contact Hygiene PRD and not restated: enable-only activation, owner-scoped runs, two-stage credit guardrail, suggestion object, approve/reject/expire verdicts (no inline edit), no-silent-overwrite, evidence hierarchy, verdict logging, grouped review, empty/duplicate/insufficient-evidence output states. This section specifies only what is **different for deals**._

### Must-Have (P 0)

**R 1 — Expand the existing agent to the Deal object (wholesale enable).** Enabling the Hygiene Agent covers contacts and deals via one switch; no per-object toggle.

- Given a workspace already running Contact Hygiene when this ships, when deal coverage launches, then it is notified before deal suggestions begin appearing.
- Given the agent is enabled, when an eligible deal has evidence, then deal field suggestions are produced.

**R 2 — Quality-not-strategy boundary.** The agent suggests only field quality/consistency fixes, never deal strategy.

- Given evidence shows a field is wrong/missing, then a suggestion is created.
- Given a situation requires judgment about what the rep _should do_ (discount, escalate, forecast), then no suggestion is created (routes to Pipeline Agent).

**R 2 a — Stage-knowledge sources (two, and one is not yet built).** The stage-consistency check draws stage knowledge from two places, because they answer different questions:

- **Settings → pipeline config** — the configured stages and their probability percentages. Tells the agent _what stages exist, their order and weight._ Available today.
- **Knowledge Hub → attached stage-movement rules** — how a deal _should_ move between stages (entry criteria like "Negotiation requires a sent proposal"). This is the judgment the check reasons against. The workspace authors these rules in a hub and **attaches that hub to the Hygiene Agent** (per the agent knowledge-binding model).
- **Hard dependency:** the Knowledge Hub does not exist yet. Until it ships and a stage-rules hub can be attached, the **stage-consistency check cannot run** — the agent has the stages (from Settings) but not the movement rules (from the hub). This supersedes the earlier "L 2 Context stage rules" framing: stage-movement rules live in an **attached Knowledge Hub**, not in L 2 Context.
- _Given no stage-rules hub is attached, when the agent evaluates a deal, then no stage-consistency suggestion is produced (other field checks still run)._

**R 3 — Broader, access-bounded evidence.** Evidence = the deal's own fields + associated-contact activity (calls/meetings/emails) + task state. For the **stage-consistency check specifically**, two grounding sources are needed (see R 2 a): the workspace's **Settings pipeline config** (stages + probability percentages) and the **stage-movement rules attached from a Knowledge Hub** (how a deal should move between stages).

- Given the deal owner lacks access to a linked contact's activity, then that activity cannot feed a suggestion.

**R 4 — Deal eligibility: at least one contact required.** A deal with no associated contact is skipped before reasoning; a company with no contacts does **not** qualify (a company is an org, not a conversation).

- Given a deal with zero associated contacts (regardless of companies), when hygiene evaluates it, then it is skipped and no suggestion is created.

**R 5 — Owner-participation gate.** Evidence is usable only if the deal owner was a participant, AND at least one deal-associated contact was a participant/counterparty.

- Given a conversation the deal owner was not part of, then it produces no suggestion for that deal — even if an associated contact and a colleague were present (v 1).
- Given a meeting with two contacts where only one is associated with the deal, then it is eligible (one associated contact present is enough).

**R 6 — Default-view field scope.** Eligible fields = the fields in the deal's default view, not all fields on the object. View membership makes a field eligible; evidence makes a suggestion happen.

- Given a field outside the default view, then no suggestion is created for it.
- Given a view field with no evidence source, then no suggestion is created for it.
- Given a view field (incl. human-entered custom fields), no-silent-overwrite still applies.

**R 7 — Multi-deal scoping.** When one conversation is evidence for more than one deal (shared contact, or both owners present), the target deal is passed as reasoning input to scope extraction — the agent extracts only what pertains to that deal.

- Given a shared meeting touching Deal A and Deal B, when Deal A is filled, then only Deal-A-relevant content is used; the owner verdict is the backstop.

**R 8 — Triggers (forward-only).** after call · after meeting · after email received · manual run. No association trigger and no scheduled sweep in v 1 — the agent acts only on conversations that occur _after_ the deal exists and the contact is already associated.

- Given a dormant deal with no activity or association change, then it is not auto-evaluated (manual run only).

**R 9 — Object-type in verdict logging.** Verdict logging gains an object-type dimension (contact/deal) so deal accept rates are separable from contact ones.

#### Acceptance-criteria reference — evidence eligibility & field-filling (pseudocode)

The complete logic behind R 4-R 7. Three stages: cheap deal gate, per-evidence eligibility, deal-scoped field-filling.

```
# STAGE 1 — deal-level gate (cheap; before any evidence work)
function dealIsEligible(deal):
    if deal.associatedContacts.isEmpty():
        return false      # no contact = no conversation = no evidence = skip
    return true           # >=1 CONTACT required; a company with no contacts does NOT qualify

# STAGE 2 — is THIS evidence usable for THIS deal?
#   evidence.participants   -> internal users present (reps)
#   evidence.counterparties -> external people (contacts) present / on the thread
function evidenceIsEligible(evidence, deal):
    if deal.owner not in evidence.participants:                 # A: owner must be in it
        return false
    if intersection(deal.associatedContacts.ids(),             # B: an associated contact
                    evidence.counterparties.ids()).isEmpty():  #    must be in it
        return false
    if not deal.owner.canAccess(evidence):                     # C: access ceiling
        return false
    if evidence.olderThan(RECENT_WINDOW) and                   # D: don't reprocess
       not evidence.isUnprocessedFor(deal):
        return false
    return true

# STAGE 3 — collect usable evidence, fill fields (deal-scoped)
function collectDealEvidence(deal):
    if not dealIsEligible(deal): return []
    usable = []
    for contact in deal.associatedContacts:
        for evidence in contact.activity(calls + meetings + emails):
            if evidenceIsEligible(evidence, deal):
                usable.append(evidence)
    return usable

function runDealHygiene(deal):
    evidence = collectDealEvidence(deal)
    if evidence.isEmpty(): return NO_SUGGESTIONS
    for field in deal.defaultViewFields():          # field scope = default-view only
        # `deal` is passed as scoping context, not just the write target:
        # one conversation can touch multiple deals, so extract only what
        # pertains to THIS deal — Deal A never gets Deal B's numbers.
        suggestion = reasonOverEvidence(field, evidence, deal)
        if suggestion and suggestion.confidence >= THRESHOLD:
            createPendingSuggestion(deal, field, suggestion)    # owner verdicts
```

**Case reference (test suite):**

| #   | Situation                                              | Owner in it? | Assoc. contact in it? | Result                                                                        |
| --- | ------------------------------------------------------ | :----------: | :-------------------: | ----------------------------------------------------------------------------- |
| 1   | Owner meets Contact A; A associated                    |      Y       |           Y           | Eligible                                                                      |
| 2   | Owner meets A + B; only A associated                   |      Y       |         Y (A)         | Eligible — one associated contact is enough                                   |
| 3   | Owner meets B only; B not associated                   |      Y       |           N           | Not eligible                                                                  |
| 4   | Colleague (not owner) meets associated A; owner absent |      N       |           Y           | Not eligible in v 1 (owner gate)                                              |
| 5   | Deal has zero contacts                                 |      —       |           —           | Skipped at Stage 1                                                            |
| 5 b | Company but no contacts                                |      —       |           —           | Skipped — company alone doesn't qualify                                       |
| 5 c | 1 contact, no company                                  |  (depends)   |       (depends)       | Passes Stage 1 — company not required                                         |
| 6   | Email: associated A to owner                           |      Y       |           Y           | Eligible                                                                      |
| 7   | Email: associated A to a different rep (not owner)     |      N       |           Y           | Not eligible in v 1                                                           |
| 8   | Owner met A last year; already processed               |      Y       |           Y           | Not eligible — outside window / processed                                     |
| 9   | Owner meets A but lacks access to record               |      Y       |           Y           | Not eligible — access ceiling                                                 |
| 10  | Deals A & B share Contact X; only owner A meets X      | A: Y / B: N  |           Y           | Fills Deal A only — owner gate blocks leak to B                               |
| 11  | Both owners A & B in the same meeting with X           |    both Y    |           Y           | Fills both — each passed their gate; deal-scoped extraction separates content |

### Nice-to-Have (P 1)

- **R 11 — Association-trigger backfill** — associating a contact to a deal evaluates the deal against that contact's recent prior conversations (the deferred born-stale fix). Forward-only in v 1; this makes it backward-reaching.
- **R 11 b — Scheduled pipeline sweep** — periodic pass flagging deals stale by time regardless of activity (closes the time-staleness gap).
- **R 12 — Team-selling evidence** — accept evidence from any internal participant on a deal-associated conversation (not just the owner), suggestions still routing to the owner for verdict.

### Future Considerations (P 2)

- **R 13 — Detach/re-attach idempotency** — processing markers that survive disassociation; withdraw-pending-on-remove; reattach-processes-only-new.
- **R 14 — Full transcript segmentation** — split a multi-deal conversation into per-deal portions before reasoning (beyond deal-scoped extraction).
- **R 15 — Manager verdict/roll-up** — a read-over-suggestions pipeline-integrity view for managers (verdicts still owner-held).

---

## 7. Success Metrics

**Headline (proves G 2/G 3):**

- **Stage-consistency accept rate** — is the star feature trusted or resented? The single number the release is judged on.
- **Grounded-vs-ungrounded acceptance gap** — stage suggestions citing the workspace's own rules vs. any ungrounded suggestion.

**Leading (days–weeks):**

- Deal vs. contact accept-rate split (enabled by the object-type logging dimension) — expect deals lower initially (higher-stakes); watch the gap.
- Approval / rejection / expiry rates per deal suggestion type; time-to-verdict.
- Contact-less deal rate (how many deals fall through the eligibility gate — informs R 4/team-selling decisions).
- Association-trigger yield — suggestions produced from newly-associated contacts (validates G 5).

**Lagging (weeks–months):**

- Pipeline-integrity proxy — reduction in mis-staged / stale-close-date / no-next-step deals on active pipeline.
- Manager-reported pipeline trust.
- Rep time saved on deal cleanup.

**Targets / method:** set success + stretch thresholds once contact-hygiene baselines are in hand; measure via product analytics (suggestion/verdict events dimensioned by object type), evaluated at 1 week (instrumentation), 1 month (accept rates), 1 quarter (pipeline-integrity lagging).

---

## 8. Open Questions

| #   | Question                                                                                                                                                                                         | Owner                         | Blocking?                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- | ----------------------------------- |
| Q 1 | Stage-movement rules — what shape do they take inside a Knowledge Hub, how does the workspace author them, and how does an attached hub feed the stage check? Blocked on Knowledge Hub existing. | Eng + PM (with Knowledge Hub) | Blocking (couples to Knowledge Hub) |
| Q 2 | Default-view fields — which view defines "eligible" with multiple or per-user deal views: workspace default, or the viewing rep's?                                                               | Eng + PM                      | Blocking (field scope)              |
| Q 3 | Contact-less deals — keep the whole-deal gate, or allow self-contained checks (close-date-passed) on deals with no associations?                                                                 | Eng + PM                      | Non-blocking (v 1 gates whole deal) |
| Q 4 | Wholesale-enable carryover — exact notice mechanism for existing hygiene users when deals turn on.                                                                                               | Design + PM                   | Non-blocking                        |
| Q 5 | Scheduled sweep (P 1) — staleness thresholds: per pipeline? sourced from L 2 Context?                                                                                                            | PM                            | Non-blocking (P 1)                  |
| Q 6 | Team-selling (P 1/R 12) — should non-owner-participant evidence ever be accepted, and does it route to the owner only?                                                                           | PM                            | Non-blocking (P 1)                  |

---

## 9. Timeline Considerations

- **Hard dependency (stage check only):** the **stage-consistency check** requires the **Knowledge Hub** (for attached stage-movement rules) plus Settings pipeline config. Knowledge Hub is not yet built, so the stage check ships only once it does. **Non-stage field checks do not depend on the hub and can ship first** — meaning deal hygiene could launch its non-stage fields ahead of the stage star feature if desired.
- **Inherited foundation:** all core agent mechanics come from the shipped Contact Hygiene Agent — this expansion parameterizes rather than rebuilds, so scope is the deal-specific delta only.
- **Suggested phasing:** v 1 = forward-only deal coverage with stage-consistency → P 1 fast-follows = association-trigger backfill + scheduled pipeline sweep + team-selling evidence → P 2 = detach/reattach idempotency, transcript segmentation, manager roll-up.
- **Parking lot (not v 1):** everything in P 2 above, plus forecast/predictive fields (Pipeline Agent territory).
