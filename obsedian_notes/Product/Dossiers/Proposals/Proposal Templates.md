---
tags:
  - new_feature/dossiers/proposal_templates/v1
---
## First principle thinking
- **Templates capture a proven structure so it can be reused, standardized, and improved over time.**
Three things are happening:
1. **Reuse**
    - Avoid rewriting known content.
2. **Standardization**
    - Every proposal follows a consistent structure.
3. **Continuous improvement**
    - When a proposal works well, it becomes a better template.

## 1. Problem Statement

Users creating proposals in SparrowGenie today start from a blank page every time. There is no way to leverage a proven structure or reuse past work. This means every proposal takes significant time to draft, formatting and structure vary across proposals, and teams cannot build on what already works. Users need a way to start from pre-built default templates, create proposals quickly, and save successful proposals back as reusable templates so their library improves over time.

---

## 2. Goals

**User Goals**

- Reduce proposal creation time by giving users ready-to-use default templates on first use
- Allow users to create their first proposal within minutes of signing up
- Enable users to save a completed proposal as a personal template for future reuse

**Business Goals**

- Increase proposal creation activation rate (first proposal created within 7 days of signup)
- Reduce time-to-first-proposal from account creation
- Drive repeat proposal creation by making reuse frictionless

---

## 3. Non-Goals

|Non-Goal|Why Out of Scope|
|---|---|
|Template Management (edit, categorise, create from scratch)|Separate story — covers editing templates in editor, categorising by product/use case, and creating blank templates|
|Template sharing across team members|Future initiative — requires permissions and collaboration model|
|Template marketplace or community templates|Phase 2 — depends on template management being built first|
|Template versioning and rollback|Adds complexity — evaluate after core flow is validated|

---

## 4. User Stories

|#|User Type|I want to...|So that...|Priority|
|---|---|---|---|---|
|US-1|New user|Browse SparrowGenie's default templates when I first arrive|I can pick a proven structure and get started quickly without building from scratch|P0|
|US-2|New user|Create my first proposal by selecting a default template|I can fill in my content within a ready-made structure and send it faster|P0|
|US-3|Returning user|Save a completed proposal as a template in "My Templates"|I can reuse that same structure for future proposals without recreating it|P0|
|US-4|Returning user|Create a new proposal from one of my saved templates|I don't have to start from scratch every time I write a similar proposal|P0|
|US-5|Any user|See a clear separation between "Default Templates" and "My Templates"|I know which templates are SparrowGenie defaults and which are ones I saved|P1|

---

## 5. Requirements

### Must-Have (P0)

|#|Requirement|Acceptance Criteria|
|---|---|---|
|P0.1|System ships with a set of SparrowGenie default templates|Given a new user signs up, when they navigate to Proposals, then they see at least 3 default templates available to use|
|P0.2|User can select a default template to start creating a proposal|Given a user is on the templates listing, when they click a default template, then a new proposal is created pre-filled with that template's structure|
|P0.3|User can fill in and save a proposal created from a template|Given a user has a proposal open from a template, when they fill in content and click Save, then the proposal is saved to their proposals list|
|P0.4|User can save a completed proposal as a personal template|Given a user is viewing a saved proposal, when they click "Save as Template", then a copy is added to "My Templates" with the proposal's current content and structure|
|P0.5|User can create a new proposal from "My Templates"|Given a user has saved templates in "My Templates", when they select one, then a new proposal is created pre-filled with that template's structure|
|P0.6|Default templates are read-only and cannot be modified or deleted by users|Given a user is browsing default templates, then there are no edit or delete actions available on default templates|

### Nice-to-Have (P1)

|#|Requirement|Acceptance Criteria|
|---|---|---|
|P1.1|Visual distinction between Default Templates and My Templates sections|Given a user is on the template selection screen, then Default Templates and My Templates are displayed in clearly separated sections|
|P1.2|Template preview before selection|Given a user hovers or clicks preview on a template, then they can see the template's structure and sample content before committing|

### Future Considerations (P2)

- P2.1 — Template management (edit, categorise, create from scratch) — architect data model to support categories and editable templates without blocking this later
- P2.2 — Template sharing across team members — ensure templates have an owner field and visibility flag in the data model
- P2.3 — Template analytics (which templates are used most) — include template_id as a field on proposals for future tracking

---

## 6. User Flows

### Flow 1: New User Creates First Proposal from Default Template

> **Entry point:** User signs up and navigates to Proposals section for the first time. **Exit point:** Proposal is saved and visible in user's proposals list.

```
Proposals Page (empty) → Template Selection → Pick Default Template → Proposal Editor (pre-filled) → Fill Content → Save Proposal
                                                                                                          ↓ (if error)
                                                                                                    Validation Error / API Error
```

