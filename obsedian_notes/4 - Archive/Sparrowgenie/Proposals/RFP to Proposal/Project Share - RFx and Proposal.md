---
tags:
  - "#new_feature/dossiers/permissions/v2"
---
## 1. First Principle

> Users should be able to share and collaborate with internal people on both RFP questions and proposals through a single, unified permission model.

---

## 2. Problem Statement

SparrowGenie is merging the Proposal artifact into the existing project structure. Currently, internal collaboration only covers the questions workspace. With proposals becoming a first-class object inside projects (either generated from RFP answers or created standalone), the permission model needs to extend to cover both artifacts under one share flow.

The existing role names (Owner / Manager / Participant / Watcher) don't map cleanly to proposal collaboration patterns. The roles have been restructured to: **Owner, Editor, Participant, and Viewer**. The Participant role introduces scoped, assignment-based edit access — a user who can view and comment on everything but can only edit content they are specifically assigned to (questions or proposal sections).

---

## 3. Goals

### User Goals

- Single invite gives access to both questions workspace and proposal — no duplicate sharing.
    
- Clear role boundaries: users know exactly what they can and cannot do.
    
- Scoped edit access via Participant role allows focused contribution without risk of unintended edits elsewhere.
    
- Viewers can contribute feedback (comments) without edit risk.
    

### Business Goals

- Increase per-project collaborator count by enabling low-friction Viewer invites to stakeholders (legal, finance, leadership).
    
- Drive platform stickiness by making the proposal a first-class collaborative artifact inside SparrowGenie.
    
- Unify permission model before external sharing ships, preventing a later refactor.
    
- Enable scoped assignment model (Participant) to support future per-section granularity (P 2).
    

---

## 4. Non-Goals

|   |   |
|---|---|
|Non-Goal|Why Out of Scope|
|External (client-facing) proposal sharing|Separate initiative; this PRD covers internal collaboration only.|
|Granular per-section proposal permissions|v 2 scope; single Participant role covers assigned sections. Full per-section ACL is P 2.|
|Proposal version history / diff|Planned as a follow-up feature.|
|Pure read-only role (no comments)|Intentionally merged into Viewer. Not required for current use cases.|

---

## 5. Role Model

### 5.1 Role Hierarchy

|   |   |   |
|---|---|---|
|Role|Description|Scope|
|**Owner**|Full control over project, questions, proposal, collaborators, and settings.|Global — all content|
|**Editor**|Edit all questions and proposal sections. Comment, export, manage collaborators (with restrictions).|Global — all content|
|**Participant**|View and comment on everything. Edit only content specifically assigned to them (questions and/or proposal sections).|Scoped — assigned content only for edits|
|**Viewer**|View and comment on the entire project. No edit access.|Global — read + comment only|

### 5.2 Participant Role — Deep Dive

The Participant role is the key addition in v 2. Unlike other roles, a Participant's edit permissions are _**scoped to their assignments**_. They can view and comment on the entire project, but can only edit questions or proposal sections explicitly assigned to them.

#### 5.2.1 Auto-Promotion: Viewer → Participant

When an Owner or Editor assigns a question or proposal section to a user who currently has the Viewer role, the system auto-promotes that user to Participant.

|   |   |
|---|---|
|Rule|Detail|
|**Trigger**|Owner or Editor assigns a question or proposal section to a Viewer.|
|**Confirmation**|A confirmation dialog is shown to the assigner: "This user is currently a Viewer. Assigning them will promote them to Participant, giving them edit access on this item. Continue?"|
|**Who can trigger**|Both Owner and Editor can trigger auto-promotion via assignment.|
|**Notification to promoted user**|Silent. No notification is sent to the promoted user.|
|**Audit trail**|The activity log records: "[Assigner name] assigned [Question/Section] to [User], promoting them from Viewer to Participant."|
|**System permission check**|If the Viewer lacks the required system-level permission ("Participate in Projects"), the assignment fails with a caution message: "This user does not have the required system-level access."|

#### 5.2.2 Demotion Rules

Demotion from Participant to Viewer is blocked while the user has any active assignments (questions or proposal sections). The Viewer option in the role dropdown will be greyed out.

