---
tags:
  - new_feature/projects_traning_loop/v2
state: "[[Focus]]"
---

---

## 1. Problem Statement

When users generate Q&A pairs within a project, reviewed answers currently have no mechanism to flow back into the Knowledge Hub (KH) they originated from. This means curated, human-verified answers sit isolated inside individual projects rather than enriching the shared knowledge base that powers future answer generation.

Users who invest time reviewing and refining answers expect that work to compound — improving the KH for their team and for subsequent projects. Without this loop, every new project starts from the same baseline, and verified knowledge is effectively lost.

The cost of not solving this: duplicated review effort across projects, degrading user trust in answer quality over time, and a KH that never improves from real-world usage.

---

## 2. Goals

1. **Close the feedback loop:** Reviewed questions are automatically trained back into the associated KH, so the knowledge base improves with every review cycle.
2. **Maintain KH integrity:** No duplicate entries are created when questions are edited and re-reviewed, or when KH associations change.
3. **Respect the review lifecycle:** Only human-reviewed, approved answers enter the KH. Draft or Pending Review answers never contaminate the knowledge base.
4. **Handle KH switching gracefully:** When a user changes the associated KH mid-project, the system preserves existing work while correctly routing future reviews to the new KH.
5. **Reduce review friction:** The training-back process should be invisible to the user — no extra steps beyond the review action they already perform.

---

## 3. Non-Goals

1. **Multi-KH training per question:** A reviewed question trains to exactly one KH. If multiple KHs were previously associated, we require the user to pick one. Supporting fan-out to multiple KHs adds complexity with unclear value (separate initiative if demand emerges).
2. **Bulk KH migration tooling:** We are not building a tool to move already-trained questions from one KH to another in bulk. Users who switch KH accept that prior reviews stay on the original KH.
3. **Conflict resolution UI for KH content:** If trained content conflicts with existing KH entries, the new content overwrites. We are not building a merge/diff interface for v1 (too complex, premature).
4. **Versioning of KH entries:** We will not maintain a version history of trained Q&A within the KH. The KH stores the latest reviewed version only.
5. **Automatic re-review triggers:** If the KH content changes externally, we will not flag previously reviewed questions for re-review (separate initiative).

---

## 4. User Stories

### Core Flow

- **As a project reviewer,** I want my reviewed answers to automatically train back into the KH so that the knowledge base improves without me taking extra steps.
- **As a project reviewer,** I want to see which KH a question will train to so that I have confidence my review is going to the right place.
- **As a project owner,** I want to change the associated KH mid-project so that I can correct a mistake or shift strategy without losing my existing reviewed work.

### KH Selection

- **As a project owner,** I want to be warned if multiple KHs are associated with my project so that I can select the correct one before reviews start training.
- **As a project owner,** I want the system to enforce a single-KH selection so that there is no ambiguity about where reviewed questions land.

### Edit & Re-review

- **As a reviewer,** I want to edit a previously reviewed answer and have it move back to draft so that I can improve it and re-review without creating a duplicate in the KH.
- **As a reviewer,** I want a question moved back to draft to be removed from the KH so that outdated answers don't persist in the knowledge base.

### Edge Cases

- **As a reviewer,** I want the system to handle KH switches without duplicating questions so that the KH stays clean even if I change my mind.
- **As a reviewer,** I want to understand what happens to my reviewed questions if I switch KH so that I can make an informed decision.

---

## 5. Requirements

### Must-Have (P0)

**R1: Review → Train to KH**  
When a question's status changes from Pending Review to Reviewed, the Q&A pair is automatically trained (added/updated) to the single associated KH. Training only happens on the final transition to Reviewed — the Draft → Pending Review transition does not trigger training.

_Acceptance criteria:_

- Given a question is in Pending Review status and a single KH is associated
- When the reviewer marks the question as Reviewed
- Then the Q&A pair is added to the associated KH
- And the question shows a "Trained" indicator in the UI
- Given a question is in Draft status
- When it moves to Pending Review
- Then no training occurs (the question is awaiting human review)

