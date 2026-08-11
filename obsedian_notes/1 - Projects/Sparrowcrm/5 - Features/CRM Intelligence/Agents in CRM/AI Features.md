# SparrowCRM Native AI Features: Research Dossier

**For:** Divi (Divyaraj Murugan), SurveySparrow **Date:** 11 August 2026 **Source:** Confluence space `SparrowCRM` (`SparrowCRM2`), surveysparrow.atlassian.net. 133 pages inventoried, 45 read in full. **Purpose:** groundwork for turning always-on native AI features into per-user / per-org settings.

---

## 0. How to read this

For each AI feature you listed, this covers three things: what it does and where it lives, how it's built, and what's fixed versus configurable today. That third one is the conversion target.

Every number, threshold and taxonomy quoted here is hardcoded in the current spec unless I've said otherwise. Part 5 consolidates all of them into one checklist; the companion spreadsheet has the same list with per-feature attribution.

Three things about the source material:

Confluence has the surfaces and UX. Notion has the semantics. The definitive taxonomies for AI Insights per object, AI Filters, and several tag libraries are still Notion-only, linked but never migrated. Twelve of these are listed in Part 7.

There are no engineering docs. Across all 45 pages I found no LLM vendor, model name, prompt template, transcription provider, service name or DB table. The exceptions: `queued_at` and `last_calculated_at`, the `tasks` index, and the Apollo enrichment code paths.

Documentation quality varies wildly. Fit Score has an Approved configurator spec. Deal Score's computation exists only as an embedded image with zero text. Red Flag Detector isn't in Confluence at all.

---

## 1. The landscape: three AI layers, not two

The docs assert a boundary between native AI and agents but never define it. Reconstructed from fragments:

|Layer|What it is|Configurable today?|Where specified|
|---|---|---|---|
|Native AI features|Always-on intelligence on records: scores, tags, summaries, insights, next actions, AI fields|Almost nothing. Fit Score only.|Object PRDs §6/§7, AI Insights pages, AI Tags pages|
|Agents|User/admin-built AI automations with triggers, guardrails, approvals|Fully, via Custom Agent Builder|Custom Agent Builder, Hygiene/Pipeline Agent|
|Workflows|Deterministic when-X-then-Y rules, no AI reasoning|Fully|SparrowCRM Workflows (out of scope here)|

The clearest boundary statement is on the Pipeline Agent page:

> "It reads **native AI scores** (Deal Health, Win Probability, Velocity, Deal Fit) and **per-deal AI insights** (competitors, objections, sentiment, stakeholder coverage, multi-threading, budget, procurement) **as input**… **does not compute scores**, does not fill fields (Hygiene does), and **does not give reps next-best-action (a native record-page feature does)**."

And from the Custom Agent Builder:

> "If a block does not need Intelligence, it belongs in SparrowCRM Workflows, not Agents; agents always involve AI reasoning."

The boundary is already leaking, which matters for your project. The AI Score Configurator and Multi-Score Fit Configurator both configure a _native_ score, yet they're filed as child pages of the Agents module. And every object PRD has a §7 "Agentic Behaviour → 7.1 Automated Triggers" table describing purely native always-on behaviour under the word "agentic," with no agent, no config and no builder behind it.

So the direction of travel already points toward dissolving the boundary and reusing the Agent Builder's configuration primitives for native features. Your project either continues that or defines the boundary explicitly for the first time.

---

## 2. Feature by feature

### 2.1 AI search bar: natural-language search across all objects

**Source:** Ask Zulie / Copilot PRD (2367062081), v 1.1, Draft

The entire documented spec is one line:

> "**Search & filter:** SF.1 NL search across all objects including custom objects (interactive results table)."

This is the only AI feature in the corpus that commits to custom-object support. AI Tasks are hard-limited to four objects at DB-constraint level; Lists to three with an immutable enum.

|Dimension|Finding|
|---|---|
|Objects|All, including custom objects (explicit)|
|How built|Undocumented. No retrieval architecture: no embeddings, text-to-query, or vector store. The only architectural line is "rep queries, copilot classifies intent and routes to a data source or agent, response streams as text with an inline component if structured."|
|Performance|"search returns within 2 s for up to 10,000 records"|
|Permissions|Server-side and non-negotiable: "Permission-scoped (respects RBAC; inaccessible records do not appear or act)"|
|Fixed|Disambiguation list max 5; the 32 rep + 21 manager intents; 4-6 suggested prompt tiles; chart types bar/line/pie/funnel; session-only memory ("Persistent memory is v 2"); human-in-the-loop on all writes|
|Configurable today|Four things, all admin: enable/disable copilot per workspace; restrict to specific roles; which agents surface alerts; per-agent priority thresholds|

One contradiction: the Zulie AI tag placement page lists the AI-branded search bar on Contact/Company/Deals/Meetings/Calls table views. Custom objects aren't enumerated, which conflicts with SF.1.

---

### 2.2 Record summary (AI Summary / AI Interaction Summary)

**Source:** AI Insights Contacts✅ (2368045059), Approved

> "Generate a concise, actionable contact summary in **3–7 plain bullet points** that adapts based on available data… **It should not use section headers; everything should be in simple bullets** for quick scanning by a sales rep."

Objects: Contacts, Companies (`About company`), Deals (`AI summary`), Meetings (2-3 bullets in the recording modal). Field name `ai_summary (AI)`, flagged `(all non-editable)`.

The trigger statement here governs every AI field, not just summaries:

> **"Trigger: (applicable for all objects AI summary and all key insights)** **Current implementation:** update triggers every **5 mins, 3 hrs, 6 hrs**…. **To be updated →** Each activity change should trigger a summary recalculation: Email sent or received; Meeting created, completed; Attribute changed; Call made, completed; Task, Note created; **AI tag update**"

AI tag updates trigger summary regeneration, so tags have to settle before summaries do. That ordering dependency will constrain any per-feature toggle design.

The content spec functions as the prompt, written as requirements:

- Two-mode adaptive branching. Low-info contacts get minimal interaction data, inferred priorities from role/domain, public/social signals and a suggested next step. High-info contacts get multiple interactions, engagement level, objections, intent signals, behavioural patterns and AI-recommended next actions.
- Fixed content slots: recent interactions; engagement level (cold/warm/hot); likely priorities inferred from role, domain or behaviour; public/social signals (LinkedIn, Twitter/X); observed behavioural/intent signals; suggested next step; additional insights.
- Fixed tone: "Concise, actionable, and human-readable; Avoid technical jargon; Prioritize relevance to sales rep actions."
- Fixed length: 3-7 bullets, or 2-3 in the meeting recording modal.

Configurable today: nothing. No settings surface exists. Bullet count, the no-headers rule, tone, content slots, the cold/warm/hot vocabulary and the cadence are all fixed.

The deprecated pricing PRD priced this at 1 credit, "cached until new activity — re-opening with no new data = 0 credits." That matters if a toggle is meant to suppress recomputation.

---

### 2.3 AI tags (autotags), all objects

**Sources:** AI Tags- Contacts✅ (2509373467, Approved), Companies (2496200717), Deals (2492858376), Meetings (2464514050, approved)

The governing design principle:

> "There will be a list of certain tags (**a library**). **AI will only assign from those tags based on criteria match.**"

So this isn't generative. It's a closed vocabulary with rule-based assignment. Tags are multi-valued and co-occurring by design ("HIGH FIT + OPPORTUNITY", "DECISION MAKER + HIGH PRIORITY").

Objects: Contacts, Companies, Deals, Meetings. Calls are stated as "Same as Meetings" but no AI Tags- Calls page exists. `AI tag` is a non-editable system field on the Contact object.

Library sizes: roughly 23 tags on Contacts, 18 on Companies, 21 on Deals, 20 on Meetings. Meetings is the only object with lifecycle-phased tags (pre-meeting vs post-meeting).

Every threshold is a hardcoded literal:

|Constant|Value|Objects|
|---|---|---|
|Untouched delay|2 days|Contacts, Companies, Deals|
|Stalled inactivity|14 days|all|
|Deal stage-stuck|14 days|Contacts, Companies, Deals|
|Ghosted window|14 days|Contacts, Companies, Deals|
|Ghosted suppression|upcoming activity >14 days away|Contacts, Companies|
|Risk-signal lookback|45 days|Companies only|
|No Activity (meeting)|7 days|Meetings|
|Strong Engagement|≥ 70 (Weak 0-69)|all|
|Fit bands|70-100 High / 40-69 Mid / 0-39 Low|all|
|High Interest|Deal score ≥ 70|all|
|Win Potential|Deal score > 85, competitor mentions ≤ 1|Deals, Contacts|
|High Value|Deal amount ≥ $5,000 (USD hardcoded)|Contacts, Companies, Meetings|
|High Value (meeting, pre)|> Avg. deal value across all the host's deals|Meetings, conflicts with the $5,000 rule on the same page|
|Needs attention|Meeting score < 50|Meetings|
|Strong momentum (v 2)|2 stages progressed, avg ≤ 7 days/stage|Deals|
|No Power close-date window|14 days|Deals|
|Competitor contract expiry|one year from a lost deal|Revival Potential, all|
|Red flag window|"last X days", value never defined|Deals|

