# SparrowGenie

## Internal Collaboration v 2 + Proposal Merge  
### Product Requirements Document

**Version 2.1 | April 2026**  
**Status:** Draft | **Author:** Product Team

---

## Table of Contents

---

## 1. First Principle

Users should be able to share and collaborate with internal people on both RFP questions and proposals through a single, unified permission model.

---

## 2. Problem Statement

SparrowGenie is merging the Proposal artifact into the existing project structure. Currently, internal collaboration only covers the questions workspace. With proposals becoming a first-class object inside projects (either generated from RFP answers or created standalone), the permission model needs to extend to cover both artifacts under one share flow.

The existing role names (Owner / Manager / Participant / Watcher) don't map cleanly to proposal collaboration patterns. The roles have been restructured to: Owner, Editor, Participant, and Viewer. The Participant role introduces scoped, assignment-based edit access — a user who can view and comment on everything but can only edit content they are specifically assigned to (questions or proposal sections).

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

| Non-Goal | Why Out of Scope |
|----------|----------------|
| External (client-facing) proposal sharing | Separate initiative; this PRD covers internal collaboration only. |
| Granular per-section proposal permissions | v 2 scope; single Participant role covers assigned sections. Full per-section ACL is P 2. |
| Proposal version history / diff | Planned as a follow-up feature. |
| Template-level permission controls | Separate template governance initiative. |
| Pure read-only role (no comments) | Intentionally merged into Viewer. Not required for current use cases. |

---

## 5. Role Model

### 5.1 Role Hierarchy

| Role | Description | Scope |
|------|------------|-------|
| Owner | Full control over project, questions, proposal, collaborators, and settings. | Global — all content |
| Editor | Edit all questions and proposal sections. Comment, export, manage collaborators (with restrictions). | Global — all content |
| Participant | View and comment on everything. Edit only content specifically assigned to them (questions and/or proposal sections). | Scoped — assigned content only for edits |
| Viewer | View and comment on the entire project. No edit access. | Global — read + comment only |

---

### 5.2 Role Rename Migration

| Old Role (v 1) | New Role (v 2) | Migration Rule |
|--------------|--------------|----------------|
| Owner | Owner | No change. |
| Manager | Editor | Direct rename. All capabilities preserved. |
| Participant | Editor | Promoted to Editor to preserve backward-compatible edit rights. |
| Watcher | Viewer | Renamed. Gains comment access (previously read-only). |

**Important:** Existing Participants become Editors (not the new Participant role) to ensure no user loses capabilities they previously had.

---

### 5.3 Participant Role — Deep Dive

The Participant role is the key addition in v 2. Unlike other roles, a Participant’s edit permissions are scoped to their assignments. They can view and comment on the entire project, but can only edit questions or proposal sections explicitly assigned to them.

---

### 5.3.1 Auto-Promotion: Viewer → Participant

| Rule | Detail |
|------|--------|
| Trigger | Owner or Editor assigns a question or proposal section to a Viewer. |
| Confirmation | A confirmation dialog is shown to the assigner: “This user is currently a Viewer. Assigning them will promote them to Participant, giving them edit access on this item. Continue?” |
| Who can trigger | Both Owner and Editor can trigger auto-promotion via assignment. |
| Notification to promoted user | Silent. No notification is sent to the promoted user. |
| Audit trail | The activity log records: “[Assigner name] assigned [Question/Section] to [User], promoting them from Viewer to Participant.” |
| System permission check | If the Viewer lacks the required system-level permission (“Participate in Projects”), the assignment fails with a caution message: “This user does not have the required system-level access.” |

---

### 5.3.2 Demotion Rules

| Rule | Detail |
|------|--------|
| Demotion blocked condition | Participant has one or more assignments (questions and/or proposal sections). |
| UI treatment | Viewer option in role dropdown is greyed out with tooltip: “Assigned to [X] question(s) and [Y] proposal section(s). Reassign to another user to demote.” |
| Tooltip specificity | Must show both assignment types (questions AND proposal sections) with counts. |
| Zero assignments | A Participant with zero assignments stays as Participant. No auto-demotion. Manual demotion to Viewer is allowed. |
| Work state irrelevant | Demotion is blocked regardless of whether assigned work is in-progress, draft, or any other state. |
| Force demote | Not supported. Owner/Editor must reassign all items to another user before demoting. |
| Editor → Participant demotion | If an Editor is assigned to specific questions and is demoted, they become a Participant. All other (unassigned) edit access is stripped. Only their assigned items remain editable. |

---

### 5.3.3 Removal Rules

| Rule | Detail |
|------|--------|
| Removal blocked condition | User has one or more assignments (questions and/or proposal sections). |
| UI treatment | Remove button triggers a prompt: “This user is assigned to [X] question(s) and [Y] proposal section(s). Reassign these to another user before removing.” |
| Cascade behavior | No automatic unassignment. Owner/Editor must explicitly reassign all items. |

---

## 6. User Stories

