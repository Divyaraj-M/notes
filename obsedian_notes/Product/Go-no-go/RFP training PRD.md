---
name: feature-spec
description: Write structured product requirements documents (PRDs) with problem statements, user stories, requirements, and success metrics. Use when speccing a new feature, writing a PRD, defining acceptance criteria, prioritizing requirements, or documenting product decisions.
tags:
  - new_feauture/knowledge_hub
---

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

**How it helps sales teams close faster:**
- **Faster proposals:** BM25 agent instantly retrieves verbatim answers from KH, reducing manual effort from the first question.
- **Better AI responses:** KH grows with human-reviewed, project-level answers — the most authoritative data source available.
- **Consistent positioning:** Answers centralized per KH, eliminating divergent responses across projects.
- **Institutional memory:** Reuse tracking and change detection ensure high-value answers persist and evolve, surviving employee turnover.

**Expected business impact:**

| Metric                 | Expected Change                           |
| ---------------------- | ----------------------------------------- |
| Proposal creation time | ↓ 30–50%                                  |
| SME involvement        | ↓ 25–40%                                  |
| Response consistency   | ↑                                         |
| AI answer quality      | ↑ (compounds with each completed project) |

---

## Goals
1. **Reduce RFP answer time by 30–50%** — by surfacing verbatim answers and ranked alternatives from KH via BM25 retrieval.
2. **Close the knowledge feedback loop** — ensure ≥60% of completed projects contribute reviewed Q&A pairs back to the appropriate Knowledge Hub(s) within 90 days of launch.
3. **Prevent knowledge staleness** — track reuse count and apply change detection so KH entries stay current without redundant retraining.
4. **Reduce SME burden by 25–40%** — by reusing prior answers instead of pulling SMEs into every new proposal.
5. **Establish data authority hierarchy** — project-reviewed answers weighted higher than onboarding uploads; source clearly tagged in UI and ranking.

---

## Non-Goals
1. **Semantic / vector-based search** — BM25 keyword matching is the chosen approach for v1. Embeddings are a v2 upgrade. *(Rationale: faster to ship, engineering team confident in BM25 for initial accuracy.)*
2. **External content ingestion** — no import from sources outside SparrowGenie (e.g., Confluence, SharePoint). *(Rationale: adds integration complexity; internal loop is the priority.)*
3. **Cross-organization KH sharing** — KH data stays within the org boundary. *(Rationale: security/privacy concerns, low demand in v1.)*
4. **Fully automated ingestion without human review** — project-level human validation remains the quality gate. *(Rationale: accuracy trust must be established before removing the human.)*
5. **Auto-tagging and taxonomy management** — tagging is a known open issue but will not block v1 launch. *(Rationale: needs design research; manual tagging is acceptable for now.)*

---

## Target Users (Audience)
**Primary user:** Proposal Owner / Proposal Manager — creates projects, selects Knowledge Hubs, reviews AI-suggested answers, and validates final responses. They drive both knowledge consumption (retrieving answers) and contribution (reviewed answers flow back to KH).

**Secondary users:**
- **SMEs** — provide domain-specific answers within projects. Their reviewed contributions are among the highest-authority inputs trained back into KH.
- **Sales Engineers** — reuse technical responses across deals, benefit from increasingly accurate AI suggestions as KH grows.

**Out of scope:** End customers, procurement teams, external collaborators. This feature focuses only on the **internal knowledge loop — ingestion, retrieval, and retraining.**

---

## User Stories

**Proposal Owner:**
- As a Proposal Owner, I want to upload past RFPs during onboarding so that the Knowledge Hub has seed data for AI to retrieve answers from day one.
- As a Proposal Owner, I want to select one or more Knowledge Hubs when creating a project so that BM25 retrieval searches the right domain of answers.
- As a Proposal Owner, I want to see verbatim answer suggestions with ranked alternatives when answering RFP questions so that I can accept, edit, or pick the best match without starting from scratch.
- As a Proposal Owner, I want reviewed Q&A pairs to automatically flow back to the correct Knowledge Hub after project completion so that future proposals benefit from my work.
- As a Proposal Owner, I want to see which answers came from onboarding uploads vs project-trained data so that I can judge their authority when choosing between alternatives.

