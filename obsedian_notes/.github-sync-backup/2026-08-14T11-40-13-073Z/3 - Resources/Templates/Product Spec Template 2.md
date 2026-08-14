---
owner: Divyaraj Murugan
feature:
version: 1
status:
priority:
tags:
---
### 1. Problem Statement

- Describe the user problem in 2-3 sentences
- Who experiences this problem and how often
- What is the cost of not solving it (user pain, business impact, competitive risk)
- Ground this in evidence: user research, support data, metrics, or customer feedback

**Write the problem, not the solution.** If the problem statement names the feature ("Custom Objects solve that..."), it is a solution statement. Strip the solution out and check that the problem still stands on its own. Lead with the customer and the outcome they cannot get; keep the _mechanism_ (why the current design fails) in your back pocket for when someone asks "why?"

Two failure modes to avoid:

- **Too vague:** "Companies run on more than three data types." True of everyone; names no pain, no frequency, no cost.
- **Too technical:** "Storing one-to-many relations breaks into duplication." That is the mechanism, not the problem. A new sales rep should understand the problem statement instantly.

**Establish the gap.** If adjacent capabilities already exist (custom fields, lists, filters, an existing module), the problem statement must explain _why those are not enough_ — the exact thing a customer cannot do today. Until you can state that, you have asserted a hole rather than proven one.

#### Evidence

Do not assert pain — source it. Build an evidence table and mark the status of each source honestly. Visible gaps beat fake confidence in a review.

| Source                                               | Status          | What it gives us                                         |
| ---------------------------------------------------- | --------------- | -------------------------------------------------------- |
| [e.g. our own instance / internal usage]             | ✅ Confirmed     | First-hand proof + urgency                               |
| [e.g. lost-deal analysis, win/loss notes]            | ⚠️ To validate  | Converts "they want it" into "we lost revenue over it"   |
| [e.g. user interviews]                               | ⚠️ To validate  | Confirms the _shape_ of the pain, not just its existence |
| [e.g. support tickets, call recordings, search logs] | ⚠️ To validate  | Zero-prep corroboration                                  |
| [e.g. product analytics / funnel drop-off]           | ❌ Not available | Would size frequency and severity                        |

Status legend: ✅ confirmed · ⚠️ to validate · ❌ unavailable or not yet gathered.

**Where evidence of blocked or lost customers accumulates** — check these before inventing new research:

- Lost-deal and churn notes (search for the capability by name)
- Support tickets and sales call recordings (verbatim search)
- Onboarding/migration drop-off points
- Sales-engineering escalations and RFP/eval checklists
- Your own company's internal usage of the product (you may be customer zero)
- Competitor feature checklists that appear in evaluations

**Interview questions: ask for the last incident, not the frequency.** People misreport habits and remember events. Prefer _"Walk me through the last time you tried to do X. Where does that live today? Show me."_ over _"How often do you do X?"_

**Falsifiable claims.** List the specific claims that must hold for this feature to be worth building, stated so they _could_ be proven false. This is what makes the problem killable cheaply, before engineering starts.

> Example format: (a) losses actually cite this reason; (b) the pain is structural, not cosmetic — if a simpler workaround suffices, this is over-scoped; (c) the advanced case is genuinely needed, or the simple case covers ~90% — this materially changes cost.

**Beware the borrowed problem.** If the evidence is generic industry lore rather than your own customers' observed behavior, the whole statement is borrowed and will not survive review.

**Check the spec's age.** If you are updating an existing spec, note when it was last edited. A stale spec's biggest risk is not wrong answers — it is **missing questions**: capabilities shipped since it was written that also encode the old assumptions. Audit the current product surface _before_ rewriting. Rewriting first reproduces the same blind spots in nicer formatting.

### 2. Jobs To Be Done

**Primary job statement:**

> When [situation], I want to [motivation], so I can [desired outcome].

**Functional dimension:** [The concrete task the user is trying to accomplish.]

