## 1. Problem Statement

CRM contact records become unreliable because reps move fast. Contact titles go stale, phone numbers are missing, company associations are unclear, LinkedIn URLs are absent, and meeting activity often reveals updates that never make it back into the CRM.

This creates friction for reps and weakens the CRM Intelligence layer. Reps waste time cleaning contact data manually. Managers cannot trust contact-level views. Signals, Zulie, and future agents reason over incomplete contact context.

**Contact Hygiene Agent v1 solves this by detecting missing, stale, inconsistent, or poorly formatted fields on rep-owned Contact records and suggesting field-level fixes for the contact owner to approve, reject, or let expire.**

In v1, the agent starts from meeting/call evidence. If a person states something in the transcript, the agent may use Apollo to verify or complete the contact information. But the update still happens only after approval.

Manual Run also follows the same model. The user runs it from the Agent Overview page. The system first performs a low-cost scan across the agent owner’s Contact records, checks which contacts have meeting/call transcripts and possible update needs, and only then runs deeper reasoning on eligible contacts. This keeps the run useful without wasting credits.

This is not the full Hygiene Agent across all CRM objects. Contacts are the first controlled object. Once the loop is proven and stable, Hygiene Agent can expand to Companies and Deals.

---

## 2. Jobs To Be Done

### Primary job statement

> When my contact records are incomplete or outdated after a customer interaction, I want the CRM to detect the change, verify it with available sources, and suggest the update for approval, so I can keep contact data clean without doing manual CRM cleanup.

### Functional dimension

The rep wants contact fields to stay accurate with minimal manual effort.

### Emotional dimension

The rep wants to feel confident that the CRM is helping them, not creating more review work or silently changing data.

### Social dimension

The rep wants managers and teammates to see them as organized, responsive, and on top of their relationships.

### Hiring criteria

Users would hire Contact Hygiene Agent because:

- It catches missing or stale contact fields from meeting/call context.
- It can use Apollo to verify or complete contact information. 
- It turns contact cleanup into simple approve/reject decisions.
- It explains why a contact field update is being suggested.
- It allows the user to manually check owned contacts from the Agent Overview page.
    
- It avoids wasting credits by scanning eligibility before deeper reasoning.
    
- It improves over time based on the rep’s verdicts.
    

### Firing criteria

Users would stop trusting or using Contact Hygiene Agent if:

- Suggestions are too obvious, noisy, or low-value.
    
- It suggests Apollo values without meeting/call evidence.
    
- It updates contact fields without approval.
    
- It overwrites human-entered values silently.
    
- Manual Run consumes credits without useful suggestions.
    
- Manual Run scans contacts the user does not own.
    
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
        
4. **Use Apollo as supporting evidence, not silent automation**
    
    - Apollo can help verify or complete a suggestion, but the rep must approve before the Contact record changes.
        
5. **Allow controlled manual cleanup from Agent Overview**
    
    - Users should be able to run Contact Hygiene Agent manually without selecting each Contact one by one.
        
6. **Keep Manual Run low-cost**
    
    - The system should perform a lightweight eligibility scan before deeper AI reasoning.
        
7. **Improve suggestion quality over time**
    
    - Accepted, rejected, and expired suggestions should change future Hygiene Agent behavior inside that workspace.
        

### Business goals

1. **Prove the agent learning loop on one CRM object**
    
    - Contacts become the first controlled surface for validating Suggestion → Verdict → Learning.
        
2. **Improve downstream intelligence quality**
    
    - Cleaner Contact records should improve AI Signals, Zulie answers, and future agent suggestions.
        
3. **Create measurable proof of CRM Intelligence value**
    
    - Value should be measurable through accepted suggestions, contact fields maintained, manual cleanup usage, and time saved.
        
4. **Control AI credit usage**
    
    - Manual Run should not become an expensive broad scan. It should reason only on eligible Contacts.
        

---

## 4. Non-Goals

