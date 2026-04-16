# PRD: Hybrid Prioritization System (RICE × Agile Matrix)

**Product:** SparrowGenie — Internal PM Tooling **Author:** Divyaraj Murugan **Date:** April 16, 2026 **Status:** Ready for implementation **Target:** Google Sheets (existing Product Board)

---

## Problem Statement

SparrowGenie is an early-stage product with no external users yet. The current product board uses effort/urgency/business impact scoring with deadline-based quadrants. This system is broken because:

1. Everything becomes "Do Today" when deadlines pass — no real prioritization exists.
2. Urgency dominates over value — loud tasks beat important tasks.
3. No execution strategy — the system tells you WHAT is important but not HOW to approach it (quick ship vs. phased plan vs. ignore).
4. Priority shifts have no structure — when something needs to jump priority, there's no documented reason or recalculation logic.

The team needs a single system that answers two questions simultaneously: "What should we build next?" (ranking) and "How should we approach building it?" (execution strategy).

---

## Solution: Hybrid RICE × Agile Matrix

Combine two proven frameworks into one automated Google Sheet:

- **RICE** (Intercom's original formulation) produces a single numeric score to RANK all tasks objectively.
- **Agile Prioritization Matrix** (2×2 Value vs Effort grid) assigns an execution STRATEGY to each task — Quick Win, Major Project, Fill Task, or Time Sink.

The insight: RICE already contains both axes of the Agile Matrix hidden inside its formula. The numerator (Reach × Impact × Confidence) = Value axis. The denominator (Effort) = Effort axis. By splitting the formula, we get both the ranking AND the quadrant from the same 4 inputs.

---

## System Architecture

### Data Model

The system lives as a new tab in the existing "Sparrow Genie - Product Board" Google Sheet (ID: `1FQ9KA9EwF_Vp239Bi7g6Mz6uY7OCUISbYR3m7eCYSdI`).

#### Sheet Structure: "RICE Prioritization"

|Column|Header|Type|Description|
|---|---|---|---|
|A|Task ID|Manual|Existing task_id from task_tracker tab|
|B|Task|Manual|Task name|
|C|Module|Manual|Feature module (RFP, AI, Collaboration, etc.)|
|D|Core Loop?|Manual|YES / NO — Is this on the Upload→Parse→Map→Review→Export path?|
|E|Reach|Manual (blue)|Estimated number of times this use-case occurs per quarter. Real number, not a scale.|
|F|Impact|Manual (blue)|Fixed values only: 3 / 2 / 1 / 0.5 / 0.25|
|G|Confidence|Manual (blue)|Fixed values only: 1 (100%) / 0.8 (80%) / 0.5 (50%)|
|H|Effort|Manual (blue)|Person-weeks. Max value = 3. Scale: 0.5 / 1 / 1.5 / 2 / 2.5 / 3|
|I|Value Score|Formula|= E × F × G|
|J|RICE Score|Formula|= I / H|
|K|Quadrant|Formula|Agile Matrix quadrant based on Value and Effort thresholds|
|L|Priority Rank|Formula|= RANK of RICE Score|
|M|Action|Formula|Execution instruction derived from Quadrant|
|N|Status|Manual|WIP / Not started / Backlog / Done|
|O|Promotion Trigger|Manual|Blank by default. Reason when task jumps priority.|
|P|Notes|Manual|Context, links, dependencies|

#### Configuration Cells

|Cell|Value|Purpose|
|---|---|---|
|$R$1|80|Value threshold — divides "high value" from "low value"|
|$R$2|1.5|Effort threshold — divides "low effort" from "high effort" (in weeks)|

These thresholds can be tuned. Start with these defaults, adjust after 2-3 sprint cycles based on how the quadrant distribution feels.

---

## Input Definitions

### Reach (Column E)

**What it measures:** How many times this use-case or workflow occurs per quarter.

**Unit:** Real estimated number per quarter. NOT a Likert scale.

**How to estimate for early-stage (no users):** Use workflow frequency as a proxy. Ask: "If this product had 10 active accounts, how many times per quarter would this feature be used across all of them?"

**Examples from SparrowGenie context:**

|Estimation basis|Reach value|
|---|---|
|Every RFP needs this (core loop step)|200|
|Most RFPs need this|150|
|Some RFPs need this|80|
|Occasional use|40–60|
|Rare or internal only|10–30|

**Rules:**

- Must be numeric. "Many users" is invalid.
- Must be time-bound to quarters.
- When uncertain, estimate conservatively — Confidence will handle the uncertainty separately.

### Impact (Column F)

**What it measures:** How much this changes the core metric per person/use when they encounter it.

**Fixed scale (no other values allowed):**

|Value|Label|Test question|
|---|---|---|
|3|Massive|Product is broken or useless without this.|
|2|High|Significant workflow improvement. Saves major time or reduces errors.|
|1|Medium|Useful but a workaround exists. User can still complete their job.|
|0.5|Low|Minor improvement. User may not notice if missing.|
|0.25|Minimal|Cosmetic or convenience. No workflow change.|

**Rules:**

- Impact is per-use, not total. Don't inflate because "many people use it" — that's Reach's job.
- If debating between two scores, pick the lower one.

### Confidence (Column G)

**What it measures:** How sure you are about BOTH the Reach and Impact estimates.

**Fixed tiers (no other values allowed):**

|Value|Label|Evidence required|
|---|---|---|
|1 (100%)|High|Data-backed — analytics, usage metrics, or strong quantitative signal|
|0.8 (80%)|Medium|Strong qualitative signal — user interviews, repeated feedback, competitor validation|
|0.5 (50%)|Low|Gut feeling, weak assumption, untested hypothesis|

**Rules:**

- Below 50% = moonshot. Don't even score it. Park the idea.
- Early-stage default should be 0.8 or 0.5. Using 1.0 requires actual data.
- If Reach is data-backed but Impact is a guess, use 0.5 (weakest link determines confidence).

### Effort (Column H)

**What it measures:** Total person-weeks to ship, including product, design, engineering, and testing. AI-assisted development assumed.

**Scale (AI-adjusted):**

|Value|Label|Time|Example|
|---|---|---|---|
|0.5|Tiny|1–2 days|Audit, config change, UI tweak, help article|
|1|Small|3–5 days|Single feature, PRD, wireframe|
|1.5|Medium|~1.5 weeks|Feature with design + dev coordination|
|2|Large|~2 weeks|Multi-step feature, major flow addition|
|2.5|Very large|~2.5 weeks|Complex cross-module feature|
|3|Maximum|3 weeks|Largest allowable single task|

**Rules:**

- Maximum is 3 weeks. Nothing above 3.
- If estimated effort exceeds 3 weeks, the task MUST be broken into sub-tasks until each is ≤ 3.
- Effort includes ALL work: PM spec, design, dev, QA, deployment.
- When uncertain, round up — underestimating effort is the most common failure mode.

---

## Formula Specifications

All formulas below are for row 2. Drag down to apply to all rows.

### I 2 — Value Score

```
= E2 * F2 * G2
```

Purpose: RICE numerator. Represents total benefit. Becomes the Y-axis of the Agile Matrix.

### J 2 — RICE Score

```
= IFERROR((E2 * F2 * G2) / H2, "")
```

Purpose: Single ranking number. Higher = higher priority. Used for sorting.

### K 2 — Quadrant

```
= IF(J2="", "",
  IF(AND(I2 >= $R$1, H2 <= $R$2), "⚡ Quick Win",
  IF(AND(I2 >= $R$1, H2 > $R$2), "🏗 Major Project",
  IF(AND(I2 < $R$1, H2 <= $R$2), "📋 Fill Task",
  "🚫 Time Sink"))))
```

Purpose: Agile Matrix assignment. Maps Value Score (benefit) against Effort (cost) to determine execution strategy.

**Quadrant definitions:**

|Quadrant|Condition|Execution Strategy|
|---|---|---|
|⚡ Quick Win|Value ≥ 80 AND Effort ≤ 1.5|Ship this sprint. No planning needed. Just do it.|
|🏗 Major Project|Value ≥ 80 AND Effort > 1.5|High value but needs planning. Break into sub-tasks, schedule across sprints.|
|📋 Fill Task|Value < 80 AND Effort ≤ 1.5|Low value but cheap. Use when blocked on other work or have slack time.|
|🚫 Time Sink|Value < 80 AND Effort > 1.5|Low value AND expensive. Do not build. Revisit only if inputs change.|

### L 2 — Priority Rank

```
= IFERROR(RANK(J2, $J$2:$J$100, 0), "")
```

Purpose: Numeric rank. 1 = highest RICE score = most important task.

### M 2 — Action

```
= IF(K2="", "",
  IF(LEFT(K2, 1) = "⚡", "DO NOW — ship this sprint",
  IF(LEFT(K2, 1) = "🏗", "PLAN — break down, schedule next sprint",
  IF(LEFT(K2, 1) = "📋", "FILL — use when blocked or have slack",
  "DROP — revisit next quarter"))))
```

Purpose: Human-readable execution instruction.

---

## Promotion Trigger System (Column O)

### Purpose

Handles the reality that priorities shift. Instead of re-scoring randomly or letting gut feeling override the system, changes are documented and flow through the inputs.

### How it works

1. Column O is blank by default.
2. When new information arrives that should change a task's priority, write the trigger reason in this column. Examples:
    - "3 prospects asked for this in April"
    - "Blocks proposal export — dependency discovered"
    - "Deal with [Company X] requires this feature"
    - "User interview on April 10 confirmed high pain"
    - "Competitor launched this — urgency increased"
3. Then update the INPUT columns (E/F/G/H) based on the new information.
4. The Quadrant and RICE Score auto-recalculate.
5. The task may move quadrants — e.g., from "Time Sink" to "Quick Win" if Confidence jumps from 50% to 100%.

### Rules

- Never change the Quadrant or RICE Score directly. Always change inputs.
- Every promotion must have a written reason. No exceptions.
- If the reason is "stakeholder asked for it" without evidence, update Confidence to 0.5 (not 1.0) — pressure is not data.

---

## Sheet 2: Sorted View

A read-only sheet that auto-sorts all tasks by RICE Score (descending).

|Column|Header|Source|
|---|---|---|
|A|Rank|Row number|
|B|Task|INDEX/MATCH from RICE Prioritization, sorted by RICE Score|
|C|RICE Score|LARGE function on RICE Prioritization!J column|
|D|Quadrant|INDEX/MATCH|
|E|Action|INDEX/MATCH|
|F|Core Loop?|INDEX/MATCH|
|G|Promotion Trigger|INDEX/MATCH|

Formula for B 3 (first data row):

```
= IFERROR(INDEX('RICE Prioritization'!B$2:B$100,
  MATCH(LARGE('RICE Prioritization'!J$2:J$100, ROW()-2),
  'RICE Prioritization'!J$2:J$100, 0)), "")
```

This becomes the single view to look at every Monday. Top of the list = what you work on.

---

## Sheet 3: Dashboard

Visual summary with the following sections:

1. **Stat Cards:** Total tasks, Completed count, WIP count, Remaining count, Completion %.
2. **Quadrant Distribution:** Count of tasks per quadrant (Quick Wins / Major Projects / Fill Tasks / Time Sinks).
3. **OKR Progress:** Progress bars for each P 0–P 3 feature item.
4. **Module Progress:** Completion % by module (RFP, AI, Collaboration, Platform, etc.).
5. **RICE Bar Chart:** Top 15 tasks by RICE Score with horizontal bars.

---

## Conditional Formatting Rules

### Quadrant Column (K)

- Contains "Quick Win" → Green background ( #27AE60 ), white text
- Contains "Major Project" → Blue background ( #667EEA ), white text
- Contains "Fill Task" → Yellow/Orange background ( #F39C12 ), white text
- Contains "Time Sink" → Red background ( #E74C3C ), white text

### Core Loop Column (D)

- "YES" → Green background ( #27AE60 ), white bold text
- "NO" → Red background ( #E74C3C ), white bold text

### Input Columns (E, F, G, H)

- Blue font ( #0000FF ) to indicate these are editable inputs

### Promotion Trigger Column (O)

- Red/pink font ( #E94560 ) when non-empty — draws attention to overrides

---

## Data Validation Rules

### Impact (Column F)

- Allow only: 3, 2, 1, 0.5, 0.25
- Dropdown list in each cell
- Reject all other values

### Confidence (Column G)

- Allow only: 1, 0.8, 0.5
- Dropdown list in each cell
- Reject all other values

### Effort (Column H)

- Allow only: 0.5, 1, 1.5, 2, 2.5, 3
- Dropdown list in each cell
- Reject values > 3

### Core Loop (Column D)

- Allow only: YES, NO
- Dropdown list

### Status (Column N)

- Allow only: WIP, Not started, Backlog, Done, Obsolescence
- Dropdown list

---

## Weekly Operating Procedure

### Monday (15 minutes)

1. **Add** any new tasks from the past week.
2. **Update** Reach/Impact/Confidence/Effort for any tasks where you have new information.
3. **Check** the Sorted View — the top is auto-calculated.
4. **Pick** all ⚡ Quick Wins → commit to shipping this week.
5. **Pick** the highest-ranked 🏗 Major Project → break it into sub-tasks for the sprint.
6. **Mark** completed tasks as Done.

### During the week

- If blocked on a Quick Win or Major Project → grab the top 📋 Fill Task.
- If a stakeholder requests a priority change → fill the Promotion Trigger column, update inputs, let the system recalculate.
- Never work on 🚫 Time Sinks.

### End of sprint

- Review: Did the quadrant assignments match reality? Did Quick Wins actually ship fast?
- Adjust thresholds ($R$1, $R$2) if too many or too few items fall into Quick Wins.

---

## Migration from Current System

The current product board has a `task_tracker` sheet with these columns: task_id, task, Item, Pipeline, Sprint Phase, effort_score (1-3), urgency_score (1-3), Business Impact, due_date, status, auto_priority, quadrant, days_until_due.

### What carries over

- task_id → Task ID (Column A)
- task → Task (Column B)
- Item → Module (Column C)
- status → Status (Column N)
- Business Impact → can inform Impact scoring (but re-evaluate using new definitions)
- effort_score → must be re-estimated in person-weeks (old 1-3 scale is not granular enough)

### What gets dropped

- urgency_score — replaced by RICE. Urgency is no longer a direct input.
- due_date / days_until_due — removed entirely. Prioritization is value-based, not deadline-based.
- auto_priority — replaced by RICE Score + Quadrant.
- quadrant (old) — replaced by the new Agile Matrix quadrant.

### Migration steps

1. Create new "RICE Prioritization" tab.
2. Copy task_id, task name, module, and status from task_tracker.
3. Score all active (non-Done) tasks using the new input definitions.
4. Verify formulas calculate correctly.
5. Create Sorted View and Dashboard tabs.
6. Hide or archive the old task_tracker and Dashboard tabs.
7. Use only the new system going forward.

---

## Success Criteria

After 4 weeks of using this system:

1. No task should be "Do Today" without a RICE score justifying it.
2. Quick Wins should ship within the sprint they're identified — track hit rate.
3. Time Sinks should have zero engineering hours spent on them.
4. Every priority change should have a written Promotion Trigger — no undocumented overrides.
5. The PM (you) should be able to answer "Why are we building X before Y?" in under 10 seconds by pointing at the RICE score and quadrant.

---

## Appendix: SparrowGenie Core Loop Reference

For the "Core Loop?" column, a task is YES if it falls on this path:

```
Upload RFP → Parse/Extract Questions → Map Answers (AI) → Review/Edit → Export Proposal
```

If removing the task would break or degrade any step in this path, it's Core Loop = YES.

Everything else (audits, notifications, multi-language, contacts module, help articles, UI polish) is Core Loop = NO.