1. User navigates to Proposals — sees empty state with CTA "Create your first proposal"
2. User clicks CTA → Template Selection screen opens showing Default Templates
3. User browses default templates, optionally previews one
4. User selects a default template → Proposal Editor opens pre-filled with template structure
5. User fills in their content (company name, pricing, scope, etc.)
6. User clicks "Save" → Proposal is saved
7. Success toast → User is redirected to the saved proposal view

**Error branch:** If save fails (API error), show inline error message "Could not save your proposal. Please try again." with a retry button. If required fields are missing, highlight them with validation messages before allowing save.

### Flow 2: Returning User Creates Proposal from My Templates

> **Entry point:** User navigates to Proposals and clicks "Create Proposal". **Exit point:** New proposal saved from personal template.

1. User clicks "Create Proposal" on Proposals page
2. Template Selection screen opens — shows both "Default Templates" and "My Templates" sections
3. User selects a template from "My Templates"
4. Proposal Editor opens pre-filled with that template's content
5. User modifies content as needed → clicks "Save"
6. Proposal saved → redirected to proposal view

### Flow 3: User Saves a Proposal as Template

> **Entry point:** User is viewing a saved proposal. **Exit point:** Template appears in "My Templates".

1. User opens a saved proposal
2. User clicks "Save as Template" action (in toolbar or actions menu)
3. Confirmation dialog appears: "Save this proposal as a reusable template?"
4. User confirms → Template is created in "My Templates" with the proposal's current content
5. Success toast: "Template saved! You can find it in My Templates."

**Error branch:** If the user already has a template with the same name, prompt: "A template with this name already exists. Save with a new name?" with an editable name field.

---

## 7. Screens & Components

### Screen 1: Proposals List (Empty State)

> 🎟️ **Design ticket:** `SPRW-XXX` — Empty state for new users with no proposals

| Field | Description |
|------|-------------|
| **Purpose** | Landing page for Proposals section — shows user's proposals or guides first-time users |
| **Entry from** | Main navigation → Proposals |
| **Key elements** | Page title, empty state illustration, CTA button "Create Your First Proposal", description text |
| **States** | Empty (new user), Populated (returning user with proposals) |
| **User stories** | US-1, US-2 |

**Content & copy:**

| Location | Text | Notes |
|---|---|---|
| Page title | "Proposals" | |
| Empty state heading | "No proposals yet" | |
| Empty state body | "Get started by choosing a template and creating your first proposal." | |
| CTA button | "Create Your First Proposal" | Primary button, prominent placement |
| Error state | "Unable to load proposals. Please try again." | Show retry button |

### Screen 2: Template Selection

> 🎟️ **Design ticket:** `SPRW-XXX` — Template picker showing default and user templates

| Field | Description |
|------|-------------|
| **Purpose** | Let users browse and pick a template to start a new proposal |
| **Entry from** | Flow 1 step 2, Flow 2 step 2 — user clicks "Create Proposal" or empty state CTA |
| **Key elements** | Section header "Default Templates" with template cards, section header "My Templates" with template cards (or empty state if none), template preview on hover/click, search/filter (P1) |
| **States** | Default only (new user — no My Templates yet), Both sections (returning user), Loading, Error |
| **User stories** | US-1, US-2, US-4, US-5 |

**Content & copy:**

| Location | Text | Notes |
|---|---|---|
| Page title | "Choose a Template" | |
| Default section header | "Default Templates" | Badge: "By SparrowGenie" |
| My Templates section header | "My Templates" | Only shown when user has saved templates |
| My Templates empty state | "Templates you save from proposals will appear here." | Subtle text, no CTA needed |
| Error state | "Unable to load templates. Please try again." | Retry button |

### Screen 3: Proposal Editor

> 🎟️ **Design ticket:** `SPRW-XXX` — Proposal editor pre-filled from selected template

| Field | Description |
|------|-------------|
| **Purpose** | Where users fill in and edit the proposal content based on the template structure |
| **Entry from** | Flow 1 step 4, Flow 2 step 4 — user selects a template |
| **Key elements** | Pre-filled template sections (editable), toolbar with Save button and "Save as Template" action, section headings from template, rich text or form fields per section |
| **States** | Editing (unsaved changes), Saved, Saving (loading), Validation error |
| **User stories** | US-2, US-4 |

**Content & copy:**

| Location | Text | Notes |
|---|---|---|
| Save button | "Save Proposal" | Primary action |
| Save as Template action | "Save as Template" | In toolbar actions or dropdown menu |
| Success toast (save) | "Proposal saved." | Auto-dismiss after 3s |
| Success toast (save as template) | "Template saved! Find it in My Templates." | Auto-dismiss after 4s |
| Unsaved changes warning | "You have unsaved changes. Are you sure you want to leave?" | Browser beforeunload or modal |
| Validation error | "Please fill in the required fields highlighted below." | Inline field-level errors |

### Screen 4: Proposal View (Saved)

