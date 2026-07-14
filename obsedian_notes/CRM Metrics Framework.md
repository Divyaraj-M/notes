---
related:
  - "[[6 - Metrics & Dashboards]]"
  - "[[1-Product Vision]]"
  - "[[2-Product Strategy]]"
  - "[[Steps to create it]]"
  - "[[ECHS – Knowledge Transfer (KT) Document]]"
  - "[[Agents in CRM]]"
  - "[[Elastic Search]]"
  - "[[CRM Intelligence]]"
  - "[[Product Management - Top Deliverables]]"
  - "[[Metrics & Dashboards]]"
  - "[[EN-Metrics & Dashboards]]"
  - "[[Product Management - Top Deliverables]]"
  - "[[First-Principles Product Template]]"
  - "[[README]]"
  - "[[Obligations]]"
---
# CRM Metrics Framework — Working Doc

> **Stage:** Pre-launch / Early Beta
> **Product:** SurveySparrow CRM
> **Audience:** Founders/PM (for thinking), Product+Eng (for instrumentation), Leadership (for review)
> **Status:** Living doc — iterate as we learn
> **Last updated:** 2026-05-14

---

## 0. How to read this doc

This is a **thinking doc**, not a dashboard spec. The goal is to figure out, in order:

1. **What is the one number that, if it goes up, means we are winning?** → North Star
2. **What are the 3–6 things that, when they move, make the North Star move?** → L1
3. **What are the operational levers under each L1?** → L2
4. **What are the input metrics our team actually controls day-to-day?** → L3
5. **Which of these do we track now (beta) vs. later (scale)?** → Phasing
6. **What decision does each metric trigger?** → If a metric doesn't drive a decision, kill it.

If you only have 10 minutes, read **Sections 2, 3, and 9**.

---

## 1. The Mental Model

### 1.1 Why most metrics dashboards fail

They measure, but they don't explain. A metric is only useful if:

- **It is causally linked** to something we care about (revenue, retention, value delivered).
- **We can act on it.** "Number of contacts" goes up — so what? Do we ship something? Hire someone? Kill a feature?
- **It is sensitive** to product changes within a reasonable window (days/weeks, not years).
- **It is hard to game** without also creating real value. (If a rep can pump the metric without doing real work, it's a vanity metric.)

### 1.2 The four metric questions

For every metric we propose, we ask:

1. **What does this measure?** (definition, formula)
2. **Why does it matter?** (causal story — what does moving this *mean*?)
3. **What action does it trigger?** (if it drops 10%, what do we do?)
4. **At what cadence do we review it?** (real-time, daily, weekly, monthly, quarterly)

If we can't answer all four, we don't track it yet.

### 1.3 Inputs vs Outputs (the most important distinction)

|         Type         |                      What it is                      |                 Example (CRM)                  |            Who controls it            |
| :------------------: | :--------------------------------------------------: | :--------------------------------------------: | :-----------------------------------: |
| **Output / Lagging** |                Result of past actions                |          Revenue, Retention, Win rate          | Nobody directly — emerges from inputs |
| **Input / Leading**  | Behavior we drive *now* that creates outputs *later* | Demos booked, Activities logged, Deals updated |      Product team & users daily       |

**Rule:** Set goals on outputs, manage on inputs. North Stars sit at the boundary — they're outputy enough to matter, inputty enough to be moveable.

---

## 2. North Star Metric (NSM)

### 2.1 What a NSM must be

A North Star is **one metric** (rarely two) that:

- Captures the core value the product delivers to the customer
- Predicts long-term business success (retention, revenue) — but is faster-moving than revenue itself
- Is sensitive to product changes
- Every team can connect their work to it

### 2.2 NSM candidates for a CRM (and why each one is/isn't right)

|                   Candidate                    |                                   What it measures                                    |                                      Pro                                       |                               Con                               |                             Verdict                              |
| :--------------------------------------------: | :-----------------------------------------------------------------------------------: | :----------------------------------------------------------------------------: | :-------------------------------------------------------------: | :--------------------------------------------------------------: |
|             **Revenue (ARR/MRR)**              |                                 $ from CRM customers                                  |                                 Ultimate truth                                 |  Too lagging, can't move it weekly, dominated by sales motion   |               ❌ Use as L0/business metric, not NSM               |
|           **Total contacts created**           |                                 Records in the system                                 |                                 Easy to count                                  |     Pure vanity — bulk imports inflate it, no value signal      |                    ❌ Track as health, not NSM                    |
|                 **DAU / WAU**                  |                                Unique logged-in users                                 |                                    Standard                                    | Doesn't distinguish "doing real work" from "logged in to check" |                   ❌ Component of NSM, not NSM                    |
| **Activities logged per active user per week** |                        Calls, emails, notes, meetings recorded                        |                             Behavioral, sensitive                              |          Can be gamed; doesn't directly tie to outcome          |                      ⚠️ Strong L1 candidate                      |
|   **Weekly Active Deals Progressed (WADP)**    | # of deals that had stage change OR activity logged in last 7 days, by an active user | Captures value delivered (deal movement) + activity + freshness. Hard to game. |                      Definition needs care                      |                  ✅ **RECOMMENDED PRIMARY NSM**                   |
|         **Weekly Engaged Workspaces**          |      # of customer workspaces with ≥N active users AND ≥M deals progressed in 7d      |                          Org-level — what we sell to                           |                  Lagging vs. user-level metric                  | ✅ **RECOMMENDED SECONDARY NSM** (especially for leadership view) |

### 2.3 The recommendation

> **Primary NSM:** **Weekly Active Deals Progressed (WADP)**
> A deal counts if, in the trailing 7 days, it had a stage change OR an activity logged against it by a human user.
>
> **Secondary NSM:** **Weekly Engaged Workspaces (WEW)**
> A workspace counts if it has ≥2 active users AND ≥10 WADP in the trailing 7 days.

**Why this combination works:**

- **WADP** is the user-level "value created" signal. If reps are progressing deals, the CRM is doing its job.
- **WEW** is the account-level "this customer is sticky" signal. We sell to workspaces; we keep workspaces.
- They move at different speeds. WADP shifts in days; WEW shifts in weeks. Together they give us early warning + ground truth.

### 2.4 What success looks like at each stage

|    Stage     | WADP per active user / week | WEW as % of paid workspaces |    Implication     |
| :----------: | :-------------------------: | :-------------------------: | :----------------: |
|     Beta     |             3–5             |      n/a (no paid yet)      | Activation working |
| Early growth |             5–8             |            40%+             |     PMF signal     |
|   Scaling    |            8–15             |            65%+             | Healthy retention  |
|    Mature    |             12+             |            75%+             |   Best-in-class    |

(These are directional. Calibrate against actual beta data — don't hard-code targets before we have a baseline.)

---

## 3. The Metric Tree (L0 → L3)

### 3.1 Visual

```
L0  BUSINESS OUTCOME
    └── ARR / Net Revenue Retention / Gross margin

L1  NORTH STAR (and its direct drivers)
    └── WADP (Weekly Active Deals Progressed)
         ├── # of Weekly Active Users (WAU)
         ├── Deals Progressed per Active User per Week
         └── # of Active Workspaces

L2  CONTRIBUTING DRIVERS (the things that move L1)
    ├── ACQUISITION → New signups, Activated workspaces
    ├── ACTIVATION  → Time to first deal, % reaching "aha"
    ├── ENGAGEMENT  → Sessions/wk, Features used, Activities/deal
    ├── RETENTION   → Wk-over-wk return rate, churn
    ├── EXPANSION   → Seats added, modules unlocked, upgrades
    └── QUALITY     → Data completeness, dedup rate, sync health

L3  OPERATIONAL INPUTS (what we ship & change)
    ├── Onboarding completion %, Imports succeeded
    ├── Email sync setup rate, Calendar connected %
    ├── Mobile sessions, Bulk edit usage, Workflow runs
    ├── NPS, CSAT on key flows
    ├── Page load p95, Error rate, API latency
    └── Support tickets / 100 active users
```

### 3.2 The same thing, but explained

**L0 (Business)** answers: *Are we a real business?*
Owned by leadership. Measured monthly/quarterly. Examples: ARR, NRR, GM, CAC payback. We don't move these directly — they emerge.

**L1 (North Star + Direct Drivers)** answers: *Are users getting value?*
Owned by Product leadership. Reviewed weekly. WADP is the headline; WAU + WADP-per-user + Active Workspaces are its three multiplicative inputs:

> **WADP = WAU × (Deals Progressed / Active User) × (...rolled up across all workspaces)**

**L2 (Contributing Drivers)** answers: *Why is L1 moving?*
Owned by individual squads (Acquisition squad owns acquisition metrics, etc.). Reviewed weekly. These are the **AARRR-like buckets** plus quality.

**L3 (Operational Inputs)** answers: *What are we changing this sprint?*
Owned by feature teams. Reviewed daily/per-sprint. These are the things engineers and PMs see in their dashboards.

### 3.3 The decomposition logic (this is the part most people get wrong)

A metric tree is not a *bucket list* — it is a **causal chain**. Each parent should be **mathematically decomposable** into its children. Example:

```
WADP
  = Σ(workspace) Active Users in workspace × Avg Deals Progressed per Active User

Active Users in workspace
  = New Activated Users this week  +  Returning Users this week
  =  (Signups × Activation Rate)  +  (Last-week's actives × Retention Rate)

Deals Progressed per Active User
  = (Activities Logged per User) ÷ (Activities per Deal Progression)
  = function of (workflow usage, email sync, mobile usage, ...)
```

When a metric drops, you walk the tree. You never have to ask "why did it drop?" in a vacuum — you ask "which child node dropped?" and recurse.

---

## 4. The Full Metric Taxonomy

This is the universe. Most products don't need all of these — but you need to *know* about all of them to choose well.

### 4.1 Acquisition metrics

**What they measure:** How efficiently we get new humans/workspaces into the funnel.

|             Metric             |                      Formula / Definition                       |       Why it matters        |
| :----------------------------: | :-------------------------------------------------------------: | :-------------------------: |
|      Visitors / Sessions       |                Unique visitors to marketing site                |    Top of funnel volume     |
|       Signup conversion        |                       Signups ÷ Visitors                        | Marketing → product handoff |
|      Signups (workspace)       |                     New workspaces created                      |    Account-level volume     |
|         Signups (user)         |                   New users in any workspace                    |      Seat-level volume      |
|           Source mix           | Signups split by channel (organic, paid, referral, integration) |         Channel ROI         |
|              CAC               |             $ spent acquiring ÷ # acquired (paying)             |       Unit economics        |
| Lead → Trial → Paid conversion |                     Stage-wise funnel rates                     |      Funnel diagnosis       |

**Beta priority:** ⚠️ Low-medium. We're not optimizing acquisition until we have activation working.

### 4.2 Activation metrics

**What they measure:** Do new users reach the "aha moment" — the point where they understand the value?

For a CRM, "aha" candidates:
- First deal created AND first activity logged on it
- Email/calendar synced AND first contact auto-enriched
- First pipeline view configured AND opened 2nd time
- First teammate invited and active

|         Metric         |                  Formula                  |                             Notes                              |
| :--------------------: | :---------------------------------------: | :------------------------------------------------------------: |
|  **Activation rate**   | % of signups that hit "aha" within X days | Define aha rigorously — this is the most important beta metric |
| **Time to activation** |      Median hours from signup → aha       |  Lower is better, but watch for shortcuts that hurt retention  |
| Onboarding completion  |          % completing each step           |                    Diagnostic, not the goal                    |
|    First-deal time     |  Hours from signup to first deal created  |                    Component of activation                     |
|  First-week retention  |            % returning Day 1–7            |                  Predicts long-term retention                  |

**Beta priority:** 🔥 **HIGHEST.** Activation is the single most important thing in beta. If activation breaks, nothing else matters.

### 4.3 Engagement metrics

**What they measure:** Are activated users coming back, doing more, going deeper?

| Metric                            | What it tells you                                              |
| --------------------------------- | -------------------------------------------------------------- |
| WAU / MAU                         | Stickiness ratio (>20% = sticky)                               |
| Sessions per user per week        | Frequency of use                                               |
| Session duration                  | Depth per session (careful — long sessions can mean confusion) |
| Features used per user (breadth)  | Are they exploring?                                            |
| Power user %                      | Users hitting top decile of activity                           |
| Activities logged per active user | Behavioral output                                              |
| Deals updated per user            | Behavioral output, CRM-specific                                |
| % users on mobile                 | Multi-surface adoption                                         |

**Beta priority:** 🔥 High. After activation, this is what we watch.

### 4.4 Retention metrics

**What they measure:** Do users keep coming back? Do workspaces keep paying?

| Metric | Definition |
|---|---|
| **D1 / D7 / D30 retention (user)** | % of cohort returning on those days |
| **WoW user retention** | Week-on-week active user retention |
| **Workspace logo retention** | % of paid workspaces still paid N months in |
| **Net Revenue Retention (NRR)** | (Starting ARR + Expansion − Contraction − Churn) ÷ Starting ARR |
| **Gross retention** | NRR without expansion |
| **Curve shape** | Does the retention curve flatten? (PMF signal) |

**Beta priority:** 🔥 High for user retention. NRR is N/A (no revenue yet).

**Note:** Retention is the most predictive metric in software. A flat retention curve = PMF. A curve that decays to zero = no PMF, no amount of acquisition will fix it.

### 4.5 Revenue / Monetization metrics

| Metric | When it matters |
|---|---|
| MRR / ARR | Always (post-launch) |
| ARPU / ARPA | Pricing power |
| LTV | LTV:CAC > 3 = healthy |
| Payback period | < 12 months = healthy SMB |
| Expansion MRR | NRR driver |
| Contraction / Downgrade MRR | NRR drag |
| Churn MRR | Bleed rate |
| Conversion: trial → paid | Funnel terminus |

**Beta priority:** ⚪ N/A — not monetizing yet. Track shadow pricing signals (who *would* pay, asked for invoicing, etc.) qualitatively.

### 4.6 Referral / Virality metrics

| Metric | Formula |
|---|---|
| K-factor | Invites sent × Conversion rate of invites |
| Viral cycle time | Days from new user → new user invited by them |
| Referral % | % of signups from existing-user invites |
| Teammate invite rate | % of activated users who invite ≥1 teammate |

**Beta priority:** ⚠️ Medium. Teammate invites are the easy/important one — CRMs are team products. Track that. External referrals are nice-to-have.

### 4.7 Quality / Health metrics

These are the **boring ones nobody talks about until they blow up.**

| Metric | What breaks if it's bad |
|---|---|
| **Data completeness** (% records with email + name + phone) | CRM useless if data is junk |
| **Duplicate rate** | Reps lose trust |
| **Sync success rate** (email, calendar, integrations) | Daily user experience |
| **API latency p50/p95/p99** | Felt latency on common actions |
| **Error rate** | Felt reliability |
| **Page load time** | Felt speed |
| **Support tickets / 100 active users** | Cost & UX signal |
| **Time-to-first-response (support)** | Quality of care |

**Beta priority:** 🔥 High. Quality bugs in beta destroy trust permanently.

### 4.8 Guardrail / Counter-metrics

These are the **"don't move the NSM at the expense of..."** metrics. Every NSM has them.

If our NSM is WADP, the things we must NOT degrade in order to move it:

| Guardrail | Why |
|---|---|
| Data quality (dupe rate, completeness) | Could goose WADP by encouraging junk |
| User-reported satisfaction (NPS / CSAT) | Could goose WADP by spamming reminders |
| Time to complete core actions | Could goose WADP by adding clicks |
| Support ticket rate | Could goose WADP by hiding problems |
| Error rate | Reliability floor |

**Always pair NSM movements with guardrail checks.** Win = NSM up AND guardrails flat/up. Anything else is suspicious.

### 4.9 Qualitative signals (not "metrics" but track them)

- NPS verbatims, support tickets, sales call transcripts, churn reasons
- Feature request frequency (heatmap of asks)
- Sentiment from interviews

In beta, **qualitative beats quantitative.** Small N means high noise. A 30-min call > a chart with 12 data points.

---

## 5. Leading vs Lagging Indicators

Most teams get this backwards. They set OKRs on lagging metrics they can't move, then wonder why nothing happens.

| Lagging (output) | Corresponding Leading (input) |
|---|---|
| Revenue | Demos booked, Trials started |
| NRR | Active workspaces, Seats added, Workflow usage |
| Churn | D30 retention, Last-activity recency, Health score drop |
| Win rate | Activities per deal, Multi-threading depth |
| LTV | D90 retention, Expansion behavior |
| Brand | Organic signups, Direct visits |

**Operating principle:** Forecast on lagging, manage on leading. Your weekly review should be mostly leading metrics. Quarterly review can be lagging.

---

## 6. CRM-Specific Metric Catalog

The full list of things we *could* measure for a CRM. Marked by phase priority.

### 6.1 Funnel / Lifecycle

|               Metric               | Beta | Growth | Scale |
| :--------------------------------: | :--: | :----: | :---: |
| Marketing site → Signup conversion |  🟡  |   🔥   |  🔥   |
|     Signup → Workspace created     |  🔥  |   🔥   |  🔥   |
|   Workspace created → First deal   |  🔥  |   🔥   |  🔥   |
| First deal → First activity logged |  🔥  |   🔥   |  🔥   |
| First teammate invited (under 7d)  |  🔥  |   🔥   |  🔥   |
|        Email sync connected        |  🔥  |   🔥   |  🔥   |
|     First pipeline customized      |  🟡  |   🔥   |  🔥   |
|  First workflow / automation set   |  🟡  |   🔥   |  🔥   |

### 6.2 Usage breadth (per active user / per workspace)

- Modules used (deals, contacts, pipelines, reports, automations, mobile)
- Avg # of pipelines per workspace
- Avg # of custom fields per workspace
- Reports/dashboards created
- Filters/views saved

### 6.3 CRM-native value metrics

| Metric | Why it's CRM-specific |
|---|---|
| **Pipeline value managed** | Sum of $ in open deals across workspaces — the literal scope of work the CRM holds |
| **Deals moved/stage/week** | Velocity at each pipeline stage |
| **Win rate** | % of closed deals won — *use carefully, depends on user-reported "won"* |
| **Sales cycle length** | Median days from deal-created → deal-closed |
| **Activities per deal** | Touches per opportunity (avg & by stage) |
| **Multi-threading depth** | # contacts per deal — strong predictor of close |
| **Time in stage** | Where deals are getting stuck |
| **Forecast accuracy** | Predicted close vs. actual (advanced) |

### 6.4 Data quality

| Metric | Definition |
|---|---|
| Contact completeness score | % of fields populated, weighted |
| Duplicate rate | % records flagged as likely duplicate |
| Stale data % | Records not touched in 90+ days |
| Bounce rate (emails) | Bad email addresses surfaced |
| Sync conflict rate | Conflicting updates from integrations |

### 6.5 Collaboration / Team

| Metric | Why |
|---|---|
| Active seats per workspace | Multi-user product = stickier |
| Mentions / comments per week | Real collaboration vs. parallel siloed use |
| Handoffs (re-assignments) per deal | Process maturity |
| Manager dashboard views | Stickiness for the buyer persona |

### 6.6 Integrations

| Metric | Definition |
|---|---|
| % workspaces with ≥1 integration | Stickiness multiplier |
| % users with email sync on | Daily-use anchor |
| % users with calendar sync on | Daily-use anchor |
| Integration error rate | Reliability of the most painful surface |

### 6.7 Automation / Workflow

| Metric | Definition |
|---|---|
| Workflows created per workspace | Adoption of differentiated value |
| Workflow runs / week | Output of automations |
| % of activities created by automation | Where value is being generated automatically |

---

## 7. Pre-launch / Beta Playbook: What to track NOW

**Principle for beta:** *Track the smallest set that lets you answer the three beta questions.*

The three beta questions:

1. **Are users reaching value?** → Activation funnel + Time to first deal + First-week retention
2. **Are they coming back?** → D7 / WoW retention + WAU/MAU
3. **What is breaking?** → Error rate, top support topics, NPS verbatims

### 7.1 Minimum viable instrumentation for beta

These ~15 metrics are non-negotiable from day 1:

| # | Metric | Cadence | Owner |
|---|---|---|---|
| 1 | Signups (user + workspace) | Daily | Growth |
| 2 | Activation rate (define rigorously — see §4.2) | Weekly | Product |
| 3 | Time to first deal | Weekly | Product |
| 4 | % users with email sync within 7d | Weekly | Product |
| 5 | % workspaces with ≥2 active users in 7d | Weekly | Product |
| 6 | WAU | Daily | Product |
| 7 | **WADP (NSM)** | Weekly | Product (HEAD) |
| 8 | W1 / W4 retention curves by signup cohort | Weekly | Product |
| 9 | Deals created per active user | Weekly | Product |
| 10 | Activities logged per active user | Weekly | Product |
| 11 | Error rate / Crash-free sessions | Daily | Eng |
| 12 | p95 latency (top 5 endpoints) | Daily | Eng |
| 13 | Support tickets per 100 actives | Weekly | Support+PM |
| 14 | NPS (in-product survey at D14) | Monthly | Product |
| 15 | Qualitative interviews completed | Weekly | Product |

### 7.2 What to deliberately NOT track yet

- ❌ Revenue, ARPU, LTV — no revenue yet
- ❌ CAC, channel ROI — not optimizing acquisition
- ❌ Brand metrics, share of voice — too early
- ❌ Dashboards-per-user, custom field count — premature
- ❌ Forecast accuracy — needs months of data
- ❌ Cohort LTV curves — needs months of data

> **The single biggest beta mistake** is tracking everything from day one. You drown in numbers, none of them have enough signal, and you can't tell which way to move.

### 7.3 Phasing — when each metric "turns on"

```
BETA  (now)            Activation, basic retention, qualitative, error rate
  ↓
EARLY GROWTH (PMF)     + Acquisition channels, viral coefficient, NRR proxies
  ↓
SCALING                + Revenue metrics, expansion, full retention cohorts
  ↓
MATURE                 + Forecast accuracy, LTV curves, predictive churn scores
```

---

## 8. Decisions Each Metric Should Drive

A metric without a decision is decoration. Examples of the decision-coupling:

| Metric drops by X% | We should... |
|---|---|
| Activation rate drops 10% w-o-w | Audit the last 5 onboarding sessions on video, ship a fix within 2 weeks |
| WADP drops while WAU is flat | Investigate per-user behavior — are they using the product but not doing the *one thing*? |
| WAU drops while WADP-per-user is flat | Acquisition or retention problem, not engagement — check signup numbers & cohort returns |
| Email-sync setup rate drops | Hot bug; fix in current sprint |
| D7 retention drops for new cohorts | Onboarding broke. Activation root cause. |
| Error rate spikes | Stop current work, triage |
| NPS verbatims trend on one feature | Schedule deep-dive interviews this week |

**Operating cadence:**

- **Daily** standup: error rate, latency, signups (5-min scan)
- **Weekly** product review: NSM, L1, L2 — read the tree top-down. Discuss anomalies.
- **Monthly** business review: L0 + retention cohorts + qualitative summary
- **Quarterly**: strategy review — are these still the right metrics?

---

## 9. The Tree — One Page Summary

```
L0  Long-term business success
    └── ARR, NRR, Gross margin, CAC payback

L1  North Star: WEEKLY ACTIVE DEALS PROGRESSED (WADP)
    Secondary: Weekly Engaged Workspaces (WEW)

    Decomposed mathematically as:
    WADP = (# Active Workspaces) × (Active Users per Workspace) × (Deals Progressed per Active User)

L2  THE 6 BUCKETS  (each one moves one factor of L1)

   ACQUISITION       → Drives # Active Workspaces (new ones)
     - Workspace signups
     - Source mix
     - Visitor → signup conversion

   ACTIVATION        → Drives Active Users per Workspace (new ones)
     - % users hitting aha within 7d
     - Time to first deal
     - Onboarding completion

   ENGAGEMENT        → Drives Deals Progressed per Active User
     - Sessions per active user
     - Activities logged per active user
     - Features used (breadth)

   RETENTION         → Drives all three (returning active workspaces + users)
     - D7, D30 user retention
     - WoW workspace retention
     - Cohort curve shape

   EXPANSION         → Drives # Active Workspaces (deeper) + Users per Workspace
     - Seats added per workspace
     - Teammate invite rate
     - Module unlock rate

   QUALITY/HEALTH    → Floor under all of the above (don't let it slip)
     - Error rate, latency, sync success
     - Data completeness, dedup rate
     - Support tickets per 100 actives

L3  OPERATIONAL INPUTS  (what teams change each sprint)
    - Onboarding flow A/B tests, copy, defaults
    - Email/calendar OAuth flow polish
    - Mobile push notifications
    - Workflow templates
    - In-app prompts at the activation moment
    - Performance optimizations, error fixes
```

---

## 10. Instrumentation Notes (How we actually capture these)

### 10.1 The data model required

We need three streams:

1. **Identity** — Who is the user? Which workspace? (`identify` calls)
2. **Group/Account** — Workspace properties: plan, seats, created date, integrations active. (`group` calls)
3. **Events** — What did they do, when? (`track` calls)

### 10.2 Core events to capture (beta)

| Event | Properties |
|---|---|
| `Signed Up` | source, plan, role, workspace_id, invited_by |
| `Workspace Created` | workspace_id, owner_id, plan |
| `Onboarding Step Completed` | step, time_since_signup |
| `Deal Created` | deal_id, source (manual/import/automation), stage |
| `Deal Stage Changed` | from_stage, to_stage, value, owner_id |
| `Activity Logged` | type (call/email/note/meeting), deal_id, contact_id |
| `Email Sync Connected` | provider |
| `Calendar Sync Connected` | provider |
| `Teammate Invited` | invitee_role |
| `Teammate Joined` | inviter_id, time_to_join |
| `Workflow Created` | trigger, action_count |
| `Workflow Ran` | workflow_id, outcome |
| `Report Created` | report_type |
| `Error` | error_type, surface |

### 10.3 Calculated metrics

The above raw events let us compute everything in this doc. Don't track "WADP" as an event — compute it from `Deal Stage Changed` + `Activity Logged` + user-activity joined data.

### 10.4 Tool stack considerations

For SurveySparrow CRM in beta, options include:

- **Heavy:** Segment + Amplitude/Mixpanel + warehouse (Snowflake/BigQuery)
- **Lean:** PostHog (events + product analytics in one) + warehouse later
- **Minimum:** Direct events into your DB + a metabase dashboard

In beta, lean is fine. The point is **clean event design**, not the tool. Bad events in Segment > clean events anywhere else.

> 🔗 Related skill in this workspace: `product-tracking-skills:product-tracking-design-tracking-plan` can take this doc and produce a concrete tracking plan + delta vs. current state.

---

## 11. Anti-patterns to Avoid

- **Vanity counts** — "Total contacts in the system." Means nothing about value.
- **Averages without distributions** — "Avg activities per user = 12" hides that 90% do 0 and 10% do 120.
- **No segmentation** — Roll-ups can mask the fact that one big customer is the entire metric.
- **Untied to decisions** — Tracking it because "it'd be good to know." Don't.
- **Too many NSMs** — If everyone has their own NSM, nobody does.
- **Quarterly-only review** — By Q-end, you've burned a quarter. Weekly minimum on the tree.
- **No guardrails** — Optimizing NSM in a way that creates technical debt or harms users.
- **Counts without rates** — "Activations went up!" — but signups also went up. The rate matters more.

---

## 12. Open Questions / TODO

Things this doc punts on, that we need to nail down with the team:

1. **The exact "aha moment" definition** — Is it (first deal AND first activity) or (first deal AND email sync) or some weighted combination? → Workshop with PM + a few beta users.
2. **Stage-change definition for WADP** — Does deleting a deal count? Does moving back a stage count? → Define crisply before instrumenting.
3. **Workspace vs. account vs. organization terminology** — Pick one. Use it everywhere.
4. **What's our "PMF" threshold?** — What retention curve shape, on what cohort, do we say "we have PMF and can start spending on acquisition"?
5. **Privacy & compliance** — What can we track in EU vs. US? Anything we'd never PII-tag?
6. **NPS cadence** — D14 in-product feels right; should we also do quarterly?
7. **Qualitative cadence** — Goal: N customer interviews per month. What's N?
8. **Dashboard ownership** — Who builds & owns the weekly Product review dashboard? Who maintains data quality on it?
9. **Are we two-sided?** — Does the buyer (sales manager) have separate metrics from the user (rep)? Likely yes — needs its own section in v2.
10. **Integrations as drivers** — Should integrations be a separate L2 bucket? Or part of Engagement? Lean: part of activation+engagement, but worth a debate.

---

## 13. Glossary

- **NSM** — North Star Metric. The one number.
- **L0/L1/L2/L3** — Metric hierarchy levels (Business / North Star / Drivers / Inputs).
- **WAU / DAU / MAU** — Weekly / Daily / Monthly Active Users.
- **WADP** — Weekly Active Deals Progressed (this doc's proposed NSM).
- **WEW** — Weekly Engaged Workspaces (this doc's proposed secondary NSM).
- **AARRR** — Acquisition, Activation, Retention, Referral, Revenue (Dave McClure's "pirate metrics").
- **HEART** — Happiness, Engagement, Adoption, Retention, Task success (Google's UX framework).
- **NRR / GRR** — Net / Gross Revenue Retention.
- **CAC / LTV** — Customer Acquisition Cost / Lifetime Value.
- **Leading vs Lagging** — Inputs you can act on now vs. outputs that emerge later.
- **Guardrail metric** — A metric you commit not to harm while moving the NSM.
- **Cohort** — A group of users defined by a shared start date or event.

---

## 14. Next Actions (this week)

- [ ] Workshop the "aha moment" with PM + 3 beta users — lock the definition.
- [ ] Decide tool stack (PostHog vs. Segment+Amplitude vs. DIY) — 1-hour decision meeting.
- [ ] Write the 15-event tracking plan (Section 10.2) into an actual schema doc.
- [ ] Stand up a weekly Product Review meeting — 30 min, the L1+L2 dashboard, anomalies + decisions.
- [ ] Define guardrails formally — get sign-off that we will NOT trade these for NSM gains.
- [ ] Identify owners for each L2 bucket (one PM/lead each).
- [ ] Set a baseline measurement period — first 4 weeks of beta = "no targets, just observe."
- [ ] Schedule v2 of this doc in 6 weeks once we have real beta data.

---

*End of working doc. Iterate freely — the tree is a hypothesis, not gospel. If we learn that activation has a different shape than we expected, rewrite §4.2 and §7. If WADP turns out to be game-able, redefine it.*
