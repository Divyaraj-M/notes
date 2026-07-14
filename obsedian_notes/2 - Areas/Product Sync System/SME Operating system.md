---
state: "[[Focus]]"
tags:
  - learning/product_thinking/SME-operating
related:
  - "[[Competitors Info]]"
  - "[[Routine]]"
  - "[[1-Product Vision]]"
  - "[[First Principle thinking - Table View]]"
  - "[[Company Templates - Proposal]]"
  - "[[First-Principles Product Template]]"
  - "[[Udemy]]"
  - "[[Product Spec - Template]]"
  - "[[WYSIWYG editor - First Principle]]"
  - "[[Product Vision]]"
  - "[[Template - PM]]"
  - "[[Context info - PRD]]"
  - "[[proto-persona-profile]]"
  - "[[2025-12-12]]"
  - "[[Getting started  with SparrowGenie]]"
---

> Not a reading list. A daily system that produces artifacts, builds depth through reps, and turns you into the most dangerous PM in the room.

---

## The core idea

Demos are the spine. Every week you record yourself demoing SparrowGenie for a different persona. The stumbles are data. The gaps you feel in your gut — those get fixed permanently. Six personas across six weeks force depth across product, market, technical, and business dimensions simultaneously.

Every single day produces an artifact — a recording, a doc, a spreadsheet, a sketch. See also: [[Demo]] After 6 weeks you'll have a portfolio that proves depth, not a bookmark folder that proves intent.

---

## Demo practice system

### The demo-as-learning method

**Record, don't just practice.** Every Friday, record a 10-min demo of SparrowGenie. Pick a persona: procurement manager at a 500-person company, VP of sales at an enterprise, current internal user who's frustrated. Different persona = different flows = different depth. Use Loom or OBS. Watch it back Monday morning.

**What to watch for in playback (self-review checklist):**

- Where did you hesitate? → Gap in product knowledge
- Where did you make up a benefit? → Gap in market knowledge
- Where did the flow feel clunky? → UX insight to bring to Joel
- Where did you skip a feature? → Something you don't believe in yet — figure out why

### Demo script structure

This isn't a script — it's a skeleton:

1. Open with the customer's pain (30 sec)
2. Show the aha moment first, not the setup (60 sec)
3. Walk the core workflow end-to-end (4 min)
4. Show one thing they didn't expect (2 min)
5. Handle the objection you're most afraid of (2 min)
6. Close with what's coming next (1 min)

### The 6 demos in 6 weeks

|Week|Persona|Why this forces depth|
|---|---|---|
|1|Cold prospect using manual RFPs in Word/Excel|Forces you to articulate the problem from scratch|
|2|[[Loopio]]/[[Responsive.io|Responsive]] user evaluating a switch|Forces competitive fluency — you must know both products|
|3|Internal SurveySparrow power user|Forces you to know every edge case and workflow detail|
|4|CIO/VP evaluating AI tools (security + ROI)|Forces business case articulation and security knowledge|
|5|Implementation partner|Forces you to explain the platform, not just the product|
|6|Board-level — explain in 3 minutes|Forces ruthless prioritization of what matters|

**Output:** 6 recorded demos + a self-review doc with gap list

### Competitor demo practice

**30 min every Tuesday — use every competitor yourself.**

Sign up for free trials. Actually use Loopio, Responsive, Proposify, Qvidian, RFPIO. Go through their onboarding. Try to do the same task you'd do in SparrowGenie. Screenshot every screen. Note what's better, what's worse, what's different. This is not research — this is product intuition.

Record yourself using the competitor product for the same workflow. Put it side-by-side with your SparrowGenie demo. Show this to your eng team — it creates urgency and shared understanding better than any competitive analysis doc ever will.

**Build a comparison matrix that lives.** Rows are capabilities (import RFP, AI answer generation, knowledge hub, collaboration, export, analytics). Columns are competitors. Cells aren't checkmarks — they're notes like "Loopio does this but requires manual tagging; we auto-tag but miss edge cases in tables."

