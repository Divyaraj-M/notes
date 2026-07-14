---
related:
  - "[[8 - Decisions]]"
  - "[[persona-first-decision-facilitation-loop]]"
  - "[[Udemy]]"
  - "[[Decision-State Progress Bars]]"
  - "[[Next 90 Day objective - Feb 1 to Apr 30]]"
  - "[[customer-journey-mapping-prompt-template]]"
  - "[[2-Product Strategy]]"
  - "[[EN-Decisions]]"
  - "[[PRD Feature Name]]"
  - "[[Kibana]]"
  - "[[Atomic Habits and deliberate practice applied to product management]]"
  - "[[Custom Agent builderv1]]"
  - "[[Teardowns]]"
  - "[[Elastic Search]]"
  - "[[Edge case Analysis]]"
---
#learning 
# One-Way vs Two-Way Door Decisions

## Purpose

This document defines how to classify, evaluate, and act on **one-way** and **two-way** door decisions as a Product Manager. The goal is to slow down only when it truly matters, and move fast everywhere else.

Senior PM performance is judged by **decision quality under uncertainty**, not by feature output.

---

## Core Definitions

### Two-Way Door Decisions

**Reversible decisions.** You can decide, observe impact, and roll back without lasting damage.

Characteristics:

- No permanent data change
- No long-term trust impact
- Low rollback cost
- Users can relearn quickly

Examples:

- UI layout changes
- Copy or wording updates
- Button placement
- Default sorting
- Feature flags

Expectation:

- Decide fast
- Minimal documentation
- Bias toward action
- Learn and iterate


---

### One-Way Door Decisions

**Irreversible or extremely costly to reverse.** Once shipped, reversing creates trust, data, or compliance risk.

Characteristics:

- Permanent data or schema changes
- Security or permission model changes
- Ownership or accountability changes
- Pricing, contracts, or compliance impact
- High rollback cost or customer disruption


Examples:

- Role-based permission models
- Ownership rules
- Audit logs
- Pricing models
- Core data schema

Expectation:

- Slow down deliberately    
- Document assumptions
- Explicitly state tradeoffs
- Align stakeholders
- Decide once, confidently


---

## The Key Question: “Why Can’t We Go Back?”

A decision is **one-way** if **any** of the following are true:

|Reason|Explanation|
|---|---|
|Permanent data change|User data or history cannot be restored|
|Locked mental model|Users adapt behavior and won’t relearn|
|External dependency|Legal, pricing, contracts, integrations|
|Trust risk|Rollback feels unstable or unsafe|
|High reversal cost|Migration or months of rework|

If none apply, the decision is **two-way**.

---

## Decision Classification Checklist

Before making any decision, answer these questions:

|   |   |   |
|---|---|---|
|Question|Yes →|No →|
|Does this permanently change user data?|One-way|Two-way|
|Does this redefine ownership or access?|One-way|Two-way|
|Will rollback confuse or anger users?|One-way|Two-way|
|Does it affect pricing, contracts, or compliance?|One-way|Two-way|
|Is rollback cheap and fast (< 1 week)?|Two-way|One-way|

**Rule:** If two or more answers fall in the One-way column, treat the decision as **one-way**.

---

## SparrowGenie-Specific Examples

|   |   |   |
|---|---|---|
|Decision|Door Type|Reason|
|Role-based permissions|One-way|Security and trust|
|Answer ownership rules|One-way|Accountability|
|Audit logs|One-way|Compliance|
|Pricing model|One-way|Customer trust and churn risk|
|Core response data schema|One-way|Migration pain|
|UI layout|Two-way|Cheap rollback|
|Copy text|Two-way|No data impact|
|Button placement|Two-way|Easily reversible|
|Default sort order|Two-way|Learnable behavior|
|Feature flag rollout|Two-way|Controlled exposure|

---

## Rigor Expectations by Door Type

### Two-Way Door

- Decide quickly
- Ship early
- Measure impact
- Roll back if needed

### One-Way Door

- Write down assumptions
- Explicitly list tradeoffs
- Identify risks and blast radius
- Get alignment where needed
- Commit once

---

## The Senior PM Rule

> The job is not to be right. The job is to know when being wrong is safe.

Bad PMs treat everything as one-way and slow the product. Bad PMs treat one-way decisions as two-way and break trust.

Great PMs classify correctly — **before** deciding.

---

## How This Document Should Be Used

- Classify every major product decision
- Move fast on two-way doors
- Apply rigor only to true one-way doors
- Use this as a shared language with engineering and leadership

This framework is mandatory for all high-impact product decisions.