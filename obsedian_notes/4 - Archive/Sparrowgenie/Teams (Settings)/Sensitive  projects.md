---
related:
  - "[[Teams check]]"
  - "[[Dual-Layer Team]]"
  - "[[Assigning to the section]]"
  - "[[Project Owner]]"
  - "[[Functional Requirements]]"
  - "[[What Do we need for Teams]]"
  - "[[Project Share - RFx and Proposal]]"
  - "[[Known Unknown Matrix]]"
  - "[[Project Manager]]"
  - "[[Project Watcher]]"
  - "[[RFP to Proposal]]"
  - "[[Nested Hierarchy Teams (Nice to have)]]"
  - "[[framing-the-problem-statement]]"
  - "[[Audit Report R126022026]]"
  - "[[2026-01-30]]"
---
### **What is a Sensitive Project?**

A Sensitive Project is a project where **team-level visibility is fully blocked**, even if the owner belongs to one or more teams.

### **Why?**

To allow the owner to work privately, share selectively, or restrict access during early drafting or confidential work.

|Condition|Who Can See?|Notes|
|---|---|---|
|Owner|Yes|Always|
|Explicitly added collaborators|Yes|Manager/Reviewer/Author/Watcher roles|
|Any team the owner belongs to|**No**|Completely blocked|
|Any team the collaborator belongs to|No|No propagation|
|Any user not explicitly added|No|Fully restricted|
### **Owner toggle**

Owner sets: **Sensitive = ON/OFF**  
Default: **OFF**

### **UI/UX need**

- A clear toggle in in the import screen and project settings 
- Tooltip: “Only you and collaborators can see this project. Your teams cannot see it.”