|Non-goal|Why it is out of scope|
|---|---|
|Company object hygiene|More complex ownership and source-of-truth rules. Move here after Contact Agent stabilizes|
|Deal object hygiene|Higher business impact. Deal stage, amount, close date, and forecast fields need stricter guardrails|
|Autonomous field updates without approval|v1 must earn trust through verdicts before auto-mode|
|Apollo auto-fill without meeting/call evidence|v1 uses Apollo only as supporting evidence inside the suggestion loop|
|Apollo-only enrichment runs|v1 is not a standalone enrichment feed. The trigger must come from contact activity evidence|
|Manual Run across all workspace contacts|Too broad, costly, and risky. Manual Run is scoped to the agent owner’s Contacts only|
|Manual Run on Company or Deal records|v1 is Contact-only|
|Manual Contact picker from the agent page|v1 does not require selecting contacts manually. The agent scans eligible owned Contacts automatically|
|Research-style enrichment|Broader outside synthesis belongs to Research Agent|
|Duplicate contact merging|High-risk action with data loss potential|
|Bulk contact cleanup with direct writes|v1 may scan multiple owned Contacts, but every output remains an approval-based suggestion|
|Lead scoring or buying intent|Belongs to AI Signals, not Hygiene Agent|
|Next-best actions|Belongs to Pipeline Agent or another action agent|
|Prospect outreach or email sending|External communication has higher blast radius and is not hygiene work|

---

## 5. User Stories

### P0 user stories

1. **As a sales rep, I want the agent to detect missing important fields on my Contact records so that I do not have to manually audit every contact.**
    
2. **As a sales rep, I want the agent to use meeting/call transcripts as the trigger for contact updates so that suggestions are grounded in real customer interactions.**
    
3. **As a sales rep, I want the agent to use Apollo to verify or complete contact information so that suggested updates are more accurate.**
    
4. **As a sales rep, I want to review each suggested contact field update before it is applied so that I stay in control of my CRM data.**
    
5. **As a sales rep, I want to see why the agent suggested a contact field change so that I can trust the recommendation.**
    
6. **As a sales rep, I want to reject wrong contact suggestions so that the system learns not to repeat similar mistakes.**
    
7. **As a sales rep, I want to manually run the agent from the Agent Overview page so that I can check whether my owned contacts need hygiene updates.**
    
8. **As a sales rep, I want Manual Run to check only contacts I own with meeting/call transcripts so that the agent does not waste credits or surface irrelevant records.**
    
9. **As a sales manager, I want accepted contact hygiene suggestions to improve contact completeness so that CRM data becomes more reliable.**
    

### P1 user stories

10. **As a sales rep, I want repeated low-confidence contact suggestions to be suppressed so that my approval queue does not become noisy.**
    
11. **As a sales rep, I want manual-run suggestions grouped by Contact so that I can review updates quickly.**
    
12. **As a manager, I want to see Contact Hygiene Agent acceptance rates so that I can judge whether the agent is useful or noisy.**
    
13. **As a manager, I want to see Manual Run usage and outcomes so that I know whether reps are actively using the agent to maintain contact data.**
    

### P2 user stories

14. **As a sales rep, I want trusted low-risk contact updates to auto-apply after the agent earns enough approvals so that I review only the changes that need judgment.**
    
15. **As an admin, I want to configure which contact fields the agent can suggest updates for so that it matches our CRM process.**
    
16. **As a sales rep, I want to manually run the agent on a selected Contact later if I need a record-specific cleanup check.**
    

---

## 6. Requirements

## Must-Have — P0

### P0.1 Contact-only eligibility

Contact Hygiene Agent v1 must run only on Contact records owned by the reviewing rep.

Eligible:

- Contact is owned by the rep
    
- Contact owner is the same as the agent owner
    
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
    
- Given the record is a Company or Deal  
    When Hygiene Agent v1 runs  
    Then no suggestion is created.
    
- Given the contact is not owned by the agent owner  
    When Hygiene Agent runs  
    Then no suggestion is shown to that user.
    

---

### P0.2 Enable-only agent activation

Contact Hygiene Agent v1 uses an enable-only model.

