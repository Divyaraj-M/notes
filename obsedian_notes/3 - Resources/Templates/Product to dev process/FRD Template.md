---
tags:
related:
  - "[[Obligations]]"
  - "[[reverse-engineer-ISO29148-to-PRD-prompt-template]]"
  - "[[PRD Feature Name]]"
  - "[[Product Spec Template 2]]"
  - "[[Proposal Template flow]]"
  - "[[Decision-State Progress Bars]]"
  - "[[Feature Template]]"
  - "[[SparrowGenie.excalidraw]]"
  - "[[Zoom]]"
  - "[[pestel-analysis-prompt-template]]"
  - "[[customer-journey-mapping-prompt-template]]"
  - "[[Custom Agent builderv1]]"
  - "[[Answer types templates]]"
  - "[[Final PRD -Rich Text Editor for Project Response Area]]"
  - "[[WYSIWYG Editor _ PRD]]"
---

# FRD: [Feature Name]

> **PRD Reference:** [Link to PRD] **Design Reference:** [Link to Figma] **PM Owner:** [PM Name] **Tech Lead:** [Name] **Status:** Draft / In Review / Approved / In Development **Sprint:** [Sprint number] **Last Updated:** [Date]

---

<!-- This doc is written AFTER design is approved. It translates Figma screens into implementable specs. Every interaction, every edge case, every API call. If a dev has to guess, this doc failed. -->

## 1. Overview

<!-- 3-5 sentences. What problem, what scope, what design decisions are already locked. Link the PRD, don't restate it. -->

[Write here]

**Key design decisions already made:**

- [e.g., Creation flow uses a modal, not a full page]
- [e.g., List view uses infinite scroll, not pagination]

---

## 2. Screen Specifications

<!-- For each screen from approved Figma, document every interaction at the granular level. -->

### Screen 1: [Screen Name]

> **Figma frame:** [Link to specific frame] 🎟️ **Dev story:** `[PROJ]-XXX` **PRD user stories:** US-1, US-2

#### Interactions

|#|Trigger|Behavior|Error Handling|
|---|---|---|---|
|I-1|[e.g., User clicks "Save"]|[Validate all fields. If valid: POST /api/items, show spinner on button, on success show toast + redirect to list view]|[422: inline field errors. 500: "Something went wrong" toast + retry. Timeout 10s: offline banner]|
|I-2|[e.g., User types in search]|[Debounce 300ms. GET /api/items?q={query}. Min 2 chars. Show skeleton loader in results area]|[No results: empty state. API error: show last cached results + error banner]|
|I-3|[e.g., User hovers row]|[Show action icons (edit, delete) on right side of row. Cursor → pointer]|[N/A]|

#### Field Validations

|Field|Type|Rules|Error Message|Required|
|---|---|---|---|---|
|[Name]|Text input|Max 100 chars, no special chars, trim whitespace|"Name must be under 100 characters"|Yes|
|[Email]|Email input|RFC 5322 format, max 254 chars|"Enter a valid email address"|Yes|
|[Type]|Dropdown|Must select one of: [Option A, Option B, Option C]|"Select a type"|Yes|

#### States

|State|What User Sees|Trigger|Exit Condition|
|---|---|---|---|
|Loading|Skeleton cards (3 placeholder rows)|Page load / data fetch|API response received|
|Empty|Illustration + "No items yet" + CTA button|API returns 0 results|User creates first item|
|Populated|Data table with rows, sort, filter|API returns results|—|
|Error|Error banner + retry button + last cached data if available|API 5xx or network fail|User clicks retry + API succeeds|

---

### Screen 2: [Screen Name]

> **Figma frame:** [Link] 🎟️ **Dev story:** `[PROJ]-XXX`

#### Interactions

|#|Trigger|Behavior|Error Handling|
|---|---|---|---|
|I-1||||

#### Field Validations

|Field|Type|Rules|Error Message|Required|
|---|---|---|---|---|
||||||

#### States

