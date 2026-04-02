---
tags:
  - "#new_feature/dossiers/permissions"
---
## First Principle

Users should be able to share and collaborate with internal people on both RFP questions and proposals through a single, unified permission model.

---

## 1. Problem Statement

SparrowGenie is merging the Proposal artifact into the existing project structure. Currently, internal collaboration only covers the questions workspace. With proposals becoming a first-class object inside projects (either generated from RFP answers or created standalone), the permission model needs to extend to cover both artifacts under one share flow.

Additionally, the existing role names (Owner / Manager / Participant / Watcher) don't map cleanly to proposal collaboration patterns. A new role — Commenter — is needed for users who should be able to discuss but not edit content.

---

## 2. Goals

**User Goals**

- Single invite gives access to both questions workspace and proposal — no duplicate sharing.
- Clear role boundaries: users know exactly what they can and cannot do.
- Comment-only participants can contribute feedback without risk of accidental edits.

**Business Goals**

- Increase per-project collaborator count by enabling low-friction comment-only invites to stakeholders (legal, finance, leadership).
- Drive platform stickiness by making the proposal a first-class collaborative artifact inside SparrowGenie.
- Unify permission model before external sharing ships, preventing a later refactor.

---

## 3. Non-Goals

| Non-Goal                                  | Why Out of Scope                                                 |
| ----------------------------------------- | ---------------------------------------------------------------- |
| External (client-facing) proposal sharing | Separate initiative; this PRD covers internal collaboration only |
| Granular per-section proposal permissions | v2 scope; single role covers entire project + proposal           |
| Proposal version history / diff           | Planned as a follow-up feature                                   |
| Template-level permission controls        | Separate template governance initiative                          |

---

## 4. User Stories

| #    | User Type                       | I want to...                                                        | So that...                                              | Priority |
| ---- | ------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------- | -------- |
| US-1 | Project Owner                   | Invite a user once and have them access both questions and proposal | I don't manage two separate share lists                 | P0       |
| US-2 | Legal Reviewer                  | Comment on both the proposal and questions without editing content  | I can flag issues without accidentally changing answers | P0       |
| US-3 | Editor                          | Edit proposal content/layout, add/remove sections, and export       | I can build and finalize the proposal document          | P0       |
| US-4 | Owner                           | Publish/share the proposal externally                               | The finalized proposal reaches the client               | P0       |
| US-5 | Viewer                          | See the full project and proposal in read-only mode                 | I stay informed without disrupting the workflow         | P1       |
| US-6 | Any user with Create permission | Create a standalone proposal not linked to an RFP                   | I can build proposals from scratch for non-RFP deals    | P0       |


---

## 5. Requirements

### Must-Have (P0)

#### Role Rename

| #    | Requirement                                                                                                               | Acceptance Criteria                                                                                                                                                                                                  |
| ---- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0.1 | Rename project-level roles: Owner (unchanged), Manager → Editor, Participant → Commenter (new behavior), Watcher → Viewer | Given any project, When roles are displayed in share modal / collaborator list / activity log, Then the new role names appear. Old role names do not appear anywhere in the UI.                                      |
| P0.2 | Migrate all existing role assignments: Manager → Editor, Participant → Editor (preserve edit rights), Watcher → Viewer    | Given existing projects with assigned roles, When the migration runs, Then no user loses capabilities they previously had. Existing Participants become Editors (not Commenters) to preserve backward compatibility. |

#### Commenter Role

|#|Requirement|Acceptance Criteria|
|---|---|---|
|P0.3|Commenter can view the entire project (all questions + proposal)|Given a Commenter, When they open the project, Then all questions, proposal content, activities tab, and knowledge sources are visible in read-only mode.|
|P0.4|Commenter can add comments/discussions on questions AND proposal|Given a Commenter on any question or proposal section, When they click the comment/discussion area, Then they can post, reply, and resolve comments.|
|P0.5|Commenter is blocked from all edit actions|Given a Commenter, When they attempt to: edit/write answers, run Genie AI, approve/reopen questions, reassign questions, bulk actions, export, or edit project metadata — Then the action is blocked with a tooltip: "You need Editor or higher access."|
|P0.6|Commenter requires minimum "Participate in Projects" system-level permission|Given a user without "Participate in Projects" permission, When an Owner tries to invite them as Commenter, Then the system shows: "User does not have project participation rights."|

#### Unified Share (Project + Proposal)

