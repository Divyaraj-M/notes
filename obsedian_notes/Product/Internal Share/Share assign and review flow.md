#Backward #delivery #p0
### TL;DR
- When you remove someone from the project, SparrowGenie won’t let you break the workflow. If that person is an author or reviewer, the system stops the removal, shows everything they’re responsible for, and makes you reassign those items first. Changing the author puts the question back to Draft. Changing the reviewer puts it back to For Review. Nothing gets orphaned, nothing gets lost, and all history stays intact.
### Problem 
1. Removing a user who is an [[Author]] or [[Reviewer]] creates orphaned answers and tasks.  There is no required handoff process, which breaks accountability.
2. Removing or changing the reviewer impacts question approval. If the reviewer changes, previously approved items may need status updates because the new reviewer has not reviewed them.
### Objectives
- Prevent orphaned ownership of questions and tasks.
- Enforce reassignment of author and reviewer roles before removal.
- Maintain clear accountability for approved questions.
- Apply consistent status updates when author or reviewer changes.
### Scope

- Share modal (project access list)
- Assign modal (author and reviewer roles)
- Question lifecycle statuses
- Task ownership reassignment
- User removal flow
###  Solution

##### Dependency 
Assign modal  → Internal Share
###### **Rules** 
1. If I add users as [[Author]] or [[Reviewer]] in the assign modal , it will automatically add user as [[Watcher]] in the Share modal 
2. If I remove user from assign modal it should not automatically remove the user from the  Share modal 

### Core Logic: Removing a User from Share

#### Step 1: System checks for active responsibilities

- Open questions (Draft or For Review)
- Approved questions (Reviewed state)
- Assigned tasks
- Author or reviewer role links

> [!NOTE] If the user has any of these, removal is blocked.
> 
> 

### Step 2: Mandatory Reassignment Modal

System shows a modal:

**“This user is an author or reviewer on X items.  
Reassign these items before removing access.”**

Inside the modal:
- List of affected items
- Dropdowns to select new Author and/or Reviewer
- Required selections before continuing

---
### Status Change Logic (Critical Update)

When the user’s role (author or reviewer) changes, the question status must update to protect review integrity.

#### 1. If the Author is changed

Status becomes: **Draft**  
Reason: New author must take responsibility; work returns to editing state.

#### 2. If only the Reviewer is changed

Status becomes: **For Review**  
Reason: The new reviewer has not yet validated the answer.

#### 3. If both roles are changed

Apply both rules in order:

- First revert to Draft (because author changed)
- Then the reviewer change applies after author submits again

#### Impact Areas 
##### Activity log
- I

---

### What Stays the Same

- Previously approved answers keep their original approval record (history).
- Even if the reviewer is removed, the old approval is still visible in **activity log.**
- User removal does not delete past answers.

---

## After Removal

- User loses project access.
- All reassigned authors/reviewers are updated on items.
- Updated item states reflect the new ownership.
- All logs retain original activity timestamps.

---

## Edge Cases

- User has no active items → removal allowed instantly.
- A question already approved but reviewer is replaced → status moves to For Review automatically.
- If no available user to reassign → removal blocked.

