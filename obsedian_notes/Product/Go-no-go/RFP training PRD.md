# Context

## Problem Statement

SparrowGenie’s Knowledge Hubs hold the foundation for AI-generated RFP answers, but today there is no structured pipeline to keep them growing with real-world proposal data. Knowledge enters the system in two places — during onboarding and inside completed projects — yet neither path feeds back into the Knowledge Hub automatically.

**Today in SparrowGenie:**
- During onboarding, users upload past RFPs with answers into a Knowledge Hub, but this is a one-time seed — it never refreshes.

- Inside projects, proposal teams answer and review hundreds of RFP questions with high accuracy, but those human-validated answers stay locked inside the project.

- When a project spans multiple Knowledge Hubs, there is no mechanism to route answered questions back to the correct hub.

**As a result:**

**Knowledge Loss**

- Human-reviewed, high-authority answers from completed projects are never captured back into Knowledge Hubs.
- The onboarding seed data becomes stale over time.

**Repeated Work**

- SMEs answer the same questions across projects because the system cannot surface prior answers from the right Knowledge Hub.
- Proposal authors manually search past projects for reusable responses.

**Inconsistent Messaging**
- Without a single source of truth per Knowledge Hub, different projects produce slightly different answers for the same question.
- This weakens positioning and creates compliance risk.
**AI Quality Ceiling**

- SparrowGenie’s AI can only use the initial onboarding data and static uploads.
- It cannot learn from the most authoritative source — human-reviewed, project-level answers.


**If this problem is not solved:**

- Knowledge Hubs remain static and degrade in relevance.
- Proposal teams continue duplicating effort across projects.
- AI answer quality plateaus instead of compounding with every completed RFP.


---

## Opportunity

If SparrowGenie builds a closed-loop pipeline — onboarding uploads seed the Knowledge Hub, completed projects enrich it, and BM25-based retrieval surfaces the best answers — the system becomes **self-improving.**

Each completed RFP project strengthens every Knowledge Hub it touches.

Benefits:

**Faster future proposals**

When a new RFP is uploaded, the BM25 agent instantly retrieves verbatim answers from the Knowledge Hub, reducing manual effort from the first question.

**Better AI responses**

AI suggestions improve continuously because Knowledge Hubs grow with human-reviewed, project-level answers — the most authoritative data source available.

**Consistent positioning**

Answers are centralized per Knowledge Hub, eliminating divergent responses across projects.

**Institutional memory**

Reuse tracking and change detection ensure high-value answers persist and evolve, surviving employee turnover.

Expected business impact:

|Metric|Expected Change|
|---|---|
|Proposal creation time|↓ 30–50%|
|SME involvement|↓ 25–40%|
|Response consistency|↑|
|AI answer quality|↑ (compounds with each completed project)|

These gains compound as more projects are completed and more answers flow back into Knowledge Hubs.

---

## Target Users (Audience)

### Primary User

**Proposal Owner / Proposal Manager**

Responsible for creating projects, selecting Knowledge Hubs, answering and reviewing RFP questions, and validating AI-suggested answers from the BM25 retrieval agent.

They are the primary driver of both knowledge consumption (retrieving answers) and knowledge contribution (their reviewed answers flow back to KH).

---

### Secondary Users

**Subject Matter Experts (SMEs)**

Provide domain-specific answers within projects. Their reviewed contributions are among the highest-authority inputs that get trained back into Knowledge Hubs.

**Sales Engineers**

Reuse technical responses across deals and benefit from increasingly accurate AI suggestions as Knowledge Hubs grow.

---

### Out of Scope

- End customers

- Procurement teams

- External collaborators


This feature focuses only on **internal knowledge loop — ingestion, retrieval, and retraining.**

---

## Competitive Insights

Sales teams today solve this using fragmented systems that lack a feedback loop.

### Current Alternatives

**Manual Copy-Paste**

Teams copy answers from old proposals.

Problem:

- Time-consuming

- Difficult to find the right answer across multiple past projects


---

**Content Libraries (Loopio, RFPIO)**

Maintain centralized answer libraries.

Strength:

- Reusable answers


Weakness:

- Requires heavy manual curation and maintenance

- Content quickly becomes outdated because there is no automated feedback from completed proposals

- No keyword-based retrieval that intelligently routes questions to the right content domain


---

### SparrowGenie Advantage

SparrowGenie can uniquely:

**Close the loop between project execution and Knowledge Hub enrichment.**

Instead of manually curating a library, the system:

- Seeds Knowledge Hubs with past RFPs during onboarding

- Automatically trains human-reviewed answers from completed projects back into the correct Knowledge Hub using BM25-based segregation

- Retrieves verbatim answers and ranked alternatives for new RFPs via keyword matching

- Tracks reuse frequency and applies change detection to avoid redundant retraining


This creates a **self-improving knowledge system** where every completed project makes the next one faster and more accurate.

---

## Success Metrics

### Primary Outcome Metric

**Reduction in time to answer RFP questions**