**R2: Single-KH Enforcement**  
If a project has multiple KHs associated, the system shows a warning requiring the user to select exactly one KH before any review-to-KH training occurs.

_Acceptance criteria:_

- Given a project has multiple KHs associated
- When a user attempts to move a question from Pending Review to Reviewed
- Then a warning is displayed: "Multiple Knowledge Hubs detected. Please select one KH for training."
- And the review action is blocked until a single KH is selected
- The Draft → Pending Review transition is unaffected by this check

**R3: Edit → Back to Draft → Remove from KH**  
When a reviewed question is edited, it moves back to Draft status and is removed from the KH. The question must then progress through Draft → Pending Review → Reviewed again before re-training.

_Acceptance criteria:_

- Given a question is Reviewed and trained to KH
- When the reviewer edits the answer
- Then the question status moves to Draft
- And the Q&A pair is removed from the KH
- Given the edited question moves through Draft → Pending Review → Reviewed
- Then the KH entry is updated (not duplicated)
- And the system matches on a stable question identifier, not content

**R4: KH Switch — Preserve Existing, Reset Reviewed to Pending Review**  
When the associated KH is changed mid-project:

1. Already-trained Q&A pairs remain in the _original_ KH (they are not removed or migrated).
2. Only questions in Reviewed status are reset to Pending Review (so they must be re-reviewed before training to the new KH).
3. Questions in Draft or Pending Review remain in their current status — they have not been trained, so no reset is needed.
4. New reviews train to the _new_ KH.

_Acceptance criteria:_

- Given a project with KH-A where 5 questions are Reviewed (trained to KH-A), 2 are Pending Review, and 1 is in Draft
- When the user switches the project to KH-B
- Then the 5 trained entries remain in KH-A
- And the 5 previously Reviewed questions move to Pending Review
- And the 2 Pending Review questions remain as Pending Review
- And the 1 Draft question remains as Draft
- And subsequent Pending Review → Reviewed transitions train to KH-B

**R5: Draft ← Reviewed → Removed from KH; Re-review → Re-added**  
When a reviewed-and-trained question is manually moved back to Draft (without editing), it is removed from the KH. The question must go through the full Draft → Pending Review → Reviewed cycle again to re-train.

_Acceptance criteria:_

- Given a question is Reviewed and trained to KH
- When the question is moved to Draft status
- Then the Q&A pair is removed from the KH
- When the same question progresses through Draft → Pending Review → Reviewed
- Then the Q&A pair is re-added to the KH (same entry, no duplicate)

**R6: Stable Question Identity**  
Each question must have a stable internal identifier that persists across edits, status changes, and KH switches. This identifier is used to prevent duplicates in the KH.

_Acceptance criteria:_

- A question's identifier does not change when its content is edited
- A question's identifier does not change when its status changes
- The KH uses this identifier to upsert (update-or-insert) rather than blind-insert

**R6b: Manual "Remove from Hub" Behavior**  
The existing "Remove" action in the Trained dropdown must correctly update the question's state to prevent orphaned reviewed-but-untrained questions.

_Acceptance criteria:_

- Given a question is Reviewed and trained to the KH
- When the user clicks "Remove" from the Trained dropdown
- Then the Q&A entry is removed from the KH
- And the question status moves back to Draft (or a clearly distinguishable "Reviewed — Not Trained" state)
- And a confirmation dialog is shown before the removal explaining the impact
- And re-reviewing the question re-trains it to the KH (no duplicate, uses stable ID)

### Nice-to-Have (P1)

**R7: KH Switch Confirmation Dialog**  
Before switching KH, show a confirmation summarizing the impact: how many questions are currently reviewed/trained, and that they will remain on the old KH.

**R8: "Trained to" Indicator per Question**  
Each question in the project shows which KH it was trained to (if any), so reviewers can audit the state at a glance.

**R9: Training Failure Handling**  
If training to the KH fails (network error, KH unavailable), the question remains in Reviewed status but shows a "Training Failed — Retry" state. The user can manually retry.

**R10: Batch Review Support**  
Allow users to mark multiple questions as Reviewed in one action, with all of them training to the KH. If any fail, show a summary of successes and failures.

