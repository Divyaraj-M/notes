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
- Status
	- Open 
	- In Progress
	- Delivered 
	- Overdue
- Assignee
	- User only from inside sparrowGenie should be listed down 
	- If user assigned who is outside of project shared list added [[Project Watcher]]
	- If 
- Questions (attach one or more project questions)
- Due date
- 
- Type
- 

**Details Pane**

- Opens from left on row click
    
- Full obligation details
    
- Description field
    
- Comments section
    
- Activity log
    

**Collaboration**

- Tagging allowed only for users already added to the project
    
- Activity logging for all actions
    

---

### Explicit Non-Goals (V1)

- AI-based summarization
    
- Auto-detection of commitments
    
- Tamper-proof dropdown locking
    
- Custom field builder
    
- Watcher structural editing
    
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
    
    - Assign Owner
        
    - Set Due Date
        
    - Set Status
        
    - Attach related questions
        
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
    
- Grouping is purely visual
    

---

## Role-Based Permissions

|Role|Create|Edit|Comment|Tag|Delete|
|---|---|---|---|---|---|
|Owner|Yes|Yes|Yes|Yes|Yes|
|Manager|Yes|Yes|Yes|Yes|Yes|
|Watcher|No|No|Yes|Yes|No|

---

### Permission Rules

**Owner**

- Full control
    
- Can create, modify, delete, reorder, assign
    

**Manager**

- Same structural control as Owner in V1
    

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
    
- Title edited
    
- Owner changed
    
- Due date changed
    
- Status changed
    
- Question attached/detached
    
- Comment added
    
- Tag added
    
- Obligation deleted
    

Activity logs are chronological and immutable.

---

## Launch Plan

### Rollout Approach

- Beta release to selected high-RFP-volume accounts
    
- Phased rollout
    
- Full release after feedback cycle
    

### Target Accounts

- Enterprise sales teams
    
- Accounts actively using Project module
    

### Communication

- In-app announcement
    
- Release notes
    
- Short product walkthrough
    

---

## Investigative Metrics

### Early Adoption Signals

- % of active projects with ≥1 obligation
    
- Average obligations per project
    
- % obligations with due date
    
- % obligations assigned to owner
    

### Engagement Signals

- Comment-to-obligation ratio
    
- % obligations updated at least once
    
- Reorder usage frequency
    

### Risk Signals

- High creation but low updates
    
- High deletion within 24 hours
    
- Obligations without owner or due date
    

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
    
- Should AI detect commitments in proposal answers (V2)?
    
- Should notifications trigger on tagging (needs decision)?
    

---

## Dependencies

- Project permission system
    
- Project comments framework
    
- Activity logging framework
    
- Question entity mapping
    
- Drag-and-drop UI infrastructure