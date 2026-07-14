# PRD — SparrowCRM Unified Filter System

**Status:** Draft
**Author:** Divyaraj Murugan
**Date:** 2026-05-20
**Surface:** SparrowCRM — applies to every object (Deals, Contacts, Companies, Accounts, custom objects)

---

## 1. Problem Statement

Filtering in SparrowCRM today is fragmented and underpowered. Each object surface ships its own filter UI built ad hoc, with inconsistent operators, mismatched value inputs, and no shared component model. A sales rep filtering Deals by stage cannot rely on the same interaction working on Contacts, and operators like `is between` or `is in the last 7 days` exist on some objects but not others.

The consequence is threefold:

1. **Users learn the CRM 3–4 times** — once per object. Power moves (saved views, multi-select, "is me") don't transfer.
2. **Reps and CS export to spreadsheets** to do work the CRM should support natively — slicing accounts by renewal date, ranking deals by score, finding contacts with no recent touchpoint.
3. **RevOps cannot standardize playbooks** because they can't define a segment once and have the same definition work across objects.

This is a structural problem, not a polish problem. The right fix is to extract filtering into a single component model — a typed field schema, a fixed operator vocabulary per type, and one filter UI that every object inherits.

## 2. Jobs To Be Done

**Job statement:** *When I'm working in a list of CRM records, I want to narrow it down to the precise slice that matters right now and come back to that slice tomorrow without rebuilding it, so I can act on the work in front of me instead of context-switching to spreadsheets or asking ops for a report.*

- **Functional:** Build a multi-condition filter on any object, see results instantly, save it as a named view, and reopen it tomorrow with one click.
- **Emotional:** Feel in control of a large dataset rather than buried by it. Trust that the CRM shows what was asked for, no fewer and no more.
- **Social:** Look credible in pipeline reviews and QBRs — "this is *my* view of my book of business," not "give me a minute, I need to re-filter."

**Hire criteria** (what gets users to adopt this over their workaround):
- Fast (chip + popover, under 3 seconds to add a condition).
- Predictable — same operators behave the same way on every object.
- Saved views are durable and reopenable in one click.
- "Is me" works without typing the user's name.

**Fire criteria** (what makes users go back to exports):
- Operators that silently differ across objects.
- Lost filters on refresh or navigation.
- Saved views that are hard to find or accidentally overwrite each other.
- Slow filter application on large lists (>1s).

## 3. Goals

1. **One unified filter component** powers every object in SparrowCRM. No object-specific filter UIs.
2. **All eight field types supported** (text-like, number-like, date-like, yes/no, single-choice, multi-select, user, relationship) with the operator sets specified below.
3. **Saved views are first-class.** Users can save a filter set as a named view, reopen it from the view switcher, edit it, and delete it. Views persist across sessions and devices.
4. **Mixed-audience usability.** A new sales rep can build their first filter without help; a RevOps user can build a 5-condition compound filter in under 30 seconds.
5. **Lagging metric:** average of 3+ saved views per active user within 30 days post-GA (see §7).

## 4. Non-Goals

- **OR logic / filter groups in v1.** All filters in v1 are AND-combined. Compound logic is a v2 candidate (§8).
- **Cross-object filtering** (e.g., "Deals where Company.Industry = SaaS"). Relationship field type supports basic *has any / is X*, not nested field traversal.
- **Saved-view sharing and permissions.** v1 views are private to the user. Team/org sharing is a v2 candidate.
- **Bulk actions on filtered results.** Selection + bulk edit on a filtered list is a separate workstream.
- **Mobile parity.** v1 is desktop-first; mobile renders filtered results read-only and exposes saved-view switching, but does not let users build new filters.

## 5. User Stories