The user opens the agent and clicks **Enable**. There is no setup form, no custom builder, no editable guardrail configuration, and no per-user setup flow in v1.

After enablement:

- Agent status becomes Live
    
- Triggered runs can start
    
- Manual Run becomes available from the Agent Overview page
    
- Suggestions appear under Pending approval when created
    

### Acceptance criteria

- Given the agent is not enabled  
    When the user opens the agent page  
    Then the primary action is Enable.
    
- Given the user clicks Enable  
    When enablement succeeds  
    Then the agent becomes Live.
    
- Given the agent is Live  
    When the user opens Agent Overview  
    Then Run Agent is available.
    

---

### P0.3 Supported triggers

Contact Hygiene Agent v1 should run from approved CRM Intelligence triggers.

Initial triggers:

- After call
    
- After meeting
    
- Manual Run from Agent Overview
    

Email-triggered hygiene can be added only if email activity is already reliably available in the shared context layer.

### Acceptance criteria

- Given a meeting ends and the contact has new information  
    When Hygiene Agent runs  
    Then it evaluates eligible contact fields for missing, stale, or conflicting values.
    
- Given a call transcript includes contact information stated by the person  
    When Hygiene Agent runs  
    Then it can create a contact field suggestion using the transcript as evidence.
    
- Given the user clicks Run Agent from Agent Overview  
    When Manual Run starts  
    Then the system scans eligible owned Contacts with meeting/call transcripts.
    

---

### P0.4 Manual Run from Agent Overview

Manual Run allows the agent owner to intentionally run Contact Hygiene Agent from the Agent Overview page.

This is not a broad workspace scan. It is a scoped hygiene check that only evaluates Contact records where:

- The Contact owner is the same as the agent owner
    
- The Contact has at least one meeting or call transcript
    
- The transcript has not already been fully processed for the same hygiene issue
    
- The Contact has at least one supported field that may need an update
    

Manual Run does not change the trust model.

> Detect → suggest → owner verdict → update only after approval.

Manual Run should not require the user to manually select a Contact in v1.

### Acceptance criteria

- Given the user is on the Agent Overview page  
    When they click Run Agent  
    Then Manual Run starts.
    
- Given Manual Run starts  
    When the system scans records  
    Then it scans only Contacts owned by the agent owner.
    
- Given a Contact is owned by another rep  
    When Manual Run scans records  
    Then that Contact is skipped.
    
- Given a Contact has no meeting or call transcript  
    When Manual Run scans records  
    Then that Contact is skipped before heavy AI reasoning.
    
- Given a Contact has no supported field that may need an update  
    When Manual Run scans records  
    Then that Contact is skipped before heavy AI reasoning.
    
- Given eligible Contacts are found  
    When the agent detects supported hygiene issues  
    Then field-level suggestions are created under Pending approval.
    

---

### P0.5 Manual Run credit guardrail

Manual Run should be low-credit by design.

The system should first perform a lightweight eligibility scan before running deeper AI reasoning.

### Step 1 — Low-cost eligibility scan

Before using transcript reasoning, the system checks:

- Contact owner = agent owner
    
- Contact has meeting/call transcript
    
- Transcript is new or not already processed
    
- Contact has supported fields that are empty, stale, inconsistent, or poorly formatted
    
- No duplicate pending suggestion already exists
    

Contacts that fail this scan are skipped.

### Step 2 — AI reasoning only on eligible contacts

The agent should run deeper reasoning only on Contacts that pass the eligibility scan.

This prevents credit waste from scanning contacts that:

- Are not owned by the user
    
- Have no transcript
    
- Have no possible update
    
- Already have pending suggestions
    
- Were already processed recently
    

### Step 3 — Suggestions only when evidence is strong

If the agent does not find enough evidence for a field update, it should not create a suggestion.

No guessing.

### Acceptance criteria

- Given Manual Run starts  
    When contacts are scanned  
    Then the low-cost eligibility scan runs before transcript reasoning.
    
- Given no eligible Contacts are found  
    When the scan completes  
    Then no heavy AI reasoning is triggered.
    