### Future Considerations (P2)

**R11: Multi-KH Fan-out**  
Allow a reviewed question to train to multiple KHs simultaneously. Requires a KH-selection UI per question or per batch.

**R12: KH Conflict Detection**  
When training would overwrite an existing KH entry that was modified externally, surface a conflict for the user to resolve.

**R13: Training Audit Log**  
Maintain a log of all train/remove events per KH entry, including who triggered it and when.

**R14: Undo KH Switch**  
Provide a way to revert a KH switch within a grace period, automatically re-linking the trained entries.

**R15: Smart Merge for KH Duplicates**  
When a KH switch and switch-back (or multiple projects on the same KH) results in duplicate or near-duplicate entries in the KH, a smart merge mechanism should detect and reconcile them. This could work as an on-demand "KH health check" or as an automatic background process. Approaches to evaluate: exact-match deduplication on question text, semantic similarity scoring (e.g., embedding-based), or a manual review queue surfacing suspected duplicates for a human to merge or dismiss. This is critical for maintaining KH quality as adoption grows and KH switches become more common.

---

## 6. State Transition Diagram

```
                                                    ┌──────────────────────────┐
                                                    │                          │
                                                    ▼                          │
   ┌─────────┐  submit   ┌─────────────────┐  review   ┌──────────┐          │ edit / move-to-draft
   │  DRAFT  │ ────────► │ PENDING REVIEW  │ ────────► │ REVIEWED │ ─────────┘
   └─────────┘           └─────────────────┘           └──────────┘
       ▲                                                    │
       │                                                    │  (on review → auto-train)
       │                                                    ▼
       │                                             ┌──────────────┐
       │                                             │ TRAINED (KH) │
       │                                             └──────────────┘
       │                                                    │
       │  (on edit / move to draft / remove from hub)       │
       └────────────────────────────────────────────────────┘
                         removes from KH
```

**Key transitions:**

- **Draft → Pending Review:** Question is submitted for review. No KH interaction.
- **Pending Review → Reviewed:** Human approves the answer. Triggers training to KH.
- **Reviewed → Draft:** On edit, manual move-to-draft, or "Remove from Hub". Removes entry from KH.
- **Draft → Pending Review → Reviewed:** Full re-review cycle required to re-train.

**KH Switch transitions:**

```
Project KH: A → B

Reviewed questions → reset to Pending Review
Draft questions → stay as Draft (unaffected)
Pending Review questions → stay as Pending Review (unaffected)
Entries already in KH-A → remain in KH-A (no removal)
Future Pending Review → Reviewed transitions → train to KH-B
```

---

## 7. Edge Cases — Detailed Analysis

### Case 1: KH Switch Mid-Project

**Scenario:** User creates project with KH-1, generates and reviews some answers, then switches to KH-2.

**Behavior:**

- Existing Q&A trained to KH-1 stays in KH-1.
- Only Reviewed questions reset to Pending Review. Draft and Pending Review questions stay as-is.
- New reviews train to KH-2.
- If the user creates new Q&A on KH-2, these are new entries (not linked to KH-1 entries).

