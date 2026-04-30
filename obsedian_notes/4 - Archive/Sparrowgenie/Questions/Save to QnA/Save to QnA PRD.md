---
tags:
  - "#new_feature/save_to_qna/v1"
status: Dropped
---


---

## 1. Problem Statement

Proposal teams repeatedly answer the same RFP questions across projects. Good answers get lost inside completed projects and never become reusable knowledge. The question was whether users need a manual "Save to Knowledge Hub" button so they can push individual Q&A answers into the KH during project work.

After first-principles analysis, the answer is no. The RFP Answer Training Loop (currently in PRD) already solves this problem at a system level. Building a manual save button would create a temporary workaround that teaches users a habit we would later need to undo.

---

## 2. First Principles Analysis

### The Core Question

If the RFP training loop automatically pushes all reviewed Q&A pairs to the Knowledge Hub at project completion, what does a manual save button actually solve?

### What the Training Loop Already Covers

|Capability|Handled by Training Loop?|
|---|---|
|Capture reviewed Q&A pairs|Yes — at project completion|
|Route answers to correct KH|Yes — BM25 segregation for multi-hub|
|Deduplicate against existing entries|Yes — change detection (30–40% threshold)|
|Track reuse and provenance|Yes — reuse count + provenance chain|
|Grow KH from real proposal work|Yes — every completed project feeds back|

### What the Save Button Would Add

Only two things the training loop does not cover:

- **Speed:** Users could push answers to KH before project completion instead of waiting weeks.
- **Curation signal:** Users could mark specific answers as high-value, instead of the system treating all project answers equally.

Neither justifies the cost. Here is why.

#### Why Speed Does Not Justify It

The training loop fires at project completion. Until then, answers live inside the project. A save button would let users push answers to KH mid-project. But this creates a parallel ingestion path that complicates deduplication, change detection, and provenance tracking. The engineering cost of handling two entry points is not worth the marginal speed gain.

#### Why Curation Does Not Justify It

The training loop treats all reviewed answers equally. A save button would let users flag specific answers as reusable. But the reuse tracking system already solves quality differentiation over time: answers that get reused across projects rise in ranking, answers nobody picks stay low. The system learns quality from usage data, not from a user clicking a button once.

### The Real Risk of Building It Now

The training loop is not yet implemented. Building the save button as a stopgap means users learn the manual workflow. When the training loop ships, we face two problems: migrating user behavior away from manual save, and deciding whether to keep or kill a feature people are already using. Shipping a workaround before the real system creates a permanent expectation from a temporary problem.

---

## 3. Decision

| Field              | Details                                                                                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**       | **Drop the feature. Do not build the Save to KH button.**                                                                                                        |
| **Rationale**      | The RFP Answer Training Loop already captures, routes, deduplicates, and tracks all reviewed Q&A pairs. A manual save adds a parallel path with no unique value. |
| **Instead, build** | The RFP Answer Training Loop (as specified in existing PRD). This is the correct first-principle solution.                                                       |
| **Revisit if**     | After the training loop ships, user feedback explicitly requests mid-project knowledge capture. Data-driven decision at that point.                              |

---

## 4. Goals

Not applicable. Feature dropped before goal-setting stage.

The goals this feature would have served are already covered by the RFP Answer Training Loop:

- Reduce proposal writing time by 30–50% (via answer reuse from KH)
- Achieve 60%+ project-to-KH contribution rate within 90 days of training loop launch
- Reduce SME burden by 25–40% through knowledge reuse

---

## 5. Non-Goals

|Non-Goal|Why Out of Scope|
|---|---|
|Manual Save to KH button|Training loop handles this automatically. Manual save creates parallel path and behavioral debt.|
|Mid-project knowledge capture|No validated need. Revisit only if post-launch data from training loop shows demand.|
|User-curated quality signals|Reuse tracking + change detection already differentiate quality over time.|

---

## 6. User Stories

|#|User|I want to...|So that...|Resolution|
|---|---|---|---|---|
|US-1|SME|Save a high-quality answer to KH immediately|It is reusable in parallel projects|Covered by training loop at project completion|
|US-2|Proposal Owner|Mark an answer as reusable knowledge|KH library quality stays high|Reuse tracking handles quality over time|
|US-3|Knowledge Admin|Review manually saved entries|KH stays clean|Training loop includes review gate|

---

## 7. Requirements

No requirements. Feature dropped.

All underlying needs are addressed by the RFP Answer Training Loop PRD, specifically:

- P0.2 — Project-to-KH Feedback Loop (automatic capture at completion)
- P0.4 — BM25 Answer Retrieval (reuse of captured knowledge)
- P0.5 — Reuse Tracking (quality differentiation through usage)
- P0.6 — Change Detection and Deduplication (prevents stale and duplicate entries)

---

## 8. User Flows

No new user flows required. The existing training loop flow handles the complete lifecycle:

**Project Q&A → Human Review → Project Completion → Auto-feedback to KH → Change Detection → KH Updated**

---

## 9. Screens and Components

No new screens or components. No design work required.

---

## 10. Design Constraints

Not applicable.

---

## 11. Success Metrics

This feature was dropped, so there are no direct metrics. The training loop metrics serve as the proxy:

|Metric|Target|Measure By|Tool|
|---|---|---|---|
|KH entries from completed projects|60%+ projects contribute|90 days post-launch|Product analytics|
|Answer reuse rate|70%+ reuse|120 days post-launch|Product analytics|
|User requests for manual save|Monitor (revisit trigger)|Ongoing|Support tickets / feedback|

---

## 12. Open Questions

|#|Question|Owner|Blocking?|Status|
|---|---|---|---|---|
|Q1|After training loop ships, will users request mid-project knowledge capture?|Product|No|Monitor post-launch|
|Q2|Should KH support answer blocks (reusable fragments) in addition to Q&A pairs?|Product|No|V2 consideration|

---

## 13. Timeline and Dependencies

- **Hard deadlines:** None. Feature dropped.
- **Dependencies:** RFP Answer Training Loop must ship first. That is the real solution.
- **Revisit condition:** Only if post-launch user feedback from the training loop shows clear demand for mid-project knowledge capture.

---

## 14. Jira Tickets

No tickets required. Feature not entering development.

If revisited in the future, create a spike ticket under the Knowledge Hub epic for discovery research.

---

## Changelog

| Date       | Author | Changes                                                                                                                     |
| ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------- |
| March 2026 | Prod   | Initial analysis. Feature evaluated through first principles and dropped. Training loop identified as the correct solution. |