- Given eligible Contacts are found  
    When deeper reasoning runs  
    Then it runs only on eligible Contacts.
    
- Given evidence is weak  
    When reasoning completes  
    Then no suggestion is created.
    

---

### P0.6 Manual Run output states

Manual Run must produce clear output states.

### 1. Suggestions found

If the agent finds supported hygiene updates, the run appears under Pending approval.

Example message:

> “5 contact updates suggested across 3 contacts.”

Suggestions should be grouped by Contact.

Example:

- Priya Raman — 2 suggested updates
    
- Arjun Mehta — 1 suggested update
    
- Kavya Nair — 2 suggested updates
    

### 2. No eligible contacts found

If the user has no owned Contacts with meeting/call transcripts, no heavy AI reasoning should run.

Message:

> “No eligible contacts found. Manual Run only checks contacts you own with meeting or call transcripts.”

### 3. Eligible contacts found, but no updates needed

If eligible Contacts exist but no hygiene issues are found, the run should complete without suggestions.

Message:

> “No contact hygiene updates needed.”

This run appears under Past runs.

### 4. Not enough evidence

If a Contact has a transcript but the transcript does not provide enough evidence for a supported update, no suggestion should be created.

Message:

> “Some contacts were checked, but no update was suggested because evidence was insufficient.”

### 5. Duplicate pending suggestions exist

If the same suggestion is already pending, Manual Run should not create another copy.

Instead:

- Keep the existing pending suggestion
    
- Optionally refresh the proof statement if new evidence exists
    
- Show that the suggestion is already awaiting review
    

Message:

> “Existing pending suggestions were found and not duplicated.”

### Acceptance criteria

- Given suggestions are found  
    When Manual Run completes  
    Then the run appears under Pending approval.
    
- Given no eligible Contacts are found  
    When Manual Run completes  
    Then the user sees “No eligible contacts found.”
    
- Given eligible Contacts exist but no update is needed  
    When Manual Run completes  
    Then the run appears under Past with “No contact hygiene updates needed.”
    
- Given duplicate pending suggestions exist  
    When Manual Run completes  
    Then duplicate suggestions are not created.
    

---

### P0.7 Apollo-assisted suggestion rule

Contact Hygiene Agent v1 may use Apollo as a supporting evidence source, but only inside the suggestion loop.

Apollo should not directly update Contact records in v1. Apollo can verify, complete, or strengthen a suggestion when there is relevant meeting/call evidence.

### Allowed behavior

- Transcript mentions a title, and Apollo confirms the title.
    
- Transcript mentions role/function, and Apollo provides the formal job title.
    
- Transcript or email domain identifies the company, and Apollo helps confirm the company association.
    
- Contact identity is clear, and Apollo provides a missing LinkedIn URL.
    
- Apollo is shown as one evidence source in the suggestion.
    

### Not allowed behavior

- Apollo auto-fills fields without approval.
    
- Apollo suggests values without meeting/call evidence.
    
- Apollo creates new fields.
    
- Apollo updates Company or Deal records inside Contact Hygiene Agent v1.
    
- Apollo overrides a recent human-entered value.
    

### Acceptance criteria

- Given a transcript states that the contact leads revenue operations  
    And Apollo confirms the contact’s title as Head of Revenue Operations  
    When Hygiene Agent creates a suggestion  
    Then the suggestion shows transcript + Apollo as evidence.
    
- Given Apollo has a title for a contact  
    But there is no meeting/call evidence supporting a change  
    When Hygiene Agent runs  
    Then no v1 contact hygiene suggestion is created.
    
- Given the rep approves an Apollo-assisted suggestion  
    When the verdict is logged  
    Then the Contact record is updated.
    
- Given the rep rejects an Apollo-assisted suggestion  
    When the verdict is logged  
    Then the Contact record remains unchanged.
    

---

### P0.8 Supported contact suggestion types

Contact Hygiene Agent v1 can suggest field-level updates only.

Allowed v1 suggestion types:

1. **Missing contact field suggestion**
    
    - Example: Job title is empty, but the call transcript says “VP Sales.”
        
