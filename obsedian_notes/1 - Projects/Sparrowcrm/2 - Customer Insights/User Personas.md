---
status: Active
created: 2026-04-30
updated: 2026-05-04
owner:
tags:
  - sparrowcrm/customer_insights/user_personas
---

# User Personas

> _Who are our users? What do they need, struggle with, and value?_
> 
> Derived from [[Product Vision]], [[Product Strategy]], and codebase analysis of SparrowCRM features (AI capture, enrichment, pipelines, scoring, smart routers).

---

## Persona 1: "Ramesh" — The Frontline [[Sales Rep]]

| Field         | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Role          | Account Executive / SDR                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Company Size  | Mid-market to Enterprise (50–500 employees, 20–200 rep sales team)                                                                                                                                                                                                                                                                                                                                                                        |
| Goals         | Close more deals. Spend time selling, not typing. Walk into every meeting prepared. Know which leads to prioritize without asking the manager.                                                                                                                                                                                                                                                                                            |
| Frustrations  | Spends 60%+ of the day on non-selling tasks. Hates logging calls — by the time they open the CRM, half the details are forgotten. Mandatory fields feel like busywork. Pipeline views are stale because nobody updates them in real time. Gets pinged by managers asking "did you update the CRM?" multiple times a week. Previous CRM (HubSpot/Salesforce) felt like a system built for management reporting, not for helping reps sell. |
| Current Tools | Salesforce or HubSpot (grudgingly), Zoom, Google Calendar, Slack, Gmail, LinkedIn Sales Navigator, personal spreadsheet or Notion doc for deal tracking "because the CRM is never up to date"                                                                                                                                                                                                                                             |
| Quote         | "I know my deals better than any dashboard. The CRM just slows me down — it's a tax on my time, not a tool that helps me close."                                                                                                                                                                                                                                                                                                          |

**What SparrowCRM gives them:** Zero data entry — calls, emails, and meetings auto-captured. AI summary before every meeting. Lead/Fit/Engagement scores tell them who to call next. The CRM gives back more than it takes.

**Key features they touch:** Contact/Company/Deal record pages, AI Summary, Fit Score, Engagement Score, Lead Score, Linked Deals, Email activities, Meeting attendees, Smart Router (web form leads auto-assigned to them).

---

## Persona 2: "Priya" — The [[Sales Manager]]

| Field | Detail |
|-------|--------|
| Role  | Sales Manager / Team Lead (manages 8–15 reps) |
| Company Size | Mid-market to Enterprise (100–500 employees) |
| Goals | Hit the team's quarterly number. Know which deals are real and which are happy ears. Coach reps with evidence, not gut feel. Build a forecast the director will trust. Spend less time chasing reps for CRM updates. |
| Frustrations | Doesn't trust pipeline data — reps update stages inconsistently, deal values are stale, close dates are optimistic. Spends Monday mornings manually rebuilding the forecast from 1:1 notes. Coaching conversations start with "walk me through your pipeline" because the CRM doesn't tell the real story. When a rep leaves, their accounts are a black box — the CRM has the minimum, not the context. |
| Current Tools | Salesforce/HubSpot dashboards (mistrusted), Clari or similar for forecasting (another tool to maintain), Slack for deal updates, Google Sheets for the "real" forecast, Gong/Chorus for call recordings (separate from CRM) |
| Quote | "I ask my reps to update their pipeline every Friday. Half of them do it Sunday night. The other half do it Monday morning — five minutes before our review. That's not data, that's fiction." |

**What SparrowCRM gives them:** Pipeline they can trust because AI keeps it current. Deal stage changes reflect actual conversations, not what the rep remembered to click. Kanban views with real-time aggregations (total value per stage). AI-flagged deal risks before they have to ask. Stage duration analytics show which deals are stalling.

**Key features they touch:** Deal pipeline/Kanban board, Pipeline stage aggregations, Contact/Company associations on deals, Fit Score (to validate deal quality), Timeline/activity history, Team-level list views with filters and sorts.

---

## Persona 3: "Arjun" — The VP / [[Director of Sales]] (The Buyer)

| Field | Detail |
|-------|--------|
| Role  | VP of Sales / Sales Director |
| Company Size | Enterprise (100+ rep sales org, 500+ company) |
| Goals | Revenue predictability — deliver a forecast the CEO can plan around. Increase rep productivity (more selling time = more pipeline). Improve win rates by getting reps better data, not more process. Reduce ramp time for new hires. Justify CRM spend with measurable ROI. |
| Frustrations | Has done the math: reps spend <40% of their day selling. Current CRM (Salesforce) has layers of bolt-on tools (Outreach, Clari, Gong, ZoomInfo) costing $300+ per rep per month — and data is still 40-60% accurate. Every QBR, the forecast is off by 20%+. The board asks hard questions about pipeline confidence and there's no good answer. Tried mandating CRM hygiene — reps resented it, the best performers were the worst at compliance, couldn't penalize them. |
| Current Tools | Salesforce + Clari + Gong + Outreach + ZoomInfo + Slack + Google Workspace — a sprawling, expensive stack where data flows poorly between tools |
| Quote | "My best rep brought in $2M last quarter. Her CRM data is the worst on the team. I can't fire her for bad hygiene and I can't build a forecast around incomplete data. Something has to give." |

