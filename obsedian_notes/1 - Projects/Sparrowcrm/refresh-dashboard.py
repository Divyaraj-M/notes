#!/usr/bin/env python3
"""
SparrowCRM Dashboard Generator
Scans all .md files in this folder, reads their YAML frontmatter,
and generates an HTML dashboard that reflects the current state.

Usage: python3 refresh-dashboard.py
Output: SparrowCRM Dashboard.html (overwrites existing)
"""

import os
import re
import json
from datetime import datetime
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.resolve()
OUTPUT_FILE = SCRIPT_DIR / "SparrowCRM Dashboard.html"

STATUS_WEIGHT = {'draft':0, 'done':1, 'reviewed':2, 'design':3, 'dev':4, 'staging':5, 'production':6}
STATUS_LABELS = {'draft':'Draft', 'done':'Done', 'reviewed':'Reviewed', 'design':'Design', 'dev':'Dev', 'staging':'Staging', 'production':'In Production'}


def parse_frontmatter(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return {}, ""
    fm = {}
    body = content
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)', content, re.DOTALL)
    if match:
        yaml_block = match.group(1)
        body = match.group(2)
        for line in yaml_block.split('\n'):
            line = line.strip()
            if ':' in line:
                key, _, val = line.partition(':')
                key = key.strip()
                val = val.strip()
                if val.startswith('[') and val.endswith(']'):
                    val = [v.strip().strip("'\"") for v in val[1:-1].split(',')]
                elif val.startswith('"') and val.endswith('"'):
                    val = val[1:-1]
                elif val.startswith("'") and val.endswith("'"):
                    val = val[1:-1]
                fm[key] = val
    return fm, body


def scan_vault():
    files = []
    for root, dirs, filenames in os.walk(SCRIPT_DIR):
        for fname in filenames:
            if not fname.endswith('.md'):
                continue
            fpath = Path(root) / fname
            rel = fpath.relative_to(SCRIPT_DIR)
            if fname == "SparrowCRM home page.md":
                continue
            fm, body = parse_frontmatter(fpath)
            files.append({
                'path': str(rel),
                'name': fname.replace('.md', ''),
                'folder': str(rel.parent),
                'frontmatter': fm,
            })
    return files


def categorize(files):
    deliverables = []
    features = []
    specs = []
    competitors = []
    all_files = []
    section_map = {
        '1 - Vision & Strategy': 'Vision & Strategy',
        '2 - Customer Insights': 'Customer Insights',
        '3 - Roadmap & Planning': 'Roadmap & Planning',
        '4 - Product Specs': 'Specs & Features',
        '5 - Features': 'Features',
        '6 - Metrics & Dashboards': 'Metrics',
        '7 - Competitors': 'Market',
        '8 - Decisions': 'Decisions',
        '9 - Product Wins': 'Wins',
        '10 - Marketing': 'Marketing',
        '11 - Help Articles': 'Help',
    }
    templates = {'Feature Template', 'Spec Template', 'Competitor Template'}

    for f in files:
        section = section_map.get(f['folder'], f['folder'])
        fm = f['frontmatter']
        raw_status = fm.get('status', 'Draft')
        if isinstance(raw_status, str):
            raw_status = raw_status.strip()
        norm = raw_status.lower().replace(' ', '-').replace('in-production', 'production') if raw_status else 'draft'

        entry = {
            'name': f['name'],
            'section': section,
            'status': norm,
            'statusLabel': raw_status,
            'owner': fm.get('owner', ''),
            'updated': fm.get('updated', ''),
            'path': f['path'],
            'folder': f['folder'],
            'impact': fm.get('impact', ''),
            'effort': fm.get('effort', ''),
            'tags': fm.get('tags', []),
        }
        all_files.append(entry)

        if f['name'] in templates:
            continue
        if f['folder'] == '5 - Features' and f['name'].startswith('FEAT'):
            features.append(entry)
        elif f['folder'] == '4 - Product Specs' and f['name'].startswith('SPEC'):
            specs.append(entry)
        elif f['folder'] == '7 - Competitors' and f['name'].startswith('COMP'):
            competitors.append(entry)
        if not f['name'].startswith('FEAT') and not f['name'].startswith('SPEC') and not f['name'].startswith('COMP'):
            deliverables.append(entry)

    return deliverables, features, specs, competitors, all_files