2. **Stale contact field suggestion**
    
    - Example: Existing title is “Sales Manager,” but recent meeting context indicates “Head of Revenue.”
        
3. **Apollo-assisted field suggestion**
    
    - Example: Transcript says the person leads revenue operations, and Apollo confirms the title as “Head of Revenue Operations.”
        
4. **Format cleanup suggestion**
    
    - Example: Phone number, email casing, country, or LinkedIn URL format is inconsistent.
        
5. **Conflict flag with suggested replacement**
    
    - Example: CRM says contact belongs to Company A, but recent activity and email domain indicate Company B.
        
6. **Association suggestion**
    
    - Example: Contact has no associated company, but the email domain, transcript, and Apollo evidence clearly point to Acme Corp.
        

Not allowed in v1:

- Company field updates
    
- Deal field updates
    
- Deal stage changes
    
- Forecast category changes
    
- Lead score updates
    
- Duplicate merges
    
- Bulk edits with direct writes
    
- Prospect-facing actions
    

### Acceptance criteria

- Given the agent detects a missing supported Contact field  
    When it has enough evidence  
    Then it creates a field update suggestion.
    
- Given the agent detects a possible issue in a Company or Deal field  
    When the run completes  
    Then no Hygiene Agent v1 suggestion is created.
    

---

### P0.9 Supported contact fields

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

### P0.10 Suggestion object

Every Contact Hygiene Agent suggestion must include:

- Contact ID
    
- Contact name
    
- Field name
    
- Current value
    
- Suggested value
    
- Proof statement
    
- Evidence/source
    
- Confidence level
    
- Agent run ID
    
- Trigger type
    
- Suggestion status: pending / approved / rejected / expired
    

For Apollo-assisted suggestions, evidence/source must explicitly show Apollo.

Confidence should be categorical:

- Very High
    
- High
    
- Medium
    
- Low
    

Low-confidence suggestions should not be shown unless the team explicitly decides to expose them for review.

### Acceptance criteria

- Given a suggestion is created  
    When the rep opens the review flow  
    Then they can see the current value, suggested value, proof statement, evidence, and confidence level.
    
- Given Apollo was used as supporting evidence  
    When the suggestion is shown  
    Then Apollo appears clearly as an evidence source.
    
- Given evidence is unavailable  
    When the agent considers creating a suggestion  
    Then the suggestion should not be created.
    

---

### P0.11 Verdict flow

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

### P0.12 No silent overwrite

Contact Hygiene Agent must never silently overwrite human-entered values.

It may suggest a change to a human-entered value only when it has clear evidence. The rep’s approval is required before the value changes.

Apollo data cannot silently overwrite human-entered values.

### Acceptance criteria

- Given a Contact field has a human-entered value  
    When Hygiene Agent detects a possible correction  
    Then it creates a suggestion instead of changing the field directly.
    
- Given Apollo contains a different value from the CRM  
    When the CRM value was recently entered by a human  
    Then the agent does not overwrite the value silently.
    
- Given a rep rejects a suggested correction  
    When the same evidence appears again  
    Then the agent should not repeatedly suggest the same change without new evidence.
    

---

### P0.13 Evidence hierarchy

When creating a Contact Hygiene suggestion, the agent should prioritize evidence in this order:

1. Recent human-entered value
    
2. Explicit meeting or call transcript mention
    
3. Email signature or email context
    
4. Apollo-confirmed contact data
    
5. Older CRM value
    

Apollo supports the suggestion. It does not replace the rep’s judgment.

### Acceptance criteria

- Given transcript evidence and Apollo evidence conflict  
    When the agent creates a suggestion  
    Then the proof statement must explain the conflict or avoid creating the suggestion.
    
- Given Apollo conflicts with a recent human-entered value  
    When Hygiene Agent runs  
    Then the agent should not create a suggestion unless stronger transcript evidence supports it.
    

---

### P0.14 Learning loop

Every verdict must feed the learning model per workspace.

At minimum, the system must track rolling accept, reject, and expiry rates by:

- Workspace
    
- Agent
    
- Contact field
    
- Action type
    
- Evidence type
    
- Trigger type
    
- Agent version
    

Evidence type should distinguish:

- Transcript-only
    
- Apollo-assisted
    
- Email-assisted
    
- Format-only
    
- CRM-conflict
    
- Manual-run generated
    
- Trigger-generated
    

### Acceptance criteria

- Given a suggestion receives a verdict  
    When analytics are updated  
    Then the relevant accept/reject/expiry rates update.
    
- Given Apollo-assisted suggestions receive high rejection rates  
    When rejection crosses the threshold  
    Then Apollo-assisted suggestions for that field type should be flagged for review.
    
- Given Manual Run suggestions receive high rejection rates  
    When rejection crosses the threshold  
    Then manual-run suggestion quality should be flagged for review.
    
- Given accept rate drops after an agent version change  
    When the drop crosses the regression threshold  
    Then the agent version should be flagged for review.
    

---

### P0.15 Review surface

Contact Hygiene Agent suggestions must appear in the existing agent review flow.

The rep should be able to review suggestions from:

- Agent detail page
    
- Run history
    
- Contact record page review entry point, if available
    

For Manual Run, suggestions should be grouped by Contact.

### Acceptance criteria

- Given Contact Hygiene Agent creates suggestions  
    When the rep opens the agent run  
    Then pending suggestions are visible under Pending approval.
    
- Given Manual Run creates suggestions across multiple Contacts  
    When the rep opens the review flow  
    Then suggestions are grouped by Contact.
    
- Given all suggestions in a run are approved, rejected, or expired  
    When the run is viewed later  
    Then it appears under Past.
    

---

## Nice-to-Have — P1

### P1.1 Suggestion grouping improvements

Group multiple contact hygiene suggestions from the same run into one review flow.

Example:

> “3 suggested updates for Priya Raman.”

For Manual Run:

> “5 contact updates suggested across 3 contacts.”

---

### P1.2 Field-level suppression

If a rep repeatedly rejects suggestions for the same contact field type, reduce future suggestion frequency for that field.

---

### P1.3 Admin field configuration

Allow admins to define which Contact fields Hygiene Agent can evaluate.

---

### P1.4 Basic quality dashboard

Show:

- Total contact hygiene suggestions
    
- Approval rate
    
- Rejection rate
    
- Expiry rate
    
- Fields maintained
    
- Time-to-verdict
    
- Apollo-assisted suggestion approval rate
    
- Manual Run count
    
- Manual Run suggestions created
    
- Manual Run no-update rate
    

---

### P1.5 Manual Run progress state

Show a lightweight running state after the user clicks Run Agent.

Suggested states:

- Scanning owned contacts
    
- Checking transcript availability
    
- Evaluating eligible contacts
    
- Preparing suggestions
    
- Run complete
    

---

### P1.6 All caught up state

When there are no pending suggestions but the agent has past runs, show:

> “All caught up. No pending contact updates.”

---

## Future Considerations — P2

### P2.1 Auto-mode for trusted contact field updates

Once a field/action type crosses the trust threshold, it can graduate to auto-mode.

Example:

> Formatting phone numbers may auto-apply after consistently high approval rates.

Apollo-assisted suggestions should not enter auto-mode until their accept rate is proven separately.

---

### P2.2 Inline edit verdict

Allow the rep to modify the suggested value before approving.

This creates a richer verdict type:

- Approved as-is
    
- Approved with edit
    
- Rejected
    
- Expired
    

---

### P2.3 Manual Run on a selected Contact

Future versions may allow the user to run Contact Hygiene Agent from a specific Contact record.

This is not v1. In v1, Manual Run lives on the Agent Overview page and scans eligible owned Contacts.

---

### P2.4 Apollo-only enrichment feed

A future Data Feed surface may auto-populate deterministic Apollo data with attribution.

This is not v1. In v1, Apollo is only used inside the Contact Hygiene suggestion loop.

---

### P2.5 Duplicate detection and merge suggestions

