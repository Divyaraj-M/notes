---
status: Draft
created: 2026-04-30
updated: 2026-04-30
tags:
  - sparrowcrm/road_map/prioritization_matirx
related:
  - "[[README]]"
  - "[[Hybrid thinking product framework]]"
  - "[[Jira Process]]"
  - "[[Competitors Info PRD]]"
  - "[[Product Management - Top Deliverables]]"
  - "[[Elastic Search]]"
  - "[[Product Spec - Template]]"
  - "[[Doc Workflow Two-Doc System]]"
  - "[[CRM Metrics Framework]]"
  - "[[Product Management - Top Deliverables]]"
  - "[[strategic-scrum-team-session-kickoff]]"
  - "[[recommendation-canvas-template]]"
  - "[[Product Spec Template 2]]"
  - "[[company-profile-executive-insights-research]]"
  - "[[2026-02-13]]"
---

# Jira Product Discovery Prioritization Framework

## Overview

This framework helps prioritize ideas using a weighted scoring model.

The objective is to maximize business value while accounting for engineering effort.

Engineering should prioritize items with the highest **Execution Score**.

---

# Fields

| Field | Type |
|---------|---------|
| Priority | Single Select |
| Impact | Number (1-5) |
| Stakeholder Push | Yes / No |
| Deal Push | Yes / No |
| Customer Push | Yes / No |
| BU Push | Yes / No |
| Confidence | Single Select |
| Effort Score | Single Select |

---

# Scoring Values

## Priority

| Value | Score |
|---------|---------|
| Urgent | 10 |
| High | 5 |
| Medium | 3 |
| Low | 1 |

---

## Impact

| Value | Score |
|---------|---------|
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
| 4 | 4 |
| 5 | 5 |

---

## Stakeholder Push

| Value | Score |
|---------|---------|
| Yes | 10 |
| No | 0 |

---

## Deal Push

| Value | Score |
|---------|---------|
| Yes | 25 |
| No | 0 |

---

## Customer Push

| Value | Score |
|---------|---------|
| Yes | 20 |
| No | 0 |

---

## BU Push

| Value | Score |
|---------|---------|
| Yes | 30 |
| No | 0 |

---

## Confidence

| Value | Score |
|---------|---------|
| High | 15 |
| Medium | 8 |
| Low | 0 |

---

## Effort Score

| Value | Score |
|---------|---------|
| Small | 25 |
| Medium | 50 |
| Large | 75 |
| XL | 100 |

---

# Calculation Logic

## Importance Score

Measures the overall business value of an idea.

### Formula

```text
Importance Score =
(Priority × 10)
+ (Impact × 20)
+ Stakeholder Push
+ Deal Push
+ Customer Push
+ BU Push
+ Confidence
```

---

## Execution Score

Measures value relative to effort.

### Formula

```text
Execution Score =
Importance Score ÷ Effort Score
```

---

# Decision Flow

```text
Priority
   ↓
Impact
   ↓
Stakeholder Push
   ↓
Deal Push
   ↓
Customer Push
   ↓
BU Push
   ↓
Confidence
   ↓

Importance Score

   ↓

Importance Score ÷ Effort Score

   ↓

Execution Score
```

---

# Example

## Inputs

| Field | Value |
|---------|---------|
| Priority | High |
| Impact | 4 |
| Stakeholder Push | Yes |
| Deal Push | Yes |
| Customer Push | No |
| BU Push | Yes |
| Confidence | High |
| Effort Score | Medium |

---

## Score Conversion

| Field | Score |
|---------|---------|
| Priority | 5 |
| Impact | 4 |
| Stakeholder Push | 10 |
| Deal Push | 25 |
| Customer Push | 0 |
| BU Push | 30 |
| Confidence | 15 |
| Effort Score | 50 |

---

## Importance Score Calculation

```text
(5 × 10)
+ (4 × 20)
+ 10
+ 25
+ 0
+ 30
+ 15

= 210
```

**Importance Score = 210**

---

## Execution Score Calculation

```text
210 ÷ 50
= 4.2
```

**Execution Score = 4.2**

---

# Prioritization Rule

Sort ideas by **Execution Score** in descending order.

Higher scores should be prioritized first.

Example:

| Idea | Execution Score |
|---------|---------|
| Feature A | 5.4 |
| Feature B | 4.2 |
| Feature C | 3.1 |

Recommended Order:

1. Feature A
2. Feature B
3. Feature C

---

# Interpretation Guide

| Execution Score | Interpretation |
|---------|---------|
| > 5 | Extremely attractive investment |
| 3 - 5 | Strong candidate |
| 1 - 3 | Moderate priority |
| < 1 | Low value relative to effort |

---

# Jira Fields

| Field Name | Purpose |
|---------|---------|
| Priority | Business urgency |
| Importance Score | Auto-calculated value score |
| Effort Score | Engineering effort estimate |
| Execution Score | Auto-calculated prioritization score |
| Source | Origin of request |
| Reason / Evidence | Supporting data and rationale |

---

# Engineering Prioritization Rule

Engineering should select work based on the highest:

```text
Execution Score
```

This ensures that high-value, high-impact opportunities with reasonable implementation effort are delivered first.