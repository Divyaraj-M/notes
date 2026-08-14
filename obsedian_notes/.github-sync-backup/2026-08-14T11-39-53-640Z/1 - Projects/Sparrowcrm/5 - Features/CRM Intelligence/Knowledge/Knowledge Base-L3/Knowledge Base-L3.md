---
owner: Divyaraj Murugan
status:
tags:
  - sparrowcrm/features/crm_intelligence/knowledge/KnowledgeBaseL3
---

## 1. What this layer is

Layer 3 is the **Knowledge Base** — what is true _across_ records, retrieved on demand. It answers **"what have we learned, and how do we handle this?"** — the lessons, patterns, plays, and reference material that help the next person act, none of which lives on any single record.

This is the layer that must not become a file dump. Its whole reason to exist is that it holds what Layers 1 and 2 cannot: the generalization across instances, and the deliberately authored expertise that isn't captured anywhere else.

---

## 1 a. What ships in v 1 — the receptacle, built agent-ready

L 3 v 1 is the **Knowledge Base as a receptacle** — the container and its intake pipe, built fully before the automated source (the Knowledge Agent) exists. Three things ship:

1. **Support for all knowledge types** (§1 b) — the KB can hold and retrieve every content type sales needs.
2. **The card structure** — owned, dated, verifiable, per §3's law — applied to both authored material and (later) distilled patterns.
3. **Agent-ready ingestion** — the intake path is built so that when the Knowledge Agent arrives (v 2+), the patterns it distills from Layer 1 records **push into L 3 through the same pipe**, landing as _pending knowledge cards_ that someone approves before they go live — exactly like hygiene-agent suggestions. No rework when the agent plugs in; the destination and the verdict gate already exist.

What is **not** in v 1: the Knowledge Agent itself (auto-distillation from records), and anything depending on Layer 2 Context (L 2 is v 2 — so KB v 1 leans on its authored path and manual pattern promotion, not on workspace rules).

### 1 b. Supported knowledge types (v 1)

Authored / uploaded:

- Battlecards
- Sales-process docs
- Competitor teardowns
- Product one-pagers / feature docs
- FAQs
- Case studies
- Uploaded files (PDF, doc, sheet)

Connected sources (synced):

- SparrowDesk KB
- Notion
- Linear

Every type, regardless of entry path, obeys the same law: owned, dated, verifiable, and subject to freshness decay.

---

## 2. First principle (inherited, sharpened for this layer)

> **Pattern, not instance.** A single record is a data point, not knowledge. Layer 3 holds what rises _above_ the instance — and every piece of it must be **owned, dated, and verifiable.** Anything that merely restates a fact already on a record is duplication and does not belong here.

The anti-dump law in one test: _could I have found this by reading one record?_ If yes → it's Layer 1, not knowledge. If it's a lesson across records, or authored expertise found nowhere in the CRM → it's Layer 3, **provided it has an owner and a freshness date.** An orphaned file with neither is a dump; the same content, owned and dated, is knowledge.

---

## 3. Two entry paths, one law

Layer 3 knowledge arrives two ways. Both are legitimate; both obey the same owned-dated-verifiable law.

**Path A — Distilled (bottom-up, from records).** A pattern emerges across instances and is promoted to a knowledge card. "Across our healthcare losses under 200 employees, price is the blocker 60% of the time; wins led with implementation speed." Distilled knowledge **cites the instances that support it** — that's its verifiability. Not for deals only: every object distills its own pattern type.

|Object|Pattern it produces|
|---|---|
|Deals|Win/loss patterns, objection handling, competitive plays|
|Contacts|Persona/role behavior ("how VPs of RevOps evaluate")|
|Companies|Segment patterns ("what mid-market healthcare cares about")|
|Activities|Messaging patterns (which pitches land)|

**Path B — Authored (top-down, from expertise).** A human writes or uploads reusable material: battlecards, sales-process docs, competitor teardowns, product one-pagers, connected content from SparrowDesk / Notion / Linear. Authored knowledge **cites its owner** — that's its verifiability.

The unifying law: distilled cites its instances, authored cites its owner, and **both go stale on a schedule.** Freshness is not optional — a battlecard nobody has verified in eight months is worse than nothing, because it's confidently wrong. Verification-with-decay is the single feature that separates a trusted KB from an abandoned wiki.

---

## 4. The Knowledge Agent (Curator)

A distinct agent whose domain is Layer 3 — it reasons over **aggregates**, not single records, which makes it a different animal from hygiene or research. Two jobs:

- **Distill** — watch for patterns worth promoting ("we've now lost 5 healthcare deals to the same objection — card it?") and propose them as verdictable knowledge suggestions. It proposes the _lesson across deals_, never a copy of one deal.
- **Curate** — watch for knowledge contradicted by new events ("this card says we win on speed, but the last 3 deals lost on it — flag for review") and propose retirement or update. This is the freshness engine.