|   |   |
|---|---|
|Rule|Detail|
|**Demotion blocked condition**|Participant has one or more assignments (questions and/or proposal sections).|
|**UI treatment**|Viewer option in role dropdown is greyed out with tooltip: "Assigned to [X] question(s) and [Y] proposal section(s). Reassign to another user to demote."|
|**Tooltip specificity**|Must show both assignment types (questions AND proposal sections) with counts.|
|**Zero assignments**|A Participant with zero assignments stays as Participant. No auto-demotion. Manual demotion to Viewer is allowed.|
|**Work state irrelevant**|Demotion is blocked regardless of whether assigned work is in-progress, draft, or any other state.|
|**Force demote**|Not supported. Owner/Editor must reassign all items to another user before demoting.|
|**Editor → Participant demotion**|If an Editor is assigned to specific questions and is demoted, they become a Participant. All other (unassigned) edit access is stripped. Only their assigned items remain editable.|

#### 5.2.3 Removal Rules

Removing a Participant (or any user with active assignments) from a project is blocked until their assignments are reassigned.

|   |   |
|---|---|
|Rule|Detail|
|**Removal blocked condition**|User has one or more assignments (questions and/or proposal sections).|
|**UI treatment**|Remove button triggers a prompt: "This user is assigned to [X] question(s) and [Y] proposal section(s). Reassign these to another user before removing."|
|**Cascade behavior**|No automatic unassignment. Owner/Editor must explicitly reassign all items.|

---

## 6. User Stories

|   |   |   |   |   |
|---|---|---|---|---|
|#|User Type|I want to…|So that…|Priority|
|US-1|Project Owner|Invite a user once and have them access both questions and proposal|I don't manage two separate share lists|P 0|
|US-2|Viewer|View and comment on both the proposal and questions without editing|I can flag issues without accidentally changing anything|P 0|
|US-3|Editor|Edit proposal content/layout, add/remove sections, and export|I can build and finalize the proposal document|P 0|
|US-4|Owner/Editor|Publish/share the proposal externally|The finalized proposal reaches the client|P 0|
|US-5|Participant|Edit only the questions and proposal sections assigned to me|I contribute focused work without affecting other content|P 0|
|US-6|Owner/Editor|Assign a Viewer to a question and have them auto-promoted|I can onboard contributors without manual role changes|P 0|
|US-7|Any user with Create permission|Create a standalone proposal not linked to an RFP|I can build proposals from scratch for non-RFP deals|P 0|
|US-8|Owner|See which Participants are assigned to what|I know who is responsible for which content|P 1|

---

## 7. Requirements

### 7.1 Must-Have (P 0) — Role Rename

|   |   |   |
|---|---|---|
|#|Requirement|Acceptance Criteria|
|P 0.1|Rename project-level roles: Owner (unchanged), Manager → Editor, Watcher → Participant (new behavior), Viewer → Viewer|All UI surfaces (share modal, collaborator list, activity log) display new role names. Old names do not appear.|
|P 0.2|Migrate all existing role assignments: Manager → Editor, Participant → Editor (preserve edit rights), Watcher → Viewer|No user loses capabilities. Existing Participants become Editors. Migration is verified against production data.|

### 7.2 Must-Have (P 0) — Participant Role

|   |   |   |
|---|---|---|
|#|Requirement|Acceptance Criteria|
|P 0.3|Participant can view the entire project (all questions + proposal)|All questions, proposal content, activities tab, and knowledge sources are visible in read-only mode.|
|P 0.4|Participant can add comments/discussions on questions AND proposal|Comment/discussion areas are active on all questions and all proposal sections.|
|P 0.5|Participant can edit only assigned questions and assigned proposal sections|Edit controls are enabled only on assigned items. All other items show disabled controls with tooltip: "You need to be assigned to edit this."|
|P 0.6|Participant is blocked from non-assigned edit actions|Attempting to: edit unassigned answers, run Genie AI on unassigned questions, review unassigned questions, reassign, bulk actions on unassigned items, export, or edit project metadata — shows tooltip: "You need Editor or higher access."|
|P 0.7|Participant can be a reviewer on assigned questions|Participant can review questions assigned to them. Review of unassigned questions is blocked.|
|P 0.8|Auto-promotion: assigning a Viewer auto-promotes to Participant with confirmation|Confirmation dialog shown to assigner. On confirm, Viewer role changes to Participant. Activity log records the promotion.|
|P 0.9|Demotion blocking: Participant with assignments cannot be demoted to Viewer|Viewer option is greyed out in dropdown with tooltip showing assignment counts (questions + sections).|
|P 0.10|Removal blocking: user with assignments cannot be removed from project|Remove action shows prompt with assignment counts. Removal is blocked until all assignments are reassigned.|
|P 0.11|Participant requires minimum "Participate in Projects" system-level permission|If user lacks this permission, assignment fails with caution: "This user does not have the required system-level access."|

### 7.3 Must-Have (P 0) — Viewer Role

