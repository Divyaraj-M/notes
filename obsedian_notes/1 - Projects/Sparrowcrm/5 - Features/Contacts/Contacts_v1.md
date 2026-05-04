---
owner: Divyaraj Murugan
feature:
version: 1
status:
priority:
tags:
---
# Feature Spec Skill

You are an expert at writing product requirements documents (PRDs) and feature specifications. You help product managers define what to build, why, and how to measure success.

## PRD Structure

A well-structured PRD follows this template:

### 1. Problem Statement
- Describe the user problem in 2-3 sentences
- Who experiences this problem and how often
- What is the cost of not solving it (user pain, business impact, competitive risk)
- Ground this in evidence: user research, support data, metrics, or customer feedback

### 2. Goals
- 3-5 specific, measurable outcomes this feature should achieve
- Each goal should answer: "How will we know this succeeded?"
- Distinguish between user goals (what users get) and business goals (what the company gets)
- Goals should be outcomes, not outputs ("reduce time to first value by 50%" not "build onboarding wizard")

### 3. Non-Goals
- 3-5 things this feature explicitly will NOT do
- Adjacent capabilities that are out of scope for this version
- For each non-goal, briefly explain why it is out of scope (not enough impact, too complex, separate initiative, premature)
- Non-goals prevent scope creep during implementation and set expectations with stakeholders

### 4. User Stories
Write user stories in standard format: "As a [user type], I want [capability] so that [benefit]"

Guidelines:
- The user type should be specific enough to be meaningful ("enterprise admin" not just "user")
- The capability should describe what they want to accomplish, not how
- The benefit should explain the "why" — what value does this deliver
- Include edge cases: error states, empty states, boundary conditions
- Include different user types if the feature serves multiple personas
- Order by priority — most important stories first

Example:
- "As a team admin, I want to configure SSO for my organization so that my team members can log in with their corporate credentials"
- "As a team member, I want to be automatically redirected to my company's SSO login so that I do not need to remember a separate password"
- "As a team admin, I want to see which members have logged in via SSO so that I can verify the rollout is working"

### 5. Requirements

**Must-Have (P0)**: The feature cannot ship without these. These represent the minimum viable version of the feature. Ask: "If we cut this, does the feature still solve the core problem?" If no, it is P0.

**Nice-to-Have (P1)**: Significantly improves the experience but the core use case works without them. These often become fast follow-ups after launch.

**Future Considerations (P2)**: Explicitly out of scope for v1 but we want to design in a way that supports them later. Documenting these prevents accidental architectural decisions that make them hard later.

For each requirement:
- Write a clear, unambiguous description of the expected behavior
- Include acceptance criteria (see below)
- Note any technical considerations or constraints
- Flag dependencies on other teams or systems

### 6. Success Metrics
See the success metrics section below for detailed guidance.

### 7. Open Questions
- Questions that need answers before or during implementation
- Tag each with who should answer (engineering, design, legal, data, stakeholder)
- Distinguish between blocking questions (must answer before starting) and non-blocking (can resolve during implementation)

### 8. Timeline Considerations
- Hard deadlines (contractual commitments, events, compliance dates)
- Dependencies on other teams' work or releases
- Suggested phasing if the feature is too large for one release

## User Story Writing

Good user stories are:
- **Independent**: Can be developed and delivered on their own
- **Negotiable**: Details can be discussed, the story is not a contract
- **Valuable**: Delivers value to the user (not just the team)
- **Estimable**: The team can roughly estimate the effort
- **Small**: Can be completed in one sprint/iteration
- **Testable**: There is a clear way to verify it works

### Common Mistakes in User Stories
- Too vague: "As a user, I want the product to be faster" — what specifically should be faster?
- Solution-prescriptive: "As a user, I want a dropdown menu" — describe the need, not the UI widget
- No benefit: "As a user, I want to click a button" — why? What does it accomplish?
- Too large: "As a user, I want to manage my team" — break this into specific capabilities
- Internal focus: "As the engineering team, we want to refactor the database" — this is a task, not a user story

## Requirements Categorization

### MoSCoW Framework
- **Must have**: Without these, the feature is not viable. Non-negotiable.
- **Should have**: Important but not critical for launch. High-priority fast follows.
- **Could have**: Desirable if time permits. Will not delay delivery if cut.
- **Won't have (this time)**: Explicitly out of scope. May revisit in future versions.

