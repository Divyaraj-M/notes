---
related:
  - "[[Competitors Info]]"
  - "[[Context info - PRD]]"
  - "[[Company Info]]"
  - "[[Context Info]]"
  - "[[Table view for question card PRD]]"
  - "[[7 - Competitors]]"
  - "[[a-generative-AI-prompt-builder-for-product-professionals]]"
  - "[[EN-Competitors]]"
  - "[[RFP to Proposal]]"
  - "[[Zoom]]"
  - "[[Custom Agent builderv1]]"
  - "[[Final PRD -Rich Text Editor for Project Response Area]]"
  - "[[Product Spec - Template]]"
  - "[[Demo]]"
  - "[[Competitor Template]]"
---
#new_feature/conext_info/Competitor_info

![[Context Info]]


## Overview

This feature allows project owners and managers to define and manage competitors inside a project context.

It gives SMEs structured, factual information about competitors so they can tailor responses better, faster, and more accurately.

The goal is simple:

- Improve response quality
    
- Reduce SME back-and-forth
    
- Increase  deal velocity
    

---

## Objectives

1. Provide structured competitor intelligence inside each project
    
2. Allow fast inline editing without heavy workflow friction
    
3. Maintain factual accuracy (no AI hallucination)
    
4. Enable structured summarization for quick scanning
    

---

## Problem Statement

Sales teams respond to multiple RFPs and proposals.

Each deal may involve different competitors.

Today:

- Competitor knowledge lives in heads, Slack, or scattered docs
- SMEs don’t know how a competitor positions itself
- Responses are generic instead of competitive

Result:

- Slower drafting
- Lower response sharpness
- Inconsistent positioning

This module creates structured competitor context inside the project itself.

---

## Target Users

Primary:

- Project Owner
- Project Manager

Secondary:

- SMEs contributing answers

---

## Scope (MVP)

### Must Have

- Table-based competitor view inside Project Context
- Default columns:
    - Competitor (required)
    - Added By (auto-filled, editable)
- Inline editing (double-click)
    
- Add row via:
    
    - “Add Competitor” button (adds row at top)
    - Bottom trigger row (adds new row at bottom)
- Auto-fetch logo + domain from logo.dev when competitor name entered
- Competitor name required before adding next row
- Editable columns except:
    - Competitor title (non-editable after creation)
- User can:
    - Edit all non-locked cells inline
    - Add custom columns
- Limits:
    - Max 10 columns (including default)
    - Max 25 rows
- AI Summarize per column (strict 2-bullet rule)
- Ability to drag and drop the column and make it persistent
---



---

### Non Goals

- No AI enrichment beyond existing text
- No automated competitive analysis
- No interpretation or scoring
- No cross-project syncing (MVP)

---

## Experience

### Table Structure

| Competitor | Custom Columns… | Added By |

- Competitor column:
    - Required
    - Auto-fetch logo + domain
- Added By:
    - Default to current user
    - Editable
- Other columns:
    
    - Fully editable
    - User-defined names
- Default columns to be created 
	- Why they matter
	- Known Strengths
	- Known Gaps/Risks

---

### Adding a Competitor

Trigger options:

1. “Add Competitor” button → adds row at top
2. Bottom row trigger → adds row at bottom

Rules:

- Cannot create new row unless previous competitor name is filled
- Max 25 rows enforced
- Error message if limit reached

---

### Adding Columns

- User can add new column
- Max total columns: 10 (including defaults)
- Columns editable except Competitor
- Column header required
- If limit reached → disable Add Column

---

### Inline Editing

- Double-click to edit cell
- Press Enter to save
- Escape cancels edit
- Auto-save on when clicking out of focus 

No modal. No separate edit view.

---

## AI Summarization Logic

### Behavior

User can trigger “Summarize” per competitor row.

System will:

- Use only text in existing columns
- Summarize into exactly 2 bullet points

### Strict Constraints

Summarize must:

- Use only existing text
- Preserve factual accuracy
- Not fabricate numbers
- Not infer importance
- Not add interpretation
- Not mention missing data
- Always return exactly 2 bullets

---

### Output Rules

If multiple facts exist:

Return 2 concise bullets.

If only one fact exists:

Bullet 1 → That fact  
Bullet 2 → “No additional factual data available.”


Never leave blank.

---

### Example

Output:

• Publicly traded SaaS company providing cloud-based cybersecurity solutions to enterprise customers.  
• Reported $2.1B revenue in 2024.



---

## Implementation Details

### Data Behavior

- Competitor data is project-scoped
- Auto-save on edit
- Logo + domain fetched once at creation
- Deleting competitor removes entire row
- Column deletion removes data under it (with confirmation)

---

### Role-Based Permissions

Owner:

- Full edit access
- Add/delete rows
- Add/delete columns

Project Manager:

- Full edit access
- Add/delete rows
- Add/delete columns

Watcher:

- View only 


---

### System Constraints

- Column limit: 10 total
- Row limit: 25
- Competitor name required before adding new row
- Competitor column locked after save
- Added By editable
- Logo fetched from logo.dev using competitor domain or inferred domain

---

## Edge Cases

- Duplicate competitor names → allowed (MVP) or block? (Needs decision)
- User deletes default column? → Not allowed for Competitor or Added By
- User renames column after AI summary → summary not auto-updated
## Error Messages 
###  Row Limit Reached (Max 25 Competitors)

**Trigger:**  
User tries to add the 26th competitor.

**Error Message:**

> You’ve reached the limit

**Behavior:**

- Add button disabled
- Bottom row trigger disabled
- Tooltip on disabled button:
    
    > Limit reached 
    

---

## Column Limit Reached (Max 10 Columns Total)

**Trigger:**  
User tries to add the 11th column.

**Error Message:**

>  You’ve reached the limit


**Behavior:**

- “Add Column” button disabled
- Tooltip:

> Column limit reached 

---

##  Competitor Name Missing (Required Field)

**Trigger:**  
User tries to:

- Add another row while current row’s competitor name is empty
    
- Click outside without entering name
    

**Error Message (inline under cell):**

> Competitor name is required to create a new entry.

**Behavior:**

- Focus returns to competitor cell
    
- Row not created
    

---

## Attempt to Edit Locked Competitor Name

**Trigger:**  
User double-clicks competitor name after save.

**Message (tooltip):**

> Competitor name cannot be edited after creation.

No modal. Just tooltip.

---

## Attempt to Delete Required Columns

If user tries to delete:

- Competitor column
    
- Added By column
    

**Error Message:**

> This column is required and cannot be deleted.

---

## Impact Areas

- Project Context
- AI Summarization Engine
- Storage schema (dynamic columns)
- UI performance (max 25 x 10 grid)

---

## Investigative Metrics

### Early Signals

- % of projects using competitor table
- Avg competitors per project
- % using AI summarize
- Time from project creation → first competitor added

---

### Confusion Signals

- Row creation failures
- Column limit hit rate
- Logo fetch failures
- Inline edit cancellation rate

---

### Key Questions

- Does competitor context correlate with higher win rate?
- Does it reduce SME clarification cycles?
- Does it improve response quality perction?
    

---

## Key Assumptions

- Competitive context improves response sharpness
- Sales teams are willing to manually enter competitor info
- 25 rows and 10 columns are sufficient for 95% of projects


---

## Dependencies

- logo.dev integration
- Grid-based dynamic table component
- AI summarization service
- Backend schema for dynamic columns