|#|Requirement|Acceptance Criteria|
|---|---|---|
|P0.7|Single share modal covers both questions workspace and proposal|Given the share modal, When a user is invited with a role, Then that role applies to both the questions workspace and the proposal document. No separate sharing needed.|
|P0.8|Role assignment in share modal offers: Owner, Editor, Commenter, Viewer|Given the share modal role dropdown, When opened, Then exactly four options appear in order: Owner, Editor, Commenter, Viewer.|
|P0.9|Existing collaborator role can be changed from the share modal|Given an existing collaborator in the share modal, When the Owner/Editor changes their role, Then the new role takes effect immediately (within 2s) across all active sessions.|

#### Proposal-Specific Permissions by Role

|#|Requirement|Acceptance Criteria|
|---|---|---|
|P0.10|Owner and Editor can: edit proposal content/layout, add/remove sections, comment, export/download proposal|Given an Owner or Editor on a project with a proposal, When they open the proposal, Then all editing, section management, commenting, and export controls are enabled.|
|P0.11|Only Owner and Editor can publish/share proposal externally|Given a Commenter or Viewer, When they view the proposal, Then the Publish/Share Externally button is hidden or disabled with tooltip.|
|P0.12|Commenter can comment on proposal but cannot edit content or layout|Given a Commenter viewing the proposal, When they interact with it, Then only the comment/discussion interface is active. All edit controls are disabled.|
|P0.13|Viewer can see the proposal in read-only mode with no comment or edit access|Given a Viewer viewing the proposal, Then no edit or comment controls are visible.|

#### Standalone Proposal Creation

| #     | Requirement                                                                                        | Acceptance Criteria                                                                                                                                     |
| ----- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0.14 | Users with "Create" system-level permission can create standalone proposals (not linked to an RFP) | Given a user with Create permission, When they initiate proposal creation, Then they can create a blank proposal. The creator becomes Owner by default. |
| P0.15 | Standalone proposals follow the same role and share model as RFP-linked proposals                  | Given a standalone proposal, When shared via the share modal, Then Owner/Editor/Commenter/Viewer roles apply identically to RFP-linked proposals.       |

### Nice-to-Have (P1)

|#|Requirement|Acceptance Criteria|
|---|---|---|
|P1.1|Activity log distinguishes comment-only actions from edit actions with role context|Given the activity tab, When a Commenter posts a comment, Then the log entry shows the user's role alongside the action.|
|P1.2|Notification when a Commenter's feedback is addressed or resolved|Given a comment posted by a Commenter, When an Editor resolves it, Then the Commenter receives a notification.|

### Future Considerations (P2)

- P2.1 — Per-section proposal permissions (e.g., Editor on pricing section only). Architect role model to not block this.
- P2.2 — Proposal version history with diff view and role-based restore rights.
- P2.3 — External (client-facing) proposal sharing with separate permission layer.

---

## 6. User Flows

### Flow 1: Invite Collaborator (Unified Share)

> **Entry point:** Owner/Editor clicks "Share" button on project header. **Exit point:** Collaborator receives invite and sees project + proposal.

```
Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Step 7
                                        ↓ (if fail)
                                      Step 6 (tooltip)
```

1. Owner/Editor opens the Share modal from project header.
2. Types user name or email in the search field.
3. Selects a role from dropdown: Owner / Editor / Commenter / Viewer.
4. System validates: (a) target user has minimum system-level permission for the selected role, (b) Owner/Editor has invite rights (global + project settings).
5. If validation passes → user is added to collaborator list with the selected role. Both questions workspace and proposal access are granted.
6. If validation fails → tooltip explains the reason (e.g., "User does not have Manage permission required for Editor role").
7. Invited user receives notification and can open the project immediately.

**Error branch:** If the inviter's own session has stale permissions (e.g., they were downgraded), the system revalidates on submit and shows "Your permissions have changed. Please refresh."

### Flow 2: Commenter Posts Feedback

> **Entry point:** Commenter opens a project they were invited to. **Exit point:** Comment posted, visible to all collaborators.

1. Commenter opens the project → sees questions list and proposal in read-only mode.
2. Navigates to a question or proposal section.
3. Clicks the comment/discussion area.
4. Types and submits their comment.
5. Comment appears in the discussion thread, tagged with the Commenter's name and role.
6. All edit controls (answer fields, Genie AI button, approve, reassign, metadata, export) remain disabled with tooltips.

### Flow 3: Create Standalone Proposal

> **Entry point:** User with Create permission clicks "New Proposal" (outside an RFP project). **Exit point:** Blank proposal created, user is Owner.

