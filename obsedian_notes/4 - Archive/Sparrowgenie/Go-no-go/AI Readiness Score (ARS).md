---
related:
  - "[[RFP training PRD]]"
  - "[[Training back Projects into Knowledge Hubs]]"
  - "[[Context info - PRD]]"
  - "[[First Principle thinking - Table View]]"
  - "[[External Questionnaire Score (EQS)]]"
  - "[[Competitors Info]]"
  - "[[Product Vision]]"
  - "[[Getting started  with SparrowGenie]]"
  - "[[Product Strategy]]"
  - "[[Demo]]"
  - "[[Product Spec - Template]]"
  - "[[WYSIWYG editor - First Principle]]"
  - "[[Proposal Conversion Flow]]"
  - "[[Save to QnA PRD]]"
  - "[[RFP to Proposal]]"
---
## Why this exists

ARS helps teams understand **how ready they are to respond to an RFP using their existing Knowledge Hub**.

Before committing to a deal, teams need to know:

- Can we answer this RFP properly?
- How much manual work will this require?
- Are we walking into an execution risk?

ARS answers that question early, with clarity.

---

## Context

### Problem we’re solving

Sales and proposal teams often say “Go” on deals without knowing how much of the RFP they can actually answer using their current knowledge.

This leads to:
- Last-minute scrambling
- Heavy manual writing
- Inconsistent answers
- Missed deadlines or low-quality submissions

There is no clear signal today that says:

> “We are X% ready to respond to this RFP.”

---

## Opportunity

SparrowGenie already has:

- Structured RFP questions
- A defined Knowledge Hub (KH)
- AI-generated responses

ARS connects these pieces to give a **clear execution-readiness signal** before teams invest effort.

This helps teams:

- Make realistic Go / No-Go decisions
- Allocate proposal effort better
- Avoid overcommitting to deals they can’t execute well

---

## Target users

### Primary user

- Sales reps / proposal owners deciding whether to proceed with an RFP

### Secondary users

- Proposal managers planning effort
- Sales managers reviewing feasibility

### Out of scope

- Quality grading of answers
- Competitive strength analysis
- Timeline or deadline pressure

---

## What ARS measures (very important)

ARS measures **capability**, not intent or fit.

> ARS answers:  
> “What percentage of this RFP can we confidently answer using the selected Knowledge Hub?”

It does **not** measure:

- Deal attractiveness
- Buyer intent
- Likelihood to win
- Pricing or negotiation risk

Those belong to other signals.

---

## Core concept

If:

- Total RFP questions = **Q**
- Questions answerable from selected KH = **A**

Then:

`ARS = A / Q`

This value can be shown as:

- A ratio (0–1), or
- A percentage (0–100%)

---

## Definition of “Answerable”

A question is considered **answerable** if:

- The **Genie AI** can generate an answer
- Using **only** the selected Knowledge Hub
- With sufficient confidence
- Without requiring external research or manual authoring

If any of these conditions fail, the question is **not answerable**.

This is a binary decision:

- Answerable → counted
- Not answerable → not counted

No partial credit.

---

## Scope

### Included in this release

- ARS calculation based on selected Knowledge Hub
- Binary answerability classification per question
- ARS displayed as percentage
- Per-question answerability breakdown (for explainability)

### Explicit non-goals

- Partial answer scoring
- Answer quality grading
- Automatic Go / No-Go decisions
- Weighting questions by importance

---

## Handling special cases

### Multi-part questions

- Treat multi-part questions as **one question**
- Only count as answerable if **all parts** can be answered from KH

(This keeps ARS simple and conservative.)

---

### Knowledge Hub dependency

- ARS is always calculated against the **selected Knowledge Hub**.
- Same RFP + different KH selections can result in different ARS values.
- This is expected and correct behavior.

---

## ARS calculation logic (dev-ready)

### Inputs

- `Q_total` = total number of RFP questions
- `Q_answerable` = number of questions answerable using selected KH

 **Formula**

>`ARS = Q_answerable / Q_total`

**Range**

> `0 ≤ ARS ≤ 1`

**Interpretation:**
We are ready to answer ~70% of this RFP using our existing knowledge.