Baseline vs after BM25 retrieval from Knowledge Hub.

---

### Supporting Metrics

|Metric|Direction|
|---|---|
|% of answers retrieved verbatim from KH|↑|
|% of projects contributing answers back to KH|↑|
|SME requests per proposal|↓|
|AI answer acceptance rate|↑|
|Proposal completion time|↓|
|Average reuse count per KH entry|↑|
|Redundant retraining rate|↓|

---

# Implementation

## Scope

### Must-Have Functionality

1. **Onboarding KH Seeding**

During onboarding, the product prompts users to upload ~10 past RFPs with answers into one or more Knowledge Hubs. These serve as the initial seed data for answer generation.

---

2. **Project-to-KH Feedback Loop**

When an RFP project is completed and all questions are answered and reviewed by humans, those Q&A pairs are trained back into the Knowledge Hub. Since project-level answers are human-validated, they carry higher authority than onboarding uploads.

---

3. **BM25-Based Question Segregation**

When a project spans multiple Knowledge Hubs, the system uses a BM25 search algorithm to identify keyword similarity and route each answered question to the correct Knowledge Hub. This ensures multi-hub projects don't dump all Q&A into a single hub.

---

4. **BM25-Based Answer Retrieval**

When a new RFP is uploaded and the user selects a Knowledge Hub, the BM25 agent searches existing Q&A in that hub by keyword. If a match is found, the system provides the verbatim answer. If multiple questions match, it provides ranked alternatives (v2) — the user selects the most apt one, and others are surfaced with a confidence score.

---

5. **Reuse Tracking**

Each Knowledge Hub entry maintains a usage stat that tracks how many times it has been reused across projects. This surfaces the most valuable answers and informs quality ranking.

---

6. **Change Detection & Deduplication**

When a reused question returns from a completed project, an algorithm measures how much the answer has changed compared to the existing KH entry. If the answer changed more than 30–40%, it is retrained as an updated entry. If not, the system simply records provenance (which original answer it came from) and increments the reuse count. This prevents redundant retraining.

---

### Nice-to-Have

- Confidence scoring on BM25 matches to help users pick the best alternative

- Quality scoring of KH entries based on reuse frequency and acceptance rate

- Win/Loss tagging — linking answers to deal outcomes

- Auto-archival of low-reuse, stale KH entries


---

### Explicit Non-Goals

Not included in this version:

- Semantic / vector-based search (BM25 keyword matching is the chosen approach for now)

- Fully automated KH ingestion without human review at the project level

- External content ingestion from sources outside SparrowGenie

- Cross-organization Knowledge Hub sharing


Human review at the project level remains the quality gate before answers flow back to KH.

---

## Experience

### Primary User Flow

1. **Onboarding:** User uploads ~10 past RFPs with answers into one or more Knowledge Hubs (seed data).

2. **Project Creation:** User creates a new RFP project and selects one or more Knowledge Hubs to associate with it.

3. **Answer Retrieval:** When the RFP questions are loaded, the BM25 agent searches selected Knowledge Hubs and auto-suggests verbatim answers where keyword matches exist. Where multiple matches are found, alternatives are presented for user selection.

4. **Project Execution:** Proposal team answers remaining questions, reviews AI-suggested answers, and finalizes all responses with human validation.

5. **Feedback to KH:** Upon project completion, reviewed Q&A pairs are automatically segregated by BM25 keyword matching and routed back to the appropriate Knowledge Hubs.

6. **Change Detection:** For questions that already exist in the KH, the system checks answer similarity. If changed >30–40%, the entry is retrained. If not, provenance is recorded and reuse count incremented.


---

### Key Moments

**Onboarding Upload**

First-time users seed Knowledge Hubs with past RFP data, establishing the baseline for retrieval.

---

**Answer Retrieval on New RFP**

The BM25 agent surfaces verbatim matches and alternatives — this is the primary value moment where users experience time savings.

---

**Project Completion Feedback**

Human-reviewed answers flow back to Knowledge Hubs automatically, closing the loop and enriching the system.

---

**Change Detection Gate**

Prevents redundant retraining while ensuring genuinely improved answers update the Knowledge Hub.

---

### Edge Cases

**Multi-Hub Segregation Ambiguity**

When BM25 cannot confidently assign a question to a single Knowledge Hub (e.g., equal keyword similarity across hubs), the system should flag the question for manual routing by the user.

---

**Multiple Answer Matches**

When BM25 retrieval returns more than one match for a question, all alternatives are presented with a confidence score. The user selects the most apt answer. Non-selected alternatives remain available but are ranked lower in future retrievals.

---

**Borderline Change Detection (Near 30–40% Threshold)**

When an answer change is at the boundary of the retraining threshold, the system should flag it for user review rather than auto-deciding.

---

**Duplicate Content Across Hubs**

If the same Q&A pair is routed to multiple Knowledge Hubs (e.g., a question relevant to two domains), the system should track them as linked entries to avoid divergence over time.

---

**Ownership Changes**