**SME:**
- As an SME, I want my reviewed answers to be reused in future proposals so that I am not repeatedly asked the same questions across deals.
- As an SME, I want to see how many times my answers have been reused so that I understand the impact of my contributions.

**Knowledge Admin:**
- As a Knowledge Admin, I want to resolve segregation conflicts when BM25 cannot confidently route a question to a single hub so that Q&A pairs end up in the right place.
- As a Knowledge Admin, I want to see which KH entries are stale or unused so that I can archive low-value content and keep hubs clean.

**Edge case stories:**
- As a Proposal Owner, I want the system to flag when an uploaded RFP cannot be parsed into Q&A format so that I can manually structure the content instead of losing it.
- As a Proposal Owner, I want to be notified when a reused answer's change is near the 30–40% threshold so that I can decide whether it should be retrained or not.

---

## Requirements

### Must-Have (P0)
**1. Onboarding KH Seeding (yet to be implemented)**
During onboarding, the product prompts users to upload ~10 past RFPs with answers into one or more Knowledge Hubs. Uploaded RFP content must be parsed and structured into Q&A format. UI must clearly tag these as "Uploaded RFPs" for weightage differentiation.

Acceptance criteria:
- [ ] User can upload RFP documents (PDF, Word) during onboarding flow
- [ ] System parses uploaded RFPs and extracts Q&A pairs
- [ ] Parsed Q&As are stored in the selected Knowledge Hub(s) with source tagged as "Onboarding Upload"
- [ ] If parsing fails (unstructured content, images), system flags the document for manual structuring
- [ ] UI displays "Uploaded RFP" badge on entries sourced from onboarding

**2. Project-to-KH Feedback Loop**
When an RFP project is completed and all questions are answered and reviewed by humans, those Q&A pairs are trained back into the Knowledge Hub. Feedback path differs by hub selection:
- **Single Hub:** All project Q&As redirect directly to that KH — no segregation needed.
- **Multiple Hubs:** BM25 segregation routes each Q&A to the correct hub.

Acceptance criteria:
- [ ] Upon project completion, system triggers feedback pipeline automatically
- [ ] Single-hub projects: all Q&As route directly to the selected KH
- [ ] Multi-hub projects: BM25 segregation assigns each Q&A to the best-matching hub
- [ ] Project-sourced entries are tagged with Project ID and marked as higher authority than onboarding uploads
- [ ] Feedback does not occur for incomplete or unreviewed projects

**3. BM25-Based Question Segregation (multi-hub only)**
When a project spans multiple Knowledge Hubs, BM25 search identifies keyword similarity and routes each answered question to the correct KH. KH usage patterns cannot be predicted, so segregation must handle unexpected distributions.

Acceptance criteria:
- [ ] BM25 assigns each Q&A to the hub with highest keyword similarity
- [ ] If BM25 cannot confidently assign (equal scores across hubs), question is flagged for manual routing
- [ ] Knowledge Admin can resolve flagged segregation conflicts
- [ ] Single-hub projects bypass segregation entirely

**4. BM25-Based Answer Retrieval**
When a new RFP is uploaded and the user selects a KH, BM25 agent searches existing Q&A by keyword:
- **Single match** → verbatim answer
- **Multiple matches** → best match as primary + ranked alternatives with confidence score
- **No match** → AI generates answer from broader KH context

Acceptance criteria:
- [ ] BM25 search executes when RFP questions are loaded against selected KH(s)
- [ ] Single match: verbatim answer auto-populated in the answer field
- [ ] Multiple matches: primary answer shown with alternatives listed below, each with confidence score
- [ ] User can select any alternative to replace the primary suggestion
- [ ] No match: AI attempts to generate an answer from KH context; question marked as "AI Generated"
- [ ] Source badge visible on each suggestion (Onboarding Upload vs Project-Trained)

**5. Reuse Tracking**
Each KH entry maintains a usage stat tracking how many times it has been reused across projects.

Acceptance criteria:
- [ ] Reuse count increments each time an answer is used in a new project
- [ ] Reuse count is visible on the KH entry detail view
- [ ] BM25 ranking factors in reuse count (higher = more trusted)

**6. Change Detection & Deduplication**
When a reused question returns from a completed project, an algorithm measures how much the answer changed vs the existing KH entry. If changed >30–40%, retrain. If not, record provenance and increment reuse count.

