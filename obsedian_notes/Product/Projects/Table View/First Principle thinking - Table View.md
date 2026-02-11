#enhancements/table_view/research

## How you should actually use this

- **Feature ideation** -> Sections 1-3 decide if it is worth building
- **Design discussions** -> Section 6 dominates
- **Engineering alignment** -> Sections 2 + 5
- **Leadership reviews** -> Sections 3 + 9

### 1. Problem (no solution words)

What user pain exists even if our product did not exist?

Sales teams and proposal owners handling RFPs must coordinate hundreds or even thousands of questions under deadline pressure, but execution data is scattered across people, docs, and spreadsheets; this makes it slow to triage work, hard to track ownership, and risky to trust project progress until very late in the cycle.

##### Who experiences it?
- Sales people
- RFP bidders / proposal managers
- Sales directors
- SMEs and reviewers

##### When does it occur?
- At the start of every RFP cycle
- During weekly review and submission windows
- Most severe in large questionnaires (200+ to 2000+ questions)

##### What breaks because of it?
- Assignment and status tracking become manual and fragmented
- Teams miss deadlines because blocked questions are discovered late
- Leaders make go/no-go and staffing decisions using incomplete progress data
- Organizations depend on individual memory instead of a shared, durable system

---

### 2. Non-negotiable truths

Facts that must be true for this problem to exist.

1. **RFP information is distributed, not centralized**  
   Critical inputs live across sales, product, legal, security, and leadership, and no single person has full ownership or visibility.
2. **RFPs are high-stakes and deadline-driven**  
   Responses are tied to revenue, leadership pressure, and fixed timelines, making manual coordination failures costly.
3. **Past RFP responses are not systematically reused or evaluated**  
   Even though similar questions repeat, teams lack a reliable way to learn from previous wins and losses or assess win probability upfront.
4. **Knowledge decays faster than documents are updated**  
   Product changes, compliance updates, and personnel turnover make static documents outdated, pushing teams to depend on people instead of systems.
5. **RFP volume and size are increasing**  
   Enterprise buyers demand deeper, broader questionnaires, amplifying effort and risk with every new bid.

Rules:
- No UI
- No tech
- No competitor references

---

### 3. What would break if this feature did not exist?

Be concrete.

- **What task becomes slow?**
  - Bulk triage of question cards (assign owner, reviewer, due date, status) remains slow because work must be opened one card at a time.
  - Weekly operational reviews take longer because there is no single project-level execution view.
- **What error increases?**
  - Duplicate assignments, unowned questions, stale statuses, and missed due dates increase.
  - Critical questions look "in progress" even when blocked, creating false completion signals.
- **What decision becomes risky?**
  - Deal and staffing decisions become risky because leaders cannot trust real completion state.
  - Submission readiness calls are made with hidden gaps.
- **What workaround users are forced into?**
  - Teams export data to spreadsheets, maintain parallel trackers, and manually sync changes back.
  - This creates version drift, rework, and audit gaps.

If the answer is "nothing breaks," stop here.

---

### 4. Desired outcome

What must change for the user to say this is "better"?

Primary outcome: proposal owners can reliably control execution for large RFPs inside SparrowGenie, with most questions assigned, prioritized, and status-tracked early enough to prevent last-minute chaos.

---

### 5. Value equation

Score each from 1-5.

| Factor | Score | Why |
| --- | --- | --- |
| Signal (quality) | 5 | A structured project-level view makes ownership, status, and risk visible at question level. |
| Context (fit) | 5 | Proposal teams already operate in checklist/spreadsheet mental models for large RFP operations. |
| Trust (confidence) | 4 | Decision confidence increases when progress is visible, but trust still depends on users keeping fields updated. |
| Effort (cost) | 3 | Moderate effort is needed for inline edits, permissions, and reliable bulk updates at scale. |

**Value = (Signal x Context x Trust) - Effort = (5 x 5 x 4) - 3 = 97**

Effort is unavoidable because data consistency and role-based editing must remain reliable for high-stakes submissions.

---

### 6. Smallest change that moves the outcome

Before designing anything, answer this:

- **Minimum intervention**: Add a table-mode on the existing question list with only core operational fields.
- **What we can remove**: Remove repeated card-by-card edits for ownership and status tracking.
- **What we can pre-fill**:
  - Default owner from question source or previous assignment pattern
  - Default status from answer presence (not started / draft / ready for review)
  - Default due date from project submission date
- **What can be automated silently**:
  - Auto-update "last updated by" and "last touched" timestamps
  - Flag stale questions based on inactivity thresholds

If the smallest change works, do not build the bigger one.

### 7. Smallest viable intervention

What is the **minimum change** that improves the value equation?

- Add `Table View` toggle on the current project question page (no new screen)
- Provide fixed v1 columns: `Question`, `Owner`, `Status`, `Reviewer`, `Due Date`, `Confidence`
- Allow inline single-cell edits for the operational columns
- Add bulk action for owner + status updates on selected rows
- Add sort/filter for `Owner`, `Status`, and `Due Date`

If it needs a new screen, challenge it.

---

### 8. What we are NOT doing

Explicit non-goals.

- Building a full CRM replacement or custom reporting engine
- Adding formula columns, pivoting, or spreadsheet-grade computation in v1
- Designing cross-project portfolio analytics in this phase
- Automating end-to-end workflow approvals/escalations in v1

This prevents scope creep later.

---

### 9. Validation plan

How do we know this worked?

- **Behavior change to observe**:
  - Proposal owners run planning and weekly tracking inside SparrowGenie instead of external sheets.
- **Metrics to track**:
  - Median time from project import to first complete ownership assignment
  - % of questions with `Owner + Status` populated within 48 hours
  - Reduction in spreadsheet exports before submission
  - Reduction in late-stage unowned questions (for example, in the last 20% of timeline)
- **Qualitative signal to listen for**:
  - "I no longer need a parallel tracker to manage question-level execution."

No vanity metrics.