"At Risk" is really 9-11 sub-factors per object: red flag email present, not a decision maker, discounts discussed, low engagement ≤69, negative sentiment, objections raised, budget concerns, champion risk / job change, declining responsiveness, misfit role engagement, deal stage stalling, budget unclear, single-threaded risk, unclear next steps, procurement/legal delays. The display rule is hardcoded: "Show only one 'At Risk' tag, not all sub-reasons → Reasons appear in tooltip / hover."

The docs already say the factor count is dynamic: "There will be numerous risk factors (not just 3 as in the card UI) which will be displayed based on the context." That's an open door for a per-org "which risks matter to us" picker.

The Deals "No Power" tag carries a hardcoded title-to-seniority map:

- C-level: CEO, Chief, Founder, President
- VP: Senior Vice President, Executive Vice President, Regional Vice President, Associate Vice President, Head of, General Manager
- Director: Senior Director, Director

Three different seniority lists exist across pages (Contacts with and without "Manager", plus this three-tier Deals map). They should become one org-editable map.

The tagging is overwhelmingly rule and threshold based. LLM/NLP appears only in sentiment detection, objection detection, competitor-name extraction, discount-language detection, job-change detection, and buyer-role classification.

Configurable today: two things. High/Mid/Low priority, "manually set by user during deal creation." And indirectly, Fit score criteria, which cascade into the High/Mid/Low Fit, Potential Lead and Opportunity tags.

One signal worth acting on: the tag pages are full of unresolved product debates written straight into the spec. "should we rename it to opportunity??", "(To be renamed)", "changed to Stalled", "Ignore this tag", "removing, not needed for Deals", "🚨Will fail in case one deal is High and another is Low". Per-org tag enable/disable plus label override would settle most of these without another round of product debate.

---

### 2.4 Fit Score and the AI Score Configurator

**Sources:** AI Score Configurator (2368045130, Approved), Multi-Score Fit Configurator (2368241707), AI Insights Contacts/Companies

This is the only place in SparrowCRM where a user configures how an AI value gets computed. It lives at `Settings > AI scoring`, and it's the template for everything else you'd build.

The pattern, in full:

1. Ship hardcoded defaults so the feature works on day one.
2. On onboarding, auto-derive an ICP from the user's email domain and pre-fill those defaults.
3. Detect "user hasn't configured" and show a first-time banner that names the defaults: "This Fit Score is based on default criteria. Customize your Ideal Customer Profile in Settings for more accurate scoring."
4. Give it a one-click CTA, "Edit Fit Score Criteria," that opens the settings page.
5. Offer an attribute + operator + value rule builder over any field the org has defined on that object. "Logic operators are borrowed from the object list-view filters as-is."
6. Weight by per-attribute High/Mid/Low importance, rebalancing live to sum to 100%.
7. Show a live preview pane with per-parameter percentage, total parameter count and high-priority count.
8. Save as draft, or publish.
9. Degrade gracefully: "If field missing → score based on available fields only (normalize to 100%)."

Auto-ICP defaults are hardcoded, five parameters each. Contact: Industry, Company Size (Employees), Revenue (ARR), Geography, Job Title. Company: Industry, Company Size (Employees), Revenue (ARR), Geography, Segment (SMB/Midmarket/Enterprise). Segment replaces Job Title on Company rather than adding to it. "All parameters get High importance (equal distribution) by default initially."

A competing older default set also exists: SaaS/Healthcare/Finance/Manufacturing, 500+ employees, >$1 M revenue, same country/region as user, C-level/VP/Director, 20% each.

Field-type warnings are hardcoded copy strings. Text: "Text fields may contain inconsistent values. AI will attempt normalization, but accuracy may vary." Similar strings exist for Email (domain-based rules only), URL and Phone.

Recompute trigger: "any write to a relevant field triggers recalculation regardless of source (manual, bulk, API, workflow, revert, enrichment, creation)". SLA is within 60 seconds for individual record creation via a DB trigger or post-create hook rather than a queue, with best-effort for bulk. It's purely event-driven, no cron.

Stored states are Active, Stale, Insufficient Data and Paused, plus a derived Calculating from `queued_at` vs `last_calculated_at`. Score values are "readable via the public API and changes fire webhooks."

The v 1 limits include one that works in your favour:

> "There is no option to create a new score. Only Fit score is present in the list (Company fit and Contact fit); scores have an **Edit option only, with no disable option (no 3-dot menu) in v 1**."

> The list has a Status column (Active/disabled) "but users cannot disable any score in v 1, **kept for future**."

A disable affordance is already stubbed in the data model and deliberately deferred. That's the cleanest available starting point for the toggle work.

**Multi-Score Fit Configurator** (Pro+, v 2 spec) lifts the single-score limit. Admins can create any number of named scores, each with an audience filter ("purely an eligibility gate", same condition builder as list views, AND-only), plus enable/disable and delete for custom scores. Defaults can't be deleted but can be edited, disabled and filtered. Score names cap at 15 characters. One decision to note: "all reps see every score on a record (no role-based visibility)." Per-user visibility was explicitly ruled out.

Still fixed even in v 2: the 70/40 colour bands, the Importance-to-percentage mapping formula, the three-level Importance enum, normalization to 0-100, integer display with no % sign, and property-based fields only (activity-based deferred to v 2).

---

### 2.5 Engagement Score

**Sources:** AI Insights Contacts✅ (Approved, the 8-step model), Overview of Meeting Interaction Strategies (draft, the configurable redesign)

Two incompatible specs exist. The Approved one is a fixed formula. The draft one is a configurator. Resolve this before any settings work.

#### The Approved model: 8 steps, roughly 30 constants

> `Engagement Score = Base Score × Response Ratio × Sentiment Weight × Recency Multiplier + Overrides`

Overrides are defined in the doc as "**Hardcoded** rule-based boosts or reductions to prevent misleading low/high scores."

- **Step 1, overrides (checked first).** Positive reply to first email +50; meeting or demo accepted +50; active meeting participation +40; explicit buying statement +70; feature interest +30; high-value content consumed +30; C-level engagement +50; quick reply within SLA +30; social/external engagement +30. Negative: negative reply −60; negative call/meeting sentiment −40; budget or procurement blocker −30; feature objection −20; escalation to competitor −10; unsubscribe −60; email bounce −50.
- **Step 4, response ratio bands.** 0.7-1 Strong → 0.8; 0.4-0.69 Moderate → 0.5; <0.39 Weak → 0.4. (The gap between 0.39 and 0.4 is a genuine spec bug.)
- **Step 5, base score per interaction.** Email reply +20, open +3, unsubscribe −50; meeting attended +10, no-show −5; call connected +5, positive tone +5; key page visit +5, trial signup +10.
- **Step 6, sentiment weight** ("Use NLP on email and call transcripts"). Positive +20%, neutral 0%, negative −30%.
- **Step 7, recency decay.** <7d 1.0; 7-14d 0.8; 15-30d 0.6; >30 d 0.4.
- **Step 8, normalization.** Capped at 100, floored at 0.

Response Rate is a separate metric, and it carries the most explicit non-configurability statement in the corpus:

> **"Apply weights (default, not configurable): Emails → 33%, Calls → 33%, Meetings → 33%"**

If a channel has no data, weight redistributes proportionally (50:50 for two channels). All three missing shows "NA".

The doc also flags an unsolved problem: "We need a way to differentiate between: 1. No engagement initiated — score should be 0. 2. Engagement initiated but no replies — Response ratio will be zero which makes the engagement score zero because of multiplication, but we need to show the outreach effort by the rep so it should not be 0."

#### The draft configurator model

Ten configurable Groups, each with a max limit, sub-options carrying positive or negative point values, and a per-group Decay percentage. Overrides evaluate first. The groups: Email; Meetings & Calls; Activity Frequency; Stakeholder Involvement; Rep Responsiveness; Website/Product Usage; Deal/Opportunity Progression; Buying Signals (Overrides); Social & External Signals (parked); Content Engagement (parked). The v 0 wireframe implies a settings route at `/settings/engagement/new`.

Rollup to Company, Deal and Meeting is a hardcoded MAX, not an average: "Engagement score (max.) — Max. engagement score of any associated contact." The Companies page says the person's name isn't displayed; the Deals page displays "Strongest connection: Alex Albon (Engagement- 53%)". Those contradict.

Bands are 70-100 Green (Strong), 40-69 Yellow, 0-39 Red. They're stated as "By default" but no mechanism to change them is specified anywhere.

One toggle precedent does exist. Buying Intent degrades gracefully: "If engagement scoring is disabled, engagement-based signals are ignored." That's one of only three native-AI on/off references in the corpus (the others being Deal Loss Analysis "if enabled in settings", and the per-meeting-type "include meeting notes via AI note taker" checkbox). None of the three says where the setting lives, but all three imply the concept exists somewhere in the product.

---

### 2.6 Key Insights and the AI Insights cards

**Sources:** AI Insights Contacts✅, Companies (Approved), Deals (Approved), object PRDs §6.3

Two distinct surfaces exist and are easy to confuse.

**Key Insights** are "AI-identified signals: conversation topics, objections raised, sentiment shifts, deal risk indicators," rendered as action cards on the Insights tab.

**The AI Insights list** is a separate card block, "visually separate from tab content," with a fixed per-object catalogue:

