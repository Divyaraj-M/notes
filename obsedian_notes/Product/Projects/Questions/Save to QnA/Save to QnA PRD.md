---
tags:
  - "#new_feature/save_to_qna/v1"
status: Dropped
---
## First principle thinking 


## 1. Problem Statement


[Write here]

---

## 2. Goals

<!-- Measurable outcomes. Each answers: "How will we know this worked?" -->

**User Goals**

- [e.g., Reduce time to complete X from 10 min to 2 min]

**Business Goals**

- [e.g., Increase activation rate from 30% to 50% within 60 days]

---

## 3. Non-Goals

<!-- What this feature will NOT do. Prevents scope creep. -->

| Non-Goal                       | Why Out of Scope                 |
| ------------------------------ | -------------------------------- |
| [e.g., Multi-language support] | [Separate initiative planned Q3] |
|                                |                                  |

---

## 4. User Stories

<!-- "As a [specific user], I want [capability] so that [benefit]." Order by priority. -->

|#|User Type|I want to...|So that...|Priority|
|---|---|---|---|---|
|US-1|[e.g., Team admin]|[Capability]|[Benefit]|P0|
|US-2||||P0|
|US-3||||P1|

---

## 5. Requirements

### Must-Have (P0)

<!-- Cannot ship without these. If you cut it, does the feature still solve the problem? If no → P0. -->

|#|Requirement|Acceptance Criteria|
|---|---|---|
|P0.1|[Describe behavior]|[Given/When/Then or checklist]|
|P0.2|||

### Nice-to-Have (P1)

|#|Requirement|Acceptance Criteria|
|---|---|---|
|P1.1|[Describe]|[Criteria]|

### Future Considerations (P2)

- [P2.1 — Document so we don't block it architecturally]

---

## 6. User Flows

<!-- This is what the designer works from. Map each major flow step-by-step. Include decision points and error branches. Entry point → steps → exit point. -->

### Flow 1: [Primary Happy Path]

> **Entry point:** [How does the user get here?] **Exit point:** [Where do they end up?]

```
Step 1 → Step 2 → Step 3 → Step 4
                      ↓ (if error)
                   Error State
```

1. [e.g., User clicks "Create New" on dashboard]
2. [e.g., Modal opens with form: Name, Type, Description]
3. [e.g., User fills fields → clicks "Save"]
4. [e.g., Success toast → redirected to detail view]

**Error branch:** [What happens on validation failure / API error?]

### Flow 2: [Secondary / Edge Case Path]

> **Entry point:** [...] **Exit point:** [...]

1. [Steps...]

---

## 7. Screens & Components

<!-- List every screen the designer needs to create. For each: purpose, key elements, states. This section replaces a separate Design Spec. -->

### Screen 1: [Screen Name]

> 🎟️ **Design ticket:** `[PROJ]-XXX` — [One-line description]

| Field | Description |
|------|-------------|
| **Purpose** | What is this screen for? |
| **Entry from** | Which flow step leads here? |
| **Key elements** | Buttons, inputs, tables, cards — what is on this screen? |
| **States** | Empty, Loading, Populated, Error — which apply? |
| **User stories** | US-1, US-2 — which stories does this screen serve? |


**Content & copy:**

| Location      | Text                                               | Notes               |
| ------------- | -------------------------------------------------- | ------------------- |
| [Page title]  | [e.g., "Your Proposals"]                           |                     |
| [Empty state] | [e.g., "No proposals yet. Create your first one."] | [Include CTA]       |
| [Error state] | [e.g., "Something went wrong. Try again."]         | [Show retry button] |

### Screen 2: [Screen Name]

> 🎟️ **Design ticket:** `[PROJ]-XXX` — [One-line description]

| Field | Details |
|------|---------|
| **Purpose** | |
| **Entry from** | |
| **Key elements** | |
| **States** | |
| **User stories** | |

### New / Modified Components

<!-- Only components that are new or changed for this feature. -->

|Component|States|New or Existing?|Used on|
|---|---|---|---|
|[e.g., Status Badge]|[Active, Inactive, Pending]|New|Screen 1, Screen 3|

---

## 8. Design Constraints

<!-- Anything that limits the designer's decisions. -->

- [e.g., Must work on mobile down to 375px]
- [e.g., Must meet WCAG 2.1 AA contrast ratios]
- [e.g., Reuse existing card component from design system]
- [e.g., Max 2 new colors — stay within brand palette]

---

## 9. Success Metrics

|Metric|Target|Measure By|Tool|
|---|---|---|---|
|[e.g., Adoption rate]|[50% in 30 days]|[30 days post-launch]|[Mixpanel]|
|||||

---

## 10. Open Questions

|#|Question|Owner|Blocking?|Status|
|---|---|---|---|---|
|Q1|[Question]|[Eng / Design / Legal]|[Yes / No]|Open|
||||||

---

## 11. Timeline & Dependencies

- **Hard deadlines:** [If any]
- **Dependencies:** [Other teams / features this depends on]
- **Phasing:** [If too large for one sprint, how to split]

---

## 12. Jira Tickets — Design Phase

<!-- One Story Definition ticket per feature. Design sub-tasks under it. -->

### Story: [PROJ]-XXX — [Feature Name] — Story Definition

> **Type:** Story **Epic:** [Epic name] **Description:** [Links to this PRD]

|Sub-task|Summary|Assignee|Status|Linked Screens|
|---|---|---|---|---|
|`[PROJ]-XXX`|Design: [Screen 1 name]|[Designer]|To Do|Screen 1|
|`[PROJ]-XXX`|Design: [Screen 2 name]|[Designer]|To Do|Screen 2|
|`[PROJ]-XXX`|Design: Component — [Component name]|[Designer]|To Do|Screen 1, 3|
|`[PROJ]-XXX`|Design: Flow review + edge cases|[Designer]|To Do|All|

---

## Changelog

| Date   | Author | Changes       |
| ------ | ------ | ------------- |
| [Date] | [Name] | Initial draft |
|        |        |               |