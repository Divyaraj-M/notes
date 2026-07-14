## 1. What this layer is

Layer 1 is the CRM's **instance data** — contacts, companies, deals, activities, tasks, and everything captured as the business runs. It is what the intelligence layer reasons _about_: the subject of every agent action, every signal, every Zulie answer about a specific entity.

A record answers one kind of question: **"what is true about _this_ entity?"** — this contact's title, this deal's stage, this company's size. It never answers "what is true across our deals" — that altitude belongs to Layer 3.

---

## 2. What it holds

- **Object records** — People, Companies, Deals, lists, and custom objects, each with system and custom attributes.
- **Notes** — free-text notes attached to records.
- **Emails** — sent and received messages logged against contacts and deals, including threads and signatures.
- **Meetings & calls** — the events plus their recordings, transcripts, and AI summaries.
- **Activity** — the full interaction timeline: logged touches, status changes, and engagement history.
- **Tasks** — open and completed, linked to records, with due dates and assignees.
- **Files & attachments** — documents attached to records (proposals, contracts, decks the rep exchanges).
- **Computed signals** — buying intent, risk factors, etc. (rendered onto records; owned by the AI Signals division, stored at instance level).

In short: **everything a rep touches in a normal day** — the records they work, the conversations they have, the emails they send, the tasks they chase, the files they exchange. If it was captured as a byproduct of doing the work, it's Layer 1.

---

## 3. Why it's the foundation

Everything above Layer 1 is derived from it. Context (L 2) describes how to interpret records; the Knowledge Base (L 3) is distilled _from_ records. If Layer 1 is wrong, every layer above inherits the error — which is the entire reason the hygiene agents exist: **Layer 1 quality is the precondition for the whole intelligence layer.** Garbage records produce garbage patterns and garbage answers.

---

## 4. Nature of this layer

|Property|Value|
|---|---|
|Altitude|Instance — about one entity|
|Origin|Generated automatically by usage|
|Change rate|Constant|
|Reasoned about or with|**About** — the subject of reasoning|
|Governance|Hygiene agents keep it clean; owners are accountable per record|
|If wrong|One bad record (but errors propagate upward if used to distill patterns)|

---

## 5. Relationship to the other layers

- **→ Layer 2 (Context):** Context is the lens for reading Layer 1. "Stage = Negotiation" (record) means nothing until Context defines what Negotiation requires.
- **→ Layer 3 (Knowledge Base):** Records are the **raw material** L 3 distills patterns from. Fifty closed deals (L 1) become one win/loss pattern (L 3). The record stays in L 1; the _lesson across records_ rises to L 3. This is why extracting a pattern into the KB is **not** duplication — the instance stays put, only the generalization moves up.

---

## 6. Boundary

Layer 1 is captured operational data, not authored knowledge. A transcript is Layer 1 even though it's rich — it was captured as a byproduct of a call, not deliberately established as reusable grounding. The moment a human or agent distills a _reusable lesson_ from records, that lesson becomes Layer 3; the records themselves never leave Layer 1.

---
