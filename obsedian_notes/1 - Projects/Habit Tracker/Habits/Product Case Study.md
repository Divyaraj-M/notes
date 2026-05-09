---
type: habit-definition
habit: Product Case Study
category: Creativity
target: 1
unit: session
direction: ≥
cadence: daily
---

# 🎨 Product Case Study

**Goal:** Make daily progress on **a written product case study** for 90 days. The deliverable: one polished case study by 2026-08-07.

**Category:** Creativity

## What "done for the day" means

A real chunk of work, not a token line: at least one of —

- Wrote a section (problem, user, hypothesis, solution, metrics, etc.).
- Did interviews / pulled data.
- Made or revised diagrams.
- Re-wrote / edited a section.

Use the `notes:` field to keep yourself honest about what you actually moved.

## Daily progress log

```dataview
TABLE WITHOUT ID
  dateformat(date, "ccc dd LLL") AS "Date",
  choice(completed, "✅", "⬜") AS "Done",
  notes AS "What I moved today"
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry" AND habit = "Product Case Study"
SORT date DESC
```
