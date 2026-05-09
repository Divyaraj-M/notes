---
type: dashboard
cssclasses:
  - habit-tracker
---
<style>
.habit-tracker .ht-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:8px 0 18px}
.habit-tracker .ht-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;cursor:pointer;border:1px solid var(--background-modifier-border);background:var(--background-secondary);color:var(--text-normal);font-size:.9em;font-weight:500}
.habit-tracker .ht-btn:hover{background:var(--background-modifier-hover)}
.habit-tracker .ht-btn-primary{background:#16a34a;color:#fff;border-color:#16a34a}
.habit-tracker .ht-btn-primary:hover{background:#15803d}
.habit-tracker .ht-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:12px 0 22px}
.habit-tracker .ht-kpi{border:1px solid var(--background-modifier-border);border-radius:10px;padding:14px 16px;background:var(--background-primary-alt)}
.habit-tracker .ht-kpi-label{display:flex;justify-content:space-between;align-items:center;color:var(--text-muted);font-size:.82em}
.habit-tracker .ht-kpi-value{font-size:1.9em;font-weight:700;margin-top:6px;line-height:1.05}
.habit-tracker .ht-kpi-value.green{color:#22c55e}.habit-tracker .ht-kpi-value.red{color:#ef4444}.habit-tracker .ht-kpi-value.amber{color:#f59e0b}.habit-tracker .ht-kpi-value.blue{color:#3b82f6}
.habit-tracker .ht-row{display:grid;grid-template-columns:minmax(260px,1fr) minmax(420px,2fr);gap:16px;margin:8px 0 22px}
@media(max-width:900px){.habit-tracker .ht-row{grid-template-columns:1fr}}
.habit-tracker .ht-panel{border:1px solid var(--background-modifier-border);border-radius:10px;padding:14px;background:var(--background-primary-alt);margin-bottom:14px}
.habit-tracker .pill{display:inline-block;padding:1px 8px;border-radius:4px;font-size:.85em;font-weight:500;white-space:nowrap}
.habit-tracker .pill.cat-Health{background:#5b2333;color:#ffd1dc}
.habit-tracker .pill.cat-Mindset{background:#5a3a1f;color:#ffd9a8}
.habit-tracker .pill.cat-Learning{background:#1f4d3a;color:#b8f0d2}
.habit-tracker .pill.cat-Creativity{background:#3b2f5e;color:#d8c8ff}
.habit-tracker .pill.habit-Calories{background:#1f4d3a;color:#b8f0d2}
.habit-tracker .pill.habit-Exercise{background:#5b2333;color:#ffd1dc}
.habit-tracker .pill.habit-IIT-Madras-Study{background:#5a3a1f;color:#ffd9a8}
.habit-tracker .pill.habit-Product-Case-Study{background:#3b2f5e;color:#d8c8ff}
.habit-tracker .ht-tab{display:inline-flex;padding:4px 10px;border-radius:6px;background:var(--background-modifier-hover);font-weight:600;font-size:.95em;margin-bottom:8px}
.theme-light .habit-tracker .pill.cat-Health{background:#ffe4e9;color:#9f1239}
.theme-light .habit-tracker .pill.cat-Mindset{background:#ffedd5;color:#9a3412}
.theme-light .habit-tracker .pill.cat-Learning{background:#dcfce7;color:#166534}
.theme-light .habit-tracker .pill.cat-Creativity{background:#ede9fe;color:#5b21b6}
.theme-light .habit-tracker .pill.habit-Calories{background:#dcfce7;color:#166534}
.theme-light .habit-tracker .pill.habit-Exercise{background:#ffe4e9;color:#9f1239}
.theme-light .habit-tracker .pill.habit-IIT-Madras-Study{background:#ffedd5;color:#9a3412}
.theme-light .habit-tracker .pill.habit-Product-Case-Study{background:#ede9fe;color:#5b21b6}
</style>

# 📗 Simple Habit Tracker + Analytics

> 90-day sprint · **2026-05-09 → 2026-08-07**
> Calories ≤ 2000 · Exercise 5×/wk · IIT Madras study 1h+/day · Product case study daily

```dataviewjs
// === Toolbar: + New Habit, Scaffold Today, page links ===
const bar = dv.el("div", "", { cls: "ht-toolbar" });

const HABITS = ["Calories", "Exercise", "IIT Madras Study", "Product Case Study"];
const CAT    = { "Calories":"Health", "Exercise":"Health", "IIT Madras Study":"Learning", "Product Case Study":"Creativity" };
const TGT    = { "Calories":2000, "Exercise":1, "IIT Madras Study":60, "Product Case Study":1 };
const UNIT   = { "Calories":"kcal", "Exercise":"session", "IIT Madras Study":"minutes", "Product Case Study":"session" };

async function makeEntry(habit) {
  const today = new Date().toISOString().slice(0,10);
  const path = `Habit Tracker/Habits Log/${today} — ${habit}.md`;
  if (await app.vault.adapter.exists(path)) {
    app.workspace.openLinkText(path, "", false);
    return;
  }
  const body = `---\ndate: ${today}\nhabit: ${habit}\ncategory: ${CAT[habit]}\ncompleted: false\nvalue: 0\ntarget: ${TGT[habit]}\nunit: ${UNIT[habit]}\nnotes: ""\ntype: habit-entry\n---\n\n# ${habit} — ${today}\n\n**Status:** ⬜ Pending\n**Value:** 0 ${UNIT[habit]} (target: ${TGT[habit]})\n\n## Notes\n\n`;
  await app.vault.create(path, body);
  app.workspace.openLinkText(path, "", false);
}

const btnNew = bar.createEl("button", { text: "➕ New Habit", cls: "ht-btn ht-btn-primary" });
btnNew.onclick = async () => {
  const tp = app.plugins.plugins["templater-obsidian"]?.templater?.current_functions_object;
  let pick = null;
  if (tp?.system?.suggester) {
    try { pick = await tp.system.suggester(HABITS, HABITS, false, "Which habit?"); } catch(e) {}
  }
  if (!pick) pick = window.prompt("Which habit? " + HABITS.join(" · "), HABITS[0]);
  if (!pick || !HABITS.includes(pick)) return;
  await makeEntry(pick);
};

const btnBundle = bar.createEl("button", { text: "🗓 Scaffold Today (all 4)", cls: "ht-btn" });
btnBundle.onclick = async () => {
  const today = new Date().toISOString().slice(0,10);
  let made = 0;
  for (const h of HABITS) {
    const path = `Habit Tracker/Habits Log/${today} — ${h}.md`;
    if (await app.vault.adapter.exists(path)) continue;
    await makeEntry(h);
    made++;
  }
  new Notice(`Created ${made} habit ${made===1?"entry":"entries"} for ${today}`);
};

bar.createEl("button", { text: "📊 Analytics", cls: "ht-btn" })
  .onclick = () => app.workspace.openLinkText("Habit Tracker/Analytics.md", "", false);
bar.createEl("button", { text: "🗃 Database", cls: "ht-btn" })
  .onclick = () => app.workspace.openLinkText("Habit Tracker/Database.md", "", false);
bar.createEl("button", { text: "💸 Finance", cls: "ht-btn" })
  .onclick = () => app.workspace.openLinkText("Habit Tracker/Finance.md", "", false);
```

```dataviewjs
// === KPI cards ===
const HABITS = ["Calories","Exercise","IIT Madras Study","Product Case Study"];
const all = dv.pages('"Habit Tracker/Habits Log"').where(p => p.type === "habit-entry");
const today = dv.date("today");

const recent = all.where(p => (today - p.date)/(1000*60*60*24) < 30 && (today - p.date) >= 0);
const total30 = recent.length;
const done30  = recent.where(p => p.completed).length;
const rate = total30 ? Math.round(100 * done30 / total30) : 0;

const dayMap = new Map();
for (const p of all) {
  const k = p.date.toISODate();
  if (!dayMap.has(k)) dayMap.set(k, { done: 0, total: 0 });
  const e = dayMap.get(k); e.total++; if (p.completed) e.done++;
}
const isPerfect = (k) => dayMap.has(k) && dayMap.get(k).done >= HABITS.length;

let cur = 0, cursor = today;
while (true) {
  const k = cursor.toISODate();
  if (isPerfect(k)) { cur++; cursor = cursor.minus({days: 1}); } else break;
}

let longest = 0, run = 0, prev = null;
for (const k of [...dayMap.keys()].sort()) {
  if (isPerfect(k)) {
    const gap = prev ? (dv.date(k) - dv.date(prev))/(1000*60*60*24) : null;
    run = (gap === 1) ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = k;
  } else { run = 0; prev = null; }
}

const html = `
<div class="ht-kpis">
  <div class="ht-kpi"><div class="ht-kpi-label">Active Habits <span>🎯</span></div><div class="ht-kpi-value blue">${HABITS.length}</div></div>
  <div class="ht-kpi"><div class="ht-kpi-label">Completion Rate (30d) <span>🏷️</span></div><div class="ht-kpi-value ${rate>=70?'green':rate>=40?'amber':'red'}">${rate}%</div></div>
  <div class="ht-kpi"><div class="ht-kpi-label">Current Streak <span>🔥</span></div><div class="ht-kpi-value ${cur>0?'red':''}">${cur}</div></div>
  <div class="ht-kpi"><div class="ht-kpi-label">Longest Streak <span>👑</span></div><div class="ht-kpi-value green">${longest}</div></div>
</div>`;
dv.el("div", html);
```

```dataviewjs
// === Donut + Year heatmap ===
const wrap = dv.el("div", "", { cls: "ht-row" });

// LEFT — donut
const left = wrap.createDiv({ cls: "ht-panel" });
left.createEl("h3", { text: "Completion by Habit" });
const donutHost = left.createDiv();
const HABITS = ["Calories","Exercise","IIT Madras Study","Product Case Study"];
const counts = HABITS.map(h => dv.pages('"Habit Tracker/Habits Log"').where(p => p.type==="habit-entry" && p.habit===h && p.completed).length);
const colors = ["#22c55e","#ef4444","#f59e0b","#a855f7"];

if (window.renderChart) {
  await window.renderChart({
    type: "doughnut",
    data: { labels: HABITS, datasets: [{ data: counts, backgroundColor: colors, borderWidth: 0 }] },
    options: { plugins: { legend: { position: "bottom", labels:{boxWidth:10, font:{size:11}} } }, cutout: "62%" }
  }, donutHost);
} else {
  donutHost.createEl("p", { text: "Install the Obsidian Charts plugin to see the donut." });
}

// RIGHT — year heatmap
const right = wrap.createDiv({ cls: "ht-panel" });
right.createEl("h3", { text: "Habit Streak" });
const today = dv.date("today");
let streak = 0, cursor = today;
const days = {};
for (const p of dv.pages('"Habit Tracker/Habits Log"').where(p => p.type==="habit-entry")) {
  const k = p.date.toISODate();
  if (!days[k]) days[k] = { d:0, t:0 };
  days[k].t++; if (p.completed) days[k].d++;
}
while (true) {
  const k = cursor.toISODate();
  if (days[k] && days[k].d >= HABITS.length) { streak++; cursor = cursor.minus({days:1}); } else break;
}
right.createEl("p", { text: `Streak: ${streak} days` });

if (window.renderHeatmapCalendar) {
  const entries = [];
  for (const p of dv.pages('"Habit Tracker/Habits Log"').where(p => p.type==="habit-entry" && p.completed)) {
    entries.push({ date: p.date.toISODate(), intensity: 4, color: "habit" });
  }
  window.renderHeatmapCalendar(right, {
    year: 2026,
    colors: { habit: ["#0c1f15","#1f4d3a","#22c55e","#86efac"] },
    showCurrentDayBorder: true,
    defaultEntryIntensity: 1,
    entries
  });
} else {
  right.createEl("p", { text: "Install the Heatmap Calendar plugin to render the year heatmap." });
}
```

## ✅ Today

```dataviewjs
const cls = (s) => String(s).replace(/[^A-Za-z0-9]+/g, "-");
const today = dv.date("today").toISODate();
const rows = dv.pages('"Habit Tracker/Habits Log"')
  .where(p => p.type==="habit-entry" && p.date.toISODate()===today)
  .sort(p => p.category, "asc")
  .array();

const wrap = dv.el("div", "", { cls: "ht-panel" });
wrap.createEl("span", { cls: "ht-tab", text: "🗓 Today" });
const t = wrap.createEl("table");
const head = t.createTHead().insertRow();
["Date","Habit","Category","Completed","Notes"].forEach(h => { const th=document.createElement("th"); th.textContent=h; head.appendChild(th); });
const tb = t.createTBody();
if (rows.length === 0) {
  const r = tb.insertRow(); const c = r.insertCell(); c.colSpan = 5; c.textContent = "No entries yet — click ➕ New Habit above.";
} else {
  for (const p of rows) {
    const r = tb.insertRow();
    r.insertCell().textContent = p.date.toFormat("ccc dd LLL");
    const cH = r.insertCell();
    cH.innerHTML = `<a class="internal-link" data-href="${p.file.path}" href="${p.file.path}"><span class="pill habit-${cls(p.habit)}">${p.habit}</span></a>`;
    const cC = r.insertCell(); cC.innerHTML = `<span class="pill cat-${cls(p.category)}">${p.category}</span>`;
    r.insertCell().textContent = p.completed ? "☑️" : "⬜";
    r.insertCell().textContent = p.notes || "";
  }
}
```

## 📅 This Week

```dataviewjs
const cls = (s) => String(s).replace(/[^A-Za-z0-9]+/g, "-");
const today = dv.date("today");
const start = today.minus({days:6});
const rows = dv.pages('"Habit Tracker/Habits Log"')
  .where(p => p.type==="habit-entry" && p.date >= start && p.date <= today)
  .sort(p => p.date, "desc")
  .array();

const wrap = dv.el("div", "", { cls: "ht-panel" });
wrap.createEl("span", { cls: "ht-tab", text: "📅 This Week" });
const t = wrap.createEl("table");
const head = t.createTHead().insertRow();
["Date","Habit","Category","Completed","Notes"].forEach(h => { const th=document.createElement("th"); th.textContent=h; head.appendChild(th); });
const tb = t.createTBody();
if (rows.length === 0) {
  const r = tb.insertRow(); const c = r.insertCell(); c.colSpan = 5; c.textContent = "No entries this week yet.";
} else {
  for (const p of rows) {
    const r = tb.insertRow();
    r.insertCell().textContent = p.date.toFormat("ccc dd LLL");
    const cH = r.insertCell();
    cH.innerHTML = `<a class="internal-link" data-href="${p.file.path}" href="${p.file.path}"><span class="pill habit-${cls(p.habit)}">${p.habit}</span></a>`;
    const cC = r.insertCell(); cC.innerHTML = `<span class="pill cat-${cls(p.category)}">${p.category}</span>`;
    r.insertCell().textContent = p.completed ? "☑️" : "⬜";
    r.insertCell().textContent = p.notes || "";
  }
}
```

> [!tip]- 💡 Start Here: Set Up the Template
> 1. Install community plugins: **Dataview**, **Obsidian Charts**, **Templater**, **Heatmap Calendar**.
> 2. Settings → Appearance → CSS snippets → enable the `habit-tracker` snippet (the file lives in `Habit Tracker/_assets/habit-tracker.css` — copy or symlink it into `<vault>/.obsidian/snippets/`).
> 3. In Dataview settings, enable **JavaScript Queries**.
> 4. In Templater settings, set the Template folder to `Habit Tracker/_templates`.
> 5. Click **➕ New Habit** above to log an entry, or **🗓 Scaffold Today** to create all four for the day at once. To edit a habit's name, target, or category later, just edit `Habits/<Habit>.md` and the relevant frontmatter — every view recomputes from the YAML.

> [!info]- Day-of-sprint counter
> ```dataviewjs
> const start = dv.date("2026-05-09");
> const today = dv.date("today");
> const day = Math.floor((today - start) / (1000*60*60*24)) + 1;
> dv.paragraph(`**Day ${day} of 90** · ${90 - day} days remaining`);
> ```
