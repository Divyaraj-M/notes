---
related:
  - "[[Zulie]]"
  - "[[Agents in CRM]]"
  - "[[Email_v1]]"
  - "[[2-Product Strategy]]"
  - "[[Ai Fields]]"
  - "[[Hygiene Agent_v1]]"
  - "[[5 - Features]]"
  - "[[Deal_v1]]"
  - "[[1-Product Vision]]"
  - "[[First Principle for a CRM]]"
  - "[[ECHS – Knowledge Transfer (KT) Document]]"
  - "[[Product Vision]]"
  - "[[README]]"
  - "[[README]]"
  - "[[Context info - PRD]]"
---

## 1. What this division is

AI Signals is the layer's ambient intelligence: computed interpretations rendered onto records. A signal never proposes a change and never asks for approval — it informs. When confidence is insufficient, a signal degrades honestly to "Not enough data" rather than guessing.

The division has two sub-types with different natures:

- **AI Signals proper** — reasoned interpretations computed by AI over CRM activity
- **Data feeds (enrichment)** — deterministic third-party facts, no reasoning involved

---

## 2. Shipped signals — Key Insights

Rendered on the record page under **Key Insights**:

|Signal|What it tells the rep|Display shape|Empty state|
|---|---|---|---|
|**Best time to contact**|When this person is most responsive, learned from interaction history|Time window|"Not enough data" until interaction volume supports it|
|**Buying intent**|How ready this contact/account is to buy, inferred from engagement and conversation signals|Level badge (Low / Medium / High)|—|
|**Risk factors**|Threats to the relationship or deal detected in conversations and activity|Count + expandable list (e.g., "4 detected")|0 detected|
|**Competitor mentions**|Competitors named in calls, meetings, and emails|Count / expandable list|"Not enough data"|
|**Buyer profile**|The buyer archetype(s) this contact matches|Type badge (e.g., "1 type")|—|

_(Computation windows, confidence thresholds, and refresh cadence per signal: to be confirmed and filled in from the Notion specs.)_

---

## 3. Shipped signals — summaries and tags

- **AI record summary** — generated overview of a record's current state and history, shown on the record.
- **Meeting summary** — generated after calls/meetings; the _display_ of what happened. Boundary with Agents: the summary itself is a signal (no verdict); any **field** the AI wants to change from the same call is agent work and goes through the suggestion loop.
- **AI tags** — auto-applied classification labels on records.

---

## 4. Data feeds — enrichment (Apollo)

Deterministic third-party data. Not AI — no reasoning happens, so the trust model differs from everything else in the layer:

- Feeds **auto-populate** firmographic and contact fields without a verdict.
- Every fed value carries **source attribution** ("via Apollo") visible on the field.
- **Hard rule:** a feed never overwrites human-entered or agent-suggested values. Human input is ground truth; agent suggestions are pending judgments; feeds fill only what's empty or feed-owned.
- Rationale: routing deterministic facts through the suggestion queue would flood reps with approvals for data that isn't a judgment call.

Boundary with Agents (research-style work): **deterministic API data = feed; reasoned synthesis = agent suggestion.** "Employee count: 250" is a fact — auto-fill. "Recent funding suggests budget availability" is an inference — suggestion through the loop.

---

## 5. Division-wide behaviors

1. **Recompute on activity** — signals refresh as new interactions arrive; they are living values, not one-time computations.
2. **Honest degradation** — below its confidence threshold, a signal shows "Not enough data." No signal guesses to look smart.
3. **Explainability** — every signal is expandable to show what it was computed from (which calls, which messages, which activity). A signal a rep can't interrogate is a signal a rep won't trust.
4. **No proposals** — the moment something wants to _change_ data or _recommend_ an action, it has left this division and belongs to Agents.

---

## 6. How signals feed the rest of the layer

- **Agents consume signals as evidence.** A pipeline agent citing "buying intent dropped to Low" in its suggestion is the intended relationship — signals are inputs to agent reasoning, rendered to humans along the way.
- **Zuzile reads signals** to answer questions; it presents them, it doesn't recompute them.
- **Learning (later):** lightweight per-signal feedback ("was this insight useful?") is a planned addition — verdict-shaped but non-blocking. Signals do not gate on the learning loop the way agent suggestions do.

---

## 7. Open items (refine along the way)

- Per-signal computation windows, thresholds, refresh cadence — from Notion specs
- Signal-level feedback design (thumbs / useful-not-useful) and where it feeds
- Which future signals earn a place in Key Insights vs. which are agent evidence only
- Enrichment field ownership map: which fields are feed-owned vs. human/agent-owned

---

_Companion docs: CRM Intelligence — The Layer (umbrella) · Agents — First Principle & Scope · Zuzile — Division Doc._