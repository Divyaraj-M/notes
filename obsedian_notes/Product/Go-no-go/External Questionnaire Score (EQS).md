#discovery/go_no_go/EQS

---



## Why this exists

EQS helps sales teams decide **whether a deal is worth pursuing** before they spend time writing a proposal.

Today, teams start responding to RFPs based on instinct. Sometimes that works. Often it doesn’t. EQS gives teams a **structured way to judge deal fit early**, using the information they already have.

---

## Context

### Problem we’re solving

**Sales and proposal teams waste time on low-fit RFPs because:**
- Go / No-Go decisions are subjective
- Different reps evaluate the same deal differently
- Important deal risks are discovered too late
- Managers don’t have a clear reason to say “don’t pursue”

**As a result:**
- Proposal effort is wasted
- Deal cycles stretch
- Win rates suffer
- Teams burn out responding to bad-fit RFPs


### Opportunity


By turning questionnaire responses into a clear signal:

- Reps can decide faster
- Managers can review decisions with confidence
- Teams can focus effort on winnable deals    

This improves:

- Deal velocity
- Proposal quality
- Sales confidence
- Overall win rate

---

### Target users

### Primary user

- Sales reps or proposal owners deciding whether to pursue an RFP

### Secondary users

- Sales managers reviewing Go / No-Go decisions
- Project leads prioritizing work

### Out of scope (v1)

- Finance approvals
- Legal approvals
- Automatic deal rejection


---

## What we’re building (scope)

### Included in this release

- Configurable external questionnaire
- Ordered answer options (Best → Worst)
- Importance selection: Critical / High / Medium / Low
- EQS calculation from responses
- Critical deal-blocker detection
- Clear explanation of what affected the score

### Not included

- Final Go / No-Go verdict logic
- Percentage normalization
- AI Readiness score
- Past RFP similarity
- Automated submission blocking

---

## How EQS works (simple explanation)

EQS answers one question:

> Based on buyer responses, how attractive and aligned is this deal?

It does this in two parts:

1. **Critical checks** (hard blockers)
2. **Scored signals** (everything else)

---

## Question setup

Each question has:

- Question text
- Answer options (2 or more)
- Importance level:
    
    - **Critical**
    - High
    - Medium
    - Low

### Answer options

- First option = **Best case**
- Last option = **Worst case**
- Options in between represent gradual decline
- Order is locked once responses exist

### Core Distribution Formula for options

- `N` = total number of options
- Options are ordered **Best → Worst**
- `i` = index of selected option (0-based)
    - Best option → `i = 0`
    - Worst option → `i = N - 1`

> $Option Value = 1 - (2 * i / (N - 1))$

Critical questions are tracked separately as blockers.
Admins can choose wording freely. The system only cares about order.

---

## Importance levels (very important)
### Critical
 Any single Critical question answered with its worst option immediately flags the deal as a No-Go candidate. Neutral answers on Critical questions do not block the deal but must surface a caution state.

