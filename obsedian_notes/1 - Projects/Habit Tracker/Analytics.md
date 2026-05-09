---
type: analytics
cssclasses:
  - habit-tracker
---

# 📊 Analytics

[[Habit Tracker|← Back to dashboard]]   ·   [[Database]]   ·   [[Finance]]

> Numbers refresh automatically. If a chart shows "no data", you haven't logged that habit yet — open [[Habit Tracker]] and run the **Daily Habits Bundle**.

## 🔥 Streaks & completion (last 30 days)

```dataviewjs
const habits = ["Calories", "Exercise", "IIT Madras Study", "Product Case Study"];
const today  = dv.date("today");
const window = 30;

const rows = habits.map(name => {
  const pages = dv.pages('"Habit Tracker/Habits Log"')
    .where(p => p.type === "habit-entry" && p.habit === name)
    .sort(p => p.date, "desc")
    .array();

  // last-30-day completion rate
  const recent = pages.filter(p => {
    const diff = (today - p.date) / (1000*60*60*24);
    return diff >= 0 && diff < window;
  });
  const done = recent.filter(p => p.completed).length;
  const pct  = recent.length ? Math.round(100 * done / recent.length) : 0;

  // current streak (back from today, only consecutive completed days)
  let streak = 0;
  let cursor = today;
  const byDate = new Map(pages.map(p => [p.date.toISODate(), p]));
  while (true) {
    const entry = byDate.get(cursor.toISODate());
    if (entry && entry.completed) { streak++; cursor = cursor.minus({days: 1}); }
    else break;
  }

  return [name, `${done}/${recent.length}`, `${pct}%`, `🔥 ${streak}`];
});

dv.table(["Habit", "Done (30d)", "Rate", "Current streak"], rows);
```

## 📈 Weekly completion — last 8 weeks

```dataviewjs
const today = dv.date("today");
const weeks = 8;
const habits = ["Calories", "Exercise", "IIT Madras Study", "Product Case Study"];

const labels = [];
const series = Object.fromEntries(habits.map(h => [h, []]));

for (let i = weeks - 1; i >= 0; i--) {
  const weekEnd   = today.minus({days: i * 7});
  const weekStart = weekEnd.minus({days: 6});
  labels.push(weekStart.toFormat("dd LLL"));

  for (const h of habits) {
    const done = dv.pages('"Habit Tracker/Habits Log"')
      .where(p => p.type === "habit-entry"
        && p.habit === h
        && p.completed
        && p.date >= weekStart
        && p.date <= weekEnd)
      .length;
    series[h].push(done);
  }
}

const chart = {
  type: "bar",
  data: {
    labels,
    datasets: habits.map((h, i) => ({
      label: h,
      data: series[h],
      backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899"][i]
    }))
  },
  options: {
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
    plugins: { legend: { position: "bottom" } }
  }
};

window.renderChart(chart, this.container);
```

## 🍱 Calories trend — last 30 days

```dataviewjs
const today = dv.date("today");
const days = 30;
const labels = [];
const data = [];

for (let i = days - 1; i >= 0; i--) {
  const d = today.minus({days: i});
  labels.push(d.toFormat("dd LLL"));
  const entry = dv.pages('"Habit Tracker/Habits Log"')
    .where(p => p.type === "habit-entry" && p.habit === "Calories" && p.date.toISODate() === d.toISODate())
    .first();
  data.push(entry ? entry.value : null);
}

const chart = {
  type: "line",
  data: {
    labels,
    datasets: [
      { label: "Calories", data, borderColor: "#22c55e", backgroundColor: "rgba(34,197,94,0.15)", tension: 0.3, spanGaps: true },
      { label: "Target (2000)", data: Array(days).fill(2000), borderColor: "#ef4444", borderDash: [6,4], pointRadius: 0 }
    ]
  },
  options: { plugins: { legend: { position: "bottom" } } }
};

window.renderChart(chart, this.container);
```

## 📚 Study minutes — last 30 days

