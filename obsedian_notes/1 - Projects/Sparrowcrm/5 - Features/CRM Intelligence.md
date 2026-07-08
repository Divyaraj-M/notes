---
owner: Divyaraj Murugan
feature: "[[Ai for CRM]]"
status: Done
tags:
  - sparrowcrm/features/aiagents/crm_intelligence
---

## 1. Why this document exists

"Intelligence" is a vision word, not a scope word. This document defines what the CRM Intelligence layer is, the three divisions it is built from, and the boundary rules that keep those divisions from colliding — so users always know what the AI is doing, and teams always know which surface owns a capability. Division-level detail (agent catalog, sequencing, non-goals) lives in the companion docs.

---

## 2. Definition

**CRM Intelligence is the capability of the CRM to work on records alongside the rep — doing work with permission, showing what it sees, and answering when asked — and to get measurably better from the rep's responses.**

The goal it serves: a CRM that learns by itself, processes leads, fetches context, and presents everything the rep needs to close more deals. Deal closing is the moat; intelligence is how the product earns it.

---

## 3. The three divisions

The layer is one intelligence with three delivery surfaces, distinguished by **interaction model**. Users don't need the architecture — they need three verbs:

|Division|Verb|Interaction model|Trust model|
|---|---|---|---|
|**Agents**|_Does work for you_|Push, with permission|Every output is a verdictable suggestion; autonomy earned via accept rates|
|**AI Signals**|_Shows you what it sees_|Ambient, read-only|No approval flow — interpretations and data, never proposals|
|**Conversational AI (Zuzile)**|_Answers when you ask_|Pull, on-demand|Rep initiates; nothing unprompted|

### 3.1 Agents — _does work for you_

Proactive workers. They run on triggers, schedules, or manual invocation ("Run Agent"), and every output is a **suggestion the record owner verdicts** (approve / reject / expire). Agents live inside the full learning loop: verdicts feed rolling accept rates, accept rates promote trusted action types toward auto-mode, and drops flag regressions.

Two generations:

- **v 1 — first-party agents**: released and maintained by us.
- **v 2 — CAB (Custom Agent Builder)**: users create their own agents on the same loop, same telemetry, same trust model. Different authorship, identical governance.

Governed by: **Agents — First Principle & Scope** (companion doc).

### 3.2 AI Signals — _shows you what it sees_

Ambient intelligence computed onto the record. Key Insights (buying intent, risk factors, competitor mentions, buyer profile, best time to contact), AI record summaries, meeting summaries, AI tags. Signals are **interpretations and context — never proposals**. There is nothing to approve; when confidence is insufficient, a signal says "Not enough data" rather than guessing.

**Sub-type — Data feeds (enrichment):** deterministic third-party data (e.g., Apollo). Not AI — no reasoning happens. Feeds auto-populate fields **with source attribution** ("via Apollo") without a verdict, under one hard rule: a feed never overwrites human-entered or agent-suggested values. Routing deterministic facts through the suggestion queue would flood reps with approvals for data that isn't a judgment call — wrong trust model.

### 3.3 Conversational AI (Zuzile) — _answers when you ask_

The rep initiates; Zuzile responds. It reads the same shared context layer — records, signals, agent outputs — and generates nothing unprompted. Zuzile is a window into the layer's intelligence, not a second brain beside it.

---

## 4. The shared context layer

All three divisions read from and write to **one context layer** — there are no per-division data silos:

- Agents write suggestions and (once approved) record changes into it
- Signals compute over it and render onto it
- Data feeds populate it with attributed facts
- Zuzile reads all of it to answer

This is what makes three surfaces feel like one intelligence: what one division learns or produces, the others can use.

---

## 5. Boundary rules (the anti-collision map)

Four places the divisions could collide, and the rule that resolves each:

**1. Signals vs. Agents — "informing" vs. "proposing."** "Buying intent: Low" (signal) and "this deal is at risk, do X" (agent) can sound identical. **Rule: signals never propose; agents never just inform.** A signal is an input; an agent turns inputs into a suggested action. Agents should _cite_ signals as evidence in their suggestions — cooperation, not competition.

**2. One event, two outputs — summary vs. field writes.** A single call produces both a meeting summary and extractable field values. **Rule: display is a signal, writes are agent work.** The rendered summary needs no verdict. Any field the AI wants to change from that call is a suggestion through the loop. The user-facing consequence: only things that change data require approval.

**3. Data feeds vs. research-style agents — both "bring outside info in."** **Rule: deterministic API data = feed (auto-fill, attributed); reasoned synthesis = agent (suggested, verdicted).** "Employee count: 250" is a fact — auto-fill. "Recent funding suggests budget availability" is an inference — suggestion. The line is whether reasoning happened.

**4. Zuzile vs. next-best-action agents — two sources of "what should I do?"** **Rule: Zuzile surfaces agent outputs; it does not generate rival recommendations.** If pending suggestions exist on a record, Zuzile presents those. Two different "next actions" from two surfaces is where user trust dies — this rule prevents it.

---

## 6. The UI contract

Signals and agent suggestions share the record page (Key Insights above Next Actions). The visual language must separate them unmistakably:

- **What AI thinks** (signals): no action controls — states, badges, summaries. Degrades to "Not enough data" honestly.
- **What AI wants to do** (agent suggestions): explicit Review / approve controls, pending states, verdict affordances.
- **What data feeds filled** (enrichment): source attribution visible on the value.

This distinction _is_ the user's mental model of the entire layer. If a user ever asks "do I need to approve this?", the UI has failed the contract.

---

## 7. Learning across the divisions

The learning loop (suggest → verdict → accept rates → behavior adjusts) is fully live in the **Agents** division from day one. The other divisions join it progressively:

- **Signals**: lightweight feedback ("was this insight useful?") as a later addition — verdict-shaped, not blocking.
- **Zuzile**: response-level feedback (useful / not) as a later addition.
- **Data feeds**: no learning — deterministic data doesn't improve from verdicts; it improves from better sources.

One principle across all of it: **the layer learns only from in-workspace responses. No signal crosses tenants.**

---

_Companion docs: Agents — First Principle & Scope (governs the Agents division), Run→Suggestion→Verdict telemetry spec, agent-level PRDs._