[[Roadmap for Agents]]
## 1. Why this document exists

Agents are the "does work for you" division of the CRM Intelligence layer (see companion doc: _CRM Intelligence — The Layer_). Left undefined, "agents" justifies building anything and proves nothing. This document fixes the first principle, the boundary, and the test every piece of agent work must pass. It deliberately does not describe individual agents, their sequencing, or their design — those live in the agent roadmap and per-agent PRDs. This is the layer above them.

---

## 2. Definition

**Agents are workers that act on a record before the rep does — and get measurably better at it from the rep's response.**

It is not a feature, and it is not one pipeline. It is a cycle that **every agent runs, whatever its domain**:

> **Capture → Reason → Act → Learn**

- **Capture** — the agent gathers its input: CRM records, call/meeting activity, external sources. What gets captured differs per agent; that it starts from real context does not.
- **Reason** — the agent draws a conclusion from that input: a field is wrong or missing, context is absent, a deal is stalled, a next step exists.
- **Act** — the agent proposes the change: a field update, added context, an extracted signal, a suggested action. In v 1, acting always means _suggesting_ — the rep's verdict gates every write.
- **Learn** — the rep's verdict (approve / reject / expire) feeds back. Accept rates tune the agent, promote trusted actions toward auto-mode, and flag regressions.

What distinguishes agents from each other is their **domain** — data hygiene, enrichment, signal extraction, deal guidance — not the cycle. Each domain is the full-time job of its own agent(s), all sharing one context layer: what one agent cleans, another builds on. Agent-to-domain mapping lives in the agent roadmap, not here.

**The learning loop.** Learn is not the end of the cycle — it is what closes it. Every verdict flows back into the next run:

> **Suggest → rep verdict (approve / reject / expire) → rolling accept rates update → agent behavior adjusts → better suggestions on the next Capture**

Concretely: per agent × action type, rolling accept/expiry rates are maintained. Crossing a trust threshold promotes that action type toward auto-mode; a drop after a version change flags a regression and rolls it back. This is the mechanism that makes the CRM _self-learning_ with zero historical data — reps label the dataset as a side effect of reviewing suggestions. Intelligence without this feedback edge is just automation.

---

## 3. First Principle

> **Every unit of agent work must produce a suggestion on a specific record that its owner can verdict — and that verdict must change future behavior.**

Three clauses, each load-bearing:

1. **A suggestion on a specific record.** Agent work manifests as a concrete, reviewable proposal (a field value, a piece of context, an extracted signal, a next action) attached to a contact, company, or deal. Unrequested dashboards, roll-up reports, or narrative summaries do not qualify as v 1 agent work — they have no verdict; ambient insight belongs to the AI Signals division, not to Agents. (Rep-_initiated_ generation, such as a future "create me a report for objective X" capability, is a separate on-demand surface and may later join the loop by making its outputs verdictable.)
2. **That its owner can verdict.** The record owner approves, rejects, or lets it expire (v 1 verdicts: approve / reject / expire — inline editing of a suggestion is a later addition). Suggest-mode is the default state of every agent; autonomy is earned per action type when accept rates prove trust (trust before autonomy).
3. **The verdict changes future behavior.** Rolling accept/expiry rates promote actions to auto-mode, flag regressions, and tell us which agent to fix. If a verdict goes nowhere, the loop is broken and the work doesn't qualify.

**The scope test (apply to any proposed work):** _Does it produce a suggestion a rep can verdict?_ If no — it is not Agents v 1 work; it may belong to another division of the intelligence layer (Signals, Zuzile, data feeds), but not here.

---

## 4. Scope

### 4.1 One-line scope statement

> **Agents v 1: agents suggest field updates and next best actions on rep-owned records. Signals extracted by agents feed the shared context behind those suggestions; enriched context as a rep-facing suggestion type comes later. Suggest-mode first, learning only from per-workspace rep verdicts, measured by accept rate and suggestions-acted-on feeding WAA-3 V.**

### 4.2 In scope

v 1 agent work surfaces to the rep as **suggestions on rep-owned records** — field updates and next best actions, per the scope statement above. The specific suggestion types, their behavior, and which agents deliver them are detailed in the agent roadmap doc, deliberately not here.

Behind the suggestions, agents extract signals from calls, meetings, and other activity into the **shared context layer** — that extraction is in scope, but it feeds suggestions rather than surfacing as its own suggestion type.

