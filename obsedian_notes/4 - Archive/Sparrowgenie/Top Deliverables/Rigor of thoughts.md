---
related:
  - "[[Rigor of thoughts]]"
  - "[[Table view for question card PRD]]"
  - "[[Udemy]]"
  - "[[PRD Feature Name]]"
  - "[[Zoom]]"
  - "[[RFP to Proposal]]"
  - "[[Custom Agent builderv1]]"
  - "[[Product Spec Template 2]]"
  - "[[SME Operating system]]"
  - "[[Template - PM]]"
  - "[[README]]"
  - "[[First Principle thinking - Table View]]"
  - "[[visionary-press-release]]"
  - "[[Demo]]"
  - "[[1-Product Vision]]"
---
#learning 
### What it means for a PM

A PM with rigor:

- Starts with the **real problem**, not a feature idea.
- Grounds decisions in **user data, business goals, and constraints**.
- Makes assumptions explicit and tests them.
- Thinks through **second-order effects**.
- Can explain _why_ a decision was made, step by step.
---

### Example: Feature request comes in

**Request:**  
“Customers want bulk upload. Let’s build it.”

#### Low rigor PM

- Agrees immediately.
- Writes a PRD for bulk upload.
- Ships it.
- Adoption is low. Support tickets increase.

Why it failed:  
No clarity on _who_ wants it, _why_, or *what success looks like.

#### High rigor PM

1. **Clarifies the problem**  
    Who is asking? Power users or free users?  
    What job are they trying to complete faster?
2. **Looks at data**
    - 18% of users upload more than 20 items.
    - Those users churn 30% less.
    - Upload time is a top complaint in tickets.
3. **Frames options**
    - Bulk upload
    - CSV import
    - API access
    - Do nothing        
4. **Evaluates trade-offs**
    - Bulk upload: fast to ship, medium complexity.
    - API: powerful, but only helps technical users.
    - CSV: lowest effort, covers 80% of use cases.
5. **Defines success upfront**
    - Reduce upload time by 40%.
    - Increase activation for high-volume users by 10%.
6. **Decides and tests**  
    Ships CSV import first.  
    Measures impact.  
    Revisits bulk upload later.
    

That’s rigor.

---

### Where PMs often lose rigor

- Jumping from **problem → solution** too fast.
- Letting leadership opinions override evidence.
- Writing PRDs without clear success metrics.
- Ignoring edge cases and downstream effects.
- Saying “users want this” without proof.

---

### A simple rigor checklist for PMs

Before committing to anything, ask:

- What problem are we solving?
- For whom?
- How big is it?
- What evidence supports this?
- What alternatives did we consider?
- What are we trading off?
- How will we know this worked?