```dataviewjs
const today = dv.date("today");
const days = 30;
const labels = [];
const data = [];

for (let i = days - 1; i >= 0; i--) {
  const d = today.minus({days: i});
  labels.push(d.toFormat("dd LLL"));
  const entry = dv.pages('"Habit Tracker/Habits Log"')
    .where(p => p.type === "habit-entry" && p.habit === "IIT Madras Study" && p.date.toISODate() === d.toISODate())
    .first();
  data.push(entry ? entry.value : 0);
}

const chart = {
  type: "bar",
  data: {
    labels,
    datasets: [
      { label: "Minutes studied", data, backgroundColor: "#f59e0b" },
      { label: "Target (60)", data: Array(days).fill(60), type: "line", borderColor: "#ef4444", borderDash: [6,4], pointRadius: 0 }
    ]
  },
  options: { plugins: { legend: { position: "bottom" } } }
};

window.renderChart(chart, this.container);
```

## 🟩 90-day habit heatmap

> Requires the **Heatmap Calendar** plugin. Each habit gets its own row.

```dataviewjs
const habits = ["Calories", "Exercise", "IIT Madras Study", "Product Case Study"];
const colors = {
  "Calories": ["#dcfce7", "#86efac", "#22c55e", "#15803d"],
  "Exercise": ["#dbeafe", "#93c5fd", "#3b82f6", "#1d4ed8"],
  "IIT Madras Study": ["#fef3c7", "#fcd34d", "#f59e0b", "#b45309"],
  "Product Case Study": ["#fce7f3", "#f9a8d4", "#ec4899", "#9d174d"]
};

for (const h of habits) {
  const entries = {};
  for (const p of dv.pages('"Habit Tracker/Habits Log"')
        .where(p => p.type === "habit-entry" && p.habit === h)) {
    entries[p.date.toISODate()] = { date: p.date.toISODate(), intensity: p.completed ? 4 : 1 };
  }
  dv.header(3, h);
  if (window.renderHeatmapCalendar) {
    window.renderHeatmapCalendar(this.container, {
      year: 2026,
      colors: { [h]: colors[h] },
      entries: Object.values(entries).map(e => ({ date: e.date, intensity: e.intensity, color: h }))
    });
  } else {
    dv.paragraph("_Install the **Heatmap Calendar** plugin to render the heatmap._");
    const recent = Object.values(entries).slice(-14);
    dv.table(["Date", "Done"], recent.map(e => [e.date, e.intensity === 4 ? "✅" : "⬜"]));
  }
}
```

## 💸 Spending heatmap (last 90 days)

> Daily total expense — darker = more spent.

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
    entries: entries.map(e => ({ ...e, color: "spending" }))
  });
} else {
  dv.paragraph("_Install **Heatmap Calendar** for the visual heatmap. Recent 14 days below:_");
  const sorted = entries.sort((a,b) => a.date.localeCompare(b.date)).slice(-14);
  dv.table(["Date", "Total ₹"], sorted.map(e => [e.date, e.intensity]));
}
```

## 🧮 Spending — last 30 days summary

```dataviewjs
const today = dv.date("today");
const expenses = dv.pages('"Habit Tracker/Finance"')
  .where(p => p.type === "expense" && (today - p.date) / (1000*60*60*24) <= 30);

const total = expenses.array().reduce((s, p) => s + (p.amount || 0), 0);
const byCat = {};
for (const p of expenses) byCat[p.category] = (byCat[p.category] || 0) + (p.amount || 0);

dv.paragraph(`**Total spent (last 30 days):** ₹${total.toLocaleString("en-IN")}`);
dv.paragraph(`**Daily average:** ₹${Math.round(total/30).toLocaleString("en-IN")}`);
const rows = Object.entries(byCat).sort((a,b) => b[1]-a[1]).map(([c,a]) => [c, "₹"+a.toLocaleString("en-IN"), Math.round(100*a/total)+"%"]);
dv.table(["Category", "Spent", "Share"], rows);
```