**Emotional dimension:** [How the user wants to feel — confident, in control, unblocked, trusted.]

**Social dimension:** [How they want to be perceived by their team, boss, customers — competent, responsive, on top of things.]

**Hiring criteria — why a user would "hire" this feature:**

- [What pulls them toward it over their current workaround.]

**Firing criteria — why they'd stop using it or switch:**

- [What would make them give up on it. Useful for stress-testing the design.]

Firing criteria are the most under-used part of a PRD. Each one should map to a requirement or a risk elsewhere in the doc — if a firing criterion has no corresponding mitigation, you have found a gap.

### 3. Goals

- 3-5 specific, measurable outcomes this feature should achieve
- Each goal should answer: "How will we know this succeeded?"
- Distinguish between user goals (what users get) and business goals (what the company gets)
- Goals should be outcomes, not outputs ("reduce time to first value by 50%" not "build onboarding wizard")

### 4. Non-Goals

- 3-5 things this feature explicitly will NOT do
- Adjacent capabilities that are out of scope for this version
- For each non-goal, briefly explain why it is out of scope (not enough impact, too complex, separate initiative, premature)
- Non-goals prevent scope creep during implementation and set expectations with stakeholders

**Distinguish "deferred" from "not applicable."** A deferred non-goal is wanted and will come later. A not-applicable non-goal is conceptually meaningless for this case and will never come. Mixing them creates false expectations in both directions — stakeholders wait for things that will never ship, and engineering builds things nobody wants.

Test each candidate non-goal:

1. **Would the user actually want this here?** If no, it is not applicable — scope it out permanently.
2. **If yes, does it work today for adjacent cases only by accident of how it was built?** If so, it is a real deferral and belongs on a phased retrofit list.

### 5. User Stories

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

### 6. Requirements

**Must-Have (P 0):** The feature cannot ship without these. These represent the minimum viable version of the feature. Ask: "If we cut this, does the feature still solve the core problem?" If no, it is P 0.

**Nice-to-Have (P 1):** Significantly improves the experience but the core use case works without them. These often become fast follow-ups after launch.

**Future Considerations (P 2):** Explicitly out of scope for v 1 but we want to design in a way that supports them later. Documenting these prevents accidental architectural decisions that make them hard later.

For each requirement:

- Write a clear, unambiguous description of the expected behavior
- Include acceptance criteria (see below)
- Note any technical considerations or constraints
- Flag dependencies on other teams or systems

**Investigations can be P 0.** An audit, a data inventory, or a spike is a legitimate must-have when its output determines scope or estimate. Naming it as a requirement — with an acceptance criterion — is what stops the team from estimating on guesses.

**Architectural requirements belong in P 0 even when the feature ships later.** If a P 1/P 2 capability requires a foundation, the foundation is P 0. Otherwise the v 1 implementation becomes throwaway code and the shortcut it took becomes permanent. Feature phases are reversible; architecture decisions are not.

### 7. Success Metrics

See the success metrics section below for detailed guidance.

### 8. Open Questions

- Questions that need answers before or during implementation
- Tag each with who should answer (engineering, design, legal, data, stakeholder)
- Distinguish between blocking questions (must answer before starting) and non-blocking (can resolve during implementation)

**The blocker rule:** if getting it wrong forces a data migration or another team's rework, it blocks. If getting it wrong only forces a UI change, decide it during build.

Blockers are typically: data model and schema shape, identifiers other systems reference, permission and access architecture, cross-team dependencies, anything gating billing or provisioning. Non-blockers are typically: which surface a control lives on, default states, copy, ordering, and phasing of additive capabilities.

**Preserve inherited open questions.** When revising a spec, keep the original author's unresolved questions rather than deleting them. They record what the team was uncertain about, and some may already have been answered by work that shipped since.

### 9. Timeline Considerations

- Hard deadlines (contractual commitments, events, compliance dates)
- Dependencies on other teams' work or releases
- Suggested phasing if the feature is too large for one release