Potential future capability, but should not ship inside v1 unless there is a dedicated safe merge flow.

---

### P2.6 Company Hygiene Agent

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
    

---

### P2.7 Deal Hygiene Agent

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

## 7. Success Metrics

### Primary success metric

**Accepted contact hygiene suggestions per weekly active agent user**

This captures both usage and trust.

### Leading indicators

|Metric|What it tells us|
|---|---|
|Contact suggestions issued|Whether the agent is finding enough hygiene issues|
|Approval rate|Whether contact suggestions are useful|
|Apollo-assisted approval rate|Whether Apollo improves suggestion quality|
|Manual Run usage|Whether users actively use the overview-level Run Agent action|
|Manual Run suggestions created|Whether Manual Run finds useful work|
|Manual Run no-update rate|Whether Manual Run is too broad or appropriately filtered|
|Heavy reasoning rate|Whether the low-cost eligibility scan is protecting credits|
|Rejection rate|Whether suggestions are noisy or wrong|
|Expiry rate|Whether reps care enough to review|
|Time-to-verdict|Whether suggestions are easy to decide on|

### Lagging indicators

|Metric|What it tells us|
|---|---|
|Contact field completeness|Whether contact records are becoming cleaner|
|Repeated missing-field rate|Whether hygiene issues reduce over time|
|Downstream signal quality|Whether Signals and Zulie benefit from cleaner contact data|
|Rep time saved|Whether the agent reduces manual CRM work|
|Auto-mode eligible contact fields|Whether the trust loop is working|
|Apollo-assisted suggestion quality|Whether Apollo is useful as supporting evidence|
|Credit efficiency per accepted suggestion|Whether the agent creates value without unnecessary AI cost|

### Suggested targets

30 days after launch:

- 40%+ of eligible reps receive at least one Contact Hygiene Agent suggestion
    
- 50%+ approval rate on supported contact field suggestions
    
- Apollo-assisted suggestions perform equal to or better than transcript-only suggestions
    
- Less than 25% expiry rate
    
- Median time-to-verdict under 24 hours
    
- At least 2 contact field/action types show improving accept-rate delta
    
- Manual Run does not trigger heavy reasoning when no eligible Contacts exist
    

90 days after launch:

- 65%+ approval rate on mature contact suggestion types
    
- 20%+ reduction in missing supported fields on active Contact records
    
- At least one low-risk contact field/action type eligible for auto-mode review
    
- Apollo-assisted suggestions show stable or improving approval rates by field type
    
- Manual Run creates accepted suggestions often enough to justify keeping it on the Agent Overview page
    

---

## 8. Open Questions

### Blocking

1. **Which Contact fields are supported in v1?**
    
    - Owner: Product + Engineering
        
    - Need a locked field list before implementation.
        
2. **What is the confidence threshold for creating a Contact suggestion?**
    
    - Owner: Data/AI + Product
        
    - Needed to avoid noisy suggestions.
        
3. **What is the minimum evidence needed to use Apollo?**
    
    - Owner: Product + AI
        
    - Recommended answer: Apollo can be used only when meeting/call/email context identifies the contact or field need.
        
4. **What is the expiry window for pending suggestions?**
    
    - Owner: Product
        
    - Suggested default: 7 days.
        
5. **What sources can Contact Hygiene Agent use in v1?**
    
    - Owner: Engineering
        
    - Example: CRM record, meeting summary, call transcript, Apollo feed, email activity.
        
6. **Can Contact Hygiene Agent suggest changes to human-entered values?**
    
    - Owner: Product + Design
        
    - Recommended answer: yes, but only as a suggestion with clear evidence. Never silently overwrite.
        
7. **Should associated company be included in Contact v1?**
    
    - Owner: Product + Engineering
        
    - This is useful, but it touches the Company object. Include only if the association evidence is strong.
        
8. **How far back should Manual Run scan transcripts?**
    
    - Owner: Product + Engineering
        
    - Need a window to avoid repeatedly scanning old meetings. Suggested starting point: unprocessed transcripts from the last 30 days.
        
