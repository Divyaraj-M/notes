---
tags:
  - enhancements/filter
---
## First principle thinking

Users working on large RFP projects need to efficiently locate specific questions within a long list. Without visible, persistent filter indicators, users cannot tell which filters are active, leading to confusion when results appear incomplete. Surfacing applied filters as removable pills — and providing a structured, two-level filter dropdown — gives users confidence that the list reflects exactly what they asked for.

---

## 1. Problem Statement

When filters are applied on the RFP Question List, users have no persistent visual indicator of which filters are active. This causes three problems: (1) users see a reduced question count but cannot tell _why_, (2) they lose trust in the results and repeatedly reset filters to verify, and (3) they waste time reapplying filters after accidental resets. Support tickets reference "missing questions" that turn out to be filtered out. In projects with 100+ questions across multiple sections and authors, this friction compounds — teams spend more time managing the view than answering questions.

---

## 2. Goals

**User Goals**

- Users can identify every active filter within 2 seconds of viewing the question list.
- Users can remove a single filter in one click without disrupting other active filters.
- Users can clear all filters in one action to return to the default view.
---

## 3. Non-Goals

| Non-Goal                                              | Why Out of Scope                                                                  |
| ----------------------------------------------------- | --------------------------------------------------------------------------------- |
| Saved / preset filter configurations                  | Separate initiative — requires persistence layer and user preferences work        |
| Advanced filter logic (AND/OR toggle between filters) | Current AND logic is sufficient for v1; revisit based on usage data               |
| Cross-project filter persistence                      | Filters are project-scoped; global state adds complexity with low immediate value |
| Section filter sub-panel redesign                     | Section filter uses the existing tree/list; no changes needed                     |
| Filter by custom fields                               | Custom fields are not yet supported on questions                                  |

---

## 4. User Stories

|#|User Type|I want to...|So that...|Priority|
|---|---|---|---|---|
|US-1|RFP Author|See which filters are currently applied to the question list|I know why the list is showing a subset of questions|P0|
|US-2|RFP Author|Remove a specific filter without affecting others|I can progressively broaden my view|P0|
|US-3|RFP Author|Clear all filters in one action|I can quickly return to the full question list|P0|
|US-4|RFP Author|Add a new filter from the pill bar area|I don't have to go back to the filter icon each time|P0|
|US-5|RFP Reviewer|Filter questions by my reviewer assignment and due date|I can focus on questions I need to review|P0|
|US-6|RFP Author|Filter questions by Genie AI confidence level|I can prioritise reviewing low-confidence AI answers|P1|
|US-7|RFP Author|Filter by "Answered by" (AI vs Manual)|I can audit which questions still need human review|P1|

---

## 5. Requirements

### Must-Have (P0)

| #     | Requirement                                                                  | Acceptance Criteria                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0.1  | Two-level filter dropdown opens from the filter icon (funnel) in the toolbar | Given the user clicks the filter icon, When the dropdown opens, Then the first level shows: Author, Reviewer, Question status, Section, Due date, Answer generated by. Each row has a chevron indicating a second level.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| P0.2  | Second-level panels render filter-specific controls                          | Given the user clicks "Author" or "Reviewer", Then a panel with a search input and multi-select checkbox list of project participants appears. Given the user clicks "Question status", Then checkboxes for Draft, Reviewed, Pending Review, Unanswered appear. Given the user clicks "Due date", sub-options: Author due date and Reviewer due date each show the preset options: Due today, Due tomorrow, This week, Next week, Last week, This month, Next month, Last month, Custom. Given "Answered by", options: Genie AI answered, Manually answered. Given "Genie AI confidence", options: High confidence, Medium confidence, Low confidence. See Appendix A for full due date calculation logic. |
| P0.3  | Each second-level panel has Cancel and Apply actions                         | Given the user selects values and clicks Apply, Then the filter is applied, the dropdown closes, the question list updates, and a pill appears. Given the user clicks Cancel, Then selections are discarded and the panel closes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| P0.4  | Applied filters render as pills above the question list                      | Given one or more filters are applied, Then each filter shows as a pill in the format "[Filter Type] [Value]" (e.g., "Status Unassigned", "Author Anand", "Section Analysis and rep…").                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| P0.5  | Individual pill removal                                                      | Given the user clicks the remove (×) icon on a pill, Then that filter is removed, the pill disappears, and the question list re-renders.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| P0.6  | "Add filter" action via the + icon in the pill bar                           | Given filters are active, When the user clicks the + icon next to the pills, Then the filter dropdown opens (same as P0.1) so the user can add more filters. Tooltip on hover: "Add filter".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| P0.7  | "Clear filters" action via the reset icon (↺) in the pill bar                | Given filters are active, When the user clicks the ↺ icon, Then all filters are removed, all pills disappear, and the full question list is restored. Tooltip on hover: "Clear filters".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| P0.8  | "Clear filters (n)" link in the filter dropdown                              | Given filters are active and the user opens the filter dropdown from the toolbar funnel icon, Then a "Clear filters (n)" link appears at the bottom of the dropdown (where n = number of active filters). Clicking it clears all filters.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| P0.9  | Question count updates with filters                                          | Given filters are applied, Then the "Questions (n)" heading reflects the filtered count.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| P0.10 | No results state                                                             | Given applied filters return zero questions, Then the list shows a "No results found" message with helper text: "Try changing or removing filters to see more".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