If the original author leaves, the knowledge remains attached to the system. Reuse count and provenance history are preserved regardless of user status.

---

**Empty or Low-Quality Onboarding Data**

If users upload RFPs with incomplete or low-quality answers during onboarding, BM25 retrieval accuracy will be degraded. The system should warn users about sparse Knowledge Hubs.
    

---

## Implementation Details

### Data Behavior

Each KH entry stores:

|Field|Description|
|---|---|
|Question Text|Original RFP question|
|Response Text|Final human-reviewed answer|
|Source|Onboarding upload or Project ID|
|Author|Contributor who reviewed/authored|
|Reuse Count|Number of times this answer has been reused across projects|
|Provenance Chain|List of project IDs where this answer was used or derived from|
|Change Percentage|Last computed delta vs previous version (for change detection)|
|Last Retrained Date|Timestamp of the most recent retraining event|
|Status|Active / Stale / Archived|

---

### Role-Based Permissions

|Role|Permission|
|---|---|
|Proposal Owner|Create projects, select KHs, review answers, trigger feedback to KH|
|SME|Answer questions within projects, review AI suggestions|
|Knowledge Admin|Manage KH entries, resolve segregation conflicts, archive stale entries|
|Viewer|Read-only access to KH entries|

---

### AI Behavior (BM25 Retrieval Agent)

When a new RFP is loaded and a Knowledge Hub is selected:

1. BM25 searches the KH by keyword similarity against the incoming question

2. If a single strong match is found → provide verbatim answer

3. If multiple matches are found → provide the best match as primary, others as ranked alternatives (v2)

4. If no match is found → question is left unanswered for manual input

Ranking priorities:

1. Keyword match strength (BM25 score)

2. Reuse count (higher = more trusted)

3. Recency of last retraining
    

---

## Impact Areas

This feature affects:

- Knowledge Hub (storage model, entry lifecycle, reuse tracking)

- Onboarding flow (RFP upload prompt and KH seeding)

- Project creation (KH selection, multi-hub association)

- RFP answer editor (BM25 retrieval, verbatim suggestions, alternative ranking)

- Project completion workflow (automatic feedback to KH, change detection)


Engineering components:

- BM25 search algorithm (keyword matching for both segregation and retrieval)

- KH storage model (extended with reuse count, provenance, change percentage)

- Question segregation engine (multi-hub routing logic)

- Change detection algorithm (30–40% threshold comparison)

- Retrieval API (verbatim + alternatives response format)
    

---

## Open Ended Questions

- Should the 30–40% change detection threshold be configurable per Knowledge Hub, or global?

- When BM25 cannot confidently segregate a question to one hub, should it go to all candidate hubs or be held for manual routing?

- Should win/loss data from deal outcomes influence KH entry ranking in future retrievals?

- How should the system handle conflicting answers — e.g., same question, different answers in two hubs?

- Should there be a staleness policy that auto-archives KH entries with zero reuse after N months?

- What is the minimum quality bar for onboarding uploads — should the system reject sparse or incomplete RFPs?
    

---

## What Is Pushed to Next Version

Future versions may include:

**Semantic / Vector Search Upgrade**

Move beyond BM25 keyword matching to embedding-based semantic search for higher accuracy in retrieval and segregation.

---

**Response Quality Scoring**

Answers ranked based on:

- reuse frequency

- win rate

- SME rating

- change detection history (stable answers ranked higher)


---

**Deal Outcome Learning**

Winning proposals improve KH priority. Answers from won deals are boosted in retrieval ranking.

---

**Cross-Hub Answer Linking**

Automatically detect and link related answers across Knowledge Hubs to maintain consistency when the same topic spans multiple domains.

---

## Investigative Metrics

After launch, monitor:

### Adoption Signals

- Number of KH entries created (from onboarding + project feedback)

- % of completed projects contributing answers back to KH

- Average number of Knowledge Hubs selected per project


---

### Quality Signals

- BM25 retrieval hit rate (% of questions with at least one match)

- Verbatim answer acceptance rate (how often users accept the primary suggestion)

- Alternative selection rate (how often users pick a v2 alternative over the primary)

- Average reuse count per KH entry


---

### Risk Signals

- Duplicate entries across hubs

- Segregation conflicts (questions flagged for manual routing)

- Redundant retraining rate (entries retrained with <30% change)

- Stale entries (zero reuse over extended period)

- Low-quality onboarding data leading to poor retrieval
    

---

## Final Notes

### Key Assumptions

- Users will upload meaningful past RFPs during onboarding (not empty or junk data).

- Proposal teams will complete and review all questions within projects before submission.

- BM25 keyword matching provides sufficient accuracy for both segregation and retrieval in v1.

- A 30–40% change threshold is a reasonable heuristic for deciding when to retrain.


---

### Dependencies

- Knowledge Hub architecture (extended schema for reuse count, provenance, change tracking)

- BM25 search engine integration

- Change detection algorithm implementation

- Project completion event pipeline (to trigger feedback to KH)

- Onboarding flow update (RFP upload prompt)