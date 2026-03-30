

---
Figma Design  : [Figma](https://www.figma.com/design/ot8PmzrF9xIr6neo8ptCBy/RFP-Projects?node-id=16081-45551&t=stMxoAMBgN1AyxBt-4)
Wireframe : ![[progress-wireframe.html]]
## Problem

The current progress bar uses internal system states (Unassigned, In Progress, Reviewed) that don't map to user decision-making. Users open a project and cannot answer: "What should I do next?" or "How close am I to submitting?"

Specific failures:

- "Unassigned" ≠ important. A question can be unassigned but already answered by GenieAI.
- "In Progress" ≠ progress. It's a workflow state, not a value state.
- "Reviewed" ≠ done. It conflates completion with quality.
- No visibility into what GenieAI answered vs. didn't answer.
- No visibility into AI confidence levels — all Genie answers look equal.

## Goal

Replace the single system-state progress bar with two purpose-built bars that answer two distinct questions:

1. **Completion Progress** → "Am I done?" (decision state)
2. **GenieAI Confidence** → "Can I trust what Genie wrote?" (support signal)

The user should open the project dashboard, see both bars, and instantly know what's done, what needs attention, and what to do next — without thinking.

## Non-Goals

- Changing the underlying answer review workflow.
- Modifying how GenieAI generates answers or confidence scores.
- Building a standalone analytics/reporting dashboard.
- Auto-review or auto-approval based on confidence thresholds.

---

## Design Principles

1. **Completion is the hero.** It answers the primary user question and must be visually dominant (2.5× the height of the confidence bar).
2. **Confidence is a support signal.** It informs review prioritization but never overrides or modifies completion.
3. **Never merge both bars.** They have different denominators, different audiences, and different decision outputs.
4. **Bars are interactive, not decorative.** Clicking any segment filters the question list below.
5. **Unanswered is a first-class state.** Questions that GenieAI couldn't answer must be explicitly visible — not hidden inside "Draft."

---

## Data Model

### Inputs

|Variable|Definition|
|---|---|
|T|Total questions in project|
|G|Questions answered by GenieAI|
|R|Questions marked as Reviewed|
|P|Questions in Pending Review state|
|H|Genie answers with high confidence (≥ threshold)|

### Derived Values

|Variable|Calculation|Used In|
|---|---|---|
|D (Draft)|T − R − P − U|Completion bar|
|U (Unanswered)|T − G|Both bars|
|L (Low confidence)|G − H|Confidence bar|

### Constraints

- R + P + D + U = T (completion bar always sums to total)
- H + L = G (confidence split always sums to Genie-answered)
- H + L + U = T (confidence bar always sums to total)

---

## Feature Spec

### 1. Completion Progress Bar (Primary)

A segmented horizontal bar with 4 segments, displayed at 36px height.

**Segments (left to right):**

| Segment        | Description                                |
| -------------- | ------------------------------------------ |
| Reviewed       | Human has reviewed and approved the answer |
| Pending Review | Answer exists, awaiting human review       |
| Draft          | Genie answered but no review action taken  |
| Unanswered     | No answer exists — Genie couldn't answer   |

**Legend cards** sit below the bar, one per segment, showing: count, label, percentage.

**Acceptance Criteria:**

- [ ] Bar renders 4 segments whose widths are proportional to R/T, P/T, D/T, U/T respectively.
- [ ] All 4 segments always sum to 100% of the bar width.
- [ ] Percentage label is visible inside the segment when segment width > 7% of total.
- [ ] Percentage label is hidden when segment width ≤ 7%.
- [ ] Unanswered segment uses a red striped pattern visually distinct from the solid Draft segment.
- [ ] If a segment count is 0, it renders at 0 width (no minimum width).
- [ ] Legend cards below the bar show count, label, and percentage for each segment.

### 2. GenieAI Confidence Bar (Secondary)

A segmented horizontal bar with 3 segments, displayed at 14px height. Visually subordinate to completion.

**Segments (left to right):**

| Segment         | Description                                |
| --------------- | ------------------------------------------ |
| High confidence | Genie answered with confidence ≥ threshold |
| Low confidence  | Genie answered with confidence < threshold |
| Unanswered      | Genie did not answer                       |

**Legend items** sit below the bar in a horizontal row, showing: dot, label, count.

**Acceptance Criteria:**

- [ ] Bar renders 3 segments whose widths are proportional to H/T, L/T, U/T respectively.
- [ ] Denominator is T (total questions), not G (Genie-answered), so that unanswered coverage is visible.
- [ ] Confidence bar uses a different color family (purple/pink) from completion bar (green/yellow/gray/red).
- [ ] Bar height is ≤ 40% of completion bar height.
- [ ] Confidence bar section has reduced opacity (0.85) at rest, full opacity on hover — reinforcing its secondary role.
- [ ] Confidence is NOT shown for human-edited answers (only original Genie answers).
- [ ] If Genie has answered 0 questions, the entire confidence section is hidden.

### 3. Click-to-Filter Interaction

Every bar segment and legend item is clickable. Clicking applies a filter to the question list below.

**Behavior:**

- Click a segment → that segment stays at full opacity, all other segments dim to 25%.
- A filter toast appears below the bar showing: filter label, item count as a pill badge.
- Click the same segment again → deselects, all segments restore to full opacity, filter clears.
- Only one segment per bar can be active at a time.
- Completion and confidence filters are independent — one active filter per bar is allowed simultaneously.

**Acceptance Criteria:**

- [ ] Clicking any completion bar segment or legend item applies the corresponding filter to the question list.
- [ ] Clicking any confidence bar segment or legend item applies the corresponding filter to the question list.
- [ ] Non-selected segments dim to ≤ 25% opacity when a filter is active.
- [ ] Filter toast displays below the bar with filter name and count.
- [ ] Clicking the active segment again deselects and clears the filter.
- [ ] Both bars can have independent active filters simultaneously.
- [ ] A "Click any segment to filter question list" hint is visible above each bar.


---

## What NOT to Do

|Rule|Rationale|
|---|---|
|Don't merge both bars into one|Different denominators, different questions, different audiences|
|Don't let confidence change completion|Completion = decision state, confidence = support signal|
|Don't show confidence for human-edited answers|It's noise — confidence is a Genie-specific metric|
|Don't make both bars visually equal|Users will over-focus on confidence and completion slows down|
|Don't use the same color family for both bars|Creates false association between segments across bars|

---

## Edge Cases

|Scenario|Expected Behavior|
|---|---|
|0 questions in project|Progress section is hidden entirely|
|GenieAI answered 0 questions|Completion bar shows: 0 Reviewed, 0 Pending, 0 Draft, T Unanswered. Confidence section is hidden.|
|All questions reviewed, all high confidence|Completion bar is fully green. Confidence bar is fully purple. NBA shows "ready to submit."|
|All questions reviewed, all low confidence|Completion bar is fully green. Confidence bar is fully pink. Insight 1 fires. NBA shows "ready to submit" (completion is independent).|
|GenieAI answered all, none reviewed|Completion bar shows 0 Reviewed, 0 Pending, T Draft, 0 Unanswered. Confidence bar shows H/L split, 0 Unanswered.|
|Single question project|All logic works with T=1. Percentage labels may be hidden (segment < 7%).|

---

## Open Questions

1. **Confidence threshold** — What cutoff score defines "high" vs "low"? Is it a fixed value (e.g., 80%) or configurable per org?
2. **Filter persistence** — When a user clicks a segment and filters, does the filter persist across page reloads or is it session-only?
3. **NBA click destination** — Should clicking the NBA card apply a filter (same view) or navigate to a filtered question list view?
4. **Draft vs. Pending Review** — How do we distinguish "Genie answered, nobody touched it" (Draft) from "Genie answered, someone started working on it" (Pending Review)? Is this based on assignment status, edit history, or an explicit state transition?

---

## Wireframe

Interactive wireframe with test scenarios and slider controls: `progress-wireframe-v4.html`