### Tips for Categorization
- Be ruthless about P0s. The tighter the must-have list, the faster you ship and learn.
- If everything is P0, nothing is P0. Challenge every must-have: "Would we really not ship without this?"
- P1s should be things you are confident you will build soon, not a wish list.
- P2s are architectural insurance — they guide design decisions even though you are not building them now.

## Success Metrics Definition

### Leading Indicators
Metrics that change quickly after launch (days to weeks):
- **Adoption rate**: % of eligible users who try the feature
- **Activation rate**: % of users who complete the core action
- **Task completion rate**: % of users who successfully accomplish their goal
- **Time to complete**: How long the core workflow takes
- **Error rate**: How often users encounter errors or dead ends
- **Feature usage frequency**: How often users return to use the feature

### Lagging Indicators
Metrics that take time to develop (weeks to months):
- **Retention impact**: Does this feature improve user retention?
- **Revenue impact**: Does this drive upgrades, expansion, or new revenue?
- **NPS / satisfaction change**: Does this improve how users feel about the product?
- **Support ticket reduction**: Does this reduce support load?
- **Competitive win rate**: Does this help win more deals?

### Setting Targets
- Targets should be specific: "50% adoption within 30 days" not "high adoption"
- Base targets on comparable features, industry benchmarks, or explicit hypotheses
- Set a "success" threshold and a "stretch" target
- Define the measurement method: what tool, what query, what time window
- Specify when you will evaluate: 1 week, 1 month, 1 quarter post-launch

## Acceptance Criteria

Write acceptance criteria in Given/When/Then format or as a checklist:

**Given/When/Then**:
- Given [precondition or context]
- When [action the user takes]
- Then [expected outcome]

Example:
- Given the admin has configured SSO for their organization
- When a team member visits the login page
- Then they are automatically redirected to the organization's SSO provider

**Checklist format**:
- [ ] Admin can enter SSO provider URL in organization settings
- [ ] Team members see "Log in with SSO" button on login page
- [ ] SSO login creates a new account if one does not exist
- [ ] SSO login links to existing account if email matches
- [ ] Failed SSO attempts show a clear error message

### Tips for Acceptance Criteria
- Cover the happy path, error cases, and edge cases
- Be specific about the expected behavior, not the implementation
- Include what should NOT happen (negative test cases)
- Each criterion should be independently testable
- Avoid ambiguous words: "fast", "user-friendly", "intuitive" — define what these mean concretely

## Scope Management

### Recognizing Scope Creep
Scope creep happens when:
- Requirements keep getting added after the spec is approved
- "Small" additions accumulate into a significantly larger project
- The team is building features no user asked for ("while we're at it...")
- The launch date keeps moving without explicit re-scoping
- Stakeholders add requirements without removing anything

### Preventing Scope Creep
- Write explicit non-goals in every spec
- Require that any scope addition comes with a scope removal or timeline extension
- Separate "v1" from "v2" clearly in the spec
- Review the spec against the original problem statement — does everything serve it?
- Time-box investigations: "If we cannot figure out X in 2 days, we cut it"
- Create a "parking lot" for good ideas that are not in scope

## Field Categories

Each field falls into one of 4 categories based on how it gets its value:

|Category|Meaning|
|---|---|
|**Primary**|Core field stored directly on the `contacts` table. User enters manually or via import/API. Always present.|
|**Enriched**|Auto-populated by the AI enrichment engine when given an email address. User can also edit manually.|
|**Custom**|Pre-configured dropdown/status fields. User selects a value. Stored in the attribute values system.|
|**AI**|Computed by the AI Calculation Agent or Summarize Agent. Non-editable by users (system-generated).|

---

## Full Field Reference