|   |   |   |
|---|---|---|
|#|Requirement|Acceptance Criteria|
|P 0.12|Viewer can view the entire project (all questions + proposal)|All content is visible in read-only mode.|
|P 0.13|Viewer can add comments/discussions on questions AND proposal|Comment/discussion areas are active.|
|P 0.14|Viewer is blocked from all edit actions|All edit controls are disabled with tooltip: "You need Editor or higher access."|

### 7.4 Must-Have (P 0) — Unified Share

|   |   |   |
|---|---|---|
|#|Requirement|Acceptance Criteria|
|P 0.15|Single share modal covers both questions workspace and proposal|Inviting a user with a role grants access to both artifacts. No separate sharing needed.|
|P 0.16|Role assignment in share modal offers: Owner, Editor, Participant, Viewer|Exactly four options appear in order. Each has a descriptive tooltip.|
|P 0.17|Existing collaborator role can be changed from the share modal|Role change takes effect within 2 s across all active sessions. Demotion rules (7.2) apply.|

### 7.5 Must-Have (P 0) — Proposal Permissions by Role

|   |   |   |
|---|---|---|
|#|Requirement|Acceptance Criteria|
|P 0.18|Owner and Editor can: edit proposal content/layout, add/remove sections, comment, export/download|All editing, section management, commenting, and export controls are enabled.|
|P 0.19|Only Owner and Editor can publish/share proposal externally|Publish/Share Externally button is hidden or disabled for Participant and Viewer.|
|P 0.20|Participant can edit only assigned proposal sections; comment on all sections|Edit controls active only on assigned sections. Comment active everywhere.|
|P 0.21|Viewer can view and comment on proposal but cannot edit|No edit controls visible. Comment interface is active.|

### 7.6 Nice-to-Have (P 1)

|   |   |   |
|---|---|---|
|#|Requirement|Acceptance Criteria|
|P 1.1|Activity log distinguishes comment-only actions from edit actions with role context|Log entries show user's role alongside the action.|
|P 1.2|Notification when a Participant's or Viewer's feedback is addressed or resolved|Commenter receives a notification when their comment is resolved.|
|P 1.3|Assignment counts visible in project health / collaborator summary|Participant assignment counts (questions + sections) surfaced for Owner visibility.|

### 7.7 Future Considerations (P 2)

- P 2.1 — Per-section proposal permissions (e.g., Editor on pricing section only). Current Participant model should not block this.
    
- P 2.2 — Proposal version history with diff view and role-based restore rights.
    
- P 2.3 — External (client-facing) proposal sharing with separate permission layer.
    

---

## 8. Role-Action Matrix

### 8.1 Questions Workspace Actions

|   |   |   |   |   |
|---|---|---|---|---|
|Action|Owner|Editor|Participant|Viewer|
|View project (all questions)|✓|✓|✓|✓|
|View activities tab|✓|✓|✓|✓|
|Comment in discussions|✓|✓|✓|✓|
|View Knowledge Sources|✓|✓|✓|✓|
|Write / Edit assigned answer|✓|✓|✓|—|
|Write / Edit unassigned answer|✓|✓|—|—|
|Run Genie on assigned question(s)|✓|✓|✓|—|
|Run Genie on unassigned question(s)|✓|✓|—|—|
|Review assigned question|✓|✓|✓|—|
|Review unassigned question|✓|✓|—|—|
|Reopen reviewed question (assigned)|✓|✓|✓|—|
|Change status (assigned questions)|✓|✓|✓|—|
|Bulk actions (assigned only)|✓|✓|✓|—|
|Reassign questions|✓|✓|—|—|
|Edit project metadata|✓|✓|—|—|
|Remove collaborator|✓|✓|—|—|
|Assign Author / Reviewer|✓|✓|—|—|
|Export project|✓|✓|✓|✓|
|Contextual Mapping / Instructions /|✓|✓|—|—|
|Delete project|✓|Conditional*|—|—|
|Demote Editor → Viewer|✓|—|—|—|

- Editor delete is conditional on global system policy + project-level settings.
    

### 8.2 Proposal Actions

|   |   |   |   |   |
|---|---|---|---|---|
|Action|Owner|Editor|Participant|Viewer|
|View proposal|✓|✓|✓|✓|
|Comment on proposal (all sections)|✓|✓|✓|✓|
|Edit assigned proposal sections(whole doc)|✓|✓|✓|—|
|Edit unassigned proposal sections|✓|✓|—|—|
|Add / remove proposal sections|✓|✓|—|—|
|Export / download proposal|✓|✓|✓|✓|
|Publish / share proposal externally|✓|✓|✓|✓|
|Assignment of Assigned sections|✓|✓|✓|—|
|Assignment of unassigned sections|✓|✓|—|—|