### Nice-to-Have (P1)

|#|Requirement|Acceptance Criteria|
|---|---|---|
|P1.1|Long pill values are truncated with ellipsis|Given a filter value exceeds the max pill width, Then it truncates with "…" and the full value is visible on hover (tooltip).|
|P1.2|Pill bar wraps gracefully on overflow|Given more pills than fit in one row, Then pills wrap to a second line; the + and ↺ icons remain visible.|

### Future Considerations (P2)

- P2.1 — Saved filter presets (name and recall filter combinations)
- P2.2 — Keyboard shortcuts for common filters (e.g., "my questions")

---

## 6. User Flows

### Flow 1: Apply a filter from toolbar

> **Entry point:** User is on the Question List view (RFP tab → Questions sub-tab).  
> **Exit point:** Filtered question list with pill visible.

```
Click filter icon → Filter dropdown (Level 1) → Click filter type → Filter panel (Level 2) → Select values → Click Apply → Pill appears + list updates
```

1. User clicks the funnel (filter) icon in the toolbar above the question list.
2. A dropdown appears showing Level 1 filter categories: Author, Reviewer, Question status, Section, Due date, Answer generated by.
3. User clicks a category (e.g., "Author").
4. The dropdown transitions to Level 2 — shows a back chevron, the category title, a search field (for Author/Reviewer), and selectable options with checkboxes.
5. User selects one or more values (e.g., checks "Anand").
6. User clicks **Apply**.
7. Dropdown closes. A pill "Author Anand" appears in the pill bar. Question list re-renders showing only matching questions. Count updates.

**Error branch:** If the API fails to fetch filter options (e.g., participant list), show inline error in the panel with a retry option. If the filtered query fails, show a generic error toast and retain previous list state.

### Flow 2: Remove a single filter via pill

> **Entry point:** Question list with one or more pills visible.  
> **Exit point:** Updated question list with one fewer pill.

1. User clicks the × on a specific pill (e.g., "Author Anand").
2. The pill disappears.
3. The question list re-renders without that filter constraint.
4. Question count updates.
5. If no pills remain, the pill bar hides entirely.

### Flow 3: Clear all filters

> **Entry point:** Question list with multiple pills.  
> **Exit point:** Full unfiltered question list.

1. User clicks the ↺ (reset) icon in the pill bar — OR — opens the filter dropdown and clicks "Clear filters (n)".
2. All pills are removed.
3. Question list shows all questions. Count resets to total.

### Flow 4: Add a filter from the pill bar

> **Entry point:** Question list with at least one pill active.  
> **Exit point:** Additional pill applied.

1. User clicks the + icon in the pill bar (between the last pill and the ↺ icon).
2. The filter dropdown opens (same Level 1 menu as Flow 1).
3. User selects a category and applies a new filter.
4. New pill appears alongside existing pills.

### Flow 5: No results

> **Entry point:** User applies a combination of filters that matches zero questions.  
> **Exit point:** No-results state.

