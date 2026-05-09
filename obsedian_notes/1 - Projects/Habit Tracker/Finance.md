---
type: finance-dashboard
cssclasses:
  - habit-tracker
---
<style>
.habit-tracker .ht-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:8px 0 18px}
.habit-tracker .ht-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;cursor:pointer;border:1px solid var(--background-modifier-border);background:var(--background-secondary);color:var(--text-normal);font-size:.9em;font-weight:500}
.habit-tracker .ht-btn:hover{background:var(--background-modifier-hover)}
.habit-tracker .ht-btn-primary{background:#dc2626;color:#fff;border-color:#dc2626}
.habit-tracker .ht-btn-primary:hover{background:#b91c1c}
.habit-tracker .ht-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:12px 0 22px}
.habit-tracker .ht-kpi{border:1px solid var(--background-modifier-border);border-radius:10px;padding:14px 16px;background:var(--background-primary-alt)}
.habit-tracker .ht-kpi-label{display:flex;justify-content:space-between;align-items:center;color:var(--text-muted);font-size:.82em}
.habit-tracker .ht-kpi-value{font-size:1.9em;font-weight:700;margin-top:6px;line-height:1.05}
.habit-tracker .ht-kpi-value.green{color:#22c55e}.habit-tracker .ht-kpi-value.red{color:#ef4444}.habit-tracker .ht-kpi-value.amber{color:#f59e0b}.habit-tracker .ht-kpi-value.blue{color:#3b82f6}
.habit-tracker .ht-row{display:grid;grid-template-columns:minmax(260px,1fr) minmax(420px,2fr);gap:16px;margin:8px 0 22px}
@media(max-width:900px){.habit-tracker .ht-row{grid-template-columns:1fr}}
.habit-tracker .ht-panel{border:1px solid var(--background-modifier-border);border-radius:10px;padding:14px;background:var(--background-primary-alt);margin-bottom:14px}
.habit-tracker .pill{display:inline-block;padding:1px 8px;border-radius:4px;font-size:.85em;font-weight:500;white-space:nowrap}
.habit-tracker .pill.cat-Food{background:#5b2333;color:#ffd1dc}
.habit-tracker .pill.cat-Transport{background:#1f3a5b;color:#c8dcff}
.habit-tracker .pill.cat-Groceries{background:#1f4d3a;color:#b8f0d2}
.habit-tracker .pill.cat-Rent-Bills,.habit-tracker .pill.cat-Rent\\/Bills{background:#5a3a1f;color:#ffd9a8}
.habit-tracker .pill.cat-Health{background:#5b2333;color:#ffd1dc}
.habit-tracker .pill.cat-Learning{background:#1f4d3a;color:#b8f0d2}
.habit-tracker .pill.cat-Subscriptions{background:#3b2f5e;color:#d8c8ff}
.habit-tracker .pill.cat-Shopping{background:#2c3f5b;color:#c8dcff}
.habit-tracker .pill.cat-Entertainment{background:#3b2f5e;color:#d8c8ff}
.habit-tracker .pill.cat-Other{background:#2a2a2a;color:#bbb}
.habit-tracker .ht-tab{display:inline-flex;padding:4px 10px;border-radius:6px;background:var(--background-modifier-hover);font-weight:600;font-size:.95em;margin-bottom:8px}
</style>

# 💸 Finance Tracker

> Daily expenses + spending heatmap. Each spend is its own tiny note in `Finance/`.

```dataviewjs
const CATS = ["Food","Transport","Groceries","Rent/Bills","Health","Learning","Subscriptions","Shopping","Entertainment","Other"];
const bar = dv.el("div","",{cls:"ht-toolbar"});

const btn = bar.createEl("button",{text:"➕ New Expense",cls:"ht-btn ht-btn-primary"});
btn.onclick = async () => {
  const tp = app.plugins.plugins["templater-obsidian"]?.templater?.current_functions_object;
  let desc = await (tp?.system?.prompt ? tp.system.prompt("What did you spend on?","").catch(()=>null) : null);
  if (desc === null || desc === undefined) desc = window.prompt("What did you spend on?","") || "";
  if (!desc.trim()) return;
  let amt = await (tp?.system?.prompt ? tp.system.prompt("Amount (₹)","0").catch(()=>null) : null);
  if (amt === null || amt === undefined) amt = window.prompt("Amount (₹)","0") || "0";
  let cat = null;
  if (tp?.system?.suggester) { try { cat = await tp.system.suggester(CATS,CATS,false,"Category?"); } catch(e){} }
  if (!cat) cat = window.prompt("Category? " + CATS.join(" · "), "Food");
  if (!CATS.includes(cat)) cat = "Other";
  const today = new Date().toISOString().slice(0,10);
  const time  = new Date().toTimeString().slice(0,5).replace(":","");
  const safe  = desc.replace(/[\\/:*?"<>|]/g,"").slice(0,40) || "Expense";
  const path  = `Habit Tracker/Finance/${today} ${time} — ${safe}.md`;
  const body  = `---\ndate: ${today}\namount: ${Number(amt) || 0}\ncategory: ${cat}\ndescription: ${desc}\ntype: expense\n---\n\n# ${desc}\n\n**Date:** ${today}\n**Amount:** ₹${amt}\n**Category:** ${cat}\n\n## Notes\n\n`;
  await app.vault.create(path, body);
  app.workspace.openLinkText(path,"",false);
};

bar.createEl("button",{text:"🏠 Dashboard",cls:"ht-btn"})
  .onclick = () => app.workspace.openLinkText("Habit Tracker/Habit Tracker.md","",false);
bar.createEl("button",{text:"📊 Analytics",cls:"ht-btn"})
  .onclick = () => app.workspace.openLinkText("Habit Tracker/Analytics.md","",false);
```

```dataviewjs
// === Finance KPI cards ===
const today = dv.date("today");
const all = dv.pages('"Habit Tracker/Finance"').where(p => p.type==="expense");
const todayK = today.toISODate();

const todayTotal = all.where(p => p.date.toISODate()===todayK).array().reduce((s,p) => s + (p.amount||0), 0);
const weekStart = today.minus({days:6});
const weekTotal = all.where(p => p.date >= weekStart && p.date <= today).array().reduce((s,p) => s + (p.amount||0), 0);
const monthTotal = all.where(p => (today - p.date)/(1000*60*60*24) <= 30).array().reduce((s,p) => s + (p.amount||0), 0);

const byCat = {};
for (const p of all.where(p => (today - p.date)/(1000*60*60*24) <= 30)) {
  byCat[p.category] = (byCat[p.category]||0) + (p.amount||0);
}
const top = Object.entries(byCat).sort((a,b) => b[1]-a[1])[0];

const fmt = (n) => "₹" + (n||0).toLocaleString("en-IN");
const html = `
<div class="ht-kpis">
  <div class="ht-kpi"><div class="ht-kpi-label">Today <span>📅</span></div><div class="ht-kpi-value">${fmt(todayTotal)}</div></div>
  <div class="ht-kpi"><div class="ht-kpi-label">This Week <span>📈</span></div><div class="ht-kpi-value blue">${fmt(weekTotal)}</div></div>
  <div class="ht-kpi"><div class="ht-kpi-label">Last 30 Days <span>💰</span></div><div class="ht-kpi-value amber">${fmt(monthTotal)}</div></div>
  <div class="ht-kpi"><div class="ht-kpi-label">Top Category (30d) <span>🏷️</span></div><div class="ht-kpi-value red">${top ? top[0] : "—"}</div></div>
</div>`;
dv.el("div", html);
```

```dataviewjs
// === Two-up: doughnut + heatmap ===
const today = dv.date("today");
const all = dv.pages('"Habit Tracker/Finance"').where(p => p.type==="expense" && (today - p.date)/(1000*60*60*24) <= 30).array();
const byCat = {};
for (const p of all) byCat[p.category] = (byCat[p.category]||0) + (p.amount||0);
const sorted = Object.entries(byCat).sort((a,b) => b[1]-a[1]);

const wrap = dv.el("div","",{cls:"ht-row"});
const left = wrap.createDiv({cls:"ht-panel"});
left.createEl("h3",{text:"Spending by Category (30d)"});
const donutHost = left.createDiv();
if (window.renderChart && sorted.length) {
  await window.renderChart({
    type: "doughnut",
    data: { labels: sorted.map(([c]) => c), datasets: [{ data: sorted.map(([_,a]) => a), backgroundColor: ["#22c55e","#3b82f6","#f59e0b","#ec4899","#8b5cf6","#ef4444","#06b6d4","#84cc16","#f97316","#64748b"], borderWidth:0 }] },
    options: { plugins:{legend:{position:"bottom",labels:{boxWidth:10,font:{size:11}}}}, cutout:"62%" }
  }, donutHost);
} else if (!sorted.length) {
  donutHost.createEl("p",{text:"No expenses logged yet."});
} else {
  donutHost.createEl("p",{text:"Install Obsidian Charts to see the donut."});
}

const right = wrap.createDiv({cls:"ht-panel"});
right.createEl("h3",{text:"Daily spending heatmap (year)"});
const totals = {};
for (const p of dv.pages('"Habit Tracker/Finance"').where(p => p.type==="expense")) {
  const d = p.date.toISODate();
  totals[d] = (totals[d]||0) + (p.amount||0);
}
if (window.renderHeatmapCalendar) {
  const max = Math.max(500, ...Object.values(totals));
  window.renderHeatmapCalendar(right, {
    year: 2026,
    colors: { spending: ["#fee2e2","#fca5a5","#ef4444","#991b1b"] },
    showCurrentDayBorder: true,
    defaultEntryIntensity: 1,
    intensityScaleStart: 0,
    intensityScaleEnd: max,
    entries: Object.entries(totals).map(([date,amount]) => ({ date, intensity: amount, color: "spending", content: `₹${amount}` }))
  });
} else {
  right.createEl("p",{text:"Install Heatmap Calendar (community plugin) to render."});
}
```

## Today's spend

```dataviewjs
const cls = (s) => String(s).replace(/[^A-Za-z0-9]+/g, "-");
const today = dv.date("today").toISODate();
const items = dv.pages('"Habit Tracker/Finance"')
  .where(p => p.type==="expense" && p.date.toISODate()===today)
  .sort(p => p.file.ctime, "desc").array();
const total = items.reduce((s,p) => s + (p.amount||0), 0);

const w = dv.el("div","",{cls:"ht-panel"});
w.createEl("span",{cls:"ht-tab",text:`Today · ₹${total.toLocaleString("en-IN")}`});
const t = w.createEl("table");
const head = t.createTHead().insertRow();
["Time","Description","Category","Amount"].forEach(h => { const th=document.createElement("th"); th.textContent=h; head.appendChild(th); });
const tb = t.createTBody();
if (!items.length) {
  const r = tb.insertRow(); const c = r.insertCell(); c.colSpan=4; c.textContent="No spend logged today.";
}
for (const p of items) {
  const r = tb.insertRow();
  r.insertCell().textContent = dv.date(p.file.ctime).toFormat("HH:mm");
  const cD = r.insertCell();
  cD.innerHTML = `<a class="internal-link" data-href="${p.file.path}" href="${p.file.path}">${p.description||p.file.name}</a>`;
  const cC = r.insertCell();
  cC.innerHTML = `<span class="pill cat-${cls(p.category||"Other")}">${p.category||"Other"}</span>`;
  r.insertCell().textContent = "₹" + (p.amount||0).toLocaleString("en-IN");
}
```

## This week

```dataviewjs
const cls = (s) => String(s).replace(/[^A-Za-z0-9]+/g, "-");
const today = dv.date("today");
const start = today.minus({days:6});
const items = dv.pages('"Habit Tracker/Finance"')
  .where(p => p.type==="expense" && p.date >= start && p.date <= today)
  .sort(p => p.date, "desc").array();
const total = items.reduce((s,p) => s + (p.amount||0), 0);

const w = dv.el("div","",{cls:"ht-panel"});
w.createEl("span",{cls:"ht-tab",text:`This Week · ₹${total.toLocaleString("en-IN")}`});
const t = w.createEl("table");
const head = t.createTHead().insertRow();
["Date","Description","Category","Amount"].forEach(h => { const th=document.createElement("th"); th.textContent=h; head.appendChild(th); });
const tb = t.createTBody();
for (const p of items) {
  const r = tb.insertRow();
  r.insertCell().textContent = p.date.toFormat("ccc dd LLL");
  const cD = r.insertCell();
  cD.innerHTML = `<a class="internal-link" data-href="${p.file.path}" href="${p.file.path}">${p.description||p.file.name}</a>`;
  const cC = r.insertCell();
  cC.innerHTML = `<span class="pill cat-${cls(p.category||"Other")}">${p.category||"Other"}</span>`;
  r.insertCell().textContent = "₹" + (p.amount||0).toLocaleString("en-IN");
}
if (!items.length) {
  const r = tb.insertRow(); const c = r.insertCell(); c.colSpan=4; c.textContent="No spend this week yet.";
}
```

## Daily totals — last 30 days

```dataviewjs
const today = dv.date("today");
const days = 30;
const labels = [], data = [];
for (let i = days-1; i >= 0; i--) {
  const d = today.minus({days:i});
  labels.push(d.toFormat("dd LLL"));
  const sum = dv.pages('"Habit Tracker/Finance"')
    .where(p => p.type==="expense" && p.date.toISODate()===d.toISODate())
    .array().reduce((s,p) => s + (p.amount||0), 0);
  data.push(sum);
}
if (window.renderChart) {
  await window.renderChart({
    type: "bar",
    data: { labels, datasets:[{label:"₹ spent", data, backgroundColor:"#ef4444"}] },
    options: { plugins:{legend:{display:false}} }
  }, this.container);
}
```

## All expenses

```dataviewjs
const cls = (s) => String(s).replace(/[^A-Za-z0-9]+/g, "-");
const items = dv.pages('"Habit Tracker/Finance"').where(p => p.type==="expense").sort(p => p.date,"desc").array();
const w = dv.el("div","",{cls:"ht-panel"});
const t = w.createEl("table");
const head = t.createTHead().insertRow();
["Date","Description","Category","Amount"].forEach(h => { const th=document.createElement("th"); th.textContent=h; head.appendChild(th); });
const tb = t.createTBody();
for (const p of items) {
  const r = tb.insertRow();
  r.insertCell().textContent = p.date.toFormat("yyyy-MM-dd");
  const cD = r.insertCell();
  cD.innerHTML = `<a class="internal-link" data-href="${p.file.path}" href="${p.file.path}">${p.description||p.file.name}</a>`;
  const cC = r.insertCell();
  cC.innerHTML = `<span class="pill cat-${cls(p.category||"Other")}">${p.category||"Other"}</span>`;
  r.insertCell().textContent = "₹" + (p.amount||0).toLocaleString("en-IN");
}
```
