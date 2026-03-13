---
tags:
  - new_feature/dossiers/proposal_templates/genie_templates/v1
---
## First principle thinking

Genie Templates are the starting line. A new user should never face a blank page. By shipping a curated set of ready-made proposal structures, SparrowGenie removes the cold-start problem entirely. The user's first interaction with proposals becomes "pick and fill" instead of "figure out what goes in a proposal." This is Tier 1 in the 3-tier template model — product-level, read-only, available to every SparrowGenie user. Genie Templates feed both Company Templates (Tier 2) and My Templates (Tier 3) — they are the seed that the entire template ecosystem grows from.

## 1. Problem Statement

New users signing up for SparrowGenie have no starting point for creating proposals. They don't know what a good proposal looks like, what sections to include, or how to structure content for different use cases (sales, consulting, SaaS, services). This leads to slow first-proposal creation, inconsistent quality across proposals, and high drop-off during onboarding. Users who have never written a proposal before are especially affected — they need a proven structure handed to them. Without Genie Templates, every user reinvents the wheel, and the time-to-first-proposal stays high.

---

## 2. Goals

**User Goals**

- Give every new user a ready-to-use proposal structure within their first session
- Reduce time-to-first-proposal to under 10 minutes from account creation
- Let users browse templates by purpose (Sales, Consulting, SaaS, Services) so they pick the right fit fast

**Business Goals**

- Increase first-proposal creation rate within 7 days of signup
- Drive template adoption as the default starting point (target: 80%+ of first proposals created from a Genie Template)
- Seed the Company Templates and My Templates tiers — users who start with Genie Templates are more likely to save and reuse

---

## 3. Non-Goals

|Non-Goal|Why Out of Scope|
|---|---|
|Editing Genie Templates directly|Genie Templates are read-only. Users open in editor and save as Company or My Template — that's a separate story (Template Management)|
|User-created templates|Covered by My Templates (Tier 3) and Company Templates (Tier 2) PRDs|
|Template categorisation, tagging, or search|Part of Template Management story|
|Template analytics (which Genie Templates are most used)|Phase 2 — track template_id on proposals first, then build dashboards|
|Custom Genie Templates per account|All accounts get the same Genie Templates. Customisation happens at Company Template level|

---

## 4. User Stories

|#|User Type|I want to...|So that...|Priority|
|---|---|---|---|---|
|US-1|New user|See a set of ready-made Genie Templates when I go to create my first proposal|I don't start from a blank page and can pick a structure that fits my use case|P0|
|US-2|Any user|Browse Genie Templates by purpose (Sales, Consulting, SaaS, Services)|I quickly find the template that matches the type of proposal I need to write|P0|
|US-3|Any user|Preview a Genie Template before selecting it|I can see the sections and structure before committing to use it|P0|
|US-4|Any user|Select a Genie Template and have it open in the proposal editor pre-filled|I can immediately start filling in my content without setting up the structure|P0|
|US-5|Any user|Open a Genie Template in the editor and save it as My Template|I can create a personalised version I can reuse without modifying the original|P1|
|US-6|Permitted user|Open a Genie Template in the editor and save it as a Company Template|My team gets a standardised starting point based on a proven structure|P1|
|US-7|Any user|See that Genie Templates are distinct from Company and My Templates|I understand which templates are SparrowGenie defaults and which are custom|P0|

---

## 5. Requirements

### Must-Have (P0)

|#|Requirement|Acceptance Criteria|
|---|---|---|
|P0.1|SparrowGenie ships with a curated set of Genie Templates covering core use cases|Given a new account is created, when any user navigates to Proposals → Create Proposal, then they see at least 4 Genie Templates: Sales Proposal, Consulting Proposal, SaaS Proposal, Services Proposal|
|P0.2|Genie Templates are read-only — users cannot edit, rename, or delete them|Given a user is viewing Genie Templates, then there are no edit, rename, or delete actions available. The only actions are "Use this template" and "Preview"|
|P0.3|User can select a Genie Template to create a new proposal|Given a user clicks "Use this template" on a Genie Template, then the proposal editor opens with the template's sections and placeholder content pre-filled|
|P0.4|Genie Templates are visually distinguished from Company and My Templates|Given a user is on the template picker, then Genie Templates appear in a clearly labelled "Genie Templates" section with a SparrowGenie badge, separate from Company Templates and My Templates sections|
|P0.5|Each Genie Template has a name, description, and purpose tag|Given a user is browsing Genie Templates, then each template card shows: template name, short description (1-2 lines), and purpose tag (e.g., "Sales", "Consulting")|
|P0.6|User can preview a Genie Template before using it|Given a user clicks "Preview" on a Genie Template, then a preview panel or modal shows the full template structure (section headings, placeholder content) without creating a proposal|

