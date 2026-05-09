---
type: habit-definition
habit: IIT Madras Study
category: Learning
target: 60
unit: minutes
direction: ≥
cadence: daily
---

# 📚 IIT Madras Study

**Goal:** **≥ 60 minutes of focused study every day** for 90 days.
**Category:** Learning

## What counts

- Watching recorded lectures with notes (not passive scroll).
- Doing problem sets.
- Active recall / writing summaries.
- Mock tests.

Reading the textbook lazily on phone doesn't count — needs to produce notes or solved problems.

## Recent log

```dataview
TABLE WITHOUT ID
  dateformat(date, "ccc dd LLL") AS "Date",
  choice(completed, "✅", "⬜") AS "Done",
  value AS "Minutes",
  notes AS "What I studied"
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry" AND habit = "IIT Madras Study"
SORT date DESC
LIMIT 21
```

## Total minutes — last 30 days

```dataviewjs
const today = dv.date("today");
const minutes = dv.pages('"Habit Tracker/Habits Log"')
  .where(p => p.type==="habit-entry" && p.habit==="IIT Madras Study" && (today - p.date)/(1000*60*60*24) <= 30)
  .array()
  .reduce((s,p) => s + (p.value || 0), 0);
dv.paragraph(`**Total minutes (30d):** ${minutes.toLocaleString()} min · **${(minutes/60).toFixed(1)} hours**`);
```