1. User clicks "New Proposal" from dashboard or proposals list.
2. System checks Create system-level permission.
3. If permitted → blank proposal editor opens. User is auto-assigned as Owner.
4. User can share via the same share modal (Owner/Editor/Commenter/Viewer).
5. If not permitted → tooltip: "Insufficient permission to create project."

---

## 7. Updated Role-Action Matrix

_This replaces the previous matrix from v1. Changes: Manager → Editor, Participant removed, Commenter added, Watcher → Viewer. Proposal actions added._

### Questions Workspace Actions

| Action                                 | Owner | Editor | Commenter | Viewer |
| -------------------------------------- | ----- | ------ | --------- | ------ |
| View project (all questions)           | ✓     | ✓      | ✓         | ✓      |
| View activities tab                    | ✓     | ✓      | ✓         | ✓      |
| Comment in discussions                 | ✓     | ✓      | ✓         | —      |
| View Knowledge Sources                 | ✓     | ✓      | ✓         | ✓      |
| Write / Edit assigned answer           | ✓     | ✓      | —         | —      |
| Run Genie on question(s)               | ✓     | ✓      | —         | —      |
| Approve assigned question              | ✓     | ✓      | —         | —      |
| Reopen approved question (assigned)    | ✓     | ✓      | —         | —      |
| Change status (assigned questions)     | ✓     | ✓      | —         | —      |
| Bulk actions (assigned only)           | ✓     | ✓      | —         | —      |
| Reassign questions (assigned only)     | ✓     | ✓      | —         | —      |
| Write / Edit unassigned questions      | ✓     | ✓      | —         | —      |
| Rerun Genie                            | ✓     | ✓      | —         | —      |
| Approve unassigned question            | ✓     | ✓      | —         | —      |
| Edit project metadata                  | ✓     | ✓      | —         | —      |
| Remove collaborator                    | ✓     | ✓      | —         | —      |
| Assign Author / Approver               | ✓     | ✓      | —         | —      |
| Promote Viewer → Editor                | ✓     | ✓      | —         | —      |
| Delete project                         | ✓     | ✓*     | —         | —      |
| Export project                         | ✓     | ✓      | —         | —      |
| Contextual Mapping / Instructions / KS | ✓     | ✓      | —         | —      |
| Demote Editor → Viewer                 | ✓     | —      | —         | —      |

_* Editor delete is conditional on global system policy + project-level settings._

### Proposal Actions

|Action|Owner|Editor|Commenter|Viewer|
|---|---|---|---|---|
|View proposal|✓|✓|✓|✓|
|Edit proposal content / layout|✓|✓|—|—|
|Add / remove proposal sections|✓|✓|—|—|
|Comment on proposal|✓|✓|✓|—|
|Export / download proposal|✓|✓|—|—|
|Publish / share proposal externally|✓|✓|—|—|
|Create standalone proposal|✓|✓|—|—|

_Note: Create standalone proposal requires system-level "Create" permission regardless of project role._

---

## 8. Global Permission → Project Role Mapping

No changes to the global permission model (Manage / Create / Delete with Own / Team / All scopes). The mapping to the new role names:

|Project Role|Min System-Level Permission|Change from v1|
|---|---|---|
|Owner|Create (Own) + Manage (Own)|No change|
|Editor|Manage (Own)|Renamed from Manager|
|**Commenter**|**Participate in Projects**|**New role**|
|Viewer|Participate in Projects|Renamed from Watcher|

All checkbox behavior rules from v1 (cascading logic, auto-check/uncheck, dependency hierarchy) remain unchanged.

---

## 9. Screens & Components

### Screen 1: Updated Share Modal

> 🎟️ **Design ticket:** `[SG]-XXX` — Updated Share Modal with Commenter role

|Field|Details|
|---|---|
|**Purpose**|Unified invite flow for project + proposal collaboration|
|**Entry from**|"Share" button on project header (accessible by Owner and Editor)|
|**Key elements**|User search input, role dropdown (Owner / Editor / Commenter / Viewer), existing collaborator list with role badges, remove button, role change dropdown per user|
|**States**|Empty (no collaborators), Populated, Validation error (inline), Permission mismatch warning|
|**User stories**|US-1, US-2, US-5|

**Content & copy:**

|Location|Text|Notes|
|---|---|---|
|Modal title|"Share Project"||
|Role dropdown hint|"Select access level"||
|Validation error|"User does not have the required system permissions for this role."|Inline below search|
|Commenter tooltip|"Can view and comment on questions and proposal. Cannot edit."|On hover over role badge|