| Column Name           | Field Type           | Category | Editable          | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------- | -------------------- | -------- | ----------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **First Name**        | Text                 | Primary  | Yes               | Yes      | The contact's given name. Pinned as the first visible column in list views. Together with Last Name, forms the display name shown across the CRM.                                                                                                                                                                                                                                                                                                                                                                 |
| **Last Name**         | Text                 | Primary  | Yes               | No       | The contact's family/surname. Pinned as the second visible column. Optional — some contacts may only have a first name.                                                                                                                                                                                                                                                                                                                                                                                           |
| **Email**             | Email                | Primary  | Yes               | Yes      | The contact's primary email address. **Unique per account** — used as the deduplication key. Also the input that triggers AI enrichment (provide just an email and the system fills the rest).                                                                                                                                                                                                                                                                                                                    |
| **Auto Tag**          | Multi-Select         | Enriched | Yes               | No       | Tags automatically assigned to the contact by the enrichment engine based on their profile data. Multi-select — a contact can have multiple tags. Pre-configured options available.                                                                                                                                                                                                                                                                                                                               |
| **Mobile Phone**      | Phone Number         | Primary  | Yes               | No       | The contact's personal/mobile phone number. Stored with country code support. Shown at position 4 in the default view.                                                                                                                                                                                                                                                                                                                                                                                            |
| **Job Title**         | Text                 | Enriched | Yes               | No       | The contact's current role/position (e.g., "VP of Sales", "Software Engineer"). Auto-filled by the enrichment engine from the contact's email domain and public profile data, but can be manually overridden.                                                                                                                                                                                                                                                                                                     |
| **Contact Owner**     | User (reference)     | Primary  | Yes               | No       | The CRM user (sales rep/account manager) responsible for this contact. Stored as a foreign key to the `users` table. Used for territory management, lead routing, and access control.                                                                                                                                                                                                                                                                                                                             |
| **LinkedIn URL**      | URL                  | Enriched | Yes               | No       | Link to the contact's LinkedIn profile. Auto-populated by the enrichment engine. Hidden by default in list views (position 14).                                                                                                                                                                                                                                                                                                                                                                                   |
| **Seniority**         | Select (dropdown)    | Custom   | Yes               | No       | The contact's management level within their organization. Pre-configured options: Entry Level, Mid Level, Senior Level, Executive. Useful for filtering high-value prospects and prioritizing outreach.                                                                                                                                                                                                                                                                                                           |
| **Department**        | Select (dropdown)    | Custom   | Yes               | No       | The functional department the contact works in. Pre-configured options: Sales, Marketing, Engineering, HR, Finance, Operations. Helps reps identify the right stakeholder by function.                                                                                                                                                                                                                                                                                                                            |
| **Contact Status**    | Status               | Custom   | Yes               | No       | The lifecycle stage of this contact in your sales process. Pre-configured options: New, Qualified, Engaged, Unresponsive. Displayed as a colored status badge. Determines where the contact sits in your funnel.                                                                                                                                                                                                                                                                                                  |
| **Location**          | Location (composite) | Enriched | Yes               | No       | The contact's geographic location. Composite field with sub-properties: Country, State, City, Zip, Address, Time Zone. Auto-filled by enrichment. Used for territory assignment and timezone-aware outreach.                                                                                                                                                                                                                                                                                                      |
| **Company**           | Association          | Custom   | Yes               | No       | Links this contact to a Company record in the CRM. Many-to-One relationship — each contact belongs to one company, but a company can have many contacts. Stored in `object_attribute_reference_values` as a bidirectional association (attribute slug: `contact_company` ↔ `company_contacts`).                                                                                                                                                                                                                   |
| **AI Summary**        | Text                 | AI       | No                | No       | An AI-generated natural language summary of the contact. Created by the SUMMARIZE_RECORD agent, which reads the contact's properties, linked activities (emails, notes, meetings), and deal context to produce a concise overview. Useful for quick prep before calls. Hidden by default.                                                                                                                                                                                                                         |
| **Preferred Channel** | Select (dropdown)    | Custom   | Yes               | No       | The contact's preferred communication method. Pre-configured options: Email, Phone, SMS, LinkedIn, In Person. Hidden by default in list views (position 11). Helps reps reach out via the channel most likely to get a response.                                                                                                                                                                                                                                                                                  |
| **Created From**      | Select (dropdown)    | Custom   | Yes               | No       | How this contact was originally added to the CRM. Pre-configured options: Manual Entry, Import, Web Form, API, Integration. Hidden by default. Useful for tracking lead source attribution and understanding which channels feed your pipeline.                                                                                                                                                                                                                                                                   |
| **Twitter URL**       | URL                  | Enriched | Yes               | No       | Link to the contact's Twitter/X profile. Auto-populated by the enrichment engine. Hidden by default in list views (position 15).                                                                                                                                                                                                                                                                                                                                                                                  |
| **Created By**        | User (reference)     | Primary  | No                | Auto     | The CRM user who created this contact record. Automatically set at creation time. Hidden by default. Non-editable — serves as an audit trail.                                                                                                                                                                                                                                                                                                                                                                     |
| **Office Phone**      | Phone Number         | Enriched | Yes               | No       | The contact's work/office phone number. Auto-populated by the enrichment engine (separate from mobile phone). Hidden by default in list views (position 17).                                                                                                                                                                                                                                                                                                                                                      |
| **Fit Score**         | Number (0-100)       | AI       | No (non-editable) | No       | Measures how closely this contact matches your Ideal Customer Profile (ICP). Computed by the AI CALCULATION_AGENT using admin-configured parameters (field conditions + importance weights: High/Mid/Low). Normalised to 0–100. Admins can create multiple Fit scores targeting different audiences (e.g., "APAC Fit", "Enterprise Fit"). A score only appears on contacts that match its audience filter. If a contact has no data for any parameter, shows "Insufficient data" instead of 0. Hidden by default. |
| **Engagement Score**  | Number (0-100)       | AI       | No (non-editable) | No       | Quantifies how actively this contact is engaging with your team. Computed by the AI CALCULATION_AGENT based on admin-configured parameters. Normalised to 0–100. Tracks interactions like email opens, meeting attendance, and response patterns. Hidden by default.                                                                                                                                                                                                                                              |
| **Lead Score**        | Number (0-100)       | AI       | No (non-editable) | No       | A composite score indicating this contact's likelihood to convert. Computed by the AI CALCULATION_AGENT. Normalised to 0–100. Typically factors in both fit (who they are) and engagement (what they're doing). Hidden by default. Used by reps to prioritize follow-ups.                                                                                                                                                                                                                                         |
| **Linked Deals**      | Association          | Custom   | Yes               | No       | Links this contact to Deal records. Many-to-Many relationship — a contact can be involved in multiple deals (e.g., renewal + upsell), and each deal can have multiple contacts (buyer, champion, exec sponsor). Attribute slug: `contact_deals` ↔ `deal_contacts`. Hidden by default.                                                                                                                                                                                                                             |


