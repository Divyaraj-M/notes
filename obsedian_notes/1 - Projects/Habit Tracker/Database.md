---
type: database
cssclasses:
  - habit-tracker
---

# 🗃 Habit Database

[[Habit Tracker|← Back to dashboard]]   ·   [[Analytics]]   ·   [[Finance]]

The full log — every habit entry, every day. Sortable in the Notion sense via Dataview.

## All entries

```dataview
TABLE WITHOUT ID
  dateformat(date, "yyyy-MM-dd ccc") AS "Date",
  habit AS "Habit",
  category AS "Category",
  choice(completed, "✅", "⬜") AS "Completed",
  (value + " " + unit) AS "Value",
  target AS "Target",
  notes AS "Notes",
  file.link AS "Open"
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry"
SORT date DESC, category ASC, habit ASC
```

## Filter views

### By habit — Calories
```dataview
TABLE WITHOUT ID
  dateformat(date, "yyyy-MM-dd ccc") AS "Date",
  choice(completed, "✅ ≤2k", "⬜") AS "Status",
  value AS "kcal",
  notes AS "Notes"
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry" AND habit = "Calories"
SORT date DESC
```

### By habit — Exercise
```dataview
TABLE WITHOUT ID
  dateformat(date, "yyyy-MM-dd ccc") AS "Date",
  choice(completed, "✅", "⬜") AS "Done",
  notes AS "Notes"
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry" AND habit = "Exercise"
SORT date DESC
```

### By habit — IIT Madras Study
```dataview
TABLE WITHOUT ID
  dateformat(date, "yyyy-MM-dd ccc") AS "Date",
  choice(completed, "✅", "⬜") AS "Done",
  value AS "Minutes",
  notes AS "Notes"
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry" AND habit = "IIT Madras Study"
SORT date DESC
```

### By habit — Product Case Study
```dataview
TABLE WITHOUT ID
  dateformat(date, "yyyy-MM-dd ccc") AS "Date",
  choice(completed, "✅", "⬜") AS "Done",
  notes AS "Notes"
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry" AND habit = "Product Case Study"
SORT date DESC
```

## Counters

```dataviewjs
const habits = ["Calories", "Exercise", "IIT Madras Study", "Product Case Study"];
const rows = habits.map(h => {
  const all = dv.pages('"Habit Tracker/Habits Log"').where(p => p.type==="habit-entry" && p.habit===h);
  const done = all.where(p => p.completed).length;
  return [h, all.length, done, all.length ? Math.round(100*done/all.length) + "%" : "—"];
});
dv.table(["Habit", "Logged", "Completed", "Rate"], rows);
```
