## 1. Problem Statement

CRM contact records become unreliable because reps move fast. Contact titles go stale, phone numbers are missing, company associations are unclear, LinkedIn URLs are absent, and activity often reveals updates that never make it back into the CRM.

This creates friction for reps and weakens the entire CRM Intelligence layer. Reps waste time cleaning contact data manually. Managers cannot trust contact-level views. Signals, Zulie, and future agents reason over incomplete context.

**Contact Hygiene Agent v1 solves this by detecting missing, stale, inconsistent, or poorly formatted fields on rep-owned Contact records and suggesting field-level fixes for the contact owner to approve, reject, or let expire.**

This is not the full Hygiene Agent across all CRM objects. Contacts are the first controlled object. Once the loop is proven and stable, Hygiene Agent can expand to Companies and Deals.

---

## 2. Jobs To Be Done

### Primary job statement

> When my contact records are incomplete or outdated, I want the CRM to catch and suggest fixes for me, so I can keep my contact data clean without spending manual time on CRM cleanup.

### Functional dimension

The rep wants contact fields to stay accurate with minimal manual effort.

### Emotional dimension

The rep wants to feel confident that the CRM is helping, not creating more review work.

### Social dimension

The rep wants managers and teammates to see them as organized, responsive, and on top of their relationships.

### Hiring criteria

Users would hire Contact Hygiene Agent because:

- It catches missing or stale contact fields without manual auditing.
    
- It turns contact cleanup into simple approve/reject decisions.
    
- It explains why a contact field update is being suggested.
    
- It improves over time based on the rep’s verdicts.
    

### Firing criteria

Users would stop trusting or using Contact Hygiene Agent if:

- Suggestions are too obvious, noisy, or low-value.
    
- It suggests changes without enough evidence.
    
- It overwrites human-entered values silently.
    
- It keeps repeating rejected suggestions.
    
- It creates more review work than the time it saves.
    

---

## 3. Goals

### User goals

1. **Reduce manual contact cleanup effort**
    
    - Reps should spend less time identifying and updating missing or stale contact fields.
        
2. **Increase trust in contact data**
    
    - Reps and managers should see more complete and accurate Contact records over time.
        
3. **Make every AI-suggested contact update reviewable**
    
    - Every rep-facing output must be a specific contact field suggestion with approve/reject/expire verdicts.
        
4. **Improve suggestion quality over time**
    
    - Accepted, rejected, and expired suggestions should change future Hygiene Agent behavior inside that workspace.
        

### Business goals

1. **Prove the agent learning loop on one CRM object**
    
    - Contacts become the first controlled surface for validating Suggestion → Verdict → Learning.
        
2. **Improve downstream intelligence quality**
    
    - Cleaner Contact records should improve AI Signals, Zulie answers, and future agent suggestions.
        
3. **Create measurable proof of CRM Intelligence value**
    
    - Value should be measurable through accepted suggestions, contact fields maintained, and time saved.
        

---

## 4. Why Contacts First

Contacts are the safest and clearest starting object for Hygiene Agent because:

1. Contact fields are simpler than company or deal fields.
    
2. Reps interact with contacts frequently through calls, meetings, and emails.
    
3. Missing or stale contact data directly affects follow-ups and relationship quality.
    
4. Contact-level suggestions are easier for reps to verdict quickly.
    
5. The same agent loop can later expand to Companies and Deals once proven.
    

This is a deliberate v1 constraint, not the final object scope.

---

## 5. Non-Goals

|Non-goal|Why it is out of scope|
|---|---|
|Company object hygiene|More complex ownership and source-of-truth rules. Move here after Contact Agent stabilizes|
|Deal object hygiene|Higher business impact. Deal stage, amount, close date, and forecast fields need stricter guardrails|
|Autonomous field updates without approval|v1 must earn trust through verdicts before auto-mode|
|Research-style enrichment|Reasoned outside synthesis belongs to Research Agent|
|Deterministic third-party enrichment|Apollo-style facts belong to Data Feeds, not Hygiene Agent|
|Duplicate contact merging|High-risk action with data loss potential|
|Bulk contact cleanup|v1 should prove record-level suggestions before scaling to bulk flows|
|Lead scoring or buying intent|Belongs to AI Signals, not Hygiene Agent|
|Next-best actions|Belongs to Pipeline Agent or another action agent|
|Prospect outreach or email sending|External communication has higher blast radius and is not hygiene work|