It runs the same **suggest → verdict → learn** loop as every agent, pointed at knowledge instead of records: closed deal (or pattern threshold, or staleness) → proposed card → **human verdict (approve before it goes live in the KB, exactly like a hygiene-agent suggestion)** → published knowledge. An agent writing unreviewed patterns straight into the KB is the "confidently wrong stale card" failure the whole layer exists to prevent — so distilled cards are always pending until approved. That structural identity is why Layer 3 belongs inside the intelligence layer, not beside it.

**The Knowledge Agent is v 2, not v 1.** L 3 v 1 builds the receptacle and the verdict-gated intake pipe (§1 a) so the agent plugs in without rework when deal volume justifies it.

---

## 5. Nature of this layer

|Property|Value|
|---|---|
|Altitude|Pattern — across many instances|
|Origin|Distilled from records, or authored/uploaded|
|Change rate|Grows continuously as work happens; decays without verification|
|Retrieval|On demand (RAG / answer-layer via Zulie)|
|Reasoned about or with|**With** — retrieved when a question needs it|
|Governance|Every card owned + dated + verifiable; staleness enforced|

---

## 6. Vision — SparrowKnowledge

The ambition for this layer: a sales rep should **never have to say "I'll get back to you."** Every answer about the product, the process, and the deal that a rep needs to keep a conversation moving should be one question away — accurate, current, and safe to say — regardless of tenure. A company's knowledge, not a rep's seniority, should determine how confident they sound in front of a customer.

What makes it more than a Glean/Guru clone:

1. **Self-populating from work.** Knowledge enters as a byproduct of deals closing and features shipping — not as a separate documentation chore that always loses to real work. This is the distill path, and it's why the KB grows instead of rotting.
2. **Decisions with rationale, not bare facts.** "We discounted Acme 10% _because_ they were price-sensitive, multi-year, and referenceable — and it worked" teaches judgment that survives policy changes. A fact rots; a reasoned decision endures.
3. **Answer, don't retrieve.** The interface is Zulie giving the answer with a citation, not a search-results page. A rep needs the answer without breaking eye contact with the prospect — findable-in-two-minutes still loses the moment.
4. **Codebase-grounded product truth.** "Is this feature available?" answered from actual release/flag state — something Glean and Guru cannot do because they aren't in the product. Product knowledge self-populates from engineering's work the way sales knowledge self-populates from closed deals. The differentiated wedge; also the hardest (code ≠ released ≠ supported — needs a careful mapping layer).
5. **Deal-context answers.** Not "here's the security whitepaper" but "Acme is healthcare, here's our HIPAA story and the two case studies matching their size." Only possible because L 3 sits with L 2 and L 1 in one layer.

**Two tensions to hold honestly:**

- **Access ≠ accuracy.** Making everything instantly accessible makes _wrong_ answers instantly accessible too. A confidently-repeated stale battlecard is worse than "let me check." Accessibility has a hard dependency on the freshness system.
- **"Everyone" has edges.** Unreleased roadmap, pricing floors, competitive intel — some knowledge shouldn't be repeatable to a prospect verbatim. The design is "no rep is blocked from what they need, and the system knows what's safe to say out loud" — not literally "everyone sees everything."

---

## 7. Sequencing — foundation before longshot

SparrowKnowledge is a long shot (Glean and Guru are each whole companies). The discipline: build the foundation that makes the vision _possible_, ship the small version, expand.

- **Foundation first:** the card structure (lesson/decision + rationale + supporting instances or owner + freshness date), the verdict loop for knowledge, and **manual promotion** — a rep/manager promotes a pattern or writes a card by hand. Manual-first proves reps _want_ the cards and lets a human judge whether N instances is really a pattern (an agent can't, at low volume).
- **Then the engine:** the Knowledge Agent auto-distills patterns from closed deals — but only once deal volume is real. Pre-PMF, five deals is an anecdote, not a pattern; a false pattern stated with confidence is worse than no card. Auto-distillation waits for volume.
- **Then breadth:** more connected sources (SparrowDesk, Notion, Linear), then the codebase-grounding differentiator.

The vision is "SparrowKnowledge replaces Glean+Guru for your sales team." The v 1 is "Zulie can answer from your battlecards, and each card is owned and dated." Don't let the first prevent shipping the second.

---

## 8. Open questions

- Sales-team-scoped vs. company-wide? (Lean: sales-first, CRM-native — win the surface you own before fighting Glean head-on.)
- Card schema — exact fields for distilled vs. authored cards.
- Freshness policy — decay schedule per knowledge type; who gets the re-verify prompt.
- "Safe to say out loud" model — how the system marks prospect-repeatable vs. internal-only knowledge.
- Codebase → customer-truth mapping — how "in the code" becomes "released and supported."
- Pattern threshold — how many instances before the Knowledge Agent proposes a card (and how it avoids false patterns at low volume).

---

_Companion docs: Knowledge (parent) · Layer 1 — Records · Layer 2 — Context · CRM Intelligence — The Layer._