<%*
const today = tp.date.now("YYYY-MM-DD");
const habit = await tp.system.suggester(
  ["Calories", "Exercise", "IIT Madras Study", "Product Case Study"],
  ["Calories", "Exercise", "IIT Madras Study", "Product Case Study"],
  false,
  "Which habit?"
);
const categoryMap = {
  "Calories": "Health",
  "Exercise": "Health",
  "IIT Madras Study": "Learning",
  "Product Case Study": "Creativity"
};
const targetMap = {
  "Calories": 2000,
  "Exercise": 1,
  "IIT Madras Study": 60,
  "Product Case Study": 1
};
const unitMap = {
  "Calories": "kcal",
  "Exercise": "session",
  "IIT Madras Study": "minutes",
  "Product Case Study": "session"
};
const completed = await tp.system.suggester(["true", "false"], [true, false], false, "Completed?");
const value = await tp.system.prompt(`Value (${unitMap[habit]})`, String(targetMap[habit]));
const notes = await tp.system.prompt("Notes (optional)", "");
const filename = `${today} — ${habit}`;
await tp.file.rename(filename);
await tp.file.move(`/Habit Tracker/Habits Log/${filename}`);
-%>
---
date: <% today %>
habit: <% habit %>
category: <% categoryMap[habit] %>
completed: <% completed %>
value: <% Number(value) %>
target: <% targetMap[habit] %>
unit: <% unitMap[habit] %>
notes: <% notes %>
type: habit-entry
---

# <% habit %> — <% today %>

**Status:** <% completed ? "✅ Done" : "⬜ Missed" %>
**Value:** <% value %> <% unitMap[habit] %> (target: <% targetMap[habit] %>)

## Notes

<% notes %>