def build_matrix(features):
    matrix = {'q1': [], 'q2': [], 'q3': [], 'q4': []}
    for f in features:
        impact = f.get('impact', '')
        effort = f.get('effort', '')
        if not impact or not effort:
            continue
        try:
            imp = float(impact)
            eff = float(effort)
        except (ValueError, TypeError):
            continue
        score = round(imp / eff, 1) if eff > 0 else 0
        item = {'name': f['name'].replace('FEAT - ', ''), 'impact': imp, 'effort': eff, 'score': score}
        high_impact = imp >= 3
        high_effort = eff >= 3
        if high_impact and not high_effort:
            matrix['q1'].append(item)
        elif high_impact and high_effort:
            matrix['q2'].append(item)
        elif not high_impact and not high_effort:
            matrix['q3'].append(item)
        else:
            matrix['q4'].append(item)
    for q in matrix:
        matrix[q].sort(key=lambda x: x['score'], reverse=True)
    return matrix


def build_roadmap(all_files):
    roadmap = {'now': [], 'next': [], 'later': []}
    for f in all_files:
        fm_tags = f.get('tags', [])
        if isinstance(fm_tags, str):
            fm_tags = [fm_tags]
        for tag in fm_tags:
            tl = tag.lower().strip()
            if tl in ('now', 'next', 'later'):
                roadmap[tl].append({
                    'name': f['name'].replace('FEAT - ', '').replace('SPEC - ', ''),
                    'status': f['status'],
                    'statusLabel': f['statusLabel'],
                })
                break
    return roadmap


# ── HTML builder helpers ─────────────────────────────────────────────

def h(text):
    """HTML-escape"""
    return str(text).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')


def render_matrix_items(items, empty_msg):
    if not items:
        return '<div class="empty">' + empty_msg + '</div>'
    parts = []
    for i in items:
        parts.append(
            '<div class="matrix-item">'
            '<span>' + h(i['name']) + '</span>'
            '<span class="score">' + str(i['score']) + '</span>'
            '</div>'
        )
    return ''.join(parts)


def render_roadmap_col(items, empty_msg):
    if not items:
        return '<div class="empty">' + empty_msg + '</div>'
    parts = []
    for i in items:
        parts.append(
            '<div class="roadmap-item">'
            '<span>' + h(i['name']) + '</span>'
            '<span class="chip ' + h(i['status']) + '">' + h(i['statusLabel']) + '</span>'
            '</div>'
        )
    return ''.join(parts)


def render_pipeline_cards(names):
    return ''.join('<div class="pipeline-card">' + h(n) + '</div>' for n in names)


def render_competitor_rows(competitors):
    if not competitors:
        return '<div class="empty">No COMP files yet. Create files like <code>COMP - HubSpot.md</code> in the Competitors folder.</div>'
    parts = []
    for c in competitors:
        name = c['name'].replace('COMP - ', '')
        parts.append(
            '<div style="padding:8px 12px; background:var(--surface2); border-radius:6px; margin-bottom:6px; font-size:13px; display:flex; justify-content:space-between;">'
            '<span>' + h(name) + '</span>'
            '<span class="chip ' + h(c['status']) + '">' + h(c['statusLabel']) + '</span>'
            '</div>'
        )
    return ''.join(parts)


