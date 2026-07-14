---
tags:
  - enhancements/drop_down
related:
  - "[[Project admin settings]]"
  - "[[Company Info]]"
  - "[[Table view for question card PRD]]"
  - "[[Share assign and review flow]]"
  - "[[2026-01-29 UAT with Vipin]]"
  - "[[Email Integration_v1]]"
  - "[[My Templates - Proposal (Next phase)]]"
  - "[[Final PRD -Rich Text Editor for Project Response Area]]"
  - "[[Project Share - RFx and Proposal]]"
  - "[[Email_v1]]"
  - "[[Import_v1]]"
  - "[[Company Templates - Proposal]]"
  - "[[Getting started  with SparrowGenie]]"
  - "[[Genie Templates - Propsals]]"
  - "[[Product Spec - Template]]"
---
## 1. Summary

Update all user selection dropdowns across SparrowGenie to prioritize **User Name** and **Team Name**, replacing the current email-heavy display format. This change applies uniformly to every dropdown where users are selected — including assignment flows, participant management, and workspace views.

---

## 2. Problem Statement

The current user selection dropdowns display email addresses as the primary identifier. This creates friction in workflows that require fast, confident user selection.

**Current experience:**

- Email addresses dominate the dropdown display (e.g., `jeyaraman.k@company.com`)
- Users mentally map people by name and team — not by email
- Long email strings create visual noise, making it hard to scan and differentiate
- Selection speed drops, especially in orgs with 100+ users

**Impact:** Slower assignment flows, higher risk of mis-assignment, and a UI that doesn't match how users think about their teammates.

---

## 3. Objective

Make user selection across SparrowGenie:

- **Faster to scan** — name-first display reduces cognitive load
- **Easier to identify** — team context removes ambiguity between similar names
- **Consistent** — identical dropdown format everywhere users are selected

---

## 4. Scope

### In Scope

- Replace email-first display with Name + Team format across all identified screens
- Add search support by name and team
- Handle fallback states (missing team, missing name)
- Maintain current assignment logic unchanged

### Out of Scope

- Changes to assignment logic or routing
- Team-based assignment features
- Permission or role changes
- Backend user data model changes (beyond surfacing existing fields)

---

## 5. Affected Screens

All user selection dropdowns must adopt the new format. Below is the complete list of screens and dropdown instances requiring the change.

### Screen 1 — Project → Question Card → Assignee

**Location:** Inside a project, on any individual question card, click the assignee field.

**Dropdowns affected:**

- Author dropdown
- Reviewer dropdown

![[Screenshot 2026-03-18 at 3.14.25 PM.png]]


**Context:** This is the most granular assignment point. Users assign author/reviewer per question while reviewing RFP content.

---

### Screen 2 — Project → Left Pane → Assign Card

**Location:** The left sidebar panel within a project, under the assignment card section.

**Dropdowns affected:**

- Author dropdown
- Reviewer dropdown
![[Screenshot 2026-03-18 at 3.20.56 PM.png]]

**Context:** Used for quick assignment without opening the full question card. Must stay lightweight and fast.

---

### Screen 3 — Assignee Modal

The assignee modal supports multiple assignment modes. Each mode contains user selection dropdowns that need updating.

#### 3a — By Section → Multi-select (Checkboxes) , and single select → Author/Reviewer Dropdown

**Location:** Assignee modal → "By Section" tab → select sections via checkboxes → assign author/reviewer.

**Dropdowns affected:**

- Author dropdown (appears after section selection)
- Reviewer dropdown (appears after section selection)

![[Screenshot 2026-03-18 at 3.23.38 PM.png]]


![[Screenshot 2026-03-18 at 3.16.47 PM.png]]


**Context:** Bulk assignment by section. Users select one or more sections, then pick a single author/reviewer to apply.

---

#### 3b — By Question → Multi-select (Checkboxes) → Author/Reviewer Dropdown