---

## 6. User Stories

### P0 user stories

1. **As a sales rep, I want the agent to detect missing important fields on my Contact records so that I do not have to manually audit every contact.**
    
2. **As a sales rep, I want to review each suggested contact field update before it is applied so that I stay in control of my CRM data.**
    
3. **As a sales rep, I want to see why the agent suggested a contact field change so that I can trust the recommendation.**
    
4. **As a sales rep, I want to reject wrong contact suggestions so that the system learns not to repeat similar mistakes.**
    
5. **As a sales manager, I want accepted contact hygiene suggestions to improve contact completeness so that CRM data becomes more reliable.**
    

### P1 user stories

6. **As a sales rep, I want repeated low-confidence contact suggestions to be suppressed so that my approval queue does not become noisy.**
    
7. **As a sales rep, I want to manually run Contact Hygiene Agent on a contact so that I can clean the record before an important meeting or review.**
    
8. **As a manager, I want to see Contact Hygiene Agent acceptance rates so that I can judge whether the agent is useful or noisy.**
    

### P2 user stories

9. **As a sales rep, I want trusted low-risk contact updates to auto-apply after the agent earns enough approvals so that I review only the changes that need judgment.**
    
10. **As an admin, I want to configure which contact fields the agent can suggest updates for so that it matches our CRM process.**
    

---

## 7. Requirements

# P0 — Must-Have

## P0.1 Contact-only eligibility

Contact Hygiene Agent v1 must run only on Contact records owned by the reviewing rep.

Eligible:

- Contact is owned by the rep
    
- Contact belongs to the workspace where the agent is active
    
- Contact has enough CRM activity or field evidence
    
- Contact has at least one supported hygiene issue
    

Not eligible:

- Company records
    
- Deal records
    
- Unowned contacts
    
- Contacts owned by another rep
    
- Duplicate contact clusters
    
- Contacts with no supporting evidence
    

### Acceptance criteria

- Given a rep owns a contact  
    When Hygiene Agent runs and finds a supported hygiene issue  
    Then it creates a contact-level suggestion for that rep to review.
    
- Given the record is a company or deal  
    When Hygiene Agent v1 runs  
    Then no suggestion is created.
    
- Given the contact is not owned by the rep  
    When Hygiene Agent runs  
    Then no suggestion is shown to that rep.
    

---

## P0.2 Supported triggers

Contact Hygiene Agent v1 should run from approved CRM Intelligence triggers.

Initial triggers:

- After call
    
- After meeting
    
- Manual “Run Agent” on a Contact record
    

Email-triggered hygiene can be added only if email activity is already reliably available in the shared context layer.

### Acceptance criteria

- Given a meeting ends and the contact has new information  
    When Hygiene Agent runs  
    Then it evaluates eligible contact fields for missing, stale, or conflicting values.
    
- Given a rep clicks “Run Agent” on an owned Contact record  
    When the run completes  
    Then suggestions appear in the same review flow as triggered runs.
    

---

## P0.3 Supported contact suggestion types

Contact Hygiene Agent v1 can suggest field-level updates only.

Allowed v1 suggestion types:

1. **Missing contact field suggestion**
    
    - Example: Job title is empty, but the call transcript says “VP Sales.”
        
2. **Stale contact field suggestion**
    
    - Example: Existing title is “Sales Manager,” but recent meeting context indicates “Head of Revenue.”
        
3. **Format cleanup suggestion**
    
    - Example: Phone number, email casing, country, or LinkedIn URL format is inconsistent.
        
