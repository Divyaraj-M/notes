---
dg-publish: true
dg-home: true
tags:
  - curious_geeks
---
Got a product problem? Something here might help you think through it.

Not perfect answers — but frameworks, case studies, and lessons from actually building things. The kind of stuff I wish someone had written down before I had to figure it out the hard way.

---

## Start Here

If you're new, these hit the hardest:

- [[Obsidian Replaced My PM's Second Brain (And Then Gave It to AI)]] — From scattered docs to a knowledge graph your AI can actually reason over.
- [[The Domino Test]] — Everyone can design a happy path. The hard part is where things break.
- [[The Feature That Broke Three Others]] — A dependency chain nobody mapped. What happened and what we built to catch the next one.

---

## Recent Products

```dataview
TABLE WITHOUT ID
  ("[[Products/" + file.name + "|" + title + "]]") AS Product,
  tagline AS Tagline,
  date AS Added
FROM "Products"
WHERE file.name != "Products" AND file.name != "_template" AND dg-publish = true
SORT date DESC
LIMIT 4
```

[[Products/Products|See all products →]]

---

## Join the Community

Got a product to share or just want to follow along?

> [!tip] Join Curious Geeks
> [Join the community →](TALLY_JOIN_FORM_URL)

---

## Recent Posts

- [[How to Become a Product Manager (Without a Course or a Framework)]] — You're already doing product thinking. You just don't know it yet. `hot-take`
- [[Shipping Nodes Before the AI Era Made It Cool]] — We built a knowledge graph feature years before the hype. What we learned still holds. `case-study`
- [[From Confluence Chaos to Connected Knowledge]] — Migrating 200+ product docs and what broke (and what clicked). `case-study`
- [[The Domino Test]] — Your happy flow is lying to you. Here's how to prove it. `hot-take`

---

## Case Studies

Real problems, real constraints, what actually happened.

- [[RFP Response Time — 2 Weeks to 2 Days]] — How AI-assisted proposal generation collapsed the sales cycle for a mid-market SaaS team.
- [[From Confluence Chaos to Connected Knowledge]] — Migrating 200+ product docs into Obsidian and what broke (and what clicked).
- [[The Feature That Broke Three Others]] — A dependency chain nobody mapped. How we found it and built the system to catch the next one.

---

## Frameworks & Mental Models

The thinking tools I keep coming back to.

**Product Thinking:** [[Jobs To Be Done]] · [[MoSCoW Prioritization]] · [[Decision Logs]] · [[Second-Order Effects]]

**Tools & Workflows:** [[Knowledge Graphs for PMs]] · [[Obsidian + Claude Code]] · [[AI as a Reasoning Partner]]

**How Things Break:** [[Dependency Mapping]] · [[The Domino Test]]

---

## About

I'm [[Divyaraj Murugan]]  — product manager working on AI-powered B2B SaaS. I write here because the best way to understand something is to explain it. If something saves you a week of figuring it out yourself, it did its job.

**Find me:** [LinkedIn](https://www.linkedin.com/in/divyaraj-murugan)

---

_© Divyaraj Murugan · Curious Geeks_