### Screen 2: Proposal View (Role-Gated)

> 🎟️ **Design ticket:** `[SG]-XXX` — Proposal View with role-gated states

|Field|Details|
|---|---|
|**Purpose**|Display proposal with controls gated by project role|
|**Entry from**|Project navigation tab ("Proposal")|
|**Key elements**|Proposal content area, section list, comment thread, edit toolbar (gated), export button (gated), publish button (gated)|
|**States**|Empty (no proposal yet), Editable (Owner/Editor), Comment-only (Commenter), Read-only (Viewer)|
|**User stories**|US-2, US-3, US-4, US-5|

**Content & copy:**

|Location|Text|Notes|
|---|---|---|
|Empty state|"No proposal yet. Click 'Create Proposal' to get started."|Owner/Editor see CTA button|
|Commenter banner|"You have comment access. You can add feedback but cannot edit content."|Subtle info banner at top|
|Viewer banner|"You have view-only access."|Subtle info banner at top|
|Disabled export tooltip|"You need Editor or higher access to export."||

### New / Modified Components

|Component|States|New / Existing?|Used On|
|---|---|---|---|
|Role Badge|Owner, Editor, Commenter, Viewer|Modified (new labels)|Share Modal, Collaborator List|
|Role Dropdown|4 options with tooltips|Modified (Commenter added)|Share Modal|
|Permission Info Banner|Commenter, Viewer|New|Proposal View, Questions Workspace|

---

## 10. Design Constraints

- Reuse the existing share modal component; extend with Commenter role option and role tooltips.
- Permission info banners must be non-intrusive (collapsible or dismissible after first view).
- Disabled controls must show contextual tooltips explaining the restriction reason.
- Role badge colors must be distinct enough to differentiate at a glance (WCAG 2.1 AA contrast).
- No new navigation patterns — proposal tab sits alongside existing project tabs.

---

## 11. Success Metrics

|Metric|Target|Measure By|Tool|
|---|---|---|---|
|Avg collaborators per project|+30% within 60 days|60 days post-launch|Mixpanel|
|Commenter role adoption|>20% of invites use Commenter|30 days post-launch|Mixpanel|
|Comment volume on proposals|Baseline established|30 days post-launch|Mixpanel|
|Zero permission escalation bugs|0 incidents|Ongoing|Sentry / QA|

---

## 12. Open Questions

|#|Question|Owner|Blocking?|Status|
|---|---|---|---|---|
|Q1|Should existing Participants migrate to Editor or Commenter? (PRD recommends Editor to preserve capabilities)|PM + Eng|Yes|Open|
|Q2|Can a Commenter resolve their own comments, or only the Editor/Owner?|PM + Design|No|Open|
|Q3|Should Viewer be able to see comments (read-only) or are comments hidden entirely?|PM + Design|No|Open|
|Q4|Does the Proposal tab appear for projects that don't have a proposal yet, or only after one is created?|Design|No|Open|

---

## 13. Timeline & Dependencies

- **Hard deadlines:** None specified.
- **Dependencies:**
    - Proposal editor component must be ready for role-gated rendering.
    - v1 collaboration (existing permission model) must be stable in production.
    - Migration script for role rename must be tested against production data.
- **Phasing:**
    - Phase 1: Role rename + Commenter role + unified share modal (questions workspace).
    - Phase 2: Proposal artifact integration with role-gated controls.
    - Phase 3: Standalone proposal creation flow.

---

## 14. Jira Tickets — Design Phase

### Story: [SG]-XXX — Internal Collaboration v2 + Proposal Merge — Story Definition

> **Type:** Story | **Epic:** Internal Collaboration | **Description:** Links to this PRD

| Sub-task   | Summary                                         | Assignee | Status | Linked Screens |
| ---------- | ----------------------------------------------- | -------- | ------ | -------------- |
| `[SG]-XXX` | Design: Updated Share Modal with Commenter role | Joel     | To Do  | Screen 1       |
| `[SG]-XXX` | Design: Proposal View (role-gated states)       | Joel     | To Do  | Screen 2       |
| `[SG]-XXX` | Design: Permission Info Banner component        | Joel     | To Do  | Screen 1, 2    |
| `[SG]-XXX` | Design: Role Badge update (labels + colors)     | Joel     | To Do  | Screen 1       |
| `[SG]-XXX` | Design: Flow review + edge cases                | Joel     | To Do  | All            |