| # | Persona | Story |
|---|---------|-------|
| US-1 | Sales rep | As a sales rep, I want to filter my Deals list to "Open deals owned by me in Negotiation" so I can prep for my pipeline review in under a minute. |
| US-2 | Sales rep | As a sales rep, I want to save "My hot deals" as a view so I can reopen it every morning without rebuilding the filter. |
| US-3 | RevOps | As a RevOps lead, I want to build a 5-condition filter on Accounts (industry, ARR band, owner, renewal window, health score) so I can produce a renewals risk list. |
| US-4 | CS manager | As a CS manager, I want to filter Companies by "Last contact is in the last 30 days" + "Tier is Enterprise" so I can audit coverage of my top accounts. |
| US-5 | Any user | As any user, I want the same filter operators on Deals, Contacts, Companies, and Accounts so I don't relearn the UI each time. |
| US-6 | Any user | As any user, I want to add a filter on a sub-attribute (Name → First) so I can match by first name without writing a full-name regex. |
| US-7 | Sales rep | As a sales rep, I want an "is me" shortcut on Owner-type fields so I can build the most-common filter without typing my name. |
| US-8 | Any user | As any user, I want my filter state to persist across navigation and refresh so I don't lose context when I jump to a record and back. |

## 6. Requirements

Each requirement is tagged **P0 (must)** / **P1 (should)** / **P2 (could)** with acceptance criteria in Given/When/Then form.

### 6.1 Core filter primitive — P0

**R1 — Filter chip anatomy.** Every filter is rendered as a chip with four segments: `[Attribute] [Operator] [Value] [⋮]`.

- *Given* a user clicks the **Filter** button on any object list,
  *When* the attribute picker opens,
  *Then* it shows all attributes available on that object, searchable, with type-appropriate icons and a count for attributes that have sub-attributes (e.g., Name → 3).
- *Given* a user picks an attribute,
  *When* the filter chip is created,
  *Then* the operator defaults to the type-specific default (§6.2) and the value segment renders the appropriate input.

**R2 — Sub-attribute navigation.** Attributes with sub-fields (Name, Email addresses, Phone numbers, Primary location, etc.) drill into a second-level picker.

- *Given* an attribute exposes sub-fields,
  *When* the user clicks it,
  *Then* the picker pushes into a sub-menu with a `‹` back button and sub-field list.
- *Given* the user picks a sub-attribute,
  *Then* the chip label reads `[Field] › [Sub-field]` (e.g., `Name › First`).

**R3 — Operator menu.** Clicking the operator segment of a chip opens a popover listing only operators valid for that field type.

### 6.2 Field-type behaviors — P0

The operator vocabulary, default operator, and value-input pattern are fixed per type. Every object inherits these — no per-object overrides.

| Type | Applies to | Operators | Default | Value input |
|---|---|---|---|---|
| **Text-like** | Text, Email, Phone number, URL, Location | `contains`, `does not contain`, `is`, `is not`, `starts with`, `ends with`, `is empty`, `is not empty` | `contains` | Inline text input in the chip (no popover) |
| **Number-like** | Number, Currency, Rating | `is`, `is not`, `greater than`, `less than`, `between`, `is empty`, `is not empty` | `greater than` | Number popover; `between` shows two inputs; Currency renders `$` prefix; Rating shows stars |
| **Date-like** | Date, Timestamp | `is`, `is before`, `is after`, `is between`, `is in the last`, `is in the next`, `is empty`, `is not empty` | `is in the last` | Date picker popover with presets (Today, Yesterday, Last 7/30/90 days, This month, Last month, Custom). Timestamp = date+time picker; Date = date only |
| **Yes/No** | Yes/No | `is`, `is empty`, `is not empty` | `is` | Yes / No segmented dropdown |
| **Single choice** | Select, Status, Pipeline, Stage, Pipeline Stage | `is`, `is not`, `is any of`, `is empty`, `is not empty` | `is` | Dropdown only — no free typing; `is any of` switches to multi-select |
| **Multi-select** | Multi-select | `has any of`, `has all of`, `does not have`, `is empty`, `is not empty` | `has any of` | Checkbox list with selected count; chip shows first 2 tags + `+N` |
| **User** | User | `is`, `is not`, `is any of`, **`is me`**, `is empty`, `is not empty` | `is` | User picker; `is me` requires no value input |
| **Relationship** | Relationship | `is`, `is not`, `has any`, `does not have any`, `is empty`, `is not empty` | `is` | Record picker; `has any` / `does not have any` require no value input |

