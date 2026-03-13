---
tags:
  - new_feature/dossiers/proposal_templates/my_templates/v1
---
## First principle thinking

My Templates are about personal ownership and iteration. Every person develops their own way of writing proposals — favourite sections, preferred ordering, shorthand for recurring content. My Templates let each user build a personal library that reflects how they work, not how the company or SparrowGenie thinks they should work.

## 1. Problem Statement

Users who have created proposals in SparrowGenie can't easily reuse their own work. They either recreate the same structure from scratch each time, or copy-paste from a previous proposal and manually clean it up. There is no personal template library where a user can save a proposal they liked, tweak it, and reuse it next time. Users also can't take a Genie Template or Company Template and make a personalised version they control. Without My Templates, users waste time rebuilding structures they've already proven, and their proposal quality doesn't compound over time.

---

## 2. Goals

**User Goals**

- Let every user save any proposal as a personal template in one click
- Let users create personalised copies of Genie or Company Templates they can freely edit and reuse
- Give users a private library that grows as they work — the more proposals they create, the better their template library gets

**Business Goals**

- Increase repeat proposal creation rate (users who reuse templates create more proposals)
- Reduce per-proposal creation time for returning users (target: 50% faster than first proposal)
- Drive engagement loop: Create proposal → Save as template → Reuse → Improve → Save again

---

## 3. Non-Goals

|Non-Goal|Why Out of Scope|
|---|---|
|Sharing My Templates with other users|My Templates are personal. Sharing happens through Company Templates (Tier 2)|
|Template categorisation, tagging, or search|Part of Template Management story|
|Template versioning and rollback|Future consideration — data model should support it but not built in v1|
|Promoting My Template to Company Template|Separate flow — permitted users can create Company Templates from proposals, but promoting from My Templates is P2|
|Template analytics|Phase 2|
|Genie Template management|Separate PRD (Tier 1)|
|Company Template management|Separate PRD (Tier 2)|

---

## 4. User Stories

