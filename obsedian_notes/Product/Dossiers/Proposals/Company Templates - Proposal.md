---
tags:
  - new_feature/dossiers/proposal_templates/company_templates/v1
---
## First principle thinking

Company Templates exist because every organisation develops its own way of selling. Genie Templates give you a starting structure, but over time a company's proposals converge on a house style — specific sections, approved language, branded layouts. Company Templates capture that institutional knowledge at the account level so it survives employee turnover and stays consistent across the team. This is Tier 2 in the 3-tier template model — account-level, permission-gated, sitting between SparrowGenie's curated defaults (Tier 1) and each user's personal library (Tier 3).

## 1. Problem Statement

Teams using SparrowGenie today have no shared place to store approved proposal structures. Individual users may save personal templates, but there is no way to say "this is the company-standard Sales Proposal." As a result, proposals across the same account vary in structure and quality, new team members don't know what a good proposal looks like in their company's context, and proven proposal formats live in one person's My Templates — inaccessible to the rest of the team. Companies need an account-level template library that any team member can use and that only authorised users can manage, so proposal quality stays high and consistent.

---

## 2. Goals

**User Goals**

- Any user in the account can start a new proposal from a company-approved template without asking a colleague for their file
- Users with the right permissions can publish a battle-tested proposal structure for the whole team
- New hires can get up to speed faster by using the company's existing templates instead of building from scratch

**Business Goals**

- Increase cross-team proposal consistency within accounts
- Reduce onboarding time for new account users by giving them ready-made, company-specific templates
- Drive Genie Template → Company Template conversion (Tier 1 feeding Tier 2)

---

## 3. Non-Goals

|Non-Goal|Why Out of Scope|
|---|---|
|Template approval workflow (draft → review → publish)|Adds process complexity — evaluate after v1 validates demand|
|Template versioning and rollback|Future consideration — architect for it but don't build it now|
|Cross-account template sharing|Each account's templates are private to that account|
|Template analytics (usage dashboards, adoption tracking)|Phase 2 — depends on tracking template_id on proposals first|
|Editing Genie Templates in-place|Genie Templates are read-only. Users save copies as Company Templates — covered here|
|My Templates management|Separate PRD (Tier 3)|

---

## 4. User Stories

|#|User Type|I want to...|So that...|Priority|
|---|---|---|---|---|
|US-1|Any user|Browse Company Templates when creating a new proposal|I can use a company-approved structure that fits my use case|P0|
|US-2|Any user|Preview a Company Template before selecting it|I can see the sections and content before committing|P0|
|US-3|Any user|Create a proposal from a Company Template|I get a pre-filled editor with the company's approved structure and I can start writing immediately|P0|
|US-4|Permitted user|Create a Company Template from a Genie Template|I can adapt a SparrowGenie default to our company's standards and share it with the team|P0|
|US-5|Permitted user|Create a Company Template from an existing proposal|I can take a proposal that worked well and turn it into a reusable standard for the team|P0|
|US-6|Permitted user|Edit an existing Company Template|I can update sections, content, or naming as our proposal standards evolve|P1|
|US-7|Permitted user|Delete a Company Template|I can remove outdated or duplicate templates to keep the library clean|P1|
|US-8|Any user|See Company Templates as a distinct section separate from Genie and My Templates|I know which templates are company-approved versus SparrowGenie defaults or my personal ones|P0|
|US-9|Non-permitted user|Understand why I can't create/edit/delete Company Templates|I know how to get the right permission if I need it, instead of thinking the feature is broken|P1|

---

## 5. Requirements

### Must-Have (P0)

