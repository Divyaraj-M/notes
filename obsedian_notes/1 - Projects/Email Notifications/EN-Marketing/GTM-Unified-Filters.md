---
owner: "[[@Divyaraj Murugan]]"
tags:
  - gtm
  - marketing
status: draft
date: 2026-06-02
related:
  - "[[prd-sparrowcrm-unified-filters]]"
  - "[[filters_v1]]"
  - "[[Sparrowcrm]]"
  - "[[Native SparrowCRM for GPT]]"
  - "[[Import_v1]]"
  - "[[1-Product Vision]]"
  - "[[2-Product Strategy]]"
  - "[[Email Integration_v1]]"
  - "[[Email_v1]]"
  - "[[Email_Integrations_v2-Historical Import]]"
  - "[[Sparrowdesk_v1]]"
  - "[[Product Vision]]"
  - "[[Routine]]"
  - "[[Workflows_v1]]"
  - "[[2025-12-12]]"
---

# GTM Strategy — SparrowCRM Unified Filter System

> A senior PMM's launch plan for shipping unified, cross-object filtering with first-class saved views in SparrowCRM. Grounded in `prd-sparrowcrm-unified-filters.md`.

## 1. The one-line positioning

**"Filter once. Filter everywhere. Save it forever."**

SparrowCRM is the only CRM where the same filtering muscle memory works on every object — Deals, Contacts, Companies, Accounts, custom objects — and every view you build is one click away tomorrow.

The wedge isn't "we added filters." Every CRM has filters. The wedge is **consistency + durability**: one operator vocabulary across all objects, plus saved views that survive refresh, navigation, and devices. That kills the two behaviors we're actually competing against — relearning the UI per object, and exporting to spreadsheets.

## 2. What we're really selling (the narrative shift)

Don't market the feature. Market the behavior change.

- **Old world:** Learn the CRM 3–4 times. Export to Sheets to do real slicing. Ask RevOps for a report and wait.
- **New world:** Build the exact slice you need in under 3 seconds, on any object, and reopen "my book of business" every morning with one click.

The villain in our story is **the spreadsheet export** — the quiet admission that the CRM couldn't answer the question. Our counter-metric (export usage ↓25%) is also our marketing proof point. We will literally tell the market: *if your CRM still sends you to a spreadsheet, it's failing you.*

## 3. Audience & message-by-persona

| Persona | Their pain | The promise | Proof / hook |
|---|---|---|---|
| **Sales rep** | Re-filtering before every pipeline review; losing context on refresh | "Your hot deals, one click, every morning." | `is me`, saved views, <90s time-to-first-filter |
| **RevOps lead** | Can't standardize segments across objects; lives in exports | "Define a segment once; the same definition works everywhere." | 5-condition filter in <30s, identical operators per type |
| **CS manager** | Can't audit coverage of top accounts cleanly | "Find at-risk renewals and coverage gaps without a data request." | Date operators (`is in the last 30 days`) + tier filters |
| **Economic buyer (RevOps/Sales leader)** | Tool sprawl, slow ramp, shadow spreadsheets | "Faster rep ramp, fewer exports, cleaner pipeline reviews." | Ramp time, export reduction, adoption of saved views |

Lead with the **sales rep** emotionally (control over their book), sell the **RevOps lead** rationally (standardization), and close the **buyer** on ramp + consolidation.

## 4. Positioning against alternatives

- **Vs. legacy CRMs (Salesforce/HubSpot list views):** Powerful but inconsistent and intimidating; per-object relearning. Our angle: *power without the learning tax.*
- **Vs. spreadsheet exports (the real competitor):** Stale the moment they're created, no shared definition. Our angle: *the slice stays live and reopenable.*
- **Vs. "modern CRM" challengers (Attio, Folk):** They have clean filtering too — so we don't claim novelty, we claim **breadth + saved-view durability across every object including custom ones**, plus the predictable operator vocabulary as a trust signal.

Differentiation claim we can defend: **one operator vocabulary, every object, zero drift** — backed by the PRD's fixed type→operator matrix. That's a concrete, demoable, hard-to-copy-quickly promise.

## 5. Launch tiering

This is a platform-level UX improvement, not a flashy net-new module — so calibrate the launch to a **Tier 2 (notable) launch** with a Tier 1 narrative wrapper for the buyer story.

- **Tier 1 energy** for the *story* ("we rebuilt how you work with your data") — exec blog, webinar, sales enablement.
- **Tier 2 mechanics** for the *feature* — in-app announcement, changelog, help docs, lifecycle email.

## 6. Phased rollout (mirrors the PRD sequencing)

