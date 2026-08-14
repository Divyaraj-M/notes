---
owner: Divyaraj Murugan
feature: "[[Knowledge]]"
version: 1
status: Done
priority: High
tags:
  - sparrowcrm/features/crm_intelligence/knowledge/KnowledgeBaseL3/v1
---

## 1. Problem Statement

A rep in front of a prospect who has to say **"I'll get back to you"** has already lost the moment — and today they say it constantly, because what the company has learned lives in senior reps' heads, in decks nobody can find, or in wikis that rot. At the same time, the CRM Intelligence layer has **no governed backdrop to reason _with_** — it can see records, but not the workspace's hard-won plays and reference material.

This hits every sales org, worst for new reps (long ramp) and teams with tribal knowledge. The cost of not solving it: reps sound only as good as their tenure, answers to prospects are slow or wrong, and the intelligence layer stays generic instead of workspace-specific.

**Honest v 1 value:** proximity and consumption, not yet intelligence. The knowledge a rep adds to a hub is **what their agents and Zulie reason with** — it lives inside the CRM, next to the deals, and is actively used by the AI. That is the v 1 pitch: _the knowledge you put here is what your AI reasons with._ (The "never say 'I'll get back to you'" answer-in-the-moment vision is the north star the v 1 foundation is built toward, not the v 1 promise.)

---

## 2. Jobs To Be Done

**Primary job statement:**

> When a prospect asks me something about our product or process, I want the current, accurate answer available to me and to my AI in the moment, so I can keep the conversation moving — regardless of how long I've been here.

**Functional:** Get a correct, cited answer (or have an agent/Zulie use it) drawn from the company's established knowledge — not a search-results page to sift. **Emotional:** Confident and unblocked — the rep trusts the answer is current, so they say it out loud instead of hedging. **Social:** Seen as competent in front of the customer; the company's knowledge, not the rep's seniority, sets how confident they sound.

**Secondary job (author/manager):** _When my team learns something — a winning play, an objection rebuttal — I want it captured as reusable, owned knowledge, so the lesson survives the rep who learned it and improves the next deal._

**Hiring criteria** — why they'd "hire" it:

- The knowledge they add is actually _used_ by their agents and Zulie, not filed and forgotten.
- Answers come in the flow (via Zulie), not a wiki hunt.
- It lives in the CRM, next to the work.

**Firing criteria** — why they'd abandon it:

- A confidently-stated **stale** answer burns them once → trust gone.
- It becomes a dump — full of things they could've read off one record — so retrieval returns noise.
- Authoring is a chore with no payoff, so nobody feeds it and it rots like the last wiki.

---

## 3. Goals

|#|Goal|How we know it succeeded|Type|
|---|---|---|---|
|G 1|The knowledge reps add is consumed by AI|Agents/Zulie retrievals cite Knowledge Hub items; grounded suggestions accepted at a higher rate than ungrounded|Business|
|G 2|Reps get answers in the flow|≥ 50% of Zulie "how do we…/what's our…" questions answered from Knowledge Hub **with a citation**, ≤ target latency|User|
|G 3|Knowledge is not a dump|Retrieval quality stays high as item count grows; add-flow nudges duplication of record facts back to the record|Quality|
|G 4|Reps actually feed it|# items added; % of hubs with ≥ 1 item; sustained authoring, not a one-time seed|Adoption|
|G 5|"I'll get back to you" drops / ramps shrink|New-rep time-to-productive-answer improves vs. baseline; self-reported "had to get back to them" decreases|Business|

---

## 4. Non-Goals

- **The formal knowledge-card model (later phase).** v 1's unit is a knowledge **item** (an uploaded file or a crawled link). The owned/dated/verifiable **card** model with freshness decay is the next phase, not v 1.
- **The Knowledge Agent / auto-distillation (v 2).** v 1 builds the receptacle and the verdict-gated intake pipe; automated pattern distillation from records waits for deal volume (a false pattern stated confidently is worse than no item).
- **Connected-source integrations (v 2).** SparrowDesk, Notion, Linear, Google Drive and any other source sync is **out of v 1** — there is no hub integration in v 1. v 1 intake is uploads + crawled links only.
- **Layer 2 — Context (v 2).** ICP, business profile, process conventions are a separate layer. Capabilities depending on L 2 (ICP-scored signals, deal-hygiene stage checks, Zulie fit-answers) are deferred or run on defaults.
- **General company-wide Glean/Guru replacement.** Sales-first and CRM-native for v 1.
- **Codebase-grounded product truth.** The differentiated wedge, but the hardest (code ≠ released ≠ supported) — future.
- **The "safe to say out loud" model** (prospect-repeatable vs. internal-only labels) — future; v 1 relies on the access model.
- **Per-item ACLs.** Governance is the two-gate role model (companion permissions PRD); per-item permissions are out.

