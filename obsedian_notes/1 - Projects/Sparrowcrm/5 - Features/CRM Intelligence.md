---
owner: Divyaraj Murugan
feature: "[[Ai for CRM]]"
status: Done
tags:
  - sparrowcrm/features/aiagents/crm_intelligence
---
## 1. Why this document exists

"Intelligence" is a vision word, not a scope word. Left undefined, it justifies building anything and proves nothing. This document fixes the definition, the boundary, and the test every piece of intelligence work must pass. It deliberately does not describe individual agents, their sequencing, or their design — those live in their own specs. This is the layer above them.

---

## 2. Definition

**CRM Intelligence is the capability of the CRM to act on a record before the rep does — and to get measurably better at it from the rep's response.**

It is not a feature, and it is not one pipeline. It is a cycle that **every agent runs, whatever its domain**:

> **Capture → Reason → Act → Learn**

- **Capture** — the agent gathers its input: CRM records, call/meeting activity, external sources. What gets captured differs per agent; that it starts from real context does not.
- **Reason** — the agent draws a conclusion from that input: a field is wrong or missing, context is absent, a deal is stalled, a next step exists.
- **Act** — the agent proposes the change: a field update, added context, an extracted signal, a suggested action. In v1, acting always means _suggesting_ — the rep's verdict gates every write.
- **Learn** — the rep's verdict (approve / reject / expire) feeds back. Accept rates tune the agent, promote trusted actions toward auto-mode, and flag regressions.

What distinguishes agents from each other is their **domain** — data hygiene, enrichment, signal extraction, deal guidance — not the cycle. Each domain is the full-time job of its own agent(s), all sharing one context layer: what one agent cleans, another builds on. Agent-to-domain mapping lives in the agent roadmap, not here.

**The learning loop.** Learn is not the end of the cycle — it is what closes it. Every verdict flows back into the next run:

> **Suggest → rep verdict (approve / reject / expire) → rolling accept rates update → agent behavior adjusts → better suggestions on the next Capture**


---

## 3. First Principle

> **Every unit of intelligence must produce a suggestion on a specific record that its owner can verdict — and that verdict must change future behavior.**

Three clauses, each load-bearing:

1. **A suggestion on a specific record.** Intelligence manifests as a concrete, reviewable proposal (a field value, a piece of context, an extracted signal, a next action) attached to a contact, company, or deal. Unrequested dashboards, roll-up reports, or narrative summaries do not qualify as v1 intelligence — they have no verdict. (Rep-_initiated_ generation, such as a future "create me a report for objective X" capability, is a separate on-demand surface and may later join the loop by making its outputs verdictable.)
2. **That its owner can verdict.** The record owner approves, rejects, or lets it expire (v1 verdicts: approve / reject / expire — inline editing of a suggestion is a later addition). Suggest-mode is the default state of all intelligence; autonomy is earned per action type when accept rates prove trust (trust before autonomy).
3. **The verdict changes future behavior.** Rolling accept/expiry rates promote actions to auto-mode, flag regressions, and tell us which intelligence to fix. If a verdict goes nowhere, the loop is broken and the work doesn't qualify.

**The scope test (apply to any proposed work):** _Does it produce a suggestion a rep can verdict?_ If no — it is not CRM Intelligence v1, whatever else it may be.

---

## 4. Scope

### 4.1 One-line scope statement

> **CRM Intelligence v1: the CRM suggests field updates and next best actions on rep-owned records. Signals extracted by agents feed the shared context behind those suggestions; enriched context as a rep-facing suggestion type comes later. Suggest-mode first, learning only from per-workspace rep verdicts, measured by accept rate and suggestions-acted-on feeding WAA-3V.**

### 4.2 In scope

v1 intelligence surfaces to the rep as **suggestions on rep-owned records** — field updates and next best actions, per the scope statement above. The specific suggestion types, their behavior, and which agents deliver them are detailed in the agent roadmap doc, deliberately not here.

Behind the suggestions, agents extract signals from calls, meetings, and other activity into the **shared context layer** — that extraction is in scope, but it feeds suggestions rather than surfacing as its own suggestion type.

Common properties: rep-owned records only; every rep-facing output is a suggestion; every suggestion gets a verdict; every verdict is logged (Run → Suggestion → Verdict) and drives autonomy promotion.

Out-of-scope items (the parked non-goals list) live in the **agent roadmap doc**, alongside the agents themselves — this document defines the test that puts them there, not the list.

### 4.3 Boundary rules

- **Ownership boundary:** intelligence acts on records the reviewing rep owns. Owner always reviews, regardless of who or what generated the trigger. Unowned/orphaned records are a known, named gap for v1.
- **Autonomy boundary:** nothing writes without approval until its accept rate earns auto-mode for that specific action type. No global autonomy switch.
- **Learning boundary:** the system learns only from verdicts within a workspace. No signal crosses tenants.
- **Data boundary:** human-entered values are never overwritten silently; an edit by a rep is ground truth and outranks any suggestion.

---

## 5. How value is proven

The measurable unit of CRM Intelligence is the **accepted suggestion**. Everything rolls up from there:

- **L3 (signal):** suggestions issued, verdict rates (accept / reject / expire; edit-verdict is a post-v1 addition), time-to-verdict
- **L2 (health):** accept rate per action type; **accept-rate delta (learning velocity)** — the change in rolling accept rate across measurement windows and agent versions. Delta up is the proof the loop is improving the agent; delta down after a version change is a regression flag to roll back. Snapshot accept rate says suggestions are good — the delta says the system is _learning_. Also: actions graduated to auto-mode
- **L1 (North Star):** suggestions-acted-on as value actions feeding **WAA-3V**

At the end of 4 months the value statement is concrete, not narrative: _"X% of suggestions accepted, trending +N points since launch · Y fields auto-maintained · Z hours of rep data-entry eliminated · first action types graduated to auto-mode."_

If a quarter of work cannot be summarized in that sentence shape, it was out of scope.

---

## 6. Decision protocol

When new intelligence work is proposed (by leadership, prospects, or dogfood users):

1. Apply the scope test: _does it produce a suggestion a rep can verdict?_
2. **Pass** → prioritize normally against the roadmap.
3. **Fail** → check the parked non-goals list in the agent roadmap doc. If listed, it's parked with a reason. If new, it gets added there with a reason — it does not get built inside Intelligence v1.

---

_Companion docs: agent roadmap & sequencing, Run→Suggestion→Verdict telemetry spec, agent-level PRDs._