| Phase | Audience | Marketing motion | Goal |
|---|---|---|---|
| **Internal beta** | RevOps + 3 design partners | Capture quotes, before/after clips, time-saved data | Build proof assets |
| **Closed beta** | 10–15 hand-picked accounts | Office hours, feedback loop, case-study seeding | 2–3 referenceable customers |
| **GA — Deals first** | All users, gated by object rollout | In-app tour, "Saved views 101" email, changelog | Activation: ≥1 saved view |
| **Full GA** | All objects incl. custom | Blog, webinar, social, lifecycle nurture | ≥3 saved views / active user (30d) |

Tie the marketing rollout to the **engineering object-by-object rollout** so we never market a capability that isn't live on a user's object yet — the fastest way to burn trust.

## 7. Channels & assets

**Owned (do these regardless of budget):**
- **In-app:** product tour on first list view, contextual tooltip on the Filter button, empty-state nudge ("Save this as a view"). This is the single highest-ROI channel for an in-product feature — adoption lives or dies here.
- **Lifecycle email:** 3-touch sequence — (1) "Filtering just got an upgrade," (2) "Build your first saved view in 90 seconds," (3) "RevOps power moves: the 5-condition filter."
- **Changelog + help center:** R-by-R coverage, GIFs per field type, `is me` and saved-views explainers.
- **Blog:** founder/PM voice — "Why we rebuilt filtering as one component" (the structural-problem narrative; engineering credibility for the buyer).

**Earned / amplified:**
- Short demo clips (Loom/social): "Open deals, owned by me, in Negotiation — in 3 seconds." One clip per persona.
- Webinar: "Stop exporting to spreadsheets" — live RevOps playbook build.
- Sales enablement: battlecard (vs. exports, vs. Salesforce list views) + demo script.

**Don't over-invest in:** paid acquisition for this. It's an expansion/retention story, not a top-of-funnel one. Spend the budget on in-app + lifecycle.

## 8. Messaging hierarchy

- **Tagline:** *Filter once. Filter everywhere. Save it forever.*
- **Pillar 1 — Consistency:** Same operators on every object. Learn it once.
- **Pillar 2 — Speed:** Add a condition in under 3 seconds; results in under 500ms.
- **Pillar 3 — Durability:** Saved views survive refresh, navigation, and devices — your slice is always one click away.
- **Pillar 4 — No more exports:** Do the slicing in the CRM, on live data.

## 9. Success metrics (marketing-owned, mapped to PRD)

| Marketing metric | Source | Target |
|---|---|---|
| Feature awareness (in-app announcement CTR) | Product analytics | ≥ 25% |
| Activation: % users with ≥1 saved view (30d) | `view_saved` | ≥ 60% (PRD target) |
| Depth: saved views per active user (30d) | analytics | ≥ 3 (PRD target) |
| Export reduction | `list_exported` | ↓ ≥ 25% (PRD counter-metric) |
| Beta → reference conversion | CRM | ≥ 3 referenceable customers |
| Webinar → activation lift | cohort compare | measurable lift vs. control |

The beauty here: **PRD success metrics and PMM success metrics are the same metrics.** Adoption *is* the marketing win. Align the launch dashboard to the PRD's §7 so PM and PMM read one scoreboard.

## 10. Risks & how marketing handles them

- **Perceived regression** if legacy filter state isn't migrated → coordinate messaging with the Eng translation script; never announce GA on an object before migration lands. Frame as "your existing filters, upgraded."
- **"It's just filters" yawn** → lead with the behavior/villain narrative (kill the export), not the feature list.
- **Uneven rollout confusion** → object-by-object in-app messaging; only surface the announcement on objects where it's live.
- **Mobile gap** (v1 is read-only on mobile) → set expectations in docs; position as "build on desktop, check anywhere."

## 11. First two weeks after GA (the part most launches skip)

PRD commits to weekly evaluation in the first 30 days. Marketing mirrors it:
- **Week 1:** Watch filter-build completion + time-to-first-filter. If red, the in-app tour is the lever — iterate copy/placement before scaling email.
- **Week 2:** If leading metrics are green, fire the webinar + blog amplification. If red, hold amplification and ship a UX/onboarding iteration first (matches PRD's "ship a UX iteration before measuring lagging target").

---

### TL;DR for a stakeholder
We're not launching "filters." We're launching the end of relearning the CRM and the end of exporting to spreadsheets. Lead in-app and via lifecycle (not paid), roll out messaging object-by-object in lockstep with engineering, and judge success on the exact same adoption metrics the PRD already commits to: 60% of users with a saved view, 3+ views per user, and a 25% drop in exports within 30 days.