**Output:** Living competitive comparison doc, updated weekly

---

## Week 1-2: Know your product cold

> You cannot be an SME in the market if you don't know every pixel, every edge case, every broken flow in your own product.

### Monday — Product teardown (90 min)

**First 45 min: Full flow walkthrough**

Open SparrowGenie. Create a new project from scratch. Import an RFP. Go through every question. Use GenieAI on each. Try the Knowledge Hub source picker. Assign reviewers. Use the collaboration features. Export a proposal. Screenshot every screen. Note every friction point, every loading delay, every confusing label.

**Next 45 min: Edge case hunting**

What happens with a 200-question RFP? What if the Knowledge Hub has no relevant sources? What if two people edit the same answer? What does the experience look like for someone with the Viewer role vs Editor? Test the permission matrix you wrote against what actually ships. Find every gap between your PRD and reality.

**Output:** Product gap log — every friction point with severity rating

### Tuesday — Talk to one real user (60 min)

Not a usability test. Not a survey. Sit with one internal SurveySparrow user who uses SparrowGenie for actual RFPs. Watch them work. Don't talk for the first 15 minutes. Then ask:

- What's the most annoying thing?
- What workaround have you built?
- What would make you use this twice as much?

Write down exact quotes, not summaries.

**Output:** User quote bank — raw quotes organized by theme

### Wednesday — Map the data model (60 min)

Sit with an engineer. Map out: Project → Questions → Answers → Sources → Users → Roles → Proposals. How does GenieAI confidence get calculated? Where is the Knowledge Hub data stored? What's the latency bottleneck? What's the most fragile part of the system? You don't need to code — you need to draw the boxes and arrows and understand what breaks when.

**Output:** System architecture sketch you drew yourself

### Thursday — Read your own analytics (60 min)

Pull whatever analytics exist:

- How many projects created this month?
- How many questions answered by GenieAI vs manually?
- What's the average time from RFP import to proposal export?
- What's the completion rate?
- What percentage of GenieAI answers get edited by users?

If these numbers don't exist yet, that's your first product insight: you're flying blind. Define what should be tracked.

**Output:** Analytics gap analysis — what's tracked vs what should be

### Friday — Record demo #1 + week retro (90 min)

**First 60 min:** Record your first demo. Persona: procurement manager at a 500-person company who currently handles RFPs in Word and email. Record the full 10-min demo. Don't rehearse excessively — the stumbles are data.

**Last 30 min:** Write a 1-page doc:

- What did I learn this week that I didn't know Monday?
- What's the single biggest product problem I found?
- What's one thing I'd change about our roadmap based on this week?

Share it with your manager — this is the direction-setting muscle.

**Output:** Demo #1 recording + Week 1 retro doc

---

## Week 3-4: Know your market cold

> Who buys RFP software? Why? What triggers the purchase? What does the buying committee look like? What do they compare you against?

### Monday — Buyer persona deep-dive (90 min)

**First 45 min: Research the buyer**

The RFP automation buyer is usually: VP of Sales/Presales, Head of Proposals, or Procurement Lead. Search LinkedIn for people with these titles at companies with 200-2000 employees. Read their posts. What language do they use? What problems do they talk about? What tools do they mention? Join RFP-related LinkedIn groups and just read for a week.

**Next 45 min: Map the buying committee**

Enterprise SaaS is never one buyer. Map each role:

|Role|What they care about|What makes them say no|
|---|---|---|
|Champion (proposal manager)|Reducing time per RFP, answer quality|Too hard to set up, bad AI quality|
|Economic Buyer (VP)|ROI, win rate improvement|Can't justify cost, unclear payback|
|Technical Evaluator (IT/Security)|Data handling, SSO, compliance|No SOC 2, data residency concerns|
|End Users (the team)|Day-to-day usability, speed|Clunky UX, harder than current process|

