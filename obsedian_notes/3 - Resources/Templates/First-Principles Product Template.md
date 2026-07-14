---
related:
  - "[[WYSIWYG editor - First Principle]]"
  - "[[First Principle thinking - Table View]]"
  - "[[Demo]]"
  - "[[RFP to Proposal]]"
  - "[[Instructions]]"
  - "[[Context info - PRD]]"
  - "[[Competitors Info]]"
  - "[[PRD Feature Name]]"
  - "[[Instructions from the Document]]"
  - "[[Project Share - RFx and Proposal]]"
  - "[[2-Product Strategy]]"
  - "[[Go - No- Go]]"
  - "[[AI Readiness Score (ARS)]]"
  - "[[Company Templates - Proposal]]"
  - "[[1-Product Vision]]"
---
## How you should actually use this

- **Feature ideation** → Sections 1–3 decide if it’s worth building
- **Design discussions** → Section 6 dominates
- **Engineering alignment** → Sections 2 + 5
- **Leadership reviews** → Sections 3 + 8
### 1. Problem (no solution words)

What user pain exists even if our product did not exist?
- Sales people and RFP bidders would have pain to get information all around the company and put into word doc or pdf , and every time they have to fill it manually and collaborate through very tedious process with the deadline hanging above their head. 
##### Who experiences it?
- Sales People
- RFP bidders 
- Sales Directors 
##### When does it occur?
- Every 2 to 3 weeks 
##### What breaks because of it?
- It would takes months to fill an RFP  and Still won't know whether they can won is this or not , and there won't be a platform to assess the past data and rectify the mistakes. It can be bigger with the question range of 2k questions too. 
- This can also make the organization rely on the dependency of the people rather than the Documents , since content can expire with the updates.

> One paragraph. If it needs bullets, it’s not clear enough.

---

### 2. Non-negotiable truths

Facts that must be true for this problem to exist.
1. **RFP information is distributed, not centralized**  
    Critical inputs live across sales, product, legal, security, and leadership, and no single person has full ownership or visibility.
2. **RFPs are high-stakes and deadline-driven**  
    Responses are tied to revenue, leadership pressure, and fixed timelines, making manual coordination failures costly    
3. **Past RFP responses are not systematically reused or evaluated**  
    Even though similar questions repeat, teams lack a reliable way to learn from previous wins and losses or assess win probability upfront.
4. **Knowledge decays faster than documents are updated**  
    Product changes, compliance updates, and personnel turnover make static documents outdated, pushing teams to depend on people instead of systems.
5. **RFP volume and size are increasing**  
    Enterprise buyers demand deeper, broader questionnaires, amplifying effort and risk with every new bid.

Rules:
- No UI
- No tech
- No competitor references

---
### 3. What would break if this feature did not exist?

Be concrete.

- What task becomes slow?
- What error increases?
- What decision becomes risky?
- What workaround users are forced into?

If the answer is “nothing breaks,” stop here.

--- 
### 4. Desired outcome

What must change for the user to say this is “better”?

- Speed?
- Accuracy?
- Confidence?
- Reduced rework?

Be explicit. One primary outcome only.

---

### 5. Value equation

Score each from 1–5.

|Factor|Score|Why|
|---|---|---|
|Signal (quality)|||
|Context (fit)|||
|Trust (confidence)|||
|Effort (cost)|||

**Value = (Signal × Context × Trust) − Effort**

If effort is high, explain why it is unavoidable.

---
### 6. Smallest change that moves the outcome

Before designing anything, answer this:

- What is the **minimum intervention**?
- What can we remove?
- What can we pre-fill?
- What can be automated silently?

If the smallest change works, do not build the bigger one.

### 7. Smallest viable intervention

What is the **minimum change** that improves the value equation?

- Remove a step?
- Add a default?
- Pre-fill?
- Reorder?

If it needs a new screen, challenge it.

---

### 7. What we are NOT doing

Explicit non-goals.

- ---
    
- ---
    

This prevents scope creep later.

---

### 8. Validation plan

How do we know this worked?

- Behavior change to observe
- Metric to track
- Qualitative signal to listen for


No vanity metrics.3