4. **Conflict flag with suggested replacement**
    
    - Example: CRM says contact belongs to Company A, but recent activity and email domain indicate Company B.
        
5. **Association suggestion**
    
    - Example: Contact has no associated company, but the email domain and meeting context clearly point to Acme Corp.
        

Not allowed in v1:

- Company field updates
    
- Deal field updates
    
- Deal stage changes
    
- Forecast category changes
    
- Lead score updates
    
- Duplicate merges
    
- Bulk edits
    
- Prospect-facing actions
    

### Acceptance criteria

- Given the agent detects a missing supported Contact field  
    When it has enough evidence  
    Then it creates a field update suggestion.
    
- Given the agent detects a possible issue in a Company or Deal field  
    When the run completes  
    Then no Hygiene Agent v1 suggestion is created.
    

---

## P0.4 Supported contact fields

The v1 field list should be locked before implementation.

Proposed v1 fields:

- First name
    
- Last name
    
- Full name formatting
    
- Job title
    
- Email
    
- Phone number
    
- LinkedIn URL
    
- Location
    
- Department / function
    
- Seniority
    
- Associated company
    

Fields to avoid in v1 unless confidence is very high:

- Persona
    
- Buying role
    
- Lead status
    
- Lifecycle stage
    
- Owner
    
- Any field used for automation, routing, or scoring
    

### Acceptance criteria

- Given a field is in the supported v1 field list  
    When the agent finds a hygiene issue with evidence  
    Then it can create a suggestion.
    
- Given a field is not in the supported v1 field list  
    When the agent detects an issue  
    Then it must not create a rep-facing suggestion.
    

---

## P0.5 Suggestion object

Every Contact Hygiene Agent suggestion must include:

- Contact ID
    
- Field name
    
- Current value
    
- Suggested value
    
- Reason for suggestion
    
- Evidence/source
    
- Confidence level
    
- Agent run ID
    
- Trigger type
    
- Suggestion status: pending / approved / rejected / expired
    

### Acceptance criteria

- Given a suggestion is created  
    When the rep opens the review flow  
    Then they can see the current value, suggested value, reason, and evidence.
    
- Given evidence is unavailable  
    When the agent considers creating a suggestion  
    Then the suggestion should not be created.
    

---

## P0.6 Verdict flow

Every suggestion must be verdictable by the Contact owner.

Supported v1 verdicts:

- Approve
    
- Reject
    
- Expire
    

Inline editing is not required in v1.

### Acceptance criteria

- Given a suggestion is pending  
    When the owner approves it  
    Then the suggested value is written to the Contact record and the verdict is logged.
    
- Given a suggestion is pending  
    When the owner rejects it  
    Then the Contact record remains unchanged and the verdict is logged.
    
- Given a suggestion is not acted on within the expiry window  
    When the expiry window passes  
    Then the suggestion status changes to expired.
    

---

## P0.7 No silent overwrite

Contact Hygiene Agent must never silently overwrite human-entered values.

It may suggest a change to a human-entered value only when it has clear evidence. The rep’s approval is required before the value changes.

### Acceptance criteria

- Given a Contact field has a human-entered value  
    When Hygiene Agent detects a possible correction  
    Then it creates a suggestion instead of changing the field directly.
    
- Given a rep rejects a suggested correction  
    When the same evidence appears again  
    Then the agent should not repeatedly suggest the same change without new evidence.
    

---

## P0.8 Learning loop

Every verdict must feed the learning model per workspace.

At minimum, the system must track rolling accept, reject, and expiry rates by:

- Workspace
    
- Agent
    
- Contact field
    
- Action type
    
- Trigger type
    
- Agent version
    

### Acceptance criteria

- Given a suggestion receives a verdict  
    When analytics are updated  
    Then the relevant accept/reject/expiry rates update.
    
- Given accept rate drops after an agent version change  
    When the drop crosses the regression threshold  
    Then the agent version should be flagged for review.
    

---

## P0.9 Review surface

Contact Hygiene Agent suggestions must appear in the existing agent review flow.