### Nice-to-Have (P1)

|#|Requirement|Acceptance Criteria|
|---|---|---|
|P1.1|User can save a Genie Template as My Template (open in editor, save as copy)|Given a user opens a Genie Template in the editor, when they click "Save as My Template", then a copy is saved to their My Templates with the Genie Template's content|
|P1.2|Permitted user can save a Genie Template as Company Template|Given a user with template-management permission opens a Genie Template in the editor, when they click "Save as Company Template", then a copy is saved to Company Templates|
|P1.3|Genie Templates show a "Recommended" or "Popular" indicator|Given a Genie Template has high usage, then it shows a "Popular" badge on the template card|

### Future Considerations (P2)

- P2.1 — Industry-specific Genie Templates (Real Estate, Legal, Healthcare) — architect the template data model with a category/industry field to support this later
- P2.2 — SparrowGenie can push new Genie Templates to existing accounts via updates — ensure the template store supports versioning and additions without affecting user copies
- P2.3 — Template usage analytics — track which Genie Templates are selected most, preview-to-use conversion rate

---

## 6. User Flows

### Flow 1: New User Creates First Proposal from Genie Template

> **Entry point:** User signs up and navigates to Proposals for the first time. **Exit point:** Proposal is saved and visible in user's proposals list.

```
Proposals (empty state) → Click "Create Proposal" → Template Picker → Genie Templates section → Preview → Select → Proposal Editor (pre-filled) → Fill content → Save
```

1. User navigates to Proposals — sees empty state with CTA "Create Your First Proposal"
2. User clicks CTA → Template Picker opens
3. Template Picker shows "Genie Templates" section prominently (top section, labelled "By SparrowGenie")
4. User browses Genie Template cards — sees name, description, purpose tag for each
5. User clicks "Preview" on a template → Preview panel shows full structure (section headings, placeholder text)
6. User clicks "Use This Template" → Proposal Editor opens pre-filled with template sections and placeholder content
7. User fills in their content (company name, pricing, scope, deliverables, etc.)
8. User clicks "Save" → Proposal saved
9. Success toast → Redirected to proposal view

**Error branch:** If save fails (API error), show inline error "Could not save your proposal. Please try again." with retry button. If required fields are missing, highlight them with validation messages.

### Flow 2: User Saves Genie Template as My Template

> **Entry point:** User is browsing Genie Templates. **Exit point:** Copy saved in My Templates.

1. User opens Template Picker → navigates to Genie Templates section
2. User clicks "Preview" or selects a Genie Template
3. User clicks "Save as My Template" action (available in preview panel or template card menu)
4. Template opens in editor with Genie Template content pre-filled
5. User optionally modifies sections, content, or naming
6. User clicks "Save as My Template"
7. Confirmation: "Template saved to My Templates!"
8. Copy now appears in My Templates section of Template Picker

**Error branch:** If user already has a template with the same name, prompt: "A template with this name exists. Save with a different name?" with editable name field.

### Flow 3: Permitted User Saves Genie Template as Company Template

> **Entry point:** User with permission is browsing Genie Templates. **Exit point:** Copy saved in Company Templates.

1. User opens Template Picker → navigates to Genie Templates section
2. User clicks a Genie Template → clicks "Save as Company Template" (only visible to users with template-management permission)
3. Template opens in editor with Genie Template content pre-filled
4. User modifies sections to fit company standards (adds company branding sections, removes irrelevant sections, etc.)
5. User clicks "Save as Company Template"
6. Confirmation: "Template saved to Company Templates. Your team can now use it."
7. Copy now appears in Company Templates section for all account users

**Error branch:** If user lacks permission, "Save as Company Template" action is not shown. If a Company Template with the same name exists, prompt for a new name.

---

## 7. Screens & Components

### Screen 1: Template Picker — Genie Templates Section

> 🎟️ **Design ticket:** `SPRW-XXX` — Genie Templates section within the template picker

