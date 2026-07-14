---
related:
  - "[[Teardowns]]"
  - "[[Zoom]]"
  - "[[Product Spec Template 2]]"
  - "[[Feature Template]]"
  - "[[Custom Agent builderv1]]"
  - "[[PRD Feature Name]]"
  - "[[Product Spec - Template]]"
  - "[[Product specs]]"
  - "[[Product specs]]"
  - "[[Decisions]]"
  - "[[Competitors Info]]"
  - "[[5 - Features]]"
  - "[[recommendation-canvas-template]]"
  - "[[Spec Template]]"
  - "[[RFP to Proposal]]"
---
Copy this, fill it in for one feature. Each lens has its sharp test in brackets — answer it honestly before moving on.

---

![[Pasted image 20260601143807.png]]
# Feature Lens — [feature name]

**Product's core promise:** [the one thing this product promises to do well, in one sentence]

## Purpose

- **Does:** [the literal, mechanical behaviour]
- **Job:** [the outcome the user actually wants from it]
- **Before:** [the workaround or pain that existed without it]
- _[Test: can you name a real pain that predates this feature? If not, flag it.]_

## Demand shape

- **Frequency:** [per-session / daily / weekly / occasional / once-in-a-lifetime]
- **Trigger:** [self-initiated / event-driven / scheduled / fallback-when-something-breaks]
- **Breadth:** [every user / a segment / a sliver]
- _[Test: if it's rare, is it triggered by a high-stakes moment? If so, treat it as insurance.]_

## System role

- **Role vs. the promise:** [core / enabling / peripheral]
- **Depends on:** [features/services it needs to work]
- **Depended on by:** [features that break or degrade without it]
- _[Test: if you removed this node, would other features wobble?]_

## Cost of absence

- **User track:** [leaves / works around it / doesn't notice]
- **Business track:** [revenue / retention / trust / compliance impact]
- _[Test: does its absence cause damage beyond the feature itself? Note any gap between the two tracks.]_

## Verdict

- **Posture:** [The Spine / Safety Net / Habit Surface / Cut Candidate]
- **Decision:** [invest / maintain / fix / cut]
- **Why (one line):** [the single most important reason]

---

## The four postures (reference)

||Low criticality|High criticality|
|---|---|---|
|**High frequency**|**Habit Surface** — polish for delight|**The Spine** — optimize relentlessly|
|**Low frequency**|**Cut Candidate** — justify or remove|**Safety Net** — rare, but must never fail|

The interesting features are usually on the off-diagonal — the ones that look minor until you price their absence.