The rep should be able to review suggestions from:

- Agent detail page
    
- Run history
    
- Contact record page review entry point, if available
    

### Acceptance criteria

- Given Contact Hygiene Agent creates suggestions  
    When the rep opens the agent run  
    Then pending suggestions are visible under “Pending approval.”
    
- Given all suggestions in a run are approved, rejected, or expired  
    When the run is viewed later  
    Then it appears under “Past.”
    

---

# P1 — Nice-to-Have

## P1.1 Manual contact cleanup mode

Allow the rep to manually run Hygiene Agent on a specific Contact record.

## P1.2 Suggestion grouping

Group multiple contact hygiene suggestions from the same run into one review flow.

Example:

> “3 suggested updates for Priya Raman.”

## P1.3 Field-level suppression

If a rep repeatedly rejects suggestions for the same contact field type, reduce future suggestion frequency for that field.

## P1.4 Admin field configuration

Allow admins to define which Contact fields Hygiene Agent can evaluate.

## P1.5 Basic quality dashboard

Show:

- Total contact hygiene suggestions
    
- Approval rate
    
- Rejection rate
    
- Expiry rate
    
- Fields maintained
    
- Time-to-verdict
    

---

# P2 — Future Considerations

## P2.1 Auto-mode for trusted contact field updates

Once a field/action type crosses the trust threshold, it can graduate to auto-mode.

Example:

> Formatting phone numbers may auto-apply after consistently high approval rates.

## P2.2 Inline edit verdict

Allow the rep to modify the suggested value before approving.

This creates a richer verdict type:

- Approved as-is
    
- Approved with edit
    
- Rejected
    
- Expired
    

## P2.3 Duplicate detection and merge suggestions

Potential future capability, but should not ship inside v1 unless there is a dedicated safe merge flow.

## P2.4 Company Hygiene Agent

After Contact Hygiene Agent stabilizes, expand the same loop to Company records.

Potential scope:

- Company name
    
- Website
    
- Industry
    
- Employee size
    
- Location
    
- LinkedIn/company domain
    
- Parent company mapping
    
- Firmographic consistency
    

Important boundary:

- Deterministic facts from Apollo or enrichment providers remain Data Feeds.
    
- Reasoned changes or conflict resolution become Agent suggestions.
    

## P2.5 Deal Hygiene Agent

After Contact and Company hygiene rules are mature, expand to Deal records.

Potential scope:

- Missing next step
    
- Stale close date
    
- Missing amount
    
- Missing decision maker association
    
- Inconsistent stage based on activity
    
- Deal-contact relationship gaps
    

Important boundary:

- Deal hygiene fixes CRM quality.
    
- Pipeline Agent recommends what to do next.
    
- Forecasting and lead scoring remain out of scope.
    

---

## 8. Success Metrics

### Primary success metric

**Accepted contact hygiene suggestions per weekly active agent user**

This captures both usage and trust.

### Leading indicators

|Metric|What it tells us|
|---|---|
|Contact suggestions issued|Whether the agent is finding enough hygiene issues|
|Approval rate|Whether contact suggestions are useful|
|Rejection rate|Whether suggestions are noisy or wrong|
|Expiry rate|Whether reps care enough to review|
|Time-to-verdict|Whether suggestions are easy to decide on|
|Manual runs on contacts|Whether reps actively seek the agent|

### Lagging indicators

|Metric|What it tells us|
|---|---|
|Contact field completeness|Whether contact records are becoming cleaner|
|Repeated missing-field rate|Whether hygiene issues reduce over time|
|Downstream signal quality|Whether Signals and Zulie benefit from cleaner contact data|
|Rep time saved|Whether the agent reduces manual CRM work|
|Auto-mode eligible contact fields|Whether the trust loop is working|

### Suggested targets

30 days after launch:

- 40%+ of eligible reps receive at least one Contact Hygiene Agent suggestion
    
- 50%+ approval rate on supported contact field suggestions
    