|State|What User Sees|Trigger|Exit Condition|
|---|---|---|---|
|||||

---

## 3. API Contracts

<!-- Every endpoint this feature touches. Backend + frontend use this to work in parallel. -->

### Endpoint 1: [Name]

| Field | Details |
|------|---------|
| **Method** | GET / POST / PUT / DELETE |
| **Path** | /api/v1/resource |
| **Auth** | Bearer token / API key / Session |
| **Request body** | `{ name: string, type: enum("a","b"), description?: string }` |
| **Success (200)** | `{ id: string, name: string, created_at: ISO8601 }` |
| **Error 400** | `{ error: "validation_error", fields: { name: "required" } }` |
| **Error 401** | `{ error: "unauthorized" }` |
| **Error 404** | `{ error: "not_found" }` |
| **Error 500** | `{ error: "internal_error" }` |
| **Rate limit** | If applicable |

### Endpoint 2: [Name]

| Field | Details |
|------|---------|
| **Method** | |
| **Path** | |
| **Auth** | |
| **Request body** | |
| **Success** | |
| **Errors** | |

---

## 4. Data Model Changes

<!-- New tables, fields, indexes, migrations. If none needed: "No data model changes." -->

**Table: [table_name]**

| Field        | Type | Nullable | Default | Notes                           |
| ------------ | ---- | -------- | ------- | ------------------------------- |
| [status]     | enum | No       | 'draft' | Values: draft, active, archived |
| [created_by] | uuid | No       | —       | FK → users.id                   |

**Indexes:**

- [e.g., idx_items_status on items(status) — for filtered list queries]

**Migrations:**

- [e.g., Add status column with default 'draft', backfill existing rows]

---

## 5. Blast Radius

<!-- What existing stuff does this change touch? Critical for QA and code review. -->

|Affected Area|What Changes|Risk|Regression Test|
|---|---|---|---|
|[Dashboard]|[New widget added to grid]|Low — additive|[Verify dashboard loads, existing widgets unaffected]|
|[User permissions]|[New permission type in RBAC]|Medium — affects all roles|[Verify existing role permissions unchanged]|
|[Notification system]|[New event type triggers email]|Low|[Verify existing notifications still fire]|

---

## 6. Permissions & Access Control

|Action|Allowed Roles|Denied Behavior|Notes|
|---|---|---|---|
|[Create item]|Admin, Editor|Button hidden in UI. 403 if API called directly|Viewer sees read-only|
|[Delete item]|Admin only|Button hidden. 403 on API|—|
|[View list]|All authenticated|401 redirect to login if unauthenticated|—|

---

## 7. Performance Requirements

<!-- Only if specific requirements exist beyond normal expectations. -->

- [e.g., List endpoint: < 200ms for up to 1000 items]
- [e.g., Search: debounce 300ms client-side, API < 500ms]
- [e.g., Image uploads: max 5MB, client-side compression before upload]
- [e.g., Caching: list results cached 60s, invalidate on create/update/delete]

---

## 8. Analytics Events

|Event Name|Properties|Trigger|PRD Metric|
|---|---|---|---|
|[item_created]|item_id, item_type, time_to_create_ms|On successful POST|Activation rate|
|[item_searched]|query_length, result_count, time_to_first_result_ms|On search response|Task completion|
|[item_deleted]|item_id, item_age_days|On successful DELETE|—|

---

## 9. Testing Checklist

### Happy Path

- [ ] [Create item with all fields → appears in list]
- [[Search returns correct results → click result → detail view loads]]
- [[Edit item → changes persist on refresh]]

### Edge Cases

- [ ] [Submit with max-length values in all fields]
- [ ] [Create item with special characters in name]
- [ ] [Rapid successive clicks on submit button]
- [ ] [Browser back button during creation flow]

### Error Cases

- [ ] [Submit while API is down → error state renders]
- [ ] [Submit with invalid data → inline validation errors show]
- [ ] [Session expired mid-flow → redirect to login, preserve draft]

### Regression