---

## 9. Global Permission → Project Role Mapping

|   |   |   |
|---|---|---|
|Project Role|Min System-Level Permission|Change from v 1|
|Owner|Create (Own) + Manage (Own)|No change|
|Editor|Participate in Projects|Renamed from Manager|
|Participant|Participate in Projects|New role|
|Viewer|Participate in Projects|Renamed from Watcher; gains comment access|

All checkbox behavior rules from v 1 (cascading logic, auto-check/uncheck, dependency hierarchy) remain unchanged.

---

## 10. Edge Cases & Resolved Decisions

The following edge cases were identified during design review and have been resolved:

|   |   |   |   |
|---|---|---|---|
|#|Edge Case|Decision|Risk|
|EC-1|Auto-promotion confirmation|Show confirmation dialog to the assigner (Owner or Editor). Both can trigger.|Low|
|EC-2|Editor overrides Owner's intentional Viewer restriction via assignment|Accepted. Both Owner and Editor can assign and trigger promotion.|Medium|
|EC-3|Promoted user notification|Silent. No notification sent to the promoted user.|Low|
|EC-4|Audit trail for implicit role changes|Activity log records who made the assignment that triggered promotion.|Low|
|EC-5|Force-demote for urgent access revocation|Not supported. Must reassign all items first.|Medium|
|EC-6|In-progress work on demotion|Demotion is blocked regardless of work state as long as assignments exist.|Low|
|EC-7|Zero-assignment Participant (ghost state)|User stays as Participant. No auto-demotion.|Low|
|EC-8|Editor → Participant demotion with assignments|Editor becomes Participant; unassigned edit access is stripped. Only assigned items remain editable.|Medium|
|EC-9|Participant visibility scope|Participant sees the entire project. View + comment on everything. Edit only assigned items.|Low|
|EC-10|Bulk actions removing Participant's assignments|Access is silently removed. No special warning for bulk operations.|Medium|
|EC-11|Proposal section structural changes|Not a concern for v 2. Section assignment is handled by Owner/Editor in proposal editor.|Low|
|EC-12|Tooltip for demotion blocking|Must show both assignment types: "Assigned to X question(s) and Y section(s)."|Low|
|EC-13|Loss of pure read-only role|Intentional. Viewer includes comment access. No separate read-only role.|Low|
|EC-14|System-level permission conflict on auto-promotion|Assignment fails with caution message if user lacks required permission.|Low|
|EC-15|Concurrent auto-promotion race condition|Last write wins. System uses idempotent promotion check.|Low|
|EC-16|Removing user with active assignments|Blocked. Prompt shows assignment counts. Owner/Editor must reassign before removing.|Low|

---

## 11. User Flows

### Flow 1: Invite Collaborator (Unified Share)

**Entry point:** Owner/Editor clicks "Share" button on project header. **Exit point:** Collaborator receives invite and sees project + proposal.

1. Owner/Editor opens the Share modal from project header.
    
2. Types user name or email in the search field.
    
3. Selects a role from dropdown: Owner / Editor / Participant / Viewer.
    
4. System validates: (a) target user has minimum system-level permission for the selected role, (b) inviter has invite rights (global + project settings).
    
5. If validation passes → user is added to collaborator list with the selected role. Both questions workspace and proposal access are granted.
    
6. If validation fails → tooltip explains the reason (e.g., "User does not have Manage permission required for Editor role").
    
7. Invited user receives notification and can open the project immediately.
    

> **Error branch:** If the inviter's own session has stale permissions (e.g., they were downgraded), the system revalidates on submit and shows "Your permissions have changed. Please refresh."

### Flow 2: Assign Question to Viewer (Auto-Promotion)

**Entry point:** Owner/Editor assigns a question to a Viewer. **Exit point:** Viewer is promoted to Participant with edit access on assigned item.

1. Owner/Editor selects a question and opens the assignment dropdown.
    
2. Selects a user who currently has Viewer role.
    
3. System shows confirmation: "This user is currently a Viewer. Assigning them will promote them to Participant, giving them edit access on this item. Continue?"
    
4. On confirm → User's role changes to Participant. Assignment is created. Activity log records: "[Assigner] assigned [Question] to [User], promoting them from Viewer to Participant."
    
5. On cancel → No changes made.
    
6. If user lacks system-level permission → Assignment fails with caution: "This user does not have the required system-level access."
    

### Flow 3: Demote Participant

**Entry point:** Owner opens collaborator list and wants to change Participant to Viewer.

1. Owner opens the collaborator list / share modal.
    