|Object|AI Insights catalogue (fixed in v 1)|
|---|---|
|Contact|Best Contact Time, Buying Intent, Competitor Mention, Risk Factors, Buyer Profile|
|Company|Buying Intent, Competitor Signals, Buying Potential, Buying Committee Analysis, Similar Companies, Company Signals (hirings, leadership changes, funding, layoffs, org change watch, recent news with source)|
|Deal|Competitor Mention, Buying Committee Analysis, Similar Deals, Deal Health|
|Meeting|No catalogue is specified. The Meetings module has an Insights tab, but it appears in the docs only as the destination of a "View detailed insights" CTA from the recording modal, with no content spec anywhere. Zulie AI tag placement adds only that the tab carries "one tag indicating the page was generated entirely by Zulie", and that Analytics is v 2. This is a real gap in the source, not an omission here. Pull the un-migrated Notion sub-specs "Meeting: Analytics" and "AI features & Scores".|

**Best Contact Time** (Contacts only) uses six signal groups: historical engagement patterns; prospect timezone and work schedule (hardcoded 9 AM-5 PM baseline); engagement recency and frequency; channel preferences; external contextual signals such as holidays and end-of-quarter; and AI-driven probability scoring. It depends on the `Contact time zone` field. The UX includes a "Schedule now" CTA and holiday-aware rescheduling.

**Buying committee / buyer profile has two competing taxonomies**, neither deprecated:

- Contacts page, 8 roles: Decision Maker, Influencer, Champion, Economic Buyer, Technical Evaluator, Blocker/Skeptic, End User, Observer/Passive Stakeholder. Each has Behavioural / Interaction Patterns / Deal Signals detection criteria.
- Companies and Deals pages, 6 roles: Finance, Technical, Legal, Decision maker, Influencer, Gatekeeper.

They overlap only on Decision Maker and Influencer. Reconcile before exposing this as configurable.

**Focus areas** are seven fixed values, identical across all three Insights pages: Legal/Compliance, Technical/IT, Procurement/Finance, Operations/Process, Marketing/Sales Enablement, Product/Innovation, Executive/Strategic.

**Decision-making power** is a two-stage classifier:

1. Title keyword match against a hardcoded case-insensitive list, defaulting to YES.
2. ICP-aware LLM inference: "The AI model should compare the target users of the product I am selling and identify relevant roles based on that." The doc's example: ThriveSparrow targets HR, so HR titles get decision power, while an Engineering Manager evaluating it is an Influencer rather than a DM.
3. Eight phrase-classification rules from transcripts. Explicit Decision Authority → YES; Budget Authority → YES; Final Approval Language → YES; Explicit Deferral → NO for the speaker, YES for the mentioned person (the doc calls this "the strongest signal in the system"); Recommendation Language → NO; Evaluation/Discovery → NO; Collective/Vague → NA; Silence on Authority → NA.

Companies and Deals use a High/Mid/Low/NA scale where Contacts uses Yes/No/NA. Another inconsistency to resolve.

**Competitor Mentions** are detected in transcripts, emails and calls, displaying the competitor name, timing, mode and the quote. It feeds At Risk (−10 engagement override), Win Potential (`competitor_mentions ≤ 1`) and Revival Potential. Nowhere in the product can an org declare its own competitor list. Given three downstream dependencies, that's the most obvious missing per-org setting.

Configurable today: nothing. Card lists are fixed in v 1, taxonomies are fixed, and no settings surface exists for any of it.

---

### 2.7 AI Tasks

**Source:** Tasks PRD (2367356951), v 1.0 Draft

> "**AI Tasks are live tasks from creation.** They appear in the AI Tasks tab as actionable items, **not suggestions needing approval**. A rep can Complete or Dismiss them; **there is no Accept step**."

§3.2 of the same page contradicts this by calling them "AI Tasks created as suggestions." Unresolved.

Objects: a task must link to at least one of Contact, Deal, Company or Meeting. "Enforce linked record at DB constraint level, not just UI." Custom objects aren't supported.

|Trigger|Scope|Max latency|Output (verbatim)|
|---|---|---|---|
|Meeting recap generated|All action items in transcript|< 30 s|"AI Tasks created **as suggestions**"|
|Deal score drops|Deal's open tasks checked|< 60 s|"AI Task **suggested** if no follow-up task exists"|
|Due date passes|All open tasks|Nightly sweep|Flagged overdue, Kickoff chip updated|
|Rep marks complete|Single task|< 1 s|Status updated, removed from open list|

The word "suggestions" in this table is the source of the §2.2 versus §3.2 contradiction above.

On your "task in meetings — objects, meeting transcript, call, emails" question: only meeting transcripts and deal-score drops are documented as AI-task sources. Calls and emails are not. But the two Task pages disagree on the provenance enum. The Tasks PRD says `Source = Manual / AI / Meeting recap / Sequence`, while the Task fields page says `Task source = Workflow, Sequence, Meeting, Email, Call, Manual, AI`. The data model anticipates email- and call-sourced AI tasks that the trigger spec doesn't implement. Close that gap before scoping per-source AI-task settings.

Scheduled jobs: overdue sweep daily at 6 AM; AI task expiry weekly, auto-dismissing anything unacted for 7 days.

Admin configuration is explicitly ruled out: "No task-specific admin settings in v 1." So all of the following is fixed:

- Cap of 10 active AI suggestions per rep
- 7-day auto-dismiss
- 6 AM sweep, with no org timezone
- The four triggers
- The no-Accept-step model
- Quick filters: Created by me, Assigned to me, Due this week, High priority, Overdue
- Ten action-item categories; filters limited to All / Follow-up / Reconnects / Calls
- Silent failure by design: "AI task generation fails → Failure logged silently… No error shown to rep."

Counters exist for reporting: `AI_tasks_count`, `AI Tasks-pending/completed/dismissed/Overdue`.

---

### 2.8 AI email drafting: Write with AI and Dynamic email

**Source:** Sequences PRD (2367258626), Draft, added in v 1.1

The entire specification is three sentences:

> "**Write with AI:** select tone and type. **Dynamic email:** give instructions to generate the email dynamically based on industry, company, region, etc. (any field can be a variable). **Admins can control whether Dynamic email is allowed from settings; the AI email assistant is always available, even in manual compose from record pages.**"

|Dimension|Finding|
|---|---|
|Tone options|Referenced but never enumerated anywhere. There is no tone list in the docs to configure.|
|Type options|Same: referenced, never enumerated.|
|Length control|Not offered at all.|
|Prompt|Hardcoded or unspecified. The only user-supplied instruction surface is Dynamic email, and it's per-use rather than a saved template.|
|Dynamic variables|Open: "any field can be a variable." The one genuinely flexible element.|
|Configurable today|One toggle. Admins allow or deny Dynamic email, org-level and binary.|
|Write with AI availability|Hardcoded on and non-disableable: "always available".|
|Storage|The `Email source` enum is Manual, sequence, workflow. There's no "AI" value, so AI-drafted emails are invisible at the data layer.|

Copilot's email path (EM.1-EM.4) is the only place any email context assembly is described: "Reply to deal-related email with deal stage, stakeholders, recent activity." The docs never say whether Copilot's email editor and Write with AI share an engine.

The one configurable numeric default in this area isn't AI at all. Sequence A/B variant auto-optimize uses a "configurable, default 20 sends" learning period on open, click or reply rate.

The Sequences out-of-scope list still says "AI-written sequence steps (v 2)", contradicting §5.2 which ships it.

A permissions row already exists in the role matrix: "Allow dynamic AI email creation", ✓ On for every role, with a documented dependency ("Edit — Own minimum; AI writes the email on behalf of the user").

---

### 2.9 Call AI: transcript to summary and tags

**Sources:** Calls PRD (2367356930); Call fields (2370994199), an empty stub

This is the thinnest-documented feature on your list.

The Call summary tab shows "AI short summary; recording with transcript, speakers, and the ability to add notes/tasks while listening." No length, no sections, no trigger, no latency.

Transcription is delegated to the telephony provider rather than run in-house: "Desired returns from RingCentral after a call: transcript with speaker separation, recording audio, any notes added in the extension, and call outcomes." That's the opposite of the meeting path, which implies an internal transcription stage.

Only one AI-derived call classification is documented, and it's the only plan-gated AI feature named inline anywhere: Call status "Wrong Number (auto-set from transcription, plan-gated)". Call Connected and Call Missed are attendance-based, not AI.

There is no AI Tags — Calls page. The approved tag pages cover Meetings, Deals, Companies and Contacts only.

AI recommendations get one line: "The left panel lists all action items generated from each call."

`Call fields (post PRD)` is empty, so there is no call AI data model at all. No AI summary field, no call score, no call sentiment field, no transcript field. Meeting fields at least has `Meeting score` and `Transcript available`. There's no call score anywhere (only Meeting score), and no call AI settings surface. Call settings cover per-user call profiles, installed apps (RingCentral and Aircall only), and Twilio numbers.

One blocking unknown is flagged for engineering: "how the CRM learns a call ended via the extension and the latency of that signal." That gates every post-call AI trigger.

Call AI does feed other features. Deal loss analysis reads call transcripts, Competitor Mention scans calls, and Engagement score consumes "Positive/Negative sentiment in call/meeting (AI transcript analysis)".

---

### 2.10 Meeting AI

**Sources:** Meetings (2367389697), Calendar integration (2376400914), Overview of Meeting Interaction Strategies (2430337028), AI Tags- Meetings (2464514050), Meeting fields (2371190785)

This is the largest AI cluster and the most heavily hardcoded.

#### 2.10.1 Pre-meeting brief