9. **What counts as already processed for Manual Run?**
    
    - Owner: Engineering
        
    - Need a processed transcript/contact/field marker so the agent avoids duplicate reasoning.
        
10. **What is the maximum number of Contacts Manual Run can evaluate in one run?**
    

- Owner: Product + Engineering
    
- Needed for credit control and performance. Suggested starting point: cap by eligible contacts after the low-cost scan.
    

### Non-blocking

1. **Should rejected suggestions collect a rejection reason?**
    
    - Useful later, but not required for v1.
        
2. **Should Manual Run show a detailed scan summary?**
    
    - Example: “42 contacts scanned · 8 eligible · 3 suggestions created.”
        
3. **Should admins configure supported Contact fields in v1?**
    
    - Likely P1 unless enterprise customers require it.
        
4. **Should suggestions appear on the Contact page or only in the agent review flow?**
    
    - Design decision.
        
5. **Should Apollo-assisted suggestions have a separate confidence threshold?**
    
    - Useful later if Apollo data creates noisy suggestions.
        

---

## 9. Timeline Considerations

### Phase 1 — Contact Hygiene Agent v1

Goal: prove the loop on one object.

Ship with:

- Enable-only activation
    
- Contact-only eligibility
    
- Owner-scoped runs
    
- After-call / after-meeting trigger
    
- Manual Run from Agent Overview
    
- Low-cost eligibility scan for Manual Run
    
- Missing contact field suggestions
    
- Stale contact field suggestions
    
- Format cleanup suggestions
    
- Apollo-assisted suggestions where meeting/call evidence exists
    
- Approval/rejection/expiry verdicts
    
- Run → Suggestion → Verdict telemetry
    

Success looks like:

- Reps approve a meaningful share of suggestions.
    
- Rejection and expiry rates stay manageable.
    
- Apollo-assisted suggestions improve quality without creating noise.
    
- Manual Run finds useful contact updates without wasting credits.
    
- Supported Contact fields become more complete over time.
    
- The team learns which fields are safe, noisy, or valuable.
    

---

### Phase 2 — Contact Hygiene quality improvements

Add:

- Better suggestion grouping
    
- Manual Run progress states
    
- Manual Run scan summary
    
- Field-level suppression
    
- “All caught up” empty state
    
- Basic quality dashboard
    
- Manual Run credit-efficiency analytics
    

---

### Phase 3 — Company Hygiene Agent

Move to companies only after Contact Hygiene Agent has stable acceptance rates.

Focus:

- Company identity fields
    
- Firmographic consistency
    
- Website/domain hygiene
    
- Company association quality
    

---

### Phase 4 — Deal Hygiene Agent

Move to deals only after Contact and Company hygiene rules are mature.

Focus:

- Deal completeness
    
- Missing stakeholders
    
- Stale close date
    
- Missing amount
    
- Deal-contact relationship gaps
    

---

### One-line Definition

**Contact Hygiene Agent v1 is a first-party CRM agent that keeps rep-owned Contact records clean by detecting missing, stale, inconsistent, or poorly formatted contact fields from CRM activity, optionally using Apollo as supporting evidence, and suggesting field-level fixes that the contact owner can approve, reject, or let expire. Manual Run lives on the Agent Overview page and scans only the agent owner’s eligible Contacts with meeting/call transcripts before running deeper reasoning.**

---

### Scope Test

Any proposed Contact Hygiene Agent v1 work must pass this test:

> Does it produce a specific field-level suggestion on a rep-owned Contact record, grounded in contact activity evidence, that the contact owner can verdict?

If yes, it may belong in Contact Hygiene Agent v1.

If no, route it elsewhere:

- Company field issue → Company Hygiene Agent later
    
- Deal field issue → Deal Hygiene Agent later
    
- Apollo auto-fill without activity evidence → Future Data Feed
    
- Buying intent / risk / competitor mention → AI Signals
    
- Broad research synthesis → Research Agent
    
- Next step recommendation → Pipeline Agent
    
- Rep-asked update → Zulie