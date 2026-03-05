# Context

## Problem Statement
SparrowGenie's Knowledge Hubs (KH) hold the foundation for AI-generated RFP answers, but today there is no structured pipeline to keep them growing with real-world proposal data. Knowledge enters the system in two places — during onboarding and inside completed projects — yet neither path feeds back into the Knowledge Hub automatically.

**Today in SparrowGenie:**
- During onboarding **(yet to be implemented)**, users upload past RFPs with answers into a Knowledge Hub, but this is a one-time seed — it never refreshes.
- Inside projects, proposal teams answer and review hundreds of RFP questions with high accuracy, but those human-validated answers stay locked inside the project.
- When a project spans multiple Knowledge Hubs, there is no mechanism to route answered questions back to the correct hub.

**Who is experiencing this?** Proposal Owners, SMEs, and Sales Engineers — anyone involved in answering or reusing RFP responses across deals.

**Where does the deal slow down?**
- Every new RFP starts from scratch because prior answers are trapped in old projects.
- SMEs get pulled in repeatedly for the same questions.
- AI suggestions stagnate because the KH never grows beyond the initial onboarding upload.

**Consequences if not solved:**
- Knowledge Hubs remain static and degrade in relevance.
- Proposal teams continue duplicating effort across projects.
- AI answer quality plateaus instead of compounding with every completed RFP.

---

## Opportunity
**Why now?** SparrowGenie already has Knowledge Hubs and project-level RFP execution. The missing piece is the feedback loop — connecting these two so every completed project automatically enriches the knowledge base.

If SparrowGenie builds a closed-loop pipeline — onboarding uploads seed the KH, completed projects enrich it, and BM25-based retrieval surfaces the best answers — the system becomes **self-improving.**

**How it helps sales teams close faster:**
- **Faster proposals:** BM25 agent instantly retrieves verbatim answers from KH, reducing manual effort from the first question.
- **Better AI responses:** KH grows with human-reviewed, project-level answers — the most authoritative data source available.
- **Consistent positioning:** Answers centralized per KH, eliminating divergent responses across projects.
- **Institutional memory:** Reuse tracking and change detection ensure high-value answers persist and evolve, surviving employee turnover.

**Expected business impact:**

| Metric | Expected Change |
|---|---|
| Proposal creation time | ↓ 30–50% |
| SME involvement | ↓ 25–40% |
| Response consistency | ↑ |
| AI answer quality | ↑ (compounds with each completed project) |

---

## Target Users (Audience)
**Primary user:** Proposal Owner / Proposal Manager — creates projects, selects Knowledge Hubs, reviews AI-suggested answers, and validates final responses. They drive both knowledge consumption (retrieving answers) and contribution (reviewed answers flow back to KH).

**Secondary users:**
- **SMEs** — provide domain-specific answers within projects. Their reviewed contributions are among the highest-authority inputs trained back into KH.
- **Sales Engineers** — reuse technical responses across deals, benefit from increasingly accurate AI suggestions as KH grows.

**Out of scope:** End customers, procurement teams, external collaborators. This feature focuses only on the **internal knowledge loop — ingestion, retrieval, and retraining.**


---

## Success Metrics
**Primary outcome metric:** Reduction in time to answer RFP questions — baseline vs after BM25 retrieval from Knowledge Hub.

**Supporting metrics:**

| Metric                                        | Direction |
| --------------------------------------------- | --------- |
| % of answers retrieved verbatim from KH       | ↑         |
| % of projects contributing answers back to KH | ↑         |
| SME requests per proposal                     | ↓         |
| AI answer acceptance rate                     | ↑         |
| Proposal completion time                      | ↓         |
| Average reuse count per KH entry              | ↑         |
| Redundant retraining rate                     | ↓         |

---

# Implementation
**Purpose:** Define what needs to be built while giving design and engineering teams room to make good decisions.