**What SparrowCRM gives them:** Data accuracy that actually reaches 85%+ (because AI captures, not humans). Forecast built on real signals from conversations, not manual updates. ROI story: consolidate 3-4 tools into one platform. The premise that sold them: "the system does the work, so humans do the selling."

**Key features they care about (don't use daily):** Fit Score configurator (multi-score, audience-filtered), Pipeline analytics, Forecast accuracy metrics, Data quality dashboards, Integration depth (Zoom, Calendar, Slack, email).

---

## Persona 4: "Deepa" — The [[RevOps]] / Sales Ops Lead (The Implementer)

| Field | Detail |
|-------|--------|
| Role  | Revenue Operations Manager / Sales Operations Lead |
| Company Size | Mid-market to Enterprise (100–500 employees) |
| Goals | Clean data at scale without policing the sales floor. Build the pipeline stages, custom fields, and scoring rules that make the CRM work for this specific org. Ensure the CRM integrates cleanly with the rest of the stack (calendar, email, Slack, billing). Reduce the time spent building workarounds for missing data. Own the data model and make it work for reporting. |
| Frustrations | Spends 30% of their week on data cleanup — deduplicating contacts, fixing pipeline stages, filling in missing fields from call recordings. Builds beautiful dashboards that nobody trusts because the underlying data is garbage. Custom fields go unused because reps don't fill them in. Every new integration is a project — mapping fields, testing syncs, dealing with duplicates. Knows exactly which metrics matter but can't get accurate inputs. |
| Current Tools | Salesforce Admin panel, LeanData or similar for lead routing, Zapier for integrations, Google Sheets for data cleanup, Looker/Tableau for reporting, an unhealthy number of VLOOKUP formulas |
| Quote | "I built the perfect pipeline report. It updates automatically, it has the right metrics, it looks great. The problem is the data going into it is 50% made up. I'm putting lipstick on a pig." |

**What SparrowCRM gives them:** AI enrichment fills contact and company data automatically (job title, seniority, revenue, industry, employee count — 20+ fields from just an email). Smart Routers handle lead-to-record mapping from web forms. Custom fields support 18+ data types without migrations. The EAV attribute system means they can configure new fields and associations without engineering tickets. Bidirectional associations keep data consistent.

**Key features they touch:** Object attributes (custom field configuration), Smart Router setup (web form → CRM mapping), Enrichment settings, Fit/Engagement/Lead Score configurator, Pipeline & stage definitions, Import/bulk operations, Integration configuration, View definitions (filters, sorts, column layouts).

---

## Persona 5: "Vikram" — The [[CEO]] / CRO (The Executive Sponsor)

| Field | Detail |
|-------|--------|
| Role  | CEO / Chief Revenue Officer |
| Company Size | Enterprise (500+ employees) |
| Goals | Revenue confidence — a number they can commit to the board. Understand NRR, pipeline coverage, and sales velocity without asking for a special report. Know that the CRM investment is paying off (consolidation of tools, higher rep productivity). Make hiring and territory decisions based on trustworthy data. |
| Frustrations | Asks "where are we going to land this quarter?" and gets three different answers from three different people. CRM spend is $200K+/year and they can't prove it moves the number. Board meetings require a week of prep because the data doesn't tell a coherent story — it has to be manually assembled and cross-checked. Knows the sales team is bigger than it needs to be if reps spent more time selling, but can't quantify the productivity gap. |
| Current Tools | Board deck (Google Slides), Revenue dashboard (Looker), the "real" forecast spreadsheet the VP maintains, occasional CRM login to spot-check deals |
| Quote | "I don't need another dashboard. I need to know if the $1.2M deal in Stage 4 is real or if we're sandbagging the quarter around a deal that's going to slip. And I need to know that without calling the rep." |

**What SparrowCRM gives them:** The board deck writes itself from real data. Forecast accuracy they can measure and improve over time. Predicted vs. actual win rate proves the tool works. Revenue confidence without the manual assembly process.

**Key features they care about (rarely touch directly):** Executive dashboard/reporting, Forecast vs. actual metrics, Pipeline coverage analytics, NRR tracking. They experience the product through the outputs it produces, not through daily use.

---

## Persona Hierarchy & Buying Dynamics

```
CEO/CRO (Vikram) ──── Executive sponsor. Signs the check.
  │                    Cares about: revenue confidence, ROI
  │
VP of Sales (Arjun) ── The buyer. Champions internally.
  │                     Cares about: forecast accuracy, rep productivity
  │
Sales Manager (Priya) ─ The middle layer. Must see pipeline value.
  │                      Cares about: trustworthy data, coaching insights
  │
Sales Rep (Ramesh) ──── The daily user. Adoption lives or dies here.
  │                      Cares about: less admin, more selling help
  │
RevOps (Deepa) ──────── The implementer. Configures and maintains.
                         Cares about: data quality, integrations, flexibility

```

The buying motion is top-down (Arjun champions, Vikram approves budget) but adoption is bottom-up (if Ramesh doesn't use it, the data is still garbage and the product fails). Deepa is the kingmaker — she evaluates the product technically and owns the migration/setup. If she says no, it doesn't happen.

---

**Related:** [[2 - Customer Insights]] | [[1 - Projects/Sparrowcrm/2 - Customer Insights/Friction Points]] | [[Product Strategy]]