> 🎟️ **Design ticket:** `SPRW-XXX` — Read-only view of a saved proposal with actions

| Field | Description |
|------|-------------|
| **Purpose** | View a completed proposal and take actions (save as template, edit, export) |
| **Entry from** | Flow 1 step 7, Flow 3 step 1 — after saving or from proposals list |
| **Key elements** | Proposal content (read-only), action buttons: "Edit", "Save as Template", "Export/Share", template origin indicator (which template it was created from) |
| **States** | Populated |
| **User stories** | US-3 |

**Content & copy:**

| Location | Text | Notes |
|---|---|---|
| Save as Template button | "Save as Template" | Secondary action in toolbar |
| Confirmation dialog heading | "Save as Template?" | |
| Confirmation dialog body | "This will create a reusable template from this proposal. You can use it to create future proposals." | |
| Confirm button | "Save Template" | Primary |
| Cancel button | "Cancel" | Secondary |

### New / Modified Components

|Component|States|New or Existing?|Used on|
|---|---|---|---|
|Template Card|Default, Hover, Selected|New|Screen 2|
|Template Section Header|With badge ("By SparrowGenie"), Without badge|New|Screen 2|
|Save as Template Button|Default, Loading, Disabled|New|Screen 3, Screen 4|
|Confirmation Dialog|Open, Closed|Existing (reuse)|Screen 4|
|Empty State Illustration|Proposals empty, My Templates empty|New|Screen 1, Screen 2|

---

## 8. Design Constraints

- Must work on desktop (1024px+) — mobile responsive is P2
- Reuse existing card component from SparrowGenie design system for template cards
- Template Selection screen should feel lightweight (modal or slide-over, not a full page navigation) to keep the flow fast
- Default templates must be visually distinguished from user templates (badge, colour, or section separation)
- Stay within existing SparrowGenie brand palette — no new colours

---

## 9. Success Metrics

|Metric|Target|Measure By|Tool|
|---|---|---|---|
|First proposal created within 7 days of signup|60% of new users|30 days post-launch|Mixpanel|
|Proposals created from default templates|80% of first proposals use a default template|30 days post-launch|Mixpanel|
|Save as Template adoption|20% of proposals saved as templates within 60 days|60 days post-launch|Mixpanel|
|Repeat proposal creation from My Templates|30% of returning users create a proposal from My Templates|60 days post-launch|Mixpanel|
|Time to first proposal|Under 10 minutes from signup|30 days post-launch|Mixpanel|

---

## 10. Open Questions

|#|Question|Owner|Blocking?|Status|
|---|---|---|---|---|
|Q1|How many default templates do we ship with at launch, and for which use cases?|Product|Yes|Open|
|Q2|Should "Save as Template" copy the proposal content as-is, or let the user strip out specific data first?|Product / Design|Yes|Open|
|Q3|What is the maximum number of templates a user can save in My Templates?|Eng|No|Open|
|Q4|Should we track which default template a proposal was originally created from?|Eng / Product|No|Open|
|Q5|Do we need a naming step when saving as template, or auto-name from the proposal title?|Design|No|Open|

---

## 11. Timeline & Dependencies

- **Hard deadlines:** None currently
- **Dependencies:** Proposal editor must support pre-filling from a template data structure; default templates need to be authored and loaded as seed data
- **Phasing:** This story covers the core create-from-template and save-as-template flow. Template Management (edit, categorise, create from scratch, add from defaults) is a separate follow-up story.

---

## 12. Jira Tickets — Design Phase

### Story: SPRW-XXX — Proposal Templates: Create from Default & Save as Template — Story Definition

> **Type:** Story **Epic:** Proposal Templates **Description:** Core flow for creating proposals from default templates and saving proposals as reusable personal templates. See PRD: Proposal Templates.md

|Sub-task|Summary|Assignee|Status|Linked Screens|
|---|---|---|---|---|
|`SPRW-XXX`|Design: Proposals List empty state + populated state|[Designer]|To Do|Screen 1|
|`SPRW-XXX`|Design: Template Selection screen (defaults + My Templates)|[Designer]|To Do|Screen 2|
|`SPRW-XXX`|Design: Proposal Editor (pre-filled from template)|[Designer]|To Do|Screen 3|
|`SPRW-XXX`|Design: Proposal View with Save as Template action|[Designer]|To Do|Screen 4|
|`SPRW-XXX`|Design: Component — Template Card|[Designer]|To Do|Screen 2|
|`SPRW-XXX`|Design: Component — Empty State Illustrations|[Designer]|To Do|Screen 1, Screen 2|
|`SPRW-XXX`|Design: Flow review + edge cases (duplicate names, errors)|[Designer]|To Do|All|

---

## Changelog

|Date|Author|Changes|
|---|---|---|
|2026-03-13|Prod|Initial draft — Core proposal template flow (create from default, save as template). Template Management excluded as separate story.|
||||