---

## 5. User Stories

**P 0 — v 1**

1. As a rep, I want to add a file or a link into a hub and have it become usable knowledge, so my agents and Zulie can reason with it.
2. As a rep, I want to ask Zulie "how do we handle the SOC 2 objection?" and get a cited answer, so I can respond in the moment instead of getting back to them.
3. As a rep, I want a link I add to be **crawled into content** (not just bookmarked), with a **name and an auto-refresh cadence I choose** (default weekly), so the knowledge stays as current as that source needs without my managing it.
4. As a manager, I want to upload a battlecard, process doc, or competitor teardown into a shared hub, so the team's expertise is reusable.
5. As an agent-configurer, I want to choose exactly which hubs or files a given agent reasons over, so each agent uses only its relevant knowledge — not everything in the workspace.
6. As an admin, I want role-based control over who can view/edit/create/delete hubs, and per-hub view/edit roles, so reps get knowledge without destructive power. _(Companion permissions PRD.)_
7. As a system consumer (agent/Zulie), I retrieve from the Knowledge Hub on demand and only from hubs the running user can access, so private-hub knowledge never leaks through the AI.

**P 1 — next**

8. As a card owner, I want a re-verify prompt when my knowledge goes stale, so confidently-wrong knowledge doesn't stay live. _(Arrives with the card model.)_
9. As a manager, I want to manually promote a pattern I've noticed ("we keep losing healthcare on price") into a knowledge item, so a real lesson is captured before the agent exists to do it.

**P 2 — future**

10. As a manager, I want the Knowledge Agent to propose a pending item when a pattern crosses threshold, which I approve before it goes live — the same suggest→verdict→learn loop as hygiene.
11. As an admin, I want to connect SparrowDesk / Notion / Linear so existing knowledge syncs in.

---

## 6. Requirements

### Must-Have (P 0) — v 1: the receptacle

_v 1's unit is a knowledge **item** — an uploaded file or a crawled link — that lives in a **hub** and moves through the **training lifecycle**. The formal knowledge-**card** model and the Knowledge Agent are later phases._

- **R 1 — Hub + item store.** Users add knowledge **items** (uploaded files; crawled links) into **hubs**. Each item moves through the training lifecycle (crawling/processing → training → trained); only **trained** items are retrievable.
    - _AC:_ an item can be added, trained, retrieved, and removed within a hub; untrained items are not retrievable.
- **R 2 — Hub structure (flat, no folders).** A hub is a flat container of items grouped by type (Files · Links). No folder hierarchy. A hub carries a **name and description**, and the description is treated as grounding guidance for the AI ("how should the AI use this hub").
    - _AC:_ creating a hub requires name + description; items appear grouped by type; there is no nested-folder UI.
- **R 3 — Supported item types.** Uploaded files (PDF, doc, md, excel) and crawled links. Authored content shapes include battlecards, process docs, competitor teardowns, one-pagers, FAQs, case studies.
- **R 4 — Link crawling + per-link auto-refresh.** A link is **crawled into content** (page fetched and converted to usable knowledge), not stored as a bookmark. Adding a link opens an **Add Website** modal with three fields: **URL**, **Auto-refresh cadence**, and a **display name**. The item shows in the hub by its name, with last-crawled time and crawl state (crawling / trained / failed).
    - **Auto-refresh cadence** is chosen per link — **Weekly / Monthly / Yearly** — default **Weekly** (the freshest option available; users dial down for stable pages). Every link auto-refreshes on its cadence; there is no manual-only / "Never" option in v 1.
    - **Copyright note** (required helper text in the modal): "Add only websites that are in the public domain and that you own the copyright/license to use."
    - **Failure behavior:** if a scheduled re-crawl fails (page moved, went behind auth, timed out), the item **keeps its last-good content and is flagged stale** — it does not go dark or silently produce empty knowledge. Repeated failures surface to the item owner.
    - _AC:_ adding a link requires URL + name and defaults cadence to Weekly; a crawl shows visible state; a failed initial crawl surfaces an error and creates no empty knowledge; a failed re-crawl retains last-good content with a stale flag.