**Sub-case — Switch back to KH-1:**  
If the user switches back to KH-1, Reviewed questions reset to Pending Review again. Re-reviewing a question that _already exists_ in KH-1 (from the first round) will create a **duplicate** in KH-1 because the system generated a new Q&A entry when the KH was switched to KH-2 (the stable ID tracks the project-level question, but KH-2's round created a separate entry). This is the "rarest of cases" but is a known limitation in v1.

**Duplicate risk:** The core issue is that switching KH and then switching back can result in the same question content living in the KH twice — once from the original round and once from the re-review. The stable ID alone cannot solve this because the KH entry from the first round is orphaned (no longer linked to the project's active KH association). Solving this properly requires a **smart merge** mechanism that can detect semantically duplicate entries in a KH and reconcile them. This is explicitly a **P2 / future consideration** — see R15 below.

### Case 2: Edit After Review (No KH Switch)

**Scenario:** Question goes Draft → Pending Review → Reviewed (trained) → Edited → Draft → Pending Review → Reviewed (re-trained).

**Behavior:**

- On edit: status moves to Draft, entry removed from KH.
- Question must go through Pending Review again before reaching Reviewed.
- On re-review (Pending Review → Reviewed): entry is upserted back into KH using stable ID.
- No duplicate is created. The KH entry is updated with the new content.

### Case 3: Manual Move to Draft (No Edit)

**Scenario:** Reviewed and trained question is manually moved back to Draft without content changes.

**Behavior:**

- On move to Draft: entry removed from KH.
- On re-review: entry re-added to KH.
- Identical to Case 2 from the system's perspective — the stable ID ensures no duplication.

### Case 4: KH Deleted or Becomes Unavailable

**Scenario:** The KH associated with a project is deleted or access is revoked after questions have been trained to it.

**Behavior:**

- Questions in the project retain their Reviewed status (status is a project-level concern, not a KH-level one).
- The "Trained to KH-X" indicator should show a warning: "Knowledge Hub unavailable."
- New reviews cannot train until a valid KH is re-associated.
- Previously trained entries in the deleted KH are gone (cascading delete from KH side).

### Case 5: Rapid KH Switching (A → B → C → A)

**Scenario:** User switches KH multiple times in quick succession, potentially before reviews on any single KH occur.

**Behavior:**

- Each switch resets only Reviewed questions to Pending Review.
- Only the _currently associated_ KH receives new reviews.
- If no reviews happened on KH-B or KH-C, those KHs are unaffected (nothing was trained).
- Switching back to KH-A: **duplicate entries may be created** in KH-A (same limitation as Case 1 sub-case). The entries trained in the first round are orphaned, and re-reviewing creates new entries. Smart merge (R15, P2) is needed to clean this up.
- Edge concern: if switching is automated/scripted, rate-limit KH switches (P2).

### Case 6: Concurrent Review During KH Switch

**Scenario:** User A is reviewing a question at the exact moment User B switches the project KH.

**Likelihood:** Extremely rare and negligible. Requires two users performing actions on the same project at the exact same moment.

**Behavior:**

- No special handling needed for v1. The review trains to whichever KH is associated at the time the request is processed (standard last-write-wins).
- If this ever surfaces as a real issue, revisit in a future version.

### Case 7: Bulk Operations

**Scenario:** User selects 20 questions and marks them all as Reviewed at once.

**Behavior:**

- All 20 should train to the current KH.
- If some fail (e.g., network timeout on 3), the 17 successes are committed and the 3 failures show "Training Failed — Retry."
- Partial success is acceptable; atomic all-or-nothing is not required for v1.

### Case 8: Question Deleted After Training

**Scenario:** A question that has been reviewed and trained to the KH is deleted from the project.

**Behavior:**

- **Individual question deletion:** The trained entry should be removed from the KH (cascade delete).
- **Project deletion (v1):** Trained Q&A entries remain in the KH even after the project is deleted. This avoids accidental data loss for shared KHs.
- **Project deletion (v2):** Will add the option to remove trained Q&A from the KH on project deletion, with a caution modal warning the user before proceeding.

### Case 9: Duplicate Content Across Projects

**Scenario:** Two different projects, both associated with the same KH, review questions with identical or near-identical content.

**Behavior:**

- Each project's questions have independent stable IDs.
- Both entries will exist in the KH separately.
- For v1, no deduplication is performed. The KH may contain semantically similar entries from different projects.
- **P2 consideration:** Content-based deduplication or similarity detection.

### Case 10: Manual "Remove from Hub" Action

**Scenario:** A reviewed and trained question has a "Remove" option in the Trained dropdown (visible in the current UI). The user clicks Remove, which untrains the question from the KH. The question remains in the project with Reviewed status but is no longer in the KH.

**Problem:** If this question belongs to only one project, the trained content is now effectively garbage — it exists nowhere useful. The KH lost it, and the project still shows it as Reviewed, which is misleading since it is no longer contributing to the knowledge base.

**Behavior:**

- On "Remove from Hub": the Q&A entry is deleted from the KH. The question's status in the project should change to reflect it is no longer trained (e.g., status reverts to "Reviewed — Not Trained" or "Draft").
- **Recommendation:** When a user clicks Remove, show a confirmation: "This will remove the answer from the Knowledge Hub. The question will move back to Draft so it can be re-reviewed and re-trained later." This prevents the orphaned state where a question is Reviewed but not trained and the user forgets about it.
- If the user explicitly wants to remove it permanently (not re-train), the question should still move to Draft so the Reviewed status is not misleading.
- **Open question:** Should "Remove from Hub" also change the question status, or should there be a separate "Trained" vs "Not Trained" indicator independent of Draft/Reviewed? See Open Questions.

---

## 8. Success Metrics

### Leading Indicators (1–4 weeks post-launch)

|Metric|Target|Stretch|Measurement|
|---|---|---|---|
|% of reviewed questions successfully trained to KH|95%|99%|Backend event logs|
|Duplicate entries created in KH per 1,000 reviews|< 5|0|KH audit query|
|KH switch operations completed without data loss|100%|100%|Backend event logs|
|Time from review action to KH training complete|< 2 seconds|< 500ms|Latency monitoring|
|User-reported training errors per week|< 10|< 3|Support tickets tagged "training-loop"|

### Lagging Indicators (1–3 months post-launch)

|Metric|Target|Stretch|Measurement|
|---|---|---|---|
|KH answer quality improvement (measured by downstream answer accuracy)|+10%|+20%|A/B test on projects using trained vs. untrained KH|
|Reduction in duplicate review effort across projects|-25%|-40%|Compare review rates before/after|
|User satisfaction with KH relevance (survey)|4.0/5.0|4.5/5.0|In-app survey, quarterly|
|Support tickets related to KH data quality|-30%|-50%|Support ticket volume|

---

## 9. Open Questions

|#|Question|Owner|Blocking?|
|---|---|---|---|
|1|~~Should deleting a project remove all its trained entries from the KH?~~ **RESOLVED:** v1 keeps trained Q&A in the KH even after project deletion. v2 will add the ability to remove trained Q&A from KH on project deletion, with a caution modal warning the user of the impact.|Engineering + Product|**Resolved**|
|2|When a KH switch happens, should we show a confirmation listing how many entries remain on the old KH, or just a simple warning?|Design|No|
|3|What is the expected latency SLA for training to KH? Is synchronous (blocking the review action) acceptable, or must it be async?|Engineering|**Yes**|
|4|How should we handle the "switch back" duplicate scenario at scale — is the stable-ID upsert approach sufficient, or do we need a dedicated reconciliation job?|Engineering|No|
|5|~~For concurrent review + KH switch (Case 6), which approach do we take?~~ **RESOLVED:** Not an issue — extremely rare scenario, no special handling needed. Standard last-write-wins behavior is acceptable.|Product + Engineering|**Resolved**|
|6|Is there a maximum number of questions that can be trained to a single KH? Are there performance concerns at scale?|Engineering|No|
|7|Should the "Trained" indicator be visible only to reviewers, or to all project members?|Design|No|
|8|When "Remove from Hub" is clicked, should the question revert to Draft (requiring the full Draft → Pending Review → Reviewed cycle), revert to Pending Review (shorter path back), or stay Reviewed with a separate "Not Trained" indicator? Each has trade-offs: Draft is safest but most friction; Pending Review is a middle ground; staying Reviewed risks the orphaned-but-looks-fine problem.|Product + Design|**Yes**|

---

## 10. Timeline Considerations

- **No hard external deadline**, but this feature is a prerequisite for the "KH quality improvement" initiative planned for Q3.
- **Dependency:** Stable question identifier (R6) may require a schema migration. This should be scoped first.
- **Suggested phasing:**
    - **Phase 1 (v1):** R1–R6 (core training loop, single-KH enforcement, stable IDs, all state transitions). Target: 3–4 sprints.
    - **Phase 2 (fast follow):** R7–R10 (confirmation dialog, trained indicator, failure handling, batch review). Target: 1–2 sprints.
    - **Phase 3 (future):** R11–R14 (multi-KH, conflict detection, audit log, undo). Timing TBD based on user feedback.

---