1. User applies filters (e.g., Status: Unassigned + Author: Anand + Section: Analysis and reporting).
2. Question list returns 0 results.
3. Heading shows "Questions (0)".
4. Center of the list area shows a warning icon, "No results found" heading, and "Try changing or removing filters to see more" body text.
5. Pills remain visible so the user can remove one to broaden the search.

---

## 7. Screens & Components

### Screen 1: Question List — Filter Pills Bar

> 🎟️ **Design ticket:** `[PROJ]-XXX` — Filter pills bar on question list

|Field|Description|
|---|---|
|**Purpose**|Show active filters as removable pills above the question list, with controls to add more filters or clear all.|
|**Entry from**|Any filter apply action (Flow 1 or Flow 4).|
|**Key elements**|Pill chips (each with filter label + value + × remove icon), + (add filter) icon button, ↺ (clear filters) icon button.|
|**States**|Hidden (no filters active), Single pill, Multiple pills (wrapping), Overflow/wrap.|
|**User stories**|US-1, US-2, US-3, US-4|

**Content & copy:**

|Location|Text|Notes|
|---|---|---|
|Pill label|"[FilterType] [Value]" e.g., "Status Unassigned"|Truncate value with ellipsis if > ~20 chars|
|+ icon tooltip|"Add filter"|Shown on hover|
|↺ icon tooltip|"Clear filters"|Shown on hover|

### Screen 2: Filter Dropdown — Level 1 (Category List)

> 🎟️ **Design ticket:** `[PROJ]-XXX` — Filter dropdown first level

|Field|Description|
|---|---|
|**Purpose**|Present filter categories so the user can choose which dimension to filter by.|
|**Entry from**|Click on funnel icon in toolbar OR + icon in pill bar.|
|**Key elements**|"FILTER BY" heading, list rows: Author ›, Reviewer ›, Question status ›, Section ›, Due date ›, Answer generated by ›. If filters are active: "Clear filters (n)" link at bottom.|
|**States**|Default (no filters active — no clear link), Filters active (clear link visible with count).|
|**User stories**|US-1, US-4|

**Content & copy:**

|Location|Text|Notes|
|---|---|---|
|Heading|"FILTER BY"|All caps, muted colour|
|Category rows|Author, Reviewer, Question status, Section, Due date, Answer generated by|Each with › chevron|
|Clear action|"Clear filters (n)"|Teal/accent colour; n = active filter count|

### Screen 3: Filter Panel — Author / Reviewer (Level 2, multi-select with search)

> 🎟️ **Design ticket:** `[PROJ]-XXX` — Author & Reviewer filter panels

|Field|Description|
|---|---|
|**Purpose**|Let the user search and select one or more participants to filter by.|
|**Entry from**|Click "Author" or "Reviewer" on Level 1.|
|**Key elements**|Back chevron (‹), panel title ("Author › Choose" / "Reviewer › Choose"), search input, scrollable checkbox list of participants (avatar + name), Cancel button, Apply button.|
|**States**|Default (all unchecked), Partially selected, Search active (list filtered), No search results.|
|**User stories**|US-1, US-5|

**Content & copy:**

|Location|Text|Notes|
|---|---|---|
|Title|"[Author/Reviewer] › Choose"||
|Search placeholder|"Search"||
|Buttons|"Cancel" (left), "Apply" (right, accent colour)|Apply is disabled until at least one selection is made|

### Screen 4: Filter Panel — Question Status (Level 2, multi-select checkboxes)

> 🎟️ **Design ticket:** `[PROJ]-XXX` — Question status filter panel

|Field|Description|
|---|---|
|**Purpose**|Filter questions by their workflow status.|
|**Entry from**|Click "Question status" on Level 1.|
|**Key elements**|Back chevron, title "Question status › Choose", checkboxes: Draft, Reviewed, Pending Review, Unanswered. Cancel / Apply.|
|**States**|Default, Partially selected.|
|**User stories**|US-1|

### Screen 5: Filter Panel — Due Date (Level 2, single-select preset or custom)

> 🎟️ **Design ticket:** `[PROJ]-XXX` — Due date filter panels (Author & Reviewer)

