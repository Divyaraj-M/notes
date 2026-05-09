<%*
// Creates today's 4 habit entries in one go (all marked incomplete — fill them in as the day progresses).
const today = tp.date.now("YYYY-MM-DD");
const habits = [
  { name: "Calories",            cat: "Health",     target: 2000, unit: "kcal" },
  { name: "Exercise",            cat: "Health",     target: 1,    unit: "session" },
  { name: "IIT Madras Study",    cat: "Learning",   target: 60,   unit: "minutes" },
  { name: "Product Case Study",  cat: "Creativity", target: 1,    unit: "session" }
];

for (const h of habits) {
  const path = `Habit Tracker/Habits Log/${today} — ${h.name}.md`;
  const exists = await app.vault.adapter.exists(path);
  if (exists) continue;
  const body =
`---
date: ${today}
habit: ${h.name}
category: ${h.cat}
completed: false
value: 0
target: ${h.target}
unit: ${h.unit}
notes: ""
type: habit-entry
---

# ${h.name} — ${today}

**Status:** ⬜ Pending
**Value:** 0 ${h.unit} (target: ${h.target})

## Notes

`;
  await app.vault.create(path, body);
}
-%>
✅ Created today's 4 habit entries in `Habits Log/`. Open them and fill in the value + completed flag as the day goes on.
