# Habit Tracker — Obsidian Edition

A 90-day habit + finance tracker built to mirror the [Simple Habit Tracker + Analytics Notion template](https://fxjournaltemplate.notion.site/Simple-Habit-Tracker-Analytics-306134f15a94804096cbeb1d96572e14).

**Start window:** 2026-05-09 → 2026-08-07 (90 days)

## Open this first

[[Habit Tracker]] — main dashboard (Today + This Week views)
[[Analytics]] — charts, streaks, heatmaps
[[Database]] — full habit log (every entry)
[[Finance]] — expenses + spending heatmap

## Required Obsidian plugins

Install these from **Settings → Community plugins**:

1. **Dataview** by Michael Brenan — drives every table/list view. Enable JavaScript Queries in its settings.
2. **Obsidian Charts** by Johannes Theiner — renders the bar/line charts on the Analytics page.
3. **Templater** by SilentVoid — one-click create of the day's habit entries and expenses. Set the template folder to `_templates`.
4. **Heatmap Calendar** by Richard Slettevoll *(recommended for the spending + habits heatmaps)* — install and enable; the JS blocks on Analytics and Finance call `renderHeatmapCalendar()`.

After installing, restart Obsidian and open [[Habit Tracker]].

## Your 90-day goals

| Habit | Category | Target | Cadence |
| --- | --- | --- | --- |
| Calories ≤ 2000 | Health | 2000 kcal/day | Daily |
| Exercise | Health | 5×/week | Daily check-in |
| IIT Madras study | Learning | ≥ 60 min/day | Daily |
| Product case study | Creativity | Daily progress | Daily |
| Daily expenses | Finance | Log every spend | As-it-happens |

## How the data flows

Every entry — habit check-in or expense — is its own markdown file with YAML frontmatter. Dataview reads the frontmatter and renders the Notion-style tables, lists, charts, and heatmaps.

```
Habit Tracker/
├── Habit Tracker.md      ← main hub (Today + This Week)
├── Analytics.md          ← charts, streaks, heatmaps
├── Database.md           ← every habit entry, sortable
├── Finance.md            ← expenses + spending heatmap
├── README.md
├── Habits/               ← one definition file per habit
├── Habits Log/           ← one entry per habit per day (e.g. 2026-05-09 — Exercise.md)
├── Finance/              ← one entry per expense
└── _templates/           ← Templater templates
```

## Daily routine (60 seconds)

1. Open [[Habit Tracker]].
2. Click **New Habit Entry** (Templater command palette: `Templater: Create new note from template → Habit Entry`).
3. Pick the habit, fill `completed:` and any value (calories, minutes, notes).
4. Repeat for each habit — or run the **Daily Habits Bundle** template once to scaffold all four entries for today.
5. Log expenses as they happen with the **Expense** template.

That's it — Analytics updates automatically.