|#|Requirement|Acceptance Criteria|
|---|---|---|
|P0.1|Company Templates section appears in the Template Picker for all account users|Given any user opens the Template Picker, then they see a "Company Templates" section (between Genie Templates and My Templates). If no Company Templates exist yet, show an empty state.|
|P0.2|Any user can select a Company Template to create a proposal|Given a user clicks "Use This Template" on a Company Template, then a new proposal opens in the editor pre-filled with that template's sections and content|
|P0.3|Any user can preview a Company Template before using it|Given a user clicks "Preview" on a Company Template, then a preview panel shows the full structure (section headings, content) without creating a proposal|
|P0.4|Only users with template-management permission can create Company Templates|Given a user without permission, then "Create Company Template", "Save as Company Template" actions are hidden. Given a user with permission, then these actions are visible and functional|
|P0.5|Permitted user can create a Company Template from a Genie Template|Given a permitted user clicks "Save as Company Template" on a Genie Template, then the template opens in editor, user modifies content, clicks save, and a new Company Template is created visible to all account users|
|P0.6|Permitted user can create a Company Template from an existing proposal|Given a permitted user is viewing a saved proposal, when they click "Save as Company Template", then the proposal content is saved as a new Company Template visible to all account users|
|P0.7|Company Templates show the creator's name and creation date|Given a user is browsing Company Templates, then each template card shows who created it and when|

### Nice-to-Have (P1)

|#|Requirement|Acceptance Criteria|
|---|---|---|
|P1.1|Permitted user can edit an existing Company Template|Given a permitted user clicks "Edit" on a Company Template, then the editor opens with the template's current content. Changes are saved in-place (overwrite, no version history in v1)|
|P1.2|Permitted user can delete a Company Template|Given a permitted user clicks "Delete" on a Company Template, then a confirmation dialog appears. On confirm, the template is removed. Existing proposals created from it are not affected|
|P1.3|Non-permitted users see a tooltip or message explaining why create/edit/delete actions are unavailable|Given a non-permitted user hovers over or looks for management actions, then they see a message like "Ask your admin for template management permission"|
|P1.4|Company Templates show how many proposals have been created from them|Given a Company Template has been used, then the card shows a usage count (e.g., "Used 12 times")|

### Future Considerations (P2)

- P2.1 — Template approval workflow (draft → review → publish) — architect status field on templates to support this later
- P2.2 — Template versioning — store version history so edits can be rolled back
- P2.3 — Template categorisation and tagging — add category/tag fields to template data model
- P2.4 — Template usage analytics dashboard — track template_id on proposals, then build reporting
- P2.5 — Promote My Template → Company Template — allow permitted users to elevate a personal template to account level

---

## 6. User Flows

### Flow 1: User Creates Proposal from Company Template

> **Entry point:** User clicks "Create Proposal" from Proposals page. **Exit point:** Proposal saved and visible in proposals list.

```
Template Picker → Company Templates section → Preview (optional) → "Use This Template" → Proposal Editor (pre-filled) → Fill content → Save Proposal
```

