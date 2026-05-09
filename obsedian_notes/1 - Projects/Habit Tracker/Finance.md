---
type: finance-dashboard
cssclasses:
  - habit-tracker
---

# 💸 Finance Tracker

[[Habit Tracker|← Back to dashboard]]   ·   [[Analytics]]   ·   [[Database]]

> Every expense is a tiny markdown file in `Habit Tracker/Finance/` with `amount`, `category`, `date`, `description`. Add one with `Cmd/Ctrl+P` → *Templater* → **Expense**.

## Today's spend

```dataviewjs
const today = dv.date("today").toISODate();
const items = dv.pages('"Habit Tracker/Finance"')
  .where(p => p.type === "expense" && p.date.toISODate() === today)
  .sort(p => p.file.ctime, "desc");
const total = items.array().reduce((s, p) => s + (p.amount || 0), 0);
dv.paragraph(`**Total today:** ₹${total.toLocaleString("en-IN")} — ${items.length} ${items.length===1?"item":"items"}`);
dv.table(
  ["Time", "Description", "Category", "₹"],
  items.array().map(p => [
    dv.date(p.file.ctime).toFormat("HH:mm"),
    p.description,
    p.category,
    "₹" + (p.amount || 0).toLocaleString("en-IN")
  ])
);
```

## This week

```dataviewjs
const today = dv.date("today");
const weekStart = today.minus({days: 6});
const items = dv.pages('"Habit Tracker/Finance"')
  .where(p => p.type === "expense" && p.date >= weekStart && p.date <= today);
const total = items.array().reduce((s, p) => s + (p.amount || 0), 0);
dv.paragraph(`**This week:** ₹${total.toLocaleString("en-IN")} across ${items.length} entries · daily avg ₹${Math.round(total/7).toLocaleString("en-IN")}`);
```

```dataview
TABLE WITHOUT ID
  dateformat(date, "ccc dd LLL") AS "Date",
  description AS "Description",
  category AS "Category",
  ("₹" + amount) AS "Amount"
FROM "Habit Tracker/Finance"
WHERE type = "expense" AND date >= date(today) - dur(7 days)
SORT date DESC, file.ctime DESC
```

## Daily spending heatmap (90 days)

```dataviewjs
const totals = {};
for (const p of dv.pages('"Habit Tracker/Finance"').where(p => p.type === "expense")) {
  const d = p.date.toISODate();
  totals[d] = (totals[d] || 0) + (p.amount || 0);
}
const entries = Object.entries(totals).map(([date, amount]) => ({ date, intensity: amount, content: `₹${amount}` }));

if (window.renderHeatmapCalendar) {
  window.renderHeatmapCalendar(this.container, {
    year: 2026,
    colors: { spending: ["#fee2e2", "#fca5a5", "#ef4444", "#991b1b"] },
    entries: entries.map(e => ({ ...e, color: "spending" })),
    showCurrentDayBorder: true,
    defaultEntryIntensity: 1,
    intensityScaleStart: 0,
    intensityScaleEnd: Math.max(500, ...Object.values(totals))
  });
} else {
  dv.paragraph("_Install the **Heatmap Calendar** plugin (community plugins) to render the calendar heatmap. Fallback table below:_");
  const sorted = entries.sort((a,b) => a.date.localeCompare(b.date)).slice(-30);
  dv.table(["Date", "₹ spent"], sorted.map(e => [e.date, e.intensity]));
}
```

## Category breakdown — last 30 days

```dataviewjs
const today = dv.date("today");
const expenses = dv.pages('"Habit Tracker/Finance"')
  .where(p => p.type === "expense" && (today - p.date) / (1000*60*60*24) <= 30)
  .array();

const byCat = {};
for (const p of expenses) byCat[p.category] = (byCat[p.category] || 0) + (p.amount || 0);
const sorted = Object.entries(byCat).sort((a,b) => b[1]-a[1]);
const total = sorted.reduce((s, [_, a]) => s + a, 0);

const chart = {
  type: "doughnut",
  data: {
    labels: sorted.map(([c]) => c),
    datasets: [{
      data: sorted.map(([_,a]) => a),
      backgroundColor: ["#22c55e","#3b82f6","#f59e0b","#ec4899","#8b5cf6","#ef4444","#06b6d4","#84cc16","#f97316","#64748b"]
    }]
  },
  options: { plugins: { legend: { position: "bottom" } } }
};
window.renderChart(chart, this.container);

dv.paragraph(`**Total (30d):** ₹${total.toLocaleString("en-IN")}`);
dv.table(
  ["Category", "Spent", "Share"],
  sorted.map(([c,a]) => [c, "₹"+a.toLocaleString("en-IN"), total ? Math.round(100*a/total)+"%" : "—"])
);
```

## Daily totals — last 30 days

```dataviewjs
const today = dv.date("today");
const days = 30;
const labels = [];
const data = [];

for (let i = days - 1; i >= 0; i--) {
  const d = today.minus({days: i});
  labels.push(d.toFormat("dd LLL"));
  const sum = dv.pages('"Habit Tracker/Finance"')
    .where(p => p.type === "expense" && p.date.toISODate() === d.toISODate())
    .array()
    .reduce((s, p) => s + (p.amount || 0), 0);
  data.push(sum);
}

const chart = {
  type: "bar",
  data: { labels, datasets: [{ label: "₹ spent", data, backgroundColor: "#ef4444" }] },
  options: { plugins: { legend: { display: false } } }
};
window.renderChart(chart, this.container);
```

## All expenses

```dataview
TABLE WITHOUT ID
  dateformat(date, "yyyy-MM-dd") AS "Date",
  description AS "Description",
  category AS "Category",
  ("₹" + amount) AS "Amount",
  file.link AS "Open"
FROM "Habit Tracker/Finance"
WHERE type = "expense"
SORT date DESC, file.ctime DESC
```