> "Generate the brief only when the meeting is **opened** or **24 hours before** the meeting start time… If meeting is added with < 24 hours notice: generate immediately on sync. **Regenerate if the attendee list changes** after initial generation. Store the generated brief on the meeting record."

Calendar sync fetches a rolling 14-day window. Sync frequency is "run sync frequently", with no interval given.

Two fixed brief variants, keyed off interaction history:

- **First interaction, 6 sections.** Attendee summary; Recent touchpoints (fixed 6-item list); Last interaction (no AI, reference only); Icebreaker (1-2); Recommended strategy (3-4 bullets); Questions to ask (3-4 max).
- **Second interaction onward, 7 sections.** All-conversation summary (2-3 main points); Attendee summary; Recent touchpoints; Last interaction; Recommended strategy, shifting focus to progress and resolution; Icebreaker, shifting to continuity and familiarity; Questions to ask.

Each section has a hardcoded taxonomy behind it:

- **Recommended strategy** draws on a 21-parameter taxonomy (objections, competitor mentions, decision-maker identification, buying signals, budget/pricing, stakeholder concerns, engagement levels, meeting outcome/stage, industry relevance, renewal context, timeline mentions, internal alignment gaps, use case, product feedback, trust signals, cross-functional involvement, risk indicators, cultural/personal notes, geography/compliance, posture toward change, stage/deal blockers) with a fixed 5-level priority order. It carries a negative constraint: "What NOT to Show — Generic fluff ('Be confident,' 'Listen carefully'). Anything not tied to real context."
- **Icebreaker** has a hardcoded tone spec ("Safe for any professional context, avoids personal topics, religion, politics, finances, health"), 9 ranked categories, and a seniority prioritisation ladder.
- **Questions to ask** has 7 first-meeting categories, 11 second-meeting categories, and explicit "Avoid" rules.
- **All-conversation summary** uses a 27-topic ranked list plus a hardcoded tone rule: "Recap style — use past tense… **Avoid directive words like 'should,' 'recommended,' 'suggested next step'**… Focus on facts of what happened, not intent or guidance."

Two forms of configurability were raised and declined:

> "There's **no per-meeting way to say 'don't show this one.'** The only lever is the org-wide filter, which is too blunt."

Moving the calendar filter (all meetings vs external-only) from admin to rep level was raised and killed, marked "(Ignore)".

Manual refresh and a "last updated" stamp are both v 2.

There's also a schema gap. The brief's own output fields (`AI summary`, `Recent touchpoints`, `Questions to ask`) are all marked "open question" on the Meeting fields page, despite "Store the generated brief on the meeting record" being a hard requirement. No storage schema exists for the brief's content.

#### 2.10.2 Post-meeting analysis

Three AI outputs with hardcoded structural differences:

- **Minutes of Meeting (MOM):** key points, per-attendee deliverables, next steps with dates. Carries an upfront Share action that opens an email modal with participants pre-filled and auto-populated subject and body.
- **Rep Notes:** per-attendee summary plus key MOM points, with no share CTA.
- **AI summary** in the recording modal: fixed at 2-3 bullets.

The recap-to-note bridge runs in under 60 seconds after the meeting ends.

Configurable today, and this is the bright spot: per meeting type or template, admins set after-meeting email timing (immediately / 5 / 30 / 60 min), the message body, and "option to include meeting notes via AI note taker." That's the only AI on/off switch in the product scoped below the org level. The other two native-AI toggle references (engagement scoring disabled, deal loss analysis "if enabled in settings") are both org-level and neither names its settings location. Custom meeting note templates also exist at workspace level, though "Reps cannot create private templates in v 1."

Recording itself is org-wide binary: record all meetings, or record none. There's no per-meeting-type, per-rep or per-contact-consent option. The recorder name is customisable. Retention is fixed on Free (1 month) and Growth (3 months), and configurable only on Pro and Enterprise.

#### 2.10.3 Meeting Score

The rubric is fixed:

- Communication Quality, 35%: speech rate; clarity, filler words, fumbling, grammar; tone and sentiment
- Engagement & Participation, 30%: talk-to-listen ratio; participant involvement; overlaps and interruptions; balanced participation
- Efficiency & Punctuality, 20%: start and end on time; agenda coverage; time utilization
- Outcomes & Value, 15%: action items defined; positivity and relationship building; relevance to purpose

> "**Final Score = Weighted Average across all dimensions.**"

The rationale is recorded in the doc: "Different parameters have different impact on deal movement… Engagement is both important and measurable → high weight. Grammar is measurable but less tied to outcomes → low weight."

The pipeline has five stages: Transcription → NLP & Audio Analysis → Meeting Structure Analysis (agenda vs topics covered, explicit action-item detection) → Scoring Engine (normalize 0-100, apply weights, composite) → Feedback Generator (compare to benchmarks, generate 2-3 improvement suggestions).

Output shows as `87/100 [+7 🔼]` with a delta against the last scored meeting, meeting sentiment as a percentage, and four clickable dimension sub-scores leading to "Why this score, what can be improved". Benchmarking is marked "(Future scope)" and its scope is itself unresolved: "compared to team/organization/global avg???"

No configurator, no settings surface and no user-editable element is specified for Meeting Score anywhere. Fit Score and Engagement Score both have configurator specs; Meeting Score has none, yet it drives the "Needs attention" tag at a hardcoded <50 threshold and feeds manager rankings.

#### 2.10.4 Suggested and recommended meetings

Not specified. Two traces exist: a speculative "a possible 'Recommended' meetings list" on the manager view, and a Notion sub-spec called "Meeting recommendations" that was never migrated. Adjacent surfaces that partially cover the intent are Reconnects (no-shows, no-pickups, unresolved queries, "a suggestion for the next-best person to connect from the company on an unanswered call") and the Re-Engage / Revival Potential / Stalled tags.

Separately, the Meetings page marks "Recommended strategy" as "deprecated for this version" while the scoring-metrics page specifies it fully and treats it as live.

---

### 2.11 Buying signals / Buying Intent

Three pages specify this with materially different logic, which is itself a finding.

The canonical quantitative model lives on the Deals page:

> `Buying Intent Score = 0.4 × Interest/Research + 0.3 × Buying Actions + 0.2 × Decision-Maker Involvement + 0.1 × Recency & Intensity`

|Signal type|Examples|Weight|
|---|---|---|
|Interest / Research|Pricing page visits, demo/trial signup, feature doc views|40%|
|Buying Actions|RFP submissions, budget confirmations, vendor comparisons|30%|
|Decision-Maker Involvement|Executive touch count, multi-department participation|20%|
|Recency & Intensity|Multiple purchase-related interactions in last 14 days|10%|

Engagement Score, normalized to 0-1, contributes roughly 40% of total buying intent over a 30-day window with recency decay. If engagement scoring is disabled, engagement-based signals are ignored.

Overrides trump the numeric score entirely. High: demo/trial signup; positive explicit reply; pricing request or RFP; multiple DMs engaged in the last 14 days; external intent surge plus internal engagement. Mid: content consumption, partial engagement, unqualified inbound. Low: no activity in 60-90 days; negative signals such as unsubscribe or explicit "not interested"; lost accounts.

Decay: High drops to Mid after 14 days with no new signals; Mid drops to Low after 14-30 days. "Decay applies individually for each override trigger."

Categorical mapping: High ≥ 0.6 or a High override; Mid 0.4-0.6 without a High override; Low < 0.4 or a Low override. Badges are High Green, Mid Yellow, Low Red.

The engineering notes: "Overrides applied before numeric classification"; "Normalization required for all signals to ensure consistent 0–1 scale"; "UI tooltip must explain reasoning from signals and overrides for transparency."

Company-level aggregation is contradicted across pages. The Deals page says "Company intent determined by highest override or intent among key contacts." The Companies page says "There is **no** average or clubbed buying intent for a company. It is on a contact level, we are just displaying intents for each contact."

The Contacts page uses a qualitative signal-catalogue model instead, displayed as "# signals" with each labelled High, Mid or Low, and a full catalogue of email, call, meeting and deal signals per tier. Trigger: "as soon as any Email, call, meeting activity happens, analyse whether that activity can be judged as High/Mid/Low intent." This model uses a 21-day stuck-stage threshold, inconsistent with the 14-day Stalled threshold used everywhere else.

Configurable today: nothing. Every weight, threshold, decay window and override list is fixed.

---

### 2.12 Red Flag Detector

This is the one item on your list with zero Confluence coverage. What exists:

The Deals AI tag "Red flag": "Email labeled 'Red flag' received in the **last X days** indicates deals where a prospect has sent an email that presents a potential risk to the deal. The warning will disappear when you **reply to the flagged email**, or when the **sender joins a call**." The spec carries the authoring doubt inline: "(are we having email tags??)". X is never given a value.

Risk factor #1 on both Contacts and Deals "At Risk" is "Email tag 'Red flag' present", so Red Flag is an email-object-level classification consumed as an input by contact- and deal-level tags.

Meetings has an adjacent but differently-worded concept: Needs attention "when a meeting has red flags specific to unresolved questions, unclear next steps, or overdue follow-ups".

Plans & Features gates "Red flags and Positive signals" to Pro+.

The spec lives in Notion under two different page IDs for what is nominally the same feature:

- From AI Tags- Contacts✅: `app.notion.com/p/Red-flag-Tag-in-Emails-2d 133 fc 67761802 b 93 cae 4936 a 32 aa 1 a`
- From AI Tags- Deals: `app.notion.com/p/Red-flag-Tag-in-Emails-2d 233 fc 677618147 a 587 e 205300557 ee`