- **R 5 — Retrieval, answer-not-search.** Hub content is indexed and retrieved **on demand** by Zulie and Agents; the rep-facing surface is Zulie giving an answer **with a citation**, not a results page. A browse/search view of hub contents also exists for humans.
- **R 6 — Agent knowledge binding (explicit, capped).** On an agent's config, the user explicitly selects which **hubs or individual files** that agent reasons over — agents _pull_ from chosen knowledge, knowledge does not _push_ to agents. Bindings are **capped (start: 10 hubs/files per agent)** and framed as curation ("pick your most relevant sources"), because a focused agent gives better answers than one bound to everything. Retrieval still filters for relevance within the bound set.
    - _AC:_ an agent can bind up to the cap; binding is limited to hubs within the configuring user's access; a bound agent retrieves only from its bound set; exceeding the cap is prevented with a curation-framed message.
- **R 7 — AI respects access.** Agents/Zulie reason over a hub's content **only for users who can access that hub**. Private-hub knowledge never surfaces through the AI to someone without access.
    - _AC:_ a user without access to a hub never sees its content in a Zulie answer or agent suggestion.
- **R 8 — Governance / access (two gates).** **Gate 1 (workspace):** whether a user can operate the KB at all — a nested permission (Manage → Create → Delete, each implying the ones below; Delete is the parent, Manage the base). **Gate 2 (per-hub):** Owner / Editor / Viewer on a specific hub. A user cannot be shared into a hub unless they hold Gate-1 access. **Specified in the companion permissions PRD; a hard dependency of v 1.**
- **R 9 — Agent-ready, verdict-gated intake pipe.** The intake path is built so the future Knowledge Agent's proposals can land as **pending items behind a human verdict** with no rework. The gate is designed into v 1; the agent itself is v 2.
- **R 10 — Anti-dump nudge.** The add flow discourages duplicating what's already on a record ("is this already on a record?"). Full owner/date/verifiable enforcement arrives with the card model (P 1).
- **R 11 — Empty states.** New hub with no items, hub with no results, no hubs yet — each has an explicit, useful empty state (empty states are where knowledge tools live or die).

### Nice-to-Have (P 1)

- **R 12 — Formal knowledge-card model + verification-with-decay.** Every unit becomes an **owned, dated, verifiable card** with a **freshness state that decays on a schedule** plus re-verify prompts; stale cards are flagged and de-weighted in retrieval. The discipline that turns the receptacle into a _trusted_ system — the top near-term follow-on.
- **R 13 — Manual promotion UX.** First-class flow for a rep/manager to promote an observed pattern into a knowledge item that cites its supporting instances.
- **R 14 — Staleness routing.** Re-verify prompts routed to the right owner; contradiction flags ("item says we win on speed; last 3 deals lost on it").
- **R 15 — Smart binding defaults.** Suggest likely-relevant hubs per agent type so users curate rather than over-bind.

### Future Considerations (P 2)

- **R 16 — Knowledge Agent (Curator).** Auto-**distill** (propose items when a pattern crosses threshold) + **curate** (flag contradicted/stale items) via suggest→verdict→learn. Ships once deal volume makes patterns real.
- **R 17 — Connected-source integrations.** SparrowDesk, Notion, Linear, Google Drive — sync external sources in under the same law. **All connector/integration work is v 2.**
- **R 18 — Layer 2 Context** (ICP as structured fields/ranges, business profile, process conventions) — unlocks fit-answers and ICP-scored signals.
- **R 19 — Codebase-grounded product truth** with a code→released→supported mapping layer.
- **R 20 — "Safe to say out loud" model** (prospect-repeatable vs. internal-only labels).
- **R 21 — Broken-binding state** — graceful handling when a bound hub/file is deleted ("this agent's knowledge source was removed").
- **R 22 — Beyond sales / company-wide** expansion.

---

## 7. Placement

The Knowledge Hub is a **gated top-level surface**, not a settings page and not hidden inside the AI icon. Rationale (settled via The Council): knowledge is runtime-read fuel that reps contribute to and search during work — a work surface, not set-and-forget config — so it earns top-level placement; but it is **role-gated** (Gate 1), invisible to users without access, which satisfies "not everyone / not a public record."

