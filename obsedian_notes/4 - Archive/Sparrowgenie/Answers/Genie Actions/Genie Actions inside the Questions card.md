---
name: Genie Actions inside the Questions card
tags:
  - new_feature/question_card/Genie_actions
Wireframe: https://stunning-froyo-2bbc4c.netlify.app/
author: Divyaraj Murugan
published:
type: PRD
product: SparrowGenie
feature:
status: Done
priority: Medium
owner: Divyaraj Murugan
sprint:
version: 1
share_link: https://share.note.sx/gqpeuwat#6s8xbn+EvYbrNH1s40sjIC311wLiIsgvWxUhq980Ng4
share_updated: 2026-03-25T23:19:00+05:30
---

## Problem

Users can't refine generated RFP answers without manual editing. No way to control sources, adjust length, or guide the output. They copy-paste into external tools, breaking the feedback loop.

---

## Goals

1. Reduce answer refinement time by 40% within 60 days
2. 80%+ of regenerations via source picker include at least one source change
3. 30% reduction in post-generation manual text edits
4. 15% of regenerations use Upload source within 60 days

---

## Non-goals

- Bulk answer actions — too complex for v 1
- Multi-turn Ask GenieAI chat — separate initiative, v 1 is single-turn
- Answer version history / diff view — separate feature
- Source confidence scoring — needs ML pipeline changes
- Auto-suggesting expansion/shortening strategies — need usage data first

---

## User stories

**Regenerate:** As a proposal manager, I want to regenerate with control over which sources are included or excluded across all my KHs.

**Upload source:** As a compliance team member, I want to regenerate using my own uploaded document without it being saved to any KH.

**Expand:** As a sales team member, I want to describe how I want the answer expanded so the output is targeted, not generic padding.

**Shorten:** As a proposal manager, I want to describe what to keep or remove so the most relevant content survives.

---

## Requirements

### P 0 — Must ship

**Main dropdown** Four options: Regenerate answer (→ sub-menu), Expand answer (→ sub-panel), Shorten answer (→ sub-panel), Ask GenieAI. Opens from the action caret next to each answer.

AC:

- [ ] Clicking GenieAI Icon opens dropdown with all four options
- [ ] Clicking outside or pressing Escape closes dropdown
- [ ] Hover state on each row

**Regenerate — normal** Fires immediately with same sources. No extra UI.

AC:

- [ ] Clicking "Regenerate" triggers regeneration with same sources
- [ ] Loading state shown during generation

**Regenerate — pick sources** Progressive disclosure panel.

AC:

- [ ] Panel opens showing "Sources used for this answer" — all pre-checked
- [ ] Unchecking a source excludes it from regeneration
- [ ] "Add more sources" trigger expands browse section
- [ ] Browse section: search bar (auto-focused), KH pill filters, source type tabs (Files / Websites / Q&A / Integrations)
- [ ] KH + type filters apply to browse list only, not used sources list
- [ ] Search filters by source name or KH name
- [ ] "Close" collapses browse section back to trigger
- [ ] CTA reads "Regenerate with N sources" — count updates dynamically
- [ ] CTA disabled (opacity reduced) when 0 sources selected

**Regenerate — upload source**  file upload for one-time regeneration. Files are NOT saved to any KH.

AC:

- [ ] Drag-and-drop or click-to-browse uploads a file
- [ ] Uploaded file shows name, size, and remove (X) button
- [ ] Clicking X removes the file
- [ ] Files used for this regeneration only — discarded after
- [ ] No "Save to KH" option exists in this flow
- [ ] Navigating away clears uploaded files
- [ ] Supported: PDF, DOCX, XLSX, TXT. Max 25 MB
- [ ] Unsupported file type shows error

**Expand answer** Single prompt box for user to describe how they want expansion.

AC:

- [ ] Panel shows textarea labeled "Describe how you want it expanded"
- [ ] Placeholder: "e.g. Add more technical detail, include examples, focus on compliance section..."
- [ ] CTA: "Expand answer"
- [ ] User types description → answer expanded per instructions
- [ ] Empty prompt → general expansion (default behavior)
- [ ] Loading state during generation

**Shorten answer** Single prompt box for user to describe how they want shortening.

AC:

- [ ] Panel shows textarea labeled "Describe how you want it shortened"
- [ ] Placeholder: "e.g. Keep only the key points, remove examples, focus on pricing..."
- [ ] CTA: "Shorten answer"
- [ ] User types description → answer shortened per instructions
- [ ] Empty prompt → general trim (default behavior)
- [ ] Loading state during generation

### P 1 — Fast follow

- Ask GenieAI: single-turn free-form prompt, accept or revert
- KH  tags (Product = purple, Compliance = teal, etc.)
- Remember last source selection within session

### P 2 — Future

- Bulk answer actions
- Answer diff view
- Source confidence scoring
- Prompt suggestions / quick-tap chips for expand/shorten
- Multi-turn Ask GenieAI

---

## Open questions

| #   | Question                                                            | Owner            | Blocking |
| --- | ------------------------------------------------------------------- | ---------------- | -------- |
| 1   | Max sources per regeneration? Context window limits?                | Eng              | Yes      |
| 2   | Empty prompt default behavior — general heuristic or require input? | Product + Design | Yes      |
| 3   | Unsaved edits on current answer — warn & overwrite or save copy?    | Design           | Yes      |
| 4   | File processing — in-memory without indexing? Latency?              | Eng              | No       |
| 5   | Ask GenieAI context scope — same sources or broader?                | Product          | No       |
| 6   | Per-KH access permissions in source picker?                         | Product + Eng    | Yes      |
| 7   | Analytics events needed? Capture prompt text for quality analysis?  | Data + Legal     | No       |
|     |                                                                     |                  |          |

---

## Timeline

**Phase 1:** All P 0 — main dropdown, regenerate (normal + pick sources + upload), expand, shorten **Phase 2 (2–3 weeks post):** P 1 — Ask GenieAI, source icons, KH tags, session memory **Phase 3 (next quarter):** P 2 based on usage data

**Dependencies:**

- KH API must return source type metadata
- Ephemeral file upload endpoint (no KH persistence)
- LLM prompt templates for expand/shorten (descriptive + empty prompt fallback)

No hard deadlines. Product-driven initiative.