- Less than 25% expiry rate
    
- Median time-to-verdict under 24 hours
    
- At least 2 contact field/action types show improving accept-rate delta
    

90 days after launch:

- 65%+ approval rate on mature contact suggestion types
    
- 20%+ reduction in missing supported fields on active Contact records
    
- At least one low-risk contact field/action type eligible for auto-mode review
    

---

## 9. Open Questions

### Blocking

1. **Which Contact fields are supported in v1?**
    
    - Owner: Product + Engineering
        
    - Need a locked field list before implementation.
        
2. **What is the confidence threshold for creating a Contact suggestion?**
    
    - Owner: Data/AI + Product
        
    - Needed to avoid noisy suggestions.
        
3. **What is the expiry window for pending suggestions?**
    
    - Owner: Product
        
    - Suggested default: 7 days.
        
4. **What sources can Contact Hygiene Agent use in v1?**
    
    - Owner: Engineering
        
    - Example: CRM record, meeting summary, call transcript, Apollo feed, email activity.
        
5. **Can Contact Hygiene Agent suggest changes to human-entered values?**
    
    - Owner: Product + Design
        
    - Recommended answer: yes, but only as a suggestion with clear evidence. Never silently overwrite.
        
6. **Should associated company be included in Contact v1?**
    
    - Owner: Product + Engineering
        
    - This is useful, but it touches the Company object. Include only if the association evidence is strong.
        

### Non-blocking

1. **Should rejected suggestions collect a rejection reason?**
    
    - Useful later, but not required for v1.
        
2. **Should manual runs be available at launch or fast follow?**
    
    - Product decision based on engineering effort.
        
3. **Should admins configure supported Contact fields in v1?**
    
    - Likely P1 unless enterprise customers require it.
        
4. **Should suggestions appear on the Contact page or only in the agent review flow?**
    
    - Design decision.
        

---

## 10. Timeline Considerations

### Phase 1 — Contact Hygiene Agent v1

Goal: prove the loop on one object.

Ship with:

- Contact-only eligibility
    
- Owner-scoped runs
    
- After-call / after-meeting / manual trigger
    
- Missing contact field suggestions
    
- Stale contact field suggestions
    
- Format cleanup suggestions
    
- Approval/rejection/expiry verdicts
    
- Run → Suggestion → Verdict telemetry
    

Success looks like:

- Reps approve a meaningful share of suggestions.
    
- Rejection and expiry rates stay manageable.
    
- Supported Contact fields become more complete over time.
    
- The team learns which fields are safe, noisy, or valuable.
    

---

### Phase 2 — Company Hygiene Agent

Move to companies only after Contact Hygiene Agent has stable acceptance rates.

Focus:

- Company identity fields
    
- Firmographic consistency
    
- Website/domain hygiene
    
- Company association quality
    

---

### Phase 3 — Deal Hygiene Agent

Move to deals only after Contact and Company hygiene rules are mature.

Focus:

- Deal completeness
    
- Missing stakeholders
    
- Stale close date
    
- Missing amount
    
- Deal-contact relationship gaps
    

---

## 11. One-line Definition

**Contact Hygiene Agent v1 is a first-party CRM agent that keeps rep-owned Contact records clean by detecting missing, stale, inconsistent, or poorly formatted contact fields and suggesting field-level fixes that the contact owner can approve, reject, or let expire.**

---

## 12. Scope Test

Any proposed Contact Hygiene Agent v1 work must pass this test:

> Does it produce a specific field-level suggestion on a rep-owned Contact record that the contact owner can verdict?

If yes, it may belong in Contact Hygiene Agent v1.

If no, route it elsewhere:

- Company field issue → Company Hygiene Agent later
    
- Deal field issue → Deal Hygiene Agent later
    
- Buying intent / risk / competitor mention → AI Signals
    
- Apollo-style deterministic fact → Data Feed
    
- Research synthesis → Research Agent
    
- Next step recommendation → Pipeline Agent
    
- Rep-asked update → Zulie