- [ ] [Dashboard loads correctly with new widget]
- [ ] [Existing items unaffected by migration]
- [ ] [Other features' API calls still work]

### Accessibility

- [ ] [All interactive elements keyboard-navigable]
- [ ] [Screen reader announces state changes]
- [ ] [Color contrast meets WCAG 2.1 AA]

---

## 10. Technical Open Questions

|#|Question|Owner|Blocking?|Status|Resolution|
|---|---|---|---|---|---|
|TQ-1|[e.g., New DB index needed for search?]|[Backend lead]|Yes|Open||
|TQ-2|[e.g., WebSocket or polling for real-time updates?]|[Tech lead]|No|Open||

---

## 11. Jira Tickets — Dev Phase

<!-- One Dev Story per logical unit. Atomic sub-tasks under each. Sub-tasks should be completable in < 1 day. -->

### Story: `[PROJ]-XXX` — [Screen / Feature Slice Name]

> **Type:** Story **Epic:** [Epic name] **Points:** [Estimate] **Depends on:** [Other ticket if blocked] **Linked PRD story:** `[PROJ]-XXX` (Story Definition)

|Sub-task|Summary|Assignee|Estimate|Status|Spec Reference|
|---|---|---|---|---|---|
|`[PROJ]-XXX`|BE: Create [endpoint] API endpoint|[Dev]|[2h]|To Do|§3 Endpoint 1|
|`[PROJ]-XXX`|BE: Add [table/field] migration|[Dev]|[1h]|To Do|§4 Data Model|
|`[PROJ]-XXX`|FE: Build [Screen 1] — populated state|[Dev]|[4h]|To Do|§2 Screen 1|
|`[PROJ]-XXX`|FE: Build [Screen 1] — empty + error states|[Dev]|[2h]|To Do|§2 Screen 1 States|
|`[PROJ]-XXX`|FE: Wire [Screen 1] to API + loading state|[Dev]|[2h]|To Do|§2 Screen 1, §3|
|`[PROJ]-XXX`|FE: Add field validations for [form]|[Dev]|[2h]|To Do|§2 Field Validations|
|`[PROJ]-XXX`|FE: Add analytics events|[Dev]|[1h]|To Do|§8 Analytics|
|`[PROJ]-XXX`|QA: Test happy path + edge cases|[QA]|[3h]|To Do|§9 Testing|

### Story: `[PROJ]-XXX` — [Next Screen / Feature Slice]

> **Points:** [Estimate] **Depends on:** [PROJ]-XXX

|Sub-task|Summary|Assignee|Estimate|Status|Spec Reference|
|---|---|---|---|---|---|
|`[PROJ]-XXX`||||||

---

## Full Ticket Tracker

<!-- Master view of all tickets across both phases (design from PRD + dev from FRD). -->

|Ticket|Type|Phase|Summary|Assignee|Status|Depends On|Spec Section|
|---|---|---|---|---|---|---|---|
|`[PROJ]-XXX`|Story|Definition|[Feature] — Story Definition|[PM]|Done|—|PRD|
|`[PROJ]-XXX`|Sub-task|Design|Design: [Screen 1]|[Designer]|Done|Story Def|PRD §7|
|`[PROJ]-XXX`|Sub-task|Design|Design: [Screen 2]|[Designer]|Done|Story Def|PRD §7|
|`[PROJ]-XXX`|Story|Dev|[Screen 1] — Dev Story|[Dev lead]|In Progress|Design done|FRD §2|
|`[PROJ]-XXX`|Sub-task|Dev|BE: [endpoint] API|[Dev]|To Do|—|FRD §3|
|`[PROJ]-XXX`|Sub-task|Dev|FE: [Screen 1] build|[Dev]|To Do|BE endpoint|FRD §2|
|`[PROJ]-XXX`|Sub-task|Dev|QA: [Screen 1] testing|[QA]|To Do|FE build|FRD §9|

---

## Changelog

|Date|Author|Changes|
|---|---|---|
|[Date]|[Name]|Initial FRD from approved designs|
||||