Pull both and reconcile before scoping this one.

---

### 2.13 Deal Loss Analysis

**Source:** Deal loss analysis (2369028097)

Trigger: deal stage moves to Closed Lost. It's a per-deal event, not scheduled, and no manual re-run is documented.

Output shape: primary loss reason (single keyword); reasons that contributed; deal-level takeaways (2-4 actions); week-by-week analysis with Favourable signals (what helped) and Friction signals (what stalled).

Two hardcoded taxonomies run in parallel:

- **Rep-logged, 10 fixed values.** Pricing issues, Chose competitor, Budget constraints, Timing mismatch, Feature gap, Technical Blocker, Misfit, Ghosted, Bugs & Issues, Other. Only "Other" requires free text.
- **AI-derived, 6 fixed values.** Engagement & Execution, Product gaps, Pricing or budget, External factors, Chose Competitor, Not enough data.

The decision procedure is two steps: "AI model checks for any **exact reason mentioned by customer** related to not moving forward with this deal in Meeting, Call transcripts or Emails. Then logs it. **If no such excerpt is found, then move to the most recurring reason** across the Deal lifeline."

The polarity principle: "**Positive = more clarity + more commitment + more momentum. Negative = less clarity + less commitment + less momentum.**" Neutral signals exist but are "(not to be mentioned in UI) Context-only."

Content polarity uses five weighted categories: Commitment & Next steps ("highest weight", positive being a next step with owner and date, negative being vague "we'll get back" or "circle back"); Decision process clarity; Objections & blockers; Competitors & alternatives; Tone & confidence ("supporting only"). The weights are non-numeric, so there's no weight editor to expose.

Timeline polarity uses four categories. Execution discipline grades the rep on compliance with SparrowCRM's own AI. Positive signals include "MOM sent after meeting" and "AI recommended tasks done"; negative includes "AI recommended tasks ignored repeatedly."

Benchmarks are org-adaptive, computed from your own data, but the formula is fixed: "avg time in stage for the same pipeline; Avg deal time for closed won". Hardcoded thresholds sit inside: DM present but not engaged means "Engagement score with DM is < 30"; DM missing "even after 14+ days of deal creation".

The guardrails are the closest thing to a system prompt in the entire corpus:

> - No evidence → no claim (don't output competitor/pricing/feature/tech without evidence signals/snippets)
> - Sparse data → avoid rich narratives; cap confidence; prefer neutral/External framing if needed
> - Don't blame the rep by default; focus on controllable improvements
> - Stage/segment context matters; evaluate time-based signals vs benchmarks
> - One signal rarely determines polarity; rely on clusters/patterns

The evidence hierarchy handles hallucination: explicit customer statement overrides inferred patterns; persistent pattern beats one-off signal; recency matters but shouldn't override explicit evidence; sparse data means fewer claims and lower confidence.

One warning: the HubSpot prompt on this page is not SparrowCRM's prompt. It sits under "References: (Just to get an idea of what competitors are doing)".

Configurable today: one toggle, location unknown. The Deal Loss Analysis page has no settings UI, but the Deals PRD contains a passing exception: "Deal stage moved to Closed lost → **Deal loss analysis computed (if enabled in settings)**". That's one of three native-AI on/off references anywhere in the corpus. Find where that setting lives; it may be the seed of your control plane. Everything else about the feature (reason taxonomies, weights, guardrails, granularity, trigger) is fixed.

---

### 2.14 AI scores: Deal Score and Deal Health

Deal Score has no written computation logic anywhere. On `AI Insights & Score- Deals (Approved)`, the `## Deal score` section contains only an embedded image and zero text. I confirmed this by re-fetching the page in HTML.

What is documented:

- Deals PRD §6.1: "Composite score based on engagement level, deal stage velocity, contact responsiveness, and ICP fit of the associated company. Shows current score, delta since last update, and **the top reason for any change**."
- Deal record page: "**Why did the score drop or increase reason to be mentioned.** **First time deal score should show 2-3 factors** depending on the parameters considered." And: "Score is calculated basis each activity recorded."
- Thresholds in active use elsewhere: High Interest tag at ≥ 70; Win Potential at > 85.

**Deal Health** is separate and shallow: "Deal velocity: average days in a stage — compare with average days in a stage of successful deals and show '**Above average**', '**Below avg**' or '**On track**'", plus max engagement score with the named strongest connection.

**Similar Deals** is explicitly a POC. It matches closed-won deals on Industry, Company size, "Customer Problems — get this from transcripts", and "Pattern of deal progression".

Plan gating here is itself a config pattern. Deal health score is unavailable on Free, "Score only" on Growth, and "Full explanation" on Pro and Enterprise. That's graduated AI feature exposure, already shipped.

Separately, the Pipeline Agent's data contract names four native scores (Deal Health, Win Probability, Velocity, Deal Fit) plus a large per-deal insight schema. That contract is the most concrete inventory anywhere of the native AI output schema a configurability layer would need to expose.

---

### 2.15 AI fields and enrichment

**Sources:** Record re-enrichment✅ (2368995329, Approved), Apollo.io (2386853889), Enriched Fields for CRM Objects (2369880065), Objects Module (2370109441)

There's no "AI field" field type. The canonical field-type list has no AI type. "AI field" is a provenance flag layered on a normal field type.

The three-way taxonomy:

> "There are 3 types of fields: **AI fields:** enriched using AI. **Enriched:** enriched using 3 rd party applications. **System**"

AI fields render with a spark icon, third-party with lightning. Hovering shows an "AI enriched" toast. The column header menu offers Recalculate values with AI, and Edit field. Per-record recalculate exists on the record page beside every AI-enriched field and uses credits.

The AI-enriched field lists are 100% hardcoded, all flagged `(all non-editable)`:

- **Contacts:** Decision making power, fit_score, engagement_score, Buying intent, Risk factors, competitor_mentions, ai_summary, next_actions (count of pending only), job_change_alert ("paused until the agent is built"), Buyer profile, Focus area
- **Companies:** About company, Tech and Tools (ignore), last_funding_date, last_funding_amount, AI Tags, fit_score, engagement_score (max), Associated deal_score, Buying intent, Buying potential, Account health, Risk factors (count), competitor_mentions (count), Buyer profile, Similar customer watch, Organization change watch
- **Deals:** "Third-party enrichment: NA." Deal score, Engagement score (max), Company fit_score, Account health, Similar customer watch, Organization change watch, Tech and Tools, Buying intent, Buying potential, Buyer profile, Decision making power, Risk factors, competitor_mentions, AI summary, AI Deal loss_reason, Deal loss analysis available (Y/N), Last Stage before lost

Custom objects get zero AI or enrichment support. Neither the Custom Objects nor the Objects Module page mentions AI fields, enrichment, re-enrichment or AI summary. Enrichment settings are scoped to Contacts and Companies only. The single existing per-custom-object AI switch is "allow agentic recommendations in this object (toggle) — configured here (not in separate agentic settings)".

The largest gap for your project: the page references "manually created by user with **AI-autofill**", but no page anywhere defines how an AI-autofill field is created or configured. There's no field-creation modal spec, no prompt authoring, no configuration UI. That's greenfield.

The entire current enrichment settings surface:

|Setting|Scope|
|---|---|
|Auto enrich new records|Contact and Company, separate toggles|
|Extract contacts from emails|Common toggle|
|Continuous enrichment (monthly, no credits)|Contact and Company, separate toggles|

Cadence is stated three different ways, none of them user-settable. Record re-enrichment says monthly. Apollo and Plans & Features say every 14 days (Pro) or 30 days (Growth).

One hard invariant: "You can manually update enriched field with your own data as desired, and any values you add manually **will not be overwritten** by enrichment."

Apollo is the closest thing in the product to per-org field configuration, and it's shipped. It has a field mapping screen with Contacts and Companies tabs, where each row is `Apollo field → SparrowCRM field (type-compatible only) → overwrite rule: Fill empty values only (default) / Fill empty and overwrite existing / Do not fill`. And the posture is right: "the default mapping for both Contacts and Companies is **already applied and active** — no save required… The mapping screen exists to **review and change, not to set up**." It also has an "+ Add enrichment field" affordance for unmapped provider fields, plus install-time auto-creation of missing fields.

One decision your project has to force. Apollo's Non-Goals record: "**AI-enrichment interplay** — AI enrichment is not shipping alongside this; **precedence rules deferred** until it does. (Decision 2026-06-10 — recorded.)" Provider enrichment and AI enrichment are two uncoordinated write paths into the same fields, and nobody has decided who wins.

---

### 2.16 Additional out-of-box AI features not on your list

These appear in the plan matrix or the `feature_gate` registry as shipped or planned AI features, but have thin-to-no spec pages. Listing them so your "list of all AI" is complete. Each is a toggle candidate.

|Feature|Gate|Plan|What's documented|
|---|---|---|---|
|AI writing coach (email review)|`ai_writing_coach`|All plans (Plans & Features) / Pro+ (deprecated PRD), conflict|Named only. No spec page. 3 credits in the deprecated price list.|
|AI email tone adjustment|`ai_tone_adjust`|Growth+|Named only. 1 credit. Presumably the "select tone" half of Write with AI, but never linked.|
|AI report generation (prompt-based)|`ai_report_generation`|Pro 20/mo, Ent unlimited|Named only. 5 credits, monthly cap per plan. No spec.|
|Email follow-up gap detection|`followup_gap_detection`|Pro+|Named only. No spec.|
|Email variants (A/B)|—|Pro+|Specified in Sequences: Sequential / Weighted / Equal / Auto-optimize with a "configurable, default 20 sends" learning period on open, click or reply rate. Rule-based, not LLM, but the one AI-adjacent feature with a shipped configurable numeric default.|
|Forecasting / AI forecast amount|`forecasting`|Pro+|Named. `AI forecast amount` exists as a Deal calculated field. Marked v 2 on the Zulie placement page. No spec.|
|Next-Best Action recommendations|`next_best_action`|Pro+|Called "a native record-page feature" by the Pipeline Agent. Field `next_actions (count of pending only)`, non-editable, renders as action cards, read-only on the Insights tab. No generation spec.|
|Kickoff daily brief|`kickoff_briefing`|Growth+|Named. Consumes the AI task chip format. No spec page.|
|Data / job-change detection|`data_change_detection`|Pro+|`job_change_alert (AI, Yes/No)` exists but is "paused until the agent is built", which also blocks the Champion Risk factor's job-change signal.|
|Company news & funding alerts|`ai_company_news`|Pro+|Covered inside Company Signals (§2.6).|
|Talk-time & pace analytics|`talk_time_analytics`|Pro+|Feeds Meeting Score's Engagement dimension, surfaced as talk-to-listen ratio. No standalone spec.|
|Moment finder|`moment_finder`|Pro+|Named in the deprecated PRD only. No spec, no mention elsewhere.|
|AI autofill columns / custom score / enrichment score|—|—|All three named as live surfaces on the Zulie AI tag placement page. No spec exists for any of them.|
|AI-assisted object creation|—|—|"Describe object and create with AI", explicitly out of V 1, exploratory.|
|AI-powered workflow actions|`workflow_ai_actions`|Growth+|Workflows never consume credits except steps using an "AI-powered action". An AI toggle would need to govern these too.|

---

## 3. The control plane: what already exists

This is the machinery your project can reuse rather than build.

### 3.1 Credits and metering

Two separate pools:

**AI / Intelligence Credits, per user per month.** Free 100, Growth 600, Pro 2000. `1 AI credit = $0.007 of tokens`, sold at $0.01 for a 30% margin. Per-user was chosen deliberately, "so one power user can't exhaust the team budget."

**Enrichment Credits, per workspace per month.** Free 5, Growth 25, Pro 75, plus N per extra seat.

Metering is cost-derived rather than a per-feature price list: `credits_consumed = CEILING(true_internal_cost ÷ 0.007)`. The engineering rules are to track actual tokens, convert to provider cost then SparrowCRM cost, divide, round up, deduct after task completion, and refund on failure.

Overflow allows a temporary negative balance (Free 10, Growth 50, Pro 75) before AI services stop. Enrichment has no overflow.

Customers never see tokens, model pricing, provider pricing or internal costs.

One gap matters to you: nowhere in the corpus can an admin allocate or cap credits per user or per team. Allocation is purely plan × seat. That white space is the clearest cost-control argument for per-user AI toggles.

The deprecated pricing PRD holds the only per-feature credit price list: AI summary 1, copilot query 1, AI field auto-population 2, AI email draft 3, deal loss analysis 5, meeting transcription 10, pre-meeting brief 3, meeting scoring 2, call AI 10. Treat those as prior thinking, since the approved model computes from tokens.

### 3.2 Plan gating

Every feature gets a `feature_gate` string checked server-side and client-side: a `@PlanGate('gate')` decorator on the server, a `usePlanGate('gate')` hook on the client. Numeric quotas use `limit_key` names. The performance budget is "plan gate check under 5 ms (cached per request); credit balance check under 50 ms."

About 25 AI feature_gate strings already exist and are named: `ai_copilot`, `ai_record_intelligence`, `ai_tags`, `ai_scoring`, `ai_fields`, `ai_writing_coach`, `ai_tone_adjust`, `ai_report_generation`, `ai_contact_summary`, `ai_company_overview`, `ai_key_insights`, `deal_health_score`, `deal_loss_analysis`, `competitor_tracking`, `deal_sentiment`, `next_best_action`, `multi_score_configurator`, `insights_tab`, plus twelve `meeting_*` gates and four `agent_*` gates.

That vocabulary gives you the lowest-friction design available: a per-user or per-org override layer resolving on top of the same gate key.

Two other things are already written down: "Feature gating regressions — Ship behind feature flag; **enable per-account**", so an account-level override concept exists in the plan. And "Credit costs configurable per plan in DB, no deploy."

### 3.3 Roles and permissions

Four default roles: Super Admin, Admin, Team Manager, Standard User. Custom roles are gated to Growth+, capped at 2 on Growth.

Three permission primitives coexist:

1. **Scoped record permission:** All / Team / Own / None, universal across objects.
2. **Boolean capability toggle:** ✓ On / ✗ Off.
3. **Module-level global toggle**, the closest existing analogue to a per-feature AI switch:

> "Global toggles (Enable Calls, Enable Reporting & Analytics, **Enable Agents**) act as master gates. When a toggle is OFF: **all child permissions under that module are effectively inactive**, regardless of their individual state. The UI should visually dim child permissions and block interaction. The **API should return 403** for any action in that module, even if the role has a child permission set."

The entire AI governance surface in the role model is three rows:

- AI Features & Agents → Create & use agents (✓ On, all roles)
- AI Features & Agents → Allow manual re-enrichment of records (✓ On, all roles)
- Sequences → Allow dynamic AI email creation (✓ On, all roles)

Three rows against roughly 20 always-on AI features. That's the gap.

AI permission dependencies are already specified, which sets the precedent for how an AI toggle acquires dependencies:

|Permission|Implicitly grants|Reason|
|---|---|---|
|Create and Edit AI Scores|Create fields for Contact and Company|"AI scores can be added as columns… so this is basically creating a new field"|
|Allow Manual Re-Enrichment|Contacts Edit — Own min OR Companies Edit — Own min|"Re-enrichment writes data back to the record"|
|Enable Meeting Analysis|Meetings View — Own min; Tasks Edit — Own min; Notes Edit — Own min|"The feature creates task and note records"|
|Allow Dynamic AI Email Creation|Edit — Own min|"AI writes the email on behalf of the user"|

"Enable AI Copilot" and "Enable Meeting Analysis" appear in Permission Dependencies but not in the Default Roles matrix. The two docs are already out of sync, which means the AI permission set is mid-flight and open to extension.

No field-level permissions exist. They're an Ent-only gate in the deprecated PRD and marked "TBD: What is this? (NA)" in the live matrix.

### 3.4 Settings IA

Two top-level trees, Personal and Admin. Four AI settings surfaces already exist, uncoordinated:

1. **`AI settings (org)`**, already scoped as: "**AI features global on/off**; Hygiene agent auto-apply vs suggest; Hygiene confidence threshold; Enrichment agent field permissions; Custom agent builder (manage agents); AI data usage opt-in/out." This is the natural home. It's currently one global master switch that your ~20 per-feature toggles would decompose into. (On the Settings page it sits as a top-level org section alongside Security, Audit log and Data enrichment rather than nested under the Admin bullet list, which is a minor IA inconsistency to tidy.)
2. **`Admin > AskSparrow (TBD)`**, an explicitly empty copilot settings slot.
3. **`Personal > AI credits and usage`**, the only per-user AI surface, and the natural home for user-level preferences.
4. **`Settings > AI scoring`**, a real Approved shipped AI configuration surface.

Two named IA hooks are perfect slots for per-object AI field config:

- `Data enrichment (org) > Fields to enrich per object`
- `Objects > general tab > Auto-enrichment policy per object`, written generically so it would extend to custom objects

Three cross-surface enforcement precedents are already written down, and they're exactly the semantics you need:

- "**Enable/Disable** (disabling here **disables it in User permissions too**)", a settings-to-permissions cascade on Data enrichment
- "**Do not record meetings** (disables all AI features and suggestions that use meeting recording as input)", one toggle killing a whole dependent AI cluster
- Toggle Gates §5.3, a module master gate returning 403 at the API regardless of child permission state

### 3.5 Preference storage levels

|Level|Exists?|Notes|
|---|---|---|
|Plan / account|Yes|`plan_tier` field; `@PlanGate`; per-account feature flag override planned|
|Org / workspace|Yes|Admin settings tree; AI features global on/off as a single boolean, not per-feature|
|Role|Yes|Where per-capability booleans live today; org-scoped, not team-scoped|
|Team|No|Teams exist only as a visibility scope. No team-level settings storage exists at all. Net-new infrastructure.|
|User|Partial|The Personal settings pattern exists (Appearance, Task settings, Notifications). Per-user AI is metering-only, no toggles.|
|Object|Partial|Auto-enrichment policy per object; the per-custom-object agentic toggle|
|Record|Yes|"When a new record is added, access is restricted to the Record owner only"|

Precedence between these levels is nowhere specified. Only three precedence statements exist anywhere: record access beats email access; toggle gates beat child permissions; enrichment settings beat user permissions. Your project has to define plan → org → role → team → user precedence explicitly, because no doc does.

### 3.6 The Custom Agent Builder as reference architecture

This is the most sophisticated configuration model SparrowCRM has, and most of it transfers.

The block model has three mandatory lanes:

|Lane|Contains|
|---|---|
|Source|What the agent reads: engagement data (transcripts, emails, notes, activities), record fields with related fields auto-included, block output references, uploaded files, URLs. Plus optional record filters, lookback (block default with per-source override, 90-day fallback), and auto-injected trigger context.|
|Intelligence|What the agent figures out: inference, scoring, detection, summarization, prediction.|
|Outcome|What happens: field updates, task creation, email sending, notifications, reports.|

A native feature like Key Insights is structurally already a block. Source is engagement plus record fields, Intelligence is detection, Outcome is rendering on the record page. The lane model gives you a ready vocabulary for exposing what it reads, what it decides, and where it lands.

Nine transferable primitives:

1. **Agent-managed fields.** When an Outcome writes to a nonexistent field, it's auto-created, named by the user, with the type auto-detected (Long Text for summaries, Number for scores, Multi-Select for tags). It carries an "Agent-managed" badge, allows one writer only, offers Replace (default) or Append-as-versions, appears in a collapsible "Agent Fields" section on the record, and persists as "Orphaned" if the agent is deleted. This is the mechanism for letting a user say "put this AI output on the record as a field."
2. **A three-tier guardrail library.** Always-on and locked (never write to system fields, never access records outside scope, always require a proof_statement for every field update). Selectable on-by-default (respect manual-edit cooldown, require minimum confidence before any write, never auto-send emails, rate limit per record per hour). Additional off-by-default (never move stage backwards, never modify closed records, quarantine suggestions for new reps for 30 days, block actions if approval rate <50%). Plus "+ Add custom guardrail".
3. **Four configurable numeric parameters:** manual-edit cooldown (default 24 h), confidence threshold for auto-apply (default High), max runs per record (default 5/hour), max run duration (default 60 min).
4. **Per-Outcome approval with a four-level resolution order:** "agent default → Outcome-level rule → field-level rule → locked rules (most specific wins)". Modes are Rep approval, Admin reviews first, or Force apply (admin-only, reversible via a Revert flow). Workspace defaults live in `Settings > Agents > Default Approval Rules` with a "Can rep change?" flag (Yes / Yes-but-lockable / No system-locked / No always-auto) and a tracked `using_default` per Outcome.
5. **Org-default plus instance-override inheritance** (Pipeline Agent): "changing an org default updates **only managers who haven't customized that setting**; a per-setting **'Reset to org default'** is available", with a visual indicator on overridden settings. This is the most directly applicable pattern for admin-sets-default with user-overrides on a native feature.
6. **A field dependency registry with health status.** Every agent maintains `(agent_id, block_name, lane, object_type, field_name, usage)`, rebuilt on save. Status is Healthy, Needs attention or Broken. Admins get a pre-delete warning: "This field is used by N agents across M reps", and Settings > Fields shows a "Used by N agents" counter.
7. **A test sandbox.** Read-only dry run against real, mock or uploaded data, with a step-by-step preview of what was read, decided and would be done, proof statements, and a token-consumption indicator per block.
8. **A Train tab.** Knowledge sources (file upload, URL crawl, API, webhook), examples and corrections (minimum 3 per action recommended), a terminology map of org terms to CRM concepts, historical won/lost patterns, accuracy metrics and a Retrain button.
9. **Guide versus Architect dual authoring.** Plain-language description alongside structured blocks, where "both produce the same underlying configuration."

The rep approval UX is the other reusable piece. Suggestions land in a Notification Center "Agent Suggestions" tab as digest cards, expanding to individual cards showing record, field, current versus suggested value, proof_statement, confidence, and Approve / Correct / Reject. "Correct is the best training signal": it writes the value and stores `{suggested_value, correct_value, field, record_context}`.

---

## 4. Prior art to read before designing

**`❌ Contact: Default automations` (2510192645)** is deprecated, but it's an earlier attempt at exactly your project. It's written as a literal settings-page mock with `[Toggle]` and `[Dropdown]` markers on every line, across seven categories: Data Enrichment & Cleansing, Ownership & Assignment, Associations & Linking, Lifecycle & Engagement, Notifications & Alerts, Scoring & Categorization, Compliance & Governance.

The Scoring block is the most on-point thing in the entire corpus:

> - **[Toggle] Auto-tag contacts by role** → Decision Maker, Influencer, Champion, etc. (AI or rules). _**or Define tags**_
> - **[Toggle] Auto-segment contacts by seniority level**
> - **[Dropdown] Mark as VIP if** — Title contains 'Founder' / 'CEO' / 'VP' — Or deal value > threshold
> - **[Toggle] Auto-score contacts based on engagement**
>     - **[Toggle]** Fit score (**have definition for each score**)
>     - **[Toggle]** Engagement score
>     - .. / ..

Per-feature on/off toggles on exactly the native features that are fixed in v 1: AI tagging with an "or Define tags" custom-vocabulary option, fit score, engagement score. Plus "have definition for each score" for user-authored definitions, and a trailing `.. / ..` showing the list was meant to extend.

Why it was deprecated isn't stated. The likeliest read from the corpus is that it was superseded by the Custom Agent Builder's guardrail library and per-Outcome approval model, plus Workflows for the non-AI rules. The Companies PRD lists "Settings configuration for the Company object" as out of scope for v 1, which is consistent with the whole object-settings idea being deferred rather than rejected.

One practical note: the page has a colour legend that markdown loses. "Black text: General ideas / **Green text: Important, must have** / Red text: To be discussed." Fetch it as HTML or ADF to recover which items were flagged must-have. That's free prioritisation signal.

**`❌Contact settings` (2510094342)** is also deprecated but carries the newest thinking (Aug 07). It lists more per-object AI toggles than any live page: "Use external data sources to enrich record information (Toggle)"; "Allow AI to log personal emails during enrichment (Toggle)"; "Allow all users to overwrite AI enriched fields (Toggle)"; "Enable AI data enrichment (toggle)"; "Auto-suggest Contacts based on ICP match (toggle)"; "Let AI dynamically suggest the CTA based on context (toggle)"; "Set custom time frames for triggering alerts (dropdown)".

---

## 5. Every hardcoded constant

The companion spreadsheet has this list with per-feature attribution.

**Timing and cadence**

1. AI summary and key insights polling: 5 min / 3 hr / 6 hr, all objects
2. Pre-meeting brief generated 24 hours before start
3. Calendar sync window: rolling 14 days; sync frequency undefined
4. AI Task from recap < 30 s; from deal-score drop < 60 s
5. Meeting recap to note < 60 s
6. Overdue sweep daily at 6 AM; AI Task expiry sweep weekly; auto-dismiss after 7 days
7. Fit and Multi-score recalc SLA < 60 s on individual record creation
8. Enrichment cadence: monthly / 14 days / 30 days, three conflicting values
9. Apollo: retry after no-match ≥ 30 days; eligibility window last engagement ≤ 2 months; SLA 5 min from record creation

**Fixed output shapes**

10. AI summary 3-7 bullets, no headers; meeting recording modal 2-3 bullets
11. Icebreakers 1-2; strategy 3-4 bullets; questions 3-4 max; conversation summary 2-3 points
12. Meeting-score feedback 2-3 suggestions; deal-loss takeaways 2-4 actions
13. Deal-loss granularity week-by-week
14. Copilot: 4-6 suggested prompt tiles; disambiguation max 5; chart types bar/line/pie/funnel
15. Deal Score first-time display: 2-3 factors

**Fixed thresholds**

16. Fit bands 70-100 / 40-69 / 0-39
17. Engagement ≥70 Strong, 0-69 Weak; colour bands 70 / 40 / 0; Low Engagement risk ≤ 69
18. Deal score ≥ 70 High Interest; > 85 Win Potential; < 30 DM engagement for deal loss
19. Meeting score < 50 Needs attention
20. Deal amount ≥ $5,000 High Value, USD hardcoded, conflicting with "> avg deal value"
21. Win Potential competitor cap ≤ 1
22. Buying Intent High ≥0.6 / Mid 0.4-0.6 / Low <0.4; decay 14 d and 14-30 d; Low override at 60-90 d
23. Stalled, Ghosted and stage-stuck 14 days; Untouched 2 days; No Activity (meeting) 7 days; risk lookback 45 days; intent stuck-stage 21 days
24. Strong momentum: 2 stages, ≤ 7 days per stage
25. AI Task cap 10 per rep
26. Score name cap 15 chars; header badge cap 5 pills; right panel 2 pills
27. Response-rate channel weights 33/33/33, labelled "default, not configurable"
28. Meeting-score weights 35 / 30 / 20 / 15
29. Buying-intent weights 40 / 30 / 20 / 10; engagement contributes ~40% over a 30-day window
30. Engagement: roughly 16 override values (+70 to −60), 4 recency decay tiers, response-ratio bands
31. Fit defaults: 500+ employees, > $1 M revenue, 20% each

**Fixed taxonomies and templates, none with an editor**

32. AI tag libraries per object (~23 / ~18 / ~21 / ~20) and every rule behind them
33. At Risk factor sets, 9-11 per object
34. Buyer taxonomies: 8-role (Contacts) versus 6-role (Companies/Deals), unresolved
35. Focus areas: 7 fixed values
36. Decision-maker title keyword lists, three different versions, plus 8 phrase-classification rules
37. Deal-loss reasons: 10 rep-logged, 6 AI-derived, plus evidence hierarchy and 5 guardrails
38. Pre-meeting brief: 2 variants × 6/7 fixed sections; 21 strategy params with 5-level priority; 9 icebreaker categories with tone and safety rules; 7/11 question categories; 27-topic conversation summary with recap tone rules
39. MOM structure plus auto-share email subject and body; Rep Notes structure
40. AI action-item categories (10 types); filters (All / Follow-up / Reconnects / Calls)
41. Task quick filters (5 fixed); due-date buckets (6 fixed)
42. Filter operator vocabulary per type plus date presets (Today, Yesterday, Last 7/30/90 days, This month, Last month, Custom), "fixed per type; every object inherits these with no per-object overrides"
43. Company `Industry` enum: ~180 values; Contact `department`: 24 values; `seniority_level`: 4 values
44. Copilot intent set: 32 rep + 21 manager
45. AI-enriched field lists per object, all `non-editable`
46. Apollo default mapping: 22 fields

**Fixed behaviours worth exposing**

47. No per-meeting AI opt-out, explicitly declined
48. Recording is org-wide binary only, no per-type, per-rep or per-contact consent
49. AI Tasks have no Accept step
50. Silent failure for AI task generation and note indexing
51. Deal loss triggers only on Closed Lost, no manual re-run
52. Calendar filter is admin-level; rep-level was raised and marked "(Ignore)"
53. "all reps see every score on a record (no role-based visibility)"
54. Manual-value overwrite protection is a hard invariant
55. Enrichment scoped to Contact and Company only; custom objects excluded entirely
56. AI Tasks limited to 4 objects at DB-constraint level; Lists to 3
57. No PII scrubbing in v 1; no AI-exclude flag on notes, private flag is v 2
58. Attendee enrichment runs on all attendees regardless of meeting size, explicitly declined to cap

---

## 6. Gaps, contradictions and decisions needed

**Blocking documentation gaps**

1. Deal Score computation: image only, zero text, despite ≥70 and >85 thresholds being referenced by tags on all four objects
2. Red Flag Detector: Notion-only, under two conflicting page IDs; the "last X days" window has no value
3. AI-autofill field creation: referenced, but no spec exists anywhere
4. Call AI data model: the Call fields page is empty. No AI summary field, no call score, no sentiment field, no transcript field
5. Pre-meeting brief storage schema: its own output fields are still "open question" despite "store on the meeting record" being a requirement
6. Eight Meeting Notion sub-specs never migrated, including "AI features & Scores" and "Meeting recording", the two most likely to hold transcription-provider and prompt detail
7. No AI Tags — Calls page; no suggested-meetings spec; no `custom score`, `AI autofill` or `enrichment score` spec despite all three being referenced

**Contradictions**

8. Engagement Score: an Approved fixed-formula spec versus a draft configurable-groups spec, incompatible
9. Buying intent at company level: the Deals page says highest-override aggregation, the Companies page says "no average or clubbed buying intent for a company"
10. High Value: `≥ $5,000` versus `> avg deal value across all the host's deals`, both on the same approved page
11. AI Tasks: "live tasks from creation… not suggestions needing approval" versus "AI Tasks created as suggestions", same page
12. Recommended strategy: "deprecated for this version" on Meetings versus fully specified and live on the scoring page
13. Buyer taxonomies: 8-role versus 6-role; decision-making power scale Yes/No/NA versus High/Mid/Low/NA
14. Engagement max display: Companies says the person's name isn't shown, Deals shows "Strongest connection: Alex Albon (53%)"
15. Credits: the approved doc says Free 100 / Growth 600 / Pro 2000; the deprecated PRD says Free 0 / Growth 1,000 / Pro 5,000. The approved doc's own rounding rule also contradicts its CEILING formula
16. Meeting Intelligence tiering: Plans & Features (newer) gives Growth recording, transcription, summary and pre-meeting brief; the PRD makes all of it Pro+
17. Enrichment cadence: monthly versus 14 days versus 30 days
18. Enrichment re-enrich: "Only AI fields can be manually re-enriched; 3 rd party enriched fields will be enriched only once" versus item 5 on the same page saying 3 rd-party fields do get a re-enrich option
19. Custom object AI coverage: Copilot SF.1 claims custom objects, Zulie tag placement doesn't enumerate them
20. Permissions: "Enable AI Copilot" and "Enable Meeting Analysis" exist in Permission Dependencies but not in the Default Roles matrix
21. Enrichment settings copy is wrong today: "Settings copy must say enrichment uses the customer's Apollo credits — remove 'All enrichments use AI credits.'"
22. AI versus provider enrichment precedence: explicitly deferred (Decision 2026-06-10), two uncoordinated write paths into the same fields
23. Fit score quantity gating versus the v 1 feature set: Plans & Features gives Growth "1 default + 1 custom" score, but the Approved configurator says "There is no option to create a new score" in v 1, and Multi-Score (which enables creation) is Pro+ only. Growth customers cannot create the custom score their plan entitles them to
24. Copilot free-tier gating: Plans & Features (current) gives Free full AskZulie; the deprecated PRD limits Free to 5 queries/month and states "Free plan has ZERO AI on records." The current matrix also gives Free 100 AI credits against the PRD's Free = 0. Treat the deprecated PRD's Free-tier numbers as superseded
25. AI task provenance: the Tasks PRD enum (`Manual / AI / Meeting recap / Sequence`) omits Email and Call, which the Task fields enum includes

---

## 7. Docs living outside Confluence

Each of these is a place where the Confluence page is deliberately thin and the real spec is in Notion. The semantics of the features you want to make configurable are disproportionately in this list.

|#|Referenced from|Spec|
|---|---|---|
|1|AI Tags- Contacts✅|Red flag Tag in Emails, `2 d 133 fc 67761802 b 93 cae 4936 a 32 aa 1 a`|
|2|AI Tags- Deals|Red flag Tag in Emails, `2 d 233 fc 677618147 a 587 e 205300557 ee` (different ID, same feature)|
|3|Contacts PRD §6.2|AI filters (Contacts), full list|
|4|Deals PRD §6.2|Quick filters (Deals)|
|5|Companies PRD §6.2|Quick filters (Companies)|
|6|Contacts PRD §6.3|AI insights (Contacts), full detail|
|7|Companies PRD §5.2|AI Insights Companies (Approved)|
|8|Key benefits §2|AI Tags (Deals)|
|9|Custom Agent Builder|AI Action Sentence Library, V 1 Templates, TLDR, all "remain in Notion"|
|10|Meetings|AI features & Scores, Meeting recording, Meeting recommendations, Meeting Settings, Meetings Settings-Admin, Meeting: Analytics, Meeting details page, Meeting Note Templates. Eight approved sub-specs, none migrated|
|11|Contacts List view & Tags|Quick filters - Contacts|
|12|Hygiene Agent_v 2|Knowledge Hub, which "does not exist yet". A hard dependency and the intended vehicle for user-authored rules|

---

## 8. What this means for the project

You're not starting from zero. You have one working precedent and a lot of stubbed intent.

The working precedent is the Fit Score / AI Score Configurator pattern: ship defaults, auto-derive them from what you know about the customer, detect "unconfigured," nudge with a banner that names the defaults, one-click into a rule builder over the org's own fields, weight by importance with a live-summing preview, then draft or publish. It's Approved, specified end to end, and already sitting at `Settings > AI scoring`.

The stubbed intent is substantial: the disable affordance already in the score data model "kept for future"; `AI settings (org)` with "AI features global on/off" as line one; `Personal > AI credits and usage`; `Data enrichment (org) > Fields to enrich per object`; `Objects > Auto-enrichment policy per object`; the `AskSparrow (TBD)` slot; roughly 25 `feature_gate` strings; the module master-gate pattern with 403-at-API semantics; and the settings-to-permissions cascade.

Genuinely net-new: any per-user AI toggle, since the role matrix has three AI rows all On for everyone; team-level config storage of any kind, since teams are a visibility scope only; admin allocation or capping of credits per user or team; and a precedence model across plan → org → role → team → user, which no document defines.

The three conversion targets with the most upside, ranked by constant density and blast radius:

1. **Tag thresholds.** 25+ constants, already internally inconsistent (14 versus 21-day stalls, $5,000 versus avg deal value). An org-level threshold config would fix existing contradictions as a side effect.
2. **Engagement Score.** Roughly 30 constants, including the 33/33/33 weights flagged "default, not configurable" and 16 values the doc itself calls "hardcoded." Plus an Approved-versus-draft spec conflict that a configurator would resolve.
3. **Tag enable/disable and rename.** The specs are full of unresolved naming debates written straight into the requirements. Per-org tag on/off plus label override settles them without another product debate.

Decide this first: does making native features configurable mean reusing the Custom Agent Builder's block model and dissolving the native/agent boundary, or defining that boundary explicitly for the first time and building a parallel settings plane?

The evidence points to the first option. The score configurators are already filed under the Agents module. The Agent Builder's Intelligence catalogue already contains `auto_tag`, `generate_summary` and `qualify_record`, with the first and third marked "not for v 1", implying the native versions are the v 1 answer for tagging and fit scoring. And the Pipeline Agent's org-default-plus-instance-override inheritance model is the shape you need. But no document states the decision, so someone has to make it before anything else gets spec'd.

---

_Sources: 45 Confluence pages in `SparrowCRM 2`. Full page-by-page attribution is in the companion spreadsheet, "Source Pages" sheet._