|Field|Description|
|---|---|
|**Purpose**|Filter questions by author due date or reviewer due date using preset time-window ranges or a custom date range.|
|**Entry from**|Click "Due date" on Level 1 → sub-options for Author due date and Reviewer due date.|
|**Key elements**|Back chevron, title ("Author due date › Choose" / "Reviewer due d… › Choose"), options: Due today, Due tomorrow, This week, Next week, Last week, This month, Next month, Last month, Custom. Cancel / Apply.|
|**States**|Default, One option selected, Custom date picker open (two date inputs).|
|**User stories**|US-5|

**Content & copy:**

|Location|Text|Notes|
|---|---|---|
|Options|Due today, Due tomorrow, This week, Next week, Last week, This month, Next month, Last month, Custom|Single-select (radio-style). See Appendix A for date range calculation logic.|

### Screen 6: Filter Panel — Answered By (Level 2, single-select)

> 🎟️ **Design ticket:** `[PROJ]-XXX` — Answered by filter panel

|Field|Description|
|---|---|
|**Purpose**|Filter by whether the question was answered by Genie AI or manually.|
|**Entry from**|Click "Answer generated by" on Level 1.|
|**Key elements**|Back chevron, title "Answered by › Choose", options: Genie AI answered, Manually answered. Cancel / Apply.|
|**States**|Default, One selected.|
|**User stories**|US-7|

### Screen 7: Filter Panel — Genie AI Confidence (Level 2, multi-select)

> 🎟️ **Design ticket:** `[PROJ]-XXX` — Genie AI confidence filter panel

|Field|Description|
|---|---|
|**Purpose**|Filter questions by AI answer confidence tier.|
|**Entry from**|Click "Genie AI confidence" on Level 1 (visible in the expanded filter list).|
|**Key elements**|Back chevron, title "GenieAI confid… › Choose", checkboxes: High confidence, Medium confidence, Low confidence. Cancel / Apply.|
|**States**|Default, Partially selected.|
|**User stories**|US-6|

### Screen 8: No Results State

> 🎟️ **Design ticket:** `[PROJ]-XXX` — Filtered no-results empty state

|Field|Description|
|---|---|
|**Purpose**|Inform the user that the current filter combination returns zero questions and guide them to adjust.|
|**Entry from**|Any filter apply action that yields 0 results.|
|**Key elements**|Warning/triangle icon, "No results found" heading, "Try changing or removing filters to see more" body text. Pills remain visible above.|
|**States**|Single state.|
|**User stories**|US-1|

**Content & copy:**

|Location|Text|Notes|
|---|---|---|
|Heading|"No results found"|Centred, prominent|
|Body|"Try changing or removing filters to see more"|Muted text below heading|

### New / Modified Components

|Component|States|New or Existing?|Used on|
|---|---|---|---|
|Filter Pill Chip|Default, Hover (× highlight), Truncated|New|Screen 1|
|Filter Pill Bar (container)|Hidden, Single pill, Multi-pill, Wrapped|New|Screen 1|
|Two-Level Filter Dropdown|Level 1 (no active filters), Level 1 (with clear link), Level 2 (varies by filter type)|New|Screen 2, 3, 4, 5, 6, 7|
|Add Filter Icon Button (+)|Default, Hover (tooltip)|New|Screen 1|
|Clear Filters Icon Button (↺)|Default, Hover (tooltip)|New|Screen 1|
|No Results Empty State|Single state|New|Screen 8|

---

## 8. Design Constraints

- Must reuse the existing toolbar icon row (search, filter, sort, view toggle icons) — pills render below the toolbar, above the question cards.
- Dropdown width should be consistent across Level 1 and Level 2 panels (~240–280px) to avoid jarring resizes on transition.
- Author/Reviewer panels must support scrolling for projects with > 6 participants; the search field remains pinned at top.
- Pill bar must not push question cards below the fold on standard viewport heights (1080px); wrap to a second row if needed rather than expanding indefinitely.
- Truncation on pill values should kick in at ~20 characters to prevent excessive pill width.
- Filter dropdown positioning: anchored to the filter icon, right-aligned, floating above content.
- Must follow existing colour conventions: accent/teal for Apply and clear links, muted grey for Cancel.
- The Level 1 dropdown when filters are active shows 6 categories + "Clear filters (n)" — this matches the design in Image 17.

