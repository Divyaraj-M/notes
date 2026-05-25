---
description: ix months of using Obsidian for product management — from scattered Confluence docs to a connected knowledge graph that AI can actually reason over
dg-publish: true
tags:
  - curious_geeks/blog
created: 2026-05-25
---
Your Confluence has 200 pages. None of them know about each other. You spend half your week hunting for context that already exists somewhere in that pile. Obsidian fixes that — and once you point AI at it, the gap gets ridiculous.

## The Problem

Every PM I know runs the same scavenger hunt. Why did we decide not to build X? Where's the dependency between feature A and feature B? What was the context behind that Q 1 decision? The answers exist — spread across PRDs, decision logs, Slack threads, and someone's memory. Confluence stores documents. It doesn't connect them.

I'm six months into using [Obsidian](https://obsidian.md/) for my product work. My entire product context lives there now. Here's what I think.

## What's Good

**The graph.** This is the whole pitch. Every note links to every other note with `[[wikilinks]]`. Your permissions flow links to gateway specs links to role definitions links to resource sharing model. Obsidian has a graph view that shows you these connections visually. You stop thinking in documents and start thinking in relationships.

Obsidian had this graph thing for years, by the way. Connected knowledge nodes, long before anyone slapped "AI-powered" on everything. It just wasn't trendy. Now it's the backbone of half the AI workflows people are hyped about.

**You catch breakage faster.** The real PM skill isn't designing happy paths — it's finding where they fall apart. That takes cross-cutting context. How do features depend on each other? What breaks when you poke the edges?

> [!tip] Try this Pick any flow you're working on. Ask: "What if the user enters through gateway B instead of A?" "What if they have viewer access but the UI assumes editor?" "What if the sharing link was created before the policy changed?" Watch the dominoes fall. That's the test your spec needs to survive.

Before Obsidian, running that test meant weeks of interviews and Slack archaeology. Now I follow the links. The context is already there, already connected.

**==AI turns it into something else entirely.==** Point [Claude Code](https://claude.ai/) at your vault. Now your AI has every decision, every dependency, every "we tried this and it broke because." When I spec something new, it doesn't just help me write — it warns me where it'll break. It knows the permissions flow has two gateways. It knows role resolution changes depending on how the resource was shared. It flags the parts I haven't scoped yet.

Weeks to days. That's the real number.

## What's Annoying

**Two weeks of pain.** You're writing Markdown, managing your own folders, building links by hand. No "just type and publish." If you've been in Confluence your whole career, the first fortnight feels like going backwards.

**It's a solo tool.** Obsidian is local-first. Great for speed, less great for sharing specs with your team. You'll need Obsidian Sync or Git, and your team isn't ditching Confluence tomorrow. Think of it as your personal product brain, not a team wiki.

**You have to maintain it.** The graph is only as useful as the links you build. Dump notes without connecting them and you've got a fancy folder of `.md` files. I spend about 10 minutes a week cleaning up orphaned notes and reviewing connections. Skip that and entropy wins.

## Who Cares

PMs whose product has enough complexity that _finding context_ is a real bottleneck. If your product fits in your head and your team's happy with Confluence — you probably don't need this.

But if you're answering "why did we do it this way" from memory, if your specs keep getting blindsided by dependencies nobody documented, if you're already using AI tools and wish they had more context — Obsidian is worth the learning curve.

## Verdict

Best tool I've added to my PM workflow in years. Not because it's flashy — it's literally just Markdown files and links. But that simplicity is the point. You build a connected knowledge base, the graph keeps you honest about dependencies, and when you hand it to AI, it becomes a context engine that catches what you'd miss.

The two-week ramp is real. The payoff after that is permanent.

---

Written by [[Divyaraj Murugan]] 
