<%*
const today = tp.date.now("YYYY-MM-DD");
const time  = tp.date.now("HHmm");
const desc = await tp.system.prompt("What did you spend on?", "");
const amount = await tp.system.prompt("Amount (₹)", "0");
const category = await tp.system.suggester(
  ["Food", "Transport", "Groceries", "Rent/Bills", "Health", "Learning", "Subscriptions", "Shopping", "Entertainment", "Other"],
  ["Food", "Transport", "Groceries", "Rent/Bills", "Health", "Learning", "Subscriptions", "Shopping", "Entertainment", "Other"],
  false,
  "Category?"
);
const safeDesc = desc.replace(/[\\/:*?"<>|]/g, "").slice(0, 40) || "Expense";
const filename = `${today} ${time} — ${safeDesc}`;
await tp.file.rename(filename);
await tp.file.move(`/Habit Tracker/Finance/${filename}`);
-%>
---
date: <% today %>
amount: <% Number(amount) %>
category: <% category %>
description: <% desc %>
type: expense
---

# <% desc %>

**Date:** <% today %>
**Amount:** ₹<% amount %>
**Category:** <% category %>

## Notes