def render_deliverable_rows(deliverables):
    parts = []
    for d in deliverables:
        owner = h(d['owner']) if d['owner'] else '—'
        updated = h(d['updated']) if d['updated'] else '—'
        parts.append(
            '<tr>'
            '<td class="name">' + h(d['name']) + '</td>'
            '<td><span class="section-tag">' + h(d['section']) + '</span></td>'
            '<td><span class="chip ' + h(d['status']) + '">' + h(d['statusLabel']) + '</span></td>'
            '<td style="font-size:12px; color:var(--text2);">' + owner + '</td>'
            '<td style="font-size:11px; color:var(--text2);">' + updated + '</td>'
            '<td><span style="font-size:10px; color:var(--text2);">' + h(d['path']) + '</span></td>'
            '</tr>'
        )
    return ''.join(parts)


def generate_html(deliverables, features, specs, competitors, all_files, matrix, roadmap):
    today = datetime.now().strftime('%Y-%m-%d')
    total_weight = sum(STATUS_WEIGHT.get(d['status'], 0) for d in deliverables)
    max_weight = len(deliverables) * 6 if deliverables else 1
    progress_pct = round((total_weight / max_weight) * 100)
    shipped = sum(1 for d in deliverables if d['status'] == 'production')

    pipeline = {'draft':[], 'done':[], 'reviewed':[], 'design':[], 'dev':[], 'staging':[], 'production':[]}
    for f in features:
        s = f['status']
        if s in pipeline:
            pipeline[s].append(f['name'].replace('FEAT - ', ''))

    n_draft = sum(1 for f in all_files if f['status'] == 'draft')
    n_progress = sum(1 for f in all_files if f['status'] in ('done','reviewed','design','dev','staging'))
    n_prod = sum(1 for f in all_files if f['status'] == 'production')
    n_matrix = sum(len(v) for v in matrix.values())
    feat_empty = '<div class="empty">No FEAT files yet. Create files like <code>FEAT - Contact Import.md</code> in the Features folder.</div>' if not features else ''

    html = (
        '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
        '<meta charset="UTF-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
        '<title>SparrowCRM — Product Cockpit</title>\n'
        '<style>\n'
        ':root {\n'
        '  --bg: #0f1117; --surface: #1a1d27; --surface2: #232733; --border: #2e3343;\n'
        '  --text: #e4e6ed; --text2: #9399a8; --accent: #6c5ce7; --accent2: #a29bfe;\n'
        '  --green: #00b894; --green-bg: rgba(0,184,148,0.12);\n'
        '  --yellow: #fdcb6e; --yellow-bg: rgba(253,203,110,0.12);\n'
        '  --orange: #e17055; --orange-bg: rgba(225,112,85,0.12);\n'
        '  --blue: #74b9ff; --blue-bg: rgba(116,185,255,0.12);\n'
        '  --pink: #fd79a8; --pink-bg: rgba(253,121,168,0.12);\n'
        '  --cyan: #81ecec; --cyan-bg: rgba(129,236,236,0.12);\n'
        '  --red: #ff7675; --red-bg: rgba(255,118,117,0.12);\n'
        '}\n'
        '* { margin:0; padding:0; box-sizing:border-box; }\n'
        'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:var(--bg); color:var(--text); line-height:1.5; }\n'
        '.top-bar { display:flex; align-items:center; justify-content:space-between; padding:16px 28px; border-bottom:1px solid var(--border); background:var(--surface); position:sticky; top:0; z-index:100; }\n'
        '.top-bar h1 { font-size:20px; font-weight:700; letter-spacing:-0.5px; }\n'
        '.top-bar h1 span { color:var(--accent2); }\n'
        '.top-bar .meta { font-size:12px; color:var(--text2); display:flex; align-items:center; gap:16px; }\n'
        '.refresh-hint { font-size:11px; color:var(--text2); background:var(--surface2); padding:4px 10px; border-radius:6px; }\n'
        '.grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; padding:20px 28px; max-width:1600px; margin:0 auto; }\n'
        '.grid .full { grid-column: 1 / -1; }\n'
        '.card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:20px; }\n'
        '.card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }\n'
        '.card-header h2 { font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:var(--text2); }\n'
        '.card-header .count { font-size:12px; color:var(--accent2); background:rgba(108,92,231,0.15); padding:2px 8px; border-radius:10px; }\n'
        '.chip { display:inline-block; padding:3px 10px; border-radius:6px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.3px; }\n'
        '.chip.draft { background:var(--surface2); color:var(--text2); }\n'
        '.chip.done { background:var(--blue-bg); color:var(--blue); }\n'
        '.chip.reviewed { background:var(--cyan-bg); color:var(--cyan); }\n'
        '.chip.design { background:var(--pink-bg); color:var(--pink); }\n'
        '.chip.dev { background:var(--orange-bg); color:var(--orange); }\n'
        '.chip.staging { background:var(--yellow-bg); color:var(--yellow); }\n'
        '.chip.production { background:var(--green-bg); color:var(--green); }\n'
        '.status-table { width:100%; border-collapse:collapse; }\n'
        '.status-table th { text-align:left; font-size:11px; color:var(--text2); text-transform:uppercase; letter-spacing:0.5px; padding:8px 12px; border-bottom:1px solid var(--border); }\n'
        '.status-table td { padding:10px 12px; border-bottom:1px solid var(--border); font-size:13px; }\n'
        '.status-table tr:last-child td { border-bottom:none; }\n'
        '.status-table tr:hover { background:rgba(108,92,231,0.05); }\n'
        '.status-table .name { font-weight:500; }\n'
        '.status-table .section-tag { font-size:10px; color:var(--text2); background:var(--surface2); padding:2px 6px; border-radius:4px; }\n'
        '.matrix { display:grid; grid-template-columns:1fr 1fr; grid-template-rows:auto auto; gap:8px; }\n'
        '.matrix-cell { border-radius:10px; padding:14px; min-height:120px; }\n'
        '.matrix-cell h3 { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; }\n'
        '.matrix-cell .items { display:flex; flex-direction:column; gap:4px; }\n'
        '.matrix-item { font-size:12px; padding:6px 10px; background:rgba(255,255,255,0.06); border-radius:6px; display:flex; justify-content:space-between; align-items:center; }\n'
        '.matrix-item .score { font-weight:700; font-size:11px; }\n'
        '.q1 { background:rgba(0,184,148,0.08); border:1px solid rgba(0,184,148,0.2); }\n'
        '.q1 h3 { color:var(--green); } .q1 .score { color:var(--green); }\n'
        '.q2 { background:rgba(116,185,255,0.08); border:1px solid rgba(116,185,255,0.2); }\n'
        '.q2 h3 { color:var(--blue); } .q2 .score { color:var(--blue); }\n'
        '.q3 { background:rgba(253,203,110,0.08); border:1px solid rgba(253,203,110,0.2); }\n'
        '.q3 h3 { color:var(--yellow); } .q3 .score { color:var(--yellow); }\n'
        '.q4 { background:rgba(255,118,117,0.08); border:1px solid rgba(255,118,117,0.2); }\n'
        '.q4 h3 { color:var(--red); } .q4 .score { color:var(--red); }\n'
        '.roadmap { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }\n'
        '.roadmap-col { background:var(--surface2); border-radius:10px; padding:14px; }\n'
        '.roadmap-col h3 { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px; display:flex; align-items:center; gap:6px; }\n'
        '.roadmap-col h3 .dot { width:8px; height:8px; border-radius:50%; }\n'
        '.now-dot { background:var(--green); } .next-dot { background:var(--yellow); } .later-dot { background:var(--text2); }\n'
        '.roadmap-item { font-size:12px; padding:8px 10px; background:var(--surface); border:1px solid var(--border); border-radius:6px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center; }\n'
        '.pipeline { display:flex; gap:8px; overflow-x:auto; padding-bottom:8px; }\n'
        '.pipeline-col { min-width:140px; flex:1; }\n'
        '.pipeline-col-header { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--text2); padding:8px; text-align:center; border-bottom:2px solid var(--border); margin-bottom:8px; }\n'
        '.pipeline-card { font-size:11px; padding:8px; background:var(--surface2); border:1px solid var(--border); border-radius:6px; margin-bottom:4px; }\n'
        '.metrics-grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; }\n'
        '.metric-card { background:var(--surface2); border-radius:10px; padding:14px; text-align:center; }\n'
        '.metric-card .label { font-size:10px; color:var(--text2); text-transform:uppercase; letter-spacing:0.5px; }\n'
        '.metric-card .value { font-size:24px; font-weight:700; margin:4px 0; }\n'
        '.progress-bar { height:6px; background:var(--surface2); border-radius:3px; overflow:hidden; margin-top:12px; }\n'
        '.progress-fill { height:100%; border-radius:3px; background:linear-gradient(90deg, var(--accent), var(--green)); }\n'
        '.empty { text-align:center; color:var(--text2); font-size:13px; padding:20px; font-style:italic; }\n'
        '.stats-row { display:flex; gap:12px; margin-bottom:16px; }\n'
        '.stat-box { flex:1; background:var(--surface2); border-radius:8px; padding:12px; text-align:center; }\n'
        '.stat-box .num { font-size:28px; font-weight:700; }\n'
        '.stat-box .lbl { font-size:10px; color:var(--text2); text-transform:uppercase; letter-spacing:0.5px; }\n'
        '.howto { background:var(--surface2); border-radius:8px; padding:12px 16px; font-size:12px; color:var(--text2); line-height:1.8; margin-top:12px; }\n'
        '.howto code { background:var(--bg); padding:2px 6px; border-radius:3px; font-size:11px; color:var(--accent2); }\n'
        '</style>\n</head>\n<body>\n\n'

        # TOP BAR
        '<div class="top-bar">\n'
        '  <div><h1>Sparrow<span>CRM</span> — Product Cockpit</h1></div>\n'
        '  <div class="meta">\n'
        '    <span>Generated: ' + today + '</span>\n'
        '    <span class="refresh-hint">Run <code>python3 refresh-dashboard.py</code> to update</span>\n'
        '    <span>Overall: <strong>' + str(progress_pct) + '%</strong></span>\n'
        '  </div>\n'
        '</div>\n\n'

        '<div class="grid">\n\n'

        # STATS ROW
        '  <div class="card full">\n'
        '    <div class="stats-row">\n'
        '      <div class="stat-box"><div class="num">' + str(len(deliverables)) + '</div><div class="lbl">Deliverables</div></div>\n'
        '      <div class="stat-box"><div class="num">' + str(len(features)) + '</div><div class="lbl">Features</div></div>\n'
        '      <div class="stat-box"><div class="num">' + str(len(specs)) + '</div><div class="lbl">Specs</div></div>\n'
        '      <div class="stat-box"><div class="num">' + str(len(competitors)) + '</div><div class="lbl">Competitors</div></div>\n'
        '      <div class="stat-box"><div class="num">' + str(shipped) + '</div><div class="lbl">In Production</div></div>\n'
        '      <div class="stat-box"><div class="num" style="color:var(--accent2);">' + str(progress_pct) + '%</div><div class="lbl">Progress</div></div>\n'
        '    </div>\n'
        '    <div class="progress-bar"><div class="progress-fill" style="width:' + str(progress_pct) + '%;"></div></div>\n'
        '  </div>\n\n'

        # PRIORITIZATION MATRIX
        '  <div class="card">\n'
        '    <div class="card-header"><h2>Prioritization Matrix</h2><span class="count">' + str(n_matrix) + ' items</span></div>\n'
        '    <div style="text-align:center; font-size:10px; color:var(--text2); margin-bottom:4px;">&larr; LOW EFFORT &nbsp;&nbsp;&nbsp;&nbsp; HIGH EFFORT &rarr;</div>\n'
        '    <div class="matrix">\n'
        '      <div class="matrix-cell q1"><h3>DO FIRST</h3><div class="items">' + render_matrix_items(matrix['q1'], 'Add impact &amp; effort to FEAT frontmatter') + '</div></div>\n'
        '      <div class="matrix-cell q2"><h3>PLAN &amp; SCHEDULE</h3><div class="items">' + render_matrix_items(matrix['q2'], '—') + '</div></div>\n'
        '      <div class="matrix-cell q3"><h3>QUICK WINS</h3><div class="items">' + render_matrix_items(matrix['q3'], '—') + '</div></div>\n'
        '      <div class="matrix-cell q4"><h3>DON\'T DO</h3><div class="items">' + render_matrix_items(matrix['q4'], '—') + '</div></div>\n'
        '    </div>\n'
        '    <div style="text-align:right; font-size:10px; color:var(--text2); margin-top:4px;">&uarr; HIGH IMPACT &nbsp;&nbsp; &darr; LOW IMPACT</div>\n'
        '    <div class="howto"><strong>How it works:</strong> Add <code>impact: 4</code> and <code>effort: 2</code> to any FEAT file frontmatter. Score = impact &divide; effort. Auto-sorted into quadrants.</div>\n'
        '  </div>\n\n'

        # ROADMAP
        '  <div class="card">\n'
        '    <div class="card-header"><h2>Roadmap</h2><span class="count">Now / Next / Later</span></div>\n'
        '    <div class="roadmap">\n'
        '      <div class="roadmap-col"><h3><span class="dot now-dot"></span> Now</h3>' + render_roadmap_col(roadmap['now'], 'Tag files with <code>now</code>') + '</div>\n'
        '      <div class="roadmap-col"><h3><span class="dot next-dot"></span> Next</h3>' + render_roadmap_col(roadmap['next'], 'Tag files with <code>next</code>') + '</div>\n'
        '      <div class="roadmap-col"><h3><span class="dot later-dot"></span> Later</h3>' + render_roadmap_col(roadmap['later'], 'Tag files with <code>later</code>') + '</div>\n'
        '    </div>\n'
        '    <div class="howto"><strong>How it works:</strong> Add <code>now</code>, <code>next</code>, or <code>later</code> to any file\'s <code>tags:</code> in frontmatter.</div>\n'
        '  </div>\n\n'

        # FEATURE PIPELINE
        '  <div class="card full">\n'
        '    <div class="card-header"><h2>Feature Pipeline</h2><span class="count">' + str(len(features)) + ' features</span></div>\n'
        '    <div class="pipeline">\n'
        '      <div class="pipeline-col"><div class="pipeline-col-header" style="border-color:var(--text2);">Draft</div>' + render_pipeline_cards(pipeline['draft']) + '</div>\n'
        '      <div class="pipeline-col"><div class="pipeline-col-header" style="border-color:var(--blue);">Done</div>' + render_pipeline_cards(pipeline['done']) + '</div>\n'
        '      <div class="pipeline-col"><div class="pipeline-col-header" style="border-color:var(--cyan);">Reviewed</div>' + render_pipeline_cards(pipeline['reviewed']) + '</div>\n'
        '      <div class="pipeline-col"><div class="pipeline-col-header" style="border-color:var(--pink);">Design</div>' + render_pipeline_cards(pipeline['design']) + '</div>\n'
        '      <div class="pipeline-col"><div class="pipeline-col-header" style="border-color:var(--orange);">Dev</div>' + render_pipeline_cards(pipeline['dev']) + '</div>\n'
        '      <div class="pipeline-col"><div class="pipeline-col-header" style="border-color:var(--yellow);">Staging</div>' + render_pipeline_cards(pipeline['staging']) + '</div>\n'
        '      <div class="pipeline-col"><div class="pipeline-col-header" style="border-color:var(--green);">Production</div>' + render_pipeline_cards(pipeline['production']) + '</div>\n'
        '    </div>\n'
        '    ' + feat_empty + '\n'
        '    <div class="howto"><strong>How it works:</strong> Create <code>FEAT - [Name].md</code> in <code>5 - Features/</code> using the Feature Template. The <code>status:</code> frontmatter places it in the right column.</div>\n'
        '  </div>\n\n'

        # COMPETITORS + ALL FILES
        '  <div class="card">\n'
        '    <div class="card-header"><h2>Competitors Tracked</h2><span class="count">' + str(len(competitors)) + '</span></div>\n'
        '    ' + render_competitor_rows(competitors) + '\n'
        '    <div class="howto"><strong>How it works:</strong> Create <code>COMP - [Name].md</code> in <code>7 - Competitors/</code> using the Competitor Template.</div>\n'
        '  </div>\n\n'

        '  <div class="card">\n'
        '    <div class="card-header"><h2>All Files in Vault</h2><span class="count">' + str(len(all_files)) + ' files</span></div>\n'
        '    <div class="metrics-grid" style="grid-template-columns:repeat(3, 1fr);">\n'
        '      <div class="metric-card"><div class="label">Draft</div><div class="value">' + str(n_draft) + '</div></div>\n'
        '      <div class="metric-card"><div class="label">In Progress</div><div class="value" style="color:var(--orange);">' + str(n_progress) + '</div></div>\n'
        '      <div class="metric-card"><div class="label">In Production</div><div class="value" style="color:var(--green);">' + str(n_prod) + '</div></div>\n'
        '    </div>\n'
        '  </div>\n\n'

        # DELIVERABLES STATUS BOARD (bottom)
        '  <div class="card full">\n'
        '    <div class="card-header"><h2>Deliverables Status Board</h2><span class="count">' + str(shipped) + ' shipped / ' + str(len(deliverables)) + ' total</span></div>\n'
        '    <table class="status-table">\n'
        '      <thead><tr><th>Deliverable</th><th>Section</th><th>Status</th><th>Owner</th><th>Updated</th><th>File</th></tr></thead>\n'
        '      <tbody>\n'
        '        ' + render_deliverable_rows(deliverables) + '\n'
        '      </tbody>\n'
        '    </table>\n'
        '    <div class="progress-bar" style="margin-top:16px;"><div class="progress-fill" style="width:' + str(progress_pct) + '%;"></div></div>\n'
        '    <div class="howto" style="margin-top:12px;">\n'
        '      <strong>How it works:</strong> This reads <code>status:</code> from every .md frontmatter. Update any file, run <code>python3 refresh-dashboard.py</code>.<br>\n'
        '      Valid statuses: <code>Draft</code> &middot; <code>Done</code> &middot; <code>Reviewed</code> &middot; <code>Design</code> &middot; <code>Dev</code> &middot; <code>Staging</code> &middot; <code>In Production</code>\n'
        '    </div>\n'
        '  </div>\n\n'

        '</div>\n</body>\n</html>'
    )

    return html


def main():
    print("Scanning vault...")
    files = scan_vault()
    print("  Found " + str(len(files)) + " .md files")

    deliverables, features, specs, competitors, all_files = categorize(files)
    print("  " + str(len(deliverables)) + " deliverables, " + str(len(features)) + " features, " + str(len(specs)) + " specs, " + str(len(competitors)) + " competitors")

    matrix = build_matrix(features)
    roadmap = build_roadmap(all_files)

    print("Generating dashboard...")
    html = generate_html(deliverables, features, specs, competitors, all_files, matrix, roadmap)

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html)

    print("Dashboard written to: " + str(OUTPUT_FILE))
    print("Open it in your browser to see the cockpit.")


if __name__ == '__main__':
    main()
