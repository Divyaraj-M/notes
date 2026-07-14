## 1. What this division is

Zulie is the layer's conversational surface — already live, pre-dating the agent catalog. The rep initiates; Zulie responds. It is a window into the layer's intelligence, not a second brain beside it: it reads the same shared context layer (records, AI signals, agent outputs) that the rest of the layer runs on, and generates nothing unprompted.

---

## 2. What Zulie does

- **Answers over CRM data** — questions about contacts, companies, deals, pipeline, and activity, grounded in the workspace's records.
- **Creates and updates records on instruction** — the rep can ask Zulie to create a contact or update one ("add Priya from Acme," "change her title to VP Sales"), and Zulie executes it. The rep's explicit instruction is the approval — no second confirmation loop for what the rep just asked for. Zulie shows what it created/changed so the rep can verify at a glance.
- **Reads the whole context layer** — records, signals, and agent outputs are all available to it, so answers reflect the same intelligence the rest of the layer produces, not a parallel computation.
- **Surfaces, doesn't rival** — for questions like "what should I do on this deal?", if pending agent suggestions or computed signals exist, Zulie presents _those_. It does not generate a competing recommendation (umbrella boundary rule 4). Two different "next actions" from two surfaces is where user trust dies; this rule prevents it.

---

## 3. What Zulie deliberately doesn't do

- **Nothing unprompted.** No proactive messages, no ambient computation. Push belongs to Agents; ambient belongs to Signals. If Zulie ever needs to "reach out," that capability should ship as an agent, not as chat behavior.
- **No volunteered writes.** The write rule turns on **who initiated**: rep-instructed changes ("create this contact," "update that field") execute directly — the instruction is the approval. But anything Zulie _volunteers beyond the ask_ ("I also noticed her company field looks outdated — want me to fix it?") is AI-initiated and goes through the suggestion/verdict loop like agent work. Zulie never changes data the rep didn't ask about.

---

## 4. Relationship to the other divisions

|Interaction|Rule|
|---|---|
|Zulie × Agents|Presents pending suggestions when relevant; never generates rival recommendations; a Zulie-initiated data change is a suggestion, not a direct write|
|Zulie × Signals|Presents computed signals in answers; does not recompute or contradict them|
|Zulie × Data feeds|Reads attributed feed values like any other field; attribution surfaces in answers where relevant|

---

## 5. Data and learning

- **Pre-release usage data** predates the telemetry model and is treated as unreliable for analysis. The layer's clean data starts with the Run → Suggestion → Verdict tables; Zulie's clean data starts when its feedback instrumentation ships.
- **Learning (later):** response-level feedback (useful / not useful) is a planned addition — Zulie joins the learning loop progressively rather than blocking on it.
- **Boundary that always holds:** learning is per-workspace only. No conversational data or learned behavior crosses tenants.

---

## 6. Open items (refine along the way)

- Current production write behavior — verify and align with the no-silent-writes rule
- Response feedback design and where it feeds
- Zulie's presentation format for pending suggestions (inline cards vs. links to review queue)
- Scope of "answers over CRM data": which questions are in v-current vs. deferred (e.g., cross-record analysis, report-style asks — the latter belongs to the future AI report surface)

---

_Companion docs: CRM Intelligence — The Layer (umbrella) · Agents — First Principle & Scope · AI Signals — Division Doc._