## Scope
### Must-Have Functionality
1. **Onboarding KH Seeding** — During onboarding, the product prompts users to upload ~10 past RFPs with answers into one or more Knowledge Hubs. These serve as the initial seed data for answer generation. The UI must clearly indicate these are "Uploaded RFPs" so they can be given appropriate weightage in retrieval ranking vs project-trained answers.
2. **Project-to-KH Feedback Loop** — When an RFP project is completed and all questions are answered and reviewed by humans, those Q&A pairs are trained back into the Knowledge Hub. Project-level answers carry higher authority than onboarding uploads since they are human-validated.
3. **BM25-Based Question Segregation** — When a project spans multiple Knowledge Hubs, the system uses BM25 search to identify keyword similarity and route each answered question to the correct KH. This ensures multi-hub projects don't dump all Q&A into a single hub.
4. **BM25-Based Answer Retrieval** — When a new RFP is uploaded and the user selects a KH, the BM25 agent searches existing Q&A by keyword:
   - **Single match** → provide verbatim answer
   - **Multiple matches** → provide best match as primary + ranked alternatives (v2) with confidence score; user selects the most apt one
   - **No match** → question left unanswered for manual input; AI will attempt to generate an answer from KH context
5. **Reuse Tracking** — Each KH entry maintains a usage stat tracking how many times it has been reused across projects. This surfaces the most valuable answers and informs quality ranking.
6. **Change Detection & Deduplication** — When a reused question returns from a completed project, an algorithm measures how much the answer changed vs the existing KH entry. If changed >30–40%, it is retrained as an updated entry. If not, the system records provenance (which original answer it came from) and increments reuse count. This prevents redundant retraining.

### Nice-to-Have
- Confidence scoring on BM25 matches to help users pick the best alternative
- Quality scoring of KH entries based on reuse frequency and acceptance rate
- Win/Loss tagging — linking answers to deal outcomes
- Auto-archival of low-reuse, stale KH entries

### Explicit Non-Goals
- Semantic / vector-based search (BM25 keyword matching is the chosen approach for v1)
- External content ingestion from sources outside SparrowGenie
- Cross-organization Knowledge Hub sharing

Human review at the project level remains the quality gate before answers flow back to KH.

---

## Experience
### Primary User Flow
1. **Onboarding:** User uploads ~10 past RFPs with answers into one or more Knowledge Hubs (seed data).
2. **Project Creation:** User creates a new RFP project and selects one or more Knowledge Hubs.
3. **Answer Retrieval:** BM25 agent searches selected KHs and auto-suggests verbatim answers where keyword matches exist. Multiple matches show ranked alternatives for user selection. No match leaves the question for manual input.
4. **Project Execution:** Proposal team answers remaining questions, reviews AI-suggested answers, finalizes all responses with human validation.
5. **Feedback to KH:** Upon project completion, reviewed Q&A pairs are automatically segregated by BM25 keyword matching and routed back to the appropriate Knowledge Hubs.
6. **Change Detection:** For questions that already exist in KH, system checks answer similarity. If changed >30–40%, entry is retrained. If not, provenance recorded and reuse count incremented.

### Key Moments
- **Onboarding Upload** — First-time users seed KH with past RFP data, establishing the baseline for retrieval.
- **Answer Retrieval on New RFP** — BM25 agent surfaces verbatim matches and alternatives. This is the primary value moment where users experience time savings.
- **Project Completion Feedback** — Human-reviewed answers flow back to KH automatically, closing the loop.
- **Change Detection Gate** — Prevents redundant retraining while ensuring improved answers update the KH.

### Edge Cases
- **Multi-Hub Segregation Ambiguity:** When BM25 cannot confidently assign a question to a single KH (equal keyword similarity across hubs), flag for manual routing by the user.
- **Multiple Answer Matches:** All alternatives presented with confidence score. User selects the most apt. Non-selected alternatives ranked lower in future retrievals.
- **Borderline Change Detection (Near 30–40%):** Flag for user review rather than auto-deciding.
- **Duplicate Content Across Hubs:** If the same Q&A is routed to multiple KHs, track as linked entries to avoid divergence.
- **Ownership Changes:** Knowledge remains attached to the system regardless of user status. Reuse count and provenance preserved.
- **Empty/Low-Quality Onboarding Data:** System warns users about sparse Knowledge Hubs that may degrade retrieval accuracy.

---

## Implementation Details
### Data Behavior
Each KH entry stores:

| Field | Description |
|---|---|
| Question Text | Original RFP question |
| Response Text | Final human-reviewed answer |
| Source | Onboarding upload (flagged) or Project ID |
| Author | Contributor who reviewed/authored |
| Reuse Count | Times reused across projects |
| Provenance Chain | List of project IDs where answer was used/derived from |
| Change Percentage | Last computed delta vs previous version |
| Last Retrained Date | Timestamp of most recent retraining |
| Status | Active / Stale / Archived |

### Role-Based Permissions

| Role | Permission |
|---|---|
| Proposal Owner | Create projects, select KHs, review answers, trigger feedback to KH |
| SME | Answer questions within projects, review AI suggestions |
| Knowledge Admin | Manage KH entries, resolve segregation conflicts, archive stale entries |
| Viewer | Read-only access to KH entries |

### AI Behavior (BM25 Retrieval Agent)
When a new RFP is loaded and a Knowledge Hub is selected:
1. BM25 searches KH by keyword similarity against the incoming question
2. Single strong match → provide verbatim answer
3. Multiple matches → best match as primary, others as ranked alternatives (v2)
4. No match → question left for manual input; AI attempts answer from broader KH context

**Ranking priorities:** Keyword match strength (BM25 score) → Reuse count (higher = more trusted) → Recency of last retraining

---

## Impact Areas
**Product areas affected:** Knowledge Hub (storage model, entry lifecycle, reuse tracking), Onboarding flow (RFP upload prompt and KH seeding), Project creation (KH selection, multi-hub association), RFP answer editor (BM25 retrieval, verbatim suggestions, alternative ranking), Project completion workflow (automatic feedback to KH, change detection).

**Engineering components:** BM25 search algorithm (segregation + retrieval), KH storage model (extended schema), Question segregation engine (multi-hub routing), Change detection algorithm (30–40% threshold), Retrieval API (verbatim + alternatives response format).

---

## Open Ended Questions
- Should the 30–40% change detection threshold be configurable per KH or global?
- When BM25 cannot confidently segregate a question to one hub, should it go to all candidate hubs or be held for manual routing?
- Should win/loss data from deal outcomes influence KH entry ranking?
- How should the system handle conflicting answers — same question, different answers in two hubs?
- Should there be a staleness policy that auto-archives KH entries with zero reuse after N months?
- What is the minimum quality bar for onboarding uploads — should the system reject sparse or incomplete RFPs?

---

## What Is Pushed to Next Version
- **Semantic / Vector Search Upgrade** — Move beyond BM25 to embedding-based semantic search for higher accuracy in retrieval and segregation.
- **Response Quality Scoring** — Answers ranked by reuse frequency, win rate, SME rating, and change detection history (stable answers ranked higher).
- **Deal Outcome Learning** — Winning proposals improve KH priority. Answers from won deals boosted in retrieval ranking.
- **Cross-Hub Answer Linking** — Auto-detect and link related answers across KHs to maintain consistency when the same topic spans multiple domains.

---

## Investigative Metrics
**Early adoption signals:**
- Number of KH entries created (onboarding + project feedback)
- % of completed projects contributing answers back to KH
- Average number of Knowledge Hubs selected per project

**Quality signals:**
- BM25 retrieval hit rate (% of questions with at least one match)
- Verbatim answer acceptance rate
- Alternative selection rate (v2 picks over primary)
- Average reuse count per KH entry

**Failure/drop-off signals:**
- Duplicate entries across hubs
- Segregation conflicts (questions flagged for manual routing)
- Redundant retraining rate (entries retrained with <30% change)
- Stale entries (zero reuse over extended period)
- Low-quality onboarding data leading to poor retrieval

---

## Final Notes
**Key assumptions:**
- Users will upload meaningful past RFPs during onboarding (not empty or junk data).
- Proposal teams will complete and review all questions within projects before submission.
- BM25 keyword matching provides sufficient accuracy for both segregation and retrieval in v1.
- A 30–40% change threshold is a reasonable heuristic for deciding when to retrain.

**Dependencies:**
- Knowledge Hub architecture (extended schema for reuse count, provenance, change tracking)
- BM25 search engine integration
- Change detection algorithm implementation
- Project completion event pipeline (to trigger feedback to KH)
- Onboarding flow update (RFP upload prompt with source tagging)