**Sequence is a deliverable, not a detail.** Two plans with identical contents and different orderings have different risk profiles. State explicitly what must happen _before_ estimation, before build, and before launch — and what is deliberately _not_ in the sequence yet.

**Keep replatforming separate from redesign.** When migrating something onto new architecture, ship functional parity first with no improvements bundled in. Mixing the two makes any bug unattributable and invites scope explosion.

**Note the cost curve.** Some work gets more expensive with every sprint of delay (foundations that later features build on top of; migrations that get riskier as usage grows). If that applies, say so — "the bill grows every sprint" is a stronger argument than "it's cleaner."

### 10. Parking Lot

Good ideas that are **not** in scope. Capture them here rather than in the requirements list, so contributors feel heard without the scope moving.

Keep entries to one line each. Revisit at the next planning cycle, not during implementation.

---

## User Story Writing

Good user stories are:

- **Independent:** Can be developed and delivered on their own
- **Negotiable:** Details can be discussed, the story is not a contract
- **Valuable:** Delivers value to the user (not just the team)
- **Estimable:** The team can roughly estimate the effort
- **Small:** Can be completed in one sprint/iteration
- **Testable:** There is a clear way to verify it works

### Common Mistakes in User Stories

- **Too vague:** "As a user, I want the product to be faster" — what specifically should be faster?
- **Solution-prescriptive:** "As a user, I want a dropdown menu" — describe the need, not the UI widget
- **No benefit:** "As a user, I want to click a button" — why? What does it accomplish?
- **Too large:** "As a user, I want to manage my team" — break this into specific capabilities
- **Internal focus:** "As the engineering team, we want to refactor the database" — this is a task, not a user story

---

## Requirements Categorization

### MoSCoW Framework

- **Must have:** Without these, the feature is not viable. Non-negotiable.
- **Should have:** Important but not critical for launch. High-priority fast follows.
- **Could have:** Desirable if time permits. Will not delay delivery if cut.
- **Won't have (this time):** Explicitly out of scope. May revisit in future versions.

### Tips for Categorization

- Be ruthless about P 0 s. The tighter the must-have list, the faster you ship and learn.
- If everything is P 0, nothing is P 0. Challenge every must-have: "Would we really not ship without this?"
- P 1 s should be things you are confident you will build soon, not a wish list.
- P 2 s are architectural insurance — they guide design decisions even though you are not building them now.

### Prioritize by irreversibility, not just impact

For each requirement, ask: **"after we ship the fix, is the harm gone?"**

- **Recoverable:** a broken flow, a missing view, poor performance. Ship the patch, harm disappears. Embarrassing, not damaging.
- **Irreversible:** data loss, silent data corruption, exposure of sensitive data. The patch closes the door after the data walked out. The harm persists regardless of the fix.

Irreversible failure modes deserve P 0 requirements and explicit acceptance criteria even when they are edge cases. Two patterns worth checking in almost every spec:

- **Silent partial failure is worse than loud failure.** A failed operation is recoverable — the user retries. An operation that reports success while dropping part of the data produces something that _looks_ complete, gets trusted, and gets built on. Require integrity verification and reporting, not just success/failure.
- **Default to closed.** Any newly created resource should be invisible or inaccessible until access is explicitly configured. The gap between "created" and "permissions set" is a real exposure window.

---

## Success Metrics Definition

### Leading Indicators

Metrics that change quickly after launch (days to weeks):

- **Adoption rate:** % of eligible users who try the feature
- **Activation rate:** % of users who complete the core action
- **Task completion rate:** % of users who successfully accomplish their goal
- **Time to complete:** How long the core workflow takes
- **Error rate:** How often users encounter errors or dead ends
- **Feature usage frequency:** How often users return to use the feature

### Lagging Indicators

Metrics that take time to develop (weeks to months):