2. Clicks the role dropdown next to the Participant's name.
    
3. If Participant has active assignments → Viewer option is greyed out with tooltip: "Assigned to [X] question(s) and [Y] proposal section(s). Reassign to another user to demote."
    
4. Owner navigates to the assigned questions/sections and reassigns them to another user.
    
5. Returns to collaborator list. Viewer option is now available.
    
6. Selects Viewer. Role change takes effect immediately.
    

### Flow 4: Create Standalone Proposal

**Entry point:** User with Create permission clicks "New Proposal" (outside an RFP project). **Exit point:** Blank proposal created, user is Owner.

1. User clicks "New Proposal" from dashboard or proposals list.
    
2. System checks Create system-level permission.
    
3. If permitted → blank proposal editor opens. User is auto-assigned as Owner.
    
4. User can share via the same share modal (Owner / Editor / Participant / Viewer).
    
5. If not permitted → tooltip: "Insufficient permission to create project."
    

---

## 12. Screens & Components

### Screen 1: Updated Share Modal

|   |   |
|---|---|
|Field|Details|
|**Design ticket**|[SG]-XXX — Updated Share Modal with Participant role|
|**Purpose**|Unified invite flow for project + proposal collaboration|
|**Entry from**|"Share" button on project header (accessible by Owner and Editor)|
|**Key elements**|User search input, role dropdown (Owner / Editor / Participant / Viewer), existing collaborator list with role badges, remove button, role change dropdown per user, demotion-blocked state for Participants with assignments|
|**States**|Empty (no collaborators), Populated, Validation error (inline), Permission mismatch warning, Demotion blocked (greyed Viewer option)|
|**User stories**|US-1, US-5, US-6|

**Screen 1 — Copy:**

|   |   |   |
|---|---|---|
|Location|Text|Notes|
|Modal title|"Share Project"||
|Role dropdown hint|"Select access level"||
|Validation error|"User does not have the required system permissions for this role."|Inline below search|
|Viewer tooltip|"Can view and comment on questions and proposal. Cannot edit."|On hover over role badge|
|Participant tooltip|"Can view and comment on everything. Can edit assigned questions and proposal sections."|On hover over role badge|
|Demotion blocked tooltip|"Assigned to [X] question(s) and [Y] section(s). Reassign to another user to demote."|On greyed Viewer option|
|Auto-promotion confirm|"This user is currently a Viewer. Assigning them will promote them to Participant. Continue?"|Dialog on assignment|

### Screen 2: Proposal View (Role-Gated)

|   |   |
|---|---|
|Field|Details|
|**Design ticket**|[SG]-XXX — Proposal View with role-gated states|
|**Purpose**|Display proposal with controls gated by project role and assignment|
|**Entry from**|Project navigation tab ("Proposal")|
|**Key elements**|Proposal content area, section list, comment thread, edit toolbar (gated), export button (gated), publish button (gated), assignment indicators per section|
|**States**|Empty (no proposal yet), Editable (Owner/Editor), Scoped Edit (Participant — assigned sections editable, others read-only), View + Comment (Viewer)|
|**User stories**|US-2, US-3, US-4, US-5|

**Screen 2 — Copy:**

|   |   |   |
|---|---|---|
|Location|Text|Notes|
|Empty state|"No proposal yet. Click 'Create Proposal' to get started."|Owner/Editor see CTA button|
|Participant banner|"You have comment access on all sections. You can edit sections assigned to you."|Subtle info banner at top|
|Viewer banner|"You have view and comment access."|Subtle info banner at top|
|Disabled edit tooltip|"You need to be assigned to edit this section."|Participant on unassigned section|
|Disabled export tooltip|"You need Editor or higher access to export."|Participant/Viewer on export button|

### New / Modified Components

|                               |                                                 |                                                 |                                         |
| ----------------------------- | ----------------------------------------------- | ----------------------------------------------- | --------------------------------------- |
| Component                     | States                                          | New / Existing?                                 | Used On                                 |
| Role Badge                    | Owner, Editor, Participant, Viewer              | Modified (new labels)                           | Share Modal, Collaborator List          |
| Role Dropdown                 | 4 options with tooltips + greyed demotion state | Modified (Participant added, demotion blocking) | Share Modal                             |
| Permission Info Banner        | Participant, Viewer                             | New                                             | Proposal View, Questions Workspace      |
| Assignment Indicator          | Assigned / Unassigned per section               | New                                             | Proposal View                           |
| Auto-Promotion Confirm Dialog | Confirm / Cancel                                | New                                             | Question Assignment, Section Assignment |
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