Acceptance criteria:
- [ ] System computes change percentage between returning answer and existing KH entry
- [ ] If change >30–40%: entry is retrained with the new answer, old version preserved in history
- [ ] If change <30–40%: provenance recorded (source project ID), reuse count incremented, no retraining
- [ ] Borderline cases (near threshold): flagged for user review rather than auto-deciding
- [ ] Change percentage stored on the KH entry for audit

### Nice-to-Have (P1)
- **Confidence scoring on BM25 matches** — numeric score displayed alongside alternatives to help users pick the best answer.
- **Quality scoring of KH entries** — composite score based on reuse frequency + acceptance rate, visible on KH entry detail.

### Future Considerations (P2)
- **Semantic / Vector Search Upgrade** — embedding-based search for higher retrieval and segregation accuracy.
- **Response Quality Scoring** — ranking by reuse frequency, win rate, SME rating, change detection history.
- **Deal Outcome Learning** — answers from won deals boosted in retrieval ranking.
- **Cross-Hub Answer Linking** — auto-detect and link related answers across KHs for consistency.

---

## Success Metrics

### Leading Indicators (days to weeks)
| Metric | Target | Measurement |
|---|---|---|
| BM25 retrieval hit rate | ≥50% of questions get at least one match | % of questions with ≥1 BM25 result, measured per project |
| Verbatim answer acceptance rate | ≥30% of suggested answers accepted without edit | % of BM25 suggestions accepted as-is |
| Content parsing success rate | ≥80% of uploaded RFPs cleanly parsed into Q&A | % of onboarding uploads that produce structured Q&A |
| Project feedback trigger rate | 100% of completed projects trigger the feedback pipeline | Event log audit |

### Lagging Indicators (weeks to months)
| Metric                                | Target               | Measurement                                                  |
| ------------------------------------- | -------------------- | ------------------------------------------------------------ |
| Proposal creation time reduction      | ↓ 30–50% vs baseline | Average time per proposal, before vs after                   |
| SME requests per proposal             | ↓ 25–40%             | Count of SME assignments per project                         |
| % of projects contributing back to KH | ≥60% within 90 days  | Projects with ≥1 Q&A trained back / total completed projects |
| Average reuse count per KH entry      | ≥3 within 6 months   | Mean reuse count across all active KH entries                |
| Redundant retraining rate             | <10%                 | Entries retrained with <30% actual change                    |

**Evaluation cadence:** Leading indicators reviewed weekly for first 4 weeks post-launch. Lagging indicators reviewed at 30, 60, 90 days.

---

# Implementation

## Experience
### Primary User Flow
1. **Onboarding:** User uploads ~10 past RFPs into one or more Knowledge Hubs. System parses content into Q&A format (seed data).
2. **Project Creation:** User creates a new RFP project and selects one or more Knowledge Hubs.
3. **Answer Retrieval:** BM25 agent searches selected KHs. Single match → verbatim answer. Multiple matches → ranked alternatives. No match → AI generates from KH context.
4. **Project Execution:** Proposal team answers remaining questions, reviews AI suggestions, finalizes all responses with human validation.
5. **Feedback to KH:** Upon project completion — single hub: direct redirect. Multiple hubs: BM25 segregation routes Q&As to correct KHs.
6. **Change Detection:** Existing KH entries compared. If changed >30–40% → retrain. If not → record provenance, increment reuse count.

### Key Moments
- **Onboarding Upload** — seeds KH, establishes retrieval baseline.
- **Answer Retrieval on New RFP** — primary value moment; users experience time savings.
- **Project Completion Feedback** — closes the loop; single-hub direct, multi-hub via BM25.
- **Change Detection Gate** — prevents redundant retraining while keeping KH current.