**Location:** Assignee modal → "By Question" tab → select questions via checkboxes → assign author/reviewer.

**Dropdowns affected:**

- Author dropdown (appears after question selection)
- Reviewer dropdown (appears after question selection)



![[Screenshot 2026-03-18 at 3.18.13 PM.png]]

**Context:** Bulk assignment by question. Same interaction pattern as 3a but at question-level granularity.

---

#### 3c — By Question → Individual Question → Author/Reviewer Dropdown

**Location:** Assignee modal → "By Question" tab → each question row has its own author/reviewer dropdown.

**Dropdowns affected:**

- Author dropdown (per question row)
- Reviewer dropdown (per question row)
  
  
![[Screenshot 2026-03-18 at 3.16.47 PM 1.png]]


**Context:** Inline per-question assignment. Multiple dropdowns visible simultaneously — consistency and scannability are critical here.

---

### Screen 4 — Participants Tab

**Location:** Project-level → Participants tab → "Add Participant" dropdown.

**Dropdowns affected:**

- Participant selection dropdown
![[Screenshot 2026-03-18 at 3.15.01 PM.png]]


**Context:** Adding users to a project. Team info is especially useful here to find the right person across departments.

---

### Screen 5 — Workspace → Question Card & Left Pane

**Location:** Workspace view (outside project context) → question card assignee field and left pane assign card.

**Dropdowns affected:**

- Author dropdown (question card)
- Reviewer dropdown (question card)
- Author dropdown (left pane)
- Reviewer dropdown (left pane)

![[Screenshot 2026-03-18 at 3.28.01 PM.png]]


**Context:** Same as Screens 1 and 2, but within the workspace-level view. Must maintain identical format for consistency.

---

### Screen 6 — Obligations → Assignee Dropdown

**Location:** Obligations section → assignee field.

**Dropdowns affected:**

- Assignee dropdown

![[Screenshot 2026-03-18 at 3.28.01 PM 1.png]]


**Context:** Assigning ownership of obligations. Single-user selection with no author/reviewer split.

---

## 6. UI Specification

### Display Format

**New format (After):**

```
┌──────────────────────────┐
│  Theresa Bednar           │
│  IT Support               │
└──────────────────────────┘
```

**Fallback — no team assigned:**

```
┌──────────────────────────┐
│  Abel Bahringer           │
│  --                       │
└──────────────────────────┘
```

**Current format (Before) — being replaced:**

```
┌──────────────────────────┐
│  jeyaraman.k              │
│  jeyaraman.k@company.com  │
└──────────────────────────┘
```

### Display Rules

|Element|Rule|
|---|---|
|Primary label|User's full name (first + last). Bold or medium weight.|
|Secondary label|Team name. Muted/secondary text color.|
|Fallback|If no team is mapped, show `--` as secondary label.|
|Email|Hidden by default. Optionally shown on hover (not required for v1).|
|Avatar|Retain existing avatar/initials if already present.|

### Search Behavior

- Search input filters dropdown results by **name** and **team name**
- Matching should be case-insensitive and substring-based
- Email is excluded from search in v1 (can be added later if needed)

### Selected State

Once a user is selected, the collapsed/chip display should show:

- **User Name** only (no team, no email)
- Consistent with the name-first approach

---

## 7. Functional Requirements

| #   | Requirement            | Description                                                             |
| --- | ---------------------- | ----------------------------------------------------------------------- |
| 1   | Primary label          | Show user full name as the main visible identifier                      |
| 2   | Secondary label        | Show team name below the user name                                      |
| 3   | Fallback display       | Show `--` when no team is associated with the user                      |
| 4   | Email handling         | Email is hidden from the default view. Optional hover reveal in future. |
| 5   | Search by name         | Dropdown search filters by user name (substring, case-insensitive)      |
| 6   | Search by team         | Dropdown search also filters by team name                               |
| 7   | Uniform application    | All 6 screen areas (and their sub-dropdowns) use the same format        |
| 8   | Performance            | Dropdown load and search response must have no perceptible lag          |
| 9   | Selected state display | Collapsed/chip state shows user name only                               |

