#new_feature/obligations/v1

[PRD Doc](https://docs.google.com/document/d/1uRluyS83yWG59VunxS0HNHFKeb4myP6AUXIhpoVBfkY/edit?usp=sharing)
## Overview

The Obligations module allows sales teams to track commitments made during an RFP or proposal inside SparrowGenie.

An obligation represents a commitment tied to a specific project.  
Examples include sharing documents, delivering revisions, confirming feasibility, or providing approvals.

This module ensures commitments are visible, trackable, and accountable within the same system that manages proposal execution.

---

## Problem Statement

Sales teams make explicit commitments during proposal cycles.

Today, SparrowGenie does not provide structured tracking for these commitments at the project level.

As a result:

- Users maintain external trackers (Excel, Slack, task boards)    
- Commitments are fragmented
- Ownership becomes unclear  
- Deadlines are missed
- Delivery risk increases

The system manages proposal content, but not the commitments made around that content.

This creates accountability gaps during critical deal stages.

---

## Target Users

### Primary Users

- Project Owner
- Project Manager

### Out of Scope (V1)

- Watcher (structural editing)

Watcher will have discussion-only access.

---

## Scope

### Included in V1

**Core Structure**

- Obligations tab inside each Project
- Table-based layout
- Create new obligation row
- Obligation Title is mandatory to create a row
- Drag and drop rows
- Drag and drop columns
- Filter (right-side panel)
- Group by (visual grouping only)

**Data Fields (Editable by Owner/Manager)**

- Obligation Title
	- is required to create a row 
- Status
	- Drop downs 
		- Open 
		- In Progress
		- Delivered 
		- Overdue
	- Once created default should be open 
- Assignee
	- User only from inside sparrowGenie should be listed down 
	- If user assigned who is outside of project shared list added [[Project Watcher]]
	- If removed the user as watcher it should be prompted with the modal , and reassign that user 
- Questions 
	- attach one or more project questions
	- Only question number
- Due date
	- Calendar 
- Type
	- Drop downs
		- legal 
		- Product 
		- Security
		- Feature
	- **Can edit the Dropdown**
	- **Can set the color from the color palette** 


**Details Pane**

- Opens from left on row click
- Full obligation details
- Description field
	- Plain text - multiline field 
	- can add text description 
- Comments section
	- Able to comment without any formatting 
	- Able to tag people 
	- Tag list should show all the people from the System user list
	- If the user doesn't have access to project , user will be prompted with modal for share access
		- User can either ignore or can share and notify ([[Email Notifications]]
		- ) the tagged user (can be taken from the project comment interaction)
	  ![[Screenshot 2026-02-17 at 5.30.06 PM.png]]
	- Able to edit and delete the comment 

- Activity log
	- Log the Events which the Obligations are tracking 

---

### Explicit Non-Goals (V1)

- AI-based summarization
- Custom field builder
- Dashboard-level rollups
- Stage-based automation

---

## Experience

### Primary User Flow

1. User enters Project
2. Clicks Obligations tab
3. Clicks “Add Obligation”
4. Enters mandatory Title
5. Row is created
6. User can:
    - 
    -  Attach related questions
    - Assign user
    -  Set Status
    - Set Due Date
    - Open details pane
    - Add description
    - Add comments
    - Tag project members

---

### Key Interaction Principles

- No title → No row creation
- Questions column supports multiple attachments
- Drag and drop changes order visually
- Grouping is visual only (does not change data structure)
- All structural edits generate activity logs
- Details pane accessible from any row

---

### Critical Edge Cases

- If user has no edit permission → read-only mode
- If project is deleted → all obligations deleted
- If attached question is deleted → obligation keeps reference marked “Unavailable”
- If tagged user removed from project → historical mention remains
- If owner removed from project → reassignment required before removal

---

## Implementation Details

### Data Behavior and Persistence

- Obligation belongs to exactly one project
- One project can have multiple obligations
- Questions support many-to-many mapping
- Title cannot be empty
- Activity logs are immutable
- Reordering does not change obligation ID


---

## Role-Based Permissions

| Role    | Create | Edit | Comment | Tag | Delete |
| ------- | ------ | ---- | ------- | --- | ------ |
| Owner   | Yes    | Yes  | Yes     | Yes | Yes    |
| Manager | Yes    | Yes  | Yes     | Yes | Yes    |
| Watcher | No     | No   | Yes     | Yes | No     |

---

### Permission Rules

**Owner**

- Full control
- Can create, modify, delete, reorder, assign

**Manager**

- Same structural control as Owner

**Watcher**

- Can view obligations
- Can open details pane
- Can comment
- Can tag project members
- Cannot modify structure or state

---

## Activity Logging

The following actions must be logged:

- Obligation created
	- Obligation created by {user_name}
- Title edited
	-  {user_name} updated the {field_name} (show the diff)
- Assignee changed
	- {user_name} reassigned the obligation to {new_assignee_name}
- Due date changed
	- {user_name} updated the due date to dd/mm/yyyy
- Status changed
	-  {user_name} updated the status {intial_status} to {traget_status}
- Question attached/detached
	-  {user_name} updated the {field_name} from {inital_questions} to {final_info}
- Comment added
	- {user_name} commented "{comment}"


Activity logs are chronological and immutable.




---

## Key Questions Post-Launch

- Are users replacing external trackers?
- Are late-stage deals using obligations more?
- Does obligation usage correlate with faster deal closure?

---

## Key Assumptions

- Sales teams want native commitment tracking
- Owners will maintain obligations if workflow is simple
- Linking obligations to questions increases context clarity

---

## Open Questions

- Should overdue obligations surface in dashboard?
- Should stage-based rules enforce obligation creation?
- Should AI detect commitments in proposal answers?
	- Can be v2 
- Should notifications trigger on tagging (needs decision)?
- Can obligation be other modules?
	- if yes do we need to bring it global 
---

## Dependencies

- Project permission system
- Project comments framework
- Activity logging framework
- Question entity mapping
- Drag-and-drop UI infrastructure