---

## 9. Success Metrics

|Metric|Target|Measure By|Tool|
|---|---|---|---|
|Filter feature adoption (% of active projects using filters)|+30% within 60 days|60 days post-launch|Mixpanel|
|"Missing questions" support tickets|–50% within 30 days|30 days post-launch|Freshdesk / Intercom|
|Avg. filter-related actions per session|Increase from baseline|30 days post-launch|Mixpanel|
|Filter reset rate (clear-all as % of total filter actions)|Decrease from baseline|30 days post-launch|Mixpanel|
|Task completion time (find & answer a specific question)|–20%|Usability test pre/post|User testing|

---

## 10. Open Questions

|#|Question|Owner|Blocking?|Status|
|---|---|---|---|---|
|Q1|Should the Section filter show a flat list or a nested tree matching the left sidebar hierarchy?|Design|No|Open|
|Q2|For "Due date" → "Custom", what date picker component do we use? Existing design system date picker or a new range picker? (Note: preset options and calculation logic are now defined in Appendix A.)|Design|Yes|Open|
|Q3|When a filter has multiple values selected (e.g., Author: Anand, Zoya), does the pill show "Author: 2 selected" or one pill per value?|PM / Design|Yes|Open|
|Q4|Should the filter dropdown close automatically when Apply is clicked, or stay open for stacking multiple filters?|Design|No|Open|
|Q5|Is "Genie AI confidence" filter visible to all users or only when AI answering is enabled on the project?|Eng|No|Open|

---

## 11. Timeline & Dependencies

- **Hard deadlines:** None identified.
- **Dependencies:**
    - Existing filter API must support all filter types listed (Author, Reviewer, Question status, Section, Author due date, Reviewer due date, Answered by, Genie AI confidence).
    - Participant list API (for Author/Reviewer filter panels).
    - Question list rendering logic must accept pill-bar height offset.
- **Phasing:**
    - **Phase 1:** Filter dropdown (Level 1 + Level 2 panels) + pill display + individual remove + clear all. Covers P0.
    - **Phase 2:** Saved filter presets, keyboard shortcuts. Covers P2.

---

## 12. Jira Tickets — Design Phase

### Story: [PROJ]-XXX — Question List Filtering & Filter Pills — Story Definition

> **Type:** Story  
> **Epic:** RFP Question Management  
> **Description:** Links to this PRD. Implements two-level filter dropdown and persistent filter pills on the question list view.

|Sub-task|Summary|Assignee|Status|Linked Screens|
|---|---|---|---|---|
|`[PROJ]-XXX`|Design: Filter Pill Bar (pills, +, ↺)|[Designer]|To Do|Screen 1|
|`[PROJ]-XXX`|Design: Filter Dropdown — Level 1|[Designer]|To Do|Screen 2|
|`[PROJ]-XXX`|Design: Filter Panel — Author & Reviewer (multi-select + search)|[Designer]|To Do|Screen 3|
|`[PROJ]-XXX`|Design: Filter Panel — Question Status|[Designer]|To Do|Screen 4|
|`[PROJ]-XXX`|Design: Filter Panel — Due Date (Author & Reviewer)|[Designer]|To Do|Screen 5|
|`[PROJ]-XXX`|Design: Filter Panel — Answered By|[Designer]|To Do|Screen 6|
|`[PROJ]-XXX`|Design: Filter Panel — Genie AI Confidence|[Designer]|To Do|Screen 7|
|`[PROJ]-XXX`|Design: No Results Empty State|[Designer]|To Do|Screen 8|
|`[PROJ]-XXX`|Design: Flow review + edge cases (truncation, overflow, rapid changes)|[Designer]|To Do|All|

---

## Appendix A: Due Date Filter — Calculation Logic

All due date presets are computed dynamically relative to the user's current date at the time the filter is applied. Week boundaries follow a **Sunday–Saturday** calendar. All times are inclusive (start at 00:00:00, end at 23:59:59).

> The examples below assume **today = Thursday, 12 February 2026**.

