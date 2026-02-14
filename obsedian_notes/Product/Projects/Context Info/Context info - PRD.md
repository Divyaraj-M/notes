# 1. Overview

Sales teams win RFPs by submitting relevant answers before the deadline.

Relevance depends on understanding:

- What the prospect does
- How their industry operates
- Their financial scale
- Their product ecosystem
- Their regulatory exposure

Today:

- SMEs manually research prospects.
- Context is inconsistent across projects.
    
- AI answers lack structured company grounding.
    
- Time is lost before writing even begins.
    

This feature introduces a structured Company Intelligence section with an AI-generated, evidence-based company overview at project creation.

The goal is to reduce SME research time and improve response relevance without introducing hallucinated insights.

---

# 2. Problem Statement

SMEs start answering RFP questions without structured prospect context.

Impact:

- Generic answers
    
- Weak positioning
    
- Redundant research
    
- Slower response time
    
- Lower answer quality
    

There is no centralized, structured company briefing inside the project.

---

# 3. Objectives

1. Reduce SME research time
    
2. Improve factual grounding for AI answers
    
3. Provide structured, editable company context
    
4. Maintain zero speculation in AI output
    
5. Ensure auditability and control
    

---

# 4. First Principle

If SMEs lack company context → answers become generic.

If SMEs have structured, factual company context → answers become relevant.

This module ensures context exists before answers are written.

---

# 5. Target Users

### Primary

- Project Owner
    

### Secondary

- Project Manager
    

### View-Only

- Watchers

### Out of Scope

- External users
    
- Prospects
    
- AI-generated strategic inference
    
- Sales positioning suggestions
    

---

# 6. Scope

---

## 6.1 Company Intelligence Section

Each project will contain:

- Company Overview (AI + Editable) adn ca
- Manual Notes (Optional additions)
- Activity Log

Stored at project level.

---

## 6.2 AI-Generated Company Overview

### Input (During Project Creation)

Required fields:

- Company Name
- Company Website / Domain

---

## 6.3 Trigger Model (Combined Approach)

System behavior:

1. After project creation:
    - System auto-generates company overview.
        
2. User sees:
    - “Regenerate Overview” button.
        
3. Owner / PM can regenerate anytime.

SMEs cannot regenerate.

---

## 6.4 AI Data Sources

AI must rely on:

- Official company website
- Annual reports
- SEC filings (if public)
- Verified public databases
- Press releases
- Public earnings reports

No speculation.  
No inferred strategy.  
No predictive analysis.

---

# 7. Functional Requirements

---

## 7.1 Evidence-Only Rule

AI must:

- Generate only verifiable public information
    
- Omit unknown fields
    
- Never fabricate numbers
    
- Never infer priorities
    
- Never create positioning advice
    

If data unavailable:  
→ “Not publicly disclosed.”

---

## 7.2 Manual Editing

Owner / PM can:

- Edit AI content
    
- Add notes
    
- Reformat
    
- Override sections
    

AI cannot auto-overwrite manual edits without confirmation.

---

## 7.3 WYSIWYG Editor

Supported:

- Bold
    
- Italics
    
- Underline
    
- Bullet points
    
- Numbered lists
    
- Hyperlinks
    
- Alignment
    
- Undo / Redo
    

Optional (Nice to Have):

- Attachments (PDF, Excel, Images, Docs)
    

Editor must render Markdown correctly.

---

## 7.4 Activity Log

Track:

- Initial AI generation
    
- Regeneration
    
- Manual edits
    
- Timestamp
    
- User identity
    

Visible in project activity feed.

---

## 7.5 Permissions

|Role|View|Edit|Regenerate|
|---|---|---|---|
|Owner|Yes|Yes|Yes|
|Project Manager|Yes|Yes|Yes|
|SME|Yes|No|No|
|External|No|No|No|

---

# 8. Edge Cases

### AI Failure

Show:  
“Unable to fetch company overview. Please try again.”

### Invalid Domain

Validate format before API call.

### Private Company Without Revenue

Display:  
“Revenue not publicly disclosed.”

### Regeneration

Replacing AI content requires confirmation if manual edits exist.

---

# 9. Data & Storage

- Stored at Project Level
    
- Generation timestamp stored
    
- Source references stored in backend logs
    
- Version history maintained internally
    
- AI-generated sections marked clearly
    

---

# 10. Impact Areas

### 1. Time Reduction

SME onboarding into a project becomes faster.

### 2. AI Answer Quality

Better context → lower hallucination risk.

### 3. Consistency

All responses within a project grounded in same company context.

---

# 11. Success Metrics

1. % of projects with AI overview generated
    
2. Time-to-first-answer reduction
    
3. SME satisfaction score
    
4. Regeneration rate
    
5. Manual edit frequency
    

---

# 12. Assumptions

- Public data is sufficient for most enterprise prospects.
    
- SMEs read overview before answering.
    
- Evidence-only approach increases trust.
    

---

# 13. Dependencies

- Search + Retrieval API (Perplexity or equivalent)
    
- Prompt enforcement layer
    
- Markdown renderer
    
- Activity log infrastructure
    
- Role-based access control
    

---

# 14. Final AI Output Specification (For AI Team)

The AI must generate output strictly in the following structure.

No deviation.

---

# AI OUTPUT FORMAT

---

## 1. Company Overview

4–6 concise factual lines covering:

- What the company does
    
- Primary customers
    
- Business model (B2B / B2C / SaaS / Enterprise etc.)
    
- Geographic presence
    

No adjectives unless quoted from official source.

---

## 2. Industry & How It Operates

- Industry classification
    
- How companies in this industry typically operate
    
- Regulatory environment (if publicly documented)
    
- Compliance exposure (if explicitly stated)
    

No inference. Only industry-documented facts.

---

## 3. Founding Details

- Founded year
    
- Founder(s)
    
- Country of origin
    

---

## 4. Revenue Overview (Last 5 Years)

If public:

| Year | Revenue | Source |

If private:  
“Revenue not publicly disclosed.”

No estimates unless from reliable financial databases.

---

## 5. Ownership Status

- Public / Private
    
- Stock ticker (if applicable)
    
- Parent company (if applicable)
    

---

## 6. Core Products / Offerings

- Product Name – What it does – Target customer
    
- Product Name – What it does – Target customer
    

Only officially listed products.

---

# Output Constraints

- 300–600 words
    
- Structured
    
- Bullet-heavy
    
- No marketing tone
    
- No speculation
    
- No inferred insights
    
- Omit unknown data
    
- Store sources in backend logs