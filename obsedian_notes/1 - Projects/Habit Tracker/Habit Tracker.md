---
type: dashboard
cssclasses:
  - habit-tracker
---

# 🌱 Simple Habit Tracker + Analytics

> 90-day sprint: **2026-05-09 → 2026-08-07**
> Calories ≤ 2000 · Exercise 5×/wk · IIT Madras study 1h+/day · Product case study daily

## Quick actions

- ➕ **New Habit Entry** — `Cmd/Ctrl+P` → *Templater: Create new note from template* → **Habit Entry**
- 🗓 **Scaffold today (all 4 habits)** — *Templater* → **Daily Habits Bundle**
- 💸 **Log Expense** — *Templater* → **Expense**

🔗 [[Analytics]]   ·   [[Database]]   ·   [[Finance]]   ·   [[README]]

---

## ✅ Today

```dataview
TABLE WITHOUT ID
  habit AS "Habit",
  category AS "Category",
  choice(completed, "✅", "⬜") AS "Done",
  (value + " " + unit) AS "Value",
  target AS "Target",
  notes AS "Notes"
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry" AND date = date(today)
SORT category ASC, habit ASC
```

### By category — Today

> Click a category heading to scan that bucket. (Obsidian doesn't render Notion-style tabs, so each filter is its own block.)

#### 🩺 Health
```dataview
LIST WITHOUT ID
  choice(completed, "✅", "⬜") + " **" + habit + "** — " + value + " " + unit + " / " + target + choice(length(notes) > 0, " · " + notes, "")
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry" AND date = date(today) AND category = "Health"
SORT habit ASC
```

#### 🧠 Mindset
```dataview
LIST WITHOUT ID
  choice(completed, "✅", "⬜") + " **" + habit + "** — " + value + " " + unit + choice(length(notes) > 0, " · " + notes, "")
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry" AND date = date(today) AND category = "Mindset"
SORT habit ASC
```

#### 📚 Learning
```dataview
LIST WITHOUT ID
  choice(completed, "✅", "⬜") + " **" + habit + "** — " + value + " " + unit + " / " + target + choice(length(notes) > 0, " · " + notes, "")
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry" AND date = date(today) AND category = "Learning"
SORT habit ASC
```

#### 🎨 Creativity
```dataview
LIST WITHOUT ID
  choice(completed, "✅", "⬜") + " **" + habit + "** — " + value + " " + unit + choice(length(notes) > 0, " · " + notes, "")
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry" AND date = date(today) AND category = "Creativity"
SORT habit ASC
```

---

## 📅 This Week

```dataview
TABLE WITHOUT ID
  dateformat(date, "ccc dd LLL") AS "Date",
  habit AS "Habit",
  category AS "Category",
  choice(completed, "✅", "⬜") AS "Done",
  (value + " " + unit) AS "Value",
  notes AS "Notes"
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry"
  AND date >= date(today) - dur(7 days)
  AND date <= date(today)
SORT date DESC, category ASC, habit ASC
```

### By category — This Week

#### 🩺 Health
```dataview
TABLE WITHOUT ID
  dateformat(date, "ccc dd") AS "Day",
  habit AS "Habit",
  choice(completed, "✅", "⬜") AS "Done",
  (value + " " + unit) AS "Value"
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry" AND category = "Health"
  AND date >= date(today) - dur(7 days)
SORT date DESC, habit ASC
```

#### 🧠 Mindset
```dataview
TABLE WITHOUT ID
  dateformat(date, "ccc dd") AS "Day",
  habit AS "Habit",
  choice(completed, "✅", "⬜") AS "Done"
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry" AND category = "Mindset"
  AND date >= date(today) - dur(7 days)
SORT date DESC, habit ASC
```

#### 📚 Learning
```dataview
TABLE WITHOUT ID
  dateformat(date, "ccc dd") AS "Day",
  habit AS "Habit",
  choice(completed, "✅", "⬜") AS "Done",
  (value + " " + unit) AS "Value"
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry" AND category = "Learning"
  AND date >= date(today) - dur(7 days)
SORT date DESC, habit ASC
```

#### 🎨 Creativity
```dataview
TABLE WITHOUT ID
  dateformat(date, "ccc dd") AS "Day",
  habit AS "Habit",
  choice(completed, "✅", "⬜") AS "Done"
FROM "Habit Tracker/Habits Log"
WHERE type = "habit-entry" AND category = "Creativity"
  AND date >= date(today) - dur(7 days)
SORT date DESC, habit ASC
```

---

## 💡 Start Here: Set Up the Template

> [!tip]- How to use this tracker
> 1. Install the four plugins listed in [[README]] — Dataview, Charts, Templater, Heatmap Calendar.
> 2. In Templater settings, set the template folder to `Habit Tracker/_templates`.
> 3. Each morning, run **Daily Habits Bundle** to scaffold today's 4 entries.
> 4. As the day goes, open each entry and update `completed:` and `value:` in the YAML frontmatter.
> 5. Log expenses on the fly with the **Expense** template.
> 6. Check [[Analytics]] for streaks, completion %, and the 90-day heatmap.

> [!info]- Day-of-sprint counter
> ```dataviewjs
> const start = dv.date("2026-05-09");
> const today = dv.date("today");
> const day = Math.floor((today - start) / (1000*60*60*24)) + 1;
> dv.paragraph(`**Day ${day} of 90** · ${90 - day} days remaining`);
> ```