- **Primary home:** a permissioned top-level "Knowledge" (Knowledge Hub) surface.
- **Secondary entry:** an "add to / view knowledge" hook inside the Zulie/AI flow — including a prompt to add knowledge at the moment Zulie can't answer something.
- **Governance:** the thin admin slice (workspace KB access defaults, who can create shared hubs) can live in settings; the hub work surface does not.

---

## 8. Success Metrics

**Leading (days–weeks)**

- AI-consumption: # of agent/Zulie retrievals citing Knowledge Hub items; grounded-vs-ungrounded acceptance gap.
- Answer coverage: % of eligible Zulie questions answered from the hub with a citation (target 50% / stretch 70%).
- Authoring adoption: # items created; % of hubs with ≥ 1 item; sustained (not one-time) adds.
- Crawl health: % of weekly re-crawls succeeding; stale/failed link count.
- Retrieval quality: click/accept rate on cited answers; "unhelpful" flags.

**Lagging (weeks–months)**

- "I'll get back to you" reduction (rep self-report / call analysis).
- New-rep ramp: time to confidently answer common questions.
- Grounded-suggestion acceptance vs. ungrounded (trust dividend).
- Retention/expansion signal for workspaces with an active, well-fed Knowledge Hub.

Measurement: product analytics (retrieval + authoring events), crawl-job state, Zulie answer logs, call analysis. Evaluate at 1 week (instrumentation), 1 month (adoption), 1 quarter (lagging).

---

## 9. Open Questions

| #   | Question                                                                                                                                                                                                                 | Owner         | Blocking?                      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | ------------------------------ |
| Q 1 | Agent binding cap number (start 10) — validate against real usage; hard cap vs. warn-past-threshold.                                                                                                                     | PM + Data     | Non-blocking (start 10)        |
| Q 2 | Gate-1 Delete scope — admin override (delete any hub) vs. own-hubs-only.                                                                                                                                                 | PM + Eng      | Blocking (permissions FRD)     |
| Q 3 | Crawl backoff — after how many consecutive failed re-crawls does the system stop retrying and hard-flag the link for the owner? (Per-link cadence + keep-last-good-on-failure are decided; retry/backoff count is open.) | PM + Eng      | Blocking (crawl build)         |
| Q 4 | Item → card migration: how do v 1 items become P 1 cards without rework (owner/date/freshness added on top)?                                                                                                             | PM + Eng      | Blocking for P 1, not v 1      |
| Q 5 | Sales-scoped vs. company-wide for v 1? (Lean: sales-first.)                                                                                                                                                              | PM            | Non-blocking (v 1 = sales)     |
| Q 6 | Retrieval routing policy — which Zulie question types hit L 1 vs. L 3 (and later L 2).                                                                                                                                   | PM + Eng      | Non-blocking (v 1 = L 3 + L 1) |
| Q 7 | "Safe to say out loud" model.                                                                                                                                                                                            | PM + Security | Non-blocking (future)          |
| Q 8 | Pattern threshold for the Knowledge Agent — how many instances before proposing; false-pattern avoidance at low volume.                                                                                                  | PM + Data     | Non-blocking (v 2)             |

---

## 10. Timeline & Sequencing — foundation before longshot

SparrowKnowledge (replace Glean+Guru for the sales team) is a long shot; the discipline is to build the foundation that makes the vision _possible_, ship the small version, expand.

- **Phase 1 — Receptacle (v 1, this PRD):** hubs holding uploaded files & weekly-crawled links, the training lifecycle, retrieval via Zulie with citation, explicit capped agent knowledge-binding, the two-gate access model, and an agent-ready verdict-gated intake pipe. _v 1 promise: "the docs and links in your hubs are what your agents and Zulie reason with."_
- **Phase 1.5 — Card discipline (next):** the formal knowledge-**card** model (owned + dated + verifiable + freshness decay), the human verdict loop for knowledge, and manual pattern promotion — what makes the receptacle _trusted_.
- **Phase 2 — Engine & integrations:** the **Knowledge Agent** auto-distills patterns from closed deals (once deal volume is real) + curates freshness; **connected-source integrations** (SparrowDesk, Notion, Linear, Google Drive); **Layer 2 — Context** ships, unlocking fit-answers and ICP-scored signals.
- **Phase 3 — Breadth:** the **codebase-grounded product-truth** differentiator, then the "safe to say" model, then any beyond-sales expansion.

**Dependencies:** L 2 Context (v 2) gates fit/ICP capabilities; the Knowledge Agent gates on deal volume; connected-source sync gates on integrations. **Do not let the long-shot vision block shipping the small, honest v 1.**