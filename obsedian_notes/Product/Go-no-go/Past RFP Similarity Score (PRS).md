## What PRS measures (lock this)

PRS measures:

> **The percentage of current RFP questions that are similar to questions seen in previous RFPs.**

It does **not** care about:

- Whether the past RFP was won or lost
- Whether answers were good or bad
- Whether the deal was successful

Only **question similarity** matters.

---

## Core concept

If:

- Total questions in current RFP = **Q**
- Questions that match similar questions in past RFPs = **M**

Then:

`PRS = M / Q`

Displayed as a percentage.

---

## Definition of “similar question”

A question is considered **similar** if:

- It is semantically similar to a question in past RFPs
- Similarity score ≥ system-defined threshold
- Match is found in **any** previous RFP

This is a binary decision per question:

- Similar → counted
- Not similar → not counted

No partial credit.

---

## PRS calculation logic (dev-ready)

### Inputs

- `Q_total` = total number of questions in current RFP
- `Q_matched` = number of questions with similarity match in past RFPs

### Formula

`PRS = Q_matched / Q_total`

Range:

`0 ≤ PRS ≤ 1`

(or ×100 for percentage)

---

## Example

- Current RFP has **200 questions**
    
- **120 questions** are similar to questions seen in past RFPs
    

`PRS = 120 / 200 = 0.6 (60%)`

Interpretation:

> 60% of this RFP is familiar territory.  
> 40% introduces new or uncommon requirements.