### Edge Cases
- **Single Hub Redirect:** One KH selected → all Q&As go directly, BM25 segregation bypassed.
- **Multi-Hub Segregation Ambiguity:** Equal BM25 scores → flag for manual routing by Knowledge Admin.
- **Multiple Answer Matches:** Alternatives shown with confidence score. Non-selected ranked lower in future.
- **Borderline Change Detection (~30–40%):** Flagged for user review, not auto-decided.
- **Duplicate Content Across Hubs:** Same Q&A in multiple KHs tracked as linked entries.
- **Content Parsing Failures:** Unstructured PDFs/images flagged for manual structuring.
- **Tagging Issues:** Tag assignment during onboarding is unresolved; affects segregation accuracy.
- **Ownership Changes:** Knowledge persists regardless of user status. Reuse count and provenance preserved.
- **Empty/Low-Quality Onboarding Data:** System warns users about sparse KHs.

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
| Tags | Topic/category classification (open issue) |
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
1. BM25 searches KH by keyword similarity against the incoming question
2. Single strong match → verbatim answer
3. Multiple matches → best match as primary, others as ranked alternatives (v2)
4. No match → AI generates answer from broader KH context

**Ranking priorities:** Keyword match strength (BM25 score) → Reuse count (higher = more trusted) → Recency of last retraining

---

## Impact Areas
**Product areas:** Knowledge Hub (storage, lifecycle, reuse tracking), Onboarding flow (upload, parsing, seeding), Project creation (KH selection, single vs multi-hub), RFP answer editor (BM25 retrieval, suggestions, alternatives), Project completion workflow (direct routing vs BM25 segregation, change detection).

**Engineering components:** BM25 search algorithm, Content parser (RFP → Q&A), KH storage model (extended schema), Question segregation engine, Change detection algorithm (30–40% threshold), Retrieval API (verbatim + alternatives).

---

## Open Ended Questions
| Question | Owner | Blocking? |
|---|---|---|
| How should tags be assigned to Q&A pairs? Auto-generated, user-defined, or inherited from KH taxonomy? | Design + Engineering | Non-blocking (manual tagging for v1) |
| How do we parse Q&A from varied RFP formats (PDF, Word, unstructured)? | Engineering | **Blocking** |
| What is the max limit for alternatives shown during retrieval? BM25 score threshold or fixed cap? | Product + Engineering | Non-blocking |
| KH usage patterns are unpredictable — how do we handle hubs that grow unevenly or stay sparse? | Product | Non-blocking |
| Should the 30–40% change threshold be configurable per KH or global? | Product + Engineering | Non-blocking |
| When BM25 can't segregate confidently, route to all candidate hubs or hold for manual? | Product | Non-blocking |
| Should win/loss data influence KH entry ranking? | Product | Non-blocking (v2 consideration) |
| How to handle conflicting answers — same question, different answers in two hubs? | Product + Design | Non-blocking |
| Staleness policy — auto-archive KH entries with zero reuse after N months? | Product | Non-blocking |

---

## Timeline Considerations
- **Blocking dependency:** Content parsing pipeline must be functional before onboarding KH seeding can work. Engineering spike recommended.
- **Phasing suggestion:** If timeline is tight, ship retrieval + single-hub feedback first (P0 items 2, 4, 5, 6). Onboarding seeding and multi-hub segregation can follow as phase 2.
- **No hard external deadlines identified** — but every week without the feedback loop means completed projects lose their knowledge contribution.

---

## Investigative Metrics
**Early adoption signals:**
- Number of KH entries created (onboarding + project feedback)
- % of completed projects contributing answers back to KH
- Single-hub vs multi-hub project distribution

**Quality signals:**
- BM25 retrieval hit rate
- Verbatim answer acceptance rate
- Alternative selection rate (v2 picks over primary)
- Content parsing success rate

**Failure/drop-off signals:**
- Segregation conflicts flagged for manual routing
- Redundant retraining rate (entries retrained with <30% change)
- Stale entries (zero reuse over extended period)
- Parsing failures on uploaded RFPs

---

## Final Notes
**Key assumptions:**
- Users will upload meaningful past RFPs during onboarding.
- Proposal teams will complete and review all questions before submission.
- BM25 keyword matching provides sufficient accuracy for v1.
- 30–40% change threshold is a reasonable retraining heuristic.
- Single-hub projects are the common case; multi-hub segregation is the exception.

**Dependencies:**
- Knowledge Hub architecture (extended schema)
- BM25 search engine integration
- Content parsing pipeline (RFP → structured Q&A)
- Change detection algorithm
- Project completion event pipeline
- Onboarding flow update (upload prompt with source tagging)
