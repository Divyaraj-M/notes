---
type: database
cssclasses:
  - habit-tracker
---
<style>
.habit-tracker .ht-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:8px 0 18px}
.habit-tracker .ht-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;cursor:pointer;border:1px solid var(--background-modifier-border);background:var(--background-secondary);color:var(--text-normal);font-size:.9em;font-weight:500}
.habit-tracker .ht-btn:hover{background:var(--background-modifier-hover)}
.habit-tracker .ht-btn-primary{background:#16a34a;color:#fff;border-color:#16a34a}
.habit-tracker .ht-btn-primary:hover{background:#15803d}
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
.habit-tracker td input[type=checkbox]{transform:scale(1.15);accent-color:#3b82f6;cursor:pointer}
</style>

# 🗃 Database

> Every habit entry, every day. Toggle the checkbox to flip `completed:` on the underlying file — the page rewrites the YAML. Other fields stay editable in the file's Properties pane.

```dataviewjs
const HABITS = ["Calories","Exercise","IIT Madras Study","Product Case Study"];
const CAT  = { "Calories":"Health","Exercise":"Health","IIT Madras Study":"Learning","Product Case Study":"Creativity" };
const TGT  = { "Calories":2000,"Exercise":1,"IIT Madras Study":60,"Product Case Study":1 };
const UNIT = { "Calories":"kcal","Exercise":"session","IIT Madras Study":"minutes","Product Case Study":"session" };

const bar = dv.el("div", "", { cls: "ht-toolbar" });
const btn = bar.createEl("button", { text: "➕ New Entry", cls: "ht-btn ht-btn-primary" });
btn.onclick = async () => {
  const tp = app.plugins.plugins["templater-obsidian"]?.templater?.current_functions_object;
  let pick = null;
  if (tp?.system?.suggester) {
    try { pick = await tp.system.suggester(HABITS, HABITS, false, "Which habit?"); } catch(e) {}
  }
  if (!pick) pick = window.prompt("Which habit? " + HABITS.join(" · "), HABITS[0]);
  if (!pick || !HABITS.includes(pick)) return;
  const today = new Date().toISOString().slice(0,10);
  const path = `Habit Tracker/Habits Log/${today} — ${pick}.md`;
  if (!(await app.vault.adapter.exists(path))) {
    const body = `---\ndate: ${today}\nhabit: ${pick}\ncategory: ${CAT[pick]}\ncompleted: false\nvalue: 0\ntarget: ${TGT[pick]}\nunit: ${UNIT[pick]}\nnotes: ""\ntype: habit-entry\n---\n\n# ${pick} — ${today}\n\n**Status:** ⬜ Pending\n**Value:** 0 ${UNIT[pick]} (target: ${TGT[pick]})\n\n## Notes\n\n`;
    await app.vault.create(path, body);
  }
  app.workspace.openLinkText(path, "", false);
};

bar.createEl("button", { text: "🏠 Dashboard", cls: "ht-btn" })
  .onclick = () => app.workspace.openLinkText("Habit Tracker/Habit Tracker.md", "", false);
bar.createEl("button", { text: "📊 Analytics", cls: "ht-btn" })
  .onclick = () => app.workspace.openLinkText("Habit Tracker/Analytics.md", "", false);
```

## Table

```dataviewjs
const cls = (s) => String(s).replace(/[^A-Za-z0-9]+/g, "-");
const rows = dv.pages('"Habit Tracker/Habits Log"')
  .where(p => p.type==="habit-entry")
  .sort(p => p.date, "desc")
  .array();

const wrap = dv.el("div", "", { cls: "ht-panel" });
wrap.createEl("span", { cls: "ht-tab", text: "📋 Table" });
const t = wrap.createEl("table");
const head = t.createTHead().insertRow();
["Date","Habit","Category","Completed","Value","Notes"].forEach(h => { const th=document.createElement("th"); th.textContent=h; head.appendChild(th); });
const tb = t.createTBody();

for (const p of rows) {
  const r = tb.insertRow();
  r.insertCell().textContent = p.date.toFormat("LLL dd, yyyy");

  // Habit pill
  const cH = r.insertCell();
  cH.innerHTML = `<a class="internal-link" data-href="${p.file.path}" href="${p.file.path}"><span class="pill habit-${cls(p.habit)}">${p.habit}</span></a>`;

  // Category pill
  const cC = r.insertCell();
  cC.innerHTML = `<span class="pill cat-${cls(p.category)}">${p.category}</span>`;

  // Completed checkbox — toggles YAML on click
  const cChk = r.insertCell();
  const chk = cChk.createEl("input", { type: "checkbox" });
  chk.checked = !!p.completed;
  chk.onclick = async () => {
    const file = app.vault.getAbstractFileByPath(p.file.path);
    await app.fileManager.processFrontMatter(file, fm => {
      fm.completed = chk.checked;
      if (chk.checked && (!fm.value || fm.value === 0) && p.target) fm.value = p.target;
    });
  };

  r.insertCell().textContent = (p.value ?? 0) + " " + (p.unit || "");
  r.insertCell().textContent = p.notes || "";
}
if (rows.length === 0) {
  const r = tb.insertRow(); const c = r.insertCell(); c.colSpan = 6; c.textContent = "No entries yet.";
}
```

## Filtered views

### By habit — Calories

```dataviewjs
const cls = (s) => String(s).replace(/[^A-Za-z0-9]+/g, "-");
const rows = dv.pages('"Habit Tracker/Habits Log"').where(p => p.type==="habit-entry" && p.habit==="Calories").sort(p => p.date,"desc").array();
const w = dv.el("div","",{cls:"ht-panel"});
const t = w.createEl("table");
const head = t.createTHead().insertRow();
["Date","Status","kcal","Notes"].forEach(h => { const th=document.createElement("th"); th.textContent=h; head.appendChild(th); });
const tb = t.createTBody();
for (const p of rows) {
  const r = tb.insertRow();
  r.insertCell().textContent = p.date.toFormat("LLL dd");
  const c = r.insertCell();
  c.innerHTML = p.completed ? `<span class="pill cat-Learning">✅ ≤ 2000</span>` : `<span class="pill cat-Health">⛔ over</span>`;
  r.insertCell().textContent = p.value ?? 0;
  r.insertCell().textContent = p.notes || "";
}
```

### By habit — Exercise

```dataviewjs
const rows = dv.pages('"Habit Tracker/Habits Log"').where(p => p.type==="habit-entry" && p.habit==="Exercise").sort(p => p.date,"desc").array();
const w = dv.el("div","",{cls:"ht-panel"});
const t = w.createEl("table");
const head = t.createTHead().insertRow();
["Date","Done","Notes"].forEach(h => { const th=document.createElement("th"); th.textContent=h; head.appendChild(th); });
const tb = t.createTBody();
for (const p of rows) {
  const r = tb.insertRow();
  r.insertCell().textContent = p.date.toFormat("ccc LLL dd");
  r.insertCell().textContent = p.completed ? "☑️" : "⬜";
  r.insertCell().textContent = p.notes || "";
}
```

### By habit — IIT Madras Study

```dataviewjs
const rows = dv.pages('"Habit Tracker/Habits Log"').where(p => p.type==="habit-entry" && p.habit==="IIT Madras Study").sort(p => p.date,"desc").array();
const w = dv.el("div","",{cls:"ht-panel"});
const t = w.createEl("table");
const head = t.createTHead().insertRow();
["Date","Done","Minutes","Notes"].forEach(h => { const th=document.createElement("th"); th.textContent=h; head.appendChild(th); });
const tb = t.createTBody();
for (const p of rows) {
  const r = tb.insertRow();
  r.insertCell().textContent = p.date.toFormat("ccc LLL dd");
  r.insertCell().textContent = p.completed ? "☑️" : "⬜";
  r.insertCell().textContent = p.value ?? 0;
  r.insertCell().textContent = p.notes || "";
}
```

### By habit — Product Case Study

```dataviewjs
const rows = dv.pages('"Habit Tracker/Habits Log"').where(p => p.type==="habit-entry" && p.habit==="Product Case Study").sort(p => p.date,"desc").array();
const w = dv.el("div","",{cls:"ht-panel"});
const t = w.createEl("table");
const head = t.createTHead().insertRow();
["Date","Done","Notes"].forEach(h => { const th=document.createElement("th"); th.textContent=h; head.appendChild(th); });
const tb = t.createTBody();
for (const p of rows) {
  const r = tb.insertRow();
  r.insertCell().textContent = p.date.toFormat("ccc LLL dd");
  r.insertCell().textContent = p.completed ? "☑️" : "⬜";
  r.insertCell().textContent = p.notes || "";
}
```

## Counters

```dataviewjs
const habits = ["Calories","Exercise","IIT Madras Study","Product Case Study"];
const rows = habits.map(h => {
  const all = dv.pages('"Habit Tracker/Habits Log"').where(p => p.type==="habit-entry" && p.habit===h);
  const done = all.where(p => p.completed).length;
  return [h, all.length, done, all.length ? Math.round(100*done/all.length) + "%" : "—"];
});
dv.table(["Habit", "Logged", "Completed", "Rate"], rows);
```