- *Given* a user is on the Deals list,
  *When* they add a filter on Stage,
  *Then* the operator menu shows exactly `is`, `is not`, `is any of`, `is empty`, `is not empty`.
- *Given* the same user navigates to the Contacts list,
  *When* they add a filter on a single-choice field,
  *Then* the operator menu is identical — no operator drift between objects.
- *Given* a user picks `is me` on an Owner field,
  *Then* no value input is shown and the chip reads `Owner is me`, and the filter resolves to the current user's identity server-side.

### 6.3 Compound filtering — P0

**R4 — AND combination.** Multiple chips combine with AND. The connector between chips is rendered as `AND` (greyed) for clarity.

- *Given* two filter chips are present,
  *When* the result set is computed,
  *Then* only records satisfying **all** chips are returned.

### 6.4 Saved views — P0

**R5 — Save a view.** From a filter bar with at least one chip, the user can click "Save view," name it, and the view is stored against the current object + user.

- *Given* the user has built `Status is Open AND Stage is Negotiation`,
  *When* they click "Save view" → "Save as new" → name it "My Negotiations",
  *Then* the view appears in that object's view switcher and reopens with identical filter state on next visit.

**R6 — Open / edit / delete a view.** From the view switcher, users can open, rename, overwrite, or delete their views.

- *Given* a saved view exists,
  *When* the user opens it,
  *Then* the filter bar restores all chips and the table reflects the filtered set within 500ms (p95).
- *Given* the user modifies an opened view,
  *Then* a "Save changes" / "Save as new" affordance appears in the view dropdown.

**R7 — URL state.** The active filter set encodes into the URL so the user can refresh, share the link with themselves across devices, and not lose state on navigation.

- *Given* a filter is active,
  *When* the user refreshes,
  *Then* the same filter set is restored from the URL.

### 6.5 Performance & feedback — P0

**R8 — Filter application latency.** The results table updates within **300ms (p50) / 500ms (p95)** of the last filter change, on lists up to 10,000 records on the client and unbounded server-side.

**R9 — Empty result handling.** When a filter set returns zero records, the table shows an empty state suggesting the user adjust or clear filters, with a one-click "Clear all filters" button.

### 6.6 Picker quality of life — P1

**R10 — Recently used attributes.** The attribute picker shows a "Recently used" section pinned to the top, listing the last 5 attributes the user filtered on across any object.

**R11 — Keyboard navigation.** All popovers support `↑` / `↓` to move, `Enter` to select, `Esc` to close, `Tab` to advance, `Backspace` in an empty value input to delete the chip.

**R12 — Pinned operators.** If a user uses one operator on a field 3+ times in a row (e.g., always `greater than` on Score), that operator is the default on next use of that field.

### 6.7 Power user — P2

**R13 — OR logic / filter groups.** Users can group filters with OR within a group, AND between groups. Out of scope for v1; tracked as v2.

**R14 — Cross-object traversal via relationships.** Filter Deals by `Company › Industry = SaaS`. Out of scope for v1; design dependency.

**R15 — Team / org-shared views.** Mark a saved view as Private (default), Team, or Org. Out of scope for v1; depends on view permissions model.

## 7. Success Metrics

The headline metric is **saved views per active user**. We track three leading metrics that catch upstream failure modes before the lagging metric moves.