| Field | Description |
|------|-------------|
| **Purpose** | Let users browse and select from SparrowGenie's curated default templates |
| **Entry from** | Flow 1 step 3 — user clicks "Create Proposal" or empty state CTA |
| **Key elements** | Section header "Genie Templates" with SparrowGenie badge, template cards in a grid (2-3 per row), each card showing: template name, description, purpose tag, "Preview" button, "Use This Template" button. Overflow actions: "Save as My Template", "Save as Company Template" (permission-gated) |
| **States** | Loading (fetching templates), Populated (normal), Error (failed to load) |
| **User stories** | US-1, US-2, US-7 |

**Content & copy:**

| Location | Text | Notes |
|---|---|---|
| Section header | "Genie Templates" | |
| Section badge | "By SparrowGenie" | Small badge next to header |
| Section description | "Proven proposal structures to get you started fast." | Subtle text below header |
| Template card — Sales | "Sales Proposal" / "Win deals with a structured pitch: overview, solution, pricing, and next steps." | |
| Template card — Consulting | "Consulting Proposal" / "Scope engagements clearly: problem statement, approach, timeline, and fees." | |
| Template card — SaaS | "SaaS Proposal" / "Present your platform: features, integration, pricing tiers, and onboarding plan." | |
| Template card — Services | "Services Proposal" / "Outline service delivery: scope, deliverables, milestones, and terms." | |
| Error state | "Unable to load Genie Templates. Please try again." | Retry button |

### Screen 2: Template Preview Panel

> 🎟️ **Design ticket:** `SPRW-XXX` — Preview panel for Genie Templates

| Field | Description |
|------|-------------|
| **Purpose** | Show full template structure so user can evaluate before using |
| **Entry from** | Flow 1 step 5 — user clicks "Preview" on a template card |
| **Key elements** | Template name and purpose tag at top, full list of section headings with placeholder text, "Use This Template" primary CTA, "Save as My Template" secondary action, "Save as Company Template" (if permitted), close/back button |
| **States** | Loading, Populated |
| **User stories** | US-3 |

**Content & copy:**

| Location | Text | Notes |
|---|---|---|
| Panel header | "[Template Name] Preview" | |
| Sections list | Show all section headings with first line of placeholder text | Read-only, scrollable |
| Primary CTA | "Use This Template" | Creates proposal |
| Secondary action | "Save as My Template" | Opens in editor for copy |
| Tertiary action | "Save as Company Template" | Only shown if user has permission |

### Screen 3: Proposal Editor (Pre-filled from Genie Template)

> 🎟️ **Design ticket:** `SPRW-XXX` — Proposal editor with Genie Template content loaded

| Field | Description |
|------|-------------|
| **Purpose** | Where users fill in their proposal content within the Genie Template structure |
| **Entry from** | Flow 1 step 6 — user clicks "Use This Template" |
| **Key elements** | Pre-filled section headings (editable), placeholder content in each section (editable), toolbar with "Save Proposal" button, template origin indicator ("Created from: Sales Proposal — Genie Template"), "Save as Template" actions in toolbar dropdown |
| **States** | Editing (unsaved changes), Saving (loading), Saved, Validation error |
| **User stories** | US-4, US-5, US-6 |

**Content & copy:**

| Location | Text | Notes |
|---|---|---|
| Template origin badge | "From: [Template Name] — Genie Template" | Subtle indicator at top |
| Placeholder text | "[Your company overview goes here]", "[Describe the solution you're proposing]", etc. | Gray text, disappears on click |
| Save button | "Save Proposal" | Primary |
| Save as template dropdown | "Save as My Template" / "Save as Company Template" | In toolbar actions |
| Success toast | "Proposal saved." | Auto-dismiss 3s |
| Unsaved changes | "You have unsaved changes. Leave without saving?" | Modal on navigate away |
| Validation | "Please complete the highlighted sections before saving." | Inline field errors |

### New / Modified Components

|Component|States|New or Existing?|Used on|
|---|---|---|---|
|Genie Template Card|Default, Hover, Selected|New|Screen 1|
|SparrowGenie Badge|Static ("By SparrowGenie")|New|Screen 1|
|Purpose Tag|Sales, Consulting, SaaS, Services|New|Screen 1, Screen 2|
|Template Preview Panel|Loading, Populated|New|Screen 2|
|Template Origin Badge|Static (shows source template name and tier)|New|Screen 3|
|Placeholder Text Input|Placeholder visible, Editing, Filled|New|Screen 3|

---

## 8. Design Constraints