### Due today

|Field|Value|
|---|---|
|**Anchor**|Today's date|
|**Start**|12 Feb 2026 00:00:00|
|**End**|12 Feb 2026 23:59:59|

- Due on 12 Feb 2026 at 18:30 → **Included**
- Due on 13 Feb 2026 → **Not included**

### Due tomorrow

|Field|Value|
|---|---|
|**Anchor**|Today + 1 day|
|**Start**|13 Feb 2026 00:00:00|
|**End**|13 Feb 2026 23:59:59|

- Due on 13 Feb 2026 at 09:00 → **Included**
- Due on 12 Feb 2026 → **Not included**

### This week (Sunday–Saturday)

|Field|Value|
|---|---|
|**Anchor**|Current week derived from today|
|**Week range**|Sunday 8 Feb – Saturday 14 Feb|
|**Start**|8 Feb 2026 00:00:00|
|**End**|14 Feb 2026 23:59:59|

- Due on 10 Feb → **Included**
- Due on 15 Feb → **Not included**

### Next week (Sunday–Saturday)

|Field|Value|
|---|---|
|**Anchor**|Week after current week|
|**Week range**|Sunday 15 Feb – Saturday 21 Feb|
|**Start**|15 Feb 2026 00:00:00|
|**End**|21 Feb 2026 23:59:59|

- Due on 16 Feb → **Included**
- Due on 14 Feb → **Not included**

### Last week (Sunday–Saturday)

|Field|Value|
|---|---|
|**Anchor**|Week before current week|
|**Week range**|Sunday 1 Feb – Saturday 7 Feb|
|**Start**|1 Feb 2026 00:00:00|
|**End**|7 Feb 2026 23:59:59|

- Due on 3 Feb → **Included**
- Due on 8 Feb → **Not included**

### This month

|Field|Value|
|---|---|
|**Anchor**|Current calendar month|
|**Month**|February 2026|
|**Start**|1 Feb 2026 00:00:00|
|**End**|28 Feb 2026 23:59:59|

- Due on 25 Feb → **Included**
- Due on 1 Mar → **Not included**

### Next month

|Field|Value|
|---|---|
|**Anchor**|Month after current month|
|**Month**|March 2026|
|**Start**|1 Mar 2026 00:00:00|
|**End**|31 Mar 2026 23:59:59|

- Due on 5 Mar → **Included**
- Due on 28 Feb → **Not included**

### Last month

|Field|Value|
|---|---|
|**Anchor**|Month before current month|
|**Month**|January 2026|
|**Start**|1 Jan 2026 00:00:00|
|**End**|31 Jan 2026 23:59:59|

- Due on 20 Jan → **Included**
- Due on 1 Feb → **Not included**

### Custom date range

|Field|Value|
|---|---|
|**Anchor**|User-selected start and end dates|
|**Example selection**|5 Feb 2026 – 18 Feb 2026|
|**Start**|5 Feb 2026 00:00:00|
|**End**|18 Feb 2026 23:59:59|

- Due on 10 Feb → **Included**
- Due on 19 Feb → **Not included**

### Implementation notes

- All presets apply identically to both **Author due date** and **Reviewer due date** — the only difference is which date field on the question is being evaluated.
- Month-end boundaries must handle variable month lengths (28/29/30/31 days). Use the last day of the target month, not a fixed offset.
- Leap years: February 2028 ends on 29 Feb, not 28 Feb. Ensure the "This month" / "Next month" / "Last month" calculations derive the correct last day.
- Timezone: All date comparisons should use the **project's configured timezone** (or the user's local timezone if no project timezone is set). This ensures consistency for distributed teams.
- When "Custom" is selected, two date input fields appear (Start date, End date). Both are required before Apply becomes active.

---

## Changelog

|Date|Author|Changes|
|---|---|---|
|2026-03-18|Prod|Initial draft|
|2026-03-18|Prod|Added Appendix A — Due date filter calculation logic with preset definitions, examples, and implementation notes. Updated due date options from original design (Overdue, Due today, Due this week, Due this month, Custom) to expanded set (Due today, Due tomorrow, This week, Next week, Last week, This month, Next month, Last month, Custom).|