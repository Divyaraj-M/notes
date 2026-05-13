---
owner: Divyaraj Murugan
feature: "[[Reports]]"
version: 1
status: Draft
priority: 
tags:
  - expense-tracker/features/reports/v1
---

## Field Categories

Each field falls into one of 4 categories based on how it gets its value:

|Category|Meaning|
|---|---|
|**Primary**|Core field stored directly on the `reports` table. User enters manually or via import/API. Always present.|
|**Enriched**|Auto-populated by an enrichment engine. User can also edit manually.|
|**Custom**|Pre-configured dropdown/status fields. User selects a value. Stored in the attribute values system.|
|**AI**|Computed by the AI Calculation Agent or Summarize Agent. Non-editable by users (system-generated).|

---

## Full Field Reference

| Column Name | Field Type | Category | Editable | Required | Description |
| ----------- | ---------- | -------- | -------- | -------- | ----------- |
|             |            |          |          |          |             |

---

## Additional Fields (in code but not in your table)

| Column Name | Field Type | Category | Description |
| ----------- | ---------- | -------- | ----------- |
|             |            |          |             |

---

## How Enrichment Fills Fields


---

## How AI Scores Work