Write their objections before they do.

**Output:** Buyer persona doc with objection map per role

### Tuesday — Competitor deep-use session (60 min)

Sign up. Import the same sample RFP you used in SparrowGenie. Go through the full workflow. Record your screen. Time yourself. Note where they're faster, where they're slower, where they have features you don't, where their AI is better/worse. This is not a checkbox exercise — you're building muscle memory of the alternative.

**Output:** Competitor walkthrough recording with timestamps

### Wednesday — Win/loss analysis (60 min)

If SparrowGenie has any closed deals (won or lost), get the story behind each one:

- What triggered the evaluation?
- What competitors were in the mix?
- What feature/capability was the deciding factor?
- What objection almost killed it?

If no deals yet, interview your internal users: what would make you pay for this vs keep using the free internal version?

**Output:** Win/loss log with patterns identified

### Thursday — SaaS metrics for your product (60 min)

Define these for SparrowGenie specifically:

- **Activation metric:** First project with 10+ questions answered by GenieAI?
- **Engagement metric:** Weekly active projects?
- **Value metric for pricing:** Number of RFPs processed? Number of users? Number of AI answers?
- **Unit economics model:** Model what your economics would look like at 10, 50, 100 customers. Use real assumptions.

**Output:** SparrowGenie unit economics model in a spreadsheet

### Friday — Record demo #3 + two-week retro (90 min)

**First 60 min:** Demo for the switcher persona. Current Loopio user evaluating alternatives. They know the category. They'll ask about content library migration, integrations, team workflows. Anticipate their comparison questions. This demo forces you to know both products.

**Last 30 min:** Compare Demo #1 to Demo #3 . Where are you sharper? Where do you still stumble? What market question can you not yet answer? Write a strategic recommendation to your manager: based on 2 weeks of deep work, here's the one thing I think we should change about our approach.

**Output:** Demo #3 recording + strategic recommendation doc

---

## Week 5-6: Know AI cold

> You're building an AI product. You need to understand what's possible, what's hard, and what's snake oil — at a level where engineers respect your input.

### Monday — Understand your own AI pipeline (90 min)

**First 60 min: GenieAI teardown with eng**

Sit with the engineer who built GenieAI. Understand:

- What model are you using?
- What's the prompt structure?
- How does RAG retrieval work (chunking strategy, embedding model, similarity threshold)?
- What's the latency breakdown (retrieval vs generation)?
- What happens when confidence is low?

Get the actual system prompt and read every line.

**Last 30 min: Test the boundaries**

Feed GenieAI deliberately hard questions: ambiguous ones, ones where the Knowledge Hub has conflicting info, ones requiring math or tables, ones in a different language. Document where it fails and categorize the failure modes: hallucination, retrieval miss, wrong source, confident-but-wrong, formatting error.

**Output:** GenieAI failure mode taxonomy with examples

### Tuesday — Build a tiny RAG prototype (60 min)

Use LangChain or LlamaIndex. Take 5 actual RFP documents. Chunk them. Embed them. Build a retrieval pipeline. Ask it questions. See how different chunking sizes change answer quality. See how different prompts change output. You don't need to be good at this — you need to understand what your engineers deal with so your PRDs are realistic.

**Output:** Working notebook with your RAG experiment

### Wednesday — Build an eval set (60 min)

Create 50 question-answer pairs from real RFPs where you know the correct answer. Run GenieAI on all 50. Score each: correct / partially correct / wrong / hallucinated. Calculate accuracy. This is now your baseline. Every model change, every prompt change, every Knowledge Hub change — run this eval set again. This is how AI PMs maintain quality.

**Output:** 50-question eval set with baseline scores

### Thursday — AI product patterns study (60 min)

Use 5 AI products that are doing it well: Notion AI, Superhuman AI, Cursor, Perplexity, Jasper. For each, note:

- How do they show confidence?
- How do they handle errors?
- How do they let users correct the AI?
- How do they use streaming?
- What's their "human-in-the-loop" pattern?

Bring these patterns back to SparrowGenie.

**Output:** AI UX pattern library from 5 products

### Friday — Demo #5 : the CIO persona + phase retro (90 min)

**First 60 min: Security + ROI demo**

Persona: CIO evaluating AI tools. They'll ask:

- Where does our data go?
- Do you train on our data?
- What's your SOC 2 status?
- What's the ROI?
- Can we audit AI decisions?

If you can't answer these confidently in a demo, you can't sell to enterprise. The gaps you find are your next PRD.

**Last 30 min: Phase 3 retro**

You've now done 5 demos across 5 personas. Write the definitive gap analysis: Product gaps, market gaps, AI gaps, knowledge gaps. Rank them by impact on revenue. Present this to your manager as a strategy input — not as a task list, but as a point of view about where SparrowGenie should go next.

**Output:** Demo #5 + SparrowGenie strategic gap analysis

---

## Daily habits (non-negotiable, 30 min total)

These happen every single day regardless of which week you're in.

### Morning scan (10 min, before standup)

Read 3 things:

1. **One SaaS metric tweet** — follow Jason Lemkin, Tomasz Tunguz, David Skok on X/LinkedIn
2. **One competitor update** — set Google Alerts for Loopio, Responsive, RFPIO, Qvidian
3. **One AI development** — follow Anthropic blog, OpenAI blog, Lenny's Newsletter

Don't read for 30 minutes — read for 10 and move on. The goal is pattern recognition over time, not deep reading.

### Product journal entry (10 min, end of workday)

Answer three questions in a running doc:

1. What did I learn today about our users, market, or product?
2. What decision did I make or influence, and what was my reasoning?
3. What's one thing I'd do differently?

After 30 days, read through the whole thing. The patterns will tell you where you're growing and where you're stuck.

### Teach someone one thing (10 min, once per week)

Explain one thing you learned this week to someone who didn't ask — a dev, Joel, your manager, a friend. If you can't explain it simply, you don't understand it yet. Post it in a team Slack channel as a "thing I learned this week." This builds your reputation as someone who's always learning and sharing, which is the foundation of influence.

---

## Artifact inventory after 6 weeks

By the end of this system, you will have produced:

|#|Artifact|Builds depth in|
|---|---|---|
|1|6 demo recordings (one per persona)|Product, market, communication|
|2|Product gap log with severity ratings|Product craft|
|3|User quote bank organized by theme|User research|
|4|System architecture sketch|Technical fluency|
|5|Analytics gap analysis|Data literacy|
|6|Living competitive comparison doc|Market knowledge|
|7|Competitor walkthrough recordings|Competitive fluency|
|8|Buyer persona doc with objection map|GTM strategy|
|9|Win/loss log with patterns|Market intelligence|
|10|Unit economics model|Business acumen|
|11|GenieAI failure mode taxonomy|AI depth|
|12|RAG prototype notebook|Technical hands-on|
|13|50-question eval set with baselines|AI quality systems|
|14|AI UX pattern library|Design literacy|
|15|Strategic gap analysis|Direction-setting|
|16|6 weekly retro docs|Strategic thinking|
|17|30+ product journal entries|Reflection habit|
|18|6+ "thing I learned" Slack posts|Influence building|

This is not a certificate. This is a body of work that makes you the most informed person in the room about your product, your market, and your AI.

---

## The mental model

```
Week 1-2: Know your product cold     → "I can demo every flow and name every bug"
Week 3-4: Know your market cold      → "I can predict what a buyer will ask before they ask it"
Week 5-6: Know AI cold               → "I can evaluate model output and write realistic PRDs"
Daily habits: Compound interest       → "I notice things others miss because I've been paying attention"
Demo practice: The through-line       → "I can sell this product to anyone because I've practiced with everyone"
```

The point is not to have an MBA. The point is to have done the reps.