---
type: habit-definition
habit: Exercise
category: Health
target: 5
unit: sessions/week
direction: ≥
cadence: 5x/week
---

# 🏋️ Exercise

**Goal:** **5 exercise sessions per week** for 90 days.
**Category:** Health

## What counts

- 30+ min of intentional movement: gym, run, cycle, sport.
- A short walk doesn't count unless it's brisk and 30+ min.

## This week

```dataview
TABLE WITHOUT ID
  dateformat(date, "ccc dd") AS "Day",
  choice(completed, "✅", "⬜") AS "Done",
  notes AS "What"
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry" AND habit = "Exercise"
  AND date >= date(today) - dur(7 days)
SORT date DESC
```

## Weekly count

```dataviewjs
const today = dv.date("today");
const weeks = 6;
const rows = [];
for (let i = 0; i < weeks; i++) {
  const end = today.minus({days: i*7});
  const start = end.minus({days: 6});
  const done = dv.pages('"Habit Tracker/Habits Log"')
    .where(p => p.type==="habit-entry" && p.habit==="Exercise" && p.completed && p.date >= start && p.date <= end).length;
  rows.push([`${start.toFormat("dd LLL")} – ${end.toFormat("dd LLL")}`, `${done} / 5`, done >= 5 ? "✅" : "⏳"]);
}
dv.table(["Week", "Sessions", "Hit goal?"], rows);
```