- **Retention impact:** Does this feature improve user retention?
- **Revenue impact:** Does this drive upgrades, expansion, or new revenue?
- **NPS / satisfaction change:** Does this improve how users feel about the product?
- **Support ticket reduction:** Does this reduce support load?
- **Competitive win rate:** Does this help win more deals?

### Setting Targets

- Targets should be specific: "50% adoption within 30 days" not "high adoption"
- Base targets on comparable features, industry benchmarks, or explicit hypotheses
- Set a "success" threshold and a "stretch" target
- Define the measurement method: what tool, what query, what time window
- Specify when you will evaluate: 1 week, 1 month, 1 quarter post-launch

### Gates, counter-metrics, and pre-launch products

- **Gate metrics** are pass/fail release conditions, not targets you hope to hit. State them as conditions: "we do not ship until X is true." Data integrity and security checks usually belong here — expressing them as a percentage implies missing them is acceptable.
- **Counter-metrics** guard against harm: what must _not_ get worse. Include at least one (existing performance, error rates, adjacent workflow completion).
- **Pre-launch or zero-user features** cannot be measured by adoption. Substitute a concrete first-use gate — internal dogfooding, a design-partner migration, a specific customer's onboarding — and treat completion of that as the release condition.
- **Distinguish created from used.** "Users created the thing" is an output. "Users came back and put real data in it" is the outcome. Measure both.

---

## Acceptance Criteria

Write acceptance criteria in Given/When/Then format or as a checklist:

**Given/When/Then:**

- Given [precondition or context]
- When [action the user takes]
- Then [expected outcome]

Example:

- Given the admin has configured SSO for their organization
- When a team member visits the login page
- Then they are automatically redirected to the organization's SSO provider

**Checklist format:**

- Admin can enter SSO provider URL in organization settings
- Team members see "Log in with SSO" button on login page
- SSO login creates a new account if one does not exist
- SSO login links to existing account if email matches
- Failed SSO attempts show a clear error message

### Tips for Acceptance Criteria

- Cover the happy path, error cases, and edge cases
- Be specific about the expected behavior, not the implementation
- Include what should NOT happen (negative test cases)
- Each criterion should be independently testable
- Avoid ambiguous words: "fast", "user-friendly", "intuitive" — define what these mean concretely
- Include empty states explicitly. A screen designed around rich data often looks broken when there is none — name what renders instead.

---

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
- Separate "v 1" from "v 2" clearly in the spec
- Review the spec against the original problem statement — does everything serve it?
- Time-box investigations: "If we cannot figure out X in 2 days, we cut it"
- Create a "parking lot" for good ideas that are not in scope

### The parity trap

Watch for phrases like "just like the existing X," "full parity," or "same as before." These read as a single clause and hide most of a project's cost. When one appears, force the inventory: list everything the reference case actually has today, then sort each item into _transfers cleanly_, _does not apply_, and _appears generic but is secretly special-cased_. The third bucket is where estimates die.

Where possible, replace an unbounded comparison with a bounded one. "Same as [competitor]" is unknowable; "same as _our own_ instance of it" is a finite list you can go count. If your own company uses the product, that audit is often the cheapest and highest-leverage thing you can do — and its output _is_ the requirements doc.

---

## Working Process

1. **Interrogate before transcribing.** The user's framing is a starting point, not the spec. Stress-test the problem statement, the evidence, the alternatives considered, and the success metrics before writing the document.
2. **Do not accept the solution as the problem.** If the request already names the answer, work backwards to the problem it serves.
3. **Push past the first "why."** Ask why the problem exists, why the obvious workaround fails, why this approach over the alternative, why that edge case matters.
4. **Mark unknowns as unknowns.** Use ⚠️ / ❌ status markers, "to validate," and explicit open questions rather than smoothing over gaps with confident prose. A spec with visible holes is more useful than one with invisible ones.
5. **Then write the document,** filling every section. If a section genuinely does not apply, say so and why — do not delete it silently.