Common properties: rep-owned records only; every rep-facing output is a suggestion; every suggestion gets a verdict; every verdict is logged (Run → Suggestion → Verdict) and drives autonomy promotion.

### 4.3 Out of scope (non-goals — parked, not rejected)

|Non-goal|Why it's out|
|---|---|
|**Autonomous outreach** (sending to prospects)|Act-stage autonomy before trust is earned; highest blast radius. Note: _drafting_ for rep review is a suggestion and passes the scope test — only autonomous _sending_ is out|
|**Forecasting & lead scoring** (any "predict" verb)|Requires closed-deal volume that doesn't exist yet; produces narrative, not verdicts|
|**Pipeline analytics roll-ups as agent work**|Read views over data are reporting, not agent work; fails the scope test|
|**AI report generation (objective-driven, rep-initiated)**|Planned future extension, not v 1. Different surface: rep asks, system generates — no proactive suggestion, so it sits outside the v 1 loop. When built, its outputs become verdictable artifacts (useful / not / regenerate), joining the loop rather than bypassing it|
|**Cross-customer / cross-tenant learning**|Year-2 story; privacy and architecture minefield. Learning = per-workspace verdicts only|
|**User-built custom agents / agent builder (CAB)**|v 2, not v 1. Same loop, same telemetry, same trust model when it lands — first-party catalog proves the model first|
|**Workflow automation (if-this-then-that)**|Zapier-shaped, not agent-shaped; no learning loop|

Each of these will be requested within the next 4 months. This table is what lets us say "good idea, parked" instead of scope-bleeding.

### 4.4 Boundary rules

- **Ownership boundary:** agents act on records the reviewing rep owns. Owner always reviews, regardless of who or what generated the trigger. Unowned/orphaned records are a known, named gap for v 1.
- **Autonomy boundary:** nothing writes without approval until its accept rate earns auto-mode for that specific action type. No global autonomy switch.
- **Learning boundary:** the system learns only from verdicts within a workspace. No signal crosses tenants.
- **Data boundary:** human-entered values are never overwritten silently; an edit by a rep is ground truth and outranks any suggestion.

---

## 5. The shipped agent surface

What exists in product today, which this scope governs:

- **Agent detail page** — status (active / paused), trigger badges (e.g., after call, after meeting), run history split into _Pending approval_ and _Past_, per-run actions count and token cost, and a Review flow per run.
- **Run analytics** — total runs, agent health, approval rate, total suggestions, last active, monthly token usage.
- **Agent identity** — "What does this agent do": when it swoops in (triggers) and its superpowers (capabilities), editable.
- **Approval mode** — per-agent setting; default "Always ask for approval." Auto-mode is earned per action type via accept-rate thresholds, never granted globally.
- **Run Agent (manual trigger)** — owner-scoped: runs on records the triggering rep owns; manual runs land in the same Run → Suggestion → Verdict pipeline as triggered runs, logged with `trigger_type: manual`.

---

## 6. How value is proven

The measurable unit of agent work is the **accepted suggestion**. Everything rolls up from there:

- **L 3 (signal):** suggestions issued, verdict rates (accept / reject / expire; edit-verdict is a post-v 1 addition), time-to-verdict
- **L 2 (health):** accept rate per action type; **accept-rate delta (learning velocity)** — the change in rolling accept rate across measurement windows and agent versions. Delta up is the proof the loop is improving the agent; delta down after a version change is a regression flag to roll back. Snapshot accept rate says suggestions are good — the delta says the system is _learning_. Also: actions graduated to auto-mode
- **L 1 (North Star):** suggestions-acted-on as value actions feeding **WAA-3 V**

At the end of 4 months the value statement is concrete, not narrative: _"X% of suggestions accepted, trending +N points since launch · Y fields auto-maintained · Z hours of rep data-entry eliminated · first action types graduated to auto-mode."_

If a quarter of work cannot be summarized in that sentence shape, it was out of scope.

---

## 7. Decision protocol

When new agent work is proposed (by leadership, prospects, or dogfood users):

1. Apply the scope test: _does it produce a suggestion a rep can verdict?_
2. **Pass** → prioritize normally against the roadmap.
3. **Fail** → check the non-goals table (§4.3). If listed, it's parked with a reason. If it belongs to another division of the intelligence layer (Signals, Zuzile, data feeds), route it there. If genuinely new, add it to §4.3 with a reason — it does not get built inside Agents v 1.


|     |     |
| --- | --- |
|     |     |
