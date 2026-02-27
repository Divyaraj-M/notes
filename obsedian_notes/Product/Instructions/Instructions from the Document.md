#new_feature/Instructions/v2

## First principle

Every RFP project must clearly define the instructions SMEs are expected to follow before response work begins.

Instructions originate from two distinct sources:

1. **External Instructions (Prospect-defined)**  
    These are requirements stated in the RFP document. They include formatting rules, compliance conditions, submission guidelines, mandatory sections, evaluation criteria, and deadlines. These are non-negotiable and must be followed exactly.
2. **Internal Instructions (Team-defined)**  
    These are guidelines created by the responding team. They include positioning strategy, win themes, tone guidance, approval workflows, risk flags, and deal-specific notes. These ensure consistency, quality, and alignment with deal strategy.

Both instruction types must be captured in a structured and **visible format within the project**.  
No SME should start responding without clear visibility into both.

### Problem Statement

- When an RFP project is created, there is no dedicated place to store and structure instructions for SMEs.

- Both prospect-defined requirements and internal team guidance exist, but they live outside the system — in documents, emails, Slack threads, or verbal communication.

- Because there is no permissioned, centralized instruction layer inside the project:

	- SMEs do not have a single source of truth
	- Critical compliance requirements can be missed
	- Internal positioning guidance is inconsistently applied
	- Contributors rely on memory or fragmented context
	- Rework increases due to avoidable mistakes

- The issue is not availability of instructions.  
- The issue is the absence of a structured, controlled space to capture and surface them within the RFP workflow.


---

### Target Users (Audience)

**Who is this feature primarily for?**

- Primary user: SME's 
- Secondary user : Project Owner, Project Manager
- Who is explicitly out of scope in this version?
	- External users 



---

## Implementation

### Scope

### Must-have functionality

1. **Dual Instruction Sections**
    
    - Two tabs inside Instructions:
        - From Prospect - Importing from the docuemt
        - For Participants
    - Each section stores independent content.
    - Content persists at project level.
2. **Rich Text Editor (on Edit)**  
    Clicking Edit opens a full editor with:
    
    **Controls**
    
    - Undo / Redo
    - Text format:
        - Normal Text
        - Heading 1
        - Heading 2
        - Heading 3
        - Heading 4
        - Heading 5
        - Heading 6
    - Font sizes:  
        8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72
    - Bold
    - Italic
    - Underline
    - Hyperlink
    - Font color
    - Alignment:
        - Left
        - Center
        - Right
1. **Save Behavior**
    - Clicking Save persists content.
    - Cancel discards unsaved changes.
2. **Summarize with Genie AI (Accordion Section)**
    
    - Available as an expandable section.
    - Reads existing editor content.
    - Generates summarized output.
    - Reload icon allows regeneration.
    - Output is not auto-applied to editor.


---

### Nice-to-have (Time Permitting)

- Version history

---

### Explicit Non-Goals

- Importing instructions from document 
- External collaboration access

---

## Experience

### Primary User Flow

1. Project created.
2. Project Owner / Project Manager navigates to Instructions tab.
3. Edits From Prospect section (paste RFP rules).
4. Edits For Participants section (internal guidance).
5. Saves.
6. SMEs view instructions before answering questions.
7. Owner / Project Manager may use Summarize with Genie AI.
8. Optional regenerate via reload icon.

---

### Key Interactions

- Clear separation between external and internal instructions.
- Editing is explicit (not inline auto-edit).
- Summarize is advisory, not destructive.
- Save confirmation is immediate and visible.

---

### Critical Edge Cases

**Empty State**

- If no instructions added → show placeholder:  
    “No instructions added yet.”

**Permissions**

- watcher cannot edit. 
- If unauthorized user attempts edit → disable edit button.

**Large Content**

- Editor must support large pasted RFP sections (up to defined system limit).

**Failure States**

- If save fails → inline error + retry. 
- If AI summarization fails → show:  
    “Unable to generate summary. Please try again.”

---

## Implementation Details
    
### Role-Based Permissions

| **Role**        | **View** | **Edit** | **Summarize** |
| --------------- | -------- | -------- | ------------- |
| Owner           | Yes      | Yes      | Yes           |
| Project Manager | Yes      | Yes      | Yes           |
| Watcher         | Yes      | No       | No            |
| External Users  | No       | No       | No            |

---

### AI Behavior Rules (Summarize with Genie AI)

#### Trigger

User clicks “Summarize”
System must:
1. Read existing content in editor.
2. Extract two most important factual statements.
3. Return exactly two bullet points.

---

### Output Format

- Bullet 1
- Bullet 2

No paragraph.  
No heading.  
No interpretation.  
No added insight.

Optional third point is NOT allowed in V1.  
Always exactly two bullets.

**

# Summarize Output Rules

When user clicks Summarize, system must:

1. Read existing content in editor.
2. Extract the two most important factual statements.
3. Output exactly two bullet points.  

Format:

- Fact 1
- Fact 2


No third point.  
No paragraph.  
No headings.  
No adjectives unless originally present.

---

# What Counts as “Important Fact”

Priority order:

1. What the company does (core business)
2. Revenue scale or public/private status
3. Industry classification
4. Primary product category  


Never summarize the founding story unless it is the only data present.
Never summarize regulatory implications unless explicitly written.

---

# Example

Original Content:

Company X is a publicly traded SaaS company founded in 2012.  
It provides cloud-based cybersecurity solutions to enterprise customers across North America and Europe.  
Revenue for 2024 was $2.1B.  
It operates in the cybersecurity industry.

Summarized Output:

- Publicly traded SaaS company providing cloud-based cybersecurity solutions to enterprise customers.  
- Reported $2.1B revenue in 2024.  

Nothing else.

No added insight.  
No interpretation.

---

# Strict Constraints

Summarize must:

- Use only existing text
- Preserve factual accuracy
- Not fabricate numbers
- Not infer importance
- Not mention data not present
- Always return exactly two bullets  

If content is too small:

If only one fact exists:  
→ Return that fact as the first bullet.  
→ Second bullet: “No additional factual data available.”

Never leave it blank.



---

### Hard Rules

- Use only existing text.
- No fabrication.
- No inferred data.
- No assumptions.
- No added adjectives.
- No founding story unless it is the only information.
- No regulatory inference unless explicitly written.

---

### Small Content Handling

If only one factual statement exists:

Bullet 1 → That fact  
Bullet 2 → “No additional factual data available.”

Never return one bullet.  
Never return empty state.

---

### Regenerate

- Reload icon triggers full re-run.
- No memory of previous output.
- No comparison logic.
- Always stateless generation.

---

## Open Questions

- Can We have Ai read the document and find instructions from the document and make it in the Instructions tab?
- What will happen if there are multiple files are uploaded and each have different instructions ?

---

## Trade-Off for Next Version

Deferred to V2:

- Version history
- Import directly from the Documents 

### Key Questions

- Do projects with instructions show fewer compliance issues?
- Does summarization reduce instruction length?
- Are SMEs referencing instructions before answering?

---

## Final Notes

### Key Assumptions

- SMEs read instructions before responding.
- Owners will actively maintain instruction clarity.
- Prospect instructions vary in structure and quality.

### Dependencies

- Rich text editor framework
- AI summarization service
- Role-based permission engine
- Project-level data storage