---

## 8. Acceptance Criteria

- [ ] Email is no longer the primary visible identifier in any user dropdown
- [ ] User full name is displayed as the primary label in all affected dropdowns
- [ ] Team name appears as secondary text below the name
- [ ] Users without a team show `--` as the secondary label
- [ ] Search filters results by both name and team name
- [ ] No perceptible performance lag in dropdown loading or search
- [ ] All 6 screen areas (Screens 1–6) are updated and consistent
- [ ] Selected/collapsed state shows user name only
- [ ] No changes to underlying assignment logic or permissions

---

## 9. Edge Cases

| Dimension | Case                                      | Risk                | Mitigation                                                                                         |
| --------- | ----------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------- |
| Names     | Duplicate names (e.g., two "Anna Huel")   | Wrong selection     | Show team as differentiator. If same team too, consider showing email on hover for disambiguation. |
| Data      | User has no team mapping                  | Reduced clarity     | Fallback to `--`. Does not block selection.                                                        |
| Behavior  | Users accustomed to searching by email    | Initial friction    | Communicate change via in-app hint or changelog. Consider adding email to search in v2.            |
| Data      | User has no full name (only email exists) | Blank primary label | Fallback: display email as primary label when name is unavailable.                                 |
| Scale     | Large org with 100+ users                 | Dropdown overload   | Ensure virtualized/paginated dropdown rendering. Search becomes primary navigation method.         |
| Display   | Very long team names                      | Layout break        | Truncate with ellipsis. Show full name on hover.                                                   |
| Display   | Very long user names                      | Layout break        | Truncate with ellipsis. Show full name on hover.                                                   |

---

## 10. Dependencies

| Dependency                  | Detail                                                                  |
| --------------------------- | ----------------------------------------------------------------------- |
| User name data availability | Backend must expose full name (first + last) for all users              |
| Team mapping data           | Backend must expose team name per user. Nullable field (fallback: `--`) |
| Dropdown component          | Shared dropdown component must be updated once — all screens inherit    |

---

## 11. Rollout Considerations

- **Single component update:** If the user dropdown is a shared/reusable component, updating it once should cascade to all 6 screens. Verify each screen post-update.
- **No feature flag needed:** This is a display-only change with no logic impact. Direct rollout is acceptable.
- **QA checklist:** Each of the 6 screen areas must be individually verified against acceptance criteria.

---

## 12. Jira Ticket Hierarchy (Suggested)

|Type|Summary|
|---|---|
|Epic|User Selection Dropdown Redesign — Name + Team Display|
|Story|Update shared dropdown component to show Name + Team format|
|Story|Add search-by-name and search-by-team to user dropdown|
|Story|Handle edge cases: missing name, missing team, duplicate names|
|Task|Verify Screen 1 — Project → Question Card → Assignee|
|Task|Verify Screen 2 — Project → Left Pane → Assign Card|
|Task|Verify Screen 3a — Assignee Modal → By Section|
|Task|Verify Screen 3b — Assignee Modal → By Question (bulk)|
|Task|Verify Screen 3c — Assignee Modal → By Question (inline)|
|Task|Verify Screen 4 — Participants Tab|
|Task|Verify Screen 5 — Workspace → Question Card & Left Pane|
|Task|Verify Screen 6 — Obligations → Assignee Dropdown|

---

## 13. Open Questions

|#|Question|Owner|Status|
|---|---|---|---|
|1|Should email be added to search in v1 or deferred to v2?|PM|Open|
|2|Is the team name field reliably populated for all users?|Eng|Open|
|3|Do any screens use a different dropdown component (non-shared)?|Eng|Open|
|4|Should hover on a dropdown row reveal email? If so, is it v1 or v2?|PM|Open|