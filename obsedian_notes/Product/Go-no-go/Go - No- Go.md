#new_feature/Go_no_go
# Go / No-Go Decision Engine for RFPs

This document explains **why** the Go / No-Go Decision Engine exists, **who** it is for, and **what** must be built.  
Its goal is to help SparrowGenie improve deal velocity, response quality, and execution clarity for sales teams by preventing low-probability RFPs from consuming time and resources.

---

## Context

**Purpose:**  
Create a shared understanding of why we are building Go / No-Go now and what must be prioritized while building it.

---

## 1. Problem Statement

### What is broken today in the SparrowGenie sales or proposal workflow?

- RFP's can contain questions that have count of more than 2000 too , 
Sales teams start RFPs without a structured decision on whether they **should** pursue them.


**Who experiences this problem**

- Sales reps initiating deals
- Proposal owners and contributors
- Sales managers responsible for pipeline quality
- Leadership accountable for win rate and effort efficiency


**Where the deal slows down or breaks**

- RFPs are uploaded and worked on before feasibility is assessed
- Teams commit effort before understanding risk, fit, or readiness
- Late-stage discovery reveals blockers (timeline, legal, scope, budget)

**What work is manual or error-prone**

- Go / No-Go decisions live in:
    - Slack threads
    - Calls
    - Personal judgment
    - Untracked Excel sheets
- No consistent criteria across teams or regions
- Decisions are rarely documented or auditable

**Consequences if unsolved**

- Low-quality RFPs consume high-cost resources
- Proposal teams burn time on deals unlikely to close
- Win rates stagnate despite high activity
- No learning loop from past decisions
- Managers lack visibility into _why_ deals were pursued


---

## 2. Opportunity

### Why is this problem worth solving now?

- AI accelerates Projects creation, increasing the risk of **doing bad work faster**
- Teams need **decision discipline**, not just automation

**Impact of solving this**

- Faster rejection of low-fit deals
- Better prioritization of high-probability RFPs
- Clear ownership and accountability for decisions
- Reduced proposal fatigue and burnout

**Expected business impact**

- Improved win rate by focusing effort on qualified deals
- Reduced sales cycle waste
- Higher SparrowGenie adoption as a decision system, not just a writing tool
- Stronger positioning vs point-solution proposal tools


---

## 3. Target Users (Audience)

### Primary User

- Sales Manager or Deal Owner responsible for deciding whether to pursue an RFP

### Secondary Users

- Proposal Owners and Contributors who need clarity before committing effort
- Leadership reviewing pipeline quality and decision rationale

### Explicitly Out of Scope (v1)

- Legal-only reviewers
- Finance-only approval workflows
- Automated final deal approval or blocking

---

## 4. Competitive Insights

### How do teams solve this today?

**Current approaches**
- Salesforce opportunity notes    
- Excel or Google Sheets scorecards
- Informal calls or Slack consensus
- No decision at all until mid-way through the RFP

**What works**
- Human judgment captures nuance
- Teams can move fast when confident

**Where it breaks**
- No consistency across deals
- No historical data or learning
- Decisions are not visible to contributors
- AI tools focus on writing, not deciding

**SparrowGenie’s gap**
- Embed decision-making **inside** the proposal workflow
- Combine system signal + human judgment
- Make Go / No-Go explicit, structured, and repeatable

---

## 5. Success Metrics

### Primary Outcome Metric

- Percentage of RFPs with an explicit Go / No-Go decision recorded before proposal work begins


### Supporting Metrics

- Reduction in abandoned or stalled RFPs mid-process
- Win rate of RFPs marked “Go”
- Average time to decision after RFP upload
- Proposal team effort spent per closed deal

### Expected Direction

- Go / No-Go coverage ↑
- Mid-process drop-offs ↓
- Win rate ↑
- Effort waste ↓

---

## Implementation

## 6. Scope

### Must-Have Functionality

- Go / No-Go entry point on Project Creation screen
- RFP upload triggers system readiness scan
- Auto-calculated **Readiness Score (0–100)**
- User-driven Go / No-Go questionnaire (Out of box questions)
- Weighted scoring logic
- Result states:
    - Go
    - Conditional
    - No-Go
- Clear distinction between:
    - System-only signal
    - Full decision
- Decision result screen with rationale
- Decision persistence at project level

### Explicit Non-Goals

- Blocking proposal creation
- Automated approvals
- AI-only final decisions
- Revenue forecasting

---

## 7. Experience

### Primary User Flow

1. User creates a new project
2. Beside Project Creation, a **Go / No-Go** decision icon is visible
3. User uploads the RFP
4. System runs an **automatic readiness scan**
5. System shows:
    - Readiness Score
    - Preliminary decision label
    - Confidence disclaimer
6. User chooses:
    - Proceed with system signal only
    - Run full Go / No-Go evaluation
7. User answers weighted questions
8. Final decision is calculated and shown
9. Decision is saved to the project

---

### Key Interactions That Matter

- Clear labeling of “System View” vs “Final Decision”
- Fast feedback after upload
- Transparent scoring logic
- No forced path or blocking

---

### Critical Edge Cases

- User skips full evaluation → system marks decision as “Preliminary”
- User lacks permission → view only, no edit
- RFP parsing fails → system disables auto score and explains why
- Template deleted after use → decision remains intact

---

## 8. Implementation Details

### Scoring Rules

- Each question has:
    - Weight
    - Scale (e.g., 1–5)
- Final score normalized to 100

**Decision Thresholds**

- ≥ 70 → Go
- 55–69 → Conditional
- < 55 → No-Go

---

### Default Go / No-Go Questions

- Relationship and influence strength
- Deal shaping involvement
- Competitive advantage or incumbency
- Buying process clarity
- Timeline feasibility
- Team bandwidth
- Budget alignment
- Commercial value    
- Delivery complexity
- Legal, security, or compliance gaps

---

### Data Persistence

- All decisions stored at project level
- Historical decisions remain immutable
- Re-runs create new versions, not overwrites

---

### Permissions

- Only project owners or admins can finalize decisions
- Contributors can view but not edit
- Templates editable by admins only

---

### System / AI Constraints

- AI readiness scan is advisory only
- No automated blocking based on score
- All outputs must be explainable at a high level


---

##  Investigative Metrics

### Early Signals

- % of projects using Go / No-Go
- Drop-off between system signal and full evaluation
- Average time spent in decision flow

### Risk Signals

- Users skipping full evaluation
- High disagreement between system and user scores
- Confusion between preliminary vs final decision

### Key Questions to Answer

- Are teams actually saying No more often?
- Does Go correlate with higher win rate?
- Are decisions happening earlier than before?

---

## Final Notes

### Key Assumptions

- Teams want guidance, not enforcement    
- Decision clarity improves execution quality
- Structured judgment beats gut feel at scale    

### Open Questions

- Should Conditional require justification?
- Should decisions be visible to customers later?
- How often should re-evaluation be prompted?

### Dependencies

- RFP parsing reliability
- Template configuration framework
- Role and permission model