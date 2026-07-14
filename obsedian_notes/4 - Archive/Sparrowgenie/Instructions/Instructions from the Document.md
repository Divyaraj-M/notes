---
related:
  - "[[Proposal Conversion Flow]]"
  - "[[First Principle thinking - Table View]]"
  - "[[Context info - PRD]]"
  - "[[RFP training]]"
  - "[[Getting started  with SparrowGenie]]"
  - "[[WYSIWYG editor - First Principle]]"
  - "[[Friction points]]"
  - "[[Mapping]]"
  - "[[Save to QnA PRD]]"
  - "[[RFP to Proposal]]"
  - "[[RFP training PRD]]"
  - "[[Create a project]]"
  - "[[reverse-engineer-ISO29148-to-PRD-prompt-template]]"
  - "[[Final PRD -Rich Text Editor for Project Response Area]]"
  - "[[UAT Arya]]"
---
#new_feature/Instructions/v1/from_prospect
## First Principle

Prospect-defined instructions must not rely on manual copy-paste.

If the RFP document exists inside the project, the system:

- Reads mapped instruction fields
- Extracts structured instruction data
- Renders them in a controlled table format
- Reflects compliance status based on mapping state

SMEs must never depend on manually pasted prospect requirements.

Internal instructions remain editable.

---

# Updated Instruction Model

Instructions come from two controlled layers.

## 1. From Prospect (System-Rendered)

Source: Document mapping fields

- Instructions are identified during document mapping.
- Only fields classified as “Instruction” are included.
- System renders them as a structured table.
- No manual editing allowed.
- Data updates automatically when mapping changes.
- If a mapped instruction field is removed → the corresponding instruction row is immediately removed from the table.
- If all mapped instruction fields are removed → the entire Prospect block does not render.


This is the compliance layer.

---

## 2. For Participants (Team-Defined)

Source: Manual input

- Editable rich text section.
- Used for positioning, win themes, risk notes, approval logic.
- Stored at project level.
- Explicit Save required.

This is the strategy layer.

---

# Problem (Reframed)

Before:

- Prospect instructions were manually pasted.
- Structure varied.
- Compliance items could be missed.
- No enforcement layer existed.

Now:

- Prospect instructions are structured at mapping time.
- Rendering is consistent.
- Controlled by system state.
- Traceable to mapping.
- Automatically updated on mapping changes.

The risk shifts from missed copy-paste to incorrect mapping classification.

---

# Scope

## Must-Have Functionality

---

## 1. From Prospect (Structured Table View)

### Data Source

- Mapping fields from uploaded RFP documents.
- Only fields tagged as “Instruction”.

### Rendering Logic

Instructions render as:

| Field               | Value                      |
| ------------------- | -------------------------- |
| Submission Deadline | 15 March 2026              |
| Mandatory Sections  | Executive Summary, Pricing |
| Page Limit          | 40 pages                   |
| File Format         | PDF only                   |

### Rules

- No inline editing. 
- Empty mapped fields are not rendered.
- If at least one mapped instruction exists → render Prospect block.
- If none exist → show empty state: “No prospect instructions mapped.”
- If a mapped field is deleted → row is removed instantly.
- If all mapped instruction fields are deleted → entire block disappears.

---

## 2. For Participants (Editable Section)

- Rich text editor.
- Explicit Edit mode.
- Save / Cancel.
- Project-level persistence.

---

## 3. Rich Text Editor (Internal Only)

Controls:

- Undo / Redo
- Headings 1–6
- Font sizes (8–72)
- Bold
- Italic
- Underline
- Hyperlink
- Font color
- Alignment (Left / Center / Right)

---

## 4. Save Behavior (Internal Only)

- Save persists content.
- Cancel discards changes.
- Inline error on failure.
- Visible success confirmation.

---

## 5. Summarize with Genie AI (Whole Instructions)

Summarization now reads:

- Prospect (system-rendered table content)
- Internal (editor content)

Behavior:

- Reads entire Instructions tab content.
- Generates exactly two factual bullet points.
- Output not auto-applied.
- Stateless generation.
- Reload icon triggers full re-run.
- If any instruction is added, edited, removed, or remapped → previously generated summary is invalidated.
- Summary must be regenerated manually.
- No memory of previous output.

Strict output rules remain unchanged:

- Exactly two bullets.
- No paragraph.
- No heading.
- No added insight.
- No fabrication.

If only one factual statement exists:

- Bullet 1 → That fact.
- Bullet 2 → “No additional factual data available.”

Never return one bullet.  
Never return empty output.

---

# Role-Based Permissions

|Role|View Prospect|Edit Prospect|View Internal|Edit Internal|Summarize|
|---|---|---|---|---|---|
|Owner|Yes|No|Yes|Yes|Yes|
|Project Manager|Yes|No|Yes|Yes|Yes|
|Watcher|Yes|No|Yes|No|No|
|External Users|No|No|No|No|No|

Prospect section is system-controlled.  
Internal section is permission-controlled.

---

# Primary User Flow

1. RFP document uploaded.
2. Mapping completed.
3. Instruction-type fields identified.
4. Instructions tab loads.
5. Prospect section auto-renders.
6. Owner edits internal section.
7. Summary optionally generated.
8. If mapping changes or internal content changes → summary must be regenerated.
9. SMEs review both layers before responding.

No manual prospect pasting.

---

# Critical Edge Cases

### Multiple Documents

- Aggregate mapped instruction fields.
- Deduplicate identical field labels.
- Preserve source reference internally.
- If conflicting values exist → display both rows.

### Empty Mapping

- Show: “No prospect instructions mapped.”
- Do not render empty table.

### Large Instruction Sets

- Table supports scroll.
- No truncation within system limits.

---

# Non-Goals

- Manual editing of prospect instructions.
- AI extraction inside Instructions tab.
- Version history.
- External collaboration.

---

# Trade-Off

Gain:

- Structured compliance enforcement.
- Mapping-driven truth.
- Automatic consistency.

Loss:

- Manual override flexibility.    
- Quick edits without remapping.