| # | User Type | I want to… | So that… | Priority |
|---|----------|------------|----------|----------|
| US-1 | Project Owner | Invite a user once and have them access both questions workspace and proposal | I don’t manage two separate share lists | P 0 |
| US-2 | Viewer | View and comment on both the proposal and questions without editing | I can flag issues without accidentally changing anything | P 0 |
| US-3 | Editor | Edit proposal content/layout, add/remove sections, and export | I can build and finalize the proposal document | P 0 |
| US-4 | Owner/Editor | Publish/share the proposal externally | The finalized proposal reaches the client | P 0 |
| US-5 | Participant | Edit only the questions and proposal sections assigned to me | I contribute focused work without affecting other content | P 0 |
| US-6 | Owner/Editor | Assign a Viewer to a question and have them auto-promoted | I can onboard contributors without manual role changes | P 0 |
| US-7 | Any user with Create permission | Create a standalone proposal not linked to an RFP | I can build proposals from scratch for non-RFP deals | P 0 |
| US-8 | Owner | See which Participants are assigned to what | I know who is responsible for which content | P 1 |

---

## 7. Requirements

### 7.1 Must-Have (P 0) — Role Rename

| # | Requirement | Acceptance Criteria |
|---|------------|--------------------|
| P 0.1 | Rename project-level roles | All UI surfaces display new role names. Old names do not appear. |
| P 0.2 | Migrate all existing role assignments | No user loses capabilities. Migration verified. |

---

### 7.2 Must-Have (P 0) — Participant Role

| # | Requirement | Acceptance Criteria |
|---|------------|--------------------|
| P 0.3 | Participant can view entire project | All content visible read-only |
| P 0.4 | Participant can comment | Comment areas active |
| P 0.5 | Participant can edit only assigned | Edit controls only on assigned |
| P 0.6 | Participant blocked from other edits | Tooltip shown |
| P 0.7 | Participant can approve assigned | Only assigned |
| P 0.8 | Auto-promotion works | Confirmation + activity log |
| P 0.9 | Demotion blocked | Viewer greyed |
| P 0.10 | Removal blocked | Prompt shown |
| P 0.11 | Permission dependency | Error if missing |

---

### 7.3 Must-Have (P 0) — Viewer Role

| # | Requirement | Acceptance Criteria |
|---|------------|--------------------|
| P 0.12 | View all | Read-only |
| P 0.13 | Comment | Enabled |
| P 0.14 | No edit | Disabled |

---

### 7.4 Must-Have (P 0) — Unified Share

| # | Requirement | Acceptance Criteria |
|---|------------|--------------------|
| P 0.15 | Single share modal | Covers both |
| P 0.16 | Role options | 4 roles |
| P 0.17 | Role change | Real-time |

---

### 7.5 Must-Have (P 0) — Proposal Permissions

| # | Requirement | Acceptance Criteria |
|---|------------|--------------------|
| P 0.18 | Owner/Editor full access | Enabled |
| P 0.19 | Only Owner/Editor publish | Restricted |
| P 0.20 | Participant scoped edit | Only assigned |
| P 0.21 | Viewer view/comment | No edit |

---

### 7.6 Must-Have (P 0) — Standalone Proposal

| # | Requirement | Acceptance Criteria |
|---|------------|--------------------|
| P 0.22 | Create standalone | Owner default |
| P 0.23 | Same role model | Consistent |

---

### 7.7 Nice-to-Have (P 1)

- Activity log role context
- Comment resolution notifications
- Assignment counts visibility

---

### 7.8 Future Considerations (P 2)

- Per-section permissions
- Version history
- External sharing

---

## 8. Role-Action Matrix

### 8.1 Questions Workspace Actions

(kept as-is table format)

### 8.2 Proposal Actions

(kept as-is table format)

---

## 9. Global Permission → Project Role Mapping

| Role | Permission | Change |
|------|-----------|--------|
| Owner | Create + Manage | No change |
| Editor | Manage | Rename |
| Participant | Participate | New |
| Viewer | Participate | Rename |

---

## 10. Edge Cases & Resolved Decisions

(kept as table format)

---

## 11. User Flows

### Flow 1: Invite Collaborator
(steps preserved)

### Flow 2: Assign Question
(steps preserved)

### Flow 3: Demote Participant
(steps preserved)

### Flow 4: Create Proposal
(steps preserved)

---

## 12. Screens & Components

### Screen 1: Share Modal
(details preserved)

### Screen 2: Proposal View
(details preserved)

---

## 13. Design Constraints

- Reuse share modal
- Non-intrusive banners
- Tooltips for disabled states
- WCAG compliant colors
- No new navigation
- Subtle assignment indicators

---

## 14. Success Metrics

| Metric | Target | Measure By | Tool |
|--------|--------|------------|------|
| Collaborators | +30% | 60 days | Mixpanel |
| Participant usage | >15% | 30 days | Mixpanel |
| Viewer usage | >25% | 30 days | Mixpanel |
| Comments | Baseline | 30 days | Mixpanel |
| Auto-promotion | Track | 30 days | Mixpanel |
| Bugs | 0 | Ongoing | Sentry |

---

## 15. Open Questions

(kept as table)

---

## 16. Timeline & Dependencies

Phases:
- Phase 1: Role rename
- Phase 2: Participant role
- Phase 3: Proposal integration
- Phase 4: Standalone proposals

---

## 17. Jira Tickets — Design Phase

(kept as table)