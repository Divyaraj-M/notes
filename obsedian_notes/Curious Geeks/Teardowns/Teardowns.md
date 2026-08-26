---
description: "Lenses for pulling a product apart one piece at a time: onboarding, feature depth, and where the happy path stops being honest."
dg-publish: true
permalink: /teardowns/
tags:
  - curious_geeks
---

## 1. Onboarding Teardown

**Examines:** the first-run experience — what's asked upfront vs. deferred, time-to-first-value, whether the "aha moment" is engineered on purpose or just happens to occur.

**Sharp test:** if you can't point to the exact screen or action where the user's first real value hits, the onboarding hasn't earned trust yet — it's decoration before the real product starts.

**Use when:** evaluating signup flows, empty states, setup wizards, first-session design.

---

## 2. Feature Lens

**Examines:** one feature, deep — purpose (mechanical behavior vs. the job it's hired for vs. the pain it replaced), demand shape (frequency, trigger, breadth), system role (core / enabling / peripheral, and what depends on it), and cost of absence (user track vs. business track).

**Sharp test:** the off-diagonal cases are where the insight is — a feature that looks peripheral and rare can be a _Safety Net_ once you price its absence properly.

**Verdict grid:**

||Low criticality|High criticality|
|---|---|---|
|**High frequency**|Habit Surface — polish for delight|The Spine — optimize relentlessly|
|**Low frequency**|Cut Candidate — justify or remove|Safety Net — invisible until it can't fail|

**Use when:** isolating a single feature to decide invest / maintain / fix / cut.

_(Already built as a standalone skill — run per feature.)_

---

## 3. Core Loop Teardown

**Examines:** the repeatable loop that _is_ the product — input → action → reward → reinvestment. Distinct from onboarding: this asks "why would someone do this a second time," not "why did they do it once."

**Sharp test:** if the loop only works because of novelty, it isn't a loop — it's a demo. A real loop survives the fifth rep, not just the first.

**Use when:** evaluating the mechanical center of a product (the thing users repeat to get value) — feed loops, compose/publish loops, task-completion loops.

---

## 4. Sharing / Growth Loop Teardown

**Examines:** how new users enter the product via existing users — invite flows, content loops, network effects. Is sharing incentivized, incidental, or structurally absent from the product?

**Sharp test:** could this product still grow with the sharing mechanism ripped out? If yes, it's not a real growth loop — it's a "share" button nobody presses.

**Use when:** assessing virality, referral programs, collaboration-driven growth, or user-generated content loops.

---

## 5. Retention / Habit Teardown

**Examines:** what actually brings someone back without being asked — is there a designed return trigger (notification, streak, external cue, scheduled event), or does the product rely on the user simply remembering it exists?

**Sharp test:** name the trigger. If there isn't one, retention is luck, not design.

**Use when:** diagnosing churn, evaluating notification/streak/habit mechanics, or auditing whether "engagement" is actually engineered.

---

## 6. Monetization Teardown

**Examines:** the value metric, what's gated vs. free, and whether the upgrade moment lands when the user is _feeling_ the value spike or only when they hit a wall.

**Sharp test:** if the paywall interrupts the loop instead of following a value spike, it's optimized for the business, not the user — worth flagging either way, but name which one it is.

**Use when:** evaluating pricing tiers, paywalls, upgrade prompts, freemium boundaries.

---

## How to run one

1. Name the product's **core promise** in one sentence — everything else is measured against it.
2. Pick the teardown type that matches what you actually want to interrogate (don't default to Feature Lens just because it's the one with a built skill).
3. Run the sharp test explicitly — it's the part that catches the lazy answer.
4. Close with a plain-language verdict: what should change, and the single most important reason why.

The point of classifying these is to force the choice of _lens_ before the choice of _feature_ — so the teardown is a decision tool, not a highlight reel.