|#|User Type|I want to...|So that...|Priority|
|---|---|---|---|---|
|US-1|Any user|Save a completed proposal as a My Template|I can reuse that structure for future proposals without rebuilding it|P0|
|US-2|Any user|Create a new proposal from one of my saved templates|I start with my proven structure and only need to fill in what's different|P0|
|US-3|Any user|Save a copy of a Genie Template as My Template|I can personalise it (add my sections, remove what I don't need) and reuse my version|P0|
|US-4|Any user|Save a copy of a Company Template as My Template|I can make a personal version that fits how I write, not just the company standard|P0|
|US-5|Any user|Preview a My Template before using it|I can check the structure and content before creating a proposal from it|P0|
|US-6|Any user|Edit a My Template to update its content|I can improve my template as I learn what works better|P1|
|US-7|Any user|Delete a My Template I no longer need|I keep my library clean and only see templates I actually use|P1|
|US-8|Any user|Rename a My Template|I can give it a name that makes sense to me as my library grows|P1|
|US-9|Any user|See My Templates as a distinct section in the Template Picker|I know which templates are mine versus company or Genie defaults|P0|

---

## 5. Requirements

### Must-Have (P0)

|#|Requirement|Acceptance Criteria|
|---|---|---|
|P0.1|User can save any proposal as a My Template|Given a user is viewing a saved proposal, when they click "Save as My Template", then a copy of the proposal content is saved to their My Templates library|
|P0.2|User can create a new proposal from a My Template|Given a user opens the Template Picker and selects a My Template, when they click "Use This Template", then a new proposal opens in the editor pre-filled with the template's sections and content|
|P0.3|User can save a Genie Template as My Template|Given a user is browsing Genie Templates, when they click "Save as My Template", then the template opens in editor, user optionally modifies it, and saves a copy to My Templates|
|P0.4|User can save a Company Template as My Template|Given a user is browsing Company Templates, when they click "Save as My Template", then the template opens in editor, user optionally modifies it, and saves a copy to My Templates|
|P0.5|User can preview a My Template before using it|Given a user clicks "Preview" on a My Template, then a preview panel shows the full structure without creating a proposal|
|P0.6|My Templates section appears in the Template Picker|Given a user opens the Template Picker, then they see a "My Templates" section below Company Templates. If no My Templates exist yet, show an empty state|
|P0.7|My Templates are private — only the owner can see and use them|Given User A saves a My Template, then User B in the same account cannot see it in their Template Picker|

### Nice-to-Have (P1)

|#|Requirement|Acceptance Criteria|
|---|---|---|
|P1.1|User can edit a My Template|Given a user clicks "Edit" on a My Template, then the editor opens with the template's current content. Changes are saved in-place|
|P1.2|User can delete a My Template|Given a user clicks "Delete" on a My Template, then a confirmation dialog appears. On confirm, the template is removed. Existing proposals created from it are not affected|
|P1.3|User can rename a My Template|Given a user clicks "Rename" on a My Template, then an inline editable name field appears. On blur or Enter, the name is saved|
|P1.4|My Templates show template origin (where the template came from)|Given a My Template was created from a Genie Template, Company Template, or proposal, then the card shows origin info (e.g., "From: Sales Proposal — Genie Template")|
|P1.5|My Templates show last-used date|Given a user created a proposal from a My Template, then the card shows "Last used: [date]"|

### Future Considerations (P2)

- P2.1 — Template categorisation and tagging (e.g., "Sales", "Consulting", custom tags)
- P2.2 — Template versioning — save edit history so users can revert to a previous version
- P2.3 — Promote My Template → Company Template — let permitted users elevate a personal template to account level
- P2.4 — Template duplication — "Duplicate" action to create a copy within My Templates for variations
- P2.5 — Template sorting and filtering — sort by most-used, recently created, alphabetical

---

## 6. User Flows

### Flow 1: User Saves Proposal as My Template

> **Entry point:** User is viewing a saved proposal. **Exit point:** Template appears in My Templates.

```
Proposal View → "Save as My Template" → Name dialog → Save → Toast confirmation
```

1. User opens a saved proposal
2. User clicks "Save as My Template" from the actions menu or toolbar
3. Dialog appears: "Save this proposal as a personal template?"
4. Name field pre-filled with "[Proposal Title] Template" — user can edit
5. User clicks "Save"
6. Confirmation toast: "Saved to My Templates!"
7. Copy now appears in My Templates section of Template Picker

**Error branch:** If a My Template with the same name exists, prompt: "You already have a template with this name. Save with a different name?" with editable name field.

### Flow 2: User Creates Proposal from My Template

> **Entry point:** User clicks "Create Proposal". **Exit point:** Proposal saved.

```
Template Picker → My Templates section → Preview (optional) → "Use This Template" → Proposal Editor (pre-filled) → Fill content → Save
```

1. User clicks "Create Proposal" → Template Picker opens
2. User navigates to "My Templates" section
3. User browses their templates — sees name, description, origin, last-used date
4. Optionally clicks "Preview" → Preview panel shows full structure
5. User clicks "Use This Template" → Proposal Editor opens pre-filled
6. User modifies content for this specific proposal
7. User clicks "Save Proposal" → Proposal saved
8. Success toast → Redirected to proposal view

### Flow 3: User Saves Genie Template as My Template

> **Entry point:** User is browsing Genie Templates. **Exit point:** Personalised copy in My Templates.

1. User opens Template Picker → Genie Templates section
2. User clicks "Save as My Template" on a Genie Template card or from the preview panel
3. Editor opens with Genie Template content pre-filled
4. User modifies sections to fit their personal style (adds, removes, rewords sections)
5. User sets a template name
6. User clicks "Save as My Template"
7. Confirmation toast: "Saved to My Templates!"
8. Copy appears in My Templates section

### Flow 4: User Saves Company Template as My Template

> **Entry point:** User is browsing Company Templates. **Exit point:** Personal copy in My Templates.

1. User opens Template Picker → Company Templates section
2. User clicks "Save as My Template" on a Company Template card or from the preview panel
3. Editor opens with Company Template content pre-filled
4. User modifies sections to fit their personal preferences
5. User sets a template name
6. User clicks "Save as My Template"
7. Confirmation toast: "Saved to My Templates!"
8. Copy appears in My Templates section

### Flow 5: User Edits a My Template (P1)

> **Entry point:** User is browsing My Templates. **Exit point:** Updated template saved.

1. User opens Template Picker → My Templates section
2. User clicks "Edit" on a My Template
3. Editor opens with the template's current content
4. User modifies sections, content, or naming
5. User clicks "Save Changes"
6. Confirmation toast: "Template updated."

---

## 7. Screens & Components

### Screen 1: Template Picker — My Templates Section

> 🎟️ **Design ticket:** `SPRW-XXX` — My Templates section within the template picker

| Field | Description |
|------|-------------|
| **Purpose** | Let users browse and select from their personal template library |
| **Entry from** | Flow 2 step 2 — user clicks "Create Proposal" |
| **Key elements** | Section header "My Templates" with personal icon, template cards in grid, each card showing: name, origin info (P1), last-used date (P1). Action buttons: "Preview", "Use This Template", "Edit" (P1), "Delete" (P1), "Rename" (P1) |
| **States** | Empty (no My Templates yet), Loading, Populated, Error |
| **User stories** | US-2, US-5, US-9 |

**Content & copy:**

| Location | Text | Notes |
|---|---|---|
| Section header | "My Templates" | |
| Section badge | "Personal" | Small badge next to header |
| Section description | "Your personal templates. Only you can see these." | Subtle text below header |
| Empty state heading | "No templates yet" | |
| Empty state body | "Save a proposal or copy a template to start building your personal library." | |
| Empty state hint | "Tip: After creating a proposal, use 'Save as My Template' to save it for reuse." | Subtle secondary text |
| Error state | "Unable to load your templates. Please try again." | Retry button |

### Screen 2: My Template Preview Panel

> 🎟️ **Design ticket:** `SPRW-XXX` — Preview panel for My Templates

| Field | Description |
|------|-------------|
| **Purpose** | Show full template structure so user can review before using |
| **Entry from** | Flow 2 step 4 — user clicks "Preview" on a My Template card |
| **Key elements** | Template name at top, origin info (P1), last-used date (P1), full list of section headings with content, "Use This Template" primary CTA, "Edit Template" secondary action, close/back button |
| **States** | Loading, Populated |
| **User stories** | US-5 |

**Content & copy:**

| Location | Text | Notes |
|---|---|---|
| Panel header | "[Template Name]" | |
| Origin info | "From: [Source Name] — [Source Type]" | P1, below header |
| Last used | "Last used: [Date]" or "Never used" | P1 |
| Primary CTA | "Use This Template" | Creates proposal |
| Secondary action | "Edit Template" | Opens in editor |

### Screen 3: My Template Editor (Create / Edit)

> 🎟️ **Design ticket:** `SPRW-XXX` — Editor for creating or editing My Templates

| Field | Description |
|------|-------------|
| **Purpose** | Where users create new My Templates (from Genie/Company/Proposal) or edit existing ones |
| **Entry from** | Flow 3 step 3 (from Genie), Flow 4 step 3 (from Company), Flow 1 step 3 (from proposal), Flow 5 step 3 (editing) |
| **Key elements** | Template name field (editable), section headings (editable), section content (editable), toolbar with save button, origin indicator |
| **States** | Creating (new), Editing (existing), Saving, Saved, Validation error |
| **User stories** | US-1, US-3, US-4, US-6, US-8 |

**Content & copy:**

| Location | Text | Notes |
|---|---|---|
| Page title (create from proposal) | "Save as My Template" | |
| Page title (create from Genie) | "Save Genie Template as My Template" | |
| Page title (create from Company) | "Save Company Template as My Template" | |
| Page title (edit) | "Edit My Template" | |
| Name field placeholder | "Template name" | |
| Save button (create) | "Save as My Template" | Primary |
| Save button (edit) | "Save Changes" | Primary |
| Success toast (create) | "Saved to My Templates!" | Auto-dismiss 3s |
| Success toast (edit) | "Template updated." | Auto-dismiss 3s |
| Unsaved changes | "You have unsaved changes. Leave without saving?" | Modal on navigate away |

### Screen 4: Proposal Editor (Pre-filled from My Template)

> 🎟️ **Design ticket:** `SPRW-XXX` — Proposal editor with My Template content loaded

| Field | Description |
|------|-------------|
| **Purpose** | Where users fill in proposal content within their personal template structure |
| **Entry from** | Flow 2 step 5 — user clicks "Use This Template" |
| **Key elements** | Pre-filled sections from My Template (editable), toolbar with "Save Proposal", origin indicator ("Created from: [Name] — My Template"), "Save as Template" actions |
| **States** | Editing, Saving, Saved, Validation error |
| **User stories** | US-2 |

**Content & copy:**

| Location | Text | Notes |
|---|---|---|
| Origin badge | "From: [Template Name] — My Template" | Subtle indicator at top |
| Save button | "Save Proposal" | Primary |
| Save dropdown | "Save as My Template" (overwrite or new) / "Save as Company Template" (if permitted) | Toolbar actions |
| Success toast | "Proposal saved." | Auto-dismiss 3s |

### New / Modified Components

|Component|States|New or Existing?|Used on|
|---|---|---|---|
|My Template Card|Default, Hover, Selected. Shows Edit/Delete/Rename on hover|New|Screen 1|
|Personal Badge|Static ("Personal")|New|Screen 1|
|Origin Info Label|Static (shows source template name and tier)|New (P1)|Screen 1, Screen 2|
|Last Used Date|Static or "Never used"|New (P1)|Screen 1, Screen 2|
|Inline Rename Field|Editing, Saved|New (P1)|Screen 1|
|Delete Confirmation Dialog|Open, Closed|Existing (reuse)|Screen 1|
|Save as My Template Dialog|Name field, Save/Cancel|New|Flow 1|

---

## 8. Design Constraints

- My Templates section sits below Company Templates in the Template Picker — but becomes the most prominent section once the user has saved templates (visual weight shifts with usage)
- Template cards follow the same card pattern as Genie and Company Template cards — extend with personal metadata (origin, last used)
- Preview panel layout is identical to Genie and Company preview panels — only metadata differs
- Edit, Delete, and Rename actions appear on hover or via overflow menu — don't clutter the default card state
- Empty state should guide users toward creating their first template (mention "Save as My Template" from proposals)
- Desktop first (1024px+) — mobile responsive is P2
- Stay within SparrowGenie brand palette
- My Templates should feel lighter and more personal than Company Templates — no "official" badges, simpler metadata

---

## 9. Success Metrics

|Metric|Target|Measure By|Tool|
|---|---|---|---|
|My Template creation rate|30% of active users save at least 1 My Template within 30 days|30 days post-launch|Mixpanel|
|Proposals created from My Templates|25% of proposals by returning users|60 days post-launch|Mixpanel|
|Repeat reuse rate|50% of users who create a My Template use it at least twice|60 days post-launch|Mixpanel|
|Time-to-proposal (My Template vs blank)|50% faster than first proposal (baseline from Genie Template)|60 days post-launch|Mixpanel|
|Template sources split|Track what % of My Templates come from Genie, Company, or Proposals|60 days post-launch|Mixpanel|

---

## 10. Open Questions

|#|Question|Owner|Blocking?|Status|
|---|---|---|---|---|
|Q1|Is there a maximum number of My Templates per user?|Eng|No|Open|
|Q2|When saving a proposal as My Template, should it copy the content as-is, or let the user strip out client-specific data first (e.g., company names, pricing)?|Product / Design|Yes|Open|
|Q3|Should "Save as My Template" from a proposal save immediately, or open the editor first for the user to clean up?|Product / Design|Yes|Open|
|Q4|If a user saves a Company Template as My Template, and the Company Template is later updated, should the user be notified?|Product|No|Open|
|Q5|Should My Templates have a "Favourite" or "Pin" action so users can surface their most-used templates at the top?|Design|No|Open|
|Q6|When a user has many My Templates, should the Template Picker show the most recently used at the top by default?|Design|No|Open|
|Q7|Can a user duplicate a My Template to create a variation (e.g., "Sales Proposal — Enterprise" and "Sales Proposal — SMB")?|Product|No|Open|

---

## 11. Timeline & Dependencies

- **Hard deadlines:** None currently
- **Dependencies:** Genie Templates (Tier 1) ships first. Company Templates (Tier 2) can ship in parallel or before. Template Picker must support the My Templates section. "Save as My Template" action must be available from: Proposal View, Genie Template Preview, Company Template Preview. Proposal data model must support saving as template (copy content to template store).
- **Phasing:** P0 (save proposal as My Template, create proposal from My Template, save copies from Genie/Company) ships in Sprint 1. P1 (edit, delete, rename, origin tracking, last-used date) ships in Sprint 2.

---

## 12. Jira Tickets — Design Phase

### Story: SPRW-XXX — My Templates: Save, Browse & Reuse — Story Definition

> **Type:** Story **Epic:** Proposal Templates **Description:** Tier 3 — My Templates. User-level personal templates. Users can save proposals as templates, save copies from Genie/Company Templates, and create proposals from their personal library. See PRD: My Templates - Proposal.md

|Sub-task|Summary|Assignee|Status|Linked Screens|
|---|---|---|---|---|
|`SPRW-XXX`|Design: Template Picker — My Templates section (populated + empty states)|[Designer]|To Do|Screen 1|
|`SPRW-XXX`|Design: My Template Preview panel|[Designer]|To Do|Screen 2|
|`SPRW-XXX`|Design: My Template Editor (create from Genie/Company/Proposal + edit mode)|[Designer]|To Do|Screen 3|
|`SPRW-XXX`|Design: Proposal Editor — pre-filled from My Template|[Designer]|To Do|Screen 4|
|`SPRW-XXX`|Design: Component — My Template Card + Personal Badge|[Designer]|To Do|Screen 1|
|`SPRW-XXX`|Design: Component — Save as My Template Dialog (from Proposal View)|[Designer]|To Do|Flow 1|
|`SPRW-XXX`|Design: Component — Origin Info + Last Used Date|[Designer]|To Do|Screen 1, Screen 2|
|`SPRW-XXX`|Design: Component — Inline Rename Field|[Designer]|To Do|Screen 1|
|`SPRW-XXX`|Design: Flow review + edge cases (name conflicts, delete confirmation, empty states)|[Designer]|To Do|All|

---

## Changelog

| Date       | Author | Changes       |
| ---------- | ------ | ------------- |
| 2026-03-13 | Prod   | Initial draft — My Templates (Tier 3). Covers save proposal as template, save copies from Genie/Company, browse, preview, and create proposal. Edit/delete/rename included as P1. |
|            |        |               |