- This is a **hard deal blocker**
- If the worst option is selected → deal is flagged as No-Go candidate
- Critical questions do **not** contribute to EQS
- These represent non-negotiables (compliance, legal, mandatory requirements
#### Case Table: Single Critical Question

##### Critical Question Handling – Cases Table

###### Definitions 

- **Best** → clearly satisfies the requirement
- **Neutral / Acceptable** → partially met, unclear, or needs validation
- **Worst** → clearly does not meet the requirement
- **Critical Fail** → hard blocker, deal becomes No-Go candidate
- **EQS Contribution** → whether this question affects EQS score


#### Case Table: Single Critical Question

| Selected Option      | Critical Fail? | EQS Contribution | System Behavior                  |
| -------------------- | -------------- | ---------------- | -------------------------------- |
| Best                 | No             | No               | Pass silently                    |
| Neutral / Acceptable | No             | No               | Pass, show warning               |
| **Worst**            | **Yes**        | No               | **Flag deal as No-Go candidate** |

Key rule:  
**Critical questions never contribute to EQS.**

---

#### Case Table: Multiple Critical Questions

|Scenario|Outcome|
|---|---|
|All Critical questions = Best|Pass|
|One or more Critical = Neutral, none = Worst|Pass with caution|
|**Any one Critical = Worst**|**No-Go candidate**|

Important:

- It does **not** matter how many Critical questions exist
- It does **not** matter how strong EQS is
- **One Worst is enough**

---

#### Case Table: Critical vs Non-Critical Interaction

| Question Type | Selected Option | Affects EQS?   | Can trigger No-Go? |
| ------------- | --------------- | -------------- | ------------------ |
| Critical      | Best            | No             | No                 |
| Critical      | Neutral         | No             | No                 |
| Critical      | **Worst**       | No             | **Yes**            |
| High          | Best            | Yes (positive) | No                 |
| High          | Neutral         | Yes (zero)     | No                 |
| High          | Worst           | Yes (negative) | No                 |
| Medium        | Any             | Yes            | No                 |
| Low           | Any             | Yes            | No                 |






### High / Medium / Low

- These questions **do contribute** to EQS
- The difference is **how strongly they affect the score**
- A bad answer here hurts the score, but does not automatically kill the deal

Key rule:

> Only **Critical** questions can directly stop a deal.

#### Importance Multipliers

|  Importance  |   Multiplier    |
| :----------: | :-------------: |
|   **HIGH**   |       2.0       |
|  **MEDIUM**  |       1.0       |
|   **LOW**    |       0.5       |
| **CRITICAL** | not used in EQS |
- Importance multipliers are designed to reflect relative influence, not absolute value. Medium importance acts as the baseline. High importance questions are weighted at 2× to ensure they meaningfully influence the score without dominating it. Low importance questions are weighted at 0.5× so they remain visible but cannot materially change the outcome on their own. These defaults are intentionally conservative and may be tuned based on observed outcomes.


Used **only for non-critical questions**.
### EQS calculation 

- Only **non-critical** questions are included
- Each answer contributes positively or negatively based on option order
- Contribution strength depends on importance (High > Medium > Low)
- EQS is the **sum of all non-critical contributions**
- No percentage conversion at this stage

#### Contribution Formula (Source of Truth)

**Step 1: Option Value**

> $OptionValue = 1 - (2 * i / (N - 1))$

**Range:**

-1 ≤ option_value ≤ +1

**Step 2: Importance Multiplier**

|  Importance  |   Multiplier    |
| :----------: | :-------------: |
|   **HIGH**   |       2.0       |
|  **MEDIUM**  |       1.0       |
|   **LOW**    |       0.5       |
| **CRITICAL** | not used in EQS |
(If `importance == CRITICAL`, skip contribution entirely.)

**Step 3: Contribution**

> $Contribution = OptionValue * ImportanceMultiplier$

**Step 4: EQS (Raw)**

> $EQS = Σ(Contribution For All Non Critical Questions)$

**Critical Override**
`if importance == CRITICAL and option_value == -1:`
    `critical_fail = true`

**Critical questions:**
- Never contribute to EQS
- Only act as a blocker

---

## Real example (how this feels in practice)

### Scenario

A SaaS company is evaluating an enterprise security RFP.

#### Question 1

“Do you meet SOC2 Type II requirements?”  
Importance: **Critical**

Options:

1. Fully compliant
2. In progress
3. Not compliant

Buyer selects: _Not compliant_  
→ Critical failure flagged  
→ Deal becomes a No-Go candidate immediately

---

#### Question 2

“How strong is your SSO support?”  
Importance: **High**

Options:

1. Native SSO with major providers
2. Partial support
3. No support

Buyer selects: _Partial support_  
→ Moderate negative contribution to EQS

---

#### Question 3

“How aligned is pricing with buyer budget?”  
Importance: **Medium**

Options:

1. Fully aligned
2. Some negotiation needed
3. Major gap

Buyer selects: _Some negotiation needed_  
→ Small negative contribution

---

### Result

- EQS reflects mixed deal fit
- Critical failure clearly explains the main risk
- Rep understands _why_ this deal is risky
- Manager can review the decision without guesswork

---

## Experience inside SparrowGenie

- Reps answer the questionnaire
- EQS updates automatically
- Critical issues are clearly highlighted
- Users can see which questions helped or hurt the score
- No formulas shown
- No confusing math

---

## Launch plan

- Start with a limited beta
- Enable for selected accounts
- Provide short admin guidance on “Critical vs High”
- Collect feedback before expanding usage

---

## What we’ll watch after launch

- How often critical failures occur
- Distribution of EQS across deals
- Whether EQS correlates with submission and wins
- Where users seem confused or override decisions

---

## Final notes

### Assumptions

- Admins can identify true deal blockers
- Question quality improves over time

### Open questions

- How many critical questions should be allowed?
	- 
- Should we guide admins more during setup?

### Dependencies

- Questionnaire builder
- Project permissions
- Data persistence for responses

---

## One-line summary

EQS helps teams decide **which deals are worth pursuing** by turning buyer responses into a clear, structured signal — separating hard blockers from scored fit indicators.