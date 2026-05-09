---
type: habit-definition
habit: Calories
category: Health
target: 2000
unit: kcal
direction: ≤
cadence: daily
---

# 🍱 Calories

**Goal:** Stay at or under **2000 kcal/day** for 90 days (2026-05-09 → 2026-08-07).
**Category:** Health
**Why:** Sustainable cut, keeps energy for studying and exercise.

## How I count

- Log every meal as it happens; better to over-estimate than miss.
- Drinks count if they have calories.
- Cheat meals: log honestly, no shame, just data.

## Recent log

```dataview
TABLE WITHOUT ID
  dateformat(date, "ccc dd LLL") AS "Date",
  choice(completed, "✅ ≤2k", "⛔ over") AS "Status",
  value AS "kcal",
  notes AS "Notes"
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry" AND habit = "Calories"
SORT date DESC
LIMIT 21
```