---

## Additional Fields (in code but not in your table)

| Column Name               | Field Type  | Category | Description                                                                                                                     |
| ------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **First Engagement Date** | Date        | Custom   | The date this contact first interacted with your team. Hidden by default (position 22).                                         |
| **Linked Meetings**       | Association | Custom   | Many-to-Many link to Meeting records. Attribute slug: `contact_meetings` ↔ `meeting_contacts`. Hidden by default (position 25). |
| **Profile Pic URL**       | Text/URL    | Primary  | URL to the contact's avatar image. Auto-generated via DiceBear for sample data, or pulled from enrichment.                      |

---

## How Enrichment Fills Fields

When a contact is created with just an email address, the enrichment engine (via external providers) can auto-fill these fields:

`firstName`, `lastName`, `phone`, `jobTitle`, `email`, `country`, `city`, `jobFunction`, `externalUrls` (LinkedIn, Twitter), `managementLevel` → maps to Seniority, plus company-level data: `companyName`, `companyWebsite`, `companyCountry`, `companyState`, `companyType`, `companyRevenue`, `companyPhone`, `companyEmployeeCount`, `companyEmployeeRange`, `companyPrimaryIndustry`, `companyIndustries`.

---

## How AI Scores Work (from Notion spec)

All three scores (Fit, Engagement, Lead) follow the same engine:

1. Admin configures **parameters** — field conditions with importance weights (High/Mid/Low)
2. Admin optionally sets an **audience filter** — only contacts matching the filter get scored
3. Score normalises to **0–100** as an integer (no percentage sign)
4. Recalculates on **every field change** — manual edit, bulk update, API write, automation, or enrichment
5. If a contact stops matching the audience filter, score shows as **"No longer qualifying"** (stale) with a greyed-out badge
6. Multiple Fit scores can exist per account (e.g., "APAC Fit", "SMB Fit") — all matching scores appear on the record