- Genie Templates must feel trustworthy and curated — use the SparrowGenie badge consistently to signal "these are official"
- Template cards should work on desktop (1024px+) — mobile responsive is P2
- Reuse existing card component from design system for template cards, extend with purpose tag and badge
- Preview panel should be a side panel or modal — not a full page navigation — to keep the flow fast
- Template picker should clearly separate Genie Templates from Company Templates and My Templates using section headers and visual weight (Genie section is most prominent for new users, less prominent once user has their own templates)
- Stay within SparrowGenie brand palette — no new colours beyond the existing purpose tag colours
- Placeholder text in the editor must be clearly distinct from user-entered content (gray colour, italic, disappears on focus)

---

## 9. Success Metrics

|Metric|Target|Measure By|Tool|
|---|---|---|---|
|First proposals created from Genie Templates|80% of first proposals use a Genie Template|30 days post-launch|Mixpanel|
|Time-to-first-proposal|Under 10 minutes from signup|30 days post-launch|Mixpanel|
|Template preview-to-use conversion|60%+ of previews result in "Use This Template"|30 days post-launch|Mixpanel|
|Genie → My Template save rate|15% of users save a Genie Template as My Template within 30 days|60 days post-launch|Mixpanel|
|Genie → Company Template save rate|10% of permitted users save a Genie Template as Company Template within 60 days|90 days post-launch|Mixpanel|

---

## 10. Open Questions

|#|Question|Owner|Blocking?|Status|
|---|---|---|---|---|
|Q1|Exactly how many Genie Templates do we ship at launch? 4 (Sales, Consulting, SaaS, Services) or more?|Product|Yes|Open|
|Q2|What sections go inside each Genie Template? Need content team to draft the actual template structures.|Product / Content|Yes|Open|
|Q3|Should Genie Templates have a "Recommended for you" order based on account type or onboarding answers?|Product|No|Open|
|Q4|If SparrowGenie adds new Genie Templates post-launch, do they appear automatically in all accounts?|Engineering|No|Open|
|Q5|Should the template picker default to Genie Templates section for new users, then shift to My Templates section once the user has saved templates?|Design|No|Open|
|Q6|Do Genie Templates appear in the picker even after the user has Company and My Templates, or do they get de-prioritised?|Product / Design|No|Open|
|Q7|Should "Save as Company Template" from a Genie Template require approval from an admin, or is the permission enough?|Product|No|Open|

---

## 11. Timeline & Dependencies

- **Hard deadlines:** None currently
- **Dependencies:** Proposal Editor must support pre-filling from a template data model. Template Picker UI must support multiple sections (Genie, Company, My). Genie Template content (actual section text) must be authored by content team before dev.
- **Phasing:** This story covers Genie Templates display, preview, selection, and proposal creation. Saving Genie Templates as Company or My Template (US-5, US-6) can be phased into Sprint 2 if needed. Template Management (edit, categorise, search) is a separate story.

---

## 12. Jira Tickets — Design Phase

### Story: SPRW-XXX — Genie Templates: Browse, Preview & Create Proposal — Story Definition

> **Type:** Story **Epic:** Proposal Templates **Description:** Tier 1 — Genie Templates. Users can browse SparrowGenie's curated default templates, preview them, and create proposals from them. See PRD: Genie Templates - Proposals.md

|Sub-task|Summary|Assignee|Status|Linked Screens|
|---|---|---|---|---|
|`SPRW-XXX`|Design: Template Picker — Genie Templates section|[Designer]|To Do|Screen 1|
|`SPRW-XXX`|Design: Template Preview panel|[Designer]|To Do|Screen 2|
|`SPRW-XXX`|Design: Proposal Editor — pre-filled from Genie Template|[Designer]|To Do|Screen 3|
|`SPRW-XXX`|Design: Component — Genie Template Card + SparrowGenie Badge|[Designer]|To Do|Screen 1|
|`SPRW-XXX`|Design: Component — Purpose Tag (Sales, Consulting, SaaS, Services)|[Designer]|To Do|Screen 1, Screen 2|
|`SPRW-XXX`|Design: Component — Template Origin Badge|[Designer]|To Do|Screen 3|
|`SPRW-XXX`|Design: Component — Placeholder Text Input|[Designer]|To Do|Screen 3|
|`SPRW-XXX`|Design: Flow review + edge cases (permissions, errors, empty states)|[Designer]|To Do|All|

---

## Changelog

| Date       | Author | Changes       |
| ---------- | ------ | ------------- |
| 2026-03-13 | Prod   | Initial draft — Genie Templates (Tier 1). Covers browse, preview, select, and create proposal. Save-as flows for Company/My Templates included as P1. |
|            |        |               |