1. User clicks "Create Proposal" → Template Picker opens
2. User scrolls to "Company Templates" section (or it's the default section if the user has Company Templates available)
3. User browses Company Template cards — sees name, description, creator, date
4. Optionally clicks "Preview" → Preview panel shows full template structure
5. User clicks "Use This Template" → Proposal Editor opens pre-filled with template sections and content
6. User fills in their specific content
7. User clicks "Save Proposal" → Proposal saved
8. Success toast → Redirected to proposal view

**Error branch:** If save fails, show inline error with retry. If required fields are missing, show validation messages.

### Flow 2: Permitted User Creates Company Template from Genie Template

> **Entry point:** Permitted user is browsing Genie Templates. **Exit point:** New Company Template visible to all account users.

1. Permitted user opens Template Picker → Genie Templates section
2. User clicks a Genie Template → clicks "Save as Company Template" (visible because user has permission)
3. Editor opens with Genie Template content pre-filled
4. User modifies sections to fit company standards (adds company-specific sections, adjusts language, removes irrelevant sections)
5. User sets a template name and optional description
6. User clicks "Save as Company Template"
7. Confirmation toast: "Company Template saved. Your team can now use it."
8. Template appears in Company Templates section for all account users

**Error branch:** If a Company Template with the same name exists, prompt: "A Company Template with this name already exists. Choose a different name?" with editable name field.

### Flow 3: Permitted User Creates Company Template from Existing Proposal

> **Entry point:** Permitted user is viewing a saved proposal. **Exit point:** Proposal content saved as a Company Template.

1. Permitted user opens a saved proposal
2. User clicks "Save as Company Template" from the actions menu
3. Dialog appears: "Save this proposal as a Company Template? Your team will be able to use it to create new proposals."
4. User optionally edits the template name (defaults to proposal title + " Template")
5. User clicks "Save"
6. Confirmation toast: "Company Template saved. Your team can now use it."
7. Template appears in Company Templates section

**Error branch:** If user does not have permission, the "Save as Company Template" action is not shown. If name conflict, prompt for a new name.

### Flow 4: Permitted User Edits a Company Template (P1)

> **Entry point:** Permitted user is browsing Company Templates. **Exit point:** Updated template saved.

1. Permitted user opens Template Picker → Company Templates section
2. User clicks "Edit" on a Company Template (only visible to permitted users)
3. Editor opens with the template's current content
4. User modifies sections, content, or naming
5. User clicks "Save Changes"
6. Confirmation toast: "Company Template updated."
7. All future proposals created from this template use the updated content. Existing proposals are not affected.

---

## 7. Screens & Components

### Screen 1: Template Picker — Company Templates Section

> 🎟️ **Design ticket:** `SPRW-XXX` — Company Templates section within the template picker

| Field | Description |
|------|-------------|
| **Purpose** | Let users browse and select from their account's shared Company Templates |
| **Entry from** | Flow 1 step 2 — user clicks "Create Proposal" |
| **Key elements** | Section header "Company Templates" with account badge, template cards in a grid (2-3 per row), each card showing: template name, description, creator name, creation date, usage count (P1). For permitted users: "Edit" and "Delete" actions on each card. For all users: "Preview" and "Use This Template" buttons |
| **States** | Empty (no Company Templates yet), Loading, Populated, Error |
| **User stories** | US-1, US-2, US-8 |

**Content & copy:**

| Location | Text | Notes |
|---|---|---|
| Section header | "Company Templates" | |
| Section badge | "Your Team" | Small badge next to header |
| Section description | "Templates approved for your team. Created by your colleagues." | Subtle text below header |
| Empty state heading | "No Company Templates yet" | |
| Empty state body (permitted) | "Create the first Company Template from a Genie Template or one of your proposals." | CTA: "Create Company Template" |
| Empty state body (non-permitted) | "Your team hasn't created any Company Templates yet. Ask an admin to set some up." | No CTA |
| Error state | "Unable to load Company Templates. Please try again." | Retry button |

### Screen 2: Company Template Preview Panel

> 🎟️ **Design ticket:** `SPRW-XXX` — Preview panel for Company Templates

| Field | Description |
|------|-------------|
| **Purpose** | Show full template structure so user can evaluate before using |
| **Entry from** | Flow 1 step 4 — user clicks "Preview" on a Company Template card |
| **Key elements** | Template name, description, creator, date at top. Full list of section headings with content. "Use This Template" primary CTA. "Save as My Template" secondary action (for any user). "Edit Template" action (permitted users only). Close/back button |
| **States** | Loading, Populated |
| **User stories** | US-2, US-3 |

**Content & copy:**

| Location | Text | Notes |
|---|---|---|
| Panel header | "[Template Name]" | |
| Creator info | "Created by [Name] on [Date]" | Below header |
| Sections list | Show all section headings with content | Read-only, scrollable |
| Primary CTA | "Use This Template" | Creates proposal |
| Secondary action | "Save as My Template" | Available to all users |
| Edit action | "Edit Template" | Only shown to permitted users |

### Screen 3: Company Template Editor (Create / Edit)

> 🎟️ **Design ticket:** `SPRW-XXX` — Editor for creating or editing Company Templates

| Field | Description |
|------|-------------|
| **Purpose** | Where permitted users create new Company Templates or edit existing ones |
| **Entry from** | Flow 2 step 3 (from Genie Template), Flow 3 step 3 (from proposal), Flow 4 step 3 (editing) |
| **Key elements** | Template name field (editable), template description field (editable), section headings (editable), section content (editable), toolbar with "Save as Company Template" or "Save Changes" button, origin indicator (if created from Genie Template or proposal) |
| **States** | Creating (new), Editing (existing), Saving, Saved, Validation error |
| **User stories** | US-4, US-5, US-6 |

**Content & copy:**

| Location | Text | Notes |
|---|---|---|
| Page title (create) | "Create Company Template" | |
| Page title (edit) | "Edit Company Template" | |
| Origin badge (from Genie) | "Based on: [Template Name] — Genie Template" | Subtle indicator |
| Origin badge (from proposal) | "Based on: [Proposal Name]" | Subtle indicator |
| Name field placeholder | "Template name (e.g., Enterprise Sales Proposal)" | |
| Description placeholder | "Brief description of when to use this template" | |
| Save button (create) | "Save as Company Template" | Primary |
| Save button (edit) | "Save Changes" | Primary |
| Success toast (create) | "Company Template saved. Your team can now use it." | Auto-dismiss 4s |
| Success toast (edit) | "Company Template updated." | Auto-dismiss 3s |
| Unsaved changes | "You have unsaved changes. Leave without saving?" | Modal on navigate away |

### Screen 4: Proposal Editor (Pre-filled from Company Template)

> 🎟️ **Design ticket:** `SPRW-XXX` — Proposal editor with Company Template content loaded

| Field | Description |
|------|-------------|
| **Purpose** | Where users fill in proposal content within the Company Template structure |
| **Entry from** | Flow 1 step 5 — user clicks "Use This Template" |
| **Key elements** | Pre-filled section headings (editable), template content (editable), toolbar with "Save Proposal", origin indicator ("Created from: [Template Name] — Company Template"), "Save as Template" actions in dropdown |
| **States** | Editing, Saving, Saved, Validation error |
| **User stories** | US-3 |

**Content & copy:**

| Location | Text | Notes |
|---|---|---|
| Origin badge | "From: [Template Name] — Company Template" | Subtle indicator at top |
| Save button | "Save Proposal" | Primary |
| Save dropdown | "Save as My Template" / "Save as Company Template" (if permitted) | Toolbar actions |
| Success toast | "Proposal saved." | Auto-dismiss 3s |

### New / Modified Components

|Component|States|New or Existing?|Used on|
|---|---|---|---|
|Company Template Card|Default, Hover, Selected. Permitted: shows Edit/Delete actions|New|Screen 1|
|Team Badge|Static ("Your Team")|New|Screen 1|
|Creator Info|Static (name + date)|New|Screen 1, Screen 2|
|Usage Count Badge|Static (e.g., "Used 12 times")|New (P1)|Screen 1|
|Permission Tooltip|Static ("Ask your admin for permission")|New (P1)|Screen 1|
|Company Template Origin Badge|Static (shows source — Genie Template or Proposal)|New|Screen 3, Screen 4|
|Delete Confirmation Dialog|Open, Closed|Existing (reuse)|Screen 1|

---

## 8. Design Constraints

- Company Templates section sits between Genie Templates (above) and My Templates (below) in the Template Picker — visual hierarchy should reflect this ordering
- Permitted user actions (Create, Edit, Delete) must be clearly visible to permitted users but invisible (not disabled) to non-permitted users to avoid confusion
- Template cards should follow the same card component pattern as Genie Template cards — extend with creator info and usage count
- Preview panel should be identical in layout to Genie Template preview panel — only the metadata differs
- Desktop first (1024px+) — mobile responsive is P2
- Stay within SparrowGenie brand palette
- Empty state for Company Templates should differentiate messaging for permitted vs non-permitted users

---

## 9. Success Metrics

|Metric|Target|Measure By|Tool|
|---|---|---|---|
|Company Template adoption (proposals created from Company Templates)|30% of proposals in accounts with Company Templates|60 days post-launch|Mixpanel|
|Company Template creation rate|At least 1 Company Template created in 40% of accounts within 60 days|60 days post-launch|Mixpanel|
|Genie → Company Template conversion|20% of permitted users save at least one Genie Template as Company Template|60 days post-launch|Mixpanel|
|Proposal → Company Template conversion|15% of permitted users save at least one proposal as Company Template|60 days post-launch|Mixpanel|
|Time-to-first-proposal for new team members|Under 8 minutes (faster than Genie Template baseline) in accounts with Company Templates|90 days post-launch|Mixpanel|

---

## 10. Open Questions

|#|Question|Owner|Blocking?|Status|
|---|---|---|---|---|
|Q1|Which permission set controls Company Template management? Is it a new permission or added to an existing set?|Product / Eng|Yes|Open|
|Q2|When a permitted user edits a Company Template, should existing proposals created from it be affected or stay as-is?|Product|Yes|Open|
|Q3|Should deleting a Company Template show how many proposals were created from it as a warning?|Design|No|Open|
|Q4|Can a Company Template be created from another Company Template (duplicate and edit)?|Product|No|Open|
|Q5|Is there a maximum number of Company Templates per account?|Eng|No|Open|
|Q6|Should Company Templates show an "Updated" badge when they've been edited since a user last viewed them?|Design|No|Open|
|Q7|When a user creates a proposal from a Company Template and later saves it as My Template, should the origin chain be tracked (Genie → Company → My)?|Eng|No|Open|
|Q8|Should the empty state for Company Templates prompt permitted users to create one from Genie Templates specifically, or be generic?|Design|No|Open|

---

## 11. Timeline & Dependencies

- **Hard deadlines:** None currently
- **Dependencies:** Genie Templates (Tier 1) must ship first — Company Templates are often created from Genie Templates. Permission system must support a template-management permission. Template Picker UI must support the Company Templates section. Proposal "Save as Company Template" action depends on the permission check API.
- **Phasing:** P0 (browse, preview, create proposal from Company Template, create Company Template from Genie/proposal) ships in Sprint 1. P1 (edit, delete, usage count, permission tooltip) ships in Sprint 2. Template categorisation and analytics are separate stories.

---

## 12. Jira Tickets — Design Phase

### Story: SPRW-XXX — Company Templates: Browse, Create & Use — Story Definition

> **Type:** Story **Epic:** Proposal Templates **Description:** Tier 2 — Company Templates. Account-level, permission-gated templates. Users can browse and create proposals from Company Templates. Permitted users can create Company Templates from Genie Templates or proposals. See PRD: Company Templates - Proposal.md

|Sub-task|Summary|Assignee|Status|Linked Screens|
|---|---|---|---|---|
|`SPRW-XXX`|Design: Template Picker — Company Templates section (populated + empty states)|[Designer]|To Do|Screen 1|
|`SPRW-XXX`|Design: Company Template Preview panel|[Designer]|To Do|Screen 2|
|`SPRW-XXX`|Design: Company Template Editor (create + edit modes)|[Designer]|To Do|Screen 3|
|`SPRW-XXX`|Design: Proposal Editor — pre-filled from Company Template|[Designer]|To Do|Screen 4|
|`SPRW-XXX`|Design: Component — Company Template Card + Team Badge|[Designer]|To Do|Screen 1|
|`SPRW-XXX`|Design: Component — Creator Info + Usage Count|[Designer]|To Do|Screen 1, Screen 2|
|`SPRW-XXX`|Design: Permission states (permitted vs non-permitted empty states, tooltips)|[Designer]|To Do|Screen 1|
|`SPRW-XXX`|Design: Flow review + edge cases (name conflicts, delete confirmation, permission denied)|[Designer]|To Do|All|

---

## Changelog

| Date       | Author | Changes       |
| ---------- | ------ | ------------- |
| 2026-03-13 | Prod   | Initial draft — Company Templates (Tier 2). Covers browse, preview, create proposal, and create Company Template from Genie/proposal. Edit and delete included as P1. |
|            |        |               |