| Metric | Type | Definition | Baseline | Target | Measurement |
|---|---|---|---|---|---|
| **Saved views per active user (30d)** | Lagging | Mean number of personal saved views created by an active user within 30 days of GA | 0 (no save in legacy) | ≥ 3 | Product analytics — `view_saved` event |
| **% users with ≥1 saved view (30d)** | Lagging | Share of active users who have created at least one view | 0% | ≥ 60% | Product analytics |
| **Filter build completion rate** | Leading | Of users who open the filter picker, what % create at least one applied chip in that session | n/a — new metric | ≥ 80% | Funnel: `filter_picker_opened` → `filter_applied` |
| **Time-to-first-filter (new user)** | Leading | Seconds from first visit to a list view to first applied filter | n/a | < 90s (p50) | Time delta between `list_viewed` and `filter_applied` |
| **Filter apply latency p95** | Guardrail | Time from filter change to results render | TBD (current system) | < 500ms | RUM / web-vitals on the list page |
| **Export usage** | Counter-metric | CSV exports from list views per active user / week | Current export count | ↓ ≥ 25% | Analytics — `list_exported` event |

**Evaluation cadence:** Weekly during the first 30 days post-GA, then monthly. We commit to the lagging target after the 30-day point; if leading metrics are red at week 2 we ship a UX iteration before measuring the lagging target.

## 8. Open Questions

| # | Question | Owner | Blocking? | Needed by |
|---|---|---|---|---|
| Q1 | Are filter groups / OR logic in v1 scope, or strictly v2? | PM | No — currently scoped out, but if a P0 user story emerges we revisit | Spec freeze |
| Q2 | What's the right v1 behavior for saved-view sharing — strictly private, or do we expose a read-only share link? | PM + Eng | Yes — affects URL/view storage model | Design kickoff |
| Q3 | Does cross-object traversal (Deal → Company.Industry) ship with v1's Relationship type, or wait for v2? | PM + Eng | Yes — affects schema design | Spec freeze |
| Q4 | Mobile behavior — read-only filtered lists only, or also let users switch between saved views? | Design | No | Beta |
| Q5 | Do we expose "Filter by current selection" (right-click a cell → filter to that value) in v1? | Design | No | Beta |
| Q6 | Performance ceiling — at what dataset size do we switch from client-side filtering to server-side? Need a clear cut-over rule. | Eng | Yes | Engineering design |
| Q7 | Does "is me" resolve to the impersonated user when an admin is impersonating, or always the underlying admin? | Security | Yes — affects audit | Spec freeze |
| Q8 | Recently-used attributes (R10) — scoped per object or global across the workspace? | PM | No | Beta |

## 9. Timeline Considerations

**Sequencing (not dates — set by Eng during planning).**

1. **Foundation — typed field schema + operator vocabulary.** Centralize the field-type → operator mapping in one place so every object inherits it. Without this, the whole "common filter" bet fails.
2. **Filter chip component + popover system.** Single React component family covering the chip, attribute picker, operator picker, and value pickers per type.
3. **Wire to one object (Deals) end-to-end.** Includes URL state, AND logic, and the picker UX. Get this right before rolling out.
4. **Saved views.** Storage model, view switcher, save/rename/delete flows, URL encoding.
5. **Roll out to remaining objects.** Contacts, Companies, Accounts, custom objects — each gated on the object exposing a typed schema.
6. **Beta with internal RevOps + 3 design partners** before GA.
7. **GA.** Cutover from legacy filter UI; legacy filter code deleted from each object as it migrates.

**Risks to call out at planning:**
- Migration of users' existing filter state from legacy UI — if we don't translate it, users perceive this as a regression. Need a translation script per object.
- Custom objects shipping their own field types not in the canonical 8 — every new field type added later requires updating the operator matrix. Treat field-type additions as a governed change.
- Performance on Contacts and Accounts lists, which are often larger than Deals — pressure-test the 500ms p95 target on production-sized data before GA.

---

*End of PRD.*
